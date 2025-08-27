import React, { useState } from 'react';
import { CameraIcon, MapPinIcon, UserIcon, DevicePhoneMobileIcon, LinkIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { extractCoordinatesFromGoogleMaps, isValidGoogleMapsUrl, getAddressFromCoordinates } from '../../utils/coordinateExtractor';

const EmpadronamientoCamaras = () => {
  const [formData, setFormData] = useState({
    // Datos del propietario
    nombrePropietario: '',
    tipoDocumento: 'DNI',
    numeroDocumento: '',
    telefono: '',
    email: '',
    
    // Datos de la cámara
    tipoCamara: 'domiciliaria',
    modeloCamara: '',
    marcaCamara: '',
    tieneDVR: false,
    zonaVisibilidad: '',
    grabacion: false,
    disposicionCompartir: false,
    
    // Ubicación
    direccion: '',
    coordenadas: {
      lat: '',
      lng: ''
    },
    sector: '',
    
    // Imagen
    imagenReferencial: null
  });

  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [googleMapsUrl, setGoogleMapsUrl] = useState('');
  const [isExtractingCoordinates, setIsExtractingCoordinates] = useState(false);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Limpiar error del campo
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setFormData(prev => ({ ...prev, imagenReferencial: file }));
    }
  };

  // Función para extraer coordenadas desde Google Maps
  const handleExtractCoordinates = async () => {
    if (!googleMapsUrl.trim()) {
      setErrors(prev => ({ ...prev, googleMapsUrl: 'Ingrese un enlace de Google Maps' }));
      return;
    }

    if (!isValidGoogleMapsUrl(googleMapsUrl)) {
      setErrors(prev => ({ ...prev, googleMapsUrl: 'El enlace no es válido de Google Maps' }));
      return;
    }

    setIsExtractingCoordinates(true);
    setErrors(prev => ({ ...prev, googleMapsUrl: '' }));

    try {
      const coordinates = await extractCoordinatesFromGoogleMaps(googleMapsUrl);
      
      if (coordinates) {
        setFormData(prev => ({
          ...prev,
          coordenadas: coordinates
        }));

        // Obtener dirección automáticamente
        const address = await getAddressFromCoordinates(coordinates.lat, coordinates.lng);
        if (address && address !== 'Error al obtener dirección' && address !== 'Dirección no encontrada') {
          setFormData(prev => ({
            ...prev,
            direccion: address
          }));
        }

        // Limpiar el enlace después de extraer
        setGoogleMapsUrl('');
      } else {
        setErrors(prev => ({ ...prev, googleMapsUrl: 'No se pudieron extraer coordenadas del enlace' }));
        // Ensure coordinates are reset to a valid state object
        setFormData(prev => ({
          ...prev,
          coordenadas: { lat: '', lng: '' }
        }));
      }
    } catch (error) {
      setErrors(prev => ({ ...prev, googleMapsUrl: 'Error al procesar el enlace' }));
    } finally {
      setIsExtractingCoordinates(false);
    }
  };

  // Función para limpiar coordenadas
  const handleClearCoordinates = () => {
    setFormData(prev => ({
      ...prev,
      coordenadas: { lat: '', lng: '' }
    }));
  };

  const validateStep = (currentStep) => {
    const newErrors = {};
    
    if (currentStep === 1) {
      if (!formData.nombrePropietario.trim()) newErrors.nombrePropietario = 'El nombre es obligatorio';
      if (!formData.numeroDocumento.trim()) newErrors.numeroDocumento = 'El número de documento es obligatorio';
      if (!formData.telefono.trim()) newErrors.telefono = 'El teléfono es obligatorio';
    }
    
    if (currentStep === 2) {
      if (!formData.tipoCamara) newErrors.tipoCamara = 'Seleccione el tipo de cámara';
      if (!formData.marcaCamara.trim()) newErrors.marcaCamara = 'La marca es obligatoria';
      if (!formData.zonaVisibilidad.trim()) newErrors.zonaVisibilidad = 'Describa la zona de visibilidad';
    }
    
    if (currentStep === 3) {
      if (!formData.direccion.trim()) newErrors.direccion = 'La dirección es obligatoria';
      if (!formData.sector.trim()) newErrors.sector = 'Seleccione el sector';
      if (formData.coordenadas.lat && isNaN(Number(formData.coordenadas.lat))) {
        newErrors.lat = 'La latitud debe ser un número válido';
      }
      if (formData.coordenadas.lng && isNaN(Number(formData.coordenadas.lng))) {
        newErrors.lng = 'La longitud debe ser un número válido';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(step)) {
      setStep(step + 1);
    }
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep(step)) return;
    
    setIsSubmitting(true);
    
    try {
      const data = new FormData();
      for (const key in formData) {
        if (key === 'coordenadas') {
          data.append('lat', formData.coordenadas.lat);
          data.append('lng', formData.coordenadas.lng);
        } else if (key === 'imagenReferencial' && formData.imagenReferencial) {
          data.append(key, formData.imagenReferencial);
        } else {
          data.append(key, formData[key]);
        }
      }

      const response = await fetch('/api/cameras/register', {
        method: 'POST',
        body: data,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al registrar la cámara');
      }

      const result = await response.json();
      console.log('Registro exitoso:', result);
      alert('¡Registro exitoso! Su cámara ha sido empadronada.');
      
    } catch (error) {
      console.error('Error al enviar:', error);
      alert(`Error al enviar el formulario: ${error.message}. Intente nuevamente.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-6">Datos del Propietario</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="form-label">
            <UserIcon className="h-4 w-4 inline mr-2" />
            Nombre Completo *
          </label>
          <input
            type="text"
            name="nombrePropietario"
            value={formData.nombrePropietario}
            onChange={handleInputChange}
            className={`form-input ${errors.nombrePropietario ? 'border-red-500' : ''}`}
            placeholder="Ingrese su nombre completo"
          />
          {errors.nombrePropietario && (
            <p className="text-red-500 text-sm mt-1">{errors.nombrePropietario}</p>
          )}
        </div>

        <div>
          <label className="form-label">Tipo de Documento</label>
          <select
            name="tipoDocumento"
            value={formData.tipoDocumento}
            onChange={handleInputChange}
            className="form-input"
          >
            <option value="DNI">DNI</option>
            <option value="CE">Carné de Extranjería</option>
            <option value="PASAPORTE">Pasaporte</option>
          </select>
        </div>

        <div>
          <label className="form-label">Número de Documento *</label>
          <input
            type="number"
            name="numeroDocumento"
            value={formData.numeroDocumento}
            onChange={handleInputChange}
            className={`form-input ${errors.numeroDocumento ? 'border-red-500' : ''}`}
            placeholder="Ingrese su número de documento"
          />
          {errors.numeroDocumento && (
            <p className="text-red-500 text-sm mt-1">{errors.numeroDocumento}</p>
          )}
        </div>

        <div>
          <label className="form-label">
            <DevicePhoneMobileIcon className="h-4 w-4 inline mr-2" />
            Teléfono *
          </label>
          <input
            type="tel"
            name="telefono"
            value={formData.telefono}
            onChange={handleInputChange}
            className={`form-input ${errors.telefono ? 'border-red-500' : ''}`}
            placeholder="Ingrese su teléfono"
            pattern="[0-9]{9}" // Assuming 9-digit phone number for Peru
          />
          {errors.telefono && (
            <p className="text-red-500 text-sm mt-1">{errors.telefono}</p>
          )}
        </div>

        <div className="md:col-span-2">
          <label className="form-label">Correo Electrónico</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className="form-input"
            placeholder="Ingrese su correo electrónico (opcional)"
          />
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-6">Características de la Cámara</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="form-label">Tipo de Cámara *</label>
          <select
            name="tipoCamara"
            value={formData.tipoCamara}
            onChange={handleInputChange}
            className={`form-input ${errors.tipoCamara ? 'border-red-500' : ''}`}
          >
            <option value="">Seleccione el tipo</option>
            <option value="domiciliaria">Domiciliaria</option>
            <option value="comercial">Comercial</option>
            <option value="industrial">Industrial</option>
            <option value="vehicular">Vehicular</option>
          </select>
          {errors.tipoCamara && (
            <p className="text-red-500 text-sm mt-1">{errors.tipoCamara}</p>
          )}
        </div>

        <div>
          <label className="form-label">Marca *</label>
          <input
            type="text"
            name="marcaCamara"
            value={formData.marcaCamara}
            onChange={handleInputChange}
            className={`form-input ${errors.marcaCamara ? 'border-red-500' : ''}`}
            placeholder="Ej: Hikvision, Dahua, etc."
          />
          {errors.marcaCamara && (
            <p className="text-red-500 text-sm mt-1">{errors.marcaCamara}</p>
          )}
        </div>

        <div>
          <label className="form-label">Modelo</label>
          <input
            type="text"
            name="modeloCamara"
            value={formData.modeloCamara}
            onChange={handleInputChange}
            className="form-input"
            placeholder="Ej: DS-2CD2142FWD-I"
          />
        </div>

        <div>
          <label className="form-label">¿Tiene DVR/NVR?</label>
          <select
            name="tieneDVR"
            value={formData.tieneDVR}
            onChange={handleInputChange}
            className="form-input"
          >
            <option value={false}>No</option>
            <option value={true}>Sí</option>
          </select>
        </div>

        <div className="md:col-span-2">
          <label className="form-label">Zona de Visibilidad *</label>
          <textarea
            name="zonaVisibilidad"
            value={formData.zonaVisibilidad}
            onChange={handleInputChange}
            className={`form-input ${errors.zonaVisibilidad ? 'border-red-500' : ''}`}
            rows="3"
            placeholder="Describa qué área cubre la cámara (ej: entrada principal, estacionamiento, etc.)"
          />
          {errors.zonaVisibilidad && (
            <p className="text-red-500 text-sm mt-1">{errors.zonaVisibilidad}</p>
          )}
        </div>

        <div className="md:col-span-2">
          <div className="space-y-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                name="grabacion"
                checked={formData.grabacion}
                onChange={handleInputChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label className="ml-2 text-sm text-gray-700">
                La cámara graba imágenes/video
              </label>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                name="disposicionCompartir"
                checked={formData.disposicionCompartir}
                onChange={handleInputChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label className="ml-2 text-sm text-gray-700">
                Estoy dispuesto a compartir imágenes cuando sea solicitado por las autoridades
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-6">Ubicación de la Cámara</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <label className="form-label">
            <MapPinIcon className="h-4 w-4 inline mr-2" />
            Dirección Completa *
          </label>
          <input
            type="text"
            name="direccion"
            value={formData.direccion}
            onChange={handleInputChange}
            className={`form-input ${errors.direccion ? 'border-red-500' : ''}`}
            placeholder="Ingrese la dirección completa donde está instalada la cámara"
          />
          {errors.direccion && (
            <p className="text-red-500 text-sm mt-1">{errors.direccion}</p>
          )}
        </div>

        <div>
          <label className="form-label">Sector *</label>
          <select
            name="sector"
            value={formData.sector}
            onChange={handleInputChange}
            className={`form-input ${errors.sector ? 'border-red-500' : ''}`}
          >
            <option value="">Seleccione el sector</option>
            <option value="centro">Centro</option>
            <option value="playa">Playa</option>
            <option value="morro">Morro</option>
            <option value="pampilla">Pampilla</option>
            <option value="villa">Villa</option>
            <option value="chavez">Chavez</option>
            <option value="otros">Otros</option>
          </select>
          {errors.sector && (
            <p className="text-red-500 text-sm mt-1">{errors.sector}</p>
          )}
        </div>

        {/* Campo para enlace de Google Maps */}
        <div className="md:col-span-2">
          <label className="form-label flex items-center">
            <LinkIcon className="h-4 w-4 inline mr-2" />
            Enlace de Google Maps (Opcional)
          </label>
          <div className="flex space-x-2">
            <input
              type="url"
              value={googleMapsUrl}
              onChange={(e) => setGoogleMapsUrl(e.target.value)}
              className={`form-input flex-1 ${errors.googleMapsUrl ? 'border-red-500' : ''}`}
              placeholder="https://maps.google.com/... o https://maps.app.goo.gl/..."
            />
            <button
              type="button"
              onClick={handleExtractCoordinates}
              disabled={isExtractingCoordinates || !googleMapsUrl.trim()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
            >
              {isExtractingCoordinates ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Extrayendo...</span>
                </>
              ) : (
                <>
                  <MagnifyingGlassIcon className="h-4 w-4" />
                  <span>Extraer</span>
                </>
              )}
            </button>
          </div>
          {errors.googleMapsUrl && (
            <p className="text-red-500 text-sm mt-1">{errors.googleMapsUrl}</p>
          )}
          <p className="text-sm text-gray-500 mt-1">
            Pegue un enlace de Google Maps para extraer automáticamente las coordenadas y dirección
          </p>
        </div>

        {/* Coordenadas extraídas */}
        {(formData.coordenadas.lat || formData.coordenadas.lng) && (
          <div className="md:col-span-2 bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-green-800 mb-2">Coordenadas Extraídas</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-xs text-green-600">Latitud:</span>
                    <p className="text-sm font-medium text-green-900">{formData.coordenadas.lat}</p>
                  </div>
                  <div>
                    <span className="text-xs text-green-600">Longitud:</span>
                    <p className="text-sm font-medium text-green-900">{formData.coordenadas.lng}</p>
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={handleClearCoordinates}
                className="text-green-600 hover:text-green-800 text-sm font-medium"
              >
                Limpiar
              </button>
            </div>
          </div>
        )}

        <div>
          <label className="form-label">Latitud</label>
          <input
            type="text"
            name="lat"
            value={formData.coordenadas.lat}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              coordenadas: { ...prev.coordenadas, lat: e.target.value }
            }))}
            className={`form-input ${errors.lat ? 'border-red-500' : ''}`}
            placeholder="Ej: -12.3456"
          />
          {errors.lat && (
            <p className="text-red-500 text-sm mt-1">{errors.lat}</p>
          )}
        </div>

        <div>
          <label className="form-label">Longitud</label>
          <input
            type="text"
            name="lng"
            value={formData.coordenadas.lng}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              coordenadas: { ...prev.coordenadas, lng: e.target.value }
            }))}
            className={`form-input ${errors.lng ? 'border-red-500' : ''}`}
            placeholder="Ej: -76.7890"
          />
          {errors.lng && (
            <p className="text-red-500 text-sm mt-1">{errors.lng}</p>
          )}
        </div>

        <div className="md:col-span-2">
          <label className="form-label">Imagen Referencial</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="form-input"
          />
          {formData.imagenReferencial && (
            <p className="text-sm text-gray-700 mt-1">
              Archivo seleccionado: {formData.imagenReferencial.name}
            </p>
          )}
          <p className="text-sm text-gray-500 mt-1">
            Suba una imagen que muestre la ubicación o vista de la cámara (opcional)
          </p>
        </div>
      </div>
    </div>
  );

  const renderProgressBar = () => (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-700">Paso {step} de 3</span>
        <span className="text-sm text-gray-500">
          {Math.round((step / 3) * 100)}% completado
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-codisec-blue h-2 rounded-full transition-all duration-300"
              style={{ width: `${(step / 3) * 100}%` }}
            ></div>
          </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-screen-md mx-auto px-4 sm:px-6 lg:px-8 lg:max-w-screen-lg">
        {/* Header */}
        <div className="text-center mb-8">
          
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Empadronamiento de Cámaras
          </h1>
          <p className="text-lg text-gray-600">
            Registre su cámara de seguridad para contribuir a la seguridad ciudadana de Chorrillos
          </p>
        </div>

        {/* Formulario */}
        <div className="card">
          <form onSubmit={handleSubmit}>
            {renderProgressBar()}

            {/* Contenido del paso actual */}
            {step === 1 && renderStep1()}
            {step === 2 && renderStep2()}
            {step === 3 && renderStep3()}

            {/* Botones de navegación */}
            <div className="flex justify-between mt-8">
              <button
                type="button"
                onClick={prevStep}
                disabled={step === 1}
                className={`px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed ${
                  step === 1 ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                Anterior
              </button>

              {step < 3 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="btn-primary"
                >
                  Siguiente
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary disabled:opacity-50"
                >
                  {isSubmitting ? 'Enviando...' : 'Enviar Registro'}
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Información adicional */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            Al enviar este formulario, usted acepta que su información será utilizada 
            únicamente para fines de seguridad ciudadana, conforme a la normativa vigente.
          </p>
        </div>
      </div>
    </div>
  );
};

export default EmpadronamientoCamaras;
