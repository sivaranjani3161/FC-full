'use client';

import { useState, useEffect } from 'react';
import { Tag, Plus, X, Save, Trash2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { INPUT_CLASS, LABEL_CLASS } from '@/constants/form';
import { courseCategoryService } from '@/services/courseCategory.service';
import { slugFromName } from '@/utils/slug';
import type { CourseCategory } from '@/types/category';

interface CategoryManagerModalProps {
  onClose: () => void;
  onChanged: () => void;
}

export default function CategoryManagerModal({ onClose, onChanged }: CategoryManagerModalProps) {
  const [categories, setCategories] = useState<CourseCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [addName, setAddName] = useState('');
  const [addSlug, setAddSlug] = useState('');
  const [addDesc, setAddDesc] = useState('');
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<CourseCategory | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [view, setView] = useState<'list' | 'add'>('list');

  const fetchCats = async () => {
    try {
      setLoading(true);
      setCategories(await courseCategoryService.list());
    } catch {
      toast.error('Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCats();
  }, []);

  const handleAdd = async () => {
    if (!addName.trim()) {
      toast.error('Name is required');
      return;
    }
    try {
      setSaving(true);
      await courseCategoryService.create({
        name: addName.trim(),
        slug: addSlug || slugFromName(addName),
        description: addDesc || '',
      });
      toast.success('Category created!');
      setAddName('');
      setAddSlug('');
      setAddDesc('');
      setView('list');
      await fetchCats();
      onChanged();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'An error occurred');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      setDeleting(true);
      await courseCategoryService.remove(deleteTarget.id);
      toast.success('Category deleted');
      setDeleteTarget(null);
      await fetchCats();
      onChanged();
    } catch {
      toast.error('Failed to delete');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center px-3 sm:px-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" onClick={onClose} />
      <div className="relative z-10 w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90dvh]">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-gradient-to-r from-[#00B8C6]/5 to-white flex-shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#00B8C6]/10 flex items-center justify-center">
              <Tag className="w-3.5 h-3.5 text-[#00B8C6]" />
            </div>
            <h2 className="text-[14px] font-bold text-slate-800">Course Categories</h2>
          </div>
          <div className="flex items-center gap-2">
            {view === 'list' && (
              <button
                onClick={() => setView('add')}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#00B8C6] text-white text-[12px] font-semibold hover:bg-[#00a3b0] transition-colors"
              >
                <Plus className="w-3 h-3" /> Add
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {view === 'add' && (
            <div className="px-5 py-5 space-y-4">
              <div>
                <label className={LABEL_CLASS}>
                  Name <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  value={addName}
                  autoFocus
                  onChange={(e) => {
                    setAddName(e.target.value);
                    setAddSlug(slugFromName(e.target.value));
                  }}
                  placeholder="e.g. Campus-to-Corporate Programs"
                  className={INPUT_CLASS}
                />
              </div>
              <div>
                <label className={LABEL_CLASS}>Slug</label>
                <input
                  type="text"
                  value={addSlug}
                  onChange={(e) => setAddSlug(e.target.value)}
                  placeholder="campus-to-corporate-programs"
                  className={`${INPUT_CLASS} font-mono text-[12px]`}
                />
              </div>
              <div>
                <label className={LABEL_CLASS}>
                  Description <span className="text-slate-300">(optional)</span>
                </label>
                <input
                  type="text"
                  value={addDesc}
                  onChange={(e) => setAddDesc(e.target.value)}
                  placeholder="Short description…"
                  className={INPUT_CLASS}
                />
              </div>
            </div>
          )}

          {view === 'list' && (
            <div className="divide-y divide-slate-100">
              {loading ? (
                [...Array(4)].map((_, i) => (
                  <div key={i} className="h-12 mx-4 my-2 rounded-lg bg-slate-100 animate-pulse" />
                ))
              ) : categories.length === 0 ? (
                <div className="text-center py-10 px-4">
                  <Tag className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                  <p className="text-[13px] text-slate-500 font-medium">No categories yet</p>
                </div>
              ) : (
                categories.map((cat, idx) => (
                  <div
                    key={cat.id}
                    className="flex items-center gap-3 px-5 py-3 hover:bg-slate-50 group transition-colors"
                  >
                    <span className="w-6 h-6 rounded-md bg-[#00B8C6]/10 flex items-center justify-center text-[#00B8C6] font-bold text-[10px] flex-shrink-0">
                      {idx + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-semibold text-slate-800 truncate">{cat.name}</p>
                      <p className="text-[10px] text-slate-400 font-mono truncate">{cat.slug}</p>
                    </div>
                    <button
                      onClick={() => setDeleteTarget(cat)}
                      className="opacity-0 group-hover:opacity-100 w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-all flex-shrink-0"
                      title="Delete category"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        <div className="flex-shrink-0 px-5 py-4 border-t border-slate-100 bg-slate-50/60 flex items-center justify-end gap-2">
          {view === 'add' ? (
            <>
              <button
                onClick={() => setView('list')}
                className="px-4 py-2 rounded-lg text-[13px] font-medium text-slate-600 hover:bg-slate-100 transition-colors"
              >
                Back
              </button>
              <button
                onClick={handleAdd}
                disabled={saving}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#00B8C6] text-white text-[13px] font-semibold hover:bg-[#00a3b0] transition-colors disabled:opacity-50 shadow-sm"
              >
                {saving ? (
                  <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <Save className="w-3.5 h-3.5" />
                )}
                Create
              </button>
            </>
          ) : (
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-[13px] font-medium text-slate-600 hover:bg-slate-100 transition-colors"
            >
              Close
            </button>
          )}
        </div>
      </div>

      {deleteTarget && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center px-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-[2px]"
            onClick={() => setDeleteTarget(null)}
          />
          <div className="relative z-10 w-full max-w-sm bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="h-1 w-full bg-rose-500" />
            <div className="px-5 pt-5 pb-6">
              <p className="text-sm font-bold text-slate-800 mb-4">Delete {deleteTarget.name}?</p>
              <div className="flex gap-2">
                <button
                  onClick={() => setDeleteTarget(null)}
                  className="flex-1 py-2 rounded-lg border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="flex-1 py-2 rounded-lg bg-rose-500 text-white text-sm font-bold hover:bg-rose-600 disabled:opacity-50"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
