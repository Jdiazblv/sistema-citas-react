
import React, { useState } from "react";
import { NavLink } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

import {
    FaHome,
    FaUserPlus,
    FaCalendarAlt,
    FaCalendarPlus,
    FaCog,
    FaBars,
    FaFileMedical,
    FaUser
} from "react-icons/fa";

import "./Sidebar.css";


function Sidebar() {

    // Estado para abrir/cerrar el menú
    const [abierta, setAbierta] = useState(true);

    // Obtener el usuario autenticado desde el contexto
    const { usuario } = useAuth();

    /// Obtener el rol del usuario autenticado
    const rol = usuario?.rol;

    // Función para abrir o cerrar el menú
    const toggleSidebar = () => {
        setAbierta(!abierta);
    };

    // Opciones del menú según el rol
    const menus = {
        Administrador: [
            { texto: "Inicio", ruta: "/dashboard", icono: <FaHome /> },
            { texto: "Gestión de Usuarios", ruta: "/gestion-usuarios", icono: <FaUserPlus /> },
            { texto: "Gestión de Pacientes", ruta: "/gestion-pacientes", icono: <FaUserPlus /> },
            { texto: "Gestión de Médicos", ruta: "/gestion-medicos", icono: <FaUserPlus /> },
            { texto: "Agendar Cita", ruta: "/agendar-cita", icono: <FaCalendarPlus /> },
            { texto: "Calendario", ruta: "/calendario", icono: <FaCalendarAlt /> },
            { texto: "Configuración", ruta: "/configuracion", icono: <FaCog /> }
        ],

        Recepcionista: [
            { texto: "Inicio", ruta: "/dashboard", icono: <FaHome /> },
            { texto: "Gestión de Pacientes", ruta: "/gestion-pacientes", icono: <FaUserPlus /> },
            { texto: "Gestión de Médicos", ruta: "/gestion-medicos", icono: <FaUserPlus /> },
            { texto: "Agendar Cita", ruta: "/agendar-cita", icono: <FaCalendarPlus /> },
            { texto: "Calendario", ruta: "/calendario", icono: <FaCalendarAlt /> }
        ],

        Medico: [
            { texto: "Inicio", ruta: "/dashboard", icono: <FaHome /> },
            { texto: "Mis Citas", ruta: "/calendario", icono: <FaCalendarAlt /> },
            { texto: "Historias Clínicas", ruta: "/historias-clinicas", icono: <FaFileMedical /> },
            { texto: "Mi Perfil", ruta: "/configuracion", icono: <FaUser /> }
        ],

        Paciente: [
            { texto: "Inicio", ruta: "/dashboard", icono: <FaHome /> },
            { texto: "Mis Citas", ruta: "/calendario", icono: <FaCalendarAlt /> },
            { texto: "Mi Perfil", ruta: "/configuracion", icono: <FaUser /> }
        ]
    };

    // Obtener las opciones correspondientes al rol
    const opcionesMenu = menus[rol] || [];

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
                {opcionesMenu.map((opcion) => (
                    <li key={opcion.ruta}>
                        <NavLink to={opcion.ruta}>
                            {opcion.icono}
                            {abierta && ` ${opcion.texto}`}
                        </NavLink>
                    </li>
                ))}
            </ul>

        </aside>
    );
}

export default Sidebar;
