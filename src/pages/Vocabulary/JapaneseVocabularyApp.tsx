import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Filter,
  Shuffle,
  Bookmark,
  BookmarkCheck,
  Volume2,
  Grid,
  List as ListIcon,
  BookOpen,
  RotateCw,
  CheckCircle,
  X,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Target,
  BarChart3,
  Award,
  Clock,
  Zap,
  Play,
  Pause,
  HelpCircle,
  Settings,
  Download,
  Moon,
  Sun,
  RefreshCw,
  Hash,
  TrendingUp,
  Star,
  Book as BookIcon,
  Layers,
  Eye,
  EyeOff,
  Maximize2,
  Minimize2,
  AlertCircle,
  Heart,
  ChevronDown,
  ChevronUp,
  Loader2,
  Brain,
  Flame,
  Trophy,
  Users,
  TrendingDown,
  Bell,
  VolumeX,
  BookmarkPlus,
  BookmarkMinus,
  RotateCcw,
  SkipBack,
  SkipForward,
  Repeat,
  ZoomIn,
  ZoomOut,
  MoreVertical,
  ExternalLink,
  Share2,
  Printer,
  ThumbsUp,
  ThumbsDown,
  Flag,
  Languages,
  Globe,
  Home,
  User,
  Shield,
  Lock,
  AlertTriangle,
  Plus,
  Minus,
  Edit,
  BookCheck,
  Clock4,
  Music,
  Gamepad2,
  Lightbulb,
  Puzzle
} from 'lucide-react';

// Types
type ViewMode = 'grid' | 'list' | 'flashcard' | 'quiz' | 'stats';
type Difficulty = 'easy' | 'medium' | 'hard' | 'master';
type QuizStage = 'question' | 'answer' | 'result';
type Level = 5 | 4 | 3 | 2 | 1;

interface VocabularyWord {
  word: string;
  meaning: string;
  furigana: string;
  romaji: string;
  level: Level;
  example?: string;
  exampleMeaning?: string;
  type?: string;
  notes?: string;
  audio?: string;
  tags?: string[];
}

interface UserProgress {
  bookmarkedWords: string[];
  learnedWords: string[];
  lastReviewed: { [key: string]: Date };
  reviewCount: { [key: string]: number };
  mastery: { [key: string]: number };
  difficulty: { [key: string]: Difficulty };
  streak: number;
  lastActive: Date;
  totalStudyTime: number;
  dailyStats: {
    [date: string]: {
      wordsStudied: number;
      timeSpent: number;
      correctAnswers: number;
    };
  };
}

interface QuizQuestion {
  word: VocabularyWord;
  options: string[];
  correctAnswer: string;
  userAnswer?: string;
  isCorrect?: boolean;
  timeSpent?: number;
}

interface Stats {
  totalWords: number;
  bookmarked: number;
  learned: number;
  masteryPercentage: number;
  levelCounts: { [key in Level]: number };
  streak: number;
  totalStudyTime: number;
  averageAccuracy: number;
  recentActivity: { date: string; count: number }[];
}

