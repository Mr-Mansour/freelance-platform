export type Product = {
  id: string
  freelancerId: string
  title: string
  description: string
  price: number
  category: string
  images: string[]
  status: 'DRAFT' | 'ACTIVE' | 'FEATURED' | 'ARCHIVED'
  salesCount: number
  rating: number
  createdAt: string
  updatedAt: string
}
