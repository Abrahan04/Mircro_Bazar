import { useState, useEffect } from 'react'
import axios from 'axios'
import { Search, User, Mail, Shield, CheckCircle, XCircle } from 'lucide-react'
import AdminLayout from '../../components/AdminLayout'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

function Clientes() {
  const [usuarios, setUsuarios] = useState([])
  const [loading, setLoading] = useState(true)
  const [busqueda, setBusqueda] = useState('')

  useEffect(() => {
    cargarUsuarios()
  }, [])

  const cargarUsuarios = async () => {
    try {
      const token = localStorage.getItem('token')
      // Consultamos a /usuarios porque ahí es donde se guardan los registros de la web
      const response = await axios.get(`${API_URL}/usuarios`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      
      if (response.data.success) {
        // Filtramos para mostrar solo los usuarios que NO son administradores (tus clientes)
        const listaUsuarios = response.data.usuarios || []
        const soloClientes = listaUsuarios.filter(u => u.rol !== 'administrador')
        setUsuarios(soloClientes)
      }
    } catch (error) {
      console.error('Error al cargar usuarios:', error)
    } finally {
      setLoading(false)
    }
  }

  // Filtrar usuarios por búsqueda
  const usuariosFiltrados = usuarios.filter(u => 
    u.nombre_usuario?.toLowerCase().includes(busqueda.toLowerCase()) ||
    u.correo?.toLowerCase().includes(busqueda.toLowerCase())
  )

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Gestión de Clientes (Usuarios Registrados)</h1>
        </div>

        {/* Barra de búsqueda */}
        <div className="bg-white rounded-xl shadow-lg p-4 mb-6 flex items-center gap-4">
          <Search className="text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Buscar por nombre o correo..."
            className="flex-1 outline-none text-gray-600"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-[#8B5CF6] to-[#6366F1] text-white">
              <tr>
                <th className="px-6 py-4 text-left">Cliente</th>
                <th className="px-6 py-4 text-left">Correo</th>
                <th className="px-6 py-4 text-left">Rol</th>
                <th className="px-6 py-4 text-left">Estado</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="4" className="text-center py-8">Cargando clientes...</td>
                </tr>
              ) : usuariosFiltrados.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center py-8 text-gray-500">
                    No se encontraron clientes registrados.
                  </td>
                </tr>
              ) : (
                usuariosFiltrados.map((usuario) => (
                  <tr key={usuario.id_usuario} className="border-t hover:bg-gray-50">
                    <td className="px-6 py-4 flex items-center gap-3">
                      <div className="bg-blue-100 p-2 rounded-full text-blue-600">
                        <User size={20} />
                      </div>
                      <span className="font-semibold">{usuario.nombre_usuario}</span>
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      <div className="flex items-center gap-2">
                        <Mail size={16} />
                        {usuario.correo}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1 w-fit">
                        <Shield size={14} />
                        {usuario.rol}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {usuario.estado ? (
                        <span className="flex items-center gap-1 text-green-600 font-semibold bg-green-50 px-3 py-1 rounded-full w-fit">
                          <CheckCircle size={16} /> Activo
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-red-600 font-semibold bg-red-50 px-3 py-1 rounded-full w-fit">
                          <XCircle size={16} /> Inactivo
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  )
}

export default Clientes