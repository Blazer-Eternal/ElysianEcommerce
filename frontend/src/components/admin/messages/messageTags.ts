import type { MessageTag } from "../../../types/message.types";

/** Label + tint for each topic chip, shared by the inbox and the thread panel. */
export const TAG_OPTIONS: Array<{ value: MessageTag; label: string }> = [
  { value: "order", label: "Order" },
  { value: "shipping", label: "Shipping issue" },
  { value: "refund", label: "Refund" },
  { value: "pre_sales", label: "Pre-sales" },
  { value: "product", label: "Product" },
  { value: "payment", label: "Payment" },
  { value: "account", label: "Account" },
  { value: "feedback", label: "Feedback" },
  { value: "other", label: "Other" },
  { value: "spam", label: "Spam" },
];

const TAG_STYLES: Record<MessageTag, string> = {
  order: "bg-brand/10 text-brand",
  shipping: "bg-cyan-100 text-cyan-700",
  refund: "bg-teal-50 text-teal-700",
  pre_sales: "bg-gold/15 text-gold-dark",
  product: "bg-indigo-50 text-indigo-700",
  payment: "bg-emerald-500/10 text-emerald-700",
  account: "bg-slate-500/10 text-slate-600",
  feedback: "bg-rose/25 text-brand",
  other: "bg-sand text-ink/60",
  spam: "bg-red-500/10 text-red-600",
};

export const tagLabel = (tag?: MessageTag): string =>
  TAG_OPTIONS.find((option) => option.value === tag)?.label ?? "Other";

export const tagStyle = (tag?: MessageTag): string => TAG_STYLES[tag ?? "other"];
