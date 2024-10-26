import React, { useState, useEffect } from "react";
import axios from "axios";
import "./index.css";
export default function FilaDeAtendimento() {
  const [pacientes, setPacientes] = useState([]);
  const [pacienteDestaque, setPacienteDestaque] = useState(null);

  useEffect(() => {
    const fetchPacientes = async () => {
      try {
        const response = await axios.get("http://localhost:8080/fila/ver");
        setPacientes(response.data);
      } catch (error) {
        console.error("Erro ao buscar pacientes:", error);
      }
    };

    // Chama a função para buscar pacientes inicialmente
    fetchPacientes();

    // Configura o intervalo para atualizar a lista a cada 5 segundos
    const intervalId = setInterval(fetchPacientes, 5000);

    // Limpa o intervalo ao desmontar o componente
    return () => clearInterval(intervalId);
  }, []);

  const handleProximoPaciente = async () => {
    if (pacientes.length > 0) {
      try {
        // Chama o endpoint para atender o próximo paciente
        const response = await axios.get("http://localhost:8080/fila/chamar");

        // O paciente em destaque é o que foi retornado pelo servidor
        setPacienteDestaque(response.data);

        // Atualiza a lista de pacientes chamando o endpoint /fila/ver
        const updatedPacientesResponse = await axios.get("http://localhost:8080/fila/ver");
        setPacientes(updatedPacientesResponse.data);
      } catch (error) {
        console.error("Erro ao chamar o paciente:", error);
      }
    }
  };

  return (
    <div className="fila-container">
      <h2>Fila de Atendimento</h2>
      
      {pacienteDestaque && (
        <div className="paciente-destaque">
          <h3>Paciente da vez:</h3>
          <p><strong>Nome Completo:</strong> {pacienteDestaque.nomeCompleto}</p>
          <p><strong>Sintoma:</strong> {pacienteDestaque.sintoma_paciente}</p>
          <p><strong>Consulta Desejada:</strong> {pacienteDestaque.consulta_desejada}</p>
          <p><strong>Categoria de Triagem:</strong> {pacienteDestaque.categoriaTriagem}</p>
          <p><strong>Data e Hora de Chegada:</strong> {new Date(pacienteDestaque.dataHoraChegada).toLocaleString()}</p>
        </div>
      )}

      <button onClick={handleProximoPaciente} className="btn-proximo-paciente">
        Próximo Paciente
      </button>

      <table className="patient-table">
        <thead>
          <tr>
            <th>Posição</th>
            <th>Nome Completo</th>
            <th>Sintoma</th>
            <th>Consulta Desejada</th>
            <th>Categoria de Triagem</th>
            <th>Data e Hora de Chegada</th>
          </tr>
        </thead>
        <tbody>
          {pacientes.map((paciente, index) => (
            <tr key={paciente.id_paciente}>
              <td>{index + 1}</td> {/* Exibe a posição como índice + 1 */}
              <td>{paciente.nomeCompleto}</td>
              <td>{paciente.sintoma_paciente}</td>
              <td>{paciente.consulta_desejada}</td>
              <td>{paciente.categoriaTriagem}</td>
              <td>{new Date(paciente.dataHoraChegada).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
