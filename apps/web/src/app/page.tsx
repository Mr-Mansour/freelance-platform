'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import {
  Brain,
  Sparkles,
  Shield,
  MessageCircle,
  BarChart3,
  ChevronRight,
  Star,
  Users,
  Briefcase,
  Check,
  ArrowRight,
  Globe,
  Zap,
  Clock,
  Award,
  ChevronDown,
  DollarSign,
  MapPin,
} from 'lucide-react'
import Logo3D from '@/components/Logo3D'

const DEFAULT_STATS = [
  { label: 'Active Freelancers', value: '50K+', icon: Users },
  { label: 'Jobs Posted', value: '100K+', icon: Briefcase },
  { label: 'Successful Projects', value: '95%', icon: Award },
  { label: 'Avg. Response Time', value: '< 2hrs', icon: Clock },
]

function formatCount(n: number): string {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M+`
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K+`
  if (n === 0) return '0'
  return `${n}+`
}

const features = [
  {
    icon: Brain,
    title: 'AI-Powered Matching',
    description: 'Our AI matches you with the perfect freelancers or projects based on skills, experience, and budget.',
    gradient: 'from-cyan-400 to-blue-500',
  },
  {
    icon: Sparkles,
    title: 'Smart Proposals',
    description: 'Generate winning proposals instantly with AI. Stand out and get hired faster.',
    gradient: 'from-purple-400 to-pink-500',
  },
  {
    icon: Shield,
    title: 'Secure Escrow',
    description: 'Payments protected by our escrow system. Funds released only when work is approved.',
    gradient: 'from-emerald-400 to-teal-500',
  },
  {
    icon: MessageCircle,
    title: 'Real-Time Collaboration',
    description: 'Chat, share files, and collaborate in real-time with built-in messaging.',
    gradient: 'from-orange-400 to-red-500',
  },
  {
    icon: Award,
    title: 'Trust System\u2122',
    description: 'Our proprietary trust algorithm ensures quality. Six levels from Rookie to Legendary.',
    gradient: 'from-yellow-400 to-amber-500',
  },
  {
    icon: BarChart3,
    title: 'Advanced Analytics',
    description: 'Track performance, earnings, and growth with detailed analytics dashboards.',
    gradient: 'from-indigo-400 to-purple-500',
  },
]

const howItWorksFreelancer = [
  { step: 1, title: 'Create Profile', description: 'Set up your freelancer profile with your skills, portfolio, and experience.' },
  { step: 2, title: 'AI Matches You', description: 'Our AI matches you with relevant projects based on your expertise.' },
  { step: 3, title: 'Get Hired & Earn', description: 'Submit proposals, get hired, and receive payments securely.' },
]

const howItWorksClient = [
  { step: 1, title: 'Post a Project', description: 'Describe your project and requirements. AI helps optimize your listing.' },
  { step: 2, title: 'AI Recommends Talent', description: 'Get matched with the best freelancers for your project.' },
  { step: 3, title: 'Hire & Manage', description: 'Hire, collaborate, and pay securely through our platform.' },
]

const plans = [
  {
    name: 'Free',
    price: '$0',
    period: '/month',
    description: 'Perfect for getting started',
    features: ['Basic profile', 'Apply to jobs', 'Standard support', 'Community access'],
    cta: 'Get Started',
    popular: false,
  },
  {
    name: 'Pro',
    price: '$19',
    period: '/month',
    description: 'For serious freelancers',
    features: ['Everything in Free', 'AI proposal generator', 'Advanced analytics', 'Priority support', 'Custom portfolio'],
    cta: 'Start Free Trial',
    popular: true,
  },
  {
    name: 'Premium',
    price: '$49',
    period: '/month',
    description: 'Maximize your potential',
    features: ['Everything in Pro', 'Featured listings', 'Verification badge', 'Team collaboration', 'API access', 'Dedicated manager'],
    cta: 'Start Free Trial',
    popular: false,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: '',
    description: 'For businesses & teams',
    features: ['Everything in Premium', 'Custom branding', 'White-label solution', 'SLA guarantee', 'Custom integrations', '24/7 support'],
    cta: 'Contact Sales',
    popular: false,
  },
]

const LEGAL_SLUGS: Record<string, string> = {
  'Privacy Policy': '/p/privacy-policy',
  'Terms of Service': '/p/terms-of-service',
  'Cookie Policy': '/p/cookie-policy',
  'GDPR': '/p/gdpr',
  'DPA': '/p/dpa',
}

