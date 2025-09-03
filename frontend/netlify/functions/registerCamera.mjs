import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Las variables de entorno SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY son requeridas');
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
  db: {
    schema: 'public'
  }
});

export async function handler(event) {
  // Enable CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };

  // Handle preflight request
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    // Parse the multipart form data
    const formData = JSON.parse(event.body);
    
    // Prepare the camera data
    const cameraData = {
      // Datos del propietario
      nombrePropietario: formData.nombrePropietario,
      tipoDocumento: formData.tipoDocumento,
      numeroDocumento: formData.numeroDocumento,
      telefono: formData.telefono,
      email: formData.email,
      
      // Datos de la cámara
      tipoCamara: formData.tipoCamara,
      modeloCamara: formData.modeloCamara,
      marcaCamara: formData.marcaCamara,
      tieneDVR: formData.tieneDVR === 'true',
      zonaVisibilidad: formData.zonaVisibilidad,
      grabacion: formData.grabacion === 'true',
      disposicionCompartir: formData.disposicionCompartir === 'true',
      
      // Ubicación
      direccion: formData.direccion,
      lat: formData.lat,
      lng: formData.lng,
      sector: formData.sector,
      
      // Metadata
      fechaRegistro: new Date().toISOString(),
      estado: 'pendiente'
    };

    // Ajustar los nombres de campos y tipos de datos para que coincidan con la base de datos
    import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Cliente de Supabase con permisos de administrador para escribir en la BD
const supabaseAdmin = createClient(supabaseUrl, supabaseKey);

export async function handler(event) {
  // Permitir la cabecera 'Authorization' que contendrá el token
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers };
  }

  // 1. Extraer el token de autenticación de las cabeceras
  const token = event.headers.authorization?.split('Bearer ')?.[1];
  if (!token) {
    return {
      statusCode: 401,
      headers,
      body: JSON.stringify({ error: 'Autenticación requerida.' })
    };
  }

  try {
    // 2. Verificar el token y obtener los datos del usuario
    const { data: { user }, error: userError } = await createClient(supabaseUrl, supabaseKey, {
        global: { headers: { Authorization: `Bearer ${token}` } }
    }).auth.getUser();

    if (userError || !user) {
      return {
        statusCode: 401,
        headers,
        body: JSON.stringify({ error: 'Token inválido o caducado.' })
      };
    }

    // Si el usuario es válido, procesamos el registro
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
      // 3. ¡Aquí está la magia! Añadimos el ID del usuario al registro
      user_id: user.id
    };

    // 4. Insertamos los datos en la tabla usando el cliente con rol de servicio
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
      body: JSON.stringify({ error: 'Error interno al registrar la cámara', details: error.message })
    };
  }
}


    // Insert into Supabase
    const { data, error } = await supabase
      .from('camaras')
      .insert([dbCameraData])
      .select();

    if (error) throw error;

    return {
      statusCode: 200,
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: 'Cámara registrada exitosamente',
        data: data[0]
      })
    };

  } catch (error) {
    console.error('Error al registrar cámara:', error);
    
    return {
      statusCode: 500,
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        error: 'Error al registrar la cámara',
        details: error.message
      })
    };
  }
}
