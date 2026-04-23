import React, {useEffect} from "react";
import { useNavigate } from "react-router-dom";

import "./Dashboard.css";

function Dashboard() {

  const navigate = useNavigate();

  useEffect(() => {

    const usuarioLogueado = localStorage.getItem("usuarioLogueado");

    if(!usuarioLogueado) {
      navigate("/");
    }
  }, [navigate]);
  
  return (
  
    <div className="panel-principal">

      <h1>Panel Principal</h1>

      {/* Tarjetas */}

      <div className="cards">

        {/* Citas programadas*/}
        <div 
          className="card azul"
          onClick={() => navigate("/agendar-cita")}
        >
          <h2>147</h2>
          <p>Citas programadas</p>
        </div>

        {/* Total de pacientes */}
        <div 
          className="card verde"
          onClick={() => navigate("/registro-paciente")}
        >
          <h2>120</h2>
          <p>Total pacientes</p>
        </div>

        {/* Médicos disponibles */}
        <div 
          className="card morado"
          onClick={() => navigate("/configuracion")}
        >
          <h2>8</h2>
          <p>Médicos disponibles</p>
        </div>

        {/* Citas para hoy */}
        <div 
          className="card celeste"
          onClick={() => navigate("/calendario")}
        >
          <h2>25</h2>
          <p>Citas para hoy</p>
        </div>

      </div>

      {/* Tabla dinamica */}

      <div className="table-citas">

        <h2>Citas pendientes</h2>

        <table>
          <thead>

            <tr>
              <th>Paciente</th>
              <th>Fecha</th>
              <th>Médico</th>
              <th>Estado</th>
            </tr>
          </thead>

          <tbody>

            <tr>
              <td>Andrea Torres</td>
              <td>14/05/2026</td>
              <td>Dr.Perez</td>
              <td className="pendiente">Pendiente</td>
            </tr>
            
            <tr>
              <td>Ricardo Gómez</td>
              <td>12/06/2026</td>
              <td>Dr. Silva</td>
              <td className="confirmada">Confirmada</td>
            </tr>

            <tr>
              <td>Carlos Hernández</td>
              <td>Hoy</td>
              <td>Dr. Silva</td>
              <td className="cancelada">Cancelada</td>
            </tr>

          </tbody>
        </table>

      </div>
    </div>
  );
}

export default Dashboard;