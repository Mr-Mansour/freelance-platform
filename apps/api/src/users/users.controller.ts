import { Controller, Get, Post, Put, Param, Body, Query, UseGuards } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { UsersService } from './users.service'

@Controller('users')
export class UsersController {
  constructor(private users: UsersService) {}

  @Get()
  @UseGuards(AuthGuard('jwt'))
  findAll(@Query('page') page?: number, @Query('limit') limit?: number) {
    return this.users.findAll(page, limit)
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  findById(@Param('id') id: string) {
    return this.users.findById(id)
  }

  @Put(':id/profile')
  @UseGuards(AuthGuard('jwt'))
  updateProfile(@Param('id') id: string, @Body() body: { firstName?: string; lastName?: string; avatarUrl?: string }) {
    return this.users.updateProfile(id, body)
  }
}
