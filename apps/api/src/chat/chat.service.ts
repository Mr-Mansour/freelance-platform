import { Injectable } from '@nestjs/common'
import { DatabaseService } from '../database/database.service'

@Injectable()
export class ChatService {
  constructor(private db: DatabaseService) {}

  async createMessage(data: { senderId: string; receiverId: string; content: string; conversationId?: string }) {
    let conversationId = data.conversationId

    if (!conversationId) {
      const conversation = await this.db.chatConversation.create({
        data: {
          participants: {
            create: [
              { userId: data.senderId },
              { userId: data.receiverId },
            ],
          },
        },
      })
      conversationId = conversation.id
    }

    return this.db.message.create({
      data: {
        senderId: data.senderId,
        receiverId: data.receiverId,
        conversationId,
        content: data.content,
      },
      include: {
        sender: { select: { id: true, firstName: true, lastName: true, avatarUrl: true } },
      },
    })
  }

  async getConversations(userId: string) {
    return this.db.chatConversation.findMany({
      where: { participants: { some: { userId } } },
      include: {
        participants: { include: { user: { select: { id: true, firstName: true, lastName: true, avatarUrl: true } } } },
        messages: { take: 1, orderBy: { createdAt: 'desc' } },
      },
      orderBy: { updatedAt: 'desc' },
    })
  }

  async getMessages(conversationId: string, page = 1, limit = 50) {
    const skip = (page - 1) * limit
    const [data, total] = await Promise.all([
      this.db.message.findMany({
        where: { conversationId },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          sender: { select: { id: true, firstName: true, lastName: true, avatarUrl: true } },
        },
      }),
      this.db.message.count({ where: { conversationId } }),
    ])
    return { data, total, page, limit, totalPages: Math.ceil(total / limit) }
  }
}
