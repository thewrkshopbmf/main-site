#!/usr/bin/env python3
"""
blog_insert.py (date-only validation + diagnostics)

- Validates ONLY that the header date matches the JSON "date".
- Keeps requiring a "title" field (for downstream use) but DOES NOT compare it to header.
- Auto-fixes common body_html issues (unquoted lines, unescaped quotes) and logs "Info: Fixed:".
- Skips overwrite if the target filename already exists; logs an Exists: line.
- Final summary: "Given N files, created M files"

Input formats accepted in ./insert_content/input files:
  NEW (preferred): |<header>|{ ...valid JSON... }
  LEGACY:          *|<header>|{ ...valid JSON... }*

Header format example:
  2025-09-20_wheres-your-light-leading-you

Writes JSON files to ../content/blog/
Logs to ./insert_content/output.txt
"""

import re
import json
import unicodedata
from pathlib import Path
from typing import List, Tuple, Optional

# ---------- Paths (relative to this script) ----------
SCRIPT_PATH = Path(__file__).resolve()
BASE_DIR    = SCRIPT_PATH.parent  # ./insert_content

INPUT_DIR    = BASE_DIR / "input"                       # ./insert_content/input
OUTPUT_FILE  = BASE_DIR / "output.txt"                  # ./insert_content/output.txt
BLOG_DIR     = BASE_DIR.parent / "content" / "blog"     # ../content/blog

# ---------- IO ----------
def read_all_input_text() -> str:
    INPUT_DIR.mkdir(parents=True, exist_ok=True)
    parts: List[str] = []
    for p in sorted(INPUT_DIR.iterdir()):
        if p.is_file() and p.stat().st_size > 0:
            try:
                parts.append(p.read_text(encoding="utf-8"))
            except Exception as e:
                parts.append(f"\n#ERROR_READING_FILE:{p.name}:{e}\n")
    return "\n\n".join(parts)

# ---------- Parser ----------
def find_entries(blob: str) -> List[Tuple[str, str]]:
    """
    Parse entries of the form:
      |<header>|{...balanced JSON object...}
    Also accepts legacy:
      *|<header>|{...}*
    Returns list of (header, json_str).
    """
    entries: List[Tuple[str, str]] = []
    i = 0
    n = len(blob)

    while i < n:
        while i < n and blob[i].isspace():
            i += 1
        if i >= n:
            break

        # optional leading '*'
        if blob[i] == '*':
            i += 1
            while i < n and blob[i].isspace():
                i += 1

        # require leading '|'
        if i >= n or blob[i] != '|':
            next_pipe = blob.find('|', i + 1)
            if next_pipe == -1:
                break
            i = next_pipe
            continue

        # header
        i += 1
        hdr_start = i
        hdr_end = blob.find('|', hdr_start)
        if hdr_end == -1:
            break
        header = blob[hdr_start:hdr_end].strip()
        i = hdr_end + 1

        # to JSON
        while i < n and blob[i].isspace():
            i += 1
        if i >= n or blob[i] != '{':
            i = hdr_end + 1
            continue

        # balanced object scan
        json_start = i
        depth = 0
        in_string = False
        escape = False
        while i < n:
            ch = blob[i]
            if in_string:
                if escape:
                    escape = False
                elif ch == '\\':
                    escape = True
                elif ch == '"':
                    in_string = False
            else:
                if ch == '"':
                    in_string = True
                elif ch == '{':
                    depth += 1
                elif ch == '}':
                    depth -= 1
                    if depth == 0:
                        i += 1  # include closing brace
                        break
            i += 1
        if depth != 0:
            continue

        json_text = blob[json_start:i].strip()

        # optional trailing '*' (legacy)
        j = i
        while j < n and blob[j].isspace():
            j += 1
        if j < n and blob[j] == '*':
            j += 1
        i = j

        if header and json_text:
            entries.append((header, json_text))

    return entries

