import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-chorrillos-dark text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Información institucional */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-chorrillos-gold rounded-full flex items-center justify-center mr-3">
                <span className="text-chorrillos-dark font-bold text-sm">CS</span>
              </div>
              <h3 className="text-xl font-bold">Chorrillos Seguro</h3>
            </div>
            <p className="text-gray-300 mb-4">
              Plataforma de empadronamiento de cámaras y vigilantes vecinales para 
              fortalecer la seguridad ciudadana en el distrito de Chorrillos.
            </p>
            <p className="text-sm text-gray-400">
              Municipalidad de Chorrillos - CODISEC
            </p>
          </div>

          {/* Enlaces rápidos */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-chorrillos-gold">Enlaces Rápidos</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/empadronamiento-camaras" className="text-gray-300 hover:text-white transition-colors">
                  Empadronar Cámaras
                </Link>
              </li>
              <li>
                <Link to="/empadronamiento-vigilantes" className="text-gray-300 hover:text-white transition-colors">
                  Empadronar Vigilantes
                </Link>
              </li>
              <li>
                <Link to="/mapa" className="text-gray-300 hover:text-white transition-colors">
                  Mapa Interactivo
                </Link>
              </li>
              <li>
                <Link to="/centro-ayuda" className="text-gray-300 hover:text-white transition-colors">
                  Centro de Ayuda
                </Link>
              </li>
            </ul>
          </div>

          {/* Contacto */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-chorrillos-gold">Contacto</h4>
            <div className="space-y-2 text-sm text-gray-300">
              <p>📍 Av. Defensores del Morro 100</p>
              <p>📞 (01) 254-0000</p>
              <p>📧 info@chorrillos.gob.pe</p>
              <p>🌐 www.chorrillos.gob.pe</p>
            </div>
          </div>
        </div>

        {/* Línea divisoria */}
        <div className="border-t border-gray-700 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2025 Municipalidad de Chorrillos. Todos los derechos reservados.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                Política de Privacidad
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                Términos de Uso
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                Accesibilidad
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
