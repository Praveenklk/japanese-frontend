import React, { useState, useEffect, useCallback } from 'react';
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
  Eye as EyeIcon,
  EyeOff as EyeOffIcon,
  Settings as SettingsIcon,
  ExternalLink,
  Share2,
  Printer,
  ThumbsUp,
  ThumbsDown,
  Flag,
  Heart,
  HeartOff,
  Star as StarIcon,
  Moon,
  Sun,
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
type QuizType = 'multiple-choice' | 'typing' | 'matching';
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
      
      // Update daily stats
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
    
    // Update based on rating
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
    
    // Update next review date
    const nextReview = new Date();
    nextReview.setDate(nextReview.getDate() + wordProgress.intervalDays);
    wordProgress.nextReview = nextReview.toISOString();
    wordProgress.lastReviewed = new Date().toISOString();
    
    // Update word progress
    progress.wordProgress[word] = wordProgress;
    
    // Update daily stats
    const today = new Date().toISOString().split('T')[0];
    if (!progress.dailyStats[today]) {
      progress.dailyStats[today] = { learned: 0, reviewed: 0, totalTime: 0 };
    }
    progress.dailyStats[today].reviewed++;
    
    // Update streak
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
      // Check if we were active yesterday
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
  const [quizTime, setQuizTime] = useState(30);

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
    hidden: { opacity: 0, x: 50, rotateY: 90 },
    visible: { opacity: 1, x: 0, rotateY: 0 },
    exit: { opacity: 0, x: -50, rotateY: -90 }
  };

  const flipVariants = {
    front: { rotateY: 0 },
    back: { rotateY: 180 }
  };

  // Initialize
  useEffect(() => {
    loadVocabulary();
    updateStats();
  }, []);

  // Load vocabulary
  const loadVocabulary = () => {
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
  };

  // Filter words
  useEffect(() => {
    let filtered = [...allWords];

    // Filter by level
    if (selectedLevel !== 'all') {
      filtered = filtered.filter(word => word.level.toString() === selectedLevel);
    }

    // Filter by due cards only
    if (showDueOnly) {
      const now = new Date();
      filtered = filtered.filter(word => {
        const wordProgress = progress.wordProgress[word.word];
        return wordProgress && new Date(wordProgress.nextReview) <= now;
      });
    }

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(word => 
        word.word.toLowerCase().includes(term) ||
        word.meaning.toLowerCase().includes(term) ||
        word.furigana.toLowerCase().includes(term) ||
        word.romaji.toLowerCase().includes(term) ||
        word.tags?.some(tag => tag.toLowerCase().includes(term)) ||
        word.example?.toLowerCase().includes(term)
      );
    }

    setFilteredWords(filtered);
    
    // Reset to first word if current index is out of bounds
    if (currentWordIndex >= filtered.length) {
      setCurrentWordIndex(0);
    }
  }, [allWords, selectedLevel, searchTerm, showDueOnly, progress, currentWordIndex]);

  // Update stats
  const updateStats = () => {
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
  };

  const currentWord = filteredWords[currentWordIndex];

  // Text-to-Speech
  const playJapaneseAudio = async (text: string) => {
    try {
      setAudioPlaying(true);
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ja-JP';
      utterance.rate = 0.8;
      utterance.pitch = 1;
      utterance.volume = 1;
      
      utterance.onend = () => setAudioPlaying(false);
      utterance.onerror = () => setAudioPlaying(false);
      
      speechSynthesis.speak(utterance);
    } catch (error) {
      console.error('Audio playback failed:', error);
      setAudioPlaying(false);
    }
  };

  const stopAudio = () => {
    speechSynthesis.cancel();
    setAudioPlaying(false);
  };

  // Review word
  const reviewWord = async (rating: ReviewRating) => {
    if (!currentWord) return;
    
    setIsReviewing(true);
    
    // Add small delay for better UX
    await new Promise(resolve => setTimeout(resolve, 300));
    
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
  };

  const toggleBookmark = (word: string) => {
    ProgressStorage.toggleBookmark(word);
    updateStats();
  };

  const toggleLearned = (word: string) => {
    ProgressStorage.toggleLearned(word);
    updateStats();
  };

  const resetFilters = () => {
    setSelectedLevel('all');
    setSearchTerm('');
    setShowDueOnly(false);
  };

  const nextCard = () => {
    setCurrentWordIndex(prev => prev < filteredWords.length - 1 ? prev + 1 : 0);
    setShowAnswer(false);
  };

  const prevCard = () => {
    setCurrentWordIndex(prev => prev > 0 ? prev - 1 : filteredWords.length - 1);
    setShowAnswer(false);
  };

  const shuffleCards = () => {
    const shuffled = [...filteredWords];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    setFilteredWords(shuffled);
    setCurrentWordIndex(0);
    setShowAnswer(false);
  };

  // Quiz Functions
  const startQuiz = (type: QuizType = 'multiple-choice', difficulty: QuizDifficulty = 'medium') => {
    setQuizType(type);
    setQuizDifficulty(difficulty);
    setQuizActive(true);
    setQuizCompleted(false);
    setScore(0);
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setUserInput('');
    
    // Select questions based on difficulty
    let pool = [...filteredWords];
    if (difficulty === 'easy') {
      pool = pool.filter(word => word.level >= 4); // N4-N5
    } else if (difficulty === 'medium') {
      pool = pool.filter(word => word.level >= 3); // N3-N5
    }
    
    // Shuffle and select 10 questions
    const shuffled = [...pool].sort(() => Math.random() - 0.5);
    const questions = shuffled.slice(0, 10);
    setQuizQuestions(questions);
    
    // Set time based on difficulty
    const time = difficulty === 'easy' ? 40 : difficulty === 'medium' ? 30 : 20;
    setTimeLeft(time);
    setQuizTime(time);
  };

  const checkAnswer = (answer: string) => {
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
        // Reset timer for next question
        const time = quizDifficulty === 'easy' ? 40 : quizDifficulty === 'medium' ? 30 : 20;
        setTimeLeft(time);
      } else {
        setQuizCompleted(true);
        ProgressStorage.updateQuizStats(score + (correct ? 1 : 0), quizQuestions.length);
        updateStats();
      }
    }, 1500);
  };

  const checkTypingAnswer = () => {
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
        // Reset timer for next question
        const time = quizDifficulty === 'easy' ? 40 : quizDifficulty === 'medium' ? 30 : 20;
        setTimeLeft(time);
      } else {
        setQuizCompleted(true);
        ProgressStorage.updateQuizStats(score + (correct ? 1 : 0), quizQuestions.length);
        updateStats();
      }
    }, 1500);
  };

  // Timer effect for quiz
  useEffect(() => {
    if (!quizActive || quizCompleted || showResult) return;
    
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          // Time's up - move to next question
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
    
    return () => clearInterval(timer);
  }, [quizActive, quizCompleted, currentQuestion, showResult]);

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
  }, [viewMode, showAnswer, currentWord, filteredWords.length, currentWordIndex, quizActive, quizType]);

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
            <motion.div
              className="absolute -inset-4 border-4 border-blue-200 rounded-2xl"
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-800 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
              Loading Vocabulary
            </h3>
            <p className="text-gray-600 mt-2">Preparing your learning journey...</p>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 ${fullscreen ? 'fixed inset-0 z-50' : ''}`}>
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-4 h-4 rounded-full bg-gradient-to-r from-blue-300 to-purple-300 opacity-20"
            initial={{ x: Math.random() * window.innerWidth, y: Math.random() * window.innerHeight }}
            animate={{ 
              y: [null, Math.random() * 100 - 50],
              x: [null, Math.random() * 100 - 50],
            }}
            transition={{ duration: 3 + Math.random() * 2, repeat: Infinity, repeatType: "reverse" }}
          />
        ))}
      </div>

      <div className={`relative ${fullscreen ? 'h-screen overflow-hidden' : 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6'}`}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
            <div>
              <h1 className="text-4xl font-bold text-gray-800 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                Japanese Vocabulary Master
              </h1>
              <p className="text-gray-600 mt-2 text-lg">
                Master <span className="font-bold text-blue-600">{stats.totalWords}</span> words across all JLPT levels
              </p>
            </div>
            <div className="flex items-center gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => startQuiz()}
                className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-200 flex items-center gap-2"
              >
                <Gamepad2 className="w-5 h-5" />
                Start Quiz
              </motion.button>
              <button
                onClick={() => setFullscreen(!fullscreen)}
                className="p-3 rounded-xl bg-white/80 backdrop-blur-sm border border-gray-200 hover:bg-white transition-all hover:shadow-md"
                title={fullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
              >
                {fullscreen ? <Minimize2 className="w-5 h-5 text-gray-700" /> : <Maximize2 className="w-5 h-5 text-gray-700" />}
              </button>
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="p-3 rounded-xl bg-white/80 backdrop-blur-sm border border-gray-200 hover:bg-white transition-all hover:shadow-md"
                title="Settings"
              >
                <Settings className="w-5 h-5 text-gray-700" />
              </button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
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
                whileHover={{ y: -5 }}
                className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 p-5 hover:shadow-lg transition-all duration-300"
              >
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-r ${stat.color}`}>
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-800">{stat.value}</div>
                    <div className="text-sm text-gray-600">{stat.label}</div>
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
            className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 p-6 mb-8 shadow-sm"
          >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:gap-6">
  {/* 🔍 Search */}
  <div className="w-full lg:flex-1">
    <div className="relative">
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
      <input
        type="text"
        placeholder="Search Japanese, English, reading..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full pl-12 pr-10 py-3.5 bg-white border border-gray-300 rounded-xl
                   focus:outline-none focus:ring-3 focus:ring-blue-500/30
                   focus:border-blue-500 text-gray-900 placeholder-gray-500
                   transition-all duration-300"
      />
      {searchTerm && (
        <button
          onClick={() => setSearchTerm('')}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
        >
          <X className="w-5 h-5" />
        </button>
      )}
    </div>
  </div>

  {/* 🎚 Filters + View */}
  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
    {/* JLPT Filter */}
    <div className="relative w-full sm:w-auto">
      <select
        value={selectedLevel}
        onChange={(e) => setSelectedLevel(e.target.value as Level)}
        className="w-full sm:w-auto py-3.5 px-6 bg-white border border-gray-300
                   rounded-xl focus:outline-none focus:ring-3 focus:ring-blue-500/30
                   focus:border-blue-500 text-gray-900 appearance-none pr-10
                   transition-all duration-300"
      >
        <option value="all">All JLPT Levels</option>
        <option value="5">N5 (Beginner)</option>
        <option value="4">N4 (Elementary)</option>
        <option value="3">N3 (Intermediate)</option>
        <option value="2">N2 (Advanced)</option>
        <option value="1">N1 (Fluent)</option>
      </select>
      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
    </div>

    {/* 🧩 View Mode Toggle (scrollable on mobile) */}
    <div className="bg-gray-100 p-1.5 rounded-xl overflow-x-auto scrollbar-hide">
      <div className="flex gap-2 min-w-max">
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
            className={`flex-shrink-0 px-4 py-2.5 rounded-lg transition-all duration-300
                        flex items-center gap-2 whitespace-nowrap ${
              viewMode === mode
                ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-md'
                : 'text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Icon className="w-4 h-4" />
            <span className="text-sm font-medium">{label}</span>
          </motion.button>
        ))}
      </div>
    </div>
  </div>
