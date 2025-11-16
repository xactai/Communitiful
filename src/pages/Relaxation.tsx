import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { PageContainer } from '@/components/AppLayout';
import { 
  ArrowLeft, 
  Play, 
  Pause, 
  RotateCcw, 
  Heart,
  Brain,
  Gamepad2,
  Sparkles,
  Palette
} from 'lucide-react';

interface RelaxationProps {
  onBack: () => void;
}

export function Relaxation({ onBack }: RelaxationProps) {
  // Game selection
  const [selectedGame, setSelectedGame] = useState<
    'breathing' | 'grounding' | 'memory' | 'gratitude' | 'color'
  >('breathing');

  const gamesMeta: Record<
    'breathing' | 'grounding' | 'memory' | 'gratitude' | 'color',
    { title: string }
  > = {
    breathing: { title: 'Breathing' },
    grounding: { title: 'Grounding' },
    memory: { title: 'Memory' },
    gratitude: { title: 'Gratitude' },
    color: { title: 'Color Focus' },
  };

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

  // Grounding (5-4-3-2-1) interactive
  const [groundingStep, setGroundingStep] = useState(5);
  const [groundingCount, setGroundingCount] = useState(0);
  const advanceGrounding = () => {
    if (groundingCount + 1 >= groundingStep) {
      const next = groundingStep - 1;
      setGroundingStep(next > 0 ? next : 5);
      setGroundingCount(0);
    } else {
      setGroundingCount((c) => c + 1);
    }
  };

  // Memory Match (simple 3 pairs)
  type Card = { id: number; emoji: string; flipped: boolean; matched: boolean };
  const initialDeck: Card[] = (() => {
    const emojis = ['💐', '🌈', '🕊️'];
    const cards = emojis
      .flatMap((e, i) => [
        { id: i * 2, emoji: e, flipped: false, matched: false },
        { id: i * 2 + 1, emoji: e, flipped: false, matched: false },
      ])
      .sort(() => Math.random() - 0.5);
    return cards;
  })();
  const [deck, setDeck] = useState<Card[]>(initialDeck);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [matches, setMatches] = useState(0);

  const resetMemory = () => {
    const shuffled = [...initialDeck].sort(() => Math.random() - 0.5).map(c => ({ ...c, flipped: false, matched: false }));
    setDeck(shuffled);
    setFlippedIndices([]);
    setMatches(0);
  };

  const flipCard = (idx: number) => {
    if (deck[idx].flipped || deck[idx].matched || flippedIndices.length === 2) return;
    const newDeck = deck.map((c, i) => (i === idx ? { ...c, flipped: true } : c));
    const newFlipped = [...flippedIndices, idx];
    setDeck(newDeck);
    setFlippedIndices(newFlipped);
    if (newFlipped.length === 2) {
      const [a, b] = newFlipped;
      const isMatch = newDeck[a].emoji === newDeck[b].emoji;
      setTimeout(() => {
        if (isMatch) {
          setDeck(d =>
            d.map((c, i) =>
              i === a || i === b ? { ...c, matched: true } : c
            )
          );
          setMatches(m => m + 1);
        } else {
          setDeck(d =>
            d.map((c, i) =>
              i === a || i === b ? { ...c, flipped: false } : c
            )
          );
        }
        setFlippedIndices([]);
      }, 600);
    }
  };

  // Gratitude prompts
  const gratitudePrompts = [
    "Name one person you're grateful for today.",
    "Recall a small kindness you noticed recently.",
    "What's one thing in this room that brings comfort?",
    "Think of a strength you've shown this week.",
  ];
  const [gratitudeIndex, setGratitudeIndex] = useState(0);
  const nextGratitude = () =>
    setGratitudeIndex(i => (i + 1) % gratitudePrompts.length);

  // Color focus
  const soothingColors = ['#E0F2FE', '#DCFCE7', '#FCE7F3', '#F3E8FF', '#FEF9C3'];
  const [colorIndex, setColorIndex] = useState(0);
  const cycleColor = () => setColorIndex(i => (i + 1) % soothingColors.length);

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
        {/* Game selector grid (minimal) */}
        <div>
          <h2 className="text-base font-medium mb-3">Choose an activity</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <button
              className={`bg-surface border rounded-lg p-3 text-left hover:bg-primary-soft/30 transition ${
                selectedGame === 'breathing' ? 'ring-2 ring-primary' : ''
              }`}
              onClick={() => setSelectedGame('breathing')}
              aria-label="Choose Breathing"
            >
              <div className="flex items-center gap-2 mb-1">
                <Brain size={16} className="text-primary" />
                <span className="font-medium text-sm">{gamesMeta.breathing.title}</span>
              </div>
            </button>

            <button
              className={`bg-surface border rounded-lg p-3 text-left hover:bg-primary-soft/30 transition ${
                selectedGame === 'grounding' ? 'ring-2 ring-primary' : ''
              }`}
              onClick={() => setSelectedGame('grounding')}
              aria-label="Choose Grounding 5-4-3-2-1"
            >
              <div className="flex items-center gap-2 mb-1">
                <Sparkles size={16} className="text-primary" />
                <span className="font-medium text-sm">{gamesMeta.grounding.title}</span>
              </div>
            </button>

            <button
              className={`bg-surface border rounded-lg p-3 text-left hover:bg-primary-soft/30 transition ${
                selectedGame === 'memory' ? 'ring-2 ring-primary' : ''
              }`}
              onClick={() => setSelectedGame('memory')}
              aria-label="Choose Memory Match"
            >
              <div className="flex items-center gap-2 mb-1">
                <Gamepad2 size={16} className="text-primary" />
                <span className="font-medium text-sm">{gamesMeta.memory.title}</span>
              </div>
            </button>

            <button
              className={`bg-surface border rounded-lg p-3 text-left hover:bg-primary-soft/30 transition ${
                selectedGame === 'gratitude' ? 'ring-2 ring-primary' : ''
              }`}
              onClick={() => setSelectedGame('gratitude')}
              aria-label="Choose Gratitude Prompt"
            >
              <div className="flex items-center gap-2 mb-1">
                <Heart size={16} className="text-primary" />
                <span className="font-medium text-sm">{gamesMeta.gratitude.title}</span>
              </div>
            </button>

            <button
              className={`bg-surface border rounded-lg p-3 text-left hover:bg-primary-soft/30 transition ${
                selectedGame === 'color' ? 'ring-2 ring-primary' : ''
              }`}
              onClick={() => setSelectedGame('color')}
              aria-label="Choose Color Focus"
            >
              <div className="flex items-center gap-2 mb-1">
                <Palette size={16} className="text-primary" />
                <span className="font-medium text-sm">{gamesMeta.color.title}</span>
              </div>
            </button>
          </div>
        </div>

        {/* Breathing Exercise */}
        {selectedGame === 'breathing' && (
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
        )}

        {/* Grounding (interactive counter) */}
        {selectedGame === 'grounding' && (
          <div className="bg-surface border rounded-lg p-6 text-center">
            <h2 className="text-lg font-medium mb-1">Grounding 5-4-3-2-1</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Tap to count. Progress resets after 1.
            </p>
            <div className="flex items-center justify-center gap-6 mb-4">
              <div className="text-center">
                <div className="text-xs text-muted-foreground mb-1">Current target</div>
                <div className="text-2xl font-semibold">{groundingStep}</div>
              </div>
              <div className="text-center">
                <div className="text-xs text-muted-foreground mb-1">Count</div>
                <div className="text-2xl font-semibold">{groundingCount}</div>
              </div>
            </div>
            <Button variant="default" onClick={advanceGrounding}>
              Tap
            </Button>
          </div>
        )}

        {/* Memory Match */}
        {selectedGame === 'memory' && (
          <div className="bg-surface border rounded-lg p-6">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-medium">Memory Match</h2>
              <Button variant="ghost" size="sm" onClick={resetMemory}>Reset</Button>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Find all pairs. Matched: {matches}/3
            </p>
            <div className="grid grid-cols-3 gap-3">
              {deck.map((card, idx) => (
                <button
                  key={card.id}
                  className={`aspect-square rounded-lg border flex items-center justify-center text-2xl transition ${
                    card.matched ? 'bg-success/10 border-success/30' : 'bg-white hover:bg-primary-soft/20'
                  }`}
                  onClick={() => flipCard(idx)}
                >
                  {card.flipped || card.matched ? card.emoji : '❒'}
                </button>
              ))}
            </div>
            {matches === 3 && (
              <div className="mt-4 p-3 bg-success/10 border border-success/20 rounded-lg text-center">
                🎉 Nicely done! All pairs found.
              </div>
            )}
          </div>
        )}

        {/* Gratitude Prompt */}
        {selectedGame === 'gratitude' && (
          <div className="bg-primary-soft/20 border border-primary/10 rounded-lg p-6 text-center">
            <h2 className="text-lg font-medium mb-2">Gratitude Moment</h2>
            <p className="text-sm mb-4">{gratitudePrompts[gratitudeIndex]}</p>
            <Button variant="default" onClick={nextGratitude}>
              New Prompt
            </Button>
          </div>
        )}

        {/* Color Focus */}
        {selectedGame === 'color' && (
          <div className="bg-surface border rounded-lg p-6 text-center">
            <h2 className="text-lg font-medium mb-3">Color Focus</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Gaze softly at the color. Tap to shift hues.
            </p>
            <button
              onClick={cycleColor}
              className="w-full rounded-lg h-28 transition"
              style={{ backgroundColor: soothingColors[colorIndex] }}
              aria-label="Change calming color"
            />
            <div className="text-xs text-muted-foreground mt-2">
              {soothingColors[colorIndex]}
            </div>
          </div>
        )}

        {/* Minimal page: tips and extra lists removed */}

        {/* Back to chat */}
        <Button variant="outline" size="touch" onClick={onBack} className="w-full">
          Return to Chat
        </Button>
      </div>
    </PageContainer>
  );
}