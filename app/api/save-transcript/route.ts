import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

interface TranscriptData {
  patient_id: number;
  date: string;
  summary: string;
  card_summary: string;
  therapist_notes: string;
  transcript: Array<{ time: string; text: string }>;
}

export async function POST(request: Request) {
  try {
    const data: TranscriptData = await request.json();
    
    const { data: insertedData, error } = await db
      .from('transcripts')
      .insert([{
        patient_id: data.patient_id,
        date: data.date,
        summary: data.summary,
        card_summary: data.card_summary,
        therapist_notes: data.therapist_notes,
        transcript: data.transcript
      }])
      .select();

    if (error) throw error;

    return NextResponse.json({ success: true, data: insertedData });
  } catch (error: any) {
    console.error('Error saving transcript:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
} 