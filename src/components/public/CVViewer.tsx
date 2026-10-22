import React from 'react';
import { Download, ExternalLink, FileText, Clock, AlertCircle } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';

interface CVViewerProps {
  isOpen: boolean;
  onClose: () => void;
  cvUrl?: string | null;
  cvUpdatedAt?: string | null;
  candidateName?: string;
}

export const CVViewer: React.FC<CVViewerProps> = ({
  isOpen,
  onClose,
  cvUrl,
  cvUpdatedAt,
  candidateName = 'Alex Pratama',
}) => {
  if (!isOpen) return null;

  const formattedDate = cvUpdatedAt
    ? new Date(cvUpdatedAt).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : 'Terbaru';

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Curriculum Vitae — ${candidateName}`}
      description="Pratinjau berkas PDF resmi dan tautan pengunduhan langsung"
      maxWidth="4xl"
    >
      <div className="space-y-3 sm:space-y-4">
        {/* Meta Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-xl bg-[#050505] border border-[#1F2924]">
          <div className="flex items-center gap-2 text-xs font-mono text-gray-400">
            <Clock className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span className="truncate">Terakhir Diperbarui: <strong className="text-gray-200">{formattedDate}</strong></span>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            {cvUrl && (
              <>
                <a
                  href={cvUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto"
                >
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-center"
                    rightIcon={<ExternalLink className="w-3.5 h-3.5" />}
                  >
                    Buka di Tab Baru
                  </Button>
                </a>
                <a
                  href={cvUrl}
                  download={`CV_${candidateName.replace(/\s+/g, '_')}.pdf`}
                  className="w-full sm:w-auto"
                >
                  <Button
                    variant="primary"
                    size="sm"
                    className="w-full justify-center"
                    leftIcon={<Download className="w-3.5 h-3.5" />}
                  >
                    Unduh PDF
                  </Button>
                </a>
              </>
            )}
          </div>
        </div>

        {/* Mobile notice helper */}
        <div className="sm:hidden p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-[11px] font-mono text-emerald-300 flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          <span>Tips: Di ponsel, gunakan tombol <strong>"Buka di Tab Baru"</strong> untuk membaca PDF dengan zoom lancar.</span>
        </div>

        {/* Embedded Viewer */}
        <div className="rounded-xl overflow-hidden border border-[#1F2924] bg-black/60 min-h-[320px] sm:min-h-[500px]">
          {cvUrl ? (
            <iframe
              src={cvUrl}
              title={`Curriculum Vitae - ${candidateName}`}
              className="w-full h-[360px] sm:h-[600px] rounded-xl"
            />
          ) : (
            <div className="h-[280px] sm:h-[400px] flex flex-col items-center justify-center p-6 text-center">
              <FileText className="w-10 h-10 sm:w-12 sm:h-12 text-gray-500 mb-2 sm:mb-3" />
              <p className="text-xs sm:text-sm font-mono text-gray-300">Berkas CV belum diunggah oleh pemilik.</p>
              <p className="text-[11px] sm:text-xs text-gray-500 mt-1">Admin dapat mengunggah berkas CV melalui menu pengaturan di Dashboard.</p>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};
