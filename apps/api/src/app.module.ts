import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { ThrottlerModule } from '@nestjs/throttler'
import { DatabaseModule } from './database/database.module'
import { AuthModule } from './auth/auth.module'
import { UsersModule } from './users/users.module'
import { FreelancersModule } from './freelancers/freelancers.module'
import { ClientsModule } from './clients/clients.module'
import { JobsModule } from './jobs/jobs.module'
import { ProposalsModule } from './proposals/proposals.module'
import { ContractsModule } from './contracts/contracts.module'
import { MessagesModule } from './messages/messages.module'
import { ReviewsModule } from './reviews/reviews.module'
import { PaymentsModule } from './payments/payments.module'
import { AiModule } from './ai/ai.module'
import { AdminModule } from './admin/admin.module'
import { NotificationsModule } from './notifications/notifications.module'
import { ChatModule } from './chat/chat.module'
import { TrustModule } from './trust/trust.module'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRoot([{ ttl: 60000, limit: 100 }]),
    DatabaseModule,
    AuthModule,
    UsersModule,
    FreelancersModule,
    ClientsModule,
    JobsModule,
    ProposalsModule,
    ContractsModule,
    MessagesModule,
    ReviewsModule,
    PaymentsModule,
    AiModule,
    AdminModule,
    NotificationsModule,
    ChatModule,
    TrustModule,
  ],
})
export class AppModule {}
