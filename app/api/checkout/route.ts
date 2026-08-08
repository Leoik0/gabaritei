import { auth } from '@clerk/nextjs/server'
import { NextRequest } from 'next/server'
import { MercadoPagoConfig, Preference } from 'mercadopago'

const mp = new MercadoPagoConfig({ accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN! })

export async function POST(req: NextRequest) {
  const { userId } = await auth()
  if (!userId) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const { quantity } = await req.json()
  const qty = Math.min(Math.max(1, Math.floor(Number(quantity))), 100)
  if (!qty) return Response.json({ error: 'Quantidade inválida' }, { status: 400 })

  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL ??
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000')

  const preference = await new Preference(mp).create({
    body: {
      items: [
        {
          id: 'vida-extra',
          title: qty === 1 ? '+1 Vida Extra' : `+${qty} Vidas Extras`,
          quantity: qty,
          unit_price: 1.0,
          currency_id: 'BRL',
        },
      ],
      metadata: { clerk_user_id: userId, lives_granted: qty },
      notification_url: `${baseUrl}/api/checkout/notify`,
      back_urls: {
        success: `${baseUrl}/quiz`,
        failure: `${baseUrl}/loja`,
        pending: `${baseUrl}/loja`,
      },
      auto_return: 'approved',
    },
  })

  return Response.json({ checkoutUrl: preference.init_point })
}
