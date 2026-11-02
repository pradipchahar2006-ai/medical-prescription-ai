
import os
import json
from rapidfuzz import process, fuzz

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

with open(
    os.path.join(BASE_DIR, "product_names.json"),
    encoding="utf-8",
) as file:
    product_names = json.load(file)

with open(
    os.path.join(BASE_DIR, "generic_names.json"),
    encoding="utf-8",
) as file:
    generic_names = json.load(file)


def suggest_medicine_name(ocr_text, threshold=80):
    if not isinstance(ocr_text, str) or not ocr_text.strip():
        return {
            "original": ocr_text,
            "suggestion": None,
            "match_type": None,
            "similarity": 0,
            "needs_review": True,
        }

    text = ocr_text.strip()

    product_match = process.extractOne(
        text, product_names, scorer=fuzz.WRatio
    )
    generic_match = process.extractOne(
        text, generic_names, scorer=fuzz.WRatio
    )

    candidates = []

    if product_match:
        candidates.append(
            (product_match[0], product_match[1], "product")
        )

    if generic_match:
        candidates.append(
            (generic_match[0], generic_match[1], "generic")
        )

    if not candidates:
        return {
            "original": text,
            "suggestion": None,
            "match_type": None,
            "similarity": 0,
            "needs_review": True,
        }

    name, score, match_type = max(
        candidates, key=lambda item: item[1]
    )

    score = round(float(score), 1)
    accepted = score >= threshold

    return {
        "original": text,
        "suggestion": name if accepted else None,
        "match_type": match_type if accepted else None,
        "similarity": score,
        "needs_review": not accepted,
    }
