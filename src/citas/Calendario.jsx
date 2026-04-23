import React, { useEffect, useState } from "react";

function Calendario() {

    const [listaCitas, setListaCitas] = useState ([]);

    useEffect(() => {

        const citasGuardadas = localStorage.getItem("listaCitas");

        if(citasGuardadas) {
            setListaCitas(JSON.parse(citasGuardadas));
        }
    }, []);

    return (

        <div className="container mt-4">

            <h2>Calendario de Citas Médicas</h2>

            <table className="table table-bordered mt-3">

                <thead className="table-dark">

                    <tr>
                        <th>Fecha</th>
                        <th>Hora</th>
                        <th>Paciente</th>
                        <th>Médico</th>
                        <th>Especialidad</th>
                    </tr>

                </thead>

                <tbody>

                    {listaCitas.length === 0 ? (

                        <tr>
                            <td colSpan="5">
                                No hay citas registradas
                            </td>
                        </tr>

                    ) : (

                        listaCitas.map((cita, index) => (

                            <tr key={index}>

                                <td>{cita.fecha}</td>
                                <td>{cita.hora}</td>
                                <td>{cita.paciente}</td>
                                <td>{cita.medico}</td>
                                <td>{cita.especialidad} </td>

                            </tr>

                        ))
                    )}

                </tbody>

            </table>
        </div>
    );
}
export default Calendario;