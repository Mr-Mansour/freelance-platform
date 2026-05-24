# CYBRION — Freelance Marketplace Platform

A full-stack freelance marketplace platform built with Next.js 15, TypeScript, and Tailwind CSS. Connects clients with top freelancers through AI-powered matching, secure escrow payments, and real-time collaboration.

## Tech Stack

- **Frontend:** Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS, Framer Motion
- **Data Layer:** JSON file-based persistence (zero-config, no database required)
- **Auth:** Local auth with role-based access (Owner / Admin / User), Clerk-ready
- **Monorepo:** Turborepo + pnpm workspaces

## Features

### For Clients
- Post jobs with detailed requirements, budgets, and experience levels
- Browse freelancer profiles with skills, portfolio, reviews, and trust scores
- AI-powered freelancer matching and proposal generation
- Hire freelancers and manage contracts with milestone-based payments

### For Freelancers
- Browse and filter jobs by category, budget, experience level, and status
- Submit proposals with AI-generated cover letters
- Manage contracts, milestones, and escrow payments
- Receive reviews and build trust score

### Platform Features
- **Real-time Chat** — polling-based messaging with file attachments
- **Review & Rating System** — submit reviews after contract completion, admin moderation
- **Dispute Resolution** — raise and manage disputes with message threads
- **Content Moderation** — flag and review reported jobs, freelancers, and content
- **File Uploads** — attach files to messages, proposals, and portfolios
- **Admin Dashboard** — analytics, sales tracking, user management, CMS pages
- **Email Notifications** — automated notifications with admin email log
- **Custom Pages** — build CMS pages through the admin panel

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm 8+

### Installation

```bash
# Clone the repository
git clone https://github.com/Mr-Mansour/freelance-platform.git
cd freelance-platform

# Install dependencies
pnpm install

# Start the web app development server
cd apps/web
pnpm dev
```

## Project Structure

```
cybrion/
├── apps/
│   ├── web/              # Main Next.js frontend
│   │   ├── src/
│   │   │   ├── app/      # App Router pages & API routes
│   │   │   │   ├── admin/    # Admin panel (8+ sections)
│   │   │   │   └── api/      # REST API route handlers
│   │   │   ├── components/   # Shared React components
│   │   │   └── lib/          # Store, auth, utilities
│   │   └── data/             # JSON data files
│   ├── admin/             # Standalone admin app
│   └── api/               # NestJS backend API
├── packages/
│   ├── ui/                # Shared UI component library
│   ├── types/             # Shared TypeScript types
│   ├── database/          # Prisma schema
│   └── config/            # ESLint & TypeScript config
└── turbo.json             # Turborepo pipeline
```

## Deployment

The web app is configured for Vercel deployment via `vercel.json`:

```bash
# The vercel.json at the monorepo root handles:
# - Build: npx turbo build --filter=@cybrion/web
# - Install: pnpm install
# - Output: apps/web/.next
```

## Admin Sections

| Section | Description |
|---|---|
| Overview | Dashboard with key metrics |
| Analytics | Charts for revenue, jobs by category, platform events |
| Messages | Team communication |
| Meetings | Schedule and manage meetings |
| Review | Moderate user reviews |
| Sales | Track revenue and team performance |
| Service | Support ticket management |
| Pages | Build custom CMS pages |
| Disputes | Resolve client-freelancer disputes |
| Moderation | Flag and review reported content |
| Email Log | View all sent email notifications |
| Access | User management and permissions |

## License

MIT
