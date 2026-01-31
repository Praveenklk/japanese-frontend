// src/pages/Vocabulary.tsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Search,
  Filter,
  Shuffle,
  BookOpen,
  Bookmark,
  Volume2,
  VolumeX,
  CheckCircle,
  XCircle,
  RefreshCw,
  Sparkles,
  TrendingUp,
  Hash,
  Layers,
  Award,
  Target,
  BarChart,
  GraduationCap,
  BookmarkCheck,
  Grid3x3,
  List,
  ChevronRight,
  Star,
  Mic,
  Flame,
  Trophy,
  Eye,
  Brain,
  Zap,
  Moon,
  Sun,
  Heart,
  Download,
  Upload,
  Share2,
  Menu,
  X,
  Play,
  HelpCircle,
  Clock,
  RotateCw,
  ChevronLeft,
  ChevronUp,
  ChevronDown,
  FileQuestion,

  Plus,
  Minus,
  Target as TargetIcon,
  AlertCircle,
  Award as AwardIcon,
  Timer,
  Check,
  X as XIcon,
  SkipForward,
  Home,
  Settings,
  PieChart,
  CardSim
} from "lucide-react";

// Types
type VocabularyItem = {
  word: string;
  meaning: string;
  furigana: string;
  romaji: string;
  level: number;
  example?: string;
  notes?: string;
};

type UserProgress = {
  learned: string[];
  bookmarked: string[];
  lastReviewed: Record<string, string>;
  quizScores: Record<string, number>;
  flashcardHistory: Record<string, { correct: number; wrong: number; lastSeen: string }>;
};

type QuizQuestion = {
  question: string;
  options: string[];
  correctAnswer: string;
  word: string;
  type: 'meaning' | 'reading' | 'word';
};

type FlashcardMode = 'meaning' | 'reading' | 'both';

// Storage utilities
const saveToStorage = (key: string, value: unknown) => {
  localStorage.setItem(key, JSON.stringify(value));
};

const loadFromStorage = <T,>(key: string, defaultValue: T): T => {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : defaultValue;
  } catch {
    return defaultValue;
  }
};

// Get JLPT color based on level
const getLevelColor = (level: number) => {
  switch (level) {
    case 5: return { bg: "bg-emerald-100", text: "text-emerald-700", border: "border-emerald-200", accent: "bg-emerald-500" };
    case 4: return { bg: "bg-blue-100", text: "text-blue-700", border: "border-blue-200", accent: "bg-blue-500" };
    case 3: return { bg: "bg-amber-100", text: "text-amber-700", border: "border-amber-200", accent: "bg-amber-500" };
    case 2: return { bg: "bg-orange-100", text: "text-orange-700", border: "border-orange-200", accent: "bg-orange-500" };
    case 1: return { bg: "bg-rose-100", text: "text-rose-700", border: "border-rose-200", accent: "bg-rose-500" };
    default: return { bg: "bg-gray-100", text: "text-gray-700", border: "border-gray-200", accent: "bg-gray-500" };
  }
};

const Vocabularynew: React.FC = () => {
  // State
  const [vocabulary, setVocabulary] = useState<VocabularyItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [levelFilter, setLevelFilter] = useState<"all" | number>("all");
  const [shuffleMode, setShuffleMode] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showBookmarked, setShowBookmarked] = useState(false);
  const [showLearned, setShowLearned] = useState(false);
  const [sortBy, setSortBy] = useState<"level" | "word" | "meaning">("level");
  const [showFurigana, setShowFurigana] = useState(true);
  const [showRomaji, setShowRomaji] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [expandedCard, setExpandedCard] = useState<string | null>(null);
  
  // User progress
  const [progress, setProgress] = useState<UserProgress>(() => 
    loadFromStorage("vocab_progress", {
      learned: [],
      bookmarked: [],
      lastReviewed: {},
      quizScores: {},
      flashcardHistory: {}
    })
  );
  
  // Voice synthesis
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const [voice, setVoice] = useState<SpeechSynthesisVoice | null>(null);
  const [speaking, setSpeaking] = useState<string | null>(null);
  const [muted, setMuted] = useState(false);

  // Quiz state
  const [quizMode, setQuizMode] = useState<"off" | "multiple-choice" | "flashcards">("off");
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [quizTime, setQuizTime] = useState(0);
  const [quizTimer, setQuizTimer] = useState<NodeJS.Timeout | null>(null);
  const [quizOptions, setQuizOptions] = useState({
    numberOfQuestions: 10,
    includeLearned: true,
    includeBookmarkedOnly: false,
    difficulty: 'mixed' as 'easy' | 'medium' | 'hard' | 'mixed'
  });

  // Flashcard state
  const [flashcardMode, setFlashcardMode] = useState<FlashcardMode>('meaning');
  const [flashcardIndex, setFlashcardIndex] = useState(0);
  const [flashcardFlipped, setFlashcardFlipped] = useState(false);
  const [flashcardStreak, setFlashcardStreak] = useState(0);
  const [flashcardQueue, setFlashcardQueue] = useState<VocabularyItem[]>([]);
  const [flashcardCorrect, setFlashcardCorrect] = useState<Set<string>>(new Set());
  const [flashcardWrong, setFlashcardWrong] = useState<Set<string>>(new Set());

  // Load vocabulary data
