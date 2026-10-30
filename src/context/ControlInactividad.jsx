import { useEffect, useRef } from "react";
import { useAuth } from "./AuthContext";

// Tiempo máximo de inactividad: 30 minutos
const TIEMPO_INACTIVIDAD = 30 * 60 * 1000;

// Eventos que indican actividad del usuario
const EVENTOS_ACTIVIDAD = [
    "mousemove",
    "mousedown",
    "keydown",
    "scroll",
    "touchstart",
    "click"
];

function ControlInactividad() {

    const { autenticado, cerrarSesion } = useAuth();

    // Referencia para controlar el temporizador
    const temporizador = useRef(null);

    useEffect(() => {

        // Si no hay una sesión activa, no iniciar el contador
        if (!autenticado) {
            return;
        }

        // Cerrar sesión por inactividad
        const cerrarPorInactividad = () => {

            alert("Tu sesión se ha cerrado por inactividad.");

            cerrarSesion();

            window.location.href = "/";
        };

        // Reiniciar el contador
        const reiniciarTemporizador = () => {

            clearTimeout(temporizador.current);

            temporizador.current = setTimeout(
                cerrarPorInactividad,
                TIEMPO_INACTIVIDAD
            );
        };

        // Detectar actividad del usuario
        EVENTOS_ACTIVIDAD.forEach((evento) => {

            window.addEventListener(evento, reiniciarTemporizador);

        });

        // Iniciar el contador
        reiniciarTemporizador();

        // Limpiar eventos y temporizador
        return () => {

            EVENTOS_ACTIVIDAD.forEach((evento) => {

                window.removeEventListener(evento, reiniciarTemporizador);

            });

            clearTimeout(temporizador.current);

        };

    }, [autenticado, cerrarSesion]);

    return null;
}

export default ControlInactividad;