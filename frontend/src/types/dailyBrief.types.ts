/** How urgent an item in the Daily Update drawer is; drives the colour. */
export type BriefSeverity = "critical" | "warning" | "success" | "info";

export interface BriefAction {
  label: string;
  href: string;
}

export interface BriefEntry {
  /** Stable id; the drawer remembers which items this admin has already seen. */
  key: string;
  severity: BriefSeverity;
  /** True when ignoring this item costs money, stock or a customer. */
  action_required: boolean;
  title: string;
  message: string;
  created_at: string;
  href?: string;
  actions?: BriefAction[];
}

export type BriefGroupKey =
  | "sales"
  | "inventory"
  | "support"
  | "shipping"
  | "system"
  | "marketing";

export interface BriefGroup {
  key: BriefGroupKey;
  label: string;
  subtitle: string;
  entries: BriefEntry[];
}

/** GET /notifications/daily-brief */
export interface AdminBrief {
  generated_at: string;
  action_required: number;
  total: number;
  groups: BriefGroup[];
}
