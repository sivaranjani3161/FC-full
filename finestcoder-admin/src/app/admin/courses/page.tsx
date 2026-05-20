'use client';

import { useState, useEffect } from 'react';
import { BookOpen, Tag, Trash2 } from 'lucide-react';
import { useSession } from 'next-auth/react';
import DataTable, { Column } from '@/components/common/DataTable';
import CourseForm from '@/components/courses/CourseForm';
import CategoryManagerModal from '@/components/courses/CategoryManagerModal';
import { courseService } from '@/services/course.service';
import type { CourseDetail, CourseListItem } from '@/types/course';
import { toast } from 'react-hot-toast';

export default function CoursesPage() {
  const { data: session } = useSession();
  const [courses, setCourses] = useState<CourseListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<CourseDetail | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<CourseListItem | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [catModalOpen, setCatModalOpen] = useState(false);
  const [catRefreshKey, setCatRefreshKey] = useState(0);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      setCourses(await courseService.list());
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (formData: Record<string, unknown>) => {
    try {
      setFormLoading(true);
      if (!selectedCourse) {
        const dbUserId = Number((session?.user as { dbUserId?: number })?.dbUserId);
        if (Number.isNaN(dbUserId)) {
          toast.error('Session missing user id — sign in again');
          return;
        }
        formData.createdBy = dbUserId;
        await courseService.create(formData);
        toast.success('Course created');
      } else {
        await courseService.update(selectedCourse.id, formData);
        toast.success('Course updated');
      }
      setIsFormOpen(false);
      setSelectedCourse(null);
      fetchCourses();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'An error occurred');
    } finally {
      setFormLoading(false);
    }
  };

  const handleEdit = async (course: CourseListItem) => {
    try {
      setLoading(true);
      setSelectedCourse(await courseService.getById(course.id));
      setIsFormOpen(true);
    } catch {
      toast.error('Failed to fetch course details');
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      setDeleting(true);
      await courseService.remove(deleteTarget.id);
      toast.success('Course deleted');
      fetchCourses();
    } catch {
      toast.error('Failed to delete');
    } finally {
      setDeleting(false);
      setDeleteTarget(null);
    }
  };

  const handleTogglePublish = async (course: CourseListItem) => {
    const next = !course.isActive;
    try {
      await courseService.update(course.id, { ...course, isActive: next });
      toast.success(next ? 'Published' : 'Unpublished');
      fetchCourses();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'An error occurred');
    }
  };

  const columns: Column<CourseListItem>[] = [
    {
      mobileTitle: true,
      header: 'Title',
      accessor: (item) => (
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-[#00B8C6]/10 flex items-center justify-center text-[#00B8C6] font-bold text-[10px] shrink-0">
            {item.title[0].toUpperCase()}
          </div>
          <span className="font-semibold text-gray-900 text-sm">{item.title}</span>
        </div>
      ),
    },
    {
      mobileHidden: true,
      header: 'Slug',
      accessor: 'slug',
      className: 'font-mono text-xs text-gray-400 hidden sm:table-cell',
    },
    {
      mobileSubtitle: true,
      header: 'Status',
      accessor: (item) => (
        <span
          className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
            item.isActive
              ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
              : 'bg-amber-50 text-amber-600 border border-amber-100'
          }`}
        >
          {item.isActive ? 'Active' : 'Inactive'}
        </span>
      ),
    },
    {
      header: 'Created',
      accessor: (item) => new Date(item.createdAt).toLocaleDateString(),
      className: 'text-gray-400 text-xs hidden md:table-cell',
    },
  ];

  return (
    <div className="p-3 sm:p-4">
      <div className="mb-3 flex flex-col sm:flex-row sm:items-center gap-2 p-3 rounded-xl bg-gradient-to-r from-[#00B8C6]/8 to-transparent border border-[#00B8C6]/20">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <div className="w-7 h-7 rounded-lg bg-[#00B8C6]/10 flex items-center justify-center flex-shrink-0">
            <Tag className="w-3.5 h-3.5 text-[#00B8C6]" />
          </div>
          <div className="min-w-0">
            <p className="text-[12px] font-bold text-slate-700">Course Categories</p>
            <p className="text-[11px] text-slate-400 truncate">
              Manage categories — add or delete them, then assign courses below
            </p>
          </div>
        </div>
        <button
          onClick={() => setCatModalOpen(true)}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#00B8C6] text-white text-[12px] font-semibold hover:bg-[#00a3b0] active:scale-[0.97] transition-all shadow-[0_3px_10px_rgba(0,184,198,0.25)] flex-shrink-0 w-full sm:w-auto justify-center"
        >
          <Tag className="w-3.5 h-3.5" />
          Manage Categories
        </button>
      </div>

      <DataTable
        title="Courses"
        icon={BookOpen}
        module="courses"
        data={courses}
        columns={columns}
        loading={loading}
        searchKey="title"
        searchPlaceholder="Search courses..."
        onAdd={() => {
          setSelectedCourse(null);
          setIsFormOpen(true);
        }}
        onEdit={handleEdit}
        onDelete={(c) => setDeleteTarget(c)}
        renderRowActions={(item) => (
          <button
            onClick={() => handleTogglePublish(item)}
            className={`h-6 px-2 rounded-md border text-[10px] font-bold uppercase tracking-wide transition-all ${
              item.isActive
                ? 'bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100'
                : 'bg-amber-50 border-amber-200 text-amber-700 hover:bg-amber-100'
            }`}
          >
            {item.isActive ? 'Unpublish' : 'Publish'}
          </button>
        )}
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
              <p className="text-sm font-bold text-slate-800 mb-4">Delete {deleteTarget.title}?</p>
              <div className="flex gap-2">
                <button
                  onClick={() => setDeleteTarget(null)}
                  className="flex-1 py-2 rounded-lg border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  disabled={deleting}
                  className="flex-1 py-2 rounded-lg bg-rose-500 text-white text-sm font-bold hover:bg-rose-600 disabled:opacity-50 flex items-center justify-center gap-1.5"
                >
                  {deleting && (
                    <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  )}
                  <Trash2 className="w-3.5 h-3.5 inline" /> Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {catModalOpen && (
        <CategoryManagerModal
          onClose={() => setCatModalOpen(false)}
          onChanged={() => setCatRefreshKey((k) => k + 1)}
        />
      )}

      {isFormOpen && (
        <CourseForm
          initialData={selectedCourse}
          onSave={handleSave}
          onCancel={() => {
            setIsFormOpen(false);
            setSelectedCourse(null);
          }}
          loading={formLoading}
          categoryRefreshKey={catRefreshKey}
        />
      )}
    </div>
  );
}
