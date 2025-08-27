import React, { useState } from 'react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default icon issue with webpack
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const CoordinateExtractor = () => {
  const [url, setUrl] = useState('');
  // const [coordinates, setCoordinates] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleProcessUrl = async () => {
    setLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      // Always use the Netlify function to handle all types of URLs
      const response = await fetch('/.netlify/functions/resolveUrl', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });

      if (!response.ok) {
        throw new Error('Failed to process the URL.');
      }

      const data = await response.json();

      if (data.lat && data.lng) {
        setSuccessMessage(`Coordenadas extraídas: ${data.lat}, ${data.lng}`);
      } else {
        setError('No se pudieron extraer las coordenadas del enlace.');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4">Google Maps Coordinate Extractor</h2>
        <div className="flex items-center mb-4">
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Paste Google Maps URL here"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
          <button
            onClick={handleProcessUrl}
            disabled={loading}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-4 disabled:opacity-50"
          >
            {loading ? 'Processing...' : 'Process URL'}
          </button>
        </div>

        {error && <p className="text-red-500 text-xs italic">{error}</p>}
        {successMessage && <p className="text-green-500 text-xs italic">{successMessage}</p>}

      </div>
    </div>
  );
};

export default CoordinateExtractor;