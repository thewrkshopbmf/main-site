#!/usr/bin/env python3
"""
daily_insert.py (with duplicate check by verse_ref + title edges)

- Validates ONLY that the header date matches the JSON "date".
- Skips overwrite if the target filename already exists; logs an Exists: line.
- NEW: Skips creation if an entry with the SAME scripture (verse_ref) AND
       matching first/last N words of the title already exists (on disk or
       earlier in this batch). Logs as Duplicate: ...
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
from typing import List, Tuple, Optional, Dict, Set

# ---------- Tunables ----------
FRONT_N = 3   # number of words from the start of the title to compare
BACK_N  = 3   # number of words from the end of the title to compare

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
        if j < n and j >= 0 and blob[j] == '*':
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

# ---------- Normalization / helpers ----------
_WORD_RE = re.compile(r"[A-Za-z0-9]+")

def normalize_text_basic(s: str) -> str:
    """Lowercase, strip accents and unify quotes/dashes."""
    s = unicodedata.normalize("NFKD", s or "")
    s = "".join(ch for ch in s if not unicodedata.combining(ch))
    s = s.replace("’", "'").replace("‘", "'").replace("“", '"').replace("”", '"')
    s = s.replace("–", "-").replace("—", "-").replace("·", " ")
    return s.lower().strip()

def verse_key(s: Optional[str]) -> str:
    """Compact the verse ref for matching (e.g., '2 corinthians 5:7')."""
    if not s:
        return ""
    s = normalize_text_basic(s)
    # remove periods and extra spaces, collapse whitespace
    s = s.replace(".", " ")
    s = re.sub(r"\s+", " ", s)
    return s

def title_edges(title: str, n_front: int = FRONT_N, n_back: int = BACK_N) -> Tuple[str, str]:
    s = normalize_text_basic(title or "")
    tokens = _WORD_RE.findall(s)
    if not tokens:
        return "", ""
    front = " ".join(tokens[:max(0, n_front)]) if n_front > 0 else ""
    back  = " ".join(tokens[-max(0, n_back):]) if n_back > 0 else ""
    return front, back

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

    # Require 'date' and 'title' (title needed for duplicate checks)
    missing = [k for k in ("date", "title") if k not in data]
    if missing:
        return {}, f"Missing required field(s): {', '.join(missing)}"

    try:
        header_date, _verse_from_header, _header_title = split_header(header)
    except ValueError as e:
        return {}, f"Bad header format: {e}"

    if data.get("date") != header_date:
        return {}, f'Date mismatch: header "{header_date}" vs JSON "{data.get("date")}"'

    return data, ""

# ---------- Duplicate index ----------
def build_existing_index() -> Dict[str, Set[Tuple[str, str]]]:
    """
    Scan DAILY_DIR for existing entries and index by:
      verse_key -> set of (front_edge, back_edge)
    Only indexes files that have both 'title' and 'verse_ref'.
    """
    index: Dict[str, Set[Tuple[str, str]]] = {}
    if not DAILY_DIR.exists():
        return index

    for p in DAILY_DIR.glob("*.json"):
        try:
            obj = json.loads(p.read_text(encoding="utf-8"))
        except Exception:
            continue
        if not isinstance(obj, dict):
            continue

        vref = obj.get("verse_ref") or ""
        ttl  = obj.get("title") or ""
        if not vref or not ttl:
            continue

        key = verse_key(vref)
        front, back = title_edges(ttl)
        if key and (front or back):
            index.setdefault(key, set()).add((front, back))
    return index

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

    # Load existing duplicates index from disk
    dup_index = build_existing_index()

    # Track duplicates within this batch (so we don't create two near-identical files)
    batch_seen: Dict[str, Set[Tuple[str, str]]] = {}

    for header, json_body in entries:
        filename = safe_filename_from_header(header)
        target_path = DAILY_DIR / filename

        data, err = validate_and_merge(header, json_body)
        if err:
            report_lines.append(f'Error: Could not create "{filename}" — {err}')
            continue

        # Quick exists check by filename
        if target_path.exists():
            report_lines.append(
                f'Exists: "{filename}" — already present; date="{data.get("date")}", title="{data.get("title")}"'
            )
            continue

        # ------- Duplicate check by verse_ref + title edges -------
        # Prefer JSON verse_ref; if missing, fall back to verse from header.
        try:
            _hdr_date, hdr_verse_ref, _ = split_header(header)
        except Exception:
            hdr_verse_ref = ""

        vref_raw = (data.get("verse_ref") or hdr_verse_ref or "").strip()
        vkey = verse_key(vref_raw)
        front, back = title_edges(data.get("title", ""))

        is_duplicate = False
        if vkey:
            # Check against on-disk index
            if (front, back) in dup_index.get(vkey, set()):
                is_duplicate = True
            # Check within-batch duplicates too
            elif (front, back) in batch_seen.get(vkey, set()):
                is_duplicate = True

        if is_duplicate:
            report_lines.append(
                f'Duplicate: "{filename}" — verse_ref="{vref_raw}" matches existing title edges '
                f'(front="{front}", back="{back}")'
            )
            continue

        # Write the file
        try:
            with target_path.open("w", encoding="utf-8") as f:
                json.dump(data, f, ensure_ascii=False, indent=2)
                f.write("\n")
            report_lines.append(f'Created: "{filename}"')
            created_count += 1

            # Update indices after successful create
            if vkey:
                dup_index.setdefault(vkey, set()).add((front, back))
                batch_seen.setdefault(vkey, set()).add((front, back))
        except Exception as e:
            report_lines.append(f'Error: Failed to write "{filename}" — {e}')

    report_lines.append(f"Given {len(entries)} files, created {created_count} files")
    OUTPUT_FILE.write_text("\n".join(report_lines) + "\n", encoding="utf-8")

if __name__ == "__main__":
    main()
