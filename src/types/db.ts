// src/types/db.ts

// Interfaz para los estados fijos de tu flujo de trabajo
export interface WorkflowState {
  id: string; // UUID
  name: string;
}

// Interfaz para los documentos del usuario
export interface Document {
  id: string; // UUID
  user_id: string; // UUID del auth.users
  title: string;
  current_state_id: string; // UUID del estado actual
  created_at: string; // Timestamp
  // Propiedad que se une al hacer JOIN en Supabase
  workflow_states?: Pick<WorkflowState, 'name'> | null; 
}

// Tipo de datos que se usa en el Dashboard (Documentos con el nombre del estado)
export type DocumentWithStateName = Document & {
  workflow_states: Pick<WorkflowState, 'name'>;
};