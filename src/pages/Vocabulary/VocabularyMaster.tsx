import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  BookOpen, 
  Volume2, 
  Star, 
  CheckCircle, 
  RotateCw,
  Filter,
  Search,
  Layers,
  Bookmark,
  Brain,
  Clock,
  Award,
  ChevronRight,
  ChevronLeft,
  RefreshCw,
  VolumeX,
  Grid,
  List,
  Maximize2,
  Minimize2,
  Menu,
  X,
  Bell,
  Flame,
  Hash,
  Type,
  Target,
  BarChart3,
  Shuffle,
  Download,
  HelpCircle,
  Eye,
  EyeOff,
  ChevronDown,
  ChevronUp,
  Settings,
  Trash2,
  Save,
  BookmarkPlus,
  BookmarkMinus,
  Volume1,
  RotateCcw,
  SkipBack,
  SkipForward,
  Play,
  Pause,
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
  Heart,
  HeartOff,
  Star as StarIcon,
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
  Trophy,
  Zap,
  Target as TargetIcon,
  TrendingUp,
  Brain as BrainIcon,
  BookCheck,
  Clock4,
  Sparkles,
  Music,
  Gamepad2,
  Lightbulb,
  Puzzle
} from 'lucide-react';
import n5Vocabulary from './vocabularyN5.json';
import n4Vocabulary from './vocabularyN4.json';
import n3Vocabulary from './vocabularyN3.json';
import n2Vocabulary from './vocabularyN2.json';
import n1Vocabulary from './vocabularyN1.json';
import { motion, AnimatePresence } from 'framer-motion';

interface VocabularyWord {
  word: string;
  meaning: string;
  furigana: string;
  romaji: string;
  level: number;
  category?: string;
  tags?: string[];
  example?: string;
  notes?: string;
}

interface WordProgress {
  isLearned: boolean;
  isBookmarked: boolean;
  reviews: number;
  correctCount: number;
  incorrectCount: number;
  streak: number;
  lastReviewed: string;
  nextReview: string;
  intervalDays: number;
  easeFactor: number;
}

interface UserProgress {
  bookmarkedWords: string[];
  learnedWords: string[];
  wordProgress: Record<string, WordProgress>;
  dailyStats: Record<string, {
    learned: number;
    reviewed: number;
    totalTime: number;
  }>;
  totalStudyTime: number;
  streak: number;
  lastActive: string;
}

type Level = 'all' | '5' | '4' | '3' | '2' | '1';
type ViewMode = 'flashcard' | 'list' | 'grid' | 'quiz';
type ReviewRating = 'again' | 'hard' | 'good' | 'easy';
type QuizType = 'multiple-choice' | 'typing';
type QuizDifficulty = 'easy' | 'medium' | 'hard';

// Local Storage Utility
class ProgressStorage {
  private static readonly STORAGE_KEY = 'japanese_vocab_progress';
  private static readonly QUIZ_STATS_KEY = 'vocab_quiz_stats';

  static getProgress(): UserProgress {
    if (typeof window === 'undefined') return this.getDefaultProgress();
    
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (!stored) return this.getDefaultProgress();
      
      const parsed = JSON.parse(stored);
      return {
        ...this.getDefaultProgress(),
        ...parsed,
        bookmarkedWords: parsed.bookmarkedWords || [],
        learnedWords: parsed.learnedWords || [],
        wordProgress: parsed.wordProgress || {},
        dailyStats: parsed.dailyStats || {}
      };
    } catch {
      return this.getDefaultProgress();
    }
  }

  static saveProgress(progress: UserProgress): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(progress));
  }

  static getDefaultProgress(): UserProgress {
    return {
      bookmarkedWords: [],
      learnedWords: [],
      wordProgress: {},
      dailyStats: {},
      totalStudyTime: 0,
      streak: 0,
      lastActive: new Date().toISOString()
    };
  }

  static toggleBookmark(word: string): UserProgress {
    const progress = this.getProgress();
    const index = progress.bookmarkedWords.indexOf(word);
    
    if (index === -1) {
      progress.bookmarkedWords.push(word);
    } else {
      progress.bookmarkedWords.splice(index, 1);
    }
    
    progress.lastActive = new Date().toISOString();
    this.saveProgress(progress);
    return progress;
  }

  static toggleLearned(word: string): UserProgress {
    const progress = this.getProgress();
    const index = progress.learnedWords.indexOf(word);
    
    if (index === -1) {
      progress.learnedWords.push(word);
      
      const today = new Date().toISOString().split('T')[0];
      if (!progress.dailyStats[today]) {
        progress.dailyStats[today] = { learned: 0, reviewed: 0, totalTime: 0 };
      }
      progress.dailyStats[today].learned++;
    } else {
      progress.learnedWords.splice(index, 1);
    }
    
    progress.lastActive = new Date().toISOString();
    this.saveProgress(progress);
    return progress;
  }

  static updateWordProgress(word: string, rating: ReviewRating): UserProgress {
    const progress = this.getProgress();
    const wordProgress = progress.wordProgress[word] || {
      isLearned: false,
      isBookmarked: false,
      reviews: 0,
      correctCount: 0,
      incorrectCount: 0,
      streak: 0,
      lastReviewed: new Date().toISOString(),
      nextReview: new Date().toISOString(),
      intervalDays: 1,
      easeFactor: 2.5
    };
    
    wordProgress.reviews++;
    
    switch(rating) {
      case 'again':
        wordProgress.incorrectCount++;
        wordProgress.streak = 0;
        wordProgress.intervalDays = 1;
        wordProgress.easeFactor = Math.max(1.3, wordProgress.easeFactor - 0.2);
        break;
      case 'hard':
        wordProgress.correctCount++;
        wordProgress.intervalDays = Math.max(1, Math.floor(wordProgress.intervalDays * 1.2));
        wordProgress.easeFactor = Math.max(1.3, wordProgress.easeFactor - 0.15);
        wordProgress.streak++;
        break;
      case 'good':
        wordProgress.correctCount++;
        wordProgress.intervalDays = Math.floor(wordProgress.intervalDays * wordProgress.easeFactor);
        wordProgress.streak++;
        break;
      case 'easy':
        wordProgress.correctCount++;
        wordProgress.intervalDays = Math.floor(wordProgress.intervalDays * wordProgress.easeFactor * 1.3);
        wordProgress.easeFactor = wordProgress.easeFactor + 0.1;
        wordProgress.streak++;
        break;
    }
    
    const nextReview = new Date();
    nextReview.setDate(nextReview.getDate() + wordProgress.intervalDays);
    wordProgress.nextReview = nextReview.toISOString();
    wordProgress.lastReviewed = new Date().toISOString();
    
    progress.wordProgress[word] = wordProgress;
    
    const today = new Date().toISOString().split('T')[0];
    if (!progress.dailyStats[today]) {
      progress.dailyStats[today] = { learned: 0, reviewed: 0, totalTime: 0 };
    }
    progress.dailyStats[today].reviewed++;
    
    this.updateStreak(progress);
    
    progress.lastActive = new Date().toISOString();
    this.saveProgress(progress);
    return progress;
  }

  static updateStreak(progress: UserProgress): void {
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];
    
    if (progress.dailyStats[today]?.reviewed > 0) {
      if (progress.dailyStats[yesterdayStr]) {
        progress.streak++;
      } else if (progress.streak === 0) {
        progress.streak = 1;
      }
    }
  }

  static getDueWordsCount(words: VocabularyWord[]): number {
    const progress = this.getProgress();
    const now = new Date();
    
    return words.filter(word => {
      const wordProgress = progress.wordProgress[word.word];
      if (!wordProgress) return false;
      return new Date(wordProgress.nextReview) <= now;
    }).length;
  }

  static getAccuracy(): number {
    const progress = this.getProgress();
    let totalReviews = 0;
    let correctReviews = 0;
    
    Object.values(progress.wordProgress).forEach(word => {
      totalReviews += word.reviews;
      correctReviews += word.correctCount;
    });
    
    return totalReviews > 0 ? Math.round((correctReviews / totalReviews) * 100) : 0;
  }

  static getQuizStats() {
    if (typeof window === 'undefined') return { totalQuizzes: 0, averageScore: 0, highestScore: 0, totalQuestions: 0 };
    const stored = localStorage.getItem(this.QUIZ_STATS_KEY);
    return stored ? JSON.parse(stored) : { totalQuizzes: 0, averageScore: 0, highestScore: 0, totalQuestions: 0 };
  }

  static updateQuizStats(score: number, totalQuestions: number) {
    const stats = this.getQuizStats();
    stats.totalQuizzes++;
    stats.totalQuestions += totalQuestions;
    stats.averageScore = (stats.averageScore * (stats.totalQuizzes - 1) + score) / stats.totalQuizzes;
    stats.highestScore = Math.max(stats.highestScore, score);
    localStorage.setItem(this.QUIZ_STATS_KEY, JSON.stringify(stats));
  }
}

