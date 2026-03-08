import { NextRequest, NextResponse } from 'next/server';
import { createFashionChat } from '@/services/geminiService';

export async function POST(request: NextRequest) {
  try {
    const { message, history } = await request.json();

    if (!message) {
      return NextResponse.json({ error: 'Message required.' }, { status: 400 });
    }

    const chat = createFashionChat(history || []);
    const result = await chat.sendMessage({ message });
    const text = result.text || 'Adjusting...';

    return NextResponse.json({ text });
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json({ error: 'Communication error.' }, { status: 500 });
  }
}
