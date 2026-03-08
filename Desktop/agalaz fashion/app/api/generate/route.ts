import { NextRequest, NextResponse } from 'next/server';
import { generateTryOnImage } from '@/services/geminiService';

export async function POST(request: NextRequest) {
  try {
    const { faceImage, bodyImage, clothingImage, modificationPrompt, lastRenderedImage } =
      await request.json();

    if (!faceImage || !bodyImage) {
      return NextResponse.json({ error: 'Face and body photos are required.' }, { status: 400 });
    }

    const result = await generateTryOnImage(
      faceImage,
      bodyImage,
      clothingImage || undefined,
      modificationPrompt,
      lastRenderedImage
    );

    if (result) {
      return NextResponse.json({ image: result });
    }
    return NextResponse.json(
      { error: 'Could not generate image. Make sure your body photo shows full body from head to feet, and use frontal photos for best results.' },
      { status: 500 }
    );
  } catch (error) {
    console.error('Generate API error:', error);
    return NextResponse.json({ error: 'Component engine failure. Please try again.' }, { status: 500 });
  }
}
