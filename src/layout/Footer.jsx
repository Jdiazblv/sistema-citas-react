import React from "react";

import "./Footer.css";

function Footer() {
    return (
        <footer className="footer-container">

            {/* Información principal */}
            <div className="footer-info">

                <h2 className="footer-title">
                    Sistema de Gestión de Citas Médicas
                </h2>

                <p className="footer-creator">
                    Desarrollado por Jorge Esteban Díaz Bolívar
                </p>

                <p className="footer-program">
                    Proyecto académico - SENA
                    <br />
                    Tecnólogo en Análisis y Desarrollo de Software
                </p>

            </div>

            {/* Separador */}
            <div className="footer-divider"></div>

            {/* Información inferior */}
            <div className="footer-bottom">

                <p>
                    © 2026 Sistema de Gestión de Citas Médicas
                </p>

                <span className="footer-version">
                    Versión 1.0
                </span>

            </div>

        </footer>
    );
}

export default Footer;