import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./AuthContext";

function RutaProtegida({ rolesPermitidos }) {

    // Obtener el estado de autenticación y el usuario
    const { autenticado, usuario } = useAuth();

    // Verificar si existe una sesión
    if (!autenticado) {
        return <Navigate to="/" replace />;
    }

    // Verificar si el rol tiene permiso
    if (
        rolesPermitidos &&
        !rolesPermitidos.includes(usuario?.rol)
    ) {
        return <Navigate to="/dashboard" replace />;
    }

    return <Outlet />;
}

export default RutaProtegida;