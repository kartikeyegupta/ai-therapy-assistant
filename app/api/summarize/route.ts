import OpenAI from 'openai';
import { NextResponse } from 'next/server';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export async function POST(request: Request) {
  try {
    console.log('Starting summary generation...');
    const { transcript } = await request.json();
    console.log('Received transcript length:', transcript.length);
    
    console.log('Calling OpenAI API...');
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content:
            'You are an experienced therapist. Summarize the following therapy session transcript using a clinical, empathetic, and therapeutically informed lexicon. Emphasize key emotional insights and therapeutic themes concisely. Make it thorough and detailed, with analysis of the client\'s emotional state and therapeutic progress. Make it 300 words or more.',
        },
        {
          role: 'user',
          content: transcript,
        },
      ],
      temperature: 0.7,
    });
    console.log('OpenAI API response received');
    console.log('Generated summary:', response.choices[0].message.content);

    return NextResponse.json({ summary: response.choices[0].message.content });
  } catch (error: any) {
    console.error('Error in summary generation:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
} 