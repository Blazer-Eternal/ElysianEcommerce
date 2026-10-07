import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { userService } from "../../services/userService";
import { authService } from "../../services/authService";
import { useAuth } from "../../hooks/useAuth";
import { getErrorMessage } from "../../utils/getErrorMessage";
import { ROUTES } from "../../constants/routes";
import Spinner from "../../components/ui/Spinner";
import PasswordInput from "../../components/ui/PasswordInput";
import { ArrowRightIcon, CreditCardIcon, MapPinIcon } from "../../components/icons";

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

      {/*
        Addresses and payment history moved to their own pages, so the account
        settings screen now only points the way instead of duplicating the
        forms.
      */}
      <section className="bg-white border border-[#ece1d0] rounded-2xl shadow-[0_2px_16px_rgba(61,5,12,0.06)] p-6 space-y-4">
        <div className="flex items-start gap-3">
          <div className="bg-brand/10 text-brand rounded-lg p-2">
            <MapPinIcon size={20} />
          </div>
          <div>
            <h2 className="font-semibold text-gray-900">Addresses &amp; payments</h2>
            <p className="text-sm text-gray-500">
              Delivery details and payment history each have their own page.
            </p>
          </div>
        </div>

        <hr className="border-[#ece1d0]" />

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Link
            to={ROUTES.ADDRESSES}
            className="group flex items-center gap-3 rounded-xl border border-[#ece1d0] bg-cream/60 px-4 py-3.5 transition-colors hover:border-brand/30 hover:bg-white"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-green-50 text-green-600">
              <MapPinIcon size={18} />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-semibold text-gray-900 group-hover:text-brand">
                Addresses
              </span>
              <span className="mt-0.5 block truncate text-xs text-gray-500">
                Saved delivery addresses
              </span>
            </span>
            <ArrowRightIcon size={16} className="shrink-0 text-gray-400 transition-colors group-hover:text-brand" />
          </Link>

          <Link
            to={ROUTES.PAYMENTS}
            className="group flex items-center gap-3 rounded-xl border border-[#ece1d0] bg-cream/60 px-4 py-3.5 transition-colors hover:border-brand/30 hover:bg-white"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand/10 text-brand">
              <CreditCardIcon size={18} />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-semibold text-gray-900 group-hover:text-brand">
                Payment methods
              </span>
              <span className="mt-0.5 block truncate text-xs text-gray-500">
                Methods used and payment history
              </span>
            </span>
            <ArrowRightIcon size={16} className="shrink-0 text-gray-400 transition-colors group-hover:text-brand" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Profile;
