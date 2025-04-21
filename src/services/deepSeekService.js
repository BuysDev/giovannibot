export async function generateResponse(topic, userMessage) {
  const prompt = `Responda de maneira bem detalhada e completa sobre apenas o que foi perguntado educadamente. Por exemplo: para um cumprimento, responda com algo como "Boa noite! Posso ajudar com alguma informação sobre a região de ${topic}?" ou, para perguntas específicas, responda apenas o que foi perguntado de uma forma mais educada e completa. Responda também somente sobre a região italiana "${topic}". Pergunta: ${userMessage}`;

  const data = {
    model: 'deepseek/deepseek-r1:free',
    messages: [
      {
        role: 'user',
        content: prompt
      }
    ],
  }

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${import.meta.env.API_KEY}`
      },
      body: JSON.stringify(data)
    });

    const jsonResponse = await response.json();
    return jsonResponse.choices[0].message.content;
  } catch (error) {
    console.error('Error in generateResponse:', error);
    throw error;
  }
}