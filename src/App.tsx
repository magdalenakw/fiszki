import { useState } from 'react';
import type { FlashcardSet, Direction, StudyMode as Mode } from './types';
import { sets } from './data/sets';
import Library from './components/Library';
import StudyMode from './components/StudyMode';
import Results from './components/Results';
import { useTheme } from './hooks/useTheme';

type Screen = 'library' | 'study' | 'results';

interface Session {
  set: FlashcardSet;
  mode: Mode;
}

interface SessionResult {
  set: FlashcardSet;
  mode: Mode;
  known: number;
  total: number;
}

export default function App() {
  const { theme, toggleTheme } = useTheme();
  const [screen, setScreen] = useState<Screen>('library');
  const [direction, setDirection] = useState<Direction>('pl->fr');
  const [session, setSession] = useState<Session | null>(null);
  const [result, setResult] = useState<SessionResult | null>(null);

  function handleStartStudy(set: FlashcardSet, mode: Mode, dir: Direction) {
    setDirection(dir);
    setSession({ set, mode });
    setScreen('study');
  }

  function handleComplete(known: number, total: number) {
    if (!session) return;
    setResult({ set: session.set, mode: session.mode, known, total });
    setScreen('results');
  }

  function handleRetry() {
    if (!result) return;
    setSession({ set: result.set, mode: result.mode });
    setScreen('study');
  }

  function handleBack() {
    setSession(null);
    setResult(null);
    setScreen('library');
  }

  return (
    <>
      {screen === 'library' && (
        <Library sets={sets} onStartStudy={handleStartStudy} theme={theme} onToggleTheme={toggleTheme} />
      )}
      {screen === 'study' && session && (
        <StudyMode
          set={session.set}
          mode={session.mode}
          direction={direction}
          onDirectionChange={setDirection}
          onComplete={handleComplete}
          onBack={handleBack}
        />
      )}
      {screen === 'results' && result && (
        <Results
          known={result.known}
          total={result.total}
          set={result.set}
          onRetry={handleRetry}
          onBack={handleBack}
        />
      )}
    </>
  );
}