useEffect(() => {
  const loadData = async () => {
    try {
      const n4Module = await import("../Vocabulary/vocabularyN4.json");
      setVocabulary(n4Module.default); // 👈 JSON lives in `.default`
    } catch (error) {
      console.error("Error loading vocabulary:", error);

      // Fallback data
      setVocabulary([
        {
          word: "雲",
          meaning: "cloud",
          furigana: "くも",
          romaji: "kumo",
          level: 4,
          example: "今日は雲が多い。"
        },
        {
          word: "サンドイッチ",
          meaning: "sandwich",
          furigana: "",
          romaji: "sandoitchi",
          level: 4,
          example: "昼ごはんにサンドイッチを食べました。"
        },
        {
          word: "電気",
          meaning: "electricity, light",
          furigana: "でんき",
          romaji: "denki",
          level: 4,
          example: "電気をつけてください。"
        },
        {
          word: "旅行",
          meaning: "travel, trip",
          furigana: "りょこう",
          romaji: "ryokou",
          level: 4,
          example: "来月、日本へ旅行に行きます。"
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  loadData();
}, []);

  // Voice synthesis setup
  useEffect(() => {
    if (!("speechSynthesis" in window)) return;
    
    synthRef.current = window.speechSynthesis;
    
    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      const jaVoice = voices.find(v => v.lang.startsWith("ja"));
      setVoice(jaVoice ?? voices[0] ?? null);
    };
    
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
    
    return () => {
      if (synthRef.current?.speaking) {
        synthRef.current.cancel();
      }
      if (quizTimer) clearInterval(quizTimer);
    };
  }, []);

  // Save progress to localStorage
  useEffect(() => {
    saveToStorage("vocab_progress", progress);
  }, [progress]);

  // Filtered and sorted vocabulary
  const filteredVocabulary = useMemo(() => {
    let filtered = [...vocabulary];

    // Level filter
    if (levelFilter !== "all") {
      filtered = filtered.filter(item => item.level === levelFilter);
    }

    // Search filter
    if (search.trim()) {
      const query = search.toLowerCase().trim();
      filtered = filtered.filter(item =>
        item.word.toLowerCase().includes(query) ||
        item.meaning.toLowerCase().includes(query) ||
        item.furigana.toLowerCase().includes(query) ||
        item.romaji.toLowerCase().includes(query)
      );
    }

    // Bookmarked filter
    if (showBookmarked) {
      filtered = filtered.filter(item => progress.bookmarked.includes(item.word));
    }

    // Learned filter
    if (showLearned) {
      filtered = filtered.filter(item => progress.learned.includes(item.word));
    }

    // Sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "level":
          return a.level - b.level;
        case "word":
          return a.word.localeCompare(b.word);
        case "meaning":
          return a.meaning.localeCompare(b.meaning);
        default:
          return 0;
      }
    });

    // Shuffle
    if (shuffleMode) {
      for (let i = filtered.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [filtered[i], filtered[j]] = [filtered[j], filtered[i]];
      }
    }

    return filtered;
  }, [vocabulary, levelFilter, search, showBookmarked, showLearned, sortBy, shuffleMode, progress]);

  // Stats
const stats = useMemo(() => {
  const total = vocabulary.length;
  const learned = progress.learned?.length ?? 0;
  const bookmarked = progress.bookmarked?.length ?? 0;

  const levelCounts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  vocabulary.forEach(item => {
    levelCounts[item.level as keyof typeof levelCounts]++;
  });

  const quizScores = progress.quizScores ?? {};
  const flashcardHistory = progress.flashcardHistory ?? {};

  const totalQuizScore = Object.values(quizScores).reduce((a, b) => a + b, 0);
  const averageQuizScore =
    Object.keys(quizScores).length > 0
      ? Math.round(totalQuizScore / Object.keys(quizScores).length)
      : 0;

  const flashcardValues = Object.values(flashcardHistory);
  const totalFlashcards = flashcardValues.length;

  const masteredFlashcards = flashcardValues.filter(
    h => h.correct >= 3 && h.correct / (h.correct + h.wrong) >= 0.8
  ).length;

  return {
    total,
    learned,
    bookmarked,
    levelCounts,
    learnedPercentage: total > 0 ? Math.round((learned / total) * 100) : 0,
    averageQuizScore,
    totalQuizAttempts: Object.keys(quizScores).length,
    totalFlashcards,
    masteredFlashcards,
    masteryPercentage:
      totalFlashcards > 0
        ? Math.round((masteredFlashcards / totalFlashcards) * 100)
        : 0
  };
}, [vocabulary, progress]);

  // Generate quiz questions
  const generateQuizQuestions = useMemo(() => () => {
    let pool = [...filteredVocabulary];
    
    if (!quizOptions.includeLearned) {
      pool = pool.filter(item => !progress.learned.includes(item.word));
    }
    
    if (quizOptions.includeBookmarkedOnly) {
      pool = pool.filter(item => progress.bookmarked.includes(item.word));
    }
    
    if (pool.length === 0) {
      pool = [...filteredVocabulary];
    }
    
    // Limit pool size based on difficulty
    if (quizOptions.difficulty === 'easy') {
      pool = pool.filter(item => item.level >= 4);
    } else if (quizOptions.difficulty === 'hard') {
      pool = pool.filter(item => item.level <= 3);
    }
    
    const questions: QuizQuestion[] = [];
    const shuffledPool = [...pool].sort(() => Math.random() - 0.5);
    
    for (let i = 0; i < Math.min(quizOptions.numberOfQuestions, shuffledPool.length); i++) {
      const item = shuffledPool[i];
      const otherItems = shuffledPool.filter(it => it.word !== item.word);
      
      // Generate question types randomly
      const questionType = ['meaning', 'reading', 'word'][Math.floor(Math.random() * 3)] as 'meaning' | 'reading' | 'word';
      
      let question: QuizQuestion;
      
      switch (questionType) {
        case 'meaning':
          question = {
            question: `What does "${item.word}" mean?`,
            options: [
              item.meaning,
              ...otherItems.slice(0, 3).map(it => it.meaning)
            ].sort(() => Math.random() - 0.5),
            correctAnswer: item.meaning,
            word: item.word,
            type: 'meaning'
          };
          break;
          
        case 'reading':
          question = {
            question: `How do you read "${item.word}"?`,
            options: [
              item.furigana || item.romaji,
              ...otherItems.slice(0, 3).map(it => it.furigana || it.romaji)
            ].sort(() => Math.random() - 0.5),
            correctAnswer: item.furigana || item.romaji,
            word: item.word,
            type: 'reading'
          };
          break;
          
        case 'word':
          question = {
            question: `What is the Japanese word for "${item.meaning}"?`,
            options: [
              item.word,
              ...otherItems.slice(0, 3).map(it => it.word)
            ].sort(() => Math.random() - 0.5),
            correctAnswer: item.word,
            word: item.word,
            type: 'word'
          };
          break;
      }
      
      questions.push(question!);
    }
    
    return questions;
  }, [filteredVocabulary, quizOptions, progress]);

  // Start quiz
  const startQuiz = () => {
    const questions = generateQuizQuestions();
    if (questions.length === 0) {
      alert("Not enough vocabulary words for a quiz!");
      return;
    }
    
    setQuizQuestions(questions);
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setQuizScore(0);
    setQuizTime(0);
    setQuizMode("multiple-choice");
    
    // Start timer
    if (quizTimer) clearInterval(quizTimer);
    const timer = setInterval(() => {
      setQuizTime(prev => prev + 1);
    }, 1000);
    setQuizTimer(timer);
  };

  // Start flashcards
  const startFlashcards = () => {
    let pool = [...filteredVocabulary];
    
    if (!quizOptions.includeLearned) {
      pool = pool.filter(item => !progress.learned.includes(item.word));
    }
    
    if (quizOptions.includeBookmarkedOnly) {
      pool = pool.filter(item => progress.bookmarked.includes(item.word));
    }
    
    if (pool.length === 0) {
      pool = [...filteredVocabulary];
    }
    
    const shuffled = [...pool].sort(() => Math.random() - 0.5);
    setFlashcardQueue(shuffled.slice(0, quizOptions.numberOfQuestions));
    setFlashcardIndex(0);
    setFlashcardFlipped(false);
    setFlashcardStreak(0);
    setFlashcardCorrect(new Set());
    setFlashcardWrong(new Set());
    setQuizMode("flashcards");
  };

  // Handle quiz answer
  const handleQuizAnswer = (answer: string) => {
    if (showResult || selectedAnswer) return;
    
    setSelectedAnswer(answer);
    const isCorrect = answer === quizQuestions[currentQuestionIndex].correctAnswer;
    
    if (isCorrect) {
      setQuizScore(prev => prev + 1);
    }
    
    setShowResult(true);
    
    // Update progress
    const word = quizQuestions[currentQuestionIndex].word;
    setProgress(prev => ({
      ...prev,
      lastReviewed: {
        ...prev.lastReviewed,
        [word]: new Date().toISOString()
      }
    }));
    
    // Auto-advance after delay
    setTimeout(() => {
      nextQuestion();
    }, 2000);
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < quizQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      finishQuiz();
    }
  };

  const finishQuiz = () => {
    if (quizTimer) {
      clearInterval(quizTimer);
      setQuizTimer(null);
    }
    
    // Save quiz score
    const scorePercentage = Math.round((quizScore / quizQuestions.length) * 100);
    const quizId = Date.now().toString();
    setProgress(prev => ({
      ...prev,
      quizScores: {
        ...prev.quizScores,
        [quizId]: scorePercentage
      }
    }));
    
    setQuizMode("off");
  };

  // Handle flashcard answer
  const handleFlashcardAnswer = (correct: boolean) => {
    const currentWord = flashcardQueue[flashcardIndex].word;
    
    if (correct) {
      setFlashcardStreak(prev => prev + 1);
      setFlashcardCorrect(prev => new Set([...prev, currentWord]));
      
      // Mark as learned if streak is high
      if (flashcardStreak >= 3 && !progress.learned.includes(currentWord)) {
        toggleLearned(currentWord);
      }
    } else {
      setFlashcardStreak(0);
      setFlashcardWrong(prev => new Set([...prev, currentWord]));
    }
    
    // Update flashcard history
    setProgress(prev => {
      const history = prev.flashcardHistory[currentWord] || { correct: 0, wrong: 0, lastSeen: "" };
      return {
        ...prev,
        flashcardHistory: {
          ...prev.flashcardHistory,
          [currentWord]: {
            correct: correct ? history.correct + 1 : history.correct,
            wrong: correct ? history.wrong : history.wrong + 1,
            lastSeen: new Date().toISOString()
          }
        }
      };
    });
    
    // Next card or finish
    if (flashcardIndex < flashcardQueue.length - 1) {
      setFlashcardIndex(prev => prev + 1);
      setFlashcardFlipped(false);
    } else {
      finishFlashcards();
    }
  };

  const finishFlashcards = () => {
    setQuizMode("off");
  };

  // Other functions remain mostly the same
  const speak = (text: string, word: string) => {
    if (!synthRef.current || !voice || muted) return;
    
    if (synthRef.current.speaking) {
      synthRef.current.cancel();
      if (speaking === word) {
        setSpeaking(null);
        return;
      }
    }
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.voice = voice;
    utterance.lang = "ja-JP";
    utterance.rate = 0.8;
    utterance.pitch = 1.2;
    
    utterance.onstart = () => setSpeaking(word);
    utterance.onend = () => setSpeaking(null);
    utterance.onerror = () => setSpeaking(null);
    
    synthRef.current.speak(utterance);
  };

  const toggleLearned = (word: string) => {
    setProgress(prev => ({
      ...prev,
      learned: prev.learned.includes(word)
        ? prev.learned.filter(w => w !== word)
        : [...prev.learned, word],
      lastReviewed: {
        ...prev.lastReviewed,
        [word]: new Date().toISOString()
      }
    }));
  };

  const toggleBookmark = (word: string) => {
    setProgress(prev => ({
      ...prev,
      bookmarked: prev.bookmarked.includes(word)
        ? prev.bookmarked.filter(w => w !== word)
        : [...prev.bookmarked, word]
    }));
  };

  const clearFilters = () => {
    setSearch("");
    setLevelFilter("all");
    setShowBookmarked(false);
    setShowLearned(false);
    setShuffleMode(false);
    setSortBy("level");
    setExpandedCard(null);
  };

  const resetProgress = () => {
    if (window.confirm("Reset all progress, bookmarks, and quiz history?")) {
      setProgress({
        learned: [],
        bookmarked: [],
        lastReviewed: {},
        quizScores: {},
        flashcardHistory: {}
      });
      setQuizScore(0);
      setFlashcardStreak(0);
    }
  };

  // Vocabulary Card Component
  const VocabularyCard = ({ item }: { item: VocabularyItem }) => {
    const isExpanded = expandedCard === item.word;
    const isLearned = progress.learned.includes(item.word);
    const isBookmarked = progress.bookmarked.includes(item.word);
    const levelColor = getLevelColor(item.level);
    const hasFurigana = item.furigana && item.furigana !== item.word;

    return (
      <div 
        className={`relative rounded-xl transition-all duration-300 overflow-hidden border-2 ${
          isExpanded 
            ? "shadow-xl scale-[1.02] z-10" 
            : "shadow-sm hover:shadow-md hover:scale-[1.01]"
        } ${isLearned ? "border-emerald-300" : levelColor.border} ${
          darkMode ? "bg-gray-800 border-gray-700" : "bg-white"
        }`}
        onClick={() => setExpandedCard(isExpanded ? null : item.word)}
      >
        {/* Card Header */}
        <div className="p-4">
          {/* Level Badge */}
          <div className={`absolute top-0 left-0 px-3 py-1.5 rounded-br-xl ${levelColor.bg} ${levelColor.text} font-bold text-xs flex items-center gap-1`}>
            <Trophy className="h-3 w-3" />
            N{item.level}
          </div>

          {/* Action Buttons */}
          <div className="absolute top-3 right-3 flex gap-1">
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleBookmark(item.word);
              }}
              className={`p-2 rounded-full transition ${
                isBookmarked 
                  ? "bg-amber-500 text-white shadow-md" 
                  : darkMode 
                    ? "bg-gray-700 text-gray-300 hover:text-amber-400"
                    : "bg-gray-100 text-gray-400 hover:text-amber-500"
              }`}
            >
              <Star className={`h-4 w-4 ${isBookmarked ? "fill-current" : ""}`} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                speak(item.word, item.word);
              }}
              className={`p-2 rounded-full transition ${
                speaking === item.word
                  ? "bg-indigo-500 text-white shadow-md"
                  : darkMode
                    ? "bg-gray-700 text-gray-300 hover:text-indigo-400"
                    : "bg-gray-100 text-gray-400 hover:text-indigo-600"
              }`}
            >
              {speaking === item.word ? (
                <VolumeX className="h-4 w-4" />
              ) : (
                <Volume2 className="h-4 w-4" />
              )}
            </button>
          </div>

          {/* Japanese Word */}
          <div className="text-center mt-6 mb-4">
            <div className="relative inline-block">
              <div className={`text-5xl font-bold ${darkMode ? "text-gray-100" : levelColor.text}`}>
                {item.word}
              </div>
              {isLearned && (
                <div className="absolute -top-2 -right-2">
                  <CheckCircle className="h-6 w-6 text-emerald-500 fill-current" />
                </div>
              )}
            </div>
            
            {/* Furigana */}
            {showFurigana && hasFurigana && (
              <div className={`text-lg ${darkMode ? "text-gray-300" : "text-gray-600"} font-medium`}>
                {item.furigana}
              </div>
            )}
            
            {/* Romaji */}
            {showRomaji && (
              <div className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"} italic`}>
                {item.romaji}
              </div>
            )}
            
            {/* Meaning */}
            <p className={`text-xl font-semibold mt-2 ${darkMode ? "text-gray-100" : "text-gray-800"}`}>
              {item.meaning}
            </p>
          </div>

          {/* Quick Actions */}
          <div className="flex justify-center gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleLearned(item.word);
              }}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition ${
                isLearned
                  ? "bg-emerald-100 text-emerald-700 border border-emerald-200"
                  : darkMode
                    ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {isLearned ? (
                <>
                  <CheckCircle className="h-3.5 w-3.5" />
                  Learned
                </>
              ) : (
                <>
                  <BookOpen className="h-3.5 w-3.5" />
                  Mark Learned
                </>
              )}
            </button>
            
            {item.example && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  speak(item.example!, `${item.word}-example`);
                }}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition ${
                  darkMode
                    ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                    : "bg-blue-100 text-blue-600 hover:bg-blue-200"
                }`}
              >
                <Volume2 className="h-3.5 w-3.5" />
                Example
              </button>
            )}
          </div>
        </div>

        {/* Expanded Content */}
        {isExpanded && (
          <div className={`border-t p-4 space-y-4 animate-in fade-in slide-in-from-top-2 duration-300 ${
            darkMode ? "border-gray-700 bg-gray-800/90" : "border-gray-200 bg-white/90"
          }`}>
            {/* Additional Details */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className={`text-xs font-medium ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                  Reading
                </span>
                <p className={`text-lg font-medium ${darkMode ? "text-gray-100" : "text-gray-800"}`}>
                  {item.furigana || "N/A"}
                </p>
              </div>
              
              <div>
                <span className={`text-xs font-medium ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                  Romaji
                </span>
                <p className={`text-lg font-medium ${darkMode ? "text-gray-100" : "text-gray-800"}`}>
                  {item.romaji}
                </p>
              </div>
            </div>

            {/* Example Sentence */}
            {item.example && (
              <div>
                <span className={`text-xs font-medium ${darkMode ? "text-gray-400" : "text-gray-500"} mb-1 block`}>
                  Example Sentence
                </span>
                <div className={`p-3 rounded-lg ${darkMode ? "bg-gray-700" : "bg-blue-50"}`}>
                  <p className={`text-lg mb-1 ${darkMode ? "text-gray-100" : "text-gray-800"}`}>
                    {item.example}
                  </p>
                  {showRomaji && (
                    <p className={`text-sm italic ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                      {item.example}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-2 pt-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  const text = `${item.word} (${item.furigana}) - ${item.meaning}`;
                  navigator.clipboard.writeText(text);
                }}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl transition font-medium ${
                  darkMode
                    ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <Share2 className="h-4 w-4" />
                Copy
              </button>
              
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (item.example) {
                    speak(item.example, `${item.word}-full-example`);
                  }
                }}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl transition font-medium ${
                  darkMode
                    ? "bg-indigo-700 text-white hover:bg-indigo-600"
                    : "bg-indigo-100 text-indigo-700 hover:bg-indigo-200"
                }`}
              >
                <Volume2 className="h-4 w-4" />
                Read Aloud
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  // Quiz Component
const QuizComponent = () => {
  if (!quizQuestions.length || currentQuestionIndex >= quizQuestions.length) {
    return null;
  }

  const currentQuestion = quizQuestions[currentQuestionIndex];
  const isCorrect = selectedAnswer === currentQuestion.correctAnswer;

  // Render Kanji + Hiragana nicely
  const renderJapanese = (word: string, reading?: string) => {
    if (!reading || word === reading) return <span>{word}</span>;

    return (
      <ruby className="text-xl font-bold">
        {word}
        <rt className="text-sm text-gray-400">{reading}</rt>
      </ruby>
    );
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div
        className={`max-w-xl w-full rounded-xl shadow-xl overflow-hidden ${
          darkMode ? "bg-gray-800" : "bg-white"
        }`}
      >
        {/* Header */}
        <div
          className={`p-4 border-b ${
            darkMode ? "border-gray-700 bg-gray-900" : "border-gray-200 bg-gray-50"
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <h2
              className={`text-xl font-bold flex items-center gap-2 ${
                darkMode ? "text-white" : "text-gray-900"
              }`}
            >
              <FileQuestion className="h-5 w-5 text-indigo-500" />
              Vocabulary Quiz
            </h2>
            <button
              onClick={() => {
                if (quizTimer) clearInterval(quizTimer);
                setQuizMode("off");
              }}
              className={`p-2 rounded-lg ${
                darkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"
              }`}
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Progress */}
          <div className="flex items-center justify-between text-sm">
            <span
              className={`px-3 py-1 rounded-full ${
                darkMode ? "bg-gray-700 text-gray-300" : "bg-gray-100 text-gray-700"
              }`}
            >
              Q {currentQuestionIndex + 1} / {quizQuestions.length}
            </span>

            <span
              className={`px-3 py-1 rounded-full flex items-center gap-1 ${
                darkMode ? "bg-blue-900 text-blue-300" : "bg-blue-100 text-blue-700"
              }`}
            >
              <Timer className="h-4 w-4" />
              {Math.floor(quizTime / 60)}:
              {(quizTime % 60).toString().padStart(2, "0")}
            </span>

            <span
              className={`font-bold ${
                darkMode ? "text-emerald-400" : "text-emerald-600"
              }`}
            >
              {quizScore}/{quizQuestions.length}
            </span>
          </div>

          {/* Progress bar */}
          <div
            className={`mt-3 h-1.5 rounded-full overflow-hidden ${
              darkMode ? "bg-gray-700" : "bg-gray-200"
            }`}
          >
            <div
              className="h-full bg-indigo-500 transition-all"
              style={{
                width: `${
                  ((currentQuestionIndex + 1) / quizQuestions.length) * 100
                }%`,
              }}
            />
          </div>
        </div>

        {/* Body */}
        <div className="p-6">
          {/* Question */}
          <div className="text-center mb-6">
            <h3
              className={`text-lg font-bold ${
                darkMode ? "text-white" : "text-gray-800"
              }`}
            >
              {currentQuestion.type === "reading"
                ? renderJapanese(currentQuestion.word, currentQuestion.correctAnswer)
                : currentQuestion.question}
            </h3>
          </div>

          {/* Options */}
          <div className="space-y-2">
            {currentQuestion.options.map((option, index) => {
              const isSelected = selectedAnswer === option;
              const isAnswer = option === currentQuestion.correctAnswer;

              let style =
                darkMode
                  ? "bg-gray-800 border-gray-700 text-gray-300"
                  : "bg-white border-gray-200 text-gray-700";

              if (selectedAnswer) {
                if (isAnswer)
                  style = darkMode
                    ? "bg-emerald-900 border-emerald-700 text-emerald-300"
                    : "bg-emerald-100 border-emerald-300 text-emerald-700";
                else if (isSelected)
                  style = darkMode
                    ? "bg-rose-900 border-rose-700 text-rose-300"
                    : "bg-rose-100 border-rose-300 text-rose-700";
                else
                  style = darkMode
                    ? "bg-gray-800 border-gray-700 text-gray-500"
                    : "bg-gray-50 border-gray-200 text-gray-500";
              }

              return (
                <button
                  key={index}
                  disabled={!!selectedAnswer}
                  onClick={() => handleQuizAnswer(option)}
                  className={`w-full p-3 rounded-lg border transition flex items-center gap-3 ${style}`}
                >
                  <div className="w-7 h-7 rounded-full flex items-center justify-center bg-gray-300 dark:bg-gray-600 text-sm font-bold">
                    {String.fromCharCode(65 + index)}
                  </div>

                  <span className="text-base">
                    {currentQuestion.type === "word"
                      ? renderJapanese(option, "")
                      : option}
                  </span>

                  {selectedAnswer && isAnswer && (
                    <Check className="ml-auto h-5 w-5 text-emerald-500" />
                  )}
                  {selectedAnswer && isSelected && !isAnswer && (
                    <XIcon className="ml-auto h-5 w-5 text-rose-500" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Result */}
          {showResult && (
            <div
              className={`mt-4 p-3 rounded-lg text-center text-sm ${
                isCorrect
                  ? darkMode
                    ? "bg-emerald-900/40 text-emerald-300"
                    : "bg-emerald-50 text-emerald-700"
                  : darkMode
                  ? "bg-rose-900/40 text-rose-300"
                  : "bg-rose-50 text-rose-700"
              }`}
            >
              {!isCorrect && (
                <p>
                  Correct answer:{" "}
                  <strong>{currentQuestion.correctAnswer}</strong>
                </p>
              )}
            </div>
          )}

          {/* Next */}
          {showResult && (
            <button
              onClick={nextQuestion}
              className={`w-full mt-4 py-2.5 rounded-lg font-semibold transition ${
                darkMode
                  ? "bg-indigo-600 hover:bg-indigo-700 text-white"
                  : "bg-indigo-500 hover:bg-indigo-600 text-white"
              }`}
            >
              {currentQuestionIndex < quizQuestions.length - 1
                ? "Next"
                : "Finish"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};


  // Flashcard Component
const FlashcardComponent = () => {
  const currentCard = flashcardQueue[flashcardIndex];

  // 🔒 HARD SAFETY GUARD
  if (!currentCard) {
    return null;
  }

  const totalCards = flashcardQueue.length;

  // Helpers (safe fallbacks)
  const reading =
    currentCard.furigana && currentCard.furigana.trim() !== ""
      ? currentCard.furigana
      : currentCard.romaji || "";

  const example = currentCard.example || "";

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div
        className={`max-w-2xl w-full rounded-2xl shadow-2xl overflow-hidden ${
          darkMode ? "bg-gray-800" : "bg-white"
        }`}
      >
        {/* Header */}
        <div
          className={`p-6 border-b ${
            darkMode ? "border-gray-700 bg-gray-900" : "border-gray-200 bg-gray-50"
          }`}
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2
                className={`text-2xl font-bold flex items-center gap-2 ${
                  darkMode ? "text-white" : "text-gray-900"
                }`}
              >
                <CardSim className="h-6 w-6 text-indigo-500" />
                Vocabulary Flashcards
              </h2>
              <p
                className={`text-sm ${
                  darkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Flip the card to reveal the answer
              </p>
            </div>

            <button
              onClick={() => {
                setFlashcardFlipped(false);
                setQuizMode("off");
              }}
              className={`p-2 rounded-lg ${
                darkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"
              }`}
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Progress */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  darkMode
                    ? "bg-gray-700 text-gray-300"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                Card {flashcardIndex + 1} of {totalCards}
              </div>

              <div
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  darkMode
                    ? "bg-emerald-900 text-emerald-300"
                    : "bg-emerald-100 text-emerald-700"
                }`}
              >
                <TargetIcon className="inline h-4 w-4 mr-1" />
                Streak: {flashcardStreak}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span
                className={`text-sm ${
                  darkMode ? "text-emerald-400" : "text-emerald-600"
                }`}
              >
                ✅ {flashcardCorrect.size}
              </span>
              <span
                className={`text-sm ${
                  darkMode ? "text-rose-400" : "text-rose-600"
                }`}
              >
                ❌ {flashcardWrong.size}
              </span>
            </div>
          </div>
        </div>

        {/* Card */}
        <div className="p-8">
          <div
            className={`relative w-full h-64 rounded-xl cursor-pointer transition-all duration-500 ${
              darkMode ? "bg-gray-900" : "bg-gradient-to-br from-gray-50 to-gray-100"
            }`}
            onClick={() => setFlashcardFlipped(prev => !prev)}
            style={{ perspective: "1000px" }}
          >
            {/* Front */}
            {!flashcardFlipped && (
              <div
                className={`absolute inset-0 flex flex-col items-center justify-center p-8 rounded-xl border-2 ${
                  darkMode ? "border-gray-700" : "border-gray-200"
                }`}
              >
                <div
                  className={`text-6xl font-bold mb-4 ${
                    darkMode ? "text-white" : "text-gray-800"
                  }`}
                >
                  {currentCard.word}
                </div>

                {flashcardMode !== "meaning" && showFurigana && reading && (
                  <div
                    className={`text-2xl ${
                      darkMode ? "text-gray-300" : "text-gray-600"
                    } mb-4`}
                  >
                    {reading}
                  </div>
                )}

                <p
                  className={`text-lg ${
                    darkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  Click to flip
                </p>
              </div>
            )}

            {/* Back */}
            {flashcardFlipped && (
              <div
                className={`absolute inset-0 flex flex-col items-center justify-center p-8 rounded-xl border-2 ${
                  darkMode ? "border-gray-700" : "border-gray-200"
                }`}
              >
                <div
                  className={`text-3xl font-bold mb-4 ${
                    darkMode ? "text-white" : "text-gray-800"
                  }`}
                >
                  {currentCard.meaning}
                </div>

                {flashcardMode !== "reading" && (
                  <>
                    {reading && (
                      <div
                        className={`text-xl ${
                          darkMode ? "text-gray-300" : "text-gray-600"
                        } mb-2`}
                      >
                        {reading}
                      </div>
                    )}

                    {showRomaji && currentCard.romaji && (
                      <div
                        className={`text-lg italic ${
                          darkMode ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        {currentCard.romaji}
                      </div>
                    )}
                  </>
                )}

                {example && (
                  <div
                    className={`mt-6 p-3 rounded-lg ${
                      darkMode ? "bg-gray-700" : "bg-blue-50"
                    }`}
                  >
                    <p
                      className={`text-sm ${
                        darkMode ? "text-gray-300" : "text-gray-800"
                      }`}
                    >
                      {example}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Controls */}
          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => setFlashcardFlipped(prev => !prev)}
              className={`flex-1 py-3 rounded-xl font-medium flex items-center justify-center gap-2 ${
                darkMode
                  ? "bg-gray-700 hover:bg-gray-600 text-gray-300"
                  : "bg-gray-100 hover:bg-gray-200 text-gray-700"
              }`}
            >
              {flashcardFlipped ? (
                <>
                  <ChevronLeft className="h-5 w-5" /> Show Question
                </>
              ) : (
                <>
                  <Eye className="h-5 w-5" /> Show Answer
                </>
              )}
            </button>

            <button
              onClick={() => {
                speak(currentCard.word, currentCard.word);
                if (flashcardFlipped && example) {
                  setTimeout(() => {
                    speak(example, `${currentCard.word}-example`);
                  }, 800);
                }
              }}
              className={`flex-1 py-3 rounded-xl font-medium flex items-center justify-center gap-2 ${
                darkMode
                  ? "bg-blue-900 hover:bg-blue-800 text-blue-300"
                  : "bg-blue-100 hover:bg-blue-200 text-blue-700"
              }`}
            >
              <Volume2 className="h-5 w-5" />
              Listen
            </button>
          </div>

          {/* Answer Buttons */}
          {flashcardFlipped && (
            <div className="mt-6 grid grid-cols-2 gap-3">
              <button
                onClick={() => handleFlashcardAnswer(false)}
                className={`py-3 rounded-xl font-bold text-lg flex items-center justify-center gap-2 ${
                  darkMode
                    ? "bg-rose-900 hover:bg-rose-800 text-rose-300"
                    : "bg-rose-100 hover:bg-rose-200 text-rose-700"
                }`}
              >
                <XIcon className="h-5 w-5" />
                Wrong
              </button>

              <button
                onClick={() => handleFlashcardAnswer(true)}
                className={`py-3 rounded-xl font-bold text-lg flex items-center justify-center gap-2 ${
                  darkMode
                    ? "bg-emerald-900 hover:bg-emerald-800 text-emerald-300"
                    : "bg-emerald-100 hover:bg-emerald-200 text-emerald-700"
                }`}
              >
                <Check className="h-5 w-5" />
                Correct
              </button>
            </div>
          )}

          {/* Mode Selector */}
          <div className="mt-6 flex justify-center">
            <div
              className={`flex rounded-lg p-1 ${
                darkMode ? "bg-gray-700" : "bg-gray-100"
              }`}
            >
              {(["meaning", "reading", "both"] as FlashcardMode[]).map(mode => (
                <button
                  key={mode}
                  onClick={() => setFlashcardMode(mode)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition ${
                    flashcardMode === mode
                      ? darkMode
                        ? "bg-gray-600 text-white"
                        : "bg-white text-gray-800 shadow"
                      : darkMode
                      ? "text-gray-400 hover:text-gray-300"
                      : "text-gray-600 hover:text-gray-800"
                  }`}
                >
                  {mode === "meaning"
                    ? "Meaning"
                    : mode === "reading"
                    ? "Reading"
                    : "Both"}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

  // Loading state
  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${darkMode ? "bg-gray-900" : "bg-gray-50"}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className={`text-lg ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
            Loading vocabulary...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors ${darkMode ? "bg-gray-900 text-gray-100" : "bg-gradient-to-b from-gray-50 to-gray-100"}`}>
      {/* Header */}
      <div className={`sticky top-0 z-40 backdrop-blur-sm border-b shadow-sm ${
        darkMode ? "bg-gray-900/95 border-gray-800" : "bg-white/95"
      }`}>
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className={`text-2xl font-bold flex items-center gap-2 ${darkMode ? "text-white" : "text-gray-900"}`}>
                <Sparkles className="h-5 w-5 text-indigo-500" />
                Japanese Vocabulary Master
                <span className="text-sm bg-indigo-500 text-white px-2 py-1 rounded-full ml-2">
                  N4 Level
                </span>
              </h1>
              <p className={`text-sm mt-1 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                Master {vocabulary.length} words • {stats.learned} learned • {stats.bookmarked} bookmarked
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`p-2 rounded-lg transition ${
                  darkMode ? "bg-gray-800 text-amber-300" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>
              
              <button
                onClick={() => setMuted(!muted)}
                className={`p-2 rounded-lg transition ${
                  muted 
                    ? darkMode ? "bg-rose-900 text-rose-400" : "bg-rose-50 text-rose-600"
                    : darkMode ? "bg-gray-800 text-gray-300" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {muted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
              </button>
              
              <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded transition ${
                    viewMode === "grid" 
                      ? darkMode ? "bg-gray-700 text-indigo-400" : "bg-white shadow-sm text-indigo-600"
                      : darkMode ? "text-gray-400 hover:text-gray-200" : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <Grid3x3 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded transition ${
                    viewMode === "list" 
                      ? darkMode ? "bg-gray-700 text-indigo-400" : "bg-white shadow-sm text-indigo-600"
                      : darkMode ? "text-gray-400 hover:text-gray-200" : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Practice Mode Cards */}
        <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Quiz Card */}
          <div className={`rounded-xl border p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer ${
            darkMode ? "bg-gray-800 border-gray-700 hover:border-indigo-500" : "bg-white hover:border-indigo-300"
          }`}
          onClick={startQuiz}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm font-medium ${darkMode ? "text-gray-400" : "text-gray-600"}`}>Take a Quiz</p>
                <p className={`text-2xl font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>
                  {stats.averageQuizScore}% avg
                </p>
              </div>
              <div className={`p-3 rounded-lg ${darkMode ? "bg-indigo-900/50" : "bg-indigo-100"}`}>
                <FileQuestion className="h-8 w-8 text-indigo-500" />
              </div>
            </div>
            <div className="mt-2">
              <p className={`text-xs ${darkMode ? "text-gray-500" : "text-gray-600"}`}>
                {stats.totalQuizAttempts} quizzes completed
              </p>
            </div>
            <div className="mt-4">
              <button className={`w-full py-2 rounded-lg font-medium flex items-center justify-center gap-2 ${
                darkMode 
                  ? "bg-indigo-700 hover:bg-indigo-600 text-white"
                  : "bg-indigo-100 hover:bg-indigo-200 text-indigo-700"
              }`}>
                <Play className="h-4 w-4" />
                Start Quiz
              </button>
            </div>
          </div>

          {/* Flashcard Card */}
          <div className={`rounded-xl border p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer ${
            darkMode ? "bg-gray-800 border-gray-700 hover:border-emerald-500" : "bg-white hover:border-emerald-300"
          }`}
          onClick={startFlashcards}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm font-medium ${darkMode ? "text-gray-400" : "text-gray-600"}`}>Flashcards</p>
                <p className={`text-2xl font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>
                  {stats.masteredFlashcards} mastered
                </p>
              </div>
              <div className={`p-3 rounded-lg ${darkMode ? "bg-emerald-900/50" : "bg-emerald-100"}`}>
                <CardSim className="h-8 w-8 text-emerald-500" />
              </div>
            </div>
            <div className="mt-2">
              <p className={`text-xs ${darkMode ? "text-gray-500" : "text-gray-600"}`}>
                {stats.masteryPercentage}% mastery rate
              </p>
            </div>
            <div className="mt-4">
              <button className={`w-full py-2 rounded-lg font-medium flex items-center justify-center gap-2 ${
                darkMode 
                  ? "bg-emerald-700 hover:bg-emerald-600 text-white"
                  : "bg-emerald-100 hover:bg-emerald-200 text-emerald-700"
              }`}>
                <RotateCw className="h-4 w-4" />
                Start Flashcards
              </button>
            </div>
          </div>

          {/* Stats Card */}
          <div className={`rounded-xl border p-4 shadow-sm ${
            darkMode ? "bg-gray-800 border-gray-700" : "bg-white"
          }`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm font-medium ${darkMode ? "text-gray-400" : "text-gray-600"}`}>Your Progress</p>
                <p className={`text-2xl font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>
                  {stats.learnedPercentage}%
                </p>
              </div>
              <div className={`p-3 rounded-lg ${darkMode ? "bg-amber-900/50" : "bg-amber-100"}`}>
                <TrendingUp className="h-8 w-8 text-amber-500" />
              </div>
            </div>
            <div className="mt-2">
              <div className={`h-2 rounded-full overflow-hidden ${
                darkMode ? "bg-gray-700" : "bg-gray-200"
              }`}>
                <div 
                  className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 transition-all duration-500"
                  style={{ width: `${stats.learnedPercentage}%` }}
                />
              </div>
              <p className={`text-xs mt-1 ${darkMode ? "text-gray-500" : "text-gray-600"}`}>
                {stats.learned} of {stats.total} words learned
              </p>
            </div>
          </div>
        </div>

        {/* Search and Controls */}
        <div className={`mb-6 rounded-xl border p-4 shadow-sm ${
          darkMode ? "bg-gray-800 border-gray-700" : "bg-white"
        }`}>
          {/* Search Bar */}
          <div className="relative mb-4">
            <Search className={`absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 ${
              darkMode ? "text-gray-400" : "text-gray-400"
            }`} />
            <input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setExpandedCard(null);
              }}
              placeholder="Search Japanese word, meaning, or reading..."
              className={`w-full pl-12 pr-12 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm ${
                darkMode 
                  ? "bg-gray-900 border-gray-700 text-white placeholder-gray-500"
                  : "bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400"
              }`}
            />
            {search && (
              <button
                onClick={() => {
                  setSearch("");
                  setExpandedCard(null);
                }}
                className={`absolute right-4 top-1/2 transform -translate-y-1/2 ${
                  darkMode ? "text-gray-400 hover:text-gray-200" : "text-gray-400 hover:text-gray-600"
                }`}
              >
                <XCircle className="h-5 w-5" />
              </button>
            )}
          </div>

          {/* Controls */}
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex flex-wrap items-center gap-3 flex-1">
              {/* Level Filter */}
              <select
                value={levelFilter}
                onChange={(e) => {
                  setLevelFilter(e.target.value === "all" ? "all" : Number(e.target.value));
                  setExpandedCard(null);
                }}
                className={`px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm ${
                  darkMode 
                    ? "bg-gray-900 border-gray-700 text-white"
                    : "bg-gray-50 border border-gray-200 text-gray-900"
                }`}
              >
                <option value="all">All Levels</option>
                <option value={5}>N5 (Beginner)</option>
                <option value={4}>N4 (Elementary)</option>
                <option value={3}>N3 (Intermediate)</option>
              </select>

              {/* Sort By */}
              <select
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value as any);
                  setExpandedCard(null);
                }}
                className={`px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm ${
                  darkMode 
                    ? "bg-gray-900 border-gray-700 text-white"
                    : "bg-gray-50 border border-gray-200 text-gray-900"
                }`}
              >
                <option value="level">Sort by Level</option>
                <option value="word">Sort by Word</option>
                <option value="meaning">Sort by Meaning</option>
              </select>

              {/* Display Options */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowFurigana(!showFurigana)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                    showFurigana
                      ? darkMode ? "bg-blue-900 text-blue-300" : "bg-blue-100 text-blue-700"
                      : darkMode ? "bg-gray-800 text-gray-400 hover:bg-gray-700" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  ふりがな
                </button>
                <button
                  onClick={() => setShowRomaji(!showRomaji)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                    showRomaji
                      ? darkMode ? "bg-purple-900 text-purple-300" : "bg-purple-100 text-purple-700"
                      : darkMode ? "bg-gray-800 text-gray-400 hover:bg-gray-700" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  Romaji
                </button>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => setShuffleMode(!shuffleMode)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg transition text-sm font-medium ${
                  shuffleMode
                    ? "bg-indigo-600 text-white"
                    : darkMode 
                      ? "bg-gray-800 text-gray-300 hover:bg-gray-700"
                      : "bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100"
                }`}
              >
                <Shuffle className="h-4 w-4" />
                Shuffle
              </button>
              
              <button
                onClick={() => setShowBookmarked(!showBookmarked)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg transition text-sm font-medium ${
                  showBookmarked
                    ? "bg-amber-600 text-white"
                    : darkMode 
                      ? "bg-gray-800 text-gray-300 hover:bg-gray-700"
                      : "bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100"
                }`}
              >
                <Star className={`h-4 w-4 ${showBookmarked ? "fill-current" : ""}`} />
                Bookmarks
              </button>
              
              <button
                onClick={() => setShowLearned(!showLearned)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg transition text-sm font-medium ${
                  showLearned
                    ? "bg-emerald-600 text-white"
                    : darkMode 
                      ? "bg-gray-800 text-gray-300 hover:bg-gray-700"
                      : "bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100"
                }`}
              >
                <BookmarkCheck className="h-4 w-4" />
                Learned
              </button>
              
              {(search || levelFilter !== "all" || showBookmarked || showLearned || shuffleMode) && (
                <button
                  onClick={clearFilters}
                  className={`flex items-center gap-2 px-4 py-2.5 text-sm rounded-lg transition font-medium ${
                    darkMode 
                      ? "text-gray-400 hover:text-gray-200 hover:bg-gray-800"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  }`}
                >
                  <RefreshCw className="h-4 w-4" />
                  Clear All
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Vocabulary Grid */}
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <h2 className={`text-lg font-semibold ${
              darkMode ? "text-gray-200" : "text-gray-800"
            }`}>
              {filteredVocabulary.length} Vocabulary Words
              {levelFilter !== "all" && ` • N${levelFilter} Level`}
            </h2>
            
            <div className="text-sm flex items-center gap-2">
              <Eye className="h-4 w-4" />
              <span className={darkMode ? "text-gray-400" : "text-gray-500"}>
                Click card to {expandedCard ? "collapse" : "expand"} details
              </span>
            </div>
          </div>
          
          {filteredVocabulary.length === 0 ? (
            <div className={`text-center py-12 rounded-xl border ${
              darkMode ? "bg-gray-800 border-gray-700" : "bg-white"
            }`}>
              <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${
                darkMode ? "bg-gray-700" : "bg-gray-100"
              }`}>
                <Search className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className={`text-lg font-semibold mb-2 ${
                darkMode ? "text-gray-300" : "text-gray-700"
              }`}>
                No Vocabulary Found
              </h3>
              <p className={`max-w-md mx-auto mb-6 ${
                darkMode ? "text-gray-400" : "text-gray-500"
              }`}>
                Try adjusting your filters or search terms.
              </p>
              <button
                onClick={clearFilters}
                className="px-6 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            <div className={
              viewMode === "grid" 
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
                : "space-y-4"
            }>
              {filteredVocabulary.map((item) => (
                <VocabularyCard key={item.word} item={item} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quiz Modal */}
      {quizMode === "multiple-choice" && <QuizComponent />}
      
      {/* Flashcard Modal */}
      {quizMode === "flashcards" && <FlashcardComponent />}
    </div>
  );
};

export default Vocabularynew;