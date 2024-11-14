import React from "react";
import "./index.css";
import Header from "../header";
import { useNavigate } from "react-router-dom";

export default function Home() 
{
    const navigate = useNavigate();
    return(
        <div>
             <Header/>
             <form>
           
                <div id="homeContainer">
                    <h2>O que Deseja?</h2>
                    <div id="butoes">
                        <button className="butao" onClick={() => navigate("/FormSignUp")}>Agendar</button>
                        <button className="butao" onClick={() => navigate("/AcessarConsulta")}>Acessar Consulta</button>
                        <button className="butao" onClick={() => navigate("/Login")}>Login</button>
                    </div>
                </div>
            </form>
        </div>
       
        
    );
} 