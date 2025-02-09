import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { OpenAI } from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const { functionName, args } = await request.json();

    switch (functionName) {
      case 'getPatientSummary':
        return await getPatientSummary(args.patientId, args.date);
      case 'getClientSince':
        return await getClientSince(args.patientId);
      case 'getTranscriptQuotes':
        return await getTranscriptQuotes(args.patientId, args.query, args.date);
      default:
        return NextResponse.json({ error: 'Unknown function' }, { status: 400 });
    }
  } catch (error: any) {
    console.error('Function call error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

async function getPatientSummary(patientId: number, date: string) {
  // Get transcript for the specific date
  const { data: transcripts, error } = await db
    .from('transcripts')
    .select('*')
    .eq('patient_id', patientId)
    .eq('date', date)
    .single();

  if (error) throw error;
  if (!transcripts) return NextResponse.json({ result: 'No session found for this date.' });

  // Use OpenAI to generate a concise summary
  const response = await openai.chat.completions.create({
    model: 'gpt-4-turbo-preview',
    messages: [
      {
        role: 'system',
        content: 'Generate a concise, clinically relevant summary of this therapy session.'
      },
      {
        role: 'user',
        content: String(transcripts.transcript)
      }
    ]
  });

  return NextResponse.json({ result: response.choices[0].message.content });
}

async function getClientSince(patientId: number) {
  const { data: patient, error } = await db
    .from('patients')
    .select('client_since')
    .eq('id', patientId)
    .single();

  if (error) throw error;
  if (!patient) return NextResponse.json({ result: 'Patient not found.' });

  return NextResponse.json({ 
    result: `Patient joined on ${patient.client_since}.` 
  });
}

async function getTranscriptQuotes(patientId: number, query: string, date?: string) {
  // Build the database query
  let dbQuery = db
    .from('transcripts')
    .select('*')
    .eq('patient_id', patientId);

  if (date) {
    dbQuery = dbQuery.eq('date', date);
  }

  const { data: transcripts, error } = await dbQuery;

  if (error) throw error;
  if (!transcripts?.length) return NextResponse.json({ result: 'No relevant transcripts found.' });

  // Use OpenAI to find relevant quotes
  const response = await openai.chat.completions.create({
    model: 'gpt-4-turbo-preview',
    messages: [
      {
        role: 'system',
        content: `Find and extract relevant quotes from these therapy sessions related to: "${query}". 
                 Format them with date context.`
      },
      {
        role: 'user',
        content: JSON.stringify(transcripts)
      }
    ]
  });

  return NextResponse.json({ result: response.choices[0].message.content });
} 