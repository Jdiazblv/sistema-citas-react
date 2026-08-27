import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { FaHome, FaUserPlus, FaCalendarAlt, FaCalendarPlus, FaCog, FaBars } from "react-icons/fa";
import "./Sidebar.css";

function Sidebar() {
    // Estado para abrir/cerrar
    
    const [abierta, setAbierta] = useState(true);

    // Función toggle
    const toggleSidebar = () => {
    setAbierta(!abierta);
    };

    return (

        <aside className={abierta ? "sidebar abierta" : "sidebar cerrada"}>

        {/* Botón hamburguesa */}
        <button className="btn-toggle" onClick={toggleSidebar}>
            <FaBars />
        </button>

        <h3 className="titulo-menu">
            {abierta ? "Menú" : ""}
        </h3>

        <ul>

            <li>
                <NavLink to="/dashboard">
                    <FaHome />
                    {abierta && " Inicio"}
                </NavLink>
            </li>

            <li>
                <NavLink to="/gestion-usuarios">
                    <FaUserPlus />
                    {abierta && " Gestión de Usuarios"}
                </NavLink>
            </li>

            <li>
                <NavLink to="/gestion-pacientes">
                    <FaUserPlus />
                    {abierta && " Gestión de Pacientes"}
                </NavLink>
            </li>

            <li>
                <NavLink to="/gestion-medicos">
                    <FaUserPlus />
                    {abierta && " Gestión de Médicos"}
                </NavLink>
            </li>

            <li>
                <NavLink to="/agendar-cita">
                    <FaCalendarPlus />
                    {abierta && " Agendar Cita"}
                </NavLink>
            </li>

            <li>
                <NavLink to="/calendario">
                    <FaCalendarAlt />
                    {abierta && " Calendario"}
                </NavLink>
            </li>

            <li>
                <NavLink to="/configuracion">
                    <FaCog />
                    {abierta && " Configuración"}
                </NavLink>
            </li>

        </ul>

        </aside>
    );
}

export default Sidebar;