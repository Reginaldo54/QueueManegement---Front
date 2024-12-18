import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./index.css";
import Header from "../header";

export default function Login() {
    const [senha, setSenha] = useState("");
    const [email, setEmail] = useState("");
    const navigate = useNavigate();

    const handleChangeSenha = (event) => {
        setSenha(event.target.value);
    };

    const handleChangeEmail = (event) => {
        setEmail(event.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // Envia uma requisição GET para o endpoint de login com os parâmetros emailOrCpf e password
            const response = await fetch(`http://localhost:8080/fila/login?emailOrCpf=${email}&password=${senha}`);

            if (!response.ok) {
                // Caso a resposta não seja bem-sucedida (erro 401 ou outro)
                throw new Error("Credenciais inválidas");
            }

            const data = await response.json();
            console.log(data);
            
            

            // Verifica se a resposta contém a role
            if (data) {
        
                // Dependendo da role retornada, redireciona para a página apropriada
                if (data === "ADMIN") {
                  navigate("/homeadmin");
                  console.log("Deu certo: " + JSON.stringify(data));
                } else if (data.role === "ESPECIALISTA") {
                    // Se for especialista, pode redirecionar para a página do especialista
                   // navigate(`/homemedico/${data.idEspecialista}`);
                   let idEspecialista = data.idEspecialista;
                   navigate("/homeMedico", { state: {idEspecialista} });
                
                }if (data.role === "PACIENTE") {
                   alert("O Login é apenas para Médicos e o Admim");
                }
            } else {
                // Se a role não for encontrada, mostramos um alerta com o erro
                alert("Erro: Não foi possível determinar o tipo de usuário.");
            }

        } catch (error) {
            // Exibe a mensagem de erro caso a autenticação falhe
            alert(error.message);
        }
    };

    return (
        <div>
            <Header />
            <div id="loginContainer" style={{marginTop:"65px"}}>
                <form id="login" onSubmit={handleSubmit}>
                    <h2>Login</h2>

                    <div className="field">
                        <label htmlFor="email">Email:</label>
                        <input
                            type="text"
                            name="email"
                            id="emailInput"
                            placeholder="Insira Email"
                            value={email}
                            onChange={handleChangeEmail}
                            required
                        />
                    </div>

                    <div className="field">
                        <label htmlFor="senha">Senha:</label>
                        <input
                            type="password"
                            name="senha"
                            id="senhaInput"
                            placeholder="Insira Senha"
                            value={senha}
                            onChange={handleChangeSenha}
                            required
                        />
                    </div>

                    <div className="formButton">
                        <button type="submit" className="butao">Login</button>
                    </div>
                </form>
            </div>
        </div>
    );
}
