
import { useCallback, useRef, useState } from "react";
import { Upload, FileText, X, Image as ImageIcon } from "lucide-react";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "application/pdf"];
const MAX_SIZE_MB = 10;

export default function FileUploader({ file, onFileSelect, onFileRemove, error }) {
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef(null);

  const validateAndSet = useCallback(
    (selected) => {
      if (!selected) return;
      if (!ALLOWED_TYPES.includes(selected.type)) {
        onFileSelect(null, "Unsupported file type. Please upload a JPG, PNG or PDF.");
        return;
      }
      if (selected.size > MAX_SIZE_MB * 1024 * 1024) {
        onFileSelect(null, `File is too large. Maximum size is ${MAX_SIZE_MB}MB.`);
        return;
      }
      onFileSelect(selected, null);
    },
    [onFileSelect]
  );

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    validateAndSet(e.dataTransfer.files?.[0]);
  };

  const previewUrl = file && file.type !== "application/pdf" ? URL.createObjectURL(file) : null;

  if (file) {
    return (
      <div className="card flex items-center gap-4">
        {previewUrl ? (
          <img src={previewUrl} alt="Preview" className="h-16 w-16 rounded-lg object-cover" />
        ) : (
          <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-teal-50 text-teal-600">
            <FileText className="h-7 w-7" />
          </div>
        )}
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-slate-800">{file.name}</p>
          <p className="text-xs text-slate-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
        </div>
        <button onClick={onFileRemove} className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-red-500">
          <X className="h-5 w-5" />
        </button>
      </div>
    );
  }

  return (
    <div>
      <div
        onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
        onDragLeave={() => setDragActive(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`flex cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed p-12 text-center transition ${
          dragActive ? "border-teal-500 bg-teal-50" : "border-slate-300 bg-white hover:border-teal-300"
        }`}
      >
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-teal-50 text-teal-600">
          <Upload className="h-7 w-7" />
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-800">Drag and drop your prescription here</p>
          <p className="mt-1 text-xs text-slate-500">or click to browse — JPG, PNG or PDF, up to {MAX_SIZE_MB}MB</p>
        </div>
        <div className="flex items-center gap-3 text-slate-300">
          <ImageIcon className="h-4 w-4" /><FileText className="h-4 w-4" />
        </div>
        <input
          ref={inputRef} type="file" className="hidden" 
        //   accept="image/jpeg,image/png,application/pdf"
          accept=".jpg,.jpeg,.png,.pdf"
          onChange={(e) => validateAndSet(e.target.files?.[0])}
        />
      </div>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  );
}



