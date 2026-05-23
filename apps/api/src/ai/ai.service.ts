import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import OpenAI from 'openai'

@Injectable()
export class AiService {
  private openai: OpenAI

  constructor(private config: ConfigService) {
    this.openai = new OpenAI({ apiKey: config.get('OPENAI_API_KEY') })
  }

  async generateProposal(jobTitle: string, jobDescription: string, freelancerSkills: string[], freelancerBio: string) {
    const completion = await this.openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are an expert freelancer writing a proposal. Write compelling, professional proposals.',
        },
        {
          role: 'user',
          content: `Write a proposal for this job:\nTitle: ${jobTitle}\nDescription: ${jobDescription}\n\nMy skills: ${freelancerSkills.join(', ')}\nMy bio: ${freelancerBio}`,
        },
      ],
    })

    return completion.choices[0].message.content
  }

  async matchFreelancers(jobRequirements: string, requiredSkills: string[], freelancers: { id: string; name: string; skills: string[]; rating: number; bio: string }[]) {
    const completion = await this.openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are an AI matching freelancers to jobs. Rank the best freelancers based on relevance.',
        },
        {
          role: 'user',
          content: `Match these freelancers to this job:\nJob: ${jobRequirements}\nRequired Skills: ${requiredSkills.join(', ')}\n\nFreelancers:\n${freelancers.map(f => `${f.id}: ${f.name} - ${f.skills.join(', ')} (Rating: ${f.rating})`).join('\n')}`,
        },
      ],
    })

    return completion.choices[0].message.content
  }

  async moderateContent(content: string): Promise<{ flagged: boolean; categories: string[]; score: number }> {
    const response = await this.openai.moderations.create({ input: content })
    const result = response.results[0]
    return {
      flagged: result.flagged,
      categories: Object.entries(result.categories).filter(([, v]) => v).map(([k]) => k),
      score: result.category_scores.hate || 0,
    }
  }

  async detectScam(content: string): Promise<{ risk: 'low' | 'medium' | 'high'; reasons: string[] }> {
    const completion = await this.openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'Analyze this content for scam indicators. Return risk level and reasons.',
        },
        { role: 'user', content },
      ],
    })

    const text = completion.choices[0].message.content || ''
    const isHigh = text.toLowerCase().includes('high')
    const isMedium = text.toLowerCase().includes('medium')

    return {
      risk: isHigh ? 'high' : isMedium ? 'medium' : 'low',
      reasons: text.split('\n').filter(l => l.trim()),
    }
  }

  async optimizeProfile(profile: { title: string; bio: string; skills: string[] }) {
    const completion = await this.openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'Optimize this freelancer profile for better visibility and client engagement.',
        },
        {
          role: 'user',
          content: `Optimize this profile:\nTitle: ${profile.title}\nBio: ${profile.bio}\nSkills: ${profile.skills.join(', ')}`,
        },
      ],
    })

    return completion.choices[0].message.content
  }
}
