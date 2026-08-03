import { SignIn } from '@clerk/nextjs'

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-linear-to-br from-gray-950 via-[#0d0b1e] to-gray-950 flex items-center justify-center p-4">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-125 h-125 bg-indigo-600/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="relative z-10">
        <SignIn />
      </div>
    </div>
  )
}
