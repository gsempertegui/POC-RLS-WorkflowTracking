// app/auth/magic-link/page.tsx
'use client'
import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'

export default function MagicLink() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()
    await supabase.auth.signInWithOtp({ email })
    setSent(true)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="tu@email.com"
        className="border p-2 rounded w-full"
      />
      <button type="submit" className="bg-blue-600 text-white p-2 rounded">
        Enviar Magic Link
      </button>
      {sent && <p className="text-green-600">Revisa tu correo!</p>}
    </form>
  )
}