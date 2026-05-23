export type Category = {
  id: string
  name: string
  slug: string
  description?: string
  icon?: string
  parentId?: string
  children?: Category[]
  serviceCount: number
}
