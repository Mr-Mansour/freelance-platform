import { Controller, Get, Post, Param, Body, Query, UseGuards } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { NotificationsService } from './notifications.service'

@Controller('notifications')
@UseGuards(AuthGuard('jwt'))
export class NotificationsController {
  constructor(private notifications: NotificationsService) {}

  @Get()
  findByUser(@Query('userId') userId: string, @Query('page') page?: number, @Query('limit') limit?: number) {
    return this.notifications.findByUser(userId, page, limit)
  }

  @Post(':id/read')
  markAsRead(@Param('id') id: string) {
    return this.notifications.markAsRead(id)
  }

  @Post('read-all')
  markAllAsRead(@Body('userId') userId: string) {
    return this.notifications.markAllAsRead(userId)
  }
}
