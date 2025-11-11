// src/lib/getDocumentFlowData.ts
import { createClient } from '@/utils/supabase/server';
import { DocumentWithStateName, WorkflowState } from '@/lib/db';

interface FlowData {
    documents: DocumentWithStateName[] | null;
    allStates: WorkflowState[] | null;
    error: string | null;
}

export async function getDocumentFlowData(): Promise<FlowData> {
  const supabase = createClient();

  // Obtener la lista ORDENADA de todos los estados posibles
  const { data: allStates, error: stateError } = await supabase
    .from('workflow_states')
    .select('id, name')
    .order('created_at', { ascending: true }) as { data: WorkflowState[] | null, error: any };

  if (stateError) {
    return { documents: null, allStates: null, error: stateError.message };
  }
  
  // Obtener los documentos del usuario (RLS filtra automáticamente)
  // Usamos el tipado explícito para la respuesta con la unión (JOIN)
  const { data: documents, error: docError } = await supabase
    .from('documents')
    // Nota: 'workflow_states(name)' es la sintaxis de unión (JOIN) en Supabase/PostgREST
    .select(`
      id,
      title,
      current_state_id,
      workflow_states ( name )
    `) as { data: DocumentWithStateName[] | null, error: any };

  if (docError) {
    return { documents: null, allStates, error: docError.message };
  }

  return { documents, allStates, error: null };
}