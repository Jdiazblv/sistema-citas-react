import React from "react";
import { Outlet } from "react-router-dom";

import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import Footer from "./Footer";

import "./Layout.css";

function Layout() {
    
    return (
    <div className="layout-container">

        {/* Navbar superior */}
        <Navbar />

        <div className="layout-body">

        {/* Sidebar lateral */}
        <Sidebar />

        {/* Contenido dinámico */}
        <main className="layout-content">
            <Outlet />
        </main>

        </div>
        {/* Footer inferior */}
        <Footer />
        </div>
    );
}

export default Layout;