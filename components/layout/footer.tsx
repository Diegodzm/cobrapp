"use client";

import Link from "next/link";

export default function Footer() {
  return (
    // CONTENEDOR PRINCIPAL: Fondo negro puro, borde superior zinc-800 y aire vertical espacioso
    <footer className="w-full bg-[#000000] border-t border-zinc-800 text-zinc-400 font-sans">
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-12 md:py-16">
        
        {/* SECCIÓN SUPERIOR: Grid de contenidos */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-8 pb-12 border-b border-zinc-900">
          
          {/* Columna 1: Branding y Eslogan */}
          <div className="flex flex-col gap-4 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 select-none group w-fit">
              
              <span className="text-white font-bold text-xl tracking-tight">
                Cobra<span className="text-[#52E800]">pp</span>
              </span>
            </Link>
            <p className="text-sm text-zinc-500 leading-relaxed max-w-xs">
              La plataforma moderna e inteligente para la gestión y automatización de presupuestos y cobros.
            </p>
          </div>

          {/* Columna 2: Producto */}
          <div className="flex flex-col gap-3">
            <h4 className="text-white font-semibold text-sm tracking-wider uppercase">Producto</h4>
            <ul className="flex flex-col gap-2 text-sm">
              <li>
                <Link href="#caracteristicas" className="hover:text-[#52E800] transition-colors">
                  Características
                </Link>
              </li>
              <li>
                <Link href="#precios" className="hover:text-[#52E800] transition-colors">
                  Precios
                </Link>
              </li>
              <li>
                <Link href="#integraciones" className="hover:text-[#52E800] transition-colors">
                  Integraciones
                </Link>
              </li>
            </ul>
          </div>

          {/* Columna 3: Soporte / Empresa */}
          <div className="flex flex-col gap-3">
            <h4 className="text-white font-semibold text-sm tracking-wider uppercase">Soporte</h4>
            <ul className="flex flex-col gap-2 text-sm">
              <li>
                <Link href="#ayuda" className="hover:text-[#52E800] transition-colors">
                  Centro de Ayuda
                </Link>
              </li>
              <li>
                <Link href="#contacto" className="hover:text-[#52E800] transition-colors">
                  Contacto
                </Link>
              </li>
              <li>
                <Link href="#estado" className="hover:text-[#52E800] transition-colors">
                  Estado del Sistema
                </Link>
              </li>
            </ul>
          </div>

          {/* Columna 4: Legal */}
          <div className="flex flex-col gap-3">
            <h4 className="text-white font-semibold text-sm tracking-wider uppercase">Legal</h4>
            <ul className="flex flex-col gap-2 text-sm">
              <li>
                <Link href="/privacidad" className="hover:text-[#52E800] transition-colors">
                  Privacidad
                </Link>
              </li>
              <li>
                <Link href="/terminos" className="hover:text-[#52E800] transition-colors">
                  Términos de Servicio
                </Link>
              </li>
            </ul>
          </div>

        </div>

        {/* SECCIÓN INFERIOR: Copyright */}
        <div className="flex flex-col sm:flex-row items-center justify-between pt-8 text-xs text-zinc-600 gap-4">
          <p>© {new Date().getFullYear()} Cobrapp. Todos los derechos reservados.</p>
          <p className="flex items-center gap-1">
            Diseñado para la velocidad y la eficiencia.
          </p>
        </div>

      </div>
    </footer>
  );
}