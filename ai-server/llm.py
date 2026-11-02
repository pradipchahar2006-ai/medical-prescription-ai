import json
import os
from dotenv import load_dotenv
from google import genai

load_dotenv()


client = genai.Client()

# You are processing OCR text from a medical prescription.
# Your task is to correct only obvious spelling or OCR errors in the extracted text.

# Rules:
# 1. Correct obvious spelling mistakes in medicine names, patient names, doctor names, and other words when the intended word is clear from the OCR text.
# 2. Do NOT add new information that is not present in the OCR text.
# 3. Do NOT change the meaning of any text.
# 4. Do NOT expand abbreviations or shorthand.
#    Example: "BD" must remain "BD", NOT "twice daily".
# 5. Do NOT convert or normalize dosage, frequency, duration, or units.
#    Example: "1-0-1" must remain "1-0-1".
# 6. Do NOT convert words into different forms.
#    Example: "5 days" must remain "5 days", not "for 5 days".
# 7. If a word is unclear and you cannot confidently determine the correct spelling, keep the original OCR text.
# 8. Do NOT provide medical advice or interpretation.
# 9. Return ONLY valid JSON.
# 10. Preserve all information from the original OCR text.

# 2.
# Your task is ONLY to organize the information that is actually present
# in the OCR text.

# Do NOT guess or invent:
# - medicine names
# - dosage
# - frequency
# - duration
# - patient information

# If something is unclear, use "uncertain".
# If something is not present, use null.



def structure_prescription(ocr_text):
    prompt = f"""
You are processing OCR text extracted from a medical prescription.
Your task is ONLY to organize the information that is actually present
in the OCR text.

Do NOT guess or invent medicine names

If something is unclear, use "uncertain".
If something is not present, use null.

Return ONLY valid JSON in this format:

{{
    "patient_name": null,
    "doctor_name": null,
    "medicines": [
        {{
            "name": null,
            "dosage": null,
            "frequency": null,
            "duration": null
        }}
    ],
    "instructions": []
}}

OCR TEXT:
{ocr_text}
"""

    response = client.models.generate_content(
        model="gemini-3.5-flash-lite",
        contents=prompt,
        config={
            "response_mime_type": "application/json"
        }
    )

    return json.loads(response.text)