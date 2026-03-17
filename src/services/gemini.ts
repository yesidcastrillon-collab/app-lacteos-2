import { GoogleGenAI, Type } from "@google/genai";
import { Eslabon, Question } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

const questionSchema = {
  type: Type.OBJECT,
  properties: {
    eslabon: { type: Type.STRING },
    imagenDescripcion: { type: Type.STRING },
    pregunta: { type: Type.STRING },
    opciones: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          texto: { type: Type.STRING }
        },
        required: ["id", "texto"]
      }
    },
    respuestaCorrecta: { type: Type.STRING },
    retroalimentacionExito: { type: Type.STRING },
    retroalimentacionFallo: { type: Type.STRING }
  },
  required: ["eslabon", "imagenDescripcion", "pregunta", "opciones", "respuestaCorrecta", "retroalimentacionExito", "retroalimentacionFallo"]
};

export async function generateQuestion(eslabon: Eslabon): Promise<Question> {
  const prompt = `Actúa como un Sistema Experto en Normatividad Láctea Colombiana. 
  Genera una pregunta de selección múltiple sobre el eslabón: ${eslabon}.
  Básate exclusivamente en el Decreto 616 de 2006 y manuales de BPH.
  
  La pregunta debe ser técnica y rigurosa.
  Incluye una descripción detallada de una imagen ilustrativa.
  La retroalimentación de fallo DEBE citar el Artículo específico del Decreto 616 de 2006.
  La retroalimentación de éxito debe reforzar con un dato técnico adicional.
  
  Asegúrate de que las opciones sean A, B, C, D.`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: questionSchema,
      systemInstruction: "Eres una autoridad sanitaria colombiana, experta en el Decreto 616 de 2006. Tu tono es instructivo, técnico y riguroso."
    }
  });

  return JSON.parse(response.text) as Question;
}
