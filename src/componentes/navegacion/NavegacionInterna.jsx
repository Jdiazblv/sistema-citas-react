import React from "react";

import {
    Link,
    useLocation,
    useNavigate
} from "react-router-dom";

import {
    FaHome,
    FaChevronRight,
    FaArrowLeft
} from "react-icons/fa";

import "./NavegacionInterna.css";

import rutasNavegacion from "./RutasNavegacion";


function NavegacionInterna({ titulo, rutaAnterior }) {

    const navigate = useNavigate();
    const location = useLocation();


    // Obtener la configuración de navegación de la página actual
    const rutaBase = location.pathname
        .split("/")
        .filter(Boolean)[0];

    const rutaConfiguracion = rutaBase
        ? `/${rutaBase}`
        : "/dashboard";

    const configuracion = rutasNavegacion[rutaConfiguracion] || {};


    // Regresar a la sección anterior definida
    const volver = () => {

        navigate(
            rutaAnterior ||
            configuracion.rutaAnterior ||
            "/dashboard"
        );

    };


    return (

        <div className="navegacion-interna">

            {/* Migas de pan */}
            <div className="navegacion-migas">

                <Link
                    to="/dashboard"
                    className="navegacion-inicio"
                >
                    <FaHome />
                    <span>Inicio</span>
                </Link>


                {(configuracion.migas || []).map((miga, index) => (

                    <React.Fragment key={index}>

                        <FaChevronRight className="navegacion-separador" />


                        {miga.ruta ? (

                            <Link
                                to={miga.ruta}
                                className="navegacion-anterior"
                            >
                                {miga.nombre}
                            </Link>

                        ) : (

                            <span className="navegacion-actual">
                                {titulo || miga.nombre}
                            </span>

                        )}

                    </React.Fragment>

                ))}

            </div>


            {/* Acciones de navegación */}
            {location.pathname !== "/dashboard" && (

                <div className="navegacion-acciones">

                    <button
                        className="navegacion-btn volver"
                        onClick={volver}
                        type="button"
                    >
                        <FaArrowLeft />
                        Volver
                    </button>


                    <Link
                        to="/dashboard"
                        className="navegacion-btn inicio"
                    >
                        <FaHome />
                        Inicio
                    </Link>

                </div>

            )}

        </div>

    );

}


export default NavegacionInterna;