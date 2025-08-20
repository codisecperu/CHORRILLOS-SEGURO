import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { NotificationProvider } from './contexts/NotificationContext';
import ProtectedRoute from './components/auth/ProtectedRoute';

// Layout components
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';

// Auth components
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import UserProfile from './components/auth/UserProfile';

// Page components
import Home from './components/pages/Home';
import EmpadronamientoCamaras from './components/pages/EmpadronamientoCamaras';
import EmpadronamientoVigilantes from './components/pages/EmpadronamientoVigilantes';
import MapaInteractivo from './components/pages/MapaInteractivo';
import CentroAyuda from './components/pages/CentroAyuda';
import PanelAdmin from './components/pages/PanelAdmin';
import SistemaNotificaciones from './components/pages/SistemaNotificaciones';

function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <Router>
        <div className="App min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              {/* Rutas públicas */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/centro-ayuda" element={<CentroAyuda />} />
              
              {/* Rutas protegidas - Solo usuarios autenticados */}
              <Route 
                path="/empadronamiento-camaras" 
                element={
                  <ProtectedRoute requiredRole="public">
                    <EmpadronamientoCamaras />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/empadronamiento-vigilantes" 
                element={
                  <ProtectedRoute requiredRole="public">
                    <EmpadronamientoVigilantes />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/perfil" 
                element={
                  <ProtectedRoute requiredRole="public">
                    <UserProfile />
                  </ProtectedRoute>
                } 
              />
              
              {/* Rutas protegidas - Solo usuarios autorizados */}
              <Route 
                path="/mapa-interactivo" 
                element={
                  <ProtectedRoute requiredRole="authorized">
                    <MapaInteractivo />
                  </ProtectedRoute>
                } 
              />
              
              {/* Rutas protegidas - Solo administradores */}
              <Route 
                path="/panel-admin" 
                element={
                  <ProtectedRoute requiredRole="admin">
                    <PanelAdmin />
                  </ProtectedRoute>
                } 
              />
              
              {/* Sistema de Notificaciones - Solo usuarios autorizados y admin */}
              <Route 
                path="/sistema-notificaciones" 
                element={
                  <ProtectedRoute requiredRole="authorized">
                    <SistemaNotificaciones />
                  </ProtectedRoute>
                } 
              />
            </Routes>
          </main>
          <Footer />
        </div>
        </Router>
      </NotificationProvider>
    </AuthProvider>
  );
}

export default App;
