'use client'

import { useUser } from '@clerk/nextjs'
import { useRouter, useSearchParams } from 'next/navigation'
import Image from 'next/image'
import { Trophy, BarChart2, Home } from 'lucide-react'
import { Suspense } from 'react'

function WinnerContent() {
  const { user } = useUser()
  const router = useRouter()
  const params = useSearchParams()

  const score = Number(params.get('score') ?? 0)
  const correct = Number(params.get('correct') ?? 0)
  const time = Number(params.get('time') ?? 0)

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60)
    const sec = s % 60
    return m > 0 ? `${m}m ${sec}s` : `${sec}s`
  }

  return (
    <main className="min-h-screen bg-linear-to-b from-gray-950 to-[#0d0b1e] flex flex-col items-center justify-center p-4">
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-125 h-125 bg-yellow-600/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-sm flex flex-col gap-4">
        <div className="bg-gray-900 border border-yellow-700/40 rounded-3xl p-8 flex flex-col items-center gap-5 shadow-2xl shadow-black/40">
          <Trophy className="w-16 h-16 text-yellow-400 drop-shadow-[0_0_16px_rgba(250,204,21,0.5)]" />
          <h1 className="text-3xl font-black text-white">Parabéns! 🎉</h1>
          <p className="text-gray-400 text-sm text-center">Você completou todas as 100 perguntas!</p>

          {user?.imageUrl && (
            <Image src={user.imageUrl} alt="Avatar" width={80} height={80} className="w-20 h-20 rounded-full ring-2 ring-yellow-500/50 ring-offset-2 ring-offset-gray-900" unoptimized />
          )}
          <p className="text-white font-bold text-lg">{user?.fullName || user?.username}</p>

          <div className="w-full grid grid-cols-3 gap-2">
            <div className="bg-gray-800/60 rounded-xl p-3 text-center">
              <p className="text-yellow-400 font-black text-xl">{score}</p>
              <p className="text-gray-500 text-xs">Pontos</p>
            </div>
            <div className="bg-gray-800/60 rounded-xl p-3 text-center">
              <p className="text-green-400 font-black text-xl">{correct}/100</p>
              <p className="text-gray-500 text-xs">Acertos</p>
            </div>
            <div className="bg-gray-800/60 rounded-xl p-3 text-center">
              <p className="text-blue-400 font-black text-xl">{formatTime(time)}</p>
              <p className="text-gray-500 text-xs">Tempo</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <button
            onClick={() => router.push('/ranking')}
            className="w-full flex items-center justify-center gap-2 py-3.5 bg-linear-to-r from-yellow-600 to-orange-600 hover:from-yellow-500 hover:to-orange-500 text-white font-bold rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <BarChart2 size={18} />
            Ver Ranking
          </button>
          <button
            onClick={() => router.push('/')}
            className="w-full flex items-center justify-center gap-2 py-3.5 bg-gray-800 hover:bg-gray-700 border border-gray-700 text-white font-semibold rounded-xl transition-colors"
          >
            <Home size={18} />
            Início
          </button>
        </div>
      </div>
    </main>
  )
}

export default function WinnerPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-950" />}>
      <WinnerContent />
    </Suspense>
  )
}
