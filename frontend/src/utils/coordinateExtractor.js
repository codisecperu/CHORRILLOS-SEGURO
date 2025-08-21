// src/utils/coordinateExtractor.js

// Llama a nuestra función de Netlify usando el método POST
export const extractCoordinatesFromGoogleMaps = async (shortUrl) => {
  try {
    const response = await fetch("/.netlify/functions/resolveUrl", {
      method: "POST",
      body: JSON.stringify({ url: shortUrl }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Error desde la API de Netlify:', errorData.error);
      return null;
    }

    const data = await response.json();
    return data; // Devuelve { resolvedUrl, lat, lng }

  } catch (error) {
    console.error('Error al llamar a la función de extracción:', error);
    return null;
  }
};

// El resto de las funciones de utilidad permanecen igual

export const isValidGoogleMapsUrl = (url) => {
  const googleMapsPatterns = [
    /^https?:\/\/(www\.)?google\.com\/maps/,
    /^https?:\/\/maps\.google\.com/,
    /^https?:\/\/maps\.app\.goo\.gl/,
    /^https?:\/\/goo\.gl\/maps/,
  ];
  return googleMapsPatterns.some((pattern) => pattern.test(url));
};

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