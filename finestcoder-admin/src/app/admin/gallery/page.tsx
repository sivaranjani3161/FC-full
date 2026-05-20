'use client';

import { useEffect, useState } from 'react';
import { Image as ImageIcon } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { toast } from 'react-hot-toast';
import DataTable, { Column } from '@/components/common/DataTable';
import UnifiedGalleryForm from '@/components/gallery/UnifiedGalleryForm';
import { resolveMediaUrl } from '@/lib/resolveMediaUrl';
import { ApiError } from '@/lib/api-client';
import { galleryService } from '@/services/gallery.service';
import type { GalleryRow, GalleryType } from '@/types/gallery';
import type { SessionUser } from '@/types/auth';

export default function GalleryPage() {
  const { data: session } = useSession();
  const [rows, setRows] = useState<GalleryRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selected, setSelected] = useState<GalleryRow | null>(null);
  const [selectedType, setSelectedType] = useState<GalleryType>('external');
  const [deleteTarget, setDeleteTarget] = useState<GalleryRow | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchAll = async () => {
    try {
      const data = await galleryService.list();
      setRows(
        data.map((e) => ({
          ...e,
          __type: (e.type ?? 'external') as GalleryType,
        })),
      );
    } catch {
      toast.error('Failed to fetch gallery');
    }
  };

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        await fetchAll();
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleSave = async (formData: Record<string, unknown>, type: GalleryType) => {
    try {
      setFormLoading(true);
      const isEdit = Boolean(selected);
      const payload = { ...formData, type };
      if (type === 'external' && !isEdit) {
        const dbUserId = Number((session?.user as SessionUser)?.dbUserId);
        if (Number.isNaN(dbUserId)) {
          toast.error('Session missing user id. Please sign in again.');
          return;
        }
        payload.createdBy = dbUserId;
      }
      if (isEdit && selected) {
        await galleryService.update(selected.id, payload);
        toast.success('Updated');
      } else {
        await galleryService.create(payload);
        toast.success('Created');
      }
      setSelected(null);
      setIsFormOpen(false);
      await fetchAll();
    } catch (e) {
      toast.error(e instanceof ApiError ? e.message : 'An error occurred');
    } finally {
      setFormLoading(false);
    }
  };

  const handleEdit = async (item: GalleryRow) => {
    try {
      setSelectedType(item.__type ?? 'external');
      setSelected(await galleryService.getById(item.id));
      setIsFormOpen(true);
    } catch {
      toast.error('Failed to fetch details');
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      setDeleting(true);
      await galleryService.remove(deleteTarget.id);
      toast.success('Deleted');
      await fetchAll();
    } catch {
      toast.error('An error occurred');
    } finally {
      setDeleting(false);
      setDeleteTarget(null);
    }
  };

  const columns: Column<GalleryRow>[] = [
    {
      header: 'Type',
      accessor: (item) => (
        <span
          className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
            item.__type === 'internal'
              ? 'bg-slate-100 text-slate-600 border border-slate-200'
              : 'bg-cyan-50 text-cyan-700 border border-cyan-100'
          }`}
        >
          {item.__type === 'internal' ? 'Internal' : 'External'}
        </span>
      ),
    },
    {
      mobileTitle: true,
      header: 'Title',
      accessor: (item) => (
        <div className="flex items-center gap-2">
          {item.coverImage ? (
            <img
              src={resolveMediaUrl(item.coverImage)}
              alt=""
              className="w-8 h-8 rounded-md object-cover border border-slate-100"
            />
          ) : (
            <div className="w-8 h-8 rounded-md bg-slate-100 flex items-center justify-center">
              <ImageIcon className="w-3.5 h-3.5 text-slate-400" />
            </div>
          )}
          <span className="font-semibold text-gray-900 text-sm">{item.title}</span>
        </div>
      ),
    },
    {
      mobileHidden: true,
      header: 'Location',
      accessor: (item) => item.location || '—',
      className: 'text-gray-400 text-xs hidden sm:table-cell',
    },
    {
      mobileSubtitle: true,
      header: 'Date',
      accessor: (item) =>
        item.eventDate ? new Date(item.eventDate).toLocaleDateString() : '—',
      className: 'text-gray-400 text-xs',
    },
  ];

  return (
    <div className="p-3 sm:p-4">
      <DataTable
        title="Gallery"
        icon={ImageIcon}
        module="gallery"
        data={rows}
        columns={columns}
        loading={loading}
        searchKey="title"
        searchPlaceholder="Search events..."
        onAdd={() => {
          setSelected(null);
          setSelectedType('external');
          setIsFormOpen(true);
        }}
        onEdit={handleEdit}
        onDelete={(item) => setDeleteTarget(item)}
      />

      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
            onClick={() => setDeleteTarget(null)}
          />
          <div className="relative z-10 w-full max-w-sm bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden p-5">
            <p className="text-sm font-bold text-slate-800 mb-1">Delete gallery event?</p>
            <p className="text-[12px] text-slate-500 mb-4 truncate">{deleteTarget.title}</p>
            <div className="flex gap-2">
              <button
                onClick={() => setDeleteTarget(null)}
                className="flex-1 py-2 rounded-lg border border-slate-200 text-sm font-medium text-slate-600"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={deleting}
                className="flex-1 py-2 rounded-lg bg-rose-500 text-white text-sm font-bold disabled:opacity-50"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {isFormOpen && (
        <UnifiedGalleryForm
          initialData={selected ?? undefined}
          type={selectedType}
          onSave={handleSave}
          onCancel={() => {
            setIsFormOpen(false);
            setSelected(null);
          }}
          loading={formLoading}
        />
      )}
    </div>
  );
}
