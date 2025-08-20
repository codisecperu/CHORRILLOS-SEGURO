import React, { useState } from 'react';
import { EnvelopeIcon, PaperAirplaneIcon, UserGroupIcon, DocumentTextIcon } from '@heroicons/react/24/outline';
import { useNotifications } from '../../contexts/NotificationContext';

const EmailNotificationForm = () => {
  const [formData, setFormData] = useState({
    recipients: 'all', // 'all', 'specific', 'role'
    specificEmails: '',
    role: 'authorized',
    subject: '',
    message: '',
    priority: 'low',
    category: 'general',
    includeAttachments: false,
    scheduleSend: false,
    scheduledTime: ''
  });

  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const { sendEmailNotification } = useNotifications();

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess(false);

    try {
      // Validaciones
      if (!formData.subject.trim()) {
        throw new Error('El asunto es obligatorio');
      }
      if (!formData.message.trim()) {
        throw new Error('El mensaje es obligatorio');
      }
      if (formData.recipients === 'specific' && !formData.specificEmails.trim()) {
        throw new Error('Debe especificar al menos un email');
      }

      // Simular envío
      const emails = formData.recipients === 'all' 
        ? ['todos@chorrillos.gob.pe']
        : formData.recipients === 'specific'
        ? formData.specificEmails.split(',').map(email => email.trim())
        : [`${formData.role}@chorrillos.gob.pe`];

      // Enviar a cada email
      for (const email of emails) {
        await sendEmailNotification(email, formData.subject, formData.message);
      }

      setSuccess(true);
      setFormData({
        recipients: 'all',
        specificEmails: '',
        role: 'authorized',
        subject: '',
        message: '',
        priority: 'low',
        category: 'general',
        includeAttachments: false,
        scheduleSend: false,
        scheduledTime: ''
      });

      // Resetear mensaje de éxito después de 3 segundos
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const getRecipientCount = () => {
    switch (formData.recipients) {
      case 'all':
        return 'Todos los usuarios registrados';
      case 'specific':
        return formData.specificEmails ? `${formData.specificEmails.split(',').length} email(s) específico(s)` : 'Ninguno';
      case 'role':
        return `Usuarios con rol: ${formData.role}`;
      default:
        return '';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
      <div className="flex items-center space-x-3 mb-6">
        <EnvelopeIcon className="h-8 w-8 text-blue-600" />
        <div>
          <h3 className="text-xl font-semibold text-gray-900">
            Enviar Notificación por Email
          </h3>
          <p className="text-sm text-gray-600">
            Envía notificaciones a usuarios registrados del sistema
          </p>
        </div>
      </div>

      {/* Mensajes de estado */}
      {success && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center space-x-2 text-green-800">
            <EnvelopeIcon className="h-5 w-5" />
            <span>Notificación enviada exitosamente</span>
          </div>
        </div>
      )}

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center space-x-2 text-red-800">
            {/* ExclamationTriangleIcon is not imported, using a placeholder or removing if not needed */}
            <span>{error}</span>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Destinatarios */}
        <div className="space-y-4">
          <h4 className="font-medium text-gray-900 flex items-center space-x-2">
            <UserGroupIcon className="h-5 w-5 text-blue-600" />
            <span>Destinatarios</span>
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                name="recipients"
                value="all"
                checked={formData.recipients === 'all'}
                onChange={handleInputChange}
                className="text-blue-600"
              />
              <span className="text-sm">Todos los usuarios</span>
            </label>
            
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                name="recipients"
                value="role"
                checked={formData.recipients === 'role'}
                onChange={handleInputChange}
                className="text-blue-600"
              />
              <span className="text-sm">Por rol</span>
            </label>
            
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                name="recipients"
                value="specific"
                checked={formData.recipients === 'specific'}
                onChange={handleInputChange}
                className="text-blue-600"
              />
              <span className="text-sm">Emails específicos</span>
            </label>
          </div>

          {/* Campos condicionales */}
          {formData.recipients === 'role' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Seleccionar rol
              </label>
              <select
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="public">Público</option>
                <option value="authorized">Autorizado</option>
                <option value="admin">Administrador</option>
              </select>
            </div>
          )}

          {formData.recipients === 'specific' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Emails (separados por comas)
              </label>
              <textarea
                name="specificEmails"
                value={formData.specificEmails}
                onChange={handleInputChange}
                placeholder="usuario1@email.com, usuario2@email.com"
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}

          {/* Resumen de destinatarios */}
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Destinatarios:</strong> {getRecipientCount()}
            </p>
          </div>
        </div>

        {/* Contenido del mensaje */}
        <div className="space-y-4">
          <h4 className="font-medium text-gray-900 flex items-center space-x-2">
            <DocumentTextIcon className="h-5 w-5 text-blue-600" />
            <span>Contenido del Mensaje</span>
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Asunto *
              </label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleInputChange}
                placeholder="Asunto de la notificación"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Prioridad
              </label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="low">Baja</option>
                <option value="medium">Media</option>
                <option value="high">Alta</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Categoría
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="general">General</option>
              <option value="security">Seguridad</option>
              <option value="maintenance">Mantenimiento</option>
              <option value="announcement">Anuncio</option>
              <option value="emergency">Emergencia</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mensaje *
            </label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              placeholder="Escribe tu mensaje aquí..."
              rows="6"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Opciones adicionales */}
        <div className="space-y-4">
          <h4 className="font-medium text-gray-900">Opciones Adicionales</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                name="includeAttachments"
                checked={formData.includeAttachments}
                onChange={handleInputChange}
                className="text-blue-600 rounded"
              />
              <span className="text-sm">Incluir archivos adjuntos</span>
            </label>
            
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                name="scheduleSend"
                checked={formData.scheduleSend}
                onChange={handleInputChange}
                className="text-blue-600 rounded"
              />
              <span className="text-sm">Programar envío</span>
            </label>
          </div>

          {formData.scheduleSend && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fecha y hora de envío
              </label>
              <input
                type="datetime-local"
                name="scheduledTime"
                value={formData.scheduledTime}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}
        </div>

        {/* Botones */}
        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={() => setFormData({
              recipients: 'all',
              specificEmails: '',
              role: 'authorized',
              subject: '',
              message: '',
              priority: 'low',
              category: 'general',
              includeAttachments: false,
              scheduleSend: false,
              scheduledTime: ''
            })}
            className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
          >
            Limpiar
          </button>
          
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Enviando...</span>
              </>
            ) : (
              <>
                <PaperAirplaneIcon className="h-4 w-4" />
                <span>Enviar Notificación</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EmailNotificationForm;

