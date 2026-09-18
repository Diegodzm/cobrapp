'use client';

import { useActionState, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { signup } from '@/app/actions/auth';

const initialState = { success: false, error: '' };

function SubmitButton({ pending }: { pending: boolean }) {
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full py-3 rounded-xl bg-[#84CC16] text-zinc-950 font-bold hover:bg-[#6db012] transition-all disabled:opacity-50"
    >
      {pending ? 'Creando cuenta...' : 'Registrarse'}
    </button>
  );
}

export default function RegisterForm() {
  const router = useRouter();
  const [state, formAction, pending] = useActionState(signup, initialState);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    if (state.success) {
      toast.success('Cuenta creada con éxito');
      router.push('/');
    }
  }, [state.success, router]);

  useEffect(() => {
    if (state.error) {
      toast.error(state.error);
    }
  }, [state.error]);

  return (
    <form action={formAction} className="space-y-6">
      <h2 className="text-xl font-bold text-center text-white">Crear Cuenta</h2>
      
      <div className="space-y-4">
        <input 
          name="fullName"
          type="text" 
          required
          className="w-full p-3 rounded-lg bg-zinc-900 border border-zinc-700 text-white focus:border-[#84CC16] outline-none transition-colors" 
          placeholder="Nombre completo" 
        />
        <input 
          name="whatsappPhone"
          type="tel" 
          required
          className="w-full p-3 rounded-lg bg-zinc-900 border border-zinc-700 text-white focus:border-[#84CC16] outline-none transition-colors" 
          placeholder="WhatsApp (ej: +569...)" 
        />
        <input 
          name="email"
          type="email" 
          required
          className="w-full p-3 rounded-lg bg-zinc-900 border border-zinc-700 text-white focus:border-[#84CC16] outline-none transition-colors" 
          placeholder="Email" 
        />
        <input 
          name="password" 
          type="password" 
          required
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 rounded-lg bg-zinc-900 border border-zinc-700 text-white focus:border-[#84CC16] outline-none transition-colors" 
          placeholder="Contraseña" 
        />
        <input 
          name="confirmPassword" 
          type="password" 
          required
          onChange={(e) => setConfirmPassword(e.target.value)}
          className={`w-full p-3 rounded-lg bg-zinc-900 border ${password !== confirmPassword && confirmPassword !== "" ? "border-red-500" : "border-zinc-700"} text-white focus:border-[#84CC16] outline-none transition-colors`} 
          placeholder="Confirmar contraseña" 
        />
        {password !== confirmPassword && confirmPassword !== "" && (
          <p className="text-red-500 text-xs">Las contraseñas no coinciden.</p>
        )}
      </div>

      <label className="flex items-center gap-3 text-sm text-zinc-400">
        <input type="checkbox" required className="accent-[#84CC16]" />
        <span>Acepto las políticas de privacidad.</span>
      </label>

      <SubmitButton pending={pending} />
    </form>
  );
}