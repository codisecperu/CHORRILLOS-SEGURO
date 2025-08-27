import fetch from 'node-fetch';

export async function handler(event) {
  const { url } = event.queryStringParameters;

  if (!url) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'URL parameter is required' }),
    };
  }

  try {
    const response = await fetch(url, { redirect: 'follow' });
    const text = await response.text();
    import fetch from 'node-fetch';

export async function handler(event) {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method Not Allowed' }),
    };
  }

  let body;
  try {
    body = JSON.parse(event.body);
  } catch (e) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Invalid JSON body' }),
    };
  }

  const { url } = body;

  if (!url) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'URL parameter is required in the body' }),
    };
  }

  try {
    const response = await fetch(url, { redirect: 'follow' });
    const finalUrl = response.url;

    let lat = null;
    let lng = null;
    const coordRegex = /@(-?\d+\.\d+),(-?\d+\.\d+)/;
    const match = finalUrl.match(coordRegex);

    if (match && match[1] && match[2]) {
      lat = parseFloat(match[1]);
      lng = parseFloat(match[2]);
    }

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ resolvedUrl: finalUrl, lat, lng }),
    };

  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to resolve URL', details: error.message }),
    };
  }
}
    const match = text.match(regex);

    if (match && match[1]) {
      const decodedUrl = decodeURIComponent(match[1]);
      return {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ resolvedUrl: decodedUrl }),
      };
    } else {
        // fallback to response.url if regex fails
        const finalUrl = response.url;
        return {
            statusCode: 200,
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify({ resolvedUrl: finalUrl }),
        };
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to resolve URL', details: error.message }),
    };
  }
}