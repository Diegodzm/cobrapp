import { GoogleGenAI, Type } from "@google/genai";

// Inicializamos el SDK con la clave de tu .env.local
export const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Definimos el esquema universal que alimentará tus tablas y templates de PDF
export const esquemaPresupuestoUniversal = {
  type: Type.OBJECT,
  properties: {
    cliente: { 
      type: Type.STRING, 
      description: "Nombre del cliente si se menciona explícitamente en el mensaje/audio, de lo contrario null" 
    },
    items: {
      type: Type.ARRAY,
      description: "Lista de conceptos detallados. Adapta los nombres según el rubro que hable (ej: 'Torta', 'Mano de Obra', 'Pastillas de freno')",
      items: {
        type: Type.OBJECT,
        properties: {
          descripcion: { type: Type.STRING, description: "Descripción clara del producto o servicio" },
          precio: { type: Type.INTEGER, description: "Valor numérico entero. Convierte 'lucas' o 'mil' a número (ej: 30 lucas -> 30000)" },
          cantidad: { type: Type.INTEGER, description: "Cantidad solicitada del ítem. Por defecto 1 si no se detalla" }
        },
        required: ["descripcion", "precio", "cantidad"],
      },
    },
    total_calculado: { 
      type: Type.INTEGER, 
      description: "Suma total matemática de (precio * cantidad) de todos los items" 
    }
  },
  required: ["items", "total_calculado"],
};