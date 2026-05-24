import { NextResponse } from 'next/server'
import { getEmailLog } from '@/lib/store'

export async function GET() {
  const logs = getEmailLog().sort((a, b) => new Date(b.sentAt).getTime() - new Date(a.sentAt).getTime())
  return NextResponse.json(logs)
}
