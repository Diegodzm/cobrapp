'use client';

import { useActionState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { login } from '@/app/actions/auth';

const initialState = { success: false, error: '' };

function SubmitButton({ pending }: { pending: boolean }) {
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full py-3 rounded-xl bg-cobra-green text-zinc-950 font-bold hover:bg-[#45c400] transition-all disabled:opacity-50"
    >
      {pending ? 'Iniciando sesión...' : 'Entrar'}
    </button>
  );
}

export default function LoginForm() {
  const router = useRouter();
  const [state, formAction, pending] = useActionState(login, initialState);

  useEffect(() => {
    if (state.success) {
      toast.success('¡Bienvenido de nuevo!');
      router.push('/user-config'); // O a la ruta principal de tu app
      router.refresh();
    }
  }, [state.success, router]);

  useEffect(() => {
    if (state.error) {
      toast.error(state.error);
    }
  }, [state.error]);

  return (
    <form action={formAction} className="space-y-6">
      <h2 className="text-xl font-bold text-center text-white">Iniciar Sesión</h2>
      
      <div className="space-y-4">
        <input 
          name="email"
          type="email"
          required
          className="w-full p-3 rounded-lg bg-zinc-900 border border-zinc-700 text-white focus:border-cobra-green outline-none transition-colors" 
          placeholder="Email" 
        />
        <input 
          name="password"
          type="password" 
          required
          className="w-full p-3 rounded-lg bg-zinc-900 border border-zinc-700 text-white focus:border-cobra-green outline-none transition-colors" 
          placeholder="Contraseña" 
        />
      </div>

      <SubmitButton pending={pending} />
    </form>
  );
}