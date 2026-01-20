export interface KanjiEntry {
  strokes: number;
  grade: number | null;
  freq: number | null;
  jlpt_old?: number | null;
  jlpt_new?: number | null;

  meanings: string[];
  readings_on: string[];
  readings_kun: string[];

  wk_level?: number | null;
  wk_meanings?: string[] | null;
  wk_readings_on?: string[] | null;
  wk_readings_kun?: string[] | null;
  wk_radicals?: string[] | null;
}

export type KanjiData = Record<string, KanjiEntry>;
