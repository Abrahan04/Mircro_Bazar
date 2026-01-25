Proyecto de Titulación-Micro bazar
Nombre: Jeremy Abrahan Masabanda Paucar
Carrera: Desarrollo de Software
 
Descripcion

Micro Bazar es una aplicación web completa de gestión integral para pequeños negocios minoristas. El sistema permite administrar inventario, gestionar ventas, compras, clientes, proveedores, categorías de productos. Tiene diferentes carpetas como controllers, middlewares, routes, cada una es importante porque se entrelazan entre para comuniicarse, enviar informacion y seguridad en los datos.

# Backend - Micro Bazar AbrahanIsaias

El proyecto está dividido en dos partes principales:

```
Micro_Bazar/
├── backend/          # API REST (Node.js + Express + PostgreSQL)
└── Frontend/         # Interfaz web (React + Tailwind CSS)
```

Configurar variables de entorno:
Crear archivo `.env` en la raz del backend con:
```
JWT_SECRET=tu_clave_secreta_super_segura_12345
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=micro_bazar_Abrahan_Isaias_db
DB_USER=postgres
DB_PASSWORD=12345

 
Crear la base de datos en PostgreSQL (ejecutar el script SQL proporcionado)

El servidor estará disponible en: `http://localhost:3000`

Iniciar el servidor:
```bash
npm run dev

Instalar dependencias:
```bash
npm init -y (package.jason)
npm install express pg dotenv cors bcryptjs jsonwebtoken (Node.js, conector de PostgreSQL, leer variables de entorno (.env), permitir peticiones desde el frontend,Encriptar contraseñas, autenticación con tokens JWT)
npm install --save-dev nodemon (Reiniciar servidor automáticamente)
npm install multer

Tecnologias utilizadas 
se utilzo JavaScript, específicamente usando Node.js con el framework Express.
Lenguaje: JavaScript
Entorno: Node.js
Framework: Express.js
Tipo de código: Backend / API REST


# Frontend

Instalación y Configuración

Instalar Dependencias

```bash
cd Frontend
npm install
npm create vite@latest . -- --template react
npm install react-router-dom axios
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

Iniciar Servidor de Desarrollo

```bash
npm run dev
```

La aplicación estará disponible en: `http://localhost:5173`

Características del Frontend

Página de Inicio
- Visualización de productos disponibles
- Sistema de carrito de compras
- Filtrado por categorías
- Búsqueda de productos

Autenticación
- Login con JWT
- Registro de nuevos usuarios

Panel Administrativo
- **Gestión de Productos:** Crear, editar, eliminar, consultar inventario
- **Gestión de Categorías:** Organizar productos
- **Gestión de Clientes:** Base de datos de clientes
- **Gestión de Proveedores:** Información de proveedores
- **Gestión de Ventas:** Registrar y consultar ventas
- **Gestión de Compras:** Registrar y consultar compras
- **Reportes:** Análisis de ventas, productos más vendidos, bajo stock, etc.