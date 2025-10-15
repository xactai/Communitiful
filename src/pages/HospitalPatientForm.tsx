import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PageContainer } from '@/components/AppLayout';
import { ArrowLeft, UserRound } from 'lucide-react';

interface HospitalPatientFormProps {
  onBack: () => void;
  onNext: (patient: {
    name: string;
    patient_contact_number: string;
    purpose_of_visit: string | null;
    department: string | null;
    location: string | null;
  }) => void;
}

export function HospitalPatientForm({ onBack, onNext }: HospitalPatientFormProps) {
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [purpose, setPurpose] = useState('');
  const [department, setDepartment] = useState('');
  const [location, setLocation] = useState('');
  const [error, setError] = useState('');

  const handleNext = () => {
    setError('');
    if (!name.trim()) return setError('Patient name is required');
    const cleaned = contact.replace(/\D/g, '');
    if (cleaned.length !== 10) return setError('Valid 10-digit contact required');
    onNext({
      name: name.trim(),
      patient_contact_number: cleaned,
      purpose_of_visit: purpose || null,
      department: department || null,
      location: location || null,
    });
  };

  return (
    <PageContainer>
      <div className="flex items-center gap-4 mb-8">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft size={20} />
        </Button>
        <h1 className="text-xl font-semibold">Patient Details</h1>
      </div>

      <div className="space-y-6">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-soft rounded-full">
            <UserRound size={24} className="text-primary" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Name *</label>
            <Input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Contact Number *</label>
            <Input placeholder="Contact Number" value={contact} onChange={(e) => setContact(e.target.value.replace(/\D/g, ''))} />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Purpose of Visit</label>
            <Input placeholder="Purpose of Visit" value={purpose} onChange={(e) => setPurpose(e.target.value)} />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Department</label>
            <Input placeholder="Department" value={department} onChange={(e) => setDepartment(e.target.value)} />
          </div>
          
          <div className="space-y-2 sm:col-span-2">
            <label className="text-sm font-medium">Location</label>
            <Input placeholder="Location" value={location} onChange={(e) => setLocation(e.target.value)} />
          </div>
        </div>
        
        <div className="space-y-4">
          {error && <p className="text-sm text-destructive text-center">{error}</p>}
          <Button className="w-full" onClick={handleNext}>Next</Button>
        </div>
      </div>
    </PageContainer>
  );
}


