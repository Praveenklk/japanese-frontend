import api from "../api/api";

/**
 * ===== Types =====
 */
export interface HiraganaPayload {
  symbol: string;
  romaji: string;
  explanation: string;
  example?: string;
  audioUrl: string;
}

export interface Hiragana {
  id: string;
  symbol: string;
  romaji: string;
  explanation: string;
  example?: string;
  imageUrl: string;
  audioUrl: string;
  createdAt: string;
}

/**
 * ===== HELPERS =====
 */
const buildFormData = (
  data: HiraganaPayload,
  image?: File,
): FormData => {
  const formData = new FormData();

  formData.append("symbol", data.symbol);
  formData.append("romaji", data.romaji);
  formData.append("explanation", data.explanation);
  formData.append("audioUrl", data.audioUrl);

  if (data.example) {
    formData.append("example", data.example);
  }

  if (image) {
    formData.append("image", image); // 👈 matches FileInterceptor('image')
  }

  return formData;
};

/**
 * ===== API CALLS =====
 */

/**
 * CREATE Hiragana
 * POST /hiragana
 */
export const createHiragana = (
  data: HiraganaPayload,
  image: File,
) => {
  const formData = buildFormData(data, image);

  return api.post<Hiragana>("/hiragana", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

/**
 * GET ALL Hiragana
 * GET /hiragana
 */
export const getAllHiragana = () => {
  return api.get<Hiragana[]>("/hiragana");
};

/**
 * GET ONE Hiragana
 * GET /hiragana/:id
 */
export const getHiraganaById = (id: string) => {
  return api.get<Hiragana>(`/hiragana/${id}`);
};

/**
 * UPDATE Hiragana
 * PATCH /hiragana/:id
 */
export const updateHiragana = (
  id: string,
  data: HiraganaPayload,
  image?: File,
) => {
  const formData = buildFormData(data, image);

  return api.patch<Hiragana>(`/hiragana/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};


export const updateHiraganaReadStatus = (
  id: string,
  isRead: boolean
) => {
  return api.patch(`/hiragana/${id}/read-status`, {
    isRead,
  });
};


/**
 * DELETE Hiragana
 * DELETE /hiragana/:id
 */
export const deleteHiragana = (id: string) => {
  return api.delete<{ message: string }>(`/hiragana/${id}`);
};
