import { createClient } from '@supabase/supabase-js';

// Supabase configuration (prefer env, fallback to hardcoded)
const rawUrl = (import.meta as any)?.env?.VITE_SUPABASE_URL || 'https://uvnivlzzcfqotlnijrvv.supabase.co';
const supabaseUrl = String(rawUrl).trim().replace(/^@+/, '');
const supabaseKey = (import.meta as any)?.env?.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV2bml2bHp6Y2Zxb3RsbmlqcnZ2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk3NDQ3NzksImV4cCI6MjA3NTMyMDc3OX0.7dCcYWwySkqaSgJjsNLrsGD5ZD6l5hzW1CN4nlAMIJY';

export const supabase = createClient(supabaseUrl, supabaseKey);

// Database helper functions
export async function findCompanionByMobile(mobileNumber: string) {
  return supabase
    .from('companions')
    .select('*')
    .eq('number', mobileNumber)
    .maybeSingle();
}

export interface InsertPatientInput {
  name: string;
  patient_contact_number: string;
  purpose_of_visit: string | null;
  department: string | null;
  location: string | null;
}

export async function insertPatient(input: InsertPatientInput) {
  // Generate UUID client-side to avoid dependency on DB uuid extension
  const patient_id = crypto.randomUUID();
  const { data, error } = await supabase
    .from('patients')
    .insert({
      patient_id,
      name: input.name,
      patient_contact_number: input.patient_contact_number,
      purpose_of_visit: input.purpose_of_visit,
      department: input.department,
      location: input.location,
    })
    .select('patient_id')
    .single();
  return { data, error };
}

export interface InsertCompanionInput {
  patient_id: string;
  name: string;
  relationship: string;
  number: string;
  location: string | null;
}

export async function insertCompanions(companions: InsertCompanionInput[]) {
  return supabase.from('companions').insert(companions);
}


