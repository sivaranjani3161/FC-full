'use client';

import { useEffect, useState } from 'react';
import { Star } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { toast } from 'react-hot-toast';
import DataTable, { Column } from '@/components/common/DataTable';
import TestimonialForm from '@/components/testimonials/TestimonialForm';
import { resolveMediaUrl } from '@/lib/resolveMediaUrl';
import { ApiError } from '@/lib/api-client';
import { testimonialService, type Testimonial } from '@/services/testimonial.service';
import type { SessionUser } from '@/types/auth';

export default function TestimonialsPage() {
  const { data: session } = useSession();
  const [items, setItems] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Testimonial | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Testimonial | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchItems = async () => {
    try {
      setLoading(true);
      setItems(await testimonialService.list());
    } catch {
      toast.error('Failed to fetch testimonials');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleSave = async (formData: Record<string, unknown>) => {
    try {
      setFormLoading(true);
      if (!selectedItem) {
        const dbUserId = Number((session?.user as SessionUser)?.dbUserId);
        if (Number.isNaN(dbUserId)) {
          toast.error('Session is missing user id. Please sign in again.');
          return;
        }
        formData.createdBy = dbUserId;
        await testimonialService.create(formData);
        toast.success('Testimonial created');
      } else {
        await testimonialService.update(selectedItem.id, formData);
        toast.success('Testimonial updated');
      }
      setIsFormOpen(false);
      setSelectedItem(null);
      fetchItems();
    } catch (e) {
      toast.error(e instanceof ApiError ? e.message : 'An error occurred');
    } finally {
      setFormLoading(false);
    }
  };

  const columns: Column<Testimonial>[] = [
    {
      header: 'Preview',
      accessor: (item) =>
        item.thumbnailUrl ? (
          <img
            src={resolveMediaUrl(item.thumbnailUrl)}
            alt={item.name || 'testimonial'}
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg object-cover border border-slate-200"
          />
        ) : (
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-slate-100 border border-slate-200" />
        ),
    },
    { header: 'Name', accessor: 'name', className: 'font-semibold text-gray-900 text-sm' },
    {
      header: 'Type',
      accessor: (item) => String(item.type || '-').toUpperCase(),
      className: 'text-xs text-gray-500 hidden sm:table-cell',
    },
    {
      header: 'Status',
      accessor: (item) => (
        <span
          className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
            item.isActive
              ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
              : 'bg-slate-100 text-slate-500 border border-slate-200'
          }`}
        >
          {item.isActive ? 'Active' : 'Inactive'}
        </span>
      ),
    },
  ];

  return (
    <div className="p-3 sm:p-4">
      <DataTable
        title="Testimonials"
        icon={Star}
        module="testimonials"
        data={items}
        columns={columns}
        loading={loading}
        searchKey="name"
        searchPlaceholder="Search testimonials..."
        onAdd={() => {
          setSelectedItem(null);
          setIsFormOpen(true);
        }}
        onEdit={(item) => {
          setSelectedItem(item);
          setIsFormOpen(true);
        }}
        onDelete={(item) => setDeleteTarget(item)}
      />

      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
            onClick={() => setDeleteTarget(null)}
          />
          <div className="relative z-10 w-full max-w-sm bg-white rounded-2xl shadow-2xl border border-slate-200 p-5">
            <p className="text-sm font-bold text-slate-800 mb-1">Delete Testimonial</p>
            <p className="text-sm font-semibold truncate mb-4">{deleteTarget.name}</p>
            <div className="flex gap-2">
              <button onClick={() => setDeleteTarget(null)} className="flex-1 py-2 rounded-lg border text-sm">
                Cancel
              </button>
              <button
                onClick={async () => {
                  try {
                    setDeleting(true);
                    await testimonialService.remove(deleteTarget.id);
                    toast.success('Testimonial deleted');
                    fetchItems();
                  } catch {
                    toast.error('Failed to delete');
                  } finally {
                    setDeleting(false);
                    setDeleteTarget(null);
                  }
                }}
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
        <TestimonialForm
          initialData={selectedItem ?? undefined}
          onSave={handleSave}
          onCancel={() => {
            setIsFormOpen(false);
            setSelectedItem(null);
          }}
          loading={formLoading}
        />
      )}
    </div>
  );
}
