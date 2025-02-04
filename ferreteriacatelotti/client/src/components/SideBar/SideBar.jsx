import React from "react";
import { FaHome, FaTh, FaBars } from "react-icons/fa";
import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import ReceiptIcon from "@mui/icons-material/Receipt";
import DescriptionIcon from "@mui/icons-material/Description";
import PeopleIcon from "@mui/icons-material/People";
import LocalMallIcon from "@mui/icons-material/LocalMall";
import AccessibilityIcon from "@mui/icons-material/Accessibility";
import PointOfSaleIcon from "@mui/icons-material/PointOfSale";
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import "./Sidebar.css";

const Sidebar = ({ children }) => {
  const [isOpen, setisOpen] = useState(false);
  const navigate = useNavigate();
  const toggle = () => {
    setisOpen(!isOpen);
  };

  const handlelogout = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:8080/api/users/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (response.status === 200) {
        console.log("Logout exitoso");
        navigate("/");
      } else {
        console.error("Logout fallido", response.status);
      }
    } catch (error) {
      console.error("Error al hacer la solicitud de logout:", error);
    }
  };

  const menuItems = [
    {
      path: "/pedido",
      name: "Pedidos de Compra",
      icon: <ReceiptIcon />,
    },
    {
      path: "/presupuesto",
      name: "Presupuesto",
      icon: <DescriptionIcon />,
    },
    {
      path: "/clientes",
      name: "Clientes",
      icon: <AccessibilityIcon />,
    },
    {
      path: "/productos",
      name: "Productos",
      icon: <LocalMallIcon />,
    },
    {
      path: "/usuarios",
      name: "Usuarios",
      icon: <PeopleIcon />,
    },
    {
      path: "/ventas",
      name: "Ventas",
      icon: <PointOfSaleIcon />,
    },
    {
      path: "/proveedores", 
      name: "Proveedores",
      icon: <LocalShippingIcon/>, 
    },
  ];

  const sidebarClasses = isOpen
    ? "sidebar sidebar-expanded"
    : "sidebar sidebar-collapsed";
  const h2Classes = isOpen ? "logo logo-active" : "logo logo-inactive";
  const linkClass = isOpen
    ? "link_text link_text-inactive"
    : "link_text link_text-active";
  const topSectionClass = isOpen
    ? "top-section top-section__active"
    : "top-section";

  return (
    <div className="container">
      <div className={sidebarClasses}>
  <div className={topSectionClass}>
    {isOpen && (
      <h2 className="sidebar-title" onClick={() => navigate("/")}>
        Ferretería Catelotti
      </h2>
    )}
    <div className="bars" onClick={toggle}>
      <FaBars />
    </div>
  </div>


        {menuItems.map((item, index) => (
          <NavLink
            to={item.path}
            key={index}
            className="link"
            activeclassname="active"
          >
            <div className="icon">{item.icon}</div>
            <div className={linkClass}>{item.name}</div>
          </NavLink>
        ))}

        <div className="logout link" onClick={handlelogout}>
          <div className="icon">
            <FaHome />
          </div>
          <div className={linkClass}>Cerrar Sesión</div>
        </div>
      </div>
      <main>{children}</main>
    </div>
  );
};

export default Sidebar;
