import { Link, useLocation, useNavigate } from 'react-router-dom'
import { LayoutDashboard, Package, Tag, Users, Truck, ShoppingCart, ShoppingBag, BarChart3, LogOut, Home } from 'lucide-react'
import { useAuth } from '../App'

function AdminLayout({ children }) {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  const menuItems = [
    { path: '/admin/dashboard', icon: <LayoutDashboard />, label: 'Dashboard' },
    { path: '/admin/productos', icon: <Package />, label: 'Productos' },
    { path: '/admin/categorias', icon: <Tag />, label: 'Categorías' },
    { path: '/admin/clientes', icon: <Users />, label: 'Clientes' },
    { path: '/admin/proveedores', icon: <Truck />, label: 'Proveedores' },
    { path: '/admin/ventas', icon: <ShoppingCart />, label: 'Ventas' },
    { path: '/admin/compras', icon: <ShoppingBag />, label: 'Compras' },
    { path: '/admin/reportes', icon: <BarChart3 />, label: 'Reportes' },
  ]

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-gradient-to-b from-gray-900 to-gray-800 text-white fixed h-screen overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center space-x-3 mb-8">
            <div className="w-10 h-10 bg-gradient-to-r from-[#8B5CF6] to-[#6366F1] rounded-lg flex items-center justify-center">
              <Package className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-bold text-lg">Micro Bazar</h2>
              <p className="text-xs text-gray-400">Admin Panel</p>
            </div>
          </div>

          <nav className="space-y-2">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-[#8B5CF6] text-white shadow-lg'
                      : 'hover:bg-gray-700'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </nav>

          <div className="mt-8 pt-8 border-t border-gray-700">
            <Link
              to="/"
              className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-gray-700 transition mb-2"
            >
              <Home className="w-5 h-5" />
              <span>Volver a la tienda</span>
            </Link>
            <button
              onClick={handleLogout}
              className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-red-600 transition"
            >
              <LogOut className="w-5 h-5" />
              <span>Cerrar Sesión</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64 flex-1">
        <div className="bg-white border-b">
          <div className="px-8 py-4">
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-semibold text-gray-800">
                Panel de Administración
              </h1>
              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <p className="text-sm font-semibold">{user?.nombre}</p>
                  <p className="text-xs text-gray-500">{user?.rol || 'Administrador'}</p>
                </div>
                <div className="w-10 h-10 bg-gradient-to-r from-[#8B5CF6] to-[#6366F1] rounded-full flex items-center justify-center text-white font-bold">
                  {user?.nombre?.charAt(0) || 'A'}
                </div>
              </div>
            </div>
          </div>
        </div>
        {children}
      </main>
    </div>
  )
}

export default AdminLayout