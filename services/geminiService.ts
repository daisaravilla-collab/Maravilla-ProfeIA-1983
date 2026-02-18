import { GoogleGenAI } from '@google/genai';
import { ProjectData } from '../types';
import { PROMPT_TEMPLATE } from '../constants';

export const generateEducationalPlan = async (data: ProjectData): Promise<string> => {
  // Ensure we have an API key in the environment (as per rules, assume it's there via process.env)
  if (!process.env.API_KEY) {
    throw new Error("API_KEY no encontrada en el entorno.");
  }

  // Initialize the AI client
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  // Replace placeholders in the template with actual data
  const prompt = PROMPT_TEMPLATE
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
    /**
     * Switching to 'gemini-3-flash-preview' as 'gemini-3-pro-preview' is experiencing high demand (503).
     * The flash model is highly capable, faster, and better handles high traffic.
     */
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        /** 
         * Using a thinking budget to ensure the model reasons through the complex NEM methodology 
         * and formats the tables correctly before outputting.
         */
        thinkingConfig: { thinkingBudget: 8192 },
        temperature: 0.1, // Lower temperature for more consistent table formatting
      }
    });

    if (!response.text) {
      throw new Error("La IA no devolvió texto en la respuesta.");
    }

    return response.text;
  } catch (error: any) {
    console.error("Error generating plan:", error);
    
    // Provide a more user-friendly message for 503 errors
    if (error.message?.includes('503') || error.status === 'UNAVAILABLE') {
      throw new Error("El servicio está saturado temporalmente. Por favor, intenta de nuevo en unos segundos.");
    }
    
    throw error;
  }
};
