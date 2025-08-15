import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, CircleMarker } from 'react-leaflet';
import { CameraIcon, ShieldCheckIcon, FunnelIcon } from '@heroicons/react/24/outline';
import 'leaflet/dist/leaflet.css';

// Fix para los iconos de Leaflet en React
import L from 'leaflet';
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const MapaInteractivo = () => {
  const [filtros, setFiltros] = useState({
    tipo: 'todos',
    sector: 'todos',
    estado: 'todos'
  });
  
  const [mostrarFiltros, setMostrarFiltros] = useState(false);
  const [puntos, setPuntos] = useState([]);
  const [puntoSeleccionado, setPuntoSeleccionado] = useState(null);
  const [mostrarIncidencias, setMostrarIncidencias] = useState(false);

  // Datos de ejemplo (en producción vendrían del backend)
  const datosEjemplo = [
    {
      id: 1,
      tipo: 'camara',
      nombre: 'Cámara Residencial Av. Defensores del Morro',
      propietario: 'Juan Pérez',
      direccion: 'Av. Defensores del Morro 150',
      sector: 'centro',
      estado: 'activo',
      coordenadas: [-12.1784, -77.0084],
      zonaVisibilidad: 'Entrada principal y estacionamiento',
      grabacion: true,
      disposicionCompartir: true
    },
    {
      id: 2,
      tipo: 'vigilante',
      nombre: 'Carlos Rodríguez',
      organizacion: 'Junta Vecinal',
      direccion: 'Jr. Lima 200',
      sector: 'playa',
      estado: 'activo',
      coordenadas: [-12.1790, -77.0090],
      horario: 'Noche (10:00 PM - 6:00 AM)',
      zonaVigilancia: 'Cuadra 2 del Jr. Lima'
    },
    {
      id: 3,
      tipo: 'camara',
      nombre: 'Cámara Comercial Centro Comercial Chorrillos',
      propietario: 'Centro Comercial Chorrillos S.A.',
      direccion: 'Av. Defensores del Morro 300',
      sector: 'centro',
      estado: 'pendiente',
      coordenadas: [-12.1770, -77.0070],
      zonaVisibilidad: 'Estacionamiento y entrada principal',
      grabacion: true,
      disposicionCompartir: false
    }
  ];

  useEffect(() => {
    setPuntos(datosEjemplo);
  }, []);

  const filtrarPuntos = () => {
    let puntosFiltrados = datosEjemplo;

    if (filtros.tipo !== 'todos') {
      puntosFiltrados = puntosFiltrados.filter(punto => punto.tipo === filtros.tipo);
    }

    if (filtros.sector !== 'todos') {
      puntosFiltrados = puntosFiltrados.filter(punto => punto.sector === filtros.sector);
    }

    if (filtros.estado !== 'todos') {
      puntosFiltrados = puntosFiltrados.filter(punto => punto.estado === filtros.estado);
    }

    setPuntos(puntosFiltrados);
  };

  useEffect(() => {
    filtrarPuntos();
  }, [filtros]);

  const getIcono = (tipo) => {
    if (tipo === 'camara') {
      return new L.Icon({
        iconUrl: 'data:image/svg+xml;base64,' + btoa(`
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#005fa8" width="32" height="32">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
          </svg>
        `),
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32]
      });
    } else {
      return new L.Icon({
        iconUrl: 'data:image/svg+xml;base64,' + btoa(`
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#e8b400" width="32" height="32">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
          </svg>
        `),
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32]
      });
    }
  };

  const getColorEstado = (estado) => {
    switch (estado) {
      case 'activo': return '#10b981';
      case 'pendiente': return '#f59e0b';
      case 'inactivo': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const handlePuntoClick = (punto) => {
    setPuntoSeleccionado(punto);
    setMostrarIncidencias(false);
  };

  const incidenciasEjemplo = [
    {
      id: 1,
      fecha: '2025-01-15',
      tipo: 'Robo',
      descripcion: 'Robo de vehículo en estacionamiento',
      acciones: 'Se solicitó video de la cámara, se identificó al sospechoso',
      reporte: 'reporte_001.pdf'
    },
    {
      id: 2,
      fecha: '2025-01-10',
      tipo: 'Vandalismo',
      descripcion: 'Daños a propiedad privada',
      acciones: 'Se reportó a la comisaría, se tomaron fotos',
      reporte: 'reporte_002.pdf'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Mapa Interactivo de Seguridad
              </h1>
              <p className="text-lg text-gray-600">
                Visualice la cobertura de cámaras y vigilantes en Chorrillos
              </p>
            </div>
            
            <div className="mt-4 md:mt-0">
              <button
                onClick={() => setMostrarFiltros(!mostrarFiltros)}
                className="btn-primary flex items-center"
              >
                <FunnelIcon className="h-5 w-5 mr-2" />
                Filtros
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Filtros */}
      {mostrarFiltros && (
        <div className="bg-white border-b shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="form-label">Tipo</label>
                <select
                  value={filtros.tipo}
                  onChange={(e) => setFiltros(prev => ({ ...prev, tipo: e.target.value }))}
                  className="form-input"
                >
                  <option value="todos">Todos</option>
                  <option value="camara">Cámaras</option>
                  <option value="vigilante">Vigilantes</option>
                </select>
              </div>
              
              <div>
                <label className="form-label">Sector</label>
                <select
                  value={filtros.sector}
                  onChange={(e) => setFiltros(prev => ({ ...prev, sector: e.target.value }))}
                  className="form-input"
                >
                  <option value="todos">Todos los sectores</option>
                  <option value="centro">Centro</option>
                  <option value="playa">Playa</option>
                  <option value="morro">Morro</option>
                  <option value="pampilla">Pampilla</option>
                  <option value="villa">Villa</option>
                  <option value="chavez">Chavez</option>
                </select>
              </div>
              
              <div>
                <label className="form-label">Estado</label>
                <select
                  value={filtros.estado}
                  onChange={(e) => setFiltros(prev => ({ ...prev, estado: e.target.value }))}
                  className="form-input"
                >
                  <option value="todos">Todos los estados</option>
                  <option value="activo">Activo</option>
                  <option value="pendiente">Pendiente</option>
                  <option value="inactivo">Inactivo</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mapa y Panel de Información */}
      <div className="flex flex-col lg:flex-row h-[calc(100vh-200px)]">
        {/* Mapa */}
        <div className="flex-1">
          <MapContainer
            center={[-12.1784, -77.0084]}
            zoom={15}
            className="h-full w-full"
            style={{ minHeight: '500px' }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            
            {puntos.map((punto) => (
              <Marker
                key={punto.id}
                position={punto.coordenadas}
                icon={getIcono(punto.tipo)}
                eventHandlers={{
                  click: () => handlePuntoClick(punto)
                }}
              >
                <Popup>
                  <div className="p-2">
                    <h3 className="font-semibold text-lg mb-2">{punto.nombre}</h3>
                    <div className="space-y-1 text-sm">
                      <p><strong>Tipo:</strong> {punto.tipo === 'camara' ? 'Cámara' : 'Vigilante'}</p>
                      <p><strong>Dirección:</strong> {punto.direccion}</p>
                      <p><strong>Sector:</strong> {punto.sector}</p>
                      <p><strong>Estado:</strong> 
                        <span 
                          className="ml-1 px-2 py-1 rounded-full text-xs text-white"
                          style={{ backgroundColor: getColorEstado(punto.estado) }}
                        >
                          {punto.estado}
                        </span>
                      </p>
                    </div>
                    <button
                      onClick={() => handlePuntoClick(punto)}
                      className="btn-primary w-full mt-3 text-sm"
                    >
                      Ver Detalles
                    </button>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>

        {/* Panel de Información */}
        {puntoSeleccionado && (
          <div className="w-full lg:w-96 bg-white border-l shadow-lg overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">
                  {puntoSeleccionado.nombre}
                </h2>
                <button
                  onClick={() => setPuntoSeleccionado(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              {/* Información del punto */}
              <div className="space-y-4 mb-6">
                <div className="flex items-center">
                  {puntoSeleccionado.tipo === 'camara' ? (
                    <CameraIcon className="h-6 w-6 text-chorrillos-blue mr-2" />
                  ) : (
                    <ShieldCheckIcon className="h-6 w-6 text-chorrillos-gold mr-2" />
                  )}
                  <span className="font-medium">
                    {puntoSeleccionado.tipo === 'camara' ? 'Cámara de Seguridad' : 'Vigilante Vecinal'}
                  </span>
                </div>

                <div>
                  <p className="text-sm text-gray-600 mb-1">Dirección</p>
                  <p className="font-medium">{puntoSeleccionado.direccion}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-600 mb-1">Sector</p>
                  <p className="font-medium capitalize">{puntoSeleccionado.sector}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-600 mb-1">Estado</p>
                  <span 
                    className="px-3 py-1 rounded-full text-sm text-white font-medium"
                    style={{ backgroundColor: getColorEstado(puntoSeleccionado.estado) }}
                  >
                    {puntoSeleccionado.estado}
                  </span>
                </div>

                {puntoSeleccionado.tipo === 'camara' && (
                  <>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Propietario</p>
                      <p className="font-medium">{puntoSeleccionado.propietario}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Zona de Visibilidad</p>
                      <p className="font-medium">{puntoSeleccionado.zonaVisibilidad}</p>
                    </div>
                    <div className="flex space-x-4">
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Grabación</p>
                        <span className={`px-2 py-1 rounded text-xs ${puntoSeleccionado.grabacion ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {puntoSeleccionado.grabacion ? 'Sí' : 'No'}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Disposición a Compartir</p>
                        <span className={`px-2 py-1 rounded text-xs ${puntoSeleccionado.disposicionCompartir ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {puntoSeleccionado.disposicionCompartir ? 'Sí' : 'No'}
                        </span>
                      </div>
                    </div>
                  </>
                )}

                {puntoSeleccionado.tipo === 'vigilante' && (
                  <>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Organización</p>
                      <p className="font-medium">{puntoSeleccionado.organizacion}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Horario</p>
                      <p className="font-medium">{puntoSeleccionado.horario}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Zona de Vigilancia</p>
                      <p className="font-medium">{puntoSeleccionado.zonaVigilancia}</p>
                    </div>
                  </>
                )}
              </div>

              {/* Botones de acción */}
              <div className="space-y-3 mb-6">
                <button
                  onClick={() => setMostrarIncidencias(!mostrarIncidencias)}
                  className="btn-primary w-full"
                >
                  {mostrarIncidencias ? 'Ocultar' : 'Ver'} Historial de Incidencias
                </button>
                
                {puntoSeleccionado.tipo === 'camara' && (
                  <button className="btn-outline w-full">
                    Solicitar Imágenes
                  </button>
                )}
              </div>

              {/* Historial de Incidencias */}
              {mostrarIncidencias && (
                <div className="border-t pt-4">
                  <h3 className="font-semibold text-lg mb-3">Historial de Incidencias</h3>
                  <div className="space-y-3">
                    {incidenciasEjemplo.map((incidencia) => (
                      <div key={incidencia.id} className="border rounded-lg p-3 bg-gray-50">
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-sm font-medium text-gray-900">
                            {incidencia.tipo}
                          </span>
                          <span className="text-xs text-gray-500">
                            {incidencia.fecha}
                          </span>
                        </div>
                        <p className="text-sm text-gray-700 mb-2">
                          {incidencia.descripcion}
                        </p>
                        <p className="text-xs text-gray-600 mb-2">
                          <strong>Acciones:</strong> {incidencia.acciones}
                        </p>
                        <a
                          href={`#${incidencia.reporte}`}
                          className="text-xs text-chorrillos-blue hover:underline"
                        >
                          Ver reporte
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Leyenda */}
      <div className="bg-white border-t p-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap items-center justify-center space-x-6 text-sm">
            <div className="flex items-center">
              <div className="w-4 h-4 bg-chorrillos-blue rounded-full mr-2"></div>
              <span>Cámaras</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-chorrillos-gold rounded-full mr-2"></div>
              <span>Vigilantes</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-green-500 rounded-full mr-2"></div>
              <span>Activo</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-yellow-500 rounded-full mr-2"></div>
              <span>Pendiente</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-red-500 rounded-full mr-2"></div>
              <span>Inactivo</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapaInteractivo;
