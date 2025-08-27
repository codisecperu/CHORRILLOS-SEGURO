import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Las variables de entorno SUPABASE_URL y SUPABASE_ANON_KEY son requeridas');
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

    // Ajustar los nombres de campos para que coincidan con la base de datos
    const dbCameraData = {
      nombre_propietario: cameraData.nombrePropietario,
      tipo_documento: cameraData.tipoDocumento,
      numero_documento: cameraData.numeroDocumento,
      telefono: cameraData.telefono,
      email: cameraData.email,
      tipo_camara: cameraData.tipoCamara,
      modelo_camara: cameraData.modeloCamara,
      marca_camara: cameraData.marcaCamara,
      tiene_dvr: cameraData.tieneDVR,
      zona_visibilidad: cameraData.zonaVisibilidad,
      grabacion: cameraData.grabacion,
      disposicion_compartir: cameraData.disposicionCompartir,
      direccion: cameraData.direccion,
      lat: cameraData.lat,
      lng: cameraData.lng,
      sector: cameraData.sector,
      fecha_registro: new Date().toISOString(),
      estado: 'pendiente'
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
