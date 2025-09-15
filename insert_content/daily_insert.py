#!/usr/bin/env python3
"""
daily_insert.py (updated to ignore title matching)

- Validates ONLY that the header date matches the JSON "date".
- No title normalization/comparison; title is still required but not checked against header.
- Skips overwrite if the target filename already exists; logs an Exists: line.
- Final summary: "Given N files, created M files"

Reads entries from ./insert_content/input:
  |<header>|{ ...valid JSON... }
(legacy *|<header>|{...}* also accepted)

Writes JSON files to ../content/daily/
Logs to ./insert_content/output.txt
"""

import re
import json
import unicodedata
from pathlib import Path
from typing import List, Tuple, Optional

# ---------- Paths (relative to script) ----------
SCRIPT_PATH = Path(__file__).resolve()
BASE_DIR    = SCRIPT_PATH.parent

INPUT_DIR    = BASE_DIR / "input"
OUTPUT_FILE  = BASE_DIR / "output.txt"
DAILY_DIR    = BASE_DIR.parent / "content" / "daily"

# ---------- Core parsing ----------
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

def find_entries(blob: str) -> List[Tuple[str, str]]:
    """
    Parse entries of the form:
      |<header>|{...balanced JSON...}
    Also accepts legacy:
      *|<header>|{...}*
    Returns [(header, json_str), ...]
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

        if i >= n or blob[i] != '|':
            nxt = blob.find('|', i + 1)
            if nxt == -1:
                break
            i = nxt
            continue

        # header start
        i += 1
        hdr_start = i
        hdr_end = blob.find('|', hdr_start)
        if hdr_end == -1:
            break
        header = blob[hdr_start:hdr_end].strip()
        i = hdr_end + 1

        while i < n and blob[i].isspace():
            i += 1
        if i >= n or blob[i] != '{':
            i = hdr_end + 1
            continue

        # balanced-brace scan
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
                        i += 1
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

def split_header(header: str) -> Tuple[str, str, str]:
    """
    Expect: YYYY-MM-DD_VerseRef_Title_Tokens...
    Returns (date, verse_ref, human_title_from_header_tokens)
    """
    parts = header.split("_")
    if len(parts) < 3:
        raise ValueError("Header must have at least 3 parts: date, verse_ref, title_slug")
    date = parts[0]
    verse_ref = parts[1]
    header_title_human = " ".join(parts[2:]).strip()
    return date, verse_ref, header_title_human

# ---------- Normalization / filenames ----------
def normalize_title(s: Optional[str]) -> str:
    """
    Kept for potential future use; not used for validation now.
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
    base = header.replace(" ", "_").replace(":", "-").strip()
    base = re.sub(r'[\\/*?\"<>|]', "", base)
    base = re.sub(r'_+', "_", base)
    return f"{base}.json"

# ---------- Validation ----------
def validate_and_merge(header: str, json_str: str) -> Tuple[dict, str]:
    """
    Validates JSON and ensures that the header date equals data['date'].
    Ignores any differences between header title tokens and JSON title.
    """
    try:
        data = json.loads(json_str)
    except json.JSONDecodeError as e:
        return {}, f"Invalid JSON: {e}"

    if not isinstance(data, dict):
        return {}, "Top-level JSON must be an object"

    # Still require 'title' for downstream use, but we won't compare it to header
    missing = [k for k in ("date", "title") if k not in data]
    if missing:
        return {}, f"Missing required field(s): {', '.join(missing)}"

    try:
        header_date, _verse, _header_title = split_header(header)
    except ValueError as e:
        return {}, f"Bad header format: {e}"

    if data.get("date") != header_date:
        return {}, f'Date mismatch: header "{header_date}" vs JSON "{data.get("date")}"'

    # No title check
    return data, ""

# ---------- Main ----------
def ensure_dirs():
    DAILY_DIR.mkdir(parents=True, exist_ok=True)
    OUTPUT_FILE.parent.mkdir(parents=True, exist_ok=True)

def main():
    ensure_dirs()
    report_lines: List[str] = []
    created_count = 0

    blob = read_all_input_text()

    if "#ERROR_READING_FILE:" in blob:
        for line in blob.splitlines():
            if line.startswith("#ERROR_READING_FILE:"):
                report_lines.append(f"Error: {line.replace('#ERROR_READING_FILE:', '')}")

    entries = find_entries(blob)
    if not entries:
        report_lines.append("Error: No properly formatted entries found. Expected |header|{...} blocks.")
        OUTPUT_FILE.write_text("\n".join(report_lines) + "\n", encoding="utf-8")
        return

    for header, json_body in entries:
        filename = safe_filename_from_header(header)
        target_path = DAILY_DIR / filename

        data, err = validate_and_merge(header, json_body)
        if err:
            report_lines.append(f'Error: Could not create "{filename}" — {err}')
            continue

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
    OUTPUT_FILE.write_text("\n".join(report_lines) + "\n", encoding="utf-8")

if __name__ == "__main__":
    main()
