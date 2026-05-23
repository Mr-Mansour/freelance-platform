import { Controller, Post, Body, UseGuards, Get, Req } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { AuthService } from './auth.service'

@Controller('auth')
export class AuthController {
  constructor(private auth: AuthService) {}

  @Post('webhook')
  async handleClerkWebhook(@Body() body: { type: string; data: { id: string; email_addresses: { email_address: string }[]; first_name: string; last_name: string; username: string } }) {
    if (body.type === 'user.created') {
      const email = body.data.email_addresses?.[0]?.email_address
      await this.auth.findOrCreateUser({
        id: body.data.id,
        email,
        firstName: body.data.first_name,
        lastName: body.data.last_name,
        username: body.data.username,
      })
    }
    return { received: true }
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('me')
  getProfile(@Req() req: { user: { userId: string } }) {
    return this.auth.createToken(req.user.userId)
  }
}
