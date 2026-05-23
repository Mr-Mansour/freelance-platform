import { Controller, Get, Post, Param, Body, Query, UseGuards } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { TrustService } from './trust.service'

@Controller('trust')
export class TrustController {
  constructor(private trust: TrustService) {}

  @Get(':userId')
  @UseGuards(AuthGuard('jwt'))
  getUserTrustData(@Param('userId') userId: string) {
    return this.trust.getUserTrustData(userId)
  }

  @Post(':userId/recalculate')
  @UseGuards(AuthGuard('jwt'))
  recalculate(@Param('userId') userId: string) {
    return this.trust.calculateTrustScore(userId)
  }

  @Get('leaderboard')
  getLeaderboard(@Query('page') page?: number, @Query('limit') limit?: number) {
    return this.trust.getLeaderboard(page, limit)
  }
}