const footerLinks: Record<string, ({ label: string; href: string })[]> = {
  platform: [{ label: 'Browse Jobs', href: '/jobs' }, { label: 'Browse Freelancers', href: '/freelancers' }, { label: 'How It Works', href: '/how-it-works' }, { label: 'Trust & Safety', href: '#' }],
  company: [{ label: 'About Us', href: '/about' }, { label: 'Contact', href: '/contact' }],
  resources: [{ label: 'Help Center', href: '#' }, { label: 'Community', href: '#' }],
  legal: ['Privacy Policy', 'Terms of Service', 'Cookie Policy', 'GDPR', 'DPA'].map(l => ({ label: l, href: LEGAL_SLUGS[l] || '#' })),
}

function HeroSection() {
  const [liveStats, setLiveStats] = useState([
    { label: 'Active Freelancers', value: '0', icon: Users },
    { label: 'Jobs Posted', value: '0', icon: Briefcase },
    { label: 'Successful Projects', value: '0', icon: Award },
    { label: 'Total Earnings', value: '$0', icon: DollarSign },
  ])

  useEffect(() => {
    const stored = localStorage.getItem('cybrion_platform_stats')
    if (stored) {
      try {
        const s = JSON.parse(stored)
        setLiveStats([
          { label: 'Active Freelancers', value: formatCount(s.freelancers || 0), icon: Users },
          { label: 'Jobs Posted', value: formatCount(s.jobsPosted || 0), icon: Briefcase },
          { label: 'Successful Projects', value: formatCount(s.projects || 0), icon: Award },
          { label: 'Total Earnings', value: `$${(s.totalEarnings || 0).toLocaleString()}`, icon: DollarSign },
        ])
      } catch {}
    }
  }, [])

  return (
    <section className="relative min-h-screen -mt-16 lg:-mt-20 flex items-center justify-center overflow-hidden bg-mesh">
      <div className="absolute inset-0 bg-grid-pattern bg-grid opacity-30" />
      
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse-slow" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }} />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-400 text-sm mb-8"
          >
            <Sparkles className="w-4 h-4" />
            <span>Premium Freelance Marketplace</span>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, delay: 0.05 }} className="flex justify-center mb-6">
            <Logo3D size={140} />
          </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-6"
        >
          <span className="text-white">The Future of</span>
          <br />
          <span className="text-gradient">Freelancing</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg sm:text-xl text-gray-400 max-w-3xl mx-auto mb-10"
        >
          Connect with top AI-matched talent, collaborate in real-time, 
          and grow your business with the most advanced freelance platform ever built.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <a
            href="/sign-up"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-semibold text-lg transition-all duration-200 glow-cyan"
          >
            Start Hiring
            <ArrowRight className="w-5 h-5" />
          </a>
          <a
            href="/sign-up?role=freelancer"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl border border-gray-700 hover:border-cyan-500/50 text-gray-300 hover:text-white font-semibold text-lg transition-all duration-200"
          >
            Start Freelancing
            <ChevronRight className="w-5 h-5" />
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto"
        >
          {liveStats.map((stat) => (
            <div key={stat.label} className="text-center">
              <stat.icon className="w-6 h-6 text-cyan-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">{stat.value}</div>
              <div className="text-sm text-gray-500">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
        <ChevronDown className="w-6 h-6 text-gray-500" />
      </div>
    </section>
  )
}

function FeatureCard({ feature, index }: { feature: typeof features[0]; index: number }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group relative p-8 rounded-2xl border border-gray-800 bg-gray-900/50 backdrop-blur-sm hover:border-cyan-500/30 transition-all duration-500"
    >
      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} p-2.5 mb-5`}>
        <feature.icon className="w-full h-full text-white" />
      </div>
      <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
      <p className="text-gray-400 leading-relaxed">{feature.description}</p>
    </motion.div>
  )
}

function FeaturesSection() {
  return (
    <section id="features" className="relative py-24 lg:py-32 bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            Built for the{' '}
            <span className="text-gradient">Future of Work</span>
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Everything you need to succeed in the modern freelance economy, powered by cutting-edge AI.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <FeatureCard key={feature.title} feature={feature} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}

function HowItWorksSection() {
  return (
    <section id="how-it-works" className="relative py-24 lg:py-32 bg-gray-950/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            How It <span className="text-gradient">Works</span>
          </h2>
          <p className="text-lg text-gray-400">Simple steps to start your freelancing journey</p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-sm mb-6">
              <Users className="w-4 h-4" />
              For Freelancers
            </div>
            <div className="space-y-8">
              {howItWorksFreelancer.map((item, index) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2 }}
                  className="flex gap-6"
                >
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-cyan-600/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-bold">
                    {item.step}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-1">{item.title}</h3>
                    <p className="text-gray-400">{item.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-400 text-sm mb-6">
              <Briefcase className="w-4 h-4" />
              For Clients
            </div>
            <div className="space-y-8">
              {howItWorksClient.map((item, index) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2 }}
                  className="flex gap-6"
                >
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400 font-bold">
                    {item.step}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-1">{item.title}</h3>
                    <p className="text-gray-400">{item.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

type AdminJob = { id: string; title: string; category: string; budget: string; status: string }

function FeaturedJobsSection() {
  const [jobs, setJobs] = useState<AdminJob[]>([])

  useEffect(() => {
    const stored = localStorage.getItem('cybrion_admin_jobs')
    if (stored) {
      try { setJobs(JSON.parse(stored)) } catch {}
    }
  }, [])

  if (jobs.length === 0) return null

  return (
    <section id="jobs" className="relative py-24 lg:py-32 bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            Featured <span className="text-gradient">Jobs</span>
          </h2>
          <p className="text-lg text-gray-400">Browse open positions from top clients</p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.map((job, i) => (
            <motion.div
              key={job.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="p-6 rounded-xl border border-gray-800 bg-gray-900/50 hover:border-cyan-500/30 hover:shadow-lg hover:shadow-cyan-500/5 transition-all group"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold text-sm">
                    {job.title.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white group-hover:text-cyan-400 transition-colors">{job.title}</h3>
                    <p className="text-xs text-gray-500">{job.category}</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-cyan-400">{job.budget}</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-green-500/10 text-green-400">Active</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

function PricingSection() {
  return (
    <section id="pricing" className="relative py-24 lg:py-32 bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            Simple, <span className="text-gradient">Transparent</span> Pricing
          </h2>
          <p className="text-lg text-gray-400">Choose the plan that fits your needs. No hidden fees.</p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={`relative rounded-2xl border p-6 transition-all duration-300 ${
                plan.popular
                  ? 'border-cyan-500/50 bg-cyan-600/10 glow-cyan'
                  : 'border-gray-800 bg-gray-900/50 hover:border-gray-700'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-cyan-600 text-white text-xs font-medium">
                  Most Popular
                </div>
              )}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-white mb-1">{plan.name}</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold text-white">{plan.price}</span>
                  <span className="text-gray-500 text-sm">{plan.period}</span>
                </div>
                <p className="text-sm text-gray-500 mt-2">{plan.description}</p>
              </div>
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm text-gray-400">
                    <Check className="w-4 h-4 text-cyan-400 mt-0.5 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
              <a
                href="/sign-up"
                className={`block text-center py-3 rounded-xl font-medium transition-all duration-200 ${
                  plan.popular
                    ? 'bg-cyan-600 hover:bg-cyan-700 text-white'
                    : 'border border-gray-700 hover:border-cyan-500/50 text-gray-300 hover:text-white'
                }`}
              >
                {plan.cta}
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

