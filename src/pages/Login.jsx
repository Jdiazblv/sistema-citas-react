import React, {useState} from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import { Link } from "react-router-dom";

function Login() {

    // Hook dentro del componente
    const navigate = useNavigate();

    // Estados
    const [usuario, setUsuario] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [mostrarPassword, setMostrarPassword] = useState(false);

    function manejarLogin(e) {

        e.preventDefault();

        // Validar campos vacios
        if(!usuario || !password) {
            setError("Complete todos los campos.");
            return;
        }

        // Leer usuario guardado
        const usuarioGuardado = JSON.parse(
            localStorage.getItem("usuarioRegistrado")
        );

        // Verificar si existe el usuario
        if(!usuarioGuardado) {
            setError("No hay usuarios registrados.");
            return;
        }

        // Validar documento y contraseña

        if (usuario === usuarioGuardado.documento && password === usuarioGuardado.password) {
            // Guardar sesión
            localStorage.setItem(
                "usuarioLogueado","true"
            );

            // Guardar nombre real

            localStorage.setItem(
                "usuarioNombre",
                usuarioGuardado.nombres
            );

            alert("Inicio de sesión exitoso");
            navigate("/dashboard");
        }
        else {
            setError("Documento o contraseña incorrectos.");
        }

    }

    return (
        <div className="login-container">
            <div className="login-card">

                <h2>
                    Clinica Médica
                </h2>

                <p>
                    Gestion de Citas Medicas
                </p>

                <form onSubmit={manejarLogin}>

                    <label>Documento *</label>

                    {/* Usuario */}
                    <input
                        type="text"
                        placeholder="Ingrese su documento"
                        value={usuario}
                        onChange={(e) => 
                            setUsuario (e.target.value)
                        }
                        
                        className={error ? "input-error" : ""}
                    />

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