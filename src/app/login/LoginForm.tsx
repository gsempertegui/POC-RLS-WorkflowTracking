// app/login/LoginForm.tsx
'use client';

import { createClient } from '@/utils/supabase/client';

async function handleLogin(formData: FormData): Promise<void> {
  const email = formData.get('email') as string | null;

  if (!email) {
    alert('Por favor, ingresa un correo electrónico.');
    return;
  }
  
  const supabase = createClient();

  // signInWithOtp acepta el tipo Email
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${location.origin}/auth/callback`,
    },
  });

  if (error) {
    alert(`Error al enviar el enlace: ${error.message}`);
  } else {
    alert('¡Enlace mágico enviado! Revisa tu correo electrónico.');
  }
}

export default function LoginForm() {
  // Nota: El formulario usa la action para llamar a la función de servidor (Server Action) o una función regular.
  return (
    <form action={handleLogin} className="flex flex-col gap-4 max-w-sm mx-auto p-8 border rounded-lg">
      <h2 className="text-xl font-bold">Acceso Seguro</h2>
      <input
        type="email"
        name="email"
        required
        placeholder="Tu correo electrónico"
        className="p-2 border rounded"
      />
      <button type="submit" className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition">
        Enviar Magic Link
      </button>
    </form>
  );
}