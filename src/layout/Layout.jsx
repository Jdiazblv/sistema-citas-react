import React from "react";
import { Outlet } from "react-router-dom";

import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import Footer from "./Footer";

import NavegacionInterna from "../componentes/navegacion/NavegacionInterna";

import "./Layout.css";


function Layout() {
    return (

        <div className="layout-container">

            {/* Barra de navegación superior */}
            <Navbar />

            <div className="layout-body">

                {/* Menú lateral */}
                <Sidebar />

                {/* Contenido de la página actual */}
                <main className="layout-content">

                    {/* Navegación interna */}
                    <NavegacionInterna />

                    {/* Contenido de la página actual */}
                    <Outlet />

                </main>

            </div>

            {/* Pie de página */}
            <Footer />

        </div>

    );
}


export default Layout;