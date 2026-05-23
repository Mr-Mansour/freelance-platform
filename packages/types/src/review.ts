export type Review = {
  id: string
  contractId: string
  reviewerId: string
  revieweeId: string
  rating: number
  content: string
  categories: ReviewCategory
  createdAt: string
}

export type ReviewCategory = {
  communication: number
  quality: number
  professionalism: number
  deadline: number
  value: number
}

export type ReviewSummary = {
  averageRating: number
  totalReviews: number
  categoryAverages: ReviewCategory
  ratingDistribution: Record<number, number>
}
