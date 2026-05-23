import { Injectable, UnauthorizedException } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { ConfigService } from '@nestjs/config'
import { DatabaseService } from '../database/database.service'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private config: ConfigService,
    private db: DatabaseService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.get('JWT_SECRET') || 'default-secret',
    })
  }

  async validate(payload: { sub: string }) {
    const user = await this.db.user.findUnique({ where: { id: payload.sub } })
    if (!user) throw new UnauthorizedException()
    return { userId: user.id, role: user.role }
  }
}
