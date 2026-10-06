import { useState, type FormEvent } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { userService, type AddressPayload } from "../../services/userService";
import { authService } from "../../services/authService";
import { useAuth } from "../../hooks/useAuth";
import { getErrorMessage } from "../../utils/getErrorMessage";
import Spinner from "../../components/ui/Spinner";
import PasswordInput from "../../components/ui/PasswordInput";
import type { Address } from "../../types/user.types";

const emptyAddress: AddressPayload = {
  street: "",
  city: "",
  state: "",
  zip: "",
  country: "",
  is_default: false,
};

const PersonIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const LockIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="11" width="18" height="11" rx="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

const CameraIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
    <circle cx="12" cy="13" r="4" />
  </svg>
);

const ShieldIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <polyline points="9 12 11 14 15 10" />
  </svg>
);

const MapPinIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

const inputClass =
  "w-full border border-[#ece1d0] rounded-lg px-4 py-3 text-sm bg-cream/70 focus:outline-none focus:border-brand/40 focus:ring-2 focus:ring-brand/20 focus:bg-white";

const Profile = () => {
  const { user } = useAuth();
  const userId = user?.id as string;
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["user", userId],
    queryFn: ({ signal }) => userService.getById(userId, { signal }),
    enabled: !!userId,
  });

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [profileError, setProfileError] = useState<string | null>(null);
  const [profileSuccess, setProfileSuccess] = useState(false);
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [isSavingPassword, setIsSavingPassword] = useState(false);

  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
  const [addressForm, setAddressForm] = useState<AddressPayload>(emptyAddress);
  const [addressError, setAddressError] = useState<string | null>(null);
  const [isSavingAddress, setIsSavingAddress] = useState(false);

  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  const profileUser = data?.data;

  if (profileUser && name === "" && email === "" && phone === "") {
    setName(profileUser.name);
    setEmail(profileUser.email);
    setPhone(profileUser.phone);
  }

  const handleProfileSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setProfileError(null);
    setIsSavingProfile(true);
    try {
      await userService.update(userId, { name, email, phone });
      setProfileSuccess(true);
      queryClient.invalidateQueries({ queryKey: ["user", userId] });
      setTimeout(() => setProfileSuccess(false), 2500);
    } catch (err) {
      setProfileError(getErrorMessage(err));
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handlePasswordSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setPasswordError(null);
    if (newPassword !== confirmNewPassword) {
      setPasswordError("New passwords do not match.");
      return;
    }
    setIsSavingPassword(true);
    try {
      await authService.changePassword({ currentPassword, newPassword });
      setPasswordSuccess(true);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
      setTimeout(() => setPasswordSuccess(false), 2500);
    } catch (err) {
      setPasswordError(getErrorMessage(err));
    } finally {
      setIsSavingPassword(false);
    }
  };

  const openAddForm = () => {
    setEditingAddressId(null);
    setAddressForm(emptyAddress);
    setAddressError(null);
    setShowAddressForm(true);
  };

  const openEditForm = (address: Address) => {
    setEditingAddressId(address._id || null);
    setAddressForm({
      street: address.street,
      city: address.city,
      state: address.state,
      zip: address.zip,
      country: address.country,
      is_default: address.is_default,
    });
    setAddressError(null);
    setShowAddressForm(true);
  };

  const handleAddressSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setAddressError(null);
    setIsSavingAddress(true);
    try {
      if (editingAddressId) {
        await userService.updateAddress(userId, editingAddressId, addressForm);
      } else {
        await userService.addAddress(userId, addressForm);
      }
      queryClient.invalidateQueries({ queryKey: ["user", userId] });
      setShowAddressForm(false);
      setAddressForm(emptyAddress);
      setEditingAddressId(null);
    } catch (err) {
      setAddressError(getErrorMessage(err));
    } finally {
      setIsSavingAddress(false);
    }
  };

  const handleRemoveAddress = async (addressId: string) => {
    if (!confirm("Remove this address?")) return;
    try {
      await userService.removeAddress(userId, addressId);
      queryClient.invalidateQueries({ queryKey: ["user", userId] });
    } catch (err) {
      alert(getErrorMessage(err));
    }
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      alert("Please choose a JPG, PNG or WEBP image.");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      alert("Image must be smaller than 2MB.");
      return;
    }
    setPhotoPreview(URL.createObjectURL(file));
  };

  if (isLoading || !profileUser) {
    return (
      <div className="py-24">
        <Spinner size="lg" />
      </div>
    );
  }

  const initials = profileUser.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">Keep your account details up to date.</p>
        <p className="flex items-center gap-1.5 text-sm text-green-700">
          <ShieldIcon /> Account protected
        </p>
      </div>

      {/* Profile information */}
      <section className="bg-white border border-[#ece1d0] rounded-2xl shadow-[0_2px_16px_rgba(61,5,12,0.06)] p-6 space-y-6">
        <div className="flex items-start gap-3">
          <div className="bg-brand/10 text-brand rounded-lg p-2">
            <PersonIcon />
          </div>
          <div>
            <h2 className="font-semibold text-gray-900">Profile information</h2>
            <p className="text-sm text-gray-500">This information helps personalize your account.</p>
          </div>
        </div>

        <hr className="border-[#ece1d0]" />

        <div className="flex items-center gap-5">
          {photoPreview ? (
            <img src={photoPreview} alt="Profile" className="w-20 h-20 rounded-full object-cover" />
          ) : (
            <div className="w-20 h-20 rounded-full bg-cyan-100 text-cyan-700 flex items-center justify-center text-xl font-semibold">
              {initials}
            </div>
          )}
          <div>
            <p className="font-medium text-gray-900">{profileUser.name}</p>
            <p className="text-sm text-gray-500 mt-0.5">JPG, PNG or WEBP · Max 2MB</p>
            <div className="flex gap-3 mt-3">
              <label className="inline-flex items-center gap-2 text-sm border border-[#ece1d0] rounded-lg px-4 py-2 cursor-pointer hover:bg-cream">
                <CameraIcon /> Change photo
                <input type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={handlePhotoChange} />
              </label>
              <button
                type="button"
                onClick={() => setPhotoPreview(null)}
                className="text-sm text-red-600 border border-red-200 rounded-lg px-4 py-2 hover:bg-red-50"
              >
                Remove photo
              </button>
            </div>
          </div>
        </div>

        {profileError && <p className="text-sm text-red-600">{profileError}</p>}
        {profileSuccess && <p className="text-sm text-green-700">Profile updated successfully.</p>}

        <form onSubmit={handleProfileSubmit} className="space-y-4">
          <div>
            <label htmlFor="profile-name" className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <input
              id="profile-name"
              name="name"
              type="text"
              autoComplete="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="profile-email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              id="profile-email"
              name="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="profile-phone" className="block text-sm font-medium text-gray-700 mb-1">
              Phone
            </label>
            <input
              id="profile-phone"
              name="phone"
              type="tel"
              autoComplete="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="98XXXXXXXXX"
              className={inputClass}
            />
          </div>
          <button
            type="submit"
            disabled={isSavingProfile}
            className="bg-brand text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-brand-dark transition-colors disabled:opacity-50"
          >
            {isSavingProfile ? "Saving..." : "Save changes"}
          </button>
        </form>
      </section>

      {/* Password & security */}
      <section className="bg-white border border-[#ece1d0] rounded-2xl shadow-[0_2px_16px_rgba(61,5,12,0.06)] p-6 space-y-6">
        <div className="flex items-start gap-3">
          <div className="bg-orange-50 text-orange-500 rounded-lg p-2">
            <LockIcon />
          </div>
          <div>
            <h2 className="font-semibold text-gray-900">Password &amp; security</h2>
            <p className="text-sm text-gray-500">Use a strong password to protect your account.</p>
          </div>
        </div>

        <hr className="border-[#ece1d0]" />

        {passwordError && <p className="text-sm text-red-600">{passwordError}</p>}
        {passwordSuccess && <p className="text-sm text-green-700">Password changed successfully.</p>}

        <form onSubmit={handlePasswordSubmit} className="space-y-4">
          <div>
            <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1">
              Current password
            </label>
            <PasswordInput
              id="currentPassword"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Enter current password"
              required
              className="rounded-lg bg-cream border-[#ece1d0]"
            />
          </div>
          <div>
            <label htmlFor="newPasswordProfile" className="block text-sm font-medium text-gray-700 mb-1">
              New password
            </label>
            <PasswordInput
              id="newPasswordProfile"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password"
              required
              minLength={6}
              className="rounded-lg bg-cream border-[#ece1d0]"
            />
          </div>
          <div>
            <label htmlFor="confirmNewPassword" className="block text-sm font-medium text-gray-700 mb-1">
              Confirm new password
            </label>
            <PasswordInput
              id="confirmNewPassword"
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
              placeholder="Re-enter new password"
              required
              minLength={6}
              className="rounded-lg bg-cream border-[#ece1d0]"
            />
          </div>
          <button
            type="submit"
            disabled={isSavingPassword}
            className="bg-brand text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-brand-dark transition-colors disabled:opacity-50"
          >
            {isSavingPassword ? "Updating..." : "Update password"}
          </button>
        </form>
      </section>

      {/* Addresses */}
      <section className="bg-white border border-[#ece1d0] rounded-2xl shadow-[0_2px_16px_rgba(61,5,12,0.06)] p-6 space-y-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div className="bg-green-50 text-green-600 rounded-lg p-2">
              <MapPinIcon />
            </div>
            <div>
              <h2 className="font-semibold text-gray-900">Addresses</h2>
              <p className="text-sm text-gray-500">Manage your saved delivery addresses.</p>
            </div>
          </div>
          <button onClick={openAddForm} className="text-sm text-brand font-medium hover:underline">
            + Add address
          </button>
        </div>

        <hr className="border-[#ece1d0]" />

        {profileUser.addresses.length === 0 && !showAddressForm && (
          <p className="text-sm text-gray-500">No saved addresses yet.</p>
        )}

        <div className="space-y-3">
          {profileUser.addresses.map((address) => (
            <div key={address._id} className="border border-[#ece1d0] rounded-lg p-4 text-sm flex items-start justify-between">
              <div>
                <p className="text-gray-800">
                  {address.street}, {address.city}, {address.state} {address.zip}, {address.country}
                </p>
                {address.is_default && (
                  <span className="text-xs text-green-700 bg-green-50 px-1.5 py-0.5 rounded inline-block mt-1">
                    Default
                  </span>
                )}
              </div>
              <div className="flex gap-4 shrink-0 ml-4">
                <button onClick={() => openEditForm(address)} className="text-xs text-brand hover:underline">
                  Edit
                </button>
                <button
                  onClick={() => address._id && handleRemoveAddress(address._id)}
                  className="text-xs text-red-600 hover:underline"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>

        {showAddressForm && (
          <form onSubmit={handleAddressSubmit} className="border border-[#ece1d0] bg-cream/50 rounded-lg p-4 space-y-3">
            {addressError && <p className="text-sm text-red-600">{addressError}</p>}

            <input
              id="addr-street"
              name="street"
              type="text"
              aria-label="Street"
              autoComplete="street-address"
              placeholder="Street"
              required
              value={addressForm.street}
              onChange={(e) => setAddressForm({ ...addressForm, street: e.target.value })}
              className={inputClass}
            />
            <div className="grid grid-cols-2 gap-2">
              <input
                id="addr-city"
                name="city"
                type="text"
                aria-label="City"
                autoComplete="address-level2"
                placeholder="City"
                required
                value={addressForm.city}
                onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
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
                value={addressForm.state}
                onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
                className={inputClass}
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <input
                id="addr-zip"
                name="zip"
                type="text"
                aria-label="Zip"
                autoComplete="postal-code"
                placeholder="Zip"
                required
                value={addressForm.zip}
                onChange={(e) => setAddressForm({ ...addressForm, zip: e.target.value })}
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
                value={addressForm.country}
                onChange={(e) => setAddressForm({ ...addressForm, country: e.target.value })}
                className={inputClass}
              />
            </div>
            <label htmlFor="default-address" className="flex items-center gap-2 text-sm">
              <input
                id="default-address"
                name="is_default"
                type="checkbox"
                checked={addressForm.is_default}
                onChange={(e) => setAddressForm({ ...addressForm, is_default: e.target.checked })}
              />
              Set as default
            </label>

            <div className="flex gap-2">
              <button
                type="submit"
                disabled={isSavingAddress}
                className="bg-brand text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-brand-dark transition-colors disabled:opacity-50"
              >
                {isSavingAddress ? "Saving..." : editingAddressId ? "Update address" : "Add address"}
              </button>
              <button
                type="button"
                onClick={() => setShowAddressForm(false)}
                className="px-5 py-2.5 rounded-lg text-sm border border-[#ece1d0] hover:bg-cream"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </section>
    </div>
  );
};

export default Profile;
