export interface MatchRequest {
  budget?: number
  skills: string[]
  experienceLevel?: string
  language?: string
  availability?: string
  location?: string
  category?: string
  rawText: string
}

export interface MatchResult {
  freelancerId: string
  freelancer: {
    id: string
    name: string
    title: string
    avatar: string | null
    hourlyRate: number
    rating: number
    reviewCount: number
    trustLevel: string
    jobSuccessRate: number
    location: string
    skills: string[]
    verifiedBadges: string[]
    completedJobs: number
    totalEarned: number
    available: boolean
  }
  matchScore: number
  reasons: string[]
  estimatedSuccessRate: number
  suggestedBudget: string
}

export function parseMatchRequest(text: string): MatchRequest {
  const lower = text.toLowerCase()
  const skills: string[] = []
  let budget: number | undefined
  let experienceLevel: string | undefined
  let language: string | undefined
  let availability: string | undefined
  let location: string | undefined
  let category: string | undefined

  const skillKeywords = [
    'react', 'node.js', 'node', 'vue', 'angular', 'python', 'javascript', 'typescript',
    'java', 'c#', 'go', 'rust', 'php', 'laravel', 'django', 'flask', 'next.js', 'nextjs',
    'tailwind', 'css', 'html', 'graphql', 'rest', 'api', 'sql', 'nosql', 'mongodb',
    'postgresql', 'mysql', 'redis', 'docker', 'kubernetes', 'aws', 'azure', 'gcp',
    'devops', 'ci/cd', 'machine learning', 'ai', 'data science', 'blockchain',
    'solidity', 'smart contract', 'ui/ux', 'figma', 'photoshop', 'illustrator',
    'react native', 'flutter', 'swift', 'kotlin', 'unity', 'unreal',
  ]

  skillKeywords.forEach(skill => {
    if (lower.includes(skill)) skills.push(skill)
  })

  const budgetMatch = lower.match(/(?:\$|usd)?\s*(\d+[k]?)\s*(?:dollar|usd)?/gi)
  if (budgetMatch) {
    const val = parseFloat(budgetMatch[0].replace(/[^0-9.]/g, ''))
    if (!isNaN(val)) budget = val * (budgetMatch[0].includes('k') ? 1000 : 1)
  }

  const expLevels: Record<string, string> = {
    'beginner': 'beginner',
    'entry level': 'beginner',
    'junior': 'intermediate',
    'intermediate': 'intermediate',
    'mid-level': 'intermediate',
    'senior': 'expert',
    'expert': 'expert',
    'advanced': 'expert',
  }
  for (const [key, val] of Object.entries(expLevels)) {
    if (lower.includes(key)) { experienceLevel = val; break }
  }

  const languages = ['english', 'spanish', 'french', 'german', 'arabic', 'chinese', 'japanese', 'portuguese']
  languages.forEach(lang => {
    if (lower.includes(lang)) language = lang.charAt(0).toUpperCase() + lang.slice(1)
  })

  if (lower.includes('available') || lower.includes('now') || lower.includes('immediately') || lower.includes('asap')) {
    availability = 'immediate'
  } else if (lower.includes('week')) {
    availability = 'this_week'
  } else if (lower.includes('month')) {
    availability = 'this_month'
  }

  const categories = ['web', 'mobile', 'design', 'writing', 'marketing', 'video', 'data', 'blockchain', 'security']
  categories.forEach(cat => {
    if (lower.includes(cat)) category = cat
  })

  return { budget, skills, experienceLevel, language, availability, location, category, rawText: text }
}

