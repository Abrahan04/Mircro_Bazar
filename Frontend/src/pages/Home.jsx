import { useState, useEffect } from 'react'
import axios from 'axios'
import Navbar from "../components/Navbar.jsx";
import ProductCard from "../components/ProductCard.jsx";
import { Search, TrendingUp, Sparkles } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

function Home() {
  const [categories, setCategories] = useState([])
  const [products, setProducts] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])
  const [selectedCategoryId, setSelectedCategoryId] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    filterProducts()
  }, [products, selectedCategoryId, searchTerm])

  const loadData = async () => {
    try {
      const [categoriesRes, productsRes] = await Promise.all([
        axios.get(`${API_URL}/categorias`),
        axios.get(`${API_URL}/productos`)
      ])

      setCategories(categoriesRes.data.categorias.map(cat => ({
        ...cat,
        cantidad: productsRes.data.productos.filter(p => p.id_categoria === cat.id_categoria && p.estado).length
      })))
      
      setProducts(productsRes.data.productos.filter(p => p.estado))
      setLoading(false)
    } catch (error) {
      console.error('Error al cargar datos:', error)
      setLoading(false)
    }
  }

  const filterProducts = () => {
    let filtered = products

    if (selectedCategoryId) {
      filtered = filtered.filter(p => p.id_categoria === parseInt(selectedCategoryId))
    }

    if (searchTerm) {
      filtered = filtered.filter(p =>
        p.nombre_producto.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.codigo_producto.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    setFilteredProducts(filtered)
  }

  // Helper para obtener el nombre de la categoría seleccionada para el título
  const selectedCategoryName = categories.find(c => c.id_categoria === parseInt(selectedCategoryId))?.nombre_categoria

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#8B5CF6] to-[#6366F1] text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="text-center animate-fade-in">
            <div className="flex items-center justify-center mb-4">
              <Sparkles className="w-8 h-8 mr-2 animate-bounce-slow" />
              <h1 className="text-6xl font-bold">
                ¡Bienvenido!
              </h1>
              <Sparkles className="w-8 h-8 ml-2 animate-bounce-slow" />
            </div>
            <p className="text-xl opacity-90 mt-4">
              Tu centro de productos increíbles
            </p>
            <div className="mt-8 flex justify-center gap-4">
              <div className="flex items-center space-x-2 bg-white bg-opacity-20 px-6 py-3 rounded-xl backdrop-blur-sm">
                <TrendingUp className="w-5 h-5" />
                <span className="font-semibold">Flujo de Caja</span>
              </div>
              <div className="flex items-center space-x-2 bg-white bg-opacity-20 px-6 py-3 rounded-xl backdrop-blur-sm">
                <Sparkles className="w-5 h-5" />
                <span className="font-semibold">Listados de Productos</span>
              </div>
              <div className="flex items-center space-x-2 bg-white bg-opacity-20 px-6 py-3 rounded-xl backdrop-blur-sm">
                <Sparkles className="w-5 h-5" />
                <span className="font-semibold">Hecho con CSS</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Search Bar */}
      <section className="max-w-7xl mx-auto px-4 -mt-8 relative z-20">
        <div className="bg-white rounded-2xl shadow-2xl p-6 animate-fade-in">
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Buscar productos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:border-[#8B5CF6] focus:outline-none text-lg"
              />
            </div>
            <button 
              onClick={() => setSearchTerm('')}
              className="px-8 py-4 bg-gradient-to-r from-[#8B5CF6] to-[#6366F1] text-white rounded-xl font-semibold hover:shadow-xl transition-all duration-300"
            >
              Limpiar
            </button>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-12 flex flex-col lg:flex-row gap-8">
        {/* Sidebar de Categorías (Vertical) */}
        <aside className="w-full lg:w-64 flex-shrink-0">
          <div className="bg-white rounded-xl shadow-lg p-6 sticky top-24 animate-fade-in">
            <h3 className="font-bold text-xl mb-6 text-gray-800 flex items-center gap-2">
              <TrendingUp size={20} className="text-[#8B5CF6]" />
              Categorías
            </h3>
            <div className="flex flex-col space-y-2">
              <button
                onClick={() => setSelectedCategoryId('')}
                className={`text-left px-4 py-3 rounded-lg transition-all duration-200 font-medium flex justify-between items-center ${
                  selectedCategoryId === ''
                    ? 'bg-gradient-to-r from-[#8B5CF6] to-[#6366F1] text-white shadow-md'
                    : 'hover:bg-gray-50 text-gray-600'
                }`}
              >
                <span>Todas</span>
                {selectedCategoryId === '' && <Sparkles size={16} />}
              </button>
              
              {categories.map(cat => (
                <button
                  key={cat.id_categoria}
                  onClick={() => setSelectedCategoryId(cat.id_categoria)}
                  className={`text-left px-4 py-3 rounded-lg transition-all duration-200 font-medium flex justify-between items-center ${
                    parseInt(selectedCategoryId) === cat.id_categoria
                      ? 'bg-gradient-to-r from-[#8B5CF6] to-[#6366F1] text-white shadow-md'
                      : 'hover:bg-gray-50 text-gray-600'
                  }`}
                >
                  <span>{cat.nombre_categoria}</span>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    parseInt(selectedCategoryId) === cat.id_categoria
                      ? 'bg-white bg-opacity-20 text-white'
                      : 'bg-gray-100 text-gray-500'
                  }`}>
                    {cat.cantidad}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Products Grid */}
        <section className="flex-1 pb-20">
          <div className="mb-8 animate-fade-in">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              {selectedCategoryName || 'Todos los Productos'}
            </h2>
            <p className="text-gray-600">
              {filteredProducts.length} productos encontrados
            </p>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                No se encontraron productos
              </h3>
              <p className="text-gray-600">
                Intenta con otra búsqueda o categoría
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {filteredProducts.map(product => (
                <ProductCard key={product.id_producto} product={product} />
              ))}
            </div>
          )}
        </section>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h3 className="text-3xl font-bold mb-4 bg-gradient-to-r from-[#8B5CF6] to-[#6366F1] bg-clip-text text-transparent">
            Micro Bazar AbrahanIsaias
          </h3>
          <p className="text-gray-400 mb-6">
            Los mejores productos a tu alcance
          </p>
          <div className="border-t border-gray-800 pt-6 mt-6">
            <p className="text-sm text-gray-500">
              &copy; 2025 Micro Bazar AbrahanIsaias - Todos los derechos reservados
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Desarrollado por <span className="text-[#8B5CF6] font-semibold">Jeremy Masabanda</span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Home