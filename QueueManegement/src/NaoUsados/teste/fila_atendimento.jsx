import React, { useState, useEffect } from "react";
import iconTime from "../assets/icon_time.png";
import Header from "../../components/header";
import "./index.css";

function EntradaCodigo({ onCodigoSubmit }) 
{
    const [codigo, setCodigo] = useState("");
    const [erro, setErro] = useState(""); // Estado para armazenar mensagens de erro

    const handleChange = (event) => {
        setCodigo(event.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (codigo.trim()) {
          onCodigoSubmit(codigo.trim()); // Passa o código sem espaços extras
          setErro(""); // Limpa o erro após o envio
        } else {
          setErro("Por favor, insira um código de atendimento válido.");
        }
      };

    return(
            <div id='centralizaFormConsulta'>
            <form id="acessarConsulta" onSubmit={handleSubmit}>
                <div className="formButton">
                   <h2>Acessar Consulta</h2>
                </div>
                <div className="field">
                    <label htmlFor="codigo">Insira código recebido no email:</label>
                    <input
                    type="text"
                    name="codigo" // Atualizado para nomeCompleto
                    id="codigoInput"
                    placeholder="Código de Atendimento"
                    value={codigo}
                    onChange={handleChange}
                    required
                    />
                </div>

                <div className="formButton">
                    <button type="submit" className="butao">Acessar</button>
                </div>

            </form>
            {erro && <p style={{ color: "red" }}>{erro}</p>} {/* Exibe erro se houver */}
        </div>
    );
}

// Componente principal de gerenciamento da fila
function Filaz({ filaInicial }) {
  const [fila, setFila] = useState(filaInicial);
  const [pacienteAtual, setPacienteAtual] = useState(null);
  const [tempoRestante, setTempoRestante] = useState(90); // Tempo inicial: 90 segundos

  useEffect(() => {
    if (fila.length > 0) {
      const interval = setInterval(() => {
        setFila((prevFila) => prevFila.slice(1)); // Remove o primeiro paciente da fila
        setTempoRestante((prevTempo) => prevTempo - 30); // Reduz o tempo em 30s
      }, 6000); // Simula a saída de um paciente a cada 3s
      return () => clearInterval(interval);
    }

  }, [fila]);

  const handleCodigoSubmit = (codigo) => {
    console.log("Código inserido:", codigo);
    console.log("Fila atual:", fila);
  
    // Remover espaços extras e fazer comparação insensível a maiúsculas/minúsculas
    const paciente = fila.find((p) => p.codigo.trim().toUpperCase() === codigo.trim().toUpperCase());
    if (paciente) {
      console.log("Paciente encontrado:", paciente);
      setPacienteAtual(paciente);
    } else {
      alert("Código não encontrado na fila!");
    }
  };

  const pacientePosicao = pacienteAtual
    ? fila.findIndex((paciente) => paciente.codigo === pacienteAtual.codigo) + 1
    : null;

  return (
    <div>
        <Header/>
   
        <div style={{ padding: "20px"}}>

        {!pacienteAtual ? (
            // Tela para inserir o código de atendimento
            <EntradaCodigo onCodigoSubmit={handleCodigoSubmit} />
        ) : (
            // Tela de acompanhamento na fila
            <form>
            <h2>Olá, {pacienteAtual.nome}</h2>
            <p style={{marginBottom: "8.6%"}}>Você está na fila, aguarde sua vez</p>

            <div style={{ margin: "20px 0", background: "#a6f85e66", padding: ".4rem", borderRadius:"35px"}}>
                <h3 style={{display: "flex", alignItems: "center",gap:"15%",justifyContent:"flex-start"}}>
                    <img src={iconTime} alt="icone de relogio" style={{marginLeft: "12px"}}/> 
                    <span style={{ fontSize: "24px" }}>{Math.max(0, tempoRestante)}s</span>
                    <span style={{textAlign: "center"}}>Tempo de espera aproximado</span>
                </h3>
                
            </div>
    
            <div>
                <h3 style={{  textAlign:"center", marginTop: "8.6%", marginBottom: "4.6%" }}>Sua posição na fila</h3>
                {pacientePosicao === 0 ? (
                <p style={{ color: "green", textAlign:"center" }}>
                    Você está sendo chamado para atendimento!
                </p>
                ) : pacientePosicao ? (
                <div>
                        <h2 style={{color: "Green", textAlign:"center"}}>{pacientePosicao}º</h2>
                    
                        <div
                        style={{
                            background: "#e0e0e0",
                            borderRadius: "10px",
                            height: "10px",
                            width: "100%",
                            margin: "10px 0",
                            marginBottom: "4.6%"
                        }}
                        >
                            <div
                                style={{
                                width: `${((fila.length - pacientePosicao + 1) / fila.length) *
                                    100}%`,
                                height: "10px",
                                background: "#a6f85e",
                                borderRadius: "10px",
                                }}
                            ></div>
                        </div>
                        
                </div>
                ) : (
                <p>Erro ao encontrar sua posição na fila.</p>
                )}
            </div>
                <div className="buttons">
                    <button
                    className="butao"
                    onClick={() => setPacienteAtual(null)} // Sai do acompanhamento
                    style={{background: "red", color: "white", border:"white", cursor: "pointer"}}
                    >
                    Sair da Fila
                    </button>
                </div>
            
            </form>
        )}
        </div>
    </div>
  );
}

// Mock de dados para teste
const filaMock = [
  { id: 1, nome: "João", codigo: "A123" },
  { id: 2, nome: "Maria", codigo: "B456" },
  { id: 3, nome: "Carlos", codigo: "C789" },
];

// Componente raiz para inicializar o app
export default function FilaAtendimento () {
  return <Filaz filaInicial={filaMock} />;
}