# ---------- Header & Title Helpers ----------
def split_header(header: str) -> Tuple[str, str]:
    """
    Extract (date, header_title_human) from header like:
      '2025-09-20_wheres-your-light-leading-you'
    Everything after the first underscore is the title slug (dashes/underscores allowed).
    """
    if "_" not in header:
        raise ValueError("Header must contain an underscore separating date and title-slug.")
    date, slug_part = header.split("_", 1)
    human_title = slug_part.replace("_", " ").replace("-", " ").strip()
    return date, human_title

def normalize_title(s: Optional[str]) -> str:
    """
    Retained for potential future use; not used in validation now.
    """
    if not s:
        return ""
    s = unicodedata.normalize("NFKD", s)
    s = "".join(ch for ch in s if not unicodedata.combining(ch))
    s = s.replace("’", "'").replace("‘", "'").replace("“", '"').replace("”", '"')
    s = s.replace("'", "")
    s = s.replace("-", " ").replace("_", " ")
    s = re.sub(r"[^a-zA-Z0-9\s]", " ", s)
    s = s.lower()
    s = re.sub(r"\s+", " ", s).strip()
    return s

def safe_filename_from_header(header: str) -> str:
    """
    Filesystem-safe .json filename based on the header.
    """
    base = header.replace(" ", "_").replace(":", "-").strip()
    base = re.sub(r'[\\/*?\"<>|]', "", base)
    base = re.sub(r'_+', "_", base)
    return f"{base}.json"

# ---------- JSON Error Diagnostics ----------
def json_error_excerpt(text: str, pos: int, window: int = 60) -> str:
    """
    Return a short, single-line excerpt centered on pos with a caret.
    Newlines/tabs are escaped for readability.
    """
    start = max(0, pos - window)
    end   = min(len(text), pos + window)
    frag = text[start:end]
    frag = frag.replace("\n", "\\n").replace("\r", "\\r").replace("\t", "\\t")
    caret = " " * (min(window, pos - start)) + "^"
    return frag + "\n" + caret

# ---------- Auto-fix for common body_html issues ----------
_BH_RE = re.compile(r'"body_html"\s*:\s*\[(.*?)\]', re.DOTALL)

def _try_parse_body_array(inner: str) -> Optional[List[str]]:
    try:
        arr = json.loads("[" + inner + "]")
        return arr if isinstance(arr, list) and all(isinstance(x, str) for x in arr) else None
    except Exception:
        return None

def attempt_fix_body_html(raw_json: str) -> Tuple[str, bool, List[str]]:
    """
    If body_html contains unquoted lines or unescaped double-quotes,
    rebuild it as a JSON string array by quoting each line and escaping as needed.
    Returns (fixed_json, changed?, notes)
    """
    notes: List[str] = []

    def _rebuild(m: re.Match) -> str:
        inner = m.group(1)
        already = _try_parse_body_array(inner)
        if already is not None:
            return m.group(0)  # already valid array of strings

        # Split into lines and convert each to a JSON string item
        lines = inner.splitlines()
        items: List[str] = []
        for line in lines:
            s = line.strip()
            if not s:
                continue
            # strip a trailing comma in the raw line
            if s.endswith(','):
                s = s[:-1].rstrip()
            # ensure it's a JSON string (quote + escape)
            if len(s) >= 2 and s[0] == '"' and s[-1] == '"':
                items.append(s)
            else:
                s = s.replace("\\", "\\\\").replace('"', '\\"')
                items.append(f'"{s}"')
        fixed_inner = ",\n    ".join(items)
        notes.append("Fixed: auto-quoted and escaped body_html lines")
        return '"body_html": [\n    ' + fixed_inner + '\n  ]'

    fixed, nsubs = _BH_RE.subn(_rebuild, raw_json)
    return fixed, (nsubs > 0), notes

