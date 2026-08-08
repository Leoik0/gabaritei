import { NextRequest } from 'next/server'
import { MercadoPagoConfig, Payment } from 'mercadopago'
import { prisma } from '@/lib/prisma'
import { randomUUID } from 'crypto'

const mp = new MercadoPagoConfig({ accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN! })

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    // MP envia tipo 'payment' para pagamentos aprovados
    if (body.type !== 'payment') return Response.json({ ok: true })

    const paymentId = String(body.data?.id)
    const payment = await new Payment(mp).get({ id: paymentId })

    if (payment.status !== 'approved') return Response.json({ ok: true })

    const meta = payment.metadata ?? {}
    // MP converte camelCase para snake_case nos metadados
    const clerkUserId: string = meta.clerk_user_id
    const livesGranted: number = Number(meta.lives_granted)

    if (!clerkUserId || !livesGranted) return Response.json({ ok: true })

    // Idempotência: ignora se já foi processado
    const existing = await prisma.lifePurchase.findUnique({ where: { paymentId } })
    if (existing) return Response.json({ ok: true })

    await prisma.$transaction([
      prisma.lifePurchase.create({
        data: {
          id: randomUUID(),
          paymentId,
          clerkUserId,
          livesGranted,
          amountInCents: Math.round((payment.transaction_amount ?? 0) * 100),
          status: 'approved',
          rawPayload: payment as object,
        },
      }),
      prisma.player.update({
        where: { clerkUserId },
        data: {
          lives: { increment: livesGranted },
          nextLifeAt: null,
          updatedAt: new Date(),
        },
      }),
    ])

    return Response.json({ ok: true })
  } catch (e) {
    console.error('[checkout/notify]', e)
    return Response.json({ error: 'Internal error' }, { status: 500 })
  }
}
