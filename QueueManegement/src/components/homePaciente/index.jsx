import React, { useState, useEffect } from "react";
import iconTime from "../../assets/icon_time.png"; // Substitua pelo caminho correto da imagem do ícone de tempo
import "./index.css"; // Certifique-se de ter o estilo adequado
import { useLocation } from "react-router-dom";

export default function HomePaciente() {
  const location = useLocation(); 
  const { senha } = location.state || {}; // Recupera a senha passada pela tela de login
  const [pacientes, setPacientes] = useState([]); // Inicializa o estado pacientes como um array vazio
  const [telaAtual, setTelaAtual] = useState("listaAgendamentos");
  const [pacienteSelecionado, setPacienteSelecionado] = useState(null);
  const [codigoInserido, setCodigoInserido] = useState("");
  const [agendamentoConfirmado, setAgendamentoConfirmado] = useState(false);

  const [fila, setFila] = useState([
    { id: 1, nome: "João Silva", codigo: { senha } },
    { id: 2, nome: "Maria Santos", codigo: { senha } },
  ]);
  const [pacienteAtual, setPacienteAtual] = useState(null);
  const [tempoRestante, setTempoRestante] = useState(90);

  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0); // Ajusta a data para 00:00:00
  const hojeFormatado = hoje.toISOString().split("T")[0]; // Formata no padrão "YYYY-MM-DD"
  // Data atual no formato "YYYY-MM-DD"
   // Ajustar a data para sempre mostrar o dia atual às 00:00:00

  // UseEffect para buscar os agendamentos assim que a tela for carregada
  useEffect(() => {
    const fetchAgendamentos = async () => {
      try {
        const agendamentoResponse = await fetch(
          `http://localhost:8080/fila/pegarAgendamentos?codigoCodigo=${senha}`
        );

        let agendamentos;
        console.log(agendamentos);
        console.log(senha);

        if (!agendamentoResponse.ok) {
          // Caso a resposta seja mal-sucedida, utiliza dados estáticos
          console.warn("Erro ao buscar agendamentos. Utilizando dados estáticos.");
          agendamentos = [
            {
              id: 1,
              nomePaciente: "João Silva",
              nomeEspecialista: "Rogério",
              dataAgendamento: "2024-11-24",
              horaAgendamento: "15:00",
              status: "AGUARDANDO_CONFIRMACAO",
            },
            {
              id: 2,
              nomePaciente: "Maria Santos",
              nomeEspecialista: "Ronaldo",
              dataAgendamento: "2024-11-25",
              horaAgendamento: "16:00",
              status: "AGUARDANDO_CONFIRMACAO",
            },
          ];
        } else {
          agendamentos = await agendamentoResponse.json();
          // Se o array vier vazio, substitui pelos dados estáticos
          if (agendamentos.length === 0) {
            agendamentos = [
              {
                id: 5,
                nomePaciente: "João Silva",
                nomeEspecialista: "Rogério",
                dataAgendamento: "2024-11-24",
                horaAgendamento: "15:00",
                status: "AGUARDANDO_CONFIRMACAO",
              },
              {
                id: 6,
                nomePaciente: "Maria Santos",
                nomeEspecialista: "Ronaldo",
                dataAgendamento: "2024-11-25",
                horaAgendamento: "16:00",
                status: "AGUARDANDO_CONFIRMACAO",
              },
            ];
          }
        }
        setPacientes(agendamentos); // Atualiza o estado de pacientes com os dados da API
      } catch (error) {
        console.error("Erro ao buscar agendamentos:", error);
      }
    };

    if (senha) {
      fetchAgendamentos();
    }
  }, [senha]); // O efeito será acionado quando a senha for alterada ou quando a tela for carregada

  const handleConfirmar = (paciente) => {
    if (paciente.dataAgendamento !== hojeFormatado) {
      alert("Somente agendamentos com a data de hoje podem ser confirmados.");
      return;
    }
    if (agendamentoConfirmado) {
      alert("Você já confirmou um agendamento hoje.");
      return;
    }
    setPacienteSelecionado(paciente);
    setTelaAtual("inserirCodigo");
  };

  const handleCodigoSubmit = async (e) => {
    e.preventDefault();
    if (codigoInserido.trim() === senha) { // Validação simples de código
      try {
        console.log(pacienteSelecionado.id);
        
        // Chama o endpoint para confirmar o agendamento
        const response = await fetch(
          `http://localhost:8080/fila/marcarPresenca?codigoCodigo=${codigoInserido}&id_agendamento=${pacienteSelecionado.id}`,
          { method: "PUT" }
        );
        
        console.log(response);
        
        if (response.ok) {
          // Atualiza o status do agendamento se confirmado com sucesso
          setPacientes((prevPacientes) =>
            prevPacientes.map((paciente) =>
              paciente.id === pacienteSelecionado.id
                ? { ...paciente, status: "EM_ESPERA"}
                : paciente
            )
          );
          alert("Agendamento confirmado com sucesso!");
          setAgendamentoConfirmado(true);
          setTelaAtual("filaDeEspera");
        } else {
          alert("Erro ao confirmar o agendamento. Tente novamente.");
        }
      } catch (error) {
        alert("Erro ao tentar confirmar o agendamento.");
        console.error("Erro ao confirmar o agendamento:", error);
      }
      setCodigoInserido("");
    } else {
      alert("Código inválido. Tente novamente.");
    }
  };

  const handleAcessarFila = () => {
    setTelaAtual("filaDeEspera");
  };

  useEffect(() => {
    if (telaAtual === "filaDeEspera" && fila.length > 0) {
      const interval = setInterval(() => {
        setFila((prevFila) => prevFila.slice(1));
        setTempoRestante((prevTempo) => prevTempo - 30);
      }, 6000); // A cada 6 segundos, simula a saída de um paciente
      return () => clearInterval(interval);
    }
  }, [telaAtual, fila]);

  const renderFilaDeEspera = () => (
    <form style={{ padding: "20px" }}>
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
                  width: `${(fila.length / 3) * 100}%`, // Exemplo de cálculo baseado no tamanho da fila
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

  const renderListaAgendamentos = () => (
    <div>
      <h2>Agendamentos Feitos</h2>
      <ul className="fila-lista">
        {pacientes.map((paciente) => (
          <li key={paciente.id}>
            <div>
              <strong>{paciente.nomePaciente}</strong> - {paciente.nomeEspecialista}
            </div>
            <div>{paciente.dataAgendamento} - {paciente.horaAgendamento}</div>
            <div>Status: {paciente.status}</div>
            {paciente.status === "AGUARDANDO_CONFIRMACAO" && (
              <button onClick={() => handleConfirmar(paciente)}>Confirmar</button>
            )}
             {paciente.status === "EM_ESPERA" && (
              <button onClick={handleAcessarFila} className="acessar-fila-btn">
                Acessar Fila
              </button>
            )}
          </li>
        ))}
        
      </ul>
    </div>
  );

  return (
    <div className="tela">
      {telaAtual === "listaAgendamentos" && renderListaAgendamentos()}
      {telaAtual === "inserirCodigo" && (
        <form onSubmit={handleCodigoSubmit}>
          <label>
            Insira o código de confirmação:
            <input
              type="text"
              value={codigoInserido}
              onChange={(e) => setCodigoInserido(e.target.value)}
              required
            />
          </label>
          <button type="submit">Confirmar</button>
        </form>
      )}
      {telaAtual === "filaDeEspera" && renderFilaDeEspera()}
    </div>
  );
}
