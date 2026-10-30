
import React, { useEffect, useState } from "react";
import api from "../../services/api";

function RecepcionistaDashboard() {

    // Estados para manejar las citas y la carga de datos
    const [citas, setCitas] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState("");

    // Estados para manejar los pacientes
    const [totalPacientes, setTotalPacientes] = useState(0);
    const [errorPacientes, setErrorPacientes] = useState("");

    // Obtener las citas al cargar el componente
    useEffect(() => {

        // Función para obtener las citas desde la API
        const obtenerCitas = async () => {
            try {
                const respuesta = await api.get("/citas");
                setCitas(respuesta.data);
            } catch (error) {
                console.error("Error al obtener citas:", error);
                setError("No fue posible cargar las citas.");
            } finally {
                setCargando(false);
            }
        };

        // Función para obtener el total de pacientes desde la API
        const obtenerPacientes = async () => {
            try {
                const respuesta = await api.get("/pacientes");
                setTotalPacientes(respuesta.data.length);
            } catch (error) {
                console.error("Error al obtener pacientes:", error);
                setErrorPacientes("No fue posible cargar los pacientes.");
            }
        };

        obtenerCitas();
        obtenerPacientes();
    }, []);

    // Obtener la fecha actual en formato YYYY-MM-DD
    const hoy = new Date();

    const fechaHoy = [
        hoy.getFullYear(),
        String(hoy.getMonth() + 1).padStart(2, "0"),
        String(hoy.getDate()).padStart(2, "0")
    ].join("-");

    // Filtrar las citas programadas para hoy
    const citasHoy = citas.filter(
        (cita) => cita.fecha === fechaHoy
    );

    // Contar las citas pendientes
    const citasPendientes = citas.filter(
        (cita) => cita.estado === "Pendiente"
    );

    return (
        <div className="panel-principal">

            <h1>Panel de Recepción</h1>

            <p>
                Bienvenido al área de recepción del
                Sistema de Gestión de Citas Médicas.
            </p>

            {/* Resumen de recepción */}
            <div className="cards">

                <div className="card azul">
                    <h2>{cargando ? "..." : citasHoy.length}</h2>
                    <p>Citas de hoy</p>
                </div>

                <div className="card verde">
                    <h2>{cargando ? "..." : citasPendientes.length}</h2>
                    <p>Citas pendientes</p>
                </div>

                <div className="card celeste">
                    <h2>
                        {errorPacientes ? "!" : totalPacientes}
                    </h2>
                    <p>Pacientes registrados</p>
                </div>

            </div>

            {/* Agenda del día */}
            <div className="table-citas">

                <h2>Agenda del día</h2>

                {cargando ? (
                    <p>Cargando agenda...</p>
                ) : error ? (
                    <p>{error}</p>
                ) : citasHoy.length === 0 ? (
                    <p>No hay citas programadas para hoy.</p>
                ) : (
                    <div>
                        {citasHoy.map((cita) => (
                            <div key={cita._id}>

                                <p>
                                    <strong>Hora:</strong> {cita.hora}
                                </p>

                                <p>
                                    <strong>Paciente:</strong>{" "}
                                    {cita.pacienteId?.usuarioId?.nombre
                                        || "No disponible"}
                                </p>

                                <p>
                                    <strong>Médico:</strong>{" "}
                                    {cita.medicoId?.usuarioId?.nombre
                                        || "No disponible"}
                                </p>

                                <p>
                                    <strong>Estado:</strong> {cita.estado}
                                </p>

                                <hr />

                            </div>
                        ))}
                    </div>
                )}

            </div>

        </div>
    );
}

export default RecepcionistaDashboard;
