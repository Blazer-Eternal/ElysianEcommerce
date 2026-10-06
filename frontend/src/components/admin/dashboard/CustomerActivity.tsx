import { memo, type ReactNode } from "react";
import DashboardPanel from "./DashboardPanel";
import { PanelEmpty } from "./PanelStates";
import { ActivityIcon, CartIcon, PeopleIcon, StarIcon } from "./icons";
import { formatRelativeTime } from "../../../utils/formatDate";
import type { ActivityItem } from "../../../types/order.types";

interface CustomerActivityProps {
  activity: ActivityItem[] | undefined;
  isLoading: boolean;
  /** Selected period length - only events inside it are shown. */
  periodDays?: number;
}

const TYPE_STYLES: Record<ActivityItem["type"], { icon: ReactNode; className: string }> = {
  order: { icon: <CartIcon size={16} />, className: "bg-brand/10 text-brand" },
  user: { icon: <PeopleIcon size={16} />, className: "bg-cyan-100 text-cyan-700" },
  review: { icon: <StarIcon size={16} />, className: "bg-amber-100 text-amber-700" },
};

/**
 * Registrations and reviews from the selected period. Order placements are
 * deliberately left out: they already have their own Recent Orders table.
 */
const CustomerActivity = memo(({ activity, isLoading, periodDays }: CustomerActivityProps) => (
  <DashboardPanel title="Customer Activity" icon={<ActivityIcon size={18} />} className="h-full">
    {isLoading ? (
      <div className="space-y-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="skeleton h-12 rounded-xl" />
        ))}
      </div>
    ) : !activity || activity.length === 0 ? (
      <PanelEmpty
        message={periodDays ? `No activity in the last ${periodDays} days` : "No activity yet"}
        hint="New sign-ups and reviews from this period will stream in here."
      />
    ) : (
      <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
        {activity.map((item) => {
          const style = TYPE_STYLES[item.type];
          return (
            <li key={item.id} className="flex items-center gap-3 py-3 border-b border-[#ece1cf] last:border-none">
              <span className={`shrink-0 w-9 h-9 rounded-lg flex items-center justify-center ${style.className}`}>
                {style.icon}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-gray-900 truncate">{item.title}</p>
                <p className="text-xs text-gray-500 truncate">{item.subtitle}</p>
              </div>
              <span className="text-xs text-gray-500 whitespace-nowrap shrink-0">
                {formatRelativeTime(item.at)}
              </span>
            </li>
          );
        })}
      </ul>
    )}
  </DashboardPanel>
));
CustomerActivity.displayName = "CustomerActivity";

export default CustomerActivity;
