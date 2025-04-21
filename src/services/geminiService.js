import { GoogleGenerativeAI } from '@google/generative-ai'

const gemini = new GoogleGenerativeAI(import.meta.env.API_KEY)

export async function generateResponse(topic, userMessage) {
  const model = gemini.getGenerativeModel({ model: 'gemini-pro' })

  const prompt = `Responda de maneira bem detalhada e completa sobre apenas o que foi perguntado educadamente. Por exemplo: para um cumprimento, responda com algo como "Boa noite! Posso ajudar com alguma informação sobre a região de ${topic}?" ou, para perguntas específicas, responda apenas o que foi perguntado de uma forma mais educada e completa. Responda também somente sobre a região italiana "${topic}". Pergunta: ${userMessage}`;

  const chat = model.startChat({
    history: [],
    generationConfig: {
      maxOutputTokens: 500,
    },
    systemInstruction: prompt
  });

  try {
    const result = await chat.sendMessage(msg);
    const response = result.response;
    const text = response.text();

    return text
  } catch {
    console.error("Ocorreu um erro ao gerar a resposta:", error);

    return "Desculpe, ocorreu um erro ao processar sua pergunta.";
  }
}