import React, { useEffect, useState } from "react";
import api from "../../services/api";

function AdminDashboard() {
    const [totales, setTotales] = useState({
        usuarios: 0,
        pacientes: 0,
        medicos: 0,
        citas: 0
    });

    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const obtenerTotales = async () => {
            try {
                const [
                    respuestaUsuarios,
                    respuestaPacientes,
                    respuestaMedicos,
                    respuestaCitas
                ] = await Promise.all([
                    api.get("/users"),
                    api.get("/pacientes"),
                    api.get("/medicos"),
                    api.get("/citas")
                ]);

                setTotales({
                    usuarios: respuestaUsuarios.data.length,
                    pacientes: respuestaPacientes.data.length,
                    medicos: respuestaMedicos.data.length,
                    citas: respuestaCitas.data.length
                });
            } catch (error) {
                console.error(
                    "Error al obtener los datos del panel:",
                    error
                );
                setError("No fue posible cargar las estadísticas.");
            } finally {
                setCargando(false);
            }
        };

        obtenerTotales();
    }, []);

    return (
        <div className="panel-principal">
            <h1>Panel de Administración</h1>

            <p>
                Bienvenido al panel de administración del Sistema de
                Gestión de Citas Médicas.
            </p>

            {error && <p>{error}</p>}

            <div className="cards">
                <div className="card azul">
                    <h2>{cargando ? "..." : totales.usuarios}</h2>
                    <p>Usuarios registrados</p>
                </div>

                <div className="card verde">
                    <h2>{cargando ? "..." : totales.pacientes}</h2>
                    <p>Pacientes registrados</p>
                </div>

                <div className="card morado">
                    <h2>{cargando ? "..." : totales.medicos}</h2>
                    <p>Médicos registrados</p>
                </div>

                <div className="card celeste">
                    <h2>{cargando ? "..." : totales.citas}</h2>
                    <p>Citas registradas</p>
                </div>
            </div>

            <div className="table-citas">
                <h2>Resumen de actividad</h2>
                <p>
                    Aquí puedes consultar el resumen general de los
                    usuarios, pacientes, médicos y citas registradas
                    en el sistema.
                </p>
            </div>
        </div>
    );
}

export default AdminDashboard;