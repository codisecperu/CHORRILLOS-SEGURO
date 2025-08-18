import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Home from './components/pages/Home';
import EmpadronamientoCamaras from './components/pages/EmpadronamientoCamaras';
import EmpadronamientoVigilantes from './components/pages/EmpadronamientoVigilantes';
import ListCamaras from './components/pages/ListCamaras';
import ListVigilantes from './components/pages/ListVigilantes';
import MapaInteractivo from './components/pages/MapaInteractivo';
import CentroAyuda from './components/pages/CentroAyuda';
import PanelAdmin from './components/pages/PanelAdmin';
import './index.css';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 font-poppins">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/empadronar-camaras" element={<EmpadronamientoCamaras />} />
            <Route path="/empadronar-vigilantes" element={<EmpadronamientoVigilantes />} />
            <Route path="/mapa" element={<MapaInteractivo />} />
            <Route path="/centro-ayuda" element={<CentroAyuda />} />
            <Route path="/admin" element={<PanelAdmin />} />
            <Route path="/admin/camaras" element={<ListCamaras />} />
            <Route path="/admin/vigilantes" element={<ListVigilantes />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
