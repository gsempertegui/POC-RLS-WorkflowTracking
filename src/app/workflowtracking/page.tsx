// app/dashboard/page.tsx
import { createClient } from '@/utils/supabase/server'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default async function Dashboard() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data: workflows } = await supabase
    .from('workflows')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at')

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Workflow Tracking</h1>
        <Button asChild>
          <a href="/upload">Subir PDF</a>
        </Button>
      </div>

      <div className="space-y-4">
        {workflows?.map(w => (
          <Card key={w.id} className="p-4">
            <p><strong>{w.document_path.split('/').pop()}</strong></p>
            <p className="text-sm text-gray-600">
              Estado: <span className="font-medium">{w.status}</span>
            </p>
            {w.extracted_text && (
              <p className="text-xs text-gray-500 mt-2 line-clamp-2">
                {w.extracted_text}...
              </p>
            )}
          </Card>
        ))}
        {(!workflows || workflows.length === 0) && (
          <p className="text-center text-gray-500">
            No hay documentos. <a href="/upload" className="text-blue-600 underline">Sube uno</a>
          </p>
        )}
      </div>
    </div>
  )
}