import React, { useState, useEffect } from 'react';
import { Save, AlertCircle } from 'lucide-react';
import type { Certificate } from '../../types';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { FileDropzone } from '../ui/FileDropzone';
import { useCreateCertificate, useUpdateCertificate, uploadStorageFile } from '../../hooks/useAdminMutation';

interface CertificateFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  certToEdit?: Certificate | null;
}

export const CertificateFormModal: React.FC<CertificateFormModalProps> = ({
  isOpen,
  onClose,
  certToEdit,
}) => {
  const [title, setTitle] = useState('');
  const [issuer, setIssuer] = useState('');
  const [issueDate, setIssueDate] = useState('');
  const [credentialUrl, setCredentialUrl] = useState('');
  const [fileUrl, setFileUrl] = useState('');
  const [mediaFile, setMediaFile] = useState<File | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const createMutation = useCreateCertificate();
  const updateMutation = useUpdateCertificate();

  useEffect(() => {
    if (certToEdit) {
      setTitle(certToEdit.title);
      setIssuer(certToEdit.issuer);
      setIssueDate(certToEdit.issue_date || '');
      setCredentialUrl(certToEdit.credential_url || '');
      setFileUrl(certToEdit.file_url || '');
    } else {
      setTitle('');
      setIssuer('');
      setIssueDate(new Date().getFullYear().toString());
      setCredentialUrl('');
      setFileUrl('');
    }
    setMediaFile(null);
    setErrorMessage(null);
  }, [certToEdit, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);

    try {
      let finalFileUrl = fileUrl;

      if (mediaFile) {
        finalFileUrl = await uploadStorageFile('portfolio-media', mediaFile, 'certificates');
      }

      if (certToEdit) {
        await updateMutation.mutateAsync({
          id: certToEdit.id,
          title,
          issuer,
          issue_date: issueDate || undefined,
          credential_url: credentialUrl || null,
          file_url: finalFileUrl || null,
        });
      } else {
        await createMutation.mutateAsync({
          title,
          issuer,
          issue_date: issueDate || undefined,
          credential_url: credentialUrl || null,
          file_url: finalFileUrl || null,
        });
      }

      onClose();
    } catch (err: unknown) {
      console.error(err);
      setErrorMessage((err as Error).message || 'Gagal menyimpan data sertifikat.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={certToEdit ? 'Ubah Sertifikat' : 'Tambah Sertifikat Baru'}
      description="Kelola bukti kompetensi resmi dan tautan validasi kredensial"
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {errorMessage && (
          <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-xs font-mono text-red-400 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <Input
          label="NAMA SERTIFIKASI / PENGHARGAAN"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          placeholder="Contoh: AWS Certified Solutions Architect"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Input
            label="LEMBAGA PENERBIT"
            value={issuer}
            onChange={(e) => setIssuer(e.target.value)}
            required
            placeholder="Contoh: Amazon Web Services"
          />
          <Input
            label="PERIODE / TAHUN TERBIT"
            value={issueDate}
            onChange={(e) => setIssueDate(e.target.value)}
            placeholder="Contoh: 2024 - 2027"
          />
        </div>

        <Input
          label="TAUTAN VERIFIKASI RESMI (KREDENSIAL)"
          value={credentialUrl}
          onChange={(e) => setCredentialUrl(e.target.value)}
          placeholder="https://www.credly.com/badges/..."
        />

        {/* File Dropzone */}
        <div>
          <FileDropzone
            label="UNGGAH DOKUMEN SERTIFIKAT (GAMBAR ATAU PDF)"
            accept="image/*,application/pdf"
            maxSizeMB={10}
            currentFileUrl={fileUrl}
            onFileSelect={(file) => setMediaFile(file)}
            onClear={() => {
              setMediaFile(null);
              setFileUrl('');
            }}
            helperText="Diunggah ke bucket portfolio-media"
          />
          <div className="mt-1">
            <Input
              label="ATAU TAUTAN FILE GAMBAR/PDF EKSTERNAL"
              value={fileUrl}
              onChange={(e) => setFileUrl(e.target.value)}
              placeholder="https://..."
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-4 border-t border-[#1F2924]">
          <Button type="button" variant="ghost" size="sm" onClick={onClose}>
            Batal
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="sm"
            isLoading={isLoading}
            leftIcon={<Save className="w-4 h-4" />}
          >
            {certToEdit ? 'Simpan Perubahan' : 'Tambah Sertifikat'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
