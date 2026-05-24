import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets'
import { Server, Socket } from 'socket.io'
import { ChatService } from './chat.service'

@WebSocketGateway({
  cors: { origin: '*', credentials: true },
  namespace: '/chat',
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server!: Server

  private userSockets = new Map<string, string[]>()

  constructor(private chat: ChatService) {}

  handleConnection(client: Socket) {
    const userId = client.handshake.query.userId as string
    if (userId) {
      const sockets = this.userSockets.get(userId) || []
      sockets.push(client.id)
      this.userSockets.set(userId, sockets)
      client.join(`user:${userId}`)
    }
  }

  handleDisconnect(client: Socket) {
    const userId = client.handshake.query.userId as string
    if (userId) {
      const sockets = this.userSockets.get(userId) || []
      const index = sockets.indexOf(client.id)
      if (index > -1) sockets.splice(index, 1)
      if (sockets.length === 0) this.userSockets.delete(userId)
      else this.userSockets.set(userId, sockets)
    }
  }

  @SubscribeMessage('send_message')
  async handleMessage(@ConnectedSocket() client: Socket, @MessageBody() data: { senderId: string; receiverId: string; content: string; conversationId?: string }) {
    const message = await this.chat.createMessage(data)
    this.server.to(`user:${data.receiverId}`).emit('new_message', message)
    this.server.to(`user:${data.senderId}`).emit('new_message', message)
    return message
  }

  @SubscribeMessage('typing')
  handleTyping(@ConnectedSocket() client: Socket, @MessageBody() data: { conversationId: string; userId: string; isTyping: boolean }) {
    client.broadcast.to(`conversation:${data.conversationId}`).emit('typing', data)
  }

  @SubscribeMessage('join_conversation')
  handleJoinConversation(@ConnectedSocket() client: Socket, @MessageBody() conversationId: string) {
    client.join(`conversation:${conversationId}`)
  }
}
