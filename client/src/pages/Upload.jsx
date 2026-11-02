
import { useState } from "react";
import { AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { FileUp } from "lucide-react";

import api from "../services/api";
import FileUploader from "../components/FileUploader";

export default function UploadPrescription() {

  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [fileError, setFileError] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [apiError, setApiError] = useState("");
  const [datas, setDatas] = useState("");

  const handleSelect = (selected, err) => {
    setFile(selected);
    setFileError(err);
    setApiError("");
  };

  const handleUploadAndProcess = async () => {
    if (!file) return;

    setUploading(true);
    setProgress(0);
    setApiError("");

    try {
      const formData = new FormData();
      formData.append("file", file);

      //  await new Promise((resolve) => {
      //     setTimeout(resolve, 5000);
      //   });

      const { data } = await api.post(
        "/prescriptions/upload",
        formData,
        {

          // onUploadProgress: async (event) => {
          //   if (event.total) {
          //     const percentage = Math.round(
          //       (event.loaded * 100) / event.total
          //     );

          //     setProgress(percentage);
          //   }
          // },
        }
      );
      setDatas(data);
      setUploading(false);
      navigate("/prescription-result", {
        state: {
          data: data,
        },
      });

      // Go to processing page after successful upload
    } catch (error) {
      // <p>error</p>
      console.error("Upload error:", error);

      setApiError(
        error.response?.data?.message ||
        "Upload failed. Please try again."
      );

      setUploading(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6 mt-6">

      {/* Page heading */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Upload Prescription
          </h1>
          <p className="text-sm text-slate-500">
            Upload a clear photo or PDF of the prescription
          </p>
        </div>

        <button
          onClick={() => navigate("/prescription-history")}
          className="rounded-xl border border-teal-600 px-4 py-2.5 font-medium text-teal-700 hover:bg-teal-50"
        >
          Prescription History
        </button>
      </div>

      {
        apiError &&
        <div className="flex items-start gap-2 rounded-lg bg-red-50 px-3 py-2.5 text-sm text-red-700">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{apiError}</span>
        </div>
      }

      {/* File selection */}
      <FileUploader
        file={file}
        onFileSelect={handleSelect}
        onFileRemove={() => {
          setFile(null);
          setFileError(null);
          setApiError("");
        }}
        error={fileError}
      />

      {/* Upload progress */}
      {/* {uploading && (
        <div className="card">
          <div className="mb-1 flex justify-between text-xs text-slate-500">
            <span>Uploading...</span>
            <span>{progress}%</span>
          </div>

          <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-teal-600 transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )} */}

      {/* Upload button */}
      <button
        className="bg-green-100 hover:bg-green-200 flex w-full items-center p-3 rounded-2xl justify-center gap-2"
        onClick={handleUploadAndProcess}
        disabled={!file || uploading}
      >
        <FileUp className="h-4 w-4" />

        {uploading
          ? "Uploading..."
          : "Process Prescription"}
      </button>

      {/* Disclaimer */}
      <p className="text-center text-xs text-slate-400">
        By uploading, you confirm this system will only extract
        information present in the document — it will not diagnose
        or recommend treatment.
      </p>

      {/* {datas && (
        <div className="card space-y-6">
          
          <div>
            <h2 className="text-xl font-semibold text-slate-900">
              Prescription Result
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Extracted information from the uploaded prescription
            </p>
          </div>

          <div className="rounded-xl bg-slate-50 p-4">
            <h3 className="mb-3 text-sm font-semibold text-slate-700">
              Patient Information
            </h3>

            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <p className="text-xs text-slate-500">Patient Name</p>
                <p className="font-medium text-slate-900">
                  {datas.prescription?.patient_name || "Not detected"}
                </p>
              </div>

              <div>
                <p className="text-xs text-slate-500">Doctor Name</p>
                <p className="font-medium text-slate-900">
                  {datas.prescription?.doctor_name || "Not detected"}
                </p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold text-slate-700">
              Medicines
            </h3>

            <div className="space-y-3">
              {datas.prescription?.medicines?.length > 0 ? (
                datas.prescription.medicines.map((medicine, index) => (
                  <div
                    key={index}
                    className="rounded-xl border border-slate-200 p-4"
                  >
                    <div className="mb-3 flex items-center gap-2">
                      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-teal-100 text-sm font-semibold text-teal-700">
                        {index + 1}
                      </span>

                      <h4 className="font-semibold text-slate-900">
                        {medicine.name || "Uncertain"}
                      </h4>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-3">
                      <div>
                        <p className="text-xs text-slate-500">Dosage</p>
                        <p className="text-sm text-slate-800">
                          {medicine.dosage || "—"}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-slate-500">Frequency</p>
                        <p className="text-sm text-slate-800">
                          {medicine.frequency || "—"}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-slate-500">Duration</p>
                        <p className="text-sm text-slate-800">
                          {medicine.duration || "—"}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-slate-500">
                  No medicines detected.
                </p>
              )}
            </div>
          </div>

          {datas.prescription?.instructions?.length > 0 && (
            <div>
              <h3 className="mb-3 text-sm font-semibold text-slate-700">
                Instructions
              </h3>

              <ul className="space-y-2">
                {datas.prescription.instructions.map((instruction, index) => (
                  <li
                    key={index}
                    className="rounded-lg bg-slate-50 px-3 py-2 text-sm text-slate-700"
                  >
                    {instruction}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="rounded-xl bg-amber-50 p-4 text-sm text-amber-700">
            <p className="font-semibold">Important</p>
            <p className="mt-1">
              This information is extracted from the uploaded prescription.
              Some handwritten text may be uncertain. Please verify the
              prescription with the original document or a healthcare
              professional.
            </p>
          </div>
        </div>
      )} */}

    </div>
  );
}