import { GoogleGenAI } from '@google/genai';
import { ProjectData } from '../types';
import { PROMPT_TEMPLATE } from '../constants';

export const generateEducationalPlan = async (data: ProjectData): Promise<string> => {
  // Ensure we have an API key in the environment (as per rules, assume it's there via process.env)
  if (!process.env.API_KEY) {
    throw new Error("API_KEY no encontrada en el entorno.");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  // Replace placeholders in the template with actual data
  let prompt = PROMPT_TEMPLATE
    .replace('{{docente}}', data.docente)
    .replace('{{campoFormativo}}', data.campoFormativo)
    .replace('{{disciplina}}', data.disciplina)
    .replace('{{grado}}', data.grado)
    .replace('{{metodologia}}', data.metodologia)
    .replace('{{nombreProyecto}}', data.nombreProyecto)
    .replace('{{problematizacion}}', data.problematizacion)
    .replace('{{productoFinal}}', data.productoFinal)
    // Replace multiple instances if they exist
    .replace(/\{\{numSesiones\}\}/g, data.numSesiones.toString());

  try {
    // Using a powerful model capable of complex structured reasoning
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        // High budget for complex planning and formatting
        thinkingConfig: { thinkingBudget: 8192 },
        temperature: 0.2, // Keep it relatively deterministic and formal
      }
    });

    if (!response.text) {
      throw new Error("La IA no devolvió texto.");
    }

    return response.text;
  } catch (error) {
    console.error("Error generating plan:", error);
    throw error;
  }
};
