// src/tests/rls-security.test.ts
import { createClient } from '../../utils/server'; 
import { Document } from '@/types/db'; 
import { jest } from '@jest/globals';

// Tipamos las variables de entorno para evitar errores de TypeScript
const VICTIM_USER_ID: string = '00000000-0000-0000-0000-000000000001'; 
const ATTACKER_EMAIL: string = process.env.SUPABASE_TEST_EMAIL || '';
const ATTACKER_PASSWORD: string = process.env.SUPABASE_TEST_PASSWORD || '';
const INITIAL_STATE_ID: string = 'ID_DEL_ESTADO_SUBIDO'; // Reemplazar con una ID real

const supabase = createClient();

describe('RLS Security Test: Preventing Unauthorized Write Access', () => {
    let attackerToken: string;

    beforeAll(async () => {
        // ... (lógica de inicio de sesión del atacante, tipada por Supabase) ...
        const { data, error } = await supabase.auth.signInWithPassword({
            email: ATTACKER_EMAIL,
            password: ATTACKER_PASSWORD,
        });

        if (error || !data.session) {
            throw new Error(`Setup failed: Could not log in Attacker: ${error ? error.message : 'No session data'}`);
        }
        
        attackerToken = data.session.access_token;
    });
    
    // ... (afterAll, etc.) ...

    test('should prevent an authenticated user from inserting data for another user (RLS must FAIL)', async () => {
        const attackerClient = createClient({
            global: { headers: { Authorization: `Bearer ${attackerToken}` } }
        });

        // Intentamos insertar con un tipo explícito (Document)
        const documentData: Partial<Document> = {
            user_id: VICTIM_USER_ID, 
            title: 'Documento Atacado',
            current_state_id: INITIAL_STATE_ID, 
        };
        
        // El tipado de Supabase ayuda a saber qué esperar de data y error
        const { data, error } = await attackerClient
            .from('documents')
            .insert([documentData]); // La función insert acepta un array de documentos parciales

        // Asersiones (Assertions) Clave:
        expect(error).not.toBeNull(); 
        expect(data).toBeNull();
        expect(error?.code).toBe('42501'); // Error de permiso de RLS
    });
});