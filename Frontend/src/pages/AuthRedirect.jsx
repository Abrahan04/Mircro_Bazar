import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

function AuthRedirect() {
  const navigate = useNavigate()

  useEffect(() => {
    // Obtener usuario de localStorage
    const usuarioGuardado = localStorage.getItem('usuario')
    
    if (usuarioGuardado) {
      try {
        const usuario = JSON.parse(usuarioGuardado)
        
        if (usuario.rol === 'administrador') {
          navigate('/admin/dashboard', { replace: true })
        } else {
          navigate('/dashboard', { replace: true })
        }
      } catch (error) {
        navigate('/', { replace: true })
      }
    } else {
      navigate('/', { replace: true })
    }
  }, [navigate])

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600">Redirigiendo...</p>
      </div>
    </div>
  )
}

export default AuthRedirect
