import React, { useState, useEffect } from 'react';
import { Save, AlertCircle } from 'lucide-react';
import type { Experience } from '../../types';
import { Modal } from '../ui/Modal';
import { Input, Textarea } from '../ui/Input';
import { Button } from '../ui/Button';
import { useCreateExperience, useUpdateExperience } from '../../hooks/useAdminMutation';

interface ExperienceFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  expToEdit?: Experience | null;
}

export const ExperienceFormModal: React.FC<ExperienceFormModalProps> = ({
  isOpen,
  onClose,
  expToEdit,
}) => {
  const [role, setRole] = useState('');
  const [organization, setOrganization] = useState('');
  const [period, setPeriod] = useState('');
  const [description, setDescription] = useState('');
  const [isCurrent, setIsCurrent] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const createMutation = useCreateExperience();
  const updateMutation = useUpdateExperience();

  useEffect(() => {
    if (expToEdit) {
      setRole(expToEdit.role);
      setOrganization(expToEdit.organization);
      setPeriod(expToEdit.period);
      setDescription(expToEdit.description);
      setIsCurrent(Boolean(expToEdit.is_current));
    } else {
      setRole('');
      setOrganization('');
      setPeriod('2024 - Sekarang');
      setDescription('');
      setIsCurrent(true);
    }
    setErrorMessage(null);
  }, [expToEdit, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);

    try {
      if (expToEdit) {
        await updateMutation.mutateAsync({
          id: expToEdit.id,
          role,
          organization,
          period,
          description,
          is_current: isCurrent,
        });
      } else {
        await createMutation.mutateAsync({
          role,
          organization,
          period,
          description,
          is_current: isCurrent,
        });
      }

      onClose();
    } catch (err: unknown) {
      console.error(err);
      setErrorMessage((err as Error).message || 'Gagal menyimpan riwayat pengalaman.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={expToEdit ? 'Ubah Riwayat Pengalaman' : 'Tambah Pengalaman Baru'}
      description="Catat posisi jabatan, institusi, dan kontribusi teknis pada timeline karier"
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {errorMessage && (
          <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-xs font-mono text-red-400 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Input
            label="POSISI / GELAR / JABATAN"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            required
            placeholder="Contoh: Lead Full-Stack Engineer"
          />
          <Input
            label="NAMA INSTANSI / KAMPUS / PERUSAHAAN"
            value={organization}
            onChange={(e) => setOrganization(e.target.value)}
            required
            placeholder="Contoh: CyberCore Distributed Labs"
          />
        </div>

        <Input
          label="DURASI / PERIODE WAKTU"
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
          required
          placeholder="Contoh: 2023 - Sekarang"
        />

        <Textarea
          label="DESKRIPSI TUGAS & DAMPAK TEKNIS"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          rows={4}
          placeholder="Jelaskan arsitektur yang dirancang, teknologi yang digunakan, serta metrik peningkatan performa..."
        />

        <div className="flex items-center gap-2 pt-1">
          <input
            id="isCurrentCheck"
            type="checkbox"
            checked={isCurrent}
            onChange={(e) => setIsCurrent(e.target.checked)}
            className="w-4 h-4 rounded border-[#1F2924] bg-[#050505] text-emerald-500 focus:ring-emerald-500/50"
          />
          <label htmlFor="isCurrentCheck" className="text-xs font-mono text-gray-300 cursor-pointer">
            Posisi Saat Ini (Aktif)
          </label>
        </div>

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
            {expToEdit ? 'Simpan Perubahan' : 'Tambah Pengalaman'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
