import React from "react";
import "./index.css";
import Header from "../header";
import { useNavigate } from "react-router-dom";

export default function UserAdmin() 
{
    const navigate = useNavigate();
    return(
        <div>
            <Header/>
            <form id="adminContainer">
                <h2>O que Deseja?</h2>
                <div id="butoes">
                    <button className="butao" onClick={() => navigate("/FormSignUpFunc")}>Cadastrar Funcionário</button>
                    <button className="butao" onClick={() => navigate("/")}>Verificar Fila</button>
                    <button className="butao" onClick={() => navigate("/")}>Sair</button>
                </div>
           
            </form>
        </div>
       
    );
} 