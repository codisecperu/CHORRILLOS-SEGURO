
export const handler = async (event) => {
  const targetUrl = event.queryStringParameters.url;

  if (!targetUrl) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'URL parameter is required' }),
    };
  }

  try {
    const response = await fetch(targetUrl);
    // La propiedad 'url' del objeto de respuesta final contendrá la URL resuelta
    const resolvedUrl = response.url;
    
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ resolvedUrl }),
    };

  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to resolve URL', details: error.message }),
    };
  }
};
