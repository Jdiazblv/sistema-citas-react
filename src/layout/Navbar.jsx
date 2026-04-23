import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUser, FaSignOutAlt } from "react-icons/fa";

import "./Navbar.css";

import perfil from "../assets/perfil.jpg";

function Navbar() {

    const [menuAbierto, setMenuAbierto] = useState(false);
    const navigate = useNavigate();

    // Obtener datos del usuario
    const usuarioGuardado = JSON.parse(
        localStorage.getItem("usuarioRegistrado")
    );

    // Datos individuales
    const nombres = usuarioGuardado?.nombres;
    const apellidos = usuarioGuardado?.apellidos;
    const rol = usuarioGuardado?.rol;
    const documento = usuarioGuardado?.documento;

    // Nombre completo
    const nombreCompleto = `${nombres} ${apellidos}`;

    // Cambiar nombres del rol por unos validos
    let rolMostrar = "";

    if (rol === "adimin") {
        rolMostrar = "Administrador";
    }
    else if (rol === "recepc"){
        rolMostrar = "Recepcionista"
    }

    function cerrarSesion() {
        localStorage.removeItem("usuarioLogueado");
        navigate("/");
    }

    return (

        <nav className="navbar">

            <h2 className="logo">
                Clínica Médica
            </h2>

            {/* Icono usuario desplegable */}
            <div
                className="usuario-icono"
                onClick={() =>
                    setMenuAbierto(!menuAbierto)
                }
            >
                {/* Icono de usuario */ }
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
                        onClick={cerrarSesion}
                    >
                        Cerrar Sesion
                    </button>
                </li>

            </ul>

        </nav>

    );
}

export default Navbar;