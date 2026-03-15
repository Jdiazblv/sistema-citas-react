import React, {useState} from "react";

function AgendarCita({ listaPacientes }) {

    // Estado donde se guardar los datos de la cita
    const [ cita, setCita ] = useState({
        paciente: "",
        especialidad: "",
        doctor: "",
        fecha: "",
        hora: "",
        motivo: ""
    });

    // Estado donde se guardan las citas
    const [ listaCitas, setListaCitas ] = useState ([]);

    // Captura lo que el usuario digita en los inputs
    const handleChange = (e) => {

        setCita({
            ...cita,
            [e.target.name]: e.target.value
        });
    };

    // Función para eliminar una cita
    const eliminarCita = (index) => {
        const nuevasCitas = listaCitas.filter((cita, i) => i !== index);
        setListaCitas(nuevasCitas);
    };

    // Cuando se envia el formulario
    const handleSubmit = (e) => {
        e.preventDefault();

        // Guardamos la cita en la lista
        setListaCitas([...listaCitas, cita]);

        console.log("Cita agendada: ", cita);

        alert("Cita agendada correctamente");

        // Limpiar el formulario
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

            <form onSubmit={ handleSubmit }>

                <div>
                    <label>Paciente:</label>

                    {/* Select que muestra los pacientes registrados */}
                    <select
                        name = "paciente"
                        value = {cita.paciente}
                        onChange = { handleChange }
                    >
                        <option value="">Seleccione un paciente</option>

                        {listaPacientes.map((p,index) => (

                            <option key={index} value={p.nombre}>
                                {p.nombre}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label>Especialidad:</label>

                    <input 
                        type="text"
                        name = "especialidad"
                        value = { cita.especialidad }
                        onChange = { handleChange }
                    />
                </div>
                <div>
                    <label>Doctor:</label>

                    <input 
                        type="text"
                        name = "doctor"
                        value = {cita.doctor}
                        onChange = { handleChange}
                    />
                </div>
                <div>
                    <label>Fecha:</label>
                    
                    <input
                        type="date"
                        name="fecha"
                        value={cita.fecha}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label>Hora:</label>
                    <input
                        type="time"
                        name="hora"
                        value={cita.hora}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label>Motivo:</label>
                    
                    <input
                        type="text"
                        name="motivo"
                        value={cita.motivo}
                        onChange={handleChange}
                    />
                </div>

                <button type="submit">Agendar Cita</button>

            </form>

            <h3>Citas agendadas</h3>

            {/* Tabla de citas medicas */}
            <table border = "1">

                <thead>
                    <tr>
                        <th>Paciente</th>
                        <th>Especialidad</th>
                        <th>Doctor</th>
                        <th>Fecha</th>
                        <th>Hora</th>
                        <th>Motivo</th>
                        <th>Accion</th>
                    </tr>
                </thead>

                <tbody>
                    {listaCitas.map((c, index) => (

                        <tr key = { index }>

                            <td>{c.paciente}</td>
                            <td>{c.especialidad}</td>
                            <td>{c.doctor}</td>
                            <td>{c.fecha}</td>
                            <td>{c.hora}</td>
                            <td>{c.motivo}</td>
                            <td>
                                <button onClick={() => eliminarCita(index)}>
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