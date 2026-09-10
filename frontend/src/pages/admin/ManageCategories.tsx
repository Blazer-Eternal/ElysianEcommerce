import { useState, type FormEvent } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { categoryService } from "../../services/categoryService";
import AdminLayout from "../../components/layout/AdminLayout";
import Modal from "../../components/ui/Modal";
import { getErrorMessage } from "../../utils/getErrorMessage";
import type { Category, CreateCategoryPayload } from "../../types/category.types";

const emptyForm: CreateCategoryPayload = { name: "", slug: "", parent_id: null, description: "" };

const EditIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);

const DeleteIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    <line x1="10" y1="11" x2="10" y2="17" />
    <line x1="14" y1="11" x2="14" y2="17" />
  </svg>
);

const CategoryIcon = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
  </svg>
);

const ManageCategories = () => {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<CreateCategoryPayload>(emptyForm);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["admin", "categories"],
    queryFn: () => categoryService.getAll(),
  });

  const allCategoriesQuery = useQuery({
    queryKey: ["admin", "categories", "all"],
    queryFn: () => categoryService.getAll(),
  });

  const categories = data?.data || [];
  const allCategories = allCategoriesQuery.data?.data || [];

  const openCreateForm = () => {
    setEditingId(null);
    setForm(emptyForm);
    setError(null);
    setShowForm(true);
  };

  const openEditForm = (category: Category) => {
    setEditingId(category._id);
    setForm({
      name: category.name,
      slug: category.slug,
      parent_id: typeof category.parent_id === "object" ? category.parent_id?._id ?? null : category.parent_id,
      description: category.description || "",
    });
    setError(null);
    setShowForm(true);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSaving(true);

    try {
      if (editingId) {
        await categoryService.update(editingId, form);
      } else {
        await categoryService.create(form);
      }
      queryClient.invalidateQueries({ queryKey: ["admin", "categories"] });
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      setShowForm(false);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this category?")) return;
    try {
      await categoryService.remove(id);
      queryClient.invalidateQueries({ queryKey: ["admin", "categories"] });
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    } catch (err) {
      alert(getErrorMessage(err));
    }
  };

  const getParentName = (parentId: string | object | null | undefined) => {
    if (!parentId) return "Top-level";
    const id = typeof parentId === "object" ? (parentId as any)._id : parentId;
    return allCategories.find((c) => c._id === id)?.name || "Unknown";
  };

  return (
    <AdminLayout>
      <div className="w-full px-4 sm:px-6 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            <div>
              <div className="text-sm font-semibold text-[#0e7c85] uppercase tracking-wider mb-2">Admin Panel</div>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">Manage Categories</h1>
              <p className="text-gray-600 mt-2">Add, edit and manage product categories.</p>
            </div>
            <button
              onClick={openCreateForm}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-all duration-200 font-semibold text-sm sm:text-base whitespace-nowrap"
            >
              <span className="text-xl">+</span> Add Category
            </button>
          </div>

          {/* Categories Grid */}
          {isLoading ? (
            <div className="text-center py-12">
              <p className="text-gray-600">Loading categories...</p>
            </div>
          ) : categories.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 mb-4">No categories yet. Create one to get started.</p>
              <button
                onClick={openCreateForm}
                className="inline-flex items-center gap-2 px-4 py-2 bg-[#0e7c85] text-white rounded-lg hover:bg-[#1a6b94] transition-colors"
              >
                <span>+</span> Create First Category
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                {categories.map((category) => (
                  <div
                    key={category._id}
                    className="glass rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 group border border-white/20"
                  >
                    {/* Category Icon Background */}
                    <div className="relative overflow-hidden bg-linear-to-br from-[#0e7c85]/10 to-cyan-600/10 h-48 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                      <div className="text-[#0e7c85]/60 group-hover:text-[#0e7c85] transition-colors">
                        <CategoryIcon />
                      </div>
                    </div>

                    {/* Category Info */}
                    <div className="p-5 sm:p-6 space-y-3">
                      <div>
                        <h3 className="font-bold text-gray-900 text-lg line-clamp-2 hover:text-[#0e7c85]">
                          {category.name}
                        </h3>
                        <p className="text-xs text-[#0e7c85] font-semibold mt-1 uppercase tracking-wider">
                          {getParentName(category.parent_id)}
                        </p>
                      </div>

                      {/* Category Details */}
                      {category.description && (
                        <p className="text-sm text-gray-600 line-clamp-3">{category.description}</p>
                      )}

                      {/* Slug */}
                      <div className="text-xs text-gray-600 py-2 border-t border-b border-white/20">
                        <span className="font-medium">Slug:</span> <span className="font-mono text-[#0e7c85]">{category.slug}</span>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2 pt-2">
                        <button
                          onClick={() => openEditForm(category)}
                          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-[#0e7c85]/10 hover:bg-[#0e7c85]/20 text-[#0e7c85] rounded-lg transition-all duration-200 font-medium text-sm"
                        >
                          <EditIcon />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(category._id)}
                          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-600 rounded-lg transition-all duration-200 font-medium text-sm"
                        >
                          <DeleteIcon />
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Modal */}
      <Modal isOpen={showForm} onClose={() => setShowForm(false)} title={editingId ? "Edit Category" : "Add Category"}>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <p className="text-sm text-red-600 bg-red-50 p-3 rounded">{error}</p>}

          <input
            type="text"
            placeholder="Category Name"
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0e7c85]"
          />
          <input
            type="text"
            placeholder="Slug (lowercase-with-hyphens)"
            required
            value={form.slug}
            onChange={(e) => setForm({ ...form, slug: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0e7c85]"
          />
          <select
            value={form.parent_id || ""}
            onChange={(e) => setForm({ ...form, parent_id: e.target.value || null })}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0e7c85]"
          >
            <option value="">No parent (top-level)</option>
            {allCategories
              .filter((c) => c._id !== editingId)
              .map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
          </select>
          <textarea
            placeholder="Description (optional)"
            rows={3}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0e7c85]"
          />

          <button
            type="submit"
            disabled={isSaving}
            className="w-full bg-linear-to-r from-[#0e7c85] to-cyan-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? "Saving..." : editingId ? "Update Category" : "Create Category"}
          </button>
        </form>
      </Modal>
    </AdminLayout>
  );
};

export default ManageCategories;
