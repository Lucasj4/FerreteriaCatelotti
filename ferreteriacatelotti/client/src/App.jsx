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

function App() {
  return (
    <>
      <BrowserRouter>
        <OrderProvider>
          <BudgetProvider>
            <SideBar>
              <Routes>
                {/* Rutas de presupuesto */}
                <Route path="/presupuesto" element={<BudgetComponent />} />
                <Route path="/presupuesto/agregarpresupuesto" element={<NewBudget />}/>
                <Route path="/presupuesto/agregardetalle" element={<BudgetDetailLine isNewBudget={true}/>}/>
                <Route path="/presupuesto/:pid" element={<BudgetDetail />} />
                <Route path="/presupuesto/:pid/detalle/nuevalinea" element={<BudgetDetailLine isNewBudget={false} />}/>
                <Route path="/presupuesto/:pid/detalle/:rowid" element={<EditBudgetDetailLine />}/>

                {/* Rutas de pedido */}
                <Route path="/pedido" element={<PurchaseOrder />} />
                <Route path="/pedido/:pid" element={<EditPurchaseOrder />} />
                <Route path="/pedido/:pid/detallepedido/nuevalinea" element={<NewDetailOrderLine />}/>
                <Route path="/pedido/:pid/detalle/:rowid" element={<EditDetailOrderLine />}/>
                <Route path="/detallepedido/nuevalinea" element={<NewDetailOrderLine />}/>
                <Route path="/detallepedido" element={<OrderDetail />} />

                {/* Otras rutas */}
                <Route path="/iniciosesion" element={<Login />} />
                <Route path="/clientes" element={<ClientComponent />} />
                <Route path="/clientes/agregarcliente" element={<NewClient />}/>
                <Route path="/clientes/:cid" element={<EditClient />} />
                <Route path="/usuarios" element={<UserComponent />} />
                <Route path="/usuarios/agregarusuario" element={<NewUser />} />
                <Route path="/productos" element={<ProductComponent />} />
                <Route path="/productos/:pid" element={<EditProduct />} />
                <Route path="/productos/agregarproducto" element={<NewProduct />}/>
                <Route path="/proveedores" element={<SupplierManagement />} />
                <Route path="/proveedores/agregarproveedor" element={<NewSupplier />}/>
              </Routes>
            </SideBar>
          </BudgetProvider>
        </OrderProvider>
      </BrowserRouter>
    </>
  );
}

export default App;
