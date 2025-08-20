import React, { useState } from 'react';
import { 
  ChartBarIcon, 
   
  ClockIcon, 
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';
import { useNotifications } from '../../contexts/NotificationContext';

const EventDashboard = () => {
  const [timeRange, setTimeRange] = useState('24h');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const { notifications } = useNotifications();

  // Filtrar notificaciones por rango de tiempo
  const getFilteredNotifications = () => {
    const now = new Date();
    const timeRanges = {
      '1h': 60 * 60 * 1000,
      '24h': 24 * 60 * 60 * 1000,
      '7d': 7 * 24 * 60 * 60 * 1000,
      '30d': 30 * 24 * 60 * 60 * 1000
    };

    const filtered = notifications.filter(notif => {
      const notifTime = new Date(notif.timestamp);
      const timeDiff = now - notifTime;
      return timeDiff <= timeRanges[timeRange];
    });

    if (selectedCategory !== 'all') {
      return filtered.filter(notif => notif.category === selectedCategory);
    }

    return filtered;
  };

  const filteredNotifications = getFilteredNotifications();

  // Estadísticas generales
  const stats = {
    total: filteredNotifications.length,
    unread: filteredNotifications.filter(n => !n.isRead).length,
    highPriority: filteredNotifications.filter(n => n.priority === 'high').length,
    mediumPriority: filteredNotifications.filter(n => n.priority === 'medium').length,
    lowPriority: filteredNotifications.filter(n => n.priority === 'low').length
  };

  // Estadísticas por categoría
  const categoryStats = filteredNotifications.reduce((acc, notif) => {
    acc[notif.category] = (acc[notif.category] || 0) + 1;
    return acc;
  }, {});

  // Estadísticas por tipo
  // const typeStats = filteredNotifications.reduce((acc, notif) => {
  //   acc[notif.type] = (acc[notif.type] || 0) + 1;
  //   return acc;
  // }, {});

  // Gráfico de barras simple para prioridades
  const PriorityChart = () => {
    const maxValue = Math.max(stats.highPriority, stats.mediumPriority, stats.lowPriority);
    
    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">Alta</span>
          <span className="text-sm text-gray-600">{stats.highPriority}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-red-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${maxValue > 0 ? (stats.highPriority / maxValue) * 100 : 0}%` }}
          />
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">Media</span>
          <span className="text-sm text-gray-600">{stats.mediumPriority}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-yellow-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${maxValue > 0 ? (stats.mediumPriority / maxValue) * 100 : 0}%` }}
          />
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">Baja</span>
          <span className="text-sm text-gray-600">{stats.lowPriority}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${maxValue > 0 ? (stats.lowPriority / maxValue) * 100 : 0}%` }}
          />
        </div>
      </div>
    );
  };

  // Gráfico de dona para categorías
  const CategoryChart = () => {
    const categories = Object.keys(categoryStats);
    const total = Object.values(categoryStats).reduce((sum, val) => sum + val, 0);
    
    if (total === 0) {
      return (
        <div className="text-center text-gray-500 py-8">
          <ChartBarIcon className="h-12 w-12 mx-auto text-gray-300 mb-2" />
          <p>No hay datos para mostrar</p>
        </div>
      );
    }

    return (
      <div className="space-y-3">
        {categories.map((category) => {
          const percentage = ((categoryStats[category] / total) * 100).toFixed(1);
          const getCategoryColor = (cat) => {
            switch (cat) {
              case 'security': return 'bg-red-500';
              case 'maintenance': return 'bg-yellow-500';
              case 'announcement': return 'bg-blue-500';
              case 'emergency': return 'bg-purple-500';
              default: return 'bg-gray-500';
            }
          };
          
          return (
            <div key={category} className="flex items-center space-x-3">
              <div className={`w-4 h-4 rounded-full ${getCategoryColor(category)}`} />
              <span className="text-sm font-medium text-gray-700 capitalize">
                {category}
              </span>
              <span className="text-sm text-gray-600 ml-auto">
                {categoryStats[category]} ({percentage}%)
              </span>
            </div>
          );
        })}
      </div>
    );
  };

  // Actividad reciente
  const RecentActivity = () => {
    const recentNotifications = filteredNotifications
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, 10);

    if (recentNotifications.length === 0) {
      return (
        <div className="text-center text-gray-500 py-8">
          <ClockIcon className="h-12 w-12 mx-auto text-gray-300 mb-2" />
          <p>No hay actividad reciente</p>
        </div>
      );
    }

    return (
      <div className="space-y-3">
        {recentNotifications.map((notif) => (
          <div key={notif.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
            <div className={`w-2 h-2 rounded-full mt-2 ${
              notif.priority === 'high' ? 'bg-red-500' :
              notif.priority === 'medium' ? 'bg-yellow-500' : 'bg-blue-500'
            }`} />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {notif.title}
              </p>
              <p className="text-xs text-gray-500">
                {new Date(notif.timestamp).toLocaleString()}
              </p>
            </div>
            <div className="flex items-center space-x-1">
              {notif.isRead ? (
                <CheckCircleIcon className="h-4 w-4 text-green-500" />
              ) : (
                <XCircleIcon className="h-4 w-4 text-red-500" />
              )}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <ChartBarIcon className="h-8 w-8 text-blue-600" />
            <div>
              <h3 className="text-xl font-semibold text-gray-900">
                Dashboard de Eventos
              </h3>
              <p className="text-sm text-gray-600">
                Análisis y estadísticas de notificaciones del sistema
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="1h">Última hora</option>
              <option value="24h">Últimas 24h</option>
              <option value="7d">Últimos 7 días</option>
              <option value="30d">Últimos 30 días</option>
            </select>
            
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Todas las categorías</option>
              <option value="security">Seguridad</option>
              <option value="maintenance">Mantenimiento</option>
              <option value="announcement">Anuncios</option>
              <option value="emergency">Emergencias</option>
              <option value="general">General</option>
            </select>
          </div>
        </div>

        {/* Estadísticas principales */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <div className="flex items-center space-x-2">
              <ExclamationTriangleIcon className="h-6 w-6 text-blue-600" />
              <div>
                <p className="text-2xl font-bold text-blue-900">{stats.total}</p>
                <p className="text-sm text-blue-700">Total</p>
              </div>
            </div>
          </div>
          
          <div className="bg-red-50 p-4 rounded-lg border border-red-200">
            <div className="flex items-center space-x-2">
              <ExclamationTriangleIcon className="h-6 w-6 text-red-600" />
              <div>
                <p className="text-2xl font-bold text-red-900">{stats.unread}</p>
                <p className="text-sm text-red-700">Sin leer</p>
              </div>
            </div>
          </div>
          
          <div className="bg-red-50 p-4 rounded-lg border border-red-200">
            <div className="flex items-center space-x-2">
              <ExclamationTriangleIcon className="h-6 w-6 text-red-600" />
              <div>
                <p className="text-2xl font-bold text-red-900">{stats.highPriority}</p>
                <p className="text-sm text-red-700">Alta prioridad</p>
              </div>
            </div>
          </div>
          
          <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
            <div className="flex items-center space-x-2">
              <ExclamationTriangleIcon className="h-6 w-6 text-yellow-600" />
              <div>
                <p className="text-2xl font-bold text-yellow-900">{stats.mediumPriority}</p>
                <p className="text-sm text-yellow-700">Media prioridad</p>
              </div>
            </div>
          </div>
          
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <div className="flex items-center space-x-2">
              <ExclamationTriangleIcon className="h-6 w-6 text-blue-600" />
              <div>
                <p className="text-2xl font-bold text-blue-900">{stats.lowPriority}</p>
                <p className="text-sm text-blue-700">Baja prioridad</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Gráficos y análisis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico de prioridades */}
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">
            Distribución por Prioridad
          </h4>
          <PriorityChart />
        </div>

        {/* Gráfico de categorías */}
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">
            Distribución por Categoría
          </h4>
          <CategoryChart />
        </div>
      </div>

      {/* Actividad reciente */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
        <div className="flex items-center space-x-3 mb-4">
          <ClockIcon className="h-6 w-6 text-blue-600" />
          <h4 className="text-lg font-semibold text-gray-900">
            Actividad Reciente
          </h4>
        </div>
        <RecentActivity />
      </div>
    </div>
  );
};

export default EventDashboard;
