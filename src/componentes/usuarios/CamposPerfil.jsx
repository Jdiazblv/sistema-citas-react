import React from "react";
import SelectorEps from "./SelectorEps";

const ESPECIALIDADES = [
    "Medicina general",
    "Pediatría",
    "Medicina interna",
    "Dermatología",
    "Cardiología"
];

// Se reutiliza en los registros de usuarios, pacientes y médicos.
export default function CamposPerfil({ rol, datos, onChange }) {
    if (rol === "Paciente") return <>
        <h3>Datos del paciente</h3>
        <div className="campo">
            <label htmlFor="perfil-sexo">Sexo *</label>
            <div className="registro-select">
                <select id="perfil-sexo" name="sexo" value={datos.sexo} onChange={onChange} required>
                    <option value="">Seleccionar</option>
                    <option value="Femenino">Femenino</option>
                    <option value="Masculino">Masculino</option>
                    <option value="Otro">Otro</option>
                </select>
            </div>
        </div>
        <div className="campo">
            <label htmlFor="perfil-direccion">Dirección *</label>
            <input id="perfil-direccion" name="direccion" value={datos.direccion} onChange={onChange} required />
        </div>
        <div className="campo">
            <label htmlFor="perfil-eps">EPS (opcional)</label>
            <SelectorEps
                id="perfil-eps"
                value={datos.eps}
                onChange={(value) => onChange({ target: { name: "eps", value } })}
            />
        </div>
    </>;

    // Campos para el registro de médicos
    if (rol === "Medico") {
        const seleccionadas = datos.especialidades.split(",").map((valor) => valor.trim()).filter(Boolean);

        function cambiarEspecialidad(especialidad, marcada) {
            const nuevas = marcada
                ? [...seleccionadas, especialidad]
                : seleccionadas.filter((valor) => valor !== especialidad);
            onChange({ target: { name: "especialidades", value: nuevas.join(",") } });
        }

        return <>

            <h3>Datos profesionales del médico</h3>
            <div className="campo">
                <span id="etiqueta-especialidades" className="registro-especialidades__etiqueta">
                    Especialidades *
                </span>
                <details className="registro-especialidades">
                    <summary aria-labelledby="etiqueta-especialidades resumen-especialidades">
                        <span id="resumen-especialidades">
                            {seleccionadas.length
                                ? `${seleccionadas.length} seleccionada${seleccionadas.length === 1 ? "" : "s"}`
                                : "Seleccionar especialidades"}
                        </span>
                    </summary>
                    <div className="registro-especialidades__opciones" role="group" aria-labelledby="etiqueta-especialidades">
                        {ESPECIALIDADES.map((especialidad) => (
                            <label key={especialidad}>
                                <input
                                    type="checkbox"
                                    checked={seleccionadas.includes(especialidad)}
                                    onChange={(e) => cambiarEspecialidad(especialidad, e.target.checked)}
                                />
                                {especialidad}
                            </label>
                        ))}
                        <div className="registro-especialidades__acciones">
                            <button
                                type="button"
                                onClick={(e) => {
                                    const desplegable = e.currentTarget.closest("details");
                                    desplegable.open = false;
                                    desplegable.querySelector("summary").focus();
                                }}
                            >
                                Hecho
                            </button>
                        </div>
                    </div>
                </details>
            </div>
            <div className="campo">
                <label htmlFor="perfil-registro">Registro profesional *</label>
                <input id="perfil-registro" name="registroProfesional" value={datos.registroProfesional} onChange={onChange} required />
            </div>
        </>;
    }
    return null;
}
