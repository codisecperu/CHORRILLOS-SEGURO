import React, { useState } from 'react';
import { 
  QuestionMarkCircleIcon, 
  DocumentTextIcon, 
  ChatBubbleLeftRightIcon,
  CalendarIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  PhoneIcon,
  EnvelopeIcon,
  GlobeAltIcon
} from '@heroicons/react/24/outline';

const CentroAyuda = () => {
  const [faqAbierta, setFaqAbierta] = useState(null);
  const [categoriaActiva, setCategoriaActiva] = useState('general');

  const faqs = {
    general: [
      {
        pregunta: "¿Qué es Chorrillos Seguro?",
        respuesta: "Chorrillos Seguro es una plataforma de empadronamiento de cámaras de seguridad y vigilantes vecinales que busca fortalecer la seguridad ciudadana en el distrito de Chorrillos mediante la colaboración entre vecinos, comerciantes y autoridades."
      },
      {
        pregunta: "¿Quién puede usar la plataforma?",
        respuesta: "La plataforma está abierta a todos los vecinos y comerciantes del distrito de Chorrillos que deseen registrar sus cámaras de seguridad o registrarse como vigilantes vecinales. También está disponible para autoridades y personal autorizado."
      },
      {
        pregunta: "¿Es obligatorio empadronar mi cámara?",
        respuesta: "No es obligatorio, pero es altamente recomendado ya que contribuye a la seguridad ciudadana y permite que las autoridades puedan contactarlo en caso de necesitar imágenes para investigaciones."
      }
    ],
    camaras: [
      {
        pregunta: "¿Qué tipo de cámaras puedo empadronar?",
        respuesta: "Puede empadronar cualquier tipo de cámara de seguridad: domiciliarias, comerciales, industriales o vehiculares. El sistema acepta tanto cámaras analógicas como digitales."
      },
      {
        pregunta: "¿Necesito tener DVR para empadronar mi cámara?",
        respuesta: "No es obligatorio, pero es recomendable ya que permite almacenar y recuperar imágenes cuando sea necesario. Puede indicar si su cámara graba o no en el formulario."
      },
      {
        pregunta: "¿Qué pasa si cambio mi cámara o me mudo?",
        respuesta: "Puede actualizar su información en cualquier momento usando el código QR que se genera al empadronar, o contactando directamente a la municipalidad."
      }
    ],
    vigilantes: [
      {
        pregunta: "¿Quién puede registrarse como vigilante vecinal?",
        respuesta: "Cualquier vecino mayor de 18 años que desee contribuir a la seguridad de su comunidad puede registrarse como vigilante vecinal, independientemente de su experiencia previa."
      },
      {
        pregunta: "¿Necesito capacitación previa?",
        respuesta: "No es obligatorio, pero es valorado. La municipalidad ofrece capacitaciones gratuitas para vigilantes vecinales. Puede indicar si tiene experiencia previa en el formulario."
      },
      {
        pregunta: "¿Qué responsabilidades tengo como vigilante?",
        respuesta: "Como vigilante vecinal, su principal responsabilidad es estar atento a situaciones sospechosas en su zona asignada y reportar incidentes a las autoridades correspondientes."
      }
    ],
    tecnicos: [
      {
        pregunta: "¿Cómo accedo al mapa interactivo?",
        respuesta: "El mapa interactivo está disponible en la sección 'Mapa Interactivo' del menú principal. Solo usuarios autorizados pueden acceder a información detallada."
      },
      {
        pregunta: "¿Puedo exportar datos del sistema?",
        respuesta: "Sí, las autoridades y personal autorizado pueden exportar datos en formato KML para uso en sistemas de información geográfica, Excel para reportes, o PDF para documentación."
      },
      {
        pregunta: "¿Cómo cambio mi contraseña?",
        respuesta: "Si tiene acceso al panel administrativo, puede cambiar su contraseña desde la sección de perfil de usuario. Si no recuerda su contraseña, contacte al administrador del sistema."
      }
    ]
  };

  const eventos = [
    {
      fecha: "2025-01-25",
      titulo: "Capacitación: Uso de Cámaras de Seguridad",
      descripcion: "Taller gratuito sobre instalación y mantenimiento de cámaras de seguridad",
      horario: "10:00 AM - 12:00 PM",
      lugar: "Auditorio Municipal"
    },
    {
      fecha: "2025-02-01",
      titulo: "Reunión de Vigilantes Vecinales",
      descripcion: "Encuentro mensual para coordinar actividades y compartir experiencias",
      horario: "7:00 PM - 9:00 PM",
      lugar: "Sala de Reuniones CODISEC"
    },
    {
      fecha: "2025-02-08",
      titulo: "Simulacro de Emergencia",
      descripcion: "Ejercicio de coordinación entre vecinos, vigilantes y autoridades",
      horario: "3:00 PM - 5:00 PM",
      lugar: "Plaza Mayor de Chorrillos"
    }
  ];

  const toggleFaq = (index) => {
    setFaqAbierta(faqAbierta === index ? null : index);
  };

    const categorias = [
    { id: 'general', nombre: 'General', Icon: QuestionMarkCircleIcon },
    { id: 'camaras', nombre: 'Cámaras', Icon: DocumentTextIcon },
    { id: 'vigilantes', nombre: 'Vigilantes', Icon: ChatBubbleLeftRightIcon },
    { id: 'tecnicos', nombre: 'Técnicos', Icon: GlobeAltIcon }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-chorrillos-gold rounded-full flex items-center justify-center">
              <QuestionMarkCircleIcon className="h-8 w-8 text-chorrillos-dark" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Centro de Ayuda
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Encuentre respuestas a sus preguntas, descargue manuales y obtenga soporte técnico
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* FAQs */}
          <div className="lg:col-span-2">
            <div className="card">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Preguntas Frecuentes
              </h2>

              {/* Categorías */}
              <div className="flex flex-wrap gap-2 mb-6">
                {categorias.map((categoria) => (
                  <button
                    key={categoria.id}
                    onClick={() => setCategoriaActiva(categoria.id)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      categoriaActiva === categoria.id
                        ? 'bg-chorrillos-blue text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <categoria.Icon className="h-4 w-4 inline mr-2" />
                    {categoria.nombre}
                  </button>
                ))}
              </div>

              {/* Lista de FAQs */}
              <div className="space-y-4">
                {faqs[categoriaActiva].map((faq, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg">
                    <button
                      onClick={() => toggleFaq(index)}
                      className="w-full px-4 py-3 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                    >
                      <span className="font-medium text-gray-900">{faq.pregunta}</span>
                      {faqAbierta === index ? (
                        <ChevronUpIcon className="h-5 w-5 text-gray-500" />
                      ) : (
                        <ChevronDownIcon className="h-5 w-5 text-gray-500" />
                      )}
                    </button>
                    {faqAbierta === index && (
                      <div className="px-4 pb-3">
                        <p className="text-gray-600">{faq.respuesta}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Panel lateral */}
          <div className="space-y-6">
            {/* Manual de Usuario */}
            <div className="card">
              <div className="flex items-center mb-4">
                <DocumentTextIcon className="h-8 w-8 text-chorrillos-blue mr-3" />
                <h3 className="text-xl font-semibold text-gray-900">Manual de Usuario</h3>
              </div>
              <p className="text-gray-600 mb-4">
                Descargue la guía completa de uso de la plataforma Chorrillos Seguro
              </p>
              <button className="btn-primary w-full">
                Descargar Manual (PDF)
              </button>
            </div>

            {/* Chat de Soporte */}
            <div className="card">
              <div className="flex items-center mb-4">
                <ChatBubbleLeftRightIcon className="h-8 w-8 text-chorrillos-gold mr-3" />
                <h3 className="text-xl font-semibold text-gray-900">Chat en Vivo</h3>
              </div>
              <p className="text-gray-600 mb-4">
                Obtenga ayuda inmediata de nuestro equipo de soporte técnico
              </p>
              <button className="btn-secondary w-full">
                Iniciar Chat
              </button>
            </div>

            {/* Contacto Directo */}
            <div className="card">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Contacto Directo</h3>
              <div className="space-y-3">
                <div className="flex items-center">
                  <PhoneIcon className="h-5 w-5 text-chorrillos-blue mr-3" />
                  <span className="text-gray-700">(01) 254-0000</span>
                </div>
                <div className="flex items-center">
                  <EnvelopeIcon className="h-5 w-5 text-chorrillos-blue mr-3" />
                  <span className="text-gray-700">soporte@chorrillos.gob.pe</span>
                </div>
                <div className="flex items-center">
                  <GlobeAltIcon className="h-5 w-5 text-chorrillos-blue mr-3" />
                  <span className="text-gray-700">www.chorrillos.gob.pe</span>
                </div>
              </div>
            </div>

            {/* Calendario de Eventos */}
            <div className="card">
              <div className="flex items-center mb-4">
                <CalendarIcon className="h-8 w-8 text-chorrillos-blue mr-3" />
                <h3 className="text-xl font-semibold text-gray-900">Próximos Eventos</h3>
              </div>
              <div className="space-y-3">
                {eventos.map((evento, index) => (
                  <div key={index} className="border-l-4 border-chorrillos-gold pl-3">
                    <p className="text-sm font-medium text-gray-900">{evento.titulo}</p>
                    <p className="text-xs text-gray-500">{evento.fecha} - {evento.horario}</p>
                    <p className="text-xs text-gray-600">{evento.lugar}</p>
                  </div>
                ))}
              </div>
              <button className="btn-outline w-full mt-4">
                Ver Calendario Completo
              </button>
            </div>
          </div>
        </div>

        {/* Sección de Recursos Adicionales */}
        <div className="mt-12">
          <div className="card">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Recursos Adicionales
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-chorrillos-blue rounded-full flex items-center justify-center mx-auto mb-3">
                  <DocumentTextIcon className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Guías Rápidas</h3>
                <p className="text-sm text-gray-600 mb-3">
                  Tutoriales paso a paso para usar la plataforma
                </p>
                <button className="btn-outline text-sm">Descargar</button>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-chorrillos-gold rounded-full flex items-center justify-center mx-auto mb-3">
                  <QuestionMarkCircleIcon className="h-8 w-8 text-chorrillos-dark" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Base de Conocimientos</h3>
                <p className="text-sm text-gray-600 mb-3">
                  Artículos técnicos y mejores prácticas
                </p>
                <button className="btn-outline text-sm">Explorar</button>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-chorrillos-blue rounded-full flex items-center justify-center mx-auto mb-3">
                  <ChatBubbleLeftRightIcon className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Foro Comunitario</h3>
                <p className="text-sm text-gray-600 mb-3">
                  Conecte con otros usuarios de la plataforma
                </p>
                <button className="btn-outline text-sm">Participar</button>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-chorrillos-gold rounded-full flex items-center justify-center mx-auto mb-3">
                  <CalendarIcon className="h-8 w-8 text-chorrillos-dark" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Capacitaciones</h3>
                <p className="text-sm text-gray-600 mb-3">
                  Cursos y talleres presenciales y virtuales
                </p>
                <button className="btn-outline text-sm">Inscribirse</button>
              </div>
            </div>
          </div>
        </div>

        {/* Información de Soporte */}
        <div className="mt-12 text-center">
          <div className="bg-chorrillos-blue text-white rounded-lg p-8">
            <h2 className="text-2xl font-bold mb-4">
              ¿No encontró lo que buscaba?
            </h2>
            <p className="text-lg mb-6 opacity-90">
              Nuestro equipo de soporte está disponible para ayudarle con cualquier consulta
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="btn-secondary">
                Contactar Soporte
              </button>
              <button className="btn-outline border-white text-white hover:bg-white hover:text-chorrillos-blue">
                Solicitar Llamada
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CentroAyuda;
