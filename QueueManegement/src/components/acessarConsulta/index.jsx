import React, { useState, useEffect } from 'react';
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';

const ConfirmarPresenca = () => {
    const [codigoCodigo, setCodigoCodigo] = useState('');
    const [idAgendamento, setIdAgendamento] = useState('');
    const [client, setClient] = useState(null); // Variável de estado para armazenar o cliente STOMP

  // Criação da conexão WebSocket
  const websocketChamarPacienteConection = () => {
    const socket = new SockJS("http://localhost:8080/fila-websocket"); 
    const stompClientInstance = Stomp.over(socket);
  
    stompClientInstance.connect({}, () => {
      console.log('Conectado ao WebSocket');
  
      // Assina o tópico de confirmação de presença
      stompClientInstance.subscribe('/topic/presencaConfirmada', (message) => {
        const body = JSON.parse(message.body);
        console.log(body); // Exibe a resposta recebida no console
      });
    });
  
    stompClientInstance.activate();
    setClient(stompClientInstance);
  
    // Função de cleanup para desconectar
    return () => {
      if (stompClientInstance) {
        stompClientInstance.deactivate();
        console.log("Desconectado do WebSocket");
      }
    };
  };
  

  useEffect(() => {
    websocketChamarPacienteConection();
    const disconnectClient = websocketChamarPacienteConection();

    // Retorna a função de desconexão para o cleanup
    return disconnectClient;
   }, []); // O array vazio garante que o efeito rode apenas uma vez

  // Função chamada ao enviar o formulário
  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      codigoCodigo,
      idAgendamento: parseInt(idAgendamento, 10),  // Garante que idAgendamento seja um número
    };

    if (client && client.connected) {
      try {
        // Envia a solicitação para confirmar a presença via WebSocket
        client.send("/app/marcarPresenca", {}, JSON.stringify(payload));
      } catch (error) {
        console.log(error);
        
      }
    } 
  };

  return (
    <div>
      <h2>Confirmar Presença</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Código do Paciente:</label>
          <input
            type="text"
            value={codigoCodigo}
            onChange={(e) => setCodigoCodigo(e.target.value)}
            required
          />
        </div>
        <div>
          <label>ID do Agendamento:</label>
          <input
            type="number"
            value={idAgendamento}
            onChange={(e) => setIdAgendamento(e.target.value)}
            required
          />
        </div>
        <button type="submit">Confirmar</button>
      </form>
    </div>
  );
};

export default ConfirmarPresenca;
