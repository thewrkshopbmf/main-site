#!/usr/bin/env python3
"""
daily_insert.py

Supports both:
1. Legacy daily JSON (verse_ref / verse_text / insight / declaration / one_minute_win)
2. New flexible section-based daily JSON using:
   - scriptures: [{ ref, text }]
   - sections: [{ key, label, blocks: [...] }]

Input format:
  |<header>|{ ...valid JSON... }
or legacy:
  *|<header>|{ ...valid JSON... }*

Header format:
  YYYY-MM-DD_VerseRef_Title_Tokens...

Examples:
  2026-03-24_ephesians-2-10_built-to-be-poured-out
  2026-03-25_isaiah-58-10_built-to-build-others

Behavior:
- Validates ONLY that the header date matches JSON "date".
- Does NOT require the JSON title to match the header title slug.
- Auto-normalizes:
    * one-minute_win -> one_minute_win
    * scriptures -> verse_ref / verse_text fallback
    * simple section forms into normalized blocks
- Skips overwrite if filename already exists.
- Skips near-duplicate creation based on verse_ref + title edges.
- Final summary: "Given N files, created M files"
"""

import re
import json
import unicodedata
from pathlib import Path
from typing import List, Tuple, Optional, Dict, Set, Any

FRONT_N = 3
BACK_N = 3

SCRIPT_PATH = Path(__file__).resolve()
BASE_DIR = SCRIPT_PATH.parent

INPUT_DIR = BASE_DIR / "input"
OUTPUT_FILE = BASE_DIR / "output.txt"
DAILY_DIR = BASE_DIR.parent / "content" / "daily"

_WORD_RE = re.compile(r"[A-Za-z0-9]+")

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
    entries: List[Tuple[str, str]] = []
    i = 0
    n = len(blob)

    while i < n:
        while i < n and blob[i].isspace():
            i += 1
        if i >= n:
            break

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
    parts = header.split("_")
    if len(parts) < 3:
        raise ValueError("Header must have at least 3 parts: date, verse_ref, title_slug")
    date = parts[0]
    verse_ref = parts[1]
    title_human = " ".join(parts[2:]).strip()
    return date, verse_ref, title_human

def normalize_text_basic(s: str) -> str:
    s = unicodedata.normalize("NFKD", s or "")
    s = "".join(ch for ch in s if not unicodedata.combining(ch))
    s = s.replace("’", "'").replace("‘", "'").replace("“", '"').replace("”", '"')
    s = s.replace("–", "-").replace("—", "-").replace("·", " ")
    return s.lower().strip()

def clean_string(value: Any) -> str:
    return value.strip() if isinstance(value, str) else ""

def verse_key(s: Optional[str]) -> str:
    if not s:
        return ""
    s = normalize_text_basic(s)
    s = s.replace(".", " ")
    s = re.sub(r"\s+", " ", s)
    return s

def title_edges(title: str, n_front: int = FRONT_N, n_back: int = BACK_N) -> Tuple[str, str]:
    s = normalize_text_basic(title or "")
    tokens = _WORD_RE.findall(s)
    if not tokens:
        return "", ""
    front = " ".join(tokens[:max(0, n_front)]) if n_front > 0 else ""
    back = " ".join(tokens[-max(0, n_back):]) if n_back > 0 else ""
    return front, back

def safe_filename_from_header(header: str) -> str:
    base = header.replace(" ", "_").replace(":", "-").strip()
    base = re.sub(r'[\\/*?\"<>|]', "", base)
    base = re.sub(r'_+', "_", base)
    return f"{base}.json"

def title_case_from_key(key: str) -> str:
    key = re.sub(r"[_-]+", " ", key or "").strip()
    return " ".join(word.capitalize() for word in key.split()) if key else "Section"

def normalize_string_array(value: Any) -> List[str]:
    if isinstance(value, list):
      return [clean_string(v) for v in value if clean_string(v)]

    if isinstance(value, str):
        return [part.strip() for part in re.split(r"\n\s*\n", value) if part.strip()]

    return []

def normalize_scriptures(data: dict) -> List[dict]:
    out: List[dict] = []

    if isinstance(data.get("scriptures"), list):
        for item in data["scriptures"]:
            if not isinstance(item, dict):
                continue
            ref = clean_string(item.get("ref") or item.get("verse_ref"))
            text = clean_string(item.get("text") or item.get("verse_text"))
            if ref or text:
                out.append({"ref": ref, "text": text})

    if not out:
        ref = clean_string(data.get("verse_ref"))
        text = clean_string(data.get("verse_text"))
        if ref or text:
            out.append({"ref": ref, "text": text})

    return out

def normalize_block(block: Any) -> Optional[dict]:
    if isinstance(block, str):
        text = clean_string(block)
        return {"type": "paragraph", "text": text} if text else None

    if not isinstance(block, dict):
        return None

    block_type = clean_string(block.get("type") or "paragraph").lower()

    if block_type in ("paragraph", "callout", "quote"):
        text = clean_string(block.get("text"))
        if not text:
            return None
        out = {"type": block_type, "text": text}
        prefix = clean_string(block.get("prefix"))
        if prefix:
            out["prefix"] = prefix
        return out

    if block_type in ("lines", "bullet_list", "numbered_list"):
        items = normalize_string_array(block.get("items") or block.get("content") or block.get("text"))
        if not items:
            return None
        return {"type": block_type, "items": items}

    return None

