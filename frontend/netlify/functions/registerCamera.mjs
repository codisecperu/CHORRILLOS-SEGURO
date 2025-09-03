import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Create a Supabase client with service role for admin-level operations
const supabaseAdmin = createClient(supabaseUrl, supabaseKey);

export async function handler(event) {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization', // Allow Authorization header
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers };
  }

  // 1. Get the user's token from the Authorization header
  const token = event.headers.authorization?.split('Bearer ')?.[1];
  if (!token) {
    return {
      statusCode: 401,
      headers,
      body: JSON.stringify({ error: 'Autenticación requerida. No se encontró token.' })
    };
  }

  try {
    // 2. Get the user's data from the token
    const { data: { user }, error: userError } = await createClient(supabaseUrl, supabaseKey, {
        global: { headers: { Authorization: `Bearer ${token}` } }
    }).auth.getUser();

    if (userError || !user) {
      return {
        statusCode: 401,
        headers,
        body: JSON.stringify({ error: 'Token inválido o caducado.', details: userError?.message })
      });
    }

    // The user is authenticated, proceed with registration
    const formData = JSON.parse(event.body);
    
    const dbCameraData = {
      nombre_propietario: String(formData.nombrePropietario || ''),
      tipo_documento: String(formData.tipoDocumento || 'DNI'),
      numero_documento: String(formData.numeroDocumento || ''),
      telefono: String(formData.telefono || ''),
      email: formData.email ? String(formData.email) : null,
      tipo_camara: String(formData.tipoCamara || 'domiciliaria'),
      modelo_camara: formData.modeloCamara ? String(formData.modeloCamara) : null,
      marca_camara: String(formData.marcaCamara || ''),
      tiene_dvr: Boolean(formData.tieneDVR),
      zona_visibilidad: String(formData.zonaVisibilidad || ''),
      grabacion: Boolean(formData.grabacion),
      disposicion_compartir: Boolean(formData.disposicionCompartir),
      direccion: String(formData.direccion || ''),
      lat: String(formData.lat || '0'),
      lng: String(formData.lng || '0'),
      sector: String(formData.sector || 'otros'),
      fecha_registro: new Date().toISOString(),
      estado: 'pendiente',
      imagen_referencial: formData.imagenReferencial || null,
      user_id: user.id
    };

    // 4. Insert the data using the admin client
    const { data, error } = await supabaseAdmin
      .from('camaras')
      .insert([dbCameraData])
      .select();

    if (error) throw error;

    return {
      statusCode: 200,
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: 'Cámara registrada exitosamente', data: data[0] })
    };

  } catch (error) {
    console.error('Error al registrar cámara:', error);
    return {
      statusCode: 500,
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Error al registrar la cámara', details: error.message })
    };
  }
}