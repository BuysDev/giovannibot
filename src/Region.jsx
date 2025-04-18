import React, { useState, useEffect } from 'react';
import './region.css';
import { generateResponse } from './services/geminiService';
import { handleTopic } from './functions';

export default function ChatBot() {
    // A chave da API do Gemini deve ser mantida no backend por segurança.
    // Não a exponha diretamente no frontend.
    // const api_key = import.meta.env.VITE_GEMINI_API_KEY;
    // if (!api_key) {
    //     console.error("API key is not defined. Please set the VITE_GEMINI_API_KEY environment variable.");
    // }

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
            setIsLoading(true); // Indica que o bot está pensando
            setChatHistory([...chatHistory, { role: 'user', text: message }]); // Adiciona a mensagem do usuário ao histórico
            setMessage(''); // Limpa o input

            try {
                const responseText = await generateResponse(topicName, message);
                setChatHistory([...chatHistory, { role: 'user', text: message }, { role: 'bot', text: responseText }]); // Adiciona a resposta do bot ao histórico
            } catch (error) {
                console.error("Erro ao obter resposta do Gemini:", error);
                setChatHistory([...chatHistory, { role: 'user', text: message }, { role: 'bot', text: "Desculpe, não consegui responder agora. Tente novamente mais tarde." }]); // Mensagem de erro para o usuário
            } finally {
                setIsLoading(false); // Indica que o bot terminou de pensar
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
                        <div>{msg.text}</div> {/* Removi dangerouslySetInnerHTML para segurança, já que a resposta deve ser texto simples */}
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