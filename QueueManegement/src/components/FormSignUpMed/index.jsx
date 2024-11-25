
import "./index.css";
import React, { useState } from "react";
import axios from "axios";
import Header from "../header";
import { useNavigate } from "react-router-dom";

export default function FormSignUpMed() {
  const navigate = useNavigate();

  const [formValues, setFormValues] = useState({
    nome: "",
    sexo: "",
    email: "",
    tipoEspecialista: "",
    indisponibilidades: [{ data: "" }], // Inicializado com um objeto vazio
  });

  const especialistas = ["ODONTOLOGO", "ORTOPEDISTA", "CARDIOLOGISTA"];
  const [errors, setErrors] = useState({});

  // Função para atualizar os valores do formulário
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  // Função para atualizar as datas de indisponibilidade
  const handleDateChange = (index, value) => {
    const updatedIndisponibilidades = [...formValues.indisponibilidades];
    updatedIndisponibilidades[index] = { data: value };
    setFormValues({ ...formValues, indisponibilidades: updatedIndisponibilidades });
  };

  // Adicionar uma nova data de indisponibilidade
  const handleAddDate = () => {
    setFormValues({
      ...formValues,
      indisponibilidades: [...formValues.indisponibilidades, { data: "" }],
    });
  };

  // Remover uma data de indisponibilidade
  const handleRemoveDate = (index) => {
    const updatedIndisponibilidades = formValues.indisponibilidades.filter(
      (_, i) => i !== index
    );
    setFormValues({ ...formValues, indisponibilidades: updatedIndisponibilidades });
  };

  // Validações usando regex
  const validateForm = () => {
    const newErrors = {};

    // Validação de email
    const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    if (!emailRegex.test(formValues.email)) {
      newErrors.email = "Email inválido. Use um formato como exemplo@dominio.com.";
    }

    // Validação de indisponibilidades
    if (formValues.indisponibilidades.some((item) => !item.data)) {
      newErrors.indisponibilidades = "Preencha todas as datas de indisponibilidade.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      const payload = {
        ...formValues,
        indisponibilidades: formValues.indisponibilidades.map((item) => ({
          data: item.data,
        })),
      };
  
      try {
        const response = await axios.post(
          "http://localhost:8080/fila/criarEspecialista",
          payload
        );
        console.log("Formulário enviado com sucesso", response.data);
        alert("Funcionário Cadastrado!");
        console.log(payload);
        
      } catch (error) {
        console.error("Erro de requisição", error);
        console.log(payload);
      }
    } else {
      console.log("Erro ao validar o formulário");
    }
  };
  

  return (
    <div>
      <Header />
      <form onSubmit={handleSubmit}>
        <div className="formButton">
          <h2>Cadastro do Médico</h2>
        </div>
        <div id="campos">
          <div className="field">
            <label htmlFor="nome">Nome:</label>
            <input
              type="text"
              name="nome"
              id="nome"
              placeholder="Nome"
              value={formValues.nome}
              onChange={handleChange}
              required
            />
          </div>
            
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
              </select>
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
          <div className="field">
            <label htmlFor="tipoEspecialista">Tipo Especialista:</label>
            <select
              name="tipoEspecialista"
              id="tipoEspecialista"
              value={formValues.tipoEspecialista}
              onChange={handleChange}
            >
              <option value="">Selecione tipo de Especialista</option>
              {especialistas.map((especialista, index) => (
                <option key={index} value={especialista}>
                  {especialista}
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <label>Datas de Indisponibilidade:</label>
            {formValues.indisponibilidades.map((item, index) => (
              <div className="dateField" key={index}>
                <input
                  type="date"
                  value={item.data}
                  onChange={(e) => handleDateChange(index, e.target.value)}
                />
                <button
                  type="button"
                  className="butao"
                  style={{ width: "21%", height: "55%" }}
                  onClick={() => handleRemoveDate(index)}
                >
                  Remover
                </button>
              </div>
            ))}
            <button
              type="button"
              className="butao"
              style={{ width: "21%", height: "55%" }}
              onClick={handleAddDate}
            >
              Adicionar Data
            </button>
          </div>

          <div className="formButton">
            <button type="submit" className="butao">
              Cadastrar
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
