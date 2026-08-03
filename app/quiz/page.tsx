 'use client'

import { useEffect, useRef, useState } from 'react'
import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Pencil, Check, X, Loader2, Play, Camera } from 'lucide-react'

export default function QuizPage() {
  const { user, isLoaded } = useUser()
  const router = useRouter()

  const [displayName, setDisplayName] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [editingName, setEditingName] = useState(false)
  const [uploadingPhoto, setUploadingPhoto] = useState(false)
  const [tempName, setTempName] = useState('')
  const [checking, setChecking] = useState(true)
  const [saving, setSaving] = useState(false)
  const nameRef = useRef<HTMLInputElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!isLoaded || !user) return

    const initName = user.fullName || user.username || 'Jogador'
    const initImg = user.imageUrl || ''

    const checkAndInit = async () => {
      try {
        const res = await fetch(`/api/users?clerkUserId=${user.id}`)
        if (res.ok) {
          const stats = await res.json()
          if (stats) {
            // Check cooldown
            if (stats.nextLifeAt) {
              const endTime = new Date(stats.nextLifeAt).getTime()
              if (Date.now() < endTime) {
                router.push('/loser?cooldown=true')
                return
              }
            }
            setDisplayName(stats.displayName || initName)
            setImageUrl(stats.avatarUrl || initImg)
            setTempName(stats.displayName || initName)
          } else {
            // Create user stats
            await fetch('/api/users', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ clerkUserId: user.id, displayName: initName, avatarUrl: initImg }),
            })
            setDisplayName(initName)
            setImageUrl(initImg)
            setTempName(initName)
          }
        }
      } catch {
        setDisplayName(initName)
        setImageUrl(initImg)
        setTempName(initName)
      }
      setChecking(false)
    }

    checkAndInit()
  }, [isLoaded, user, router])

  useEffect(() => {
    if (editingName) nameRef.current?.focus()
  }, [editingName])

  const saveName = async () => {
    if (!user || !tempName.trim()) return
    setSaving(true)
    setDisplayName(tempName.trim())
    setEditingName(false)
    try {
      await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clerkUserId: user.id, displayName: tempName.trim() }),
      })
    } catch {}
    setSaving(false)
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !user) return
    setUploadingPhoto(true)
    try {
      const bitmap = await createImageBitmap(file)
      const size = 256
      const canvas = document.createElement('canvas')
      canvas.width = size
      canvas.height = size
      const ctx = canvas.getContext('2d')!
      const min = Math.min(bitmap.width, bitmap.height)
      const sx = (bitmap.width - min) / 2
      const sy = (bitmap.height - min) / 2
      ctx.drawImage(bitmap, sx, sy, min, min, 0, 0, size, size)
      const dataUrl = canvas.toDataURL('image/jpeg', 0.85)
      setImageUrl(dataUrl)
      await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clerkUserId: user.id, avatarUrl: dataUrl }),
      })
    } catch {}
    setUploadingPhoto(false)
    e.target.value = ''
  }

  const handleStart = async () => {
    if (!user) return
    // Restore 1 life before starting
    try {
      await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clerkUserId: user.id, displayName, avatarUrl: imageUrl }),
      })
    } catch {}
    router.push('/quiz/play')
  }

  if (!isLoaded || checking) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
      </div>
    )
  }

  const avatarSrc = imageUrl || user?.imageUrl || ''

  return (
    <main className="min-h-screen bg-linear-to-b from-gray-950 to-[#0d0b1e] flex flex-col items-center justify-center p-6">
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-125 h-125 bg-indigo-600/8 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-sm">
        {/* Card */}
        <div className="bg-gray-900 border border-gray-800 rounded-3xl p-8 flex flex-col items-center gap-6 shadow-2xl shadow-black/40">
          <p className="text-gray-500 text-xs uppercase tracking-widest font-semibold">Perfil do Jogador</p>

          {/* Avatar */}
          <div className="relative group">
            <div className="w-28 h-28 rounded-full overflow-hidden ring-2 ring-indigo-500/40 ring-offset-2 ring-offset-gray-900">
              {avatarSrc ? (
                <Image
                  src={avatarSrc}
                  alt="Avatar"
                  width={112}
                  height={112}
                  className="w-full h-full object-cover"
                  unoptimized
                />
              ) : (
                <div className="w-full h-full bg-indigo-900/50 flex items-center justify-center text-4xl font-bold text-indigo-300">
                  {displayName.charAt(0).toUpperCase()}
                </div>
              )}
              {/* Upload overlay on hover */}
              {!uploadingPhoto && (
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1 rounded-full"
                >
                  <Camera size={22} className="text-white" />
                  <span className="text-white text-[10px] font-semibold">Trocar foto</span>
                </button>
              )}
              {uploadingPhoto && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center rounded-full">
                  <Loader2 size={24} className="text-white animate-spin" />
                </div>
              )}
            </div>
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploadingPhoto}
              className="absolute -bottom-1 -right-1 w-8 h-8 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 rounded-full flex items-center justify-center shadow-lg transition-colors"
            >
              {uploadingPhoto ? <Loader2 size={14} className="text-white animate-spin" /> : <Pencil size={14} className="text-white" />}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>

          {/* Display name */}
          {editingName ? (
            <div className="w-full flex gap-2">
              <input
                ref={nameRef}
                type="text"
                value={tempName}
                onChange={e => setTempName(e.target.value)}
                maxLength={24}
                className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-indigo-500 text-center"
                onKeyDown={e => { if (e.key === 'Enter') saveName(); if (e.key === 'Escape') setEditingName(false) }}
              />
              <button onClick={saveName} className="w-9 h-9 bg-green-600 hover:bg-green-500 rounded-lg flex items-center justify-center">
                <Check size={16} className="text-white" />
              </button>
              <button onClick={() => setEditingName(false)} className="w-9 h-9 bg-gray-700 hover:bg-gray-600 rounded-lg flex items-center justify-center">
                <X size={16} className="text-white" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <h2 className="text-white text-xl font-bold">{displayName}</h2>
              <button
                onClick={() => { setTempName(displayName); setEditingName(true) }}
                className="text-gray-600 hover:text-indigo-400 transition-colors"
              >
                <Pencil size={15} />
              </button>
            </div>
          )}

          {saving && (
            <p className="text-indigo-400 text-xs flex items-center gap-1">
              <Loader2 size={12} className="animate-spin" /> Salvando...
            </p>
          )}

          {/* Start button */}
          <button
            onClick={handleStart}
            className="w-full mt-2 py-4 bg-linear-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-black text-lg rounded-2xl shadow-lg shadow-indigo-500/30 transition-all duration-200 hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
          >
            <Play size={20} className="fill-white" />
            INICIAR
          </button>
        </div>
      </div>
    </main>
  )
}
