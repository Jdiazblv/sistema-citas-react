
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

import "./RegistroUsuario.css";

function RegistroUsuario() {

    const navigate = useNavigate();

    // Estado para mostrar u ocultar las contraseñas
    const [mostrarPassword, setMostrarPassword] = useState(false);

    // Estados del formulario
    const [formData, setFormData] = useState({
        nombres: "",
        apellidos: "",
        rol: "",
        tipoDocumento: "",
        documento: "",
        correo: "",
        telefono: "",
        fechaNacimiento: "",
        password: "",
        confirmarPassword: ""
    });

    // Estado para almacenar los errores de validación
    const [errores, setErrores] = useState({});


    // Manejar cambios en los campos del formulario
    function handleChange(e) {

        const { name, value } = e.target;

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
            else if (value.length < 10) {
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
                nuevosErrores.telefono = "Ingrese un teléfono válido";
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
        else if (formData.documento.length <= 9) {
            nuevosErrores.documento =
                "El documento debe tener mínimo 10 caracteres";
        }

        // Validar teléfono
        if (!formData.telefono) {
            nuevosErrores.telefono = "Ingrese su teléfono";
        }
        else if (formData.telefono.length <= 9) {
            nuevosErrores.telefono = "Ingrese un teléfono válido";
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

        // Actualizar los errores encontrados
        setErrores(nuevosErrores);

        // Continuar solamente si no existen errores
        if (Object.keys(nuevosErrores).length === 0) {

            try {

                // Excluir confirmarPassword porque solo se utiliza para validar
                const { confirmarPassword, ...datosUsuario } = formData;

                // Enviar los datos al backend
                const respuesta = await api.post("/users", datosUsuario);

                // Mostrar mensaje de confirmación
                alert(
                    respuesta.data.mensaje ||
                    "Usuario registrado correctamente"
                );

                // Regresar a la gestión de usuarios
                navigate("/gestion-usuarios");

            } catch (error) {

                // Obtener el mensaje de error del backend
                const mensaje =
                    error.response?.data?.mensaje ||
                    error.response?.data?.error ||
                    "No fue posible registrar el usuario";

                // Mostrar el error
                alert(mensaje);
            }
        }
    }


    // Mostrar el formulario de registro
    return (

        <div className="registro-container">

            <div className="registro-card">

                <h2>Registro de usuario</h2>

                <form onSubmit={handleSubmit}>

                    {/* ===== DATOS PERSONALES ===== */}

                    <h3>Datos personales:</h3>

                    {/* Rol */}
                    <div className="campo">

                        <label>Rol *</label>

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

                        {errores.rol && (
                            <span className="error">
                                {errores.rol}
                            </span>
                        )}

                    </div>

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
                            onClick={() => navigate("/gestion-usuarios")}
                        >
                            Volver
                        </button>

                        <button type="submit">
                            Registrar
                        </button>

                    </div>

                </form>

            </div>

        </div>
    );
}

export default RegistroUsuario;
