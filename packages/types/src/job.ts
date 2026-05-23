export type Job = {
  id: string
  clientId: string
  title: string
  description: string
  category: string
  skills: string[]
  budgetMin: number
  budgetMax: number
  budgetType: 'FIXED' | 'HOURLY'
  experienceLevel: 'ENTRY' | 'INTERMEDIATE' | 'EXPERT'
  duration: string
  status: 'OPEN' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED'
  proposalsCount: number
  averageBid: number
  featured: boolean
  createdAt: string
  updatedAt: string
}
