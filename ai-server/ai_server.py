from flask import Flask, request, jsonify
from medicine_corrector import suggest_medicine_name
from paddleocr import PaddleOCR
from preprocessing import preprocess_image
from llm import structure_prescription
import os
import joblib

# Load the trained model

app = Flask(__name__)
model = joblib.load("prescription_classifier.joblib")

def classify_ocr_lines(texts):
    results = []

    for text in texts:
        if not text.strip():
            continue

        probabilities = model.predict_proba([text])[0]
        best_index = probabilities.argmax()

        category = model.classes_[best_index]
        confidence = float(probabilities[best_index])

        results.append({
            "text": text,
            "category": category,
            "confidence": round(confidence, 4),
            "needs_review": confidence < 0.70
        })

    return results


ocr = PaddleOCR(
    lang="en",
    use_textline_orientation=True,
)


@app.post("/ocr")
def process_ocr():
    file = request.files.get("file")

    if not file:
        return jsonify({
            "message": "No file received"
        }), 400

    # Save the uploaded image
    original_path = "temp_" + file.filename
    file.save(original_path)

    # Create path for processed image
    processed_path = "processed_" + file.filename

    try:
        # 1. OpenCV preprocessing
        preprocess_image(
            original_path,
            processed_path
        )

        # 2. PaddleOCR
        result = ocr.predict(processed_path)

        texts = []

        for res in result:
            texts.extend(res["rec_texts"])

        # 3. Combine OCR text
        ocr_text = "\n".join(texts)
        # 4. Send OCR text to ML model for classification

        classified_lines = classify_ocr_lines(texts)
        def correct_medicine_names(prescription):
            """
            Suggest spelling corrections for medicine names.
            Preserve the original name and flag suggestions for review.
            """
            medicines = prescription.get("medicines", [])

            for medicine in medicines:
                original_name = medicine.get("name")

                if not isinstance(original_name, str) or not original_name.strip():
                    medicine["name_review"] = {
                        "original": original_name,
                        "suggestion": None,
                        "match_type": None,
                        "similarity": 0,
                        "needs_review": True,
                    }
                    continue

                result = suggest_medicine_name(original_name)

                suggestion = result.get("suggestion")

                medicine["name_review"] = {
                    "original": original_name,
                    "suggestion": suggestion,
                    "match_type": result.get("match_type"),
                    "similarity": result.get("similarity", 0),
                    "needs_review": (
                        result.get("needs_review", True)
                        or (
                            suggestion is not None
                            and suggestion.strip().lower() != original_name.strip().lower()
                        )
                    ),
                }

            return prescription
        for item in classified_lines:
            if item["category"] == "medicine":
                item["medicine_correction"] = suggest_medicine_name(item["text"])

        
        print("\n--- ML CLASSIFICATION ---")

        for item in classified_lines:
            print(
                f'{item["text"]} -> '
                f'{item["category"]} '
                f'({item["confidence"]:.2%})'
                f'{" [REVIEW]" if item["needs_review"] else ""}'
            )
        # for item in classified_lines:
        #     print(f'{item["category"]}: {item["text"]}')

        # print("\n--- OCR TEXT ---")
        # print(ocr_text)

        # 4. Send OCR text to Gemini
        structured_data = structure_prescription(ocr_text)

        # Suggest corrections for medicine names
        structured_data = correct_medicine_names(structured_data)

        print("\n--- LLM RESULT WITH MEDICINE SPELLING REVIEW ---")
        print(structured_data)

        # print("\n--- LLM RESULT ---")
        # print(structured_data)

        # 5. Send result back to Express
        return jsonify({
            "ocr_text": texts,
            "classified_lines": classified_lines,
            "prescription": structured_data
        })

    except Exception as error:
        print("Processing error:", error)

        return jsonify({
            "message": "Prescription processing failed",
            "error": str(error)
        }), 500

    finally:
        # Remove temporary files
        if os.path.exists(original_path):
            os.remove(original_path)

        if os.path.exists(processed_path):
            os.remove(processed_path)


if __name__ == "__main__":
    app.run(port=8000)