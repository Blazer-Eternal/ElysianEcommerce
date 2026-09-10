import { useState, type FormEvent } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { couponService } from "../../services/couponService";
import AdminLayout from "../../components/layout/AdminLayout";
import Modal from "../../components/ui/Modal";
import { formatCurrency } from "../../utils/formatCurrency";
import { formatDate } from "../../utils/formatDate";
import { getErrorMessage } from "../../utils/getErrorMessage";
import type { Coupon, CreateCouponPayload, DiscountType } from "../../types/coupon.types";

const emptyForm: CreateCouponPayload = {
  code: "",
  discount_type: "percentage",
  value: 0,
  min_order_amount: 0,
  expiry_date: "",
  usage_limit: null,
  is_active: true,
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

const CouponIcon = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 9.5c0 .83-.67 1.5-1.5 1.5S11 13.33 11 12.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5z" />
  </svg>
);

const ManageCoupons = () => {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<CreateCouponPayload>(emptyForm);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["admin", "coupons"],
    queryFn: () => couponService.getAll(),
  });

  const coupons = data?.data || [];

  const openCreateForm = () => {
    setEditingId(null);
    setForm(emptyForm);
    setError(null);
    setShowForm(true);
  };

  const openEditForm = (coupon: Coupon) => {
    setEditingId(coupon._id);
    setForm({
      code: coupon.code,
      discount_type: coupon.discount_type,
      value: coupon.value,
      min_order_amount: coupon.min_order_amount,
      expiry_date: coupon.expiry_date.slice(0, 10),
      usage_limit: coupon.usage_limit,
      is_active: coupon.is_active,
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
        await couponService.update(editingId, form);
      } else {
        await couponService.create(form);
      }
      queryClient.invalidateQueries({ queryKey: ["admin", "coupons"] });
      setShowForm(false);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this coupon?")) return;
    try {
      await couponService.remove(id);
      queryClient.invalidateQueries({ queryKey: ["admin", "coupons"] });
    } catch (err) {
      alert(getErrorMessage(err));
    }
  };

  const isExpired = (expiryDate: string) => new Date(expiryDate) < new Date();

  return (
    <AdminLayout>
      <div className="w-full px-4 sm:px-6 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            <div>
              <div className="text-sm font-semibold text-[#0e7c85] uppercase tracking-wider mb-2">Admin Panel</div>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">Manage Coupons</h1>
              <p className="text-gray-600 mt-2">Create and manage discount coupons for your store.</p>
            </div>
            <button
              onClick={openCreateForm}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-all duration-200 font-semibold text-sm sm:text-base whitespace-nowrap"
            >
              <span className="text-xl">+</span> Add Coupon
            </button>
          </div>

          {/* Coupons Grid */}
          {isLoading ? (
            <div className="text-center py-12">
              <p className="text-gray-600">Loading coupons...</p>
            </div>
          ) : coupons.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 mb-4">No coupons yet. Create one to get started.</p>
              <button
                onClick={openCreateForm}
                className="inline-flex items-center gap-2 px-4 py-2 bg-[#0e7c85] text-white rounded-lg hover:bg-[#1a6b94] transition-colors"
              >
                <span>+</span> Create First Coupon
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {coupons.map((coupon) => (
                <div
                  key={coupon._id}
                  className="glass rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 group border border-white/20"
                >
                  {/* Coupon Header */}
                  <div className="relative overflow-hidden bg-linear-to-br from-[#0e7c85]/10 to-cyan-600/10 p-6 flex items-start justify-between group-hover:scale-105 transition-transform duration-300">
                    <div>
                      <div className="text-4xl font-bold text-[#0e7c85] mb-1">
                        {coupon.discount_type === "percentage" ? `${coupon.value}%` : formatCurrency(coupon.value)}
                      </div>
                      <p className="text-sm text-gray-600">Discount</p>
                    </div>
                    <div className="text-[#0e7c85]/30 group-hover:text-[#0e7c85]/60 transition-colors">
                      <CouponIcon />
                    </div>
                  </div>

                  {/* Coupon Info */}
                  <div className="p-5 sm:p-6 space-y-3">
                    {/* Coupon Code */}
                    <div>
                      <p className="text-xs text-gray-600 font-medium mb-1">Code</p>
                      <p className="text-2xl font-bold text-gray-900 font-mono tracking-wider">{coupon.code}</p>
                    </div>

                    {/* Status Badge */}
                    <div className="flex gap-2">
                      {!coupon.is_active && (
                        <span className="px-3 py-1 bg-gray-200 text-gray-700 text-xs font-bold rounded-full">
                          Inactive
                        </span>
                      )}
                      {isExpired(coupon.expiry_date) && (
                        <span className="px-3 py-1 bg-red-200 text-red-700 text-xs font-bold rounded-full">
                          Expired
                        </span>
                      )}
                      {coupon.is_active && !isExpired(coupon.expiry_date) && (
                        <span className="px-3 py-1 bg-green-200 text-green-700 text-xs font-bold rounded-full">
                          Active
                        </span>
                      )}
                    </div>

                    {/* Coupon Details Grid */}
                    <div className="grid grid-cols-2 gap-3 py-3 border-t border-white/20 border-b border-white/20">
                      <div>
                        <p className="text-xs text-gray-600 font-medium">Min Order</p>
                        <p className="font-bold text-gray-900">{formatCurrency(coupon.min_order_amount)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 font-medium">Expiry</p>
                        <p className="font-bold text-gray-900">{formatDate(coupon.expiry_date)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 font-medium">Used</p>
                        <p className="font-bold text-gray-900">
                          {coupon.used_count}
                          {coupon.usage_limit ? ` / ${coupon.usage_limit}` : " / ∞"}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 font-medium">Type</p>
                        <p className="font-bold text-gray-900 capitalize">{coupon.discount_type}</p>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 pt-2">
                      <button
                        onClick={() => openEditForm(coupon)}
                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-[#0e7c85]/10 hover:bg-[#0e7c85]/20 text-[#0e7c85] rounded-lg transition-all duration-200 font-medium text-sm"
                      >
                        <EditIcon />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(coupon._id)}
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
          )}
        </div>
      </div>

      {/* Modal */}
      <Modal isOpen={showForm} onClose={() => setShowForm(false)} title={editingId ? "Edit Coupon" : "Add Coupon"}>
        <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto">
          {error && <p className="text-sm text-red-600 bg-red-50 p-3 rounded">{error}</p>}

          <input
            type="text"
            placeholder="Code (e.g. SAVE20)"
            required
            value={form.code}
            onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0e7c85]"
          />

          <select
            value={form.discount_type}
            onChange={(e) => setForm({ ...form, discount_type: e.target.value as DiscountType })}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0e7c85]"
          >
            <option value="percentage">Percentage Discount</option>
            <option value="fixed">Fixed Amount Discount</option>
          </select>

          <input
            type="number"
            placeholder={form.discount_type === "percentage" ? "Value (0-100)" : "Value"}
            required
            min={0}
            max={form.discount_type === "percentage" ? 100 : undefined}
            step={0.01}
            value={form.value}
            onChange={(e) => setForm({ ...form, value: Number(e.target.value) })}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0e7c85]"
          />

          <input
            type="number"
            placeholder="Minimum order amount"
            min={0}
            step={0.01}
            value={form.min_order_amount}
            onChange={(e) => setForm({ ...form, min_order_amount: Number(e.target.value) })}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0e7c85]"
          />

          <input
            type="date"
            required
            value={form.expiry_date}
            onChange={(e) => setForm({ ...form, expiry_date: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0e7c85]"
          />

          <input
            type="number"
            placeholder="Usage limit (leave empty for unlimited)"
            min={1}
            value={form.usage_limit ?? ""}
            onChange={(e) => setForm({ ...form, usage_limit: e.target.value ? Number(e.target.value) : null })}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0e7c85]"
          />

          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input
              type="checkbox"
              checked={form.is_active}
              onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
              className="w-4 h-4 accent-[#0e7c85] cursor-pointer"
            />
            <span className="font-medium">Active</span>
          </label>

          <button
            type="submit"
            disabled={isSaving}
            className="w-full bg-linear-to-r from-[#0e7c85] to-cyan-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? "Saving..." : editingId ? "Update Coupon" : "Create Coupon"}
          </button>
        </form>
      </Modal>
    </AdminLayout>
  );
};

export default ManageCoupons;
