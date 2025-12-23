import { Link } from 'react-router-dom'
import { ShoppingCart, User, UserPlus, LogOut, Menu, X } from 'lucide-react'
import { useState } from 'react'
import { useAuth } from '../App'
import CartModal from "./CartModal.jsx";
function Navbar() {
  const { user, logout, cart } = useAuth()
  const [showCart, setShowCart] = useState(false)
  const [showMenu, setShowMenu] = useState(false)

  const totalItems = cart.reduce((sum, item) => sum + item.cantidad, 0)

  return (
    <>
      <nav className="bg-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="w-12 h-12 gradient-bg rounded-xl flex items-center justify-center transform group-hover:rotate-12 transition-transform duration-300">
                <ShoppingCart className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  Micro Bazar
                </h1>
                <p className="text-xs text-gray-500">AbrahanIsaias</p>
              </div>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-6">
              <Link to="/" className="text-gray-700 hover:text-primary transition font-medium">
                Inicio
              </Link>
              
              {user ? (
                <>
                  <Link to="/dashboard" className="text-gray-700 hover:text-primary transition font-medium">
                    Mi Cuenta
                  </Link>
                  <button
                    onClick={logout}
                    className="flex items-center space-x-2 text-gray-700 hover:text-red-600 transition font-medium"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Cerrar Sesión</span>
                  </button>
                </>
              ) : (
                <>
                  <Link 
                    to="/login" 
                    className="flex items-center space-x-2 text-gray-700 hover:text-primary transition font-medium"
                  >
                    <User className="w-4 h-4" />
                    <span>Iniciar Sesión</span>
                  </Link>
                  <Link 
                    to="/register" 
                    className="flex items-center space-x-2 bg-gradient-to-r from-primary to-secondary text-white px-5 py-2 rounded-lg hover:shadow-lg transition-all duration-300"
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>Registrarse</span>
                  </Link>
                </>
              )}

              {/* Cart Button */}
              <button
                onClick={() => setShowCart(true)}
                className="relative bg-gradient-to-r from-green-500 to-emerald-600 text-white px-5 py-2 rounded-lg hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center space-x-2"
              >
                <ShoppingCart className="w-5 h-5" />
                <span className="font-semibold">Carrito</span>
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold animate-bounce">
                    {totalItems}
                  </span>
                )}
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100"
            >
              {showMenu ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {showMenu && (
            <div className="md:hidden pb-4 animate-slide-in">
              <div className="flex flex-col space-y-3">
                <Link to="/" className="text-gray-700 hover:text-primary transition px-4 py-2 rounded-lg hover:bg-gray-50">
                  Inicio
                </Link>
                {user ? (
                  <>
                    <Link to="/dashboard" className="text-gray-700 hover:text-primary transition px-4 py-2 rounded-lg hover:bg-gray-50">
                      Mi Cuenta
                    </Link>
                    <button
                      onClick={logout}
                      className="text-left text-gray-700 hover:text-red-600 transition px-4 py-2 rounded-lg hover:bg-gray-50"
                    >
                      Cerrar Sesión
                    </button>
                  </>
                ) : (
                  <>
                    <Link to="/login" className="text-gray-700 hover:text-primary transition px-4 py-2 rounded-lg hover:bg-gray-50">
                      Iniciar Sesión
                    </Link>
                    <Link to="/register" className="text-gray-700 hover:text-primary transition px-4 py-2 rounded-lg hover:bg-gray-50">
                      Registrarse
                    </Link>
                  </>
                )}
                <button
                  onClick={() => setShowCart(true)}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center justify-center space-x-2"
                >
                  <ShoppingCart className="w-5 h-5" />
                  <span>Carrito ({totalItems})</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Cart Modal */}
      <CartModal isOpen={showCart} onClose={() => setShowCart(false)} />
    </>
  )
}

export default Navbar