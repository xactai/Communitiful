import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PageContainer } from '@/components/AppLayout';
import { ArrowLeft, Users, X, MapPin, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

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
  
  // Location fetching state for companions
  const [locationFetchingStates, setLocationFetchingStates] = useState<boolean[]>([]);
  const [locationFetchedStates, setLocationFetchedStates] = useState<boolean[]>([]);

  // Initialize location states when companions change
  useEffect(() => {
    setLocationFetchingStates(new Array(companions.length).fill(false));
    setLocationFetchedStates(new Array(companions.length).fill(false));
  }, [companions.length]);

  const addCompanion = () =>
    setCompanions((prev) => [...prev, { name: '', relationship: '', number: '', location: '' }]);

  const removeCompanion = (index: number) => {
    setCompanions((prev) => prev.filter((_, i) => i !== index));
  };

  const update = (index: number, field: keyof CompanionFormItem, value: string) => {
    setCompanions((prev) => prev.map((c, i) => (i === index ? { ...c, [field]: value } : c)));
  };

  const fetchLocation = async (index: number) => {
    // Set fetching state
    setLocationFetchingStates(prev => {
      const newStates = [...prev];
      newStates[index] = true;
      return newStates;
    });

    // Simulate location fetching for 2-3 seconds
    await new Promise(resolve => setTimeout(resolve, 2500));

    // Update companion location
    update(index, 'location', 'Greenwich, Apollo Hospital');

    // Set fetched state
    setLocationFetchedStates(prev => {
      const newStates = [...prev];
      newStates[index] = true;
      return newStates;
    });

    // Clear fetching state
    setLocationFetchingStates(prev => {
      const newStates = [...prev];
      newStates[index] = false;
      return newStates;
    });
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
                <div className="space-y-3">
                  <Button
                    type="button"
                    variant={locationFetchedStates[idx] ? "secondary" : "outline"}
                    onClick={() => fetchLocation(idx)}
                    disabled={locationFetchingStates[idx] || locationFetchedStates[idx]}
                    className="w-full flex items-center justify-center gap-2"
                    asChild
                  >
                    <motion.div
                      whileHover={!locationFetchingStates[idx] && !locationFetchedStates[idx] ? { scale: 1.02 } : {}}
                      whileTap={!locationFetchingStates[idx] && !locationFetchedStates[idx] ? { scale: 0.98 } : {}}
                    >
                      {locationFetchingStates[idx] ? (
                        <>
                          <Loader2 size={16} className="animate-spin" />
                          Fetching Location...
                        </>
                      ) : locationFetchedStates[idx] ? (
                        <>
                          <MapPin size={16} className="text-green-600" />
                          Location Fetched
                        </>
                      ) : (
                        <>
                          <MapPin size={16} />
                          Fetch Location
                        </>
                      )}
                    </motion.div>
                  </Button>
                  
                  {locationFetchedStates[idx] && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, ease: "easeOut" }}
                      className="text-sm text-center p-3 bg-green-50 border border-green-200 rounded-md"
                    >
                      <div className="flex items-center justify-center gap-2 text-green-700">
                        <MapPin size={14} />
                        <span className="font-medium">You're at Greenwich, Apollo Hospital. Submit the registration to experience the chat room.</span>
                      </div>
                    </motion.div>
                  )}
                </div>
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