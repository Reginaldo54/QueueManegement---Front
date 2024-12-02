import axios from "axios"; 
import React, { useState, useEffect } from "react";
import Header from "../header";
import { useLocation } from "react-router-dom";
import "./index.css";

export default function HomeMedico() {
  const location = useLocation();
  const { idEspecialista } = location.state || {}; 
  const [pacientesAtendidos, setPacientesAtendidos] = useState([]);
  const nomeUser = "Dr. João Oliveira"; // Nome do médico logado
  const [paciente, setPaciente] = useState([]); // Lista de pacientes
  const [formValues, setFormValues] = useState({}); // Dados do paciente no formulário
  const [formVisible, setFormVisible] = useState(false); // Controle de visibilidade do formulário
  const [totalPacientes, setTotalPacientes] = useState(0); // Total de pacientes
  const [stompClient, setStompClient] = useState(null);

   // Função para solicitar a contagem de pacientes
   const getTotalPacientes = async() => {
    try {
      const response = await axios.get(`http://localhost:8080/fila/contagemEspecialista/${idEspecialista}`);
      setTotalPacientes(response.data.QuantidadePacientesEmEspera);
    } catch (error) {
      console.log(error);
    }
   
  };

  // Enviar mensagem para o backend para chamar o paciente
  const chamarPaciente = async () => {
    try {
      const response = await axios.put(`http://localhost:8080/fila/chamarPaciente?idEspecialista=${idEspecialista}`);
      
      setFormValues(response.data);
      setFormVisible(true);
      console.log(formValues);
      getTotalPacientes();
    } catch (error) {
      console.log(error);
    }
  };

  // Função para salvar as anotações do paciente
  const handleSave = async () => {
    try {
      let response = await axios.put(`http://localhost:8080/fila/adicionarObservacaoProntuario?pacienteId=${formValues.id}&novaObservacao=${formValues.anotacao}`);

      setPacientesAtendidos((prevAtendidos) => [...prevAtendidos, formValues]); // Adiciona aos pacientes atendidos
      // Reduz o total de pacientes
      if (totalPacientes >= 1) {
        chamarPaciente(); // Chama o próximo paciente automaticamente
      } else {
        setFormVisible(false); // Esconde o formulário se não houver mais pacientes
      }
      alert("Paciente Atendido!")
    } catch (error) {
      console.error("Erro ao salvar a observação:", error);
    }
  };

  // Inicializa os dados ao montar o componente
  useEffect(() => {
    getTotalPacientes(); 
  }, [idEspecialista]);

  return (
    <div>
      <Header />

      <form className="formExtra" id="homeMedico">
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
              style={{marginLeft:'20px'}}
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
            <label>Nome:</label>
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
            <label>Prioridade:</label>
            <input
              name="prioridade"
              type="text"
              value={formValues.prioridade || ""}
              readOnly
            />
          </div>
          { formValues.horaChegada && (
            <div>
              <div className="field">
                <label>Data de Chegada:</label>
                <input
                  name="dataChegada"
                  type="text"
                  value={formValues.horaChegada ? formValues.horaChegada.split("T")[0] : ""}
                  readOnly
                />
              </div>
              <div className="field">
                <label>Hora de Chegada:</label>
                <input
                  name="horaChegada"
                  type="text"
                  value={formValues.horaChegada ? formValues.horaChegada.split("T")[1].split(".")[0] : ""}
                  readOnly
                />
              </div>
            </div>
           )}

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