// src/components/layout/Navbar.tsx
'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Upload, FileText, BarChart3, LogOut, Mail } from 'lucide-react'
import { createClient } from '@/utils/supabase/client'

export default function Navbar() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()
  const pathname = usePathname()

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      setLoading(false)
    }

    fetchUser()

    const { data: listener } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null)
    })

    return () => listener.subscription.unsubscribe()
  }, [supabase])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  if (loading) return null

  // Oculta navbar en Magic Link
  if (pathname === '/auth/magic-link') return null

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-9xl mx-auto">
        <div className="flex flex-shrink-0 justify-between items-center h-16 px-4 sm:px-6 lg:px-8">
          {/* Logo + Nombre */}
          <div className="flex justify-between">
            <Link href="/" className="flex justify-center items-center space-x-2 flex-shrink-0">
              <div className="bg-blue-600 text-white rounded-lg p-2">
                <FileText className="h-5 w-5" />
              </div>
              <span className="font-bold text-xl text-gray-900">SaaS MVP</span>
            </Link>
          </div>
          {/* Menú - forzado en línea */}
          <div className="flex  justify-between items-center space-x-1 sm:space-x-3">
            {user ? (
              <>
                <Button asChild variant="ghost" size="sm" className="h-9 px-2">
                  <Link href="/upload" className="flex items-center gap-1.5">
                    <Upload className="h-4 w-4" />
                    <span className="hidden sm:inline text-sm">Subir</span>
                  </Link>
                </Button>

                <Button asChild variant="ghost" size="sm" className="h-9 px-2">
                  <Link href="/workflowtracking" className="flex items-center gap-1.5">
                    <FileText className="h-4 w-4" />
                    <span className="hidden sm:inline text-sm">Workflow</span>
                  </Link>
                </Button>

                <Button asChild variant="ghost" size="sm" className="h-9 px-2">
                  <Link href="/analyticsdashboard" className="flex items-center gap-1.5">
                    <BarChart3 className="h-4 w-4" />
                    <span className="hidden sm:inline text-sm">Analytics</span>
                  </Link>
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                  className="h-9 px-2 flex items-center gap-1.5"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="hidden sm:inline text-sm">Salir</span>
                </Button>
              </>
            ) : (
              <Button asChild size="sm" className="h-9 px-2">
                <Link href="/auth/magic-link" className="flex items-center gap-1.5">
                  <Mail className="h-4 w-4" />
                  <span className="hidden sm:inline text-sm">Magic Link</span>
                </Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}