// utils/flashcard.utils.ts
import {type Flashcard, type Difficulty } from '../types/flashcard.types';

export const calculateNextReview = (
  streak: number,
  difficulty: Difficulty
): Date => {
  const now = new Date();
  const intervals: Record<Difficulty, number[]> = {
    easy: [1, 3, 7, 14, 30, 60],
    medium: [1, 2, 4, 8, 16, 32],
    hard: [1, 1, 2, 3, 5, 8],
  };

  const intervalIndex = Math.min(streak, intervals[difficulty].length - 1);
  const days = intervals[difficulty][intervalIndex];
  
  const nextDate = new Date(now);
  nextDate.setDate(nextDate.getDate() + days);
  return nextDate;
};

export const calculateScore = (
  correct: number,
  total: number,
  timeSpent: number
): number => {
  const accuracy = (correct / total) * 100;
  const timeBonus = Math.max(0, 100 - timeSpent / total);
  return Math.round((accuracy + timeBonus) / 2);
};

export const generateOptions = (
  correctAnswer: string,
  allAnswers: string[],
  count: number = 4
): string[] => {
  const otherAnswers = allAnswers
    .filter(answer => answer !== correctAnswer)
    .sort(() => Math.random() - 0.5)
    .slice(0, count - 1);
  
  const options = [correctAnswer, ...otherAnswers];
  return options.sort(() => Math.random() - 0.5);
};

export const getShuffledCards = (cards: Flashcard[]): Flashcard[] => {
  return [...cards].sort(() => Math.random() - 0.5);
};