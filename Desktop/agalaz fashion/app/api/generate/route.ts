import { NextRequest, NextResponse } from 'next/server';
import { generateTryOnImage } from '@/services/geminiService';

export const maxDuration = 60;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { faceImage, bodyImage, clothingImage, modificationPrompt, lastRenderedImage } = body;

    if (!faceImage || !bodyImage) {
      return NextResponse.json({ error: 'Face and body photos are required.' }, { status: 400 });
    }

    // Validate base64 size (max ~10MB per image)
    const maxSize = 10 * 1024 * 1024;
    if (faceImage.length > maxSize || bodyImage.length > maxSize) {
      return NextResponse.json(
        { error: 'Image too large. Please use a smaller photo.' },
        { status: 400 }
      );
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
  } catch (error: any) {
    console.error('Generate API error:', error);
    const message = error?.message || '';
    if (message.includes('too large') || message.includes('payload')) {
      return NextResponse.json({ error: 'Images too large. Try smaller photos.' }, { status: 413 });
    }
    return NextResponse.json({ error: 'Component engine failure. Please try again.' }, { status: 500 });
  }
}
