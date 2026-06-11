import { useState } from 'react';
import type { FlashcardSet, Direction, StudyMode as Mode } from '../types';
import type { Theme } from '../hooks/useTheme';
import { getUnlearned, clearAllProgress } from '../utils/progress';

interface LibraryProps {
  sets: FlashcardSet[];
  onStartStudy: (set: FlashcardSet, mode: Mode, direction: Direction) => void;
  theme: Theme;
  onToggleTheme: () => void;
}

export default function Library({ sets, onStartStudy, onToggleTheme }: LibraryProps) {
  const [selected, setSelected] = useState<FlashcardSet | null>(null);
  const [direction, setDirection] = useState<Direction>('pl->fr');
  const [, forceUpdate] = useState(0);

  function handleClearMemory() {
    clearAllProgress(sets.map((s) => s.name));
    forceUpdate((n) => n + 1);
  }

  function unlearnedCount(set: FlashcardSet): number {
    const ids = getUnlearned(set.name);
    return ids.length > 0 ? ids.length : set.cards.length;
  }

  return (
    <div className="screen library-screen">
      <header className="library-header">
        <h1 className="library-title">fiszki</h1>
        <div className="library-header-actions">
          <button className="theme-toggle" onClick={onToggleTheme} title="zmień motyw" />
          <button className="btn btn-clear" onClick={handleClearMemory}>
            wyczyść pamięć
          </button>
        </div>
      </header>

      <div className="sets-grid">
        {sets.map((set) => {
          const unlearned = unlearnedCount(set);
          const hasProgress = unlearned > 0;
          return (
            <button
              key={set.id}
              className="glass set-card"
              onClick={() => setSelected(set)}
            >
              <span className="set-name">{set.name}</span>
              <span className="set-meta">
                {set.cards.length} fiszek
                {hasProgress && (
                  <span className="set-badge">{unlearned} do nauki</span>
                )}
              </span>
              <span className="set-deadline">
                Egzamin:{' '}
                {new Date(set.deadline).toLocaleDateString('pl-PL', {
                  day: 'numeric',
                  month: 'long',
                })}
              </span>
            </button>
          );
        })}
      </div>

      {selected && (
        <div className="modal-overlay" onClick={() => setSelected(null)}>
          <div className="glass modal" onClick={(e) => e.stopPropagation()}>
            <h2 className="modal-title">{selected.name}</h2>

            <div className="modal-direction">
              <span className="modal-label">Kierunek</span>
              <div className="direction-toggle">
                <button
                  className={`dir-btn${direction === 'pl->fr' ? ' active' : ''}`}
                  onClick={() => setDirection('pl->fr')}
                >
                  PL→FR
                </button>
                <button
                  className={`dir-btn${direction === 'fr->pl' ? ' active' : ''}`}
                  onClick={() => setDirection('fr->pl')}
                >
                  FR→PL
                </button>
              </div>
            </div>

            <div className="modal-actions">
              {(() => {
                const unlearned = getUnlearned(selected.name);
                const count = unlearned.length > 0 ? unlearned.length : selected.cards.length;
                return (
                  <button
                    className="btn btn-primary"
                    onClick={() => onStartStudy(selected, 'unlearned', direction)}
                  >
                    Powtarzaj nienauczone
                    <span className="btn-count">{count}</span>
                  </button>
                );
              })()}
              <button
                className="btn btn-secondary"
                onClick={() => onStartStudy(selected, 'all', direction)}
              >
                Powtarzaj wszystkie
                <span className="btn-count">{selected.cards.length}</span>
              </button>
            </div>

            <button className="btn-ghost modal-close" onClick={() => setSelected(null)}>
              zamknij
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
