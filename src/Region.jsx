import React, { useState, useEffect } from 'react';
import './region.css';
import { generateChatCompletion } from './services/openAiService';
import { handleTopic } from './functions';

export default function ChatBot() {
    const api_key = import.meta.env.VITE_API_KEY;
    if (!api_key) {
        console.error("API key is not defined. Please set the VITE_API_KEY environment variable.");
    }

    const [message, setMessage] = useState('');
    const [chatHistory, setChatHistory] = useState([]);
    const [topic, setTopic] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const urlPath = window.location.pathname;
        const subject = urlPath.startsWith('/') ? urlPath.slice(1) : urlPath;
        setTopic(subject);
    }, []);

    async function generateResponse(userMessage) {
        setIsLoading(true);
        try {
            const apiResponse = await generateChatCompletion(userMessage, topicName);

            if (apiResponse) {
                const formattedResponse = formatText(apiResponse);
                setChatHistory(prev => [...prev, { role: 'bot', text: formattedResponse }]);
            } else {
                console.error("Resposta da OpenAI vazia");
            }
        } catch (e) {
            console.error("Erro ao chamar OpenAI:", e);
        }
        setIsLoading(false);
    }

    const formatText = (text) => {
        let formattedText = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n\n/g, '<br/><br/>');
        return formattedText;
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        if (message.trim() !== '') {
            setChatHistory(prevHistory => [...prevHistory, { role: 'user', text: message }]);
            generateResponse(message);
            setMessage('');
        }
    };

    const topicName = handleTopic(topic);

    return (
        <>
            <header className='bot__header'>
                <h1>GiovanniBot - {topicName}</h1>
            </header>
            <div className="chat_history">
                {chatHistory.map((msg, index) => (
                    <div key={index} className={msg.role === 'user' ? 'user-message' : 'bot-message'}>
                        <strong>{msg.role === 'user' ? 'Você' : 'GiovanniBot'}:</strong>
                        <div dangerouslySetInnerHTML={{ __html: msg.text }} />
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
                    <button type="submit">
                        Enviar
                    </button>
                </form>
            </div>
        </>
    );
}