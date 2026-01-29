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
  ChevronRight,
  Search,
  Filter,
  Zap,
  Target,
  BarChart3,
  HelpCircle,
  Volume2,
  Eye,
  EyeOff,
  ChevronDown,
  ChevronUp,
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

const [darkMode, setDarkMode] = useState<boolean>(() => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("kanaDarkMode") === "true";
  }
  return false;
});

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

  // Multi-row practice state
  const [isPracticing, setIsPracticing] = useState(false);
  const [practiceChars, setPracticeChars] = useState<KanaCharacter[]>([]);

  // per-card inline evaluation
  const [cardAnswers, setCardAnswers] = useState<
    Record<string, { answer: string; isCorrect: boolean | null; tried: boolean }>
  >({});

  // Track practice score for current practice set
  const [practiceScore, setPracticeScore] = useState({ correct: 0, total: 0 });

  // Search and filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [showRomanji, setShowRomanji] = useState(true);
  const [expandedSection, setExpandedSection] = useState<"main" | "dakuten" | "combo" | null>("main");

  const inputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  // Persist dark mode preference
  useEffect(() => {
    localStorage.setItem('kanaDarkMode', darkMode.toString());
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Check if mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
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
        const validSelectedRows = selectedRows.filter((rowId) =>
          r.some((row) => row.id === rowId)
        );
        if (validSelectedRows.length === 0) {
          setSelectedRows(["basic"]);
        } else {
          setSelectedRows(validSelectedRows);
        }

        // reset practice state when kana type changes
        setActiveRowId(null);
        setIsPracticing(false);
        setPracticeChars([]);
        setCardAnswers({});
        setPracticeScore({ correct: 0, total: 0 });
      } catch (err) {
        console.error("fetch kana error", err);
      } finally {
        setIsLoading(false);
      }
    };
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settings.kanaType]);

  // Update score when card answers or practice set changes
  useEffect(() => {
    const chars = getCurrentPracticeChars();
    const total = chars.length;
    const correct = Object.values(cardAnswers).filter((a) => a.isCorrect === true).length;
    setPracticeScore({ correct, total });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cardAnswers, activeRowId, isPracticing, practiceChars]);

  // Filter rows based on search query
  const filteredRows = rows.filter(row => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      row.name.toLowerCase().includes(query) ||
      row.id.toLowerCase().includes(query) ||
      row.chars.some(char => 
        allKana.find(k => k.symbol === char)?.romaji.toLowerCase().includes(query)
      )
    );
  });

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

  // Return the current practice character list (single row or multi-row)
  const getCurrentPracticeChars = (): KanaCharacter[] => {
    if (isPracticing) return practiceChars;
    if (activeRowId) return charsForRow(activeRowId);
    return [];
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

  // when user clicks a small row button to inspect, open single-row activeRow view (cards)
  const handleOpenRow = (rowId: string) => {
    const available = (() => {
      const row = rows.find((r) => r.id === rowId);
      if (!row) return false;
      if (rowId.includes("tenten") && !settings.includeTenten) return false;
      if (rowId.includes("maru") && !settings.includeMaru) return false;
      if (rowId.includes("combo") && !settings.includeCombo) return false;
      return true;
    })();
    if (!available) {
      if (rowId.includes("tenten")) {
        setSettings(s => ({ ...s, includeTenten: true }));
      } else if (rowId.includes("maru")) {
        setSettings(s => ({ ...s, includeMaru: true }));
      } else if (rowId.includes("combo")) {
        setSettings(s => ({ ...s, includeCombo: true }));
      }
    }

    // Close multi-row practice if open
    setIsPracticing(false);
    setPracticeChars([]);

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

  // Start practicing all selected rows together
  const handlePracticeSelected = () => {
    const chars = getSelectedCharacters();

    if (chars.length === 0) {
      alert("Select at least one row to practice");
      return;
    }

    // Close single-row view if open
    setActiveRowId(null);

    setIsPracticing(true);
    setPracticeChars(chars);

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

  const handleClosePractice = () => {
    setIsPracticing(false);
    setPracticeChars([]);
    setCardAnswers({});
    setPracticeScore({ correct: 0, total: 0 });
  };

  // Reset current practice (single row or multi-row)
  const handleResetPractice = () => {
    const chars = getCurrentPracticeChars();
    if (!chars || chars.length === 0) return;

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
        tried: true,
      },
    }));

    // Auto-focus next input if correct
    if (correct) {
      setTimeout(() => {
        focusNextInput(symbol);
      }, 300);
    }
  };

  // Auto-focus on next empty input
  const focusNextInput = (currentSymbol: string) => {
    const chars = getCurrentPracticeChars();
    const currentIndex = chars.findIndex((c) => c.symbol === currentSymbol);

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
      const allCorrect = chars.every((c) => cardAnswers[c.symbol]?.isCorrect === true);
      if (allCorrect) {
        // completion - could show toast here
      }
    }
  };

  const handleCardInputKey = (e: React.KeyboardEvent<HTMLInputElement>, symbol: string) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const attempt = (cardAnswers[symbol]?.answer || "").trim();
      if (!attempt) return;

      checkCardAnswer(symbol);

      setTimeout(() => {
        focusNextInput(symbol);
      }, 100);
    }

    // Tab key navigation
    if (e.key === "Tab") {
      e.preventDefault();
      if (!e.shiftKey) {
        focusNextInput(symbol);
      } else {
        const chars = getCurrentPracticeChars();
        const currentIndex = chars.findIndex((c) => c.symbol === symbol);

        if (currentIndex > 0) {
          for (let i = currentIndex - 1; i >= 0; i--) {
            const prevSymbol = chars[i].symbol;
            const prevState = cardAnswers[prevSymbol];

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
        "No characters found.\n" + "Enable Dakuten / Handakuten / Combinations if required."
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

    const generatedQuestions = kanaQuizService.generateQuizQuestions(finalSettings, selectedChars);

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
    const allCurrentlySelected = allRowIds.every((id) => selectedRows.includes(id));
    if (allCurrentlySelected) {
      setSelectedRows(["basic"]);
      setActiveRowId(null);
      setIsPracticing(false);
    } else {
      setSelectedRows(allRowIds);
      setActiveRowId(null);
      setIsPracticing(false);
    }
  };

  // UI helpers to split rows into Main / Dakuten / Combination columns
  const mainRows = rows.filter((r) => !/tenten|maru|combo/i.test(r.id));
  const dakutenRows = rows.filter((r) => /tenten|maru/i.test(r.id));
  const comboRows = rows.filter((r) => /combo/i.test(r.id));

  // Toggle all rows for a specific category
  const toggleAllMainRows = () => {
    const allMainIds = mainRows.map((r) => r.id);
    const areAllSelected = allMainIds.every((id) => selectedRows.includes(id));

    if (areAllSelected) {
      setSelectedRows((prev) => prev.filter((id) => !allMainIds.includes(id)));
      if (selectedRows.length === allMainIds.length) {
        setSelectedRows(["basic"]);
      }
    } else {
      setSelectedRows((prev) => Array.from(new Set([...prev, ...allMainIds])));
    }
  };

  const toggleAllDakutenRows = () => {
    const allDakutenIds = dakutenRows
      .filter((r) => {
        if (r.id.includes("tenten")) return settings.includeTenten;
        if (r.id.includes("maru")) return settings.includeMaru;
        return true;
      })
      .map((r) => r.id);

    if (allDakutenIds.length === 0) {
      alert("Please enable Dakuten or Handakuten options first");
      return;
    }

    const areAllSelected = allDakutenIds.every((id) => selectedRows.includes(id));

    if (areAllSelected) {
      setSelectedRows((prev) => prev.filter((id) => !allDakutenIds.includes(id)));
    } else {
      setSelectedRows((prev) => Array.from(new Set([...prev, ...allDakutenIds])));
    }
  };

  const toggleAllComboRows = () => {
    if (!settings.includeCombo) {
      alert("Please enable Combinations option first");
      return;
    }

    const allComboIds = comboRows.map((r) => r.id);

    if (allComboIds.length === 0) {
      alert("No combination rows available");
      return;
    }

    const areAllSelected = allComboIds.every((id) => selectedRows.includes(id));

    if (areAllSelected) {
      setSelectedRows((prev) => prev.filter((id) => !allComboIds.includes(id)));
    } else {
      setSelectedRows((prev) => Array.from(new Set([...prev, ...allComboIds])));
    }
  };

  if (isLoading) {
    return (
      <div className={`min-h-screen flex items-center justify-center p-4 transition-colors duration-200 ${darkMode ? "bg-gradient-to-br from-gray-900 to-gray-800" : "bg-gradient-to-br from-blue-50 to-white"}`}>
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-300 border-t-blue-600 rounded-full animate-spin mx-auto" />
          <p className={`mt-4 text-lg font-medium ${darkMode ? "text-gray-300" : "text-gray-700"}`}>Loading Kana Characters...</p>
          <p className={`mt-2 text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Please wait a moment</p>
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

  const isAllSelected = allAvailableRowIds.every((id) => selectedRows.includes(id));

  return (
    <div className={`min-h-screen transition-colors duration-200 ${darkMode ? "bg-gradient-to-br from-gray-900 to-gray-800 text-gray-100" : "bg-gradient-to-br from-blue-50 to-white text-gray-900"}`}>
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-4">
        {/* Top Navigation Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Kana Master
              </h1>
              <p className={`text-xs sm:text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                Learn Japanese characters through interactive practice
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Search Bar */}
            <div className={`relative flex-1 max-w-xs ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4" />
              <input
                type="text"
                placeholder="Search rows..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full pl-10 pr-4 py-2 rounded-xl text-sm border ${darkMode ? "bg-gray-800 border-gray-700 placeholder-gray-500" : "bg-white border-gray-300 placeholder-gray-400"}`}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Settings Button */}
            <button
              onClick={() => setDarkMode((d) => !d)}
              className={`p-3 rounded-xl transition-all duration-200 ${darkMode ? "bg-gray-800 hover:bg-gray-700 text-yellow-400" : "bg-white hover:bg-gray-50 text-gray-700 shadow-sm"}`}
              title="Toggle dark mode"
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Kana Type Selector */}
        <div className={`rounded-2xl p-6 mb-8 ${darkMode ? "bg-gray-800/50 backdrop-blur-sm" : "bg-white/80 backdrop-blur-sm shadow-lg"}`}>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex-1">
              <h2 className="text-xl font-bold mb-3 flex items-center gap-2">
                <span className="p-2 rounded-lg bg-blue-100 text-blue-600">
                  <Target className="w-5 h-5" />
                </span>
                Select Kana Type
              </h2>
              <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                Choose between Hiragana and Katakana to practice
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setSettings((s) => ({ ...s, kanaType: "hiragana" }))}
                className={`flex-1 min-w-[140px] px-6 py-3 rounded-xl font-semibold flex items-center justify-center gap-3 transition-all duration-300 ${settings.kanaType === "hiragana"
                  ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg scale-105"
                  : darkMode
                    ? "bg-gray-700 hover:bg-gray-600"
                    : "bg-gray-100 hover:bg-gray-200"}`}
              >
                <span className="text-2xl font-bold">あ</span>
                <span>Hiragana</span>
              </button>
              <button
                onClick={() => setSettings((s) => ({ ...s, kanaType: "katakana" }))}
                className={`flex-1 min-w-[140px] px-6 py-3 rounded-xl font-semibold flex items-center justify-center gap-3 transition-all duration-300 ${settings.kanaType === "katakana"
                  ? "bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-lg scale-105"
                  : darkMode
                    ? "bg-gray-700 hover:bg-gray-600"
                    : "bg-gray-100 hover:bg-gray-200"}`}
              >
                <span className="text-2xl font-bold">ア</span>
                <span>Katakana</span>
              </button>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Main Kana Column */}
          <div className={`rounded-2xl p-5 ${darkMode ? "bg-gray-800/50 backdrop-blur-sm border border-gray-700" : "bg-white/80 backdrop-blur-sm shadow-lg border border-gray-100"}`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <span className="p-2 rounded-lg bg-green-100 text-green-600">
                  <BookOpen className="w-4 h-4" />
                </span>
                Main Kana
              </h3>
              <button
                onClick={() => setExpandedSection(expandedSection === "main" ? null : "main")}
                className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
              >
                {expandedSection === "main" ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </button>
            </div>
            
            <button
              onClick={toggleAllMainRows}
              className={`w-full py-3 rounded-xl mb-4 text-center font-medium transition-all ${mainRows.every(r => selectedRows.includes(r.id))
                ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-md"
                : darkMode
                  ? "bg-gray-700 hover:bg-gray-600"
                  : "bg-blue-50 hover:bg-blue-100"}`}
            >
              {mainRows.every(r => selectedRows.includes(r.id)) 
                ? '✓ All Main Kana Selected' 
                : 'Select All Main Kana'}
            </button>

            <div className={`grid grid-cols-2 gap-3 ${expandedSection === "main" ? "block" : "hidden"}`}>
              {mainRows.map((r) => {
                const char = allKana.find((c) => c.symbol === r.chars[0]);
                const isSelected = selectedRows.includes(r.id);

                return (
                  <div
                    key={r.id}
                    onClick={() => handleRowToggle(r.id)}
                    className={`group relative p-4 rounded-xl cursor-pointer transition-all duration-200 hover:scale-[1.02] ${isSelected
                      ? darkMode
                        ? "bg-gradient-to-br from-blue-900/80 to-blue-800/80 border-2 border-blue-500"
                        : "bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-500 shadow-md"
                      : darkMode
                        ? "bg-gray-700/50 hover:bg-gray-600/50 border border-gray-600"
                        : "bg-white hover:bg-gray-50 border border-gray-200"
                    }`}
                  >
                    {isSelected && (
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between">
                      <div className="text-3xl font-bold">
                        {r.chars[0]}
                      </div>
                      
                      <div className="text-right">
                        <div className="text-sm font-medium">{r.name}</div>
                        {showRomanji && char && (
                          <div className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                            {char.romaji}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex justify-between items-center mt-3">
                      <span className={`text-xs px-2 py-1 rounded ${darkMode ? "bg-gray-600" : "bg-gray-100"}`}>
                        {r.chars.length} chars
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenRow(r.id);
                        }}
                        className="px-3 py-1.5 text-xs font-medium rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 transition-all"
                      >
                        Practice
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Dakuten Column */}
          <div className={`rounded-2xl p-5 ${darkMode ? "bg-gray-800/50 backdrop-blur-sm border border-gray-700" : "bg-white/80 backdrop-blur-sm shadow-lg border border-gray-100"}`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <span className="p-2 rounded-lg bg-yellow-100 text-yellow-600">
                  <Filter className="w-4 h-4" />
                </span>
                Dakuten Kana
              </h3>
              <button
                onClick={() => setExpandedSection(expandedSection === "dakuten" ? null : "dakuten")}
                className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
              >
                {expandedSection === "dakuten" ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </button>
            </div>

            <button
              onClick={toggleAllDakutenRows}
              className={`w-full py-3 rounded-xl mb-4 text-center font-medium transition-all ${dakutenRows.filter(r => {
                if (r.id.includes("tenten")) return settings.includeTenten;
                if (r.id.includes("maru")) return settings.includeMaru;
                return true;
              }).every(r => selectedRows.includes(r.id))
                ? "bg-gradient-to-r from-yellow-500 to-orange-600 text-white shadow-md"
                : darkMode
                  ? "bg-gray-700 hover:bg-gray-600"
                  : "bg-yellow-50 hover:bg-yellow-100"}`}
            >
              {dakutenRows.filter(r => {
                if (r.id.includes("tenten")) return settings.includeTenten;
                if (r.id.includes("maru")) return settings.includeMaru;
                return true;
              }).every(r => selectedRows.includes(r.id)) 
                ? '✓ All Dakuten Selected' 
                : 'Select All Dakuten'}
            </button>

            <div className={`grid grid-cols-1 gap-3 ${expandedSection === "dakuten" ? "block" : "hidden"}`}>
              {dakutenRows.map((r) => {
                const char = allKana.find((c) => c.symbol === r.chars[0]);
                const isAvailable = !r.id.includes("tenten") ? true : settings.includeTenten || settings.includeMaru;
                const isSelected = selectedRows.includes(r.id);

                return (
                  <button
                    key={r.id}
                    onClick={() => {
                      if (!isAvailable) {
                        if (r.id.includes("tenten")) {
                          setSettings(s => ({ ...s, includeTenten: true }));
                        } else if (r.id.includes("maru")) {
                          setSettings(s => ({ ...s, includeMaru: true }));
                        }
                        return;
                      }
                      handleRowToggle(r.id);
                    }}
                    disabled={!isAvailable}
                    className={`group relative p-4 rounded-xl text-left transition-all duration-200 hover:scale-[1.02] ${isSelected
                      ? darkMode
                        ? "bg-gradient-to-br from-yellow-900/80 to-yellow-800/80 border-2 border-yellow-500"
                        : "bg-gradient-to-br from-yellow-50 to-yellow-100 border-2 border-yellow-500 shadow-md"
                      : darkMode
                        ? "bg-gray-700/50 hover:bg-gray-600/50 border border-gray-600"
                        : "bg-white hover:bg-gray-50 border border-gray-200"
                    } ${!isAvailable ? "opacity-50 cursor-not-allowed" : ""}`}
                  >
                    {!isAvailable && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-xl">
                        <Lock className="w-5 h-5 text-white" />
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between">
                      <div className="text-3xl font-bold">{r.chars[0]}</div>
                      <div className="text-right">
                        <div className="text-sm font-medium">{r.name}</div>
                        {showRomanji && char && (
                          <div className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                            {char.romaji}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center mt-3">
                      <span className={`text-xs px-2 py-1 rounded ${darkMode ? "bg-gray-600" : "bg-gray-100"}`}>
                        {r.chars.length} chars
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (isAvailable) handleOpenRow(r.id);
                        }}
                        className={`px-3 py-1.5 text-xs font-medium rounded-lg ${isAvailable
                          ? "bg-gradient-to-r from-yellow-500 to-orange-600 text-white hover:from-yellow-600 hover:to-orange-700"
                          : "bg-gray-300 text-gray-500 cursor-not-allowed"}`}
                        disabled={!isAvailable}
                      >
                        Practice
                      </button>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Combination Column */}
          <div className={`rounded-2xl p-5 ${darkMode ? "bg-gray-800/50 backdrop-blur-sm border border-gray-700" : "bg-white/80 backdrop-blur-sm shadow-lg border border-gray-100"}`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <span className="p-2 rounded-lg bg-purple-100 text-purple-600">
                  <Zap className="w-4 h-4" />
                </span>
                Combination Kana
              </h3>
              <button
                onClick={() => setExpandedSection(expandedSection === "combo" ? null : "combo")}
                className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
              >
                {expandedSection === "combo" ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </button>
            </div>

            <button
              onClick={toggleAllComboRows}
              className={`w-full py-3 rounded-xl mb-4 text-center font-medium transition-all ${comboRows.filter(() => settings.includeCombo).every(r => selectedRows.includes(r.id))
                ? "bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-md"
                : darkMode
                  ? "bg-gray-700 hover:bg-gray-600"
                  : "bg-purple-50 hover:bg-purple-100"}`}
            >
              {comboRows.filter(() => settings.includeCombo).every(r => selectedRows.includes(r.id))
                ? '✓ All Combinations Selected'
                : 'Select All Combinations'}
            </button>

            <div className={`grid grid-cols-2 gap-3 ${expandedSection === "combo" ? "block" : "hidden"}`}>
              {comboRows.map((r) => {
                const char = allKana.find((c) => c.symbol === r.chars[0]);
                const isAvailable = settings.includeCombo;
                const isSelected = selectedRows.includes(r.id);

                return (
                  <button
                    key={r.id}
                    onClick={() => {
                      if (!isAvailable) {
                        setSettings(s => ({ ...s, includeCombo: true }));
                        return;
                      }
                      handleRowToggle(r.id);
                    }}
                    disabled={!isAvailable}
                    className={`group relative p-4 rounded-xl text-left transition-all duration-200 hover:scale-[1.02] ${isSelected
                      ? darkMode
                        ? "bg-gradient-to-br from-purple-900/80 to-purple-800/80 border-2 border-purple-500"
                        : "bg-gradient-to-br from-purple-50 to-purple-100 border-2 border-purple-500 shadow-md"
                      : darkMode
                        ? "bg-gray-700/50 hover:bg-gray-600/50 border border-gray-600"
                        : "bg-white hover:bg-gray-50 border border-gray-200"
                    } ${!isAvailable ? "opacity-50 cursor-not-allowed" : ""}`}
                  >
                    {!isAvailable && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-xl">
                        <Lock className="w-5 h-5 text-white" />
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between">
                      <div className="text-3xl font-bold">{r.chars[0]}</div>
                      <div className="text-right">
                        <div className="text-sm font-medium">{r.name}</div>
                        {showRomanji && char && (
                          <div className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                            {char.romaji}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center mt-3">
                      <span className={`text-xs px-2 py-1 rounded ${darkMode ? "bg-gray-600" : "bg-gray-100"}`}>
                        {r.chars.length} chars
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (isAvailable) handleOpenRow(r.id);
                        }}
                        className={`px-3 py-1.5 text-xs font-medium rounded-lg ${isAvailable
                          ? "bg-gradient-to-r from-purple-500 to-pink-600 text-white hover:from-purple-600 hover:to-pink-700"
                          : "bg-gray-300 text-gray-500 cursor-not-allowed"}`}
                        disabled={!isAvailable}
                      >
                        Practice
                      </button>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Control Panel */}
        <div className={`rounded-2xl p-6 mb-8 ${darkMode ? "bg-gray-800/50 backdrop-blur-sm border border-gray-700" : "bg-white/80 backdrop-blur-sm shadow-lg border border-gray-100"}`}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left: Stats & Settings */}
            <div className="space-y-4">
              <div>
                <h4 className="font-bold mb-3 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Statistics
                </h4>
                <div className="space-y-2">
                  <div className={`flex justify-between items-center p-3 rounded-lg ${darkMode ? "bg-gray-700/50" : "bg-blue-50"}`}>
                    <span>Selected Rows</span>
                    <span className="font-bold text-lg">{selectedRows.length}</span>
                  </div>
                  <div className={`flex justify-between items-center p-3 rounded-lg ${darkMode ? "bg-gray-700/50" : "bg-green-50"}`}>
                    <span>Total Characters</span>
                    <span className="font-bold text-lg">{selectedCharacters.length}</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-bold mb-3 flex items-center gap-2">
                  <Eye className="w-5 h-5" />
                  Display Options
                </h4>
                <div className="space-y-2">
                  <button
                    onClick={() => setShowRomanji(!showRomanji)}
                    className={`w-full flex items-center justify-between p-3 rounded-lg ${darkMode ? "bg-gray-700/50 hover:bg-gray-600/50" : "bg-gray-50 hover:bg-gray-100"}`}
                  >
                    <span>Show Romaji</span>
                    {showRomanji ? <Eye className="w-5 h-5 text-blue-500" /> : <EyeOff className="w-5 h-5 text-gray-400" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Center: Feature Toggles */}
            <div>
              <h4 className="font-bold mb-3 flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Include Options
              </h4>
              <div className="space-y-3">
                <button
                  onClick={() => setSettings((s) => ({ ...s, includeTenten: !s.includeTenten }))}
                  className={`w-full flex items-center justify-between p-3 rounded-lg transition-all ${settings.includeTenten
                    ? "bg-gradient-to-r from-yellow-500 to-orange-500 text-white"
                    : darkMode
                      ? "bg-gray-700/50 hover:bg-gray-600/50"
                      : "bg-gray-50 hover:bg-gray-100"}`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded ${settings.includeTenten ? "bg-white/20" : "bg-gray-200 dark:bg-gray-600"}`}>
                      <span className="text-lg">が</span>
                    </div>
                    <div className="text-left">
                      <div className="font-medium">Dakuten</div>
                      <div className="text-xs opacity-80">Characters with ゛ mark</div>
                    </div>
                  </div>
                  {settings.includeTenten && <Check className="w-5 h-5" />}
                </button>

                <button
                  onClick={() => setSettings((s) => ({ ...s, includeMaru: !s.includeMaru }))}
                  className={`w-full flex items-center justify-between p-3 rounded-lg transition-all ${settings.includeMaru
                    ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white"
                    : darkMode
                      ? "bg-gray-700/50 hover:bg-gray-600/50"
                      : "bg-gray-50 hover:bg-gray-100"}`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded ${settings.includeMaru ? "bg-white/20" : "bg-gray-200 dark:bg-gray-600"}`}>
                      <span className="text-lg">ぱ</span>
                    </div>
                    <div className="text-left">
                      <div className="font-medium">Handakuten</div>
                      <div className="text-xs opacity-80">Characters with ゜ mark</div>
                    </div>
                  </div>
                  {settings.includeMaru && <Check className="w-5 h-5" />}
                </button>

                <button
                  onClick={() => setSettings((s) => ({ ...s, includeCombo: !s.includeCombo }))}
                  className={`w-full flex items-center justify-between p-3 rounded-lg transition-all ${settings.includeCombo
                    ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                    : darkMode
                      ? "bg-gray-700/50 hover:bg-gray-600/50"
                      : "bg-gray-50 hover:bg-gray-100"}`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded ${settings.includeCombo ? "bg-white/20" : "bg-gray-200 dark:bg-gray-600"}`}>
                      <span className="text-lg">きゃ</span>
                    </div>
                    <div className="text-left">
                      <div className="font-medium">Combinations</div>
                      <div className="text-xs opacity-80">Small ゃ, ゅ, ょ combinations</div>
                    </div>
                  </div>
                  {settings.includeCombo && <Check className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Right: Action Buttons */}
            <div className="space-y-4">
              <h4 className="font-bold mb-3 flex items-center gap-2">
                <Play className="w-5 h-5" />
                Actions
              </h4>
              
              <button
                onClick={handleSelectAllKana}
                className={`w-full p-4 rounded-xl flex items-center justify-center gap-3 font-semibold transition-all ${isAllSelected
                  ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg"
                  : darkMode
                    ? "bg-gray-700 hover:bg-gray-600"
                    : "bg-gray-100 hover:bg-gray-200"}`}
              >
                {isAllSelected ? <Check className="w-5 h-5" /> : <Star className="w-5 h-5" />}
                {isAllSelected ? "All Kana Selected" : "Select All Kana"}
              </button>

              <button
                onClick={handlePracticeSelected}
                disabled={selectedCharacters.length === 0}
                className="w-full p-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold flex items-center justify-center gap-3 hover:from-emerald-600 hover:to-teal-700 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <BookOpen className="w-5 h-5" />
                Practice ({selectedCharacters.length})
              </button>

              <button
                onClick={handleStartQuiz}
                disabled={selectedCharacters.length === 0}
                className="w-full p-4 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold flex items-center justify-center gap-3 hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Play className="w-5 h-5" />
                Start Quiz ({selectedCharacters.length})
              </button>

              <div className={`p-3 rounded-lg text-sm ${darkMode ? "bg-gray-700/50" : "bg-blue-50"}`}>
                <div className="flex items-center gap-2 mb-2">
                  <HelpCircle className="w-4 h-4" />
                  <span className="font-medium">Tip:</span>
                </div>
                <p className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                  Click "Practice" on individual rows for focused learning, or use "Practice Selected" for mixed review.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* --- Active Practice Section --- */}
        {(activeRowId || isPracticing) && (
          <div className={`rounded-2xl p-6 mb-8 ${darkMode ? "bg-gray-800/50 backdrop-blur-sm border border-gray-700" : "bg-white/80 backdrop-blur-sm shadow-lg border border-gray-100"}`}>
            {/* Header with score */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6">
              <div className="flex-1">
                <h3 className="text-2xl font-bold flex items-center gap-3">
                  {isPracticing ? (
                    <>
                      <BookOpen className="w-6 h-6 text-blue-500" />
                      Practice Session
                    </>
                  ) : (
                    <>
                      <Target className="w-6 h-6 text-green-500" />
                      {rows.find((r) => r.id === activeRowId)?.name || "Row Practice"}
                    </>
                  )}
                </h3>
                <p className={`text-sm mt-2 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                  {isPracticing
                    ? `Practicing ${selectedRows.length} rows • ${practiceChars.length} characters`
                    : "Practice each character by typing its romaji"}
                </p>
              </div>

              {/* Score display */}
              <div className="flex flex-col items-end gap-2">
                <div className={`px-6 py-3 rounded-xl ${practiceScore.correct === practiceScore.total && practiceScore.total > 0
                  ? "bg-gradient-to-r from-emerald-500 to-emerald-600 shadow-lg"
                  : darkMode
                    ? "bg-gray-700"
                    : "bg-blue-50"}`}
                >
                  <div className="flex items-center gap-3">
                    <Award className="w-6 h-6" />
                    <div className="text-center">
                      <div className="text-3xl font-bold">
                        {practiceScore.correct}<span className="text-lg opacity-80">/{practiceScore.total}</span>
                      </div>
                      {practiceScore.total > 0 && (
                        <div className="text-sm font-medium">
                          {Math.round((practiceScore.correct / practiceScore.total) * 100)}%
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={handleResetPractice}
                    className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 ${darkMode
                      ? "bg-gray-700 hover:bg-gray-600"
                      : "bg-gray-100 hover:bg-gray-200"}`}
                  >
                    <RotateCcw className="w-4 h-4" />
                    Reset
                  </button>
                  <button
                    onClick={() => {
                      if (isPracticing) handleClosePractice();
                      else handleCloseRowView();
                    }}
                    className={`px-4 py-2 rounded-lg font-medium ${darkMode
                      ? "bg-gray-700 hover:bg-gray-600"
                      : "bg-gray-100 hover:bg-gray-200"}`}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>

            {/* Progress bar */}
            {practiceScore.total > 0 && (
              <div className="mb-6">
                <div className="flex justify-between text-sm mb-1">
                  <span>Progress</span>
                  <span>{Math.round((practiceScore.correct / practiceScore.total) * 100)}%</span>
                </div>
                <div className={`h-2 rounded-full overflow-hidden ${darkMode ? "bg-gray-700" : "bg-gray-200"}`}>
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500"
                    style={{ width: `${(practiceScore.correct / practiceScore.total) * 100}%` }}
                  />
                </div>
              </div>
            )}

            {/* Cards grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {getCurrentPracticeChars().map((ch) => {
                const state = cardAnswers[ch.symbol] || { answer: "", isCorrect: null, tried: false };
                const isCorrect = state.isCorrect === true;
                const isIncorrect = state.isCorrect === false;
                const isCompleted = state.tried && state.isCorrect;

                return (
                  <div
                    key={ch.symbol}
                    className={`relative rounded-xl p-4 flex flex-col items-center justify-between transition-all duration-300 min-h-[160px] ${
                      isCorrect
                        ? "bg-gradient-to-br from-emerald-500 to-emerald-600 shadow-lg scale-[1.02] ring-2 ring-emerald-300 ring-offset-2"
                        : isIncorrect
                          ? "bg-gradient-to-br from-red-500 to-red-600 shadow-lg"
                          : "bg-gradient-to-br from-blue-500 to-blue-600 shadow-md"
                    }`}
                  >
                    {/* Kana symbol */}
                    <div className="flex-1 w-full flex items-center justify-center">
                      <div className="text-5xl font-bold text-white select-none">{ch.symbol}</div>
                    </div>

                    {/* Answer section */}
                    <div className="w-full mt-4">
                      {isCompleted ? (
                        <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3">
                          <div className="text-center">
                            <div className="flex items-center justify-center gap-2 text-white mb-2">
                              <CheckCircle className="w-5 h-5" />
                              <span className="text-sm font-bold">Correct!</span>
                            </div>
                            <div className="text-white text-sm">
                              Romaji: <span className="font-bold">{ch.romaji}</span>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="bg-white rounded-lg p-2 flex items-center gap-2">
                            <input
                              ref={(el) => (inputRefs.current[ch.symbol] = el)}
                              value={state.answer}
                              onChange={(e) => {
                                setCardAnswers((prev) => ({
                                  ...prev,
                                  [ch.symbol]: {
                                    ...(prev[ch.symbol] || { answer: "", isCorrect: null, tried: false }),
                                    answer: e.target.value,
                                  },
                                }));
                              }}
                              onKeyDown={(e) => handleCardInputKey(e as React.KeyboardEvent<HTMLInputElement>, ch.symbol)}
                              className="flex-1 outline-none text-base text-gray-900 bg-transparent min-w-0"
                              placeholder="Type romaji..."
                              aria-label={`Enter romaji for ${ch.symbol}`}
                              disabled={isCorrect}
                              readOnly={isCorrect}
                              autoComplete="off"
                            />
                            <button
                              onClick={() => {
                                checkCardAnswer(ch.symbol);
                                focusNextInput(ch.symbol);
                              }}
                              className="px-3 py-1.5 rounded bg-gradient-to-r from-blue-600 to-blue-700 text-white text-sm font-medium hover:from-blue-700 hover:to-blue-800 transition-colors"
                            >
                              Check
                            </button>
                          </div>

                          {/* Feedback */}
                          {state.tried && (
                            <div className="mt-2 text-sm min-h-[24px]">
                              {isCorrect && (
                                <div className="flex items-center gap-2 text-emerald-100 animate-pulse">
                                  <CheckCircle className="w-4 h-4" />
                                  <span>Perfect! Press Tab for next</span>
                                </div>
                              )}
                              {isIncorrect && (
                                <div className="flex items-center gap-2 text-red-100">
                                  <XCircle className="w-4 h-4" />
                                  <span>
                                    Answer: <span className="font-bold ml-1">{ch.romaji}</span>
                                  </span>
                                </div>
                              )}
                            </div>
                          )}
                        </>
                      )}
                    </div>

                    {/* Correct badge */}
                    {isCorrect && (
                      <div className="absolute top-2 right-2 animate-bounce">
                        <div className="bg-white text-emerald-600 p-1.5 rounded-full shadow-lg">
                          <Check className="w-4 h-4" />
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Completion Message */}
            {practiceScore.correct === practiceScore.total && practiceScore.total > 0 && (
              <div className={`mt-6 p-6 rounded-xl text-center animate-in slide-in-from-bottom ${darkMode ? "bg-gradient-to-r from-emerald-700 to-emerald-800" : "bg-gradient-to-r from-emerald-400 to-emerald-500"}`}>
                <div className="flex flex-col items-center">
                  <Award className="w-12 h-12 text-white mb-3" />
                  <h4 className="text-2xl font-bold text-white mb-2">🎉 Perfect Score!</h4>
                  <p className="text-white text-lg">You've mastered all {practiceScore.total} characters!</p>
                  <p className="text-white/90 text-sm mt-1">Excellent work! Keep practicing to retain your knowledge.</p>
                  <button
                    onClick={handleResetPractice}
                    className="mt-4 px-6 py-2 bg-white text-emerald-600 font-bold rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    Practice Again
                  </button>
                </div>
              </div>
            )}

            {/* Instructions */}
            <div className={`mt-6 p-4 rounded-lg ${darkMode ? "bg-gray-700" : "bg-blue-50"}`}>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div>
                  <p className={`text-sm font-medium mb-2 ${darkMode ? "text-gray-300" : "text-blue-700"}`}>
                    <span className="flex items-center gap-2">
                      <Volume2 className="w-4 h-4" />
                      How to practice:
                    </span>
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div className={`flex items-center gap-2 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                      <div className="w-6 h-6 rounded bg-blue-500 text-white flex items-center justify-center">1</div>
                      <span>Type the romaji for each character</span>
                    </div>
                    <div className={`flex items-center gap-2 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                      <div className="w-6 h-6 rounded bg-blue-500 text-white flex items-center justify-center">2</div>
                      <span>Press Enter or click Check to verify</span>
                    </div>
                    <div className={`flex items-center gap-2 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                      <div className="w-6 h-6 rounded bg-blue-500 text-white flex items-center justify-center">3</div>
                      <span>Use Tab/Shift+Tab to navigate quickly</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <span className="hidden sm:inline">Auto-focus enabled</span>
                  <div className={`w-2 h-2 rounded-full ${darkMode ? "bg-emerald-400" : "bg-emerald-500"} animate-pulse`}></div>
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

        {/* Welcome / Empty State */}
        {!activeRowId && !isPracticing && step === "setup" && (
          <div className={`rounded-2xl p-8 text-center ${darkMode ? "bg-gray-800/50 backdrop-blur-sm border border-gray-700" : "bg-white/80 backdrop-blur-sm shadow-lg border border-gray-100"}`}>
            <Grid3x3 className="w-16 h-16 mx-auto mb-4 text-blue-400" />
            <h3 className="text-2xl font-bold mb-3">Welcome to Kana Master! 👋</h3>
            <p className={`text-lg mb-6 max-w-2xl mx-auto ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
              Select kana rows from the columns above, then practice individual rows or start a quiz with your selected characters.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto mb-6">
              <div className={`p-4 rounded-xl text-left ${darkMode ? "bg-gray-700/50" : "bg-blue-50"}`}>
                <div className="w-10 h-10 rounded-lg bg-blue-500 text-white flex items-center justify-center mb-3">
                  <BookOpen className="w-5 h-5" />
                </div>
                <h4 className="font-bold mb-2">1. Select Kana</h4>
                <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                  Choose rows from Main, Dakuten, or Combination sections
                </p>
              </div>
              
              <div className={`p-4 rounded-xl text-left ${darkMode ? "bg-gray-700/50" : "bg-green-50"}`}>
                <div className="w-10 h-10 rounded-lg bg-green-500 text-white flex items-center justify-center mb-3">
                  <Target className="w-5 h-5" />
                </div>
                <h4 className="font-bold mb-2">2. Practice</h4>
                <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                  Click "Practice" on any row to focus on specific characters
                </p>
              </div>
              
              <div className={`p-4 rounded-xl text-left ${darkMode ? "bg-gray-700/50" : "bg-purple-50"}`}>
                <div className="w-10 h-10 rounded-lg bg-purple-500 text-white flex items-center justify-center mb-3">
                  <Play className="w-5 h-5" />
                </div>
                <h4 className="font-bold mb-2">3. Quiz Yourself</h4>
                <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                  Test your knowledge with randomized quizzes
                </p>
              </div>
            </div>

            {selectedCharacters.length > 0 ? (
              <div className="space-y-4">
                <div className={`inline-flex items-center gap-3 px-6 py-3 rounded-xl ${darkMode ? "bg-gray-700" : "bg-blue-50"}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${darkMode ? "bg-blue-600" : "bg-blue-500 text-white"}`}>
                    {selectedCharacters.length}
                  </div>
                  <div>
                    <div className="font-bold">Ready to practice!</div>
                    <div className="text-sm opacity-80">
                      {selectedRows.length} rows selected • {selectedCharacters.length} characters
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <button
                    onClick={handlePracticeSelected}
                    className="px-8 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold flex items-center justify-center gap-2 hover:from-emerald-600 hover:to-teal-700 transition-all shadow-lg"
                  >
                    <BookOpen className="w-5 h-5" />
                    Practice Selected Characters
                  </button>
                  <button
                    onClick={handleStartQuiz}
                    className="px-8 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold flex items-center justify-center gap-2 hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg"
                  >
                    <Play className="w-5 h-5" />
                    Start Quiz Now
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => {
                  // Auto-select basic row and open it
                  handleOpenRow('basic');
                }}
                className="px-8 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold flex items-center justify-center gap-2 hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg mx-auto"
              >
                <BookOpen className="w-5 h-5" />
                Start with Basic Hiragana
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default KanaQuiz;