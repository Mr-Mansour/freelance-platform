import { NextRequest, NextResponse } from 'next/server'
import { getFreelancers } from '@/lib/store'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const search = searchParams.get('search')?.toLowerCase()
  const category = searchParams.get('category')

  let result = getFreelancers()

  if (search) {
    result = result.filter(f =>
      f.name.toLowerCase().includes(search) ||
      f.title.toLowerCase().includes(search) ||
      f.skills.some(s => s.toLowerCase().includes(search))
    )
  }

  if (category && category !== 'All') {
    result = result.filter(f =>
      f.skills.some(s => s.toLowerCase().includes(category.toLowerCase()))
    )
  }

  return NextResponse.json(result)
}
