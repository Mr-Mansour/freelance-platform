export type Message = {
  id: string
  senderId: string
  receiverId: string
  contractId?: string
  content: string
  messageType: 'TEXT' | 'FILE' | 'IMAGE' | 'SYSTEM'
  fileUrl?: string
  readAt?: string
  createdAt: string
}

export type ChatConversation = {
  id: string
  participants: string[]
  lastMessage?: Message
  unreadCount: number
  contractId?: string
  createdAt: string
  updatedAt: string
}

export type TypingEvent = {
  conversationId: string
  userId: string
  isTyping: boolean
}
