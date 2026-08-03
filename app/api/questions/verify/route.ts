import { createHmac } from 'crypto'
import { NextRequest } from 'next/server'

const secret = process.env.QUIZ_SECRET ?? 'dev-only-change-in-production'

// POST /api/questions/verify — server-side answer check
export async function POST(req: NextRequest) {
  try {
    const { questionId, answer, token } = await req.json()
    if (questionId === undefined || answer === undefined || !token) {
      return Response.json({ error: 'Invalid request' }, { status: 400 })
    }
    const expected = createHmac('sha256', secret)
      .update(`${questionId}:${answer}`)
      .digest('hex')
    return Response.json({ correct: expected === token })
  } catch {
    return Response.json({ error: 'Internal error' }, { status: 500 })
  }
}
