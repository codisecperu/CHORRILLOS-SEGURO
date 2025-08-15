import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navigation = [
    { name: 'Inicio', href: '/' },
    { name: 'Empadronar Cámaras', href: '/empadronar-camaras' },
    { name: 'Empadronar Vigilantes', href: '/empadronar-vigilantes' },
    { name: 'Mapa Interactivo', href: '/mapa' },
    { name: 'Centro de Ayuda', href: '/centro-ayuda' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-chorrillos-blue shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo y nombre */}
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <div className="w-10 h-10 bg-chorrillos-gold rounded-full flex items-center justify-center">
                <span className="text-chorrillos-white font-bold text-lg">CS</span>
              </div>
              <div className="ml-3">
                <h1 className="text-chorrillos-white font-bold text-xl">Chorrillos Seguro</h1>
                <p className="text-chorrillos-white text-xs opacity-90">Municipalidad de Chorrillos</p>
              </div>
            </div>
          </div>

          {/* Navegación desktop */}
          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                  isActive(item.href)
                    ? 'bg-chorrillos-gold text-chorrillos-dark'
                    : 'text-chorrillos-white hover:bg-chorrillos-light-blue hover:text-white'
                }`}
              >
                {item.name}
              </Link>
            ))}
            <Link
              to="/admin"
              className="bg-chorrillos-gold text-chorrillos-dark px-4 py-2 rounded-md text-sm font-medium hover:bg-yellow-600 transition-colors duration-200"
            >
              Panel Admin
            </Link>
          </div>

          {/* Botón móvil */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-chorrillos-white hover:text-gray-300 focus:outline-none focus:text-white"
            >
              {isOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Menú móvil */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-chorrillos-dark">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${
                  isActive(item.href)
                    ? 'bg-chorrillos-gold text-chorrillos-dark'
                    : 'text-chorrillos-white hover:bg-chorrillos-light-blue hover:text-white'
                }`}
                onClick={() => setIsOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <Link
              to="/admin"
              className="block bg-chorrillos-gold text-chorrillos-dark px-3 py-2 rounded-md text-base font-medium hover:bg-yellow-600 transition-colors duration-200"
              onClick={() => setIsOpen(false)}
            >
              Panel Admin
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
