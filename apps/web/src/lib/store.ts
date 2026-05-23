import fs from 'fs'
import path from 'path'

const DATA_DIR = path.join(process.cwd(), 'data')

function ensureDir() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true })
}

function readJson<T>(filename: string, fallback: T): T {
  ensureDir()
  const filepath = path.join(DATA_DIR, filename)
  if (!fs.existsSync(filepath)) {
    writeJson(filename, fallback)
    return fallback
  }
  try {
    const raw = fs.readFileSync(filepath, 'utf-8')
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

function writeJson<T>(filename: string, data: T): void {
  ensureDir()
  fs.writeFileSync(path.join(DATA_DIR, filename), JSON.stringify(data, null, 2), 'utf-8')
}

// ─── Types ────────────────────────────────────────────────────────

export interface Freelancer {
  id: string; name: string; title: string; avatar: string | null
  hourlyRate: number; rating: number; reviewCount: number
  trustLevel: string; jobSuccessRate: number; location: string
  skills: string[]; verifiedBadges: string[]; completedJobs: number
  totalEarned: number; available: boolean
}

export interface Job {
  id: string; title: string; clientName: string; clientAvatar: string | null
  budget: string; budgetType: string; duration: string; description: string
  skills: string[]; proposals: number; maxProposals: number
  experienceLevel: string; postedAt: string; clientRating: number; clientHires: number
}

export interface Contract {
  id: string; title: string; clientName: string; amount: number
  escrowStatus: string; status: string; progress: number
  totalMilestones: number; completedMilestones: number
  startDate: string; endDate: string
}

export interface Conversation {
  id: string; name: string; avatar: string | null; lastMessage: string
  lastTimestamp: string; unread: number; online: boolean; project: string
}

export interface Message {
  senderId: string; text: string; timestamp: string; status: string
}

// ─── Store ─────────────────────────────────────────────────────────

export function getFreelancers(): Freelancer[] {
  return readJson<Freelancer[]>('freelancers.json', [])
}

export function getFreelancer(id: string): Freelancer | undefined {
  return getFreelancers().find(f => f.id === id)
}

export function addFreelancer(f: Freelancer): void {
  const all = getFreelancers()
  all.push(f)
  writeJson('freelancers.json', all)
}

export function getJobs(): Job[] {
  return readJson<Job[]>('jobs.json', [])
}

export function getJob(id: string): Job | undefined {
  return getJobs().find(j => j.id === id)
}

export function addJob(j: Job): void {
  const all = getJobs()
  all.push(j)
  writeJson('jobs.json', all)
}

export function getContracts(): Contract[] {
  return readJson<Contract[]>('contracts.json', [])
}

export function getContract(id: string): Contract | undefined {
  return getContracts().find(c => c.id === id)
}

export function addContract(c: Contract): void {
  const all = getContracts()
  all.push(c)
  writeJson('contracts.json', all)
}

export function updateContract(id: string, data: Partial<Contract>): void {
  const all = getContracts()
  const idx = all.findIndex(c => c.id === id)
  if (idx !== -1) { all[idx] = { ...all[idx], ...data }; writeJson('contracts.json', all) }
}

export function getConversations(): Conversation[] {
  return readJson<Conversation[]>('conversations.json', [])
}

export function addConversation(c: Conversation): void {
  const all = getConversations()
  all.push(c)
  writeJson('conversations.json', all)
}

export function getMessages(conversationId: string): Message[] {
  const all = readJson<Record<string, Message[]>>('messages.json', {})
  return all[conversationId] || []
}

export function addMessage(conversationId: string, msg: Message): void {
  const all = readJson<Record<string, Message[]>>('messages.json', {})
  if (!all[conversationId]) all[conversationId] = []
  all[conversationId].push(msg)
  writeJson('messages.json', all)
}
