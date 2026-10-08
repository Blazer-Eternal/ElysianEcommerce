import { useState, type FormEvent } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import AdminLayout from "../../components/layout/AdminLayout";
import Spinner from "../../components/ui/Spinner";
import PasswordInput from "../../components/ui/PasswordInput";
import { userService } from "../../services/userService";
import { authService } from "../../services/authService";
import { useAuth } from "../../hooks/useAuth";
import { getErrorMessage } from "../../utils/getErrorMessage";
import { isMuted, setMuted, pushDesktopAlert } from "../../utils/briefAlert";

const inputClass =
  "w-full border border-sand rounded-lg px-4 py-3 text-sm bg-cream/70 focus:outline-none focus:border-brand/40 focus:ring-2 focus:ring-brand/20 focus:bg-white";

const SectionCard = ({
  icon,
  title,
  subtitle,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) => (
  <section className="rounded-2xl border border-sand bg-white p-6 shadow-[0_2px_16px_rgba(61,5,12,0.06)]">
    <div className="flex items-start gap-3">
      <div className="rounded-lg bg-brand/10 p-2 text-brand">{icon}</div>
      <div>
        <h2 className="font-semibold text-gray-900">{title}</h2>
        <p className="text-sm text-gray-500">{subtitle}</p>
      </div>
    </div>
    <hr className="my-5 border-sand" />
    {children}
  </section>
);

const PersonIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const LockIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

const BellIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
);

/**
 * Admin-only profile screen. Reached from the sidebar's "Account & Settings"
 * entry (and the avatar menu); the old header "My Profile" shortcut pointed at
 * the customer portal and is gone.
 */
