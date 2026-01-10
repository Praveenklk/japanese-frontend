// pages/types/kana-quiz.types.ts
export type KanaType = 'hiragana' | 'katakana';
export type QuizMode = 'reading' | 'writing' | 'listening';
export type QuizDifficulty = 'easy' | 'medium' | 'hard';

export interface KanaCharacter {
  symbol: string;
  romaji: string;
  type: KanaType;
  row: string;
  isTenten?: boolean;
  isMaru?: boolean;
  isCombo?: boolean;
}

export interface QuizQuestion {
  id: string;
  character: KanaCharacter;
  question: string;
  type: QuizMode;
  userAnswer?: string;
  isCorrect?: boolean;
  timeSpent?: number;
}

export interface QuizSettings {
  kanaType: KanaType;
  rows: string[];
  includeTenten: boolean;
  includeMaru: boolean;
  includeCombo: boolean;
  difficulty: QuizDifficulty;
  questionCount: number;
  mode: QuizMode;
}

export interface QuizResult {
  score: number;
  total: number;
  accuracy: number;
  timeSpent: number;
  questions: QuizQuestion[];
  date: Date;
}