/**
 * Topic buckets a contact-form message can belong to. The customer picks one
 * when they write in (the "Topic" select on the Contact page), and the admin
 * can re-assign it later from the inbox — the value is what the inbox filter
 * chips are built from, so keep it stable and machine-safe.
 */
export enum MessageTagEnum {
  pre_sales = "pre_sales",
  order = "order",
  shipping = "shipping",
  refund = "refund",
  product = "product",
  payment = "payment",
  account = "account",
  feedback = "feedback",
  spam = "spam",
  other = "other",
}

/** Ordered for the contact-form dropdown and the inbox filter chips. */
export const MESSAGE_TAG_VALUES: MessageTagEnum[] = [
  MessageTagEnum.order,
  MessageTagEnum.shipping,
  MessageTagEnum.refund,
  MessageTagEnum.pre_sales,
  MessageTagEnum.product,
  MessageTagEnum.payment,
  MessageTagEnum.account,
  MessageTagEnum.feedback,
  MessageTagEnum.other,
  MessageTagEnum.spam,
];

/** Inbox filter states. `read` means opened but not yet answered. */
export enum MessageStatusEnum {
  unread = "unread",
  read = "read",
  replied = "replied",
  archived = "archived",
}

export const MESSAGE_STATUS_VALUES: string[] = Object.values(MessageStatusEnum);
