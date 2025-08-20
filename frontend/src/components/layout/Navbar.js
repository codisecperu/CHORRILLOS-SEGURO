import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import NotificationBell from '../notifications/NotificationBell';
import { 
  Bars3Icon, 
  XMarkIcon, 
  UserCircleIcon,
  ChevronDownIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user, logout, isAdmin, isAuthorized } = useAuth();

    const navigation = [
    { name: 'Empadronar Cámaras', href: '/empadronamiento-camaras', public: true },
    { name: 'Empadronar Vigilantes', href: '/empadronamiento-vigilantes', public: true },
    { name: 'Mapa Interactivo', href: '/mapa-interactivo', public: false, role: 'authorized' },
    { name: 'Sistema de Notificaciones', href: '/sistema-notificaciones', public: false, role: 'authorized' },
    { name: 'Centro de Ayuda', href: '/centro-ayuda', public: true },
    { name: 'Panel Admin', href: '/panel-admin', public: false, role: 'admin' },
  ];

  const isActiveRoute = (href) => {
    if (href === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(href);
  };

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
    navigate('/');
  };

  const filteredNavigation = navigation.filter(item => {
    if (item.public) return true;
    if (!isAuthenticated) return false;
    if (item.role === 'admin') return isAdmin();
    if (item.role === 'authorized') return isAuthorized() || isAdmin();
    return true;
  });

  return (
    <nav className="bg-gray-800 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo y nombre */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="flex items-center">
              <div className="h-8 w-8 bg-gradient-to-r from-blue-500 to-blue-700 rounded-lg flex items-center justify-center">
                <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <span className="ml-3 text-base sm:text-lg md:text-xl font-bold text-white font-poppins">
                Chorrillos Seguro
              </span>
            </Link>
          </div>

          {/* Navegación y menú de usuario agrupados */}
          <div className="hidden md:flex items-center flex-shrink min-w-0">
            {/* Navegación desktop */}
            <nav className="flex items-center space-x-4 flex-shrink min-w-0">
              {filteredNavigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActiveRoute(item.href)
                      ? 'text-white bg-gray-900'
                      : 'text-gray-300 hover:text-white hover:bg-gray-700'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </nav>

            {/* Menú de usuario y botones de acción */}
            <div className="ml-4 flex items-center space-x-4">
              {/* Campana de notificaciones */}
              {isAuthenticated && <NotificationBell />}
              
              {isAuthenticated ? (
                <div className="relative">
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:text-white"
                  >
                    <UserCircleIcon className="h-6 w-6" />
                    <span>{user?.name || 'Usuario'}</span>
                    <ChevronDownIcon className="h-4 w-4" />
                  </button>

                  {/* Dropdown del usuario */}
                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                        <p className="text-xs text-gray-500">{user?.email}</p>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mt-1 ${
                          user?.role === 'admin' ? 'bg-red-100 text-red-800' :
                          user?.role === 'authorized' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {user?.role === 'admin' ? 'Administrador' :
                           user?.role === 'authorized' ? 'Autorizado' : 'Público'}
                        </span>
                      </div>
                      
                      <Link
                        to="/perfil"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <UserCircleIcon className="h-4 w-4 mr-2" />
                        Mi Perfil
                      </Link>
                      
                      {isAdmin() && (
                        <Link
                          to="/panel-admin"
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <Cog6ToothIcon className="h-4 w-4 mr-2" />
                          Panel Admin
                        </Link>
                      )}
                      
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                      >
                        <ArrowRightOnRectangleIcon className="h-4 w-4 mr-2" />
                        Cerrar Sesión
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <Link
                    to="/login"
                    className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white"
                  >
                    Iniciar Sesión
                  </Link>
                  <Link
                    to="/register"
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
                  >
                    Registrarse
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Botón móvil */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
            >
              <span className="sr-only">Abrir menú principal</span>
              {isOpen ? (
                <XMarkIcon className="block h-6 w-6" />
              ) : (
                <Bars3Icon className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Menú móvil */}
      <div className={`md:hidden ${isOpen ? 'block' : 'hidden'}`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-gray-50 border-t border-gray-200">
          {filteredNavigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                isActiveRoute(item.href)
                  ? 'text-blue-600 bg-blue-100'
                  : 'text-gray-700 hover:text-blue-600 hover:bg-blue-100'
              }`}
              onClick={() => setIsOpen(false)}
            >
              {item.name}
            </Link>
          ))}
          
          {/* Separador */}
          <div className="border-t border-gray-200 pt-4 mt-4">
            {isAuthenticated ? (
              <div className="space-y-2">
                <div className="px-3 py-2">
                  <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                  <p className="text-xs text-gray-500">{user?.email}</p>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mt-1 ${
                    user?.role === 'admin' ? 'bg-red-100 text-red-800' :
                    user?.role === 'authorized' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {user?.role === 'admin' ? 'Administrador' :
                     user?.role === 'authorized' ? 'Autorizado' : 'Público'}
                  </span>
                </div>
                
                <Link
                  to="/perfil"
                  className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-100 rounded-md transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Mi Perfil
                </Link>
                
                {isAdmin() && (
                  <Link
                    to="/panel-admin"
                    className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-100 rounded-md transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    Panel Admin
                  </Link>
                )}
                
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-100 rounded-md transition-colors"
                >
                  Cerrar Sesión
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <Link
                  to="/login"
                  className="block px-3 py-2 text-base font-medium text-blue-600 hover:text-blue-700 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Iniciar Sesión
                </Link>
                <Link
                  to="/register"
                  className="block px-3 py-2 text-base font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Registrarse
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
