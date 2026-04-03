import { Upload, FileImage, X } from 'lucide-react';
import { useState, useRef } from 'react';

export default function UploadBox({ onFileSelect }) {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const inputRef = useRef(null);

  const handleFile = (f) => {
    if (!f) return;
    setFile(f);
    if (f.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => setPreview(e.target.result);
      reader.readAsDataURL(f);
    } else {
      setPreview(null);
    }
    onFileSelect?.(f);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const f = e.dataTransfer.files[0];
    handleFile(f);
  };

  const clearFile = () => {
    setFile(null);
    setPreview(null);
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <div
      className="relative border-2 border-dashed border-primary-300 rounded-2xl p-8 text-center transition-all hover:border-primary-500 hover:bg-primary-50/30 cursor-pointer"
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
      onClick={() => inputRef.current?.click()}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/*,.pdf"
        className="hidden"
        onChange={(e) => handleFile(e.target.files[0])}
      />

      {file ? (
        <div className="space-y-3">
          {preview && <img src={preview} alt="Soil report preview" className="max-h-40 mx-auto rounded-xl shadow-md" />}
          <div className="flex items-center justify-center gap-2 text-primary-800 font-medium">
            <FileImage className="w-5 h-5" />
            <span className="truncate max-w-[200px]">{file.name}</span>
            <button onClick={(e) => { e.stopPropagation(); clearFile(); }} className="p-1 hover:bg-red-100 rounded-full">
              <X className="w-4 h-4 text-red-500" />
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="w-16 h-16 mx-auto bg-primary-100 rounded-2xl flex items-center justify-center">
            <Upload className="w-8 h-8 text-primary-600" />
          </div>
          <div>
            <p className="text-gray-700 font-semibold">Soil Report Upload Karein</p>
            <p className="text-sm text-gray-500">PDF ya Image (JPG, PNG) — Max 10MB</p>
          </div>
        </div>
      )}
    </div>
  );
}
