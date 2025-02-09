import { OpenAI } from 'openai';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function transcribeAudio() {
  try {
    const audioPath = path.join(process.cwd(), 'public/audio/harvard.wav');
    
    const response = await openai.audio.transcriptions.create({
      file: fs.createReadStream(audioPath),
      model: "whisper-1",
      response_format: "verbose_json",
      timestamp_granularities: ["segment"]
    });

    // Print each segment with its timestamp
    response.segments.forEach((segment) => {
      const startTime = formatTimestamp(segment.start);
      const endTime = formatTimestamp(segment.end);
      console.log(`[${startTime} -> ${endTime}] ${segment.text}`);
    });

    return response;
    
  } catch (error) {
    console.error('Error during transcription:', error);
    throw error;
  }
}

// Helper function to format timestamps as MM:SS.mmm
function formatTimestamp(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toFixed(3).padStart(6, '0')}`;
}

// For testing the transcription
transcribeAudio()
  .then(response => {
    console.log('\nTranscription completed successfully');
  })
  .catch(error => {
    console.error('Failed to transcribe:', error);
  });