</div>

            {/* Quick Actions */}
            <div className="flex flex-wrap gap-3 mt-6">
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
                  className={`px-4 py-2.5 rounded-xl flex items-center gap-2 transition-all duration-300 ${
                    action.active
                      ? `bg-${action.color}-100 text-${action.color}-700 border border-${action.color}-200`
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <action.icon className="w-4 h-4" />
                  <span className="text-sm font-medium">{action.label}</span>
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
              className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 p-12 text-center"
            >
              <div className="max-w-md mx-auto">
                <div className="w-24 h-24 mx-auto mb-6 rounded-2xl bg-gradient-to-r from-blue-100 to-purple-100 flex items-center justify-center">
                  <Search className="w-12 h-12 text-blue-500" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-3">No Words Found</h3>
                <p className="text-gray-600 mb-8">
                  Try adjusting your filters or search term to find vocabulary.
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={resetFilters}
                  className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-200"
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
              className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 overflow-hidden shadow-lg"
            >
              {/* Quiz Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-500 to-purple-500">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-white/20 rounded-lg">
                    <Gamepad2 className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">Vocabulary Quiz</h3>
                    <p className="text-white/80 text-sm">
                      {quizType === 'multiple-choice' ? 'Multiple Choice' : 'Typing Challenge'} • {quizDifficulty} Level
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">{score}/{quizQuestions.length}</div>
                    <div className="text-white/80 text-sm">Score</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">{currentQuestion + 1}/{quizQuestions.length}</div>
                    <div className="text-white/80 text-sm">Question</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">{timeLeft}s</div>
                    <div className="text-white/80 text-sm">Time Left</div>
                  </div>
                </div>
              </div>

              {/* Quiz Content */}
              <div className="p-8">
                {quizCompleted ? (
                  <div className="max-w-2xl mx-auto text-center py-12">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-32 h-32 mx-auto mb-8 rounded-full bg-gradient-to-r from-emerald-400 to-green-500 flex items-center justify-center"
                    >
                      <Trophy className="w-16 h-16 text-white" />
                    </motion.div>
                    
                    <h3 className="text-3xl font-bold text-gray-800 mb-4">Quiz Completed!</h3>
                    
                    <div className="text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 mb-6">
                      {Math.round((score / quizQuestions.length) * 100)}%
                    </div>
                    
                    <p className="text-gray-600 text-lg mb-8">
                      You got {score} out of {quizQuestions.length} questions correct
                    </p>
                    
                    <div className="flex gap-4 justify-center">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setQuizActive(false)}
                        className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all duration-200"
                      >
                        Back to Study
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => startQuiz(quizType, quizDifficulty)}
                        className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-200"
                      >
                        Try Again
                      </motion.button>
                    </div>
                  </div>
                ) : quizQuestions[currentQuestion] ? (
                  <div className="max-w-4xl mx-auto">
                    {/* Question */}
                    <div className="text-center mb-12">
                      <div className="text-5xl font-bold text-gray-800 mb-6 font-japanese">
                        {quizQuestions[currentQuestion].word}
                      </div>
                      
                      {showFurigana && (
                        <div className="text-2xl text-gray-600 mb-4">
                          {quizQuestions[currentQuestion].furigana}
                        </div>
                      )}
                      
                      <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                        <Clock className="w-4 h-4" />
                        {timeLeft} seconds remaining
                      </div>
                    </div>

                    {/* Answer Section */}
                    {quizType === 'multiple-choice' ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {(() => {
                          const current = quizQuestions[currentQuestion];
                          const otherWords = quizQuestions
                            .filter((_, i) => i !== currentQuestion)
                            .sort(() => Math.random() - 0.5)
                            .slice(0, 3)
                            .map(w => w.meaning);
                          
                          const options = [current.meaning, ...otherWords]
                            .sort(() => Math.random() - 0.5);
                          
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
                              className={`p-6 rounded-xl text-left transition-all duration-300 ${
                                showResult
                                  ? option.toLowerCase() === current.meaning.toLowerCase()
                                    ? 'bg-emerald-100 border-2 border-emerald-500'
                                    : selectedAnswer === option
                                    ? 'bg-rose-100 border-2 border-rose-500'
                                    : 'bg-gray-100 border-2 border-transparent'
                                  : 'bg-white border-2 border-gray-200 hover:border-blue-500 hover:shadow-md'
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <div className="text-lg font-medium text-gray-800">{option}</div>
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                  showResult && option.toLowerCase() === current.meaning.toLowerCase()
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
                        <div className="text-center mb-8">
                          <p className="text-gray-600 mb-4">Type the English meaning of the word above:</p>
                          <input
                            type="text"
                            value={userInput}
                            onChange={(e) => setUserInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && checkTypingAnswer()}
                            disabled={showResult}
                            className="w-full px-6 py-4 text-xl border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-center disabled:opacity-50"
                            placeholder="Enter meaning..."
                            autoFocus
                          />
                        </div>
                        
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={checkTypingAnswer}
                          disabled={!userInput.trim() || showResult}
                          className="w-full py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
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
                        className="mt-8 text-center"
                      >
                        <div className={`inline-flex items-center gap-3 px-6 py-4 rounded-xl ${
                          isCorrect ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                        }`}>
                          {isCorrect ? (
                            <>
                              <CheckCircle className="w-6 h-6" />
                              <span className="text-lg font-semibold">Correct! The meaning is "{quizQuestions[currentQuestion].meaning}"</span>
                            </>
                          ) : (
                            <>
                              <X className="w-6 h-6" />
                              <span className="text-lg font-semibold">The correct answer is "{quizQuestions[currentQuestion].meaning}"</span>
                            </>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </div>
                ) : null}
              </div>

              {/* Quiz Footer */}
              <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50/50">
                <button
                  onClick={() => setQuizActive(false)}
                  className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors flex items-center gap-2"
                >
                  <ChevronLeft className="w-5 h-5" />
                  Exit Quiz
                </button>
                
                <div className="flex gap-2">
                  {quizDifficulty === 'easy' && <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">Easy</span>}
                  {quizDifficulty === 'medium' && <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm">Medium</span>}
                  {quizDifficulty === 'hard' && <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm">Hard</span>}
                </div>
                
                {!quizCompleted && (
                  <button
                    onClick={() => {
                      if (currentQuestion < quizQuestions.length - 1) {
                        setCurrentQuestion(prev => prev + 1);
                        setSelectedAnswer(null);
                        setShowResult(false);
                        setUserInput('');
                        const time = quizDifficulty === 'easy' ? 40 : quizDifficulty === 'medium' ? 30 : 20;
                        setTimeLeft(time);
                      } else {
                        setQuizCompleted(true);
                      }
                    }}
                    className="px-6 py-3 bg-blue-100 text-blue-700 rounded-xl hover:bg-blue-200 transition-colors"
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
              className={`bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 overflow-hidden shadow-lg ${fullscreen ? 'h-[calc(100vh-200px)]' : ''}`}
            >
              {/* Card Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <div className="flex items-center gap-4">
                  <div className={`px-4 py-2 rounded-full text-sm font-semibold ${
                    currentWord.level === 5 ? 'bg-green-100 text-green-700' :
                    currentWord.level === 4 ? 'bg-blue-100 text-blue-700' :
                    currentWord.level === 3 ? 'bg-yellow-100 text-yellow-700' :
                    currentWord.level === 2 ? 'bg-orange-100 text-orange-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    N{currentWord.level}
                  </div>
                  <div className="text-sm text-gray-600">
                    Card {currentWordIndex + 1} of {filteredWords.length}
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleBookmark(currentWord.word)}
                    className={`p-3 rounded-xl transition-all duration-300 ${
                      progress.bookmarkedWords.includes(currentWord.word)
                        ? 'bg-amber-100 text-amber-600 hover:bg-amber-200'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    <Bookmark className={`w-5 h-5 ${progress.bookmarkedWords.includes(currentWord.word) ? 'fill-current' : ''}`} />
                  </button>
                  <button
                    onClick={() => playJapaneseAudio(currentWord.word)}
                    disabled={audioPlaying}
                    className="p-3 rounded-xl bg-blue-100 text-blue-600 hover:bg-blue-200 disabled:opacity-50 transition-all duration-300"
                  >
                    {audioPlaying ? (
                      <VolumeX className="w-5 h-5" />
                    ) : (
                      <Volume2 className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Card Content */}
              <div className={`p-8 md:p-12 ${fullscreen ? 'h-[calc(100%-160px)] flex items-center' : ''}`}>
                <div className="max-w-3xl mx-auto text-center">
                  <motion.div
                    key={currentWordIndex}
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    transition={{ duration: 0.5 }}
                  >
                    {/* Japanese Word */}
                    <div className="mb-10">
                      <motion.div
                        className="text-6xl md:text-7xl font-bold text-gray-800 mb-6 font-japanese"
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.5 }}
                      >
                        {currentWord.word}
                      </motion.div>
                      
                      {showFurigana && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.2 }}
                          className="text-2xl text-gray-600 mb-3"
                        >
                          {currentWord.furigana}
                        </motion.div>
                      )}
                      
                      {showRomaji && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3 }}
                          className="text-lg text-gray-500"
                        >
                          {currentWord.romaji}
                        </motion.div>
                      )}
                    </div>

                    {/* Answer Section */}
                    {!showAnswer ? (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                      >
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setShowAnswer(true)}
                          className="px-10 py-5 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-2xl font-bold text-xl hover:shadow-xl transition-all duration-200 shadow-lg"
                        >
                          Show Meaning
                        </motion.button>
                        <p className="text-gray-500 mt-6">
                          Press Space or click to reveal
                        </p>
                      </motion.div>
                    ) : (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                        className="space-y-10"
                      >
                        {/* English Meaning */}
                        <div>
                          <div className="text-4xl font-bold text-gray-800 mb-4">
                            {currentWord.meaning}
                          </div>
                          {showExample && currentWord.example && (
                            <div className="text-xl text-gray-600 italic mt-6 bg-gray-50 p-6 rounded-xl">
                              "{currentWord.example}"
                            </div>
                          )}
                        </div>

                        {/* Review Buttons */}
                        {!isReviewing ? (
                          <motion.div 
                            className="grid grid-cols-2 md:grid-cols-4 gap-4"
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.2 }}
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
                                className={`px-6 py-4 bg-${color}-100 text-${color}-700 rounded-xl font-semibold hover:bg-${color}-200 transition-all duration-300 border-2 border-transparent hover:border-${color}-300`}
                              >
                                {label}
                              </motion.button>
                            ))}
                          </motion.div>
                        ) : (
                          <div className="flex justify-center">
                            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent"></div>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </motion.div>
                </div>
              </div>

              {/* Card Footer */}
              <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50/50">
                <button
                  onClick={prevCard}
                  disabled={isReviewing}
                  className="px-6 py-3 bg-white text-gray-700 rounded-xl hover:bg-gray-100 disabled:opacity-50 transition-colors flex items-center gap-2 border-2 border-gray-200"
                >
                  <ChevronLeft className="w-5 h-5" />
                  Previous
                </button>
                
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => toggleLearned(currentWord.word)}
                    className={`px-5 py-2.5 rounded-xl flex items-center gap-2 transition-all duration-300 ${
                      progress.learnedWords.includes(currentWord.word)
                        ? 'bg-emerald-100 text-emerald-700 border-2 border-emerald-200'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border-2 border-gray-200'
                    }`}
                  >
                    <CheckCircle className="w-4 h-4" />
                    {progress.learnedWords.includes(currentWord.word) ? 'Learned' : 'Mark as Learned'}
                  </button>
                  <button
                    onClick={shuffleCards}
                    className="px-5 py-2.5 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors flex items-center gap-2"
                  >
                    <Shuffle className="w-4 h-4" />
                    Shuffle
                  </button>
                </div>
                
                <button
                  onClick={nextCard}
                  disabled={isReviewing}
                  className="px-6 py-3 bg-white text-gray-700 rounded-xl hover:bg-gray-100 disabled:opacity-50 transition-colors flex items-center gap-2 border-2 border-gray-200"
                >
                  Next
                  <ChevronRight className="w-5 h-5" />
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
              className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 overflow-hidden"
            >
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-blue-500/10 to-purple-500/10">
                    <tr>
                      <th className="py-5 px-6 text-left text-sm font-semibold text-gray-700 border-b border-gray-200">Japanese</th>
                      <th className="py-5 px-6 text-left text-sm font-semibold text-gray-700 border-b border-gray-200">Reading</th>
                      <th className="py-5 px-6 text-left text-sm font-semibold text-gray-700 border-b border-gray-200">English</th>
                      <th className="py-5 px-6 text-left text-sm font-semibold text-gray-700 border-b border-gray-200">Level</th>
                      <th className="py-5 px-6 text-left text-sm font-semibold text-gray-700 border-b border-gray-200">Status</th>
                      <th className="py-5 px-6 text-left text-sm font-semibold text-gray-700 border-b border-gray-200">Actions</th>
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
                          transition={{ delay: index * 0.05 }}
                          className="hover:bg-gray-50/50 transition-colors duration-150"
                        >
                          <td className="py-5 px-6">
                            <div className="font-japanese text-xl font-bold text-gray-800">{word.word}</div>
                            <div className="text-sm text-gray-500">{word.furigana}</div>
                          </td>
                          <td className="py-5 px-6 font-mono text-gray-700">{word.romaji}</td>
                          <td className="py-5 px-6 text-gray-700">{word.meaning}</td>
                          <td className="py-5 px-6">
                            <span className={`px-3 py-1.5 rounded-full text-xs font-semibold ${
                              word.level === 5 ? 'bg-green-100 text-green-700' :
                              word.level === 4 ? 'bg-blue-100 text-blue-700' :
                              word.level === 3 ? 'bg-yellow-100 text-yellow-700' :
                              word.level === 2 ? 'bg-orange-100 text-orange-700' :
                              'bg-red-100 text-red-700'
                            }`}>
                              N{word.level}
                            </span>
                          </td>
                          <td className="py-5 px-6">
                            <div className="flex items-center gap-2">
                              {isLearned && (
                                <span className="px-2.5 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-semibold">
                                  Learned
                                </span>
                              )}
                              {isBookmarked && (
                                <span className="px-2.5 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-semibold">
                                  Bookmarked
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="py-5 px-6">
                            <div className="flex gap-2">
                              <button
                                onClick={() => {
                                  const wordIndex = filteredWords.findIndex(w => w.word === word.word);
                                  setCurrentWordIndex(wordIndex);
                                  setViewMode('flashcard');
                                }}
                                className="p-2.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                              >
                                <BookOpen className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => toggleBookmark(word.word)}
                                className={`p-2.5 rounded-lg transition-colors duration-200 ${
                                  isBookmarked 
                                    ? 'text-amber-600 hover:bg-amber-50' 
                                    : 'text-gray-600 hover:bg-gray-100'
                                }`}
                              >
                                <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
                              </button>
                              <button
                                onClick={() => playJapaneseAudio(word.word)}
                                className="p-2.5 text-green-600 hover:bg-green-50 rounded-lg transition-colors duration-200"
                              >
                                <Volume2 className="w-4 h-4" />
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
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredWords.map((word, index) => {
                const isBookmarked = progress.bookmarkedWords.includes(word.word);
                const isLearned = progress.learnedWords.includes(word.word);
                
                return (
                  <motion.div
                    key={`${word.word}-${index}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    whileHover={{ y: -8, transition: { duration: 0.2 } }}
                    className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 p-6 hover:shadow-xl transition-all duration-300 hover:border-blue-300 group"
                  >
                    <div className="flex justify-between items-start mb-5">
                      <div className={`px-3.5 py-1.5 rounded-full text-xs font-semibold ${
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
                        className="text-gray-400 hover:text-amber-500 group-hover:opacity-100 opacity-0 transition-all duration-300"
                      >
                        <Bookmark className={`w-5 h-5 ${isBookmarked ? 'fill-current text-amber-500' : ''}`} />
                      </button>
                    </div>
                    
                    <div className="mb-6">
                      <div className="font-japanese text-3xl font-bold text-gray-800 mb-3">
                        {word.word}
                      </div>
                      <div className="text-sm text-gray-600 mb-1">{word.furigana}</div>
                      <div className="text-sm text-gray-500">{word.romaji}</div>
                    </div>
                    
                    <div className="mb-8">
                      <div className="text-xl font-semibold text-gray-800">{word.meaning}</div>
                      {word.example && (
                        <div className="text-sm text-gray-600 italic mt-3">
                          "{word.example}"
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            const wordIndex = filteredWords.findIndex(w => w.word === word.word);
                            setCurrentWordIndex(wordIndex);
                            setViewMode('flashcard');
                          }}
                          className="px-4 py-2.5 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors text-sm font-semibold flex items-center gap-2"
                        >
                          <BookOpen className="w-4 h-4" />
                          Study
                        </button>
                        <button
                          onClick={() => playJapaneseAudio(word.word)}
                          className="p-2.5 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        >
                          <Volume2 className="w-4 h-4" />
                        </button>
                      </div>
                      
                      {isLearned && (
                        <div className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-semibold">
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
              <div className="bg-white rounded-2xl border border-gray-200 shadow-2xl p-6 max-w-sm mx-auto md:mx-0">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-bold text-gray-800">Settings</h3>
                  <button
                    onClick={() => setShowSettings(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 mb-3">Study Settings</h4>
                    <div className="space-y-3">
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
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                              state ? `bg-${color}-500` : 'bg-gray-300'
                            }`}
                          >
                            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              state ? 'translate-x-6' : 'translate-x-1'
                            }`} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 mb-3">Display Settings</h4>
                    <div className="space-y-3">
                      {[
                        { label: 'Show furigana', state: showFurigana, setter: setShowFurigana, color: 'emerald' },
                        { label: 'Show romaji', state: showRomaji, setter: setShowRomaji, color: 'purple' },
                      ].map(({ label, state, setter, color }) => (
                        <div key={label} className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">{label}</span>
                          <button
                            onClick={() => setter(!state)}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                              state ? `bg-${color}-500` : 'bg-gray-300'
                            }`}
                          >
                            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              state ? 'translate-x-6' : 'translate-x-1'
                            }`} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 mb-3">Data Management</h4>
                    <div className="space-y-2">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={exportProgress}
                        className="w-full px-4 py-2.5 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors flex items-center justify-center gap-2"
                      >
                        <Download className="w-4 h-4" />
                        Export Progress
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={clearProgress}
                        className="w-full px-4 py-2.5 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors flex items-center justify-center gap-2"
                      >
                        <Trash2 className="w-4 h-4" />
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
            className="mt-8 p-5 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl border border-blue-200"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <HelpCircle className="w-5 h-5 text-blue-600" />
              </div>
              <h4 className="font-semibold text-blue-700">Keyboard Shortcuts</h4>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { key: 'Space', action: 'Flip card' },
                { key: '← →', action: 'Navigate cards' },
                { key: '1-4', action: 'Review ratings' },
                { key: 'A', action: 'Play audio' },
                { key: 'B', action: 'Toggle bookmark' },
                { key: 'L', action: 'Toggle learned' },
                { key: 'S', action: 'Shuffle cards' },
                { key: 'Q', action: 'Start quiz' },
              ].map(({ key, action }) => (
                <div key={key} className="flex items-center gap-3">
                  <kbd className="px-3 py-1.5 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 min-w-16 text-center">
                    {key}
                  </kbd>
                  <span className="text-sm text-gray-600">{action}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>

      {/* Add the missing Upload icon import */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;500;700&display=swap');
        .font-japanese {
          font-family: 'Noto Sans JP', sans-serif;
        }
      `}</style>
    </div>
  );
};

// Add the missing Upload component
const Upload = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
  </svg>
);

export default VocabularyMaster;