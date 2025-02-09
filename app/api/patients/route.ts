import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    console.log('API: Starting patients fetch...');
    
    const { data: patients, error } = await db
      .from('patients')
      .select('id, name')
      .order('name');
    
    console.log('API: Supabase response:', { patients, error });
    
    if (error) throw error;
    
    const formattedPatients = patients.map(patient => ({
      value: patient.id,
      label: patient.name || 'Unknown'
    }));
    
    console.log('API: Formatted response:', formattedPatients);
    
    return NextResponse.json(formattedPatients);
  } catch (error) {
    console.error('API: Error fetching patients:', error);
    return NextResponse.json({ error: 'Failed to fetch patients' }, { status: 500 });
  }
} 