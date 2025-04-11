import React, { useState, useEffect } from 'react';
import './region.css';

async function generateResponse(userMessage) {
    let apiResponse = '';

    try {
        const response = await fetch(api_url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{
                    role: "user",
                    parts: [{
                        text: `Responda com precisão e de maneira detalhada, respondendo apenas ao que for perguntado. Pergunta: ${userMessage}`
                    }]
                }]
            })
        });

        const data = await response.json();
        apiResponse = data?.candidates?.[0]?.content?.parts?.[0]?.text;

        if (apiResponse) {
            const formattedResponse = formatText(apiResponse);
            setChatHistory(prevHistory => [...prevHistory, { role: 'bot', text: formattedResponse }]);
        } else {
            console.error("Erro ao obter resposta da API.");
        }
    } catch (e) {
        console.error("Erro ao chamar a API:", e);
    }
}

const formatText = (text) => {
    let formattedText = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/^([A-Z][\w\s]+):/gm, '<h3>$1:</h3>').replace(/^- (.*?)(?=\n|$)/gm, '<li>$1</li>').replace(/\n\n+/g, '</p><p>').replace(/\n/g, '<br>');

    formattedText = `<p>${formattedText}</p>`;

    formattedText = formattedText.replace(/(<li>.*?<\/li>)/gs, '<ul>$1</ul>');

    formattedText = formattedText.replace(/(\s*\.\s*|\.+)/g, '. ').replace(/\,+/g, ', ').replace(/\s+,/g, ',').replace(/\s\s+/g, ' ');

    return formattedText;
};

export default function ChatBot() {
    const api_key = import.meta.env.VITE_API_KEY;
    if (!api_key) {
        console.error("API key is not defined. Please set the VITE_API_KEY environment variable.");
    }
    const api_url = `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${api_key}`;

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
            const response = await fetch(api_url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    contents: [{
                        role: "user",
                        parts: [{
                            text: `Responda de maneira bem detalhada e completa sobre apenas o que foi perguntado educadamente. Por exemplo: para um cumprimento, responda com algo como "Boa noite! Posso ajudar com alguma informação sobre a região de ${topic}?" ou, para perguntas específicas, responda apenas o que foi perguntado de uma forma mais educada e completa. Responda também somente sobre a região italiana "${topic}" Pergunta: ${userMessage}`
                        }]
                    }]
                })
            });

            const data = await response.json();
            const apiResponse = data?.candidates?.[0]?.content?.parts?.[0]?.text;

            if (apiResponse) {
                const formattedResponse = formatText(apiResponse);

                setChatHistory(prevHistory => [...prevHistory, { role: 'bot', text: formattedResponse }]);
            } else {
                console.error("Erro ao obter resposta da API.");
            }
        } catch (e) {
            console.error("Erro ao chamar a API:", e);
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

    function handleTopic () {
        if (topic === 'region/umbria') {
            return 'Umbria'
        }

        if (topic === 'region/lazio') {
            return 'Lazio'
        }

        if (topic === 'region/abruzzo') {
            return 'Abruzzo'
        }

        if (topic === 'region/basilicata') {
            return 'Basilicata'
        }

        if (topic === 'region/calabria') {
            return 'Calabria'
        }

        if (topic === 'region/campania') {
            return 'Campania'
        }

        if (topic === 'region/emilia_romagna') {
            return 'Emilia Romana'
        }

        if (topic === 'region/friuli-venezia_giulia') {
            return 'Friuli-Venezia Giulia'
        }

        if (topic === 'region/Liguria') {
            return 'Liguria'
        }

        if (topic === 'region/Lombardia') {
            return 'Lombardia'
        }

        if (topic === 'region/Marche') {
            return 'Marche'
        }

        if (topic === 'region/Molise') {
            return 'Molise'
        }

        if (topic === 'region/Piemonte') {
            return 'Piemonte'
        }

        if (topic === 'region/puglia') {
            return 'Puglia'
        }

        if (topic === 'region/sardegna') {
            return 'Sardenha'
        }

        if (topic === 'region/sicilia') {
            return 'Sicília'
        }

        if (topic === 'region/toscana') {
            return 'Toscana'
        }
        
        if (topic === 'region/trentino-alto_adige') {
            return 'Trentino-Alto Adige'
        }

        if (topic === 'region/vale_daosta') {
            return 'Vale DaOsta'
        }

        if (topic === 'region/veneto') {
            return 'Veneto'
        }
    }

    const topicName = handleTopic()

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
                    <button type="submit">Enviar</button>
                </form>
            </div>
        </>
    );
}