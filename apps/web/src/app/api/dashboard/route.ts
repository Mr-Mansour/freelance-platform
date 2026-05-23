import { NextResponse } from 'next/server'

const MILESTONES = [
  { title: 'Dashboard & Data Visualization', project: 'SaaS Analytics Dashboard', amount: 2500, dueDate: 'Mar 5, 2026', status: 'IN_PROGRESS' },
  { title: 'API Integration & Testing', project: 'E-Commerce Platform', amount: 1800, dueDate: 'Mar 12, 2026', status: 'PENDING' },
  { title: 'Final Deployment', project: 'Mobile Banking App', amount: 2000, dueDate: 'Mar 20, 2026', status: 'PENDING' },
]

export async function GET() {
  return NextResponse.json({
    stats: [
      { icon: 'Briefcase', label: 'Active Projects', value: '3', color: 'text-cyan-400' },
      { icon: 'DollarSign', label: 'Total Earnings', value: '$12,450', color: 'text-emerald-400' },
      { icon: 'Send', label: 'Proposals Sent', value: '8', color: 'text-blue-400' },
      { icon: 'TrendingUp', label: 'Success Rate', value: '98%', color: 'text-emerald-400' },
      { icon: 'Shield', label: 'Trust Score', value: '94', color: 'text-purple-400' },
      { icon: 'Users', label: 'Open Jobs', value: '12', color: 'text-yellow-400' },
    ],
    activity: [
      { icon: 'CheckCircle', text: 'Milestone approved for SaaS Dashboard', time: '2 hours ago', color: 'text-emerald-400' },
      { icon: 'MessageCircle', text: 'New message from Sarah Wilson', time: '4 hours ago', color: 'text-cyan-400' },
      { icon: 'Star', text: 'You received a 5-star review!', time: '1 day ago', color: 'text-yellow-400' },
      { icon: 'DollarSign', text: 'Payment of $1,500 released', time: '2 days ago', color: 'text-emerald-400' },
      { icon: 'Briefcase', text: 'New job match: AI Dashboard Project', time: '3 days ago', color: 'text-blue-400' },
      { icon: 'Shield', text: 'Trust score increased to 94', time: '5 days ago', color: 'text-purple-400' },
    ],
    milestones: MILESTONES,
    user: {
      id: 'u1', name: 'Alex Chen', email: 'alex@cybrion.io', avatar: null,
      role: 'FREELANCER', title: 'Senior Full-Stack Developer',
      bio: 'Passionate full-stack developer with 8+ years of experience building scalable SaaS platforms.',
      location: 'San Francisco, CA', hourlyRate: 85, website: 'https://alexchen.dev',
      skills: ['React', 'Node.js', 'TypeScript', 'PostgreSQL', 'AWS', 'Docker', 'GraphQL', 'Next.js'],
      rating: 4.9, reviewCount: 47, completedJobs: 86,
      trustLevel: 'ELITE', trustScore: 94,
      verifiedBadges: ['ID_VERIFIED', 'SKILL_VERIFIED', 'PORTFOLIO_VERIFIED'],
      createdAt: '2023-06-15T00:00:00Z',
    },
    recommendations: [
      { title: 'AI Chatbot Integration', match: 96, budget: '$5K - $8K', skills: ['Python', 'NLP', 'OpenAI'] },
      { title: 'Real-time Dashboard Build', match: 94, budget: '$8K - $12K', skills: ['React', 'D3.js', 'WebSocket'] },
      { title: 'Cloud Infrastructure Setup', match: 88, budget: '$3K - $6K', skills: ['AWS', 'Terraform', 'Docker'] },
    ],
    trustMetrics: [
      { label: 'Delivery Rate', value: '99%' },
      { label: 'Client Satisfaction', value: '98%' },
      { label: 'On-Time Delivery', value: '97%' },
    ],
  })
}
