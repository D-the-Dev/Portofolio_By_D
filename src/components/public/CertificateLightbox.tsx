import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Award, ExternalLink, Eye, CheckCircle } from 'lucide-react';
import type { Certificate } from '../../types';
import { Modal } from '../ui/Modal';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';

interface CertificateLightboxProps {
  certificates: Certificate[];
}

export const CertificateLightbox: React.FC<CertificateLightboxProps> = ({ certificates }) => {
  const [activeCert, setActiveCert] = useState<Certificate | null>(null);

  const isPdf = activeCert?.file_url?.toLowerCase().endsWith('.pdf');

  return (
    <section id="certificates" className="py-14 sm:py-20 relative">
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-8 sm:mb-12">
          <div className="flex items-center gap-2 mb-1.5 sm:mb-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span className="text-[11px] sm:text-xs font-mono uppercase tracking-widest text-emerald-400">
              ACCREDITATIONS
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#F3F4F6] tracking-tight">
            Sertifikasi & Documentation
          </h2>
          <p className="text-xs sm:text-sm text-gray-400 max-w-xl mt-1.5 sm:mt-2 font-mono leading-relaxed">
            Validasi kompetensi teknis dari penyedia sertifikasi industri, serta dokumentasi seminar.
          </p>
        </div>

        {/* Certificates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {certificates.map((cert, index) => (
            <motion.div
              key={cert.id}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: index * 0.08 }}
              className="rounded-xl sm:rounded-2xl border border-[#1F2924] bg-[#0F1412]/90 backdrop-blur-md p-4 sm:p-6 flex flex-col justify-between hover:border-[#10B981] hover:shadow-emerald-glow transition-all duration-300 group"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3 sm:mb-4">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform shrink-0">
                    <Award className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  {cert.issue_date && (
                    <Badge variant="muted" size="sm" className="text-[10px] sm:text-xs">
                      {cert.issue_date}
                    </Badge>
                  )}
                </div>

                <h3 className="text-sm sm:text-base font-bold text-[#F3F4F6] group-hover:text-emerald-400 transition-colors">
                  {cert.title}
                </h3>
                <p className="text-xs text-gray-400 font-mono mt-1 flex items-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span className="truncate">{cert.issuer}</span>
                </p>
              </div>

              {/* Actions */}
              <div className="mt-4 sm:mt-6 pt-3.5 sm:pt-4 border-t border-[#1F2924] flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                {cert.file_url && (
                  <Button
                    variant="secondary"
                    size="sm"
                    className="w-full sm:flex-1 justify-center"
                    onClick={() => setActiveCert(cert)}
                    leftIcon={<Eye className="w-3.5 h-3.5 text-emerald-400" />}
                  >
                    Lihat Berkas
                  </Button>
                )}
                {cert.credential_url && (
                  <a
                    href={cert.credential_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cert.file_url ? 'w-full sm:w-auto' : 'w-full sm:flex-1'}
                  >
                    <Button
                      variant={cert.file_url ? 'outline' : 'primary'}
                      size="sm"
                      className="w-full justify-center"
                      rightIcon={<ExternalLink className="w-3.5 h-3.5" />}
                    >
                      Verifikasi
                    </Button>
                  </a>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      <Modal
        isOpen={Boolean(activeCert)}
        onClose={() => setActiveCert(null)}
        title={activeCert?.title || 'Berkas Sertifikat'}
        description={`Diterbitkan oleh: ${activeCert?.issuer || ''}`}
        maxWidth="2xl"
      >
        <div className="space-y-4">
          {activeCert?.file_url && (
            <div className="rounded-lg overflow-hidden border border-[#1F2924] bg-black/60 flex items-center justify-center p-2 min-h-[220px] sm:min-h-[300px]">
              {isPdf ? (
                <iframe
                  src={activeCert.file_url}
                  title={activeCert.title}
                  className="w-full h-[320px] sm:h-[450px] rounded"
                />
              ) : (
                <img
                  src={activeCert.file_url}
                  alt={activeCert.title}
                  className="max-h-[350px] sm:max-h-[500px] w-auto object-contain rounded"
                />
              )}
            </div>
          )}

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 pt-2">
            {activeCert?.credential_url ? (
              <a
                href={activeCert.credential_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-mono text-emerald-400 hover:underline flex items-center gap-1.5 justify-center sm:justify-start"
              >
                <ExternalLink className="w-3.5 h-3.5" /> Verifikasi kredensial di website penerbit
              </a>
            ) : <div />}
            {activeCert?.file_url && (
              <a
                href={activeCert.file_url}
                download
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto"
              >
                <Button variant="primary" size="sm" className="w-full sm:w-auto justify-center">
                  Unduh Berkas
                </Button>
              </a>
            )}
          </div>
        </div>
      </Modal>
    </section>
  );
};
