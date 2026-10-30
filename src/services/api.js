// Importar libreria axios para hacer peticiones HTTP
import axios from "axios";

// Crear una instancia de axios
const api = axios.create({
    // Todas las peticiones comenzaran desde esta direccion
    baseURL: 'http://localhost:3000/api'
});

// Interceptor para agregar el token a las peticiones
api.interceptors.request.use(

    // Configurar el interceptor para agregar el token a las peticiones
    (config) => {

        // Obtener el token del localStorage
        const token = localStorage.getItem("token");

        // Si existe el token, agregarlo a la cabecera de la petición
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Interceptor para detectar sesiones vencidas
api.interceptors.response.use(

    // Si la petición es exitosa, continuar normalmente
    (respuesta) => {
        return respuesta;
    },

    // Si ocurre un error en la petición
    (error) => {

        // Obtener el código de respuesta del servidor
        const estado = error.response?.status;

        // Comprobar si la petición llevaba un token
        const teniaToken = Boolean(
            error.config?.headers?.Authorization
        );

        // Detectar si el servidor rechazó la sesión
        if (estado === 401 && teniaToken) {

            // Eliminar los datos de la sesión
            localStorage.removeItem("token");
            localStorage.removeItem("usuario");
            localStorage.removeItem("usuarioLogueado");
            localStorage.removeItem("usuarioNombre");
            localStorage.removeItem("usuarioRol");

            // Informar al usuario
            alert("Tu sesión ha expirado. Por favor, inicia sesión nuevamente.");

            // Regresar al login
            window.location.href = "/";
        }

        return Promise.reject(error);
    }
);

export default api;