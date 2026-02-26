import { useState, useEffect } from 'react'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

function CategoryNavbar({ onSelectCategory, categoriaSeleccionada }) {
  const [categorias, setCategorias] = useState([])

  useEffect(() => {
    const cargarCategorias = async () => {
      try {
        const response = await axios.get(`${API_URL}/categorias`)
        // Asumimos que el backend devuelve las categorías activas
        setCategorias(response.data.categorias || [])
      } catch (error) {
        console.error('Error al cargar categorías:', error)
      }
    }
    cargarCategorias()
  }, [])

  return (
    <nav className="bg-white shadow-sm border-b sticky top-0 z-30">
      <div className="container mx-auto px-4">
        <div className="flex items-center space-x-3 overflow-x-auto py-3 scrollbar-hide">
          {/* Botón para ver "Todas" */}
          <button
            onClick={() => onSelectCategory('')}
            className={`whitespace-nowrap px-5 py-2 rounded-full transition-all duration-200 font-medium text-sm ${
              categoriaSeleccionada === ''
                ? 'bg-[#8B5CF6] text-white shadow-md'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-800'
            }`}
          >
            Todas
          </button>
          
          {/* Lista de categorías dinámicas */}
          {categorias.map((cat) => (
            <button
              key={cat.id_categoria}
              onClick={() => onSelectCategory(cat.id_categoria)}
              className={`whitespace-nowrap px-5 py-2 rounded-full transition-all duration-200 font-medium text-sm ${
                categoriaSeleccionada === cat.id_categoria
                  ? 'bg-[#8B5CF6] text-white shadow-md'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-800'
              }`}
            >
              {cat.nombre_categoria}
            </button>
          ))}
        </div>
      </div>
    </nav>
  )
}

export default CategoryNavbar