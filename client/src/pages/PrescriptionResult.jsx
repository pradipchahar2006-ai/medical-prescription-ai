

import { useLocation, useNavigate } from "react-router-dom";
import {
    AlertTriangle,
    CheckCircle,
    FileText,
    BrainCircuit,
} from "lucide-react";

export default function PrescriptionResult() {
    const location = useLocation();
    const navigate = useNavigate();

    const data = location.state?.data;

    if (!data) {
        return (
            <div className="mx-auto max-w-2xl p-6 text-center">
                <h1 className="text-xl font-semibold text-slate-900">
                    No prescription data found
                </h1>

                <button
                    onClick={() => navigate("/upload")}
                    className="mt-4 rounded-xl bg-teal-600 px-5 py-2 text-white"
                >
                    Go to Upload
                </button>
            </div>
        );
    }

    const prescription = data.prescription ?? {};
    const ocrText = data.ocrText ?? data.ocr_text ?? "";
    const classifiedLines =
        data.classified_lines ?? data.classifiedLines ?? [];

    const reviewCount = classifiedLines.filter(
        (item) => item.needs_review
    ).length;

    const formatCategory = (category = "other") =>
        category.replaceAll("_", " ");

    const formatConfidence = (confidence) => {
        if (typeof confidence !== "number") return "Unavailable";

        // Supports either 0–1 probabilities or 0–100 percentages.
        const percentage =
            confidence <= 1 ? confidence * 100 : confidence;

        return `${percentage.toFixed(1)}%`;
    };

    return (
        <main className="mx-auto max-w-4xl space-y-6 p-5">
            {/* Header */}
            <header>
                <h1 className="text-2xl font-bold text-slate-900">
                    Prescription Result
                </h1>
                <p className="mt-1 text-sm text-slate-500">
                    OCR extraction and ML classification results
                </p>
            </header>

            {/* Important medical warning */}
            <div className="flex gap-3 rounded-xl border border-amber-100 bg-amber-50/10 p-4 text-amber-900">
                <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" />
                <div className="text-sm">
                    <p className="font-semibold">Please verify the results</p>
                    <p className="mt-1">
                        OCR and AI can make mistakes. Check medicine names,
                        dosages, and instructions against the original
                        prescription. Do not use these results alone to make
                        treatment decisions.
                    </p>
                </div>
            </div>

            {/* Raw OCR text */}
            <section className="rounded-2xl bg-white p-6 shadow-sm">
                <div className="mb-3 flex items-center gap-2">
                    <FileText className="h-5 w-5 text-teal-600" />
                    <h2 className="text-lg font-semibold text-slate-900">
                        Raw OCR Text
                    </h2>
                </div>

                <pre className="whitespace-pre-wrap break-words rounded-xl bg-slate-50 p-4 text-sm text-slate-700">
                    {ocrText || "No OCR text available"}
                </pre>
            </section>

            {/* ML classification */}
            {/* <section className="rounded-2xl bg-white p-6 shadow-sm">
                <div className="mb-4 flex items-center gap-2">
                    <BrainCircuit className="h-5 w-5 text-teal-600" />
                    <h2 className="text-lg font-semibold text-slate-900">
                        ML Classification
                    </h2>
                </div>

                {classifiedLines.length === 0 ? (
                    <p className="text-sm text-slate-500">
                        No classification results received. Check that your
                        Node backend forwards classified_lines from the
                        Python AI server.
                    </p>
                ) : (
                    <>
                        <div className="mb-4 flex flex-wrap gap-3 text-sm">
                            <span className="rounded-lg bg-slate-100 px-3 py-2">
                                Total lines: {classifiedLines.length}
                            </span>
                            <span className="rounded-lg bg-amber-100 px-3 py-2 text-amber-800">
                                Needs review: {reviewCount}
                            </span>
                        </div>

                        <div className="space-y-3">
                            {classifiedLines.map((item, index) => (
                                <div
                                    key={`${index}-${item.text}`}
                                    className={`rounded-xl border p-4 ${item.needs_review
                                            ? "border-amber-200 bg-amber-50"
                                            : "border-slate-200 bg-white"
                                        }`}
                                >
                                    <div className="flex flex-wrap items-start justify-between gap-3">
                                        <p className="min-w-0 flex-1 break-words text-sm font-medium text-slate-800">
                                            {item.text}
                                        </p>

                                        {item.needs_review ? (
                                            <span className="flex items-center gap-1 text-xs font-semibold text-amber-800">
                                                <AlertTriangle className="h-4 w-4" />
                                                Needs review
                                            </span>
                                        ) : (
                                            <span className="flex items-center gap-1 text-xs font-semibold text-teal-700">
                                                <CheckCircle className="h-4 w-4" />
                                                Higher confidence
                                            </span>
                                        )}
                                    </div>

                                    <div className="mt-3 flex flex-wrap gap-2 text-xs">
                                        <span className="rounded-full bg-teal-100 px-3 py-1 capitalize text-teal-800">
                                            {formatCategory(item.category)}
                                        </span>

                                        <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-700">
                                            Confidence:{" "}
                                            {formatConfidence(item.confidence)}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </section> */}

            {/* Patient information */}
            <section className="rounded-2xl bg-white p-6 shadow-sm">
                <h2 className="mb-4 text-lg font-semibold text-slate-900">
                    Patient Information
                </h2>

                <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                        <p className="text-xs text-slate-500">
                            Patient Name
                        </p>
                        <p className="mt-1 font-medium text-slate-900">
                            {prescription.patient_name || "Not detected"}
                        </p>
                    </div>

                    <div>
                        <p className="text-xs text-slate-500">
                            Doctor Name
                        </p>
                        <p className="mt-1 font-medium text-slate-900">
                            {prescription.doctor_name || "Not detected"}
                        </p>
                    </div>
                </div>
            </section>

            {/* Medicines */}
            <section className="rounded-2xl bg-white p-6 shadow-sm">
                <h2 className="mb-4 text-lg font-semibold text-slate-900">
                    Medicines
                </h2>

                {prescription.medicines?.length > 0 ? (
                    <div className="space-y-4">

                        {prescription.medicines.map((medicine, index) => (
                            <div
                                key={index}
                                className="rounded-xl border border-slate-200 p-4"
                            >
                                {/* Medicine name */}
                                <div className="flex items-center gap-3">
                                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-teal-100 text-sm font-semibold text-teal-700">
                                        {index + 1}
                                    </span>

                                    <h3 className="font-semibold text-slate-900">
                                        {medicine.name || "Uncertain"}
                                    </h3>
                                </div>

                                {/* Dosage, frequency and duration */}
                                <div className="mt-4 grid gap-4 sm:grid-cols-3">
                                    {[
                                        ["Dosage", medicine.dosage],
                                        ["Frequency", medicine.frequency],
                                        ["Duration", medicine.duration],
                                    ].map(([label, value]) => (
                                        value ? (
                                            <div key={label}>
                                                <p className="text-xs text-slate-500">{label}</p>
                                                <p className="mt-1 text-sm text-slate-800">
                                                    {value}
                                                </p>
                                            </div>
                                        ) : null
                                    ))}
                                </div>

                                {/* Medicine spelling review */}
                                {medicine.name_review && (
                                    <div className="mt-4 rounded-lg border border-amber-100 bg-amber-50/10 p-3">
                                        <p className="text-sm font-semibold text-amber-950">
                                            Medicine spelling review
                                        </p>

                                        <p className="mt-1 text-sm text-gray-700">
                                            Original name:{" "}
                                            <span className="font-medium">
                                                {medicine.name_review.original ||
                                                    medicine.name ||
                                                    "Unknown"}
                                            </span>
                                        </p>

                                        {medicine.name_review.suggestion ? (
                                            <>
                                                <p className="mt-1 text-sm text-gray-700">
                                                    Suggested spelling:{" "}
                                                    <span className="font-semibold text-gray-700">
                                                        {medicine.name_review.suggestion}
                                                    </span>
                                                </p>

                                                <p className="mt-1 text-xs text-gray-600">
                                                    Similarity: {medicine.name_review.similarity ?? 0}%
                                                </p>
                                            </>
                                        ) : (
                                            <p className="mt-1 text-sm text-red-900">
                                                No reliable spelling match found.
                                            </p>
                                        )}


                                    </div>
                                )}
                            </div>
                        ))}

                    </div>
                ) : (
                    <p className="text-sm text-slate-500">
                        No medicines were extracted.
                    </p>
                )}
            </section>

            {/* Instructions */}
            {prescription.instructions?.length > 0 && (
                <section className="rounded-2xl bg-white p-6 shadow-sm">
                    <h2 className="mb-4 text-lg font-semibold text-slate-900">
                        Instructions
                    </h2>

                    <div className="space-y-2">
                        {prescription.instructions.map(
                            (instruction, index) => (
                                <p
                                    key={index}
                                    className="rounded-lg bg-slate-50 p-3 text-sm text-slate-700"
                                >
                                    {instruction}
                                </p>
                            )
                        )}
                    </div>
                </section>
            )}

            {/* Upload another */}
            <button
                onClick={() => navigate("/upload")}
                className="w-full rounded-xl bg-teal-600 px-4 py-3 font-medium text-white hover:bg-teal-700"
            >
                Upload Another Prescription
            </button>
        </main>
    );
}
