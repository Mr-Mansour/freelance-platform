import { Controller, Get, Post, Param, Body, Query, UseGuards } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { JobsService } from './jobs.service'

@Controller('jobs')
export class JobsController {
  constructor(private jobs: JobsService) {}

  @Get()
  findAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('category') category?: string,
    @Query('status') status?: string,
    @Query('minBudget') minBudget?: number,
    @Query('maxBudget') maxBudget?: number,
  ) {
    return this.jobs.findAll(page, limit, { category, status, minBudget, maxBudget })
  }

  @Get('search')
  search(@Query('q') query: string, @Query('page') page?: number, @Query('limit') limit?: number) {
    return this.jobs.search(query || '', page, limit)
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.jobs.findById(id)
  }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  create(@Body() body: {
    clientId: string
    title: string
    description: string
    category: string
    skills: string[]
    budgetMin: number
    budgetMax: number
    budgetType: 'FIXED' | 'HOURLY'
    experienceLevel: 'ENTRY' | 'INTERMEDIATE' | 'EXPERT'
    duration?: string
  }) {
    return this.jobs.create(body)
  }
}
