import { OpenAI } from 'openai';
import fs from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_SECRET,
});

export async function POST(request: Request) {
  console.log('Transcribe API endpoint hit');
  try {
    const formData = await request.formData();
    console.log('FormData received');
    
    const audioFile = formData.get('audio') as File;
    console.log('Audio file extracted:', audioFile?.size, 'bytes');
    
    if (!audioFile) {
      console.error('No audio file provided');
      return NextResponse.json(
        { error: 'No audio file provided' },
        { status: 400 }
      );
    }

    console.log('Calling OpenAI transcription API...');
    const response = await openai.audio.transcriptions.create({
      file: audioFile,
      model: "whisper-1",
      response_format: "verbose_json",
      timestamp_granularities: ["segment"]
    });
    console.log('OpenAI response received');

    const formattedSegments = (response.segments || []).map(segment => ({
      ...segment,
      startFormatted: formatTimestamp(segment.start),
      endFormatted: formatTimestamp(segment.end)
    }));
    console.log('Segments formatted');

    const responseData = { 
      transcript: response.text,
      segments: formattedSegments
    };
    console.log('Sending response:', responseData);
    
    return NextResponse.json(responseData);
    
  } catch (error: any) {
    console.error('Error in transcribe API:', error);
    return NextResponse.json(
      { error: error.message }, 
      { status: 500 }
    );
  }
}

function formatTimestamp(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toFixed(3).padStart(6, '0')}`;
}
