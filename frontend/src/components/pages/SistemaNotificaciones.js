import React, { useState } from 'react';
import { 
  BellIcon, 
  EnvelopeIcon, 
  ChartBarIcon, 
  ExclamationTriangleIcon 
} from '@heroicons/react/24/outline';
import RealTimeAlerts from '../notifications/RealTimeAlerts';
import EmailNotificationForm from '../notifications/EmailNotificationForm';
import EventDashboard from '../notifications/EventDashboard';

const SistemaNotificaciones = () => {
  const [activeTab, setActiveTab] = useState('alerts');

  const tabs = [
    {
      id: 'alerts',
      name: 'Alertas en Tiempo Real',
      icon: ExclamationTriangleIcon,
      component: RealTimeAlerts
    },
    {
      id: 'email',
      name: 'Notificaciones por Email',
      icon: EnvelopeIcon,
      component: EmailNotificationForm
    },
    {
      id: 'dashboard',
      name: 'Dashboard de Eventos',
      icon: ChartBarIcon,
      component: EventDashboard
    }
  ];

  const ActiveTabComponent = tabs.find(tab => tab.id === activeTab)?.component;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <BellIcon className="h-8 w-8 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 font-poppins">
                Sistema de Notificaciones
              </h1>
              <p className="text-lg text-gray-600">
                Gestiona alertas, envíos de email y análisis de eventos del sistema
              </p>
            </div>
          </div>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <ExclamationTriangleIcon className="h-5 w-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-medium text-blue-800">
                  Sistema de Notificaciones Activo
                </h3>
                <p className="text-sm text-blue-700 mt-1">
                  El sistema está funcionando correctamente y enviando notificaciones en tiempo real. 
                  Todas las alertas de alta prioridad se muestran automáticamente.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Navegación por pestañas */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6" aria-label="Tabs">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <Icon className="h-5 w-5" />
                      <span>{tab.name}</span>
                    </div>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Contenido de la pestaña activa */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {ActiveTabComponent && <ActiveTabComponent />}
        </div>

        {/* Información adicional */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-green-100 rounded-lg">
                <BellIcon className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                Notificaciones Activas
              </h3>
            </div>
            <p className="text-gray-600 text-sm">
              El sistema mantiene un registro completo de todas las notificaciones, 
              permitiendo seguimiento y análisis detallado de eventos.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <EnvelopeIcon className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                Envío de Emails
              </h3>
            </div>
            <p className="text-gray-600 text-sm">
              Envía notificaciones personalizadas a usuarios específicos, 
              por roles o a toda la base de usuarios registrados.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-purple-100 rounded-lg">
                <ChartBarIcon className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                Análisis y Reportes
              </h3>
            </div>
            <p className="text-gray-600 text-sm">
              Dashboard completo con estadísticas, gráficos y análisis 
              detallado de la actividad del sistema de notificaciones.
            </p>
          </div>
        </div>

        {/* Características del sistema */}
        <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            Características del Sistema
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                <span className="text-sm text-gray-700">
                  <strong>Alertas en tiempo real:</strong> Notificaciones instantáneas para eventos críticos
                </span>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                <span className="text-sm text-gray-700">
                  <strong>Priorización inteligente:</strong> Clasificación automática por urgencia e importancia
                </span>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                <span className="text-sm text-gray-700">
                  <strong>Envio masivo:</strong> Notificaciones a múltiples usuarios simultáneamente
                </span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                <span className="text-sm text-gray-700">
                  <strong>Programación:</strong> Envío programado de notificaciones para momentos específicos
                </span>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                <span className="text-sm text-gray-700">
                  <strong>Seguridad:</strong> Autenticación y autorización para envío de notificaciones
                </span>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                <span className="text-sm text-gray-700">
                  <strong>Historial completo:</strong> Registro detallado de todas las notificaciones enviadas
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SistemaNotificaciones;

