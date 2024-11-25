import "./index.css";
import React, { useState } from "react";
import axios from "axios";
import Header from "../header";
import { useNavigate } from "react-router-dom";

export default function AcessoFuncionario() {
  const navigate = useNavigate();

  const [formValues, setFormValues] = useState({
    nomeCompleto: "",
    dataNascimento: "",
    sexo: "",
    cpf: "",
    email: "",
    telefone: "",
    especialidade: "",
    medico: "",
    dataConsulta: "",
    horarioConsulta: ""
  });

  const [errors, setErrors] = useState({});
  const [medicos, setMedicos] = useState([]);
  const [datasDisponiveis, setDatasDisponiveis] = useState([]);
  const [horariosDisponiveis, setHorariosDisponiveis] = useState([]);

  // JSON de exemplo com especialidades e médicos
  const especialidades = ["Cardiologia", "Dermatologia", "Ortopedia", "Neurologia", "Pediatria", "Gastroenterologia", "Oftalmologia"];

  const agendaMedicos = [
    // Cardiologia
    {
      id: 21,
      nome: "Dr. João",
      especialidade: "Cardiologia",
      datas: [
        { data: "2024-11-10", horarios: ["08:00", "09:00", "10:00", "11:00"] },
        { data: "2024-11-12", horarios: ["08:00", "11:00", "14:00"] }
      ]
    },
    {
      id: 42,
      nome: "Dra. Beatriz",
      especialidade: "Cardiologia",
      datas: [
        { data: "2024-11-11", horarios: ["09:00", "10:30", "12:00"] },
        { data: "2024-11-14", horarios: ["08:00", "11:00", "13:00", "16:00"] }
      ]
    },
    {
      id: 33,
      nome: "Dr. Roberto",
      especialidade: "Cardiologia",
      datas: [
        { data: "2024-11-15", horarios: ["10:00", "11:30", "14:00", "15:30"] },
        { data: "2024-11-18", horarios: ["09:00", "11:00", "13:00"] }
      ]
    },
    {
      id: 45,
      nome: "Dra. Carla",
      especialidade: "Cardiologia",
      datas: [
        { data: "2024-11-16", horarios: ["08:30", "10:00", "13:30"] },
        { data: "2024-11-19", horarios: ["09:00", "10:30", "14:30"] }
      ]
    },
    // Dermatologia
    {
      id: 25,
      nome: "Dra. Maria",
      especialidade: "Dermatologia",
      datas: [
        { data: "2024-11-11", horarios: ["14:00", "15:00", "16:00"] },
        { data: "2024-11-13", horarios: ["09:00", "13:00", "16:00"] }
      ]
    },
    {
      id: 36,
      nome: "Dr. Fernando",
      especialidade: "Dermatologia",
      datas: [
        { data: "2024-11-10", horarios: ["10:00", "11:00", "13:00", "15:00"] },
        { data: "2024-11-12", horarios: ["09:00", "11:00", "14:00"] }
      ]
    },
    {
      id: 57,
      nome: "Dra. Paula",
      especialidade: "Dermatologia",
      datas: [
        { data: "2024-11-15", horarios: ["08:00", "10:30", "12:00", "14:30"] },
        { data: "2024-11-17", horarios: ["09:00", "13:00", "15:00"] }
      ]
    },
    {
      id: 28,
      nome: "Dr. Lucas",
      especialidade: "Dermatologia",
      datas: [
        { data: "2024-11-14", horarios: ["10:00", "12:00", "14:00"] },
        { data: "2024-11-16", horarios: ["09:00", "11:00", "13:30"] }
      ]
    },
    // Ortopedia
    {
      id: 19,
      nome: "Dr. Pedro",
      especialidade: "Ortopedia",
      datas: [
        { data: "2024-11-14", horarios: ["10:00", "13:00", "15:00"] },
        { data: "2024-11-15", horarios: ["08:00", "12:00", "16:00"] }
      ]
    },
    {
      id: 40,
      nome: "Dra. Fernanda",
      especialidade: "Ortopedia",
      datas: [
        { data: "2024-11-16", horarios: ["09:00", "11:00", "14:00"] },
        { data: "2024-11-18", horarios: ["08:30", "10:30", "12:30"] }
      ]
    },
    {
      id: 21,
      nome: "Dr. Ricardo",
      especialidade: "Ortopedia",
      datas: [
        { data: "2024-11-12", horarios: ["10:00", "13:00", "15:00"] },
        { data: "2024-11-15", horarios: ["08:00", "12:00", "16:00"] }
      ]
    },
    {
      id: 65,
      nome: "Dra. Silvia",
      especialidade: "Ortopedia",
      datas: [
        { data: "2024-11-13", horarios: ["08:00", "10:00", "14:00"] },
        { data: "2024-11-17", horarios: ["09:00", "13:00", "15:30"] }
      ]
    },
    // Neurologia
    {
      id: 23,
      nome: "Dr. André",
      especialidade: "Neurologia",
      datas: [
        { data: "2024-11-10", horarios: ["08:30", "10:30", "12:00"] },
        { data: "2024-11-12", horarios: ["10:00", "13:00", "15:30"] }
      ]
    },
    {
      id: 34,
      nome: "Dra. Júlia",
      especialidade: "Neurologia",
      datas: [
        { data: "2024-11-11", horarios: ["09:00", "11:30", "14:30"] },
        { data: "2024-11-13", horarios: ["08:00", "12:00", "15:00"] }
      ]
    },
    {
      id: 45,
      nome: "Dr. Marcelo",
      especialidade: "Neurologia",
      datas: [
        { data: "2024-11-14", horarios: ["08:30", "10:30", "13:00"] },
        { data: "2024-11-16", horarios: ["09:00", "11:00", "16:00"] }
      ]
    },
    {
      id: 16,
      nome: "Dra. Camila",
      especialidade: "Neurologia",
      datas: [
        { data: "2024-11-10", horarios: ["10:00", "12:00", "14:00"] },
        { data: "2024-11-15", horarios: ["09:00", "11:30", "13:30"] }
      ]
    },
    // Pediatria
    {
      id: 17,
      nome: "Dr. Miguel",
      especialidade: "Pediatria",
      datas: [
        { data: "2024-11-11", horarios: ["08:00", "09:30", "13:30"] },
        { data: "2024-11-13", horarios: ["10:00", "13:00", "15:30"] }
      ]
    },
    {
      id: 18,
      nome: "Dra. Raquel",
      especialidade: "Pediatria",
      datas: [
        { data: "2024-11-12", horarios: ["09:00", "11:30", "14:30"] },
        { data: "2024-11-15", horarios: ["08:30", "12:00", "14:30"] }
      ]
    },
    {
      id: 19,
      nome: "Dr. Daniel",
      especialidade: "Pediatria",
      datas: [
        { data: "2024-11-14", horarios: ["08:30", "10:00", "13:30"] },
        { data: "2024-11-17", horarios: ["09:00", "11:00", "16:00"] }
      ]
    },
    {
      id: 20,
      nome: "Dra. Renata",
      especialidade: "Pediatria",
      datas: [
        { data: "2024-11-16", horarios: ["08:00", "11:00", "13:30"] },
        { data: "2024-11-18", horarios: ["10:00", "13:00", "15:30"] }
      ]
    }
  ];


  // Função para atualizar os valores do formulário
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value
    });

    if (name === "especialidade") {
      const medicosFiltrados = agendaMedicos.filter(
        (medico) => medico.especialidade === value
      );
      setMedicos(medicosFiltrados);
      setDatasDisponiveis([]);
      setHorariosDisponiveis([]);
    } else if (name === "medico") {
      const medicoSelecionado = medicos.find(
        (medico) => medico.id === parseInt(value)
      );
      setDatasDisponiveis(medicoSelecionado ? medicoSelecionado.datas : []);
      setHorariosDisponiveis([]);
    } else if (name === "dataConsulta") {
      const dataSelecionada = datasDisponiveis.find(
        (data) => data.data === value
      );
      setHorariosDisponiveis(dataSelecionada ? dataSelecionada.horarios : []);
    }
  };


  // Validações usando regex
  const validateForm = () => {
    const newErrors = {};

    // Validação de CPF
    const cpfRegex = /^(?:\d{3}\.\d{3}\.\d{3}-\d{2}|\d{11})$/;
    if (!cpfRegex.test(formValues.cpf)) {
      newErrors.cpf = "CPF inválido. Use 111.111.111-11 ou 11122233344.";
    }

    // Validação de telefone
    const telefoneRegex = /^(?:\(\d{2}\) \d{5}-\d{4}|\d{2} \d{5}-\d{4}|\d{11})$/;
    if (!telefoneRegex.test(formValues.telefone)) {
      newErrors.telefone =
        "Telefone inválido. Use (XX) XXXXX-XXXX, XX XXXXX-XXXX ou XXXXXXXXXXX.";
    }

    // Validação de email
    const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    if (!emailRegex.test(formValues.email)) {
      newErrors.email = "Email inválido. Use um formato como exemplo@dominio.com.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Função de envio do formulário
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        const response = await axios.post("http://localhost:8080/fila/adicionar", formValues);
        console.log("Formulário enviado com sucesso", response.data);
        alert("Paciente Cadastrado!")
      } catch (error) {
        console.error("Erro ao enviar o formulário", error);
        console.log("Json: ", formValues);
      }
    } else {
      console.log("Erro ao enviar o formulário");
    }
  };

  return (
    <div>
      <Header/>
      <form onSubmit={handleSubmit}>

        <div className="formButton">
          <button className="butao" onClick={() => {navigate("/Fila");}}>Verificar Fila</button>
        </div>

        <div className="formButton">
          <h2>Agendamento de Pacientes</h2>
        </div>
        <div id="campos">
          <div className="field">
            <label htmlFor="nomeCompleto">Nome Completo:</label>
            <input
              type="text"
              name="nomeCompleto" // Atualizado para nomeCompleto
              id="nomeCompleto"
              placeholder="Nome completo"
              value={formValues.nomeCompleto}
              onChange={handleChange}
              required
            />
          </div>

        

        <div id="campoEspecial" >
          <div className="fieldDuplo">
            <div className="field">
                <label htmlFor="dataNascimento">Data de Nascimento:</label>
                <input
                  type="date"
                  name="dataNascimento"
                  id="dataNascimento"
                  value={formValues.dataNascimento}
                  onChange={handleChange}
                  required
                />
            </div>

            <div className="field">
              <label htmlFor="telefone">Telefone:</label>
              <input
                type="tel"
                name="telefone"
                id="telefone"
                placeholder="(XX) XXXXX-XXXX ou XX XXXXX-XXXX"
                value={formValues.telefone}
                onChange={handleChange}
                required
              />
              {errors.telefone && <span className="error">{errors.telefone}</span>}
            </div>
          
          </div>

          <div className="fieldDuplo">
          <div className="field">
                <label htmlFor="sexo">Sexo:</label>
                <select
                  name="sexo"
                  id="sexo"
                  value={formValues.sexo}
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
              <label htmlFor="cpf">CPF:</label>
              <input
                type="text"
                name="cpf"
                id="cpf"
                placeholder="000.000.000-00 ou 00000000000"
                value={formValues.cpf}
                onChange={handleChange}
                required
              />
              {errors.cpf && <span className="error">{errors.cpf}</span>}
            </div>
          </div>
        </div>
      

        

          <div className="field">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              name="email"
              id="email"
              placeholder="seuemail@exemplo.com"
              value={formValues.email}
              onChange={handleChange}
              required
            />
            {errors.email && <span className="error">{errors.email}</span>}
          </div>

      {/* Campos para Especialidade, Médico, Data de Consulta e Horário */}
          
      <div className="field">
            <label htmlFor="especialidade">Especialidade:</label>
            <select
              name="especialidade"
              id="especialidade"
              value={formValues.especialidade}
              onChange={handleChange}
            >
              <option value="">Selecione uma especialidade</option>
              {especialidades.map((especialidade, index) => (
                <option key={index} value={especialidade}>
                  {especialidade}
                </option>
              ))}
            </select>
          </div>

          <div className="field">
            <label htmlFor="medico">Médico:</label>
            <select
              name="medico"
              id="medico"
              value={formValues.medico}
              onChange={handleChange}
              disabled={!formValues.especialidade}
            >
              <option value="">Selecione um médico</option>
              {medicos.map((medico) => (
                <option key={medico.id} value={medico.id}>
                  {medico.nome}
                </option>
              ))}
            </select>
          </div>

          <div className="field">
            <label htmlFor="dataConsulta">Data de Consulta:</label>
            <select
              name="dataConsulta"
              id="dataConsulta"
              value={formValues.dataConsulta}
              onChange={handleChange}
              disabled={!formValues.medico}
            >
              <option value="">Selecione uma data</option>
              {datasDisponiveis.map((data, index) => (
                <option key={index} value={data.data}>
                  {data.data}
                </option>
              ))}
            </select>
          </div>

          <div className="field">
            <label htmlFor="horarioConsulta">Horário de Consulta:</label>
            <select
              name="horarioConsulta"
              id="horarioConsulta"
              value={formValues.horarioConsulta}
              onChange={handleChange}
              disabled={!formValues.dataConsulta}
            >
              <option value="">Selecione um horário</option>
              {horariosDisponiveis.map((horario, index) => (
                <option key={index} value={horario}>
                  {horario}
                </option>
              ))}
            </select>
          </div>
        </div>


        <div className="formButton">
          <button type="submit" className="butao" onClick={() => {navigate("/"); alert("Página Ainda Não Desenvolvida!");}}>Agendar</button>
        </div>
      </form>
    </div>
  );
}
