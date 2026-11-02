# PresExtract AI — 120,000-row Synthetic Starter Dataset

## Contents
- `all_text_lines_120k.csv`: 120,000 synthetic text/label rows.
- `train.csv`: 80% training split.
- `validation.csv`: 10% validation split.
- `test.csv`: 10% test split.
- `structured_examples_1000.jsonl`: 1,000 synthetic structured records for testing the API/JSON pipeline.

## Classification labels
patient_name, patient_age, doctor_name, medicine, strength, dosage, frequency, duration, route, instruction, allergy, date, address.

## Important limitations
- Every record is artificial and generated from templates. No real patient data is included.
- This dataset is for testing code and demonstrating a text classifier. It is NOT a real-world medical dataset and should not be used to claim clinical accuracy.
- Many rows are template variations or repeated patterns; a random split may make evaluation scores look deceptively high.
- This dataset is not an OCR image dataset and cannot fine-tune PaddleOCR. For PaddleOCR fine-tuning, use image crops with exact verified transcriptions in the required PaddleOCR format.
- Medication names and dose-like strings are illustrative placeholders/examples only. Never use generated records to guide treatment.
- In a real system, unclear medicine names, strengths, and dosages must be flagged for qualified human review rather than guessed.