const VocabularyMaster = () => {
  // State Management
  const [allWords, setAllWords] = useState<VocabularyWord[]>([]);
  const [filteredWords, setFilteredWords] = useState<VocabularyWord[]>([]);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [showFurigana, setShowFurigana] = useState(true);
  const [showRomaji, setShowRomaji] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState<Level>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isReviewing, setIsReviewing] = useState(false);
  const [showDueOnly, setShowDueOnly] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('flashcard');
  const [audioPlaying, setAudioPlaying] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [autoFlip, setAutoFlip] = useState(false);
  const [autoPlay, setAutoPlay] = useState(false);
  const [showExample, setShowExample] = useState(true);
  const [cardAnimation, setCardAnimation] = useState(true);
  const [progress, setProgress] = useState<UserProgress>(ProgressStorage.getProgress());

  // Quiz State
  const [quizActive, setQuizActive] = useState(false);
  const [quizType, setQuizType] = useState<QuizType>('multiple-choice');
  const [quizDifficulty, setQuizDifficulty] = useState<QuizDifficulty>('medium');
  const [quizQuestions, setQuizQuestions] = useState<VocabularyWord[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [userInput, setUserInput] = useState('');
  const [timeLeft, setTimeLeft] = useState(30);

  // Refs for performance
  const audioRef = useRef<SpeechSynthesisUtterance | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Stats
  const [stats, setStats] = useState({
    totalWords: 0,
    learnedWords: 0,
    bookmarkedWords: 0,
    dueToday: 0,
    accuracy: 0,
    streak: 0,
    mastery: 0,
    totalReviews: 0,
    quizStats: ProgressStorage.getQuizStats()
  });

  // Animation variants
  const cardVariants = {
    hidden: { opacity: 0, scale: 0.9, rotateX: -10 },
    visible: { opacity: 1, scale: 1, rotateX: 0 },
    exit: { opacity: 0, scale: 0.9, rotateX: 10 }
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  // Initialize
  useEffect(() => {
    loadVocabulary();
    updateStats();
    
    return () => {
      if (audioRef.current) {
        speechSynthesis.cancel();
      }
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  // Load vocabulary
  const loadVocabulary = useCallback(() => {
    setIsLoading(true);
    
    const combinedVocabulary = [
      ...n5Vocabulary.map(word => ({ ...word, level: 5 })),
      ...n4Vocabulary.map(word => ({ ...word, level: 4 })),
      ...n3Vocabulary.map(word => ({ ...word, level: 3 })),
      ...n2Vocabulary.map(word => ({ ...word, level: 2 })),
      ...n1Vocabulary.map(word => ({ ...word, level: 1 }))
    ];
    
    const enrichedVocabulary = combinedVocabulary.map(word => ({
      ...word,
      category: word.category || 'general',
      tags: word.tags || [],
      example: word.example || '',
      notes: word.notes || ''
    }));
    
    setAllWords(enrichedVocabulary);
    setFilteredWords(enrichedVocabulary);
    setIsLoading(false);
    updateStats();
  }, []);

  // Filter words - optimized with useMemo
  useEffect(() => {
    let filtered = allWords;

    if (selectedLevel !== 'all') {
      filtered = filtered.filter(word => word.level.toString() === selectedLevel);
    }

    if (showDueOnly) {
      const now = new Date();
      filtered = filtered.filter(word => {
        const wordProgress = progress.wordProgress[word.word];
        return wordProgress && new Date(wordProgress.nextReview) <= now;
      });
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(word => 
        word.word.toLowerCase().includes(term) ||
        word.meaning.toLowerCase().includes(term) ||
        word.furigana.toLowerCase().includes(term) ||
        word.romaji.toLowerCase().includes(term)
      );
    }

    setFilteredWords(filtered);
    
    if (currentWordIndex >= filtered.length && filtered.length > 0) {
      setCurrentWordIndex(0);
    }
  }, [allWords, selectedLevel, searchTerm, showDueOnly, progress, currentWordIndex]);

  // Update stats
  const updateStats = useCallback(() => {
    const currentProgress = ProgressStorage.getProgress();
    setProgress(currentProgress);
    
    const learnedWords = allWords.filter(word => 
      currentProgress.learnedWords.includes(word.word)
    ).length;
    
    const dueToday = ProgressStorage.getDueWordsCount(allWords);
    const accuracy = ProgressStorage.getAccuracy();
    const totalReviews = Object.values(currentProgress.wordProgress).reduce(
      (sum, word) => sum + word.reviews, 0
    );
    
    const mastery = allWords.length > 0 ? Math.round((learnedWords / allWords.length) * 100) : 0;

    setStats({
      totalWords: allWords.length,
      learnedWords,
      bookmarkedWords: currentProgress.bookmarkedWords.length,
      dueToday,
      accuracy,
      streak: currentProgress.streak,
      mastery,
      totalReviews,
      quizStats: ProgressStorage.getQuizStats()
    });
  }, [allWords]);

  const currentWord = filteredWords[currentWordIndex] || filteredWords[0];

  // Text-to-Speech - optimized
  const playJapaneseAudio = useCallback(async (text: string) => {
    try {
      setAudioPlaying(true);
      
      // Cancel any ongoing speech
      speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ja-JP';
      utterance.rate = 0.8;
      utterance.pitch = 1;
      utterance.volume = 1;
      
      utterance.onend = () => {
        setAudioPlaying(false);
        audioRef.current = null;
      };
      
      utterance.onerror = () => {
        setAudioPlaying(false);
        audioRef.current = null;
      };
      
      audioRef.current = utterance;
      speechSynthesis.speak(utterance);
    } catch (error) {
      console.error('Audio playback failed:', error);
      setAudioPlaying(false);
      audioRef.current = null;
    }
  }, []);

  const stopAudio = useCallback(() => {
    speechSynthesis.cancel();
    setAudioPlaying(false);
    audioRef.current = null;
  }, []);

  // Review word - optimized
  const reviewWord = useCallback(async (rating: ReviewRating) => {
    if (!currentWord) return;
    
    setIsReviewing(true);
    
    try {
      ProgressStorage.updateWordProgress(currentWord.word, rating);
      updateStats();
      
      // Move to next word
      if (currentWordIndex < filteredWords.length - 1) {
        setCurrentWordIndex(prev => prev + 1);
      } else {
        setCurrentWordIndex(0);
      }
      
      setShowAnswer(false);
      
      // Auto-flip if enabled
      if (autoFlip) {
        setTimeout(() => {
          setShowAnswer(true);
        }, 1000);
      }
      
      // Auto-play if enabled
      if (autoPlay && currentWordIndex + 1 < filteredWords.length) {
        const nextWord = filteredWords[currentWordIndex + 1];
        playJapaneseAudio(nextWord.word);
      }
    } catch (error) {
      console.error('Review failed:', error);
    } finally {
      setIsReviewing(false);
    }
  }, [currentWord, currentWordIndex, filteredWords.length, autoFlip, autoPlay, playJapaneseAudio, updateStats]);

  const toggleBookmark = useCallback((word: string) => {
    ProgressStorage.toggleBookmark(word);
    updateStats();
  }, [updateStats]);

  const toggleLearned = useCallback((word: string) => {
    ProgressStorage.toggleLearned(word);
    updateStats();
  }, [updateStats]);

  const resetFilters = useCallback(() => {
    setSelectedLevel('all');
    setSearchTerm('');
    setShowDueOnly(false);
  }, []);

  const nextCard = useCallback(() => {
    setCurrentWordIndex(prev => prev < filteredWords.length - 1 ? prev + 1 : 0);
    setShowAnswer(false);
  }, [filteredWords.length]);

  const prevCard = useCallback(() => {
    setCurrentWordIndex(prev => prev > 0 ? prev - 1 : filteredWords.length - 1);
    setShowAnswer(false);
  }, [filteredWords.length]);

  const shuffleCards = useCallback(() => {
    const shuffled = [...filteredWords];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    setFilteredWords(shuffled);
    setCurrentWordIndex(0);
    setShowAnswer(false);
  }, [filteredWords]);

  // Quiz Functions
  const startQuiz = useCallback((type: QuizType = 'multiple-choice', difficulty: QuizDifficulty = 'medium') => {
    setQuizType(type);
    setQuizDifficulty(difficulty);
    setQuizActive(true);
    setQuizCompleted(false);
    setScore(0);
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setUserInput('');
    
    // Select questions
    let pool = [...filteredWords];
    if (difficulty === 'easy') {
      pool = pool.filter(word => word.level >= 4);
    } else if (difficulty === 'medium') {
      pool = pool.filter(word => word.level >= 3);
    }
    
    // Shuffle and select questions
    const shuffled = [...pool].sort(() => Math.random() - 0.5);
    const questions = shuffled.slice(0, Math.min(10, shuffled.length));
    setQuizQuestions(questions);
    
    // Set time
    const time = difficulty === 'easy' ? 40 : difficulty === 'medium' ? 30 : 20;
    setTimeLeft(time);
  }, [filteredWords]);

  const checkAnswer = useCallback((answer: string) => {
    if (!quizQuestions[currentQuestion]) return;
    
    const correct = answer.toLowerCase() === quizQuestions[currentQuestion].meaning.toLowerCase();
    setSelectedAnswer(answer);
    setIsCorrect(correct);
    setShowResult(true);
    
    if (correct) {
      setScore(prev => prev + 1);
    }
    
    setTimeout(() => {
      if (currentQuestion < quizQuestions.length - 1) {
        setCurrentQuestion(prev => prev + 1);
        setSelectedAnswer(null);
        setShowResult(false);
        setUserInput('');
        const time = quizDifficulty === 'easy' ? 40 : quizDifficulty === 'medium' ? 30 : 20;
        setTimeLeft(time);
      } else {
        setQuizCompleted(true);
        ProgressStorage.updateQuizStats(score + (correct ? 1 : 0), quizQuestions.length);
        updateStats();
      }
    }, 1500);
  }, [quizQuestions, currentQuestion, quizDifficulty, score, updateStats]);

  const checkTypingAnswer = useCallback(() => {
    if (!userInput.trim() || !quizQuestions[currentQuestion]) return;
    
    const correct = userInput.toLowerCase() === quizQuestions[currentQuestion].meaning.toLowerCase();
    setIsCorrect(correct);
    setShowResult(true);
    
    if (correct) {
      setScore(prev => prev + 1);
    }
    
    setTimeout(() => {
      if (currentQuestion < quizQuestions.length - 1) {
        setCurrentQuestion(prev => prev + 1);
        setUserInput('');
        setShowResult(false);
        const time = quizDifficulty === 'easy' ? 40 : quizDifficulty === 'medium' ? 30 : 20;
        setTimeLeft(time);
      } else {
        setQuizCompleted(true);
        ProgressStorage.updateQuizStats(score + (correct ? 1 : 0), quizQuestions.length);
        updateStats();
      }
    }, 1500);
  }, [userInput, quizQuestions, currentQuestion, quizDifficulty, score, updateStats]);

  // Timer effect for quiz - optimized
  useEffect(() => {
    if (!quizActive || quizCompleted || showResult) return;
    
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          if (currentQuestion < quizQuestions.length - 1) {
            setCurrentQuestion(prev => prev + 1);
            const time = quizDifficulty === 'easy' ? 40 : quizDifficulty === 'medium' ? 30 : 20;
            return time;
          } else {
            setQuizCompleted(true);
            ProgressStorage.updateQuizStats(score, quizQuestions.length);
            updateStats();
            return 0;
          }
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [quizActive, quizCompleted, currentQuestion, showResult, quizQuestions.length, quizDifficulty, score, updateStats]);

  // Keyboard shortcuts
  const handleKeyPress = useCallback((event: KeyboardEvent) => {
    if (quizActive) {
      if (event.key === 'Enter' && quizType === 'typing') {
        checkTypingAnswer();
      }
      return;
    }
    
    if (viewMode !== 'flashcard') return;
    
    switch(event.key) {
      case 'ArrowLeft':
        prevCard();
        break;
      case 'ArrowRight':
        nextCard();
        break;
      case ' ':
        event.preventDefault();
        setShowAnswer(!showAnswer);
        break;
      case '1':
        reviewWord('again');
        break;
      case '2':
        reviewWord('hard');
        break;
      case '3':
        reviewWord('good');
        break;
      case '4':
        reviewWord('easy');
        break;
      case 'a':
        if (currentWord) playJapaneseAudio(currentWord.word);
        break;
      case 'b':
        if (currentWord) toggleBookmark(currentWord.word);
        break;
      case 'l':
        if (currentWord) toggleLearned(currentWord.word);
        break;
      case 's':
        shuffleCards();
        break;
      case 'f':
        setFullscreen(!fullscreen);
        break;
      case 'r':
        loadVocabulary();
        break;
      case 'q':
        startQuiz();
        break;
    }
  }, [quizActive, quizType, viewMode, showAnswer, currentWord, prevCard, nextCard, reviewWord, playJapaneseAudio, toggleBookmark, toggleLearned, shuffleCards, loadVocabulary, startQuiz, checkTypingAnswer]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);

  // Clear all progress
  const clearProgress = () => {
    if (window.confirm('Are you sure you want to clear all progress? This cannot be undone.')) {
      localStorage.removeItem('japanese_vocab_progress');
      localStorage.removeItem('vocab_quiz_stats');
      setProgress(ProgressStorage.getDefaultProgress());
      updateStats();
    }
  };

  // Export progress
  const exportProgress = () => {
    const progress = ProgressStorage.getProgress();
    const dataStr = JSON.stringify(progress, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', `japanese-vocab-progress-${new Date().toISOString().split('T')[0]}.json`);
    linkElement.click();
  };

  // Skip question in quiz
  const skipQuestion = useCallback(() => {
    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setSelectedAnswer(null);
      setShowResult(false);
      setUserInput('');
      const time = quizDifficulty === 'easy' ? 40 : quizDifficulty === 'medium' ? 30 : 20;
      setTimeLeft(time);
    } else {
      setQuizCompleted(true);
      ProgressStorage.updateQuizStats(score, quizQuestions.length);
      updateStats();
    }
  }, [currentQuestion, quizQuestions.length, quizDifficulty, score, updateStats]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center space-y-6"
        >
          <div className="relative inline-block">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-20 h-20 rounded-2xl bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center"
            >
              <BookOpen className="w-10 h-10 text-white" />
            </motion.div>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-800">Loading Vocabulary</h3>
            <p className="text-gray-600 mt-2">Preparing your learning journey...</p>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 ${fullscreen ? 'fixed inset-0 z-50' : ''}`}>
      <div className={`relative ${fullscreen ? 'h-screen overflow-hidden' : 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6'}`}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 sm:mb-8"
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800">
                Japanese Vocabulary Master
              </h1>
              <p className="text-gray-600 mt-1 sm:mt-2 text-sm sm:text-base">
                Master <span className="font-bold text-blue-600">{stats.totalWords}</span> words across all JLPT levels
              </p>
            </div>
            <div className="flex items-center gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => startQuiz()}
                className="px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg sm:rounded-xl font-semibold text-sm sm:text-base hover:shadow-lg transition-all duration-200 flex items-center gap-2"
              >
                <Gamepad2 className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="hidden sm:inline">Start Quiz</span>
                <span className="sm:hidden">Quiz</span>
              </motion.button>
              <button
                onClick={() => setFullscreen(!fullscreen)}
                className="p-2 sm:p-3 rounded-lg sm:rounded-xl bg-white/80 backdrop-blur-sm border border-gray-200 hover:bg-white transition-all hover:shadow-md"
                title={fullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
              >
                {fullscreen ? <Minimize2 className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700" /> : <Maximize2 className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700" />}
              </button>
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="p-2 sm:p-3 rounded-lg sm:rounded-xl bg-white/80 backdrop-blur-sm border border-gray-200 hover:bg-white transition-all hover:shadow-md"
                title="Settings"
              >
                <Settings className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700" />
              </button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4 mb-6 sm:mb-8">
            {[
              { icon: BookOpen, label: 'Total Words', value: stats.totalWords, color: 'from-blue-500 to-cyan-500' },
              { icon: Trophy, label: 'Mastered', value: stats.learnedWords, color: 'from-emerald-500 to-green-500' },
              { icon: Bell, label: 'Due Today', value: stats.dueToday, color: 'from-amber-500 to-orange-500' },
              { icon: Flame, label: 'Day Streak', value: stats.streak, color: 'from-rose-500 to-pink-500' },
              { icon: TargetIcon, label: 'Accuracy', value: `${stats.accuracy}%`, color: 'from-purple-500 to-violet-500' },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -3 }}
                className="bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-gray-200 p-3 sm:p-4 hover:shadow-lg transition-all duration-300"
              >
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className={`p-2 sm:p-3 rounded-lg sm:rounded-xl bg-gradient-to-r ${stat.color}`}>
                    <stat.icon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-lg sm:text-xl font-bold text-gray-800 truncate">{stat.value}</div>
                    <div className="text-xs sm:text-sm text-gray-600 truncate">{stat.label}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Filters Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-gray-200 p-4 sm:p-6 mb-6 sm:mb-8 shadow-sm"
          >
            <div className="flex flex-col lg:flex-row lg:items-center gap-4 sm:gap-6">
              {/* Search */}
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
                  <input
                    type="text"
                    placeholder="Search Japanese, English, reading..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-9 sm:pl-12 pr-8 sm:pr-10 py-2.5 sm:py-3.5 bg-white border border-gray-300 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 sm:focus:ring-3 focus:ring-blue-500/30 focus:border-blue-500 text-gray-900 placeholder-gray-500 transition-all duration-300 text-sm sm:text-base"
                  />
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm('')}
                      className="absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      <X className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Level Filter & View Mode */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <div className="relative">
                  <select
                    value={selectedLevel}
                    onChange={(e) => setSelectedLevel(e.target.value as Level)}
                    className="w-full py-2.5 sm:py-3.5 px-4 sm:px-6 bg-white border border-gray-300 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 sm:focus:ring-3 focus:ring-blue-500/30 focus:border-blue-500 text-gray-900 appearance-none pr-8 sm:pr-10 transition-all duration-300 text-sm sm:text-base"
                  >
                    <option value="all">All JLPT Levels</option>
                    <option value="5">N5 (Beginner)</option>
                    <option value="4">N4 (Elementary)</option>
                    <option value="3">N3 (Intermediate)</option>
                    <option value="2">N2 (Advanced)</option>
                    <option value="1">N1 (Fluent)</option>
                  </select>
                  <ChevronDown className="absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5 pointer-events-none" />
                </div>

                {/* View Mode Toggle */}
                <div className="flex bg-gray-100 p-1 rounded-lg sm:rounded-xl">
                  {[
                    { mode: 'flashcard', icon: Layers, label: 'Cards' },
                    { mode: 'list', icon: List, label: 'List' },
                    { mode: 'grid', icon: Grid, label: 'Grid' },
                    { mode: 'quiz', icon: Gamepad2, label: 'Quiz' },
                  ].map(({ mode, icon: Icon, label }) => (
                    <motion.button
                      key={mode}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setViewMode(mode as ViewMode)}
                      className={`px-3 sm:px-4 py-1.5 sm:py-2.5 rounded-md sm:rounded-lg transition-all duration-300 flex items-center gap-1 sm:gap-2 text-xs sm:text-sm ${
                        viewMode === mode 
                          ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-sm sm:shadow-md' 
                          : 'text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      <Icon className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span className="font-medium">{label}</span>
                    </motion.button>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap gap-2 sm:gap-3 mt-4 sm:mt-6">
              {[
                { icon: Bell, label: `Due Only (${stats.dueToday})`, active: showDueOnly, onClick: () => setShowDueOnly(!showDueOnly), color: 'amber' },
                { icon: Type, label: 'Furigana', active: showFurigana, onClick: () => setShowFurigana(!showFurigana), color: 'emerald' },
                { icon: Hash, label: 'Romaji', active: showRomaji, onClick: () => setShowRomaji(!showRomaji), color: 'purple' },
                { icon: Shuffle, label: 'Shuffle', onClick: shuffleCards },
                { icon: RotateCw, label: 'Reset', onClick: resetFilters },
              ].map((action) => (
                <motion.button
                  key={action.label}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={action.onClick}
                  className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl flex items-center gap-1 sm:gap-2 transition-all duration-300 text-xs sm:text-sm ${
                    action.active
                      ? `bg-${action.color}-100 text-${action.color}-700 border border-${action.color}-200`
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <action.icon className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="font-medium">{action.label}</span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        </motion.div>

        {/* Main Content */}
        <AnimatePresence mode="wait">
          {filteredWords.length === 0 ? (
            <motion.div
              key="no-results"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-gray-200 p-6 sm:p-8 md:p-12 text-center"
            >
              <div className="max-w-md mx-auto">
                <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 mx-auto mb-4 sm:mb-6 rounded-xl sm:rounded-2xl bg-gradient-to-r from-blue-100 to-purple-100 flex items-center justify-center">
                  <Search className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-blue-500" />
                </div>
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 mb-2 sm:mb-3">No Words Found</h3>
                <p className="text-gray-600 mb-4 sm:mb-6 md:mb-8 text-sm sm:text-base">
                  Try adjusting your filters or search term to find vocabulary.
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={resetFilters}
                  className="px-4 sm:px-5 md:px-6 py-2 sm:py-2.5 md:py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg sm:rounded-xl font-semibold hover:shadow-lg transition-all duration-200 text-sm sm:text-base"
                >
                  Reset All Filters
                </motion.button>
              </div>
            </motion.div>
          ) : quizActive ? (
            // Quiz View
            <motion.div
              key="quiz"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-gray-200 overflow-hidden shadow-lg"
            >
              {/* Quiz Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-6 border-b border-gray-200 bg-gradient-to-r from-blue-500 to-purple-500">
                <div className="flex items-center gap-2 sm:gap-4 mb-3 sm:mb-0">
                  <div className="p-1.5 sm:p-2 bg-white/20 rounded-md sm:rounded-lg">
                    <Gamepad2 className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-white">Vocabulary Quiz</h3>
                    <p className="text-white/80 text-xs sm:text-sm">
                      {quizType === 'multiple-choice' ? 'Multiple Choice' : 'Typing Challenge'} • {quizDifficulty} Level
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between sm:justify-end gap-4 sm:gap-6">
                  <div className="text-center">
                    <div className="text-xl sm:text-2xl font-bold text-white">{score}/{quizQuestions.length}</div>
                    <div className="text-white/80 text-xs sm:text-sm">Score</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl sm:text-2xl font-bold text-white">{currentQuestion + 1}/{quizQuestions.length}</div>
                    <div className="text-white/80 text-xs sm:text-sm">Question</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl sm:text-2xl font-bold text-white">{timeLeft}s</div>
                    <div className="text-white/80 text-xs sm:text-sm">Time</div>
                  </div>
                </div>
              </div>

              {/* Quiz Content */}
              <div className="p-4 sm:p-6 md:p-8">
                {quizCompleted ? (
                  <div className="max-w-2xl mx-auto text-center py-6 sm:py-8 md:py-12">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 mx-auto mb-4 sm:mb-6 md:mb-8 rounded-full bg-gradient-to-r from-emerald-400 to-green-500 flex items-center justify-center"
                    >
                      <Trophy className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 text-white" />
                    </motion.div>
                    
                    <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-3 sm:mb-4">Quiz Completed!</h3>
                    
                    <div className="text-4xl sm:text-5xl md:text-6xl font-bold text-blue-600 mb-4 sm:mb-6">
                      {Math.round((score / quizQuestions.length) * 100)}%
                    </div>
                    
                    <p className="text-gray-600 mb-4 sm:mb-6 md:mb-8 text-sm sm:text-base md:text-lg">
                      You got {score} out of {quizQuestions.length} questions correct
                    </p>
                    
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setQuizActive(false)}
                        className="px-4 sm:px-5 md:px-6 py-2 sm:py-2.5 md:py-3 bg-gray-100 text-gray-700 rounded-lg sm:rounded-xl font-semibold hover:bg-gray-200 transition-all duration-200 text-sm sm:text-base"
                      >
                        Back to Study
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => startQuiz(quizType, quizDifficulty)}
                        className="px-4 sm:px-5 md:px-6 py-2 sm:py-2.5 md:py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg sm:rounded-xl font-semibold hover:shadow-lg transition-all duration-200 text-sm sm:text-base"
                      >
                        Try Again
                      </motion.button>
                    </div>
                  </div>
                ) : quizQuestions[currentQuestion] ? (
                  <div className="max-w-4xl mx-auto">
                    {/* Question */}
                    <div className="text-center mb-6 sm:mb-8 md:mb-12">
                      <div className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800 mb-3 sm:mb-4 md:mb-6 font-japanese">
                        {quizQuestions[currentQuestion].word}
                      </div>
                      
                      {showFurigana && (
                        <div className="text-lg sm:text-xl md:text-2xl text-gray-600 mb-3 sm:mb-4">
                          {quizQuestions[currentQuestion].furigana}
                        </div>
                      )}
                      
                      <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-blue-100 text-blue-700 rounded-full text-xs sm:text-sm font-medium">
                        <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                        {timeLeft} seconds remaining
                      </div>
                    </div>

                    {/* Answer Section */}
                    {quizType === 'multiple-choice' ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                        {(() => {
                          const currentQ = quizQuestions[currentQuestion];
                          const otherWords = quizQuestions
                            .filter((_, i) => i !== currentQuestion)
                            .sort(() => Math.random() - 0.5)
                            .slice(0, 3)
                            .map(w => w.meaning);
                          
                          const options = [currentQ.meaning, ...otherWords].sort(() => Math.random() - 0.5);
                          
                          return options.map((option, index) => (
                            <motion.button
                              key={index}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.1 }}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => checkAnswer(option)}
                              disabled={showResult}
                              className={`p-3 sm:p-4 md:p-6 rounded-lg sm:rounded-xl text-left transition-all duration-300 ${
                                showResult
                                  ? option.toLowerCase() === currentQ.meaning.toLowerCase()
                                    ? 'bg-emerald-100 border-2 border-emerald-500'
                                    : selectedAnswer === option
                                    ? 'bg-rose-100 border-2 border-rose-500'
                                    : 'bg-gray-100 border-2 border-transparent'
                                  : 'bg-white border-2 border-gray-200 hover:border-blue-500 hover:shadow-md'
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <div className="text-sm sm:text-base md:text-lg font-medium text-gray-800 truncate">{option}</div>
                                <div className={`w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm font-medium ${
                                  showResult && option.toLowerCase() === currentQ.meaning.toLowerCase()
                                    ? 'bg-emerald-500 text-white'
                                    : 'bg-gray-100 text-gray-600'
                                }`}>
                                  {String.fromCharCode(65 + index)}
                                </div>
                              </div>
                            </motion.button>
                          ));
                        })()}
                      </div>
                    ) : (
                      <div className="max-w-md mx-auto">
                        <div className="text-center mb-4 sm:mb-6 md:mb-8">
                          <p className="text-gray-600 mb-2 sm:mb-3 md:mb-4 text-sm sm:text-base">Type the English meaning:</p>
                          <input
                            type="text"
                            value={userInput}
                            onChange={(e) => setUserInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && checkTypingAnswer()}
                            disabled={showResult}
                            className="w-full px-4 sm:px-5 md:px-6 py-3 sm:py-3.5 md:py-4 text-base sm:text-lg md:text-xl border-2 border-gray-300 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-center disabled:opacity-50"
                            placeholder="Enter meaning..."
                            autoFocus
                          />
                        </div>
                        
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={checkTypingAnswer}
                          disabled={!userInput.trim() || showResult}
                          className="w-full py-3 sm:py-3.5 md:py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg sm:rounded-xl font-semibold text-sm sm:text-base md:text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {showResult ? (isCorrect ? 'Correct! 🎉' : 'Wrong! 😢') : 'Submit Answer'}
                        </motion.button>
                      </div>
                    )}

                    {/* Result Feedback */}
                    {showResult && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-4 sm:mt-6 md:mt-8 text-center"
                      >
                        <div className={`inline-flex items-center gap-2 sm:gap-3 px-4 sm:px-5 md:px-6 py-2.5 sm:py-3 md:py-4 rounded-lg sm:rounded-xl ${
                          isCorrect ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                        }`}>
                          {isCorrect ? (
                            <>
                              <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
                              <span className="text-sm sm:text-base md:text-lg font-semibold">Correct! "{quizQuestions[currentQuestion].meaning}"</span>
                            </>
                          ) : (
                            <>
                              <X className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
                              <span className="text-sm sm:text-base md:text-lg font-semibold">Correct: "{quizQuestions[currentQuestion].meaning}"</span>
                            </>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </div>
                ) : null}
              </div>

              {/* Quiz Footer */}
              <div className="flex flex-col sm:flex-row items-center justify-between p-4 sm:p-6 border-t border-gray-200 bg-gray-50/50 gap-3 sm:gap-0">
                <button
                  onClick={() => setQuizActive(false)}
                  className="w-full sm:w-auto px-4 sm:px-5 md:px-6 py-2 sm:py-2.5 bg-gray-100 text-gray-700 rounded-lg sm:rounded-xl hover:bg-gray-200 transition-colors flex items-center justify-center gap-2 text-sm sm:text-base"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Exit Quiz
                </button>
                
                <div className="flex gap-2">
                  {quizDifficulty === 'easy' && <span className="px-2 sm:px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs sm:text-sm">Easy</span>}
                  {quizDifficulty === 'medium' && <span className="px-2 sm:px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs sm:text-sm">Medium</span>}
                  {quizDifficulty === 'hard' && <span className="px-2 sm:px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs sm:text-sm">Hard</span>}
                </div>
                
                {!quizCompleted && (
                  <button
                    onClick={skipQuestion}
                    className="w-full sm:w-auto px-4 sm:px-5 md:px-6 py-2 sm:py-2.5 bg-blue-100 text-blue-700 rounded-lg sm:rounded-xl hover:bg-blue-200 transition-colors text-sm sm:text-base"
                  >
                    Skip Question
                  </button>
                )}
              </div>
            </motion.div>
          ) : viewMode === 'flashcard' ? (
            // Flashcard View
            <motion.div
              key="flashcard"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-gray-200 overflow-hidden shadow-lg ${fullscreen ? 'h-[calc(100vh-120px)]' : ''}`}
            >
              {/* Card Header */}
              <div className="flex items-center justify-between p-3 sm:p-4 md:p-6 border-b border-gray-200">
                <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
                  <div className={`px-2 sm:px-3 md:px-4 py-1 sm:py-1.5 md:py-2 rounded-full text-xs sm:text-sm font-semibold ${
                    currentWord?.level === 5 ? 'bg-green-100 text-green-700' :
                    currentWord?.level === 4 ? 'bg-blue-100 text-blue-700' :
                    currentWord?.level === 3 ? 'bg-yellow-100 text-yellow-700' :
                    currentWord?.level === 2 ? 'bg-orange-100 text-orange-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    N{currentWord?.level}
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600">
                    Card {currentWordIndex + 1} of {filteredWords.length}
                  </div>
                </div>
                
                <div className="flex items-center gap-1 sm:gap-2">
                  <button
                    onClick={() => currentWord && toggleBookmark(currentWord.word)}
                    className={`p-2 sm:p-2.5 md:p-3 rounded-lg sm:rounded-xl transition-all duration-300 ${
                      currentWord && progress.bookmarkedWords.includes(currentWord.word)
                        ? 'bg-amber-100 text-amber-600 hover:bg-amber-200'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    <Bookmark className={`w-4 h-4 sm:w-5 sm:h-5 ${currentWord && progress.bookmarkedWords.includes(currentWord.word) ? 'fill-current' : ''}`} />
                  </button>
                  <button
                    onClick={() => currentWord && playJapaneseAudio(currentWord.word)}
                    disabled={audioPlaying}
                    className="p-2 sm:p-2.5 md:p-3 rounded-lg sm:rounded-xl bg-blue-100 text-blue-600 hover:bg-blue-200 disabled:opacity-50 transition-all duration-300"
                  >
                    {audioPlaying ? (
                      <VolumeX className="w-4 h-4 sm:w-5 sm:h-5" />
                    ) : (
                      <Volume2 className="w-4 h-4 sm:w-5 sm:h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Card Content */}
              <div className={`p-4 sm:p-6 md:p-8 lg:p-12 ${fullscreen ? 'h-[calc(100%-64px)] sm:h-[calc(100%-80px)] flex items-center' : ''}`}>
                <div className="max-w-3xl mx-auto text-center">
                  <motion.div
                    key={currentWordIndex}
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    transition={{ duration: 0.3 }}
                  >
                    {/* Japanese Word */}
                    <div className="mb-6 sm:mb-8 md:mb-10">
                      <motion.div
                        className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-gray-800 mb-3 sm:mb-4 md:mb-6 font-japanese"
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.3 }}
                      >
                        {currentWord?.word}
                      </motion.div>
                      
                      {showFurigana && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.1 }}
                          className="text-lg sm:text-xl md:text-2xl text-gray-600 mb-2 sm:mb-3"
                        >
                          {currentWord?.furigana}
                        </motion.div>
                      )}
                      
                      {showRomaji && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.2 }}
                          className="text-sm sm:text-base md:text-lg text-gray-500"
                        >
                          {currentWord?.romaji}
                        </motion.div>
                      )}
                    </div>

                    {/* Answer Section */}
                    {!showAnswer ? (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                      >
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setShowAnswer(true)}
                          className="px-6 sm:px-8 md:px-10 py-3 sm:py-4 md:py-5 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl sm:rounded-2xl font-bold text-base sm:text-lg md:text-xl hover:shadow-xl transition-all duration-200 shadow-lg"
                        >
                          Show Meaning
                        </motion.button>
                        <p className="text-gray-500 mt-3 sm:mt-4 md:mt-6 text-xs sm:text-sm">
                          Press Space or click to reveal
                        </p>
                      </motion.div>
                    ) : (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-6 sm:space-y-8 md:space-y-10"
                      >
                        {/* English Meaning */}
                        <div>
                          <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-3 sm:mb-4">
                            {currentWord?.meaning}
                          </div>
                          {showExample && currentWord?.example && (
                            <div className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-600 italic mt-3 sm:mt-4 md:mt-6 bg-gray-50 p-3 sm:p-4 md:p-6 rounded-lg sm:rounded-xl">
                              "{currentWord.example}"
                            </div>
                          )}
                        </div>

                        {/* Review Buttons */}
                        {!isReviewing ? (
                          <motion.div 
                            className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3 md:gap-4"
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.1 }}
                          >
                            {[
                              { rating: 'again', label: 'Again (1)', color: 'red' },
                              { rating: 'hard', label: 'Hard (2)', color: 'amber' },
                              { rating: 'good', label: 'Good (3)', color: 'blue' },
                              { rating: 'easy', label: 'Easy (4)', color: 'emerald' },
                            ].map(({ rating, label, color }) => (
                              <motion.button
                                key={rating}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => reviewWord(rating as ReviewRating)}
                                className={`px-3 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 bg-${color}-100 text-${color}-700 rounded-lg sm:rounded-xl font-semibold hover:bg-${color}-200 transition-all duration-300 border-2 border-transparent hover:border-${color}-300 text-sm sm:text-base`}
                              >
                                {label}
                              </motion.button>
                            ))}
                          </motion.div>
                        ) : (
                          <div className="flex justify-center">
                            <div className="animate-spin rounded-full h-12 w-12 sm:h-14 sm:w-14 md:h-16 md:w-16 border-4 border-blue-500 border-t-transparent"></div>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </motion.div>
                </div>
              </div>

              {/* Card Footer */}
              <div className="flex flex-col sm:flex-row items-center justify-between p-3 sm:p-4 md:p-6 border-t border-gray-200 bg-gray-50/50 gap-3 sm:gap-0">
                <button
                  onClick={prevCard}
                  disabled={isReviewing}
                  className="w-full sm:w-auto px-4 sm:px-5 md:px-6 py-2 sm:py-2.5 bg-white text-gray-700 rounded-lg sm:rounded-xl hover:bg-gray-100 disabled:opacity-50 transition-colors flex items-center justify-center gap-2 border-2 border-gray-200 text-sm sm:text-base"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </button>
                
                <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
                  <button
                    onClick={() => currentWord && toggleLearned(currentWord.word)}
                    className={`px-3 sm:px-4 md:px-5 py-1.5 sm:py-2 md:py-2.5 rounded-lg sm:rounded-xl flex items-center gap-2 transition-all duration-300 text-sm sm:text-base ${
                      currentWord && progress.learnedWords.includes(currentWord.word)
                        ? 'bg-emerald-100 text-emerald-700 border-2 border-emerald-200'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border-2 border-gray-200'
                    }`}
                  >
                    <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                    {currentWord && progress.learnedWords.includes(currentWord.word) ? 'Learned' : 'Mark Learned'}
                  </button>
                  <button
                    onClick={shuffleCards}
                    className="px-3 sm:px-4 md:px-5 py-1.5 sm:py-2 md:py-2.5 bg-gray-100 text-gray-700 rounded-lg sm:rounded-xl hover:bg-gray-200 transition-colors flex items-center gap-2 text-sm sm:text-base"
                  >
                    <Shuffle className="w-3 h-3 sm:w-4 sm:h-4" />
                    Shuffle
                  </button>
                </div>
                
                <button
                  onClick={nextCard}
                  disabled={isReviewing}
                  className="w-full sm:w-auto px-4 sm:px-5 md:px-6 py-2 sm:py-2.5 bg-white text-gray-700 rounded-lg sm:rounded-xl hover:bg-gray-100 disabled:opacity-50 transition-colors flex items-center justify-center gap-2 border-2 border-gray-200 text-sm sm:text-base"
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ) : viewMode === 'list' ? (
            // List View
            <motion.div
              key="list"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-gray-200 overflow-hidden"
            >
              <div className="overflow-x-auto">
                <table className="w-full min-w-[600px]">
                  <thead className="bg-gradient-to-r from-blue-500/10 to-purple-500/10">
                    <tr>
                      <th className="py-3 sm:py-4 md:py-5 px-3 sm:px-4 md:px-6 text-left text-xs sm:text-sm font-semibold text-gray-700 border-b border-gray-200">Japanese</th>
                      <th className="py-3 sm:py-4 md:py-5 px-3 sm:px-4 md:px-6 text-left text-xs sm:text-sm font-semibold text-gray-700 border-b border-gray-200">Reading</th>
                      <th className="py-3 sm:py-4 md:py-5 px-3 sm:px-4 md:px-6 text-left text-xs sm:text-sm font-semibold text-gray-700 border-b border-gray-200">English</th>
                      <th className="py-3 sm:py-4 md:py-5 px-3 sm:px-4 md:px-6 text-left text-xs sm:text-sm font-semibold text-gray-700 border-b border-gray-200">Level</th>
                      <th className="py-3 sm:py-4 md:py-5 px-3 sm:px-4 md:px-6 text-left text-xs sm:text-sm font-semibold text-gray-700 border-b border-gray-200">Status</th>
                      <th className="py-3 sm:py-4 md:py-5 px-3 sm:px-4 md:px-6 text-left text-xs sm:text-sm font-semibold text-gray-700 border-b border-gray-200">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredWords.map((word, index) => {
                      const isBookmarked = progress.bookmarkedWords.includes(word.word);
                      const isLearned = progress.learnedWords.includes(word.word);
                      
                      return (
                        <motion.tr
                          key={`${word.word}-${index}`}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.03 }}
                          className="hover:bg-gray-50/50 transition-colors duration-150"
                        >
                          <td className="py-3 sm:py-4 md:py-5 px-3 sm:px-4 md:px-6">
                            <div className="font-japanese text-base sm:text-lg md:text-xl font-bold text-gray-800">{word.word}</div>
                            <div className="text-xs sm:text-sm text-gray-500">{word.furigana}</div>
                          </td>
                          <td className="py-3 sm:py-4 md:py-5 px-3 sm:px-4 md:px-6 font-mono text-xs sm:text-sm text-gray-700">{word.romaji}</td>
                          <td className="py-3 sm:py-4 md:py-5 px-3 sm:px-4 md:px-6 text-xs sm:text-sm md:text-base text-gray-700">{word.meaning}</td>
                          <td className="py-3 sm:py-4 md:py-5 px-3 sm:px-4 md:px-6">
                            <span className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs font-semibold ${
                              word.level === 5 ? 'bg-green-100 text-green-700' :
                              word.level === 4 ? 'bg-blue-100 text-blue-700' :
                              word.level === 3 ? 'bg-yellow-100 text-yellow-700' :
                              word.level === 2 ? 'bg-orange-100 text-orange-700' :
                              'bg-red-100 text-red-700'
                            }`}>
                              N{word.level}
                            </span>
                          </td>
                          <td className="py-3 sm:py-4 md:py-5 px-3 sm:px-4 md:px-6">
                            <div className="flex flex-wrap gap-1">
                              {isLearned && (
                                <span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-semibold">
                                  Learned
                                </span>
                              )}
                              {isBookmarked && (
                                <span className="px-2 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-semibold">
                                  Bookmarked
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="py-3 sm:py-4 md:py-5 px-3 sm:px-4 md:px-6">
                            <div className="flex gap-1 sm:gap-2">
                              <button
                                onClick={() => {
                                  const wordIndex = filteredWords.findIndex(w => w.word === word.word);
                                  setCurrentWordIndex(wordIndex);
                                  setViewMode('flashcard');
                                }}
                                className="p-1.5 sm:p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                              >
                                <BookOpen className="w-3 h-3 sm:w-4 sm:h-4" />
                              </button>
                              <button
                                onClick={() => toggleBookmark(word.word)}
                                className={`p-1.5 sm:p-2 rounded-lg transition-colors duration-200 ${
                                  isBookmarked 
                                    ? 'text-amber-600 hover:bg-amber-50' 
                                    : 'text-gray-600 hover:bg-gray-100'
                                }`}
                              >
                                <Bookmark className={`w-3 h-3 sm:w-4 sm:h-4 ${isBookmarked ? 'fill-current' : ''}`} />
                              </button>
                              <button
                                onClick={() => playJapaneseAudio(word.word)}
                                className="p-1.5 sm:p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors duration-200"
                              >
                                <Volume2 className="w-3 h-3 sm:w-4 sm:h-4" />
                              </button>
                            </div>
                          </td>
                        </motion.tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </motion.div>
          ) : (
            // Grid View
            <motion.div
              key="grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6"
            >
              {filteredWords.map((word, index) => {
                const isBookmarked = progress.bookmarkedWords.includes(word.word);
                const isLearned = progress.learnedWords.includes(word.word);
                
                return (
                  <motion.div
                    key={`${word.word}-${index}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: index * 0.03 }}
                    whileHover={{ y: -4, transition: { duration: 0.2 } }}
                    className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200 p-3 sm:p-4 md:p-6 hover:shadow-lg transition-all duration-300 hover:border-blue-300 group"
                  >
                    <div className="flex justify-between items-start mb-3 sm:mb-4 md:mb-5">
                      <div className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs font-semibold ${
                        word.level === 5 ? 'bg-green-100 text-green-700' :
                        word.level === 4 ? 'bg-blue-100 text-blue-700' :
                        word.level === 3 ? 'bg-yellow-100 text-yellow-700' :
                        word.level === 2 ? 'bg-orange-100 text-orange-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        N{word.level}
                      </div>
                      <button
                        onClick={() => toggleBookmark(word.word)}
                        className="text-gray-400 hover:text-amber-500 transition-all duration-300"
                      >
                        <Bookmark className={`w-4 h-4 sm:w-5 sm:h-5 ${isBookmarked ? 'fill-current text-amber-500' : ''}`} />
                      </button>
                    </div>
                    
                    <div className="mb-4 sm:mb-5 md:mb-6">
                      <div className="font-japanese text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-2 sm:mb-3">
                        {word.word}
                      </div>
                      <div className="text-xs sm:text-sm text-gray-600 mb-1">{word.furigana}</div>
                      <div className="text-xs sm:text-sm text-gray-500">{word.romaji}</div>
                    </div>
                    
                    <div className="mb-4 sm:mb-6 md:mb-8">
                      <div className="text-base sm:text-lg md:text-xl font-semibold text-gray-800">{word.meaning}</div>
                      {word.example && (
                        <div className="text-xs sm:text-sm text-gray-600 italic mt-2 sm:mt-3">
                          "{word.example}"
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex gap-1 sm:gap-2">
                        <button
                          onClick={() => {
                            const wordIndex = filteredWords.findIndex(w => w.word === word.word);
                            setCurrentWordIndex(wordIndex);
                            setViewMode('flashcard');
                          }}
                          className="px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors text-xs sm:text-sm font-semibold flex items-center gap-1 sm:gap-2"
                        >
                          <BookOpen className="w-3 h-3 sm:w-4 sm:h-4" />
                          Study
                        </button>
                        <button
                          onClick={() => playJapaneseAudio(word.word)}
                          className="p-1.5 sm:p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        >
                          <Volume2 className="w-3 h-3 sm:w-4 sm:h-4" />
                        </button>
                      </div>
                      
                      {isLearned && (
                        <div className="px-2 sm:px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-semibold">
                          Learned
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Settings Panel */}
        <AnimatePresence>
          {showSettings && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="fixed inset-x-4 bottom-4 md:inset-x-auto md:right-4 md:top-20 z-50"
            >
              <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-200 shadow-2xl p-4 sm:p-6 max-w-sm mx-auto md:mx-0">
                <div className="flex justify-between items-center mb-4 sm:mb-6">
                  <h3 className="text-base sm:text-lg font-bold text-gray-800">Settings</h3>
                  <button
                    onClick={() => setShowSettings(false)}
                    className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg"
                  >
                    <X className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                </div>
                
                <div className="space-y-4 sm:space-y-6">
                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 mb-2 sm:mb-3">Study Settings</h4>
                    <div className="space-y-2 sm:space-y-3">
                      {[
                        { label: 'Auto-flip cards', state: autoFlip, setter: setAutoFlip, color: 'blue' },
                        { label: 'Auto-play audio', state: autoPlay, setter: setAutoPlay, color: 'green' },
                        { label: 'Show examples', state: showExample, setter: setShowExample, color: 'purple' },
                        { label: 'Card animations', state: cardAnimation, setter: setCardAnimation, color: 'amber' },
                      ].map(({ label, state, setter, color }) => (
                        <div key={label} className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">{label}</span>
                          <button
                            onClick={() => setter(!state)}
                            className={`relative inline-flex h-5 w-9 sm:h-6 sm:w-11 items-center rounded-full transition-colors ${
                              state ? `bg-${color}-500` : 'bg-gray-300'
                            }`}
                          >
                            <span className={`inline-block h-3 w-3 sm:h-4 sm:w-4 transform rounded-full bg-white transition-transform ${
                              state ? 'translate-x-4 sm:translate-x-6' : 'translate-x-1'
                            }`} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 mb-2 sm:mb-3">Display Settings</h4>
                    <div className="space-y-2 sm:space-y-3">
                      {[
                        { label: 'Show furigana', state: showFurigana, setter: setShowFurigana, color: 'emerald' },
                        { label: 'Show romaji', state: showRomaji, setter: setShowRomaji, color: 'purple' },
                      ].map(({ label, state, setter, color }) => (
                        <div key={label} className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">{label}</span>
                          <button
                            onClick={() => setter(!state)}
                            className={`relative inline-flex h-5 w-9 sm:h-6 sm:w-11 items-center rounded-full transition-colors ${
                              state ? `bg-${color}-500` : 'bg-gray-300'
                            }`}
                          >
                            <span className={`inline-block h-3 w-3 sm:h-4 sm:w-4 transform rounded-full bg-white transition-transform ${
                              state ? 'translate-x-4 sm:translate-x-6' : 'translate-x-1'
                            }`} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 mb-2 sm:mb-3">Data Management</h4>
                    <div className="space-y-2">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={exportProgress}
                        className="w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors flex items-center justify-center gap-2 text-sm"
                      >
                        <Download className="w-3 h-3 sm:w-4 sm:h-4" />
                        Export Progress
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={clearProgress}
                        className="w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors flex items-center justify-center gap-2 text-sm"
                      >
                        <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                        Clear All Progress
                      </motion.button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Keyboard Shortcuts Help */}
        {!fullscreen && !quizActive && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-4 sm:mt-6 md:mt-8 p-3 sm:p-4 md:p-5 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl sm:rounded-2xl border border-blue-200"
          >
            <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
              <div className="p-1.5 sm:p-2 bg-blue-100 rounded-lg">
                <HelpCircle className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
              </div>
              <h4 className="font-semibold text-blue-700 text-sm sm:text-base">Keyboard Shortcuts</h4>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
              {[
                { key: 'Space', action: 'Flip card' },
                { key: '← →', action: 'Navigate' },
                { key: '1-4', action: 'Review ratings' },
                { key: 'A', action: 'Play audio' },
                { key: 'B', action: 'Bookmark' },
                { key: 'L', action: 'Learned' },
                { key: 'S', action: 'Shuffle' },
                { key: 'Q', action: 'Start quiz' },
              ].map(({ key, action }) => (
                <div key={key} className="flex items-center gap-2">
                  <kbd className="px-2 sm:px-3 py-1 sm:py-1.5 bg-white border border-gray-300 rounded text-xs font-medium text-gray-700 min-w-12 sm:min-w-16 text-center">
                    {key}
                  </kbd>
                  <span className="text-xs sm:text-sm text-gray-600">{action}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>

      {/* Japanese font */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;500;700&display=swap');
        .font-japanese {
          font-family: 'Noto Sans JP', sans-serif;
        }
      `}</style>
    </div>
  );
};

export default VocabularyMaster;