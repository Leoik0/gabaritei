import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const ranking = await prisma.player.findMany({
      orderBy: { bestScore: 'desc' },
      take: 20,
      select: {
        id: true,
        clerkUserId: true,
        displayName: true,
        avatarUrl: true,
        bestScore: true,
        bestTimeSeconds: true,
      },
    })
    return Response.json(ranking)
  } catch {
    return Response.json([])
  }
}
