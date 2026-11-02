
from pathlib import Path

import joblib
import pandas as pd

from sklearn.pipeline import Pipeline, FeatureUnion
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import classification_report, accuracy_score

BASE_DIR = Path(__file__).resolve().parent
# DATA_DIR = BASE_DIR / "PresExtract_AI_120000_Synthetic_Dataset"
DATA_DIR = BASE_DIR / "PresExtract_AI_120000_Synthetic_Dataset"

TRAIN_PATH = DATA_DIR / "train.csv"
VALIDATION_PATH = DATA_DIR / "validation.csv"
MODEL_PATH = BASE_DIR / "prescription_classifier.joblib"


def load_dataset(path):
    df = pd.read_csv(path)

    # Keep only valid rows
    df = df.dropna(subset=["text", "label"]).copy()
    df["text"] = df["text"].astype(str).str.strip()
    df["label"] = df["label"].astype(str).str.strip()

    df = df[df["text"] != ""]
    return df


print("Loading training data...")
train_df = load_dataset(TRAIN_PATH)

print("Loading validation data...")
validation_df = load_dataset(VALIDATION_PATH)


# Additional examples to improve weak categories.
# These examples are added only to the training data.

extra_examples = [
    # Dates
    ("DOB: 12/26/1998", "date"),
    ("Date of birth: 04/17/2001", "date"),
    ("DOB 1998-12-26", "date"),
    ("Prescription date: 03 March 2026", "date"),

    # Addresses
    ("25 El Caro Street", "address"),
    ("Address: 14 Lake Road", "address"),
    ("House No. 8, Green Street", "address"),
    ("Patient address: 22 Park Avenue", "address"),

    # Medicine
    ("Azithromycin", "medicine"),
    ("Azithromycin oral suspension", "medicine"),
    ("Tablet: Paracetamol", "medicine"),
    ("Capsule: Omeprazole", "medicine"),

    # Strength
    ("200 mg/mL", "strength"),
    ("Strength: 500 mg", "strength"),
    ("250 mg per 5 mL", "strength"),
    ("Each tablet contains 10 mg", "strength"),

    # Dosage
    ("Take 15 mL", "dosage"),
    ("Take one tablet", "dosage"),
    ("Dose: 5 mg", "dosage"),

    # Frequency
    ("Twice daily", "frequency"),
    ("Every 8 hours", "frequency"),
    ("Once a day", "frequency"),

    # Instructions
    ("Take after meals", "instruction"),
    ("Take with water", "instruction"),
    ("Use as directed by the doctor", "instruction"),

    # Route
    ("Apply topically", "route"),
    ("For oral use", "route"),
    ("For external use only", "route"),

    # Other prescription details
    ("Refills: 0", "other"),
    ("Patient ID: 12345", "other"),
    ("Prescription number: RX123", "other"),
    
    # Standalone patient names
    ("Joseph McIntyre", "patient_name"),
    ("Rahul Sharma", "patient_name"),
    ("Amit Kumar", "patient_name"),
    ("Priya Verma", "patient_name"),

    # Standalone address lines
    ("Pleasantville, OH 43320", "address"),
    ("25 El Caro Street", "address"),
    ("12 Park Road", "address"),

    # Standalone dates
    ("March 10, 2009", "date"),
    ("12/26/1998", "date"),
    ("16 October 2026", "date"),

    # Patient age and other measurements
    ("Weight:", "other"),
    ("65 kg", "other"),
    ("Age: 45 years", "patient_age"),

    # Medicine-related lines
    ("Azithromycin 200 mg/mL", "medicine"),
    ("Paracetamol 500 mg", "medicine"),

    # Dosage and duration patterns
    ("Day 1: 15 mL", "dosage"),
    ("Day 2: 7.5 mL", "dosage"),
    ("For 5 days", "duration"),
    ("Twice daily", "frequency"),

    # Instruction examples
    ("Take after meals", "instruction"),
    ("Take with water", "instruction"),
    # Clear instructions
    ("Take after meals", "instruction"),
    ("Take before meals", "instruction"),
    ("Take with food", "instruction"),
    ("Take with water", "instruction"),
    ("Shake well before use", "instruction"),
    ("Do not crush or chew", "instruction"),
    ("Keep out of reach of children", "instruction"),
    ("Use as directed by your doctor", "instruction"),

    # Clear frequency patterns
    ("Once daily", "frequency"),
    ("Twice daily", "frequency"),
    ("Three times daily", "frequency"),
    ("Every 8 hours", "frequency"),
    ("At bedtime", "frequency"),

    # Medicine name and strength: label policy for line classification
    ("Azithromycin", "medicine"),
    ("Azithromycin 200 mg/mL", "medicine"),
    ("Paracetamol", "medicine"),
    ("Paracetamol 500 mg", "medicine"),

    # Strength-only lines
    ("200 mg/mL", "strength"),
    ("500 mg", "strength"),
    ("250 mg per 5 mL", "strength"),
    ("Strength: 500 mg", "strength"),

]

extra_df = pd.DataFrame(
    extra_examples,
    columns=["text", "label"]
)

train_df = pd.concat(
    [train_df, extra_df],
    ignore_index=True
)


X_train = train_df["text"]
y_train = train_df["label"]

X_val = validation_df["text"]
y_val = validation_df["label"]

print(f"Training rows: {len(train_df)}")
print(f"Validation rows: {len(validation_df)}")
print(f"Categories: {sorted(y_train.unique())}")

model = Pipeline([
    (
        "features",
        FeatureUnion([
            (
                "word_features",
                TfidfVectorizer(
                    lowercase=True,
                    ngram_range=(1, 2),
                    sublinear_tf=True
                )
            ),
            (
                "character_features",
                TfidfVectorizer(
                    analyzer="char_wb",
                    ngram_range=(3, 5),
                    min_df=2,
                    sublinear_tf=True
                )
            )
        ])
    ),
    (
        "classifier",
        LogisticRegression(
            max_iter=2000,
            class_weight="balanced",
            random_state=42
        )
    )
])

print("\nTraining model...")
model.fit(X_train, y_train)

print("Training completed!")

print("\n--- VALIDATION RESULTS ---")

predictions = model.predict(X_val)

print("Validation accuracy:",
      round(accuracy_score(y_val, predictions), 4))

print(
    classification_report(
        y_val,
        predictions,
        zero_division=0
    )
)

joblib.dump(model, MODEL_PATH)

print(f"\nModel saved to: {MODEL_PATH}")

test_lines = [
    "Patient is 45 years old",
    "Doctor name: Dr Sharma",
    "Rx: Calcium supplement",
    "Strength: 500 mg",
    "Take twice daily",
    "Continue for 7 days",
    "Apply topically",
    "Allergy: aspirin",
    "Prescription date: 03 March 2026",
    "25 Park Road"
]

print("\n--- SAMPLE PREDICTIONS ---")

for line in test_lines:
    label = model.predict([line])[0]
    print(f"{line} -> {label}")
