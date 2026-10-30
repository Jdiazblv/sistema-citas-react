import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa';
import "./GestionUsuarios.css";
import api from "../services/api";

function GestionUsuarios({ listaUsuarios, setListaUsuarios }) {
    
    const navigate = useNavigate();

    // Estado para la búsqueda
    const [busqueda, setBusqueda] = useState('');

    // Cargar los usuarios al montar el componente
    useEffect(() => {

        const cargarUsuarios = async () => {

            try {

                const respuesta = await api.get('/users');
                setListaUsuarios(respuesta.data);
                console.log("Usuarios recibidos:", respuesta.data);

            } catch (error) {
                console.error(error);
            }

        };

        cargarUsuarios();

    }, [setListaUsuarios]);


    const usuariosFiltrados = (listaUsuarios || []).filter(((p) => {

            const texto = busqueda.toLowerCase();

            return (
                p.nombres.toLowerCase().includes(texto) ||
                p.apellidos.toLowerCase().includes(texto) ||
                p.documento.toLowerCase().includes(texto)
            );
    }));

    return (
        
        <div className = "container">

            <h2>Gestión de Usuarios</h2>

            <br />

            <h3>Usuarios Registrados</h3>


            <div className = "barra-superior">

                <div className = "buscador">

                    <FaSearch className = "icono-busqueda" />

                    <input
                        type = "text"
                        placeholder = "Buscar usuario por nombre o documento"
                        value = {busqueda}
                        onChange = {(e) => setBusqueda(e.target.value)}
                    />

                </div>

                <button 
                    className = "btn-nuevo"
                    onClick={() => navigate('/RegistroUsuario')}
                >
                    Nuevo Usuario
                </button>

            </div>

            <br />
            <br />

            <table className = "tabla-usuarios">

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

                    {usuariosFiltrados.map((p, index) => (

                            <tr key = {index}>

                                <td>{p.nombres} {p.apellidos}</td>
                                <td>{p.eps}</td>
                                <td>{p.documento}</td>
                                <td>{p.telefono}</td>

                                <td className="celda-acciones">
                                    <button
                                        className="btn-ver"
                                        onClick={() => navigate(`/perfil-usuario/${p._id}`)}
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

export default GestionUsuarios;