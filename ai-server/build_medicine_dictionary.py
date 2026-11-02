
import os
import re
import json
import pandas as pd

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

DATASET_PATHS = [
    os.path.join(BASE_DIR, "medicine_dataset.csv"),
    os.path.join(BASE_DIR, "medicine_data.csv"),
]

PRODUCT_PATH = os.path.join(BASE_DIR, "product_names.json")
GENERIC_PATH = os.path.join(BASE_DIR, "generic_names.json")

product_names = set()
generic_names = set()

for dataset_path in DATASET_PATHS:
    if not os.path.exists(dataset_path):
        print(f"Skipping missing file: {os.path.basename(dataset_path)}")
        continue

    df = pd.read_csv(dataset_path)
    print(f"Reading: {os.path.basename(dataset_path)}")

    # Support the column names used by both datasets.
    product_column = next(
        (col for col in ["medicine_name", "product_name"]
         if col in df.columns),
        None,
    )

    composition_column = next(
        (col for col in ["composition", "salt_composition"]
         if col in df.columns),
        None,
    )

    # Collect product/brand names.
    if product_column:
        for name in df[product_column].dropna().astype(str):
            name = name.strip()
            if name:
                product_names.add(name)

    # Collect generic ingredient names.
    if composition_column:
        for composition in df[composition_column].dropna().astype(str):
            for ingredient in composition.split("+"):
                # Remove parenthetical strengths, e.g. (500mg).
                ingredient = re.sub(
                    r"\([^)]*\)", "", ingredient
                ).strip()

                if ingredient:
                    generic_names.add(ingredient)

# Sort and save the combined, deduplicated lists.
product_names = sorted(product_names, key=str.casefold)
generic_names = sorted(generic_names, key=str.casefold)

with open(PRODUCT_PATH, "w", encoding="utf-8") as file:
    json.dump(product_names, file, ensure_ascii=False, indent=2)

with open(GENERIC_PATH, "w", encoding="utf-8") as file:
    json.dump(generic_names, file, ensure_ascii=False, indent=2)

print("\nDictionary creation complete!")
print(f"Unique product names: {len(product_names)}")
print(f"Unique generic ingredients: {len(generic_names)}")
