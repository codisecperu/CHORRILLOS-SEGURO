import React, { useEffect, useState } from 'react';

export default function ListVigilantes() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const pageSize = 20;

  const fetchItems = async (p = 0) => {
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:5000/api/vigilantes?limit=${pageSize}&offset=${p * pageSize}`);
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
      const res = await fetch(`http://localhost:5000/api/vigilantes/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Error eliminando');
      await fetchItems(page);
    } catch (err) {
      console.error(err);
      alert('No se pudo eliminar');
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold">Vigilantes registrados</h2>
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
                <th className="px-4 py-2">Nombre</th>
                <th className="px-4 py-2">Organización</th>
                <th className="px-4 py-2">Dirección</th>
                <th className="px-4 py-2">Foto</th>
                <th className="px-4 py-2">Documentos</th>
                <th className="px-4 py-2">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {items.map(v => (
                <tr key={v.id} className="border-t">
                  <td className="px-4 py-2">{v.id}</td>
                  <td className="px-4 py-2">{v.nombre} {v.apellidos}</td>
                  <td className="px-4 py-2">{v.organizacion}</td>
                  <td className="px-4 py-2">{v.direccion}</td>
                  <td className="px-4 py-2">
                    {v.foto ? (
                      <a href={`http://localhost:5000/${v.foto.replace(/^\/+/, '')}`} target="_blank" rel="noreferrer">Ver</a>
                    ) : '—'}
                  </td>
                  <td className="px-4 py-2">
                    {v.documentos && v.documentos.length > 0 ? (
                      v.documentos.map((d, i) => (
                        <div key={i}><a href={`http://localhost:5000/${d.replace(/^\/+/, '')}`} target="_blank" rel="noreferrer">Documento {i+1}</a></div>
                      ))
                    ) : '—'}
                  </td>
                  <td className="px-4 py-2">
                    <button onClick={() => handleDelete(v.id)} className="text-red-600">Eliminar</button>
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
