import { OpenAI } from 'openai';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface TranscriptionSegment {
  text: string;
  time: string;
}

export async function transcribeAudio() {
  try {
    const audioPath = path.join(process.cwd(), 'public/audio/harvard.wav');
    
    const response = await openai.audio.transcriptions.create({
      file: fs.createReadStream(audioPath),
      model: "whisper-1",
      response_format: "verbose_json",
      timestamp_granularities: ["segment"]
    });

    // Convert segments to desired format with incrementing times
    const startTime = new Date();
    startTime.setHours(14, 32, 0); // Start at 14:32

    const formattedSegments: TranscriptionSegment[] = response.segments.map((segment, index) => {
      const segmentTime = new Date(startTime.getTime() + (index * 2 * 60 * 1000)); // Add 2 minutes per segment
      const time = segmentTime.toTimeString().substring(0, 5); // Get HH:MM format
      
      return {
        text: segment.text.trim(),
        time: time
      };
    });

    // Print formatted JSON
    console.log(JSON.stringify(formattedSegments, null, 2));

    return formattedSegments;
    
  } catch (error) {
    console.error('Error during transcription:', error);
    throw error;
  }
}

// For testing the transcription
transcribeAudio()
  .then(response => {
    console.log('\nTranscription completed successfully');
  })
  .catch(error => {
    console.error('Failed to transcribe:', error);
  });
