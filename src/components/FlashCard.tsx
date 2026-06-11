interface FlashCardProps {
  front: string;
  back: string;
  isFlipped: boolean;
  onFlip: () => void;
}

export default function FlashCard({ front, back, isFlipped, onFlip }: FlashCardProps) {
  return (
    <div className="card-scene" onClick={!isFlipped ? onFlip : undefined}>
      <div className={`card-inner${isFlipped ? ' flipped' : ''}`}>
        <div className="card-face card-front">
          <span className="card-text">{front}</span>
          {!isFlipped && <span className="card-hint">kliknij, aby odkryć</span>}
        </div>
        <div className="card-face card-back">
          <span className="card-text">{ isFlipped ? back : '' }</span>
        </div>
      </div>
    </div>
  );
}
