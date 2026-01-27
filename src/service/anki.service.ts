// services/anki.service.ts

import api from "../api/api";

// ---------- Types (optional but recommended) ----------
export interface AnkiDeck {
  id: string;
  name: string;
  noteCount?: number;
}

export interface AnkiNote {
  id: string;
  fields: Record<string, string>;
  deckId: string;
}

// ---------- API calls ----------

// Import Anki deck (.apkg file)
export const importAnkiDeck = (file: File) => {
  const formData = new FormData();
  formData.append("file", file);

  return api.post("/anki/import", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

// Get all decks
export const getAnkiDecks = () => {
  return api.get<AnkiDeck[]>("/anki/decks");
};

// Get notes inside a deck (with pagination)
export const getDeckNotes = (
  deckId: string,
  page: number = 1,
  limit: number = 20
) => {
  return api.get<AnkiNote[]>(`/anki/decks/${deckId}/notes`, {
    params: { page, limit },
  });
};

// Get a single note
export const getAnkiNote = (noteId: string) => {
  return api.get<AnkiNote>(`/anki/notes/${noteId}`);
};
