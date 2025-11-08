// app/auth/login/page.tsx
'use client'

import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Label } from '@/components/ui/label'

export default function LoginForm() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    setLoading(true)
    const supabase = createClient()

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
    })

    setLoading(false)
    if (error) {
      alert('Error: ' + error.message)
    } else {
      setSent(true)
    }
  }

  return (
    <Card className="max-w-md mx-auto p-6 mt-12">
      <h2 className="text-2xl font-bold text-center mb-6">Iniciar sesión</h2>
      
      {sent ? (
        <div className="text-center space-y-4">
          <p className="text-green-600">¡Magic Link enviado!</p>
          <p className="text-sm text-gray-600">Revisa tu correo: <strong>{email}</strong></p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="email">Correo electrónico</Label>
            <Input
              id="email"
              type="email"
              placeholder="tu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
          </div>
          
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Enviando...' : 'Enviar Magic Link'}
          </Button>
        </form>
      )}
    </Card>
  )
}