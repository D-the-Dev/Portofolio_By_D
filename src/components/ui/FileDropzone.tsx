import React, { useRef, useState } from 'react';
import { UploadCloud, FileText, X, CheckCircle2, AlertCircle } from 'lucide-react';

export interface FileDropzoneProps {
  label?: string;
  accept?: string;
  maxSizeMB?: number;
  currentFileUrl?: string | null;
  onFileSelect: (file: File) => void;
  onClear?: () => void;
  helperText?: string;
  disabled?: boolean;
}

export const FileDropzone: React.FC<FileDropzoneProps> = ({
  label,
  accept = 'image/*,application/pdf',
  maxSizeMB = 5,
  currentFileUrl,
  onFileSelect,
  onClear,
  helperText = 'Format: .webp, .png, .jpg atau .pdf (Maks 5MB)',
  disabled = false,
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];
    setError(null);

    if (file.size > maxSizeMB * 1024 * 1024) {
      setError(`Ukuran berkas melebihi batas ${maxSizeMB}MB.`);
      return;
    }

    setSelectedFileName(file.name);
    onFileSelect(file);

    if (file.type.startsWith('image/')) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    } else {
      setPreviewUrl(null);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (!disabled) handleFiles(e.dataTransfer.files);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedFileName(null);
    setPreviewUrl(null);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (onClear) onClear();
  };

  const activeDisplayUrl = previewUrl || currentFileUrl;
  const isImage = activeDisplayUrl && (
    previewUrl?.startsWith('blob:') ||
    activeDisplayUrl.match(/\.(jpeg|jpg|gif|png|webp)($|\?)/i) ||
    activeDisplayUrl.startsWith('data:image/')
  );

  return (
    <div className="w-full space-y-1.5 text-left">
      {label && (
        <label className="block text-xs font-mono font-medium text-gray-300">
          {label}
        </label>
      )}

      <div
        onClick={() => !disabled && fileInputRef.current?.click()}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-all duration-200 group
          ${isDragOver ? 'border-emerald-500 bg-emerald-500/10' : 'border-[#1F2924] hover:border-emerald-500/40 bg-[#050505]'}
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          className="hidden"
          disabled={disabled}
          onChange={(e) => handleFiles(e.target.files)}
        />

        {activeDisplayUrl && isImage ? (
          <div className="relative flex flex-col items-center">
            <div className="relative w-full h-36 rounded-lg overflow-hidden border border-[#1F2924] bg-black/40 mb-2">
              <img
                src={activeDisplayUrl}
                alt="File Preview"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-xs text-white font-mono">
                Klik untuk mengganti gambar
              </div>
            </div>
            <div className="flex items-center justify-between w-full text-xs">
              <span className="text-emerald-400 font-mono truncate max-w-[200px]">
                {selectedFileName || 'Berkas aktif terpasang'}
              </span>
              <button
                type="button"
                onClick={handleClear}
                className="text-red-400 hover:text-red-300 p-1 rounded hover:bg-red-500/10"
                title="Hapus berkas"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : activeDisplayUrl || selectedFileName ? (
          <div className="flex items-center justify-between p-3 rounded-lg bg-[#0F1412] border border-[#1F2924]">
            <div className="flex items-center gap-2.5 truncate">
              <div className="p-2 rounded bg-emerald-500/10 text-emerald-400">
                <FileText className="w-5 h-5" />
              </div>
              <div className="text-left truncate">
                <p className="text-xs font-mono font-medium text-gray-200 truncate max-w-[200px]">
                  {selectedFileName || 'Dokumen PDF terpasang'}
                </p>
                <p className="text-[10px] text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Berkas siap
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleClear}
              className="text-gray-400 hover:text-red-400 p-1.5 rounded hover:bg-white/5 transition-colors"
              title="Batalkan pilihan"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-2">
            <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <UploadCloud className="w-6 h-6" />
            </div>
            <p className="text-sm font-medium text-gray-300 mb-1">
              Drag & drop berkas ke sini, atau <span className="text-emerald-400 underline underline-offset-2">telusuri</span>
            </p>
            <p className="text-xs text-gray-500 font-mono">{helperText}</p>
          </div>
        )}
      </div>

      {error && (
        <p className="text-[11px] text-red-400 font-mono flex items-center gap-1.5">
          <AlertCircle className="w-3.5 h-3.5" />
          {error}
        </p>
      )}
    </div>
  );
};
