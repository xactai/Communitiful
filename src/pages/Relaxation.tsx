import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { PageContainer } from '@/components/AppLayout';
import { ArrowLeft, Play, Pause, RotateCcw, Heart } from 'lucide-react';

interface RelaxationProps {
  onBack: () => void;
}

export function Relaxation({ onBack }: RelaxationProps) {
  const [breathingActive, setBreathingActive] = useState(false);
  const [breathingPhase, setBreathingPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [breathingTimer, setBreathingTimer] = useState(0);
  const [totalTime, setTotalTime] = useState(0);

  // Breathing pattern: 4 seconds inhale, 4 seconds hold, 4 seconds exhale
  const breathingCycle = {
    inhale: 4,
    hold: 4,
    exhale: 4,
  };

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (breathingActive) {
      interval = setInterval(() => {
        setBreathingTimer((prev) => {
          const newTime = prev + 0.1;
          const currentPhaseTime = breathingCycle[breathingPhase];

          if (newTime >= currentPhaseTime) {
            // Move to next phase
            switch (breathingPhase) {
              case 'inhale':
                setBreathingPhase('hold');
                break;
              case 'hold':
                setBreathingPhase('exhale');
                break;
              case 'exhale':
                setBreathingPhase('inhale');
                break;
            }
            return 0;
          }

          return newTime;
        });

        setTotalTime((prev) => prev + 0.1);
      }, 100);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [breathingActive, breathingPhase]);

  const startBreathing = () => {
    setBreathingActive(true);
    setBreathingPhase('inhale');
    setBreathingTimer(0);
  };

  const stopBreathing = () => {
    setBreathingActive(false);
  };

  const resetBreathing = () => {
    setBreathingActive(false);
    setBreathingPhase('inhale');
    setBreathingTimer(0);
    setTotalTime(0);
  };

  // Calculate progress percentage
  const getProgress = () => {
    return (breathingTimer / breathingCycle[breathingPhase]) * 100;
  };

  // Get instruction text
  const getInstruction = () => {
    switch (breathingPhase) {
      case 'inhale':
        return 'Breathe in slowly...';
      case 'hold':
        return 'Hold your breath...';
      case 'exhale':
        return 'Breathe out gently...';
    }
  };

  // Format time
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const groundingTips = [
    "Name 5 things you can see around you",
    "Take 3 slow, deep breaths",
    "Notice the temperature of the air on your skin",
    "Listen for 3 different sounds",
    "Feel your feet on the ground",
  ];

  const calmingPrompts = [
    "This waiting time is temporary",
    "You are exactly where you need to be right now",
    "Your presence here shows how much you care",
    "Many others have waited here and gotten through this",
    "Each moment brings you closer to answers",
  ];

  return (
    <PageContainer>
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft size={20} />
        </Button>
        <h1 className="text-xl font-semibold">Relaxation Corner</h1>
      </div>

      <div className="space-y-6">
        {/* Breathing Exercise */}
        <div className="bg-primary-soft/30 rounded-lg p-6 text-center">
          <h2 className="text-lg font-medium mb-4">Breathing Exercise</h2>
          
          {/* Breathing Circle */}
          <div className="relative w-24 h-24 sm:w-32 sm:h-32 mx-auto mb-6">
            <div className="absolute inset-0 rounded-full border-4 border-primary/20"></div>
            <div 
              className="absolute inset-0 rounded-full border-4 border-primary transition-all duration-100"
              style={{
                transform: `scale(${0.5 + (getProgress() / 100) * 0.5})`,
                borderWidth: '4px',
                clipPath: `polygon(0 0, ${getProgress()}% 0, ${getProgress()}% 100%, 0 100%)`
              }}
            ></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-xl sm:text-2xl mb-1">💙</div>
                <div className="text-xs text-muted-foreground">
                  {Math.ceil(breathingCycle[breathingPhase] - breathingTimer)}
                </div>
              </div>
            </div>
          </div>

          {/* Instructions */}
          <div className="space-y-2 mb-4">
            <p className="font-medium">{getInstruction()}</p>
            <p className="text-sm text-muted-foreground capitalize">
              {breathingPhase} phase
            </p>
          </div>

          {/* Controls */}
          <div className="flex flex-col sm:flex-row justify-center gap-2 mb-4">
            {!breathingActive ? (
              <Button variant="default" size="lg" onClick={startBreathing} className="w-full sm:w-auto">
                <Play size={16} />
                Start
              </Button>
            ) : (
              <Button variant="secondary" size="lg" onClick={stopBreathing} className="w-full sm:w-auto">
                <Pause size={16} />
                Pause
              </Button>
            )}
            
            <Button variant="ghost" size="lg" onClick={resetBreathing} className="w-full sm:w-auto">
              <RotateCcw size={16} />
              Reset
            </Button>
          </div>

          {/* Timer */}
          {totalTime > 0 && (
            <p className="text-sm text-muted-foreground">
              Total time: {formatTime(totalTime)}
            </p>
          )}

          {/* Completion celebration */}
          {totalTime >= 60 && !breathingActive && (
            <div className="mt-4 p-3 bg-success/10 border border-success/20 rounded-lg">
              <div className="text-success mb-1">🎉</div>
              <p className="text-sm text-success-foreground">
                Great job! You've completed a full minute of breathing.
              </p>
            </div>
          )}
        </div>

        {/* Grounding Tips */}
        <div className="space-y-3">
          <h3 className="font-medium">Grounding Techniques</h3>
          <div className="grid gap-2">
            {groundingTips.map((tip, index) => (
              <div key={index} className="bg-surface border rounded-lg p-3 text-sm">
                {tip}
              </div>
            ))}
          </div>
        </div>

        {/* Calming Prompts */}
        <div className="space-y-3">
          <h3 className="font-medium">Gentle Reminders</h3>
          <div className="grid gap-2">
            {calmingPrompts.map((prompt, index) => (
              <div key={index} className="bg-primary-soft/20 border border-primary/10 rounded-lg p-3 text-sm text-center">
                <Heart size={14} className="inline mr-2 text-primary" />
                {prompt}
              </div>
            ))}
          </div>
        </div>

        {/* Back to chat */}
        <Button variant="outline" size="touch" onClick={onBack} className="w-full">
          Return to Chat
        </Button>
      </div>
    </PageContainer>
  );
}