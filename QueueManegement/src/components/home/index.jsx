import React, { useEffect, useRef } from "react";
import "./index.css";
import Header from "../header";
import { useNavigate } from "react-router-dom";

export default function Home() 
{
    const formRef = useRef(null); // Cria uma referência para o formulário
    useEffect(() => {
        // Rola até o formulário quando a página carregar
        if (formRef.current) {
            formRef.current.scrollIntoView({
                behavior: "smooth", // Rolagem suave
                block: "center", // Centraliza o formulário na tela
            });
        }
    }, []);
    const navigate = useNavigate();
    //<button className="butao" onClick={() => navigate("/AcessarConsulta")}>Acessar Consulta</button>
    return(
        <div>
             <Header/>
             <div id="centralizaFormHome">
                <form ref={formRef}>
                    
                    <div id="homeContainer">
                        <h2>O que Deseja?</h2>
                        <div id="butoes">
                            <button className="butao" style={{width:""}} onClick={() => navigate("/FormSignUp")}>Agendamento</button>
                            <button className="butao" onClick={() => navigate("/AcessarConsulta")}>Acessar Consulta</button>
                            <button className="butao" onClick={() => navigate("/Login")}>Login</button>
                        </div>
                    </div>
                </form>
             </div>
        </div>
       
        
    );
} 