import React, { useState, useEffect } from "react";
import api from "../services/api";
import ListadoGestion from "../componentes/gestion/ListadoGestion";

function GestionUsuarios({ listaUsuarios, setListaUsuarios }) {
    const [busqueda, setBusqueda] = useState("");
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        let vigente = true;
        api.get("/users").then(({ data }) => {
            if (vigente) setListaUsuarios(data);
        }).catch(error => {
            if (vigente) setError(error.response?.data?.mensaje || "No fue posible cargar los usuarios.");
        }).finally(() => { if (vigente) setCargando(false); });
        return () => { vigente = false; };
    }, [setListaUsuarios]);

    const texto = busqueda.trim().toLowerCase();
    const filas = (listaUsuarios || []).flatMap((cuenta) => {
        const nombre = [cuenta.nombres, cuenta.apellidos].filter(Boolean).join(" ");
        const coincide = [nombre, cuenta.documento, cuenta.correo, cuenta.rol].some(
            (valor) => String(valor || "").toLowerCase().includes(texto)
        );
        if (!coincide) return [];

        return [{
            id: cuenta._id,
            celdas: [nombre, cuenta.rol, cuenta.documento, cuenta.telefono],
            activo: cuenta.activo,
            rutaPerfil: `/perfil-usuario/${cuenta._id}`
        }];
    });

    return (
        <ListadoGestion
            titulo="Gestión de Usuarios"
            entidad="usuarios"
            rutaNuevo="/RegistroUsuario"
            textoNuevo="Nuevo usuario"
            busqueda={busqueda}
            setBusqueda={setBusqueda}
            placeholder="Buscar por nombre, documento, correo o rol"
            columnas={["Nombre", "Rol", "Documento", "Teléfono"]}
            filas={filas}
            cargando={cargando}
            error={error}
        />
    );
}

export default GestionUsuarios;
