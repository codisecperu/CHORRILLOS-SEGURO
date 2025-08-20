import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { useAuth } from '../../contexts/AuthContext';
import { 
  MagnifyingGlassIcon, 
  FunnelIcon, 
  MapIcon, 
  DocumentArrowDownIcon,
  EyeIcon,
  EyeSlashIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';
import MapStats from '../map/MapStats';
import 'leaflet/dist/leaflet.css';

// Fix para los iconos de Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

// Componente para centrar el mapa en una ubicación
const MapController = ({ center, zoom }) => {
  const map = useMap();
  
  useEffect(() => {
    if (center && center.lat && center.lng) {
      map.setView(center, zoom);
    }
  }, [center, zoom, map]);
  
  return null;
};

const MapaInteractivo = () => {
  const { user } = useAuth();
  const [mapData, setMapData] = useState({
    cameras: [],
    vigilantes: [],
    incidents: []
  });
  const [filters, setFilters] = useState({
    type: 'all',
    sector: 'all',
    status: 'all',
    dateRange: 'all'
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [showIncidents, setShowIncidents] = useState(false);
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [mapCenter] = useState({ lat: -12.0464, lng: -77.0428 }); // Chorrillos, Lima
  const [mapZoom] = useState(14);
  
  const mapRef = useRef();

  // Datos mock para desarrollo
  useEffect(() => {
    const loadMapData = async () => {
      setIsLoading(true);
      
      // Simular carga de datos
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockData = {
        cameras: [
          {
            id: 1,
            type: 'residential',
            brand: 'Hikvision',
            model: 'DS-2CD2142FWD-I',
            location: { lat: -12.0464, lng: -77.0428 },
            address: 'Av. Defensores del Morro 123',
            sector: 'centro',
            status: 'active',
            owner: 'Juan Pérez',
            phone: '999-999-999',
            recording: true,
            sharing: true,
            lastMaintenance: '2024-01-15'
          },
          {
            id: 2,
            type: 'commercial',
            brand: 'Dahua',
            model: 'IPC-HDW4431C-A',
            location: { lat: -12.0480, lng: -77.0440 },
            address: 'Av. San Martín 456',
            sector: 'comercial',
            status: 'active',
            owner: 'Comercial ABC',
            phone: '888-888-888',
            recording: true,
            sharing: false,
            lastMaintenance: '2024-02-01'
          },
          {
            id: 3,
            type: 'residential',
            brand: 'Hikvision',
            model: 'DS-2CD2342WD-I',
            location: { lat: -12.0440, lng: -77.0400 },
            address: 'Jr. Los Pinos 789',
            sector: 'residencial',
            status: 'maintenance',
            owner: 'María García',
            phone: '777-777-777',
            recording: false,
            sharing: true,
            lastMaintenance: '2024-03-10'
          }
        ],
        vigilantes: [
          {
            id: 1,
            name: 'Carlos Rodríguez',
            organization: 'Seguridad Privada XYZ',
            location: { lat: -12.0470, lng: -77.0430 },
            address: 'Av. Defensores del Morro 150',
            sector: 'centro',
            status: 'active',
            schedule: '06:00 - 18:00',
            experience: '5 años',
            phone: '666-666-666',
            lastPatrol: '2024-03-15 14:30'
          },
          {
            id: 2,
            name: 'Ana López',
            organization: 'Vigilancia Comunal',
            location: { lat: -12.0450, lng: -77.0410 },
            address: 'Jr. Los Pinos 800',
            sector: 'residencial',
            status: 'active',
            schedule: '18:00 - 06:00',
            experience: '3 años',
            phone: '555-555-555',
            lastPatrol: '2024-03-15 15:45'
          }
        ],
        incidents: [
          {
            id: 1,
            type: 'theft',
            location: { lat: -12.0465, lng: -77.0425 },
            address: 'Av. Defensores del Morro 125',
            sector: 'centro',
            date: '2024-03-15 10:30',
            description: 'Robo de vehículo estacionado',
            severity: 'high',
            status: 'investigating',
            reportedBy: 'Juan Pérez',
            cameraId: 1
          },
          {
            id: 2,
            type: 'vandalism',
            location: { lat: -12.0475, lng: -77.0435 },
            address: 'Av. San Martín 460',
            sector: 'comercial',
            date: '2024-03-14 22:15',
            description: 'Grafiti en pared comercial',
            severity: 'low',
            status: 'resolved',
            reportedBy: 'Comercial ABC',
            cameraId: 2
          }
        ]
      };
      
      setMapData(mockData);
      setIsLoading(false);
    };
    
    loadMapData();
  }, []);

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    // Aquí implementaríamos la búsqueda real por dirección
  };

  const getFilteredData = () => {
    let filteredCameras = mapData.cameras;
    let filteredVigilantes = mapData.vigilantes;
    let filteredIncidents = mapData.incidents;

    // Aplicar filtros
    if (filters.type !== 'all') {
      filteredCameras = filteredCameras.filter(camera => camera.type === filters.type);
    }
    
    if (filters.sector !== 'all') {
      filteredCameras = filteredCameras.filter(camera => camera.sector === filters.sector);
      filteredVigilantes = filteredVigilantes.filter(vigilante => vigilante.sector === filters.sector);
      filteredIncidents = filteredIncidents.filter(incident => incident.sector === filters.sector);
    }
    
    if (filters.status !== 'all') {
      filteredCameras = filteredCameras.filter(camera => camera.status === filters.status);
      filteredVigilantes = filteredVigilantes.filter(vigilante => vigilante.status === filters.status);
    }

    // Aplicar búsqueda por dirección
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filteredCameras = filteredCameras.filter(camera => 
        camera.address.toLowerCase().includes(query) ||
        camera.owner.toLowerCase().includes(query)
      );
      filteredVigilantes = filteredVigilantes.filter(vigilante => 
        vigilante.address.toLowerCase().includes(query) ||
        vigilante.name.toLowerCase().includes(query)
      );
    }

    return { filteredCameras, filteredVigilantes, filteredIncidents };
  };

  const exportToKML = () => {
    const { filteredCameras, filteredVigilantes, filteredIncidents } = getFilteredData();
    
    let kml = `<?xml version="1.0" encoding="UTF-8"?>
<kml xmlns="http://www.opengis.net/kml/2.2">
  <Document>
    <name>Chorrillos Seguro - ${new Date().toLocaleDateString()}</name>
    <description>Exportación de dispositivos y incidentes</description>`;

    // Agregar cámaras
    filteredCameras.forEach(camera => {
      kml += `
    <Placemark>
      <name>Cámara ${camera.brand} ${camera.model}</name>
      <description>
        <![CDATA[
        <b>Propietario:</b> ${camera.owner}<br/>
        <b>Dirección:</b> ${camera.address}<br/>
        <b>Estado:</b> ${camera.status}<br/>
        <b>Grabación:</b> ${camera.recording ? 'Sí' : 'No'}<br/>
        <b>Compartir:</b> ${camera.sharing ? 'Sí' : 'No'}<br/>
        <b>Último mantenimiento:</b> ${camera.lastMaintenance}
        ]]>
      </description>
      <Point>
        <coordinates>${camera.location.lng},${camera.location.lat},0</coordinates>
      </Point>
    </Placemark>`;
    });

    // Agregar vigilantes
    filteredVigilantes.forEach(vigilante => {
      kml += `
    <Placemark>
      <name>Vigilante: ${vigilante.name}</name>
      <description>
        <![CDATA[
        <b>Organización:</b> ${vigilante.organization}<br/>
        <b>Dirección:</b> ${vigilante.address}<br/>
        <b>Horario:</b> ${vigilante.schedule}<br/>
        <b>Experiencia:</b> ${vigilante.experience}<br/>
        <b>Última patrulla:</b> ${vigilante.lastPatrol}
        ]]>
      </description>
      <Point>
        <coordinates>${vigilante.location.lng},${vigilante.location.lat},0</coordinates>
      </Point>
    </Placemark>`;
    });

    // Agregar incidentes
    filteredIncidents.forEach(incident => {
      kml += `
    <Placemark>
      <name>Incidente: ${incident.type}</name>
      <description>
        <![CDATA[
        <b>Fecha:</b> ${incident.date}<br/>
        <b>Dirección:</b> ${incident.address}<br/>
        <b>Descripción:</b> ${incident.description}<br/>
        <b>Severidad:</b> ${incident.severity}<br/>
        <b>Estado:</b> ${incident.status}<br/>
        <b>Reportado por:</b> ${incident.reportedBy}
        ]]>
      </description>
      <Point>
        <coordinates>${incident.location.lng},${incident.location.lat},0</coordinates>
      </Point>
    </Placemark>`;
    });

    kml += `
  </Document>
</kml>`;

    // Crear y descargar archivo
    const blob = new Blob([kml], { type: 'application/vnd.google-earth.kml+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chorrillos-seguro-${new Date().toISOString().split('T')[0]}.kml`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getMarkerIcon = (type, status) => {
    const baseUrl = 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/';
    
    if (type === 'camera') {
      return status === 'active' ? `${baseUrl}marker-icon-2x-blue.png` : `${baseUrl}marker-icon-2x-red.png`;
    } else if (type === 'vigilante') {
      return `${baseUrl}marker-icon-2x-green.png`;
    } else if (type === 'incident') {
      return `${baseUrl}marker-icon-2x-orange.png`;
    }
    
    return `${baseUrl}marker-icon-2x-grey.png`;
  };

  const { filteredCameras, filteredVigilantes, filteredIncidents } = getFilteredData();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando mapa...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 font-poppins">
                Mapa Interactivo
              </h1>
              <p className="text-gray-600">
                Visualiza dispositivos de seguridad y incidentes en tiempo real
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <FunnelIcon className="h-5 w-5" />
                <span>Filtros</span>
              </button>
              <button
                onClick={() => setShowIncidents(!showIncidents)}
                className="flex items-center space-x-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
              >
                <InformationCircleIcon className="h-5 w-5" />
                <span>Incidentes</span>
              </button>
              <button
                onClick={exportToKML}
                className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <DocumentArrowDownIcon className="h-5 w-5" />
                <span>Exportar KML</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex h-[calc(100vh-120px)]">
        {/* Panel lateral izquierdo */}
        <div className="w-80 bg-white shadow-lg border-r border-gray-200 overflow-y-auto">
          {/* Estadísticas del mapa */}
          <div className="p-4 border-b border-gray-200">
            <MapStats data={mapData} filters={filters} />
          </div>
          {/* Búsqueda */}
          <div className="p-4 border-b border-gray-200">
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar por dirección..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <MagnifyingGlassIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
          </div>

          {/* Filtros */}
          {showFilters && (
            <div className="p-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900 mb-3">Filtros</h3>
              
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tipo de Dispositivo
                  </label>
                  <select
                    value={filters.type}
                    onChange={(e) => handleFilterChange('type', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="all">Todos los tipos</option>
                    <option value="residential">Residencial</option>
                    <option value="commercial">Comercial</option>
                    <option value="public">Público</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Sector
                  </label>
                  <select
                    value={filters.sector}
                    onChange={(e) => handleFilterChange('sector', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="all">Todos los sectores</option>
                    <option value="centro">Centro</option>
                    <option value="comercial">Comercial</option>
                    <option value="residencial">Residencial</option>
                    <option value="industrial">Industrial</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Estado
                  </label>
                  <select
                    value={filters.status}
                    onChange={(e) => handleFilterChange('status', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="all">Todos los estados</option>
                    <option value="active">Activo</option>
                    <option value="inactive">Inactivo</option>
                    <option value="maintenance">Mantenimiento</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Lista de dispositivos */}
          <div className="p-4">
            <h3 className="text-lg font-medium text-gray-900 mb-3">Dispositivos</h3>
            
            <div className="space-y-3">
              {/* Cámaras */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <MapIcon className="h-4 w-4 mr-2" />
                  Cámaras ({filteredCameras.length})
                </h4>
                <div className="space-y-2">
                  {filteredCameras.map(camera => (
                    <div
                      key={camera.id}
                      className="p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
                      onClick={() => setSelectedMarker({ type: 'camera', data: camera })}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{camera.brand} {camera.model}</p>
                          <p className="text-xs text-gray-600">{camera.address}</p>
                        </div>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          camera.status === 'active' ? 'bg-green-100 text-green-800' :
                          camera.status === 'maintenance' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {camera.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Vigilantes */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <MapIcon className="h-4 w-4 mr-2" />
                  Vigilantes ({filteredVigilantes.length})
                </h4>
                <div className="space-y-2">
                  {filteredVigilantes.map(vigilante => (
                    <div
                      key={vigilante.id}
                      className="p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
                      onClick={() => setSelectedMarker({ type: 'vigilante', data: vigilante })}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{vigilante.name}</p>
                          <p className="text-xs text-gray-600">{vigilante.address}</p>
                        </div>
                        <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                          {vigilante.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mapa */}
        <div className="flex-1 relative">
          <MapContainer
            ref={mapRef}
            center={mapCenter}
            zoom={mapZoom}
            className="h-full w-full"
          >
            <MapController center={mapCenter} zoom={mapZoom} />
            
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />

            {/* Marcadores de cámaras */}
            {filteredCameras.map(camera => (
              <Marker
                key={`camera-${camera.id}`}
                position={camera.location}
                icon={L.icon({
                  iconUrl: getMarkerIcon('camera', camera.status),
                  iconSize: [25, 41],
                  iconAnchor: [12, 41],
                  popupAnchor: [1, -34]
                })}
                eventHandlers={{
                  click: () => setSelectedMarker({ type: 'camera', data: camera })
                }}
              >
                <Popup>
                  <div className="p-2">
                    <h3 className="font-medium text-gray-900">{camera.brand} {camera.model}</h3>
                    <p className="text-sm text-gray-600">{camera.address}</p>
                    <p className="text-sm text-gray-600">Propietario: {camera.owner}</p>
                    <p className="text-sm text-gray-600">Estado: {camera.status}</p>
                  </div>
                </Popup>
              </Marker>
            ))}

            {/* Marcadores de vigilantes */}
            {filteredVigilantes.map(vigilante => (
              <Marker
                key={`vigilante-${vigilante.id}`}
                position={vigilante.location}
                icon={L.icon({
                  iconUrl: getMarkerIcon('vigilante'),
                  iconSize: [25, 41],
                  iconAnchor: [12, 41],
                  popupAnchor: [1, -34]
                })}
                eventHandlers={{
                  click: () => setSelectedMarker({ type: 'vigilante', data: vigilante })
                }}
              >
                <Popup>
                  <div className="p-2">
                    <h3 className="font-medium text-gray-900">{vigilante.name}</h3>
                    <p className="text-sm text-gray-600">{vigilante.address}</p>
                    <p className="text-sm text-gray-600">Organización: {vigilante.organization}</p>
                    <p className="text-sm text-gray-600">Horario: {vigilante.schedule}</p>
                  </div>
                </Popup>
              </Marker>
            ))}

            {/* Marcadores de incidentes */}
            {showIncidents && filteredIncidents.map(incident => (
              <Marker
                key={`incident-${incident.id}`}
                position={incident.location}
                icon={L.icon({
                  iconUrl: getMarkerIcon('incident'),
                  iconSize: [25, 41],
                  iconAnchor: [12, 41],
                  popupAnchor: [1, -34]
                })}
                eventHandlers={{
                  click: () => setSelectedMarker({ type: 'incident', data: incident })
                }}
              >
                <Popup>
                  <div className="p-2">
                    <h3 className="font-medium text-gray-900">Incidente: {incident.type}</h3>
                    <p className="text-sm text-gray-600">{incident.address}</p>
                    <p className="text-sm text-gray-600">Fecha: {incident.date}</p>
                    <p className="text-sm text-gray-600">Descripción: {incident.description}</p>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>

        {/* Panel lateral derecho - Detalles del marcador seleccionado */}
        {selectedMarker && (
          <div className="w-80 bg-white shadow-lg border-l border-gray-200 overflow-y-auto">
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  {selectedMarker.type === 'camera' ? 'Detalles de Cámara' :
                   selectedMarker.type === 'vigilante' ? 'Detalles de Vigilante' :
                   'Detalles de Incidente'}
                </h3>
                <button
                  onClick={() => setSelectedMarker(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <EyeSlashIcon className="h-5 w-5" />
                </button>
              </div>

              {selectedMarker.type === 'camera' && (
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium text-gray-700">Modelo</p>
                    <p className="text-gray-900">{selectedMarker.data.brand} {selectedMarker.data.model}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Propietario</p>
                    <p className="text-gray-900">{selectedMarker.data.owner}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Dirección</p>
                    <p className="text-gray-900">{selectedMarker.data.address}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Estado</p>
                    <span className={`inline-flex px-2 py-1 text-xs rounded-full ${
                      selectedMarker.data.status === 'active' ? 'bg-green-100 text-green-800' :
                      selectedMarker.data.status === 'maintenance' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {selectedMarker.data.status}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Grabación</p>
                    <p className="text-gray-900">{selectedMarker.data.recording ? 'Sí' : 'No'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Compartir</p>
                    <p className="text-gray-900">{selectedMarker.data.sharing ? 'Sí' : 'No'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Último Mantenimiento</p>
                    <p className="text-gray-900">{selectedMarker.data.lastMaintenance}</p>
                  </div>
                </div>
              )}

              {selectedMarker.type === 'vigilante' && (
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium text-gray-700">Nombre</p>
                    <p className="text-gray-900">{selectedMarker.data.name}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Organización</p>
                    <p className="text-gray-900">{selectedMarker.data.organization}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Dirección</p>
                    <p className="text-gray-900">{selectedMarker.data.address}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Horario</p>
                    <p className="text-gray-900">{selectedMarker.data.schedule}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Experiencia</p>
                    <p className="text-gray-900">{selectedMarker.data.experience}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Última Patrulla</p>
                    <p className="text-gray-900">{selectedMarker.data.lastPatrol}</p>
                  </div>
                </div>
              )}

              {selectedMarker.type === 'incident' && (
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium text-gray-700">Tipo</p>
                    <p className="text-gray-900 capitalize">{selectedMarker.data.type}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Fecha</p>
                    <p className="text-gray-900">{selectedMarker.data.date}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Dirección</p>
                    <p className="text-gray-900">{selectedMarker.data.address}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Descripción</p>
                    <p className="text-gray-900">{selectedMarker.data.description}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Severidad</p>
                    <span className={`inline-flex px-2 py-1 text-xs rounded-full ${
                      selectedMarker.data.severity === 'high' ? 'bg-red-100 text-red-800' :
                      selectedMarker.data.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {selectedMarker.data.severity}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Estado</p>
                    <p className="text-gray-900">{selectedMarker.data.status}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Reportado por</p>
                    <p className="text-gray-900">{selectedMarker.data.reportedBy}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MapaInteractivo;
