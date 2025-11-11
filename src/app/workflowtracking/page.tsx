// app/workflowtracking/page.tsx
import { createClient } from '@/utils/supabase/server'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
//import { Workflow } from 'lucide-react'

type WorkflowWithRelations = {
  id: string
  created_at: string | null
  extracted_text: string | null
  document_id: string | null
  status_id: string | null
  document_path: string | null
  documents: { id: string; name: string | null } | null
  workflow_states: { id: string; name: string } | null
}

export default async function WorkflowTracking() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null


  const { data: workflows, error } = await supabase
    .from('workflows')
    .select(`
      *,
      documents(id, name),
      workflow_states(id, name)
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  //const { data: workflows, error } = await supabase
  //  .from('workflows')
  //  .select('id, created_at, extracted_text, document_id, \
  //    status_id, document_path, \
  //    documents!workflows_document_id_fkey( id, name ), \
  //    workflow_states!workflows_status_id_fkey( id, name ) \
  //  ')
  //  .eq('user_id', user.id)
  //  .order('created_at', { ascending: false })
  //  .overrideTypes<WorkflowWithRelations[], { merge: false }>()

    console.log('workflows: ', workflows)

    if (error) {
      console.error('Error fetching workflows:', error)
    }
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
            <p><strong>{w.document_path?.split('/').pop()}</strong></p>
            <p className="text-sm text-gray-600">
              Estado: <span className="font-medium">{w.workflow_states?.name ?? 'Sin estado' }</span>
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