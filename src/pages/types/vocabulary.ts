export interface Vocabulary {
  id: string;

  japanese: string;
  reading: string;
  english: string;

  category: string;
  lessonNumber: number;
  difficulty: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
  jlptLevel: "N5" | "N4" | "N3" | "N2" | "N1";
  tags: string[];

  example: string;
  exampleReading: string;
  exampleEnglish: string;

  imageUrl?: string;
  audioUrl?: string;
  pitchAccent?: string;

  isLearned: boolean;
  isBookmarked: boolean;

  reviews: number;
  correctCount: number;
  incorrectCount: number;
  streak: number;

  lastReviewedAt?: string;
  nextReviewAt?: string;
  intervalDays: number;
  easeFactor: number;

  createdAt: string;
  updatedAt: string;
}

// ---------- Payloads ----------
export type CreateVocabularyPayload = Omit<
  Vocabulary,
  | "id"
  | "reviews"
  | "correctCount"
  | "incorrectCount"
  | "streak"
  | "lastReviewedAt"
  | "nextReviewAt"
  | "intervalDays"
  | "easeFactor"
  | "createdAt"
  | "updatedAt"
>;

export type UpdateVocabularyPayload = Partial<CreateVocabularyPayload>;

export interface ReviewVocabularyPayload {
  rating: "again" | "good" | "easy";
}

export interface BulkCreateVocabularyPayload {
  items: CreateVocabularyPayload[];
}
