import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { PageContainer } from '@/components/AppLayout';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import { insertCompanions, insertPatient } from '@/lib/supabaseClient';

interface PatientData {
  name: string;
  patient_contact_number: string;
  purpose_of_visit: string | null;
  department: string | null;
  location: string | null;
}

interface CompanionFormItem {
  name: string;
  relationship: string;
  number: string;
  location: string;
}

interface HospitalReviewSubmitProps {
  onBack: () => void;
  patient: PatientData;
  companions: CompanionFormItem[];
  onSuccess: () => void;
}

export function HospitalReviewSubmit({ onBack, patient, companions, onSuccess }: HospitalReviewSubmitProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    setError('');
    setLoading(true);
    const { data: patientRow, error: patientErr } = await insertPatient(patient);
    if (patientErr || !patientRow) {
      setLoading(false);
      setError(patientErr?.message || 'Failed to create patient.');
      return;
    }
    const patient_id = patientRow.patient_id as string;
    const companionRows = companions.map((c) => ({
      patient_id,
      name: c.name,
      relationship: c.relationship,
      number: c.number.replace(/\D/g, ''),
      location: c.location || null,
    }));
    const { error: compErr } = await insertCompanions(companionRows);
    setLoading(false);
    if (compErr) {
      setError(compErr.message || 'Failed to create companions.');
      return;
    }
    onSuccess();
  };

  return (
    <PageContainer>
      <div className="flex items-center gap-4 mb-8">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft size={20} />
        </Button>
        <h1 className="text-xl font-semibold">Review & Submit</h1>
      </div>

      <div className="space-y-6">
        <div className="space-y-4 p-4 border rounded-lg bg-white/80">
          <h2 className="font-medium text-lg">Patient Details</h2>
          <div className="space-y-2 text-sm">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div>
                <span className="font-medium">Name:</span> {patient.name}
              </div>
              <div>
                <span className="font-medium">Contact:</span> {patient.patient_contact_number}
              </div>
              <div>
                <span className="font-medium">Purpose:</span> {patient.purpose_of_visit || 'N/A'}
              </div>
              <div>
                <span className="font-medium">Department:</span> {patient.department || 'N/A'}
              </div>
              <div className="sm:col-span-2">
                <span className="font-medium">Location:</span> {patient.location || 'N/A'}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4 p-4 border rounded-lg bg-white/80">
          <h2 className="font-medium text-lg">Companion Details</h2>
          <div className="space-y-3">
            {companions.map((c, i) => (
              <div key={i} className="p-3 border rounded-md bg-gray-50">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="font-medium">Name:</span> {c.name}
                  </div>
                  <div>
                    <span className="font-medium">Relationship:</span> {c.relationship}
                  </div>
                  <div>
                    <span className="font-medium">Mobile:</span> {c.number}
                  </div>
                  <div>
                    <span className="font-medium">Location:</span> {c.location || 'N/A'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          {error && <p className="text-sm text-destructive text-center">{error}</p>}
          <Button className="w-full" size="lg" onClick={handleSubmit} disabled={loading}>
            {loading ? 'Submitting...' : 'Submit Registration'}
          </Button>
        </div>
      </div>
    </PageContainer>
  );
}


