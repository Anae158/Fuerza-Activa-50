import { GoogleGenAI, Type } from "@google/genai";
import type { Nivel, Plan } from '../types';

// FIX: As per the coding guidelines, the API key must be obtained exclusively from `process.env.API_KEY`. This also fixes the TypeScript error `Property 'env' does not exist on type 'ImportMeta'`.
const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  // FIX: Updated the error message to reflect the correct environment variable name.
  throw new Error("API_KEY environment variable not set. Please configure it in your deployment settings.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const responseSchema = {
  type: Type.OBJECT,
  properties: {
    bloques: {
      type: Type.ARRAY,
      description: "Array de 4 bloques de ejercicios para el día.",
      items: {
        type: Type.OBJECT,
        properties: {
          titulo: {
            type: Type.STRING,
            description: "Título del bloque (ej: 'Bloque 1: Activación Matutina')."
          },
          frase_motivadora: {
            type: Type.STRING,
            description: "Frase motivadora para mujeres mayores de 50 años."
          },
          ejercicios: {
            type: Type.ARRAY,
            description: "Lista de 4-5 ejercicios para el bloque.",
            items: {
              type: Type.OBJECT,
              properties: {
                nombre: {
                  type: Type.STRING,
                  description: "Nombre del ejercicio."
                },
                duracion: {
                  type: Type.STRING,
                  description: "Tiempo recomendado (ej: '45 segundos')."
                },
                descripcion: {
                  type: Type.STRING,
                  description: "Descripción breve o número de repeticiones."
                }
              },
              required: ["nombre", "duracion", "descripcion"]
            }
          }
        },
        required: ["titulo", "frase_motivadora", "ejercicios"]
      }
    }
  },
  required: ["bloques"]
};


const buildPrompt = (level: Nivel): string => {
  return `
    Eres una experta entrenadora personal especializada en fitness para mujeres mayores de 50 años. Tu enfoque es en la seguridad, el fortalecimiento progresivo, la salud articular y el bienestar general. Hablas y escribes en español europeo (castellano de España).

    Tu tarea es crear una rutina de ejercicios de fuerza para un día completo, dividida en 4 bloques de 15 minutos cada uno, para el nivel de dificultad: "${level}".

    El significado de cada nivel es:
    - Nivel 1 (Iniciación): Ejercicios de muy bajo impacto, centrados en la movilidad y la activación muscular básica. Usar el propio peso corporal. Deben ser seguros para las articulaciones.
    - Nivel 2 (Medio): Ejercicios con un poco más de intensidad. Se pueden introducir bandas elásticas de baja resistencia o mancuernas muy ligeras (1-2 kg).
    - Nivel 3 (Avanzado): Ejercicios que suponen un mayor reto, usando bandas de mayor resistencia o mancuernas de peso moderado (2-4 kg), siempre priorizando la técnica correcta sobre el peso.

    Para cada uno de los 4 bloques, debes proporcionar:
    1. Un título claro (ej: "Bloque 1: Activación Matutina").
    2. Una frase motivadora, positiva y empoderadora, específicamente pensada para mujeres mayores de 50 años. Debe reforzar la autoestima, el bienestar y la constancia. Evita clichés y céntrate en la fuerza y el autocuidado.
    3. Una lista de 4-5 ejercicios. Para cada ejercicio, especifica:
        - nombre: El nombre del ejercicio.
        - duracion: El tiempo recomendado para realizar el ejercicio o el número de series y repeticiones (ej: "45 segundos" o "3 series de 10 repeticiones").
        - descripcion: Una descripción muy breve y clara de cómo hacer el ejercicio, un consejo de seguridad o el enfoque del mismo (ej: "Espalda recta" o "Controla el movimiento").

    La rutina debe ser equilibrada y trabajar diferentes grupos musculares a lo largo del día. Los ejercicios deben ser variados entre los bloques.
    La suma de los ejercicios y pequeños descansos entre ellos debe completar aproximadamente 15 minutos por bloque.

    Devuelve la respuesta EXCLUSIVAMENTE en formato JSON, siguiendo el esquema proporcionado. No incluyas explicaciones adicionales, solo el JSON.
  `;
};

export const generateWorkoutPlan = async (level: Nivel): Promise<Plan> => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: buildPrompt(level),
            config: {
                responseMimeType: "application/json",
                responseSchema: responseSchema,
                temperature: 0.8,
            },
        });

        const jsonText = response.text.trim();
        const planData: Plan = JSON.parse(jsonText);

        if (!planData.bloques || planData.bloques.length !== 4) {
            throw new Error("La respuesta de la API no contiene 4 bloques.");
        }
        
        return planData;

    } catch (error) {
        console.error("Error al generar el plan de ejercicios:", error);
        throw new Error("No se pudo comunicar con el servicio de generación de planes.");
    }
};