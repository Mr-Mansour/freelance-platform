export type Proposal = {
  id: string
  jobId: string
  freelancerId: string
  coverLetter: string
  bidAmount: number
  estimatedDuration: string
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'WITHDRAWN'
  isAiGenerated: boolean
  createdAt: string
  updatedAt: string
}
