import React, { useEffect, useState } from "react";
import api from "../../services/api";

function PacienteDashboard() {
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

    const citasPendientes = citas.filter(
        cita => cita.estado === "Pendiente"
    );

    const citasConfirmadas = citas.filter(
        cita => cita.estado === "Confirmada"
    );

    return (
        <div className="panel-principal">
            <h1>Panel del Paciente</h1>

            <p>
                Bienvenido al Sistema de Gestión de Citas Médicas.
                Aquí puedes consultar el estado de tus citas.
            </p>

            {error && <p>{error}</p>}

            <div className="cards">
                <div className="card azul">
                    <h2>{cargando ? "..." : citas.length}</h2>
                    <p>Total de mis citas</p>
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
                <h2>Mis citas médicas</h2>

                {cargando ? (
                    <p>Cargando tus citas...</p>
                ) : error ? null : citas.length === 0 ? (
                    <p>Aún no tienes citas registradas.</p>
                ) : (
                    citas.map(cita => (
                        <div key={cita._id}>
                            <p>
                                <strong>Fecha:</strong> {cita.fecha}
                            </p>

                            <p>
                                <strong>Hora:</strong> {cita.hora}
                            </p>

                            <p>
                                <strong>Médico:</strong>{" "}
                                {cita.medicoId?.usuarioId?.nombres || "No disponible"}{" "}
                                {cita.medicoId?.usuarioId?.apellidos || ""}
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

export default PacienteDashboard;