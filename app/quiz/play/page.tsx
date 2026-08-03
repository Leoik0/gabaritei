'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useUser } from '@clerk/nextjs'
import { Heart, Volume2, VolumeX, Loader2 } from 'lucide-react'

interface Question {
  id: number | string
  question: string
  options: string[]
  token: string
}

export default function QuizPlayPage() {
  const { user, isLoaded } = useUser()
  const router = useRouter()

  // ── UI state ────────────────────────────────────────────────────────────────
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [timeLeft, setTimeLeft] = useState(10)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [isAnswered, setIsAnswered] = useState(false)
  const [lastAnswerCorrect, setLastAnswerCorrect] = useState<boolean | null>(null)
  const [verifying, setVerifying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [displayScore, setDisplayScore] = useState(0)
  const [gameEnded, setGameEnded] = useState(false)

  // ── Accumulated refs (no stale closure issues) ──────────────────────────────
  const scoreRef = useRef(0)
  const correctRef = useRef(0)
  const totalTimeRef = useRef(0)
  const questionStartRef = useRef(Date.now())
  const isAnsweredRef = useRef(false)
  const gameEndedRef = useRef(false)

  // ── Timer ref ───────────────────────────────────────────────────────────────
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
  }, [])

  // ── Mark user as lost ───────────────────────────────────────────────────────
  const markLost = useCallback(
    async (score: number, correct: number, time: number) => {
      if (!user?.id) return
      try {
        await fetch('/api/users/lost', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ clerkUserId: user.id, score, correct, time }),
        })
      } catch {}
    },
    [user?.id]
  )

  // ── Load questions ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (!isLoaded || !user) return
    ;(async () => {
      try {
        const res = await fetch('/api/questions')
        const data = await res.json()
        setQuestions(data)
        setIsLoading(false)
        questionStartRef.current = Date.now()
      } catch {
        setIsLoading(false)
      }
    })()
  }, [isLoaded, user])

  // ── Heartbeat ───────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!user?.id) return
    const send = () =>
      fetch('/api/heartbeat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clerkUserId: user.id }),
      }).catch(() => {})
    send()
    const id = setInterval(send, 30_000)
    return () => clearInterval(id)
  }, [user?.id])

  // ── Start timer when question changes ───────────────────────────────────────
  useEffect(() => {
    if (isLoading || questions.length === 0) return

    stopTimer()
    setTimeLeft(10)
    isAnsweredRef.current = false
    questionStartRef.current = Date.now()

    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        const next = prev - 1
        if (next <= 0) {
          stopTimer()
          return 0
        }
        return next
      })
    }, 1000)

    return stopTimer
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex, isLoading, questions.length])

  // ── Handle timeout (timeLeft === 0) ────────────────────────────────────────
  useEffect(() => {
    if (
      timeLeft > 0 ||
      isAnsweredRef.current ||
      gameEndedRef.current ||
      isLoading ||
      questions.length === 0
    )
      return

    isAnsweredRef.current = true
    gameEndedRef.current = true
    setIsAnswered(true)
    setSelectedAnswer(-1) // -1 = timeout
    setGameEnded(true)

    const elapsed = 10
    const newTotal = totalTimeRef.current + elapsed
    totalTimeRef.current = newTotal

    markLost(scoreRef.current, correctRef.current, newTotal).then(() => {
      setTimeout(() => {
        router.push(
          `/loser?score=${scoreRef.current}&correct=${correctRef.current}&time=${newTotal}`
        )
      }, 1600)
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft])

  // ── Answer handler ──────────────────────────────────────────────────────────
  const handleAnswer = useCallback(
    async (answerIndex: number) => {
      if (isAnsweredRef.current || gameEndedRef.current) return

      stopTimer()
      isAnsweredRef.current = true
      setIsAnswered(true)
      setSelectedAnswer(answerIndex)
      setVerifying(true)

      const elapsed = Math.max(1, Math.round((Date.now() - questionStartRef.current) / 1000))
      const question = questions[currentIndex]

      let isCorrect = false
      try {
        const res = await fetch('/api/questions/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ questionId: question.id, answer: answerIndex, token: question.token }),
        })
        const data = await res.json()
        isCorrect = data.correct === true
      } catch {
        isCorrect = false
      }

      setVerifying(false)
      setLastAnswerCorrect(isCorrect)

      if (isCorrect) {
        scoreRef.current += 10
        correctRef.current += 1
        totalTimeRef.current += elapsed
        setDisplayScore(scoreRef.current)

        setTimeout(() => {
          const next = currentIndex + 1
          if (next >= questions.length) {
            router.push(
              `/winner?score=${scoreRef.current}&correct=${correctRef.current}&time=${totalTimeRef.current}`
            )
          } else {
            setSelectedAnswer(null)
            setIsAnswered(false)
            setLastAnswerCorrect(null)
            setCurrentIndex(next)
          }
        }, 1200)
      } else {
        totalTimeRef.current += elapsed
        gameEndedRef.current = true
        setGameEnded(true)

        markLost(scoreRef.current, correctRef.current, totalTimeRef.current).then(() => {
          setTimeout(() => {
            router.push(
              `/loser?score=${scoreRef.current}&correct=${correctRef.current}&time=${totalTimeRef.current}`
            )
          }, 1600)
        })
      }
    },
    [currentIndex, questions, stopTimer, markLost, router]
  )

  // ── Loading ─────────────────────────────────────────────────────────────────
  if (!isLoaded || isLoading) {
    return (
      <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-12 h-12 text-indigo-500 animate-spin" />
        <p className="text-gray-500 text-sm">Carregando perguntas...</p>
      </div>
    )
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <p className="text-red-400 text-sm">Erro ao carregar perguntas. Tente novamente.</p>
      </div>
    )
  }

  // ── Render ──────────────────────────────────────────────────────────────────
  const currentQuestion = questions[currentIndex]
  const progress = (currentIndex / questions.length) * 100

  // SVG timer circle
  const radius = 36
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference * (1 - timeLeft / 10)
  const timerColor =
    timeLeft <= 3 ? '#ef4444' : timeLeft <= 6 ? '#f59e0b' : '#6366f1'

  return (
    <div className="min-h-screen bg-linear-to-b from-gray-950 to-[#0d0b1e] flex flex-col">
      {/* ── Progress bar ── */}
      <div className="w-full h-1.5 bg-gray-800/80">
        <div
          className="h-full bg-linear-to-r from-indigo-500 to-violet-500 transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* ── Stats row ── */}
      <div className="flex items-center justify-between px-6 py-4 max-w-2xl mx-auto w-full">
        {/* Life */}
        <div className="relative w-11 h-11">
          <Heart className="w-11 h-11 text-red-500 fill-red-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.6)]" />
          <span className="absolute inset-0 flex items-center justify-center text-white text-xs font-black">1</span>
        </div>

        {/* Circular countdown */}
        <div className="relative w-22 h-22">
          <svg className="-rotate-90 w-full h-full" viewBox="0 0 88 88">
            <circle cx="44" cy="44" r={radius} stroke="#1f2937" strokeWidth="7" fill="none" />
            <circle
              cx="44"
              cy="44"
              r={radius}
              stroke={timerColor}
              strokeWidth="7"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              style={{ transition: 'stroke-dashoffset 0.95s linear, stroke 0.3s ease' }}
            />
          </svg>
          <div
            className="absolute inset-0 flex items-center justify-center font-black text-2xl"
            style={{ color: timerColor }}
          >
            {timeLeft}
          </div>
        </div>

        {/* Volume */}
        <button
          onClick={() => setIsMuted(m => !m)}
          className="text-gray-500 hover:text-white transition-colors p-1"
          aria-label={isMuted ? 'Desmutar' : 'Mutar'}
        >
          {isMuted ? <VolumeX className="w-7 h-7" /> : <Volume2 className="w-7 h-7" />}
        </button>
      </div>

      {/* ── Question & options ── */}
      <div className="flex-1 flex flex-col px-4 pb-8 max-w-2xl mx-auto w-full gap-4">
        {/* Question card */}
        <div className="bg-gray-900/80 border border-gray-800 rounded-2xl p-6">
          <p className="text-gray-600 text-xs font-semibold mb-3 uppercase tracking-wide">
            Questão {currentIndex + 1} / {questions.length}
          </p>
          <h2 className="text-white text-lg sm:text-xl font-semibold leading-relaxed">
            {currentQuestion.question}
          </h2>
        </div>

        {/* Answer buttons */}
        <div className="grid gap-3">
          {currentQuestion.options.map((option, idx) => {
            const isSelected = isAnswered && idx === selectedAnswer
            const isPending = isSelected && verifying
            const isCorrectResult = isSelected && lastAnswerCorrect === true
            const isWrongResult = isSelected && lastAnswerCorrect === false
            const isDim = isAnswered && !isSelected

            return (
              <button
                key={idx}
                onClick={() => handleAnswer(idx)}
                disabled={isAnswered || gameEnded}
                className={[
                  'w-full text-left px-5 py-4 rounded-xl border font-medium transition-all duration-200 flex items-center gap-3',
                  !isAnswered
                    ? 'border-gray-700/80 bg-gray-900/60 text-white hover:border-indigo-500/80 hover:bg-gray-800/80 active:scale-[0.98]'
                    : '',
                  isPending ? 'border-indigo-500 bg-indigo-500/15 text-indigo-300 animate-pulse' : '',
                  isCorrectResult ? 'border-green-500 bg-green-500/15 text-green-300 scale-[1.01]' : '',
                  isWrongResult ? 'border-red-500 bg-red-500/15 text-red-300' : '',
                  isDim ? 'border-gray-800/50 bg-gray-900/30 text-gray-600' : '',
                ].join(' ')}
              >
                <span
                  className={[
                    'shrink-0 w-7 h-7 rounded-full border flex items-center justify-center text-xs font-bold',
                    !isAnswered ? 'border-gray-600 text-gray-500' : '',
                    isPending ? 'border-indigo-500 text-indigo-400' : '',
                    isCorrectResult ? 'border-green-500 text-green-400' : '',
                    isWrongResult ? 'border-red-500 text-red-400' : '',
                    isDim ? 'border-gray-700 text-gray-600' : '',
                  ].join(' ')}
                >
                  {String.fromCharCode(65 + idx)}
                </span>
                {option}
              </button>
            )
          })}
        </div>

        {/* Score */}
        <div className="text-center mt-2">
          <span className="text-gray-600 text-sm">Pontuação: </span>
          <span className="text-indigo-400 font-bold">{displayScore}</span>
        </div>
      </div>
    </div>
  )
}
