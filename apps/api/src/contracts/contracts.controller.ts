import { Controller, Get, Post, Param, Body, Query, UseGuards } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { ContractsService } from './contracts.service'

@Controller('contracts')
@UseGuards(AuthGuard('jwt'))
export class ContractsController {
  constructor(private contracts: ContractsService) {}

  @Get()
  findAll(@Query('page') page?: number, @Query('limit') limit?: number) {
    return this.contracts.findAll(page, limit)
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.contracts.findById(id)
  }

  @Post(':id/milestones')
  createMilestone(@Param('id') id: string, @Body() body: { title: string; description?: string; amount: number; dueDate?: string }) {
    return this.contracts.createMilestone(id, body)
  }

  @Post('milestones/:id/complete')
  completeMilestone(@Param('id') id: string) {
    return this.contracts.completeMilestone(id)
  }

  @Post('milestones/:id/approve')
  approveMilestone(@Param('id') id: string) {
    return this.contracts.approveMilestone(id)
  }
}
