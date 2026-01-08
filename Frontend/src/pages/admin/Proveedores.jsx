import { useState, useEffect } from 'react'
import axios from 'axios'
import { Plus, Edit, Trash2, Search } from 'lucide-react'
import AdminLayout from '../../components/AdminLayout'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

function Proveedores() {
  const [proveedores, setProveedores] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [editando, setEditando] = useState(null)
  const [busqueda, setBusqueda] = useState('')
  const [formData, setFormData] = useState({
    nombre_proveedor: '',
    ruc: '',
    telefono: '',
    email: '',
    direccion: ''
  })

  useEffect(() => {
    cargarProveedores()
  }, [])

  const cargarProveedores = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await axios.get(`${API_URL}/proveedores`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setProveedores(response.data.proveedores || [])
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const token = localStorage.getItem('token')

    try {
      if (editando) {
        await axios.put(`${API_URL}/proveedores/${editando.id_proveedor}`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        })
        alert('✅ Proveedor actualizado')
      } else {
        await axios.post(`${API_URL}/proveedores`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        })
        alert('✅ Proveedor creado')
      }
      cerrarModal()
      cargarProveedores()
    } catch (error) {
      alert('❌ Error al guardar')
    }
  }

  const abrirModalNuevo = () => {
    setEditando(null)
    setFormData({ nombre_proveedor: '', ruc: '', telefono: '', email: '', direccion: '' })
    setShowModal(true)
  }

  const abrirModalEditar = (proveedor) => {
    setEditando(proveedor)
    setFormData({
      nombre_proveedor: proveedor.nombre_proveedor,
      ruc: proveedor.ruc || '',
      telefono: proveedor.telefono || '',
      email: proveedor.email || '',
      direccion: proveedor.direccion || ''
    })
    setShowModal(true)
  }

  const cerrarModal = () => {
    setShowModal(false)
    setEditando(null)
  }

  const eliminarProveedor = async (id) => {
    if (!window.confirm('¿Eliminar este proveedor?')) return

    try {
      const token = localStorage.getItem('token')
      await axios.delete(`${API_URL}/proveedores/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      alert('✅ Proveedor eliminado')
      cargarProveedores()
    } catch (error) {
      alert('❌ Error al eliminar')
    }
  }

  const proveedoresFiltrados = proveedores.filter(p =>
    p.nombre_proveedor.toLowerCase().includes(busqueda.toLowerCase()) ||
    (p.ruc && p.ruc.includes(busqueda))
  )

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Gestión de Proveedores</h1>
          <button
            onClick={abrirModalNuevo}
            className="bg-gradient-to-r from-primary to-secondary text-white px-6 py-3 rounded-xl font-semibold hover:shadow-xl transition flex items-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span>Nuevo Proveedor</span>
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-4 mb-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar proveedor..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none"
            />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-primary to-secondary text-white">
              <tr>
                <th className="px-6 py-4 text-left">RUC</th>
                <th className="px-6 py-4 text-left">Nombre</th>
                <th className="px-6 py-4 text-left">Teléfono</th>
                <th className="px-6 py-4 text-left">Email</th>
                <th className="px-6 py-4 text-left">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {proveedoresFiltrados.map(p => (
                <tr key={p.id_proveedor} className="border-t hover:bg-gray-50">
                  <td className="px-6 py-4">{p.ruc || '-'}</td>
                  <td className="px-6 py-4 font-semibold">{p.nombre_proveedor}</td>
                  <td className="px-6 py-4">{p.telefono || '-'}</td>
                  <td className="px-6 py-4">{p.email || '-'}</td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => abrirModalEditar(p)}
                        className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => eliminarProveedor(p.id_proveedor)}
                        className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-lg"
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

        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-xl w-full">
              <div className="gradient-bg p-6 text-white">
                <h2 className="text-2xl font-bold">{editando ? 'Editar Proveedor' : 'Nuevo Proveedor'}</h2>
              </div>
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <input
                  type="text"
                  placeholder="Nombre *"
                  value={formData.nombre_proveedor}
                  onChange={(e) => setFormData({...formData, nombre_proveedor: e.target.value})}
                  required
                  className="w-full px-4 py-2 border-2 rounded-lg"
                />
                <input
                  type="text"
                  placeholder="RUC"
                  value={formData.ruc}
                  onChange={(e) => setFormData({...formData, ruc: e.target.value})}
                  className="w-full px-4 py-2 border-2 rounded-lg"
                />
                <input
                  type="tel"
                  placeholder="Teléfono"
                  value={formData.telefono}
                  onChange={(e) => setFormData({...formData, telefono: e.target.value})}
                  className="w-full px-4 py-2 border-2 rounded-lg"
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full px-4 py-2 border-2 rounded-lg"
                />
                <textarea
                  placeholder="Dirección"
                  value={formData.direccion}
                  onChange={(e) => setFormData({...formData, direccion: e.target.value})}
                  rows="3"
                  className="w-full px-4 py-2 border-2 rounded-lg"
                />
                <div className="flex gap-3">
                  <button type="button" onClick={cerrarModal} className="flex-1 bg-gray-300 py-3 rounded-lg font-semibold">Cancelar</button>
                  <button type="submit" className="flex-1 bg-gradient-to-r from-primary to-secondary text-white py-3 rounded-lg font-semibold">Guardar</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}

export default Proveedores