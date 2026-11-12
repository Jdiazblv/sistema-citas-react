import React, { useEffect, useState } from "react";
import ListadoGestion from "../componentes/gestion/ListadoGestion";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

export default function GestionMedicos({ listaMedicos, setListaMedicos }) {
    const { usuario } = useAuth();
    const esAdministrador = usuario?.rol === "Administrador";
    const [busqueda, setBusqueda] = useState("");
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        let vigente = true;

        async function obtenerMedicos() {
            try {
                const { data } = await api.get("/medicos");
                if (vigente) setListaMedicos(data);
            } catch (error) {
                if (vigente) setError(error.response?.data?.mensaje || "No fue posible cargar los médicos.");
            } finally {
                if (vigente) setCargando(false);
            }
        }

        obtenerMedicos();
        return () => { vigente = false; };
    }, [setListaMedicos]);

    const texto = busqueda.trim().toLowerCase();
    const filas = (listaMedicos || []).flatMap((medico) => {
        const cuenta = medico.usuarioId;
        if (!cuenta) return [];

        const nombre = [cuenta.nombres, cuenta.apellidos].filter(Boolean).join(" ");
        const especialidades = medico.especialidades?.join(", ") || "";
        const coincide = [nombre, cuenta.documento, especialidades, medico.registroProfesional].some(
            (valor) => String(valor || "").toLowerCase().includes(texto)
        );
        if (!coincide) return [];

        return [{
            id: medico._id,
            celdas: [nombre, especialidades || "Sin especialidades registradas", medico.registroProfesional, cuenta.documento, cuenta.telefono],
            activo: cuenta.activo,
            rutaPerfil: `/perfil-medico/${medico._id}`,
            textoPerfil: esAdministrador ? "Ver / Editar" : "Ver"
        }];
    });

    return (
        <ListadoGestion
            titulo="Gestión de Médicos"
            entidad="médicos"
            rutaNuevo={esAdministrador ? "/registro-medico" : undefined}
            textoNuevo="Nuevo médico"
            busqueda={busqueda}
            setBusqueda={setBusqueda}
            placeholder="Buscar por nombre, documento, especialidad o registro"
            columnas={["Nombre", "Especialidades", "Registro profesional", "Documento", "Teléfono"]}
            filas={filas}
            cargando={cargando}
            error={error}
        />
    );
}
