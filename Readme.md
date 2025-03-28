🛠️ Ferretería Catelotti

Aplicación web para gestionar productos, proveedores, ventas, órdenes de compra y presupuestos de una ferretería. Permite llevar un control de inventario, registrar ventas, gestionar clientes, proveedores y presupuestos, y realizar seguimiento de órdenes de compra.

🚀 Tecnologías Utilizadas

Backend:

🟢 Node.js con Express.js: API REST para la gestión de datos.

🔒 Autenticación con Passport.js y JWT: Seguridad y gestión de usuarios.

🗄️ MongoDB con Mongoose: Base de datos NoSQL.

📡 CORS habilitado: Permite la comunicación entre frontend y backend.

⚠️ Validaciones con Joi: Validación de datos en las rutas del backend.

🛠️ Manejo de errores centralizado con middleware personalizado.

Frontend:

⚛️ React con Vite: Framework principal para la UI.

🎨 Material UI (MUI): Diseño moderno y responsivo.

🔀 React Select: Implementación de selects avanzados para selección múltiple.

⚡ SweetAlert2: Manejo de alertas y notificaciones interactivas.

🌍 React Router: Navegación entre componentes y rutas dinámicas.

📌 Características Principales

🔧 Backend:

📦 Gestión de productos: Agregar, editar y eliminar productos con detalles como nombre, categoría, proveedor y stock.

🏷️ Gestión de proveedores y clientes: Permite agregar, editar y eliminar proveedores y clientes.

📜 Manejo de órdenes de compra: Crear, editar y visualizar órdenes de compra con sus respectivos detalles.

📄 Presupuestos: Generar presupuestos para clientes, asignar productos y gestionar su estado (Pendiente/Facturado).

📊 Reportes: Generación de informes en PDF y Excel sobre productos, ventas y presupuestos.

🔎 Búsqueda avanzada: Filtrado de productos por nombre o categoría.

📆 Manejo de fechas: Formateo correcto de fechas en DD/MM/YYYY.

🎨 Frontend:

🛒 Interfaz intuitiva y moderna con Material UI.

📌 Selección avanzada con react-select para productos, proveedores y clientes.

⚡ Notificaciones interactivas con SweetAlert2.

📄 Gestión de órdenes de compra y presupuestos con estados dinámicos.

📊 Filtros avanzados para visualizar información relevante.

📥 Instalación y Uso

🔧 Requisitos previos

Tener instalado Node.js y MongoDB.

🔧 Instalación del Backend

Clonar el repositorio:

git clone https://github.com/Lucasj4/FerreteriaCatelotti.git
cd FerreteriaCatelotti/backend

Instalar dependencias:

npm install

Configurar variables de entorno (.env en backend):

MONGO_URI=mongodb://localhost:27017/ferreteria
PORT=5000
JWT_SECRET=tu_secreto_jwt

Iniciar el backend:

npm start

🔧 Instalación del Frontend

Ir a la carpeta del frontend:

cd ../frontend

Instalar dependencias:

npm install

Iniciar el frontend:

npm start

📌 Rutas Principales

Backend (API REST)

GET /api/products → Obtener todos los productos

POST /api/products → Agregar un producto

GET /api/orders → Obtener órdenes de compra

PUT /api/orders/:id → Actualizar orden de compra

GET /api/budgets → Obtener presupuestos

PUT /api/budgets/:id → Actualizar presupuesto

Frontend (Rutas en React)

/productos → Vista de productos

/presupuesto → Vista de presupuestos

/presupuesto/:id → Detalles de un presupuesto

/pedido/:id → Detalles de un pedido

/proveedores → Gestión de proveedores

👨‍💻 Autor

📌 Desarrollador: Lucas Juliá
📧 Contacto: lucasfjulia@gmail.com
