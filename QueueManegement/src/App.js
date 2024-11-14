import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import AcessarConsulta from './components/acessarConsulta';
import AcessoFuncionario from './components/acessofuncionario';
import FormSignUpFunc from './components/formSignUpFunc';
import Header from './components/header';
import Home from './components/home';
import Login from './components/login';
import UserAdmin from './components/userAdmin';
import logo from './logo.svg';
import TodasTelas from './pages/TodasTelas';
import FormSignUp from "./components/formSignUp";


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
        <Route path="/AcessarConsulta" element={<AcessarConsulta/>} />
        <Route path="/Login" element={<Login/>} />
        <Route path="/Admin" element={<UserAdmin/>} />
        <Route path="/FormSignUp" element={<FormSignUp/>} />
        <Route path="/FormSignUpFunc" element={<FormSignUpFunc/>} />
        <Route path="/Funcionario" element={<AcessoFuncionario/>} />
        <Route path="/AcessarConsulta" element={<AcessarConsulta/>} />
      </Routes>
    </Router>
  );
}

export default App;
