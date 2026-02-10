import { useState, useEffect } from 'react'
import axios from 'axios'
import { Plus } from 'lucide-react'
import AdminLayout from '../../components/AdminLayout'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

function Compras() {
  const [compras, setCompras] = useState([])
  const [productos, setProductos] = useState([])
  const [proveedores, setProveedores] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [carritoCompra, setCarritoCompra] = useState([])
  const [proveedorSeleccionado, setProveedorSeleccionado] = useState('')
  const [productoCantidades, setProductoCantidades] = useState({})
  const [productoPreciosCompra, setProductoPreciosCompra] = useState({})

  useEffect(() => {
    cargarCompras()
    cargarProductos()
    cargarProveedores()
  }, [])

  const cargarCompras = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await axios.get(`${API_URL}/compras`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setCompras(response.data.compras || [])
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const cargarProductos = async () => {
    try {
      const response = await axios.get(`${API_URL}/productos`)
      setProductos(response.data.productos.filter(p => p.estado))
    } catch (error) {
      console.error('Error:', error)
    }
  }

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

  const agregarProductoCompra = (producto, cantidad, precioUnitario) => {
    const cantidadNum = parseInt(cantidad) || 1
    const precioNum = parseFloat(precioUnitario) || parseFloat(producto.precio_compra)
    const existe = carritoCompra.find(item => item.id_producto === producto.id_producto)
    
    if (existe) {
      setCarritoCompra(carritoCompra.map(item =>
        item.id_producto === producto.id_producto
          ? { ...item, cantidad: item.cantidad + cantidadNum, precio_unitario: precioNum }
          : item
      ))
    } else {
      setCarritoCompra([...carritoCompra, {
        id_producto: producto.id_producto,
        nombre_producto: producto.nombre_producto,
        precio_unitario: precioNum,
        cantidad: cantidadNum
      }])
    }
  }

  const registrarCompra = async () => {
    if (!proveedorSeleccionado) {
      alert('Seleccione un proveedor')
      return
    }
    if (carritoCompra.length === 0) {
      alert('Agregue productos a la compra')
      return
    }

    const token = localStorage.getItem('token')
    
    try {
      console.log('📤 Enviando compra:', {
        id_proveedor: parseInt(proveedorSeleccionado),
        productos: carritoCompra,
        observaciones: 'Compra registrada desde panel admin'
      })

      const response = await axios.post(`${API_URL}/compras`, {
        id_proveedor: parseInt(proveedorSeleccionado),
        productos: carritoCompra,
        observaciones: 'Compra registrada desde panel admin'
      }, {
        headers: { Authorization: `Bearer ${token}` }
      })
      
      console.log('✅ Respuesta del servidor:', response.data)
      alert('✅ Compra registrada. El stock se ha actualizado automáticamente.')
      setShowModal(false)
      setCarritoCompra([])
      setProveedorSeleccionado('')
      setProductoCantidades({})
      setProductoPreciosCompra({})
      cargarCompras()
      cargarProductos()
    } catch (error) {
      console.error('❌ Error completo:', error)
      console.error('❌ Respuesta del error:', error.response?.data)
      alert('❌ Error: ' + (error.response?.data?.message || error.message || 'Error al registrar compra'))
    }
  }

  const total = carritoCompra.reduce((sum, item) => sum + (item.precio_unitario * item.cantidad), 0)

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Gestión de Compras</h1>
          <button
            onClick={() => setShowModal(true)}
            className="bg-gradient-to-r from-[#8B5CF6] to-[#6366F1] text-white px-6 py-3 rounded-xl font-semibold hover:shadow-xl transition flex items-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span>Nueva Compra</span>
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-[#8B5CF6] to-[#6366F1] text-white">
              <tr>
                <th className="px-6 py-4 text-left">Número</th>
                <th className="px-6 py-4 text-left">Proveedor</th>
                <th className="px-6 py-4 text-left">Fecha</th>
                <th className="px-6 py-4 text-left">Total</th>
                <th className="px-6 py-4 text-left">Usuario</th>
              </tr>
            </thead>
            <tbody>
              {compras.map(c => (
                <tr key={c.id_compra} className="border-t hover:bg-gray-50">
                  <td className="px-6 py-4 font-semibold">{c.numero_compra}</td>
                  <td className="px-6 py-4">{c.nombre_proveedor || 'Sin proveedor'}</td>
                  <td className="px-6 py-4">{new Date(c.fecha_compra).toLocaleString()}</td>
                  <td className="px-6 py-4 text-blue-600 font-bold">${parseFloat(c.total_compra).toFixed(2)}</td>
                  <td className="px-6 py-4">{c.nombre_usuario || 'Sistema'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
              <div className="bg-gradient-to-r from-[#8B5CF6] to-[#6366F1] p-6 text-white">
                <h2 className="text-2xl font-bold">Nueva Compra</h2>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">Proveedor *</label>
                  <select
                    value={proveedorSeleccionado}
                    onChange={(e) => setProveedorSeleccionado(e.target.value)}
                    required
                    className="w-full px-4 py-2 border-2 rounded-lg"
                  >
                    <option value="">Seleccionar proveedor</option>
                    {proveedores.map(p => (
                      <option key={p.id_proveedor} value={p.id_proveedor}>{p.nombre_proveedor}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <h3 className="font-bold mb-2">Seleccionar Productos</h3>
                  <div className="grid grid-cols-3 gap-2 max-h-60 overflow-y-auto border rounded-lg p-2">
                    {productos.map(p => (
                      <div key={p.id_producto} className="p-3 border-2 rounded-lg">
                        <p className="font-semibold text-sm">{p.nombre_producto}</p>
                        <input
                          type="number"
                          placeholder="Cantidad"
                          min="1"
                          defaultValue="1"
                          onChange={(e) => setProductoCantidades({...productoCantidades, [p.id_producto]: e.target.value})}
                          className="w-full px-2 py-1 border rounded mt-1 text-sm"
                        />
                        <input
                          type="number"
                          placeholder="Precio"
                          step="0.01"
                          defaultValue={p.precio_compra}
                          onChange={(e) => setProductoPreciosCompra({...productoPreciosCompra, [p.id_producto]: e.target.value})}
                          className="w-full px-2 py-1 border rounded mt-1 text-sm"
                        />
                        <button
                          onClick={() => agregarProductoCompra(p, productoCantidades[p.id_producto], productoPreciosCompra[p.id_producto])}
                          className="w-full bg-[#8B5CF6] text-white py-1 rounded mt-1 text-sm hover:bg-[#6366F1] transition"
                        >
                          Agregar
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-bold mb-2">Productos en la compra:</h3>
                  {carritoCompra.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">No hay productos agregados</p>
                  ) : (
                    <div className="space-y-2">
                      {carritoCompra.map((item, index) => (
                        <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                          <div>
                            <p className="font-semibold">{item.nombre_producto}</p>
                            <p className="text-sm text-gray-600">{item.cantidad} x ${item.precio_unitario.toFixed(2)}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-blue-600">${(item.cantidad * item.precio_unitario).toFixed(2)}</p>
                            <button
                              onClick={() => setCarritoCompra(carritoCompra.filter((_, i) => i !== index))}
                              className="text-red-600 text-sm hover:underline"
                            >
                              Eliminar
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between text-xl font-bold text-blue-600">
                    <span>TOTAL:</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setShowModal(false)}
                    className="flex-1 bg-gray-300 py-3 rounded-lg font-semibold"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={registrarCompra}
                    className="flex-1 bg-gradient-to-r from-[#8B5CF6] to-[#6366F1] text-white py-3 rounded-lg font-semibold"
                  >
                    Registrar Compra
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}

export default Compras