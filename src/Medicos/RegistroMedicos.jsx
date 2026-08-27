import React, { useState, useEffect } from "react";
import "./RegistroMedicos.css";
import api from "../services/api";

function RegistroMedicos({ listaMedicos, setListaMedicos }) {
    
    const [formData, setFormData] = useState({
        rol: "Medico",
        especialidades: [],
        registroProfesional: "",
        nombres: "",
        apellidos: "",
        tipoDocumento: "",
        documento: "",
        correo: "",
        telefono: "",
        fechaNacimiento: "",
        sexo: "",
        direccion: "",
        password: "",
        confirmarPassword: ""
    });

    // Estado para los errores
    const [errores, setErrores] = useState ({});

    // Estado para mostrar contraseña
    const [mostrarPassword, setMostrarPassword] = useState(false);

        const obtenerMedicos = async () => {

            try {
                const respuesta = await api.get("/medicos");
                setListaMedicos(respuesta.data);
            } catch (error) {
                console.error("Error al obtener medicos:", error);
            }
        };

    // Obtener medicos de la api
    useEffect(() => {
        obtenerMedicos();
    }, []); 

    // Manejar cambios
    const handleChange = (e) => {
        
        const { name, value } = e.target;
        
            setFormData({
                ...formData,
            [name]: value
        });

        // Validar en tiempo real
        let nuevosErrores = { ...errores };

        // Especialidades
        if(name === "especialidades") {
            
            if(!value) {
                nuevosErrores.especialidades =
                "Ingrese la especialidad";
            } else {
                delete nuevosErrores.especialidades;
            }
        }

        // Registro profesional
        if(name === "registroProfesional") {

            if(!value) {
                nuevosErrores.registroProfesional =
                    "Ingrese su registro profesional"
            } else {
                delete nuevosErrores.registroProfesional;
            }
        }

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
                    "Documento inválido"
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

        // Sexo
        if(name === "sexo") {

            if(!value) {
                nuevosErrores.sexo =
                    "Seleccione su sexo"
            } else {
                delete nuevosErrores.sexo;
            }
        }

        // Dirección
        if(name === "direccion") {

            if(!value) {
                nuevosErrores.direccion =
                    "Ingrese su dirección"
            } else {
                delete nuevosErrores.direccion;
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
    };

    // Enviar formulario
    const handleSubmit = async (e) => {
        
        e.preventDefault();

        let nuevosErrores = {};

        // Especialidades
        if(!formData.especialidades) {
            nuevosErrores.especialidades =
                "Ingrese la especialidad"
        }

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

        // Sexo
        if (!formData.sexo) {
            nuevosErrores.sexo =
                "Seleccione su sexo";
        }

        // Dirección
        if(!formData.direccion) {
            nuevosErrores.direccion =
                "Ingrese su dirección"
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

            try {

                const medico = {
                    
                    // Objeto nuevo - Guardar los datos necesarios del medico
                    rol: formData.rol,
                    especialidades: formData.especialidades,
                    registroProfesional: formData.registroProfesional,
                    nombres: formData.nombres,
                    apellidos: formData.apellidos,
                    tipoDocumento: formData.tipoDocumento,
                    documento: formData.documento,
                    correo: formData.correo,
                    telefono: formData.telefono,
                    fechaNacimiento: formData.fechaNacimiento,
                    sexo: formData.sexo,
                    direccion: formData.direccion,
                    password: formData.password
                };

                await api.post("/medicos", medico);
                await obtenerMedicos();

            } catch (error) {

                console.error("Error al registrar medico.", error);

                return;
            }

            // Mensaje
            alert("Usuario registrado correctamente")

            // Limpiar formulario
            setFormData({
                rol: "Medico",
                especialidades: "",
                registroProfesional: "",
                nombres: "",
                apellidos: "",
                tipoDocumento: "",
                documento: "",
                telefono: "",
                correo: "",
                fechaNacimiento: "",
                sexo: "",
                direccion: "",
                password: "",
                confirmarPassword: ""
            });
        }

    };

    return (
    
        <div className="container">

            <h2>Registro de Medico</h2>

            <form onSubmit={handleSubmit} className="registro-form">

                <h3>Datos personales: </h3>

                {/* Especialidades (Solo si es médico)*/}
                <div className="campo">

                    <label>Especialidades *</label>

                    <input
                        type="text"
                        name="especialidades"
                        value={formData.especialidades}
                        onChange={handleChange}
                        placeholder="Ingrese la especialidad"

                        // Bordes rojos para los errores
                        className={
                            errores.especialidades ? "input-error" : ""
                        }
                    />

                    {errores.especialidades &&
                        <span className="error">
                            {errores.especialidades}
                        </span>
                    }

                </div>

                {/* Registro profesional */}
                <div className="campo">

                    <label></label>

                    <input
                        type="text"
                        name="registroProfesional"
                        value={formData.registroProfesional}
                        onChange={handleChange}
                        placeholder="Ingrese el registro profesional"

                        // Bordes rojos para los errores
                        className={
                            errores.registroProfesional ? "input-error" : ""
                        }
                    />
                    {errores.registroProfesional &&
                        <span className="error">
                            {errores.registroProfesional}
                        </span>
                    }
                
                </div>
        
                {/* Nombres */}
                <div className="campo">

                    <label>Nombres *</label>

                    <input
                        type="text"
                        name="nombres"
                        value={formData.nombres}
                        onChange={handleChange}
                        placeholder="Ingrese sus nombres"

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
                        value={formData.apellidos}
                        onChange={handleChange}
                        placeholder="Ingrese sus apellidos"

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
                        <option value = "">Seleccionar</option>
                        <option value = "CC">Cédula de ciudadanía</option>
                        <option value = "TI">Tarjeta de identidad</option>
                        <option value = "CE">Cédula de extranjería</option>

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
                        value={formData.documento}
                        onChange={handleChange}
                        placeholder="Ingrese el documento"

                        // Borde rojo para los errores
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

                    <label>Teléfono *</label>

                    <input
                        type="text"
                        name="telefono"
                        value={formData.telefono}
                        onChange={handleChange}
                        placeholder="Ingrese el teléfono"

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

                {/* Correo */}
                <div className="campo">

                    <label>Correo electrónico *</label>

                    <input
                        type="email"
                        name="correo"
                        value={formData.correo}
                        onChange={handleChange}
                        placeholder="Ingrese su correo electrónico"

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

                {/* Sexo */}
                <div className="campo">

                    <label>Sexo *</label>

                    <select
                        name="sexo"
                        value={formData.sexo}
                        onChange={handleChange}

                        // Bordes rojos para los errores
                        className={
                            errores.sexo ? "input-error" : ""
                        }
                    >
                        <option value = "">Seleccionar</option>
                        <option value = "M">Masculino</option>
                        <option value = "F">Femenino</option>
                        <option value = "O">Otro</option>

                    </select>

                    {errores.sexo &&
                        <span className="error">
                            {errores.sexo}
                        </span>
                    }

                </div>

                {/* Dirección */}
                <div className="campo">

                    <label>Dirección *</label>

                    <input
                        type="text"
                        name="direccion"
                        value={formData.direccion}
                        onChange={handleChange}
                        placeholder="Ingrese su dirección"

                        // Borde rojo para los errores
                        className={
                            errores.direccion ? "input-error" : ""
                        }
                    />

                    {errores.direccion &&
                        <span className="error">
                            {errores.direccion}
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

                <button type="submit">
                    Registrar
                </button>

                </form>

                <h3>Médicos registrados</h3>

                <table className="tabla-medicos">

                    <thead>

                        <tr>
                            <th>Nombres</th>
                            <th>Especialidades</th>
                            <th>Documento</th>
                            <th>Teléfono</th>
                            <th>Correo</th>
                        </tr>

                    </thead>

                    <tbody>

                        {(listaMedicos || []).filter(p => p.rol === "Medico").map((p, index) => (
                            
                            <tr key={index}>

                                <td>{p.nombres} {p.apellidos}</td>
                                <td>{p.especialidades}</td>
                                <td>{p.documento}</td>
                                <td>{p.telefono}</td>
                                <td>{p.correo}</td>

                            </tr>

                        ))}

                    </tbody>
                </table>

        </div>
    );
}

export default RegistroMedicos;