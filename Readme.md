# 🛠️ Ferretería Catelotti

[![Deploy en Vercel](https://img.shields.io/badge/Vercel-Online-success?style=for-the-badge&logo=vercel)](https://ferreteria-catelotti.vercel.app/)

Aplicación web para gestionar productos, proveedores, ventas, órdenes de compra y presupuestos de una ferretería. Control de inventario, gestión de clientes y proveedores, generación de presupuestos, seguimiento de órdenes de compra y más.

---

## 🚀 Acceso a la Aplicación

🔗 **Frontend (Vercel):**  
👉 [https://ferreteria-catelotti.vercel.app/](https://ferreteria-catelotti.vercel.app/)

🔑 **Usuario Demo (admin):**

📧 Usuario: admin@admin.com

🔒 Contraseña: Admin123


## 👥 Gestión de Roles

La app cuenta con diferentes roles de usuario, cada uno con distintos permisos:

- 👑 **Dueño**: Acceso total, gestión completa del sistema.
- 🧑‍💼 **Admin**: Gestión de productos, presupuestos, órdenes, etc.
- 👷 **Empleado**: Acceso limitado a ventas y presupuestos.

---

## 🧰 Tecnologías Utilizadas

### 🔧 Backend (`/server`)

- 🟢 **Node.js + Express.js**: API REST
- 🔒 **Passport.js + JWT**: Autenticación segura
- 🗄️ **MongoDB + Mongoose**: Base de datos NoSQL
- ⚠️ **Joi**: Validación de datos
- 🛠️ **Middleware de errores**: Manejo centralizado
- 🌐 **CORS** habilitado

### 🎨 Frontend (`/client`)

- ⚛️ **React + Vite**: UI moderna
- 🎨 **Material UI (MUI)**: Estética responsiva
- 🔀 **React Select**: Selects dinámicos con búsqueda
- ⚡ **SweetAlert2**: Alertas interactivas
- 🌍 **React Router**: Navegación entre vistas

---

## 📌 Funcionalidades Principales

### 🔧 Backend:

- 📦 Gestión de productos: Agregar, editar, eliminar productos (nombre, categoría, proveedor, stock)
- 🏷️ CRUD de proveedores y clientes
- 📜 Órdenes de compra: Crear, editar, visualizar
- 📄 Presupuestos: Crear, editar, cambiar estado (Pendiente / Facturado)
- 📊 Reportes: Exportación en PDF y Excel
- 🔍 Búsqueda avanzada: Por nombre o categoría
- 📆 Fechas en formato DD/MM/YYYY

### 🎨 Frontend:

- 🛒 UI intuitiva y moderna
- 📌 Selects inteligentes con `react-select`
- 📄 Vistas para presupuestos y órdenes
- 📊 Filtros dinámicos y ordenamiento
- ⚡ Notificaciones amigables con SweetAlert2

👨‍💻 Autor
Lucas Juliá
📧 lucasfjulia@gmail.com
