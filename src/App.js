import React, { useState } from "react";
import RegistroPaciente from "./components/RegistroPaciente";
import AgendarCita from "./components/agendarcita";
import "./App.css";

function App() {

  // Estado principal donde se guardaron todos los pacientes
  const [listaPacientes, setListaPacientes] = useState ([]);

  return (
    <div className="container">

      <h1>Sistema de Gestión de Citas Médicas</h1>

      {/* Enviamos la lista de pacientes al componente de registro */}
      <RegistroPaciente 
        listaPacientes={listaPacientes}
        setListaPacientes={setListaPacientes}
      />

      <hr />

      {/* Enviamos la lista de pacientes a formulario de citas */}
      <AgendarCita 
        listaPacientes={listaPacientes}
      />

    </div>
  );
}

export default App;