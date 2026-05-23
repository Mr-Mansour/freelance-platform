import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { DatabaseService } from '../database/database.service'
import Stripe from 'stripe'

@Injectable()
export class PaymentsService {
  private stripe: Stripe

  constructor(
    private db: DatabaseService,
    private config: ConfigService,
  ) {
    this.stripe = new Stripe(config.get('STRIPE_SECRET_KEY')!, {
      apiVersion: '2025-02-24.acacia',
    })
  }

  async createPaymentIntent(amount: number, currency = 'usd', metadata?: Record<string, string>) {
    return this.stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency,
      metadata,
    })
  }

  async createEscrowPayment(contractId: string, amount: number) {
    const paymentIntent = await this.createPaymentIntent(amount, 'usd', { contractId })
    
    await this.db.contract.update({
      where: { id: contractId },
      data: {
        escrowAmount: amount,
        escrowStatus: 'FUNDED',
      },
    })

    return paymentIntent
  }

  async releasePayment(contractId: string) {
    const payment = await this.db.contract.update({
      where: { id: contractId },
      data: { escrowStatus: 'RELEASED' },
    })
    return payment
  }

  async createTransfer(amount: number, destination: string) {
    return this.stripe.transfers.create({
      amount: Math.round(amount * 100),
      currency: 'usd',
      destination,
    })
  }
}
