import { Controller, Get, Post, Param, Body, UseGuards } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { ClientsService } from './clients.service'

@Controller('clients')
export class ClientsController {
  constructor(private clients: ClientsService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  create(@Body() body: { userId: string; companyName?: string; companySize?: string; industry?: string }) {
    return this.clients.create(body.userId, body)
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.clients.findById(id)
  }
}
