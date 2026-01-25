import { X, Trash2, Plus, Minus, ShoppingBag } from 'lucide-react'
import { useAuth } from '../App'
import { useNavigate } from 'react-router-dom'

function CartModal({ isOpen, onClose }) {
  const { cart, removeFromCart, updateCartQuantity, clearCart, user } = useAuth()
  const navigate = useNavigate()

  if (!isOpen) return null

  const total = cart.reduce((sum, item) => sum + (item.precio_venta * item.cantidad), 0)

  const sendWhatsApp = () => {
    if (cart.length === 0) {
      alert('El carrito está vacío')
      return
    }

    if (!user) {
      alert('⚠️ Debes iniciar sesión o registrarte para hacer un pedido')
      onClose()
      navigate('/login')
      return
    }

    const phoneNumber = import.meta.env.VITE_WHATSAPP_NUMBER || '593939929655'
    let message = 'Nuevo Pedido - Micro Bazar AbrahanIsaias\n\n'
    message += `Cliente: ${user.nombre}\n`
    message += `Email: ${user.email}\n\n`
    message += 'Productos:\n'
    
    cart.forEach(item => {
      message += `• ${item.cantidad}x ${item.nombre_producto} - $${(item.precio_venta * item.cantidad).toFixed(2)}\n`
    })
    
    message += `\nTotal: $${total.toFixed(2)}\n\n`
    message += '¿Pueden confirmar disponibilidad y tiempo de entrega?'
    
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`
    window.open(url, '_blank')
    
    // Opcional: vaciar carrito después de enviar
    // clearCart()
    // onClose()
  }

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl animate-slide-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="gradient-bg p-6 flex justify-between items-center text-white">
          <div className="flex items-center space-x-3">
            <ShoppingBag className="w-8 h-8" />
            <div>
              <h2 className="text-2xl font-bold">Carrito de Compras</h2>
              <p className="text-sm opacity-90">{cart.length} productos</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Cart Items */}
        <div className="p-6 max-h-[50vh] overflow-y-auto">
          {cart.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingBag className="w-20 h-20 mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500 text-lg">Tu carrito está vacío</p>
              <button
                onClick={onClose}
                className="mt-4 text-primary font-semibold hover:underline"
              >
                Continuar comprando
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {cart.map(item => (
                <div 
                  key={item.id_producto} 
                  className="flex items-center space-x-4 p-4 border border-gray-200 rounded-xl hover:shadow-md transition"
                >
                  <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center text-3xl">
                    📦
                  </div>
                  
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-800">{item.nombre_producto}</h4>
                    <p className="text-sm text-gray-500">${parseFloat(item.precio_venta).toFixed(2)} c/u</p>
                    
                    <div className="flex items-center space-x-3 mt-2">
                      <button
                        onClick={() => updateCartQuantity(item.id_producto, item.cantidad - 1)}
                        className="p-1 bg-gray-100 rounded hover:bg-gray-200 transition"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="font-semibold w-8 text-center">{item.cantidad}</span>
                      <button
                        onClick={() => updateCartQuantity(item.id_producto, item.cantidad + 1)}
                        disabled={item.cantidad >= item.stock_actual}
                        className="p-1 bg-gray-100 rounded hover:bg-gray-200 transition disabled:opacity-50"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className="text-xl font-bold text-green-600">
                      ${(item.precio_venta * item.cantidad).toFixed(2)}
                    </p>
                    <button
                      onClick={() => removeFromCart(item.id_producto)}
                      className="mt-2 text-red-500 hover:text-red-700 transition flex items-center space-x-1 text-sm"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Eliminar</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div className="border-t p-6 bg-gray-50">
            <div className="flex justify-between items-center mb-4">
              <span className="text-xl font-semibold">Total:</span>
              <span className="text-3xl font-bold text-green-600">${total.toFixed(2)}</span>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={clearCart}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white py-3 rounded-xl font-semibold transition flex items-center justify-center space-x-2"
              >
                <Trash2 className="w-5 h-5" />
                <span>Vaciar</span>
              </button>
              {user ? (
                <button
                  onClick={sendWhatsApp}
                  className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:shadow-xl text-white py-3 rounded-xl font-semibold transition transform hover:scale-105 flex items-center justify-center space-x-2"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                  </svg>
                  <span>Pedir por WhatsApp</span>
                </button>
              ) : (
                <button
                  onClick={() => {
                    onClose()
                    navigate('/login')
                  }}
                  className="flex-1 bg-gray-400 hover:bg-gray-500 text-white py-3 rounded-xl font-semibold transition flex items-center justify-center space-x-2 cursor-pointer"
                  title="Inicia sesión para hacer un pedido"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                  </svg>
                  <span>Inicia Sesión para Pedir</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default CartModal