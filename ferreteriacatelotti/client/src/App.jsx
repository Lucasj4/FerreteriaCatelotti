import React from "react";
import PurchaseOrder from "./components/PurchaseOrder/PurchaseOrder";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import SideBar from "./components/SideBar/SideBar";
import Login from "./components/Login/Login";
import "./App.css";
import OrderDetail from "./components/OrderDetail/OrderDetail";
import BudgetComponent from "./components/BudgetComponent/BudgetComponent";
import NewPurchaseOrder from "./components/NewPurchaseOrder/NewPurchaseOrder";
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

function App() {
  return (
    <>
      <BrowserRouter>
        <OrderProvider>
          <SideBar>
            <Routes>
              <Route path="/pedido" element={<PurchaseOrder />} />
              <Route path="/iniciosesion" element={<Login />} />
              <Route path="/detallepedido" element={<OrderDetail />} />
              <Route path="/presupuesto" element={<BudgetComponent />} />
              <Route
                path="/detallepedido/nuevalinea"
                element={<NewPurchaseOrder />}
              />
              <Route
                path="/detallepedido/editarpedido/:id"
                element={<EditPurchaseOrder />}
              />
              <Route path="/detallepresupuesto" element={<BudgetDetail />} />
              <Route
                path="/detallepresupuesto/nuevalinea"
                element={<BudgetDetailLine />}
              />
              <Route path="/clientes/agregarcliente" element={<NewClient />} />
              <Route path="/clientes/editarcliente" element={<EditClient />} />
              <Route path="/clientes" element={<ClientComponent/>} />
              <Route path="/usuarios" element={<UserComponent/>} />
              <Route path="/usuarios/agregarusuario" element={<NewUser />} />
              <Route path="/productos" element={<ProductComponent />} />
              <Route path="/productos/:pid" element={<EditProduct />} />
              <Route path="/productos/agregarproducto" element={<NewProduct/>} />
              <Route path="/proveedores" element={<SupplierManagement />} />
              <Route path="/proveedores/agregarproveedor" element={<NewSupplier/>} />
            </Routes>
          </SideBar>
        </OrderProvider>
      </BrowserRouter>
    </>
  );
}

export default App;
