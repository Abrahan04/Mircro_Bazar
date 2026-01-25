import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useState, createContext, useContext } from 'react'

// Páginas Públicas
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import AuthRedirect from './pages/AuthRedirect'

// Páginas Admin
import AdminDashboard from './pages/admin/Dashboard'
import Productos from './pages/admin/Productos'
import Categorias from './pages/admin/Categorias'
import Clientes from './pages/admin/Clientes'
import Proveedores from './pages/admin/Proveedores'
import Ventas from './pages/admin/Ventas'
import Compras from './pages/admin/Compras'
import Reportes from './pages/admin/Reportes'

// Componentes
import ProtectedRoute from './components/ProtectedRoute'

// Contexto de autenticación
export const AuthContext = createContext()
export const useAuth = () => useContext(AuthContext)

function App() {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('usuario')
    return savedUser ? JSON.parse(savedUser) : null
  })

  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('carrito')
    return savedCart ? JSON.parse(savedCart) : []
  })

  const login = (userData, token) => {
    localStorage.setItem('token', token)
    localStorage.setItem('usuario', JSON.stringify(userData))
    setUser(userData)
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('usuario')
    setUser(null)
  }

  const addToCart = (product, quantity = 1) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id_producto === product.id_producto)
      
      let newCart
      if (existingItem) {
        newCart = prevCart.map(item =>
          item.id_producto === product.id_producto
            ? { ...item, cantidad: item.cantidad + quantity }
            : item
        )
      } else {
        newCart = [...prevCart, { ...product, cantidad: quantity }]
      }
      
      localStorage.setItem('carrito', JSON.stringify(newCart))
      return newCart
    })
  }

  const removeFromCart = (productId) => {
    setCart(prevCart => {
      const newCart = prevCart.filter(item => item.id_producto !== productId)
      localStorage.setItem('carrito', JSON.stringify(newCart))
      return newCart
    })
  }

  const updateCartQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId)
      return
    }
    
    setCart(prevCart => {
      const newCart = prevCart.map(item =>
        item.id_producto === productId ? { ...item, cantidad: quantity } : item
      )
      localStorage.setItem('carrito', JSON.stringify(newCart))
      return newCart
    })
  }

  const clearCart = () => {
    setCart([])
    localStorage.removeItem('carrito')
  }

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      logout, 
      cart, 
      addToCart, 
      removeFromCart,
      updateCartQuantity,
      clearCart
    }}>
      <BrowserRouter>
        <Routes>
          {/* Rutas Públicas */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={
            user ? (user.rol === 'administrador' ? <Navigate to="/admin/dashboard" replace /> : <Navigate to="/dashboard" replace />) : <Login />
          } />
          <Route path="/register" element={user ? <Navigate to="/dashboard" replace /> : <Register />} />
          <Route path="/auth-redirect" element={<AuthRedirect />} />
          
          {/* Dashboard Cliente */}
          <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/login" replace />} />

          {/* Rutas Admin - Solo accesibles si hay usuario logueado Y es administrador */}
          <Route path="/admin/dashboard" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin/productos" element={<ProtectedRoute><Productos /></ProtectedRoute>} />
          <Route path="/admin/categorias" element={<ProtectedRoute><Categorias /></ProtectedRoute>} />
          <Route path="/admin/clientes" element={<ProtectedRoute><Clientes /></ProtectedRoute>} />
          <Route path="/admin/proveedores" element={<ProtectedRoute><Proveedores /></ProtectedRoute>} />
          <Route path="/admin/ventas" element={<ProtectedRoute><Ventas /></ProtectedRoute>} />
          <Route path="/admin/compras" element={<ProtectedRoute><Compras /></ProtectedRoute>} />
          <Route path="/admin/reportes" element={<ProtectedRoute><Reportes /></ProtectedRoute>} />

          {/* Ruta 404 - Al final */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthContext.Provider>
  )
}

export default App