import { useState, useEffect } from 'react'
import axios from 'axios'
import { Package, DollarSign, Users, AlertTriangle } from 'lucide-react'
import AdminLayout from '../../components/AdminLayout'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

function AdminDashboard() {
  const [estadisticas, setEstadisticas] = useState(null)
  const [bajoStock, setBajoStock] = useState([])

  useEffect(() => {
    cargarDatos()
  }, [])

  const cargarDatos = async () => {
    const token = localStorage.getItem('token')
    const config = { headers: { Authorization: `Bearer ${token}` } }

    try {
      const [statsRes, stockRes] = await Promise.all([
        axios.get(`${API_URL}/reportes/estadisticas`, config),
        axios.get(`${API_URL}/reportes/bajo-stock`, config)
      ])

      setEstadisticas(statsRes.data.estadisticas)
      setBajoStock(stockRes.data.productos || [])
    } catch (error) {
      console.error('Error:', error)
    }
  }

  if (!estadisticas) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-screen">
          <div className="w-16 h-16 border-4 border-[#8B5CF6] border-t-transparent rounded-full animate-spin"></div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Dashboard - Panel de Control</h1>

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-green-400 to-green-600 text-white p-6 rounded-xl shadow-lg">
            <DollarSign className="w-12 h-12 mb-3" />
            <h3 className="text-sm opacity-90">Ventas del Mes</h3>
            <p className="text-3xl font-bold mt-2">${estadisticas.ventas_mes.monto.toFixed(2)}</p>
            <p className="text-sm mt-1">{estadisticas.ventas_mes.total} ventas</p>
          </div>

          <div className="bg-gradient-to-br from-blue-400 to-blue-600 text-white p-6 rounded-xl shadow-lg">
            <Package className="w-12 h-12 mb-3" />
            <h3 className="text-sm opacity-90">Total Productos</h3>
            <p className="text-3xl font-bold mt-2">{estadisticas.total_productos}</p>
            <p className="text-sm mt-1">Productos activos</p>
          </div>

          <div className="bg-gradient-to-br from-red-400 to-red-600 text-white p-6 rounded-xl shadow-lg">
            <AlertTriangle className="w-12 h-12 mb-3" />
            <h3 className="text-sm opacity-90">Bajo Stock</h3>
            <p className="text-3xl font-bold mt-2">{estadisticas.productos_bajo_stock}</p>
            <p className="text-sm mt-1">A reponer</p>
          </div>

          <div className="bg-gradient-to-br from-purple-400 to-purple-600 text-white p-6 rounded-xl shadow-lg">
            <Users className="w-12 h-12 mb-3" />
            <h3 className="text-sm opacity-90">Total Clientes</h3>
            <p className="text-3xl font-bold mt-2">{estadisticas.total_clientes}</p>
            <p className="text-sm mt-1">Registrados</p>
          </div>
        </div>

        {/* Productos Bajo Stock */}
        {bajoStock.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">⚠️ Productos con Bajo Stock</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left">Código</th>
                    <th className="px-4 py-3 text-left">Producto</th>
                    <th className="px-4 py-3 text-left">Stock Actual</th>
                    <th className="px-4 py-3 text-left">Stock Mínimo</th>
                    <th className="px-4 py-3 text-left">Precio</th>
                  </tr>
                </thead>
                <tbody>
                  {bajoStock.map(p => (
                    <tr key={p.id_producto} className="border-t hover:bg-gray-50">
                      <td className="px-4 py-3">{p.codigo_producto}</td>
                      <td className="px-4 py-3 font-semibold">{p.nombre_producto}</td>
                      <td className="px-4 py-3">
                        <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-semibold">
                          {p.stock_actual}
                        </span>
                      </td>
                      <td className="px-4 py-3">{p.stock_minimo}</td>
                      <td className="px-4 py-3">${parseFloat(p.precio_venta).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}

export default AdminDashboard