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
    max_tokens: 1000,
    temperature: 0.7
  }

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${import.meta.env.VITE_API_KEY}`, // Nome da variável atualizado
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('API Error:', errorData);
      throw new Error(`Erro de autenticação: Verifique sua chave API`);
    }

    const jsonResponse = await response.json();
    return jsonResponse.choices[0].message.content; // Retornando o conteúdo específico da resposta
  } catch (error) {
    console.error('Error in generateResponse:', error);
    throw new Error('Falha na autenticação com a API. Verifique sua chave API.');
  }
}