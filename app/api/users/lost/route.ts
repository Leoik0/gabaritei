import { prisma } from '@/lib/prisma'
import { NextRequest } from 'next/server'

// POST /api/users/lost
export async function POST(req: NextRequest) {
  try {
    const { clerkUserId, score, correct, time } = await req.json()
    if (!clerkUserId) return Response.json({ error: 'clerkUserId required' }, { status: 400 })

    const existing = await prisma.player.findUnique({ where: { clerkUserId } })
    if (!existing) return Response.json({ error: 'Player not found' }, { status: 404 })

    const nextLifeAt = new Date(Date.now() + 12 * 60 * 60 * 1000)

    const player = await prisma.player.update({
      where: { clerkUserId },
      data: {
        lives: 0,
        nextLifeAt,
        lastScore: score ?? 0,
        lastCorrect: correct ?? 0,
        lastTime: time ?? 0,
        bestScore: Math.max(existing.bestScore, score ?? 0),
        updatedAt: new Date(),
      },
    })

    return Response.json(player)
  } catch (e) {
    console.error(e)
    return Response.json({ error: 'Internal error' }, { status: 500 })
  }
}
