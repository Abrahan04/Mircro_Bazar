import { useState, useEffect } from 'react'
import axios from 'axios'
import Navbar from "../components/Navbar.jsx";
import ProductCard from "../components/ProductCard.jsx";
import CategoryCard from "../components/CategoryCard.jsx";
import { Search, TrendingUp, Sparkles } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

function Home() {
  const [categories, setCategories] = useState([])
  const [products, setProducts] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    filterProducts()
  }, [products, selectedCategory, searchTerm])

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

    if (selectedCategory) {
      filtered = filtered.filter(p => p.id_categoria === selectedCategory.id_categoria)
    }

    if (searchTerm) {
      filtered = filtered.filter(p =>
        p.nombre_producto.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.codigo_producto.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    setFilteredProducts(filtered)
  }

  const handleCategoryClick = (category) => {
    setSelectedCategory(selectedCategory?.id_categoria === category.id_categoria ? null : category)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Hero Section */}
      <section className="gradient-bg text-white py-20 relative overflow-hidden">
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
                className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none text-lg"
              />
            </div>
            <button 
              onClick={() => setSearchTerm('')}
              className="px-8 py-4 bg-gradient-to-r from-primary to-secondary text-white rounded-xl font-semibold hover:shadow-xl transition-all duration-300"
            >
              Limpiar
            </button>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-4xl font-bold text-gray-800 mb-3">Categorías</h2>
          <p className="text-gray-600 text-lg">Explora nuestros productos por categoría</p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-12">
            {categories.map(category => (
              <CategoryCard
                key={category.id_categoria}
                category={category}
                onClick={handleCategoryClick}
                isActive={selectedCategory?.id_categoria === category.id_categoria}
              />
            ))}
          </div>
        )}

        {selectedCategory && (
          <div className="mb-8 p-4 bg-gradient-to-r from-primary to-secondary text-white rounded-xl shadow-lg animate-slide-in">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold">
                  {selectedCategory.nombre_categoria}
                </h3>
                <p className="opacity-90">
                  {filteredProducts.length} productos disponibles
                </p>
              </div>
              <button
                onClick={() => setSelectedCategory(null)}
                className="bg-white bg-opacity-20 hover:bg-opacity-30 px-6 py-2 rounded-lg transition"
              >
                Ver todos
              </button>
            </div>
          </div>
        )}
      </section>

      {/* Products Grid */}
      <section className="max-w-7xl mx-auto px-4 pb-20">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-4xl font-bold text-gray-800 mb-3">
            {selectedCategory ? selectedCategory.nombre_categoria : 'Todos los Productos'}
          </h2>
          <p className="text-gray-600 text-lg">
            {filteredProducts.length} productos encontrados
          </p>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-8xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">
              No se encontraron productos
            </h3>
            <p className="text-gray-600">
              Intenta con otra búsqueda o categoría
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map(product => (
              <ProductCard key={product.id_producto} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h3 className="text-3xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
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
              Desarrollado por <span className="text-primary font-semibold">Jeremy Masabanda</span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Home