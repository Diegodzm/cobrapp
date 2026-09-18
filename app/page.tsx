"use client";
import "./globals.css";
import AuthModal from "@/components/auth/AuthModal"

export default function Home() {
  return (
    <main className="min-h-[calc(100vh-12rem)] w-full bg-[#0F172A] flex flex-col lg:flex-row font-brand">

      {/* SECCIÓN IZQUIERDA: Video de Demostración */}
      <section className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-12 border-b lg:border-b-0 lg:border-r border-zinc-950">
        <div className="w-full max-w-2xl aspect-video bg-zinc-900/40 border border-zinc-800 rounded-2xl relative overflow-hidden flex flex-col items-center justify-center group shadow-[0_0_50px_rgba(33,94,0,0.05)] hover:border-cobra-green/30 transition-all duration-300">

          <div className="absolute inset-0 bg-gradient-to-br from-black via-zinc-900/60 to-black opacity-80" />
          <div className="relative z-10 flex flex-col items-center gap-4 text-center p-6">
            <div className="w-16 h-16 rounded-full bg-zinc-900 border border-zinc-700 flex items-center justify-center text-zinc-400 group-hover:text-cobra-green group-hover:border-cobra-green group-hover:scale-110 transition-all duration-300 shadow-md cursor-pointer">
              <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="w-6 h-6 ml-1">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
            <div>
              <h3 className="text-white font-semibold text-lg">Video Demostrativo</h3>
              <p className="text-sm text-zinc-500 mt-1 max-w-sm">Próximamente: Mira cómo automatizar tus presupuestos en menos de 60 segundos.</p>
            </div>
          </div>
        </div>
      </section>

      {/* SECCIÓN DERECHA: Botones de Acción + Texto */}
      <section className="w-full lg:w-1/2 flex flex-col justify-center p-6 md:p-12 lg:p-16 xl:p-24 gap-10">

        {/* BLOQUE DE BOTONES */}
        <div className="flex gap-4 w-full max-w-xl">
          {/* Botón Iniciar Sesión */}
          <AuthModal defaultMode="login">
            <button
              type="button"
              className="flex-1 text-center py-3 rounded-xl border border-white text-zinc-200 hover:text-cobra-green hover:border-cobra-green hover:bg-zinc-900 transition-all text-sm font-medium"
            >
              Iniciar Sesión
            </button>
          </AuthModal>

          {/* Botón Crear Cuenta */}
          <AuthModal defaultMode="register">
            <button
              type="button"
              className="flex-1 text-center py-3 rounded-xl bg-cobra-green text-zinc-900 hover:bg-[#45c400] hover:text-white transition-all text-sm font-bold"
            >
              Crear cuenta
            </button>
          </AuthModal>
        </div>

        {/* TARJETA DE PRESENTACIÓN */}
        <div className="space-y-4 max-w-xl">
          <div className="relative p-8 rounded-2xl bg-gradient-to-br from-zinc-900/50 to-black border border-zinc-800/60 shadow-2xl overflow-hidden">
            {/* Acento lateral */}
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-cobra-green to-transparent" />

            <p className="font-sans tracking-tight text-lg text-gray-300 leading-relaxed">
              <span className="text-white font-semibold">Cobrapp</span> es una aplicación de generación de presupuestos instantáneos mediante el uso de IA y WhatsApp.
              Ingresa tu plantilla, define tu rubro y comienza a generar presupuestos profesionales en segundos.
            </p>
          </div>
        </div>
      </section>

    </main>
  );
}