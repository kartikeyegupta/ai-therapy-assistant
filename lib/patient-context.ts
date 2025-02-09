import { createClient } from '@supabase/supabase-js';

// Create Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export interface PatientContext {
  id: number;
  name: string;
  visitDates: string[];
  lastSessionSummary?: string;
  clientSince?: string;
  triggers?: string[];
  notes?: string;
}

export async function getPatientContext(patientId: number): Promise<PatientContext | null> {
  try {
    // Get basic patient info
    const { data: patient, error: patientError } = await supabase
      .from('patients')
      .select('*')
      .eq('id', patientId)
      .single();

    if (patientError) throw patientError;
    if (!patient) return null;

    // Get all visit dates
    const { data: visits, error: visitsError } = await supabase
      .from('transcripts')
      .select('date')
      .eq('patient_id', patientId)
      .order('date', { ascending: false });

    if (visitsError) throw visitsError;

    // Get last session summary
    const { data: lastSession, error: lastSessionError } = await supabase
      .from('transcripts')
      .select('summary, date')
      .eq('patient_id', patientId)
      .order('date', { ascending: false })
      .limit(1)
      .single();

    if (lastSessionError && lastSessionError.code !== 'PGRST116') { // Ignore "no rows returned" error
      throw lastSessionError;
    }

    return {
      id: patient.id,
      name: patient.name,
      visitDates: visits?.map(v => v.date) || [],
      lastSessionSummary: lastSession?.summary,
      clientSince: patient.joined_date,
      triggers: patient.triggers || [],
    };
  } catch (error) {
    console.error('Error fetching patient context:', error);
    return null;
  }
} 