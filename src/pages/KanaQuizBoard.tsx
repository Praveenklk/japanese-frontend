import React, { useEffect, useState } from "react";
import { kanaQuizService } from "../service/kana-quiz.service";
import type { KanaCharacter } from "./types/kana-quiz.types";

type CardState = {
  value: string;
  isCorrect: boolean | null;
};

const KanaQuizBoard: React.FC = () => {
  const [kana, setKana] = useState<KanaCharacter[]>([]);
  const [answers, setAnswers] = useState<Record<string, CardState>>({});

  useEffect(() => {
    loadKana();
  }, []);

  const loadKana = async () => {
    const data = await kanaQuizService.getAllKana("hiragana");
    setKana(data);

    const initial: Record<string, CardState> = {};
    data.forEach((k) => {
      initial[k.id] = { value: "", isCorrect: null };
    });
    setAnswers(initial);
  };

  const checkAnswer = (id: string, romaji: string) => {
    const kanaItem = kana.find((k) => k.id === id);
    if (!kanaItem) return;

    const correct =
      kanaQuizService.normalizeKanaInput(answers[id].value) ===
      kanaItem.romaji;

    setAnswers((prev) => ({
      ...prev,
      [id]: { ...prev[id], isCorrect: correct },
    }));
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold mb-4 text-center">
          Hiragana Quiz
        </h1>

        {/* GRID */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {kana.map((k) => {
            const state = answers[k.id];
            const bg =
              state?.isCorrect === true
                ? "bg-green-500"
                : state?.isCorrect === false
                ? "bg-blue-600"
                : "bg-green-400";

            return (
              <div
                key={k.id}
                className={`${bg} rounded-xl p-3 flex flex-col items-center justify-between transition-all`}
              >
                {/* Kana */}
                <div className="text-white text-3xl font-bold mb-2">
                  {k.symbol}
                </div>

                {/* Input */}
                <input
                  value={state?.value || ""}
                  onChange={(e) =>
                    setAnswers((prev) => ({
                      ...prev,
                      [k.id]: {
                        ...prev[k.id],
                        value: e.target.value,
                      },
                    }))
                  }
                  onBlur={() => checkAnswer(k.id, k.romaji)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      checkAnswer(k.id, k.romaji);
                    }
                  }}
                  className="w-full text-center rounded-md px-2 py-1 text-sm focus:outline-none"
                  placeholder="romaji"
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default KanaQuizBoard;
