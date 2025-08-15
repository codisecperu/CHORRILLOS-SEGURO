import React, { useState } from 'react';
import { 
  ChartBarIcon, 
  UsersIcon, 
  CameraIcon, 
  ShieldCheckIcon,
  DocumentArrowDownIcon,
  FunnelIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  CheckIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

const PanelAdmin = () => {
  const [tabActiva, setTabActiva] = useState('dashboard');
  const [filtrosExportacion, setFiltrosExportacion] = useState({
    tipo: 'todos',
    sector: 'todos',
    estado: 'todos',
    fechaDesde: '',
    fechaHasta: ''
  });

  // Datos de ejemplo para el dashboard
  const estadisticas = {
    totalCamaras: 156,
    totalVigilantes: 89,
    camarasActivas: 142,
    camarasPendientes: 14,
    incidenciasMes: 23,
    coberturaSectores: {
      centro: 45,
      playa: 32,
      morro: 28,
      pampilla: 25,
      villa: 16
    }
  };

  const registrosPendientes = [
    {
      id: 1,
      tipo: 'camara',
      nombre: 'Cámara Residencial Jr. Lima 150',
      propietario: 'María González',
      fechaRegistro: '2025-01-20',
      estado: 'pendiente'
    },
    {
      id: 2,
      tipo: 'vigilante',
      nombre: 'Roberto Silva',
      organizacion: 'Comité de Seguridad',
      fechaRegistro: '2025-01-19',
      estado: 'pendiente'
    },
    {
      id: 3,
      tipo: 'camara',
      nombre: 'Cámara Comercial Av. Defensores 200',
      propietario: 'Centro Comercial Plaza',
      fechaRegistro: '2025-01-18',
      estado: 'pendiente'
    }
  ];

  const solicitudesImagenes = [
    {
      id: 1,
      camara: 'Cámara Residencial Av. Defensores 100',
      propietario: 'Juan Pérez',
      fechaSolicitud: '2025-01-15',
      motivo: 'Investigación de robo de vehículo',
      estado: 'pendiente'
    },
    {
      id: 2,
      camara: 'Cámara Comercial Jr. Lima 80',
      propietario: 'Restaurante El Morro',
      fechaSolicitud: '2025-01-14',
      motivo: 'Vandalismo en propiedad',
      estado: 'aprobada'
    }
  ];

  const tabs = [
    { id: 'dashboard', nombre: 'Dashboard', icono: ChartBarIcon },
    { id: 'registros', nombre: 'Registros Pendientes', icono: UsersIcon },
    { id: 'solicitudes', nombre: 'Solicitudes de Imágenes', icono: CameraIcon },
    { id: 'exportacion', nombre: 'Exportación KML', icono: DocumentArrowDownIcon }
  ];

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Tarjetas de estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card text-center">
          <div className="flex justify-center mb-3">
            <div className="w-12 h-12 bg-chorrillos-blue rounded-full flex items-center justify-center">
              <CameraIcon className="h-6 w-6 text-white" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">{estadisticas.totalCamaras}</h3>
          <p className="text-gray-600">Total de Cámaras</p>
        </div>

        <div className="card text-center">
          <div className="flex justify-center mb-3">
            <div className="w-12 h-12 bg-chorrillos-gold rounded-full flex items-center justify-center">
              <ShieldCheckIcon className="h-6 w-6 text-chorrillos-dark" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">{estadisticas.totalVigilantes}</h3>
          <p className="text-gray-600">Total de Vigilantes</p>
        </div>

        <div className="card text-center">
          <div className="flex justify-center mb-3">
            <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
              <CheckIcon className="h-6 w-6 text-white" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">{estadisticas.camarasActivas}</h3>
          <p className="text-gray-600">Cámaras Activas</p>
        </div>

        <div className="card text-center">
          <div className="flex justify-center mb-3">
            <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center">
              <XMarkIcon className="h-6 w-6 text-white" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">{estadisticas.incidenciasMes}</h3>
          <p className="text-gray-600">Incidencias del Mes</p>
        </div>
      </div>

      {/* Gráfico de cobertura por sectores */}
      <div className="card">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Cobertura por Sectores</h3>
        <div className="space-y-3">
          {Object.entries(estadisticas.coberturaSectores).map(([sector, cantidad]) => (
            <div key={sector} className="flex items-center justify-between">
              <span className="capitalize font-medium">{sector}</span>
              <div className="flex items-center">
                <div className="w-32 bg-gray-200 rounded-full h-2 mr-3">
                  <div
                    className="bg-chorrillos-blue h-2 rounded-full"
                    style={{ width: `${(cantidad / Math.max(...Object.values(estadisticas.coberturaSectores))) * 100}%` }}
                  ></div>
                </div>
                <span className="text-sm font-medium text-gray-600 w-8">{cantidad}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Actividad reciente */}
      <div className="card">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Actividad Reciente</h3>
        <div className="space-y-3">
          <div className="flex items-center p-3 bg-gray-50 rounded-lg">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
            <span className="text-sm text-gray-600">Nueva cámara registrada en sector Centro</span>
            <span className="text-xs text-gray-500 ml-auto">Hace 2 horas</span>
          </div>
          <div className="flex items-center p-3 bg-gray-50 rounded-lg">
            <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
            <span className="text-sm text-gray-600">Vigilante vecinal aprobado en sector Playa</span>
            <span className="text-xs text-gray-500 ml-auto">Hace 4 horas</span>
          </div>
          <div className="flex items-center p-3 bg-gray-50 rounded-lg">
            <div className="w-2 h-2 bg-yellow-500 rounded-full mr-3"></div>
            <span className="text-sm text-gray-600">Solicitud de imágenes pendiente de revisión</span>
            <span className="text-xs text-gray-500 ml-auto">Hace 6 horas</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderRegistrosPendientes = () => (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-900">Registros Pendientes de Validación</h3>
        <button className="btn-primary">
          <FunnelIcon className="h-4 w-4 mr-2" />
          Filtros
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tipo
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nombre/Descripción
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Propietario/Organización
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fecha de Registro
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {registrosPendientes.map((registro) => (
              <tr key={registro.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    {registro.tipo === 'camara' ? (
                      <CameraIcon className="h-5 w-5 text-chorrillos-blue mr-2" />
                    ) : (
                      <ShieldCheckIcon className="h-5 w-5 text-chorrillos-gold mr-2" />
                    )}
                    <span className="capitalize">{registro.tipo}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {registro.nombre}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {registro.propietario || registro.organizacion}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {registro.fechaRegistro}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <button className="text-chorrillos-blue hover:text-chorrillos-dark">
                      <EyeIcon className="h-4 w-4" />
                    </button>
                    <button className="text-green-600 hover:text-green-900">
                      <CheckIcon className="h-4 w-4" />
                    </button>
                    <button className="text-red-600 hover:text-red-900">
                      <XMarkIcon className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderSolicitudesImagenes = () => (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-900">Solicitudes de Imágenes</h3>
        <button className="btn-primary">
          <FunnelIcon className="h-4 w-4 mr-2" />
          Filtros
        </button>
      </div>

      <div className="space-y-4">
        {solicitudesImagenes.map((solicitud) => (
          <div key={solicitud.id} className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h4 className="font-medium text-gray-900 mb-2">{solicitud.camara}</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Propietario:</span>
                    <p className="font-medium">{solicitud.propietario}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Fecha de Solicitud:</span>
                    <p className="font-medium">{solicitud.fechaSolicitud}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Motivo:</span>
                    <p className="font-medium">{solicitud.motivo}</p>
                  </div>
                </div>
              </div>
              <div className="ml-4">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  solicitud.estado === 'pendiente' 
                    ? 'bg-yellow-100 text-yellow-800' 
                    : 'bg-green-100 text-green-800'
                }`}>
                  {solicitud.estado}
                </span>
              </div>
            </div>
            <div className="mt-4 flex space-x-2">
              <button className="btn-primary text-sm">
                Aprobar Solicitud
              </button>
              <button className="btn-outline text-sm">
                Rechazar
              </button>
              <button className="btn-outline text-sm">
                Solicitar Más Información
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderExportacionKML = () => (
    <div className="space-y-6">
      {/* Filtros de exportación */}
      <div className="card">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Filtros de Exportación</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="form-label">Tipo de Registro</label>
            <select
              value={filtrosExportacion.tipo}
              onChange={(e) => setFiltrosExportacion(prev => ({ ...prev, tipo: e.target.value }))}
              className="form-input"
            >
              <option value="todos">Todos</option>
              <option value="camara">Solo Cámaras</option>
              <option value="vigilante">Solo Vigilantes</option>
            </select>
          </div>

          <div>
            <label className="form-label">Sector</label>
            <select
              value={filtrosExportacion.sector}
              onChange={(e) => setFiltrosExportacion(prev => ({ ...prev, sector: e.target.value }))}
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
              value={filtrosExportacion.estado}
              onChange={(e) => setFiltrosExportacion(prev => ({ ...prev, estado: e.target.value }))}
              className="form-input"
            >
              <option value="todos">Todos los estados</option>
              <option value="activo">Solo Activos</option>
              <option value="pendiente">Solo Pendientes</option>
              <option value="inactivo">Solo Inactivos</option>
            </select>
          </div>

          <div>
            <label className="form-label">Fecha Desde</label>
            <input
              type="date"
              value={filtrosExportacion.fechaDesde}
              onChange={(e) => setFiltrosExportacion(prev => ({ ...prev, fechaDesde: e.target.value }))}
              className="form-input"
            />
          </div>

          <div>
            <label className="form-label">Fecha Hasta</label>
            <input
              type="date"
              value={filtrosExportacion.fechaHasta}
              onChange={(e) => setFiltrosExportacion(prev => ({ ...prev, fechaHasta: e.target.value }))}
              className="form-input"
            />
          </div>

          <div className="flex items-end">
            <button className="btn-primary w-full">
              <FunnelIcon className="h-4 w-4 mr-2" />
              Aplicar Filtros
            </button>
          </div>
        </div>
      </div>

      {/* Opciones de exportación */}
      <div className="card">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Opciones de Exportación</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 border border-gray-200 rounded-lg">
            <DocumentArrowDownIcon className="h-12 w-12 text-chorrillos-blue mx-auto mb-3" />
            <h4 className="font-semibold text-gray-900 mb-2">Exportar KML</h4>
            <p className="text-sm text-gray-600 mb-3">
              Archivo compatible con Google Earth y sistemas SIG
            </p>
            <button className="btn-primary w-full">
              Descargar KML
            </button>
          </div>

          <div className="text-center p-4 border border-gray-200 rounded-lg">
            <DocumentArrowDownIcon className="h-12 w-12 text-chorrillos-gold mx-auto mb-3" />
            <h4 className="font-semibold text-gray-900 mb-2">Exportar Excel</h4>
            <p className="text-sm text-gray-600 mb-3">
              Reporte detallado en formato de hoja de cálculo
            </p>
            <button className="btn-secondary w-full">
              Descargar Excel
            </button>
          </div>

          <div className="text-center p-4 border border-gray-200 rounded-lg">
            <DocumentArrowDownIcon className="h-12 w-12 text-chorrillos-dark mx-auto mb-3" />
            <h4 className="font-semibold text-gray-900 mb-2">Exportar PDF</h4>
            <p className="text-sm text-gray-600 mb-3">
              Reporte formal para documentación oficial
            </p>
            <button className="btn-outline w-full">
              Descargar PDF
            </button>
          </div>
        </div>
      </div>

      {/* Vista previa de datos */}
      <div className="card">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Vista Previa de Datos a Exportar</h3>
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600">
            <strong>Total de registros:</strong> 245<br />
            <strong>Cámaras:</strong> 156<br />
            <strong>Vigilantes:</strong> 89<br />
            <strong>Formato KML:</strong> Incluye coordenadas, información básica y metadatos
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Panel Administrativo
              </h1>
              <p className="text-lg text-gray-600">
                Gestión y administración de la plataforma Chorrillos Seguro
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">Usuario: Admin</span>
              <button className="btn-outline text-sm">Cerrar Sesión</button>
            </div>
          </div>
        </div>
      </div>

      {/* Navegación por tabs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setTabActiva(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  tabActiva === tab.id
                    ? 'border-chorrillos-blue text-chorrillos-blue'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icono className="h-5 w-5 inline mr-2" />
                {tab.nombre}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Contenido de la tab activa */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {tabActiva === 'dashboard' && renderDashboard()}
        {tabActiva === 'registros' && renderRegistrosPendientes()}
        {tabActiva === 'solicitudes' && renderSolicitudesImagenes()}
        {tabActiva === 'exportacion' && renderExportacionKML()}
      </div>
    </div>
  );
};

export default PanelAdmin;