export async function getTopMatches(request: MatchRequest, limit = 5): Promise<MatchResult[]> {
  let freelancers: any[] = []
  try {
    const res = await fetch('/api/freelancers')
    freelancers = await res.json()
  } catch {
    return []
  }

  const scored = freelancers.map(f => {
    const score = calculateMatchScore(f, request)
    return {
      freelancerId: f.id,
      freelancer: f,
      matchScore: score,
      reasons: generateReasons(f, request, score),
      estimatedSuccessRate: Math.min(Math.round(f.jobSuccessRate * (score / 100) * 1.1), 100),
      suggestedBudget: request.budget
        ? `$${request.budget.toLocaleString()}`
        : `~$${f.hourlyRate}/hr`,
    }
  })

  return scored.sort((a, b) => b.matchScore - a.matchScore).slice(0, limit)
}

function calculateMatchScore(freelancer: any, request: MatchRequest): number {
  let score = 0
  let totalWeight = 0

  if (request.skills.length > 0) {
    const matched = request.skills.filter(s =>
      freelancer.skills?.some((fs: string) => fs.toLowerCase().includes(s) || s.includes(fs.toLowerCase()))
    ).length
    score += (matched / request.skills.length) * 40
    totalWeight += 40
  }

  if (request.budget && freelancer.hourlyRate) {
    const rateMatch = Math.max(0, 1 - (freelancer.hourlyRate * 40 - request.budget) / request.budget)
    score += Math.min(rateMatch * 20, 20)
    totalWeight += 20
  }

  if (request.experienceLevel) {
    const levelMap: Record<string, number> = { 'beginner': 0, 'intermediate': 0.5, 'expert': 1 }
    const reqLevel = levelMap[request.experienceLevel] ?? 0.5
    const fLevel = freelancer.completedJobs > 20 ? 1 : freelancer.completedJobs > 5 ? 0.5 : 0
    const expScore = 1 - Math.abs(reqLevel - fLevel)
    score += expScore * 10
    totalWeight += 10
  }

  if (request.language) {
    const langs = (freelancer.languages as string[] | undefined) || []
    if (langs.some((l: string) => l.toLowerCase().includes(request.language!.toLowerCase()))) {
      score += 10
    }
    totalWeight += 10
  }

  if (request.availability) {
    if (freelancer.available) score += 10
    totalWeight += 10
  }

  if (freelancer.completedJobs > 0) {
    const portfolioScore = Math.min(freelancer.completedJobs / 50, 1) * 5
    score += portfolioScore
    totalWeight += 5
  }

  if (freelancer.jobSuccessRate) {
    score += (freelancer.jobSuccessRate / 100) * 5
    totalWeight += 5
  }

  return totalWeight > 0 ? Math.round((score / totalWeight) * 100) : 50
}

function generateReasons(freelancer: any, request: MatchRequest, score: number): string[] {
  const reasons: string[] = []

  if (request.skills.length > 0) {
    const matched = freelancer.skills?.filter((s: string) =>
      request.skills.some(rs => s.toLowerCase().includes(rs) || rs.includes(s.toLowerCase()))
    ) || []
    if (matched.length > 0) {
      reasons.push(`Expert in ${matched.slice(0, 3).join(', ')}`)
    }
  }

  if (request.language) {
    const langs = (freelancer.languages as string[] | undefined) || []
    if (langs.some((l: string) => l.toLowerCase().includes(request.language!.toLowerCase()))) {
      reasons.push(`Speaks ${request.language} fluently`)
    }
  }

  if (freelancer.available) {
    reasons.push('Available immediately')
  }

  if (freelancer.completedJobs > 5) {
    reasons.push(`Completed ${freelancer.completedJobs} similar projects`)
  }

  if (freelancer.verifiedBadges?.length > 0) {
    reasons.push(`Verified: ${freelancer.verifiedBadges.slice(0, 2).join(', ')}`)
  }

  if (freelancer.rating && freelancer.rating >= 4.5) {
    reasons.push('Top-rated freelancer')
  }

  if (freelancer.jobSuccessRate && freelancer.jobSuccessRate >= 90) {
    reasons.push(`${freelancer.jobSuccessRate}% job success rate`)
  }

  if (request.budget && freelancer.hourlyRate) {
    const estimatedTotal = freelancer.hourlyRate * 40
    if (estimatedTotal <= request.budget * 1.1) {
      reasons.push('Within your budget range')
    }
  }

  return reasons.slice(0, 5)
}

