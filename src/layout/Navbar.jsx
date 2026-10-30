import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUser, FaSignOutAlt } from "react-icons/fa";

import { useAuth } from "../context/AuthContext";

import "./Navbar.css";
import perfil from "../assets/perfil.jpg";

function Navbar() {

    const [menuAbierto, setMenuAbierto] = useState(false);
    const navigate = useNavigate();

    // Obtener los datos y funciones del contexto de autenticación
    const { usuario, cerrarSesion } = useAuth();

    // Datos individuales
    const nombres = usuario?.nombres;
    const apellidos = usuario?.apellidos;
    const rol = usuario?.rol;
    const documento = usuario?.documento;

    // Nombre completo
    // Combinar nombres y apellidos, manejando posibles valores nulos o indefinidos
    const nombreCompleto = [nombres, apellidos]
        .filter(Boolean)
        .join(" ");

    // Mostrar el nombre del rol
    const roles = {
        Administrador: "Administrador",
        Recepcionista: "Recepcionista",
        Medico: "Médico",
        Paciente: "Paciente"
    };

    const rolMostrar = roles[rol] || "Usuario";

    // Función para cerrar sesión
    function manejarCierreSesion() {
        cerrarSesion();
        navigate("/");
    }

    return (

        <nav className="navbar">

            <h2 className="logo">
                Clínica Médica
            </h2>

            {/* Usuario y menú desplegable */}
            <div
                className="usuario-icono"
                onClick={() => setMenuAbierto(!menuAbierto)}
            >
                <span className="nombre-navbar">
                    {nombreCompleto || "Usuario"}
                </span>

                <FaUser />
                
            </div>

            {/* Menu */}
            <ul
                className={
                    menuAbierto ? "menu activo" : "menu"
                }
            >
                {/* Perfil */}

                <div className="perfil">

                    <img 
                        src={perfil}
                        alt="Perfil"
                        className="foto-perfil"
                    />

                    <p className="rol">
                        {rolMostrar}
                    </p>

                    <p className="estado">
                        ● Online
                    </p>

                    <p className="nombre-completo">
                        {nombreCompleto}
                    </p>

                    <p className="id-usuario">
                        ID: {documento}
                    </p>
                </div>

                <li>
                    < FaSignOutAlt />
                    <button 
                        className="btn-logout"
                        onClick={manejarCierreSesion}
                    >
                        Cerrar Sesion
                    </button>
                </li>

            </ul>

        </nav>

    );
}

export default Navbar;