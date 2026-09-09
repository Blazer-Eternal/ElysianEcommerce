import { useState, type FormEvent } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { couponService } from "../../services/couponService";
import DataTable, { type DataTableColumn } from "../../components/admin/DataTable";
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

  const columns: DataTableColumn<Coupon>[] = [
    { header: "Code", render: (c) => c.code },
    {
      header: "Discount",
      render: (c) => (c.discount_type === "percentage" ? `${c.value}%` : formatCurrency(c.value)),
    },
    { header: "Min Order", render: (c) => formatCurrency(c.min_order_amount) },
    { header: "Expiry", render: (c) => formatDate(c.expiry_date) },
    { header: "Used", render: (c) => `${c.used_count}${c.usage_limit ? ` / ${c.usage_limit}` : ""}` },
    { header: "Active", render: (c) => (c.is_active ? "Yes" : "No") },
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
        <h1 className="text-xl font-bold">Manage Coupons</h1>
        <button onClick={openCreateForm} className="bg-black text-white px-4 py-2 rounded text-sm">
          + Add Coupon
        </button>
      </div>

      <DataTable columns={columns} data={coupons} isLoading={isLoading} rowKey={(c) => c._id} />

      <Modal isOpen={showForm} onClose={() => setShowForm(false)} title={editingId ? "Edit Coupon" : "Add Coupon"}>
        <form onSubmit={handleSubmit} className="space-y-3">
          {error && <p className="text-sm text-red-600">{error}</p>}

          <input
            type="text"
            placeholder="Code (e.g. SAVE20)"
            required
            value={form.code}
            onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
            className="w-full border rounded px-3 py-2 text-sm"
          />

          <select
            value={form.discount_type}
            onChange={(e) => setForm({ ...form, discount_type: e.target.value as DiscountType })}
            className="w-full border rounded px-3 py-2 text-sm"
          >
            <option value="percentage">Percentage</option>
            <option value="fixed">Fixed Amount</option>
          </select>

          <input
            type="number"
            placeholder={form.discount_type === "percentage" ? "Value (0-100)" : "Value"}
            required
            min={0}
            max={form.discount_type === "percentage" ? 100 : undefined}
            value={form.value}
            onChange={(e) => setForm({ ...form, value: Number(e.target.value) })}
            className="w-full border rounded px-3 py-2 text-sm"
          />

          <input
            type="number"
            placeholder="Minimum order amount"
            min={0}
            value={form.min_order_amount}
            onChange={(e) => setForm({ ...form, min_order_amount: Number(e.target.value) })}
            className="w-full border rounded px-3 py-2 text-sm"
          />

          <input
            type="date"
            required
            value={form.expiry_date}
            onChange={(e) => setForm({ ...form, expiry_date: e.target.value })}
            className="w-full border rounded px-3 py-2 text-sm"
          />

          <input
            type="number"
            placeholder="Usage limit (empty = unlimited)"
            min={1}
            value={form.usage_limit ?? ""}
            onChange={(e) => setForm({ ...form, usage_limit: e.target.value ? Number(e.target.value) : null })}
            className="w-full border rounded px-3 py-2 text-sm"
          />

          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.is_active}
              onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
            />
            Active
          </label>

          <button
            type="submit"
            disabled={isSaving}
            className="w-full bg-black text-white py-2 rounded text-sm disabled:opacity-50"
          >
            {isSaving ? "Saving..." : editingId ? "Update Coupon" : "Create Coupon"}
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default ManageCoupons;