# ---------- Validation ----------
def validate_and_merge(header: str, json_str: str) -> Tuple[dict, str, List[str]]:
    """
    Validate JSON and cross-check header vs JSON:
    - Must be an object with at least "date" and "title"
    - Header date must equal JSON date
    - Title is NOT compared to header (only required to exist)
    On parse failure, attempts an auto-fix for body_html then retries.
    Returns (data, error_message_or_empty, notes)
    """
    notes: List[str] = []

    def _parse(s: str) -> dict:
        return json.loads(s)

    try:
        data = _parse(json_str)
    except json.JSONDecodeError as e:
        # try an auto-fix for body_html, then retry
        fixed, changed, fix_notes = attempt_fix_body_html(json_str)
        if changed:
            notes.extend(fix_notes)
            try:
                data = _parse(fixed)
            except json.JSONDecodeError as e2:
                ctx = json_error_excerpt(fixed, e2.pos)
                tips = (
                    "Tips: Make sure each body_html line is a JSON string (wrapped in double quotes), "
                    "escape inner double quotes as \\\" , remove stray backslashes like \\s, "
                    "and ensure commas separate items with no trailing comma after the last item."
                )
                return {}, (f"Invalid JSON even after auto-fix at line {e2.lineno}, column {e2.colno} (char {e2.pos}).\n"
                            f"Context:\n{ctx}\n{tips}"), notes
        else:
            ctx = json_error_excerpt(json_str, e.pos)
            tips = (
                "Tips: Escape inner double quotes as \\\" inside strings; "
                "don’t leave stray backslashes like \\s; ensure each body_html line is quoted and comma-separated."
            )
            return {}, (f"Invalid JSON at line {e.lineno}, column {e.colno} (char {e.pos}).\n"
                        f"Context:\n{ctx}\n{tips}"), notes

    if not isinstance(data, dict):
        return {}, "Top-level JSON must be an object", notes

    missing = [k for k in ("date", "title") if k not in data]
    if missing:
        return {}, f"Missing required field(s): {', '.join(missing)}", notes

    try:
        header_date, _header_title = split_header(header)
    except ValueError as e:
        return {}, f"Bad header format: {e}", notes

    if data.get("date") != header_date:
        return {}, f'Date mismatch: header "{header_date}" vs JSON "{data.get("date")}"', notes

    # NOTE: No title comparison against the header; we just require it exists.
    return data, "", notes

# ---------- Main ----------
def ensure_dirs():
    BLOG_DIR.mkdir(parents=True, exist_ok=True)
    OUTPUT_FILE.parent.mkdir(parents=True, exist_ok=True)

def main():
    ensure_dirs()
    report_lines: List[str] = []
    created_count = 0

    blob = read_all_input_text()

    # file-read issues
    if "#ERROR_READING_FILE:" in blob:
        for line in blob.splitlines():
            if line.startswith("#ERROR_READING_FILE:"):
                report_lines.append(f"Error: {line.replace('#ERROR_READING_FILE:', '')}")

    entries = find_entries(blob)
    if not entries:
        report_lines.append("Error: No properly formatted entries found. Expected |header|{...} blocks.")
        try:
            OUTPUT_FILE.write_text("\n".join(report_lines) + "\n", encoding="utf-8")
            print(f'Wrote report: "{OUTPUT_FILE}"')
        except Exception as e:
            print("Failed to write report:", e)
            print("\n".join(report_lines))
        return

    for header, json_body in entries:
        filename = safe_filename_from_header(header)
        target_path = BLOG_DIR / filename

        data, err, notes = validate_and_merge(header, json_body)
        for n in notes:
            report_lines.append(f'Info: {n} in "{filename}"')

        if err:
            report_lines.append(f'Error: Could not create "{filename}" — {err}')
            continue

        # Exists check (no overwrite)
        if target_path.exists():
            report_lines.append(
                f'Exists: "{filename}" — already present; date="{data.get("date")}", title="{data.get("title")}"'
            )
            continue

        try:
            with target_path.open("w", encoding="utf-8") as f:
                json.dump(data, f, ensure_ascii=False, indent=2)
                f.write("\n")
            report_lines.append(f'Created: "{filename}"')
            created_count += 1
        except Exception as e:
            report_lines.append(f'Error: Failed to write "{filename}" — {e}')

    report_lines.append(f"Given {len(entries)} files, created {created_count} files")
    try:
        OUTPUT_FILE.write_text("\n".join(report_lines) + "\n", encoding="utf-8")
        print(f'Wrote report: "{OUTPUT_FILE}"')
    except Exception as e:
        print("Failed to write report:", e)
        print("\n".join(report_lines))

if __name__ == "__main__":
    main()
