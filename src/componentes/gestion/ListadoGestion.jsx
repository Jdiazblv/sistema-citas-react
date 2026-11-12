import React from "react";
import { Link } from "react-router-dom";
import { FaEye, FaPlus, FaSearch } from "react-icons/fa";
import "./ListadoGestion.css";

export default function ListadoGestion({
    titulo, entidad, rutaNuevo, textoNuevo, busqueda, setBusqueda,
    placeholder, columnas, filas, cargando, error
}) {
    return (
        <section className="listado-gestion" aria-labelledby="titulo-gestion">
            <header className="listado-gestion__encabezado">
                <h2 id="titulo-gestion">{titulo}</h2>
            </header>

            <div className="listado-gestion__barra">
                <div className="listado-gestion__busqueda">
                    <FaSearch aria-hidden="true" />
                    <input
                        type="search"
                        aria-label={`Buscar ${entidad}`}
                        placeholder={placeholder}
                        value={busqueda}
                        onChange={(e) => setBusqueda(e.target.value)}
                    />
                </div>
                {rutaNuevo && (
                    <Link className="listado-gestion__nuevo" to={rutaNuevo}>
                        <FaPlus aria-hidden="true" /> {textoNuevo}
                    </Link>
                )}
            </div>

            {error ? (
                <p className="listado-gestion__mensaje" role="alert">{error}</p>
            ) : cargando ? (
                <p className="listado-gestion__mensaje" role="status">Cargando {entidad}…</p>
            ) : (
                <div className="listado-gestion__desplazamiento" tabIndex={0} role="region" aria-label={`Tabla de ${entidad}`}>
                    <table className="listado-gestion__tabla">
                        <thead>
                            <tr>
                                {columnas.map((columna) => <th key={columna} scope="col">{columna}</th>)}
                                <th scope="col">Estado</th>
                                <th scope="col">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filas.length === 0 && (
                                <tr>
                                    <td colSpan={columnas.length + 2} className="listado-gestion__mensaje">
                                        {busqueda.trim() ? `No hay ${entidad} que coincidan con la búsqueda.` : `No hay ${entidad} registrados.`}
                                    </td>
                                </tr>
                            )}
                            {filas.map(({ id, celdas, activo, rutaPerfil, textoPerfil = "Ver / Editar" }) => (
                                <tr key={id}>
                                    {celdas.map((celda, indice) => <td key={columnas[indice]}>{celda}</td>)}
                                    <td>
                                        <span className={`listado-gestion__estado ${activo ? "listado-gestion__estado--activo" : ""}`}>
                                            {activo ? "Activo" : "Inactivo"}
                                        </span>
                                    </td>
                                    <td>
                                        <Link className="listado-gestion__ver" to={rutaPerfil}>
                                            <FaEye aria-hidden="true" /> {textoPerfil}
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </section>
    );
}
