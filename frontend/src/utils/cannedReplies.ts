/**
 * Quick replies the admin can drop into a message thread.
 *
 * The built-ins ship with the app so an inbox with zero history still has
 * useful answers; anything the admin saves on top lives in localStorage under
 * its own key, never in the database, so a stale browser copy can never send
 * text the admin did not write.
 */

export interface CannedReply {
  id: string;
  label: string;
  body: string;
}

const STORED_KEY = "elysian_canned_replies";

export const DEFAULT_CANNED_REPLIES: CannedReply[] = [
  {
    id: "ack-order",
    label: "Order acknowledged",
    body: "Thanks for reaching out! I've checked your order and everything is on track. I'll follow up as soon as there's a status change.",
  },
  {
    id: "shipping-eta",
    label: "Shipping ETA",
    body: "Your order has shipped and is currently in transit. The tracking link is on its way to your email — delivery usually takes 2–4 working days within Nepal.",
  },
  {
    id: "delay-apology",
    label: "Delay apology",
    body: "I'm sorry for the wait — your order is taking longer than our usual timeline. We're on it, and I'll personally update you within 24 hours with a firm date.",
  },
  {
    id: "refund-status",
    label: "Refund status",
    body: "Your refund has been initiated. Once the return is inspected, the amount is credited back to your original payment method within 5–7 working days.",
  },
  {
    id: "presales",
    label: "Pre-sales help",
    body: "Great to hear you're interested! Happy to help with sizing, stock or delivery questions — tell me which product you're looking at and I'll confirm the details.",
  },
  {
    id: "closing",
    label: "Closing & sign-off",
    body: "Is there anything else I can help you with? If not, thank you for shopping with Elysian — we really appreciate it.",
  },
];

const readStored = (): CannedReply[] => {
  try {
    const raw = localStorage.getItem(STORED_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (item): item is CannedReply =>
        !!item &&
        typeof item === "object" &&
        typeof (item as CannedReply).id === "string" &&
        typeof (item as CannedReply).label === "string" &&
        typeof (item as CannedReply).body === "string",
    );
  } catch {
    return [];
  }
};

const writeStored = (items: CannedReply[]): void => {
  try {
    localStorage.setItem(STORED_KEY, JSON.stringify(items.slice(-30)));
  } catch {
    /* storage blocked — the session simply keeps the in-memory copy */
  }
};

/** Built-ins first, then everything the admin has saved, newest last. */
export const getCannedReplies = (): CannedReply[] => [...DEFAULT_CANNED_REPLIES, ...readStored()];

export const saveCannedReply = (label: string, body: string): CannedReply[] => {
  const trimmedLabel = label.trim();
  const trimmedBody = body.trim();
  if (!trimmedLabel || !trimmedBody) return getCannedReplies();

  const next = [
    ...readStored(),
    {
      id: `custom-${Date.now()}`,
      label: trimmedLabel.slice(0, 60),
      body: trimmedBody.slice(0, 2000),
    },
  ];
  writeStored(next);
  return [...DEFAULT_CANNED_REPLIES, ...next];
};

export const removeCannedReply = (id: string): CannedReply[] => {
  const next = readStored().filter((item) => item.id !== id);
  writeStored(next);
  return [...DEFAULT_CANNED_REPLIES, ...next];
};
