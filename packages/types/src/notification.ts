export type Notification = {
  id: string
  userId: string
  type: NotificationType
  title: string
  message: string
  data?: Record<string, unknown>
  read: boolean
  createdAt: string
}

export type NotificationType =
  | 'NEW_MESSAGE'
  | 'PROPOSAL_RECEIVED'
  | 'PROPOSAL_ACCEPTED'
  | 'PROPOSAL_REJECTED'
  | 'CONTRACT_STARTED'
  | 'MILESTONE_COMPLETED'
  | 'PAYMENT_RECEIVED'
  | 'REVIEW_RECEIVED'
  | 'JOB_MATCH'
  | 'ADMIN_ALERT'
  | 'VERIFICATION_UPDATE'
  | 'SYSTEM'
