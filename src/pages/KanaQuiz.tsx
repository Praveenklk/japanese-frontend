// pages/KanaQuiz.tsx
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Home,
  BookOpen,
  Play,
  Check,
  X,
  Settings,
  Grid3x3,
  Lock,
  CheckCircle,
  XCircle,
  Moon,
  Sun,
  Star,
  Award,
  RotateCcw,
} from "lucide-react";
import { kanaQuizService } from "../service/kana-quiz.service";
import type {
  KanaCharacter,
  QuizSettings,
  QuizQuestion,
  QuizResult,
  KanaType,
  QuizMode,
  QuizDifficulty,
} from "./types/kana-quiz.types";
import QuizPage from "./QuizPage";

const KanaQuiz: React.FC = () => {
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(false);

  // --- view state ---
  const [darkMode, setDarkMode] = useState(false);
  const [settings, setSettings] = useState<QuizSettings>({
    kanaType: "hiragana",
    rows: ["basic"],
    includeTenten: false,
    includeMaru: false,
    includeCombo: false,
    difficulty: "easy",
    questionCount: 10,
    mode: "reading",
  });

  // store all kana + rows from service
  const [allKana, setAllKana] = useState<KanaCharacter[]>([]);
  const [rows, setRows] = useState<{ id: string; name: string; chars: string[] }[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // quiz (kept minimal; you can keep your old quiz flow)
  const [step, setStep] = useState<"setup" | "quiz" | "result">("setup");
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [quizResults, setQuizResults] = useState<QuizResult | null>(null);

  // UI selection states
  const [selectedRows, setSelectedRows] = useState<string[]>(["basic"]);
  const [activeRowId, setActiveRowId] = useState<string | null>(null);

  // per-card inline evaluation
  const [cardAnswers, setCardAnswers] = useState<
    Record<string, { answer: string; isCorrect: boolean | null; tried: boolean }>
  >({});

  // Track practice score for active row
  const [practiceScore, setPracticeScore] = useState({ correct: 0, total: 0 });

  const inputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  // Check if mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // fetch kana & rows when kana type changes
  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      try {
        const k = await kanaQuizService.getAllKana(settings.kanaType);
        setAllKana(k);
        const r = kanaQuizService.getRows(settings.kanaType);
        setRows(r);
        // Keep current selection if it still exists in new rows
        const validSelectedRows = selectedRows.filter(rowId => 
          r.some(row => row.id === rowId)
        );
        if (validSelectedRows.length === 0) {
          setSelectedRows(["basic"]);
        } else {
          setSelectedRows(validSelectedRows);
        }
        setActiveRowId(null);
        setCardAnswers({});
        setPracticeScore({ correct: 0, total: 0 });
      } catch (err) {
        console.error("fetch kana error", err);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [settings.kanaType]);

  // Update score when card answers change
  useEffect(() => {
    if (activeRowId) {
      const total = Object.keys(cardAnswers).length;
      const correct = Object.values(cardAnswers).filter(a => a.isCorrect === true).length;
      setPracticeScore({ correct, total });
    }
  }, [cardAnswers, activeRowId]);

  // helper to find characters for a given row id
  const charsForRow = (rowId: string) => {
    const row = rows.find((r) => r.id === rowId);
    if (!row) return [];
    return row.chars
      .map((sym) => allKana.find((k) => k.symbol === sym))
      .filter(Boolean) as KanaCharacter[];
  };

  // Get all characters from selected rows
  const getSelectedCharacters = () => {
    return allKana.filter((k) =>
      rows.some((r) => selectedRows.includes(r.id) && r.chars.includes(k.symbol))
    );
  };

  // toggle row selection
  const handleRowToggle = (rowId: string) => {
    setSelectedRows((prev) => {
      const newRows = prev.includes(rowId) ? prev.filter((r) => r !== rowId) : [...prev, rowId];
      if (newRows.length === 0) {
        // If deselecting all, keep at least basic row
        return ["basic"];
      }
      return newRows;
    });
  };

  // when user clicks a small row button to inspect, open activeRow view (cards)
  const handleOpenRow = (rowId: string) => {
    const available = (() => {
      const row = rows.find((r) => r.id === rowId);
      if (!row) return false;
      if (rowId.includes("tenten") && !settings.includeTenten) return false;
      if (rowId.includes("maru") && !settings.includeMaru) return false;
      if (rowId.includes("combo") && !settings.includeCombo) return false;
      return true;
    })();
    if (!available) return;
    setActiveRowId(rowId);
    const chars = charsForRow(rowId);
    const initial: Record<string, { answer: string; isCorrect: boolean | null; tried: boolean }> = {};
    chars.forEach((c) => {
      initial[c.symbol] = { answer: "", isCorrect: null, tried: false };
    });
    setCardAnswers(initial);
    setPracticeScore({ correct: 0, total: chars.length });

    setTimeout(() => {
      const first = chars[0];
      if (first && inputRefs.current[first.symbol]) {
        inputRefs.current[first.symbol]!.focus();
        inputRefs.current[first.symbol]!.select();
      }
    }, 50);
  };

  const handleCloseRowView = () => {
    setActiveRowId(null);
    setCardAnswers({});
    setPracticeScore({ correct: 0, total: 0 });
  };

  // Reset current row practice
  const handleResetRow = () => {
    if (!activeRowId) return;
    const chars = charsForRow(activeRowId);
    const initial: Record<string, { answer: string; isCorrect: boolean | null; tried: boolean }> = {};
    chars.forEach((c) => {
      initial[c.symbol] = { answer: "", isCorrect: null, tried: false };
    });
    setCardAnswers(initial);
    setPracticeScore({ correct: 0, total: chars.length });

    // Focus first input
    setTimeout(() => {
      const first = chars[0];
      if (first && inputRefs.current[first.symbol]) {
        inputRefs.current[first.symbol]!.focus();
        inputRefs.current[first.symbol]!.select();
      }
    }, 50);
  };

  // check a single card answer inline
  const checkCardAnswer = (symbol: string) => {
    const char = allKana.find((c) => c.symbol === symbol);
    if (!char) return;
    const attempt = (cardAnswers[symbol]?.answer || "").trim();
    if (!attempt) return;

    const normalized = kanaQuizService.normalizeKanaInput(attempt);
    const correct =
      normalized === kanaQuizService.normalizeKanaInput(char.romaji) ||
      normalized === kanaQuizService.normalizeKanaInput(char.symbol);

    setCardAnswers((prev) => ({
      ...prev,
      [symbol]: { 
        answer: attempt, 
        isCorrect: correct, 
        tried: true 
      },
    }));
  };

  // Auto-focus on next empty input
  const focusNextInput = (currentSymbol: string) => {
    const chars = charsForRow(activeRowId!);
    const currentIndex = chars.findIndex(c => c.symbol === currentSymbol);
    
    if (currentIndex >= 0 && currentIndex < chars.length - 1) {
      // Find next input that's not completed
      for (let i = currentIndex + 1; i < chars.length; i++) {
        const nextSymbol = chars[i].symbol;
        const nextState = cardAnswers[nextSymbol];
        
        // Skip if already correct
        if (nextState?.isCorrect === true) continue;
        
        const nextInput = inputRefs.current[nextSymbol];
        if (nextInput) {
          setTimeout(() => {
            nextInput.focus();
            nextInput.select();
          }, 50);
          break;
        }
      }
    } else if (currentIndex === chars.length - 1) {
      // If on last card and all are correct, show completion message
      const allCorrect = chars.every(c => cardAnswers[c.symbol]?.isCorrect === true);
      if (allCorrect) {
        // You could add a completion toast or message here
      }
    }
  };

  const handleCardInputKey = (e: React.KeyboardEvent<HTMLInputElement>, symbol: string) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const attempt = (cardAnswers[symbol]?.answer || "").trim();
      if (!attempt) return;
      
      checkCardAnswer(symbol);
      
      // Wait a moment for state update, then move to next input
      setTimeout(() => {
        focusNextInput(symbol);
      }, 100);
    }
    
    // Tab key navigation
    if (e.key === "Tab") {
      e.preventDefault();
      if (!e.shiftKey) { // Move forward
        focusNextInput(symbol);
      } else { // Move backward (Shift+Tab)
        const chars = charsForRow(activeRowId!);
        const currentIndex = chars.findIndex(c => c.symbol === symbol);
        
        if (currentIndex > 0) {
          // Find previous input that's not completed
          for (let i = currentIndex - 1; i >= 0; i--) {
            const prevSymbol = chars[i].symbol;
            const prevState = cardAnswers[prevSymbol];
            
            // Skip if already correct
            if (prevState?.isCorrect === true) continue;
            
            const prevInput = inputRefs.current[prevSymbol];
            if (prevInput) {
              setTimeout(() => {
                prevInput.focus();
                prevInput.select();
              }, 50);
              break;
            }
          }
        }
      }
    }
  };

  // Start formal quiz flow
