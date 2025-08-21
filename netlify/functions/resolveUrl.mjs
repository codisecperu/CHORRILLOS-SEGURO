export const handler = async (event) => {
  const { url } = event.queryStringParameters;

  if (!url) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'URL parameter is required' })
    };
  }

  try {
    // Expandir el enlace siguiendo las redirecciones
    const response = await fetch(url, { redirect: "follow" });
    const finalUrl = response.url;

    // Intentar distintos formatos de URL de Google Maps
    let match;
    let lat, lng;

    const patterns = [
      // Formato: https://www.google.com/maps/place/.../@lat,lng
      /@(-?\d+\.\d+),(-?\d+\.\d+)/,
      // Formato: https://www.google.com/maps?q=lat,lng
      /[?&]q=(-?\d+\.\d+),(-?\d+\.\d+)/,
      // Formato: https://www.google.com/maps?ll=lat,lng
      /[?&]ll=(-?\d+\.\d+),(-?\d+\.\d+)/,
      // Formato de datos de URL: !3dLAT!4dLNG
      /!3d(-?\d+\.\d+)!4d(-?\d+\.\d+)/,
      // A veces: !2dLNG!3dLAT
      /!2d(-?\d+\.\d+)!3d(-?\d+\.\d+)/,
    ];

    for (const pattern of patterns) {
      match = finalUrl.match(pattern);
      if (match) {
        if (pattern.toString().includes('!2d')) {
          // Caso especial: !2dLNG!3dLAT
          lng = parseFloat(match[1]);
          lat = parseFloat(match[2]);
        } else {
          lat = parseFloat(match[1]);
          lng = parseFloat(match[2]);
        }
        break; // Salir del bucle una vez que encontramos una coincidencia
      }
    }

    if (!lat || !lng) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: "No se encontraron coordenadas en la URL final." })
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ lat: parseFloat(lat), lng: parseFloat(lng) })
    };

  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message })
    };
  }
}