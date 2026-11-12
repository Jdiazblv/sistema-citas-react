import React, { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import SelectorEps from "../componentes/usuarios/SelectorEps";

import "./PerfilUsuario.css";

// Las mismas reglas se usan al escribir y antes de guardar.
const CAMPOS_PERSONALES = [
    "nombres", "apellidos", "tipoDocumento", "documento",
    "telefono", "correo", "fechaNacimiento"
];

const CAMPOS_PACIENTE = [
    { nombre: "sexo", etiqueta: "Sexo", opciones: ["Femenino", "Masculino", "Otro"] },
    { nombre: "direccion", etiqueta: "Dirección" },
    { nombre: "eps", etiqueta: "EPS" }
];

const CAMPOS_MEDICO = [
    { nombre: "especialidades", etiqueta: "Especialidades" },
    { nombre: "registroProfesional", etiqueta: "Registro profesional" }
];

function unirDatosPerfil(perfil, cuenta, perfilMedico) {
    return {
        ...perfil,
        ...cuenta,
        usuarioId: cuenta,
        ...(perfilMedico && {
            especialidades: Array.isArray(perfil.especialidades) ? perfil.especialidades.join(", ") : ""
        })
    };
}

function validarCampo(campo, valor) {
    const texto = String(valor || "").trim();
    const obligatorios = {
        nombres: "Ingrese sus nombres.",
        apellidos: "Ingrese sus apellidos.",
        tipoDocumento: "Seleccione su tipo de documento.",
        documento: "Ingrese su documento.",
        telefono: "Ingrese su teléfono.",
        correo: "Ingrese su correo electrónico.",
        fechaNacimiento: "Seleccione su fecha de nacimiento.",
        sexo: "Seleccione el sexo del paciente.",
        direccion: "Ingrese la dirección.",
        especialidades: "Ingrese al menos una especialidad.",
        registroProfesional: "Ingrese el registro profesional."
    };

    if (!texto) return obligatorios[campo] || "";
    if (campo === "especialidades" && !texto.split(",").some((parte) => parte.trim())) {
        return obligatorios.especialidades;
    }
    if (campo === "tipoDocumento" && !["CC", "CE", "TI", "Pasaporte"].includes(texto)) {
        return "Seleccione un tipo de documento válido.";
    }
    if (campo === "documento" && !/^\d+$/.test(texto)) {
        return "El documento debe contener solo números.";
    }
    if (campo === "telefono" && !/^\d{10,}$/.test(texto)) {
        return "Ingrese un teléfono de al menos 10 dígitos, solo números.";
    }
    if (campo === "correo" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(texto)) {
        return "Ingrese un correo electrónico válido.";
    }
    if (campo === "fechaNacimiento") {
        const fecha = new Date(`${texto}T00:00:00Z`);
        if (!/^\d{4}-\d{2}-\d{2}$/.test(texto) || !Number.isFinite(fecha.getTime()) || fecha.toISOString().slice(0, 10) !== texto) {
            return "Ingrese una fecha de nacimiento válida.";
        }
        if (fecha > new Date()) return "La fecha de nacimiento no puede ser futura.";
    }
    return "";
}

function PerfilUsuario({ perfilPaciente = false, perfilMedico = false }) {

    const { id } = useParams();
    const navigate = useNavigate();
    const sesion = useAuth();
    const tipoPerfil = perfilPaciente ? "paciente" : perfilMedico ? "medico" : null;
    const entidad = perfilMedico ? "médico" : tipoPerfil || "usuario";
    const camposPerfil = perfilPaciente ? CAMPOS_PACIENTE : perfilMedico ? CAMPOS_MEDICO : [];
    const rutaPerfil = tipoPerfil ? `/${tipoPerfil}s/${id}` : `/users/${id}`;
    const rutaListado = `/gestion-${tipoPerfil || "usuario"}s`;
    const camposEditables = [...CAMPOS_PERSONALES, ...camposPerfil.map(({ nombre }) => nombre)];

    // Estados del componente
    const [usuario, setUsuario] = useState(null);
    const esAdministrador = sesion?.usuario?.rol === "Administrador";
    const puedeEditar = !perfilMedico || esAdministrador;
    const puedeAdministrarCuenta = !tipoPerfil || (esAdministrador && Boolean(usuario?.usuarioId?._id));
    const idCuenta = tipoPerfil ? usuario?.usuarioId?._id : id;
    const [editando, setEditando] = useState(false);
    const [cargando, setCargando] = useState(true);
    const [guardando, setGuardando] = useState(false);
    const [errores, setErrores] = useState({});
    const [errorFormulario, setErrorFormulario] = useState("");
    const [mostrarEliminar, setMostrarEliminar] = useState(false);
    const [passwordAdmin, setPasswordAdmin] = useState("");
    const [mostrarPasswordAdmin, setMostrarPasswordAdmin] = useState(false);
    const [errorEliminar, setErrorEliminar] = useState("");


    // Obtener información del usuario
    const obtenerUsuario = useCallback(async () => {

        try {

            setCargando(true);

            const { data } = await api.get(rutaPerfil);

            setUsuario(tipoPerfil ? unirDatosPerfil(data, data.usuarioId, perfilMedico) : data);

        } catch (error) {

            setUsuario(null);
            console.error("Error al obtener el perfil:", error);

            alert(
                error.response?.data?.mensaje ||
                "No se pudo cargar el perfil."
            );

        } finally {

            setCargando(false);

        }

    }, [rutaPerfil, tipoPerfil, perfilMedico]);

    // Actualizar información del usuario
    const guardarCambios = async (e) => {

        e.preventDefault();
        if (guardando || !puedeEditar) return;

        const nuevosErrores = {};
        camposEditables.forEach((campo) => {
            const mensaje = validarCampo(campo, usuario[campo]);
            if (mensaje) nuevosErrores[campo] = mensaje;
        });
        setErrores(nuevosErrores);
        setErrorFormulario("");
        if (Object.keys(nuevosErrores).length > 0) {
            e.currentTarget.elements.namedItem(Object.keys(nuevosErrores)[0])?.focus();
            return;
        }

        try {

            setGuardando(true);

            const datos = Object.fromEntries(
                camposEditables.map((campo) => [campo, String(usuario[campo] || "").trim()])
            );
            datos.correo = datos.correo.toLowerCase();
            if (perfilMedico) {
                datos.especialidades = datos.especialidades.split(",").map((parte) => parte.trim()).filter(Boolean);
            }
            const { data } = await api.put(rutaPerfil, datos);
            setUsuario(tipoPerfil ? unirDatosPerfil(data[tipoPerfil], data.usuario, perfilMedico) : data.usuario);
            setErrores({});

            setEditando(false);

            alert(data.mensaje || "Perfil actualizado correctamente.");

        } catch (error) {

            console.error("Error al actualizar el usuario:", error);

            setErrorFormulario(
                error.response?.data?.mensaje ||
                "No se pudieron guardar los cambios."
            );

        } finally {

            setGuardando(false);

        }

    };

    // Activar o desactivar la cuenta
    const cambiarEstadoCuenta = async () => {
        if (guardando || !puedeAdministrarCuenta) return;

        const accion = usuario.activo ? "desactivar" : "activar";

        const confirmado = window.confirm(
            `¿Deseas ${accion} la cuenta de ${usuario.nombres}?`
        );

        if (!confirmado) return;

        try {
            setGuardando(true);

            const respuesta = await api.put(`/users/${idCuenta}`, {
                activo: !usuario.activo
            });

            setUsuario((anterior) => tipoPerfil
                ? { ...anterior, activo: respuesta.data.usuario.activo }
                : respuesta.data.usuario);

            alert(respuesta.data.mensaje);
        } catch (error) {
            alert(
                error.response?.data?.mensaje ||
                "No fue posible cambiar el estado de la cuenta."
            );
        } finally {
            setGuardando(false);
        }
    };

    // Solicitar la eliminación definitiva de la cuenta.
    const confirmarEliminacion = async (e) => {
        e.preventDefault();

        if (guardando || !puedeAdministrarCuenta) return;

        if (!passwordAdmin) {
            setErrorEliminar("Ingrese su contraseña de administrador.");
            return;
        }

        try {
            setGuardando(true);
            setErrorEliminar("");

            const respuesta = await api.delete(rutaPerfil, {
                data: {
                    password: passwordAdmin
                }
            });

            setPasswordAdmin("");
            setMostrarPasswordAdmin(false);
            setMostrarEliminar(false);

            alert(respuesta.data.mensaje);

            navigate(rutaListado, { replace: true });
        } catch (error) {
            setPasswordAdmin("");
            setMostrarPasswordAdmin(false);

            setErrorEliminar(
                error.response?.data?.mensaje ||
                "No fue posible eliminar la cuenta."
            );
        } finally {
            setGuardando(false);
        }
    };

    // Cancelar edición
    const cancelarEdicion = () => {
        setErrores({});
        setErrorFormulario("");
        obtenerUsuario();

        setEditando(false);

    };

    // Actualizar campos del usuario
    const actualizarCampo = (campo, valor) => {
        setUsuario((anterior) => ({
            ...anterior,
            [campo]: valor
        }));

        setErrores((anteriores) => ({
            ...anteriores,
            [campo]: validarCampo(campo, valor)
        }));
        setErrorFormulario("");
    };

    // Conecta cada campo con su mensaje y su aspecto visual.
    const atributosValidacion = (campo) => ({
        name: campo,
        className: errores[campo] ? "input-error" : "",
        "aria-invalid": Boolean(errores[campo]),
        "aria-describedby": errores[campo] ? `error-${campo}` : undefined,
        disabled: guardando,
        onBlur: () => setErrores((anteriores) => ({
            ...anteriores,
            [campo]: validarCampo(campo, usuario[campo])
        }))
    });

    const mostrarError = (campo) => errores[campo] && (
        <span id={`error-${campo}`} className="perfil-error" aria-live="polite">
            {errores[campo]}
        </span>
    );

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
                    <p>Cargando información del perfil...</p>
                </div>
            </div>
        );

    }

    // Usuario no encontrado
    if (!usuario) {

        return (
            <div className="perfil-container">

                <div className="perfil-mensaje">

                    <h2>No se encontró el {entidad}</h2>

                    <p>No fue posible encontrar la información solicitada.</p>

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
                        GESTIÓN DE {entidad.toUpperCase()}S
                    </span>

                    <h1>
                        {editando ? `Editar ${entidad}` : `Perfil de ${entidad}`}
                    </h1>

                    <p>
                        {editando
                            ? "Actualiza la información de esta cuenta."
                            : "Consulta la información y los datos de la cuenta."
                        }
                    </p>
                </div>

                {!editando && puedeEditar && (
                    <button
                        type="button"
                        className="perfil-btn perfil-btn-editar"
                        onClick={() => {
                            setErrores({});
                            setErrorFormulario("");
                            setEditando(true);
                        }}
                        disabled={guardando}
                    >
                        Editar datos
                    </button>
                )}

            </div>

            {/* Tarjeta principal */}
            <div className={`perfil-card ${editando ? "perfil-card-edicion" : ""}`}>

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
                    <form onSubmit={guardarCambios} noValidate aria-busy={guardando} aria-label={`Editar datos del ${entidad}`}>
                        {errorFormulario && (
                            <p className="perfil-error-formulario" role="alert">{errorFormulario}</p>
                        )}

                        <div className="perfil-seccion">

                            <h3>Datos personales</h3>

                            <div className="perfil-grid">

                                <div className="perfil-campo">

                                    <label htmlFor="usuario-nombres">Nombres *</label>

                                    <input
                                        id="usuario-nombres"
                                        {...atributosValidacion("nombres")}
                                        type="text"
                                        value={usuario.nombres || ""}
                                        onChange={(e) =>
                                            actualizarCampo("nombres", e.target.value)
                                        }
                                        required
                                    />
                                    {mostrarError("nombres")}

                                </div>

                                <div className="perfil-campo">

                                    <label htmlFor="usuario-apellidos">Apellidos *</label>

                                    <input
                                        id="usuario-apellidos"
                                        {...atributosValidacion("apellidos")}
                                        type="text"
                                        value={usuario.apellidos || ""}
                                        onChange={(e) =>
                                            actualizarCampo("apellidos", e.target.value)
                                        }
                                        required
                                    />
                                    {mostrarError("apellidos")}

                                </div>

                                <div className="perfil-campo">

                                    <label htmlFor="usuario-tipo-documento">Tipo de documento *</label>

                                    <select
                                        id="usuario-tipo-documento"
                                        {...atributosValidacion("tipoDocumento")}
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
                                    {mostrarError("tipoDocumento")}

                                </div>

                                <div className="perfil-campo">

                                    <label htmlFor="usuario-documento">Número de documento *</label>

                                    <input
                                        id="usuario-documento"
                                        inputMode="numeric"
                                        {...atributosValidacion("documento")}
                                        type="text"
                                        value={usuario.documento || ""}
                                        onChange={(e) =>
                                            actualizarCampo("documento", e.target.value)
                                        }
                                        required
                                    />
                                    {mostrarError("documento")}

                                </div>

                                <div className="perfil-campo">

                                    <label htmlFor="usuario-telefono">Teléfono *</label>

                                    <input
                                        id="usuario-telefono"
                                        inputMode="tel"
                                        {...atributosValidacion("telefono")}
                                        type="text"
                                        value={usuario.telefono || ""}
                                        onChange={(e) =>
                                            actualizarCampo("telefono", e.target.value)
                                        }
                                        required
                                    />
                                    {mostrarError("telefono")}

                                </div>

                                <div className="perfil-campo">

                                    <label htmlFor="usuario-correo">Correo electrónico *</label>

                                    <input
                                        id="usuario-correo"
                                        {...atributosValidacion("correo")}
                                        type="email"
                                        value={usuario.correo || ""}
                                        onChange={(e) =>
                                            actualizarCampo("correo", e.target.value)
                                        }
                                        required
                                    />
                                    {mostrarError("correo")}

                                </div>

                                <div className="perfil-campo">

                                    <label htmlFor="usuario-nacimiento">Fecha de nacimiento *</label>

                                    <input
                                        id="usuario-nacimiento"
                                        required
                                        {...atributosValidacion("fechaNacimiento")}
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
                                    {mostrarError("fechaNacimiento")}

                                </div>

                            </div>

                        </div>

                        {tipoPerfil ? (
                            <>
                                <div className="perfil-divider"></div>
                                <section className="perfil-seccion">
                                    <h3>{perfilMedico ? "Datos profesionales" : "Datos del paciente"}</h3>
                                    <div className="perfil-grid">
                                        {camposPerfil.map(({ nombre, etiqueta, opciones }) => {
                                            const valor = usuario[nombre] || "";
                                            const propsCampo = {
                                                ...atributosValidacion(nombre),
                                                id: `paciente-${nombre}`,
                                                value: valor,
                                                onChange: (e) => actualizarCampo(nombre, e.target.value),
                                                required: nombre !== "eps",
                                                placeholder: nombre === "especialidades" ? "Separadas por comas" : undefined
                                            };

                                            return (
                                                <div className="perfil-campo" key={nombre}>
                                                    <label htmlFor={propsCampo.id}>
                                                        {etiqueta}{nombre === "eps" ? " (opcional)" : " *"}
                                                    </label>
                                                    {nombre === "eps" ? (
                                                        <SelectorEps
                                                            id={propsCampo.id}
                                                            value={valor}
                                                            onChange={(value) => actualizarCampo(nombre, value)}
                                                            onBlur={propsCampo.onBlur}
                                                            disabled={guardando}
                                                        />
                                                    ) : opciones ? (
                                                        <select {...propsCampo}>
                                                            <option value="">Seleccionar</option>
                                                            {valor && !opciones.includes(valor) && (
                                                                <option value={valor}>{valor}</option>
                                                            )}
                                                            {opciones.map((opcion) => (
                                                                <option key={opcion} value={opcion}>{opcion}</option>
                                                            ))}
                                                        </select>
                                                    ) : <input type="text" {...propsCampo} />}
                                                    {mostrarError(nombre)}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </section>
                            </>
                        ) : (
                            <p className="perfil-ayuda">
                                El rol se mantiene asociado al perfil. Puedes administrar el acceso desde la información de la cuenta.
                            </p>
                        )}

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
                                disabled={guardando || Object.values(errores).some(Boolean)}
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

                        {tipoPerfil && (
                            <>
                                <div className="perfil-divider"></div>
                                <section className="perfil-seccion">
                                    <h3>{perfilMedico ? "Datos profesionales" : "Datos del paciente"}</h3>
                                    <div className="perfil-grid">
                                        {camposPerfil.map(({ nombre, etiqueta }) => (
                                            <div className="perfil-dato" key={nombre}>
                                                <span>{etiqueta}</span>
                                                <strong>
                                                    {usuario[nombre]?.trim() ||
                                                        (nombre === "eps" ? "Sin EPS registrada" : "No registrado")}
                                                </strong>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            </>
                        )}

                        {puedeAdministrarCuenta && (
                            <>
                                {/* Activar o Desactivar cuenta */}
                                <section className="perfil-acceso" aria-labelledby="titulo-acceso">
                                    <div className="perfil-acceso-info">
                                        <span className="perfil-subtitulo">ACCESO AL SISTEMA</span>
                                        <h3 id="titulo-acceso">Estado de la cuenta</h3>
                                        <p>
                                            {usuario.activo
                                                ? "Esta cuenta tiene habilitado el acceso al sistema. Al desactivarla, se conservarán sus datos y registros relacionados."
                                                : "Esta cuenta tiene el acceso deshabilitado. Puedes activarla nuevamente conservando sus datos y registros relacionados."}
                                        </p>
                                    </div>
                                    <button
                                        type="button"
                                        className={`perfil-btn ${usuario.activo ? "perfil-btn-desactivar" : "perfil-btn-activar"}`}
                                        onClick={cambiarEstadoCuenta}
                                        disabled={guardando}
                                    >
                                        {guardando ? "Guardando..." : usuario.activo ? "Desactivar cuenta" : "Activar cuenta"}
                                    </button>
                                </section>

                                {/* Eliminación de cuenta */}
                                <section
                                    className="perfil-eliminacion"
                                    aria-labelledby="titulo-eliminar"
                                >
                                    <h3 id="titulo-eliminar">Eliminar cuenta</h3>

                                    <p>
                                        La eliminación es definitiva. Si la cuenta tiene citas o
                                        historias clínicas relacionadas, solo podrá desactivarse.
                                    </p>

                                    {!mostrarEliminar ? (
                                        <button
                                            type="button"
                                            className="perfil-btn perfil-btn-desactivar"
                                            disabled={guardando}
                                            onClick={() => {
                                                setPasswordAdmin("");
                                                setMostrarPasswordAdmin(false);
                                                setErrorEliminar("");
                                                setMostrarEliminar(true);
                                            }}
                                        >
                                            Eliminar cuenta
                                        </button>
                                    ) : (
                                        <form onSubmit={confirmarEliminacion}>
                                            <p>
                                                Vas a eliminar la cuenta de{" "}
                                                <strong>
                                                    {usuario.nombres} {usuario.apellidos}
                                                </strong>
                                                {" "}con documento {usuario.documento}.
                                                Esta acción no se puede deshacer.
                                            </p>

                                            <div className="perfil-campo">
                                                <label htmlFor="password-eliminar">
                                                    Tu contraseña de administrador *
                                                </label>

                                                <input
                                                    id="password-eliminar"
                                                    type={mostrarPasswordAdmin ? "text" : "password"}
                                                    autoComplete="current-password"
                                                    value={passwordAdmin}
                                                    onChange={(e) => {
                                                        setPasswordAdmin(e.target.value);
                                                        setErrorEliminar("");
                                                    }}
                                                    disabled={guardando}
                                                    required
                                                    aria-describedby={
                                                        errorEliminar ? "error-eliminar" : undefined
                                                    }
                                                />
                                            </div>

                                            <div className="perfil-mostrar-password">
                                                <input
                                                    id="mostrar-password-admin"
                                                    type="checkbox"
                                                    checked={mostrarPasswordAdmin}
                                                    onChange={(e) => setMostrarPasswordAdmin(e.target.checked)}
                                                    disabled={guardando}
                                                    aria-controls="password-eliminar"
                                                />
                                                <label htmlFor="mostrar-password-admin">
                                                    Mostrar contraseña
                                                </label>
                                            </div>

                                            {errorEliminar && (
                                                <p
                                                    id="error-eliminar"
                                                    className="perfil-error"
                                                    role="alert"
                                                >
                                                    {errorEliminar}
                                                </p>
                                            )}

                                            <div className="perfil-acciones">
                                                <button
                                                    type="button"
                                                    className="perfil-btn perfil-btn-cancelar"
                                                    disabled={guardando}
                                                    onClick={() => {
                                                        setPasswordAdmin("");
                                                        setMostrarPasswordAdmin(false);
                                                        setErrorEliminar("");
                                                        setMostrarEliminar(false);
                                                    }}
                                                >
                                                    Cancelar
                                                </button>

                                                <button
                                                    type="submit"
                                                    className="perfil-btn perfil-btn-desactivar"
                                                    disabled={guardando || !passwordAdmin}
                                                >
                                                    {guardando
                                                        ? "Eliminando..."
                                                        : "Eliminar definitivamente"}
                                                </button>
                                            </div>
                                        </form>
                                    )}
                                </section>

                            </>
                        )}

                    </>

                )}

            </div>

        </div>

    );

}

export default PerfilUsuario;
