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
  username?: string; languages?: string[]; aiMatchScore?: number
  responseTime?: string; trustScore?: number
}

export interface Job {
  id: string; title: string; clientName: string; clientAvatar: string | null
  budget: string; budgetType: string; duration: string; description: string
  skills: string[]; proposals: number; maxProposals: number
  experienceLevel: string; postedAt: string; clientRating: number; clientHires: number
  category: string; status: 'open' | 'in_progress' | 'completed' | 'cancelled'
  budgetMin?: number; budgetMax?: number
}

export interface Contract {
  id: string; title: string; clientName: string; amount: number
  escrowStatus: string; status: string; progress: number
  totalMilestones: number; completedMilestones: number
  startDate: string; endDate: string
  freelancerId?: string; clientId?: string
}

export interface Conversation {
  id: string; name: string; avatar: string | null; lastMessage: string
  lastTimestamp: string; unread: number; online: boolean; project: string
}

export interface Message {
  senderId: string; text: string; timestamp: string; status: string
  attachment?: { name: string; url: string; type: string }
}

export interface Review {
  id: string; contractId: string; reviewerId: string; reviewerName: string
  revieweeId: string; revieweeName: string; rating: number
  content: string; categories: Record<string, number>
  status: 'pending' | 'approved' | 'rejected'
  createdAt: string; respondedAt?: string
}

export interface Dispute {
  id: string; contractId: string; contractTitle: string
  raisedById: string; raisedByName: string; raisedByRole: string
  subject: string; description: string; priority: 'low' | 'medium' | 'high' | 'urgent'
  status: 'open' | 'investigating' | 'resolved' | 'dismissed'
  resolution?: string; resolvedById?: string; resolvedByName?: string
  createdAt: string; updatedAt: string
  messages: { senderId: string; text: string; timestamp: string }[]
}

export interface Payment {
  id: string; contractId: string; amount: number; fee: number
  status: 'pending' | 'held' | 'released' | 'refunded' | 'cancelled'
  method: string; description: string
  createdAt: string; releasedAt?: string
  fromId: string; toId: string
}

export interface FileRecord {
  id: string; name: string; originalName: string; size: number; type: string
  url: string; uploadedBy: string; uploadedAt: string
  relatedToType: string; relatedToId: string
}

export interface PlatformEvent {
  id: string; type: string; description: string; amount?: number
  userId?: string; userName?: string; createdAt: string
}

// ─── Reviews ─────────────────────────────────────────────────────

export function getReviews(): Review[] {
  return readJson<Review[]>('reviews.json', [])
}

export function getReview(id: string): Review | undefined {
  return getReviews().find(r => r.id === id)
}

export function addReview(r: Review): void {
  const all = getReviews()
  all.push(r)
  writeJson('reviews.json', all)
}

export function updateReview(id: string, data: Partial<Review>): void {
  const all = getReviews()
  const idx = all.findIndex(r => r.id === id)
  if (idx !== -1) { all[idx] = { ...all[idx], ...data }; writeJson('reviews.json', all) }
}

export function getReviewsForUser(userId: string): Review[] {
  return getReviews().filter(r => r.revieweeId === userId && r.status === 'approved')
}

// ─── Disputes ────────────────────────────────────────────────────

export function getDisputes(): Dispute[] {
  return readJson<Dispute[]>('disputes.json', [])
}

export function getDispute(id: string): Dispute | undefined {
  return getDisputes().find(d => d.id === id)
}

export function addDispute(d: Dispute): void {
  const all = getDisputes()
  all.push(d)
  writeJson('disputes.json', all)
}

export function updateDispute(id: string, data: Partial<Dispute>): void {
  const all = getDisputes()
  const idx = all.findIndex(d => d.id === id)
  if (idx !== -1) { all[idx] = { ...all[idx], ...data }; writeJson('disputes.json', all) }
}

// ─── Payments ─────────────────────────────────────────────────────

export function getPayments(): Payment[] {
  return readJson<Payment[]>('payments.json', [])
}

export function addPayment(p: Payment): void {
  const all = getPayments()
  all.push(p)
  writeJson('payments.json', all)
}

export function updatePayment(id: string, data: Partial<Payment>): void {
  const all = getPayments()
  const idx = all.findIndex(p => p.id === id)
  if (idx !== -1) { all[idx] = { ...all[idx], ...data }; writeJson('payments.json', all) }
}

// ─── Files ────────────────────────────────────────────────────────

export function getFiles(): FileRecord[] {
  return readJson<FileRecord[]>('files.json', [])
}

export function addFile(f: FileRecord): void {
  const all = getFiles()
  all.push(f)
  writeJson('files.json', all)
}

// ─── Notifications ────────────────────────────────────────────

export type AppNotification = {
  id: string; userId: string; type: string; text: string
  read: boolean; actionable: boolean; relatedId?: string
  createdAt: string
}

export function getNotifications(userId?: string): AppNotification[] {
  const all = readJson<AppNotification[]>('notifications.json', [])
  if (userId) return all.filter(n => n.userId === userId)
  return all
}

export function addNotification(n: AppNotification): void {
  const all = getNotifications()
  all.push(n)
  writeJson('notifications.json', all)
}

export function markNotificationRead(id: string): void {
  const all = getNotifications()
  const idx = all.findIndex(n => n.id === id)
  if (idx !== -1) { all[idx].read = true; writeJson('notifications.json', all) }
}

export function markAllNotificationsRead(userId: string): void {
  const all = getNotifications()
  all.forEach(n => { if (n.userId === userId) n.read = true })
  writeJson('notifications.json', all)
}

// ─── Email Log ─────────────────────────────────────────────────

export type EmailLog = {
  id: string; to: string; subject: string; body: string
  status: 'sent' | 'failed'; sentAt: string; type: string
}

export function getEmailLog(): EmailLog[] {
  return readJson<EmailLog[]>('email_log.json', [])
}

export function addEmailLog(e: EmailLog): void {
  const all = getEmailLog()
  all.push(e)
  writeJson('email_log.json', all)
}

// Helper: create notification + email log
export function notifyAndEmail(userId: string, toEmail: string, type: string, text: string, subject: string, body: string, relatedId?: string) {
  addNotification({
    id: `not${Date.now()}${Math.random().toString(36).slice(2, 6)}`,
    userId, type, text, read: false, actionable: true, relatedId,
    createdAt: new Date().toISOString(),
  })
  addEmailLog({
    id: `eml${Date.now()}`,
    to: toEmail, subject, body,
    status: 'sent', sentAt: new Date().toISOString(), type,
  })
}

// ─── Platform Events (analytics) ───────────────────────────────

export function getPlatformEvents(): PlatformEvent[] {
  return readJson<PlatformEvent[]>('platform_events.json', [])
}

export function addPlatformEvent(e: PlatformEvent): void {
  const all = getPlatformEvents()
  all.push(e)
  writeJson('platform_events.json', all)
}

// ─── Existing functions ──────────────────────────────────────────

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

export function updateFreelancer(id: string, data: Partial<Freelancer>): void {
  const all = getFreelancers()
  const idx = all.findIndex(f => f.id === id)
  if (idx !== -1) { all[idx] = { ...all[idx], ...data }; writeJson('freelancers.json', all) }
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

export function updateJob(id: string, data: Partial<Job>): void {
  const all = getJobs()
  const idx = all.findIndex(j => j.id === id)
  if (idx !== -1) { all[idx] = { ...all[idx], ...data }; writeJson('jobs.json', all) }
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
