import { GoogleGenAI, type Chat } from "@google/genai";

const API_KEY = process.env.GEMINI_API_KEY || '';

const SYSTEM_INSTRUCTION = `
Eres Aura v7.0 "Precision Component Engine". Tu especialidad es la edición quirúrgica de moda.

REGLAS DE PRESERVACIÓN ESTRICTA:
1. BASE INAMOVIBLE (Img 2): Esta es tu estructura maestra. NO cambies los pantalones, zapatos, fondo, cabello ni la pose. Si el usuario lleva pantalones cortos en Img 2, DEBEN seguir siendo pantalones cortos.
2. MAPEO FACIAL (Img 1): Proyecta la identidad facial de Img 1 sobre la cabeza de Img 2. El cuello y la línea de la mandíbula de Img 2 deben mantenerse para una transición natural. Evita el efecto de "máscara superpuesta".
3. REEMPLAZO DE TORSO (Img 3): Sustituye ÚNICAMENTE la prenda superior (camiseta/chaqueta) de Img 2 por el estilo y color de Img 3.
4. COHERENCIA FOTOGRÁFICA: El resultado final debe conservar el grano, la resolución y la iluminación exacta de la foto original del cuerpo (Img 2).
5. TEXTO: Responde con elegancia técnica en menos de 8 palabras.
`;

export async function generateTryOnImage(
  faceImage: string,
  bodyImage: string,
  clothingImage: string,
  modificationPrompt?: string,
  lastRenderedImage?: string
): Promise<string | null> {
  try {
    const ai = new GoogleGenAI({ apiKey: API_KEY });

    const parts: any[] = [
      { inlineData: { mimeType: 'image/jpeg', data: faceImage } },
      { inlineData: { mimeType: 'image/jpeg', data: bodyImage } },
      { inlineData: { mimeType: 'image/jpeg', data: clothingImage } },
    ];

    if (lastRenderedImage) {
      const base64Data = lastRenderedImage.split(',')[1] || lastRenderedImage;
      parts.push({ inlineData: { mimeType: 'image/png', data: base64Data } });
    }

    const promptBase = `STRICT EDITORIAL COMPOSITING & CONSISTENCY:
    - IDENTITY (IMG 1): Source for the face.
    - STRUCTURE (IMG 2): Source for the body pose, background, and environment.
    - GARMENT (IMG 3): Source for the top clothing.
    ${lastRenderedImage ? `- CURRENT STATE (IMG 4): This is the PREVIOUS RENDER. You MUST use this as your absolute reference for composition. Do NOT change the background, lighting, pose, or body shape from IMG 4.` : ''}

    CRITICAL TASK: ${modificationPrompt ? `Modify the image according to: "${modificationPrompt}". Start from ${lastRenderedImage ? 'IMG 4' : 'the composition'} and apply the change. Keep every other pixel as close to ${lastRenderedImage ? 'IMG 4' : 'the original body (IMG 2)'} as possible.` : "Seamlessly integrate the face (IMG 1) and the top garment (IMG 3) onto the body (IMG 2)."}

    REGLAS DE ORO:
    1. PRESERVACIÓN: Los pantalones, zapatos y fondo de IMG 2 (o IMG 4 si existe) son SAGRADOS. No los alteres a menos que se pida.
    2. CONSISTENCIA: Si existe IMG 4, el resultado debe ser un gemelo visual de IMG 4 con el cambio solicitado.
    3. REALISMO: Sombras y luces deben coincidir perfectamente.

    QUALITY: 8k, photorealistic, perfect skin blending, no anatomical distortions.`;

    parts.push({ text: promptBase });

    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash-exp',
      contents: { parts },
      config: {
        responseModalities: ["TEXT", "IMAGE"],
      },
    });

    if (response.candidates?.[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if ((part as any).inlineData?.data) {
          return `data:image/png;base64,${(part as any).inlineData.data}`;
        }
      }
    }
    return null;
  } catch (error) {
    console.error("Error en renderizado de precisión:", error);
    return null;
  }
}

export function createFashionChat(history: any[]): Chat {
  const ai = new GoogleGenAI({ apiKey: API_KEY });
  return ai.chats.create({
    model: 'gemini-2.0-flash',
    config: { systemInstruction: SYSTEM_INSTRUCTION },
    history,
  });
}
