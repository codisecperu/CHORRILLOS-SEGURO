// Utilidades para extraer coordenadas desde enlaces de Google Maps
export const extractCoordinatesFromGoogleMaps = async (url) => {
  try {
    let urlToParse = url;
    // Check if it's a shortened URL that needs to be resolved
    if (url.includes('maps.app.goo.gl') || url.includes('goo.gl/maps')) {
      // Usa nuestra Netlify Function para resolver la URL acortada
      const response = await fetch(`/.netlify/functions/resolveUrl?url=${encodeURIComponent(url)}`);
      if (response.ok) {
        const data = await response.json();
        urlToParse = data.resolvedUrl;
      } else {
        // If fetching fails, try to parse the original URL anyway
        console.error('Failed to resolve shortened URL, proceeding with original.');
      }
    }

    // Patrones comunes de Google Maps
    const patterns = [
      // Formato: https://www.google.com/maps/place/.../@lat,lng
      /@(-?\d+\.\d+),(-?\d+\.\d+)/,
      // Formato: https://www.google.com/maps?q=lat,lng
      /q=(-?\d+\.\d+),(-?\d+\.\d+)/,
      // Formato: https://www.google.com/maps?ll=lat,lng
      /ll=(-?\d+\.\d+),(-?\d+\.\d+)/,
      // Formato de datos de URL: !3d-12.345!4d-56.789
      /!3d(-?\d+\.\d+)!4d(-?\d+\.\d+)/,
    ];

    for (const pattern of patterns) {
      const match = urlToParse.match(pattern);
      if (match) {
        const lat = parseFloat(match[1]);
        const lng = parseFloat(match[2]);
        
        // Validar que las coordenadas sean válidas
        if (lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) {
          return { lat, lng };
        }
      }
    }

    return null;
  } catch (error) {
    console.error('Error al extraer coordenadas:', error);
    return null;
  }
};

// Función para validar si es un enlace de Google Maps válido
export const isValidGoogleMapsUrl = (url) => {
  const googleMapsPatterns = [
    /^https?:\/\/(www\.)?google\.com\/maps/,
    /^https?:\/\/maps\.google\.com/,
    /^https?:\/\/maps\.app\.goo\.gl/,
    /^https?:\/\/goo\.gl\/maps/,
  ];

  return googleMapsPatterns.some(pattern => pattern.test(url));
};

// Función para obtener la dirección desde coordenadas (usando API de Nominatim)
export const getAddressFromCoordinates = async (lat, lng) => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`
    );
    
    if (response.ok) {
      const data = await response.json();
      return data.display_name || 'Dirección no encontrada';
    }
    
    return 'Error al obtener dirección';
  } catch (error) {
    console.error('Error al obtener dirección:', error);
    return 'Error de conexión';
  }
};

// Función para obtener coordenadas desde dirección (usando API de Nominatim)
export const getCoordinatesFromAddress = async (address) => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1&addressdetails=1`
    );
    
    if (response.ok) {
      const data = await response.json();
      if (data.length > 0) {
        return {
          lat: parseFloat(data[0].lat),
          lng: parseFloat(data[0].lon),
          address: data[0].display_name
        };
      }
    }
    
    return null;
  } catch (error) {
    console.error('Error al obtener coordenadas:', error);
    return null;
  }
};