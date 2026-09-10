import { useState, type FormEvent } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { productService } from "../../services/productService";
import { categoryService } from "../../services/categoryService";
import AdminLayout from "../../components/layout/AdminLayout";
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
    queryFn: () => productService.getAll({ page, limit: 12 }),
  });

  const { data: categoriesRes } = useQuery({
    queryKey: ["categories"],
    queryFn: () => categoryService.getAll(),
  });

  const categories = categoriesRes?.data || [];
  const products = data?.data || [];

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

  const getCategoryName = (categoryId: string | object | undefined) => {
    if (!categoryId) return "Uncategorized";
    const id = typeof categoryId === "object" ? (categoryId as any)._id : categoryId;
    return categories.find((c) => c._id === id)?.name || "Uncategorized";
  };

  return (
    <AdminLayout>
      <div className="w-full px-4 sm:px-6 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            <div>
              <div className="text-sm font-semibold text-[#0e7c85] uppercase tracking-wider mb-2">Admin Panel</div>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">Manage Products</h1>
              <p className="text-gray-600 mt-2">Add, edit and manage products in your collection.</p>
            </div>
            <button
              onClick={openCreateForm}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-all duration-200 font-semibold text-sm sm:text-base whitespace-nowrap"
            >
              <span className="text-xl">+</span> Add Product
            </button>
          </div>

          {/* Products Grid */}
          {isLoading ? (
            <div className="text-center py-12">
              <p className="text-gray-600">Loading products...</p>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 mb-4">No products yet. Create one to get started.</p>
              <button
                onClick={openCreateForm}
                className="inline-flex items-center gap-2 px-4 py-2 bg-[#0e7c85] text-white rounded-lg hover:bg-[#1a6b94] transition-colors"
              >
                <span>+</span> Create First Product
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                {products.map((product) => (
                  <div
                    key={product._id}
                    className="glass rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 group border border-white/20"
                  >
                    {/* Product Image */}
                    <div className="relative overflow-hidden bg-gray-200 h-48 sm:h-56">
                      {product.images && product.images.length > 0 ? (
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-300">
                          <span className="text-gray-600 text-4xl">📦</span>
                        </div>
                      )}
                      {/* Status Badge */}
                      <div className="absolute top-3 right-3">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide ${
                            product.status === "active"
                              ? "bg-green-500/90 text-white"
                              : product.status === "draft"
                                ? "bg-yellow-500/90 text-white"
                                : "bg-gray-500/90 text-white"
                          }`}
                        >
                          {product.status}
                        </span>
                      </div>
                    </div>

                    {/* Product Info */}
                    <div className="p-4 sm:p-5 space-y-3">
                      <div>
                        <h3 className="font-bold text-gray-900 text-sm sm:text-base line-clamp-2 hover:text-[#0e7c85]">
                          {product.name}
                        </h3>
                        <p className="text-xs text-[#0e7c85] font-semibold mt-1">{getCategoryName(product.category_id)}</p>
                      </div>

                      {/* Product Details */}
                      <div className="grid grid-cols-2 gap-3 py-2 border-t border-white/20 border-b border-white/20">
                        <div>
                          <p className="text-xs text-gray-600 font-medium">Price</p>
                          <p className="font-bold text-[#0e7c85] text-sm">{formatCurrency(product.price)}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600 font-medium">Stock</p>
                          <p className={`font-bold text-sm ${product.stock > 0 ? "text-green-600" : "text-red-600"}`}>
                            {product.stock} {product.stock > 0 ? "available" : "out"}
                          </p>
                        </div>
                      </div>

                      {/* SKU */}
                      <div className="text-xs text-gray-600">
                        <span className="font-medium">SKU:</span> <span className="font-mono text-[#0e7c85]">{product.sku}</span>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2 pt-2">
                        <button
                          onClick={() => openEditForm(product)}
                          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-[#0e7c85]/10 hover:bg-[#0e7c85]/20 text-[#0e7c85] rounded-lg transition-all duration-200 font-medium text-sm"
                        >
                          <EditIcon />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(product._id)}
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

              {/* Pagination */}
              {data?.pagination && <Pagination pagination={data.pagination} onPageChange={setPage} />}
            </>
          )}
        </div>
      </div>

      {/* Modal */}
      <Modal isOpen={showForm} onClose={() => setShowForm(false)} title={editingId ? "Edit Product" : "Add Product"}>
        <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto">
          {error && <p className="text-sm text-red-600 bg-red-50 p-3 rounded">{error}</p>}

          <input
            type="text"
            placeholder="Product Name"
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
          <textarea
            placeholder="Description"
            required
            rows={3}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0e7c85]"
          />
          <input
            type="text"
            placeholder="SKU"
            required
            value={form.sku}
            onChange={(e) => setForm({ ...form, sku: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0e7c85]"
          />

          <div className="grid grid-cols-2 gap-3">
            <input
              type="number"
              placeholder="Price"
              required
              min={0}
              step={0.01}
              value={form.price}
              onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
              className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0e7c85]"
            />
            <input
              type="number"
              placeholder="Cost price (optional)"
              min={0}
              step={0.01}
              value={form.cost_price ?? ""}
              onChange={(e) => setForm({ ...form, cost_price: e.target.value ? Number(e.target.value) : undefined })}
              className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0e7c85]"
            />
          </div>

          <input
            type="number"
            placeholder="Stock"
            required
            min={0}
            value={form.stock}
            onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0e7c85]"
          />

          <select
            required
            value={form.category_id}
            onChange={(e) => setForm({ ...form, category_id: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0e7c85]"
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
            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0e7c85]"
          >
            <option value="draft">Draft</option>
            <option value="active">Active</option>
            <option value="archived">Archived</option>
          </select>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Images {editingId && "(leave empty to keep current)"}
            </label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => setImageFiles(e.target.files)}
              className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-[#0e7c85]/10 file:text-[#0e7c85] hover:file:bg-[#0e7c85]/20 cursor-pointer"
            />
          </div>

          <button
            type="submit"
            disabled={isSaving}
            className="w-full bg-linear-to-r from-[#0e7c85] to-cyan-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? "Saving..." : editingId ? "Update Product" : "Create Product"}
          </button>
        </form>
      </Modal>
    </AdminLayout>
  );
};

export default ManageProducts;
