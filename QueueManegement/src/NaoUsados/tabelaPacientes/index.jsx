import React, { useEffect, useRef, useState } from "react";
import "./index.css";
import axios from "axios";
import BuscarPosicaoPaciente from "../buscarPaciente/index.jsx";

export default function PatientTable() {
  const rowRefs = useRef([]);
  const [pacientes, setPacientes] = useState([]);
  const [posicaoPaciente, setPosicaoPaciente] = useState(null); // Estado para a posição do paciente

  useEffect(() => {
    const fetchPacientes = async () => {
      try {
        const response = await axios.get("http://localhost:8080/fila/ver");
        const pacientesData = response.data;
        setPacientes(pacientesData);

        // Atualiza a posição do paciente com base em algum critério
        if (posicaoPaciente != null) 
        {
          const pacienteAtual = pacientesData.find(p => p.id_paciente === pacientes[posicaoPaciente]?.id_paciente);
          if (pacienteAtual) 
          {
            // Atualiza a posição do paciente se ele ainda estiver na lista
            const novaPosicao = pacientesData.findIndex(p => p.id_paciente === pacienteAtual.id_paciente);
            setPosicaoPaciente(novaPosicao);
            //alert(novaPosicao);
          } 
          else 
          {
            // Se o paciente não estiver mais, reseta a posição
            setPosicaoPaciente(null);
          }
        }
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
  }, [posicaoPaciente]);

  useEffect(() => {
    // Limpa o destaque se posicaoPaciente for null
    rowRefs.current.forEach((row) => row?.classList.remove("highlight-row"));

    // Aplica o destaque e centraliza apenas se posicaoPaciente for válida
    if (posicaoPaciente != null && rowRefs.current[posicaoPaciente]) { // Subtraindo 1 para ajustar ao índice da tabela
      const selectedRow = rowRefs.current[posicaoPaciente];
      selectedRow.scrollIntoView({ behavior: "smooth", block: "center" });
      selectedRow.classList.add("highlight-row");
    }
  }, [posicaoPaciente]);

  const handlePosicaoEncontrada = (posicao) => {

    setPosicaoPaciente(posicao); // Atualiza a posição do paciente quando encontrada
  };

  return (
    <div className="table-container">
      <BuscarPosicaoPaciente onPosicaoEncontrada={handlePosicaoEncontrada} />

      <h2>Pacientes na Fila de Atendimento</h2>
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
            
            
            <tr
              key={paciente.id_paciente}
              ref={(el) => (rowRefs.current[index] = el)}
              className={index === posicaoPaciente ? "highlight-row" : ""}
            >
              <td>{index + 1}</td> {/* Posição na lista */}
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
