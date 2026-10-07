import { memo, type ReactNode } from "react";

interface DashboardPanelProps {
  title: string;
  /** Optional one-liner rendered under the title (with a divider below it). */
  subtitle?: string;
  icon?: ReactNode;
  /** Rendered on the right side of the header (links, legends, badges). */
  action?: ReactNode;
  className?: string;
  children: ReactNode;
}

/** Shared card wrapper used by every dashboard analytics panel. */
const DashboardPanel = memo(({ title, subtitle, icon, action, className = "", children }: DashboardPanelProps) => (
  <section
    className={`bg-white rounded-2xl border border-[#ece1d0] shadow-[0_2px_16px_rgba(61,5,12,0.06)] p-5 sm:p-6 card-container flex flex-col ${className}`}
  >
    <header className={`mb-4 ${subtitle ? "border-b border-sand pb-3" : ""}`}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          {icon && <span className="text-brand shrink-0">{icon}</span>}
          <h3 className="text-lg font-semibold text-gray-900 truncate">{title}</h3>
        </div>
        {action}
      </div>
      {subtitle && <p className="mt-1 text-sm text-gray-500">{subtitle}</p>}
    </header>
    {children}
  </section>
));
DashboardPanel.displayName = "DashboardPanel";

export default DashboardPanel;
