import { MessageModel } from "../models/MessageModel";
import { UserModel } from "../models/UserModel";
import { OrderModel } from "../models/OrderModel";
import { MessageInterface, InputMessageInterface } from "../intefaces/MessageInterface";
import { MessageTagEnum, MessageStatusEnum } from "../enums/MessageEnums";
import { PaginationOptions } from "../intefaces";

export interface MessageListOptions extends PaginationOptions {
  isRead?: boolean;
  /** Inbox filter chip: unread | read | replied | archived. */
  status?: MessageStatusEnum;
  tag?: string;
  /** Free-text search across sender, subject and body. */
  q?: string;
}

export interface MessageInboxCounts {
  total: number;
  unread: number;
  read: number;
  replied: number;
  archived: number;
}

interface CustomerContext {
  customer: {
    _id: string;
    name: string;
    email: string;
    phone: string;
    role: string;
    created_at: Date | null;
  } | null;
  orders: Array<{
    _id: string;
    order_number: string;
    status: string;
    payment_status: string;
    total_amount: number;
    created_at: Date;
    items: Array<{ product_name: string; quantity: number }>;
  }>;
}

export class MessageServices {
  /**
   * One page of contact messages, newest first, plus the pagination metadata
   * and the per-status counts that drive the inbox filter chips.
   */
  public async findAll(options: MessageListOptions = {}) {
    const { page = 1, limit = 20, isRead, status, tag, q } = options;
    const skip = (page - 1) * limit;

    const filter = MessageServices.buildFilter({ isRead, status, tag, q });

    const [messages, total, counts] = await Promise.all([
      MessageModel.find(filter).sort({ created_at: -1 }).skip(skip).limit(limit),
      MessageModel.countDocuments(filter),
      MessageServices.counts(),
    ]);

    return {
      messages,
      counts,
      // Unread total is unfiltered so the badge stays correct in every view.
      unreadCount: counts.unread,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.max(1, Math.ceil(total / limit)),
        hasNextPage: page * limit < total,
        hasPrevPage: page > 1,
      },
    };
  }

  /** Filter-chip tallies, always computed over the whole inbox. */
  private static async counts(): Promise<MessageInboxCounts> {
    const [total, unread, replied, archived] = await Promise.all([
      MessageModel.countDocuments(),
      MessageModel.countDocuments({ is_read: false, archived: false }),
      MessageModel.countDocuments({ replied_at: { $ne: null }, archived: false }),
      MessageModel.countDocuments({ archived: true }),
    ]);

    return { total, unread, replied, archived, read: total - unread - archived };
  }

  private static buildFilter(options: {
    isRead?: boolean;
    status?: MessageStatusEnum;
    tag?: string;
    q?: string;
  }): Record<string, unknown> {
    const filter: Record<string, unknown> = {};
    const { isRead, status, tag, q } = options;

    if (status === MessageStatusEnum.archived) {
      filter.archived = true;
    } else if (status === MessageStatusEnum.replied) {
      filter.archived = false;
      filter.replied_at = { $ne: null };
    } else if (status === MessageStatusEnum.unread) {
      filter.archived = false;
      filter.is_read = false;
    } else if (status === MessageStatusEnum.read) {
      filter.archived = false;
      filter.is_read = true;
      filter.replied_at = null;
    } else if (isRead !== undefined) {
      filter.is_read = isRead;
    }

    if (tag) filter.tag = tag;

    if (q && q.trim()) {
      const safe = q.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const pattern = new RegExp(safe, "i");
      filter.$or = [{ name: pattern }, { email: pattern }, { subject: pattern }, { message: pattern }];
    }

    return filter;
  }

  public async findById(id: string): Promise<MessageInterface | null> {
    return await MessageModel.findById(id);
  }

  public async create(data: InputMessageInterface): Promise<MessageInterface> {
    return await MessageModel.create(data);
  }

  public async markRead(id: string): Promise<MessageInterface | null> {
    return await MessageModel.findByIdAndUpdate(id, { is_read: true }, { returnDocument: "after" });
  }

  /**
   * Partial admin edit of one thread. A non-empty `reply` stamps `replied_at`
   * and marks the message read; clearing the reply un-stamps it.
   */
  public async update(
    id: string,
    patch: {
      subject?: string;
      tag?: MessageTagEnum;
      reply?: string;
      is_read?: boolean;
      archived?: boolean;
    }
  ): Promise<MessageInterface | null> {
    const update: Record<string, unknown> = {};

    if (patch.subject !== undefined) update.subject = patch.subject;
    if (patch.tag !== undefined) update.tag = patch.tag;
    if (patch.is_read !== undefined) update.is_read = patch.is_read;
    if (patch.archived !== undefined) update.archived = patch.archived;

    if (patch.reply !== undefined) {
      const reply = patch.reply.trim();
      update.reply = reply;
      update.replied_at = reply ? new Date() : null;
      if (reply) update.is_read = true;
    }

    if (Object.keys(update).length === 0) return this.findById(id);

    return await MessageModel.findByIdAndUpdate(id, update, {
      returnDocument: "after",
      runValidators: true,
    });
  }

  /**
   * Everything the inbox needs the moment a thread is opened: the account that
   * sent it (matched on the form email) and that account's most recent orders,
   * so a single-vendor admin never has to go hunting through the Orders page.
   */
  public async getCustomerContext(email: string): Promise<CustomerContext> {
    const customer = await UserModel.findOne({ email: email.toLowerCase().trim() })
      .select("name email phone role created_at")
      .lean();

    if (!customer) return { customer: null, orders: [] };

    const orders = await OrderModel.find({ user_id: customer._id })
      .sort({ created_at: -1 })
      .limit(5)
      .select("order_number status payment_status total_amount created_at items.product_name items.quantity")
      .lean();

    return {
      customer: {
        _id: String(customer._id),
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        role: customer.role,
        created_at: customer.created_at ?? null,
      },
      orders: orders.map((order) => ({
        _id: String(order._id),
        order_number: order.order_number,
        status: order.status,
        payment_status: order.payment_status,
        total_amount: order.total_amount,
        created_at: order.created_at,
        items: (order.items ?? []).map((item) => ({
          product_name: item.product_name,
          quantity: item.quantity,
        })),
      })),
    };
  }

  public async delete(id: string): Promise<MessageInterface | null> {
    return await MessageModel.findByIdAndDelete(id);
  }
}
