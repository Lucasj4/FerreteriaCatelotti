import React, { useEffect } from "react";
import "./HomeComponent.css";
import { FaUser } from "react-icons/fa";
import { Link } from "react-router-dom";
const Home = () => {
  const menuItems = [
    {
      name: "Pedidos de Compra",
      icon: "📄",
      description:
        "Gestiona los pedidos de compra para mantener el inventario siempre abastecido.",
    },
    {
      name: "Presupuesto",
      icon: "💰",
      description:
        "Crea y administra presupuestos personalizados para los clientes.",
    },
    {
      name: "Clientes",
      icon: "👥",
      description:
        "Organiza la información de los clientes para un seguimiento eficiente.",
    },
    {
      name: "Productos",
      icon: "🛒",
      description:
        "Gestiona los productos en el inventario y su disponibilidad.",
    },
    {
      name: "Usuarios",
      icon: "👤",
      description: "Administra los usuarios y sus permisos dentro del sistema.",
    },
    {
      name: "Ventas",
      icon: "💳",
      description:
        "Registra y controla todas las ventas realizadas en la ferretería.",
    },
    {
      name: "Proveedores",
      icon: "🚚",
      description: "Administra los proveedores y sus órdenes de suministro.",
    },
  ];



  return (
    <div className="home-container">
      <nav className="navbar">
        <h1 className="navbar-title">Ferretería Catelotti</h1>
        <div className="login-container">
          <Link to={"iniciosesion"} className="login-button">
            <FaUser className="login-icon" />
            Ingresar
          </Link>
        </div>
      </nav>
      <div className="title-container">
        <div className="title-background">
          <h1 className="title">Bienvenido a Ferretería Catelotti</h1>
          <p>
            Descubre las funcionalidades que tenemos para ayudar a gestionar
            este negocio de forma mas eficiente
          </p>
        </div>
      </div>
      <div className="cards">
        <h2 className="cards-title">Funcionalidades</h2>
        <div className="cards-container">
          {menuItems.map((item, index) => (
            <div key={index} className="card">
              <div className="card-icon">{item.icon}</div>
              <h2 className="card-title">{item.name}</h2>
              <p className="card-description">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
