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
    const dbCameraData = {
      nombre_propietario: String(cameraData.nombrePropietario || ''),
      tipo_documento: String(cameraData.tipoDocumento || 'DNI'),
      numero_documento: String(cameraData.numeroDocumento || ''),
      telefono: String(cameraData.telefono || ''),
      email: cameraData.email ? String(cameraData.email) : null,
      tipo_camara: String(cameraData.tipoCamara || 'domiciliaria'),
      modelo_camara: cameraData.modeloCamara ? String(cameraData.modeloCamara) : null,
      marca_camara: String(cameraData.marcaCamara || ''),
      tiene_dvr: Boolean(cameraData.tieneDVR),
      zona_visibilidad: String(cameraData.zonaVisibilidad || ''),
      grabacion: Boolean(cameraData.grabacion),
      disposicion_compartir: Boolean(cameraData.disposicionCompartir),
      direccion: String(cameraData.direccion || ''),
      lat: String(cameraData.lat || '0'),
      lng: String(cameraData.lng || '0'),
      sector: String(cameraData.sector || 'otros'),
      fecha_registro: new Date().toISOString(),
      estado: 'pendiente',
      imagen_referencial: cameraData.imagenReferencial || null
    };

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
