import OpenAI from 'openai';
import { NextResponse } from 'next/server';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export async function POST(request: Request) {
  try {
    const { transcript } = await request.json();
    
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content:
            'You are an experienced therapist. Summarize the following therapy session transcript using a clinical, empathetic, and therapeutically informed lexicon. Emphasize key emotional insights and therapeutic themes concisely.',
        },
        {
          role: 'user',
          content: transcript,
        },
      ],
      temperature: 0.7,
    });

    return NextResponse.json({ summary: response.choices[0].message.content });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
} 