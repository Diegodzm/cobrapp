import { NextRequest, NextResponse } from 'next/server';

// 1. Verificación GET requerida por Meta
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const mode = searchParams.get('hub.mode');
  const token = searchParams.get('hub.verify_token');
  const challenge = searchParams.get('hub.challenge');

  if (mode === 'subscribe' && token === process.env.WHATSAPP_VERIFY_TOKEN) {
    console.log('✅ Webhook de WhatsApp verificado con éxito por Meta.');
    
    // Meta exige explícitamente el encabezado text/plain y devolver el reto intacto
    return new Response(challenge || '', {
      status: 200,
      headers: { 'Content-Type': 'text/plain' },
    });
  }

  console.error('❌ Falló la verificación del Webhook. Token no coincide.');
  return new Response('Acceso denegado', { status: 403 });
}

// 2. Recepción y registro de eventos entrantes (POST)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Validar que el objeto pertenezca a la API de WhatsApp Business
    if (body.object === 'whatsapp_business_account') {
      console.log('\n🔔 [WEBHOOK POST RECIBIDO DESDE META]');

      // Meta puede enviar múltiples entradas/cambios agrupados en un solo lote
      for (const entry of body.entry || []) {
        for (const change of entry.changes || []) {
          const value = change.value;

          if (!value) continue;

          // CASO A: Mensajes entrantes (Enviados por el usuario)
          if (value.messages && value.messages.length > 0) {
            for (const message of value.messages) {
              const remitente = message.from;
              const nombrePerfil = value.contacts?.[0]?.profile?.name || 'Desconocido';
              const contenidoTexto =
                message.type === 'text'
                  ? message.text?.body
                  : `[Tipo de mensaje: ${message.type}]`;

              console.log('====================================================');
              console.log('📩 NUEVO MENSAJE RECIBIDO DE WHATSAPP');
              console.log(`👤 De: ${nombrePerfil} (+${remitente})`);
              console.log(`💬 Mensaje: "${contenidoTexto}"`);
              console.log('====================================================');
            }
          }

          // CASO B: Actualizaciones de estado (sent, delivered, read)
          if (value.statuses && value.statuses.length > 0) {
            for (const status of value.statuses) {
              console.log('----------------------------------------------------');
              console.log(`📊 ESTADO DE MENSAJE: ${status.status.toUpperCase()}`);
              console.log(`🆔 ID Mensaje: ${status.id}`);
              console.log(`📱 Destinatario: +${status.recipient_id}`);
            
            }
          }
        }
      }

      // Responder a Meta con 200 OK inmediatamente
      return new NextResponse('EVENT_RECEIVED', { status: 200 });
    }

    // Si el objeto no es whatsapp_business_account
    return new NextResponse('Not Found', { status: 404 });
  } catch (error) {
    console.error('💥 Error procesando el Webhook:', error);
    return new NextResponse('Error Interno del Servidor', { status: 500 });
  }
}