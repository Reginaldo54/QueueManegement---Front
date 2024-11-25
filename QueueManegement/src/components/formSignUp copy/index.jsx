import "./index.css";
import React, { useState } from "react";
import axios from "axios";
import Header from "../header";
import { useNavigate } from "react-router-dom";

export default function FormSignUp() {
  const navigate = useNavigate();

  const [formValues, setFormValues] = useState({
    nomeCompleto: "",
    dataNascimento: "",
    sexo: "",
    cpf: "",
    email: "",
    telefone: ""
  });

  const [errors, setErrors] = useState({});

  // Validações usando regex
  const validateForm = () => {
    const newErrors = {};

    // Validação de CPF
    const cpfRegex = /^(?:\d{3}\.\d{3}\.\d{3}-\d{2}|\d{11})$/;
    if (!cpfRegex.test(formValues.cpf)) {
      newErrors.cpf = "CPF inválido. Use o formato 111.222.333-44 ou 11122233344.";
    }

    // Validação de telefone
    const telefoneRegex = /^(?:\(\d{2}\) \d{5}-\d{4}|\d{2} \d{5}-\d{4})$/;
    if (!telefoneRegex.test(formValues.telefone)) {
      newErrors.telefone =
        "Telefone inválido. Use o formato (XX) XXXXX-XXXX, XX XXXXX-XXXX.";
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

   // Função para atualizar os valores do formulário
   const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value
    });
  };

  return (
    <div>
      <Header/>
      <form onSubmit={handleSubmit}>
        <div className="formButton">
          <h2>Cadastro de Paciente</h2>
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
                  </select>
            </div>

            <div className="field">
              <label htmlFor="cpf">CPF:</label>
              <input
                type="text"
                name="cpf"
                id="cpf"
                placeholder="000.000.000-00"
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

        <div className="formButton">
          <button type="submit" className="butao">Cadastrar</button>
        </div>
        </div>
      </form>
    </div>
  );
}



