'use client'

import { useEffect, useState } from 'react'
import { useUser } from '@clerk/nextjs'
import { useRouter, useSearchParams } from 'next/navigation'
import Image from 'next/image'
import { Trophy, RefreshCw, ShoppingCart, BarChart2, Clock, Target, Timer } from 'lucide-react'
import { Suspense } from 'react'

function LoserContent() {
  const { user, isLoaded } = useUser()
  const router = useRouter()
  const searchParams = useSearchParams()

  const scoreParam = Number(searchParams.get('score') ?? 0)
  const correctParam = Number(searchParams.get('correct') ?? 0)
  const timeParam = Number(searchParams.get('time') ?? 0)
  const fromCooldown = searchParams.get('cooldown') === 'true'

  const [lastLostAt, setLastLostAt] = useState<string | null>(null)
  const [cooldownMs, setCooldownMs] = useState(0)
  const [score, setScore] = useState(scoreParam)
  const [correct, setCorrect] = useState(correctParam)
  const [time, setTime] = useState(timeParam)
  const [displayName, setDisplayName] = useState('')
  const [imageUrl, setImageUrl] = useState('')

  // Fetch user stats
  useEffect(() => {
    if (!isLoaded || !user) return
    setDisplayName(user.fullName || user.username || 'Jogador')
    setImageUrl(user.imageUrl || '')
    ;(async () => {
      try {
        const res = await fetch(`/api/users?clerkUserId=${user.id}`)
        if (res.ok) {
          const stats = await res.json()
          if (stats) {
            setLastLostAt(stats.nextLifeAt)
            setDisplayName(stats.displayName || user.fullName || 'Jogador')
            setImageUrl(stats.avatarUrl || user.imageUrl || '')
            if (fromCooldown) {
              setScore(stats.lastScore ?? 0)
              setCorrect(stats.lastCorrect ?? 0)
              setTime(stats.lastTime ?? 0)
            }
          }
        }
      } catch {}
    })()
  }, [isLoaded, user, fromCooldown])

  // Cooldown countdown
  useEffect(() => {
    if (!lastLostAt) return
    const endTime = new Date(lastLostAt).getTime()
    const tick = () => {
      const remaining = endTime - Date.now()
      setCooldownMs(remaining > 0 ? remaining : 0)
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [lastLostAt])

  const formatTime = (ms: number) => {
    const h = Math.floor(ms / 3_600_000)
    const m = Math.floor((ms % 3_600_000) / 60_000)
    const s = Math.floor((ms % 60_000) / 1_000)
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  }

  const formatGameTime = (secs: number) => {
    const m = Math.floor(secs / 60)
    const s = secs % 60
    return m > 0 ? `${m}m ${s}s` : `${s}s`
  }

  const canPlay = cooldownMs === 0

  return (
    <main className="min-h-screen bg-linear-to-b from-gray-950 to-[#0d0b1e] flex flex-col items-center justify-center p-4">
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-125 h-125 bg-red-600/8 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-sm flex flex-col gap-4">
        {/* Profile card */}
        <div className="bg-gray-900 border border-gray-800 rounded-3xl p-6 flex flex-col items-center gap-4 shadow-xl shadow-black/40">
          {/* Sad emoji header */}
          <div className="text-5xl">😔</div>

          {/* Avatar */}
          <div className="w-20 h-20 rounded-full overflow-hidden ring-2 ring-red-500/40 ring-offset-2 ring-offset-gray-900">
            {imageUrl ? (
              <Image src={imageUrl} alt="Avatar" width={80} height={80} className="w-full h-full object-cover" unoptimized />
            ) : (
              <div className="w-full h-full bg-gray-800 flex items-center justify-center text-2xl font-bold text-gray-400">
                {displayName.charAt(0).toUpperCase()}
              </div>
            )}
          </div>

          <h2 className="text-white font-bold text-lg">{displayName}</h2>

          {/* Stats row */}
          <div className="w-full grid grid-cols-3 gap-2">
            <StatBox icon={<Trophy size={16} />} label="Pontos" value={score} color="text-yellow-400" />
            <StatBox icon={<Target size={16} />} label="Acertos" value={correct} color="text-green-400" />
            <StatBox icon={<Clock size={16} />} label="Tempo" value={formatGameTime(time)} color="text-blue-400" />
          </div>
        </div>

        {/* Cooldown card */}
        {cooldownMs > 0 && (
          <div className="bg-gray-900 border border-red-900/50 rounded-2xl p-4 flex flex-col items-center gap-2">
            <div className="flex items-center gap-2 text-red-400">
              <Timer size={18} />
              <span className="text-sm font-semibold">Próxima tentativa em:</span>
            </div>
            <span className="text-3xl font-black text-red-400 tabular-nums tracking-wider">
              {formatTime(cooldownMs)}
            </span>
            <p className="text-gray-600 text-xs">Você precisa esperar 12 horas.</p>
          </div>
        )}

        {canPlay && (
          <div className="bg-green-900/30 border border-green-700/50 rounded-2xl p-3 text-center">
            <p className="text-green-400 text-sm font-semibold">✅ Você já pode jogar novamente!</p>
          </div>
        )}

        {/* Action buttons */}
        <div className="flex flex-col gap-3">
          <button
            onClick={() => router.push('/ranking')}
            className="w-full flex items-center justify-center gap-2 py-3.5 bg-gray-800 hover:bg-gray-700 border border-gray-700 text-white font-semibold rounded-xl transition-colors"
          >
            <BarChart2 size={18} className="text-yellow-400" />
            Ver Ranking
          </button>

          <button
            onClick={() => canPlay ? router.push('/quiz') : null}
            disabled={!canPlay}
            className={[
              'w-full flex items-center justify-center gap-2 py-3.5 font-bold rounded-xl transition-all duration-200',
              canPlay
                ? 'bg-linear-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-indigo-500/25'
                : 'bg-gray-800/50 text-gray-600 cursor-not-allowed border border-gray-800',
            ].join(' ')}
          >
            <RefreshCw size={18} />
            Tente Novamente
          </button>

          <button
            onClick={() => router.push('/loja')}
            className="w-full flex items-center justify-center gap-2 py-3.5 bg-linear-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-bold rounded-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-amber-500/20"
          >
            <ShoppingCart size={18} />
            Compre Mais Vidas
          </button>
        </div>
      </div>
    </main>
  )
}

function StatBox({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode
  label: string
  value: string | number
  color: string
}) {
  return (
    <div className="bg-gray-800/60 rounded-xl p-3 flex flex-col items-center gap-1">
      <span className={color}>{icon}</span>
      <span className={`font-bold text-lg ${color}`}>{value}</span>
      <span className="text-gray-500 text-xs">{label}</span>
    </div>
  )
}

export default function LoserPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <LoserContent />
    </Suspense>
  )
}
