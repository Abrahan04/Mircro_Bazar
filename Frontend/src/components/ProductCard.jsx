import { ShoppingCart, Eye } from 'lucide-react'
import { useState } from 'react'
import { useAuth } from '../App'

function ProductCard({ product }) {
  const [quantity, setQuantity] = useState(1)
  const { addToCart } = useAuth()

  const handleAddToCart = () => {
    if (quantity > 0 && quantity <= product.stock_actual) {
      addToCart(product, quantity)
      setQuantity(1)
      
      // Mostrar notificación
      alert('✅ Producto agregado al carrito')
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden card-hover animate-fade-in group">
      {/* Imagen del producto */}
      <div className="relative h-56 bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center overflow-hidden">
        {product.imagen_url ? (
          <img 
            src={`http://localhost:3000${product.imagen_url}`}
            alt={product.nombre_producto}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
        ) : (
          <span className="text-7xl transform group-hover:scale-110 transition-transform duration-300">
            📦
          </span>
        )}
        
        {/* Badge de stock */}
        <div className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-semibold ${
          product.stock_actual > product.stock_minimo 
            ? 'bg-green-500 text-white' 
            : 'bg-red-500 text-white'
        }`}>
          Stock: {product.stock_actual}
        </div>
      </div>

      {/* Contenido */}
      <div className="p-5">
        <p className="text-xs text-primary font-semibold mb-1">
          {product.nombre_categoria || 'Sin categoría'}
        </p>
        <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-2">
          {product.nombre_producto}
        </h3>
        <p className="text-sm text-gray-600 mb-4 line-clamp-2 h-10">
          {product.descripcion || 'Sin descripción'}
        </p>

        {/* Precio */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-3xl font-bold text-green-600">
            ${parseFloat(product.precio_venta).toFixed(2)}
          </span>
        </div>

        {/* Cantidad y botón */}
        <div className="flex gap-2">
          <input
            type="number"
            min="1"
            max={product.stock_actual}
            value={quantity}
            onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
            className="w-20 px-3 py-2 border-2 border-gray-200 rounded-lg text-center focus:border-primary focus:outline-none"
          />
          <button
            onClick={handleAddToCart}
            disabled={product.stock_actual === 0}
            className="flex-1 bg-gradient-to-r from-primary to-secondary text-white py-2 rounded-lg font-semibold hover:shadow-xl transition-all duration-300 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            <ShoppingCart className="w-5 h-5" />
            <span>{product.stock_actual > 0 ? 'Agregar' : 'Agotado'}</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProductCard