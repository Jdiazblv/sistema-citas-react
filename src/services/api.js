// Importar libreria axios para hacer peticiones HTTP
import axios from "axios";

// Crear una instancia de axios
const api = axios.create({
    // Todas las peticiones comenzaran desde esta direccion
    baseURL: 'http://localhost:3000/api'
});

export default api;