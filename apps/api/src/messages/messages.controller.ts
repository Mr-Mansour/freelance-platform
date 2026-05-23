import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { MessagesService } from './messages.service'

@Controller('messages')
@UseGuards(AuthGuard('jwt'))
export class MessagesController {
  constructor(private messages: MessagesService) {}

  @Get('conversations')
  getConversations(@Query('userId') userId: string) {
    return this.messages.getConversations(userId)
  }

  @Get('conversations/:id')
  getMessages(@Param('id') id: string, @Query('page') page?: number, @Query('limit') limit?: number) {
    return this.messages.getMessages(id, page, limit)
  }
}
