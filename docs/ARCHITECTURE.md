# Cybrion Architecture

## Overview
Cybrion is a full-stack AI-powered freelance marketplace built with modern technologies.

## Tech Stack

### Frontend
- **Next.js 15** - React framework with app router
- **React 19** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **Clerk** - Authentication

### Backend
- **NestJS** - Enterprise Node.js framework
- **Prisma** - ORM with PostgreSQL
- **Socket.io** - Real-time communication
- **BullMQ** - Job queues with Redis
- **Stripe** - Payment processing
- **OpenAI** - AI features

### Infrastructure
- **Vercel** - Frontend deployment
- **Railway/AWS ECS** - Backend deployment
- **Supabase/NeonDB** - Database hosting
- **Cloudflare** - CDN & security
- **AWS S3** - File storage
- **Redis** - Caching & sessions

## Project Structure
```
cybrion/
├── apps/
│   ├── web/          # Next.js frontend (port 3000)
│   ├── api/          # NestJS backend (port 4000)
│   └── admin/        # Admin dashboard (port 3001)
├── packages/
│   ├── ui/           # Shared UI components
│   ├── database/     # Prisma schema & client
│   ├── types/        # Shared TypeScript types
│   └── config/       # Shared configurations
└── infrastructure/   # Docker, nginx, Terraform
```

## Database
PostgreSQL with Prisma ORM. 20+ tables covering users, freelancers, clients, jobs, proposals, contracts, messages, reviews, transactions, and more.

## API Design
RESTful API with JWT authentication. Real-time features via Socket.io WebSocket gateway.

## Security
- JWT-based authentication
- Rate limiting
- Helmet security headers
- CORS configuration
- Input validation
- SQL injection prevention via Prisma

## Deployment
Docker containers orchestrated via docker-compose. Production deployment on AWS ECS/Beanstalk with Cloudflare CDN.
