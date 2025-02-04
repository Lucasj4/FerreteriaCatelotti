# Ferretería Catelotti

Aplicación web para gestionar productos, proveedores, ventas, órdenes de compra y presupuestos de una ferretería. Permite llevar un control de inventario, registrar ventas, gestionar clientes, proveedores, y presupuestos, y realizar seguimiento de órdenes de compra.

## Tecnologías utilizadas

- **Backend**: Node.js, Express.js, Passport (Autenticación), MongoDB
- **Frontend**: React, Vite, MUI (Material UI), React Router, React Select, SweetAlert2
- **Otras herramientas**: JWT (Json Web Token) para autenticación, PDFMake y ExcelJS para generar reportes en PDF y Excel.

## Características

### Backend

- **API RESTful** para gestionar productos, proveedores, categorías, unidades, clientes, órdenes de compra y ventas.
- **Autenticación**: Utiliza JWT y Passport.js para gestionar la autenticación de usuarios.
- **Manejo de errores centralizado** con middleware personalizado.
- **CORS habilitado** para permitir que el frontend se comunique con el backend.
- **Validación de datos** usando Joi.

### Frontend

- **Gestión de productos**: Permite visualizar, agregar, editar y eliminar productos de la ferretería.
- **Gestión de órdenes de compra**: Puedes ver, agregar y modificar órdenes de compra, asociándolas a productos, unidades y proveedores.
- **Gestión de presupuestos**: Permite generar presupuestos, agregar líneas de detalle y administrar el estado de cada presupuesto (Pendiente, Recibido).
- **Interfaz de usuario interactiva**: Utiliza Material UI para una interfaz limpia y moderna.
- **Selección de múltiples opciones**: Usa `react-select` para la selección de productos, proveedores y clientes.
- **Reportes**: Generación de reportes en formato PDF y Excel para productos, ventas y presupuestos.

## Instalación

### Backend (Servidor)

1. Clona este repositorio:
   ```bash
   git clone https://github.com/Lucasj4/FerreteriaCatelotti.git
