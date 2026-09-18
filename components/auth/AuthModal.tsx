import { useState } from "react";
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";

// Definimos la interfaz para las propiedades
interface AuthModalProps {
  children: React.ReactNode;
  defaultMode?: "login" | "register";
}

export default function AuthModal({ children, defaultMode = "login" }: AuthModalProps) {
  const [mode, setMode] = useState<"login" | "register">(defaultMode);

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="bg-zinc-950 border-zinc-800 text-white sm:max-w-md">
        {/* Encabezado requerido para accesibilidad */}
        <DialogHeader>
          <VisuallyHidden>
            <DialogTitle>Autenticación</DialogTitle>
          </VisuallyHidden>
        </DialogHeader>

        {mode === "login" ? <LoginForm /> : <RegisterForm />}
        
        <p className="text-center text-sm text-zinc-500 mt-4">
          {mode === "login" ? "¿No tienes cuenta? " : "¿Ya tienes cuenta? "}
          <button 
            type="button" 
            onClick={() => setMode(mode === "login" ? "register" : "login")}
            className="text-cobra-green underline hover:text-green-400 transition-colors"
          >
            {mode === "login" ? "Regístrate" : "Inicia sesión"}
          </button>
        </p>
      </DialogContent>
    </Dialog>
  );
}