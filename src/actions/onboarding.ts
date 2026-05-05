"use server";

import { generateTextWithFallback } from "@/lib/ai-manager";
import { z } from "zod";

const placementTestSchema = z.object({
  questions: z.array(z.object({
    id: z.number(),
    question: z.string(),
    options: z.array(z.string()),
    correctIndex: z.number(),
    level: z.enum(["A1", "A2", "B1"]),
    explanation: z.string()
  }))
});

export type PlacementQuestion = z.infer<typeof placementTestSchema>["questions"][0];

export const generatePlacementTest = async (language: string) => {
  const prompt = `
    Aja como um especialista em pedagogia de línguas (especificamente ${language}).
    Gera um teste de nivelamento rápido com 5 questões de escolha múltipla.
    As questões devem progredir em dificuldade:
    1. Questão 1: Nível A1 (Muito básico - saudações, cores ou números)
    2. Questão 2: Nível A1 (Básico - família, objetos comuns, presente simples)
    3. Questão 3: Nível A2 (Diário - rotinas, passado simples, direções)
    4. Questão 4: Nível A2 (Social - planos futuros, comparativos, preposições)
    5. Questão 5: Nível B1 (Intermédio - opiniões, conectores, condicional simples ou temas abstratos)

    Retorna APENAS um JSON puro no formato:
    {
      "questions": [
        {
          "id": 1,
          "question": "A pergunta em ${language}",
          "options": ["Opção A", "Opção B", "Opção C", "Opção D"],
          "correctIndex": 0,
          "level": "A1",
          "explanation": "Explicação breve em PORTUGUÊS DE PORTUGAL"
        }
      ]
    }
  `;

  try {
    const response = await generateTextWithFallback(prompt);
    // Extract JSON (handle potential markdown blocks)
    const jsonStr = response.replace(/```json/g, "").replace(/```/g, "").trim();
    const data = JSON.parse(jsonStr);
    
    const validated = placementTestSchema.parse(data);
    return { success: true, questions: validated.questions };
  } catch (error) {
    console.error("Erro ao gerar teste de nivelamento:", error);
    return { success: false, error: "Falha ao gerar o teste. Tenta novamente." };
  }
};
