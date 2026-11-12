
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import CamposPerfil from "../componentes/usuarios/CamposPerfil";

import "./RegistroUsuario.css";

function RegistroUsuario({ registroPaciente = false, registroMedico = false }) {

    const navigate = useNavigate();
    const rolFijo = registroPaciente ? "Paciente" : registroMedico ? "Medico" : "";
    const rutaListado = registroPaciente ? "/gestion-pacientes" : registroMedico ? "/gestion-medicos" : "/gestion-usuarios";
    const rutaRegistro = registroPaciente ? "/pacientes" : registroMedico ? "/medicos" : "/users";
    const [guardando, setGuardando] = useState(false);

    // Estado para mostrar u ocultar las contraseñas
    const [mostrarPassword, setMostrarPassword] = useState(false);

    // Estados del formulario
    const [formData, setFormData] = useState({
        nombres: "",
        apellidos: "",
        rol: rolFijo,
        tipoDocumento: "",
        documento: "",
        correo: "",
        telefono: "",
        fechaNacimiento: "",
        password: "",
        confirmarPassword: "",
        sexo: "", eps: "", direccion: "", especialidades: "", registroProfesional: ""
    });

    // Estado para almacenar los errores de validación
    const [errores, setErrores] = useState({});


    // Manejar cambios en los campos del formulario
    function handleChange(e) {

        const { name, value: valorIngresado } = e.target;
        const value = name === "telefono" ? valorIngresado.replace(/\D/g, "") : valorIngresado;

        // Actualizar el valor del campo modificado
        const nuevosDatos = {
            ...formData,
            [name]: value
        };

        setFormData(nuevosDatos);

        // Copiar los errores actuales para actualizarlos
        let nuevosErrores = { ...errores };

        // Validar nombres
        if (name === "nombres") {

            if (!value) {
                nuevosErrores.nombres = "Ingrese sus nombres";
            } else {
                delete nuevosErrores.nombres;
            }
        }

        // Validar apellidos
        if (name === "apellidos") {

            if (!value) {
                nuevosErrores.apellidos = "Ingrese sus apellidos";
            } else {
                delete nuevosErrores.apellidos;
            }
        }

        // Validar rol
        if (name === "rol") {

            if (!value) {
                nuevosErrores.rol = "Seleccione su rol";
            } else {
                delete nuevosErrores.rol;
            }
        }

        // Validar tipo de documento
        if (name === "tipoDocumento") {

            if (!value) {
                nuevosErrores.tipoDocumento =
                    "Seleccione su tipo de documento";
            } else {
                delete nuevosErrores.tipoDocumento;
            }
        }

        // Validar número de documento
        if (name === "documento") {

            if (!value) {
                nuevosErrores.documento = "Ingrese su documento";
            }
            else if (!/^\d+$/.test(value)) {
                nuevosErrores.documento = "Documento inválido";
            }
            else {
                delete nuevosErrores.documento;
            }
        }

        // Validar teléfono
        if (name === "telefono") {

            if (!value) {
                nuevosErrores.telefono = "Ingrese su teléfono";
            }
            else if (value.length < 10) {
                nuevosErrores.telefono = "Ingrese al menos 10 dígitos.";
            }
            else {
                delete nuevosErrores.telefono;
            }
        }

        // Validar correo electrónico
        if (name === "correo") {

            if (!value) {
                nuevosErrores.correo =
                    "Ingrese su correo electrónico";
            }
            else if (!value.includes("@")) {
                nuevosErrores.correo =
                    "Ingrese un correo electrónico válido";
            }
            else {
                delete nuevosErrores.correo;
            }
        }

        // Validar fecha de nacimiento
        if (name === "fechaNacimiento") {

            if (!value) {
                nuevosErrores.fechaNacimiento =
                    "Seleccione su fecha de nacimiento";
            } else {
                delete nuevosErrores.fechaNacimiento;
            }
        }

        // Validar contraseña
        if (name === "password") {

            if (!value) {
                nuevosErrores.password = "Ingrese su contraseña";
            }
            else if (value.length < 6) {
                nuevosErrores.password =
                    "La contraseña debe tener mínimo 6 caracteres";
            }
            else {
                delete nuevosErrores.password;
            }

            // Volver a comprobar la confirmación si cambia la contraseña
            if (nuevosDatos.confirmarPassword) {

                if (nuevosDatos.confirmarPassword !== value) {
                    nuevosErrores.confirmarPassword =
                        "Las contraseñas no coinciden";
                } else {
                    delete nuevosErrores.confirmarPassword;
                }
            }
        }

        // Validar confirmación de contraseña
        if (name === "confirmarPassword") {

            if (!value) {
                nuevosErrores.confirmarPassword =
                    "Confirme su contraseña";
            }
            else if (value !== nuevosDatos.password) {
                nuevosErrores.confirmarPassword =
                    "Las contraseñas no coinciden";
            }
            else {
                delete nuevosErrores.confirmarPassword;
            }
        }

        // Actualizar los errores
        setErrores(nuevosErrores);
    }


    // Enviar el formulario
    async function handleSubmit(e) {

        e.preventDefault();
        if (guardando) return;

        // Crear un objeto para almacenar los errores
        let nuevosErrores = {};

        // Validar nombres
        if (!formData.nombres) {
            nuevosErrores.nombres = "Ingrese sus nombres";
        }

        // Validar apellidos
        if (!formData.apellidos) {
            nuevosErrores.apellidos = "Ingrese sus apellidos";
        }

        // Validar rol
        if (!formData.rol) {
            nuevosErrores.rol = "Seleccione su rol";
        }

        // Validar tipo de documento
        if (!formData.tipoDocumento) {
            nuevosErrores.tipoDocumento =
                "Seleccione su tipo de documento";
        }

        // Validar documento
        if (!formData.documento) {
            nuevosErrores.documento = "Ingrese su documento";
        }
        else if (!/^\d+$/.test(formData.documento)) {
            nuevosErrores.documento =
                "El documento debe contener solo números";
        }

        // Validar teléfono
        if (!formData.telefono) {
            nuevosErrores.telefono = "Ingrese su teléfono";
        }
        else if (!/^\d{10,}$/.test(formData.telefono)) {
            nuevosErrores.telefono = "Ingrese al menos 10 dígitos, solo números.";
        }

        // Validar correo electrónico
        if (!formData.correo) {
            nuevosErrores.correo =
                "Ingrese su correo electrónico";
        }
        else if (!formData.correo.includes("@")) {
            nuevosErrores.correo =
                "Ingrese un correo electrónico válido";
        }

        // Validar fecha de nacimiento
        if (!formData.fechaNacimiento) {
            nuevosErrores.fechaNacimiento =
                "Seleccione su fecha de nacimiento";
        }

        // Validar contraseña
        if (!formData.password) {
            nuevosErrores.password = "Ingrese su contraseña";
        }
        else if (formData.password.length < 6) {
            nuevosErrores.password =
                "La contraseña debe tener mínimo 6 caracteres";
        }

        // Validar confirmación de contraseña
        if (!formData.confirmarPassword) {
            nuevosErrores.confirmarPassword =
                "Confirme su contraseña";
        }
        else if (formData.password !== formData.confirmarPassword) {
            nuevosErrores.confirmarPassword =
                "Las contraseñas no coinciden";
        }

        if (formData.rol === "Paciente" && (!formData.sexo || !formData.direccion.trim())) {
            nuevosErrores.perfil = "Complete el sexo y la dirección del paciente.";
        }
        if (formData.rol === "Medico" && (!formData.registroProfesional.trim() || !formData.especialidades.split(",").some(e => e.trim()))) {
            nuevosErrores.perfil = "Complete el registro profesional y al menos una especialidad.";
        }

        // Actualizar los errores encontrados
        setErrores(nuevosErrores);

        // Continuar solamente si no existen errores
        if (Object.keys(nuevosErrores).length === 0) {

            try {

                setGuardando(true);
                // Excluir confirmarPassword porque solo se utiliza para validar
                const { confirmarPassword, sexo, eps, direccion, especialidades, registroProfesional, ...datosUsuario } = formData;
                if (formData.rol === "Paciente") Object.assign(datosUsuario, { sexo, eps, direccion });
                if (formData.rol === "Medico") Object.assign(datosUsuario, {
                    especialidades: especialidades.split(",").map(e => e.trim()).filter(Boolean), registroProfesional
                });

                // Enviar los datos al backend
                const respuesta = await api.post(rutaRegistro, datosUsuario);

                // Mostrar mensaje de confirmación
                alert(
                    respuesta.data.mensaje ||
                    "Usuario registrado correctamente"
                );

                // Regresar a la gestión de usuarios
                navigate(rutaListado);

            } catch (error) {

                // Obtener el mensaje de error del backend
                const mensaje =
                    error.response?.data?.mensaje ||
                    error.response?.data?.error ||
                    "No fue posible registrar el usuario";

                // Mostrar el error
                alert(mensaje);
            } finally {
                setGuardando(false);
            }
        }
    }


    // Mostrar el formulario de registro
    return (

        <div className="registro-container">

            <div className="registro-card">

                <h2>{registroPaciente ? "Registro de paciente" : registroMedico ? "Registro de médico" : "Registro de usuario"}</h2>

                <form onSubmit={handleSubmit} aria-busy={guardando}>
                    {errores.perfil && <p role="alert">{errores.perfil}</p>}

                    {/* ===== DATOS PERSONALES ===== */}

                    <h3>Datos personales:</h3>

                    {/* Rol */}
                    {!rolFijo && (
                        <div className="campo">

                            <label>Rol *</label>

                            <div className="registro-select">
                                <select
                                    name="rol"
                                    value={formData.rol}
                                    onChange={handleChange}
                                    className={errores.rol ? "input-error" : ""}
                                >
                                    <option value="">Seleccionar</option>
                                    <option value="Administrador">Administrador</option>
                                    <option value="Recepcionista">Recepcionista</option>
                                    <option value="Medico">Médico</option>
                                    <option value="Paciente">Paciente</option>
                                </select>
                            </div>

                            {errores.rol && (
                                <span className="error">
                                    {errores.rol}
                                </span>
                            )}

                        </div>
                    )}

                    {/* Nombres */}
                    <div className="campo">

                        <label>Nombres *</label>

                        <input
                            type="text"
                            name="nombres"
                            placeholder="Ingrese sus nombres"
                            value={formData.nombres}
                            onChange={handleChange}
                            className={errores.nombres ? "input-error" : ""}
                        />

                        {errores.nombres && (
                            <span className="error">
                                {errores.nombres}
                            </span>
                        )}

                    </div>

                    {/* Apellidos */}
                    <div className="campo">

                        <label>Apellidos *</label>

                        <input
                            type="text"
                            name="apellidos"
                            placeholder="Ingrese sus apellidos"
                            value={formData.apellidos}
                            onChange={handleChange}
                            className={errores.apellidos ? "input-error" : ""}
                        />

                        {errores.apellidos && (
                            <span className="error">
                                {errores.apellidos}
                            </span>
                        )}

                    </div>

                    {/* Tipo de documento */}
                    <div className="campo">

                        <label>Tipo de documento *</label>

                        <div className="registro-select">
                            <select
                                name="tipoDocumento"
                                value={formData.tipoDocumento}
                                onChange={handleChange}
                                className={
                                    errores.tipoDocumento ? "input-error" : ""
                                }
                            >
                                <option value="">Seleccionar</option>
                                <option value="CC">Cédula de ciudadanía</option>
                                <option value="TI">Tarjeta de identidad</option>
                                <option value="CE">Cédula de extranjería</option>
                            </select>
                        </div>

                        {errores.tipoDocumento && (
                            <span className="error">
                                {errores.tipoDocumento}
                            </span>
                        )}

                    </div>

                    {/* Documento */}
                    <div className="campo">

                        <label>Documento *</label>

                        <input
                            type="text"
                            name="documento"
                            placeholder="Ingrese su documento"
                            value={formData.documento}
                            onChange={handleChange}
                            className={
                                errores.documento ? "input-error" : ""
                            }
                        />

                        {errores.documento && (
                            <span className="error">
                                {errores.documento}
                            </span>
                        )}

                    </div>

                    {/* Teléfono */}
                    <div className="campo">

                        <label>Teléfono *</label>

                        <input
                            type="tel"
                            name="telefono"
                            inputMode="numeric"
                            placeholder="Digite su número telefónico"
                            value={formData.telefono}
                            onChange={handleChange}
                            className={
                                errores.telefono ? "input-error" : ""
                            }
                        />

                        {errores.telefono && (
                            <span className="error">
                                {errores.telefono}
                            </span>
                        )}

                    </div>

                    {/* Correo electrónico */}
                    <div className="campo">

                        <label>Correo electrónico *</label>

                        <input
                            type="email"
                            name="correo"
                            placeholder="Digite su correo electrónico"
                            value={formData.correo}
                            onChange={handleChange}
                            className={errores.correo ? "input-error" : ""}
                        />

                        {errores.correo && (
                            <span className="error">
                                {errores.correo}
                            </span>
                        )}

                    </div>

                    {/* Fecha de nacimiento */}
                    <div className="campo">

                        <label>Fecha de nacimiento *</label>

                        <input
                            type="date"
                            name="fechaNacimiento"
                            value={formData.fechaNacimiento}
                            onChange={handleChange}
                            className={
                                errores.fechaNacimiento ? "input-error" : ""
                            }
                        />

                        {errores.fechaNacimiento && (
                            <span className="error">
                                {errores.fechaNacimiento}
                            </span>
                        )}

                    </div>


                    <CamposPerfil rol={formData.rol} datos={formData} onChange={handleChange} />

                    {/* ===== CREAR CONTRASEÑA ===== */}

                    <h3>Crear una contraseña:</h3>

                    {/* Contraseña */}
                    <div className="campo">

                        <label>Contraseña *</label>

                        <input
                            type={mostrarPassword ? "text" : "password"}
                            name="password"
                            placeholder="Ingrese su contraseña"
                            value={formData.password}
                            onChange={handleChange}
                            className={
                                errores.password ? "input-error" : ""
                            }
                        />

                        {errores.password && (
                            <span className="error">
                                {errores.password}
                            </span>
                        )}

                    </div>

                    {/* Confirmar contraseña */}
                    <div className="campo">

                        <label>Confirmar contraseña *</label>

                        <input
                            type={mostrarPassword ? "text" : "password"}
                            name="confirmarPassword"
                            placeholder="Confirme su contraseña"
                            value={formData.confirmarPassword}
                            onChange={handleChange}
                            className={
                                errores.confirmarPassword ? "input-error" : ""
                            }
                        />

                        {errores.confirmarPassword && (
                            <span className="error">
                                {errores.confirmarPassword}
                            </span>
                        )}

                    </div>

                    {/* Mostrar u ocultar contraseña */}
                    <div className="mostrar-password">

                        <input
                            type="checkbox"
                            id="mostrarPassword"
                            checked={mostrarPassword}
                            onChange={() =>
                                setMostrarPassword(!mostrarPassword)
                            }
                        />

                        <label htmlFor="mostrarPassword">
                            Mostrar contraseña
                        </label>

                    </div>


                    {/* ===== INFORMACIÓN Y BOTONES ===== */}

                    {/* Nota informativa */}
                    <p className="nota">
                        El número de documento será utilizado como usuario
                        del sistema.
                    </p>

                    {/* Botones de acción */}
                    <div className="botones-registro">

                        <button
                            type="button"
                            onClick={() => navigate(rutaListado)}
                        >
                            Volver
                        </button>

                        <button disabled={guardando} type="submit">
                            Registrar
                        </button>

                    </div>

                </form>

            </div>

        </div>
    );
}

export default RegistroUsuario;