function CTASection() {
  return (
    <section className="relative py-24 lg:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-600/20 via-black to-purple-600/20" />
      <div className="absolute inset-0 bg-grid-pattern bg-grid opacity-20" />
      
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl sm:text-5xl font-bold text-white mb-6">
            Ready to Transform Your{' '}
            <span className="text-gradient">Freelance Career</span>?
          </h2>
          <p className="text-lg text-gray-400 mb-10 max-w-2xl mx-auto">
            Join thousands of freelancers and clients already using Cybrion. 
            Start your journey today &mdash; it&apos;s free to get started.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="/sign-up"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-semibold text-lg transition-all duration-200 glow-cyan"
            >
              Get Started Free
              <ArrowRight className="w-5 h-5" />
            </a>
            <a
              href="/contact"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl border border-gray-700 hover:border-cyan-500/50 text-gray-300 hover:text-white font-semibold text-lg transition-all duration-200"
            >
              Talk to Sales
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="border-t border-gray-800 bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                <span className="text-white font-bold text-sm">C</span>
              </div>
              <span className="text-xl font-bold text-white">Cybrion</span>
            </div>
            <p className="text-sm text-gray-500 leading-relaxed">
              The AI-powered freelance marketplace for the future of work.
            </p>
          </div>

          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
                {category}
              </h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <a href={link.href} className="text-sm text-gray-500 hover:text-gray-300 transition-colors">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between pt-8 border-t border-gray-800">
          <p className="text-sm text-gray-600">
            &copy; {new Date().getFullYear()} Cybrion. All rights reserved.
          </p>
          <div className="flex items-center gap-6 mt-4 sm:mt-0">
            <a href="#" className="text-gray-600 hover:text-gray-400 transition-colors">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>
            </a>
            <a href="#" className="text-gray-600 hover:text-gray-400 transition-colors">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
            </a>
            <a href="#" className="text-gray-600 hover:text-gray-400 transition-colors">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/></svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default function LandingPage() {
  return (
    <>
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <FeaturedJobsSection />
      <PricingSection />
      <CTASection />
      <Footer />
    </>
  )
}
