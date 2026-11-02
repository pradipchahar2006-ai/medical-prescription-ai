const mongoose = require("mongoose");
const medicineSchema = new mongoose.Schema(
  {
    name: { type: String, default: null },
    dosage: { type: String, default: null },
    frequency: { type: String, default: null },
    duration: { type: String, default: null },

    name_review: {
      original: { type: String, default: null },
      suggestion: { type: String, default: null },
      match_type: { type: String, default: null },
      similarity: { type: Number, default: 0 },
      needs_review: { type: Boolean, default: true },
    },
  },
  { _id: false }
);
const prescriptionSchema = new mongoose.Schema(
  {
    patient_name: {
      type: String,
      default: null,
    },

    doctor_name: {
      type: String,
      default: null,
    },

    medicines: {
      type: [medicineSchema],
      default: [],
    },

    instructions: {
      type: [String],
      default: [],
    },

    ocr_text: {
      type: String,
      default: "",
    },
    classified_lines: [
      {
        text: { type: String, default: "" },
        category: { type: String, default: "other" },
        confidence: { type: Number, default: 0 },
        needs_review: { type: Boolean, default: true },
      },
    ],
  },

  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "Prescription",
  prescriptionSchema
);