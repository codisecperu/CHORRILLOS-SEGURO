// src/utils/coordinateExtractor.js

// Extract coordinates from any Google Maps URL (short or long)
export const extractCoordinatesFromGoogleMaps = async (url) => {
  if (!isValidGoogleMapsUrl(url)) {
    console.error('URL no válida de Google Maps');
    return null;
  }

  try {
    const response = await fetch("/.netlify/functions/resolveUrl", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Error al procesar la URL:', errorData.error);
      return null;
    }

    const data = await response.json();
    if (!data.lat || !data.lng) {
      console.error('No se pudieron extraer coordenadas de la URL');
      return null;
    }

    return {
      lat: data.lat.toString(),
      lng: data.lng.toString(),
      resolvedUrl: data.resolvedUrl
    };

  } catch (error) {
    console.error('Error al llamar a la función de extracción:', error);
    return null;
  }
};

// Validate Google Maps URLs (both long and short formats)
export const isValidGoogleMapsUrl = (url) => {
  const googleMapsPatterns = [
    /^https?:\/\/(www\.)?google\.com\/maps/,
    /^https?:\/\/maps\.google\.com/,
    /^https?:\/\/maps\.app\.goo\.gl/,
    /^https?:\/\/goo\.gl\/maps/,
  ];
  return googleMapsPatterns.some(pattern => pattern.test(url));
};

// Get address from coordinates using OpenStreetMap Nominatim
export const getAddressFromCoordinates = async (lat, lng) => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
      {
        headers: {
          'User-Agent': 'ChorrillosSeguro/1.0' // Best practice: identify your application
        }
      }
    );
    
    if (!response.ok) {
      console.error('Error en la respuesta de Nominatim');
      return 'Error al obtener dirección';
    }

    const data = await response.json();
    return data.display_name || 'Dirección no encontrada';
    
  } catch (error) {
    console.error('Error al obtener dirección:', error);
    return 'Error de conexión';
  }
};

// Get coordinates from address using OpenStreetMap Nominatim
export const getCoordinatesFromAddress = async (address) => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1&addressdetails=1`,
      {
        headers: {
          'User-Agent': 'ChorrillosSeguro/1.0' // Best practice: identify your application
        }
      }
    );
    
    if (!response.ok) {
      console.error('Error en la respuesta de Nominatim');
      return null;
    }

    const data = await response.json();
    if (data.length > 0) {
      return {
        lat: parseFloat(data[0].lat),
        lng: parseFloat(data[0].lon),
        address: data[0].display_name,
      };
    }
    
    return null;
  } catch (error) {
    console.error('Error al obtener coordenadas:', error);
    return null;
  }
};