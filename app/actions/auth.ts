'use server'

import { createClient } from "@/lib/supabase/server"

export async function uploadPdfTemplate(formData: FormData) {
  try {
    const supabase = await createClient();
    const file = formData.get('file') as File;

    if (!file) {
      return { success: false, error: 'No se ha proporcionado ningún archivo.' };
    }

    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `templates/${fileName}`;

    // Subir al bucket 'Presupuestos'
    const { error } = await supabase.storage
      .from('Presupuestos')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) {
      return { success: false, error: error.message };
    }

    // Obtener la URL pública del archivo subido
    const { data: publicUrlData } = supabase.storage
      .from('Presupuestos')
      .getPublicUrl(filePath);

    return { 
      success: true, 
      publicUrl: publicUrlData.publicUrl,
      fileName: file.name
    };
  } catch (err: any) {
    return { success: false, error: err.message || 'Error desconocido al subir el archivo.' };
  }
}

export async function signup(prevState: any, formData: FormData) {
  const supabase = await createClient();

  // 1. Extraer los valores asegurándose de que coincidan con el 'name="..."' del input
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const fullName = formData.get('fullName') as string;
  const whatsappPhone = formData.get('whatsappPhone') as string;

  // 🛑 DEBUG: Agrega esto temporalmente para ver en tu terminal de Next.js si llegan los datos
  console.log("Datos recibidos del form:", { email, fullName, whatsappPhone });

  // 2. Registrar usuario en Supabase Auth
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
  });

  if (authError) {
    return { success: false, error: authError.message };
  }

  const userId = authData.user?.id;

  if (userId) {
    // 3. Usar UPSERT en lugar de INSERT para evitar duplicados si el perfil ya existe
    const { error: profileError } = await supabase
      .from('profiles')
      .upsert([
        {
          id: userId,
          full_name: fullName,
          whatsapp_phone: whatsappPhone,
          email: email,
        },
      ]);

    if (profileError) {
      console.error("Error al guardar en profiles:", profileError.message);
      return { success: false, error: profileError.message };
    }
  }

  return { success: true, error: '' };
}

export async function login(prevState: any, formData: FormData) {
  const supabase = await createClient();

  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  // Autenticar con Supabase Auth (esto genera la sesión / token cookie automáticamente)
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, error: '' };
}