import { useState } from 'react';
import type { FlashcardSet, Direction, StudyMode as Mode } from '../types';
import { getUnlearned, setUnlearned } from '../utils/progress';
import FlashCard from './FlashCard';

interface StudyModeProps {
  set: FlashcardSet;
  mode: Mode;
  direction: Direction;
  onDirectionChange: (d: Direction) => void;
  onComplete: (known: number, total: number) => void;
  onBack: () => void;
}

export default function StudyMode({
  set,
  mode,
  direction,
  onDirectionChange,
  onComplete,
  onBack,
}: StudyModeProps) {
  const [sessionCards] = useState(() => {
    if (mode === 'unlearned') {
      const ids = getUnlearned(set.name);
      if (ids.length > 0) return set.cards.filter((c) => ids.includes(c.id));
      setUnlearned(set.name, set.cards.map((c) => c.id));
    }
    return [...set.cards];
  });

  const [index, setIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [knownCount, setKnownCount] = useState(0);

  const current = sessionCards[index];
  const front = direction === 'pl->fr' ? current.pl : current.fr;
  const back = direction === 'pl->fr' ? current.fr : current.pl;

  function advance(wasKnown: boolean) {
    const newKnown = knownCount + (wasKnown ? 1 : 0);
    const nextIndex = index + 1;

    if (nextIndex >= sessionCards.length) {
      onComplete(newKnown, sessionCards.length);
      return;
    }

    if (wasKnown) setKnownCount(newKnown);
    setIndex(nextIndex);
    setIsFlipped(false);
  }

  function handleKnown() {
    const ids = getUnlearned(set.name);
    setUnlearned(set.name, ids.filter((id) => id !== current.id));
    advance(true);
  }

  function handleUnknown() {
    const ids = getUnlearned(set.name);
    if (!ids.includes(current.id)) setUnlearned(set.name, [...ids, current.id]);
    advance(false);
  }

  const progress = ((index) / sessionCards.length) * 100;

  return (
    <div className="screen study-screen">
      <div className="study-header glass">
        <button className="btn-ghost back-btn" onClick={onBack}>
          ← biblioteka
        </button>
        <span className="study-set-name">{set.name}</span>
        <div className="direction-toggle">
          <button
            className={`dir-btn${direction === 'pl->fr' ? ' active' : ''}`}
            onClick={() => onDirectionChange('pl->fr')}
          >
            PL→FR
          </button>
          <button
            className={`dir-btn${direction === 'fr->pl' ? ' active' : ''}`}
            onClick={() => onDirectionChange('fr->pl')}
          >
            FR→PL
          </button>
        </div>
      </div>

      <div className="study-progress-bar">
        <div className="study-progress-fill" style={{ width: `${progress}%` }} />
      </div>

      <div className="study-counter">
        {index + 1} / {sessionCards.length}
      </div>

      <FlashCard
        front={front}
        back={back}
        isFlipped={isFlipped}
        onFlip={() => setIsFlipped(true)}
      />

      {isFlipped ? (
        <div className="study-actions">
          <button className="btn btn-bad" onClick={handleUnknown}>
            ✗ Nie znam
          </button>
          <button className="btn btn-good" onClick={handleKnown}>
            ✓ Znam
          </button>
        </div>
      ) : (
        <button className="btn btn-reveal" onClick={() => setIsFlipped(true)}>
          Odkryj odpowiedź
        </button>
      )}
    </div>
  );
}
