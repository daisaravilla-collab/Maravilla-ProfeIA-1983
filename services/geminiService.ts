import { GoogleGenAI } from '@google/genai';
import { ProjectData } from '../types';
import { PROMPT_TEMPLATE } from '../constants';

export const generateEducationalPlan = async (data: ProjectData): Promise<string> => {

  const apiKey = import.meta.env.VITE_API_KEY;

  if (!apiKey) {
    throw new Error("VITE_API_KEY no encontrada en el entorno.");
  }

  const ai = new GoogleGenAI({ apiKey });

  let prompt = PROMPT_TEMPLATE
    .replace('{{docente}}', data.docente)
    .replace('{{campoFormativo}}', data.campoFormativo)
    .replace('{{disciplina}}', data.disciplina)
    .replace('{{grado}}', data.grado)
    .replace('{{metodologia}}', data.metodologia)
    .replace('{{nombreProyecto}}', data.nombreProyecto)
    .replace('{{problematizacion}}', data.problematizacion)
    .replace('{{productoFinal}}', data.productoFinal)
    .replace(/\{\{numSesiones\}\}/g, data.numSesiones.toString());

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        thinkingConfig: { thinkingBudget: 8192 },
        temperature: 0.2,
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
