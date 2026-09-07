import { useState, type FormEvent } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { categoryService } from "../../services/categoryService";
import DataTable, { type DataTableColumn } from "../../components/admin/DataTable";
import Modal from "../../components/ui/Modal";
import { getErrorMessage } from "../../utils/getErrorMessage";
import type { Category, CreateCategoryPayload } from "../../types/category.types";

const emptyForm: CreateCategoryPayload = { name: "", slug: "", parent_id: null, description: "" };

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

  const categories = data?.data || [];

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

  const columns: DataTableColumn<Category>[] = [
    { header: "Name", render: (c) => c.name },
    { header: "Slug", render: (c) => c.slug },
    {
      header: "Parent",
      render: (c) => (typeof c.parent_id === "object" && c.parent_id ? c.parent_id.name : "—"),
    },
    {
      header: "Actions",
      render: (c) => (
        <div className="flex gap-3">
          <button onClick={() => openEditForm(c)} className="text-xs underline">
            Edit
          </button>
          <button onClick={() => handleDelete(c._id)} className="text-xs text-red-600 underline">
            Delete
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold">Manage Categories</h1>
        <button onClick={openCreateForm} className="bg-black text-white px-4 py-2 rounded text-sm">
          + Add Category
        </button>
      </div>

      <DataTable columns={columns} data={categories} isLoading={isLoading} rowKey={(c) => c._id} />

      <Modal isOpen={showForm} onClose={() => setShowForm(false)} title={editingId ? "Edit Category" : "Add Category"}>
        <form onSubmit={handleSubmit} className="space-y-3">
          {error && <p className="text-sm text-red-600">{error}</p>}

          <input
            type="text"
            placeholder="Name"
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full border rounded px-3 py-2 text-sm"
          />
          <input
            type="text"
            placeholder="Slug"
            required
            value={form.slug}
            onChange={(e) => setForm({ ...form, slug: e.target.value })}
            className="w-full border rounded px-3 py-2 text-sm"
          />
          <select
            value={form.parent_id || ""}
            onChange={(e) => setForm({ ...form, parent_id: e.target.value || null })}
            className="w-full border rounded px-3 py-2 text-sm"
          >
            <option value="">No parent (top-level)</option>
            {categories
              .filter((c) => c._id !== editingId)
              .map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
          </select>
          <textarea
            placeholder="Description (optional)"
            rows={2}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="w-full border rounded px-3 py-2 text-sm"
          />

          <button
            type="submit"
            disabled={isSaving}
            className="w-full bg-black text-white py-2 rounded text-sm disabled:opacity-50"
          >
            {isSaving ? "Saving..." : editingId ? "Update Category" : "Create Category"}
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default ManageCategories;