import { useState, useEffect } from 'react'
import axios from 'axios'
import { Plus, Edit, Trash2 } from 'lucide-react'
import AdminLayout from '../../components/AdminLayout'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

function Categorias() {
  const [categorias, setCategorias] = useState([])
  const [nombre, setNombre] = useState('')
  const [editando, setEditando] = useState(null)

  useEffect(() => {
    cargarCategorias()
  }, [])

  const cargarCategorias = async () => {
    try {
      const response = await axios.get(`${API_URL}/categorias`)
      setCategorias(response.data.categorias || [])
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const token = localStorage.getItem('token')
      
      if (editando) {
        // Actualizar categoría
        await axios.put(`${API_URL}/categorias/${editando.id_categoria}`, 
          { nombre_categoria: nombre, descripcion: '' },
          { headers: { Authorization: `Bearer ${token}` }}
        )
        alert('✅ Categoría actualizada')
        setEditando(null)
      } else {
        // Crear nueva categoría
        await axios.post(`${API_URL}/categorias`, 
          { nombre_categoria: nombre, descripcion: '' },
          { headers: { Authorization: `Bearer ${token}` }}
        )
        alert('✅ Categoría creada')
      }
      
      setNombre('')
      cargarCategorias()
    } catch (error) {
      alert('❌ Error: ' + (error.response?.data?.message || 'Error al guardar categoría'))
    }
  }

  const abrirEditar = (categoria) => {
    setEditando(categoria)
    setNombre(categoria.nombre_categoria)
  }

  const cancelarEdicion = () => {
    setEditando(null)
    setNombre('')
  }

  const eliminarCategoria = async (id) => {
    if (!window.confirm('¿Deseas eliminar esta categoría?')) return

    try {
      const token = localStorage.getItem('token')
      await axios.delete(`${API_URL}/categorias/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      alert('✅ Categoría eliminada')
      cargarCategorias()
    } catch (error) {
      alert('❌ Error: ' + (error.response?.data?.message || 'Error al eliminar'))
    }
  }

  return (
    <AdminLayout>
      <div className="p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Gestión de Categorías</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Formulario */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold mb-4">
                {editando ? 'Editar Categoría' : 'Nueva Categoría'}
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">Nombre *</label>
                  <input
                    type="text"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    required
                    placeholder="Ej: Bebidas"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#8B5CF6] focus:outline-none"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-[#8B5CF6] to-[#6366F1] text-white py-3 rounded-lg font-semibold hover:shadow-xl transition flex items-center justify-center space-x-2"
                >
                  <Plus className="w-5 h-5" />
                  <span>{editando ? 'Actualizar Categoría' : 'Agregar Categoría'}</span>
                </button>
                {editando && (
                  <button
                    type="button"
                    onClick={cancelarEdicion}
                    className="w-full bg-gray-400 hover:bg-gray-500 text-white py-3 rounded-lg font-semibold transition"
                  >
                    Cancelar
                  </button>
                )}
              </form>
            </div>
          </div>

          {/* Lista */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-[#8B5CF6] to-[#6366F1] text-white">
                  <tr>
                    <th className="px-6 py-4 text-left">ID</th>
                    <th className="px-6 py-4 text-left">Nombre</th>
                    <th className="px-6 py-4 text-left">Estado</th>
                    <th className="px-6 py-4 text-left">Fecha</th>
                    <th className="px-6 py-4 text-left">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {categorias.map(c => (
                    <tr key={c.id_categoria} className="border-t hover:bg-gray-50">
                      <td className="px-6 py-4">{c.id_categoria}</td>
                      <td className="px-6 py-4 font-semibold">{c.nombre_categoria}</td>
                      <td className="px-6 py-4">
                        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">
                          Activo
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {new Date(c.fecha_creacion).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => abrirEditar(c)}
                            className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg transition"
                            title="Editar categoría"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => eliminarCategoria(c.id_categoria)}
                            className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-lg transition"
                            title="Eliminar categoría"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}

export default Categorias