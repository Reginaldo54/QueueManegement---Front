import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import Home from './components/home';
import Login from './components/login';
import FormSignUp from "./components/formSignUp";
import "./App.css"
import HomeMedico from "./components/homeMedico";
import Fila from "./components/fila";
import FormSignUpMed from "./components/FormSignUpMed";
import AcessarConsulta from "./components/acessarConsulta";
import HomeAdmin from "./components/homeAdmin";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home/>} /> 
        <Route path="/Fila" element={<Fila/>} />
        <Route path="/HomeMedico" element={<HomeMedico/>} />
        <Route path="/AcessarConsulta" element={<AcessarConsulta/>} />
        <Route path="/Login" element={<Login/>} />
        <Route path="/HomeAdmin" element={<HomeAdmin/>} />
        <Route path="/FormSignUp" element={<FormSignUp/>} />
        <Route path="/FormSignUpMed" element={<FormSignUpMed/>} />
      </Routes>
    </Router>
  );
}

export default App;
