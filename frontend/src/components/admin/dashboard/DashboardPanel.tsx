import { memo, type ReactNode } from "react";

interface DashboardPanelProps {
  title: string;
  icon?: ReactNode;
  /** Rendered on the right side of the header (links, legends, badges). */
  action?: ReactNode;
  className?: string;
  children: ReactNode;
}

/** Shared `glass` card wrapper used by every dashboard analytics panel. */
const DashboardPanel = memo(({ title, icon, action, className = "", children }: DashboardPanelProps) => (
  <section className={`glass rounded-2xl border border-gray-200 p-5 sm:p-6 card-container flex flex-col ${className}`}>
    <header className="flex flex-wrap items-center justify-between gap-3 mb-4">
      <div className="flex items-center gap-2.5 min-w-0">
        {icon && <span className="text-brand shrink-0">{icon}</span>}
        <h3 className="font-bold text-gray-900 truncate">{title}</h3>
      </div>
      {action}
    </header>
    {children}
  </section>
));
DashboardPanel.displayName = "DashboardPanel";

export default DashboardPanel;
