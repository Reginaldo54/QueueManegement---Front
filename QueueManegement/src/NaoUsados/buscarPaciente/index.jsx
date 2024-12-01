import React, { useState } from "react";
import "./index.css";
import axios from "axios";

export default function BuscarPosicaoPaciente({ onPosicaoEncontrada }) {
  const [codigo, setCodigo] = useState("");
  const [erro, setErro] = useState(null);

  const buscarPosicao = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/fila/posicao/codigo/${codigo}`);  
      const posicao = response.data;
      onPosicaoEncontrada(posicao -1);
      setErro(null);
    } catch (error) {
      setErro("Código não encontrado ou erro na busca.");
    }
  };

  return (
    <div id="buscarContainer">
      <input
        type="text"
        value={codigo}
        placeholder="Insira o código do paciente"
        onChange={(e) => setCodigo(e.target.value)}
      />
      <button onClick={buscarPosicao}>Buscar posição</button>
      {erro && <p style={{ color: "red" }}>{erro}</p>}
    </div>
  );
}
