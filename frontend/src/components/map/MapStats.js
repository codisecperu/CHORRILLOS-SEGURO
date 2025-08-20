import React from 'react';
import { 
  CameraIcon, 
  ShieldCheckIcon, 
  ExclamationTriangleIcon,
  MapPinIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';

const MapStats = ({ data, filters }) => {
  const getFilteredStats = () => {
    let cameras = data.cameras || [];
    let vigilantes = data.vigilantes || [];
    let incidents = data.incidents || [];

    // Aplicar filtros
    if (filters.type !== 'all') {
      cameras = cameras.filter(camera => camera.type === filters.type);
    }
    
    if (filters.sector !== 'all') {
      cameras = cameras.filter(camera => camera.sector === filters.sector);
      vigilantes = vigilantes.filter(vigilante => vigilante.sector === filters.sector);
      incidents = incidents.filter(incident => incident.sector === filters.sector);
    }
    
    if (filters.status !== 'all') {
      cameras = cameras.filter(camera => camera.status === filters.status);
      vigilantes = vigilantes.filter(vigilante => vigilante.status === filters.status);
    }

    return { cameras, vigilantes, incidents };
  };

  const { cameras, vigilantes, incidents } = getFilteredStats();

  const stats = [
    {
      name: 'Cámaras Activas',
      value: cameras.filter(c => c.status === 'active').length,
      total: cameras.length,
      icon: CameraIcon,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-700'
    },
    {
      name: 'Vigilantes Activos',
      value: vigilantes.filter(v => v.status === 'active').length,
      total: vigilantes.length,
      icon: ShieldCheckIcon,
      color: 'bg-green-500',
      bgColor: 'bg-green-50',
      textColor: 'text-green-700'
    },
    {
      name: 'Incidentes Recientes',
      value: incidents.filter(i => i.status === 'investigating').length,
      total: incidents.length,
      icon: ExclamationTriangleIcon,
      color: 'bg-orange-500',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-700'
    },
    {
      name: 'Cobertura por Sector',
      value: new Set([...cameras, ...vigilantes].map(item => item.sector)).size,
      total: 4, // Total de sectores
      icon: MapPinIcon,
      color: 'bg-purple-500',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-700'
    }
  ];

  const getStatusBreakdown = () => {
    const cameraStatus = cameras.reduce((acc, camera) => {
      acc[camera.status] = (acc[camera.status] || 0) + 1;
      return acc;
    }, {});

    const incidentSeverity = incidents.reduce((acc, incident) => {
      acc[incident.severity] = (acc[incident.severity] || 0) + 1;
      return acc;
    }, {});

    return { cameraStatus, incidentSeverity };
  };

  const { cameraStatus, incidentSeverity } = getStatusBreakdown();

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <ChartBarIcon className="h-5 w-5 mr-2 text-blue-600" />
          Estadísticas del Mapa
        </h3>
        <span className="text-sm text-gray-500">
          Actualizado: {new Date().toLocaleTimeString()}
        </span>
      </div>

      {/* Estadísticas principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                {stat.total > 0 && (
                  <p className="text-xs text-gray-500">
                    de {stat.total} total
                  </p>
                )}
              </div>
              <div className={`p-3 rounded-full ${stat.bgColor}`}>
                <stat.icon className={`h-6 w-6 ${stat.textColor}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Desglose detallado */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Estado de las cámaras */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="text-sm font-medium text-gray-900 mb-3">Estado de las Cámaras</h4>
          <div className="space-y-2">
            {Object.entries(cameraStatus).map(([status, count]) => (
              <div key={status} className="flex items-center justify-between">
                <span className="text-sm text-gray-600 capitalize">{status}</span>
                <div className="flex items-center space-x-2">
                  <div className="w-20 bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        status === 'active' ? 'bg-green-500' :
                        status === 'maintenance' ? 'bg-yellow-500' :
                        'bg-red-500'
                      }`}
                      style={{ width: `${(count / cameras.length) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-900 w-8 text-right">
                    {count}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Severidad de incidentes */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="text-sm font-medium text-gray-900 mb-3">Severidad de Incidentes</h4>
          <div className="space-y-2">
            {Object.entries(incidentSeverity).map(([severity, count]) => (
              <div key={severity} className="flex items-center justify-between">
                <span className="text-sm text-gray-600 capitalize">{severity}</span>
                <div className="flex items-center space-x-2">
                  <div className="w-20 bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        severity === 'high' ? 'bg-red-500' :
                        severity === 'medium' ? 'bg-yellow-500' :
                        'bg-green-500'
                      }`}
                      style={{ width: `${(count / incidents.length) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-900 w-8 text-right">
                    {count}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Resumen de cobertura */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <h4 className="text-sm font-medium text-gray-900 mb-3">Resumen de Cobertura</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {cameras.length}
            </div>
            <div className="text-sm text-gray-600">Dispositivos de Seguridad</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {vigilantes.length}
            </div>
            <div className="text-sm text-gray-600">Personal de Vigilancia</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">
              {incidents.length}
            </div>
            <div className="text-sm text-gray-600">Incidentes Registrados</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapStats;

