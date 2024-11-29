import axios from "axios"; 
import React, { useState, useEffect } from "react";
import { Stomp } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import Header from "../header";
import { useLocation } from "react-router-dom";

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
   const getTotalPacientes = (stompClient) => {
    if (stompClient && idEspecialista) {
      // Enviar o ID do especialista diretamente, sem envolver um objeto adicional
      stompClient.send("/app/contagemEspecialista", {}, idEspecialista.toString());  // Passando o ID como string
    }
  };

  const websocketChamarPacienteConection = () => {
    const socket = new SockJS("http://localhost:8080/fila-websocket"); // Endpoint do backend
    const stompClientInstance = Stomp.over(socket);

    stompClientInstance.connect({}, () => {
      console.log("Conectado ao WebSocket");

      // Inscrever-se no tópico para receber mensagens de pacientes chamados
      stompClientInstance.subscribe("/topic/pacienteChamado", (message) => {
        console.log(message);
        
        if (message.body) {
          const data = JSON.parse(message.body); // Mensagem recebida do backend
          console.log(data);
          setFormValues(data); // Atualiza o estado com o paciente chamado
          getTotalPacientes(stompClientInstance);
        }
      });

       // Inscrever-se no tópico '/topic/contagemAtualizada' para receber a contagem de pacientes
       stompClientInstance.subscribe("/topic/contagemAtualizada", (message) => {
        if (message.body) {
          const data = JSON.parse(message.body);  // Parse da mensagem recebida
          console.log("Pacientes em espera:", data.QuantidadePacientesEmEspera);
          setTotalPacientes(data.QuantidadePacientesEmEspera);  // Atualiza a contagem no estado
        }
      });

      // Solicitar a contagem de pacientes para o especialista específico
      getTotalPacientes(stompClientInstance);
    });

    setStompClient(stompClientInstance);

    // Desconectar ao desmontar o componente
    return () => {
      if (stompClientInstance) {
        stompClientInstance.disconnect(() => {
          console.log("Desconectado do WebSocket");
        });
      }
    };
  };

  // Enviar mensagem para o backend para chamar o paciente
  const chamarPaciente = () => {
    if (stompClient && idEspecialista) {
      stompClient.send("/app/chamarPaciente", {}, idEspecialista.toString()); // Envia para o endpoint configurado no backend
      setFormVisible(true); // Exibe o formulário
      setTotalPacientes((prevTotal) => prevTotal - 1); 
    }
  };

  // Função para salvar as anotações do paciente
  const handleSave = async () => {
    try {
      let response = await axios.put(`http://localhost:8080/fila/adicionarObservacaoProntuario?pacienteId=${formValues.id}&novaObservacao=${formValues.anotacao}`);

      console.log(response);

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
    websocketChamarPacienteConection();  
    return () => {
      if (stompClient) {
        stompClient.disconnect();
      }
    };
  }, [idEspecialista]);

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