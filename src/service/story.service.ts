
import api from "../api/api";
import type { Difficulty } from "../pages/types/flashcard.types";
import type { JLPT, StoryStatus } from "../pages/types/story";

/* =========================
   Types
========================= */

export interface CreateStoryPayload {
  title: string;
  japaneseTitle: string;
  description: string;

  difficulty: Difficulty;
  level: JLPT;

  duration: string;
  wordCount: number;

  tags: string[];

  content: any;
  comprehensionQuiz: any;

  isBookmarked?: boolean;
  status?: StoryStatus;
}

export interface Story {
  id: string;
  title: string;
  japaneseTitle: string;
  description: string;

  difficulty: Difficulty;
  level: JLPT;

  duration: string;
  wordCount: number;

  tags: string[];

  content: any;
  comprehensionQuiz: any;

  isBookmarked: boolean;
  readCount: number;
  status: StoryStatus;

  createdAt: string;
  updatedAt: string;
}

/* =========================
   API calls
========================= */

// ➕ Create Story
export const createStory = (payload: CreateStoryPayload) => {
  return api.post<Story>("/stories", payload);
};

// 📚 Get all stories
export const getStories = () => {
  return api.get<Story[]>("/stories");
};

// 📖 Get single story
export const getStoryById = (id: string) => {
  return api.get<Story>(`/stories/${id}`);
};

// 🎓 Get stories by JLPT level
export const getStoriesByLevel = (level: JLPT) => {
  return api.get<Story[]>(`/stories/level/${level}`);
};

// ✏️ Update story
export const updateStory = (
  id: string,
  payload: Partial<CreateStoryPayload>
) => {
  return api.patch<Story>(`/stories/${id}`, payload);
};

// 🗑️ Delete story
export const deleteStory = (id: string) => {
  return api.delete(`/stories/${id}`);
};
