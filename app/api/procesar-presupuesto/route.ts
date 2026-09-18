import { NextResponse } from "next/server";
import { ai, esquemaPresupuestoUniversal } from "@/lib/gemini";

export async function POST(request: Request) {
  try {
    // 1. Leer los datos entrantes (usamos FormData para poder soportar el archivo de audio)
    const formData = await request.formData();
    const texto = formData.get("texto") as string | null;
    const archivoAudio = formData.get("audio") as File | null;

    let contents: any[] = [];

    // Prompt del sistema que rige el comportamiento de Cobrapp
    const promptBase = `
      Actúas como el backend extractor de Cobrapp. Tu objetivo es procesar este mensaje informal (de texto o audio dictado) enviado por un profesional independiente o técnico sobre una cotización.
      Debes extraer de forma inteligente los ítems tal cual los dictó, transformando los valores a números limpios. No inventes información que no esté en el mensaje.
    `;

    // 2. Si nos enviaron un Audio (Nota de voz de WhatsApp)
    if (archivoAudio) {
      // Convertimos el archivo de audio a un buffer de Node y luego a Base64 para Gemini
      const arrayBuffer = await archivoAudio.arrayBuffer();
      const base64Audio = Buffer.from(arrayBuffer).toString("base64");

      contents = [
        {
          inlineData: {
            data: base64Audio,
            mimeType: archivoAudio.type, // ej: audio/ogg, audio/mp3, audio/webm
          },
        },
        promptBase
      ];
    } 
    // 3. Si nos enviaron Texto plano
    else if (texto) {
      contents = [
        `${promptBase}\n\nTexto recibido: "${texto}"`
      ];
    } 
    // Si no viene ninguno de los dos, devolvemos error
    else {
      return NextResponse.json(
        { error: "Debes proporcionar un 'texto' o un archivo de 'audio'." },
        { status: 400 }
      );
    }

    console.log("Enviando petición a Gemini 2.5 Flash...");

    // 4. Llamamos a Gemini usando la configuración de salida JSON estricta
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      config: {
        responseMimeType: "application/json",
        responseSchema: esquemaPresupuestoUniversal,
      },
      contents: contents,
    });

    const jsonRespuesta = JSON.parse(response.text || "{}");

    // 5. [Nota para el futuro]: Aquí es donde meterás la lógica de Supabase para guardar:
    // const { data, error } = await supabase.from('presupuestos').insert([jsonRespuesta]);

    // Devolvemos el JSON limpio al cliente
    return NextResponse.json({ success: true, datos: jsonRespuesta });

  } catch (error: any) {
    console.error("Error en el endpoint de Cobrapp:", error);
    return NextResponse.json(
      { error: "Error interno procesando el presupuesto", detalles: error.message },
      { status: 500 }
    );
  }
}