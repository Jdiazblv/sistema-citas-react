import React, { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";


// ==========================================
// CONTEXTO Y AUTENTICACIÓN
// ==========================================

import { AuthProvider } from "./context/AuthContext";
import RutaProtegida from "./context/RutaProtegida";
import ControlInactividad from "./context/ControlInactividad";


// ==========================================
// PÁGINAS PRINCIPALES
// ==========================================

import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import OlvidoSuContrasena from "./pages/OlvidoSuContrasena";


// ==========================================
// GESTIÓN DE USUARIOS
// ==========================================

import RegistroUsuario from "./Usuarios/RegistroUsuario";
import GestionUsuarios from "./Usuarios/GestionUsuarios";
import PerfilUsuario from "./Usuarios/PerfilUsuario";


// ==========================================
// GESTIÓN DE PACIENTES
// ==========================================

import RegistroPacientes from "./pacientes/RegistroPacientes";
import GestionPacientes from "./pacientes/GestionPacientes";
import PerfilPaciente from "./pacientes/PerfilPaciente";


// ==========================================
// GESTIÓN DE MÉDICOS
// ==========================================

import GestionMedicos from "./Medicos/GestionMedicos";


// ==========================================
// GESTIÓN DE CITAS
// ==========================================

import AgendarCita from "./citas/AgendarCita";
import Calendario from "./citas/Calendario";


// ==========================================
// CONFIGURACIÓN Y DISEÑO
// ==========================================

import Configuracion from "./configuracion/Configuracion";
import Layout from "./layout/Layout";


// ==========================================
// COMPONENTE PRINCIPAL
// ==========================================

function App() {

    // Estados para compartir información entre componentes
    const [listaPacientes, setListaPacientes] = useState([]);
    const [listaUsuarios, setListaUsuarios] = useState([]);
    const [listaMedicos, setListaMedicos] = useState([]);


    return (

        // Proveedor del contexto de autenticación
        <AuthProvider>

            <ControlInactividad />

            <BrowserRouter>

                <Routes>


                    {/* ======================================
                        RUTAS PÚBLICAS (SIN AUTENTICACIÓN)
                    ====================================== */}

                    {/* Inicio de sesión */}
                    <Route
                        path="/"
                        element={<Login />}
                    />

                    {/* Recuperación de contraseña */}
                    <Route
                        path="/OlvidoSuContrasena"
                        element={<OlvidoSuContrasena />}
                    />


                    {/* ======================================
                        RUTAS PRIVADAS (REQUIEREN SESIÓN)
                    ====================================== */}

                    <Route element={<RutaProtegida />}>

                        {/* Layout principal: Navbar, Sidebar y Footer */}
                        <Route element={<Layout />}>


                            {/* ======================================
                                DASHBOARD
                                Acceso para todos los roles
                            ====================================== */}

                            <Route
                                path="/dashboard"
                                element={<Dashboard />}
                            />


                            {/* ======================================
                                ADMINISTRACIÓN DE USUARIOS
                                Acceso exclusivo del administrador
                            ====================================== */}

                            <Route element={
                                <RutaProtegida
                                    rolesPermitidos={["Administrador"]}
                                />
                            }>

                                {/* Gestión de usuarios */}
                                <Route
                                    path="/gestion-usuarios"
                                    element={
                                        <GestionUsuarios
                                            listaUsuarios={listaUsuarios}
                                            setListaUsuarios={setListaUsuarios}
                                        />
                                    }
                                />

                                {/* Registro de usuarios */}
                                <Route
                                    path="/RegistroUsuario"
                                    element={<RegistroUsuario />}
                                />

                                {/* Perfil de usuario */}
                                <Route
                                    path="/perfil-usuario/:id"
                                    element={<PerfilUsuario />}
                                />

                            </Route>


                            {/* ======================================
                                GESTIÓN DE PACIENTES
                                Administrador y recepcionista
                            ====================================== */}

                            <Route element={
                                <RutaProtegida
                                    rolesPermitidos={[
                                        "Administrador",
                                        "Recepcionista"
                                    ]}
                                />
                            }>

                                {/* Listado de pacientes */}
                                <Route
                                    path="/gestion-pacientes"
                                    element={
                                        <GestionPacientes
                                            listaPacientes={listaPacientes}
                                            setListaPacientes={setListaPacientes}
                                        />
                                    }
                                />

                                {/* Registro de pacientes */}
                                <Route
                                    path="/registro-paciente"
                                    element={
                                        <RegistroPacientes
                                            listaPacientes={listaPacientes}
                                            setListaPacientes={setListaPacientes}
                                        />
                                    }
                                />

                                {/* Perfil de paciente */}
                                <Route
                                    path="/perfil-paciente/:id"
                                    element={<PerfilPaciente />}
                                />

                                {/* Gestión de médicos */}
                                <Route
                                    path="/gestion-medicos"
                                    element={
                                        <GestionMedicos
                                            listaMedicos={listaMedicos}
                                            setListaMedicos={setListaMedicos}
                                        />
                                    }
                                />

                                {/* Agendamiento de citas */}
                                <Route
                                    path="/agendar-cita"
                                    element={
                                        <AgendarCita
                                            listaPacientes={listaPacientes}
                                        />
                                    }
                                />

                            </Route>


                            {/* ======================================
                                CALENDARIO Y CITAS
                                Acceso para todos los roles
                            ====================================== */}

                            <Route element={
                                <RutaProtegida
                                    rolesPermitidos={[
                                        "Administrador",
                                        "Recepcionista",
                                        "Medico",
                                        "Paciente"
                                    ]}
                                />
                            }>

                                <Route
                                    path="/calendario"
                                    element={<Calendario />}
                                />

                            </Route>


                            {/* ======================================
                                CONFIGURACIÓN Y PERFIL
                                Administrador, médico y paciente
                            ====================================== */}

                            <Route element={
                                <RutaProtegida
                                    rolesPermitidos={[
                                        "Administrador",
                                        "Medico",
                                        "Paciente"
                                    ]}
                                />
                            }>

                                <Route
                                    path="/configuracion"
                                    element={<Configuracion />}
                                />

                            </Route>


                        </Route>

                    </Route>


                    {/* ======================================
                        RUTA PARA DIRECCIONES NO EXISTENTES
                    ====================================== */}

                    <Route
                        path="*"
                        element={<Navigate to="/" replace />}
                    />


                </Routes>

            </BrowserRouter>

        </AuthProvider>

    );
}

export default App;