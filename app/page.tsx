'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { createPortal } from 'react-dom'
import { BookOpen, Globe, BarChart2, X, Shield } from 'lucide-react'

function Modal({
  title,
  icon,
  children,
  onClose,
}: {
  title: string
  icon: React.ReactNode
  children: React.ReactNode
  onClose: () => void
}) {
  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 bg-gray-900 border border-gray-700/60 rounded-2xl p-6 max-w-lg w-full max-h-[80vh] overflow-y-auto shadow-2xl shadow-black/50">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <span className="text-indigo-400">{icon}</span>
            <h2 className="text-lg font-bold text-white">{title}</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-white transition-colors p-1 rounded-lg hover:bg-gray-800"
          >
            <X size={18} />
          </button>
        </div>
        {children}
      </div>
    </div>,
    document.body
  )
}

function RuleItem({ n, text }: { n: number; text: string }) {
  return (
    <div className="flex items-start gap-3">
      <span className="shrink-0 w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-400 text-xs font-bold flex items-center justify-center mt-0.5">
        {n}
      </span>
      <p className="text-gray-300 leading-relaxed">{text}</p>
    </div>
  )
}

export default function HomePage() {
  const { isSignedIn } = useAuth()
  const router = useRouter()
  const [showRules, setShowRules] = useState(false)
  const [showTerms, setShowTerms] = useState(false)
  const [players, setPlayers] = useState(0)
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const res = await fetch('/api/players')
        const data = await res.json()
        setPlayers(data.count ?? 0)
      } catch { setPlayers(0) }
    }
    fetchPlayers()
    const interval = setInterval(fetchPlayers, 10_000)
    return () => clearInterval(interval)
  }, [])

  const handleJogar = () => {
    router.push(isSignedIn ? '/quiz' : '/sign-in')
  }

  return (
    <main className="relative min-h-screen bg-linear-to-br from-gray-950 via-[#0d0b1e] to-gray-950 flex flex-col items-center justify-center p-4 overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-150 bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-100 h-100 bg-violet-600/8 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center gap-5 text-center">
        <div className="flex flex-col items-center gap-2">
          <h1 className="text-7xl sm:text-8xl font-black tracking-tight bg-linear-to-r from-indigo-400 via-violet-400 to-indigo-300 bg-clip-text text-transparent leading-none">
            Gabaritex
          </h1>
          <span className="text-gray-500 text-sm font-semibold tracking-[0.25em] uppercase">quiz</span>
        </div>

        <button
          onClick={handleJogar}
          className="mt-3 px-14 py-4 bg-linear-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white text-xl font-black rounded-2xl shadow-lg shadow-indigo-500/30 transition-all duration-200 hover:scale-105 hover:shadow-indigo-500/50 active:scale-95 tracking-wide"
        >
          JOGAR
        </button>

        <div className="flex items-center gap-8 mt-1">
          <button
            onClick={() => setShowRules(true)}
            className="group flex items-center gap-2 text-gray-500 hover:text-indigo-400 transition-colors duration-200"
          >
            <BookOpen size={18} className="group-hover:scale-110 transition-transform" />
            <span className="text-sm font-medium">Rules</span>
          </button>
          <button
            onClick={() => setShowTerms(true)}
            className="group flex items-center gap-2 text-gray-500 hover:text-indigo-400 transition-colors duration-200"
          >
            <Globe size={18} className="group-hover:scale-110 transition-transform" />
            <span className="text-sm font-medium">Termos</span>
          </button>
        </div>

        <div className="flex items-center gap-3 mt-3 px-6 py-3 bg-gray-900/70 border border-gray-800/80 rounded-xl backdrop-blur-sm">
          <BarChart2 size={20} className="text-indigo-400 shrink-0" />
          <h3 className="text-gray-400 font-medium text-sm">Players</h3>
          <span className="text-white font-bold text-lg tabular-nums">{players}</span>
          <span className="text-gray-600 text-xs">cadastrados</span>
        </div>
      </div>

      {mounted && showRules && (
        <Modal title="Regras do Quiz" icon={<BookOpen size={20} />} onClose={() => setShowRules(false)}>
          <div className="space-y-3 text-sm">
            <RuleItem n={1} text="Cada partida tem 100 perguntas de múltipla escolha." />
            <RuleItem n={2} text="Você tem 10 segundos para responder cada pergunta." />
            <RuleItem n={3} text="Cada resposta correta vale 10 pontos." />
            <RuleItem n={4} text="Você começa com 1 vida. Errou? Game over!" />
            <RuleItem n={5} text="Ao perder, você fica bloqueado por 12 horas." />
            <RuleItem n={6} text="Complete todas as 100 perguntas para ser campeão!" />
            <RuleItem n={7} text="Seu melhor score é salvo no ranking global." />
          </div>
        </Modal>
      )}

      {mounted && showTerms && (
        <Modal title="Termos e Políticas" icon={<Shield size={20} />} onClose={() => setShowTerms(false)}>
          <div className="space-y-4 text-sm text-gray-300">
            <section>
              <h3 className="text-white font-semibold mb-1">Termos de Uso</h3>
              <p className="text-gray-400 leading-relaxed">Ao usar o Gabaritex, você concorda em não utilizar bots, scripts ou qualquer método que viole a integridade do jogo.</p>
            </section>
            <section>
              <h3 className="text-white font-semibold mb-1">Privacidade</h3>
              <p className="text-gray-400 leading-relaxed">Coletamos apenas nome, foto e pontuação. Seus dados não são vendidos a terceiros.</p>
            </section>
            <section>
              <h3 className="text-white font-semibold mb-1">Autenticação</h3>
              <p className="text-gray-400 leading-relaxed">Login seguro via Google. Usamos apenas para identificação no jogo.</p>
            </section>
          </div>
        </Modal>
      )}
    </main>
  )
}

