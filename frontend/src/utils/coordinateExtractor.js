// src/utils/coordinateExtractor.js

// Utilidad para extraer coordenadas desde enlaces de Google Maps
export const extractCoordinatesFromGoogleMaps = async (url) => {
  try {
    let urlToParse = url;

    // Si es un enlace acortado, lo resolvemos con la Netlify Function
    if (url.includes('maps.app.goo.gl') || url.includes('goo.gl/maps')) {
      try {
        const response = await fetch(
          `/.netlify/functions/resolveUrl?url=${encodeURIComponent(url)}`
        );
        if (response.ok) {
          const data = await response.json();
          urlToParse = data.resolvedUrl;
        } else {
          console.warn('No se pudo resolver URL acortada, se intentará parsear directo.');
        }
      } catch (err) {
        console.error('Error resolviendo URL acortada:', err);
      }
    }

    // Patrones comunes de Google Maps
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
      const match = urlToParse.match(pattern);
      if (match) {
        // Dependiendo del patrón cambia el orden de lat/lng
        let lat, lng;
        if (pattern.toString().includes('!2d')) {
          // Caso especial: !2dLNG!3dLAT
          lng = parseFloat(match[1]);
          lat = parseFloat(match[2]);
        } else {
          lat = parseFloat(match[1]);
          lng = parseFloat(match[2]);
        }

        // Validar coordenadas
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

// Verifica si el enlace es de Google Maps
export const isValidGoogleMapsUrl = (url) => {
  const googleMapsPatterns = [
    /^https?:\/\/(www\.)?google\.com\/maps/,
    /^https?:\/\/maps\.google\.com/,
    /^https?:\/\/maps\.app\.goo\.gl/,
    /^https?:\/\/goo\.gl\/maps/,
  ];
  return googleMapsPatterns.some((pattern) => pattern.test(url));
};

// Convierte coordenadas a dirección usando Nominatim
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

// Convierte dirección a coordenadas usando Nominatim
export const getCoordinatesFromAddress = async (address) => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
        address
      )}&limit=1&addressdetails=1`
    );
    if (response.ok) {
      const data = await response.json();
      if (data.length > 0) {
        return {
          lat: parseFloat(data[0].lat),
          lng: parseFloat(data[0].lon),
          address: data[0].display_name,
        };
      }
    }
    return null;
  } catch (error) {
    console.error('Error al obtener coordenadas:', error);
    return null;
  }
};
