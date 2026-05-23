import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    score: 94,
    level: 'ELITE',
    metrics: [
      { label: 'Review Score', value: 98, weight: '20%' },
      { label: 'Delivery Rate', value: 99, weight: '20%' },
      { label: 'Dispute Rate', value: 95, weight: '15%' },
      { label: 'Client Retention', value: 92, weight: '10%' },
      { label: 'Account Age', value: 90, weight: '10%' },
      { label: 'Portfolio Quality', value: 88, weight: '10%' },
      { label: 'Verification Score', value: 100, weight: '15%' },
    ],
  })
}
