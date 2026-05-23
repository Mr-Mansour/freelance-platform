import { Controller, Post, Body, UseGuards } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { PaymentsService } from './payments.service'

@Controller('payments')
@UseGuards(AuthGuard('jwt'))
export class PaymentsController {
  constructor(private payments: PaymentsService) {}

  @Post('create-payment-intent')
  createPaymentIntent(@Body() body: { amount: number; currency?: string; metadata?: Record<string, string> }) {
    return this.payments.createPaymentIntent(body.amount, body.currency, body.metadata)
  }

  @Post('escrow')
  createEscrow(@Body() body: { contractId: string; amount: number }) {
    return this.payments.createEscrowPayment(body.contractId, body.amount)
  }

  @Post('release')
  releasePayment(@Body('contractId') contractId: string) {
    return this.payments.releasePayment(contractId)
  }
}
