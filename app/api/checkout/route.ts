import { auth, currentUser } from '@clerk/nextjs/server'
import { NextRequest } from 'next/server'
import { MercadoPagoConfig, Payment } from 'mercadopago'
import { randomUUID } from 'crypto'

const mp = new MercadoPagoConfig({ accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN! })

export async function POST(req: NextRequest) {
  const { userId } = await auth()
  if (!userId) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const { quantity } = await req.json()
  const qty = Math.min(Math.max(1, Math.floor(Number(quantity))), 100)
  if (!qty) return Response.json({ error: 'Quantidade inválida' }, { status: 400 })

  const user = await currentUser()
  const email = user?.emailAddresses[0]?.emailAddress ?? 'pagador@gabaritei.app'

  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL ??
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000')

  const payment = await new Payment(mp).create({
    body: {
      transaction_amount: qty * 1.0,
      description: qty === 1 ? '+1 Vida Extra — Gabaritei' : `+${qty} Vidas Extras — Gabaritei`,
      payment_method_id: 'pix',
      payer: { email },
      metadata: { clerk_user_id: userId, lives_granted: qty },
      notification_url: `${baseUrl}/api/checkout/notify`,
    },
    requestOptions: { idempotencyKey: randomUUID() },
  })

  const pix = payment.point_of_interaction?.transaction_data
  return Response.json({
    paymentId: payment.id,
    qrCode: pix?.qr_code,
    qrCodeBase64: pix?.qr_code_base64,
    amount: qty,
  })
}

