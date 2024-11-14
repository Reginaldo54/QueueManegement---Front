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

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Verifique o tipo de usuário com base nas credenciais inseridas
        if (email === "admin" && senha === "admin") {
            navigate("/admin");
        } else if (email === "funcionario" && senha === "funcionario") {
            navigate("/funcionario");
        } else if (email === "medico" && senha === "medico") {
            navigate("/medico");
        } else {
            alert("Credenciais inválidas");
        }
    };

    return (
        <div>
            <Header />
            <div id="loginContainer">
                <div id="centralizando">
                    <h2>Logins disponiveis para teste</h2>
                    <div id="acessosLogin">
                        <div className="acesso">
                            <h3>Admin</h3>
                            <span>Login: admin</span> <br/>
                            <span>Senha: admin</span>
                        </div>

                        <div className="acesso">
                            <h3>Funcionário</h3>
                            <span>Login: funcionario</span><br/>
                            <span>Senha: funcionario</span>
                        </div>
                    </div>
                </div>
           

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
