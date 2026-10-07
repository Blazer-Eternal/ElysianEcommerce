import { useState, type FormEvent } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import CustomerLayout from "../../components/layout/CustomerLayout";
import Spinner from "../../components/ui/Spinner";
import { userService, type AddressPayload } from "../../services/userService";
import { useAuth } from "../../hooks/useAuth";
import { getErrorMessage } from "../../utils/getErrorMessage";
import type { Address } from "../../types/user.types";
import { CheckIcon, MapPinIcon, PencilIcon, PlusIcon, TrashIcon } from "../../components/icons";

const CARD = "rounded-2xl border border-[#ece1d0] bg-white p-6 shadow-[0_2px_16px_rgba(61,5,12,0.06)]";

const emptyAddress: AddressPayload = {
  street: "",
  city: "",
  state: "",
  zip: "",
  country: "",
  is_default: false,
};

const inputClass =
  "w-full border border-[#ece1d0] rounded-lg px-4 py-3 text-sm bg-cream/70 focus:outline-none focus:border-brand/40 focus:ring-2 focus:ring-brand/20 focus:bg-white";

/**
 * Dedicated address book. The form and mutations are the same ones the account
 * page used to host, now reachable straight from the portal rail.
 */
const Addresses = () => {
  const { user } = useAuth();
  const userId = user?.id as string;
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["user", userId],
    queryFn: ({ signal }) => userService.getById(userId, { signal }),
    enabled: !!userId,
  });

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<AddressPayload>(emptyAddress);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const profileUser = data?.data;

  const refresh = () => queryClient.invalidateQueries({ queryKey: ["user", userId] });

  const openAddForm = () => {
    setEditingId(null);
    setForm(emptyAddress);
    setError(null);
    setShowForm(true);
  };

  const openEditForm = (address: Address) => {
    setEditingId(address._id || null);
    setForm({
      street: address.street,
      city: address.city,
      state: address.state,
      zip: address.zip,
      country: address.country,
      is_default: address.is_default,
    });
    setError(null);
    setShowForm(true);
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    setIsSaving(true);
    try {
      if (editingId) {
        await userService.updateAddress(userId, editingId, form);
      } else {
        await userService.addAddress(userId, form);
      }
      await refresh();
      setShowForm(false);
      setForm(emptyAddress);
      setEditingId(null);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsSaving(false);
    }
  };

  const handleRemove = async (addressId: string) => {
    if (!confirm("Remove this address?")) return;
    try {
      await userService.removeAddress(userId, addressId);
      await refresh();
    } catch (err) {
      alert(getErrorMessage(err));
    }
  };

  if (isLoading || !profileUser) {
    return (
      <CustomerLayout>
        <div className="py-24">
          <Spinner size="lg" />
        </div>
      </CustomerLayout>
    );
  }

  const addresses = profileUser.addresses;

  return (
    <CustomerLayout>
      <div className="mx-auto max-w-3xl space-y-6 px-4 py-6 sm:px-6 sm:py-8">
        {/* Header */}
        <section className={CARD}>
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-green-50 text-green-600">
                <MapPinIcon size={22} />
              </span>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Addresses</h1>
                <p className="text-sm text-gray-500">
                  Saved delivery addresses used at checkout.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={openAddForm}
              disabled={showForm && !editingId}
              className="inline-flex items-center gap-1.5 rounded-xl bg-brand px-4 py-2.5 text-sm font-semibold text-white shadow-[0_1px_3px_rgba(61,5,12,0.14)] transition-colors hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-50"
            >
              <PlusIcon size={16} /> Add address
            </button>
          </div>
        </section>

        {/* Address book */}
        <section className={CARD}>
          <div className="flex items-center gap-2.5">
            <h2 className="text-base font-bold text-gray-900">Saved addresses</h2>
            <span className="rounded-full bg-cream px-2 py-0.5 text-[11px] font-semibold text-ink/60">
              {addresses.length}
            </span>
          </div>

          {addresses.length === 0 && !showForm ? (
            <div className="mt-4 rounded-2xl border border-dashed border-sand bg-cream/60 p-10 text-center">
              <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-white text-ink/40">
                <MapPinIcon size={22} />
              </span>
              <p className="mt-3 text-sm font-semibold text-gray-900">No saved addresses yet</p>
              <p className="mx-auto mt-1 max-w-sm text-sm text-gray-500">
                Add a delivery address once and it will be waiting for you at checkout.
              </p>
              <button
                type="button"
                onClick={openAddForm}
                className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-brand px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-dark"
              >
                <PlusIcon size={15} /> Add your first address
              </button>
            </div>
          ) : (
            <ul className="mt-4 space-y-3">
              {addresses.map((address) => (
                <li
                  key={address._id}
                  className="flex items-start justify-between gap-4 rounded-xl border border-[#ece1d0] bg-cream/60 p-4"
                >
                  <div className="min-w-0">
                    <p className="text-sm leading-relaxed text-gray-800">
                      {address.street}, {address.city}, {address.state} {address.zip},{" "}
                      {address.country}
                    </p>
                    {address.is_default && (
                      <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-green-50 px-2 py-0.5 text-[11px] font-semibold text-green-700">
                        <CheckIcon size={12} /> Default
                      </span>
                    )}
                  </div>

                  <div className="flex shrink-0 items-center gap-3">
                    <button
                      type="button"
                      onClick={() => openEditForm(address)}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-brand hover:underline"
                    >
                      <PencilIcon size={13} /> Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => address._id && handleRemove(address._id)}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-red-600 hover:underline"
                    >
                      <TrashIcon size={13} /> Remove
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Add / edit form */}
        {showForm && (
          <section className={CARD}>
            <h2 className="text-base font-bold text-gray-900">
              {editingId ? "Edit address" : "New address"}
            </h2>

            <form onSubmit={handleSubmit} className="mt-4 space-y-3">
              {error && <p className="text-sm text-red-600">{error}</p>}

              <input
                id="addr-street"
                name="street"
                type="text"
                aria-label="Street"
                autoComplete="street-address"
                placeholder="Street"
                required
                value={form.street}
                onChange={(event) => setForm({ ...form, street: event.target.value })}
                className={inputClass}
              />

              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                <input
                  id="addr-city"
                  name="city"
                  type="text"
                  aria-label="City"
                  autoComplete="address-level2"
                  placeholder="City"
                  required
                  value={form.city}
                  onChange={(event) => setForm({ ...form, city: event.target.value })}
                  className={inputClass}
                />
                <input
                  id="addr-state"
                  name="state"
                  type="text"
                  aria-label="State"
                  autoComplete="address-level1"
                  placeholder="State"
                  required
                  value={form.state}
                  onChange={(event) => setForm({ ...form, state: event.target.value })}
                  className={inputClass}
                />
              </div>

              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                <input
                  id="addr-zip"
                  name="zip"
                  type="text"
                  aria-label="Zip"
                  autoComplete="postal-code"
                  placeholder="Zip"
                  required
                  value={form.zip}
                  onChange={(event) => setForm({ ...form, zip: event.target.value })}
                  className={inputClass}
                />
                <input
                  id="addr-country"
                  name="country"
                  type="text"
                  aria-label="Country"
                  autoComplete="country-name"
                  placeholder="Country"
                  required
                  value={form.country}
                  onChange={(event) => setForm({ ...form, country: event.target.value })}
                  className={inputClass}
                />
              </div>

              <label htmlFor="default-address" className="flex items-center gap-2 text-sm">
                <input
                  id="default-address"
                  name="is_default"
                  type="checkbox"
                  checked={form.is_default}
                  onChange={(event) => setForm({ ...form, is_default: event.target.checked })}
                />
                Set as default
              </label>

              <div className="flex gap-2 pt-1">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="bg-brand text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-brand-dark transition-colors disabled:opacity-50"
                >
                  {isSaving ? "Saving..." : editingId ? "Update address" : "Add address"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingId(null);
                    setError(null);
                  }}
                  className="px-5 py-2.5 rounded-lg text-sm border border-[#ece1d0] hover:bg-cream"
                >
                  Cancel
                </button>
              </div>
            </form>
          </section>
        )}
      </div>
    </CustomerLayout>
  );
};

export default Addresses;
