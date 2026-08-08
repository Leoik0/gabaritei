import { createHmac } from 'crypto'
import { prisma } from '@/lib/prisma'
import { QUESTIONS, QuizQuestion, shuffleQuestions } from '@/lib/questions'

const secret = process.env.QUIZ_SECRET ?? 'dev-only-change-in-production'

// Signs correctAnswer into an opaque token — client never sees the raw index
function sign(id: string | number, correctAnswer: number) {
  return createHmac('sha256', secret).update(`${id}:${correctAnswer}`).digest('hex')
}

export async function GET() {
  try {
    const dbQuestions = await prisma.question.findMany({
      include: { QuestionOption: true },
      orderBy: { sourceOrder: 'asc' },
    })

    if (dbQuestions.length > 0) {
      const mapped: QuizQuestion[] = dbQuestions.map((q: typeof dbQuestions[number]) => ({
        id: q.id as unknown as number,
        question: q.prompt,
        options: q.QuestionOption.map((o: { text: string }) => o.text),
        correctAnswer: q.QuestionOption.findIndex((o: { isCorrect: boolean }) => o.isCorrect),
        category: q.theme,
      }))
      return Response.json(
        shuffleQuestions(mapped).map(({ correctAnswer, ...q }) => ({
          ...q,
          token: sign(q.id, correctAnswer),
        }))
      )
    }
  } catch {}

  return Response.json(
    shuffleQuestions(QUESTIONS).map(({ correctAnswer, ...q }) => ({
      ...q,
      token: sign(q.id, correctAnswer),
    }))
  )
}
