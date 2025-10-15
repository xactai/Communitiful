import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PageContainer } from '@/components/AppLayout';
import { ArrowLeft, Users, X } from 'lucide-react';

interface CompanionFormItem {
  name: string;
  relationship: string;
  number: string;
  location: string;
}

interface HospitalCompanionsFormProps {
  onBack: () => void;
  onNext: (companions: CompanionFormItem[]) => void;
}

export function HospitalCompanionsForm({ onBack, onNext }: HospitalCompanionsFormProps) {
  const [companions, setCompanions] = useState<CompanionFormItem[]>([{
    name: '', relationship: '', number: '', location: ''
  }]);
  const [error, setError] = useState('');

  const addCompanion = () =>
    setCompanions((prev) => [...prev, { name: '', relationship: '', number: '', location: '' }]);

  const removeCompanion = (index: number) => {
    setCompanions((prev) => prev.filter((_, i) => i !== index));
  };

  const update = (index: number, field: keyof CompanionFormItem, value: string) => {
    setCompanions((prev) => prev.map((c, i) => (i === index ? { ...c, [field]: value } : c)));
  };

  const handleNext = () => {
    setError('');
    for (const c of companions) {
      if (!c.name.trim()) return setError('Companion name is required');
      const cleaned = c.number.replace(/\D/g, '');
      if (cleaned.length !== 10)
        return setError('Each companion must have a valid 10-digit mobile number');
    }
    onNext(companions);
  };

  return (
    <PageContainer>
      <div className="flex items-center gap-4 mb-8">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft size={20} />
        </Button>
        <h1 className="text-xl font-semibold">Companion Details</h1>
      </div>

      <div className="space-y-6">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-soft rounded-full">
            <Users size={24} className="text-primary" />
          </div>
        </div>

        <div className="space-y-6">
          {companions.map((c, idx) => (
            <div key={idx} className="space-y-3 p-4 border rounded-md relative">
              {companions.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeCompanion(idx)}
                  className="absolute top-2 right-2 text-gray-400 hover:text-red-500 transition"
                >
                  <X size={18} />
                </button>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Input
                  placeholder="Name"
                  value={c.name}
                  onChange={(e) => update(idx, 'name', e.target.value)}
                />
                <Input
                  placeholder="Relationship"
                  value={c.relationship}
                  onChange={(e) => update(idx, 'relationship', e.target.value)}
                />
                <Input
                  placeholder="Mobile Number"
                  value={c.number}
                  onChange={(e) =>
                    update(idx, 'number', e.target.value.replace(/\D/g, ''))
                  }
                />
                <Input
                  placeholder="Location"
                  value={c.location}
                  onChange={(e) => update(idx, 'location', e.target.value)}
                />
              </div>
            </div>
          ))}

          <div className="flex flex-col gap-3">
            <Button variant="outline" onClick={addCompanion}>
              Add Another Companion
            </Button>
            {error && <p className="text-sm text-destructive text-center">{error}</p>}
            <Button className="w-full" onClick={handleNext}>
              Review
            </Button>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}