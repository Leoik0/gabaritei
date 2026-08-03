import { prisma } from '@/lib/prisma'
import { NextRequest } from 'next/server'

// POST /api/heartbeat — keep player marked as active
export async function POST(req: NextRequest) {
  try {
    const { clerkUserId } = await req.json()
    if (!clerkUserId) return Response.json({ ok: false }, { status: 400 })

    await prisma.player.updateMany({
      where: { clerkUserId },
      data: { updatedAt: new Date() },
    })

    return Response.json({ ok: true })
  } catch {
    return Response.json({ ok: false }, { status: 500 })
  }
}
