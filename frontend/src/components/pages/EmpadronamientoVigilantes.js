import React, { useState } from 'react';
import { ShieldCheckIcon, MapPinIcon, UserIcon, DevicePhoneMobileIcon, ClockIcon, AcademicCapIcon } from '@heroicons/react/24/outline';

const EmpadronamientoVigilantes = () => {
  const [formData, setFormData] = useState({
    // Datos personales
    nombre: '',
    apellidos: '',
    tipoDocumento: 'DNI',
    numeroDocumento: '',
    fechaNacimiento: '',
    telefono: '',
    email: '',
    
    // Información de vigilancia
    organizacion: '',
    horarioVigilancia: '',
    experienciaAnos: '',
    capacitacionPrevia: false,
    tipoCapacitacion: '',
    zonaVigilancia: '',
    
    // Ubicación
    direccion: '',
    coordenadas: {
      lat: '',
      lng: ''
    },
    sector: '',
    
    // Documentos
    foto: null,
    documentos: []
  });

  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleFileChange = (e, field) => {
    const files = Array.from(e.target.files);
    if (field === 'foto') {
      const file = files[0];
      if (file && file.type.startsWith('image/')) {
        setFormData(prev => ({ ...prev, foto: file }));
      }
    } else if (field === 'documentos') {
      setFormData(prev => ({ ...prev, documentos: files }));
    }
  };

  const validateStep = (currentStep) => {
    const newErrors = {};
    
    if (currentStep === 1) {
      if (!formData.nombre.trim()) newErrors.nombre = 'El nombre es obligatorio';
      if (!formData.apellidos.trim()) newErrors.apellidos = 'Los apellidos son obligatorios';
      if (!formData.numeroDocumento.trim()) newErrors.numeroDocumento = 'El número de documento es obligatorio';
      if (!formData.telefono.trim()) newErrors.telefono = 'El teléfono es obligatorio';
      if (!formData.fechaNacimiento) newErrors.fechaNacimiento = 'La fecha de nacimiento es obligatoria';
    }
    
    if (currentStep === 2) {
      if (!formData.organizacion.trim()) newErrors.organizacion = 'La organización es obligatoria';
      if (!formData.horarioVigilancia.trim()) newErrors.horarioVigilancia = 'El horario de vigilancia es obligatorio';
      if (!formData.zonaVigilancia.trim()) newErrors.zonaVigilancia = 'La zona de vigilancia es obligatoria';
    }
    
    if (currentStep === 3) {
      if (!formData.direccion.trim()) newErrors.direccion = 'La dirección es obligatoria';
      if (!formData.sector.trim()) newErrors.sector = 'Seleccione el sector';
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
      console.log('Datos del formulario:', formData);
      await new Promise(resolve => setTimeout(resolve, 2000));
      alert('¡Registro exitoso! Su perfil de vigilante ha sido empadronado.');
    } catch (error) {
      console.error('Error al enviar:', error);
      alert('Error al enviar el formulario. Intente nuevamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-6">Datos Personales</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="form-label">
            <UserIcon className="h-4 w-4 inline mr-2" />
            Nombres *
          </label>
          <input
            type="text"
            name="nombre"
            value={formData.nombre}
            onChange={handleInputChange}
            className={`form-input ${errors.nombre ? 'border-red-500' : ''}`}
            placeholder="Ingrese sus nombres"
          />
          {errors.nombre && (
            <p className="text-red-500 text-sm mt-1">{errors.nombre}</p>
          )}
        </div>

        <div>
          <label className="form-label">Apellidos *</label>
          <input
            type="text"
            name="apellidos"
            value={formData.apellidos}
            onChange={handleInputChange}
            className={`form-input ${errors.apellidos ? 'border-red-500' : ''}`}
            placeholder="Ingrese sus apellidos"
          />
          {errors.apellidos && (
            <p className="text-red-500 text-sm mt-1">{errors.apellidos}</p>
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
            type="text"
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
          <label className="form-label">Fecha de Nacimiento *</label>
          <input
            type="date"
            name="fechaNacimiento"
            value={formData.fechaNacimiento}
            onChange={handleInputChange}
            className={`form-input ${errors.fechaNacimiento ? 'border-red-500' : ''}`}
          />
          {errors.fechaNacimiento && (
            <p className="text-red-500 text-sm mt-1">{errors.fechaNacimiento}</p>
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
      <h3 className="text-xl font-semibold text-gray-900 mb-6">Información de Vigilancia</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="form-label">Organización *</label>
          <select
            name="organizacion"
            value={formData.organizacion}
            onChange={handleInputChange}
            className={`form-input ${errors.organizacion ? 'border-red-500' : ''}`}
          >
            <option value="">Seleccione la organización</option>
            <option value="junta_vecinal">Junta Vecinal</option>
            <option value="comite_seguridad">Comité de Seguridad</option>
            <option value="ronda_vecinal">Ronda Vecinal</option>
            <option value="serenazgo">Serenazgo</option>
            <option value="independiente">Independiente</option>
            <option value="otro">Otro</option>
          </select>
          {errors.organizacion && (
            <p className="text-red-500 text-sm mt-1">{errors.organizacion}</p>
          )}
        </div>

        <div>
          <label className="form-label">
            <ClockIcon className="h-4 w-4 inline mr-2" />
            Horario de Vigilancia *
          </label>
          <select
            name="horarioVigilancia"
            value={formData.horarioVigilancia}
            onChange={handleInputChange}
            className={`form-input ${errors.horarioVigilancia ? 'border-red-500' : ''}`}
          >
            <option value="">Seleccione el horario</option>
            <option value="manana">Mañana (6:00 AM - 2:00 PM)</option>
            <option value="tarde">Tarde (2:00 PM - 10:00 PM)</option>
            <option value="noche">Noche (10:00 PM - 6:00 AM)</option>
            <option value="completo">Completo (24 horas)</option>
            <option value="rotativo">Rotativo</option>
            <option value="otro">Otro</option>
          </select>
          {errors.horarioVigilancia && (
            <p className="text-red-500 text-sm mt-1">{errors.horarioVigilancia}</p>
          )}
        </div>

        <div>
          <label className="form-label">Años de Experiencia</label>
          <select
            name="experienciaAnos"
            value={formData.experienciaAnos}
            onChange={handleInputChange}
            className="form-input"
          >
            <option value="">Seleccione</option>
            <option value="0">Sin experiencia</option>
            <option value="1">1 año</option>
            <option value="2">2 años</option>
            <option value="3">3 años</option>
            <option value="4">4 años</option>
            <option value="5+">5+ años</option>
          </select>
        </div>

        <div>
          <label className="form-label">
            <AcademicCapIcon className="h-4 w-4 inline mr-2" />
            ¿Tiene Capacitación Previa?
          </label>
          <select
            name="capacitacionPrevia"
            value={formData.capacitacionPrevia}
            onChange={handleInputChange}
            className="form-input"
          >
            <option value={false}>No</option>
            <option value={true}>Sí</option>
          </select>
        </div>

        {formData.capacitacionPrevia && (
          <div className="md:col-span-2">
            <label className="form-label">Tipo de Capacitación</label>
            <input
              type="text"
              name="tipoCapacitacion"
              value={formData.tipoCapacitacion}
              onChange={handleInputChange}
              className="form-input"
              placeholder="Describa el tipo de capacitación recibida"
            />
          </div>
        )}

        <div className="md:col-span-2">
          <label className="form-label">Zona de Vigilancia *</label>
          <textarea
            name="zonaVigilancia"
            value={formData.zonaVigilancia}
            onChange={handleInputChange}
            className={`form-input ${errors.zonaVigilancia ? 'border-red-500' : ''}`}
            rows="3"
            placeholder="Describa la zona o área que vigila (ej: cuadra, manzana, sector específico)"
          />
          {errors.zonaVigilancia && (
            <p className="text-red-500 text-sm mt-1">{errors.zonaVigilancia}</p>
          )}
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-6">Ubicación y Documentos</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <label className="form-label">
            <MapPinIcon className="h-4 w-4 inline mr-2" />
            Dirección de Vigilancia *
          </label>
          <input
            type="text"
            name="direccion"
            value={formData.direccion}
            onChange={handleInputChange}
            className={`form-input ${errors.direccion ? 'border-red-500' : ''}`}
            placeholder="Ingrese la dirección donde realiza la vigilancia"
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
            className="form-input"
            placeholder="Ej: -12.3456"
          />
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
            className="form-input"
            placeholder="Ej: -76.7890"
          />
        </div>

        <div>
          <label className="form-label">Foto para Credencial *</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleFileChange(e, 'foto')}
            className="form-input"
          />
          <p className="text-sm text-gray-500 mt-1">
            Foto tipo carnet para su credencial de vigilante
          </p>
        </div>

        <div>
          <label className="form-label">Documentos de Apoyo</label>
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            multiple
            onChange={(e) => handleFileChange(e, 'documentos')}
            className="form-input"
          />
          <p className="text-sm text-gray-500 mt-1">
            Certificados, constancias o documentos que respalden su experiencia
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
          className="bg-chorrillos-blue h-2 rounded-full transition-all duration-300"
          style={{ width: `${(step / 3) * 100}%` }}
        ></div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-chorrillos-gold rounded-full flex items-center justify-center">
              <ShieldCheckIcon className="h-8 w-8 text-chorrillos-dark" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Empadronamiento de Vigilantes
          </h1>
          <p className="text-lg text-gray-600">
            Registre su perfil como vigilante vecinal para contribuir a la seguridad ciudadana de Chorrillos
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

export default EmpadronamientoVigilantes;
