import { useEffect, useState } from 'react';
import { useAppStore } from '@/stores/useAppStore';
import { metersBetween } from '@/lib/utils';
import { TEST_CLINIC } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { MapPin, RefreshCw, AlertTriangle } from 'lucide-react';
import { PageContainer } from '@/components/AppLayout';

interface LocationGuardProps {
  children: React.ReactNode;
  onLocationVerified: () => void;
}

export function LocationGuard({ children, onLocationVerified }: LocationGuardProps) {
  const { location, setLocation } = useAppStore();
  const [checking, setChecking] = useState(false);

  const requestLocation = async () => {
    setChecking(true);
    setLocation({ error: null });
    
    console.log('Requesting location...');

    if (!navigator.geolocation) {
      console.log('Geolocation not supported');
      setLocation({ 
        permission: 'denied', 
        error: 'Geolocation is not supported by this browser' 
      });
      setChecking(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        console.log('Got location:', position.coords);
        console.log('Clinic location:', TEST_CLINIC.lat, TEST_CLINIC.lng);
        console.log('Clinic radius:', TEST_CLINIC.radiusMeters);
        
        const distance = metersBetween(
          position.coords.latitude,
          position.coords.longitude,
          TEST_CLINIC.lat,
          TEST_CLINIC.lng
        );
        
        console.log('Distance to clinic:', distance, 'meters');

        const withinRadius = distance <= TEST_CLINIC.radiusMeters;
        console.log('Within radius?', withinRadius);

        setLocation({
          permission: 'granted',
          position,
          withinRadius,
          error: null,
        });

        if (withinRadius) {
          console.log('Location verified, calling onLocationVerified');
          onLocationVerified();
        } else {
          console.log('Location outside radius');
        }

        setChecking(false);
      },
      (error) => {
        console.log('Location error occurred:', error);
        console.log('Error code:', error.code);
        console.log('Error message:', error.message);
        
        let errorMessage = 'Unable to get location';
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location permission denied';
            console.log('User denied location permission');
            setLocation({ permission: 'denied' });
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information unavailable';
            console.log('Location unavailable');
            break;
          case error.TIMEOUT:
            errorMessage = 'Location request timed out';
            console.log('Location request timeout');
            break;
        }

        setLocation({ error: errorMessage });
        setChecking(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000, // Cache for 1 minute
      }
    );
  };

  useEffect(() => {
    if (location.permission === 'unknown') {
      requestLocation();
    }
  }, []);

  // Show children if location is verified
  if (location.permission === 'granted' && location.withinRadius) {
    return <>{children}</>;
  }

  // Loading state
  if (checking || location.permission === 'unknown') {
    return (
      <PageContainer className="justify-center items-center">
        <div className="text-center space-y-4">
          <div className="animate-spin text-primary">
            <RefreshCw size={48} />
          </div>
          <h1 className="text-xl font-semibold">Verifying Location</h1>
          <p className="text-muted-foreground">
            Checking that you're at the clinic...
          </p>
        </div>
      </PageContainer>
    );
  }

  // Permission denied
  if (location.permission === 'denied') {
    return (
      <PageContainer className="justify-center items-center">
        <div className="text-center space-y-6 max-w-sm">
          <div className="text-warning">
            <MapPin size={64} className="mx-auto" />
          </div>
          
          <div className="space-y-2">
            <h1 className="text-xl font-semibold">Location Required</h1>
            <p className="text-muted-foreground text-sm">
              Allow location to verify you're at the clinic (≤1000km). 
              This ensures the chat is only for on-site companions.
            </p>
          </div>

           <div className="space-y-3">
            <Button 
              variant="calm" 
              size="touch" 
              onClick={requestLocation}
              className="w-full"
            >
              <MapPin size={20} />
              Allow Location
            </Button>
            
            {/* Testing bypass - remove in production */}
            <Button 
              variant="secondary" 
              size="touch" 
              onClick={() => {
                console.log('Bypassing location check for testing');
                setLocation({
                  permission: 'granted',
                  position: null,
                  withinRadius: true,
                  error: null,
                });
                onLocationVerified();
              }}
              className="w-full"
            >
              Skip for Testing
            </Button>
            
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => {
                // Show help modal or instructions
                alert('To use this chat, please enable location permissions in your browser settings and ensure you are within 1000km of the clinic.');
              }}
            >
              Need Help?
            </Button>
          </div>
        </div>
      </PageContainer>
    );
  }

  // Outside radius
  if (location.permission === 'granted' && !location.withinRadius) {
    const distance = location.position ? 
      Math.round(metersBetween(
        location.position.coords.latitude,
        location.position.coords.longitude,
        TEST_CLINIC.lat,
        TEST_CLINIC.lng
      )) : 0;

    return (
      <PageContainer className="justify-center items-center">
        <div className="text-center space-y-6 max-w-sm">
          <div className="text-warning">
            <AlertTriangle size={64} className="mx-auto" />
          </div>
          
          <div className="space-y-2">
            <h1 className="text-xl font-semibold">Not At Clinic</h1>
            <p className="text-muted-foreground text-sm">
              This chat is only available for companions currently at the clinic.
            </p>
          </div>

          <div className="space-y-3">
            <Button 
              variant="calm" 
              size="touch" 
              onClick={requestLocation}
              disabled={checking}
              className="w-full"
            >
              {checking ? (
                <RefreshCw size={20} className="animate-spin" />
              ) : (
                <RefreshCw size={20} />
              )}
              Try Again
            </Button>
            
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => {
                // Show more info
                alert('This feature helps ensure the chat remains a safe space for people in the region. Please check your location settings.');
              }}
            >
              Learn More
            </Button>
          </div>
        </div>
      </PageContainer>
    );
  }

  // Error state
  return (
    <PageContainer className="justify-center items-center">
      <div className="text-center space-y-6 max-w-sm">
        <div className="text-destructive">
          <AlertTriangle size={64} className="mx-auto" />
        </div>
        
        <div className="space-y-2">
          <h1 className="text-xl font-semibold">Location Error</h1>
          <p className="text-muted-foreground text-sm">
            {location.error || 'Unable to verify your location'}
          </p>
        </div>

        <Button 
          variant="calm" 
          size="touch" 
          onClick={requestLocation}
          disabled={checking}
          className="w-full"
        >
          {checking ? (
            <RefreshCw size={20} className="animate-spin" />
          ) : (
            <RefreshCw size={20} />
          )}
          Retry
        </Button>
      </div>
    </PageContainer>
  );
}