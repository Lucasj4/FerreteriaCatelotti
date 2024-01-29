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
              <Route path="/detallepedido/nuevalinea" element={<NewPurchaseOrder />} />
              <Route path="/editarpedido" element={<EditPurchaseOrder />} />
              <Route path="/detallepresupuesto" element={<BudgetDetail />} />
              <Route
                path="/detallepresupuesto/nuevalinea"
                element={<BudgetDetailLine />}
              />
            </Routes>
          </SideBar>
        </OrderProvider>
      </BrowserRouter>
    </>
  );
}

export default App;
