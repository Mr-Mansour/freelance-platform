export type Skill = {
  id: string
  name: string
  category: string
  icon?: string
}

export type FreelancerSkill = {
  id: string
  freelancerId: string
  skillId: string
  proficiency: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT'
  isVerified: boolean
  yearsExperience: number
}
