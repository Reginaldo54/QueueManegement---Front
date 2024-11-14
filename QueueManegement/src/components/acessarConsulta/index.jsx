import {React, useState} from "react";
import "./index.css";
import Header from "../header";
import { useNavigate } from "react-router-dom";



export default function AcessarConsulta() 
{
    const navigate = useNavigate();
    const [codigo, setCodigo] = useState("");
    const handleChange = (event) => {
        setCodigo(event.target.value);
    };

    return(
        <div>
            <Header/>
            <form id="acessarConsulta">
                <div className="formButton">
                   <h2>Acessar Consulta</h2>
                </div>
                <div className="field">
                    <label htmlFor="codigo">Inserir código recebido no email:</label>
                    <input
                    type="text"
                    name="codigo" // Atualizado para nomeCompleto
                    id="codigoInput"
                    placeholder="Insira Código"
                    value={codigo}
                    onChange={handleChange}
                    required
                    />
                </div>

                <div className="formButton">
                    <button type="submit" className="butao" onClick={() => navigate("/")}>Acessar</button>
                </div>

            </form>
        </div>
        
    );
}