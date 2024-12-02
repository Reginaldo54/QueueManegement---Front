import './index.css';
import React from 'react';
import logo from "../../assets/logo.png"

import { useNavigate } from "react-router-dom";

export default function Header() 
{
    const navigate = useNavigate();

    return(
        <div id='header'>
            <button onClick={() => navigate("/")}>
                <img src={logo} alt="logo da queuemanegement" />
                <h1>QueueManegement</h1>
            </button>
        </div>
    ); 
}
