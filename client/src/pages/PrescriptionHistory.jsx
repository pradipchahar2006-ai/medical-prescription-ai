
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function PrescriptionHistory() {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchPrescriptions = async () => {
      try {
        const { data } = await api.get("/prescriptions");
        setPrescriptions(data);
      } catch (err) {
        console.error("Failed to fetch prescriptions:", err);
        setError("Unable to load prescription history.");
      } finally {
        setLoading(false);
      }
    };

    fetchPrescriptions();
  }, []);

  const openPrescription = (item) => {
    // Support both new records and older records.
    const rawOcrText = item.ocr_text ?? item.ocrText ?? "";

    const ocrText = Array.isArray(rawOcrText)
      ? rawOcrText.join("\n")
      : rawOcrText;

    navigate("/prescription-result", {
      state: {
        data: {
          id: item._id,
          prescription: {
            patient_name: item.patient_name ?? null,
            doctor_name: item.doctor_name ?? null,
            medicines: item.medicines ?? [],
            instructions: item.instructions ?? [],
          },
          ocrText,
          classified_lines:
            item.classified_lines ?? item.classifiedLines ?? [],
        },
      },
    });
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl p-6">
        <p className="text-slate-500">
          Loading prescription history...
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6 p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Prescription History
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            View your previously processed prescriptions.
          </p>
        </div>

        <button
          onClick={() => navigate("/Upload")}
          className="rounded-xl bg-teal-600 px-4 py-2.5 font-medium text-white hover:bg-teal-700"
        >
          Upload Prescription
        </button>
      </div>

      {error && (
        <div className="rounded-xl bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {!error && prescriptions.length === 0 && (
        <div className="rounded-2xl border border-dashed border-slate-300 p-10 text-center">
          <h2 className="font-semibold text-slate-800">
            No prescriptions yet
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            Upload a prescription to see it here.
          </p>
        </div>
      )}

      <div className="space-y-4">
        {prescriptions.map((prescription) => (
          <div
            key={prescription._id}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">
                  {prescription.patient_name ||
                    "Patient not identified"}
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Doctor: {prescription.doctor_name || "Not detected"}
                </p>

                <p className="mt-2 text-sm text-slate-600">
                  {prescription.medicines?.length || 0} medicine entries
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  ML classification lines:{" "}
                  {prescription.classified_lines?.length || 0}
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  {prescription.createdAt
                    ? new Date(
                        prescription.createdAt
                      ).toLocaleString()
                    : "Date unavailable"}
                </p>
              </div>

              <button
                onClick={() => openPrescription(prescription)}
                className="rounded-xl border border-teal-600 px-4 py-2 text-sm font-medium text-teal-700 hover:bg-teal-50"
              >
                View Prescription
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
