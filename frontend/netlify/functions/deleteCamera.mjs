import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Las variables de entorno SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY son requeridas');
}

const supabase = createClient(supabaseUrl, supabaseKey);

export async function handler(event) {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'DELETE, OPTIONS',
  };

  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }
  
  if (event.httpMethod !== 'DELETE') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method Not Allowed' })
    };
  }

  // Path will be like /.netlify/functions/deleteCamera/123
  // We need to extract the ID.
  const pathParts = event.path.split('/');
  const id = pathParts[pathParts.length - 1];

  if (!id) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error: 'ID de cámara requerido' })
    };
  }

  try {
    const { error } = await supabase
      .from('camaras')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return {
      statusCode: 204, // No Content
      headers
    };

  } catch (error) {
    console.error('Error deleting camera:', error);
    return {
      statusCode: 500,
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Error al eliminar la cámara', details: error.message })
    };
  }
}
