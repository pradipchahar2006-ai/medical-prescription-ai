// import React from 'react'

// import { ScanText, ShieldCheck,  History, Sparkles,  Upload, Cpu, ListChecks } from "lucide-react";
import  { Upload } from "lucide-react";
import { Link } from 'react-router-dom'

// const FEATURES = [
//     { Icon: ScanText, title: "OCR Text Extraction", desc: "Reads printed and moderately clear handwritten prescriptions using a modular OCR pipeline." },
//     { Icon: Cpu, title: "AI/NLP Understanding", desc: "Structures raw prescription text into patient, doctor and medicine fields — never inventing what isn't there." },
//     { Icon: ListChecks, title: "Structured Medicine Data", desc: "Strength, dosage, frequency, duration, route and instructions, extracted per medicine." },
//     { Icon: History, title: "Prescription History", desc: "Search and revisit every prescription you've processed." },
// ];

const STEPS = [
    { n: "01", title: "Upload", desc: "Upload a photo or PDF of a prescription." },
    { n: "02", title: "AI Processing", desc: "Preprocessing, OCR and NLP extraction run automatically." },
    { n: "03", title: "Review & Save", desc: "Review the structured result, correct anything unclear, and save it." },
];


const Landing = () => {
    return (
        <div>
            
            <section className="mx-auto max-w-7xl px-6 pb-20 pt-14 sm:pt-20">
                <div className="mx-auto max-w-3xl text-center">
                    <span className="badge bg-teal-50 text-teal-700">AI-Powered Prescription Information Extraction</span>
                    <h1 className="mt-5 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
                        Turn a photo of a prescription into structured, searchable data
                    </h1>
                    <p className="mt-5 text-lg leading-relaxed text-slate-600">
                        Upload a doctor's prescription image or PDF. Our OCR + NLP pipeline extracts
                        patient, doctor and medicine details into a clean, editable record — nothing invented, nothing guessed.
                    </p>
                    <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                        <Link to="/Upload" className="flex gap-3 items-center bg-green-700 rounded-xl p-4 px-6 text-white hover:bg-green-800"><Upload className="h-4 w-4" /> Upload a prescription</Link>
                    </div>
                </div>
            </section>

            <section className="border-y border-slate-100 bg-slate-50 py-16">
                <div className="mx-auto max-w-5xl px-6">
                    <h2 className="text-center text-3xl font-bold text-slate-900">How it works</h2>
                    <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-3">
                        {STEPS.map((s) => (
                            <div key={s.n} className="text-center">
                                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-teal-600 text-lg font-bold text-white">{s.n}</div>
                                <h3 className="text-lg font-semibold text-slate-900">{s.title}</h3>
                                <p className="mt-2 text-sm text-slate-500">{s.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* <section className="mx-auto max-w-7xl px-6 py-20">
                <h2 className="text-center text-3xl font-bold text-slate-900">AI features</h2>
                <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {FEATURES.map(({ Icon, title, desc }) => (
                        <div key={title} className="card">
                            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-teal-50 text-teal-600"><Icon className="h-5 w-5" /></div>
                            <h3 className="text-base font-semibold text-slate-900">{title}</h3>
                            <p className="mt-2 text-sm leading-relaxed text-slate-500">{desc}</p>
                        </div>
                    ))}
                </div>
            </section> */}

            {/* <section className="bg-slate-900 py-10">
                <div className="flex  px-16  justify-center">
                    <div>
                        <Sparkles className="h-8 w-8 text-teal-400" />
                        <h2 className="mt-4 text-2xl font-bold text-white">Benefits</h2>
                        <ul className="mt-4 space-y-3 text-sm text-slate-300">
                            <li>• Save prescription details without manual retyping</li>
                            <li>• Quickly search past prescriptions by medicine or doctor</li>
                            <li>• Export a clean PDF summary anytime</li>
                            <li>• Correct any field the AI got wrong, in seconds</li>
                        </ul>
                    </div>
                    
                </div>
            </section> */}

            {/* Medical disclaimer */}
            {/* <section className="mx-auto max-w-4xl px-6 py-16">
                <div className="rounded-xl border border-amber-200 bg-amber-50 p-6 text-center">
                    <ShieldCheck className="mx-auto h-8 w-8 text-amber-600" />
                    <h2 className="mt-3 text-lg font-bold text-amber-900">Medical Disclaimer</h2>
                    <p className="mt-2 text-sm text-amber-800">
                        MediScribe AI is an <strong>information-extraction tool</strong>, not a medical diagnosis or treatment
                        system. It does not diagnose conditions, recommend medicines, or change a doctor's dosage. AI-extracted
                        information should always be verified with a doctor or pharmacist.
                    </p>
                </div>
            </section> */}

        </div>
    )
}

export default Landing