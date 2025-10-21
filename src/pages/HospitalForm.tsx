import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PageContainer } from '@/components/AppLayout';
import { ArrowLeft, UserRound, Users, Heart, Stethoscope, Building2, MapPin, Loader2 } from 'lucide-react';
import { insertPatient, insertCompanions } from '@/lib/supabaseClient';
import { motion } from 'framer-motion';
import { generateRandomPatientData, generateRandomCompanionData, typeText, TypeOptions } from '@/lib/autoFillUtils';

interface HospitalFormProps {
  onBack: () => void;
  onSuccess: () => void;
}

interface CompanionFormItem {
  name: string;
  relationship: string;
  number: string;
  location: string;
}

export function HospitalForm({ onBack, onSuccess }: HospitalFormProps) {
  // Patient fields
  const [patientName, setPatientName] = useState('');
  const [patientContact, setPatientContact] = useState('');
  const [purposeOfVisit, setPurposeOfVisit] = useState('');
  const [department, setDepartment] = useState('');
  const [location, setLocation] = useState('');

  // Companion fields
  const [companions, setCompanions] = useState<CompanionFormItem[]>([{
    name: '', relationship: '', number: '', location: ''
  }]);

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Location fetching state for companions
  const [locationFetchingStates, setLocationFetchingStates] = useState<boolean[]>([]);
  const [locationFetchedStates, setLocationFetchedStates] = useState<boolean[]>([]);
  
  // References to cancel typing animations if needed
  const typeAnimationsRef = useRef<Array<{ cancel: () => void }>>([]);
  
  // Initialize location states when companions change
  useEffect(() => {
    setLocationFetchingStates(new Array(companions.length).fill(false));
    setLocationFetchedStates(new Array(companions.length).fill(false));
  }, [companions.length]);
  
  // Auto-fill the form when the component mounts
  useEffect(() => {
    // Generate random data
    const patientData = generateRandomPatientData();
    const companionData = generateRandomCompanionData();
    
    // Clear any existing animations
    typeAnimationsRef.current.forEach(animation => animation.cancel());
    typeAnimationsRef.current = [];
    
    // Auto-fill patient name with typing animation
    const nameAnimation = typeText({
      text: patientData.name,
      onUpdate: setPatientName,
      speed: 70,
      initialDelay: 500
    });
    typeAnimationsRef.current.push(nameAnimation);
    
    // Auto-fill patient contact with typing animation
    const contactAnimation = typeText({
      text: patientData.contactNumber,
      onUpdate: setPatientContact,
      speed: 70,
      initialDelay: 1200
    });
    typeAnimationsRef.current.push(contactAnimation);
    
    // Auto-fill purpose of visit after a delay
    setTimeout(() => {
      setPurposeOfVisit(patientData.purposeOfVisit);
    }, 2000);
    
    // Auto-fill department after a delay
    setTimeout(() => {
      setDepartment(patientData.department);
    }, 2500);
    
    // Auto-fill location with typing animation
    const locationAnimation = typeText({
      text: patientData.location,
      onUpdate: setLocation,
      speed: 70,
      initialDelay: 3000
    });
    typeAnimationsRef.current.push(locationAnimation);
    
    // Auto-fill companion data with typing animation
    const companionNameAnimation = typeText({
      text: companionData.name,
      onUpdate: (text) => {
        setCompanions(prev => [{
          ...prev[0],
          name: text
        }, ...prev.slice(1)]);
      },
      speed: 70,
      initialDelay: 4000
    });
    typeAnimationsRef.current.push(companionNameAnimation);
    
    // Auto-fill companion relationship after a delay
    setTimeout(() => {
      setCompanions(prev => [{
        ...prev[0],
        relationship: companionData.relationship
      }, ...prev.slice(1)]);
    }, 5000);
    
    // Auto-fill companion number with typing animation
    const companionNumberAnimation = typeText({
      text: companionData.number,
      onUpdate: (text) => {
        setCompanions(prev => [{
          ...prev[0],
          number: text
        }, ...prev.slice(1)]);
      },
      speed: 70,
      initialDelay: 5500
    });
    typeAnimationsRef.current.push(companionNumberAnimation);
    
    // Auto-fill companion location with typing animation
    const companionLocationAnimation = typeText({
      text: companionData.location,
      onUpdate: (text) => {
        setCompanions(prev => [{
          ...prev[0],
          location: text
        }, ...prev.slice(1)]);
      },
      speed: 70,
      initialDelay: 6500
    });
    typeAnimationsRef.current.push(companionLocationAnimation);
    
    // Cleanup function to cancel any ongoing animations when component unmounts
    return () => {
      typeAnimationsRef.current.forEach(animation => animation.cancel());
    };
  }, []);

  const addCompanion = () => setCompanions((prev) => [...prev, { name: '', relationship: '', number: '', location: '' }]);
  const updateCompanion = (index: number, field: keyof CompanionFormItem, value: string) => {
    setCompanions((prev) => prev.map((c, i) => i === index ? { ...c, [field]: value } : c));
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
    updateCompanion(index, 'location', 'Greenwich, Apollo Hospital');

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

  const handleSubmit = async () => {
    setError('');

    // Validate patient fields
    if (!patientName.trim()) return setError('Patient name is required');
    const cleanedContact = patientContact.replace(/\D/g, '');
    if (cleanedContact.length !== 10) return setError('Valid 10-digit patient contact required');

    // Validate companions
    for (const c of companions) {
      if (!c.name.trim()) return setError('All companion names are required');
      const cleaned = c.number.replace(/\D/g, '');
      if (cleaned.length !== 10) return setError('All companions must have valid 10-digit mobile numbers');
    }

    setLoading(true);

    // Insert patient
    const { data: patientRow, error: patientErr } = await insertPatient({
      name: patientName.trim(),
      patient_contact_number: cleanedContact,
      purpose_of_visit: purposeOfVisit || null,
      department: department || null,
      location: location || null,
    });

    if (patientErr || !patientRow) {
      setLoading(false);
      setError(patientErr?.message || 'Failed to create patient.');
      return;
    }

    const patient_id = patientRow.patient_id as string;

    // Insert companions
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
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30 py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-10">
        
        {/* Header */}
        <div className="flex items-center justify-between bg-white/80 p-4 rounded-xl shadow-md">
          <Button variant="outline" size="icon" className="border-primary/30 hover:bg-primary/5" onClick={onBack} asChild>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <ArrowLeft size={22} className="text-primary" />
            </motion.div>
          </Button>
          <div className="flex items-center gap-4">
            <img 
              src="/images/Apollo Logo.png" 
              alt="Apollo Hospital Logo" 
              width={60} 
              height={60} 
              className="object-contain rounded-lg shadow-md"
            />
            <h1 className="text-2xl font-bold text-primary">Hospital Registration</h1>
          </div>
          <div className="w-10" /> {/* Spacer for centering */}
        </div>

      <motion.div 
        className="space-y-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >

        {/* Patient Details Section */}
        <motion.div 
          className="space-y-6 p-8 border-2 border-primary/20 rounded-xl bg-white/90 shadow-md"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center justify-between border-b border-primary/20 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center shadow-md">
                <Stethoscope size={20} className="text-primary" />
              </div>
              <h2 className="text-xl font-semibold text-primary/90">Patient Details</h2>
            </div>
            <div className="bg-primary/10 px-3 py-1 rounded-full text-sm text-primary font-medium">
              Required
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 mt-4">
            <div className="space-y-3">
              <Label htmlFor="patient-name" className="flex items-center gap-2 text-base font-medium">
                <UserRound size={16} className="text-primary" />
                Patient Name *
              </Label>
              <Input
                id="patient-name"
                placeholder="Enter patient name"
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                className="focus:ring-2 focus:ring-primary/20 py-6 text-base shadow-sm border-primary/20 hover:border-primary/50 transition-colors"
              />
              {!patientName && <p className="text-xs text-muted-foreground">Full name as per ID proof</p>}
            </div>

            <div className="space-y-3">
              <Label htmlFor="purpose" className="flex items-center gap-2 text-base font-medium">
                <Building2 size={16} className="text-primary" />
                Purpose of Visit
              </Label>
              <Select value={purposeOfVisit} onValueChange={setPurposeOfVisit}>
                <SelectTrigger className="focus:ring-2 focus:ring-primary/20 py-6 text-base shadow-sm border-primary/20">
                  <SelectValue placeholder="Select purpose" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="consultation">Consultation</SelectItem>
                  <SelectItem value="surgery">Surgery</SelectItem>
                  <SelectItem value="emergency">Emergency</SelectItem>
                  <SelectItem value="follow-up">Follow-up</SelectItem>
                  <SelectItem value="diagnosis">Diagnosis</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            </div>

        </motion.div>

        {/* Companions Section */}
        <motion.div 
          className="space-y-6 p-8 border-2 border-primary/20 rounded-xl bg-white/90 shadow-md"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex items-center justify-between border-b border-primary/20 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center shadow-md">
                <Users size={20} className="text-primary" />
              </div>
              <h2 className="text-xl font-semibold text-primary/90">Companions</h2>
            </div>
            <div className="bg-primary/10 px-3 py-1 rounded-full text-sm text-primary font-medium">
              Optional
            </div>
          </div>

          <div className="space-y-6">
            {companions.map((c, idx) => (
              <motion.div 
                key={idx} 
                className="space-y-4 p-4 border rounded-md bg-gray-50 shadow-sm"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * idx + 0.5 }}
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-medium flex items-center gap-2">
                    <Heart size={14} className="text-primary" />
                    Companion {idx + 1}
                  </h3>
                  {companions.length > 1 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCompanions((prev) => prev.filter((_, i) => i !== idx))}
                      className="hover:bg-destructive/10 transition-colors"
                      asChild
                    >
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        Remove
                      </motion.div>
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label htmlFor={`companion-name-${idx}`} className="flex items-center gap-2 text-base font-medium">
                      <UserRound size={16} className="text-primary" />
                      Name *
                    </Label>
                    <Input
                      id={`companion-name-${idx}`}
                      placeholder="Enter companion name"
                      value={c.name}
                      onChange={(e) => updateCompanion(idx, 'name', e.target.value)}
                      className="focus:ring-2 focus:ring-primary/20 py-6 text-base shadow-sm border-primary/20 hover:border-primary/50 transition-colors"
                    />
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor={`companion-relationship-${idx}`} className="flex items-center gap-2 text-base font-medium">
                      <Heart size={16} className="text-primary" />
                      Relationship
                    </Label>
                    <Select value={c.relationship} onValueChange={(value) => updateCompanion(idx, 'relationship', value)}>
                      <SelectTrigger className="focus:ring-2 focus:ring-primary/20 py-6 text-base shadow-sm border-primary/20 hover:border-primary/50 transition-colors">
                        <SelectValue placeholder="Select relationship" />
                      </SelectTrigger>
                      <SelectContent className="text-base">
                        <SelectItem value="spouse">Spouse</SelectItem>
                        <SelectItem value="parent">Parent</SelectItem>
                        <SelectItem value="child">Child</SelectItem>
                        <SelectItem value="sibling">Sibling</SelectItem>
                        <SelectItem value="friend">Friend</SelectItem>
                        <SelectItem value="relative">Relative</SelectItem>
                        <SelectItem value="caregiver">Caregiver</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`companion-number-${idx}`} className="flex items-center gap-1">
                      <Heart size={12} className="text-primary" />
                      Mobile Number *
                    </Label>
                    <Input
                      id={`companion-number-${idx}`}
                      type="tel"
                      placeholder="9876543210"
                      value={c.number}
                      onChange={(e) => updateCompanion(idx, 'number', e.target.value.replace(/\D/g, ''))}
                      className="focus:ring-2 focus:ring-primary/20"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`companion-location-${idx}`} className="flex items-center gap-1">
                      <Building2 size={12} className="text-primary" />
                      Location
                    </Label>
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
              </motion.div>
            ))}

            <Button 
              variant="outline" 
              onClick={addCompanion} 
              className="w-full hover:bg-primary/5 transition-colors"
              asChild
            >
              <motion.div 
                whileHover={{ scale: 1.02 }} 
                whileTap={{ scale: 0.98 }}
                className="flex items-center justify-center gap-2"
              >
                <Users size={16} className="text-primary" />
                Add Another Companion
              </motion.div>
            </Button>
          </div>
        </motion.div>

        {/* Submit Button */}
        <motion.div 
          className="space-y-4 mt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          {error && (
            <motion.p 
              className="text-base text-destructive text-center p-3 bg-destructive/10 rounded-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              {error}
            </motion.p>
          )}
          <Button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full shadow-lg hover:shadow-xl transition-all bg-primary hover:bg-primary/90 py-7 relative overflow-hidden group"
            size="lg"
            asChild
          >
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center justify-center gap-3"
            >
              {loading ? 'Submitting...' : (
                <>
                  <Heart size={22} className="text-white animate-pulse" />
                  <span className="text-lg font-bold">Submit Registration</span>
                  <div className="absolute inset-0 w-full h-full bg-white/20 transform -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                </>
              )}
            </motion.div>
          </Button>
        </motion.div>
      </motion.div>
    </div>
  </div>
  );
}
