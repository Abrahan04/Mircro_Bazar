import { useState, useEffect } from 'react'
import axios from 'axios'
import { Plus, Edit, Trash2, Search, Package, Upload, X } from 'lucide-react'
import AdminLayout from '../../components/AdminLayout'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

function Productos() {
  const [productos, setProductos] = useState([])
  const [categorias, setCategorias] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [editando, setEditando] = useState(null)
  const [busqueda, setBusqueda] = useState('')
  const [imagenPreview, setImagenPreview] = useState(null)
  const [formData, setFormData] = useState({
    codigo_producto: '',
    nombre_producto: '',
    descripcion: '',
    id_categoria: '',
    precio_compra: '',
    precio_venta: '',
    stock_actual: 0,
    stock_minimo: 5
  })

  useEffect(() => {
    cargarProductos()
    cargarCategorias()
  }, [])

  const cargarProductos = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await axios.get(`${API_URL}/productos`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setProductos(response.data.productos || [])
    } catch (error) {
      console.error('Error:', error)
    }
  }

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
    const token = localStorage.getItem('token')

    try {
      // Usar FormData para enviar archivo
      const data = new FormData()
      data.append('codigo_producto', formData.codigo_producto)
      data.append('nombre_producto', formData.nombre_producto)
      data.append('descripcion', formData.descripcion)
      data.append('id_categoria', formData.id_categoria)
      data.append('precio_compra', formData.precio_compra)
      data.append('precio_venta', formData.precio_venta)
      data.append('stock_actual', formData.stock_actual)
      data.append('stock_minimo', formData.stock_minimo)
      
      // Agregar imagen si existe
      if (imagenPreview && imagenPreview.file) {
        data.append('imagen', imagenPreview.file)
      }

      if (editando) {
        await axios.put(`${API_URL}/productos/${editando.id_producto}`, data, {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        })
        alert('✅ Producto actualizado')
      } else {
        await axios.post(`${API_URL}/productos`, data, {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        })
        alert('✅ Producto creado')
      }
      cerrarModal()
      cargarProductos()
    } catch (error) {
      console.error('Error completo:', error)
      alert('❌ Error: ' + (error.response?.data?.message || error.message || 'Error al guardar'))
    }
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      // Crear preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagenPreview({
          preview: reader.result,
          file: file
        })
      }
      reader.readAsDataURL(file)
    }
  }

  const abrirModalNuevo = () => {
    setEditando(null)
    setFormData({
      codigo_producto: '',
      nombre_producto: '',
      descripcion: '',
      id_categoria: '',
      precio_compra: '',
      precio_venta: '',
      stock_actual: 0,
      stock_minimo: 5
    })
    setImagenPreview(null)
    setShowModal(true)
  }

  const abrirModalEditar = (producto) => {
    setEditando(producto)
    setFormData({
      codigo_producto: producto.codigo_producto,
      nombre_producto: producto.nombre_producto,
      descripcion: producto.descripcion || '',
      id_categoria: producto.id_categoria,
      precio_compra: producto.precio_compra,
      precio_venta: producto.precio_venta,
      stock_actual: producto.stock_actual,
      stock_minimo: producto.stock_minimo
    })
    setImagenPreview(null)
    setShowModal(true)
  }

  const cerrarModal = () => {
    setShowModal(false)
    setEditando(null)
    setImagenPreview(null)
  }

  const eliminarProducto = async (id) => {
    if (!window.confirm('¿Eliminar este producto?')) return

    try {
      const token = localStorage.getItem('token')
      await axios.delete(`${API_URL}/productos/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      alert('✅ Producto eliminado')
      cargarProductos()
    } catch (error) {
      alert('❌ Error al eliminar')
    }
  }

  const productosFiltrados = productos.filter(p =>
    p.nombre_producto.toLowerCase().includes(busqueda.toLowerCase()) ||
    p.codigo_producto.toLowerCase().includes(busqueda.toLowerCase())
  )

  return (
    <AdminLayout>
      <div className="p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Gestión de Productos</h1>
            <p className="text-gray-600">Administra tu inventario</p>
          </div>
          <button
            onClick={abrirModalNuevo}
            className="bg-gradient-to-r from-primary to-secondary text-white px-6 py-3 rounded-xl font-semibold hover:shadow-xl transition-all duration-300 flex items-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span>Nuevo Producto</span>
          </button>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-xl shadow-lg p-4 mb-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar producto..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none"
            />
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-primary to-secondary text-white">
                <tr>
                  <th className="px-6 py-4 text-left">Código</th>
                  <th className="px-6 py-4 text-left">Producto</th>
                  <th className="px-6 py-4 text-left">Categoría</th>
                  <th className="px-6 py-4 text-left">P. Compra</th>
                  <th className="px-6 py-4 text-left">P. Venta</th>
                  <th className="px-6 py-4 text-left">Stock</th>
                  <th className="px-6 py-4 text-left">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {productosFiltrados.map(p => (
                  <tr key={p.id_producto} className="border-t hover:bg-gray-50 transition">
                    <td className="px-6 py-4 text-sm">{p.codigo_producto}</td>
                    <td className="px-6 py-4 font-semibold">{p.nombre_producto}</td>
                    <td className="px-6 py-4 text-sm">{p.nombre_categoria}</td>
                    <td className="px-6 py-4 text-sm">${parseFloat(p.precio_compra).toFixed(2)}</td>
                    <td className="px-6 py-4 text-sm font-semibold text-green-600">${parseFloat(p.precio_venta).toFixed(2)}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        p.stock_actual <= p.stock_minimo 
                          ? 'bg-red-100 text-red-700' 
                          : 'bg-green-100 text-green-700'
                      }`}>
                        {p.stock_actual}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => abrirModalEditar(p)}
                          className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg transition"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => eliminarProducto(p.id_producto)}
                          className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-lg transition"
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

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="gradient-bg p-6 text-white">
                <h2 className="text-2xl font-bold">
                  {editando ? 'Editar Producto' : 'Nuevo Producto'}
                </h2>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2">Código *</label>
                    <input
                      type="text"
                      value={formData.codigo_producto}
                      onChange={(e) => setFormData({...formData, codigo_producto: e.target.value})}
                      required
                      className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">Categoría *</label>
                    <select
                      value={formData.id_categoria}
                      onChange={(e) => setFormData({...formData, id_categoria: e.target.value})}
                      required
                      className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none"
                    >
                      <option value="">Seleccionar</option>
                      {categorias.map(c => (
                        <option key={c.id_categoria} value={c.id_categoria}>{c.nombre_categoria}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Nombre *</label>
                  <input
                    type="text"
                    value={formData.nombre_producto}
                    onChange={(e) => setFormData({...formData, nombre_producto: e.target.value})}
                    required
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Descripción</label>
                  <textarea
                    value={formData.descripcion}
                    onChange={(e) => setFormData({...formData, descripcion: e.target.value})}
                    rows="3"
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Imagen del Producto</label>
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none"
                    />
                  </div>
                  
                  {imagenPreview && (
                    <div className="mt-4 relative">
                      <img 
                        src={imagenPreview.preview} 
                        alt="Preview" 
                        className="max-h-40 rounded-lg mx-auto"
                      />
                      <button
                        type="button"
                        onClick={() => setImagenPreview(null)}
                        className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full hover:bg-red-700 transition"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2">Precio Compra *</label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.precio_compra}
                      onChange={(e) => setFormData({...formData, precio_compra: e.target.value})}
                      required
                      className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">Precio Venta *</label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.precio_venta}
                      onChange={(e) => setFormData({...formData, precio_venta: e.target.value})}
                      required
                      className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2">Stock Actual *</label>
                    <input
                      type="number"
                      value={formData.stock_actual}
                      onChange={(e) => setFormData({...formData, stock_actual: e.target.value})}
                      required
                      className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">Stock Mínimo *</label>
                    <input
                      type="number"
                      value={formData.stock_minimo}
                      onChange={(e) => setFormData({...formData, stock_minimo: e.target.value})}
                      required
                      className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none"
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={cerrarModal}
                    className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 py-3 rounded-lg font-semibold transition"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-primary to-secondary text-white py-3 rounded-lg font-semibold hover:shadow-xl transition"
                  >
                    Guardar
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}

export default Productos