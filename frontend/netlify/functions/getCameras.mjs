import { createClient } from '@supabase/supabase-js';

// Lee las credenciales seguras de las variables de entorno de Netlify
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Las variables de entorno SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY son requeridas');
}

const supabase = createClient(supabaseUrl, supabaseKey);

export async function handler(event) {
  // Configuración para permitir que el frontend llame a esta función
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  // Extrae los parámetros de paginación de la URL (ej: /api/getCameras?limit=20&offset=0)
  const { limit = 20, offset = 0 } = event.queryStringParameters || {};

  try {
    // Conecta a Supabase, selecciona todo de la tabla 'camaras' y aplica el rango de paginación
    const { data, error } = await supabase
      .from('camaras')
      .select('*')
      .range(parseInt(offset), parseInt(offset) + parseInt(limit) - 1);

    if (error) throw error;

    // Devuelve los datos como una respuesta JSON exitosa
    return {
      statusCode: 200,
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    };

  } catch (error) {
    console.error('Error fetching cameras:', error);
    // Devuelve un error si algo sale mal
    return {
      statusCode: 500,
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Error al obtener las cámaras', details: error.message })
    };
  }
}
