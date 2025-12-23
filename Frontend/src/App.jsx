import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useState, createContext, useContext } from 'react'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'

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
          <Route path="/" element={<Home />} />
          <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Login />} />
          <Route path="/register" element={user ? <Navigate to="/dashboard" /> : <Register />} />
          <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/login" />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </AuthContext.Provider>
  )
}

export default App