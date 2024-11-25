import "./index.css";
import React, { useState, useEffect } from "react";
import Header from "../header";
import axios from "axios"; // Usaremos axios para a requisição à API
import { useLocation } from "react-router-dom";

export default function HomeMedico() {
  const location = useLocation();
  const { idEspecialista } = location.state || {}; 
  const nomeUser = "Dr. João Oliveira"; // Nome do médico logado
  const [pacientes, setPacientes] = useState([]); // Lista de pacientes
  const [pacientesAtendidos, setPacientesAtendidos] = useState([]); // Lista de pacientes atendidos
  const [formValues, setFormValues] = useState({}); // Dados do paciente no formulário
  const [formVisible, setFormVisible] = useState(false); // Controle de visibilidade do formulário
  const [totalPacientes, setTotalPacientes] = useState(0); // Total de pacientes
  
  // Função para obter o total de pacientes
  const getTotalPacientes = async () => {
    try {
      console.log(idEspecialista);
      
      const response = await axios.get(`http://localhost:8080/fila/contagemEspecialista/${idEspecialista}`);
      setTotalPacientes(response.data.QuantidadePacientesEmEspera); // Atualizando o total de pacientes
    } catch (error) {
      console.error("Erro ao buscar o total de pacientes:", error);
    }
  };

  // Função para chamar um paciente
  const chamarPaciente = async () => {
    try {
      const response = await axios.put(`http://localhost:8080/fila/chamarPaciente?idEspecialista=${idEspecialista}`);
      if (response.data) {
        const paciente = response.data;
        alert(`Paciente chamado: ${paciente.nome}`);
        setFormValues(paciente); // Atualiza os valores do formulário com os dados do paciente
        setPacientes((prev) => [...prev, paciente]); // Adiciona o paciente à lista
        setFormVisible(true); // Exibe o formulário
        
        setTotalPacientes((prevTotal) => prevTotal - 1);
      }
    } catch (error) {
      console.error("Erro ao chamar paciente:", error);
    }
  };

  // Função para salvar as anotações do paciente
  const handleSave = async () => {
    try {
     let response =  await axios.put(`http://localhost:8080/fila/adicionarObservacaoProntuario?pacienteId=${formValues.id}&novaObservacao=${formValues.anotacao}`);

      console.log(response);
      

      setPacientesAtendidos((prevAtendidos) => [...prevAtendidos, formValues]); // Adiciona aos pacientes atendidos
       // Reduz o total de pacientes

      if (totalPacientes >= 1) {
        chamarPaciente(); // Chama o próximo paciente automaticamente
      } else {
        setFormVisible(false); // Esconde o formulário se não houver mais pacientes
      }
    } catch (error) {
      console.error("Erro ao salvar a observação:", error);
    }
  };

  // Inicializa os dados ao montar o componente
  useEffect(() => {
    getTotalPacientes();
  }, []);

  return (
    <div>
      <Header />

      <form className="formExtra">
        <div>
          <h2>Olá, {nomeUser}</h2>
          <h3 id="totalPacientes">
            <span>Total de Pacientes:</span>{" "}
            <span>{totalPacientes}</span>
          </h3>
          {!formVisible && totalPacientes > 0 && (
            <button
              onClick={(e) => {
                e.preventDefault();
                chamarPaciente();
              }}
              className="butao atendimento"
            >
              Iniciar Atendimento
            </button>
          )}
        </div>
      </form>

      {formVisible && (
        <form>
          <h2>Paciente Atual</h2>
          <div className="field">
            <label>Nome Completo:</label>
            <input
              type="text"
              name="nome"
              value={formValues.nome || ""}
              readOnly
            />
          </div>
          <div className="field">
            <label>Sexo:</label>
            <input
              name="sexo"
              type="text"
              value={formValues.sexo || ""}
              readOnly
            />
          </div>
          <div className="field">
            <label>Anotação:</label>
            <textarea
              name="anotacao"
              value={formValues.anotacao || ""}
              onChange={(e) =>
                setFormValues({ ...formValues, anotacao: e.target.value })
              }
              placeholder="Adicione as observações do paciente"
            />
          </div>
          <div className="buttons">
            <button
              type="button"
              onClick={handleSave}
              className="butao"
            >
              Salvar e Chamar Próximo
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
