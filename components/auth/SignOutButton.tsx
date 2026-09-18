"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function SignOutButton() {
  const router = useRouter();
  const supabase = createClient();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.refresh();
    window.location.href = "/";
  };

  return (
    <button
      onClick={handleSignOut}
      className="px-4 py-2 rounded-xl border border-zinc-700 bg-zinc-900/80 text-zinc-300 hover:text-white hover:border-[#84CC16] hover:bg-zinc-800 transition-all duration-200 text-sm font-medium cursor-pointer shadow-lg"
    >
      Cerrar Sesión
    </button>
  );
}