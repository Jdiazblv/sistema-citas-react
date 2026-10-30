import React, {useState} from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import { Link } from "react-router-dom";
import api from "../services/api";

// Importar el hook useAuth desde el contexto de autenticación
import { useAuth } from "../context/AuthContext";

function Login() {

    // Hook dentro del componente

        // Obtener la función iniciarSesion del contexto de autenticación
        const { iniciarSesion } = useAuth();
        // Hook para navegar entre rutas
        const navigate = useNavigate();


    // Estados

        // Estado para el usuario
        const [usuario, setUsuario] = useState("");

        // Estado para la contraseña
        const [password, setPassword] = useState("");

        // Estado para mostrar mensajes de error
        const [error, setError] = useState("");

        // Estado para mostrar u ocultar la contraseña
        const [mostrarPassword, setMostrarPassword] = useState(false);

        // Estado para mostrar mensajes de error del documento
        const [errorDocumento, setErrorDocumento] = useState("");


        // Función para manejar el login
        async function manejarLogin(e) {

            // Evitar que el formulario se recargue
            e.preventDefault();

            // Validar campos vacíos
            if (!usuario || !password) {
                setError("Complete todos los campos.");
                return;
            }

            try {
                // Enviar las credenciales al backend
                const respuesta = await api.post("/login", {
                    documento: usuario,
                    password: password
                });

                // Obtener el token y los datos del usuario desde la respuesta
                const { token, usuario: datosUsuario } = respuesta.data;

                // Guardar la sesión mediante el contexto
                iniciarSesion(token, datosUsuario);

                // Limpiar el mensaje de error
                setError("");

                // Continuar al panel principal
                navigate("/dashboard");

            } catch (error) {
                if (error.response?.status === 401) {
                    setError("Documento o contraseña incorrectos.");
                } else {
                    setError(
                        error.response?.data?.mensaje ||
                        "No fue posible iniciar sesión. Verifique la conexión con el servidor."
                    );
                }
            }
        }

    return (

        <div className="login-container">
            <div className="login-card">

                <h2>
                    Clinica Médica
                </h2>

                <p>
                   ¯ Gestion de Citas Medicas
                </p>

                <form onSubmit={manejarLogin}>

                    <label>Documento *</label>

                    {/* Usuario */}

                    <input
                        type="text"
                        placeholder="Ingrese su documento"
                        value={usuario}

                        // Validación del documento (solo números y 10 dígitos)
                        onChange={(e) => {
                            const valor = e.target.value;

                            setUsuario(valor);

                            if (!valor) {
                                setErrorDocumento("Ingrese su documento.");
                            } else if (!/^\d+$/.test(valor)) {
                                setErrorDocumento("El documento debe contener solo números.");
                            } else if (valor.length !== 10) {
                                setErrorDocumento("La cédula debe tener 10 dígitos.");
                            } else {
                                setErrorDocumento("");
                            }

                            setError("");
                        }}
                        // Mostrar mensaje de error del documento
                        inputMode="numeric"
                        className={error ? "input-error" : ""}
                    />

                    {errorDocumento && (
                        <p className="error-text">
                            {errorDocumento}
                        </p>
                    )}

                    <label>Contraseña *</label>

                    {/* Password */}
                    <input
                        type={mostrarPassword ? "text" : "password"}
                        placeholder="Ingrese su contraseña"
                        value={password}
                        onChange={(e) =>
                            setPassword(e.target.value)
                        }

                        className={error ? "input-error" : ""}

                    />

                    <div className="mostrar-password">
                        <input
                            type="checkbox"
                            id="mostrarPassword"
                            checked={mostrarPassword}
                            onChange={() => 
                                setMostrarPassword(!mostrarPassword)
                            }
                        />
                        <label htmlFor="mostrarPassword">
                            Mostrar contraseña
                        </label>
                    </div>


                    {/* Error */}
                    {error &&(
                        <p className="error-text">
                            {error}
                        </p>
                    )}

                    <button type="submit">
                        Iniciar Sesion
                    </button>

                </form>

                {/* Registrarse */}
                <button 
                    className = "btn-secundario"
                    onClick={() => navigate("/RegistroUsuario")}
                >
                    Registrarse
                </button>

                {/* Recuperar contraseña */}
                <Link to="/OlvidoSuContrasena">
                    ¿Olvidó su contraseña?
                </Link>

            </div>

        </div>
    );
}

export default Login;