def normalize_section(section: Any) -> Optional[dict]:
    if not isinstance(section, dict):
        return None

    key = clean_string(section.get("key")).lower()
    label = clean_string(section.get("label")) or title_case_from_key(key or "section")

    blocks_src = section.get("blocks")
    if not isinstance(blocks_src, list):
        if "items" in section:
            style = clean_string(section.get("style") or "bullet_list").lower()
            block_type = "numbered_list" if style == "numbered_list" else "bullet_list"
            blocks_src = [{"type": block_type, "items": section.get("items")}]
        elif "content" in section:
            content = section.get("content")
            if isinstance(content, list):
                blocks_src = [{"type": "paragraph", "text": item} for item in content]
            else:
                blocks_src = [{"type": clean_string(section.get("style") or "paragraph"), "text": content}]
        elif "text" in section:
            blocks_src = [{"type": clean_string(section.get("style") or "paragraph"), "text": section.get("text")}]
        else:
            blocks_src = []

    blocks = [normalize_block(b) for b in blocks_src]
    blocks = [b for b in blocks if b]

    if not blocks:
        return None

    return {
        "key": key,
        "label": label,
        "blocks": blocks
    }

def normalize_entry_for_storage(data: dict, header: str) -> dict:
    data = dict(data)

    if "one-minute_win" in data and "one_minute_win" not in data:
        data["one_minute_win"] = data["one-minute_win"]

    scriptures = normalize_scriptures(data)
    if scriptures:
        data["scriptures"] = scriptures
        if not clean_string(data.get("verse_ref")):
            data["verse_ref"] = scriptures[0]["ref"]
        if not clean_string(data.get("verse_text")):
            data["verse_text"] = scriptures[0]["text"]

    if isinstance(data.get("sections"), list):
        sections = [normalize_section(s) for s in data["sections"]]
        data["sections"] = [s for s in sections if s]

    try:
        _, header_verse_ref, _ = split_header(header)
    except Exception:
        header_verse_ref = ""

    if not clean_string(data.get("verse_ref")) and header_verse_ref:
        data["verse_ref"] = header_verse_ref

    return data

def validate_and_merge(header: str, json_str: str) -> Tuple[dict, str]:
    try:
        data = json.loads(json_str)
    except json.JSONDecodeError as e:
        return {}, f"Invalid JSON: {e}"

    if not isinstance(data, dict):
        return {}, "Top-level JSON must be an object"

    missing = [k for k in ("date", "title") if k not in data]
    if missing:
        return {}, f"Missing required field(s): {', '.join(missing)}"

    try:
        header_date, _, _ = split_header(header)
    except ValueError as e:
        return {}, f"Bad header format: {e}"

    if data.get("date") != header_date:
        return {}, f'Date mismatch: header "{header_date}" vs JSON "{data.get("date")}"'

    data = normalize_entry_for_storage(data, header)

    has_legacy_content = any(
        clean_string(data.get(k))
        for k in (
            "insight",
            "body",
            "declaration",
            "one_minute_win",
            "action_step",
            "read_this_out_loud",
            "shift",
            "truth",
            "jesus_set_the_pattern",
            "one_sentence_to_carry"
        )
    )

    has_sections = isinstance(data.get("sections"), list) and len(data["sections"]) > 0
    has_scripture = clean_string(data.get("verse_ref")) or (
        isinstance(data.get("scriptures"), list) and len(data["scriptures"]) > 0
    )

    if not has_scripture:
        return {}, 'Missing scripture data. Provide "verse_ref"/"verse_text" or "scriptures".'

    if not has_legacy_content and not has_sections:
        return {}, 'Missing devotional content. Provide legacy fields or a "sections" array.'

    return data, ""

def extract_primary_verse_ref(data: dict, header: str) -> str:
    vref = clean_string(data.get("verse_ref"))
    if vref:
        return vref

    scriptures = data.get("scriptures")
    if isinstance(scriptures, list) and scriptures:
        first = scriptures[0]
        if isinstance(first, dict):
            vref = clean_string(first.get("ref") or first.get("verse_ref"))
            if vref:
                return vref

    try:
        _, header_verse_ref, _ = split_header(header)
        return clean_string(header_verse_ref)
    except Exception:
        return ""

def build_existing_index() -> Dict[str, Set[Tuple[str, str]]]:
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

        vref = extract_primary_verse_ref(obj, p.stem)
        ttl = obj.get("title") or ""
        if not vref or not ttl:
            continue

        key = verse_key(vref)
        front, back = title_edges(ttl)
        if key and (front or back):
            index.setdefault(key, set()).add((front, back))

    return index

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

    dup_index = build_existing_index()
    batch_seen: Dict[str, Set[Tuple[str, str]]] = {}

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

        vref_raw = extract_primary_verse_ref(data, header)
        vkey = verse_key(vref_raw)
        front, back = title_edges(data.get("title", ""))

        is_duplicate = False
        if vkey:
            if (front, back) in dup_index.get(vkey, set()):
                is_duplicate = True
            elif (front, back) in batch_seen.get(vkey, set()):
                is_duplicate = True

        if is_duplicate:
            report_lines.append(
                f'Duplicate: "{filename}" — verse_ref="{vref_raw}" matches existing title edges '
                f'(front="{front}", back="{back}")'
            )
            continue

        try:
            with target_path.open("w", encoding="utf-8") as f:
                json.dump(data, f, ensure_ascii=False, indent=2)
                f.write("\n")
            report_lines.append(f'Created: "{filename}"')
            created_count += 1

            if vkey:
                dup_index.setdefault(vkey, set()).add((front, back))
                batch_seen.setdefault(vkey, set()).add((front, back))
        except Exception as e:
            report_lines.append(f'Error: Failed to write "{filename}" — {e}')

    report_lines.append(f"Given {len(entries)} files, created {created_count} files")
    OUTPUT_FILE.write_text("\n".join(report_lines) + "\n", encoding="utf-8")

if __name__ == "__main__":
    main()