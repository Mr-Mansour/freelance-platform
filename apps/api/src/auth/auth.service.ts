import { Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'
import { DatabaseService } from '../database/database.service'

@Injectable()
export class AuthService {
  constructor(
    private db: DatabaseService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  async validateUser(clerkId: string) {
    const user = await this.db.user.findUnique({ where: { clerkId } })
    if (!user) throw new UnauthorizedException('User not found')
    return user
  }

  async findOrCreateUser(clerkUser: { id: string; email: string; firstName?: string; lastName?: string; username?: string }) {
    let user = await this.db.user.findUnique({ where: { clerkId: clerkUser.id } })
    
    if (!user) {
      user = await this.db.user.create({
        data: {
          clerkId: clerkUser.id,
          email: clerkUser.email,
          firstName: clerkUser.firstName || '',
          lastName: clerkUser.lastName || '',
          username: clerkUser.username || clerkUser.email.split('@')[0],
        },
      })
    }

    return user
  }

  createToken(userId: string) {
    return this.jwt.sign({ sub: userId })
  }
}
