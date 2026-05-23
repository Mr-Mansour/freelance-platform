import { Controller, Get, Post, Param, Body, UseGuards } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { ProposalsService } from './proposals.service'

@Controller('proposals')
export class ProposalsController {
  constructor(private proposals: ProposalsService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  create(@Body() body: { jobId: string; freelancerId: string; coverLetter: string; bidAmount: number; estimatedDuration?: string }) {
    return this.proposals.create(body)
  }

  @Get('job/:jobId')
  findByJob(@Param('jobId') jobId: string) {
    return this.proposals.findByJob(jobId)
  }

  @Post(':id/accept')
  @UseGuards(AuthGuard('jwt'))
  acceptProposal(@Param('id') id: string) {
    return this.proposals.acceptProposal(id)
  }
}
