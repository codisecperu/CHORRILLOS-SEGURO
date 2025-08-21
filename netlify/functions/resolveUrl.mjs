import fetch from "node-fetch";

function extractLatLng(url) {
  let match;

  match = url.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
  if (match) return { lat: parseFloat(match[1]), lng: parseFloat(match[2]) };

  match = url.match(/\/place\/(-?\d+\.\d+),(-?\d+\.\d+)/);
  if (match) return { lat: parseFloat(match[1]), lng: parseFloat(match[2]) };

  match = url.match(/\/dir\/[^/]*\/(-?\d+\.\d+),(-?\d+\.\d+)/);
  if (match) return { lat: parseFloat(match[1]), lng: parseFloat(match[2]) };

  match = url.match(/[?&]query=(-?\d+\.\d+),(-?\d+\.\d+)/);
  if (match) return { lat: parseFloat(match[1]), lng: parseFloat(match[2]) };

  match = url.match(/[?&]ll=(-?\d+\.\d+),(-?\d+\.\d+)/);
  if (match) return { lat: parseFloat(match[1]), lng: parseFloat(match[2]) };

  return { lat: null, lng: null };
}

export async function handler(event) {
  try {
    const { url } = JSON.parse(event.body);

    if (!url) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Falta el parámetro url" }),
      };
    }

    // Resolver shortlinks
    const response = await fetch(url, { redirect: "manual" });
    const location = response.headers.get("location") || url;

    // Extraer coordenadas
    const { lat, lng } = extractLatLng(location);

    return {
      statusCode: 200,
      body: JSON.stringify({ resolvedUrl: location, lat, lng }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
}
