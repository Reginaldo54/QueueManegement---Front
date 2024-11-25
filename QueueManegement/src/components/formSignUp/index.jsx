import "./index.css";
import React, { useState, useEffect } from "react";
import axios from "axios";
import Header from "../header";
import { useNavigate } from "react-router-dom";

export default function FormSignUp() {
  const navigate = useNavigate();

  const [formValues, setFormValues] = useState({
    paciente: {
      nomeCompleto: "",
      dataNascimento: "",
      sexo: "",
      cpf: "",
      email: "",
      telefone: "",
    },
    dataAgendamento: "",
    horaAgendamento: "",
  });

  const [especialidade, setEspecialidade] = useState("");
  const [medicoSelecionado, setMedicoSelecionado] = useState("");
  const [errors, setErrors] = useState({});
  const [todosMedicos, setTodosMedicos] = useState([]);
  const [medicos, setMedicos] = useState([]);
  const [datasDisponiveis, setDatasDisponiveis] = useState([]);
  const [horariosDisponiveis, setHorariosDisponiveis] = useState([]);

  const especialidades = ["ODONTOLOGO", "ORTOPEDISTA", "CARDIOLOGISTA"];

  useEffect(() => {
    fetchMedicos();
  }, []);

  useEffect(() => {
    if (especialidade) {
      const medicosFiltrados = todosMedicos.filter(
        (medico) => medico.tipoEspecialista === especialidade
      );
      setMedicos(medicosFiltrados);
      setDatasDisponiveis([]);
      setHorariosDisponiveis([]);
    } else {
      setMedicos(todosMedicos);
    }
  }, [especialidade, todosMedicos]);

  const fetchMedicos = async () => {
    try {
      const response = await axios.get("http://localhost:8080/fila/findEspecialista");
      const dadosMedicos = response.data.map((medico) => ({
        ...medico,
        datas: gerarDatasDisponiveis(medico.indisponibilidades),
      }));
      setTodosMedicos(dadosMedicos);
      console.log(response.data);
    } catch (error) {
      console.error("Erro ao buscar médicos", error);
    }
  };

  const gerarDatasDisponiveis = (indisponibilidades) => {
    const datasIndisponiveis = indisponibilidades.map((ind) => ind.data);
    const todasDatas = gerarCalendario();
    return todasDatas.filter((data) => !datasIndisponiveis.includes(data));
  };

  const gerarCalendario = () => {
    const datas = [];
    let dataAtual = new Date();
    const dataFinal = new Date();
    dataFinal.setDate(dataAtual.getDate() + 7);

    while (dataAtual <= dataFinal) {
      datas.push(dataAtual.toISOString().split("T")[0]);
      dataAtual.setDate(dataAtual.getDate() + 1);
    }
    return datas;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name in formValues.paciente) {
      setFormValues({
        ...formValues,
        paciente: { ...formValues.paciente, [name]: value },
      });
    } else {
      setFormValues({ ...formValues, [name]: value });
    }
  };

  

  const handleEspecialidadeChange = (e) => {
    setEspecialidade(e.target.value);
  };

  const handleMedicoChange = (e) => {
    const medicoId = e.target.value;
    setMedicoSelecionado(medicoId);

    const medicoSelecionado = todosMedicos.find(
      (medico) => medico.id === parseInt(medicoId)
    );
    setDatasDisponiveis(medicoSelecionado?.datas || []);
    setHorariosDisponiveis(["08:00", "09:00", "10:00","11:00","12:00","14:00","15:00","16:00","17:00","18:00"]);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formValues.paciente.nomeCompleto) {
      newErrors.nomeCompleto = "Nome completo é obrigatório.";
    }
    if (!formValues.paciente.dataNascimento) {
      newErrors.dataNascimento = "Data de nascimento é obrigatória.";
    }
    if (!formValues.paciente.sexo) {
      newErrors.sexo = "Sexo é obrigatório.";
    }
    const cpfRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}|\d{11}$/;
    if (!cpfRegex.test(formValues.paciente.cpf)) {
      newErrors.cpf = "CPF inválido. Use o formato 111.222.333-44 ou 11122233344.";
    }
    const telefoneRegex = /^(?:\(\d{2}\) \d{5}-\d{4}|\d{2} \d{5}-\d{4}|\d{2} \d{5}\d{4})$/;
    if (!telefoneRegex.test(formValues.paciente.telefone)) {
      newErrors.telefone = "Telefone inválido. Use o formato (XX) XXXXX-XXXX, XX XXXXX-XXXX.";
    }
    if (!formValues.paciente.email) {
      newErrors.email = "Email é obrigatório.";
    }
    if (!especialidade) {
      newErrors.especialidade = "Especialidade é obrigatória.";
    }
    if (!medicoSelecionado) {
      newErrors.medico = "Selecione um médico.";
    }
    if (!formValues.dataAgendamento) {
      newErrors.dataAgendamento = "Selecione uma data.";
    }
    if (!formValues.horaAgendamento) {
      newErrors.horaAgendamento = "Selecione um horário.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        const payload = {
          ...formValues,
          especialista: { id: medicoSelecionado },
        };
        await axios.post("http://localhost:8080/fila/agendar", payload);
        alert("Consulta agendada com sucesso!");
        console.log(payload);
        
        
        navigate("/Login");
      } catch (error) {
        console.error("Erro ao agendar consulta", error);
        alert("Erro ao agendar consulta.");
      }
    }
  };

  return (
    <div className="form-container">
      <Header />
      <form onSubmit={handleSubmit}>
        {/* Campos de Paciente */}
        <div id="campos">
          <div className="field">
            <label htmlFor="nomeCompleto">Nome Completo:</label>
            <input
              type="text"
              name="nomeCompleto"
              id="nomeCompleto"
              placeholder="Nome completo"
              value={formValues.paciente.nomeCompleto}
              onChange={handleChange}
              required
            />
          </div>

          <div id="campoEspecial">
            <div className="fieldDuplo">
              <div className="field">
                <label htmlFor="dataNascimento">Data de Nascimento:</label>
                <input
                  type="date"
                  name="dataNascimento"
                  id="dataNascimento"
                  value={formValues.paciente.dataNascimento}
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
                  value={formValues.paciente.telefone}
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
                  value={formValues.paciente.sexo}
                  onChange={handleChange}
                  required
                >
                  <option value="">Selecione</option>
                  <option value="FEM">Feminino</option>
                  <option value="MASC">Masculino</option>
                </select>
              </div>

              <div className="field">
                <label htmlFor="cpf">CPF:</label>
                <input
                  type="text"
                  name="cpf"
                  id="cpf"
                  placeholder="000.000.000-00"
                  value={formValues.paciente.cpf}
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
              value={formValues.paciente.email}
              onChange={handleChange}
              required
            />
            {errors.email && <span className="error">{errors.email}</span>}
          </div>

             {/* Especialidade e Médico */}
        <div className="field">
          <label>Especialidade</label>
          <select value={especialidade} onChange={handleEspecialidadeChange}>
            <option value="">Selecione a especialidade</option>
            {especialidades.map((esp) => (
              <option key={esp} value={esp}>
                {esp}
              </option>
            ))}
          </select>
        </div>
        <div className="field">
          <label>Médico</label>
          <select value={medicoSelecionado} onChange={handleMedicoChange}>
            <option value="">Selecione o médico</option>
            {medicos.map((medico) => (
              <option key={medico.id} value={medico.id}>
                {medico.nome}
              </option>
            ))}
          </select>
        </div>

          <div className="field">
            <label>Data da Consulta</label>
            <select name="dataAgendamento" onChange={handleChange} value={formValues.dataAgendamento}>
              <option value="">Selecione a data</option>
              {datasDisponiveis.map((data) => (
                <option key={data} value={data}>
                  {data}
                </option>
              ))}
            </select>
          </div>

          <div className="field">
            <label>Horário da Consulta</label>
            <select name="horaAgendamento" onChange={handleChange} value={formValues.horaAgendamento}>
              <option value="">Selecione o horário</option>
              {horariosDisponiveis.map((hora) => (
                <option key={hora} value={hora}>
                  {hora}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="buttons">
          <button type="submit" className="butao" style={{marginTop: "25px"}} onClick={validateForm}>Agendar Consulta</button>
        </div>
      </form>
    </div>
  );
}
