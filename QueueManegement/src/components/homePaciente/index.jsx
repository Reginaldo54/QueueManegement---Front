import React, { useEffect, useState } from "react";
import iconTime from "../../assets/icon_time.png";
import "./index.css";
import { useNavigate } from "react-router-dom";
import icon_add from "../../assets/icon_add.png";
import Header from "../header";
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';
import Login from "../login";

export default function HomePaciente() {
  const navigate = useNavigate();

  const [fila, setFila] = useState([
    { id: 1, nome: "João Silva" },
    { id: 2, nome: "Maria Santos"},
  ]);
  const [tempoRestante, setTempoRestante] = useState(90);

  const [pacientes, setPacientes] = useState([]);
  const [telaAtual, setTelaAtual] = useState("inserirCodigo");
  const [codigoInserido, setCodigoInserido] = useState("");
  const [pacienteSelecionado, setPacienteSelecionado] = useState(null);
  const [agendamentoConfirmado, setAgendamentoConfirmado] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Controlar estado de carregamento
  const [client, setClient] = useState(null); 

  const hoje1 = new Date();
  hoje1.setHours(0, 0, 0, 0); // Ajusta a data para 00:00:00
  const hoje = hoje1.toISOString().split("T")[0]; 

  // Criação da conexão WebSocket
  const websocketChamarPacienteConection = () => {
    const socket = new SockJS("http://localhost:8080/fila-websocket"); // Endpoint do backend
    const stompClientInstance = Stomp.over(socket);

  stompClientInstance.connect({}, () => {
      console.log('Conectado ao WebSocket');

      // Assinao tópico de confirmação de presença
      stompClientInstance.subscribe('/topic/presencaConfirmada', (message) => {
        const body = JSON.parse(message.body);
        console.log(body); // Exibe a resposta recebida no console
      });
    }
  );

  stompClientInstance.activate();  // Ativa a conexão WebSocket
  setClient(stompClientInstance);  // Armazena o cliente STOMP na variável de estado

  // Cleanup: desativa a conexão quando o componente for desmontado
   // Desconectar ao desmontar o componente
   return () => {
    if (stompClientInstance) {
      stompClientInstance.disconnect(() => {
        console.log("Desconectado do WebSocket");
      });
    }
  };
}

  // Recuperar estado do localStorage ao carregar
  useEffect(() => {
    websocketChamarPacienteConection();
    const savedCodigo = localStorage.getItem("codigoInserido");
    const savedTela = localStorage.getItem("telaAtual");
    const savedPaciente = localStorage.getItem("pacienteSelecionado");

    if (savedCodigo) setCodigoInserido(savedCodigo);
    if (savedTela) setTelaAtual(savedTela);
    if (savedPaciente) setPacienteSelecionado(JSON.parse(savedPaciente));
  }, []);

  // Salvar estado no localStorage sempre que mudar
  useEffect(() => {
    localStorage.setItem("codigoInserido", codigoInserido);
    localStorage.setItem("telaAtual", telaAtual);
    if (pacienteSelecionado) {
      localStorage.setItem("pacienteSelecionado", JSON.stringify(pacienteSelecionado));
    }
  }, [codigoInserido, telaAtual, pacienteSelecionado]);

  const fetchAgendamentos = async (codigo) => {
    setIsLoading(true); // Começa a carregar
    try {
      const response = await fetch(
        `http://localhost:8080/fila/pegarAgendamentos?codigoCodigo=${codigo}`
      );
      if (!response.ok) {
        throw new Error("Código inválido.");
      }
      const agendamentos = await response.json();
      if (agendamentos.length === 0) {
        alert("Nenhum agendamento aguardando para este paciente.");
      } else {
        setPacientes(agendamentos);
        setTelaAtual("listaAgendamentos");
      }
    } catch (error) {
      alert(error.message);
      console.error("Erro ao buscar agendamentos:", error);
    } finally {
      setIsLoading(false); // Para de carregar
    }
  };

  const handleCodigoSubmit = async (e) => {
    e.preventDefault(); // Evita recarregar a página
    if (codigoInserido.trim()) {
      await fetchAgendamentos(codigoInserido.trim());
    } else {
      alert("Por favor, insira um código.");
    }
  };

 

  const handleAcessarFila = () => {
    setTelaAtual("filaDeEspera");
  };

  const handleConfirmar = async ( paciente, e) => {
   e.preventDefault();

    if (paciente.dataAgendamento !== hoje) {
      alert("Somente agendamentos de hoje podem ser confirmados.");
      return;
    }

    if (agendamentoConfirmado) {
      alert("Você já confirmou um agendamento hoje.");
      return;
    }

    let idAgendamento = paciente.id;
   
    
    let codigoCodigo = codigoInserido;
    const payload = {
      codigoCodigo,
      idAgendamento: parseInt(idAgendamento, 10)  // Garante que idAgendamento seja um número
    };
    console.log(payload);
    console.log(JSON.stringify(payload));
  
    if (client && client.connected) {
      try {
        // Envia a solicitação para confirmar a presença via WebSocket
        client.send("/app/marcarPresenca", {}, JSON.stringify(payload));
        
        alert("Agendamento confirmado com sucesso!");
        setAgendamentoConfirmado(true);
        fetchAgendamentos(codigoCodigo)
        setPacienteSelecionado(paciente);
      } catch (error) {
        console.log("error");
        
        console.log(error);
        
      }
    }
  }

  const renderInserirCodigo = () => (
    <form id="acessarConsulta" onSubmit={handleCodigoSubmit}>
      <div className="formButton">
        <h2>Insira seu código</h2>
      </div>
      <div className="field">
        <label htmlFor="codigo">Insira o código recebido:</label>
        <input
          type="text"
          id="codigoInput"
          placeholder="Código de Atendimento"
          value={codigoInserido}
          onChange={(e) => setCodigoInserido(e.target.value)}
          required
        />
      </div>
      <div className="formButton">
        <button type="submit" className="butao" disabled={isLoading}>
          {isLoading ? "Carregando..." : "Confirmar"}
        </button>
      </div>
    </form>
  );

  const renderListaAgendamentos = () => (
    <div className="fila-container">
      <form style={{ maxWidth: "1200px", textAlign: "center" }}>
        {pacientes[0] && <h1>Bem-vindo, {pacientes[0].nomePaciente}!</h1>}
        <div id="headerForm">
          <h2>Agendamentos Feitos</h2>
          <button>
            <img
              src={icon_add}
              alt="sinal de mais"
              title="Fazer novo agendamento"
              onClick={() => navigate("/formsignup")}
            />
          </button>
        </div>
        <ul className="fila-lista">
          {pacientes.map((paciente) => (
            <li key={paciente.id} className="fila-item" style={{ display: "flex", alignItems: "center" }}>
              <span style={{ marginLeft: "55px" }}>Médico: {paciente.nomeEspecialista}</span>
              <span>{paciente.dataAgendamento} - {paciente.horaAgendamento}</span>
              <span>Status: {paciente.status}</span>
              {paciente.status === "AGUARDANDO_CONFIRMACAO" && (
                <button type="submit" className="butao" onClick={ (e) => {handleConfirmar(paciente, e)}}>Confirmar</button>
              )}
              {paciente.status === "EM_ESPERA" && (
                <button onClick={handleAcessarFila} className="butao">
                  Acessar Fila
                </button>
              )}
            </li>
          ))}
        </ul>
      </form>
    </div>
  );

  const renderFilaDeEspera = () => 
  (
    <form style={{ padding: "20px", marginTop:"-6rem"}}>
    <h2>Olá, {pacienteSelecionado ? pacienteSelecionado.nomePaciente : "Paciente"}</h2>
    <p style={{ marginBottom: "8.6%" }}>Você está na fila, aguarde sua vez</p>

    <div style={{ margin: "20px 0", background: "#a6f85e66", padding: ".4rem", borderRadius: "35px" }}>
      <h3 style={{ display: "flex", alignItems: "center", gap: "15%", justifyContent: "flex-start" }}>
        <img src={iconTime} alt="Ícone de relógio" style={{ marginLeft: "12px" }} />
        <span style={{ fontSize: "24px" }}>{Math.max(0, tempoRestante)}s</span>
        <span style={{ textAlign: "center" }}>Tempo de espera aproximado</span>
      </h3>
    </div>

    <div>
      <h3 style={{ textAlign: "center", marginTop: "8.6%", marginBottom: "4.6%" }}>Sua posição na fila</h3>
      {fila.length === 0 ? (
        <p style={{ color: "green", textAlign: "center" }}>Você está sendo chamado para atendimento!</p>
      ) : (
        <div>
          <h2 style={{ color: "green", textAlign: "center" }}>{fila.length}º</h2>

          <div
            style={{
              background: "#e0e0e0",
              borderRadius: "10px",
              height: "10px",
              width: "100%",
              margin: "10px 0",
              marginBottom: "4.6%",
            }}
          >
            <div
              style={{
                width: `${(2 / 3) * 100}%`, // Exemplo de cálculo baseado no tamanho da fila
                height: "10px",
                background: "#a6f85e",
                borderRadius: "10px",
              }}
            ></div>
          </div>
        </div>
      )}
    </div>

    <div className="buttons">
      <button
        className="butao"
        onClick={() => setTelaAtual("listaAgendamentos")}
        style={{ background: "red", color: "white", border: "white", cursor: "pointer" }}
      >
        Sair da Fila
      </button>
    </div>
  </form>
  );

  return (
    <div>
      <Header />
      <div id="centralizaFormConsulta">
        {telaAtual === "inserirCodigo" && renderInserirCodigo()}
        {telaAtual === "listaAgendamentos" && renderListaAgendamentos()}
        {telaAtual === "filaDeEspera" && renderFilaDeEspera()}
      </div>
    </div>
  );
}
 