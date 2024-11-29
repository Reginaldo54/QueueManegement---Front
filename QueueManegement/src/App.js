import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import AcessoFuncionario from './components/acessofuncionario';
import FormSignUpFunc from './components/formSignUpFunc';
import Header from './components/header';
import Home from './components/home';
import Login from './components/login';
import UserAdmin from './components/userAdmin';
import logo from './logo.svg';
import TodasTelas from './pages/TodasTelas';
import FormSignUp from "./components/formSignUp";
import "./App.css"
import HomeMedico from "./components/homeMedico";
import Fila from "./components/fila";
import FilaAtendimento from "./teste/fila_atendimento";
import HomePaciente from "./components/homePaciente";
import FormSignUpMed from "./components/FormSignUpMed";
import AcessarConsulta from "./components/acessarConsulta";

//<Home/>
//<TodasTelas/>
// <AcessarConsulta/>
// <Login/>
//<UserAdmin/>
//<FormSignUpFunc/>
//<AcessoFuncionario/>

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home/>} /> 
        <Route path="/AcessarConsulta2" element={<FilaAtendimento/>} /> 
        <Route path="/Fila" element={<Fila/>} />
        <Route path="/HomeMedico" element={<HomeMedico/>} />
        <Route path="/AcessarConsulta" element={<HomePaciente/>} />
        <Route path="/AcessarConsulta1" element={<AcessarConsulta/>} />
        <Route path="/Login" element={<Login/>} />
        <Route path="/HomeAdmin" element={<UserAdmin/>} />
        <Route path="/FormSignUp" element={<FormSignUp/>} />
        <Route path="/FormSignUpFunc" element={<FormSignUpFunc/>} />
        <Route path="/FormSignUpMed" element={<FormSignUpMed/>} />
        <Route path="/HomeFuncionario" element={<AcessoFuncionario/>} />
      </Routes>
    </Router>
  );
}

export default App;
