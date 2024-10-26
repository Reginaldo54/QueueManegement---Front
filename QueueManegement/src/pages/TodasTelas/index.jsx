import React from "react";
import "./index.css";
import FormSignUp from "../../components/formSignUp";
import FilaDeAtendimento from "../FilaAtendimento";
import FilaPaciente from "../FilaPaciente";

export default function TodasTelas() 
{
    return(
        <div id="telasContainer">
            <FormSignUp/>
            <FilaPaciente/>
            <FilaDeAtendimento/>
        </div>
    ) 
}