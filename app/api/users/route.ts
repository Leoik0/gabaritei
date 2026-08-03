import { prisma } from '@/lib/prisma'
import { NextRequest } from 'next/server'
import { randomUUID } from 'crypto'

// GET /api/users?clerkUserId=xxx
export async function GET(req: NextRequest) {
  const clerkUserId = req.nextUrl.searchParams.get('clerkUserId')
  if (!clerkUserId) return Response.json({ error: 'clerkUserId required' }, { status: 400 })

  try {
    const player = await prisma.player.findUnique({ where: { clerkUserId } })
    return Response.json(player ?? null)
  } catch {
    return Response.json(null)
  }
}

// POST /api/users — upsert player
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { clerkUserId, displayName, avatarUrl } = body

    if (!clerkUserId) return Response.json({ error: 'clerkUserId required' }, { status: 400 })

    const now = new Date()
    const player = await prisma.player.upsert({
      where: { clerkUserId },
      create: {
        id: randomUUID(),
        clerkUserId,
        displayName: displayName ?? null,
        avatarUrl: avatarUrl ?? null,
        updatedAt: now,
      },
      update: {
        ...(displayName !== undefined && { displayName }),
        ...(avatarUrl !== undefined && { avatarUrl }),
        updatedAt: now,
      },
    })

    return Response.json(player)
  } catch (e) {
    console.error(e)
    return Response.json({ error: 'Internal error' }, { status: 500 })
  }
}
