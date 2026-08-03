import Image from 'next/image'
import Link from 'next/link'
import { Trophy, Home } from 'lucide-react'

interface RankEntry {
  id: string
  displayName: string | null
  avatarUrl: string | null
  bestScore: number
  bestTimeSeconds: number | null
}

async function getRanking(): Promise<RankEntry[]> {
  try {
    const baseUrl =
      process.env.NEXT_PUBLIC_APP_URL ||
      (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000')
    const res = await fetch(`${baseUrl}/api/ranking`, { cache: 'no-store' })
    if (!res.ok) return []
    return res.json()
  } catch {
    return []
  }
}

export default async function RankingPage() {
  const ranking = await getRanking()

  const medalColors = ['text-yellow-400', 'text-gray-300', 'text-amber-600']

  return (
    <main className="min-h-screen bg-linear-to-b from-gray-950 to-[#0d0b1e] flex flex-col items-center py-12 px-4">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-150 h-100 bg-yellow-600/6 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-lg">
        {/* Header */}
        <div className="flex flex-col items-center gap-2 mb-8">
          <Trophy className="w-12 h-12 text-yellow-400 drop-shadow-[0_0_12px_rgba(250,204,21,0.4)]" />
          <h1 className="text-3xl font-black text-white">Ranking Global</h1>
          <p className="text-gray-500 text-sm">Top jogadores do Gabaritex</p>
        </div>

        {/* Table */}
        {ranking.length === 0 ? (
          <div className="text-center text-gray-500 py-16">
            <p>Nenhum jogador no ranking ainda.</p>
            <p className="text-sm mt-1">Seja o primeiro! 🏆</p>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {ranking.map((entry, idx) => (
              <div
                key={entry.id}
                className={[
                  'flex items-center gap-4 p-4 rounded-2xl border transition-colors',
                  idx === 0
                    ? 'bg-yellow-900/20 border-yellow-700/40'
                    : idx === 1
                    ? 'bg-gray-800/40 border-gray-700/40'
                    : idx === 2
                    ? 'bg-amber-900/10 border-amber-800/30'
                    : 'bg-gray-900/50 border-gray-800/60',
                ].join(' ')}
              >
                {/* Rank */}
                <span
                  className={[
                    'shrink-0 w-8 text-center font-black text-lg',
                    medalColors[idx] ?? 'text-gray-500',
                  ].join(' ')}
                >
                  {idx < 3 ? ['🥇', '🥈', '🥉'][idx] : `#${idx + 1}`}
                </span>

                {/* Avatar */}
                <div className="shrink-0 w-10 h-10 rounded-full overflow-hidden bg-gray-700">
                  {entry.avatarUrl ? (
                    <Image
                      src={entry.avatarUrl}
                      alt="Avatar"
                      width={40}
                      height={40}
                      className="w-full h-full object-cover"
                      unoptimized
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 font-bold text-sm">
                      {(entry.displayName ?? '?').charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>

                {/* Name & games */}
                <div className="flex-1 min-w-0">
                  <p className="text-white font-semibold truncate">{entry.displayName ?? 'Jogador'}</p>
                  {entry.bestTimeSeconds != null && (
                    <p className="text-gray-500 text-xs">{Math.floor(entry.bestTimeSeconds / 60)}m {entry.bestTimeSeconds % 60}s</p>
                  )}
                </div>

                {/* Score */}
                <div className="text-right shrink-0">
                  <p className={['font-black text-xl', medalColors[idx] ?? 'text-gray-300'].join(' ')}>
                    {entry.bestScore}
                  </p>
                  <p className="text-gray-600 text-xs">pts</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Back */}
        <div className="mt-8 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-gray-500 hover:text-indigo-400 transition-colors text-sm"
          >
            <Home size={16} />
            Voltar ao Início
          </Link>
        </div>
      </div>
    </main>
  )
}
