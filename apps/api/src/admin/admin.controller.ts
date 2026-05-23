import { Controller, Get, Post, Param, Body, Query, UseGuards } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { AdminService } from './admin.service'

@Controller('admin')
@UseGuards(AuthGuard('jwt'))
export class AdminController {
  constructor(private admin: AdminService) {}

  @Get('dashboard')
  getDashboard() {
    return this.admin.getDashboard()
  }

  @Get('users')
  getUsers(@Query('page') page?: number, @Query('limit') limit?: number) {
    return this.admin.getUsers(page, limit)
  }

  @Post('users/:id/suspend')
  suspendUser(@Param('id') id: string, @Body() body: { reason: string; adminId: string }) {
    return this.admin.suspendUser(id, body.reason, body.adminId)
  }

  @Post('freelancers/:id/verify')
  verifyFreelancer(@Param('id') id: string, @Body('adminId') adminId: string) {
    return this.admin.verifyFreelancer(id, adminId)
  }

  @Get('reports')
  getReports(@Query('page') page?: number, @Query('limit') limit?: number) {
    return this.admin.getReports(page, limit)
  }

  @Post('reports/:id/resolve')
  resolveReport(@Param('id') id: string, @Body('resolvedBy') resolvedBy: string) {
    return this.admin.resolveReport(id, resolvedBy)
  }
}
