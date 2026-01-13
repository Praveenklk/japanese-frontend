import api from "../api/api";
import type { BulkCreateVocabularyPayload, CreateVocabularyPayload, ReviewVocabularyPayload, UpdateVocabularyPayload, Vocabulary } from "../pages/types/vocabulary";

// ---------- Create ----------
export const createVocabulary = (payload: CreateVocabularyPayload) => {
  return api.post<Vocabulary>("/vocabulary", payload);
};

// ---------- Bulk Create ----------
export const bulkCreateVocabulary = (
  payload: BulkCreateVocabularyPayload
) => {
  return api.post<{ count: number }>("/vocabulary/bulk", payload);
};

// ---------- Get All ----------
export const getAllVocabulary = () => {
  return api.get<Vocabulary[]>("/vocabulary");
};

// ---------- Get Due Flashcards ----------
export const getDueVocabulary = () => {
  return api.get<Vocabulary[]>("/vocabulary/due");
};

// ---------- Review Flashcard ----------
export const reviewVocabulary = (
  id: string,
  payload: ReviewVocabularyPayload
) => {
  return api.post<Vocabulary>(`/vocabulary/${id}/review`, payload);
};

// ---------- Update ----------
export const updateVocabulary = (
  id: string,
  payload: UpdateVocabularyPayload
) => {
  return api.patch<Vocabulary>(`/vocabulary/${id}`, payload);
};

// ---------- Delete ----------
export const deleteVocabulary = (id: string) => {
  return api.delete<void>(`/vocabulary/${id}`);
};
