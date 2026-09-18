import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server"; // Tu cliente de servidor de Supabase
import SignOutButton from "@/components/auth/SignOutButton"; // Un pequeño componente cliente para la acción de salir

export default async function Navbar() {
  // Consultar la sesión directamente en el servidor de forma instantánea
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <nav className="w-full bg-[#000000] h-48 border-b border-zinc-800 px-6 md:px-12 flex items-center justify-center relative z-50">
      {/* Línea de efecto inferior */}
      <div className="absolute bottom-0 left-0 w-full h-[1px] pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(90deg,transparent,rgba(82,232,0,0.5),#52e800,rgba(82,232,0,0.5),transparent)] animate-border-beam shadow-[0_0_15px_2px_#52e800]" />
      </div>

      {/* Contenedor del Logo y Título CENTRADOS (Estructura intacta) */}
      <div className="flex items-center gap-0 select-none">
        <div className="relative h-24 w-45 mt-3 -mr-13">
          <Link href="/" className="block h-full w-full rounded-full transition-colors duration-200">
            <Image
              src="/cobrapp_newlogo.png"
              alt="Cobrapp Logo"
              fill
              className="object-contain"
              sizes="(max-width: 800px) 18vw, (max-width: 1200px) 50vw, 33vw"
            />
          </Link>
        </div>

        <div className="text-5xl font-bold italic tracking-tight">
          <Link href="/" className="rounded-full px-3 py-2 transition-colors duration-200">
            <span className="text-white">Cobra</span>
            <span className="text-[#84CC16]">pp</span>
          </Link>
        </div>
      </div>

      {/* Botón de Cerrar Sesión posicionado absolutamente a la derecha sin afectar el centro */}
      {user && (
        <div className="absolute right-6 md:right-12 flex items-center">
          <SignOutButton />
        </div>
      )}
    </nav>
  );
}