export function getSupportResponses(): Record<string, { response: string; actions?: { label: string; api?: string; method?: string; body?: any }[] }> {
  return {
    'reset password': {
      response: 'To reset your password, go to Settings > Account > Change Password. If you forgot your password, click "Forgot Password" on the sign-in page. You can also contact an admin to reset it for you.',
      actions: [{ label: 'Go to Settings', api: '/settings' }],
    },
    'payment failed': {
      response: 'Payment failures can occur due to insufficient funds, expired cards, or bank restrictions. Check your payment method in Settings > Billing. If the issue persists, try a different payment method or contact your bank.',
      actions: [{ label: 'Check Billing', api: '/settings' }],
    },
    'verification': {
      response: 'Account verification helps build trust on the platform. You can verify your identity, skills, and contact information. Go to Settings > Profile to start the verification process.',
      actions: [{ label: 'Verify Account', api: '/settings' }],
    },
    'dispute': {
      response: 'To raise a dispute, go to your active contract and click "Raise Dispute". Provide details about the issue and our team will investigate. For urgent disputes, contact support directly.',
      actions: [{ label: 'View Contracts', api: '/contracts' }],
    },
    'withdraw': {
      response: 'To withdraw funds, go to Settings > Billing & Payouts and add your preferred payout method. Withdrawals typically process within 1-3 business days.',
      actions: [{ label: 'Billing Settings', api: '/settings' }],
    },
    'proposal': {
      response: 'To submit a proposal, browse available jobs and click "Submit Proposal". Make sure your profile is complete and includes relevant portfolio items to increase your chances.',
      actions: [{ label: 'Browse Jobs', api: '/jobs' }],
    },
    'contract': {
      response: 'Contracts detail the scope, timeline, and payment terms for a project. You can view all active contracts from your dashboard. Each contract includes milestones and escrow details.',
      actions: [{ label: 'View Contracts', api: '/contracts' }],
    },
    'escrow': {
      response: 'Escrow protects both parties by holding funds until milestones are completed. Funds are released when the client approves completed work. Check contract details for escrow status.',
    },
    'fee': {
      response: 'Cybrion charges a service fee on completed projects. The standard fee is 10% for freelancers and 5% for clients. Premium members receive reduced fees.',
    },
    'profile': {
      response: 'Complete your profile with a professional photo, detailed bio, skills, and portfolio to attract more clients. Profiles with photos get 7x more views.',
      actions: [{ label: 'Edit Profile', api: '/settings' }],
    },
  }
}

export function findSupportMatch(query: string): { intent: string; response: string; actions?: any[] } {
  const lower = query.toLowerCase()
  const responses = getSupportResponses()

  const matches = Object.entries(responses)
    .filter(([key]) => lower.includes(key))
    .sort((a, b) => b[0].length - a[0].length)

  if (matches.length > 0) {
    const [intent, data] = matches[0]
    return { intent, ...data }
  }

  if (lower.includes('hello') || lower.includes('hi') || lower.includes('hey')) {
    return {
      intent: 'greeting',
      response: 'Hello! How can I help you today? You can ask about payments, verification, disputes, proposals, contracts, or any platform issue.',
    }
  }

  if (lower.includes('help') || lower.includes('support')) {
    return {
      intent: 'help',
      response: 'I can help you with: password reset, payment issues, account verification, disputes, withdrawals, proposals, contracts, escrow, fees, and profile setup. What do you need help with?',
    }
  }

  if (lower.includes('thank')) {
    return {
      intent: 'thanks',
      response: "You're welcome! If you need anything else, I'm here to help.",
    }
  }

  return {
    intent: 'unknown',
    response: "I'm not sure I understand. Could you rephrase? I can help with payments, verification, disputes, proposals, contracts, and account settings. Or type 'help' to see what I can do.",
  }
}
