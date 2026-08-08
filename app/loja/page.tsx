'use client'

import Link from 'next/link'
import { ShoppingCart, Heart, Home, Plus, Minus } from 'lucide-react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LojaPage() {
  const [quantity, setQuantity] = useState(1)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  function changeQty(delta: number) {
    setQuantity((q) => Math.min(100, Math.max(1, q + delta)))
  }

  async function handleBuy() {
    setLoading(true)
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantity }),
      })
      if (res.status === 401) {
        router.push('/sign-in')
        return
      }
      const data = await res.json()
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl
      }
    } catch {
      alert('Erro ao iniciar pagamento. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  const total = (quantity * 1).toFixed(2).replace('.', ',')

  return (
    <main className="min-h-screen bg-linear-to-b from-gray-950 to-[#0d0b1e] flex flex-col items-center justify-center p-4">
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-125 h-125 bg-amber-600/8 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-sm flex flex-col gap-6 items-center">
        <ShoppingCart className="w-14 h-14 text-amber-400" />
        <div className="text-center">
          <h1 className="text-3xl font-black text-white">Loja</h1>
          <p className="text-gray-500 mt-1 text-sm">Compre vidas extras para continuar jogando!</p>
        </div>

        {/* Product card */}
        <div className="w-full bg-gray-900 border border-amber-700/40 rounded-2xl p-6 flex flex-col items-center gap-5">
          <Heart className="w-12 h-12 text-red-500 fill-red-500" />
          <div className="text-center">
            <h2 className="text-white font-bold text-xl">Vidas Extras</h2>
            <p className="text-gray-400 text-sm mt-1">R$ 1,00 por vida</p>
          </div>

          {/* Quantity selector */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => changeQty(-1)}
              disabled={quantity <= 1}
              className="w-10 h-10 rounded-xl bg-gray-800 border border-gray-700 flex items-center justify-center text-white hover:bg-gray-700 disabled:opacity-30 transition-colors"
            >
              <Minus size={16} />
            </button>
            <input
              type="number"
              min={1}
              max={100}
              value={quantity}
              onChange={(e) => setQuantity(Math.min(100, Math.max(1, Number(e.target.value) || 1)))}
              className="w-16 text-center bg-gray-800 border border-gray-700 rounded-xl text-white font-bold text-lg py-2 focus:outline-none focus:border-amber-500"
            />
            <button
              onClick={() => changeQty(1)}
              disabled={quantity >= 100}
              className="w-10 h-10 rounded-xl bg-gray-800 border border-gray-700 flex items-center justify-center text-white hover:bg-gray-700 disabled:opacity-30 transition-colors"
            >
              <Plus size={16} />
            </button>
          </div>

          <button
            onClick={handleBuy}
            disabled={loading}
            className="w-full py-3.5 bg-linear-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 disabled:opacity-60 text-white font-black text-lg rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            {loading ? 'Aguarde...' : `Comprar por R$ ${total}`}
          </button>
          <p className="text-gray-600 text-xs">Pagamento seguro via Mercado Pago</p>
        </div>

        <Link
          href="/"
          className="flex items-center gap-2 text-gray-500 hover:text-indigo-400 transition-colors text-sm"
        >
          <Home size={16} />
          Voltar ao Início
        </Link>
      </div>
    </main>
  )
}
