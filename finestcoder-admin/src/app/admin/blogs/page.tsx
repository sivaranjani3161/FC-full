'use client';

import { useEffect, useState } from 'react';
import { FileText } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { toast } from 'react-hot-toast';
import BlogForm from '@/components/blogs/BlogForm';
import DataTable, { Column } from '@/components/common/DataTable';
import { resolveMediaUrl } from '@/lib/resolveMediaUrl';
import { ApiError } from '@/lib/api-client';
import { blogService, type Blog } from '@/services/blog.service';
import type { SessionUser } from '@/types/auth';

const STATUS_STYLES: Record<string, string> = {
  PUBLISHED: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  DRAFT: 'bg-amber-50 text-amber-700 border-amber-200',
  ARCHIVED: 'bg-slate-100 text-slate-500 border-slate-200',
};

export default function BlogsPage() {
  const { data: session } = useSession();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Blog | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      setBlogs(await blogService.list());
    } catch {
      toast.error('Failed to fetch blogs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleSave = async (formData: Record<string, unknown>) => {
    try {
      setFormLoading(true);
      if (!selectedBlog) {
        const dbUserId = Number((session?.user as SessionUser)?.dbUserId);
        if (Number.isNaN(dbUserId)) {
          toast.error('Session is missing user id. Please sign in again.');
          return;
        }
        formData.createdBy = dbUserId;
        await blogService.create(formData);
        toast.success('Blog created');
      } else {
        await blogService.update(selectedBlog.id, formData);
        toast.success('Blog updated');
      }
      setIsFormOpen(false);
      setSelectedBlog(null);
      fetchBlogs();
    } catch (e) {
      toast.error(e instanceof ApiError ? e.message : 'An error occurred');
    } finally {
      setFormLoading(false);
    }
  };

  const handleEdit = async (item: Blog) => {
    try {
      setSelectedBlog(await blogService.getById(item.id));
      setIsFormOpen(true);
    } catch {
      toast.error('Failed to fetch blog details');
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      setDeleting(true);
      await blogService.remove(deleteTarget.id);
      toast.success('Blog deleted');
      fetchBlogs();
    } catch {
      toast.error('An error occurred');
    } finally {
      setDeleting(false);
      setDeleteTarget(null);
    }
  };

  const handleTogglePublish = async (item: Blog) => {
    const newStatus = item.status === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED';
    try {
      await blogService.update(item.id, { ...item, status: newStatus });
      toast.success(`Blog ${newStatus === 'PUBLISHED' ? 'published' : 'unpublished'}`);
      fetchBlogs();
    } catch {
      toast.error('An error occurred');
    }
  };

  const columns: Column<Blog>[] = [
    {
      mobileTitle: true,
      header: 'Blog',
      accessor: (blog) => (
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-10 h-10 rounded-lg flex-shrink-0 overflow-hidden bg-slate-100 border border-slate-200">
            {blog.coverImage ? (
              <img src={resolveMediaUrl(blog.coverImage)} alt={blog.title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <FileText className="w-4 h-4 text-slate-300" />
              </div>
            )}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-slate-900 truncate">{blog.title}</p>
            <p className="text-[10px] text-slate-400 font-mono truncate">{blog.slug}</p>
          </div>
        </div>
      ),
    },
    {
      mobileSubtitle: true,
      header: 'Status',
      accessor: (blog) => {
        const status = blog.status || 'DRAFT';
        return (
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${STATUS_STYLES[status] ?? STATUS_STYLES.DRAFT}`}>
            {status}
          </span>
        );
      },
    },
    {
      header: 'Excerpt',
      accessor: (blog) => (
        <span className="text-xs text-slate-500 line-clamp-2 max-w-[340px]">
          {blog.excerpt || '-'}
        </span>
      ),
      className: 'hidden md:table-cell',
    },
    {
      header: 'Created',
      accessor: (blog) =>
        blog.createdAt
          ? new Date(blog.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
          : '-',
      className: 'text-xs text-slate-500',
    },
  ];

  return (
    <div className="p-3 sm:p-4">
      <DataTable
        title="Blogs"
        icon={FileText}
        module="blogs"
        data={blogs}
        columns={columns}
        loading={loading}
        searchKey="title"
        searchPlaceholder="Search blogs..."
        onAdd={() => {
          setSelectedBlog(null);
          setIsFormOpen(true);
        }}
        onEdit={handleEdit}
        onDelete={(item) => setDeleteTarget(item)}
        renderRowActions={(blog) => {
          const isPublished = blog.status === 'PUBLISHED';
          return (
            <button
              onClick={() => handleTogglePublish(blog)}
              title={isPublished ? 'Unpublish' : 'Publish'}
              className={`h-6 px-2 rounded-md border text-[10px] font-bold uppercase tracking-wide transition-all ${
                isPublished
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100'
                  : 'bg-amber-50 border-amber-200 text-amber-700 hover:bg-amber-100'
              }`}
            >
              {isPublished ? 'Unpublish' : 'Publish'}
            </button>
          );
        }}
      />

      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
            onClick={() => setDeleteTarget(null)}
          />
          <div className="relative z-10 w-full max-w-sm bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="h-1 w-full bg-rose-500" />
            <div className="px-5 pt-5 pb-6">
              <p className="text-sm font-bold text-slate-800 mb-1">Delete Blog</p>
              <p className="text-sm font-semibold text-slate-800 truncate mb-4">{deleteTarget.title}</p>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setDeleteTarget(null)}
                  className="flex-1 py-2 rounded-lg border border-slate-200 text-sm font-medium text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={confirmDelete}
                  disabled={deleting}
                  className="flex-1 py-2 rounded-lg bg-rose-500 text-white text-sm font-bold disabled:opacity-50"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {isFormOpen && (
        <BlogForm
          initialData={selectedBlog ?? undefined}
          existingBlogs={blogs}
          onSave={handleSave}
          onCancel={() => {
            setIsFormOpen(false);
            setSelectedBlog(null);
          }}
          loading={formLoading}
        />
      )}
    </div>
  );
}