const handleStartQuiz = () => {
  if (selectedRows.length === 0) {
    alert("Select at least one row to start the quiz");
    return;
  }

  const selectedChars = getSelectedCharacters();

  if (selectedChars.length === 0) {
    alert(
      "No characters found.\n" +
      "Enable Dakuten / Handakuten / Combinations if required."
    );
    return;
  }

  // Fix question count if not enough characters
  let finalSettings = { ...settings };

  if (selectedChars.length < settings.questionCount) {
    const proceed = window.confirm(
      `Only ${selectedChars.length} characters available.\n` +
      `Continue with ${selectedChars.length} questions?`
    );

    if (!proceed) return;

    finalSettings.questionCount = selectedChars.length;
    setSettings(finalSettings);
  }

  const generatedQuestions = kanaQuizService.generateQuizQuestions(
    finalSettings,
    selectedChars
  );

  if (!generatedQuestions || generatedQuestions.length === 0) {
    alert("Failed to generate quiz questions. Check your row selections.");
    return;
  }

  setQuestions(generatedQuestions);
  setQuizResults(null);
  setStep("quiz");

  console.log("Quiz started:", generatedQuestions);
};


  // Select All Kana
  const handleSelectAllKana = () => {
    const allRowIds = rows
      .filter((r) => {
        // Filter based on include flags
        if (r.id.includes("tenten") && !settings.includeTenten) return false;
        if (r.id.includes("maru") && !settings.includeMaru) return false;
        if (r.id.includes("combo") && !settings.includeCombo) return false;
        return true;
      })
      .map((r) => r.id);
    
    // If already all selected, deselect all except basic
    const allCurrentlySelected = allRowIds.every(id => selectedRows.includes(id));
    if (allCurrentlySelected) {
      setSelectedRows(["basic"]);
      setActiveRowId(null);
    } else {
      setSelectedRows(allRowIds);
      setActiveRowId(null);
    }
  };

  // UI helpers to split rows into Main / Dakuten / Combination columns
  const mainRows = rows.filter((r) => !/tenten|maru|combo/i.test(r.id));
  const dakutenRows = rows.filter((r) => /tenten|maru/i.test(r.id));
  const comboRows = rows.filter((r) => /combo/i.test(r.id));

  // Toggle all rows for a specific category
  const toggleAllMainRows = () => {
    const allMainIds = mainRows.map((r) => r.id);
    const areAllSelected = allMainIds.every(id => selectedRows.includes(id));
    
    if (areAllSelected) {
      setSelectedRows(prev => prev.filter(id => !allMainIds.includes(id)));
      if (selectedRows.length === allMainIds.length) {
        // If only main rows were selected, keep basic
        setSelectedRows(["basic"]);
      }
    } else {
      setSelectedRows(prev => Array.from(new Set([...prev, ...allMainIds])));
    }
  };

  const toggleAllDakutenRows = () => {
    const allDakutenIds = dakutenRows
      .filter(r => {
        if (r.id.includes("tenten")) return settings.includeTenten;
        if (r.id.includes("maru")) return settings.includeMaru;
        return true;
      })
      .map(r => r.id);
    
    if (allDakutenIds.length === 0) {
      alert("Please enable Dakuten or Handakuten options first");
      return;
    }
    
    const areAllSelected = allDakutenIds.every(id => selectedRows.includes(id));
    
    if (areAllSelected) {
      setSelectedRows(prev => prev.filter(id => !allDakutenIds.includes(id)));
    } else {
      setSelectedRows(prev => Array.from(new Set([...prev, ...allDakutenIds])));
    }
  };

  const toggleAllComboRows = () => {
    if (!settings.includeCombo) {
      alert("Please enable Combinations option first");
      return;
    }
    
    const allComboIds = comboRows.map(r => r.id);
    
    if (allComboIds.length === 0) {
      alert("No combination rows available");
      return;
    }
    
    const areAllSelected = allComboIds.every(id => selectedRows.includes(id));
    
    if (areAllSelected) {
      setSelectedRows(prev => prev.filter(id => !allComboIds.includes(id)));
    } else {
      setSelectedRows(prev => Array.from(new Set([...prev, ...allComboIds])));
    }
  };

  if (isLoading) {
    return (
      <div className={`min-h-screen flex items-center justify-center p-4 ${darkMode ? "bg-gray-900" : "bg-white"}`}>
        <div className="text-center">
          <div className="w-12 h-12 border-3 border-blue-300 border-t-blue-600 rounded-full animate-spin mx-auto" />
          <p className={`mt-3 text-sm ${darkMode ? "text-gray-300" : "text-gray-600"}`}>Loading kana…</p>
        </div>
      </div>
    );
  }

  const selectedCharacters = getSelectedCharacters();
  const allAvailableRowIds = rows
    .filter((r) => {
      if (r.id.includes("tenten") && !settings.includeTenten) return false;
      if (r.id.includes("maru") && !settings.includeMaru) return false;
      if (r.id.includes("combo") && !settings.includeCombo) return false;
      return true;
    })
    .map((r) => r.id);
  
  const isAllSelected = allAvailableRowIds.every(id => selectedRows.includes(id));

  return (
    <div className={`min-h-screen transition-colors duration-200 ${darkMode ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-900"}`}>
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-4">
        {/* top controls - Mobile first */}
        <div className="flex flex-col gap-3 mb-6">
          <div className="flex items-center justify-between">
            <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Kana Selector
            </h1>
            <button
              onClick={() => setDarkMode((d) => !d)}
              className={`p-2 rounded-lg ${darkMode ? "bg-gray-800 text-gray-300" : "bg-white text-gray-700 border"}`}
              title="Toggle dark mode"
            >
              {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <select
              value={settings.kanaType}
              onChange={(e) => {
                setSettings((s) => ({ ...s, kanaType: e.target.value as KanaType }));
                setActiveRowId(null);
              }}
              className={`px-3 py-2 rounded-lg border text-sm ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-300"}`}
            >
              <option value="hiragana">Hiragana</option>
              <option value="katakana">Katakana</option>
            </select>

            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSettings((s) => ({ ...s, kanaType: "hiragana" }))}
                className={`flex-1 min-w-[120px] px-3 py-2 font-medium rounded-lg text-sm ${settings.kanaType === "hiragana" 
                  ? "bg-blue-600 text-white" 
                  : darkMode 
                    ? "bg-gray-800 border border-gray-700" 
                    : "bg-white border border-gray-300"}`}
              >
                Hiragana
              </button>
              <button
                onClick={() => setSettings((s) => ({ ...s, kanaType: "katakana" }))}
                className={`flex-1 min-w-[120px] px-3 py-2 font-medium rounded-lg text-sm ${settings.kanaType === "katakana" 
                  ? "bg-blue-600 text-white" 
                  : darkMode 
                    ? "bg-gray-800 border border-gray-700" 
                    : "bg-white border border-gray-300"}`}
              >
                Katakana
              </button>
              <button
                onClick={handleSelectAllKana}
                className={`flex-1 min-w-[100px] px-3 py-2 font-medium rounded-lg text-sm ${isAllSelected 
                  ? "bg-green-100 text-green-800 border border-green-300" 
                  : darkMode 
                    ? "bg-gray-800 border border-gray-700" 
                    : "bg-white border border-gray-300"}`}
              >
                {isAllSelected ? 'All Selected' : 'All Kana'}
              </button>
            </div>
          </div>
        </div>

        {/* three-column rows table - Mobile first */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
          {/* Main Kana Column */}
          <div className={`rounded-lg p-3 sm:p-4 ${darkMode ? "bg-gray-800" : "bg-white shadow-sm"}`}>
            <h3 className="text-lg sm:text-xl font-bold text-center mb-3">Main Kana</h3>
            <div className="mb-3">
              <button
                onClick={toggleAllMainRows}
                className={`w-full py-2 rounded-lg text-center font-medium text-sm ${mainRows.every(r => selectedRows.includes(r.id)) 
                  ? "bg-green-100 text-green-800 border border-green-300" 
                  : darkMode 
                    ? "bg-gray-700 hover:bg-gray-600" 
                    : "bg-blue-50 hover:bg-blue-100 border border-blue-200"}`}
              >
                {/* {mainRows.every(r => selectedRows.includes(r.id)) ? '✓ All Main Selected' : 'Select All Main'} */}
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {mainRows.map((r) => {
                const char = allKana.find((c) => c.symbol === r.chars[0]);
                const romaji = char ? `/${char.romaji}` : "";
                const isSelected = selectedRows.includes(r.id);
                return (
                  <button
                    key={r.id}
                    onClick={() => {
                      handleRowToggle(r.id);
                      handleOpenRow(r.id);
                    }}
                    className={`flex items-center justify-between p-2 sm:p-3 rounded-lg text-left ${isSelected 
                      ? darkMode 
                        ? "bg-blue-900 border-2 border-blue-500" 
                        : "bg-blue-50 border-2 border-blue-500"
                      : darkMode 
                        ? "bg-gray-700 hover:bg-gray-600 border border-gray-600" 
                        : "bg-white hover:bg-gray-50 border border-gray-300"}`}
                  >
                    <div className="text-xl sm:text-2xl font-bold">{r.chars[0]}</div>
                    <div className="text-right">
                      <div className="text-xs sm:text-sm font-medium">{r.name}</div>
                      <div className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}>{romaji}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Dakuten Column */}
          <div className={`rounded-lg p-3 sm:p-4 ${darkMode ? "bg-gray-800" : "bg-white shadow-sm"}`}>
            <h3 className="text-lg sm:text-xl font-bold text-center mb-3">Dakuten Kana</h3>
            <div className="mb-3">
              <button
                onClick={toggleAllDakutenRows}
                className={`w-full py-2 rounded-lg text-center font-medium text-sm ${dakutenRows.filter(r => {
                  if (r.id.includes("tenten")) return settings.includeTenten;
                  if (r.id.includes("maru")) return settings.includeMaru;
                  return true;
                }).every(r => selectedRows.includes(r.id)) 
                  ? "bg-green-100 text-green-800 border border-green-300" 
                  : darkMode 
                    ? "bg-gray-700 hover:bg-gray-600" 
                    : "bg-blue-50 hover:bg-blue-100 border border-blue-200"}`}
              >
                {dakutenRows.filter(r => {
                  if (r.id.includes("tenten")) return settings.includeTenten;
                  if (r.id.includes("maru")) return settings.includeMaru;
                  return true;
                }).every(r => selectedRows.includes(r.id)) ? '✓ All Dakuten Selected' : 'Select All Dakuten'}
              </button>
            </div>

            <div className="grid grid-cols-1 gap-2">
              {dakutenRows.map((r) => {
                const char = allKana.find((c) => c.symbol === r.chars[0]);
                const romaji = char ? `/${char.romaji}` : "";
                const isAvailable = !r.id.includes("tenten") ? true : settings.includeTenten || settings.includeMaru;
                const isSelected = selectedRows.includes(r.id);
                
                return (
                  <button
                    key={r.id}
                    onClick={() => {
                      if (!isAvailable) {
                        alert(`Please enable ${r.id.includes("tenten") ? "Dakuten" : "Handakuten"} option first`);
                        return;
                      }
                      handleRowToggle(r.id);
                      handleOpenRow(r.id);
                    }}
                    disabled={!isAvailable}
                    className={`flex items-center justify-between p-2 sm:p-3 rounded-lg text-left ${isSelected 
                      ? darkMode 
                        ? "bg-blue-900 border-2 border-blue-500" 
                        : "bg-blue-50 border-2 border-blue-500"
                      : darkMode 
                        ? "bg-gray-700 hover:bg-gray-600 border border-gray-600" 
                        : "bg-white hover:bg-gray-50 border border-gray-300"} ${!isAvailable ? "opacity-50 cursor-not-allowed" : ""}`}
                  >
                    <div className="text-xl sm:text-2xl font-bold">{r.chars[0]}</div>
                    <div className="text-right">
                      <div className="text-xs sm:text-sm font-medium">{r.name}</div>
                      <div className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}>{romaji}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Combination Column */}
          <div className={`rounded-lg p-3 sm:p-4 ${darkMode ? "bg-gray-800" : "bg-white shadow-sm"}`}>
            <h3 className="text-lg sm:text-xl font-bold text-center mb-3">Combination Kana</h3>
            <div className="mb-3">
              <button
                onClick={toggleAllComboRows}
                className={`w-full py-2 rounded-lg text-center font-medium text-sm ${comboRows.filter(() => settings.includeCombo).every(r => selectedRows.includes(r.id)) 
                  ? "bg-green-100 text-green-800 border border-green-300" 
                  : darkMode 
                    ? "bg-gray-700 hover:bg-gray-600" 
                    : "bg-blue-50 hover:bg-blue-100 border border-blue-200"}`}
              >
                {comboRows.filter(() => settings.includeCombo).every(r => selectedRows.includes(r.id)) 
                  ? '✓ All Combo Selected' 
                  : 'Select All Combo'}
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {comboRows.map((r) => {
                const char = allKana.find((c) => c.symbol === r.chars[0]);
                const romaji = char ? `/${char.romaji}` : "";
                const isAvailable = settings.includeCombo;
                const isSelected = selectedRows.includes(r.id);
                
                return (
                  <button
                    key={r.id}
                    onClick={() => {
                      if (!isAvailable) {
                        alert("Please enable Combinations option first");
                        return;
                      }
                      handleRowToggle(r.id);
                      handleOpenRow(r.id);
                    }}
                    disabled={!isAvailable}
                    className={`flex items-center justify-between p-2 sm:p-3 rounded-lg text-left ${isSelected 
                      ? darkMode 
                        ? "bg-blue-900 border-2 border-blue-500" 
                        : "bg-blue-50 border-2 border-blue-500"
                      : darkMode 
                        ? "bg-gray-700 hover:bg-gray-600 border border-gray-600" 
                        : "bg-white hover:bg-gray-50 border border-gray-300"} ${!isAvailable ? "opacity-50 cursor-not-allowed" : ""}`}
                  >
                    <div className="text-xl sm:text-2xl font-bold">{r.chars[0]}</div>
                    <div className="text-right">
                      <div className="text-xs sm:text-sm font-medium">{r.name}</div>
                      <div className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}>{romaji}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Settings and Start Quiz Section */}
        <div className={`rounded-lg p-3 sm:p-4 mb-6 ${darkMode ? "bg-gray-800" : "bg-white shadow-sm"}`}>
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2 mb-3 sm:mb-0">
                <span className="font-medium text-sm mr-2">Include:</span>
                <button
                  onClick={() => setSettings((s) => ({ ...s, includeTenten: !s.includeTenten }))}
                  className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 text-xs ${settings.includeTenten 
                    ? "bg-green-100 text-green-800 border border-green-300" 
                    : darkMode 
                      ? "bg-gray-700 text-gray-300 border border-gray-600" 
                      : "bg-gray-100 text-gray-700 border border-gray-300"}`}
                >
                  <span>Dakuten</span>
                  {settings.includeTenten && <Check className="w-3 h-3" />}
                </button>
                <button
                  onClick={() => setSettings((s) => ({ ...s, includeMaru: !s.includeMaru }))}
                  className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 text-xs ${settings.includeMaru 
                    ? "bg-green-100 text-green-800 border border-green-300" 
                    : darkMode 
                      ? "bg-gray-700 text-gray-300 border border-gray-600" 
                      : "bg-gray-100 text-gray-700 border border-gray-300"}`}
                >
                  <span>Handakuten</span>
                  {settings.includeMaru && <Check className="w-3 h-3" />}
                </button>
                <button
                  onClick={() => setSettings((s) => ({ ...s, includeCombo: !s.includeCombo }))}
                  className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 text-xs ${settings.includeCombo 
                    ? "bg-green-100 text-green-800 border border-green-300" 
                    : darkMode 
                      ? "bg-gray-700 text-gray-300 border border-gray-600" 
                      : "bg-gray-100 text-gray-700 border border-gray-300"}`}
                >
                  <span>Combinations</span>
                  {settings.includeCombo && <Check className="w-3 h-3" />}
                </button>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className={`px-3 py-1.5 rounded-lg text-sm ${darkMode ? "bg-gray-700" : "bg-gray-100"}`}>
                <span className="font-medium">{selectedCharacters.length}</span> chars selected
              </div>
              <button
                onClick={handleStartQuiz}
                className="px-4 py-2.5 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold flex items-center justify-center gap-1.5 hover:from-blue-700 hover:to-purple-700 transition-all text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={selectedCharacters.length === 0}
              >
                <Play className="w-4 h-4" />
                Start Quiz ({selectedCharacters.length})
              </button>
            </div>
          </div>
        </div>

        {/* --- Active Row Card Grid --- */}
        {activeRowId && (
          <div className={`rounded-lg p-3 sm:p-4 mb-6 ${darkMode ? "bg-gray-800" : "bg-white shadow-sm"}`}>
            {/* Header with score */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div>
                <h3 className="text-xl sm:text-2xl font-bold">
                  {rows.find((r) => r.id === activeRowId)?.name || "Row"}
                </h3>
                <p className={`text-xs sm:text-sm mt-1 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                  Practice these characters
                </p>
              </div>
              
              {/* Score display */}
              <div className="flex items-center gap-3">
                <div className={`px-4 py-2 rounded-lg flex flex-col items-center ${practiceScore.correct === practiceScore.total && practiceScore.total > 0 
                  ? "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white" 
                  : darkMode 
                    ? "bg-gray-700 text-gray-300" 
                    : "bg-blue-50 text-blue-700"}`}
                >
                  <div className="flex items-center gap-2">
                    <Award className="w-5 h-5" />
                    <span className="font-bold text-xl">
                      {practiceScore.correct}/{practiceScore.total}
                    </span>
                  </div>
                  {practiceScore.total > 0 && (
                    <div className="text-xs mt-1 font-medium">
                      {Math.round((practiceScore.correct / practiceScore.total) * 100)}% Complete
                    </div>
                  )}
                </div>
                
                <div className="flex gap-2">
                  <button 
                    onClick={handleResetRow}
                    className={`px-3 py-1.5 rounded-lg font-medium text-sm flex items-center gap-1.5 ${darkMode 
                      ? "bg-gray-700 hover:bg-gray-600" 
                      : "bg-gray-100 hover:bg-gray-200 border border-gray-300"}`}
                  >
                    <RotateCcw className="w-3 h-3" />
                    Reset
                  </button>
                  <button 
                    onClick={handleCloseRowView}
                    className={`px-3 py-1.5 rounded-lg font-medium text-sm ${darkMode 
                      ? "bg-gray-700 hover:bg-gray-600" 
                      : "bg-gray-100 hover:bg-gray-200 border border-gray-300"}`}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>

            {/* Cards grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
              {charsForRow(activeRowId).map((ch) => {
                const state = cardAnswers[ch.symbol] || { answer: "", isCorrect: null, tried: false };
                const isCorrect = state.isCorrect === true;
                const isIncorrect = state.isCorrect === false;
                const isCompleted = state.tried && state.isCorrect;

                return (
                  <div
                    key={ch.symbol}
                    className={`relative rounded-xl p-3 flex flex-col items-center justify-between transition-all duration-200 min-h-[140px] sm:min-h-[160px] ${
                      isCorrect 
                        ? "bg-gradient-to-br from-emerald-500 to-emerald-600 shadow-lg transform scale-[1.02]" 
                        : isIncorrect
                          ? "bg-gradient-to-br from-red-500 to-red-600"
                          : "bg-gradient-to-br from-blue-500 to-blue-600"
                    }`}
                  >
                    {/* Kana symbol */}
                    <div className="flex-1 w-full flex items-center justify-center">
                      <div className="text-4xl sm:text-5xl font-bold text-white select-none">
                        {ch.symbol}
                      </div>
                    </div>

                    {/* Answer section */}
                    <div className="w-full mt-3">
                      {isCompleted ? (
                        // Completed state - show correct answer
                        <div className="bg-white/20 backdrop-blur-sm rounded-lg p-2">
                          <div className="text-center">
                            <div className="flex items-center justify-center gap-1 text-white mb-1">
                              <CheckCircle className="w-4 h-4" />
                              <span className="text-sm font-medium">Correct!</span>
                            </div>
                            <div className="text-white text-xs">
                              Romaji: <span className="font-bold">{ch.romaji}</span>
                            </div>
                          </div>
                        </div>
                      ) : (
                        // Input state
                        <>
                          <div className="bg-white rounded-lg p-1.5 flex items-center gap-1.5">
                            <input
                              ref={(el) => (inputRefs.current[ch.symbol] = el)}
                              value={state.answer}
                              onChange={(e) => {
                                setCardAnswers((prev) => ({
                                  ...prev,
                                  [ch.symbol]: { 
                                    ...(prev[ch.symbol] || { answer: "", isCorrect: null, tried: false }), 
                                    answer: e.target.value 
                                  },
                                }));
                              }}
                              onKeyDown={(e) => handleCardInputKey(e as React.KeyboardEvent<HTMLInputElement>, ch.symbol)}
                              className="flex-1 outline-none text-sm sm:text-base text-gray-900 bg-transparent min-w-0"
                              placeholder="Type romaji"
                              aria-label={`Enter romaji for ${ch.symbol}`}
                              disabled={isCorrect}
                              readOnly={isCorrect}
                              autoComplete="off"
                            />
                            {/* Mobile only Check button - hidden on sm screens and above */}
                            <button
                              onClick={() => {
                                checkCardAnswer(ch.symbol);
                                focusNextInput(ch.symbol);
                              }}
                              className="sm:hidden px-2 py-1 rounded bg-blue-600 text-white text-xs font-medium hover:bg-blue-700 transition-colors min-w-[60px]"
                            >
                              Check
                            </button>
                          </div>

                          {/* Feedback */}
                          {state.tried && (
                            <div className="mt-1.5 text-xs min-h-[20px]">
                              {isCorrect && (
                                <div className="flex items-center gap-1 text-emerald-100">
                                  <CheckCircle className="w-3 h-3" />
                                  <span>Perfect!</span>
                                </div>
                              )}
                              {isIncorrect && (
                                <div className="flex items-center gap-1 text-red-100">
                                  <XCircle className="w-3 h-3" />
                                  <span>Answer: <span className="font-bold ml-1">{ch.romaji}</span></span>
                                </div>
                              )}
                            </div>
                          )}
                        </>
                      )}
                    </div>

                    {/* Correct badge */}
                    {isCorrect && (
                      <div className="absolute top-2 right-2">
                        <div className="bg-emerald-500 text-white p-1 rounded-full">
                          <Check className="w-3 h-3" />
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            
            {/* Completion Message */}
            {practiceScore.correct === practiceScore.total && practiceScore.total > 0 && (
              <div className={`mt-4 p-4 rounded-lg text-center animate-pulse ${darkMode ? "bg-gradient-to-r from-emerald-700 to-emerald-800" : "bg-gradient-to-r from-emerald-400 to-emerald-500"}`}>
                <div className="flex flex-col items-center">
                  <Award className="w-10 h-10 text-white mb-2" />
                  <h4 className="text-xl font-bold text-white mb-1">🎉 Perfect Score!</h4>
                  <p className="text-white text-sm">
                    You've correctly answered all {practiceScore.total} characters!
                  </p>
                  <p className="text-white/90 text-xs mt-1">
                    Click Reset to practice again or Close to return
                  </p>
                </div>
              </div>
            )}
            
            {/* Instructions */}
            <div className={`mt-4 p-3 rounded-lg ${darkMode ? "bg-gray-700" : "bg-blue-50"}`}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <p className={`text-xs ${darkMode ? "text-gray-300" : "text-blue-700"}`}>
                  <span className="font-medium">💡 Keyboard shortcuts:</span>
                  <span className="ml-1">Enter to check and move to next</span>
                  <span className="mx-2">•</span>
                  <span>Tab/Shift+Tab to navigate</span>
                </p>
                <div className="sm:hidden text-xs text-gray-500">
                  Tap Check button on mobile
                </div>
              </div>
            </div>
          </div>
        )}

        {step === "quiz" && (
  <QuizPage
    questions={questions}
    onFinish={(result) => {
      setQuizResults(result);
      setStep("result");
    }}
  />
)}


        {/* Instruction helper when no active row */}
        {!activeRowId && (
          <div className={`rounded-lg p-4 text-center ${darkMode ? "bg-gray-800 border border-gray-700" : "bg-white border border-gray-200 shadow-sm"}`}>
            <Grid3x3 className="w-10 h-10 mx-auto mb-2 text-gray-400" />
            <h3 className="text-base font-medium mb-1">Ready to Practice?</h3>
            <p className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-600"} mb-3`}>
              {selectedCharacters.length > 0 ? (
                <>You have selected <span className="font-bold">{selectedCharacters.length}</span> characters from <span className="font-bold">{selectedRows.length}</span> rows.</>
              ) : (
                <>Click any row above to practice its characters.</>
              )}
            </p>
            <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg ${darkMode ? "bg-gray-700" : "bg-gray-100"}`}>
              <BookOpen className="w-3 h-3" />
              <span className="text-xs">{selectedRows.length} rows selected</span>
            </div>
            {selectedCharacters.length > 0 && (
              <div className="mt-3">
                <button
                  onClick={handleStartQuiz}
                  className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium flex items-center justify-center gap-1.5 mx-auto hover:from-blue-700 hover:to-purple-700 transition-all text-sm"
                >
                  <Play className="w-3 h-3" />
                  Start Quiz with {selectedCharacters.length} characters
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default KanaQuiz;