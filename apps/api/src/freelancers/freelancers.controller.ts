import { Controller, Get, Post, Param, Body, Query, UseGuards } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { FreelancersService } from './freelancers.service'

@Controller('freelancers')
export class FreelancersController {
  constructor(private freelancers: FreelancersService) {}

  @Get()
  findAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('skill') skill?: string,
    @Query('minRate') minRate?: number,
    @Query('maxRate') maxRate?: number,
  ) {
    return this.freelancers.findAll(page, limit, { skill, minRate, maxRate })
  }

  @Get('search')
  search(@Query('q') query: string, @Query('page') page?: number, @Query('limit') limit?: number) {
    return this.freelancers.search(query || '', page, limit)
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.freelancers.findById(id)
  }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  create(@Body() body: { userId: string; title: string; bio: string; hourlyRate?: number; skills: { name: string; category: string; proficiency: string }[] }) {
    return this.freelancers.create(body.userId, body)
  }
}
