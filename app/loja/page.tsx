import Link from 'next/link'
import { ShoppingCart, Heart, Home } from 'lucide-react'

export default function LojaPage() {
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
        <div className="w-full bg-gray-900 border border-amber-700/40 rounded-2xl p-6 flex flex-col items-center gap-4">
          <Heart className="w-12 h-12 text-red-500 fill-red-500" />
          <div className="text-center">
            <h2 className="text-white font-bold text-xl">+1 Vida Extra</h2>
            <p className="text-gray-400 text-sm mt-1">Continue jogando imediatamente</p>
          </div>
          <button className="w-full py-3.5 bg-linear-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-black text-lg rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98]">
            R$ 4,99
          </button>
          <p className="text-gray-600 text-xs">Pagamento seguro · Em breve disponível</p>
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
