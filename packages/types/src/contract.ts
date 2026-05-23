export type Contract = {
  id: string
  jobId: string
  freelancerId: string
  clientId: string
  title: string
  description: string
  amount: number
  status: 'PENDING' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED' | 'DISPUTED'
  startDate: string
  endDate?: string
  milestones: Milestone[]
  escrowAmount: number
  escrowStatus: 'UNFUNDED' | 'FUNDED' | 'RELEASED' | 'REFUNDED'
}

export type Milestone = {
  id: string
  contractId: string
  title: string
  description?: string
  amount: number
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'APPROVED'
  dueDate?: string
  completedAt?: string
}
