import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Power, MoveUp, MoveDown, Check, X, AlertCircle } from 'lucide-react';
import { Category } from '../../types';
import { CategoryService } from '../../services/categoryService';
import { DynamicIcon } from '../../components/common/DynamicIcon';

export const AdminCategoriesPage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const loadCategories = async () => {
    setLoading(true);
    const data = await CategoryService.getAllForAdmin();
    setCategories(data);
    setLoading(false);
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleToggleActive = async (category: Category) => {
    const updated = { ...category, isActive: !category.isActive };
    await CategoryService.saveCategory(updated);
    setMessage({ text: `Category "${category.name}" ${updated.isActive ? 'activated' : 'deactivated'}.`, type: 'success' });
    loadCategories();
  };

  const handleDelete = async (category: Category) => {
    if (!window.confirm(`Are you sure you want to delete category "${category.name}"?`)) return;

    const res = await CategoryService.deleteCategory(category.id);
    if (res.success) {
      setMessage({ text: `Category "${category.name}" removed successfully.`, type: 'success' });
      loadCategories();
    } else {
      setMessage({ text: res.message || 'Cannot delete category.', type: 'error' });
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory) return;

    const slug = editingCategory.slug || editingCategory.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const toSave: Category = {
      ...editingCategory,
      slug,
      order: editingCategory.order || (categories.length + 1),
      isActive: editingCategory.isActive !== undefined ? editingCategory.isActive : true
    };

    await CategoryService.saveCategory(toSave);
    setMessage({ text: `Category "${toSave.name}" saved successfully.`, type: 'success' });
    setEditingCategory(null);
    setIsNew(false);
    loadCategories();
  };

  const handleMove = async (index: number, direction: 'up' | 'down') => {
    const newIdx = direction === 'up' ? index - 1 : index + 1;
    if (newIdx < 0 || newIdx >= categories.length) return;

    const copy = [...categories];
    const temp = copy[index];
    copy[index] = copy[newIdx];
    copy[newIdx] = temp;

    const orderedIds = copy.map(c => c.id);
    await CategoryService.reorderCategories(orderedIds);
    loadCategories();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Category Management
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Administer all 20 local business categories, slugs, order, and active states.
          </p>
        </div>

        <button
          onClick={() => {
            setIsNew(true);
            setEditingCategory({
              id: 'cat-' + Date.now().toString(36),
              name: '',
              slug: '',
              description: '',
              icon: 'Building2',
              order: categories.length + 1,
              isActive: true,
            });
          }}
          className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm flex items-center space-x-1.5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Category</span>
        </button>
      </div>

      {message && (
        <div
          className={`p-3.5 rounded-xl text-xs font-semibold flex items-center justify-between ${
            message.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-red-50 text-red-800 border border-red-200'
          }`}
        >
          <span>{message.text}</span>
          <button onClick={() => setMessage(null)} className="text-slate-500 hover:text-slate-800">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Categories Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-bold border-b border-slate-200">
              <tr>
                <th className="px-4 py-3.5 w-12 text-center">Order</th>
                <th className="px-4 py-3.5">Category & Icon</th>
                <th className="px-4 py-3.5">Slug</th>
                <th className="px-4 py-3.5">Description</th>
                <th className="px-4 py-3.5 text-center">Status</th>
                <th className="px-4 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {categories.map((cat, index) => (
                <tr key={cat.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-4 py-3 text-center">
                    <div className="flex items-center justify-center space-x-1">
                      <span className="font-bold text-slate-700 w-4">{cat.order || index + 1}</span>
                      <div className="flex flex-col">
                        <button
                          disabled={index === 0}
                          onClick={() => handleMove(index, 'up')}
                          className="p-0.5 hover:text-blue-600 disabled:opacity-20"
                        >
                          <MoveUp className="w-3 h-3" />
                        </button>
                        <button
                          disabled={index === categories.length - 1}
                          onClick={() => handleMove(index, 'down')}
                          className="p-0.5 hover:text-blue-600 disabled:opacity-20"
                        >
                          <MoveDown className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                        <DynamicIcon name={cat.icon} className="w-4 h-4" />
                      </div>
                      <span className="font-bold text-slate-900">{cat.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 font-mono text-slate-500">{cat.slug}</td>
                  <td className="px-4 py-3 text-slate-600 max-w-xs truncate">{cat.description}</td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => handleToggleActive(cat)}
                      className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        cat.isActive !== false
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      <Power className="w-3 h-3" />
                      <span>{cat.isActive !== false ? 'Active' : 'Inactive'}</span>
                    </button>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => {
                          setIsNew(false);
                          setEditingCategory(cat);
                        }}
                        className="p-1.5 text-slate-600 hover:text-blue-600 rounded-lg hover:bg-slate-100"
                        title="Edit category"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(cat)}
                        className="p-1.5 text-slate-600 hover:text-red-600 rounded-lg hover:bg-slate-100"
                        title="Delete category"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit / Create Modal */}
      {editingCategory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl relative border border-slate-200 admin-modal text-slate-900">
            <button
              onClick={() => setEditingCategory(null)}
              className="absolute top-4 right-4 p-1 text-slate-400 hover:text-slate-700"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-slate-900 mb-4">
              {isNew ? 'Create New Category' : `Edit Category: ${editingCategory.name}`}
            </h3>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Category Name *
                </label>
                <input
                  type="text"
                  required
                  value={editingCategory.name}
                  onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
                  placeholder="e.g. Restaurants and Cafes"
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus-ring"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  URL Slug
                </label>
                <input
                  type="text"
                  value={editingCategory.slug}
                  onChange={(e) => setEditingCategory({ ...editingCategory, slug: e.target.value })}
                  placeholder="restaurants-and-cafes"
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus-ring font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Lucide Icon Name
                </label>
                <input
                  type="text"
                  value={editingCategory.icon}
                  onChange={(e) => setEditingCategory({ ...editingCategory, icon: e.target.value })}
                  placeholder="UtensilsCrossed, Hotel, Shirt, etc."
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus-ring"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={editingCategory.description}
                  onChange={(e) => setEditingCategory({ ...editingCategory, description: e.target.value })}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus-ring"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingCategory(null)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md"
                >
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
