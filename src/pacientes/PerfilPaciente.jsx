import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";
//import "./PerfilPaciente.css";

function PerfilPaciente() {

    const { id } = useParams();

    const [paciente, setPaciente] = useState(null);

    const [editando, setEditando] = useState(false);

    const obtenerPaciente = async () => {

        try {

            const respuesta = await api.get(`/pacientes/${id}`);
            console.log(respuesta.data);
            setPaciente(respuesta.data);


        } catch (error) {
            console.error(error);
        }
    };

    const guardarCambios = async () => {
        
        try {
            
            // Actualiza el paciente que tiene este id con toda la información que hay en el estado paciente
            await api.put(`/pacientes/${id}`, paciente);

            // Mostrar los cambios actualizados de la base de datos
            obtenerPaciente();

            alert("Paciente actulaizado correctamente");

            // Sale del modo edicion
            setEditando(false);

        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {

        obtenerPaciente();

    }, []);

    return (

        <div className="container">

            {paciente && (

                <div>

                    {/* Operador ternario (reemplaza el if) */}
                    {editando ? (

                        <>
                            <h2>Editar Paciente</h2>

                            <h3>Datos Personales</h3>

                            <label>Nombres *</label>

                            <input
                                type="text"
                                value={paciente.nombres}
                                onChange={(e) =>
                                    setPaciente({
                                        ...paciente,
                                        nombres: e.target.value
                                    })
                                }
                            />

                            <label>Apellidos *</label>

                            <input
                                type="text"
                                value={paciente.apellidos}
                                onChange={(e) =>
                                    setPaciente({
                                        ...paciente,
                                        apellidos: e.target.value
                                    })
                                }
                            />

                            <label>Documento *</label>

                            <input
                                type="text"
                                value={paciente.documento}
                                onChange={(e) =>
                                    setPaciente({
                                        ...paciente,
                                        documento: e.target.value
                                    })
                                }
                            />

                            <label>Teléfono *</label>

                            <input
                                type="text"
                                value={paciente.telefono}
                                onChange={(e) =>
                                    setPaciente({
                                        ...paciente,
                                        telefono: e.target.value
                                    })
                                }
                            />

                            <label>Correo *</label>

                            <input
                                type="email"
                                value={paciente.correo}
                                onChange={(e) =>
                                    setPaciente({
                                        ...paciente,
                                        correo: e.target.value
                                    })
                                }
                            />

                            <label>EPS *</label>

                            <input
                                type="text"
                                value={paciente.eps}
                                onChange={(e) =>
                                    setPaciente({
                                        ...paciente,
                                        eps: e.target.value
                                    })
                                }
                            />

                            <br />

                            <button
                                type="button"
                                onClick={() => {
                                    obtenerPaciente();
                                    setEditando(false);
                                }}
                            >
                                Cancelar
                            </button>

                            <button
                                type="button"
                                onClick={guardarCambios}
                            >
                                Guardar Cambios
                            </button>

                        </> 

                    ) : (

                        <>

                            <h2>Paciente</h2>

                            <h3>
                                {paciente.nombres} {paciente.apellidos}
                            </h3>

                            <p>
                                Documento: {paciente.documento}
                            </p>

                            <p>
                                Teléfono: {paciente.telefono}
                            </p>

                            <p>
                                Correo: {paciente.correo}
                            </p>

                            <p>
                                EPS: {paciente.eps}
                            </p>

                            <button
                                onClick={() => setEditando(true)}
                            >
                                Editar
                            </button>

                        </>
                    )}

                </div>
            )}

        </div>
    );  
}

export default PerfilPaciente;