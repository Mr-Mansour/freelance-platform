import { Controller, Get, Post, Param, Body, Query, UseGuards } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { ReviewsService } from './reviews.service'

@Controller('reviews')
export class ReviewsController {
  constructor(private reviews: ReviewsService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  create(@Body() body: {
    contractId: string
    reviewerId: string
    revieweeId: string
    rating: number
    content: string
    communication?: number
    quality?: number
    professionalism?: number
    deadline?: number
    value?: number
  }) {
    return this.reviews.create(body)
  }

  @Get('user/:userId')
  findByUser(@Param('userId') userId: string, @Query('page') page?: number, @Query('limit') limit?: number) {
    return this.reviews.findByUser(userId, page, limit)
  }
}
