export type Transaction = {
  id: string
  userId: string
  type: 'DEPOSIT' | 'WITHDRAWAL' | 'PAYMENT' | 'REFUND' | 'FEE' | 'PAYOUT'
  amount: number
  currency: string
  status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'CANCELLED'
  stripePaymentIntentId?: string
  description?: string
  metadata?: Record<string, unknown>
  createdAt: string
}
