import { useState, useEffect } from 'react'
import axios from 'axios'
import Navbar from '../components/Navbar'
import Modal from '../components/Modal'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

function Productos() {
  const [productos, setProductos] = useState([])
  const [categorias, setCategorias] = useState([])
  const [mostrarModal, setMostrarModal] = useState(false)
  const [productoEditando, setProductoEditando] = useState(null)
  const [busqueda, setBusqueda] = useState('')
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
    const token = localStorage.getItem('token')
    try {
      const response = await axios.get(`${API_URL}/productos`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setProductos(response.data.productos)
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const cargarCategorias = async () => {
    try {
      const response = await axios.get(`${API_URL}/categorias`)
      setCategorias(response.data.categorias)
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const token = localStorage.getItem('token')
    const config = { headers: { Authorization: `Bearer ${token}` } }

    try {
      if (productoEditando) {
        await axios.put(`${API_URL}/productos/${productoEditando.id_producto}`, formData, config)
        alert('Producto actualizado')
      } else {
        await axios.post(`${API_URL}/productos`, formData, config)
        alert('Producto creado')
      }
      cerrarModal()
      cargarProductos()
    } catch (error) {
      alert('Error: ' + (error.response?.data?.message || 'Error al guardar'))
    }
  }

  const abrirModalNuevo = () => {
    setProductoEditando(null)
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
    setMostrarModal(true)
  }

  const abrirModalEditar = (producto) => {
    setProductoEditando(producto)
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
    setMostrarModal(true)
  }

  const cerrarModal = () => {
    setMostrarModal(false)
    setProductoEditando(null)
  }

  const eliminarProducto = async (id) => {
    if (!window.confirm('¿Eliminar este producto?')) return

    const token = localStorage.getItem('token')
    try {
      await axios.delete(`${API_URL}/productos/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      alert('Producto eliminado')
      cargarProductos()
    } catch (error) {
      alert('Error al eliminar')
    }
  }

  const productosFiltrados = productos.filter(p =>
    p.nombre_producto.toLowerCase().includes(busqueda.toLowerCase()) ||
    p.codigo_producto.toLowerCase().includes(busqueda.toLowerCase())
  )

  return (
    <div className="flex">
      <Navbar />
      
      <div className="ml-64 flex-1 p-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Gestión de Productos</h1>
            <p className="text-gray-600">Administra tu inventario</p>
          </div>
          <button
            onClick={abrirModalNuevo}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition"
          >
            + Nuevo Producto
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <input
            type="text"
            placeholder="Buscar producto..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg"
          />
        </div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold">Código</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Producto</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Categoría</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">P. Compra</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">P. Venta</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Stock</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {productosFiltrados.map(p => (
                <tr key={p.id_producto} className="border-t hover:bg-gray-50">
                  <td className="px-6 py-4">{p.codigo_producto}</td>
                  <td className="px-6 py-4 font-semibold">{p.nombre_producto}</td>
                  <td className="px-6 py-4">{p.nombre_categoria}</td>
                  <td className="px-6 py-4">${parseFloat(p.precio_compra).toFixed(2)}</td>
                  <td className="px-6 py-4">${parseFloat(p.precio_venta).toFixed(2)}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-sm ${
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
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => eliminarProducto(p.id_producto)}
                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm"
                      >
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Modal */}
        <Modal
          isOpen={mostrarModal}
          onClose={cerrarModal}
          title={productoEditando ? 'Editar Producto' : 'Nuevo Producto'}
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Código *</label>
                <input
                  type="text"
                  value={formData.codigo_producto}
                  onChange={(e) => setFormData({...formData, codigo_producto: e.target.value})}
                  required
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Categoría *</label>
                <select
                  value={formData.id_categoria}
                  onChange={(e) => setFormData({...formData, id_categoria: e.target.value})}
                  required
                  className="w-full px-4 py-2 border rounded-lg"
                >
                  <option value="">Seleccionar</option>
                  {categorias.map(c => (
                    <option key={c.id_categoria} value={c.id_categoria}>
                      {c.nombre_categoria}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Nombre *</label>
              <input
                type="text"
                value={formData.nombre_producto}
                onChange={(e) => setFormData({...formData, nombre_producto: e.target.value})}
                required
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Descripción</label>
              <textarea
                value={formData.descripcion}
                onChange={(e) => setFormData({...formData, descripcion: e.target.value})}
                rows="3"
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Precio Compra *</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.precio_compra}
                  onChange={(e) => setFormData({...formData, precio_compra: e.target.value})}
                  required
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Precio Venta *</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.precio_venta}
                  onChange={(e) => setFormData({...formData, precio_venta: e.target.value})}
                  required
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Stock Actual *</label>
                <input
                  type="number"
                  value={formData.stock_actual}
                  onChange={(e) => setFormData({...formData, stock_actual: e.target.value})}
                  required
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Stock Mínimo *</label>
                <input
                  type="number"
                  value={formData.stock_minimo}
                  onChange={(e) => setFormData({...formData, stock_minimo: e.target.value})}
                  required
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={cerrarModal}
                className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 py-3 rounded-lg font-semibold"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold"
              >
                Guardar
              </button>
            </div>
          </form>
        </Modal>
      </div>
    </div>
  )
}

export default Productos