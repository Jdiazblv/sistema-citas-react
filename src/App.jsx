import React, { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate} from "react-router-dom";

/* pages */
import Dashboard from "./pages/Dashboard";
import RegistroUsuario from "./pages/RegistroUsuario";
import Login from "./pages/Login";
import OlvidoSuContrasena from "./pages/OlvidoSuContrasena";

/* Usuarios */
import GestionUsuarios from "./Usuarios/GestionUsuarios";

/* Pacientes */
import RegistroPacientes from "./pacientes/RegistroPacientes";
import GestionPacientes from "./pacientes/GestionPacientes";
import PerfilPaciente from "./pacientes/PerfilPaciente";

/* Medicos */
import GestionMedicos from "./Medicos/GestionMedicos";

/* citas */
import AgendarCita from "./citas/AgendarCita";
import Calendario from "./citas/Calendario";

/* Configuracion */
import Configuracion from "./configuracion/Configuracion";
import Layout from "./layout/Layout";


function App() {

    const [listaPacientes, setListaPacientes] = useState([]);

    return (
    
        <BrowserRouter>

            <Routes>
            
                {/* Ruta Loging (sin layout) */}
                <Route path = "/" element = {<Login />} />
            
                <Route
                    path = "/RegistroUsuario"
                    element = {<RegistroUsuario />}
                />

                <Route
                    path = "/OlvidoSuContrasena"
                    element = {<OlvidoSuContrasena />}
                />

                {/* Rutas con layout */}
                <Route element = {<Layout />}>

                <Route
                    path = "/dashboard"
                    element = {<Dashboard />}
                />

                <Route 
                    path = "/gestion-usuarios"
                    element = {<GestionUsuarios />}
                />

                <Route
                    path = "/gestion-pacientes"
                    element = {
                        <GestionPacientes
                            listaPacientes={listaPacientes}
                            setListaPacientes={setListaPacientes}
                        />
                    }
                />

                <Route
                    path = "/registro-paciente"
                    element = {
                        <RegistroPacientes
                            listaPacientes={listaPacientes}
                            setListaPacientes={setListaPacientes}
                        />
                    }
                />

                <Route
                    path = "/perfil-paciente/:id"
                    element = {<PerfilPaciente />}
                />

                <Route 
                    path = "/gestion-medicos"
                    element = {<GestionMedicos />}
                />

                <Route
                    path = "/agendar-cita"
                    element = {
                        <AgendarCita
                            listaPacientes={listaPacientes}
                        />
                    }
                />
            
                <Route
                    path = "/calendario"
                    element = {<Calendario />}
                />
            
                <Route
                    path = "/configuracion"
                    element = {<Configuracion />}
                />
                </Route>

                {/* Redireccion por si la ruta no existe*/}
                <Route
                    path = "*"
                    element = {<Navigate to = "/" />}
                />
        
            </Routes>
        </BrowserRouter>
    
    );
}

export default App;