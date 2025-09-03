import React, { useEffect, useState } from 'react';

export default function ListCamaras() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const pageSize = 20;

  const fetchItems = async (p = 0) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/getCameras?limit=${pageSize}&offset=${p * pageSize}`);
      const data = await res.json();
      setItems(data);
      setPage(p);
    } catch (err) {
      console.error(err);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchItems(0); }, []);

  const handleDelete = async (id) => {
    if (!confirm('¿Eliminar registro?')) return;
    try {
      const res = await fetch(`/api/deleteCamera/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Error eliminando');
      // refresh current page
      await fetchItems(page);
    } catch (err) {
      console.error(err);
      alert('No se pudo eliminar');
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold">Cámaras registradas</h2>
        <div className="space-x-2">
          <button onClick={() => fetchItems(Math.max(0, page - 1))} className="btn-outline" disabled={page === 0}>Anterior</button>
          <button onClick={() => fetchItems(page + 1)} className="btn-primary">Siguiente</button>
        </div>
      </div>

      {loading ? (
        <p>Cargando...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="px-4 py-2">ID</th>
                <th className="px-4 py-2">Propietario</th>
                <th className="px-4 py-2">Dirección</th>
                <th className="px-4 py-2">Lat</th>
                <th className="px-4 py-2">Lng</th>
                <th className="px-4 py-2">Imagen</th>
                <th className="px-4 py-2">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {items.map(c => (
                <tr key={c.id} className="border-t">
                  <td className="px-4 py-2">{c.id}</td>
                  <td className="px-4 py-2">{c.nombre_propietario}</td>
                  <td className="px-4 py-2">{c.direccion}</td>
                  <td className="px-4 py-2">{c.lat}</td>
                  <td className="px-4 py-2">{c.lng}</td>
                  <td className="px-4 py-2">
                    {c.imagen_referencial ? (
                      <a href={`http://localhost:5000/${c.imagen_referencial.replace(/^\/+/, '')}`} target="_blank" rel="noreferrer">Ver</a>
                    ) : '—'}
                  </td>
                  <td className="px-4 py-2">
                    <button onClick={() => handleDelete(c.id)} className="text-red-600">Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
