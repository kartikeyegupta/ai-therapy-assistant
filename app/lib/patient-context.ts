import { db } from '@/lib/db';

export async function getPatientContext(patientId: number): Promise<any | null> {
  try {
    // Get basic patient info
    const { data: patient, error: patientError } = await db
      .from('patients')
      .select('*')
      .eq('id', patientId)
      .single();

    if (patientError) throw patientError;
    if (!patient) return null;

    // Get all visit dates
    const { data: visits, error: visitsError } = await db
      .from('transcripts')
      .select('date')
      .eq('patient_id', patientId)
      .order('date', { ascending: false });

    if (visitsError) throw visitsError;

    // Get last session summary
    const { data: lastSession, error: lastSessionError } = await db
      .from('transcripts')
      .select('summary, date')
      .eq('patient_id', patientId)
      .order('date', { ascending: false })
      .limit(1)
      .single();

    if (lastSessionError) throw lastSessionError;

    return {
      id: patient.id,
      name: patient.name,
      visitDates: visits.map(v => v.date),
      lastSessionSummary: lastSession?.summary,
      clientSince: patient.client_since,
      triggers: patient.triggers || [],
    };
  } catch (error) {
    console.error('Error fetching patient context:', error);
    return null;
  }
} 