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
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold text-gray-900 flex items-center">
          <ChartBarIcon className="h-5 w-5 mr-2 text-blue-600" />
          Estadísticas
        </h3>
        <span className="text-xs text-gray-500">
          {new Date().toLocaleTimeString()}
        </span>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        {stats.map((stat) => (
          <div key={stat.name} className={`${stat.bgColor} rounded-lg p-3`}>
            <div className="flex flex-col items-start">
                <div className={`p-2 rounded-full mb-2 ${stat.bgColor}`}>
                    <stat.icon className={`h-5 w-5 ${stat.textColor}`} />
                </div>
                <p className="text-xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-xs font-medium text-gray-600 truncate">{stat.name}</p>
                {stat.total > 0 && (
                  <p className="text-xs text-gray-500">
                    de {stat.total}
                  </p>
                )}
            </div>
          </div>
        ))}
      </div>

      {/* Detailed Breakdown */}
      <div className="space-y-4">
        {/* Camera Status */}
        <div className="bg-gray-50 rounded-lg p-3">
          <h4 className="text-sm font-medium text-gray-900 mb-2">Estado de Cámaras</h4>
          <div className="space-y-2">
            {Object.entries(cameraStatus).map(([status, count]) => (
              <div key={status} className="flex items-center justify-between text-xs">
                <span className="text-gray-600 capitalize">{status}</span>
                <span className="font-medium text-gray-900">{count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Incident Severity */}
        <div className="bg-gray-50 rounded-lg p-3">
          <h4 className="text-sm font-medium text-gray-900 mb-2">Severidad de Incidentes</h4>
          <div className="space-y-2">
            {Object.entries(incidentSeverity).map(([severity, count]) => (
              <div key={severity} className="flex items-center justify-between text-xs">
                <span className="text-gray-600 capitalize">{severity}</span>
                <span className="font-medium text-gray-900">{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapStats;

