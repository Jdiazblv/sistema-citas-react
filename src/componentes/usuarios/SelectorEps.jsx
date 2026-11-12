import React, { useState } from "react";

const EPS = [
    "SURA",
    "Sanitas",
    "Nueva EPS",
    "Salud Total",
    "Compensar",
    "Famisanar",
    "Coosalud",
    "Particular"
];

const OTRA_EPS = "__otra_eps__";

export default function SelectorEps({ id, value = "", onChange, disabled, onBlur }) {
    const [otra, setOtra] = useState(() => Boolean(value && !EPS.includes(value)));

    return <>
        <div className="registro-select">
            <select
                id={id}
                value={otra ? OTRA_EPS : value}
                onChange={(e) => {
                    const seleccion = e.target.value;
                    setOtra(seleccion === OTRA_EPS);
                    onChange(seleccion === OTRA_EPS ? "" : seleccion);
                }}
                onBlur={onBlur}
                disabled={disabled}
            >
                <option value="">Seleccionar</option>
                {EPS.map((eps) => <option key={eps} value={eps}>{eps}</option>)}
                <option value={OTRA_EPS}>Otro...</option>
            </select>
        </div>
        {otra && <>
            <label htmlFor={`${id}-otra`}>Nombre de la EPS</label>
            <input
                id={`${id}-otra`}
                name="eps"
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                onBlur={onBlur}
                disabled={disabled}
                placeholder="Escribe el nombre de la EPS"
            />
        </>}
    </>;
}
