import React, { useEffect, useState } from "react";
import ListadoGestion from "../componentes/gestion/ListadoGestion";
import api from "../services/api";

export default function GestionPacientes({ listaPacientes, setListaPacientes }) {
    const [busqueda, setBusqueda] = useState("");
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        let vigente = true;

        async function obtenerPacientes() {
            try {
                const { data } = await api.get("/pacientes");
                if (vigente) setListaPacientes(data);
            } catch (error) {
                if (vigente) setError(error.response?.data?.mensaje || "No fue posible cargar los pacientes.");
            } finally {
                if (vigente) setCargando(false);
            }
        }

        obtenerPacientes();
        return () => { vigente = false; };
    }, [setListaPacientes]);

    const texto = busqueda.trim().toLowerCase();
    const filas = (listaPacientes || []).flatMap((paciente) => {
        const usuario = paciente.usuarioId;
        if (!usuario) return [];

        const nombre = [usuario.nombres, usuario.apellidos].filter(Boolean).join(" ");
        const documento = String(usuario.documento || "");
        if (!nombre.toLowerCase().includes(texto) && !documento.toLowerCase().includes(texto)) return [];

        return [{
            id: paciente._id,
            celdas: [nombre, paciente.eps?.trim() || "Sin EPS registrada", documento, usuario.telefono],
            activo: usuario.activo,
            rutaPerfil: `/perfil-paciente/${paciente._id}`
        }];
    });

    return (
        <ListadoGestion
            titulo="Gestión de Pacientes"
            entidad="pacientes"
            rutaNuevo="/registro-paciente"
            textoNuevo="Nuevo paciente"
            busqueda={busqueda}
            setBusqueda={setBusqueda}
            placeholder="Buscar por nombre o documento"
            columnas={["Nombre", "EPS", "Documento", "Teléfono"]}
            filas={filas}
            cargando={cargando}
            error={error}
        />
    );
}
