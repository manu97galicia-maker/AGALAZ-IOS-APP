import { NextRequest, NextResponse } from 'next/server';
import { generateTryOnImage } from '@/services/geminiService';

export async function POST(request: NextRequest) {
  try {
    const { faceImage, bodyImage, clothingImage, modificationPrompt, lastRenderedImage } =
      await request.json();

    if (!faceImage || !bodyImage || !clothingImage) {
      return NextResponse.json({ error: 'Faltan imágenes requeridas.' }, { status: 400 });
    }

    const result = await generateTryOnImage(
      faceImage,
      bodyImage,
      clothingImage,
      modificationPrompt,
      lastRenderedImage
    );

    if (result) {
      return NextResponse.json({ image: result });
    }
    return NextResponse.json({ error: 'Error de precisión. Intenta con fotos frontales.' }, { status: 500 });
  } catch (error) {
    console.error('Generate API error:', error);
    return NextResponse.json({ error: 'Falla en el motor de componentes.' }, { status: 500 });
  }
}
