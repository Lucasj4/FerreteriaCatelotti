import React, { useState, useEffect } from "react";
import "./InsideHome.css";

const Home = () => {
  const [budgetCount, setBudgetCount] = useState(null);
  const [clientCount, setClientCount] = useState(null);
  const [productCount, setProductCount] = useState(null);
  const [userCount, setUserCount] = useState(null);
  const [saleCount, setSaleCount] = useState(null);
  const [supplierCount, setSupplierCount] = useState(null);

  useEffect(() => {
    const fetchData = async (url, setter) => {
      try {
        const response = await fetch(url, { credentials: "include" });

        if (response.ok) {
          const data = await response.json();
          setter(data.count);
        }
      } catch (error) {
        console.error(`Error obteniendo los datos desde ${url}:`, error);
      }
    };

    fetchData("http://localhost:8080/api/budgets/count", setBudgetCount);
    fetchData("http://localhost:8080/api/clients/count", setClientCount);
    fetchData("http://localhost:8080/api/products/count", setProductCount);
    fetchData("http://localhost:8080/api/users/count", setUserCount);
    fetchData("http://localhost:8080/api/sales/count", setSaleCount);
    fetchData("http://localhost:8080/api/suppliers/count", setSupplierCount);
  }, []);

  const indicators = [
    { name: "Presupuestos", icon: "📄", value: budgetCount },
    { name: "Clientes", icon: "👥", value: clientCount },
    { name: "Productos", icon: "🛒", value: productCount },
    { name: "Usuarios", icon: "👤", value: userCount },
    { name: "Ventas", icon: "💳", value: saleCount },
    { name: "Proveedores", icon: "🚚", value: supplierCount },
  ];

  return (
    <div className="home-container">
    <h2 className="home-title">Ferreteria Catelotti</h2>
      <div className="indicators-container">
        {indicators.map((item, index) => (
          <div key={index} className="indicator-card">
            <div className="indicator-icon">{item.icon}</div>
            <div className="indicator-content">
              <h2 className="indicator-title">{item.name}</h2>
              <p className="indicator-value">
                {item.value !== null ? item.value : <span className="loader"></span>}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
