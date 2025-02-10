import OpenAI from 'openai';
import { NextResponse } from 'next/server';

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY
});

export async function POST(request: Request) {
  try {
    const { summary } = await request.json();
    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'Condense the following therapy session summary into one clear, comprehensive sentence that captures the key insights and progress.'
        },
        {
          role: 'user',
          content: summary
        }
      ],
      temperature: 0.7,
    });

    return NextResponse.json({ oneSentence: response.choices[0].message.content });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
} 