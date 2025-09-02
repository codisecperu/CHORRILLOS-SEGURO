import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../supabaseClient';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { 
  ChartBarIcon, 
  UsersIcon, 
  CameraIcon, 
  ShieldCheckIcon,
  DocumentArrowDownIcon,
  FunnelIcon,
  CheckIcon,
  XMarkIcon,
  EyeIcon
} from '@heroicons/react/24/outline';
import RegistroModal from './RegistroModal';

const PanelAdmin = () => {
  const [tabActiva, setTabActiva] = useState('dashboard');
  const [registros, setRegistros] = useState([]);
  const [solicitudes, setSolicitudes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRegistro, setSelectedRegistro] = useState(null);
  const [filtroSector, setFiltroSector] = useState('todos');
  const [filtroTipoCamara, setFiltroTipoCamara] = useState('todos');
  const [filtroEstado, setFiltroEstado] = useState('pendiente');
  const [filtrosExportacion, setFiltrosExportacion] = useState({
    tipo: 'todos',
    sector: 'todos',
    estado: 'todos',
    fechaDesde: '',
    fechaHasta: ''
  });

  const [estadisticas, setEstadisticas] = useState({
    totalCamaras: 0,
    totalVigilantes: 0,
    camarasActivas: 0,
    camarasPendientes: 0,
    incidenciasMes: 0,
    coberturaSectores: {}
  });

  const navigate = useNavigate();

  const fetchData = useCallback(async () => {
    setIsLoading(true);

    // Fetch all cameras and vigilantes for statistics
    const { data: allCameras, error: allCamerasError } = await supabase.from('camaras').select('id, estado, sector');
    const { data: allVigilantes, error: allVigilantesError } = await supabase.from('vigilantes').select('id, estado');

    if (allCamerasError) console.error('Error fetching all cameras:', allCamerasError);
    if (allVigilantesError) console.error('Error fetching all vigilantes:', allVigilantesError);

    const sectors = {
      'CENTRO': 0,
      'VILLA': 0,
      'SAN GENARO': 0,
      'MATEO PUMACAHUA': 0
    };

    if (allCameras) {
      allCameras.forEach(camera => {
        if (sectors[camera.sector.toUpperCase()] !== undefined) {
          sectors[camera.sector.toUpperCase()]++;
        }
      });
    }

    setEstadisticas({
      totalCamaras: allCameras ? allCameras.length : 0,
      totalVigilantes: allVigilantes ? allVigilantes.length : 0,
      camarasActivas: allCameras ? allCameras.filter(c => c.estado === 'aprobado').length : 0,
      camarasPendientes: allCameras ? allCameras.filter(c => c.estado === 'pendiente').length : 0,
      incidenciasMes: 0, // Placeholder
      coberturaSectores: sectors
    });

    // Fetch filtered data for the table
    let camarasQuery = supabase.from('camaras').select('*');
    if (filtroSector !== 'todos') camarasQuery = camarasQuery.eq('sector', filtroSector);
    if (filtroTipoCamara !== 'todos') camarasQuery = camarasQuery.eq('tipo_camara', filtroTipoCamara);
    if (filtroEstado !== 'todos') camarasQuery = camarasQuery.eq('estado', filtroEstado);
    
    const { data: cameras, error: camerasError } = await camarasQuery;

    let vigilantesQuery = supabase.from('vigilantes').select('*');
    if (filtroSector !== 'todos') vigilantesQuery = vigilantesQuery.eq('sector', filtroSector);
    if (filtroEstado !== 'todos') vigilantesQuery = vigilantesQuery.eq('estado', filtroEstado);

    const { data: vigilantes, error: vigilantesError } = await vigilantesQuery;

    if (camerasError) console.error('Error fetching filtered cameras:', camerasError);
    if (vigilantesError) console.error('Error fetching filtered vigilantes:', vigilantesError);

    const pendingCameras = cameras ? cameras.map(camera => ({...camera, tipo: 'camara'})) : [];
    const pendingVigilantes = vigilantes ? vigilantes.map(vigilante => ({
      ...vigilante, 
      tipo: 'vigilante',
      nombre_propietario: `${vigilante.nombre} ${vigilante.apellidos}`
    })) : [];

    const allRegistrations = [...pendingCameras, ...pendingVigilantes]
      .sort((a, b) => new Date(b.fecha_registro) - new Date(a.fecha_registro));
      
    setRegistros(allRegistrations);
    setIsLoading(false);
  }, [filtroSector, filtroTipoCamara, filtroEstado]);

  const fetchSolicitudes = async () => {
    try {
      const response = await fetch('/.netlify/functions/solicitudesImagenes');
      if (!response.ok) {
        throw new Error('Error fetching solicitudes');
      }
      const data = await response.json();
      setSolicitudes(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData();
    if (tabActiva === 'solicitudes') {
      fetchSolicitudes();
    }
  }, [fetchData, tabActiva]);

  const handleApprove = async (id, tipo) => {
    const tableName = tipo === 'camara' ? 'camaras' : 'vigilantes';
    const { error } = await supabase
      .from(tableName)
      .update({ estado: 'aprobado' })
      .eq('id', id);

    if (error) {
      console.error('Error approving registration:', error);
    } else {
      fetchData(); // Refresh the list
    }
  };

  const handleReject = async (id, tipo) => {
    const tableName = tipo === 'camara' ? 'camaras' : 'vigilantes';
    const { error } = await supabase
      .from(tableName)
      .update({ estado: 'rechazado' })
      .eq('id', id);

    if (error) {
      console.error('Error rejecting registration:', error);
    } else {
      fetchData(); // Refresh the list
    }
  };

  const handleView = (registro) => {
    setSelectedRegistro(registro);
  };

  const handleCloseModal = () => {
    setSelectedRegistro(null);
  };

  const handleExport = async (format) => {
    let query = supabase.from('camaras').select('*');

    if (filtrosExportacion.tipo !== 'todos') {
      query = query.eq('tipo_camara', filtrosExportacion.tipo);
    }

    if (filtrosExportacion.sector !== 'todos') {
      query = query.eq('sector', filtrosExportacion.sector);
    }

    if (filtrosExportacion.estado !== 'todos') {
      query = query.eq('estado', filtrosExportacion.estado);
    }

    if (filtrosExportacion.fechaDesde) {
      query = query.gte('fecha_registro', filtrosExportacion.fechaDesde);
    }

    if (filtrosExportacion.fechaHasta) {
      query = query.lte('fecha_registro', filtrosExportacion.fechaHasta);
    }

    const { data: cameras, error } = await query;

    if (error) {
      console.error(`Error fetching data for ${format} export:`, error);
      return;
    }

    if (format === 'pdf') {
      const doc = new jsPDF();
      doc.autoTable({
        head: [['ID', 'Propietario', 'Tipo', 'Dirección', 'Sector', 'Estado']],
        body: cameras.map(camera => [
          camera.id,
          camera.nombre_propietario,
          camera.tipo_camara,
          camera.direccion,
          camera.sector,
          camera.estado
        ]),
      });
      doc.save('camaras.pdf');
    } else {
      let content = '';
      let mimeType = '';
      let fileExtension = '';

      if (format === 'kml') {
        content = `<?xml version="1.0" encoding="UTF-8"?>
<kml xmlns="http://www.opengis.net/kml/2.2">
  <Document>
    ${cameras.map(camera => `
      <Placemark>
        <name>${camera.nombre_propietario}</name>
        <description>
          <![CDATA[
            <b>Tipo de Cámara:</b> ${camera.tipo_camara}<br/>
            <b>Dirección:</b> ${camera.direccion}<br/>
            <b>Sector:</b> ${camera.sector}<br/>
            <b>Estado:</b> ${camera.estado}
          ]]>
        </description>
        <Point>
          <coordinates>${camera.lng},${camera.lat},0</coordinates>
        </Point>
      </Placemark>
    `).join('')}
  </Document>
</kml>`;
        mimeType = 'application/vnd.google-earth.kml+xml';
        fileExtension = 'kml';
      } else if (format === 'excel') {
        // Basic CSV implementation for Excel
        const header = Object.keys(cameras[0]).join(',') + '\n';
        const body = cameras.map(camera => Object.values(camera).join(',')).join('\n');
        content = header + body;
        mimeType = 'text/csv';
        fileExtension = 'csv';
      }

      const blob = new Blob([content], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `camaras.${fileExtension}`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  const handleApproveSolicitud = async (id) => {
    try {
      await fetch('/.netlify/functions/solicitudesImagenes', {
        method: 'PUT',
        body: JSON.stringify({ id, estado: 'aprobada' })
      });
      fetchSolicitudes();
    } catch (error) {
      console.error(error);
    }
  };

  const handleRejectSolicitud = async (id) => {
    try {
      await fetch('/.netlify/functions/solicitudesImagenes', {
        method: 'PUT',
        body: JSON.stringify({ id, estado: 'rechazada' })
      });
      fetchSolicitudes();
    } catch (error) {
      console.error(error);
    }
  };

  const tabs = [
    { id: 'dashboard', nombre: 'Dashboard', icono: ChartBarIcon },
    { id: 'registros', nombre: 'Registros Pendientes', icono: UsersIcon },
    { id: 'solicitudes', nombre: 'Solicitudes de Imágenes', icono: CameraIcon },
    { id: 'exportacion', nombre: 'Exportación KML', icono: DocumentArrowDownIcon }
  ];

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Tarjetas de estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card text-center">
          <div className="flex justify-center mb-3">
            <div className="w-12 h-12 bg-chorrillos-blue rounded-full flex items-center justify-center">
              <CameraIcon className="h-6 w-6 text-white" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">{estadisticas.totalCamaras}</h3>
          <p className="text-gray-600">Total de Cámaras</p>
          <div className="mt-3">
            <button onClick={() => setTabActiva('registros')} className="btn-primary text-sm">Ver Cámaras</button>
          </div>
        </div>

        <div className="card text-center">
          <div className="flex justify-center mb-3">
            <div className="w-12 h-12 bg-chorrillos-gold rounded-full flex items-center justify-center">
              <ShieldCheckIcon className="h-6 w-6 text-chorrillos-dark" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">{estadisticas.totalVigilantes}</h3>
          <p className="text-gray-600">Total de Vigilantes</p>
          <div className="mt-3">
            <button onClick={() => setTabActiva('registros')} className="btn-primary text-sm">Ver Vigilantes</button>
          </div>
        </div>

        <div className="card text-center">
          <div className="flex justify-center mb-3">
            <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
              <CheckIcon className="h-6 w-6 text-white" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">{estadisticas.camarasActivas}</h3>
          <p className="text-gray-600">Cámaras Activas</p>
        </div>

        <div className="card text-center">
          <div className="flex justify-center mb-3">
            <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center">
              <XMarkIcon className="h-6 w-6 text-white" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">{estadisticas.incidenciasMes}</h3>
          <p className="text-gray-600">Incidencias del Mes</p>
        </div>
      </div>

      {/* Gráfico de cobertura por sectores */}
      <div className="card">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Cobertura por Sectores</h3>
        <div className="space-y-3">
          {Object.entries(estadisticas.coberturaSectores).map(([sector, cantidad]) => (
            <div key={sector} className="flex items-center justify-between">
              <span className="capitalize font-medium">{sector}</span>
              <div className="flex items-center">
                <div className="w-32 bg-gray-200 rounded-full h-2 mr-3">
                  <div
                    className="bg-chorrillos-blue h-2 rounded-full"
                    style={{ width: `${(cantidad / Math.max(...Object.values(estadisticas.coberturaSectores))) * 100}%` }}
                  ></div>
                </div>
                <span className="text-sm font-medium text-gray-600 w-8">{cantidad}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Actividad reciente */}
      <div className="card">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Actividad Reciente</h3>
        <div className="space-y-3">
          <div className="flex items-center p-3 bg-gray-50 rounded-lg">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
            <span className="text-sm text-gray-600">Nueva cámara registrada en sector Centro</span>
            <span className="text-xs text-gray-500 ml-auto">Hace 2 horas</span>
          </div>
          <div className="flex items-center p-3 bg-gray-50 rounded-lg">
            <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
            <span className="text-sm text-gray-600">Vigilante vecinal aprobado en sector Playa</span>
            <span className="text-xs text-gray-500 ml-auto">Hace 4 horas</span>
          </div>
          <div className="flex items-center p-3 bg-gray-50 rounded-lg">
            <div className="w-2 h-2 bg-yellow-500 rounded-full mr-3"></div>
            <span className="text-sm text-gray-600">Solicitud de imágenes pendiente de revisión</span>
            <span className="text-xs text-gray-500 ml-auto">Hace 6 horas</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderRegistrosPendientes = () => (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-900">Registros Pendientes de Validación</h3>
        <div className="flex items-center space-x-4">
          <select value={filtroSector} onChange={(e) => setFiltroSector(e.target.value)} className="form-input">
            <option value="todos">Todos los sectores</option>
            <option value="VILLA">VILLA</option>
            <option value="CENTRO">CENTRO</option>
            <option value="SAN GENARO">SAN GENARO</option>
            <option value="MATEO PUMACAHUA">MATEO PUMACAHUA</option>
          </select>
          <select value={filtroTipoCamara} onChange={(e) => setFiltroTipoCamara(e.target.value)} className="form-input">
            <option value="todos">Todos los tipos</option>
            <option value="domiciliaria">Domiciliaria</option>
            <option value="comercial">Comercial</option>
          </select>
          <select value={filtroEstado} onChange={(e) => setFiltroEstado(e.target.value)} className="form-input">
            <option value="todos">Todos los estados</option>
            <option value="pendiente">Pendiente</option>
            <option value="aprobado">Aprobado</option>
            <option value="rechazado">Rechazado</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tipo
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nombre/Descripción
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Propietario/Organización
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fecha de Registro
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {isLoading ? (
              <tr><td colSpan="5" className="text-center py-4">Cargando...</td></tr>
            ) : registros.map((registro) => (
              <tr key={registro.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    {registro.tipo === 'camara' ? (
                      <CameraIcon className="h-5 w-5 text-chorrillos-blue mr-2" />
                    ) : (
                      <ShieldCheckIcon className="h-5 w-5 text-chorrillos-gold mr-2" />
                    )}
                    <span className="capitalize">{registro.tipo}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {registro.direccion || registro.nombre}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {registro.nombre_propietario || registro.organizacion}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(registro.fecha_registro).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <button className="text-chorrillos-blue hover:text-chorrillos-dark" onClick={() => handleView(registro)}>
                      <EyeIcon className="h-4 w-4" />
                    </button>
                    <button className="text-green-600 hover:text-green-900" onClick={() => handleApprove(registro.id, registro.tipo)}>
                      <CheckIcon className="h-4 w-4" />
                    </button>
                    <button className="text-red-600 hover:text-red-900" onClick={() => handleReject(registro.id, registro.tipo)}>
                      <XMarkIcon className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderSolicitudesImagenes = () => (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-900">Solicitudes de Imágenes</h3>
        <button className="btn-primary" onClick={() => console.log('Botón de filtros de solicitudes presionado')}> 
          <FunnelIcon className="h-4 w-4 mr-2" />
          Filtros
        </button>
      </div>

      <div className="space-y-4">
        {solicitudes.map((solicitud) => (
          <div key={solicitud.id} className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h4 className="font-medium text-gray-900 mb-2">Cámara ID: {solicitud.camara_id}</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Solicitante ID:</span>
                    <p className="font-medium">{solicitud.solicitante_id}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Fecha de Solicitud:</span>
                    <p className="font-medium">{new Date(solicitud.fecha_solicitud).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Motivo:</span>
                    <p className="font-medium">{solicitud.motivo}</p>
                  </div>
                </div>
              </div>
              <div className="ml-4">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${ 
                  solicitud.estado === 'pendiente' 
                    ? 'bg-yellow-100 text-yellow-800' 
                    : solicitud.estado === 'aprobada'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {solicitud.estado}
                </span>
              </div>
            </div>
            <div className="mt-4 flex space-x-2">
              <button className="btn-primary text-sm" onClick={() => handleApproveSolicitud(solicitud.id)}>
                Aprobar Solicitud
              </button>
              <button className="btn-outline text-sm" onClick={() => handleRejectSolicitud(solicitud.id)}>
                Rechazar
              </button>
              <button className="btn-outline text-sm" onClick={() => console.log('Botón de solicitar más información presionado para la solicitud:', solicitud.id)}>
                Solicitar Más Información
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderExportacionKML = () => (
    <div className="space-y-6">
      {/* Filtros de exportación */}
      <div className="card">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Filtros de Exportación</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="form-label">Tipo de Registro</label>
            <select
              value={filtrosExportacion.tipo}
              onChange={(e) => setFiltrosExportacion(prev => ({ ...prev, tipo: e.target.value }))}
              className="form-input"
            >
              <option value="todos">Todos</option>
              <option value="camara">Solo Cámaras</option>
              <option value="vigilante">Solo Vigilantes</option>
            </select>
          </div>

          <div>
            <label className="form-label">Sector</label>
            <select
              value={filtrosExportacion.sector}
              onChange={(e) => setFiltrosExportacion(prev => ({ ...prev, sector: e.target.value }))}
              className="form-input"
            >
              <option value="todos">Todos los sectores</option>
              <option value="VILLA">VILLA</option>
              <option value="CENTRO">CENTRO</option>
              <option value="SAN GENARO">SAN GENARO</option>
              <option value="MATEO PUMACAHUA">MATEO PUMACAHUA</option>
            </select>
          </div>

          <div>
            <label className="form-label">Estado</label>
            <select
              value={filtrosExportacion.estado}
              onChange={(e) => setFiltrosExportacion(prev => ({ ...prev, estado: e.target.value }))}
              className="form-input"
            >
              <option value="todos">Todos los estados</option>
              <option value="activo">Solo Activos</option>
              <option value="pendiente">Solo Pendientes</option>
              <option value="inactivo">Solo Inactivos</option>
            </select>
          </div>

          <div>
            <label className="form-label">Fecha Desde</label>
            <input
              type="date"
              value={filtrosExportacion.fechaDesde}
              onChange={(e) => setFiltrosExportacion(prev => ({ ...prev, fechaDesde: e.target.value }))}
              className="form-input"
            />
          </div>

          <div>
            <label className="form-label">Fecha Hasta</label>
            <input
              type="date"
              value={filtrosExportacion.fechaHasta}
              onChange={(e) => setFiltrosExportacion(prev => ({ ...prev, fechaHasta: e.target.value }))}
              className="form-input"
            />
          </div>

          <div className="flex items-end">
            <button className="btn-primary w-full" onClick={() => handleExport('kml')}> 
              <FunnelIcon className="h-4 w-4 mr-2" />
              Aplicar Filtros
            </button>
          </div>
        </div>
      </div>

      {/* Opciones de exportación */}
      <div className="card">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Opciones de Exportación</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 border border-gray-200 rounded-lg">
            <DocumentArrowDownIcon className="h-12 w-12 text-chorrillos-blue mx-auto mb-3" />
            <h4 className="font-semibold text-gray-900 mb-2">Exportar KML</h4>
            <p className="text-sm text-gray-600 mb-3">
              Archivo compatible con Google Earth y sistemas SIG
            </p>
            <button className="btn-primary w-full" onClick={() => handleExport('kml')}> 
              Descargar KML
            </button>
          </div>

          <div className="text-center p-4 border border-gray-200 rounded-lg">
            <DocumentArrowDownIcon className="h-12 w-12 text-chorrillos-gold mx-auto mb-3" />
            <h4 className="font-semibold text-gray-900 mb-2">Exportar Excel</h4>
            <p className="text-sm text-gray-600 mb-3">
              Reporte detallado en formato de hoja de cálculo
            </p>
            <button className="btn-secondary w-full" onClick={() => handleExport('excel')}> 
              Descargar Excel
            </button>
          </div>

          <div className="text-center p-4 border border-gray-200 rounded-lg">
            <DocumentArrowDownIcon className="h-12 w-12 text-chorrillos-dark mx-auto mb-3" />
            <h4 className="font-semibold text-gray-900 mb-2">Exportar PDF</h4>
            <p className="text-sm text-gray-600 mb-3">
              Reporte formal para documentación oficial
            </p>
            <button className="btn-outline w-full" onClick={() => handleExport('pdf')}> 
              Descargar PDF
            </button>
          </div>
        </div>
      </div>

      {/* Vista previa de datos */}
      <div className="card">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Vista Previa de Datos a Exportar</h3>
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600">
            <strong>Total de registros:</strong> 245<br />
            <strong>Cámaras:</strong> 156<br />
            <strong>Vigilantes:</strong> 89<br />
            <strong>Formato KML:</strong> Incluye coordenadas, información básica y metadatos
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Panel Administrativo
              </h1>
              <p className="text-lg text-gray-600">
                Gestión y administración de la plataforma Chorrillos Seguro
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">Usuario: Admin</span>
              <button className="btn-outline text-sm" onClick={handleSignOut}>
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navegación por tabs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setTabActiva(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${ 
                  tabActiva === tab.id
                    ? 'border-chorrillos-blue text-chorrillos-blue'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icono className="h-5 w-5 inline mr-2" />
                {tab.nombre}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Contenido de la tab activa */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {tabActiva === 'dashboard' && renderDashboard()}
        {tabActiva === 'registros' && renderRegistrosPendientes()}
        {tabActiva === 'solicitudes' && renderSolicitudesImagenes()}
        {tabActiva === 'exportacion' && renderExportacionKML()}
      </div>

      <RegistroModal registro={selectedRegistro} onClose={handleCloseModal} />
    </div>
  );
};

export default PanelAdmin;