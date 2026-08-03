import { config } from 'dotenv'
config({ path: '.env.local' })

import { PrismaNeon } from '@prisma/adapter-neon'
import { PrismaClient } from '@prisma/client'
import { QUESTIONS } from '../lib/questions'

const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL! })
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('🌱 Iniciando seed das perguntas...')

  // Limpa perguntas existentes
  await prisma.question.deleteMany()

  // Insere todas as 100 perguntas
  await prisma.question.createMany({
    data: QUESTIONS.map(q => ({
      question: q.question,
      options: q.options,
      correctAnswer: q.correctAnswer,
      category: q.category ?? null,
    })),
  })

  console.log(`✅ ${QUESTIONS.length} perguntas inseridas com sucesso!`)
}

main()
  .catch(e => {
    console.error('❌ Erro no seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
