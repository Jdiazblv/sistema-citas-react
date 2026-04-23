import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "react-router-dom";

import "./RegistroUsuario.css";

function RegistroUsuario() {

    const navigate = useNavigate();

    // Estados
    const [mostrarPassword, setMostrarPassword] = useState(false);
    
    
    // Estados del formulario
    const[formData, setFormData] = useState({
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

    // Estado para los errores
    const [errores, setErrores] = useState ({});


    // Manejar cambios
    function handleChange(e) {

        const { name, value } = e.target;

        // Actualizar datos
        setFormData({
            ...formData,
            [name]: value
        });

        // Validar en tiempo real
        let nuevosErrores = { ...errores };

        // Nombres
        if(name === "nombres") {

            if(!value) {
                nuevosErrores.nombres =
                    "Ingrese sus nombres"
            } else {
                delete nuevosErrores.nombres;
            }
        }

        // Apellidos
        if(name === "apellidos") {

            if(!value) {
                nuevosErrores.apellidos =
                    "Ingrese sus apellidos"
            } else {
                delete nuevosErrores.apellidos;
            }
        }

        // Rol
        if(name === "rol") {

            if(!value) {
                nuevosErrores.rol =
                    "Seleccione su rol"
            } else {
                delete nuevosErrores.rol;
            }
        }

        // Tipo de documento
        if(name === "tipoDocumento") {

            if(!value) {
                nuevosErrores.tipoDocumento =
                    "Seleccione su tipo de documento"
            } else {
                delete nuevosErrores.tipoDocumento;
            }
        }

        // Documento
        if(name === "documento") {

            if(!value) {
                nuevosErrores.documento =
                    "Ingrese su documento"
            }
            else if (value.length < 10) {
                nuevosErrores.documento =
                    "Documento invalido"
            }
            else {
                delete nuevosErrores.documento;
            }
        }

        // Teléfono
        if(name === "telefono") {

            if(!value) {
                nuevosErrores.telefono =
                    "Ingrese su telefono"
            }
            else if (value.length < 10) {
                nuevosErrores.telefono =
                    "Ingrese un teléfono válido";
            }
            else{
                delete nuevosErrores.telefono;
            }
            
        }

        // Correo electrónico
        if(name === "correo") {

            if(!value) {
                nuevosErrores.correo =
                    "Ingrese su correo electrónico"
            }
            else if(!value.includes ("@")) {
                nuevosErrores.correo =
                    "Ingrese un correo electrónico válido";
            }

            else {
                delete nuevosErrores.correo;
            }
        }

        // Fecha de nacimiento
        if (name === "fechaNacimiento") {
            
            if (!value) {
                nuevosErrores.fechaNacimiento =
                    "Seleccione su fecha de nacimiento";
            }
            else {
                delete nuevosErrores.fechaNacimiento;
            }

        }

        // Contraseña
        if (name === "password") {
            
            if (!value) {
                nuevosErrores.password =
                    "Ingrese su contraseña";
            }
            else if (value.length < 6) {
                nuevosErrores.password =
                    "La contraseña debe tener mínimo 6 caracteres"
            }
            else {
            delete nuevosErrores.password;
            }
        }

        // Confirmar contraseña
        if (name === "confirmarPassword") {

            if(!value) {
                nuevosErrores.confirmarPassword =
                    "Confirme su contraseña"
            }
            else if (value !== formData.password) {
                nuevosErrores.confirmarPassword =
                    "Las contraseñas no coinciden";
            }
            else {
                delete nuevosErrores.confirmarPassword;
            }
        }

        setErrores(nuevosErrores);
    }

    // Enviar formulario
    function handleSubmit(e) {

        e.preventDefault();
        let nuevosErrores = {};

        // Nombres
        if(!formData.nombres) {
            nuevosErrores.nombres =
                "Ingrese sus nombres"
        }

        // Apellidos
        if(!formData.apellidos) {
            nuevosErrores.apellidos =
                "Ingrese sus apellidos"
        }

        // Rol
        if(!formData.rol) {
            nuevosErrores.rol =
                "Ingrese su rol"
        }

        // Tipo documento
        if (!formData.tipoDocumento) {
            nuevosErrores.tipoDocumento =
                "Seleccione su tipo de documento";
        }

        // Documento
        if (!formData.documento) {
            nuevosErrores.documento =
                "Ingrese su documento"
        }
        else if (formData.documento.length <= 9) {
            nuevosErrores.documento =
                "El documento debe tener mínimo 10 caracteres";
        }

        // Teléfono
        if (!formData.telefono) {
            nuevosErrores.telefono =
                "Ingrese su teléfono"
        }
        else if (formData.telefono.length <= 9) {
            nuevosErrores.telefono =
                "Ingrese un teléfono válido";
        }

        // Correo electrónico
        if (!formData.correo) {
            nuevosErrores.correo =
                "Ingrese su correo electrónico";
        }
        else if (!formData.correo.includes("@")) {
            nuevosErrores.correo =
                "Ingrese un correo electrónico válido";
        }

        // Fecha de nacimiento
        if(!formData.fechaNacimiento) {
            nuevosErrores.fechaNacimiento =
                "Selecione su fecha de nacimiento"
        }

        // Contraseña
        if (!formData.password) {
            nuevosErrores.password =
                "Ingrese su contraseña";
        } 
        else if (formData.password.length < 6) {
            nuevosErrores.password =
                "La contraseña debe tener mínimo 6 caracteres"
        }

        // Confirmar contraseña
        if (!formData.confirmarPassword) {
            nuevosErrores.confirmarPassword =
                "Confirme su contraseña"
        }
        else if (formData.password !== formData.confirmarPassword ) {
            nuevosErrores.confirmarPassword =
                "Las contraseñas no coinciden";
        }

    setErrores(nuevosErrores);

        if (Object.keys(nuevosErrores).length === 0) {
        // Guardar usuario en localStorage
        localStorage.setItem(
            "usuarioRegistrado",
            JSON.stringify(formData)
        );

        // Mensaje
        alert("Usuario registrado correctamente")

        // Ir al login
        navigate("/");
        }

    }

    return(

        <div className = "registro-container">

            <div className = "registro-card">

                <h2>Registro</h2>

                <form onSubmit = {handleSubmit}>

                    <h3>Datos personales:</h3>

                    <div className = "campo">

                        {/* Rol */}
                        <div className="campo">

                            <label>Rol *</label>

                            <select
                                name="rol"
                                value={formData.rol}
                                onChange={handleChange}

                                // Borde rojo para los errores
                                className={
                                    errores.rol ? "input-error" : ""
                                }
                            >
                                <option value="">Seleccionar</option>
                                <option value="administrador">Administrador</option>
                                <option value="recepcionista">Recepcionista</option>

                            </select>

                            {errores.rol &&
                                <span className="error">
                                    {errores.rol}
                                </span>
                            }
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

                                // Bordes rojos para los errores

                                className={
                                    errores.nombres ? "input-error" : ""
                                }
                            />

                            {errores.nombres &&
                                <span className="error">
                                    {errores.nombres}
                                </span>
                            }

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

                                // Bordes rojos para los errores

                                className={
                                    errores.apellidos ? "input-error" : ""
                                }
                            />

                            {errores.apellidos &&
                                <span className="error">
                                    {errores.apellidos}
                                </span>
                            }
                        </div>

                        {/* Tipo de documento */}
                        <div className="campo">

                            <label>Tipo de documento *</label>

                            <select
                                name="tipoDocumento"
                                value={formData.tipoDocumento}
                                onChange={handleChange}

                                // Borde rojo para los errores
                                className={
                                    errores.tipoDocumento ? "input-error" : ""
                                }
                            >

                                <option value="">Seleccionar</option>
                                <option value="CC">Cédula de ciudadanía</option>
                                <option value="TI">Tarjeta de identidad</option>
                                <option value="CE">Cédula de extranjería</option>

                            </select>

                            {errores.tipoDocumento &&
                                <span className="error">
                                    {errores.tipoDocumento}
                                </span>
                            }
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

                                // Bordes rojos para los errores
                                className={
                                errores.documento ? "input-error" : ""
                            }
                            />
                            
                            {errores.documento &&
                            <span className="error">
                                {errores.documento}
                            </span>
                            }

                        </div>

                        {/* Teléfono */}
                        <div className="campo">

                            <label>Telefono *</label>
                            
                            <input
                                type="tel"
                                name="telefono"
                                placeholder="Digite su número telefónico"
                                value={formData.telefono}
                                onChange={handleChange}

                                // Bordes rojos para los errores
                                className={
                                    errores.telefono ? "input-error" : ""
                                }
                            />

                            {errores.telefono &&
                                <span className="error">
                                    {errores.telefono}
                                </span>
                            }
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

                                // Bordes rojos para los errores
                                className={
                                    errores.correo ? "input-error" : ""
                                }
                            />
                            
                            {errores.correo &&
                                <span className="error">
                                    {errores.correo}
                                </span>
                            }
                        </div>

                        {/* Fecha de nacimiento */}
                        <div className="campo">

                            <label>Fecha de nacimiento *</label>

                            <input
                                type="date"
                                name="fechaNacimiento"
                                value={formData.fechaNacimiento}
                                onChange={handleChange}

                                // Bordes rojos para los errores
                                className={
                                    errores.fechaNacimiento ? "input-error" : ""
                                }
                            />

                            {errores.fechaNacimiento &&
                                <span className="error">
                                    {errores.fechaNacimiento}
                                </span>
                            }
                        </div>

                        {/* Contraseña */}
                        <div className="campo">

                            <label>Contraseña *</label>

                            <input
                                type={mostrarPassword ? "text" : "password"}
                                name="password"
                                placeholder="Ingrese su contraseña"
                                value={formData.password}
                                onChange={handleChange}

                                // Bordes rojos para los errores
                                className={
                                    errores.password ? "input-error" : ""
                                }
                            />

                            {errores.password &&
                                <span className="error">
                                    {errores.password}
                                </span>
                            }

                        </div>
                        
                        {/* Mostrar contraseña */}
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
                                Mostar contraseña
                            </label>

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

                                // Bordes rojos para los errores
                                className={
                                    errores.confirmarPassword ? "input-error" : ""
                                }
                            />


                            {errores.confirmarPassword &&
                                <span className="error">
                                    {errores.confirmarPassword}
                                </span>
                            }

                        </div>

                    </div>

                    <p className="nota">
                        El número de documento será utilizado como usuario del sistema.
                    </p>

                    <button type="submit">
                        Continuar
                    </button>

                    <button 
                        type="button"
                        onClick={() => navigate ("/") }
                    >
                        Volver al login
                    </button>

                </form>
            </div>
        </div>
    );
}

export default RegistroUsuario;