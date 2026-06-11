export function getUnlearned(setName: string): number[] {
  const stored = localStorage.getItem(setName);
  if (!stored) return [];
  return stored.split(',').map(Number).filter((n) => !isNaN(n) && n > 0);
}

export function setUnlearned(setName: string, ids: number[]): void {
  if (ids.length === 0) {
    localStorage.removeItem(setName);
  } else {
    localStorage.setItem(setName, ids.join(','));
  }
}

export function clearAllProgress(setNames: string[]): void {
  setNames.forEach((name) => localStorage.removeItem(name));
}

export function getTimeUntil(deadline: string): string {
  const now = new Date();
  const end = new Date(deadline);
  const diff = end.getTime() - now.getTime();

  if (diff <= 0) return 'egzamin już był';

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

  const dStr = days === 1 ? '1 dzień' : `${days} dni`;
  const hStr = hours === 1 ? '1 godzinę' : hours < 5 ? `${hours} godziny` : `${hours} godzin`;

  if (days === 0) return hStr;
  if (hours === 0) return dStr;
  return `${dStr} i ${hStr}`;
}

export function getResultMessage(
  pct: number,
  _known: number,
  _total: number,
  deadline: string,
  teacher: string,
  isTeacherFemale: boolean
): string {
  const t = getTimeUntil(deadline);

  if (pct === 100) {
    const title = isTeacherFemale ? 'sama Madame' : 'sam Monsieur';
    return `Straszny kujon albo ${title} ${teacher}!`;
  }
  if (pct > 90) return `Kujon. Masz jeszcze ${t}.`;
  if (pct > 70) return `Spokojnie zdasz już teraz, a w razie czego masz jeszcze ${t} na powtórki.`;
  if (pct > 65) return `Raczej bezpiecznie, masz jeszcze ${t}.`;
  if (pct > 55) return `Na dwoje babka wróżyła, ale masz jeszcze ${t}.`;
  if (pct >= 40) return `Egzamin jest za ${t}. Tak se, ale raczej nie zdasz.`;
  return `Żenada. Egzamin jest za ${t} — nie wiem, jak zamierzasz to zdać.`;
}
