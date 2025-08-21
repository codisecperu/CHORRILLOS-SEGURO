// src/utils/coordinateExtractor.js

// Esta función ahora solo llama a nuestra API de Netlify y devuelve el resultado.
export const extractCoordinatesFromGoogleMaps = async (url) => {
  try {
    const response = await fetch(`/api/resolveUrl?url=${encodeURIComponent(url)}`);
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('Error desde la API de Netlify:', errorData.error);
      return null;
    }

    const data = await response.json();
    return data; // Devuelve directamente { lat, lng } o un error

  } catch (error) {
    console.error('Error al llamar a la función de extracción:', error);
    return null;
  }
};

// El resto de las funciones de utilidad permanecen igual

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
