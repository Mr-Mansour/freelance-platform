import { Injectable } from '@nestjs/common'
import { DatabaseService } from '../database/database.service'

@Injectable()
export class MessagesService {
  constructor(private db: DatabaseService) {}

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
        include: { sender: { select: { id: true, firstName: true, lastName: true, avatarUrl: true } } },
      }),
      this.db.message.count({ where: { conversationId } }),
    ])
    return { data: data.reverse(), total, page, limit, totalPages: Math.ceil(total / limit) }
  }
}
