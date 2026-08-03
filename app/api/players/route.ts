import { prisma } from '@/lib/prisma'

// GET /api/players — total registered accounts
export async function GET() {
  try {
    const count = await prisma.player.count()
    return Response.json({ count })
  } catch {
    return Response.json({ count: 0 })
  }
}
