import React, { useEffect, useState } from "react";
import api from "../../services/api";

function MedicoDashboard() {
    const [citas, setCitas] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const obtenerCitas = async () => {
            try {
                const respuesta = await api.get("/citas");
                setCitas(respuesta.data);
            } catch (error) {
                console.error("Error al obtener citas:", error);
                setError("No fue posible cargar tus citas.");
            } finally {
                setCargando(false);
            }
        };

        obtenerCitas();
    }, []);

    const hoy = new Date();

    const fechaHoy = [
        hoy.getFullYear(),
        String(hoy.getMonth() + 1).padStart(2, "0"),
        String(hoy.getDate()).padStart(2, "0")
    ].join("-");

    const citasHoy = citas.filter(
        cita => cita.fecha === fechaHoy
    );

    const citasPendientes = citas.filter(
        cita => cita.estado === "Pendiente"
    );

    const citasConfirmadas = citas.filter(
        cita => cita.estado === "Confirmada"
    );

    return (
        <div className="panel-principal">
            <h1>Panel del Médico</h1>

            <p>
                Bienvenido al Sistema de Gestión de Citas Médicas.
                Aquí puedes consultar el resumen de tu agenda.
            </p>

            {error && <p>{error}</p>}

            <div className="cards">
                <div className="card azul">
                    <h2>{cargando ? "..." : citasHoy.length}</h2>
                    <p>Citas de hoy</p>
                </div>

                <div className="card verde">
                    <h2>{cargando ? "..." : citasPendientes.length}</h2>
                    <p>Citas pendientes</p>
                </div>

                <div className="card morado">
                    <h2>{cargando ? "..." : citasConfirmadas.length}</h2>
                    <p>Citas confirmadas</p>
                </div>
            </div>

            <div className="table-citas">
                <h2>Agenda del día</h2>

                {cargando ? (
                    <p>Cargando agenda...</p>
                ) : error ? null : citasHoy.length === 0 ? (
                    <p>No tienes citas programadas para hoy.</p>
                ) : (
                    citasHoy.map(cita => (
                        <div key={cita._id}>
                            <p>
                                <strong>Hora:</strong> {cita.hora}
                            </p>

                            <p>
                                <strong>Paciente:</strong>{" "}
                                {cita.pacienteId?.usuarioId?.nombres || "No disponible"}{" "}
                                {cita.pacienteId?.usuarioId?.apellidos || ""}
                            </p>

                            <p>
                                <strong>Motivo:</strong>{" "}
                                {cita.motivo || "No especificado"}
                            </p>

                            <p>
                                <strong>Estado:</strong> {cita.estado}
                            </p>

                            <hr />
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default MedicoDashboard;