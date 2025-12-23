function CategoryCard({ category, onClick, isActive }) {
  return (
    <button
      onClick={() => onClick(category)}
      className={`flex flex-col items-center p-6 rounded-2xl transition-all duration-300 ${
        isActive 
          ? 'gradient-bg text-white shadow-2xl scale-105' 
          : 'bg-white hover:shadow-xl hover:-translate-y-1'
      }`}
    >
      <div className={`w-20 h-20 rounded-full flex items-center justify-center text-4xl mb-3 ${
        isActive ? 'bg-white bg-opacity-20' : 'bg-gradient-to-br from-blue-100 to-purple-100'
      }`}>
        {category.icono || '📦'}
      </div>
      <h3 className={`font-bold text-center ${isActive ? 'text-white' : 'text-gray-800'}`}>
        {category.nombre_categoria}
      </h3>
      {category.cantidad && (
        <p className={`text-sm mt-1 ${isActive ? 'text-white opacity-90' : 'text-gray-500'}`}>
          ({category.cantidad} productos)
        </p>
      )}
    </button>
  )
}

export default CategoryCard