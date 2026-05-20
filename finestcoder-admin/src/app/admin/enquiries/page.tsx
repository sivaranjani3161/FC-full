'use client';

import { useEffect, useMemo, useState } from 'react';
import { MessageSquare } from 'lucide-react';
import { toast } from 'react-hot-toast';
import DataTable, { Column } from '@/components/common/DataTable';
import { ApiError } from '@/lib/api-client';
import { courseService } from '@/services/course.service';
import { enquiryService, type Enquiry, type EnquiryStatus } from '@/services/enquiry.service';
import type { CourseListItem } from '@/types/course';

const STATUS_CONFIG: Record<string, { label: string; bg: string; text: string; border: string }> = {
  NEW: { label: 'New', bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
  CONTACTED: { label: 'Contacted', bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
  CONVERTED: { label: 'Converted', bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200' },
  CLOSED: { label: 'Closed', bg: 'bg-slate-100', text: 'text-slate-600', border: 'border-slate-200' },
};

function StatusBadge({ status }: { status: string }) {
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.NEW;
  return (
    <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${cfg.bg} ${cfg.text} ${cfg.border}`}>
      {cfg.label}
    </span>
  );
}

function StatusSelect({
  item,
  onUpdate,
}: {
  item: Enquiry;
  onUpdate: (id: number, status: EnquiryStatus) => void;
}) {
  const [saving, setSaving] = useState(false);

  const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value as EnquiryStatus;
    setSaving(true);
    try {
      await enquiryService.updateStatus(item.id, newStatus);
      onUpdate(item.id, newStatus);
      toast.success('Status updated');
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : 'An error occurred');
    } finally {
      setSaving(false);
    }
  };

  return (
    <select
      value={item.status}
      onChange={handleChange}
      disabled={saving}
      className="text-[11px] font-semibold rounded-lg border px-2 py-1 outline-none cursor-pointer focus:ring-1 focus:ring-[#00B8C6] disabled:opacity-60 bg-white border-slate-200"
    >
      <option value="NEW">New</option>
      <option value="CONTACTED">Contacted</option>
      <option value="CONVERTED">Converted</option>
      <option value="CLOSED">Closed</option>
    </select>
  );
}

export default function EnquiriesPage() {
  const [items, setItems] = useState<Enquiry[]>([]);
  const [courses, setCourses] = useState<CourseListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [courseFilter, setCourseFilter] = useState<string>('all');

  const fetchItems = async () => {
    try {
      setLoading(true);
      const [enquiries, courseList] = await Promise.all([
        enquiryService.list(),
        courseService.list(),
      ]);
      setItems(enquiries);
      setCourses(courseList);
    } catch {
      toast.error('Failed to fetch enquiries');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleStatusUpdate = (id: number, newStatus: EnquiryStatus) => {
    setItems((prev) => prev.map((e) => (e.id === id ? { ...e, status: newStatus } : e)));
  };

  const filtered = useMemo(() => {
    return items.filter((e) => {
      const statusOk = statusFilter === 'all' || e.status === statusFilter;
      const courseOk =
        courseFilter === 'all' ||
        (courseFilter === 'none' ? !e.courseId : String(e.courseId) === courseFilter);
      return statusOk && courseOk;
    });
  }, [items, statusFilter, courseFilter]);

  const columns: Column<Enquiry>[] = [
    {
      mobileTitle: true,
      header: 'Name',
      accessor: (item) => (
        <div>
          <p className="font-semibold text-sm text-slate-900">{item.fullName}</p>
          <p className="text-[10px] text-slate-400">{item.email}</p>
        </div>
      ),
    },
    {
      mobileSubtitle: true,
      header: 'Status',
      accessor: (item) => <StatusBadge status={item.status} />,
    },
    {
      header: 'Course',
      accessor: (item) => item.course?.title ?? '—',
      className: 'text-xs text-slate-500 hidden sm:table-cell',
    },
    {
      header: 'Phone',
      accessor: (item) => item.phone ?? '—',
      className: 'text-xs hidden md:table-cell',
    },
    {
      header: 'Date',
      accessor: (item) =>
        item.createdAt ? new Date(item.createdAt).toLocaleDateString() : '—',
      className: 'text-xs text-slate-400',
    },
  ];

  return (
    <div className="p-3 sm:p-4">
      <div className="flex flex-wrap gap-2 mb-3">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="text-xs border rounded-lg px-2 py-1.5"
        >
          <option value="all">All statuses</option>
          <option value="NEW">New</option>
          <option value="CONTACTED">Contacted</option>
          <option value="CONVERTED">Converted</option>
          <option value="CLOSED">Closed</option>
        </select>
        <select
          value={courseFilter}
          onChange={(e) => setCourseFilter(e.target.value)}
          className="text-xs border rounded-lg px-2 py-1.5"
        >
          <option value="all">All courses</option>
          <option value="none">No course</option>
          {courses.map((c) => (
            <option key={c.id} value={String(c.id)}>
              {c.title}
            </option>
          ))}
        </select>
      </div>

      <DataTable
        title="Enquiries"
        icon={MessageSquare}
        module="enquiries"
        data={filtered}
        columns={columns}
        loading={loading}
        searchKey="fullName"
        searchPlaceholder="Search enquiries..."
        renderRowActions={(item) => (
          <StatusSelect item={item} onUpdate={handleStatusUpdate} />
        )}
      />
    </div>
  );
}
