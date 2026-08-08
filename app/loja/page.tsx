'use client'

import Link from 'next/link'
import { ShoppingCart, Heart, Home, Plus, Minus, Copy, Check } from 'lucide-react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

type PixData = {
  qrCode: string
  qrCodeBase64: string
  amount: number
}

export default function LojaPage() {
  const [quantity, setQuantity] = useState(1)
  const [loading, setLoading] = useState(false)
  const [pix, setPix] = useState<PixData | null>(null)
  const [copied, setCopied] = useState(false)
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
      if (res.status === 401) { router.push('/sign-in'); return }
      const data = await res.json()
      if (data.qrCode) setPix({ qrCode: data.qrCode, qrCodeBase64: data.qrCodeBase64, amount: data.amount })
    } catch {
      alert('Erro ao gerar PIX. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  async function handleCopy() {
    await navigator.clipboard.writeText(pix!.qrCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  const total = (quantity * 1).toFixed(2).replace('.', ',')

  if (pix) {
    return (
      <main className="min-h-screen bg-linear-to-b from-gray-950 to-[#0d0b1e] flex flex-col items-center justify-center p-4">
        <div className="relative z-10 w-full max-w-sm flex flex-col gap-5 items-center">
          <div className="text-center">
            <h1 className="text-2xl font-black text-white">Pague via PIX</h1>
            <p className="text-gray-400 text-sm mt-1">
              R$ {(pix.amount * 1).toFixed(2).replace('.', ',')} · {pix.amount} vida{pix.amount > 1 ? 's' : ''}
            </p>
          </div>

          {/* QR Code */}
          <div className="bg-white p-4 rounded-2xl">
            <Image
              src={`data:image/png;base64,${pix.qrCodeBase64}`}
              alt="QR Code PIX"
              width={220}
              height={220}
              unoptimized
            />
          </div>

          {/* Copia e cola */}
          <div className="w-full flex flex-col gap-2">
            <p className="text-gray-500 text-xs text-center">ou use o código copia e cola</p>
            <div className="flex gap-2">
              <input
                readOnly
                value={pix.qrCode}
                className="flex-1 bg-gray-900 border border-gray-700 rounded-xl text-gray-300 text-xs px-3 py-2 truncate focus:outline-none"
              />
              <button
                onClick={handleCopy}
                className="shrink-0 px-4 py-2 bg-amber-600 hover:bg-amber-500 rounded-xl text-white transition-colors flex items-center gap-1.5 text-sm font-bold"
              >
                {copied ? <Check size={15} /> : <Copy size={15} />}
                {copied ? 'Copiado!' : 'Copiar'}
              </button>
            </div>
          </div>

          <p className="text-gray-600 text-xs text-center">
            As vidas serão creditadas automaticamente após o pagamento.
          </p>

          <button
            onClick={() => setPix(null)}
            className="text-gray-500 hover:text-gray-300 text-sm transition-colors"
          >
            ← Voltar
          </button>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-linear-to-b from-gray-950 to-[#0d0b1e] flex flex-col items-center justify-center p-4">
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-125 h-125 bg-amber-600/8 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-sm flex flex-col gap-6 items-center">
        <ShoppingCart className="w-14 h-14 text-amber-400" />
        <div className="text-center">
          <h1 className="text-3xl font-black text-white">Loja</h1>
          <p className="text-gray-500 mt-1 text-sm">Compre vidas extras para continuar jogando!</p>
        </div>

        <div className="w-full bg-gray-900 border border-amber-700/40 rounded-2xl p-6 flex flex-col items-center gap-5">
          <Heart className="w-12 h-12 text-red-500 fill-red-500" />
          <div className="text-center">
            <h2 className="text-white font-bold text-xl">Vidas Extras</h2>
            <p className="text-gray-400 text-sm mt-1">R$ 1,00 por vida · Pagamento via PIX</p>
          </div>

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
            {loading ? 'Gerando PIX...' : `Pagar R$ ${total} via PIX`}
          </button>
          <p className="text-gray-600 text-xs">Pagamento instantâneo · Vidas creditadas na hora</p>
        </div>

        <Link href="/" className="flex items-center gap-2 text-gray-500 hover:text-indigo-400 transition-colors text-sm">
          <Home size={16} />
          Voltar ao Início
        </Link>
      </div>
    </main>
  )
}
