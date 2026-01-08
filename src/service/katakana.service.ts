import api from "../api/api";

/**
 * ===== Katakana Types =====
 */

export interface Katakana {
  id: string;
  symbol: string;
  romaji: string;
  explanation: string;
  example?: string;
  imageUrl?: string;
  audioUrl?: string;
  isRead: boolean;
  createdAt: string;
}

export interface CreateKatakanaPayload {
  symbol: string;
  romaji: string;
  explanation: string;
  example?: string;
  imageUrl?: string;
  audioUrl?: string;
  isRead?: boolean;
}

export interface UpdateKatakanaPayload {
  symbol?: string;
  romaji?: string;
  explanation?: string;
  example?: string;
  imageUrl?: string;
  audioUrl?: string;
  isRead?: boolean;
}

/**
 * ===== Katakana Services =====
 */

/**
 * CREATE
 * POST /katakana
 */
export const createKatakana = (payload: CreateKatakanaPayload) => {
  return api.post<Katakana>("/katakana", payload);
};

/**
 * GET ALL
 * GET /katakana
 */
export const getAllKatakana = () => {
  return api.get<Katakana[]>("/katakana");
};

/**
 * GET ONE
 * GET /katakana/:id
 */
export const getKatakanaById = (id: string) => {
  return api.get<Katakana>(`/katakana/${id}`);
};

/**
 * UPDATE
 * PATCH /katakana/:id
 */
export const updateKatakana = (
  id: string,
  payload: UpdateKatakanaPayload,
) => {
  return api.patch<Katakana>(`/katakana/${id}`, payload);
};

/**
 * MARK AS READ
 * PATCH /katakana/:id/read
 */
export const markKatakanaAsRead = (id: string) => {
  return api.patch<Katakana>(`/katakana/${id}/read`);
};

/**
 * DELETE
 * DELETE /katakana/:id
 */
export const deleteKatakana = (id: string) => {
  return api.delete<{ message: string }>(`/katakana/${id}`);
};
