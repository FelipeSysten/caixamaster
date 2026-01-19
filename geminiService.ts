
import { GoogleGenAI, Type } from "@google/genai";
import { Submission } from "./types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const getDashboardInsights = async (submissions: Submission[]) => {
  if (submissions.length === 0) return "Aguardando mais dados para análise estratégica.";

  const summary = submissions.map(s => ({
    user: s.userName,
    date: s.date.split('T')[0],
    completion: `${s.completedItems.length}/20`,
    isComplete: s.isFullComplete
  }));

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Analise estes dados de fechamento de caixa e dê 3 insights curtos e profissionais para o gerente (em português): ${JSON.stringify(summary)}`,
      config: {
        thinkingConfig: { thinkingBudget: 0 }
      }
    });

    return response.text || "Erro ao processar insights automáticos.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Falha ao gerar insights da IA no momento.";
  }
};
