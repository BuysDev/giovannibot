import React, { useState, useEffect } from 'react';
import './region.css';
import { generateResponse } from './services/geminiService';
import { handleTopic } from './functions';

export default function ChatBot() {
    const [message, setMessage] = useState('');
    const [chatHistory, setChatHistory] = useState([]);
    const [topic, setTopic] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const urlPath = window.location.pathname;
        const subject = urlPath.startsWith('/') ? urlPath.slice(1) : urlPath;
        setTopic(subject);
    }, []);

    const topicName = handleTopic(topic);

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (message.trim() !== '') {
            setIsLoading(true);
            setChatHistory([...chatHistory, { role: 'user', text: message }]);
            setMessage('');

            try {
                const responseText = await generateResponse(topicName, message);
                setChatHistory([...chatHistory, { role: 'user', text: message }, { role: 'bot', text: responseText }]);
            } catch (error) {
                console.error("Erro ao obter resposta do Gemini:", error);
                setChatHistory([...chatHistory, { role: 'user', text: message }, { role: 'bot', text: "Desculpe, não consegui responder agora. Tente novamente mais tarde." }]);
            } finally {
                setIsLoading(false);
            }
        }
    };

    return (
        <>
            <header className='bot__header'>
                <h1>GiovanniBot - {topicName}</h1>
            </header>
            <div className="chat_history">
                {chatHistory.map((msg, index) => (
                    <div key={index} className={msg.role === 'user' ? 'user-message' : 'bot-message'}>
                        <strong>{msg.role === 'user' ? 'Você' : 'GiovanniBot'}:</strong>
                        <div>{msg.text}</div>
                    </div>
                ))}
                {isLoading && (
                    <div className="loading-indicator bot-message"><strong>GiovanniBot</strong> está pensando...</div>
                )}
            </div>
            <div id="message_box">
                <form onSubmit={handleSubmit} id='message_form'>
                    <input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Digite sua mensagem..."
                        aria-valuemin={2}
                    />
                    <button type="submit" disabled={isLoading}>
                        Enviar
                    </button>
                </form>
            </div>
        </>
    );
}