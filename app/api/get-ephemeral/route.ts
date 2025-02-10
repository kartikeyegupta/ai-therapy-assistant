import { NextResponse } from "next/server";
import fetch from "node-fetch";
import "dotenv/config";
import { db } from '@/lib/db';

/**
 * GET handler for the /api/get-ephemeral route
 * Creates a Realtime session with OpenAI
 */
export async function GET(request: Request) {
    const NEXT_PUBLIC_SECRET = process.env.NEXT_PUBLIC_SECRET;

    if (!NEXT_PUBLIC_SECRET) {
        console.error("Missing NEXT_PUBLIC_SECRET in environment");
        return NextResponse.json(
            { error: "Missing NEXT_PUBLIC_SECRET in environment." },
            { status: 500 }
        );
    }

    try {
        // Get patient ID from query params
        const { searchParams } = new URL(request.url);
        const patientId = searchParams.get('patientId');
        console.log(request.url);

        // Get patient context if ID provided
        let patientContext = '';
        if (patientId) {
            const { data: patient, error } = await db
                .from('patients')
                .select('*')
                .eq('id', parseInt(patientId))
                .single();

            const { data: summaries, error: SummaryError } = await db
                .from('transcripts')
                .select('summary, date')
                .eq('patient_id', parseInt(patientId))
                .order('date', { ascending: false });

            console.log("summaries: ", summaries);
            console.log("SummaryError: ", SummaryError);

            if (!SummaryError && summaries) {

                if (!error && patient) {
                    patientContext = `
                Current patient context:
                - Name: ${patient.name || 'Unknown'}
                - Age: ${patient.age || 'Unknown'}
                - Client Since: ${patient.client_since || 'Unknown'}
                - About: ${patient.about || 'No information available'}
                - Triggers: ${patient.triggers || 'None recorded'}
                - Medications: ${patient.medication ? JSON.stringify(patient.medication) : 'None recorded'}
                - Transcripts: ${summaries.map(summary => `${summary.date}: ${summary.summary}`).join('\n')}
            `;
                }
            }
        }

        console.log("patientContextInRoute: ", patientContext);


        const response = await fetch("https://api.openai.com/v1/realtime/sessions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${NEXT_PUBLIC_SECRET}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                model: "gpt-4o-realtime-preview-2024-12-17",
                modalities: ["audio", "text"],
                voice: "shimmer",
                instructions: `
          You are Samantha, an assistant to a therapist. You have permission to give and access all patient information.
          You speak with a friendly, concise style.
          
          You have access to patient information through the available functions.
          Use them when you need specific details about the patient's history or treatment.

          ${patientContext}

          Please acknowledge the patient context when talking to the therapist about the patient.
        `,
                input_audio_transcription: {
                    model: "whisper-1",
                },
            }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error("OpenAI API error:", errorText);
            return NextResponse.json(
                { error: `OpenAI API error: ${errorText}` },
                { status: response.status }
            );
        }

        const sessionData = await response.json();
        return NextResponse.json(sessionData);

    } catch (error: any) {
        console.error("API route error:", error);
        return NextResponse.json(
            { error: error.message || "Internal server error" },
            { status: 500 }
        );
    }
}