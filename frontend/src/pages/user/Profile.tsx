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

const Profile = () => {
  const { user } = useAuth();
  const userId = user?.id as string;
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["user", userId],
    queryFn: () => userService.getById(userId),
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
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [isSavingPassword, setIsSavingPassword] = useState(false);

  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
  const [addressForm, setAddressForm] = useState<AddressPayload>(emptyAddress);
  const [addressError, setAddressError] = useState<string | null>(null);
  const [isSavingAddress, setIsSavingAddress] = useState(false);

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
    setIsSavingPassword(true);
    try {
      await authService.changePassword({ currentPassword, newPassword });
      setPasswordSuccess(true);
      setCurrentPassword("");
      setNewPassword("");
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

  if (isLoading || !profileUser) {
    return (
      <div className="py-24">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-10">
      <h1 className="text-2xl font-bold">My Profile</h1>

      <section>
        <h2 className="font-semibold mb-3">Account Details</h2>
        {profileError && <p className="text-sm text-red-600 mb-2">{profileError}</p>}
        {profileSuccess && <p className="text-sm text-green-700 mb-2">Profile updated successfully.</p>}

        <form onSubmit={handleProfileSubmit} className="space-y-3 max-w-sm">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name"
            className="w-full border rounded px-3 py-2 text-sm"
          />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full border rounded px-3 py-2 text-sm"
          />
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Phone"
            className="w-full border rounded px-3 py-2 text-sm"
          />
          <button
            type="submit"
            disabled={isSavingProfile}
            className="bg-black text-white px-4 py-2 rounded text-sm disabled:opacity-50"
          >
            {isSavingProfile ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </section>

      <section>
        <h2 className="font-semibold mb-3">Change Password</h2>
        {passwordError && <p className="text-sm text-red-600 mb-2">{passwordError}</p>}
        {passwordSuccess && <p className="text-sm text-green-700 mb-2">Password changed successfully.</p>}

        <form onSubmit={handlePasswordSubmit} className="space-y-3 max-w-sm">
          <PasswordInput
            id="currentPassword"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            placeholder="Current password"
            required
          />
          <PasswordInput
            id="newPasswordProfile"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="New password"
            required
            minLength={6}
          />
          <button
            type="submit"
            disabled={isSavingPassword}
            className="bg-black text-white px-4 py-2 rounded text-sm disabled:opacity-50"
          >
            {isSavingPassword ? "Updating..." : "Change Password"}
          </button>
        </form>
      </section>

      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold">Addresses</h2>
          <button onClick={openAddForm} className="text-sm text-black underline">
            + Add Address
          </button>
        </div>

        {profileUser.addresses.length === 0 && !showAddressForm && (
          <p className="text-sm text-gray-500">No saved addresses yet.</p>
        )}

        <div className="space-y-3">
          {profileUser.addresses.map((address) => (
            <div key={address._id} className="border rounded p-3 text-sm flex items-start justify-between">
              <div>
                <p>
                  {address.street}, {address.city}, {address.state} {address.zip}, {address.country}
                </p>
                {address.is_default && (
                  <span className="text-xs text-green-700 bg-green-50 px-1.5 py-0.5 rounded inline-block mt-1">
                    Default
                  </span>
                )}
              </div>
              <div className="flex gap-3 shrink-0 ml-4">
                <button onClick={() => openEditForm(address)} className="text-xs underline">
                  Edit
                </button>
                <button
                  onClick={() => address._id && handleRemoveAddress(address._id)}
                  className="text-xs text-red-600 underline"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>

        {showAddressForm && (
          <form onSubmit={handleAddressSubmit} className="border rounded p-4 mt-4 space-y-3 max-w-sm">
            {addressError && <p className="text-sm text-red-600">{addressError}</p>}

            <input
              type="text"
              placeholder="Street"
              required
              value={addressForm.street}
              onChange={(e) => setAddressForm({ ...addressForm, street: e.target.value })}
              className="w-full border rounded px-3 py-2 text-sm"
            />
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                placeholder="City"
                required
                value={addressForm.city}
                onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                className="border rounded px-3 py-2 text-sm"
              />
              <input
                type="text"
                placeholder="State"
                required
                value={addressForm.state}
                onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
                className="border rounded px-3 py-2 text-sm"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                placeholder="Zip"
                required
                value={addressForm.zip}
                onChange={(e) => setAddressForm({ ...addressForm, zip: e.target.value })}
                className="border rounded px-3 py-2 text-sm"
              />
              <input
                type="text"
                placeholder="Country"
                required
                value={addressForm.country}
                onChange={(e) => setAddressForm({ ...addressForm, country: e.target.value })}
                className="border rounded px-3 py-2 text-sm"
              />
            </div>
            <label className="flex items-center gap-2 text-sm">
              <input
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
                className="bg-black text-white px-4 py-2 rounded text-sm disabled:opacity-50"
              >
                {isSavingAddress ? "Saving..." : editingAddressId ? "Update Address" : "Add Address"}
              </button>
              <button
                type="button"
                onClick={() => setShowAddressForm(false)}
                className="px-4 py-2 rounded text-sm border"
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
