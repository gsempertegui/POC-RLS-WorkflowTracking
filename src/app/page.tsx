// app/page.tsx
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Mail, Upload, FileText, BarChart3 } from 'lucide-react'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-5xl mx-auto space-y-16">
        {/* Hero */}
        <section className="text-center py-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            SaaS MVP con Supabase + Next.js
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Sube tus PDFs, procesa contenido automáticamente y sigue el flujo en tiempo real.
          </p>
        </section>

        {/* Features */}
        <section className="grid md:grid-cols-3 gap-6">
          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Workflow Tracking</h3>
            <p className="text-gray-600">
              Sigue el estado de tus documentos en tiempo real.
            </p>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="bg-green-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <Upload className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Subida y Procesamiento</h3>
            <p className="text-gray-600">
              Carga PDFs con extracción automática de texto.
            </p>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="bg-purple-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <BarChart3 className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Analytics Dashboard</h3>
            <p className="text-gray-600">
              Visualiza métricas de uso y rendimiento.
            </p>
          </Card>
        </section>

        <footer className="text-center text-sm text-gray-500 pt-8">
          POC by <strong>@gsempertegui</strong> • Supabase + Next.js 15 + RLS
        </footer>
      </div>
    </main>
  )
}