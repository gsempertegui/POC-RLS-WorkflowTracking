// app/upload/page.tsx (actualizado)
'use client'

import { createClient } from '@/utils/supabase/client'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { AlertCircle, Upload, CheckCircle } from 'lucide-react'

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')
  const [userId, setUserId] = useState<string | null>(null)

  const supabase = createClient()

  // Obtener user_id
  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) setUserId(user.id)
    })
  }, [supabase])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0]
    if (selected && selected.type === 'application/pdf') {
      setFile(selected)
      setStatus('idle')
    } else {
      alert('Selecciona un PDF válido.')
    }
  }

  const handleUpload = async () => {
    if (!file || !userId) return

    setUploading(true)
    setStatus('idle')

    // Ruta: user_id/filename.pdf
    const filePath = `${userId}/${Date.now()}-${file.name}`

    try {
      const { error: uploadError } = await supabase.storage
        .from('documents')
        .upload(filePath, file, {
          upsert: false, // Evita sobrescribir
        })

      if (uploadError) throw uploadError

      // Después de subir el archivo
      const { error: dbError } = await supabase
        .from('workflows')
        .insert({
          user_id: userId,
          document_path: filePath,
          status: 'processing',
        })

      if (dbError) throw dbError

      setStatus('success')
      setMessage('¡PDF subido con éxito!')
    } catch (err: any) {
      setStatus('error')
      setMessage('Error: ' + err.message)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <Card className="max-w-lg mx-auto p-8">
        <h1 className="text-3xl font-bold text-center mb-6">Subir PDF</h1>

        <div className="space-y-6">
          <div>
            <Label htmlFor="pdf">Archivo PDF</Label>
            <Input
              id="pdf"
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              disabled={uploading}
              className="mt-2"
            />
          </div>

          <Button
            onClick={handleUpload}
            disabled={!file || uploading || !userId}
            className="w-full"
            size="lg"
          >
            {uploading ? (
              <>Procesando...</>
            ) : (
              <>
                <Upload className="mr-2 h-5 w-5" />
                Subir PDF
              </>
            )}
          </Button>

          {status === 'success' && (
            <div className="flex items-center gap-2 text-green-600">
              <CheckCircle className="h-5 w-5" />
              <span>{message}</span>
            </div>
          )}
          {status === 'error' && (
            <div className="flex items-center gap-2 text-red-600">
              <AlertCircle className="h-5 w-5" />
              <span>{message}</span>
            </div>
          )}
        </div>

        <div className="mt-8 text-center">
          <Button variant="link" asChild>
            <a href="/analyticsdashboard">Ir al Dashboard →</a>
          </Button>
        </div>
      </Card>
    </div>
  )
}