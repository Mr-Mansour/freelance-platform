import { PrismaClient, UserRole, TrustLevel } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Clean existing data
  await prisma.$transaction([
    prisma.trustEvent.deleteMany(),
    prisma.notification.deleteMany(),
    prisma.message.deleteMany(),
    prisma.review.deleteMany(),
    prisma.milestone.deleteMany(),
    prisma.proposal.deleteMany(),
    prisma.contract.deleteMany(),
    prisma.job.deleteMany(),
    prisma.product.deleteMany(),
    prisma.verificationBadge.deleteMany(),
    prisma.portfolio.deleteMany(),
    prisma.freelancerSkill.deleteMany(),
    prisma.freelancer.deleteMany(),
    prisma.client.deleteMany(),
    prisma.userProfile.deleteMany(),
    prisma.subscription.deleteMany(),
    prisma.transaction.deleteMany(),
    prisma.report.deleteMany(),
    prisma.adminAction.deleteMany(),
    prisma.chatParticipant.deleteMany(),
    prisma.chatConversation.deleteMany(),
    prisma.category.deleteMany(),
    prisma.skill.deleteMany(),
    prisma.user.deleteMany(),
  ])

  // Create admin user
  const admin = await prisma.user.create({
    data: {
      email: 'admin@cybrion.io',
      username: 'cybrion_admin',
      firstName: 'Cybrion',
      lastName: 'Admin',
      role: UserRole.OWNER,
      trustLevel: TrustLevel.LEGENDARY,
      isVerified: true,
      isOnboarded: true,
    },
  })

  // Create freelancer user
  const freelancerUser = await prisma.user.create({
    data: {
      email: 'freelancer@example.com',
      username: 'johndoe',
      firstName: 'John',
      lastName: 'Doe',
      role: UserRole.FREELANCER,
      trustLevel: TrustLevel.VERIFIED,
      isVerified: true,
      isOnboarded: true,
      profile: {
        create: {
          bio: 'Full-stack developer with 5+ years of experience building scalable web applications.',
          title: 'Senior Full-Stack Developer',
          location: 'San Francisco, CA',
          hourlyRate: 85,
          languages: ['English', 'Spanish'],
        },
      },
    },
    include: { profile: true },
  })

  const freelancer = await prisma.freelancer.create({
    data: {
      userId: freelancerUser.id,
      title: 'Senior Full-Stack Developer',
      bio: freelancerUser.profile?.bio || '',
      hourlyRate: 85,
      rating: 4.8,
      reviewCount: 24,
      jobSuccessRate: 97,
      completedJobs: 48,
      totalEarned: 156000,
      trustScore: 92,
      isVerified: true,
      skills: {
        create: [
          { name: 'React', category: 'Frontend', proficiency: 'EXPERT', isVerified: true, yearsExperience: 5 },
          { name: 'Node.js', category: 'Backend', proficiency: 'EXPERT', isVerified: true, yearsExperience: 5 },
          { name: 'TypeScript', category: 'Programming Language', proficiency: 'EXPERT', isVerified: true, yearsExperience: 4 },
          { name: 'PostgreSQL', category: 'Database', proficiency: 'ADVANCED', isVerified: true, yearsExperience: 3 },
          { name: 'AWS', category: 'DevOps', proficiency: 'ADVANCED', isVerified: false, yearsExperience: 3 },
        ],
      },
      verificationBadges: {
        create: [
          { type: 'ID_VERIFIED' },
          { type: 'SKILL_VERIFIED' },
          { type: 'PORTFOLIO_VERIFIED' },
        ],
      },
    },
  })

  // Create client user
  const clientUser = await prisma.user.create({
    data: {
      email: 'client@example.com',
      username: 'sarahwilson',
      firstName: 'Sarah',
      lastName: 'Wilson',
      role: UserRole.CLIENT,
      trustLevel: TrustLevel.VERIFIED,
      isVerified: true,
      isOnboarded: true,
    },
  })

  const client = await prisma.client.create({
    data: {
      userId: clientUser.id,
      companyName: 'TechCorp Inc.',
      companySize: '50-200',
      industry: 'Technology',
      totalSpent: 45000,
      jobsPosted: 12,
      hireRate: 75,
      rating: 4.5,
      reviewCount: 8,
    },
  })

  // Create skills
  const skillData = [
    { name: 'React', category: 'Frontend' },
    { name: 'Vue.js', category: 'Frontend' },
    { name: 'Angular', category: 'Frontend' },
    { name: 'Next.js', category: 'Frontend' },
    { name: 'Node.js', category: 'Backend' },
    { name: 'Python', category: 'Backend' },
    { name: 'Ruby on Rails', category: 'Backend' },
    { name: 'Go', category: 'Backend' },
    { name: 'Rust', category: 'Backend' },
    { name: 'TypeScript', category: 'Programming Language' },
    { name: 'JavaScript', category: 'Programming Language' },
    { name: 'PostgreSQL', category: 'Database' },
    { name: 'MongoDB', category: 'Database' },
    { name: 'Redis', category: 'Database' },
    { name: 'AWS', category: 'DevOps' },
    { name: 'Docker', category: 'DevOps' },
    { name: 'Kubernetes', category: 'DevOps' },
    { name: 'Figma', category: 'Design' },
    { name: 'UI/UX Design', category: 'Design' },
    { name: 'Graphic Design', category: 'Design' },
  ]

  for (const skill of skillData) {
    await prisma.skill.create({ data: skill })
  }

  // Create categories
  const categoryData = [
    { name: 'Web Development', slug: 'web-development', description: 'Build websites and web applications' },
    { name: 'Mobile Development', slug: 'mobile-development', description: 'iOS and Android app development' },
    { name: 'UI/UX Design', slug: 'ui-ux-design', description: 'User interface and experience design' },
    { name: 'Data Science', slug: 'data-science', description: 'Data analysis and machine learning' },
    { name: 'DevOps & Cloud', slug: 'devops-cloud', description: 'Infrastructure and cloud services' },
    { name: 'Writing & Translation', slug: 'writing-translation', description: 'Content writing and translation' },
    { name: 'Marketing', slug: 'marketing', description: 'Digital marketing and SEO' },
    { name: 'Video & Animation', slug: 'video-animation', description: 'Video production and animation' },
  ]

  for (const category of categoryData) {
    await prisma.category.create({ data: category })
  }

  // Create a sample job
  await prisma.job.create({
    data: {
      clientId: client.id,
      title: 'Build a Full-Stack SaaS Dashboard',
      description: 'We need an experienced full-stack developer to build a comprehensive analytics dashboard for our SaaS platform. The dashboard should include real-time data visualization, user management, and API integration.',
      category: 'Web Development',
      skills: ['React', 'Node.js', 'TypeScript', 'PostgreSQL'],
      budgetMin: 5000,
      budgetMax: 10000,
      budgetType: 'FIXED',
      experienceLevel: 'EXPERT',
      duration: '2-3 months',
      proposalsCount: 0,
    },
  })

  console.log('✅ Database seeded successfully!')
  console.log(`  - Admin: admin@cybrion.io`)
  console.log(`  - Freelancer: freelancer@example.com`)
  console.log(`  - Client: client@example.com`)
  console.log(`  - Skills: ${skillData.length}`)
  console.log(`  - Categories: ${categoryData.length}`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
