import { Link } from 'react-router-dom'
import { useAuth } from '../App'
import Navbar from '../components/Navbar'
import { Package, ShoppingBag, User, LogOut } from 'lucide-react'

function Dashboard() {
  const { user, logout, cart } = useAuth()

  const stats = [
    {
      icon: <ShoppingBag className="w-8 h-8" />,
      title: 'Productos en Carrito',
      value: cart.reduce((sum, item) => sum + item.cantidad, 0),
      color: 'from-blue-500 to-blue-600'
    },
    {
      icon: <Package className="w-8 h-8" />,
      title: 'Total en Carrito',
      value: `$${cart.reduce((sum, item) => sum + (item.precio_venta * item.cantidad), 0).toFixed(2)}`,
      color: 'from-green-500 to-green-600'
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-[#8B5CF6] to-[#6366F1] rounded-2xl p-8 text-white mb-8 animate-fade-in">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">
                ¡Hola, {user?.nombre || 'Usuario'}! 👋
              </h1>
              <p className="text-lg opacity-90">
                Bienvenido a tu panel personal
              </p>
            </div>
            <div className="hidden md:block">
              <div className="w-24 h-24 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <User className="w-12 h-12" />
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className={`bg-gradient-to-r ${stat.color} text-white rounded-2xl p-6 shadow-lg animate-fade-in`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-90">{stat.title}</p>
                  <p className="text-4xl font-bold mt-2">{stat.value}</p>
                </div>
                <div className="w-16 h-16 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
                  {stat.icon}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* User Info Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 animate-fade-in">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">
            Información de la Cuenta
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div>
                <p className="text-sm text-gray-600">Nombre</p>
                <p className="font-semibold text-gray-800">{user?.nombre || 'No disponible'}</p>
              </div>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="font-semibold text-gray-800">{user?.email || 'No disponible'}</p>
              </div>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div>
                <p className="text-sm text-gray-600">Rol</p>
                <p className="font-semibold text-gray-800">{user?.rol || 'Cliente'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link
            to="/"
            className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 text-center"
          >
            <Package className="w-12 h-12 mx-auto mb-3" />
            <h3 className="text-xl font-bold mb-2">Continuar Comprando</h3>
            <p className="opacity-90">Explora más productos</p>
          </Link>

          <button
            onClick={logout}
            className="bg-gradient-to-r from-red-500 to-red-600 text-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 text-center"
          >
            <LogOut className="w-12 h-12 mx-auto mb-3" />
            <h3 className="text-xl font-bold mb-2">Cerrar Sesión</h3>
            <p className="opacity-90">Salir de tu cuenta</p>
          </button>
        </div>
      </div>
    </div>
  )
}

export default Dashboard