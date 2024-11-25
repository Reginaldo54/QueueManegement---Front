import "./index.css";
import React, { useState } from "react";
import Header from "../header";

export default function HomeMedico() {
  const nomeUser = "Dr. João Oliveira"
  const [pacientes, setPacientes] = useState([
    {
      "nomeCompleto": "Maria da Silva",
      "dataNascimento": "1990-05-15",
      "sexo": "Feminino",
      "cpf": "123.456.789-10",
      "email": "maria.silva@gmail.com",
      "telefone": "(11) 98765-4321",
      "especialidade": "Cardiologia",
      "medico": "Dr. João",
      "dataConsulta": "2024-11-11",
      "horarioConsulta": "12:00",
      "anotacao": ""
    },
    {
      "nomeCompleto": "João Oliveira",
      "dataNascimento": "1985-09-20",
      "sexo": "Masculino",
      "cpf": "987.654.321-00",
      "email": "joao.oliveira@hotmail.com",
      "telefone": "(21) 97654-3210",
      "especialidade": "Cardiologia",
      "medico": "Dr. João",
      "dataConsulta": "2024-11-11",
      "horarioConsulta": "11:00",
      "anotacao": ""
    },
    {
      "nomeCompleto": "Ana Pereira",
      "dataNascimento": "1978-12-05",
      "sexo": "Feminino",
      "cpf": "321.654.987-22",
      "email": "ana.pereira@yahoo.com",
      "telefone": "(31) 94567-8901",
      "especialidade": "Cardiologia",
      "medico": "Dr. João",
      "dataConsulta": "2024-11-11",
      "horarioConsulta": "10:00",
      "anotacao": ""
    },
    {
      "nomeCompleto": "Carlos Souza",
      "dataNascimento": "1992-07-10",
      "sexo": "Masculino",
      "cpf": "654.321.987-33",
      "email": "carlos.souza@gmail.com",
      "telefone": "(41) 96543-2109",
      "especialidade": "Cardiologia",
      "medico": "Dr. João",
      "dataConsulta": "2024-11-11",
      "horarioConsulta": "09:00",
      "anotacao": ""
    },
    {
      "nomeCompleto": "Beatriz Mendes",
      "dataNascimento": "2000-02-28",
      "sexo": "Feminino",
      "cpf": "789.123.456-44",
      "email": "beatriz.mendes@outlook.com",
      "telefone": "(51) 93456-7890",
      "especialidade": "Cardiologia",
      "medico": "Dr. João",
      "dataConsulta": "2024-11-11",
      "horarioConsulta": "08:00",
      "anotacao": ""
    }
  ]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [formValues, setFormValues] = useState(pacientes[0]);
  const [pacientesAtendidos, setPacientesAtendidos] = useState([]);
  const [formVisible, setFormVisible] = useState(false);

 
    const toggleFormVisibility = (e) => {
     // Previne o comportamento padrão do botão
      setFormVisible((prevState) => !prevState); // Alterna a visibilidade
      e.preventDefault(); 
    };


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const handleSave = () => {

    // Atualiza o paciente no array original
    setPacientes((prevPacientes) => {
      const updatedPacientes = [...prevPacientes];
      updatedPacientes[currentIndex] = { ...formValues };
      return updatedPacientes;
    });

    const pacienteIndex = pacientesAtendidos.findIndex(
      (p) => p.cpf === formValues.cpf
    );
  
    if (pacienteIndex !== -1) {
      const updatedPacientes = [...pacientesAtendidos];
      updatedPacientes[pacienteIndex] = { ...formValues };
      setPacientesAtendidos(updatedPacientes);
    } else {
      setPacientesAtendidos([...pacientesAtendidos, formValues]);
    }
    
   // alert("Paciente atualizado e salvo no array de pacientes atendidos!");
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prevIndex) => prevIndex - 1);
      setFormValues(pacientes[currentIndex - 1]);
    }
  };

  const handleNext = () => {
    if (currentIndex < pacientes.length - 1) {
      setCurrentIndex((prevIndex) => prevIndex + 1);
      setFormValues(pacientes[currentIndex + 1]);
      handleSave();
    }
  };

  return (
    <div>
      <Header />


     
      <form className="formExtra">
        <div>
              <h2>Olá, {nomeUser}</h2>
              <h3 id="totalPacientes">
                <span> Total de Pacientes:</span> <span>{pacientes.length - pacientesAtendidos.length}</span>
              </h3>
              {!formVisible && (
              <button onClick={toggleFormVisibility} className="butao atendimento"  disabled={pacientes.length - pacientesAtendidos.length === 0 }>
                 Iniciar Atendimento
              </button>
              )}
        </div>
      </form>
      {formVisible && (
      <form>
        <h2>Paciente Atual</h2>
        <div className="field">
          <label>Nome Completo:</label>
          <input
            type="text"
            name="nomeCompleto"
            value={formValues.nomeCompleto}
            onChange={handleChange}
            readOnly
          />
        </div>
        <div id="campoEspecial">
          <div className="fieldDuplo">
            <div className="field">
              <label>Data de Nascimento:</label>
              <input
                type="date"
                name="dataNascimento"
                value={formValues.dataNascimento}
                onChange={handleChange}
                readOnly
              />
            </div>

            <div className="field">
              <label>Telefone:</label>
              <input
                type="tel"
                name="telefone"
                value={formValues.telefone}
                onChange={handleChange}
                readOnly
              />
            </div>
          </div>

          <div className="fieldDuplo">
            <div className="field">
              <label>Sexo:</label>
              <input
                name="sexo"
                type="text"
                value={formValues.sexo}
                onChange={handleChange}
                readOnly
                
              >
              </input>
               
            </div>
            <div className="field">
              <label>CPF:</label>
              <input
                type="text"
                name="cpf"
                value={formValues.cpf}
                onChange={handleChange}
                readOnly
              />
            </div>
          </div>
        </div>
        <div className="field">
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formValues.email}
            onChange={handleChange}
            readOnly
          />
        </div>

        <div className="field">
          <label>Especialidade:</label>
          <input
            type="text"
            name="especialidade"
            value={formValues.especialidade}
            onChange={handleChange}
            readOnly
          />
        </div>

        <div className="field">
          <label>Médico:</label>
          <input
            type="text"
            name="medico"
            value={formValues.medico}
            onChange={handleChange}
            readOnly
          />
        </div>

        <div className="fieldDuploSimples">
          <div className="field">
            <label>Data da Consulta:</label>
            <input
              type="date"
              name="dataConsulta"
              value={formValues.dataConsulta}
              onChange={handleChange}
              readOnly
            />
          </div>

          <div className="field">
            <label>Horário da Consulta:</label>
            <input
              type="time"
              name="horarioConsulta"
              value={formValues.horarioConsulta}
              onChange={handleChange}
              readOnly
            />
          </div>
        </div>

        <div className="field">
          <label>Anotação:</label>
          <textarea
            name="anotacao"
            value={formValues.anotacao}
            onChange={handleChange}
            placeholder="Esse paciente precisa disso e aquilo"
          />
        </div>

        <div className="buttons">
          <button
            type="button"
            onClick={handlePrevious}
            disabled={currentIndex === 0}
            className="butao"
          >
            Anterior
          </button>
          <button
            type="button"
            onClick={() => {
              if (currentIndex < pacientes.length - 1) {
                handleNext();
              } else {
                setFormVisible(false); // Esconde o formulário
              //  setCurrentIndex(0); // Opcional: Reinicia para o primeiro paciente
                handleSave();
              }
            }}
            
            className="butao"
          >
             {currentIndex < pacientes.length - 1 ? "Próximo" : "Finalizar Atendimento"}
          </button>

        </div>
      </form>)}
    </div>
  );
}
