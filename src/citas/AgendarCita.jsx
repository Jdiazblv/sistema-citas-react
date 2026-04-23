import React, { useState } from "react";
import "./AgendarCita.css";

function AgendarCita({ listaPacientes }) {

    // Estado donde se guardan los datos de la cita
    const [cita, setCita] = useState({
        paciente: "",
        especialidad: "",
        doctor: "",
        fecha: "",
        hora: "",
        motivo: ""
    });

    // Estado donde se guardan las citas
    const [listaCitas, setListaCitas] = useState(() => {

        const citasGuardadas = 
            localStorage.getItem("listaCitas");

        return citasGuardadas
            ? JSON.parse(citasGuardadas)
            : [];
    });

    // Captura cambios en inputs
    const handleChange = (e) => {

        setCita({
            ...cita,
            [e.target.name]: e.target.value
        });
    };

    // Eliminar cita
    const eliminarCita = (index) => {

        const nuevasCitas = listaCitas.filter(
            (c, i) => i !== index
        );

        setListaCitas(nuevasCitas);
    };

    // Enviar formulario
    const handleSubmit = (e) => {

        e.preventDefault();

        // Validar que existan pacientes
        if ((listaPacientes || []).length === 0) {
            alert("Debe registrar pacientes primero");
            return;
        }

        // Validar campos obligatorios
        if (
            !cita.paciente ||
            !cita.especialidad ||
            !cita.doctor ||
            !cita.fecha ||
            !cita.hora ||
            !cita.motivo
        ) {
            alert("Debe completar todos los campos");
            return;
        }

        // Guardar citas
        const nuevasCitas = [
            ...listaCitas,
            cita
        ];

        setListaCitas(nuevasCitas);

        // Guardar en localstorage
        localStorage.setItem(
            "listaCitas",
            JSON.stringify(nuevasCitas)
        );

        console.log("Cita agendada:", cita);

        alert("Cita agendada correctamente");

        // Limpiar formulario
        setCita({
            paciente: "",
            especialidad: "",
            doctor: "",
            fecha: "",
            hora: "",
            motivo: ""
        });

    };

    return (

        <div>

            <h2>Agendar cita</h2>

            <form onSubmit={handleSubmit}>

                <div>

                    <label>Paciente:</label>

                    <select
                        name="paciente"
                        value={cita.paciente}
                        onChange={handleChange}
                        required
                    >

                        <option value="">
                            Seleccione un paciente
                        </option>

                        {(listaPacientes || [])
                            .filter(p => p.rol === "paciente")
                            .map((p, index) => (

                                <option
                                    key={index}
                                    value={p.nombres}
                                >
                                    {p.nombres} {p.apellidos}
                                </option>

                        ))}

                    </select>

                </div>

                <div>
                    <label>Especialidad:</label>

                    <input
                        type="text"
                        name="especialidad"
                        value={cita.especialidad}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div>
                    <label>Doctor:</label>

                    <input
                        type="text"
                        name="doctor"
                        value={cita.doctor}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div>
                    <label>Fecha:</label>

                    <input
                        type="date"
                        name="fecha"
                        value={cita.fecha}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div>
                    <label>Hora:</label>

                    <input
                        type="time"
                        name="hora"
                        value={cita.hora}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div>
                    <label>Motivo:</label>

                    <input
                        type="text"
                        name="motivo"
                        value={cita.motivo}
                        onChange={handleChange}
                        required
                    />
                </div>

                <button type="submit">
                    Agendar Cita
                </button>

            </form>

            <h3>Citas agendadas</h3>

            <table border="1">

                <thead>

                    <tr>
                        <th>Paciente</th>
                        <th>Especialidad</th>
                        <th>Doctor</th>
                        <th>Fecha</th>
                        <th>Hora</th>
                        <th>Motivo</th>
                        <th>Acción</th>
                    </tr>

                </thead>

                <tbody>

                    {(listaCitas || []).map((c, index) => (

                        <tr key={index}>

                            <td>{c.paciente}</td>
                            <td>{c.especialidad}</td>
                            <td>{c.doctor}</td>
                            <td>{c.fecha}</td>
                            <td>{c.hora}</td>
                            <td>{c.motivo}</td>

                            <td>

                                <button
                                    onClick={() =>
                                        eliminarCita(index)
                                    }
                                >
                                    Eliminar
                                </button>

                            </td>

                        </tr>

                    ))}

                </tbody>

            </table>

        </div>

    );
}

export default AgendarCita;