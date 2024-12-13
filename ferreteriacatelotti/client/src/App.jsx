import React from "react";
import PurchaseOrder from "./components/PurchaseOrder/PurchaseOrder";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import SideBar from "./components/SideBar/SideBar";
import Login from "./components/Login/Login";
import "./App.css";
import OrderDetail from "./components/OrderDetail/OrderDetail";
import BudgetComponent from "./components/BudgetComponent/BudgetComponent";
import EditPurchaseOrder from "./components/EditPurchaseOrder/EditPurchaseOrder";
import BudgetDetail from "./components/BudgetDetail/BudgetDetail";
import BudgetDetailLine from "./components/BudgetDetailLine/BudgetDetailLine";
import { OrderProvider } from "./components/context/OrderContext";
import NewClient from "./components/NewClient/NewClient";
import ClientComponent from "./components/ClientComponent/ClientComponent";
import EditClient from "./components/EditClient/EditClient";
import UserComponent from "./components/UserComponent/UserComponent";
import NewUser from "./components/NewUser/NewUser";
import ProductComponent from "./components/ProductComponent/ProductComponent";
import NewProduct from "./components/NewProduct/NewProduct";
import SupplierManagement from "./components/SupplierManagement/SupplierManagement";
import NewSupplier from "./components/NewSupplier/NewSupplier";
import EditProduct from "./components/EditProduct/EditProduct";
import NewDetailOrderLine from "./components/NewDetailOrder/NewDetailOrderLine";
import EditDetailOrderLine from "./components/EditDetailOrderLine/EditDetailOrderLine";
import EditBudgetDetailLine from "./components/EditBudgetDetailLine/EditBudgetDetailLine";
import NewBudget from "./components/NewBudget/NewBudget";
import { BudgetProvider } from "./components/context/BudgetContext";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import RequestResetPassword from "./components/RequestResetPassword/RequestResetPassword";
import ResetPassword from "./components/ResetPassword/ResetPassword";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          {/* Ruta de inicio de sesión fuera del SideBar */}
          <Route path="/iniciosesion" element={<Login />} />
          <Route path="/restablecercontraseña" element={<RequestResetPassword />} />
          <Route path="/cambiarcontraseña" element={<ResetPassword />} />


          {/* Rutas protegidas que necesitan el SideBar */}
          <Route
            path="/*"
            element={
              <OrderProvider>
                <BudgetProvider>
                  <SideBar>
                    <Routes>
                      {/* Rutas de presupuesto */}
                      <Route
                  path="/presupuesto"
                  element={
                    <ProtectedRoute allowedRoles={["Admin", "Empleado"]}>
                      <BudgetComponent />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/presupuesto/agregarpresupuesto"
                  element={
                    <ProtectedRoute allowedRoles={["Admin", "Empleado"]}>
                      <NewBudget />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/presupuesto/agregardetalle"
                  element={
                    <ProtectedRoute allowedRoles={["Admin", "Empleado"]}>
                      <BudgetDetailLine isNewBudget={true} />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/presupuesto/:pid"
                  element={
                    <ProtectedRoute allowedRoles={["Admin", "Empleado"]}>
                      <BudgetDetail />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/presupuesto/:pid/detalle/nuevalinea"
                  element={
                    <ProtectedRoute allowedRoles={["Admin", "Empleado"]}>
                      <BudgetDetailLine isNewBudget={false} />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/presupuesto/:pid/detalle/:rowid"
                  element={
                    <ProtectedRoute allowedRoles={["Admin", "Empleado"]}>
                      <EditBudgetDetailLine />
                    </ProtectedRoute>
                  }
                />

                {/* Rutas de pedido */}
                <Route
                  path="/pedido"
                  element={
                    <ProtectedRoute allowedRoles={["Admin", "Dueño"]}>
                      <PurchaseOrder />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/pedido/agregarpedido"
                  element={
                    <ProtectedRoute allowedRoles={["Admin", "Dueño"]}>
                      <OrderDetail />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/pedido/agregardetalle"
                  element={
                    <ProtectedRoute allowedRoles={["Admin", "Dueño"]}>
                      <NewDetailOrderLine />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/pedido/:pid"
                  element={
                    <ProtectedRoute allowedRoles={["Admin", "Dueño"]}>
                      <EditPurchaseOrder />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/pedido/:pid/detallepedido/nuevalinea"
                  element={
                    <ProtectedRoute allowedRoles={["Admin", "Dueño"]}>
                      <NewDetailOrderLine />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/pedido/:pid/detalle/:rowid"
                  element={
                    <ProtectedRoute allowedRoles={["Admin", "Dueño"]}>
                      <EditDetailOrderLine />
                    </ProtectedRoute>
                  }
                />

                {/* Otras rutas */}
                <Route
                  path="/clientes"
                  element={
                    <ProtectedRoute
                      allowedRoles={["Admin", "Dueño", "Empleado"]}
                    >
                      <ClientComponent />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/clientes/agregarcliente"
                  element={
                    <ProtectedRoute
                      allowedRoles={["Admin", "Dueño", "Empleado"]}
                    >
                      <NewClient />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/clientes/:cid"
                  element={
                    <ProtectedRoute
                      allowedRoles={["Admin", "Dueño", "Empleado"]}
                    >
                      <EditClient />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/usuarios"
                  element={
                    <ProtectedRoute allowedRoles={["Admin"]}>
                      <UserComponent />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/usuarios/agregarusuario"
                  element={
                    <ProtectedRoute allowedRoles={["Admin"]}>
                      <NewUser />
                    </ProtectedRoute>
                  }
                />

                {/* Productos */}
                <Route
                  path="/productos"
                  element={
                    <ProtectedRoute
                      allowedRoles={["Admin", "Empleado", "Dueño"]}
                    >
                      <ProductComponent />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/productos/:pid"
                  element={
                    <ProtectedRoute
                      allowedRoles={["Admin", "Empleado", "Dueño"]}
                    >
                      <EditProduct />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/productos/agregarproducto"
                  element={
                    <ProtectedRoute
                      allowedRoles={["Admin", "Empleado", "Dueño"]}
                    >
                      <NewProduct />
                    </ProtectedRoute>
                  }
                />

                {/* Proveedores */}
                <Route
                  path="/proveedores"
                  element={
                    <ProtectedRoute allowedRoles={["Admin", "Dueño"]}>
                      <SupplierManagement />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/proveedores/agregarproveedor"
                  element={
                    <ProtectedRoute allowedRoles={["Admin", "Dueño"]}>
                      <NewSupplier />
                    </ProtectedRoute>
                  }
                />
                    </Routes>
                  </SideBar>
                </BudgetProvider>
              </OrderProvider>
            }
          />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
