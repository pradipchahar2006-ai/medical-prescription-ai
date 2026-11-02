

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const multer = require("multer");
const axios = require("axios");
const fs = require("fs");
const path = require("path");
const FormData = require("form-data");
const mongoose = require("mongoose");
const Prescription = require("./models/Prescription");

const app = express();
// mongoose
//   .connect(process.env.MONGODB_URI)
//   .then(() => {
//     console.log("MongoDB connected successfully");
//   })
//   .catch((error) => {
//     console.error("MongoDB connection failed:", error.message);
//   });

app.use(cors());
app.use(express.json());

// Ensure the uploads directory exists.
const uploadsDir = path.join(__dirname, "uploads");
fs.mkdirSync(uploadsDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// app.get("/", (req, res) => {
//   res.send("Backend is running");
// });

app.get("/api/prescriptions", async (req, res) => {
  try {
    const prescriptions = await Prescription.find()
      .sort({ createdAt: -1 });

    res.json(prescriptions);

  } catch (error) {
    console.error("Fetch prescriptions error:", error.message);

    res.status(500).json({
      message: "Failed to fetch prescriptions",
    });
  }
});

app.post("/api/prescriptions/upload", upload.single("file"), async (req, res) => {
  console.log("File received:", req.file);

  if (!req.file) {
    return res.status(400).json({
      message: "No file uploaded",
    });
  }

  try {
    const form = new FormData();

    form.append(
      "file",
      fs.createReadStream(req.file.path)
    );

    const response = await axios.post(
      "http://127.0.0.1:8000/ocr",
      form,
      {
        headers: form.getHeaders(),
      }
    );

    const aiResult = response.data;

    const prescriptionData = aiResult.prescription || {};

    // Save extracted prescription fields to MongoDB.
    const savedPrescription = await Prescription.create({
      patient_name: prescriptionData.patient_name ?? null,
      doctor_name: prescriptionData.doctor_name ?? null,
      medicines: prescriptionData.medicines ?? [],
      instructions: prescriptionData.instructions ?? [],
      ocr_text: Array.isArray(aiResult.ocr_text)
        ? aiResult.ocr_text.join("\n")
        : aiResult.ocr_text ?? "",
      classified_lines: aiResult.classified_lines ?? [],
    });



    res.json({
      message: "Prescription processed successfully",
      id: savedPrescription._id,
      ocrText: savedPrescription.ocr_text,
      classified_lines: savedPrescription.classified_lines,
      prescription: {
        patient_name: savedPrescription.patient_name,
        doctor_name: savedPrescription.doctor_name,
        medicines: savedPrescription.medicines,
        instructions: savedPrescription.instructions,
      },
    });

  } catch (error) {
    console.error(
      "Prescription processing error:",
      error.response?.data || error.message
    );

    res.status(500).json({
      message: "Prescription processing failed",
      error: error.response?.data?.error || error.message,
    });
  }
});

// app.listen(5000, () => {
//   console.log("Server running on http://localhost:5000");
// });

async function startServer() {
  try {
    // Connect to MongoDB first
    await mongoose.connect(process.env.MONGODB_URI);

    console.log("MongoDB connected successfully");

    // Start Express only after the database connects
    app.listen(5000, () => {
      console.log("Server running on http://localhost:5000");
    });

  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
}

startServer();

