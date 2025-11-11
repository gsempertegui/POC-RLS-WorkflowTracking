// app/upload/page.tsx
'use client'

import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Upload, CheckCircle, AlertCircle } from 'lucide-react'

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [result, setResult] = useState<'success' | 'error' | null>(null)
  const [message, setMessage] = useState('')

  const supabase = createClient()

  const handleUpload = async () => {
    if (!file) return

    setUploading(true)
    setResult(null)
    setMessage('')

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('No autenticado')

      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
      const filePath = `${user.id}/${fileName}`

      // 1. Subir archivo
      const { error: uploadError } = await supabase.storage
        .from('documents')
        .upload(filePath, file)

      if (uploadError) throw uploadError

      // 3. Obtener estado 'processed'
      const { data: stateId, error: stateError } = await supabase
        .from('workflow_states')
        .select('id')
        .eq('name', 'UPLOADED')
        .single()

      if (!stateId) throw new Error('No se pudo obtener el ID del estado del documento')

      // 2. Insertar en tabla `documents`
      const { data:doc, error: docError } = await supabase
        .from('documents')
        .insert({
          name: file.name,
          current_state_id: stateId.id,
          document_path: filePath,
          user_id: user.id,
        })
        .select('id')
        .single()

      if (docError) throw docError

      // 3. Insertar en `workflows` con `document_id`
      const { error: wfError } = await supabase
        .from('workflows')
        .insert({
          document_id: doc.id,           // ← Aquí va el ID
          document_path: filePath,       // ← Para la función
          user_id: user.id,
          status_id: stateId.id,
        })

      if (wfError) throw wfError

      // 4. Invocar función
      const { error: invokeError } = await supabase.functions.invoke('extract-pdf-text', {
        body: { file_url: filePath }
      })

      if (invokeError) throw invokeError

      setResult('success')
      setMessage('¡PDF subido y procesado correctamente!')
    } catch (error: any) {
      console.error('Error:', error)
      setResult('error')
      setMessage(error.message || 'Error al procesar el PDF')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <Card className="max-w-md mx-auto p-6">
        <h1 className="text-2xl font-bold text-center mb-6">Subir PDF</h1>

        <div className="space-y-4">
          <Input
            type="file"
            accept=".pdf"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            disabled={uploading}
          />

          <Button
            onClick={handleUpload}
            disabled={!file || uploading}
            className="w-full"
            size="lg"
          >
            {uploading ? (
              <>Procesando...</>
            ) : (
              <>
                <Upload className="mr-2 h-5 w-5" />
                Subir y Procesar
              </>
            )}
          </Button>

          {result && (
            <div className={`flex items-center gap-2 p-3 rounded-lg ${
              result === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              {result === 'success' ? <CheckCircle className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
              <span>{message}</span>
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}