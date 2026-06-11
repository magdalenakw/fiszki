import type { FlashcardSet } from '../types';
import { getResultMessage } from '../utils/progress';

interface ResultsProps {
  known: number;
  total: number;
  set: FlashcardSet;
  onRetry: () => void;
  onBack: () => void;
}

export default function Results({ known, total, set, onRetry, onBack }: ResultsProps) {
  const pct = total === 0 ? 0 : Math.round((known / total) * 100);
  const message = getResultMessage(pct, known, total, set.deadline, set.teacher, set.isTeacherFemale);

  const scoreColor =
    pct >= 70 ? 'var(--neon-500)' : pct >= 55 ? 'var(--neon-400)' : 'var(--score-bad)';

  return (
    <div className="screen results-screen">
      <div className="glass results-card">
        <h2 className="results-set-name">{set.name}</h2>
        <div className="results-score" style={{ color: scoreColor }}>
          {pct}%
        </div>
        <p className="results-detail">
          Umiesz <strong>{known}</strong>/{total}
        </p>
        <p className="results-message">{message}</p>
        <div className="results-actions">
          <button className="btn btn-primary" onClick={onRetry}>
            Jeszcze raz
          </button>
          <button className="btn btn-secondary" onClick={onBack}>
            Powrót do biblioteki
          </button>
        </div>
      </div>
    </div>
  );
}
