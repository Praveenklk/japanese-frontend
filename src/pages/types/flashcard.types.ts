// types/flashcard.types.ts
export type FlashcardMode = 'study' | 'quiz' | 'review';
export type QuizType = 'multiple-choice' | 'typing' | 'matching';
export type Difficulty = 'easy' | 'medium' | 'hard';

export interface Flashcard {
  id: string;
  symbol: string;
  romaji: string;
  explanation: string;
  example?: string;
  isLearned: boolean;
  lastReviewed: Date | null;
  nextReview: Date | null;
  reviewCount: number;
  correctCount: number;
  wrongCount: number;
  difficulty: Difficulty;
  streak: number;
}

export interface QuizQuestion {
  id: string;
  type: QuizType;
  question: string;
  correctAnswer: string;
  options?: string[];
  userAnswer?: string;
  isCorrect?: boolean;
  timeSpent?: number;
}

export interface StudySession {
  id: string;
  date: Date;
  mode: FlashcardMode;
  cardsStudied: number;
  correctAnswers: number;
  wrongAnswers: number;
  totalTime: number;
  score: number;
}