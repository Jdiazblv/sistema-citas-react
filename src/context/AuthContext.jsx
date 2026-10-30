import React, { createContext, useContext, useState, useCallback } from "react";


// Crear el contexto de autenticación
const AuthContext = createContext();

// Proveedor de autenticación
export function AuthProvider({ children }) {

    // Recuperar la sesión guardada
    const [usuario, setUsuario] = useState(() => {
        return JSON.parse(localStorage.getItem("usuario") || "null");
    });

    const [token, setToken] = useState(() => {
        return localStorage.getItem("token");
    });

    // Iniciar sesión
    const iniciarSesion = (nuevoToken, datosUsuario) => {

        localStorage.setItem("token", nuevoToken);
        localStorage.setItem("usuario", JSON.stringify(datosUsuario));

        // Mantener compatibilidad con el código actual
        localStorage.setItem("usuarioLogueado", "true");
        localStorage.setItem("usuarioNombre", datosUsuario.nombres);
        localStorage.setItem("usuarioRol", datosUsuario.rol);

        setToken(nuevoToken);
        setUsuario(datosUsuario);
    };

    // Cerrar sesión
    const cerrarSesion = useCallback(() => {
        localStorage.removeItem("token");
        localStorage.removeItem("usuario");
        localStorage.removeItem("usuarioLogueado");
        localStorage.removeItem("usuarioNombre");
        localStorage.removeItem("usuarioRol");

        setToken(null);
        setUsuario(null);
    }, []);

    return (
        <AuthContext.Provider
            value={{
                usuario,
                token,
                iniciarSesion,
                cerrarSesion,
                autenticado: Boolean(token && usuario)
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

// Hook para utilizar la autenticación
export function useAuth() {
    return useContext(AuthContext);
}