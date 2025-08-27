import fetch from 'node-fetch';

export async function handler(event) {
  let url;

  // Handle both GET and POST methods
  if (event.httpMethod === 'POST') {
    try {
      const body = JSON.parse(event.body);
      url = body.url;
    } catch (e) {
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
        },
        body: JSON.stringify({ error: 'Invalid JSON body' }),
      };
    }
  } else {
    url = event.queryStringParameters?.url;
  }

  if (!url) {
    return {
      statusCode: 400,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
      },
      body: JSON.stringify({ error: 'URL parameter is required' }),
    };
  }

  try {
    const response = await fetch(url, { redirect: 'follow' });
    const finalUrl = response.url;

    let lat = null;
    let lng = null;

    // Try to extract coordinates from the URL
    // Handle both @lat,lng and !3dlat!4dlng formats
    const regex = /!3d(-?\d+\.\d+)!4d(-?\d+\.\d+)|@(-?\d+\.\d+),(-?\d+\.\d+)/;
    const match = finalUrl.match(regex);

    if (match) {
      if (match[1] && match[2]) {
        lat = parseFloat(match[1]);
        lng = parseFloat(match[2]);
      } else if (match[3] && match[4]) {
        lat = parseFloat(match[3]);
        lng = parseFloat(match[4]);
      }
    }

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
      },
      body: JSON.stringify({ 
        resolvedUrl: finalUrl,
        lat,
        lng
      }),
    };

  } catch (error) {
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
      },
      body: JSON.stringify({ 
        error: 'Failed to resolve URL', 
        details: error.message 
      }),
    };
  }
}
