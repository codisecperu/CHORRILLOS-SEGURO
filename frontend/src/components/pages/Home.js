import React from 'react';
import { Link } from 'react-router-dom';
import { 
  CameraIcon, 
  ShieldCheckIcon, 
  MapIcon, 
  QuestionMarkCircleIcon,
  CheckCircleIcon,
  UsersIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';

const Home = () => {
  const beneficios = [
    {
      icon: <ShieldCheckIcon className="h-8 w-8 text-chorrillos-gold" />,
      title: "Mayor Seguridad",
      description: "Fortalecimiento de la seguridad ciudadana mediante la colaboración vecinal"
    },
    {
      icon: <UsersIcon className="h-8 w-8 text-chorrillos-gold" />,
      title: "Comunidad Unida",
      description: "Integración de esfuerzos entre vecinos, comerciantes y autoridades"
    },
    {
      icon: <ChartBarIcon className="h-8 w-8 text-chorrillos-gold" />,
      title: "Datos Confiables",
      description: "Información georreferenciada para una mejor toma de decisiones"
    }
  ];

  const marcoLegal = [
    "Ley N° 27933 - Ley del Sistema Nacional de Seguridad Ciudadana",
    "Decreto Supremo N° 012-2003-IN - Reglamento de la Ley del Sistema Nacional de Seguridad Ciudadana",
    "Ordenanza Municipal N° 123-2024-MDC - Reglamento de Empadronamiento de Cámaras y Vigilantes"
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-chorrillos-blue to-chorrillos-dark text-white">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="w-24 h-24 bg-chorrillos-gold rounded-full flex items-center justify-center">
                <span className="text-chorrillos-dark font-bold text-4xl">CS</span>
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Chorrillos Seguro
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
              Plataforma de empadronamiento de cámaras y vigilantes vecinales para 
              fortalecer la seguridad ciudadana en nuestro distrito
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/empadronar-camaras"
                className="btn-secondary text-lg px-8 py-4 flex items-center justify-center"
              >
                <CameraIcon className="h-6 w-6 mr-2" />
                Empadronar Cámara
              </Link>
              <Link
                to="/empadronar-vigilantes"
                className="btn-outline text-lg px-8 py-4 flex items-center justify-center border-white text-white hover:bg-white hover:text-chorrillos-blue"
              >
                <ShieldCheckIcon className="h-6 w-6 mr-2" />
                Empadronar Vigilante
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-chorrillos-blue rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <MapIcon className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Ver Mapa Interactivo</h3>
              <p className="text-gray-600 mb-4">
                Explora la cobertura de seguridad en tu zona
              </p>
              <Link
                to="/mapa"
                className="btn-primary"
              >
                Acceder al Mapa
              </Link>
            </div>

            <div className="text-center">
              <div className="bg-chorrillos-gold rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <QuestionMarkCircleIcon className="h-8 w-8 text-chorrillos-dark" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Centro de Ayuda</h3>
              <p className="text-gray-600 mb-4">
                Encuentra respuestas y soporte técnico
              </p>
              <Link
                to="/centro-ayuda"
                className="btn-secondary"
              >
                Obtener Ayuda
              </Link>
            </div>

            <div className="text-center">
              <div className="bg-chorrillos-dark rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <ShieldCheckIcon className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Panel Administrativo</h3>
              <p className="text-gray-600 mb-4">
                Acceso para autoridades y personal autorizado
              </p>
              <Link
                to="/admin"
                className="btn-outline border-chorrillos-dark text-chorrillos-dark hover:bg-chorrillos-dark hover:text-white"
              >
                Acceder
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Beneficios Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Beneficios del Sistema
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Nuestra plataforma ofrece múltiples ventajas para la comunidad de Chorrillos
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {beneficios.map((beneficio, index) => (
              <div key={index} className="card text-center">
                <div className="flex justify-center mb-4">
                  {beneficio.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{beneficio.title}</h3>
                <p className="text-gray-600">{beneficio.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Marco Legal Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Marco Legal
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Nuestro sistema se rige por las siguientes normativas vigentes
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <div className="space-y-4">
              {marcoLegal.map((norma, index) => (
                <div key={index} className="flex items-start">
                  <CheckCircleIcon className="h-6 w-6 text-chorrillos-gold mt-1 mr-3 flex-shrink-0" />
                  <p className="text-gray-700">{norma}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-16 bg-chorrillos-blue text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-4">
            ¿Listo para contribuir a la seguridad de Chorrillos?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Únete a nuestra red de seguridad ciudadana. Tu participación hace la diferencia.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/empadronar-camaras"
              className="btn-secondary text-lg px-8 py-4"
            >
              Empadronar mi Cámara
            </Link>
            <Link
              to="/empadronar-vigilantes"
              className="btn-outline text-lg px-8 py-4 border-white text-white hover:bg-white hover:text-chorrillos-blue"
            >
              Registrarme como Vigilante
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