const JapaneseVocabularyApp: React.FC = () => {
  // State Management
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [words, setWords] = useState<VocabularyWord[]>([]);
  const [filteredWords, setFilteredWords] = useState<VocabularyWord[]>([]);
  const [displayedWords, setDisplayedWords] = useState<VocabularyWord[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [levelFilter, setLevelFilter] = useState<Level | 'all'>('all');
  const [showBookmarked, setShowBookmarked] = useState(false);
  const [showLearned, setShowLearned] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [shuffled, setShuffled] = useState(false);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [autoPlayAudio, setAutoPlayAudio] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  
  // Infinite scroll state
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const itemsPerPage = 24;
  
  // Quiz State
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [quizStage, setQuizStage] = useState<QuizStage>('question');
  const [quizActive, setQuizActive] = useState(false);
  const [quizDifficulty, setQuizDifficulty] = useState<Difficulty>('medium');
  const [quizTimer, setQuizTimer] = useState(0);
  
  // Progress Management
  const [progress, setProgress] = useState<UserProgress>(() => {
    const saved = localStorage.getItem('japanese-vocab-progress');
    if (saved) {
      const parsed = JSON.parse(saved);
      // Convert date strings back to Date objects
      Object.keys(parsed.lastReviewed).forEach(key => {
        parsed.lastReviewed[key] = new Date(parsed.lastReviewed[key]);
      });
      parsed.lastActive = new Date(parsed.lastActive);
      return parsed;
    }
    return {
      bookmarkedWords: [],
      learnedWords: [],
      lastReviewed: {},
      reviewCount: {},
      mastery: {},
      difficulty: {},
      streak: 0,
      lastActive: new Date(),
      totalStudyTime: 0,
      dailyStats: {}
    };
  });

  // Settings State
  const [showFurigana, setShowFurigana] = useState(true);
  const [showRomaji, setShowRomaji] = useState(false);
  const [showExample, setShowExample] = useState(true);
  const [cardAnimations, setCardAnimations] = useState(true);
  const [showLevelBadge, setShowLevelBadge] = useState(true);
  const [autoFlipCards, setAutoFlipCards] = useState(false);
  const [showHints, setShowHints] = useState(true);
  
  // Audio state
  const [audioPlaying, setAudioPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  // Refs for infinite scroll
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loaderRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);


  
useEffect(() => {
  const loadVocabulary = async () => {
    try {
      setIsLoading(true);

      const data = await import("./Allvocabulary.json");
      const vocab = Array.isArray(data.default) ? data.default : data;

      setWords(vocab);
      setFilteredWords(vocab);
    } catch (error) {
      console.error("Failed to load vocabulary JSON:", error);
      setWords([]);
      setFilteredWords([]);
    } finally {
      setIsLoading(false);
    }
  };

  loadVocabulary();
}, []);

  // Save progress to localStorage
  useEffect(() => {
    const saveProgress = () => {
      const progressToSave = {
        ...progress,
        lastActive: new Date()
      };
      localStorage.setItem('japanese-vocab-progress', JSON.stringify(progressToSave));
    };
    
    saveProgress();
  }, [progress]);

  // Filter words based on criteria
  useEffect(() => {
    let result = [...words];
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(word => 
        word.word.toLowerCase().includes(query) ||
        word.meaning.toLowerCase().includes(query) ||
        word.furigana.toLowerCase().includes(query) ||
        word.romaji.toLowerCase().includes(query) ||
        word.tags?.some(tag => tag.toLowerCase().includes(query))
      );
    }
    
    if (levelFilter !== 'all') {
      result = result.filter(word => word.level === levelFilter);
    }
    
    if (showBookmarked) {
      result = result.filter(word => progress.bookmarkedWords.includes(word.word));
    }
    
    if (showLearned) {
      result = result.filter(word => progress.learnedWords.includes(word.word));
    }
    
    if (shuffled) {
      result = [...result].sort(() => Math.random() - 0.5);
    } else {
      result.sort((a, b) => a.word.localeCompare(b.word));
    }
    
    setFilteredWords(result);
    setPage(1);
    setHasMore(result.length > itemsPerPage);
  }, [words, searchQuery, levelFilter, showBookmarked, showLearned, shuffled, progress]);

  // Infinite scroll setup
  useEffect(() => {
    const start = 0;
    const end = page * itemsPerPage;
    setDisplayedWords(filteredWords.slice(start, end));
    setHasMore(end < filteredWords.length);
  }, [filteredWords, page]);

  // Intersection Observer for infinite scroll
  useEffect(() => {
    if (!loaderRef.current || !hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setPage(prev => prev + 1);
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(loaderRef.current);
    
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [hasMore]);

  // Card actions
  const toggleBookmark = useCallback((word: string) => {
    setProgress(prev => {
      const isBookmarked = prev.bookmarkedWords.includes(word);
      return {
        ...prev,
        bookmarkedWords: isBookmarked
          ? prev.bookmarkedWords.filter(w => w !== word)
          : [...prev.bookmarkedWords, word],
        lastReviewed: {
          ...prev.lastReviewed,
          [word]: new Date()
        }
      };
    });
  }, []);

  const markAsLearned = useCallback((word: string) => {
    setProgress(prev => {
      const isLearned = prev.learnedWords.includes(word);
      return {
        ...prev,
        learnedWords: isLearned
          ? prev.learnedWords.filter(w => w !== word)
          : [...prev.learnedWords, word],
        mastery: {
          ...prev.mastery,
          [word]: isLearned ? 0 : 100
        },
        lastReviewed: {
          ...prev.lastReviewed,
          [word]: new Date()
        },
        streak: isLearned ? prev.streak : prev.streak + 1
      };
    });
  }, []);

  const playJapaneseAudio = useCallback((text: string) => {
    if ('speechSynthesis' in window) {
      setAudioPlaying(true);
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ja-JP';
      utterance.rate = 0.8;
      utterance.pitch = 1;
      utterance.volume = 1;
      utterance.onend = () => setAudioPlaying(false);
      utterance.onerror = () => setAudioPlaying(false);
      speechSynthesis.speak(utterance);
    }
  }, []);

  const shuffleWords = useCallback(() => {
    setShuffled(true);
    const shuffledList = [...filteredWords].sort(() => Math.random() - 0.5);
    setFilteredWords(shuffledList);
  }, [filteredWords]);

  const resetOrder = useCallback(() => {
    setShuffled(false);
    const sortedList = [...filteredWords].sort((a, b) => a.word.localeCompare(b.word));
    setFilteredWords(sortedList);
  }, [filteredWords]);

  // Quiz functions
  const startQuiz = useCallback((difficulty: Difficulty = 'medium') => {
    const availableWords = filteredWords.length > 0 ? filteredWords : words;
    const quizSize = difficulty === 'easy' ? 5 : difficulty === 'medium' ? 10 : difficulty === 'hard' ? 15 : 20;
    const selectedWords = [...availableWords]
      .sort(() => Math.random() - 0.5)
      .slice(0, quizSize);
    
    const questions: QuizQuestion[] = selectedWords.map(word => {
      // Get 3 random wrong answers
      const wrongAnswers = words
        .filter(w => w.meaning !== word.meaning)
        .sort(() => Math.random() - 0.5)
        .slice(0, 3)
        .map(w => w.meaning);
      
      const options = [word.meaning, ...wrongAnswers]
        .sort(() => Math.random() - 0.5);
      
      return {
        word,
        options,
        correctAnswer: word.meaning
      };
    });
    
    setQuizQuestions(questions);
    setCurrentQuizIndex(0);
    setQuizScore(0);
    setQuizStage('question');
    setQuizActive(true);
    setQuizDifficulty(difficulty);
    setViewMode('quiz');
    setQuizTimer(0);
  }, [filteredWords, words]);

  const handleQuizAnswer = useCallback((answer: string) => {
    const currentQuestion = quizQuestions[currentQuizIndex];
    const isCorrect = answer === currentQuestion.correctAnswer;
    
    const updatedQuestions = [...quizQuestions];
    updatedQuestions[currentQuizIndex] = {
      ...currentQuestion,
      userAnswer: answer,
      isCorrect
    };
    
    setQuizQuestions(updatedQuestions);
    
    if (isCorrect) {
      setQuizScore(prev => prev + 1);
    }
    
    setQuizStage('answer');
  }, [quizQuestions, currentQuizIndex]);

  const nextQuizQuestion = useCallback(() => {
    if (currentQuizIndex < quizQuestions.length - 1) {
      setCurrentQuizIndex(prev => prev + 1);
      setQuizStage('question');
    } else {
      setQuizStage('result');
    }
  }, [currentQuizIndex, quizQuestions.length]);

  const restartQuiz = useCallback(() => {
    setQuizActive(false);
    setViewMode('grid');
    setTimeout(() => startQuiz(quizDifficulty), 300);
  }, [quizDifficulty, startQuiz]);

  // Stats calculation
  const stats: Stats = useMemo(() => {
    const total = words.length;
    const bookmarked = progress.bookmarkedWords.length;
    const learned = progress.learnedWords.length;
    const masteryPercentage = total > 0 ? Math.round((learned / total) * 100) : 0;
    
    const levelCounts: { [key in Level]: number } = {
      5: 0, 4: 0, 3: 0, 2: 0, 1: 0
    };
    words.forEach(word => {
      levelCounts[word.level]++;
    });
    
    // Calculate average accuracy from quiz results
    const totalReviews = Object.values(progress.reviewCount).reduce((a, b) => a + b, 0);
    const correctReviews = Object.entries(progress.reviewCount).reduce((acc, [word, count]) => {
      const mastery = progress.mastery[word] || 0;
      return acc + (count * (mastery / 100));
    }, 0);
    const averageAccuracy = totalReviews > 0 ? Math.round((correctReviews / totalReviews) * 100) : 0;
    
    // Generate recent activity data
    const recentActivity = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const count = progress.dailyStats[dateStr]?.wordsStudied || 0;
      return { date: dateStr, count };
    }).reverse();
    
    return {
      total,
      bookmarked,
      learned,
      masteryPercentage,
      levelCounts,
      streak: progress.streak,
      totalStudyTime: progress.totalStudyTime,
      averageAccuracy,
      recentActivity
    };
  }, [words, progress]);

  // Get level colors
  const getLevelColors = (level: Level) => {
    switch(level) {
      case 5: return {
        bg: 'bg-gradient-to-br from-emerald-500/20 to-green-500/20',
        text: 'text-emerald-400',
        border: 'border-emerald-500/30',
        badge: 'bg-gradient-to-r from-emerald-500 to-green-500',
        gradient: 'from-emerald-500 to-green-500'
      };
      case 4: return {
        bg: 'bg-gradient-to-br from-blue-500/20 to-cyan-500/20',
        text: 'text-blue-400',
        border: 'border-blue-500/30',
        badge: 'bg-gradient-to-r from-blue-500 to-cyan-500',
        gradient: 'from-blue-500 to-cyan-500'
      };
      case 3: return {
        bg: 'bg-gradient-to-br from-purple-500/20 to-pink-500/20',
        text: 'text-purple-400',
        border: 'border-purple-500/30',
        badge: 'bg-gradient-to-r from-purple-500 to-pink-500',
        gradient: 'from-purple-500 to-pink-500'
      };
      case 2: return {
        bg: 'bg-gradient-to-br from-orange-500/20 to-red-500/20',
        text: 'text-orange-400',
        border: 'border-orange-500/30',
        badge: 'bg-gradient-to-r from-orange-500 to-red-500',
        gradient: 'from-orange-500 to-red-500'
      };
      case 1: return {
        bg: 'bg-gradient-to-br from-rose-500/20 to-red-500/20',
        text: 'text-rose-400',
        border: 'border-rose-500/30',
        badge: 'bg-gradient-to-r from-rose-500 to-red-500',
        gradient: 'from-rose-500 to-red-500'
      };
      default: return {
        bg: 'bg-gradient-to-br from-gray-500/20 to-slate-500/20',
        text: 'text-gray-400',
        border: 'border-gray-500/30',
        badge: 'bg-gradient-to-r from-gray-500 to-slate-500',
        gradient: 'from-gray-500 to-slate-500'
      };
    }
  };

  // Loading skeleton
  const GridLoadingSkeleton = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {[...Array(8)].map((_, i) => (
        <div key={i} className="rounded-2xl bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 p-6 animate-pulse">
          <div className="flex justify-between mb-6">
            <div className="w-16 h-8 bg-gray-700 rounded-full"></div>
            <div className="w-10 h-10 bg-gray-700 rounded-full"></div>
          </div>
          <div className="space-y-4">
            <div className="w-3/4 h-10 bg-gray-700 rounded-lg mx-auto"></div>
            <div className="w-1/2 h-4 bg-gray-700 rounded mx-auto"></div>
            <div className="w-full h-6 bg-gray-700 rounded"></div>
          </div>
        </div>
      ))}
    </div>
  );

  // Grid View Component
  const GridView = () => (
    <motion.div
      key="grid"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
    >
      {displayedWords.map((word, index) => {
        const isBookmarked = progress.bookmarkedWords.includes(word.word);
        const isLearned = progress.learnedWords.includes(word.word);
        const colors = getLevelColors(word.level);
        
        return (
          <motion.div
            key={`${word.word}-${index}`}
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: index * 0.02, type: "spring", stiffness: 100 }}
            whileHover={{ y: -8, scale: 1.02 }}
            className={`relative rounded-2xl overflow-hidden border ${colors.border} backdrop-blur-sm ${colors.bg} group cursor-pointer transition-all duration-300 hover:shadow-2xl`}
            onClick={() => {
              const wordIndex = displayedWords.findIndex(w => w.word === word.word);
              setCurrentWordIndex(wordIndex);
              setViewMode('flashcard');
            }}
          >
            {/* Glow effect on hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            {/* Level badge */}
            {showLevelBadge && (
              <div className={`absolute -top-3 -right-3 w-16 h-16 ${colors.badge} text-white rounded-full flex items-center justify-center font-bold text-sm transform rotate-12 shadow-lg`}>
                N{word.level}
              </div>
            )}
            
            <div className="p-6 relative z-10">
              {/* Header with bookmark button */}
              <div className="flex justify-between items-start mb-6">
                <div className="flex-1">
                  <div className="text-sm text-gray-400 uppercase tracking-wider mb-1">
                    {word.tags?.[0] || 'Vocabulary'}
                  </div>
                  <div className="font-japanese text-3xl font-bold mb-2 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                    {word.word}
                  </div>
                </div>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleBookmark(word.word);
                  }}
                  className={`p-2 rounded-xl backdrop-blur-sm ${isBookmarked ? 'bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-400' : 'bg-gray-800/50 text-gray-400 hover:text-amber-400'}`}
                >
                  {isBookmarked ? (
                    <BookmarkCheck className="w-5 h-5 fill-current" />
                  ) : (
                    <Bookmark className="w-5 h-5" />
                  )}
                </motion.button>
              </div>
              
              {/* Reading */}
              <div className="space-y-2 mb-6">
                {showFurigana && (
                  <div className={`text-lg ${colors.text} font-medium`}>
                    {word.furigana}
                  </div>
                )}
                {showRomaji && (
                  <div className="text-sm text-gray-500">
                    {word.romaji}
                  </div>
                )}
              </div>
              
              {/* Meaning */}
              <div className="mb-6">
                <div className="text-xl font-bold text-white mb-3">
                  {word.meaning}
                </div>
                {showExample && word.example && (
                  <div className="text-sm text-gray-400 italic">
                    "{word.example}"
                  </div>
                )}
              </div>
              
              {/* Footer actions */}
              <div className="flex items-center justify-between">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    playJapaneseAudio(word.word);
                  }}
                  className="p-2.5 bg-gradient-to-r from-emerald-500/20 to-green-500/20 text-emerald-400 rounded-xl hover:from-emerald-500/30 hover:to-green-500/30 transition-all"
                >
                  {audioPlaying ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Volume2 className="w-5 h-5" />
                  )}
                </motion.button>
                
                <div className="flex gap-2">
                  {isLearned && (
                    <span className="px-3 py-1.5 bg-gradient-to-r from-emerald-500/20 to-green-500/20 text-emerald-400 rounded-full text-xs font-bold flex items-center gap-1.5">
                      <CheckCircle className="w-3 h-3" />
                      Mastered
                    </span>
                  )}
                  {isBookmarked && (
                    <span className="px-3 py-1.5 bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-400 rounded-full text-xs font-bold flex items-center gap-1.5">
                      <Bookmark className="w-3 h-3" />
                      Saved
                    </span>
                  )}
                </div>
                
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    markAsLearned(word.word);
                  }}
                  className={`p-2.5 rounded-xl ${isLearned ? 'bg-gradient-to-r from-emerald-500/30 to-green-500/30 text-emerald-400' : 'bg-gray-800/50 text-gray-400 hover:text-emerald-400'}`}
                >
                  <Trophy className="w-5 h-5" />
                </motion.button>
              </div>
            </div>
            
            {/* Bottom gradient accent */}
            <div className={`h-1 w-full bg-gradient-to-r ${colors.gradient} opacity-50 group-hover:opacity-100 transition-opacity`} />
          </motion.div>
        );
      })}
    </motion.div>
  );

  // List View Component
  const ListView = () => (
    <motion.div
      key="list"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-3"
    >
      {displayedWords.map((word, index) => {
        const isBookmarked = progress.bookmarkedWords.includes(word.word);
        const isLearned = progress.learnedWords.includes(word.word);
        const colors = getLevelColors(word.level);
        
        return (
          <motion.div
            key={word.word}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.01 }}
            className={`p-4 rounded-xl backdrop-blur-sm border ${colors.border} ${colors.bg} hover:shadow-lg transition-all duration-300 cursor-pointer group`}
            onClick={() => {
              const wordIndex = displayedWords.findIndex(w => w.word === word.word);
              setCurrentWordIndex(wordIndex);
              setViewMode('flashcard');
            }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 flex-1">
                <div className={`w-12 h-12 rounded-xl ${colors.badge} flex items-center justify-center font-bold text-white shadow-lg`}>
                  N{word.level}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <div className="font-japanese text-2xl font-bold text-white">
                      {word.word}
                    </div>
                    <div className={`text-sm ${colors.text}`}>
                      {word.furigana}
                    </div>
                  </div>
                  <div className="text-lg font-medium text-gray-300">
                    {word.meaning}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  {isLearned && (
                    <span className="px-2 py-1 bg-gradient-to-r from-emerald-500/20 to-green-500/20 text-emerald-400 rounded-full text-xs font-bold">
                      ✓ Mastered
                    </span>
                  )}
                  {isBookmarked && (
                    <span className="px-2 py-1 bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-400 rounded-full text-xs font-bold">
                      ★ Saved
                    </span>
                  )}
                </div>
                
                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleBookmark(word.word);
                    }}
                    className={`p-2 ${isBookmarked ? 'text-amber-400' : 'text-gray-400 hover:text-amber-400'}`}
                  >
                    {isBookmarked ? (
                      <BookmarkCheck className="w-4 h-4 fill-current" />
                    ) : (
                      <Bookmark className="w-4 h-4" />
                    )}
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      playJapaneseAudio(word.word);
                    }}
                    className="p-2 text-emerald-400 hover:text-emerald-300"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );

  // Flashcard View Component
  const FlashcardView = () => {
    const currentWord = displayedWords[currentWordIndex];
    if (!currentWord) return null;
    
    const isBookmarked = progress.bookmarkedWords.includes(currentWord.word);
    const isLearned = progress.learnedWords.includes(currentWord.word);
    const colors = getLevelColors(currentWord.level);
    
    return (
      <motion.div
        key="flashcard"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="max-w-3xl mx-auto"
      >
        <div className={`rounded-2xl overflow-hidden backdrop-blur-sm border ${colors.border} ${colors.bg} shadow-2xl`}>
          {/* Flashcard Header */}
          <div className={`p-8 bg-gradient-to-r ${colors.gradient}`}>
            <div className="flex justify-between items-center mb-8">
              <div className="px-6 py-3 bg-white/20 backdrop-blur-sm rounded-full text-white font-bold flex items-center gap-3">
                <div className="w-8 h-8 bg-white/30 rounded-full flex items-center justify-center">
                  N{currentWord.level}
                </div>
                <span>Flashcard {currentWordIndex + 1} of {displayedWords.length}</span>
              </div>
              <div className="flex items-center gap-2">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => toggleBookmark(currentWord.word)}
                  className="p-3 bg-white/20 backdrop-blur-sm rounded-xl hover:bg-white/30"
                >
                  {isBookmarked ? (
                    <BookmarkCheck className="w-5 h-5 text-white fill-white" />
                  ) : (
                    <Bookmark className="w-5 h-5 text-white" />
                  )}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setViewMode('grid')}
                  className="p-3 bg-white/20 backdrop-blur-sm rounded-xl hover:bg-white/30"
                >
                  <X className="w-5 h-5 text-white" />
                </motion.button>
              </div>
            </div>
            
            <div className="text-center mb-8">
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                className="font-japanese text-7xl font-bold text-white mb-6"
              >
                {currentWord.word}
              </motion.div>
              <div className="space-y-3">
                {showFurigana && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-2xl text-white/90"
                  >
                    {currentWord.furigana}
                  </motion.div>
                )}
                {showRomaji && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-xl text-white/80"
                  >
                    {currentWord.romaji}
                  </motion.div>
                )}
              </div>
            </div>
          </div>
          
          {/* Flashcard Content */}
          <div className="p-8">
            <div className="text-center mb-10">
              <AnimatePresence mode="wait">
                {!showAnswer ? (
                  <motion.div
                    key="question"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-6"
                  >
                    <div className="text-4xl font-bold text-gray-400">
                      What does this mean?
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setShowAnswer(true)}
                      className="px-10 py-5 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-2xl font-bold text-xl hover:shadow-2xl transition-all"
                    >
                      Reveal Meaning
                    </motion.button>
                    <div className="text-gray-500 text-sm">
                      Press Space or click to reveal
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="answer"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-8"
                  >
                    <div className="text-4xl font-bold text-white">
                      {currentWord.meaning}
                    </div>
                    
                    {showExample && currentWord.example && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="p-6 rounded-2xl bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-700"
                      >
                        <div className="font-japanese text-xl text-gray-300 mb-3">
                          {currentWord.example}
                        </div>
                        {currentWord.exampleMeaning && (
                          <div className="text-gray-400 italic">
                            "{currentWord.exampleMeaning}"
                          </div>
                        )}
                      </motion.div>
                    )}
                    
                    <div className="flex justify-center gap-4">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => markAsLearned(currentWord.word)}
                        className={`px-6 py-3 rounded-xl font-bold flex items-center gap-2 ${
                          isLearned
                            ? 'bg-gradient-to-r from-emerald-500 to-green-500 text-white'
                            : 'bg-gradient-to-r from-emerald-500/20 to-green-500/20 text-emerald-400 hover:from-emerald-500/30 hover:to-green-500/30'
                        }`}
                      >
                        {isLearned ? '✓ Mastered' : 'Mark as Mastered'}
                      </motion.button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => playJapaneseAudio(currentWord.word)}
                  className="p-3 bg-gradient-to-r from-emerald-500/20 to-green-500/20 text-emerald-400 rounded-xl hover:from-emerald-500/30 hover:to-green-500/30"
                >
                  {audioPlaying ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Volume2 className="w-5 h-5" />
                  )}
                </motion.button>
                
                <div className="flex items-center gap-2">
                  {isLearned && (
                    <span className="px-3 py-1.5 bg-gradient-to-r from-emerald-500/20 to-green-500/20 text-emerald-400 rounded-full text-xs font-bold">
                      Mastered
                    </span>
                  )}
                  {isBookmarked && (
                    <span className="px-3 py-1.5 bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-400 rounded-full text-xs font-bold">
                      Bookmarked
                    </span>
                  )}
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setCurrentWordIndex(prev => prev > 0 ? prev - 1 : displayedWords.length - 1)}
                  className="p-3 bg-gray-800/50 text-gray-400 hover:text-white rounded-xl hover:bg-gray-800/80"
                >
                  <ChevronLeft className="w-5 h-5" />
                </motion.button>
                <div className="text-sm font-medium text-gray-400">
                  {currentWordIndex + 1} / {displayedWords.length}
                </div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setCurrentWordIndex(prev => prev < displayedWords.length - 1 ? prev + 1 : 0)}
                  className="p-3 bg-gray-800/50 text-gray-400 hover:text-white rounded-xl hover:bg-gray-800/80"
                >
                  <ChevronRight className="w-5 h-5" />
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  // Stats View Component
  const StatsView = () => (
    <motion.div
      key="stats"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-8"
    >
      {/* Main Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="p-6 rounded-2xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/30 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="text-3xl font-bold text-white">{stats.totalWords}</div>
            <BookIcon className="w-8 h-8 text-blue-400" />
          </div>
          <div className="text-sm text-blue-300">Total Words</div>
          <div className="mt-2 text-xs text-blue-400/70">All JLPT Levels</div>
        </div>
        
        <div className="p-6 rounded-2xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/30 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="text-3xl font-bold text-white">{stats.bookmarked}</div>
            <BookmarkCheck className="w-8 h-8 text-amber-400" />
          </div>
          <div className="text-sm text-amber-300">Bookmarked</div>
          <div className="mt-2 text-xs text-amber-400/70">Your saved words</div>
        </div>
        
        <div className="p-6 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-green-500/20 border border-emerald-500/30 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="text-3xl font-bold text-white">{stats.learned}</div>
            <Trophy className="w-8 h-8 text-emerald-400" />
          </div>
          <div className="text-sm text-emerald-300">Mastered</div>
          <div className="mt-2 text-xs text-emerald-400/70">{stats.masteryPercentage}% completion</div>
        </div>
        
        <div className="p-6 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="text-3xl font-bold text-white">{stats.streak}</div>
            <Flame className="w-8 h-8 text-purple-400" />
          </div>
          <div className="text-sm text-purple-300">Day Streak</div>
          <div className="mt-2 text-xs text-purple-400/70">Keep it going!</div>
        </div>
      </div>
      
      {/* Level Distribution */}
      <div className="p-6 rounded-2xl bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 backdrop-blur-sm">
        <h3 className="text-xl font-bold text-white mb-6">Level Distribution</h3>
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
          {[5, 4, 3, 2, 1].map(level => {
            const count = stats.levelCounts[level as Level];
            const percentage = stats.totalWords > 0 ? (count / stats.totalWords) * 100 : 0;
            const colors = getLevelColors(level as Level);
            
            return (
              <div key={level} className="text-center">
                <div className={`w-16 h-16 ${colors.badge} rounded-full flex items-center justify-center mx-auto mb-3`}>
                  <span className="text-white font-bold">N{level}</span>
                </div>
                <div className="text-2xl font-bold text-white mb-1">{count}</div>
                <div className="text-sm text-gray-400">words</div>
                <div className="mt-2 h-2 bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className={`h-full bg-gradient-to-r ${colors.gradient} rounded-full`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 backdrop-blur-sm">
          <h3 className="text-xl font-bold text-white mb-6">Recent Activity</h3>
          <div className="space-y-4">
            {stats.recentActivity.map((day, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="text-gray-400">{day.date}</div>
                <div className="flex items-center gap-3">
                  <div className="w-32 h-2 bg-gray-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"
                      style={{ width: `${Math.min(day.count * 10, 100)}%` }}
                    />
                  </div>
                  <div className="text-white font-medium w-8 text-right">{day.count}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="p-6 rounded-2xl bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 backdrop-blur-sm">
          <h3 className="text-xl font-bold text-white mb-6">Achievements</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-xl bg-gray-800/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-emerald-500/20 to-green-500/20 rounded-full flex items-center justify-center">
                  <Trophy className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <div className="font-medium text-white">Vocabulary Master</div>
                  <div className="text-sm text-gray-400">Master {stats.learned} words</div>
                </div>
              </div>
              <div className="text-emerald-400 font-bold">{Math.floor(stats.learned / 10)}/10</div>
            </div>
            
            <div className="flex items-center justify-between p-4 rounded-xl bg-gray-800/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-amber-500/20 to-orange-500/20 rounded-full flex items-center justify-center">
                  <Flame className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <div className="font-medium text-white">Learning Streak</div>
                  <div className="text-sm text-gray-400">{stats.streak} days in a row</div>
                </div>
              </div>
              <div className="text-amber-400 font-bold">{stats.streak}/30</div>
            </div>
            
            <div className="flex items-center justify-between p-4 rounded-xl bg-gray-800/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-full flex items-center justify-center">
                  <Brain className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <div className="font-medium text-white">Quiz Champion</div>
                  <div className="text-sm text-gray-400">Complete quizzes</div>
                </div>
              </div>
              <div className="text-blue-400 font-bold">0/5</div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );

  // Main App
  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      darkMode 
        ? 'bg-gradient-to-br from-gray-900 via-black to-gray-900 text-gray-100'
        : 'bg-gradient-to-br from-gray-50 via-white to-blue-50 text-gray-900'
    }`}>
      {/* Header */}
      <header className={`sticky top-0 z-50 backdrop-blur-lg border-b ${
        darkMode ? 'bg-gray-900/80 border-gray-800' : 'bg-white/80 border-gray-200'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-4">
              <div className={`p-2 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 shadow-lg`}>
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                  Japanese Vocabulary Master
                </h1>
                <p className={`mt-1 text-sm ${
                  darkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  {stats.totalWords} words • {stats.masteryPercentage}% Mastered • 🔥 {stats.streak} day streak
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setDarkMode(!darkMode)}
                className="p-2.5 rounded-xl bg-gray-800/50 hover:bg-gray-800/80"
              >
                {darkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-gray-400" />}
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={shuffled ? resetOrder : shuffleWords}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold flex items-center gap-2 shadow-lg hover:shadow-xl"
              >
                {shuffled ? <RotateCw className="w-4 h-4" /> : <Shuffle className="w-4 h-4" />}
                {shuffled ? 'Reset Order' : 'Shuffle'}
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowSettings(!showSettings)}
                className="p-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg"
              >
                <Settings className="w-5 h-5" />
              </motion.button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats & Filters */}
        <div className="mb-8">
          <div className={`rounded-2xl p-6 mb-6 backdrop-blur-sm ${
            darkMode ? 'bg-gray-800/50 border border-gray-700' : 'bg-white border border-gray-200 shadow-lg'
          }`}>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
              <div className={`p-4 rounded-xl ${
                darkMode ? 'bg-gray-800/50' : 'bg-blue-50'
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm text-gray-400">Study Time</div>
                  <Clock className="w-4 h-4 text-blue-400" />
                </div>
                <div className="text-xl font-bold text-white">
                  {Math.floor(stats.totalStudyTime / 60)}h {stats.totalStudyTime % 60}m
                </div>
              </div>
              
              <div className={`p-4 rounded-xl ${
                darkMode ? 'bg-gray-800/50' : 'bg-emerald-50'
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm text-gray-400">Accuracy</div>
                  <Target className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="text-xl font-bold text-white">{stats.averageAccuracy}%</div>
              </div>
              
              <div className={`p-4 rounded-xl ${
                darkMode ? 'bg-gray-800/50' : 'bg-amber-50'
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm text-gray-400">Bookmark Rate</div>
                  <Bookmark className="w-4 h-4 text-amber-400" />
                </div>
                <div className="text-xl font-bold text-white">
                  {Math.round((stats.bookmarked / stats.totalWords) * 100)}%
                </div>
              </div>
              
              <div className={`p-4 rounded-xl ${
                darkMode ? 'bg-gray-800/50' : 'bg-purple-50'
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm text-gray-400">Mastery Rate</div>
                  <TrendingUp className="w-4 h-4 text-purple-400" />
                </div>
                <div className="text-xl font-bold text-white">{stats.masteryPercentage}%</div>
              </div>
              
              <div className={`p-4 rounded-xl ${
                darkMode ? 'bg-gray-800/50' : 'bg-red-50'
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm text-gray-400">Active Days</div>
                  <Flame className="w-4 h-4 text-red-400" />
                </div>
                <div className="text-xl font-bold text-white">{stats.streak}</div>
              </div>
            </div>
            
            {/* Search & Filters */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
              <div className="lg:col-span-2">
                <div className="relative">
                  <Search className={`absolute left-4 top-1/2 transform -translate-y-1/2 ${
                    darkMode ? 'text-gray-500' : 'text-gray-400'
                  }`} />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search words, meanings, readings..."
                    className={`w-full pl-12 pr-4 py-3 rounded-xl border ${
                      darkMode 
                        ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500' 
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                    }`}
                  />
                </div>
              </div>
              
              <select
                value={levelFilter}
                onChange={(e) => setLevelFilter(e.target.value === 'all' ? 'all' : Number(e.target.value) as Level)}
                className={`px-4 py-3 rounded-xl border ${
                  darkMode 
                    ? 'bg-gray-800 border-gray-700 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              >
                <option value="all">🎯 All Levels</option>
                <option value="5">🇯🇵 N5 (Beginner)</option>
                <option value="4">🇯🇵 N4 (Elementary)</option>
                <option value="3">🇯🇵 N3 (Intermediate)</option>
                <option value="2">🇯🇵 N2 (Advanced)</option>
                <option value="1">🇯🇵 N1 (Fluent)</option>
              </select>
              
              <button
                onClick={() => setShowBookmarked(!showBookmarked)}
                className={`px-4 py-3 rounded-xl font-medium flex items-center justify-center gap-2 ${
                  showBookmarked
                    ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg'
                    : darkMode
                      ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Bookmark className="w-4 h-4" />
                {showBookmarked ? 'Bookmarked ✓' : 'Bookmarked'}
              </button>
              
              <button
                onClick={() => setShowLearned(!showLearned)}
                className={`px-4 py-3 rounded-xl font-medium flex items-center justify-center gap-2 ${
                  showLearned
                    ? 'bg-gradient-to-r from-emerald-500 to-green-500 text-white shadow-lg'
                    : darkMode
                      ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Trophy className="w-4 h-4" />
                {showLearned ? 'Mastered ✓' : 'Mastered'}
              </button>
              
              <button
                onClick={() => startQuiz('medium')}
                className={`px-4 py-3 rounded-xl font-medium flex items-center justify-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg hover:shadow-xl`}
              >
                <Gamepad2 className="w-4 h-4" />
                Start Quiz
              </button>
            </div>
          </div>
          
          {/* View Mode Toggle */}
          <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
            <div className="flex gap-2 flex-wrap">
              {[
                { mode: 'grid' as ViewMode, icon: Grid, label: 'Grid' },
                { mode: 'list' as ViewMode, icon: ListIcon, label: 'List' },
                { mode: 'flashcard' as ViewMode, icon: BookOpen, label: 'Flashcards' },
                { mode: 'stats' as ViewMode, icon: BarChart3, label: 'Stats' },
              ].map(({ mode, icon: Icon, label }) => (
                <motion.button
                  key={mode}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setViewMode(mode)}
                  className={`px-4 py-2.5 rounded-xl font-medium flex items-center gap-2 transition-all ${
                    viewMode === mode
                      ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg'
                      : darkMode
                        ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </motion.button>
              ))}
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => startQuiz('hard')}
                className={`px-4 py-2.5 rounded-xl font-medium flex items-center gap-2 ${
                  darkMode
                    ? 'bg-gradient-to-r from-red-500 to-rose-500 text-white shadow-lg'
                    : 'bg-gradient-to-r from-red-400 to-rose-400 text-white shadow-lg'
                }`}
              >
                <Target className="w-4 h-4" />
                Challenge Quiz
              </motion.button>
            </div>
            
            <div className="text-sm text-gray-400">
              Showing {displayedWords.length} of {filteredWords.length} words
              {hasMore && ' • Scroll to load more'}
            </div>
          </div>
        </div>
        
        {/* Content Area */}
        <div ref={containerRef}>
          <AnimatePresence mode="wait">
            {isLoading ? (
              <GridLoadingSkeleton />
            ) : viewMode === 'grid' ? (
              <GridView />
            ) : viewMode === 'list' ? (
              <ListView />
            ) : viewMode === 'flashcard' ? (
              <FlashcardView />
            ) : viewMode === 'stats' ? (
              <StatsView />
            ) : null}
          </AnimatePresence>
          
          {/* Infinite scroll loader */}
          {hasMore && viewMode !== 'flashcard' && viewMode !== 'stats' && (
            <div ref={loaderRef} className="mt-12 text-center">
              <div className="inline-flex items-center gap-3 px-6 py-4 bg-gradient-to-r from-gray-800 to-gray-900 rounded-2xl border border-gray-700">
                <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-gray-400">Loading more words...</span>
              </div>
            </div>
          )}
          
          {/* End of list message */}
          {!hasMore && displayedWords.length > 0 && viewMode !== 'flashcard' && viewMode !== 'stats' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-12 text-center"
            >
              <div className="inline-flex flex-col items-center gap-3 px-8 py-6 bg-gradient-to-r from-emerald-500/10 to-green-500/10 rounded-2xl border border-emerald-500/20">
                <CheckCircle className="w-12 h-12 text-emerald-400" />
                <p className="text-lg font-medium text-white">
                  You've reached the end!
                </p>
                <p className="text-gray-400">
                  You've viewed all {filteredWords.length} words
                </p>
              </div>
            </motion.div>
          )}
        </div>
      </main>

      {/* Settings Panel */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className={`fixed bottom-6 right-6 z-50 ${
              darkMode ? 'bg-gray-800' : 'bg-white'
            } rounded-2xl shadow-2xl border p-6 max-w-sm w-full`}
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-lg text-white">Settings</h3>
              <button
                onClick={() => setShowSettings(false)}
                className="p-2 hover:bg-gray-700/50 rounded-xl"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-6">
              <div>
                <h4 className="font-medium text-gray-400 mb-3">Display</h4>
                <div className="space-y-3">
                  {[
                    { label: 'Show Furigana', state: showFurigana, setter: setShowFurigana, color: 'emerald' },
                    { label: 'Show Romaji', state: showRomaji, setter: setShowRomaji, color: 'blue' },
                    { label: 'Show Examples', state: showExample, setter: setShowExample, color: 'purple' },
                    { label: 'Show Level Badge', state: showLevelBadge, setter: setShowLevelBadge, color: 'amber' },
                    { label: 'Card Animations', state: cardAnimations, setter: setCardAnimations, color: 'pink' },
                    { label: 'Auto-flip Cards', state: autoFlipCards, setter: setAutoFlipCards, color: 'cyan' },
                  ].map(({ label, state, setter, color }) => (
                    <div key={label} className="flex items-center justify-between">
                      <span className="text-sm text-gray-300">{label}</span>
                      <button
                        onClick={() => setter(!state)}
                        className={`w-12 h-6 rounded-full relative transition-colors ${
                          state ? `bg-${color}-500` : 'bg-gray-700'
                        }`}
                      >
                        <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${
                          state ? 'translate-x-7' : 'translate-x-0.5'
                        }`} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-400 mb-3">Audio</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-300">Auto-play Audio</span>
                    <button
                      onClick={() => setAutoPlayAudio(!autoPlayAudio)}
                      className={`w-12 h-6 rounded-full relative transition-colors ${
                        autoPlayAudio ? 'bg-emerald-500' : 'bg-gray-700'
                      }`}
                    >
                      <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${
                        autoPlayAudio ? 'translate-x-7' : 'translate-x-0.5'
                      }`} />
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-300">Speech Rate</span>
                    <select className="px-3 py-1.5 bg-gray-700 rounded-lg text-sm">
                      <option>0.8x</option>
                      <option>1.0x</option>
                      <option>1.2x</option>
                    </select>
                  </div>
                </div>
              </div>
              
              <div className="pt-4 border-t border-gray-700">
                <button
                  onClick={() => {
                    if (window.confirm('Clear all progress? This cannot be undone.')) {
                      localStorage.removeItem('japanese-vocab-progress');
                      window.location.reload();
                    }
                  }}
                  className="w-full px-4 py-3 bg-gradient-to-r from-red-500/20 to-rose-500/20 text-red-400 rounded-xl font-medium hover:from-red-500/30 hover:to-rose-500/30"
                >
                  Reset Progress
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Audio player */}
      <audio ref={audioRef} className="hidden" />
    </div>
  );
};

export default JapaneseVocabularyApp;