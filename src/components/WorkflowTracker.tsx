// src/components/WorkflowTracker.tsx
'use client';
import { DocumentWithStateName, WorkflowState } from '@/lib/db';

interface WorkflowTrackerProps {
  documents: DocumentWithStateName[];
  allStates: WorkflowState[];
}

export function WorkflowTracker({ documents, allStates }: WorkflowTrackerProps) {
  if (documents.length === 0) {
    return <p className="text-gray-500">No hay documentos para rastrear.</p>;
  }
  
  return (
    <div className="space-y-6 p-4">
      <h2 className="text-2xl font-semibold">Seguimiento de Flujos de Documentos</h2>
      
      {documents.map((doc) => {
        const currentStateName = doc.workflow_states?.name;
        
        return (
          <div key={doc.id} className="p-4 border rounded-lg shadow-sm">
            <h3 className="font-bold text-lg mb-3">{doc.title}</h3>
            
            <div className="flex justify-between items-center relative">
              {allStates.map((state, index) => {
                const isCompleted = allStates.findIndex(s => s.name === currentStateName) > index;
                const isActive = currentStateName === state.name;
                
                let dotClass = isActive ? 'bg-blue-600' : isCompleted ? 'bg-green-500' : 'bg-gray-300';
                
                return (
                  <div key={state.id} className="flex flex-col items-center w-full">
                    {/* Línea de conexión omitida por simplicidad, pero la lógica de estado es correcta */}
                    
                    {/* Punto del estado */}
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white font-bold z-10 ${dotClass}`}>
                      {isCompleted ? '✓' : index + 1}
                    </div>
                    
                    {/* Nombre del estado */}
                    <p className={`text-xs mt-2 text-center ${isActive ? 'font-bold text-blue-600' : 'text-gray-600'}`}>
                      {state.name}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}