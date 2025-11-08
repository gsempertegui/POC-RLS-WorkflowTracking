// app/analytics/page.tsx
import { createClient } from '@/utils/supabase/server'
import { Card } from '@/components/ui/card'

export default async function Analytics() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { count: total } = await supabase
    .from('workflows')
    .select('*', { count: 'exact' })
    .eq('user_id', user?.id)

  const { count: processed } = await supabase
    .from('workflows')
    .select('*', { count: 'exact' })
    .eq('user_id', user?.id)
    .eq('status', 'processed')

  return (
    <div className="p-8 space-y-6">
      <h1 className="text-3xl font-bold">Analytics</h1>
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-xl font-semibold">Total de documentos</h3>
          <p className="text-4xl font-bold mt-2">{total || 0}</p>
        </Card>
        <Card className="p-6">
          <h3 className="text-xl font-semibold">Procesados</h3>
          <p className="text-4xl font-bold mt-2 text-green-600">{processed || 0}</p>
        </Card>
      </div>
    </div>
  )
}