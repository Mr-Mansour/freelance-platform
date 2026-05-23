import { Controller, Post, Body, UseGuards } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { AiService } from './ai.service'

@Controller('ai')
@UseGuards(AuthGuard('jwt'))
export class AiController {
  constructor(private ai: AiService) {}

  @Post('generate-proposal')
  generateProposal(@Body() body: { jobTitle: string; jobDescription: string; freelancerSkills: string[]; freelancerBio: string }) {
    return this.ai.generateProposal(body.jobTitle, body.jobDescription, body.freelancerSkills, body.freelancerBio)
  }

  @Post('match-freelancers')
  matchFreelancers(@Body() body: { jobRequirements: string; requiredSkills: string[]; freelancers: { id: string; name: string; skills: string[]; rating: number; bio: string }[] }) {
    return this.ai.matchFreelancers(body.jobRequirements, body.requiredSkills, body.freelancers)
  }

  @Post('moderate')
  moderateContent(@Body('content') content: string) {
    return this.ai.moderateContent(content)
  }

  @Post('detect-scam')
  detectScam(@Body('content') content: string) {
    return this.ai.detectScam(content)
  }

  @Post('optimize-profile')
  optimizeProfile(@Body() body: { title: string; bio: string; skills: string[] }) {
    return this.ai.optimizeProfile(body)
  }
}
