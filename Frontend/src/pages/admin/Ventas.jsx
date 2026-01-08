import { useState, useEffect } from 'react'
import axios from 'axios'
import { Plus, ShoppingCart } from 'lucide-react'
import AdminLayout from '../../components/AdminLayout'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

function Ventas() {
  const [ventas, setVentas] = useState([])
  const [productos, setProductos] = useState([])
  const [clientes, setClientes] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [carritoVenta, setCarritoVenta] = useState([])
  const [clienteSeleccionado, setClienteSeleccionado] = useState('')
  const [metodoPago, setMetodoPago] = useState('efectivo')
  const [descuento, setDescuento] = useState(0)

  useEffect(() => {
    cargarVentas()
    cargarProductos()
    cargarClientes()
  }, [])

  const cargarVentas = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await axios.get(`${API_URL}/ventas`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setVentas(response.data.ventas || [])
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const cargarProductos = async () => {
    try {
      const response = await axios.get(`${API_URL}/productos`)
      setProductos(response.data.productos.filter(p => p.stock_actual > 0 && p.estado))
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const cargarClientes = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await axios.get(`${API_URL}/clientes`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setClientes(response.data.clientes || [])
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const agregarProductoVenta = (producto, cantidad) => {
    const existe = carritoVenta.find(item => item.id_producto === producto.id_producto)
    
    if (existe) {
      setCarritoVenta(carritoVenta.map(item =>
        item.id_producto === producto.id_producto
          ? { ...item, cantidad: item.cantidad + cantidad }
          : item
      ))
    } else {
      setCarritoVenta([...carritoVenta, {
        id_producto: producto.id_producto,
        nombre_producto: producto.nombre_producto,
        precio_unitario: producto.precio_venta,
        cantidad: cantidad
      }])
    }
  }

  const registrarVenta = async () => {
    if (carritoVenta.length === 0) {
      alert('Agregue productos a la venta')
      return
    }

    const token = localStorage.getItem('token')
    
    try {
      await axios.post(`${API_URL}/ventas`, {
        id_cliente: clienteSeleccionado || null,
        productos: carritoVenta,
        descuento: parseFloat(descuento),
        metodo_pago: metodoPago,
        observaciones: 'Venta registrada desde panel admin'
      }, {
        headers: { Authorization: `Bearer ${token}` }
      })
      
      alert('✅ Venta registrada exitosamente')
      setShowModal(false)
      setCarritoVenta([])
      setDescuento(0)
      cargarVentas()
      cargarProductos()
    } catch (error) {
      alert('❌ Error: ' + (error.response?.data?.message || 'Error al registrar venta'))
    }
  }

  const subtotal = carritoVenta.reduce((sum, item) => sum + (item.precio_unitario * item.cantidad), 0)
  const total = subtotal - parseFloat(descuento || 0)

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Gestión de Ventas</h1>
          <button
            onClick={() => setShowModal(true)}
            className="bg-gradient-to-r from-primary to-secondary text-white px-6 py-3 rounded-xl font-semibold hover:shadow-xl transition flex items-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span>Nueva Venta</span>
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-primary to-secondary text-white">
              <tr>
                <th className="px-6 py-4 text-left">Número</th>
                <th className="px-6 py-4 text-left">Cliente</th>
                <th className="px-6 py-4 text-left">Fecha</th>
                <th className="px-6 py-4 text-left">Total</th>
                <th className="px-6 py-4 text-left">Método Pago</th>
                <th className="px-6 py-4 text-left">Estado</th>
              </tr>
            </thead>
            <tbody>
              {ventas.map(v => (
                <tr key={v.id_venta} className="border-t hover:bg-gray-50">
                  <td className="px-6 py-4 font-semibold">{v.numero_venta}</td>
                  <td className="px-6 py-4">{v.nombre_cliente || 'Cliente General'}</td>
                  <td className="px-6 py-4">{new Date(v.fecha_venta).toLocaleString()}</td>
                  <td className="px-6 py-4 text-green-600 font-bold">${parseFloat(v.total_venta).toFixed(2)}</td>
                  <td className="px-6 py-4">{v.metodo_pago}</td>
                  <td className="px-6 py-4">
                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">
                      {v.estado}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
              <div className="gradient-bg p-6 text-white">
                <h2 className="text-2xl font-bold">Nueva Venta</h2>
              </div>

              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2">Cliente (Opcional)</label>
                    <select
                      value={clienteSeleccionado}
                      onChange={(e) => setClienteSeleccionado(e.target.value)}
                      className="w-full px-4 py-2 border-2 rounded-lg"
                    >
                      <option value="">Cliente General</option>
                      {clientes.map(c => (
                        <option key={c.id_cliente} value={c.id_cliente}>{c.nombre_cliente}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">Método de Pago</label>
                    <select
                      value={metodoPago}
                      onChange={(e) => setMetodoPago(e.target.value)}
                      className="w-full px-4 py-2 border-2 rounded-lg"
                    >
                      <option value="efectivo">Efectivo</option>
                      <option value="transferencia">Transferencia</option>
                      <option value="tarjeta">Tarjeta</option>
                    </select>
                  </div>
                </div>

                <div>
                  <h3 className="font-bold mb-2">Seleccionar Productos</h3>
                  <div className="grid grid-cols-3 gap-2 max-h-60 overflow-y-auto border rounded-lg p-2">
                    {productos.map(p => (
                      <button
                        key={p.id_producto}
                        onClick={() => agregarProductoVenta(p, 1)}
                        className="p-3 border-2 rounded-lg hover:border-primary transition text-left"
                      >
                        <p className="font-semibold text-sm">{p.nombre_producto}</p>
                        <p className="text-xs text-gray-600">Stock: {p.stock_actual}</p>
                        <p className="text-green-600 font-bold">${parseFloat(p.precio_venta).toFixed(2)}</p>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-bold mb-2">Productos en la venta:</h3>
                  {carritoVenta.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">No hay productos agregados</p>
                  ) : (
                    <div className="space-y-2">
                      {carritoVenta.map((item, index) => (
                        <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                          <div>
                            <p className="font-semibold">{item.nombre_producto}</p>
                            <p className="text-sm text-gray-600">{item.cantidad} x ${item.precio_unitario.toFixed(2)}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-green-600">${(item.cantidad * item.precio_unitario).toFixed(2)}</p>
                            <button
                              onClick={() => setCarritoVenta(carritoVenta.filter((_, i) => i !== index))}
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
                  <div className="flex justify-between mb-2">
                    <span>Subtotal:</span>
                    <span className="font-bold">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span>Descuento:</span>
                    <input
                      type="number"
                      value={descuento}
                      onChange={(e) => setDescuento(e.target.value)}
                      step="0.01"
                      className="w-24 px-2 py-1 border rounded text-right"
                    />
                  </div>
                  <div className="flex justify-between text-xl font-bold text-green-600">
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
                    onClick={registrarVenta}
                    className="flex-1 bg-gradient-to-r from-primary to-secondary text-white py-3 rounded-lg font-semibold"
                  >
                    Registrar Venta
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

export default Ventas