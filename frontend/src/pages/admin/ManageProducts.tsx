import { useState, type FormEvent } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { productService } from "../../services/productService";
import { categoryService } from "../../services/categoryService";
import DataTable, { type DataTableColumn } from "../../components/admin/DataTable";
import Modal from "../../components/ui/Modal";
import Pagination from "../../components/ui/Pagination";
import { formatCurrency } from "../../utils/formatCurrency";
import { getErrorMessage } from "../../utils/getErrorMessage";
import type { Product, CreateProductPayload, ProductStatus } from "../../types/product.types";

const emptyForm: CreateProductPayload = {
  name: "",
  slug: "",
  description: "",
  sku: "",
  price: 0,
  cost_price: undefined,
  stock: 0,
  category_id: "",
  images: [],
  status: "draft",
};

const ManageProducts = () => {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<CreateProductPayload>(emptyForm);
  const [imageFiles, setImageFiles] = useState<FileList | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["admin", "products", page],
    queryFn: () => productService.getAll({ page, limit: 10 }),
  });

  const { data: categoriesRes } = useQuery({
    queryKey: ["categories"],
    queryFn: () => categoryService.getAll(),
  });

  const categories = categoriesRes?.data || [];

  const openCreateForm = () => {
    setEditingId(null);
    setForm(emptyForm);
    setImageFiles(null);
    setError(null);
    setShowForm(true);
  };

  const openEditForm = (product: Product) => {
    setEditingId(product._id);
    setForm({
      name: product.name,
      slug: product.slug,
      description: product.description,
      sku: product.sku,
      price: product.price,
      cost_price: product.cost_price,
      stock: product.stock,
      category_id: typeof product.category_id === "object" ? product.category_id._id : product.category_id,
      images: product.images,
      status: product.status,
    });
    setImageFiles(null);
    setError(null);
    setShowForm(true);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSaving(true);

    try {
      let images = form.images;

      if (imageFiles && imageFiles.length > 0) {
        const uploadRes = await productService.uploadImages(Array.from(imageFiles));
        images = uploadRes.data.images;
      }

      const payload = { ...form, images };

      if (editingId) {
        await productService.update(editingId, payload);
      } else {
        await productService.create(payload);
      }

      queryClient.invalidateQueries({ queryKey: ["admin", "products"] });
      setShowForm(false);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this product?")) return;
    try {
      await productService.remove(id);
      queryClient.invalidateQueries({ queryKey: ["admin", "products"] });
    } catch (err) {
      alert(getErrorMessage(err));
    }
  };

  const columns: DataTableColumn<Product>[] = [
    { header: "Name", render: (p) => p.name },
    { header: "SKU", render: (p) => p.sku },
    { header: "Price", render: (p) => formatCurrency(p.price) },
    { header: "Stock", render: (p) => p.stock },
    { header: "Status", render: (p) => <span className="capitalize">{p.status}</span> },
    {
      header: "Actions",
      render: (p) => (
        <div className="flex gap-3">
          <button onClick={() => openEditForm(p)} className="text-xs underline">
            Edit
          </button>
          <button onClick={() => handleDelete(p._id)} className="text-xs text-red-600 underline">
            Delete
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold">Manage Products</h1>
        <button onClick={openCreateForm} className="bg-black text-white px-4 py-2 rounded text-sm">
          + Add Product
        </button>
      </div>

      <DataTable columns={columns} data={data?.data || []} isLoading={isLoading} rowKey={(p) => p._id} />

      {data?.pagination && <Pagination pagination={data.pagination} onPageChange={setPage} />}

      <Modal isOpen={showForm} onClose={() => setShowForm(false)} title={editingId ? "Edit Product" : "Add Product"}>
        <form onSubmit={handleSubmit} className="space-y-3 max-h-[70vh] overflow-y-auto">
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
            placeholder="Slug (lowercase-with-hyphens)"
            required
            value={form.slug}
            onChange={(e) => setForm({ ...form, slug: e.target.value })}
            className="w-full border rounded px-3 py-2 text-sm"
          />
          <textarea
            placeholder="Description"
            required
            rows={3}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="w-full border rounded px-3 py-2 text-sm"
          />
          <input
            type="text"
            placeholder="SKU"
            required
            value={form.sku}
            onChange={(e) => setForm({ ...form, sku: e.target.value })}
            className="w-full border rounded px-3 py-2 text-sm"
          />

          <div className="grid grid-cols-2 gap-2">
            <input
              type="number"
              placeholder="Price"
              required
              min={0}
              value={form.price}
              onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
              className="border rounded px-3 py-2 text-sm"
            />
            <input
              type="number"
              placeholder="Cost price (optional)"
              min={0}
              value={form.cost_price ?? ""}
              onChange={(e) =>
                setForm({ ...form, cost_price: e.target.value ? Number(e.target.value) : undefined })
              }
              className="border rounded px-3 py-2 text-sm"
            />
          </div>

          <input
            type="number"
            placeholder="Stock"
            required
            min={0}
            value={form.stock}
            onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })}
            className="w-full border rounded px-3 py-2 text-sm"
          />

          <select
            required
            value={form.category_id}
            onChange={(e) => setForm({ ...form, category_id: e.target.value })}
            className="w-full border rounded px-3 py-2 text-sm"
          >
            <option value="">Select category</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>

          <select
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value as ProductStatus })}
            className="w-full border rounded px-3 py-2 text-sm"
          >
            <option value="draft">Draft</option>
            <option value="active">Active</option>
            <option value="archived">Archived</option>
          </select>

          <div>
            <label className="block text-sm font-medium mb-1">
              Images {editingId && "(leave empty to keep current)"}
            </label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => setImageFiles(e.target.files)}
              className="w-full text-sm"
            />
          </div>

          <button
            type="submit"
            disabled={isSaving}
            className="w-full bg-black text-white py-2 rounded text-sm disabled:opacity-50"
          >
            {isSaving ? "Saving..." : editingId ? "Update Product" : "Create Product"}
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default ManageProducts;
