import { NextRequest, NextResponse } from 'next/server';
import { generateTryOnImage } from '@/services/geminiService';

export async function POST(request: NextRequest) {
  try {
    const { faceImage, bodyImage, clothingImage, modificationPrompt, lastRenderedImage } =
      await request.json();

    if (!faceImage || !bodyImage || !clothingImage) {
      return NextResponse.json({ error: 'Missing required images.' }, { status: 400 });
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
    return NextResponse.json({ error: 'Precision error. Try with frontal photos.' }, { status: 500 });
  } catch (error) {
    console.error('Generate API error:', error);
    return NextResponse.json({ error: 'Component engine failure.' }, { status: 500 });
  }
}
