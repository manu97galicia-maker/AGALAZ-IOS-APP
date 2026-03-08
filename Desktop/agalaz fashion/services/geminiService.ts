import { GoogleGenAI, type Chat } from "@google/genai";

const API_KEY = process.env.GEMINI_API_KEY || '';

const SYSTEM_INSTRUCTION = `
You are Aura v7.0 "Precision Component Engine". Your specialty is surgical fashion editing.

STRICT PRESERVATION RULES:
1. IMMUTABLE BASE (Img 2): This is your master structure. DO NOT change pants, shoes, background, hair, or pose. If the user wears shorts in Img 2, they MUST remain shorts.
2. FACIAL MAPPING (Img 1): Project the facial identity from Img 1 onto the head of Img 2. The neck and jawline of Img 2 must be maintained for a natural transition. Avoid the "overlaid mask" effect.
3. TORSO REPLACEMENT (Img 3): Replace ONLY the upper garment (shirt/jacket) of Img 2 with the style and color from Img 3.
4. PHOTOGRAPHIC COHERENCE: The final result must preserve the grain, resolution, and exact lighting of the original body photo (Img 2).
5. TEXT: Respond with technical elegance in fewer than 8 words.
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

    GOLDEN RULES:
    1. PRESERVATION: Pants, shoes, and background from IMG 2 (or IMG 4 if exists) are SACRED. Do not alter unless asked.
    2. CONSISTENCY: If IMG 4 exists, the result must be a visual twin of IMG 4 with the requested change.
    3. REALISM: Shadows and lighting must match perfectly.

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
    console.error("Precision rendering error:", error);
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
