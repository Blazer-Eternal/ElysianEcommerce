import { Response } from "express";
import { CustomRequestInterface } from "../../intefaces";
import { MessageServices } from "../../services";

const toPositiveInt = (value: unknown, fallback: number): number => {
  const parsed = Number.parseInt(String(value), 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
};

/** Mongoose validation/Cast failures are client mistakes, not server crashes. */
const sendValidationError = (res: Response, error: unknown): void => {
  const err = error as { name?: string; message?: string; errors?: Record<string, { message?: string }> };
  if (err?.name === "ValidationError") {
    const firstMessage = Object.values(err.errors || {})[0]?.message || err.message;
    res.status(400).json({ success: false, message: firstMessage || "Invalid message data" });
    return;
  }
  if (err?.name === "CastError") {
    res.status(400).json({ success: false, message: "Invalid id provided" });
    return;
  }
  res.status(500).json({ success: false, message: "Internal server error" });
};

export class MessageController {
  /** Public: saves a message sent from the Contact Us / Get in Touch page. */
  static async createMessage(req: CustomRequestInterface, res: Response) {
    const { name, email, phone, message } = req.body;

    try {
      const created = await new MessageServices().create({ name, email, phone, message });

      return res.status(201).json({
        success: true,
        message: "Thanks for reaching out! We'll get back to you within 24 hours.",
        data: created,
      });
    } catch (error) {
      return sendValidationError(res, error);
    }
  }

  /** Admin: paginated inbox with unread badge count. */
  static async getAllMessages(req: CustomRequestInterface, res: Response) {
    const page = toPositiveInt(req.query.page, 1);
    const limit = Math.min(50, toPositiveInt(req.query.limit, 10));
    const isRead = req.query.isRead === undefined ? undefined : req.query.isRead === "true";

    try {
      const { messages, unreadCount, pagination } = await new MessageServices().findAll({ page, limit, isRead });

      return res.status(200).json({ success: true, data: messages, unreadCount, pagination });
    } catch (error) {
      return sendValidationError(res, error);
    }
  }

  /** Admin: mark one message as read. */
  static async markMessageRead(req: CustomRequestInterface, res: Response) {
    const id = req.params.id as string;

    try {
      const message = await new MessageServices().markRead(id);
      if (!message) return res.status(404).json({ success: false, message: "Message not found" });

      return res.status(200).json({ success: true, message: "Message marked as read", data: message });
    } catch (error) {
      return sendValidationError(res, error);
    }
  }

  /** Admin: delete a message. */
  static async deleteMessage(req: CustomRequestInterface, res: Response) {
    const id = req.params.id as string;

    try {
      const message = await new MessageServices().delete(id);
      if (!message) return res.status(404).json({ success: false, message: "Message not found" });

      return res.status(200).json({ success: true, message: "Message deleted" });
    } catch (error) {
      return sendValidationError(res, error);
    }
  }
}
