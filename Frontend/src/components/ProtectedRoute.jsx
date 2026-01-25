import { Navigate } from 'react-router-dom'
import { useAuth } from '../App'

function ProtectedRoute({ children, requiredRole = 'administrador' }) {
  const { user } = useAuth()
  
  // Si el contexto no tiene user, verificar localStorage
  let currentUser = user
  if (!currentUser) {
    const usuarioGuardado = localStorage.getItem('usuario')
    if (usuarioGuardado) {
      try {
        currentUser = JSON.parse(usuarioGuardado)
      } catch (error) {
        console.error('Error al parsear usuario:', error)
      }
    }
  }

  if (!currentUser) {
    return <Navigate to="/login" replace />
  }

  if (currentUser.rol !== requiredRole) {
    return <Navigate to="/" replace />
  }

  return children
}

export default ProtectedRoute
