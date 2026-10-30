import React, { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";

import "./PerfilUsuario.css";

function PerfilUsuario() {

    const { id } = useParams();
    const navigate = useNavigate();

    const [usuario, setUsuario] = useState(null);
    const [editando, setEditando] = useState(false);
    const [cargando, setCargando] = useState(true);
    const [guardando, setGuardando] = useState(false);

    // Obtener información del usuario
    const obtenerUsuario = useCallback(async () => {

        try {

            setCargando(true);

            const respuesta = await api.get(`/users/${id}`);

            setUsuario(respuesta.data);

        } catch (error) {

            console.error("Error al obtener el usuario:", error);

            alert(
                error.response?.data?.message ||
                "No se pudo cargar el usuario."
            );

        } finally {

            setCargando(false);

        }

    }, [id]);

    // Actualizar información del usuario
    const guardarCambios = async (e) => {

        e.preventDefault();

        try {

            setGuardando(true);

            await api.put(`/users/${id}`, usuario);

            await obtenerUsuario();

            setEditando(false);

            alert("Usuario actualizado correctamente.");

        } catch (error) {

            console.error("Error al actualizar el usuario:", error);

            alert(
                error.response?.data?.message ||
                "No se pudieron guardar los cambios."
            );

        } finally {

            setGuardando(false);

        }

    };

    // Cancelar edición
    const cancelarEdicion = () => {

        obtenerUsuario();

        setEditando(false);

    };

    // Actualizar campos del usuario
    const actualizarCampo = (campo, valor) => {

        setUsuario({
            ...usuario,
            [campo]: valor
        });

    };

    // Obtener iniciales del usuario
    const obtenerIniciales = () => {

        const nombres = usuario?.nombres?.trim().split(" ") || [];
        const apellidos = usuario?.apellidos?.trim().split(" ") || [];

        return `${nombres[0]?.charAt(0) || ""}${apellidos[0]?.charAt(0) || ""}`.toUpperCase();

    };

    useEffect(() => {

        obtenerUsuario();

    }, [obtenerUsuario]);

    // Estado de carga
    if (cargando) {

        return (
            <div className="perfil-container">
                <div className="perfil-mensaje">
                    <div className="perfil-spinner"></div>
                    <p>Cargando información del usuario...</p>
                </div>
            </div>
        );

    }

    // Usuario no encontrado
    if (!usuario) {

        return (
            <div className="perfil-container">

                <div className="perfil-mensaje">

                    <h2>No se encontró el usuario</h2>

                    <p>No fue posible encontrar la información solicitada.</p>

                    <button
                        className="perfil-btn perfil-btn-volver"
                        onClick={() => navigate("/gestion-usuarios")}
                    >
                        Volver a usuarios
                    </button>

                </div>

            </div>
        );

    }

    return (

        <div className="perfil-container">

            {/* Encabezado */}
            <div className="perfil-header">

                <div>
                    <span className="perfil-subtitulo">
                        GESTIÓN DE USUARIOS
                    </span>

                    <h1>
                        {editando ? "Editar usuario" : "Perfil de usuario"}
                    </h1>

                    <p>
                        {editando
                            ? "Actualiza la información de esta cuenta."
                            : "Consulta la información y los datos de la cuenta."
                        }
                    </p>
                </div>

                <button
                    className="perfil-btn perfil-btn-volver"
                    onClick={() => navigate("/gestion-usuarios")}
                >
                    Volver
                </button>

            </div>

            {/* Tarjeta principal */}
            <div className="perfil-card">

                {/* Información de identidad */}
                <div className="perfil-identidad">

                    <div className="perfil-avatar">
                        {obtenerIniciales() || "U"}
                    </div>

                    <div className="perfil-identidad-info">

                        <h2>
                            {usuario.nombres} {usuario.apellidos}
                        </h2>

                        <span className="perfil-rol">
                            {usuario.rol}
                        </span>

                    </div>

                    <span
                        className={`perfil-estado ${
                            usuario.activo
                                ? "estado-activo"
                                : "estado-inactivo"
                        }`}
                    >
                        {usuario.activo ? "Activo" : "Inactivo"}
                    </span>

                </div>

                <div className="perfil-divider"></div>

                {editando ? (

                    /* MODO EDICIÓN */
                    <form onSubmit={guardarCambios}>

                        <div className="perfil-seccion">

                            <h3>Datos personales</h3>

                            <div className="perfil-grid">

                                <div className="perfil-campo">

                                    <label>Nombres *</label>

                                    <input
                                        type="text"
                                        value={usuario.nombres || ""}
                                        onChange={(e) =>
                                            actualizarCampo("nombres", e.target.value)
                                        }
                                        required
                                    />

                                </div>

                                <div className="perfil-campo">

                                    <label>Apellidos *</label>

                                    <input
                                        type="text"
                                        value={usuario.apellidos || ""}
                                        onChange={(e) =>
                                            actualizarCampo("apellidos", e.target.value)
                                        }
                                        required
                                    />

                                </div>

                                <div className="perfil-campo">

                                    <label>Tipo de documento *</label>

                                    <select
                                        value={usuario.tipoDocumento || ""}
                                        onChange={(e) =>
                                            actualizarCampo("tipoDocumento", e.target.value)
                                        }
                                        required
                                    >
                                        <option value="">Seleccionar</option>
                                        <option value="CC">Cédula de ciudadanía</option>
                                        <option value="CE">Cédula de extranjería</option>
                                        <option value="TI">Tarjeta de identidad</option>
                                        <option value="Pasaporte">Pasaporte</option>
                                    </select>

                                </div>

                                <div className="perfil-campo">

                                    <label>Número de documento *</label>

                                    <input
                                        type="text"
                                        value={usuario.documento || ""}
                                        onChange={(e) =>
                                            actualizarCampo("documento", e.target.value)
                                        }
                                        required
                                    />

                                </div>

                                <div className="perfil-campo">

                                    <label>Teléfono *</label>

                                    <input
                                        type="text"
                                        value={usuario.telefono || ""}
                                        onChange={(e) =>
                                            actualizarCampo("telefono", e.target.value)
                                        }
                                        required
                                    />

                                </div>

                                <div className="perfil-campo">

                                    <label>Correo electrónico *</label>

                                    <input
                                        type="email"
                                        value={usuario.correo || ""}
                                        onChange={(e) =>
                                            actualizarCampo("correo", e.target.value)
                                        }
                                        required
                                    />

                                </div>

                                <div className="perfil-campo">

                                    <label>Fecha de nacimiento</label>

                                    <input
                                        type="date"
                                        value={
                                            usuario.fechaNacimiento
                                                ? usuario.fechaNacimiento.substring(0, 10)
                                                : ""
                                        }
                                        onChange={(e) =>
                                            actualizarCampo(
                                                "fechaNacimiento",
                                                e.target.value
                                            )
                                        }
                                    />

                                </div>

                            </div>

                        </div>

                        <div className="perfil-divider"></div>

                        <div className="perfil-seccion">

                            <h3>Configuración de la cuenta</h3>

                            <div className="perfil-grid">

                                <div className="perfil-campo">

                                    <label>Rol del usuario *</label>

                                    <select
                                        value={usuario.rol || ""}
                                        onChange={(e) =>
                                            actualizarCampo("rol", e.target.value)
                                        }
                                        required
                                    >
                                        <option value="Administrador">Administrador</option>
                                        <option value="Recepcionista">Recepcionista</option>
                                        <option value="Medico">Médico</option>
                                        <option value="Paciente">Paciente</option>
                                    </select>

                                </div>

                                <div className="perfil-campo">

                                    <label>Estado de la cuenta *</label>

                                    <select
                                        value={usuario.activo ? "true" : "false"}
                                        onChange={(e) =>
                                            actualizarCampo(
                                                "activo",
                                                e.target.value === "true"
                                            )
                                        }
                                    >
                                        <option value="true">Activo</option>
                                        <option value="false">Inactivo</option>
                                    </select>

                                </div>

                            </div>

                        </div>

                        {/* Botones de edición */}
                        <div className="perfil-acciones">

                            <button
                                type="button"
                                className="perfil-btn perfil-btn-cancelar"
                                onClick={cancelarEdicion}
                                disabled={guardando}
                            >
                                Cancelar
                            </button>

                            <button
                                type="submit"
                                className="perfil-btn perfil-btn-guardar"
                                disabled={guardando}
                            >
                                {guardando ? "Guardando..." : "Guardar cambios"}
                            </button>

                        </div>

                    </form>

                ) : (

                    /* MODO CONSULTA */
                    <>

                        <div className="perfil-seccion">

                            <h3>Datos personales</h3>

                            <div className="perfil-grid">

                                <div className="perfil-dato">

                                    <span>Tipo de documento</span>

                                    <strong>
                                        {usuario.tipoDocumento || "No registrado"}
                                    </strong>

                                </div>

                                <div className="perfil-dato">

                                    <span>Número de documento</span>

                                    <strong>
                                        {usuario.documento || "No registrado"}
                                    </strong>

                                </div>

                                <div className="perfil-dato">

                                    <span>Teléfono</span>

                                    <strong>
                                        {usuario.telefono || "No registrado"}
                                    </strong>

                                </div>

                                <div className="perfil-dato">

                                    <span>Correo electrónico</span>

                                    <strong>
                                        {usuario.correo || "No registrado"}
                                    </strong>

                                </div>

                                <div className="perfil-dato">

                                    <span>Fecha de nacimiento</span>

                                    <strong>
                                        {usuario.fechaNacimiento
                                            ? usuario.fechaNacimiento.substring(0, 10)
                                            : "No registrada"
                                        }
                                    </strong>

                                </div>

                                <div className="perfil-dato">

                                    <span>Rol asignado</span>

                                    <strong>
                                        {usuario.rol}
                                    </strong>

                                </div>

                            </div>

                        </div>

                        <div className="perfil-divider"></div>

                        <div className="perfil-seccion">

                            <h3>Información de la cuenta</h3>

                            <div className="perfil-grid">

                                <div className="perfil-dato">

                                    <span>Estado de la cuenta</span>

                                    <strong
                                        className={
                                            usuario.activo
                                                ? "texto-activo"
                                                : "texto-inactivo"
                                        }
                                    >
                                        {usuario.activo ? "Activa" : "Inactiva"}
                                    </strong>

                                </div>

                            </div>

                        </div>

                        {/* Botones de consulta */}
                        <div className="perfil-acciones">

                            <button
                                className="perfil-btn perfil-btn-editar"
                                onClick={() => setEditando(true)}
                            >
                                Editar perfil
                            </button>

                            <button
                                className="perfil-btn perfil-btn-volver"
                                onClick={() => navigate("/gestion-usuarios")}
                            >
                                Volver a usuarios
                            </button>

                        </div>

                    </>

                )}

            </div>

        </div>

    );

}

export default PerfilUsuario;