import React, { useEffect, useRef, useState } from "react";
import { CheckCircle, XCircle, Volume2, RotateCcw } from "lucide-react";
import type { QuizQuestion, QuizResult } from "./types/kana-quiz.types";

interface QuizPageProps {
  questions: QuizQuestion[];
  onFinish: (result: QuizResult) => void;
  timePerQuestion?: number; // ✅ NEW
}

const AUTO_NEXT_DELAY = 1400;

const QuizPage: React.FC<QuizPageProps> = ({
  questions,
  onFinish,
  timePerQuestion = 10, // ✅ default = 10s
}) => {
  const [index, setIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [correctCount, setCorrectCount] = useState(0);
  const [showResult, setShowResult] = useState<boolean | null>(null);
  const [userAnswer, setUserAnswer] = useState("");
  const [timeLeft, setTimeLeft] = useState(timePerQuestion);
  const [totalTime, setTotalTime] = useState(0);
  const [finished, setFinished] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const quizStartTime = useRef(Date.now());
  const voicesRef = useRef<SpeechSynthesisVoice[]>([]);

  const current = questions[index];

  /* -------------------- LOAD JP VOICES -------------------- */
  useEffect(() => {
    const loadVoices = () => {
      voicesRef.current = speechSynthesis.getVoices();
    };
    loadVoices();
    speechSynthesis.onvoiceschanged = loadVoices;
  }, []);

  /* -------------------- TIMER -------------------- */
  useEffect(() => {
    if (showResult !== null || finished) return;

    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current!);
          handleTimeout();
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current!);
  }, [index, showResult, finished]);

  /* reset timer per question */
  useEffect(() => {
    setTimeLeft(timePerQuestion);
  }, [index, timePerQuestion]);

  useEffect(() => {
    if (showResult === null) inputRef.current?.focus();
  }, [index, showResult]);

  /* -------------------- AUDIO -------------------- */
  const playAudio = () => {
    const utter = new SpeechSynthesisUtterance(current.character.romaji);
    const jpVoice =
      voicesRef.current.find((v) => v.lang === "ja-JP") ||
      voicesRef.current.find((v) => v.lang.startsWith("ja"));

    if (jpVoice) utter.voice = jpVoice;
    utter.lang = "ja-JP";
    utter.rate = 0.9;

    speechSynthesis.cancel();
    speechSynthesis.speak(utter);
  };

  /* -------------------- CHECK ANSWER -------------------- */
  const checkAnswer = () => {
    if (!answer.trim() || showResult !== null) return;

    clearInterval(timerRef.current!);

    const normalized = answer.trim().toLowerCase();
    const correctAnswer = current.character.romaji.toLowerCase();
    const isCorrect = normalized === correctAnswer;

    setUserAnswer(normalized);
    if (isCorrect) setCorrectCount((c) => c + 1);
    setShowResult(isCorrect);

    setTimeout(goNext, AUTO_NEXT_DELAY);
  };

  const handleTimeout = () => {
    setUserAnswer("(no answer)");
    setShowResult(false);
    setTimeout(goNext, AUTO_NEXT_DELAY);
  };

  /* -------------------- NEXT -------------------- */
  const goNext = () => {
    setShowResult(null);
    setAnswer("");

    if (index + 1 >= questions.length) {
      const totalSeconds = Math.floor(
        (Date.now() - quizStartTime.current) / 1000
      );
      setTotalTime(totalSeconds);
      setFinished(true);

      onFinish({
        total: questions.length,
        correct: correctCount,
      });
    } else {
      setIndex((i) => i + 1);
    }
  };

  /* -------------------- RESULT PAGE -------------------- */
  if (finished) {
    const accuracy = Math.round((correctCount / questions.length) * 100);

    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md text-center">
          <h2 className="text-2xl font-bold mb-3">Quiz Completed 🎉</h2>

          <div className="space-y-2 text-sm">
            <p>Score: <b>{correctCount}</b> / {questions.length}</p>
            <p>Accuracy: <b>{accuracy}%</b></p>
            <p>Total Time: <b>{totalTime}s</b></p>
          </div>

          <button
            onClick={() => window.location.reload()}
            className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Restart Quiz
          </button>
        </div>
      </div>
    );
  }

  if (!current) return null;

  /* -------------------- QUIZ UI -------------------- */
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-6">

        {/* Progress */}
        <div className="flex justify-between text-xs text-gray-500 mb-2">
          <span>Q {index + 1}/{questions.length}</span>
          <span className={timeLeft <= 3 ? "text-red-500 animate-pulse" : ""}>
            ⏱ {timeLeft}s
          </span>
        </div>

        {/* Kana */}
        <div className="text-center my-5">
          <div className="text-6xl font-bold">
            {current.character.symbol}
          </div>
          <p className="text-sm text-gray-500 mt-1">
            {current.question}
          </p>
        </div>

        {/* Audio */}
        <button
          onClick={playAudio}
          className="mx-auto mb-3 flex items-center gap-1 text-sm text-blue-600 hover:underline"
        >
          <Volume2 className="w-4 h-4" />
          Hear pronunciation
        </button>

        {/* Input */}
        {showResult === null && (
          <input
            ref={inputRef}
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && checkAnswer()}
            className="w-full border rounded-lg px-4 py-2 text-center text-lg focus:ring-2 focus:ring-blue-500"
            placeholder="Type romaji"
            autoComplete="off"
          />
        )}

        {/* Feedback */}
        {showResult !== null && (
          <div
            className={`mt-4 p-3 rounded-lg text-center ${
              showResult ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
            }`}
          >
            {showResult ? (
              <>
                <CheckCircle className="w-8 h-8 mx-auto mb-1" />
                <p className="font-semibold">Correct!</p>
              </>
            ) : (
              <>
                <XCircle className="w-8 h-8 mx-auto mb-1" />
                <p>Your answer: <b>{userAnswer}</b></p>
                <p>Correct: <b>{current.character.romaji}</b></p>
              </>
            )}
          </div>
        )}

        {/* Manual check */}
        {showResult === null && (
          <button
            onClick={checkAnswer}
            className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold"
          >
            Check
          </button>
        )}
      </div>
    </div>
  );
};

export default QuizPage;
