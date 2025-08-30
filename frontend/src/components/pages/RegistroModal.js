import React from 'react';

const RegistroModal = ({ registro, onClose }) => {
  if (!registro) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full" id="my-modal">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="mt-3 text-center">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Detalles del Registro</h3>
          <div className="mt-2 px-7 py-3">
            <p className="text-sm text-gray-500"><strong>ID:</strong> {registro.id}</p>
            <p className="text-sm text-gray-500"><strong>Propietario:</strong> {registro.nombre_propietario}</p>
            <p className="text-sm text-gray-500"><strong>Tipo de Documento:</strong> {registro.tipo_documento}</p>
            <p className="text-sm text-gray-500"><strong>Número de Documento:</strong> {registro.numero_documento}</p>
            <p className="text-sm text-gray-500"><strong>Teléfono:</strong> {registro.telefono}</p>
            <p className="text-sm text-gray-500"><strong>Email:</strong> {registro.email}</p>
            <p className="text-sm text-gray-500"><strong>Tipo de Cámara:</strong> {registro.tipo_camara}</p>
            <p className="text-sm text-gray-500"><strong>Modelo de Cámara:</strong> {registro.modelo_camara}</p>
            <p className="text-sm text-gray-500"><strong>Marca de Cámara:</strong> {registro.marca_camara}</p>
            <p className="text-sm text-gray-500"><strong>Tiene DVR:</strong> {registro.tiene_dvr ? 'Sí' : 'No'}</p>
            <p className="text-sm text-gray-500"><strong>Zona de Visibilidad:</strong> {registro.zona_visibilidad}</p>
            <p className="text-sm text-gray-500"><strong>Grabación:</strong> {registro.grabacion ? 'Sí' : 'No'}</p>
            <p className="text-sm text-gray-500"><strong>Disposición a Compartir:</strong> {registro.disposicion_compartir ? 'Sí' : 'No'}</p>
            <p className="text-sm text-gray-500"><strong>Dirección:</strong> {registro.direccion}</p>
            <p className="text-sm text-gray-500"><strong>Latitud:</strong> {registro.lat}</p>
            <p className="text-sm text-gray-500"><strong>Longitud:</strong> {registro.lng}</p>
            <p className="text-sm text-gray-500"><strong>Sector:</strong> {registro.sector}</p>
            <p className="text-sm text-gray-500"><strong>Fecha de Registro:</strong> {new Date(registro.fecha_registro).toLocaleDateString()}</p>
            <p className="text-sm text-gray-500"><strong>Estado:</strong> {registro.estado}</p>
          </div>
          <div className="items-center px-4 py-3">
            <button
              id="ok-btn"
              className="px-4 py-2 bg-blue-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
              onClick={onClose}
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegistroModal;