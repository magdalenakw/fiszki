export interface Card {
  id: number;
  pl: string;
  fr: string;
}

export interface FlashcardSet {
  deadline: string;
  teacher: string;
  isTeacherFemale: boolean;
  id: number;
  name: string;
  cards: Card[];
}

export type Direction = 'pl->fr' | 'fr->pl';
export type StudyMode = 'unlearned' | 'all';
