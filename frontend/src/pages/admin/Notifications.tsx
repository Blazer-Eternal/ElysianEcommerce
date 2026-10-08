import AdminLayout from "../../components/layout/AdminLayout";
import DailyUpdateContent from "../../components/admin/daily-update/DailyUpdateContent";

/**
 * Admin → Notifications (sidebar entry above Data Tables).
 *
 * The full daily update: every brief group, its filter tabs and actions, in
 * the page body. The topbar bell dropdown previews the same data and links
 * here via "View all daily updates".
 */
const Notifications = () => (
  <AdminLayout>
    <div className="w-full px-responsive py-8 section-container">
      <div className="mx-auto max-w-4xl animate-fade-in">
        <DailyUpdateContent />
      </div>
    </div>
  </AdminLayout>
);

export default Notifications;
