import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa';
import "./GestionPacientes.css";
import api from "../services/api";

function GestionPacientes({ listaPacientes, setListaPacientes }) {
    
    const navigate = useNavigate();

    // Estado para la búsqueda
    const [busqueda, setBusqueda] = useState('');
    
    const obtenerPacientes = async () => {

        try {

            const respuesta = await api.get('/pacientes');
            setListaPacientes(respuesta.data);
            
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        obtenerPacientes();
    }, []);

    console.log(listaPacientes);

    const pacientesFiltrados = (listaPacientes || []).filter(((p) => {

        if (p.rol !== "Paciente") return false;
        
            const texto = busqueda.toLowerCase();

            return (
                p.nombres.toLowerCase().includes(texto) ||
                p.apellidos.toLowerCase().includes(texto) ||
                p.documento.toLowerCase().includes(texto)
            );
    }));

    return (
        
        <div className = "container">

            <h2>Gestión de Pacientes</h2>

            <br />

            <h3>Pacientes Registrados</h3>


            <div className = "barra-superior">

                <div className = "buscador">

                    <FaSearch className = "icono-busqueda" />

                    <input
                        type = "text"
                        placeholder = "Buscar paciente por nombre o documento"
                        value = {busqueda}
                        onChange = {(e) => setBusqueda(e.target.value)}
                    />

                </div>

                <button 
                    className = "btn-nuevo"
                    onClick = {() => navigate('/registro-paciente')}
                >
                    Nuevo Paciente
                </button>

            </div>

            <br />
            <br />

            <table className = "tabla-pacientes">

                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>EPS</th>
                        <th>Documento</th>
                        <th>Teléfono</th>
                        <th>Acciones</th>
                    </tr>
                </thead>

                <tbody>

                    {pacientesFiltrados.map((p, index) => (

                            <tr key = {index}>

                                <td>{p.nombres} {p.apellidos}</td>
                                <td>{p.eps}</td>
                                <td>{p.documento}</td>
                                <td>{p.telefono}</td>

                                <td className = "celda-acciones">

                                    <button
                                        className = "btn-ver"
                                        onClick = {() => navigate(`/perfil-paciente/${p._id}`)}
                                    >
                                        Ver
                                    </button>

                                </td>

                            </tr>
                        ))}

                </tbody>

            </table>

        </div>
    );

}

export default GestionPacientes;