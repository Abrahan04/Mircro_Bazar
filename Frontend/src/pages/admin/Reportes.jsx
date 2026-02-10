import { useState, useEffect } from 'react'
import axios from 'axios'
import { BarChart3, TrendingUp, Package, DollarSign } from 'lucide-react'
import AdminLayout from '../../components/AdminLayout'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

function Reportes() {
  const [ventasDiarias, setVentasDiarias] = useState([])
  const [productosMasVendidos, setProductosMasVendidos] = useState([])
  const [fechaInicio, setFechaInicio] = useState('')
  const [fechaFin, setFechaFin] = useState('')
  const [ventasPorFecha, setVentasPorFecha] = useState([])

  useEffect(() => {
    cargarReportes()
  }, [])

  const cargarReportes = async () => {
    const token = localStorage.getItem('token')
    const config = { headers: { Authorization: `Bearer ${token}` } }

    try {
      const [ventasRes, productosRes] = await Promise.all([
        axios.get(`${API_URL}/reportes/ventas-diarias`, config),
        axios.get(`${API_URL}/reportes/productos-mas-vendidos`, config)
      ])

      setVentasDiarias(ventasRes.data.ventas || [])
      setProductosMasVendidos(productosRes.data.productos || [])
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const buscarPorFecha = async () => {
    if (!fechaInicio || !fechaFin) {
      alert('Seleccione ambas fechas')
      return
    }

    const token = localStorage.getItem('token')
    try {
      const response = await axios.get(
        `${API_URL}/reportes/ventas-por-fecha?fecha_inicio=${fechaInicio}&fecha_fin=${fechaFin}`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setVentasPorFecha(response.data.ventas || [])
    } catch (error) {
      console.error('Error:', error)
      alert('Error al buscar ventas')
    }
  }

  return (
    <AdminLayout>
      <div className="p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Reportes y Estadísticas</h1>

        {/* Ventas Diarias */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <TrendingUp className="w-8 h-8 text-[#8B5CF6]" />
            <h2 className="text-2xl font-bold">Ventas Diarias (Últimos 30 días)</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left">Fecha</th>
                  <th className="px-4 py-3 text-left">Total Ventas</th>
                  <th className="px-4 py-3 text-left">Monto Total</th>
                  <th className="px-4 py-3 text-left">Promedio</th>
                </tr>
              </thead>
              <tbody>
                {ventasDiarias.map((v, index) => (
                  <tr key={index} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-3">{new Date(v.fecha).toLocaleDateString()}</td>
                    <td className="px-4 py-3 font-semibold">{v.total_ventas}</td>
                    <td className="px-4 py-3 text-green-600 font-bold">${parseFloat(v.monto_total).toFixed(2)}</td>
                    <td className="px-4 py-3">${parseFloat(v.promedio_venta).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Productos Más Vendidos */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <Package className="w-8 h-8 text-[#8B5CF6]" />
            <h2 className="text-2xl font-bold">Productos Más Vendidos</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left">Producto</th>
                  <th className="px-4 py-3 text-left">Categoría</th>
                  <th className="px-4 py-3 text-left">Cantidad Vendida</th>
                  <th className="px-4 py-3 text-left">Total Ingresos</th>
                </tr>
              </thead>
              <tbody>
                {productosMasVendidos.map((p, index) => (
                  <tr key={index} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-3 font-semibold">{p.nombre_producto}</td>
                    <td className="px-4 py-3">{p.nombre_categoria}</td>
                    <td className="px-4 py-3 font-bold text-blue-600">{p.cantidad_vendida}</td>
                    <td className="px-4 py-3 text-green-600 font-bold">${parseFloat(p.total_ingresos).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Búsqueda por Fecha */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center space-x-3 mb-4">
            <DollarSign className="w-8 h-8 text-[#8B5CF6]" />
            <h2 className="text-2xl font-bold">Ventas por Rango de Fechas</h2>
          </div>
          <div className="flex gap-4 mb-4">
            <input
              type="date"
              value={fechaInicio}
              onChange={(e) => setFechaInicio(e.target.value)}
              className="px-4 py-2 border-2 rounded-lg"
            />
            <input
              type="date"
              value={fechaFin}
              onChange={(e) => setFechaFin(e.target.value)}
              className="px-4 py-2 border-2 rounded-lg"
            />
            <button
              onClick={buscarPorFecha}
              className="bg-gradient-to-r from-[#8B5CF6] to-[#6366F1] text-white px-6 py-2 rounded-lg font-semibold hover:shadow-xl transition"
            >
              Buscar
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left">Fecha</th>
                  <th className="px-4 py-3 text-left">Total Ventas</th>
                  <th className="px-4 py-3 text-left">Monto Total</th>
                </tr>
              </thead>
              <tbody>
                {ventasPorFecha.length === 0 ? (
                  <tr>
                    <td colSpan="3" className="text-center py-8 text-gray-500">
                      Seleccione un rango de fechas para ver resultados
                    </td>
                  </tr>
                ) : (
                  ventasPorFecha.map((v, index) => (
                    <tr key={index} className="border-t hover:bg-gray-50">
                      <td className="px-4 py-3">{new Date(v.fecha).toLocaleDateString()}</td>
                      <td className="px-4 py-3 font-semibold">{v.total_ventas}</td>
                      <td className="px-4 py-3 text-green-600 font-bold">${parseFloat(v.monto_total).toFixed(2)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}

export default Reportes