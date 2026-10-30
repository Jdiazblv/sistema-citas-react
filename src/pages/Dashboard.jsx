
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import AdminDashboard from "./Dashboards/AdminDashboard";
import RecepcionistaDashboard from "./Dashboards/RecepcionistaDashboard";
import MedicoDashboard from "./Dashboards/MedicoDashboard";
import PacienteDashboard from "./Dashboards/PacienteDashboard";

import "./Dashboard.css";

function Dashboard() {

    const navigate = useNavigate();

    // Obtener los datos del usuario que inició sesión
    const usuarioGuardado = JSON.parse(
        localStorage.getItem("usuario") || "null"
    );

    const rol = usuarioGuardado?.rol;

    // Verificar que exista una sesión
    useEffect(() => {
        const token = localStorage.getItem("token");
        const usuarioLogueado = localStorage.getItem("usuarioLogueado");

        if (!token || usuarioLogueado !== "true") {
            navigate("/", { replace: true });
        }
    }, [navigate]);

    // Mostrar el panel correspondiente al rol
    switch (rol) {
        case "Administrador":
            return <AdminDashboard />;

        case "Recepcionista":
            return <RecepcionistaDashboard />;

        case "Medico":
            return <MedicoDashboard />;

        case "Paciente":
            return <PacienteDashboard />;

        default:
            return (
                <div className="panel-principal">
                    <h1>Panel Principal</h1>
                    <p>No se reconoce el rol de este usuario.</p>
                </div>
            );
    }
}

export default Dashboard;
