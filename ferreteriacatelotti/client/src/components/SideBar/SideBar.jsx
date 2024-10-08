import React, { children } from "react";
import { FaHome, FaTh, FaBars } from "react-icons/fa";
import { NavLink } from "react-router-dom";
import { useState } from "react";
import ReceiptIcon from '@mui/icons-material/Receipt';
import DescriptionIcon from '@mui/icons-material/Description';
import PeopleIcon from '@mui/icons-material/People';
import LocalMallIcon from '@mui/icons-material/LocalMall';
import AccessibilityIcon from '@mui/icons-material/Accessibility';
import "./Sidebar.css";
const Sidebar = ({ children }) => {
  const [isOpen, setisOpen] = useState(false);
  const toggle = () => {
    setisOpen(!isOpen);
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
      icon: <DescriptionIcon/>,
    },
    {
      path: "/clientes",
      name: "Clientes",
      icon: <AccessibilityIcon/>,
    },
    {
      path: "/productos",
      name: "Productos",
      icon: <LocalMallIcon/>,
    },
    {
      path: "/usuarios",
      name: "Usuarios",
      icon: <PeopleIcon/>,
    }

  ];
  const sidebarClasses = isOpen
    ? "sidebar sidebar-expanded"
    : "sidebar sidebar-collapsed";
  const h2Classes = isOpen ? "logo logo-active" : "logo logo-inactive";
  const linkClass = isOpen
    ? "link_text link_text-inactive"
    : "link_text link_text-active";
  const topSecticonClass = isOpen
    ? "top-section top-section__active"
    : "top-section";
  return (
    <div className="container">
      <div className={sidebarClasses}>
        <div className={topSecticonClass}>
          <h2 className={h2Classes}>Ferreteria Catelotti</h2>
          <div className="bars">
            <FaBars onClick={toggle} />
          </div>
        </div>

        {menuItems.map((item, index) => (
          <NavLink
            to={item.path}
            key={index}
            className="link"
          // Nombre del atributo corregido
          >
            <div className="icon">{item.icon}</div>
            <div className={linkClass}>{item.name}</div>
          </NavLink>
        ))}
      </div>
      <main>{children}</main>
    </div>
  );
};

export default Sidebar;