const AccountSettings = () => {
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

  const [alertsMuted, setAlertsMuted] = useState<boolean>(() => isMuted());
  const [desktopState, setDesktopState] = useState<string>("");

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

  const toggleAlerts = () => {
    const next = !alertsMuted;
    setAlertsMuted(next);
    setMuted(next);
  };

  const enableDesktopAlerts = () => {
    if (typeof Notification === "undefined") {
      setDesktopState("This browser does not support desktop alerts.");
      return;
    }
    void Notification.requestPermission()
      .then((perm) => {
        if (perm === "granted") {
          setDesktopState("Desktop alerts are on for this browser.");
          pushDesktopAlert("Elysian desktop alerts", "New orders and critical events will reach you here.");
        } else {
          setDesktopState("The browser did not grant alert permission.");
        }
      })
      .catch(() => setDesktopState("Could not request alert permission."));
  };

  const desktopSupported = typeof Notification !== "undefined";
  const desktopGranted = desktopSupported && Notification.permission === "granted";

  if (isLoading || !profileUser) {
    return (
      <AdminLayout>
        <div className="py-24">
          <Spinner size="lg" />
        </div>
      </AdminLayout>
    );
  }

  const initials = profileUser.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <AdminLayout>
      <div className="w-full px-4 sm:px-6 py-8">
        <div className="max-w-3xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="text-sm font-semibold text-brand uppercase tracking-wider">Admin Panel</div>
              <h1 className="mt-1 text-3xl sm:text-4xl font-bold text-gray-900">Account &amp; Settings</h1>
              <p className="mt-2 text-gray-600">Your administrator profile, password and alert preferences.</p>
            </div>
            <span className="inline-flex items-center gap-1.5 self-start rounded-full bg-green-500/10 px-3 py-1.5 text-xs font-bold text-green-700 sm:self-auto">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                <path d="m9 12 2 2 4-4" />
              </svg>
              Account protected
            </span>
          </div>

          {/* Profile information */}
          <SectionCard
            icon={<PersonIcon />}
            title="Profile information"
            subtitle="The name and contact details shown across the admin panel."
          >
            <div className="mb-5 flex items-center gap-4">
              <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-brand text-lg font-bold text-white ring-1 ring-brand/30">
                {initials}
              </span>
              <div className="min-w-0">
                <p className="truncate font-medium text-gray-900">{profileUser.name}</p>
                <p className="mt-0.5 text-sm capitalize text-gray-500">{profileUser.role} account</p>
              </div>
            </div>

            {profileError && <p className="mb-3 text-sm text-teal-600">{profileError}</p>}
            {profileSuccess && <p className="mb-3 text-sm text-green-700">Profile updated successfully.</p>}

            <form onSubmit={handleProfileSubmit} className="space-y-4">
              <div>
                <label htmlFor="admin-profile-name" className="mb-1 block text-sm font-medium text-gray-700">
                  Name
                </label>
                <input
                  id="admin-profile-name"
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
                <label htmlFor="admin-profile-email" className="mb-1 block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  id="admin-profile-email"
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
                <label htmlFor="admin-profile-phone" className="mb-1 block text-sm font-medium text-gray-700">
                  Phone
                </label>
                <input
                  id="admin-profile-phone"
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
                className="rounded-lg bg-brand px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-dark disabled:opacity-50"
              >
                {isSavingProfile ? "Saving..." : "Save changes"}
              </button>
            </form>
          </SectionCard>

          {/* Password */}
          <SectionCard
            icon={<LockIcon />}
            title="Password &amp; security"
            subtitle="Use a strong password to protect the admin account."
          >
            {passwordError && <p className="mb-3 text-sm text-teal-600">{passwordError}</p>}
            {passwordSuccess && <p className="mb-3 text-sm text-green-700">Password changed successfully.</p>}

            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div>
                <label htmlFor="adminCurrentPassword" className="mb-1 block text-sm font-medium text-gray-700">
                  Current password
                </label>
                <PasswordInput
                  id="adminCurrentPassword"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter current password"
                  required
                  className="rounded-lg border-sand bg-cream"
                />
              </div>
              <div>
                <label htmlFor="adminNewPassword" className="mb-1 block text-sm font-medium text-gray-700">
                  New password
                </label>
                <PasswordInput
                  id="adminNewPassword"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                  required
                  minLength={6}
                  className="rounded-lg border-sand bg-cream"
                />
              </div>
              <div>
                <label htmlFor="adminConfirmPassword" className="mb-1 block text-sm font-medium text-gray-700">
                  Confirm new password
                </label>
                <PasswordInput
                  id="adminConfirmPassword"
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  placeholder="Re-enter new password"
                  required
                  minLength={6}
                  className="rounded-lg border-sand bg-cream"
                />
              </div>
              <button
                type="submit"
                disabled={isSavingPassword}
                className="rounded-lg bg-brand px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-dark disabled:opacity-50"
              >
                {isSavingPassword ? "Updating..." : "Update password"}
              </button>
            </form>
          </SectionCard>

          {/* Alert preferences */}
          <SectionCard
            icon={<BellIcon />}
            title="Notification preferences"
            subtitle="How the Daily Update drawer gets your attention."
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-4 rounded-xl border border-sand bg-cream/60 px-4 py-3.5">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-gray-900">Alert sounds</p>
                  <p className="mt-0.5 text-xs text-gray-500">
                    A short chime for new orders and critical events.
                  </p>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={!alertsMuted}
                  onClick={toggleAlerts}
                  className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
                    alertsMuted ? "bg-gray-300" : "bg-brand"
                  }`}
                >
                  <span
                    className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${
                      alertsMuted ? "left-0.5" : "left-5.5"
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between gap-4 rounded-xl border border-sand bg-cream/60 px-4 py-3.5">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-gray-900">Desktop alerts</p>
                  <p className="mt-0.5 text-xs text-gray-500">
                    {desktopState ||
                      (desktopGranted
                        ? "Granted for this browser."
                        : desktopSupported
                          ? "Notify you even when the tab is in the background."
                          : "Not supported by this browser.")}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={enableDesktopAlerts}
                  disabled={!desktopSupported || desktopGranted}
                  className="shrink-0 rounded-lg border border-gold/50 bg-gold/10 px-3.5 py-2 text-[11px] font-bold uppercase tracking-[0.12em] text-gold-dark transition hover:bg-gold/20 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {desktopGranted ? "Enabled" : "Enable"}
                </button>
              </div>
            </div>
          </SectionCard>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AccountSettings;
