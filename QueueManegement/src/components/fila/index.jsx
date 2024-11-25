import React, { useState } from "react";
import icon_edit from "../../assets/icon_edit.png";
import icon_add from "../../assets/icon_add.png";
import "./index.css";
import Header from "../header";
import { useNavigate } from "react-router-dom";

export default function Fila() {

const navigate = useNavigate();

const pacientesData = [
  {
    "id": 1,
    "nomeCompleto": "Maria da Silva",
    "dataNascimento": "1990-05-15",
    "sexo": "FEM",
    "cpf": "123.456.789-10",
    "email": "maria.silva@gmail.com",
    "telefone": "(11) 98765-4321",
    "especialidade": "Cardiologia",
    "medico": { "id":"21","nome":"Dr. João"},
    "dataConsulta": "2024-11-11",
    "horarioConsulta": "12:00",
    "anotacao": ""
  },
  {
    "id": 2,
    "nomeCompleto": "João Oliveira",
    "dataNascimento": "1985-09-20",
    "sexo": "MASC",
    "cpf": "987.654.321-00",
    "email": "joao.oliveira@hotmail.com",
    "telefone": "(21) 97654-3210",
    "especialidade": "Cardiologia",
    "medico": { "id":"21","nome":"Dr. João"},
    "dataConsulta": "2024-11-11",
    "horarioConsulta": "11:00",
    "anotacao": ""
  },
  {
    "id": 3,
    "nomeCompleto": "Ana Pereira",
    "dataNascimento": "1978-12-05",
    "sexo": "FEM",
    "cpf": "321.654.987-22",
    "email": "ana.pereira@yahoo.com",
    "telefone": "(31) 94567-8901",
    "especialidade": "Cardiologia",
    "medico": { "id":"21","nome":"Dr. João"},
    "dataConsulta": "2024-11-11",
    "horarioConsulta": "10:00",
    "anotacao": ""
  },
  {
    "id": 4,
    "nomeCompleto": "Carlos Souza",
    "dataNascimento": "1992-07-10",
    "sexo": "MASC",
    "cpf": "654.321.987-33",
    "email": "carlos.souza@gmail.com",
    "telefone": "(41) 96543-2109",
    "especialidade": "Cardiologia",
    "medico": { "id":"21","nome":"Dr. João"},
    "dataConsulta": "2024-11-11",
    "horarioConsulta": "09:00",
    "anotacao": ""
  },
  {
    "id": 5,
    "nomeCompleto": "Beatriz Mendes",
    "dataNascimento": "2000-02-28",
    "sexo": "FEM",
    "cpf": "789.123.456-44",
    "email": "beatriz.mendes@outlook.com",
    "telefone": "(51) 93456-7890",
    "especialidade": "Cardiologia",
    "medico": { "id":"21","nome":"Dr. João"},
    "dataConsulta": "2024-11-11",
    "horarioConsulta": "08:00",
    "anotacao": ""
  }
];

  const [pacientes, setPacientes] = useState(pacientesData);
  const [pacienteSelecionado, setPacienteSelecionado] = useState(null);
  const [modalAberto, setModalAberto] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPacienteSelecionado({
      ...pacienteSelecionado,
      [name]: value, // Corrigido para permitir atualizações genéricas
    });
  };

  /*
  const validateForm = () => {
    const newErrors = {};

    // Validação de CPF
    const cpfRegex = /^(?:\d{3}\.\d{3}\.\d{3}-\d{2})$/;
    if (!cpfRegex.test(pacienteSelecionado.cpf)) {
      newErrors.cpf = "CPF inválido. Use 111.111.111-11";
    }

    // Validação de telefone
    const telefoneRegex = /^(?:\(\d{2}\) \d{5}-\d{4}|\d{2} \d{5}-\d{4}|\d{11})$/;
    if (!telefoneRegex.test(pacienteSelecionado.telefone)) {
      newErrors.telefone =
        "Telefone inválido. Use (XX) XXXXX-XXXX, XX XXXXX-XXXX ou XXXXXXXXXXX.";
    }

    // Validação de email
    const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    if (!emailRegex.test(pacienteSelecionado.email)) {
      newErrors.email = "Email inválido. Use um formato como exemplo@dominio.com.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  */
  const abrirModal = (e, paciente) => {
    e.preventDefault(); // Previne o comportamento padrão
    setPacienteSelecionado(paciente);
    setModalAberto(true);
  };

  const salvarAlteracoes = (e) => {
    setPacientes((prevPacientes) =>
        prevPacientes.map((paciente) => 
          paciente.id === pacienteSelecionado.id ? pacienteSelecionado : paciente
      )
    );
    setPacienteSelecionado(null)
    setModalAberto(false); // Fecha o modal
    
  };

  const fecharModal = () => {
    setModalAberto(false);
    salvarAlteracoes();
  };

  return (
    <div>
       <Header/>
       <div className="fila-container">
     
          <form>
            <div id="headerForm">
              <h2>Pacientes na Fila</h2>
              <button> <img src={icon_add} alt="sinal de mais" title="Adicionar novo paciente" onClick={() => {navigate("/formsignup"); }} /> </button>
            </div>
            <ul className="fila-lista">
              {pacientes.map((paciente) => (
                <li key={paciente.id} className="fila-item">
                  <span>{paciente.nomeCompleto}</span>
                  <span>Médico: {paciente.medico.nome}</span>
                  <button title="Editar dados do paciente"
                    onClick={(e) => abrirModal(e, paciente)} // Passa o evento para evitar recarregamento
                    className="editar-btn"
                  >
                    <img src={icon_edit} alt="um lapis dentro de um quadrado" />
                  </button>
                </li>
              ))}
            </ul>
          </form>

          {modalAberto && (
            <div className="modal" onClick={fecharModal}>
              <div className="modal-conteudo" onClick={(e) => e.stopPropagation()}>
                <h3>Editar Paciente</h3>
                <div className="field">
                    <label>Nome Completo:</label>
                    <input
                      type="text"
                      name="nomeCompleto"
                      value={pacienteSelecionado.nomeCompleto}
                      onChange={handleChange}
                      
                    />
                  </div>
                  <div id="campoEspecial">
                    <div className="fieldDuplo">
                      <div className="field">
                        <label>Data de Nascimento:</label>
                        <input
                          type="date"
                          name="dataNascimento"
                          value={pacienteSelecionado.dataNascimento}
                          onChange={handleChange}
                        />
                      </div>

                      <div className="field">
                        <label>Telefone:</label>
                        <input
                          type="tel"
                          name="telefone"
                          value={pacienteSelecionado.telefone}
                          onChange={handleChange}
                        />
                      </div>
                    </div>

                    <div className="fieldDuplo">
                      <div className="field">
                        <label htmlFor="sexo">Sexo:</label>
                        <select
                          name="sexo"
                          id="sexo"
                          value={pacienteSelecionado.sexo}
                          onChange={handleChange}
                          required
                        >
                          <option value="">Selecione</option>
                          <option value="FEM">Feminino</option>
                          <option value="MASC">Masculino</option>
                          <option value="OUTRO">Outro</option>
                        </select>
                      </div>
                      <div className="field">
                        <label>CPF:</label>
                        <input
                          type="text"
                          name="cpf"
                          placeholder="000.000.000-00"
                          value={pacienteSelecionado.cpf}
                          onChange={handleChange}
                          required
                        />
                          {errors.cpf && <span className="error">{errors.cpf}</span>}
                      </div>
                    </div>
                  </div>
                  <div className="field">
                    <label>Email:</label>
                    <input
                      type="email"
                      name="email"
                      placeholder="seuemail@exemplo.com"
                      value={pacienteSelecionado.email}
                      onChange={handleChange}
                      required
                    />
                    {errors.email && <span className="error">{errors.email}</span>}
                  </div>

                  
                  <div className="field">
                        <label htmlFor="especialidade">Especialidade:</label>
                        <input
                          type="text"
                          name="especialidade"
                          id="especialidade"
                          value={pacienteSelecionado.especialidade}
                          onChange={handleChange}
                        />
                      </div>

                      <div className="field">
                        <label htmlFor="medico">Médico:</label>
                        <input
                          type="text"
                          name="medico"
                          id="medico"
                          value={pacienteSelecionado.medico.nome}
                          onChange={handleChange}
                        />
                      </div>

                      <div className="field">
                        <label htmlFor="dataConsulta">Data de Consulta:</label>
                        <input
                          type="text"
                          name="dataConsulta"
                          id="dataConsulta"
                          value={pacienteSelecionado.dataConsulta}
                          onChange={handleChange}
                        />
                      </div>

                      <div className="field">
                        <label htmlFor="horarioConsulta">Horário de Consulta:</label>
                        <input
                          type="text"
                          name="horarioConsulta"
                          id="horarioConsulta"
                          value={pacienteSelecionado.horarioConsulta}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="buttons">
                        <button className="butao" type="button" onClick={salvarAlteracoes}>
                          Salvar
                        </button>
                      </div>
                    </div>
              </div>
          )}
        </div>
    </div>
  
  );
}