import React, { useState } from "react";

function RegistroPaciente({ listaPacientes, setListaPacientes }) {

  const [paciente, setPaciente] = useState({
    nombre: "",
    documento: "",
    telefono: "",
    correo: "",
    fechaNacimiento: ""
  });

  const handleChange = (e) => {
    setPaciente({
      ...paciente,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!paciente.nombre || !paciente.documento || !paciente.telefono || !paciente.correo || !paciente.fechaNacimiento) {
      alert("Debe completar todos los campos obligatorios");
      return;
    }

    setListaPacientes([...listaPacientes, paciente]);

    console.log("Paciente registrado:", paciente);

    alert("Paciente registrado correctamente");

    setPaciente({
      nombre: "",
      documento: "",
      telefono: "",
      correo: "",
      fechaNacimiento: ""
    });

  };

  return (
    <div>

      <h2>Registro de Paciente</h2>

      <form onSubmit={handleSubmit}>

        <div>
          <label>Nombre completo:</label>
          <input
            type="text"
            name="nombre"
            value={paciente.nombre}
            onChange={handleChange}
          />
        </div>

        <div>
          <label>Documento:</label>
          <input
            type="text"
            name="documento"
            value={paciente.documento}
            onChange={handleChange}
          />
        </div>

        <div>
          <label>Teléfono:</label>
          <input
            type="text"
            name="telefono"
            value={paciente.telefono}
            onChange={handleChange}
          />
        </div>

        <div>
          <label>Correo:</label>
          <input
            type="email"
            name="correo"
            value={paciente.correo}
            onChange={handleChange}
          />
        </div>

        <div>
          <label>Fecha de nacimiento:</label>
          <input
            type="date"
            name="fechaNacimiento"
            value={paciente.fechaNacimiento}
            onChange={handleChange}
          />
        </div>

        <button type="submit">Registrar Paciente</button>

      </form>

    <h3>Pacientes registrados</h3>
    
      <table border="1">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Documento</th>
            <th>Teléfono</th>
            <th>Correo</th>
          </tr>
        </thead>

        <tbody>
          {listaPacientes.map((p, index) => (
            <tr key={index}>
              <td>{p.nombre}</td>
              <td>{p.documento}</td>
              <td>{p.telefono}</td>
              <td>{p.correo}</td>
            </tr>
          ))}
        </tbody>

      </table>

    </div>
  );
}

export default RegistroPaciente;