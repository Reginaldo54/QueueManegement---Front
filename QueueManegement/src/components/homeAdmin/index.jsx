import React, { useEffect, useRef } from "react";
import "./index.css";
import Header from "../header";
import { useNavigate } from "react-router-dom";

export default function HomeAdmin() {
    const navigate = useNavigate();
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

    return (
        <div>
            <Header />
            <div id="centralizaFormAdmin">
                <form id="adminContainer" ref={formRef}> {/* Associa a referência ao formulário */}
                    <h2>O que Deseja?</h2>
                    <div id="butoes">
                        <button
                            className="butao"
                            onClick={() => navigate("/FormSignUpMed")}
                        >
                            Cadastrar Médico
                        </button>
                        <button
                            className="butao"
                            onClick={() => {
                                navigate("/Fila");
                            }}
                        >
                            Verificar Fila
                        </button>
                        <button
                            className="butao"
                            onClick={() => {
                                navigate("/login");
                            }}
                        >
                            Sair
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
