import { MessageModel } from "../models/MessageModel";
import { MessageInterface, InputMessageInterface } from "../intefaces/MessageInterface";
import { PaginationOptions } from "../intefaces";

export class MessageServices {
  /** One page of contact messages, newest first, with pagination metadata. */
  public async findAll(options: PaginationOptions & { isRead?: boolean } = {}) {
    const { page = 1, limit = 20, isRead } = options;
    const skip = (page - 1) * limit;

    const filter: Record<string, unknown> = {};
    if (isRead !== undefined) filter.is_read = isRead;

    const [messages, total, unreadCount] = await Promise.all([
      MessageModel.find(filter).sort({ created_at: -1 }).skip(skip).limit(limit),
      MessageModel.countDocuments(filter),
      // Unread total is unfiltered so the badge stays correct in every view.
      MessageModel.countDocuments({ is_read: false }),
    ]);

    return {
      messages,
      unreadCount,
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

  public async findById(id: string): Promise<MessageInterface | null> {
    return await MessageModel.findById(id);
  }

  public async create(data: InputMessageInterface): Promise<MessageInterface> {
    return await MessageModel.create(data);
  }

  public async markRead(id: string): Promise<MessageInterface | null> {
    return await MessageModel.findByIdAndUpdate(id, { is_read: true }, { returnDocument: "after" });
  }

  public async delete(id: string): Promise<MessageInterface | null> {
    return await MessageModel.findByIdAndDelete(id);
  }
}
