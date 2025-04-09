🛠️ Ferretería Catelotti

Aplicación web para gestionar productos, proveedores, ventas, órdenes de compra y presupuestos de una ferretería. Permite llevar un control de inventario, registrar ventas, gestionar clientes, proveedores y presupuestos, y realizar seguimiento de órdenes de compra.

🚀 Tecnologías Utilizadas

Backend (📁 server/)

🟢 Node.js con Express.js: API REST para la gestión de datos.

🔒 Autenticación con Passport.js y JWT: Seguridad y gestión de usuarios.

🗄️ MongoDB con Mongoose: Base de datos NoSQL.

📡 CORS habilitado: Permite la comunicación entre frontend y backend.

⚠️ Validaciones con Joi: Validación de datos en las rutas del backend.

🛠️ Manejo de errores centralizado con middleware personalizado.

Frontend (📁 client/)

⚛️ React con Vite: Framework moderno para la UI.

🎨 Material UI (MUI): Diseño moderno y responsivo.

🔀 React Select: Selects avanzados con búsqueda y selección múltiple.

⚡ SweetAlert2: Alertas y notificaciones interactivas.

🌍 React Router: Navegación entre vistas y rutas dinámicas.

📌 Características Principales

🔧 Backend:

📦 Gestión de productos: Agregar, editar y eliminar productos con detalles como nombre, categoría, proveedor y stock.

🏷️ Gestión de proveedores y clientes: CRUD completo.

📜 Manejo de órdenes de compra: Crear, editar y visualizar órdenes con sus detalles.

📄 Presupuestos: Generar presupuestos para clientes, asignar productos, cambiar estado (Pendiente / Facturado).

📊 Reportes: Generación de informes en PDF y Excel.

🔎 Búsqueda avanzada: Filtros por nombre o categoría.

📆 Manejo de fechas: Formato DD/MM/YYYY.

🎨 Frontend:

🛒 Interfaz intuitiva y moderna con Material UI.

📌 Selects dinámicos con react-select para productos, proveedores y clientes.

⚡ Notificaciones con SweetAlert2.

📄 Gestión visual de presupuestos y órdenes de compra.

📊 Filtros dinámicos y ordenamiento de información.

📁 Estructura del Proyecto
El proyecto está dividido en dos carpetas principales:

FerreteriaCatelotti/
│
├── client/     # Frontend (React + Vite)
└── server/     # Backend (Node.js + Express + MongoDB)


📥 Instalación y Uso

🔧 Requisitos Previos

Tener instalado Node.js y MongoDB.

Acceso a un archivo .env para configuración del backend (ver ejemplo abajo).

🚀 Clonar el Repositorio

git clone https://github.com/Lucasj4/FerreteriaCatelotti.git

cd FerreteriaCatelotti

🛠️ Instalación del Backend (📁 server)

cd server

npm install

📄 Crear archivo .env
Dentro de la carpeta server/, crear un archivo llamado .env con el siguiente contenido:

PORT=8080

MONGO_URI="mongodb+srv://lucasfjulia:Lebronjames23@cluster0.k62q89m.mongodb.net/ferrete

Iniciar el backend:

npm start

🎨 Instalación del Frontend (📁 client)

El frontend está desarrollado con React + Vite. Vite se instala automáticamente con las dependencias del proyecto.

cd ../client

npm install

npm run dev

💡 Nota: No es necesario instalar Vite globalmente. Se ejecuta mediante el script npm run dev.

📌 Rutas Principales

🌐 Backend (API REST)

GET /api/products → Obtener todos los productos

POST /api/products → Agregar un producto

GET /api/orders → Obtener órdenes de compra

PUT /api/orders/:id → Actualizar orden de compra

GET /api/budgets → Obtener presupuestos

PUT /api/budgets/:id → Actualizar presupuesto

🖥️ Frontend (Rutas en React)

/productos → Vista de productos

/presupuesto → Vista de presupuestos

/presupuesto/:id → Detalles de un presupuesto

/pedido/:id → Detalles de un pedido

/proveedores → Gestión de proveedores

👨‍💻 Autor
Desarrollador: Lucas Juliá
📧 Contacto: lucasfjulia@gmail.com