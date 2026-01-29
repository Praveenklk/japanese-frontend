// N5VocabularyPage.tsx
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  Bookmark, 
  BookmarkCheck, 
  CheckCircle, 
  Circle, 
  Shuffle, 
  ArrowLeft, 
  ArrowRight, 
  Search, 
  X,
  Star,
  TrendingUp,
  Target,
  Award,
  Volume2,
  Eye,
  EyeOff,
  Zap,
  Menu,
  Filter,
  ChevronRight,
  Download,
  Upload,
  Settings,
  Moon,
  Sun,
  RotateCw,
  Home,
  BarChart3,
  Clock,
  Hash,
  Type,
  Mic,
  MicOff,
  Layers,
  Grid,
  List,
  Sparkles,
  ChevronDown,
  RefreshCw,
  AlertCircle,
  HelpCircle,
  Trophy,
  Flame,
  Brain,
  ChevronLeft,
  Check,
  X as XIcon,
  Timer,
  FastForward,
  Pause,
  Play,
  VolumeX,
  Volume1,
  RotateCcw,
  Share2,
  Gift,
  Crown,
  Target as TargetIcon,
  TrendingUp as TrendingUpIcon,
  Users,
  Calendar,
  TrendingDown,
  Bell,
  BellOff,
  Maximize2,
  Minimize2,
  ZoomIn,
  ZoomOut
} from 'lucide-react';

interface VocabularyItem {
  word: string;
  meaning: string;
  furigana: string;
  romaji: string;
  level: number;
  example?: string;
  partOfSpeech?: string;
  synonyms?: string[];
  antonyms?: string[];
  mnemonics?: string;
}

interface UserProgress {
  learnedWords: string[];
  bookmarkedWords: string[];
  lastStudied: number;
  studySessions: number;
  dailyStats: {
    date: string;
    wordsStudied: number;
    timeSpent: number;
  }[];
  quizScores: {
    date: string;
    score: number;
    total: number;
    time: number;
    mode: string;
  }[];
  streak: number;
  achievements: string[];
}

interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
  type: 'meaning' | 'word' | 'example' | 'furigana';
  word: string;
}

const N5VocabularyPage: React.FC = () => {
  // State Management
  const [vocabulary, setVocabulary] = useState<VocabularyItem[]>([]);
  const [filteredVocabulary, setFilteredVocabulary] = useState<VocabularyItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [userProgress, setUserProgress] = useState<UserProgress>({
    learnedWords: [],
    bookmarkedWords: [],
    lastStudied: 0,
    studySessions: 0,
    dailyStats: [],
    quizScores: [],
    streak: 0,
    achievements: []
  });
  const [selectedTab, setSelectedTab] = useState<'all' | 'bookmarked' | 'unlearned' | 'learned'>('all');
  const [showAnswer, setShowAnswer] = useState<{ [key: string]: boolean }>({});
  const [currentStudyIndex, setCurrentStudyIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [showRomaji, setShowRomaji] = useState(false);
  const [showFurigana, setShowFurigana] = useState(true);
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('darkMode') === 'true' || 
        window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [speechEnabled, setSpeechEnabled] = useState(true);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [sortBy, setSortBy] = useState<'word' | 'meaning' | 'level'>('word');
  const [autoPlay, setAutoPlay] = useState(false);
  const [dailyGoal, setDailyGoal] = useState(10);
  const [todayProgress, setTodayProgress] = useState(0);
  const [studyTime, setStudyTime] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  const [showStats, setShowStats] = useState(false);
  
  // Quiz States
  const [quizMode, setQuizMode] = useState<'practice' | 'timed' | 'survival'>('practice');
  const [quizActive, setQuizActive] = useState(false);
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [quizTimeLeft, setQuizTimeLeft] = useState(60);
  const [quizTimerActive, setQuizTimerActive] = useState(false);
  const [quizHistory, setQuizHistory] = useState<any[]>([]);
  
  // UI States
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [animationEnabled, setAnimationEnabled] = useState(true);
  const [hintsEnabled, setHintsEnabled] = useState(true);
  const [confetti, setConfetti] = useState(false);
  const [celebrating, setCelebrating] = useState(false);
  const [showAchievements, setShowAchievements] = useState(false);

  // Load vocabulary data
  useEffect(() => {
    const loadVocabularyData = async () => {
      try {
        setIsLoading(true);
        const data = await import("../../Vocabulary/vocabularyN5.json");
        // Ensure data is an array
        const vocabData = Array.isArray(data.default) ? data.default : [];
        setVocabulary(vocabData);
        setFilteredVocabulary(vocabData);
      } catch (error) {
        console.error("Error loading vocabulary data:", error);
        setVocabulary([]);
        setFilteredVocabulary([]);
      } finally {
        setIsLoading(false);
      }
    };
    loadVocabularyData();
  }, []);

  // Load user progress
  useEffect(() => {
    try {
      const savedProgress = localStorage.getItem('n5VocabularyProgress');
      if (savedProgress) {
        const parsed = JSON.parse(savedProgress);
        // Ensure all properties exist
        setUserProgress({
          learnedWords: parsed.learnedWords || [],
          bookmarkedWords: parsed.bookmarkedWords || [],
          lastStudied: parsed.lastStudied || 0,
          studySessions: parsed.studySessions || 0,
          dailyStats: parsed.dailyStats || [],
          quizScores: parsed.quizScores || [],
          streak: parsed.streak || 0,
          achievements: parsed.achievements || []
        });
      }
      
      const savedSettings = localStorage.getItem('n5VocabularySettings');
      if (savedSettings) {
        const settings = JSON.parse(savedSettings);
        setSpeechEnabled(settings.speechEnabled ?? true);
        setDailyGoal(settings.dailyGoal || 10);
        setAnimationEnabled(settings.animationEnabled ?? true);
        setHintsEnabled(settings.hintsEnabled ?? true);
      }
      
      // Check streak
      const lastStudied = localStorage.getItem('lastStudiedDate');
      const today = new Date().toDateString();
      if (lastStudied === today) {
        // Already studied today
      } else if (lastStudied && isYesterday(new Date(lastStudied))) {
        // Studied yesterday, increment streak
        setUserProgress(prev => ({ 
          ...prev, 
          streak: (prev.streak || 0) + 1 
        }));
      } else {
        // Broken streak
        setUserProgress(prev => ({ ...prev, streak: 0 }));
      }
      
      localStorage.setItem('lastStudiedDate', today);
    } catch (error) {
      console.error("Error loading user progress:", error);
    }
  }, []);

  const isYesterday = (date: Date) => {
    try {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      return date.toDateString() === yesterday.toDateString();
    } catch (error) {
      return false;
    }
  };

  // Save progress
  useEffect(() => {
    try {
      localStorage.setItem('n5VocabularyProgress', JSON.stringify(userProgress));
      localStorage.setItem('darkMode', darkMode.toString());
    } catch (error) {
      console.error("Error saving progress:", error);
    }
  }, [userProgress, darkMode]);

  // Save settings
  useEffect(() => {
    try {
      const settings = {
        speechEnabled,
        dailyGoal,
        animationEnabled,
        hintsEnabled
      };
      localStorage.setItem('n5VocabularySettings', JSON.stringify(settings));
    } catch (error) {
      console.error("Error saving settings:", error);
    }
  }, [speechEnabled, dailyGoal, animationEnabled, hintsEnabled]);

  // Save daily progress
  useEffect(() => {
    try {
      const today = {
        date: new Date().toDateString(),
        progress: todayProgress
      };
      localStorage.setItem('n5TodayProgress', JSON.stringify(today));
    } catch (error) {
      console.error("Error saving daily progress:", error);
    }
  }, [todayProgress]);

  // Study timer
  useEffect(() => {
    const timer = setInterval(() => {
      setStudyTime(prev => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Filter and sort vocabulary
  useEffect(() => {
    if (!vocabulary || vocabulary.length === 0) {
      setFilteredVocabulary([]);
      return;
    }

    let filtered = [...vocabulary];

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(item =>
        item.word.toLowerCase().includes(term) ||
        item.meaning.toLowerCase().includes(term) ||
        item.furigana.toLowerCase().includes(term) ||
        item.romaji.toLowerCase().includes(term)
      );
    }

    switch (selectedTab) {
      case 'bookmarked':
        filtered = filtered.filter(item => 
          userProgress?.bookmarkedWords?.includes(item.word)
        );
        break;
      case 'learned':
        filtered = filtered.filter(item => 
          userProgress?.learnedWords?.includes(item.word)
        );
        break;
      case 'unlearned':
        filtered = filtered.filter(item => 
          !userProgress?.learnedWords?.includes(item.word)
        );
        break;
      default:
        break;
    }

    filtered.sort((a, b) => {
      let aValue: string | number, bValue: string | number;
      
      switch (sortBy) {
        case 'meaning':
          aValue = a.meaning;
          bValue = b.meaning;
          break;
        case 'level':
          aValue = a.level;
          bValue = b.level;
          break;
        default:
          aValue = a.word;
          bValue = b.word;
      }
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortOrder === 'asc' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
      
      return sortOrder === 'asc' 
        ? (aValue as number) - (bValue as number)
        : (bValue as number) - (aValue as number);
    });

    setFilteredVocabulary(filtered);
    // Reset study index if filtered list changes significantly
    if (currentStudyIndex >= filtered.length) {
      setCurrentStudyIndex(0);
    }
  }, [searchTerm, selectedTab, vocabulary, userProgress, sortOrder, sortBy, currentStudyIndex]);

  // Auto-play effect
  useEffect(() => {
    if (!autoPlay || !currentStudyWord) return;

    const timer = setTimeout(() => {
      goToNextWord();
    }, 5000);

    return () => clearTimeout(timer);
  }, [autoPlay, currentStudyIndex, filteredVocabulary.length]);

  // Quiz timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (quizTimerActive && quizTimeLeft > 0) {
      timer = setTimeout(() => setQuizTimeLeft(prev => prev - 1), 1000);
    } else if (quizTimeLeft === 0 && quizTimerActive) {
      endQuiz();
    }
    return () => clearTimeout(timer);
  }, [quizTimeLeft, quizTimerActive]);

  // Confetti effect
  useEffect(() => {
    if (confetti) {
      const timer = setTimeout(() => setConfetti(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [confetti]);

  // Calculate statistics
  const stats = useMemo(() => {
    const totalWords = vocabulary?.length || 0;
    const learnedWords = userProgress?.learnedWords?.length || 0;
    const bookmarkedWords = userProgress?.bookmarkedWords?.length || 0;
    const progressPercentage = totalWords > 0 ? Math.round((learnedWords / totalWords) * 100) : 0;
    const dailyGoalPercentage = Math.min(100, Math.round((todayProgress / dailyGoal) * 100));
    const studyMinutes = Math.floor(studyTime / 60);
    
    const averageScore = userProgress?.quizScores?.length > 0 
      ? Math.round(userProgress.quizScores.reduce((acc, score) => {
          return acc + (score?.score || 0) / (score?.total || 1) * 100;
        }, 0) / userProgress.quizScores.length)
      : 0;
    
    const totalQuizTime = userProgress?.quizScores?.reduce((acc, score) => 
      acc + (score?.time || 0), 0) || 0;
    
    const bestScore = userProgress?.quizScores?.length > 0 
      ? Math.max(...userProgress.quizScores.map(s => s?.score || 0))
      : 0;

    return { 
      totalWords, 
      learnedWords, 
      bookmarkedWords, 
      progressPercentage, 
      dailyGoalPercentage,
      studyMinutes,
      averageScore,
      todayProgress,
      dailyGoal,
      streak: userProgress?.streak || 0,
      totalQuizTime,
      bestScore,
      quizCount: userProgress?.quizScores?.length || 0
    };
  }, [vocabulary?.length, userProgress, todayProgress, dailyGoal, studyTime]);

  // Action functions
  const toggleBookmark = useCallback((word: string) => {
    setUserProgress(prev => {
      const isBookmarked = prev.bookmarkedWords?.includes(word);
      return {
        ...prev,
        bookmarkedWords: isBookmarked
          ? prev.bookmarkedWords.filter(w => w !== word)
          : [...prev.bookmarkedWords, word]
      };
    });
  }, []);

  const toggleLearned = useCallback((word: string) => {
    setUserProgress(prev => {
      const isLearned = prev.learnedWords?.includes(word);
      const newLearnedWords = isLearned
        ? prev.learnedWords.filter(w => w !== word)
        : [...prev.learnedWords, word];
      
      if (!isLearned) {
        setTodayProgress(prev => prev + 1);
      }
      
      return {
        ...prev,
        learnedWords: newLearnedWords,
        lastStudied: Date.now(),
        studySessions: prev.studySessions + 1
      };
    });
  }, []);

  const toggleShowAnswer = useCallback((word: string) => {
    setShowAnswer(prev => ({
      ...prev,
      [word]: !prev[word]
    }));
  }, []);

  const resetProgress = useCallback(() => {
    if (window.confirm('Are you sure you want to reset all your progress? This cannot be undone.')) {
      setUserProgress({
        learnedWords: [],
        bookmarkedWords: [],
        lastStudied: 0,
        studySessions: 0,
        dailyStats: [],
        quizScores: [],
        streak: 0,
        achievements: []
      });
      setShowAnswer({});
      setCurrentStudyIndex(0);
      setTodayProgress(0);
      setStudyTime(0);
      setQuizHistory([]);
    }
  }, []);

  const shuffleVocabulary = useCallback(() => {
    if (filteredVocabulary.length === 0) return;
    const shuffled = [...filteredVocabulary]
      .sort(() => Math.random() - 0.5);
    setFilteredVocabulary(shuffled);
    setCurrentStudyIndex(0);
  }, [filteredVocabulary]);

  const goToNextWord = useCallback(() => {
    if (filteredVocabulary.length > 0) {
      setCurrentStudyIndex((prev) => (prev + 1) % filteredVocabulary.length);
      setShowAnswer(prev => ({ 
        ...prev, 
        [filteredVocabulary[currentStudyIndex]?.word]: false 
      }));
    }
  }, [filteredVocabulary, currentStudyIndex]);

  const goToPrevWord = useCallback(() => {
    if (filteredVocabulary.length > 0) {
      setCurrentStudyIndex((prev) => 
        (prev - 1 + filteredVocabulary.length) % filteredVocabulary.length
      );
      setShowAnswer(prev => ({ 
        ...prev, 
        [filteredVocabulary[currentStudyIndex]?.word]: false 
      }));
    }
  }, [filteredVocabulary, currentStudyIndex]);

  const speakWord = useCallback((text: string, lang: string = 'ja-JP') => {
    if ('speechSynthesis' in window && speechEnabled && text) {
      speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;
      utterance.rate = 0.8;
      utterance.pitch = 1;
      speechSynthesis.speak(utterance);
    }
  }, [speechEnabled]);

  const flipCard = useCallback((word: string) => {
    if (!word) return;
    toggleShowAnswer(word);
    if (speechEnabled && !showAnswer[word]) {
      speakWord(word);
    }
  }, [toggleShowAnswer, speakWord, speechEnabled, showAnswer]);

  const exportProgress = useCallback(() => {
    try {
      const dataStr = JSON.stringify(userProgress, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
      const exportFileDefaultName = `n5-vocabulary-progress-${new Date().toISOString().split('T')[0]}.json`;
      
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
    } catch (error) {
      console.error("Error exporting progress:", error);
      alert('Error exporting progress. Please try again.');
    }
  }, [userProgress]);

  const importProgress = useCallback(() => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    
    input.onchange = (e: any) => {
      const file = e.target.files?.[0];
      if (!file) return;
      
      const reader = new FileReader();
      
      reader.onload = (event) => {
        try {
          const progress = JSON.parse(event.target?.result as string);
          // Validate imported data structure
          if (progress && typeof progress === 'object') {
            setUserProgress({
              learnedWords: Array.isArray(progress.learnedWords) ? progress.learnedWords : [],
              bookmarkedWords: Array.isArray(progress.bookmarkedWords) ? progress.bookmarkedWords : [],
              lastStudied: typeof progress.lastStudied === 'number' ? progress.lastStudied : 0,
              studySessions: typeof progress.studySessions === 'number' ? progress.studySessions : 0,
              dailyStats: Array.isArray(progress.dailyStats) ? progress.dailyStats : [],
              quizScores: Array.isArray(progress.quizScores) ? progress.quizScores : [],
              streak: typeof progress.streak === 'number' ? progress.streak : 0,
              achievements: Array.isArray(progress.achievements) ? progress.achievements : []
            });
            alert('Progress imported successfully!');
          } else {
            alert('Invalid progress file format.');
          }
        } catch (error) {
          alert('Error importing progress. Please check the file format.');
        }
      };
      
      reader.readAsText(file);
    };
    
    input.click();
  }, []);

  // Quiz helper functions
  const getRandomMeanings = useCallback((vocab: VocabularyItem[], exclude: string, count: number): string[] => {
    if (!vocab || vocab.length === 0) return [];
    const meanings = vocab
      .map(v => v?.meaning)
      .filter(m => m && m !== exclude);
    return [...new Set(meanings)]
      .sort(() => Math.random() - 0.5)
      .slice(0, Math.min(count, meanings.length));
  }, []);

  const getRandomWords = useCallback((vocab: VocabularyItem[], exclude: string, count: number): string[] => {
    if (!vocab || vocab.length === 0) return [];
    const words = vocab
      .map(v => v?.word)
      .filter(w => w && w !== exclude);
    return [...new Set(words)]
      .sort(() => Math.random() - 0.5)
      .slice(0, Math.min(count, words.length));
  }, []);

  const getRandomFurigana = useCallback((vocab: VocabularyItem[], exclude: string, count: number): string[] => {
    if (!vocab || vocab.length === 0) return [];
    const furigana = vocab
      .map(v => v?.furigana)
      .filter(f => f && f !== exclude);
    return [...new Set(furigana)]
      .sort(() => Math.random() - 0.5)
      .slice(0, Math.min(count, furigana.length));
  }, []);

  // Generate quiz questions
  const generateQuiz = useCallback((count: number = 10, mode: 'practice' | 'timed' | 'survival' = 'practice') => {
    if (!vocabulary || vocabulary.length === 0) return [];
    
    const questions: QuizQuestion[] = [];
    const selectedWords = [...vocabulary]
      .sort(() => Math.random() - 0.5)
      .slice(0, Math.min(count, vocabulary.length));
    
    selectedWords.forEach(word => {
      if (!word) return;
      
      const questionTypes: Array<'meaning' | 'word' | 'example' | 'furigana'> = ['meaning', 'word', 'example', 'furigana'];
      const type = questionTypes[Math.floor(Math.random() * questionTypes.length)];
      
      let question = '';
      let correctAnswer = '';
      let options: string[] = [];
      
      switch (type) {
        case 'meaning':
          question = `What is the meaning of "${word.word}"?`;
          correctAnswer = word.meaning;
          options = [
            word.meaning,
            ...getRandomMeanings(vocabulary, word.meaning, 3)
          ];
          break;
        case 'word':
          question = `Which word means "${word.meaning}"?`;
          correctAnswer = word.word;
          options = [
            word.word,
            ...getRandomWords(vocabulary, word.word, 3)
          ];
          break;
        case 'example':
          if (word.example) {
            question = `Complete the example: "${word.example.replace(word.word, '______')}"`;
            correctAnswer = word.word;
            options = [
              word.word,
              ...getRandomWords(vocabulary, word.word, 3)
            ];
          } else {
            // Fallback to meaning question if no example
            question = `What is the meaning of "${word.word}"?`;
            correctAnswer = word.meaning;
            options = [
              word.meaning,
              ...getRandomMeanings(vocabulary, word.meaning, 3)
            ];
          }
          break;
        case 'furigana':
          question = `What is the reading for "${word.word}"?`;
          correctAnswer = word.furigana;
          options = [
            word.furigana,
            ...getRandomFurigana(vocabulary, word.furigana, 3)
          ];
          break;
      }
      
      if (options.length === 4) {
        options = options.sort(() => Math.random() - 0.5);
        questions.push({
          question,
          options,
          correctAnswer,
          type,
          word: word.word
        });
      }
    });
    
    return questions;
  }, [vocabulary, getRandomMeanings, getRandomWords, getRandomFurigana]);

  // Start quiz
  const startQuiz = useCallback((mode: 'practice' | 'timed' | 'survival' = 'practice') => {
    const questions = generateQuiz(10, mode);
    if (questions.length > 0) {
      setQuizMode(mode);
      setQuizQuestions(questions);
      setQuizActive(true);
      setCurrentQuestion(0);
      setQuizScore(0);
      setSelectedAnswer(null);
      setQuizTimeLeft(mode === 'timed' ? 60 : mode === 'survival' ? 30 : 0);
      setQuizTimerActive(mode !== 'practice');
      setShowAnswer({});
      setCelebrating(false);
    } else {
      alert('Not enough vocabulary to generate a quiz. Please load more words.');
    }
  }, [generateQuiz]);

  // Handle quiz answer
  const handleQuizAnswer = useCallback((answer: string) => {
    if (selectedAnswer !== null || !quizQuestions[currentQuestion]) return;
    
    setSelectedAnswer(answer);
    const isCorrect = answer === quizQuestions[currentQuestion].correctAnswer;
    
    if (isCorrect) {
      setQuizScore(prev => prev + 1);
      setCelebrating(true);
      setConfetti(true);
      setTimeout(() => setCelebrating(false), 1000);
    }
    
    setTimeout(() => {
      if (currentQuestion < quizQuestions.length - 1) {
        setCurrentQuestion(prev => prev + 1);
        setSelectedAnswer(null);
      } else {
        endQuiz();
      }
    }, 1500);
  }, [currentQuestion, quizQuestions, selectedAnswer]);

  // End quiz
  const endQuiz = useCallback(() => {
    if (quizQuestions.length === 0) {
      setQuizActive(false);
      return;
    }

    const scoreData = {
      date: new Date().toISOString(),
      score: quizScore,
      total: quizQuestions.length,
      time: quizMode === 'timed' ? 60 - quizTimeLeft : quizMode === 'survival' ? quizScore * 10 : 0,
      mode: quizMode
    };
    
    setUserProgress(prev => ({
      ...prev,
      quizScores: [...(prev.quizScores || []), scoreData]
    }));
    
    setQuizTimerActive(false);
    
    // Check for achievements
    const newAchievements = [];
    if (quizScore === quizQuestions.length) {
      newAchievements.push('perfect_score');
    }
    if (quizScore >= quizQuestions.length * 0.8) {
      newAchievements.push('high_score');
    }
    if ((userProgress.quizScores?.length || 0) >= 10) {
      newAchievements.push('quiz_master');
    }
    
    if (newAchievements.length > 0) {
      setUserProgress(prev => ({
        ...prev,
        achievements: [...new Set([...(prev.achievements || []), ...newAchievements])]
      }));
      setShowAchievements(true);
    }
    
    setQuizHistory(prev => [...prev, scoreData]);
    setTimeout(() => setQuizActive(false), 3000);
  }, [quizScore, quizQuestions, quizMode, quizTimeLeft, userProgress]);

  // Current study word
  const currentStudyWord = filteredVocabulary?.[currentStudyIndex];

  // Loading state
  if (isLoading) {
    return (
      <div className={`min-h-screen flex items-center justify-center transition-colors duration-300 ${
        darkMode ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50'
      }`}>
        <div className="text-center">
          <div className="relative inline-block">
            <div className="w-16 h-16 rounded-full border-4 border-transparent border-t-blue-500 animate-spin"></div>
            <Brain className="absolute inset-0 m-auto w-8 h-8 text-blue-500" />
          </div>
          <p className={`mt-6 text-lg font-medium ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
            Loading vocabulary...
          </p>
        </div>
      </div>
    );
  }

  // Empty state
  if (!vocabulary || vocabulary.length === 0) {
    return (
      <div className={`min-h-screen flex items-center justify-center transition-colors duration-300 ${
        darkMode ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50'
      }`}>
        <div className={`text-center max-w-md p-8 rounded-2xl shadow-xl ${
          darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'
        }`}>
          <AlertCircle className={`w-16 h-16 mx-auto mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-300'}`} />
          <h2 className="text-2xl font-bold mb-3">No Vocabulary Data</h2>
          <p className="mb-6 opacity-75">
            Unable to load vocabulary data. Please check if the JSON file exists.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-200"
          >
            Retry Loading
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-all duration-300 ${
      darkMode ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-100' : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 text-gray-800'
    }`}>
      {/* Confetti Effect */}
      {confetti && (
        <div className="fixed inset-0 z-50 pointer-events-none">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-gradient-to-r from-yellow-400 via-pink-500 to-blue-500 rounded-full animate-confetti"
              style={{
                left: `${Math.random() * 100}vw`,
                animationDelay: `${Math.random() * 2}s`,
                transform: `rotate(${Math.random() * 360}deg)`
              }}
            />
          ))}
        </div>
      )}

      {/* Header */}
      <header className={`sticky top-0 z-40 ${
        darkMode ? 'bg-gray-800/90 backdrop-blur-xl border-b border-gray-700/50' : 'bg-white/90 backdrop-blur-xl border-b border-gray-100/50'
      } shadow-lg`}>
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-all duration-200 hover:scale-105"
              >
                <Menu size={24} />
              </button>
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                    <span className="text-white font-bold text-lg">N5</span>
                  </div>
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                    <Check size={12} className="text-white" />
                  </div>
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600 dark:from-blue-400 dark:via-indigo-300 dark:to-purple-400 bg-clip-text text-transparent">
                    Japanese Vocabulary
                  </h1>
                  <p className="text-sm opacity-75">Master N5 Level Words</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              {/* Streak Display */}
              <div className={`hidden md:flex items-center space-x-2 px-3 py-2 rounded-lg ${
                darkMode ? 'bg-gray-700/50' : 'bg-gray-100/50'
              }`}>
                <Flame className="text-orange-500" size={18} />
                <span className="font-bold">{stats.streak}</span>
                <span className="text-sm opacity-75">day streak</span>
              </div>
              
              <button
                onClick={() => startQuiz('practice')}
                className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all duration-200 flex items-center space-x-2"
              >
                <Brain size={18} />
                <span>Quick Quiz</span>
              </button>
              
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-all duration-200 hover:scale-105"
                title="Toggle theme"
              >
                {darkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className={`fixed inset-0 z-30 pt-20 ${
          darkMode ? 'bg-gray-900/95' : 'bg-white/95'
        } backdrop-blur-xl`}>
          <div className="p-6 space-y-2">
            {[
              { id: 'all', icon: Home, label: 'All Words', count: vocabulary.length },
              { id: 'unlearned', icon: Target, label: 'To Learn', count: vocabulary.length - (userProgress?.learnedWords?.length || 0) },
              { id: 'bookmarked', icon: Star, label: 'Bookmarked', count: userProgress?.bookmarkedWords?.length || 0 },
              { id: 'learned', icon: Award, label: 'Mastered', count: userProgress?.learnedWords?.length || 0 }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setSelectedTab(tab.id as any);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center justify-between p-4 rounded-xl transition-all duration-200 ${
                  selectedTab === tab.id
                    ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                <div className="flex items-center space-x-4">
                  <tab.icon size={22} />
                  <span className="font-medium">{tab.label}</span>
                </div>
                <span className={`font-bold ${
                  selectedTab === tab.id ? 'text-white/90' : 'opacity-75'
                }`}>{tab.count}</span>
              </button>
            ))}
            
            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => startQuiz('timed')}
                className="w-full p-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-200 flex items-center justify-center space-x-3"
              >
                <Timer size={20} />
                <span>Timed Quiz</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Stats Dashboard */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
          <div className={`col-span-2 md:col-span-2 rounded-2xl p-5 ${
            darkMode ? 'bg-gradient-to-br from-gray-800 to-gray-900' : 'bg-gradient-to-br from-white to-gray-50'
          } shadow-xl`}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                  <Target size={24} className="text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">Progress</h3>
                  <p className="text-sm opacity-75">N5 Mastery</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold">{stats.progressPercentage}%</div>
              </div>
            </div>
            <div className="relative pt-2">
              <div className={`overflow-hidden h-2 rounded-full ${
                darkMode ? 'bg-gray-700' : 'bg-gray-200'
              }`}>
                <div 
                  className="h-2 rounded-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 transition-all duration-1000 ease-out"
                  style={{ width: `${stats.progressPercentage}%` }}
                />
              </div>
            </div>
          </div>
          
          <div className={`rounded-2xl p-5 ${
            darkMode ? 'bg-gradient-to-br from-gray-800 to-gray-900' : 'bg-gradient-to-br from-white to-gray-50'
          } shadow-xl`}>
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                <CheckCircle size={20} className="text-white" />
              </div>
              <div>
                <div className="text-sm opacity-75">Mastered</div>
                <div className="text-2xl font-bold">{stats.learnedWords}</div>
              </div>
            </div>
          </div>
          
          <div className={`rounded-2xl p-5 ${
            darkMode ? 'bg-gradient-to-br from-gray-800 to-gray-900' : 'bg-gradient-to-br from-white to-gray-50'
          } shadow-xl`}>
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-yellow-500 to-amber-600 flex items-center justify-center">
                <Star size={20} className="text-white" />
              </div>
              <div>
                <div className="text-sm opacity-75">Bookmarks</div>
                <div className="text-2xl font-bold">{stats.bookmarkedWords}</div>
              </div>
            </div>
          </div>
          
          <div className={`rounded-2xl p-5 ${
            darkMode ? 'bg-gradient-to-br from-gray-800 to-gray-900' : 'bg-gradient-to-br from-white to-gray-50'
          } shadow-xl`}>
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center">
                <Flame size={20} className="text-white" />
              </div>
              <div>
                <div className="text-sm opacity-75">Streak</div>
                <div className="text-2xl font-bold">{stats.streak} days</div>
              </div>
            </div>
          </div>
          
          <div className={`rounded-2xl p-5 ${
            darkMode ? 'bg-gradient-to-br from-gray-800 to-gray-900' : 'bg-gradient-to-br from-white to-gray-50'
          } shadow-xl`}>
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
                <Trophy size={20} className="text-white" />
              </div>
              <div>
                <div className="text-sm opacity-75">Best Score</div>
                <div className="text-2xl font-bold">{stats.bestScore}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Quiz Section */}
        {quizActive && quizQuestions.length > 0 && (
          <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${
            darkMode ? 'bg-gray-900/95' : 'bg-white/95'
          } backdrop-blur-xl`}>
            <div className={`max-w-2xl w-full rounded-3xl overflow-hidden shadow-2xl ${
              darkMode ? 'bg-gray-800' : 'bg-white'
            }`}>
              {/* Quiz Header */}
              <div className={`p-6 ${
                darkMode ? 'bg-gradient-to-r from-gray-800 to-gray-900' : 'bg-gradient-to-r from-blue-50 to-indigo-50'
              }`}>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold">Quiz Time! 🎯</h2>
                    <p className="opacity-75">{quizMode.charAt(0).toUpperCase() + quizMode.slice(1)} Mode</p>
                  </div>
                  <div className="flex items-center space-x-4">
                    {quizTimerActive && (
                      <div className="flex items-center space-x-2 px-4 py-2 rounded-full bg-gradient-to-r from-red-500 to-pink-500 text-white">
                        <Timer size={18} />
                        <span className="font-bold">{quizTimeLeft}s</span>
                      </div>
                    )}
                    <div className="text-center">
                      <div className="text-2xl font-bold">{quizScore}</div>
                      <div className="text-sm opacity-75">Score</div>
                    </div>
                    <button
                      onClick={() => setQuizActive(false)}
                      className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl"
                    >
                      <XIcon size={24} />
                    </button>
                  </div>
                </div>
                
                {/* Progress Bar */}
                <div className="relative pt-1">
                  <div className={`overflow-hidden h-2 rounded-full ${
                    darkMode ? 'bg-gray-700' : 'bg-gray-200'
                  }`}>
                    <div 
                      className="h-2 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 transition-all duration-300"
                      style={{ width: `${((currentQuestion + 1) / quizQuestions.length) * 100}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-sm mt-2">
                    <span>Question {currentQuestion + 1} of {quizQuestions.length}</span>
                    <span>{Math.round(((currentQuestion + 1) / quizQuestions.length) * 100)}%</span>
                  </div>
                </div>
              </div>
              
              {/* Quiz Question */}
              <div className="p-8">
                <div className="mb-8">
                  <div className={`text-4xl font-bold mb-6 ${
                    darkMode ? 'text-blue-300' : 'text-blue-600'
                  }`}>
                    {quizQuestions[currentQuestion]?.question || ''}
                  </div>
                  
                  {/* Word Display */}
                  <div className="text-center mb-8">
                    <div className="text-5xl font-bold mb-2">{quizQuestions[currentQuestion]?.word || ''}</div>
                    {quizQuestions[currentQuestion]?.type === 'furigana' && (
                      <div className="text-xl opacity-75">Reading</div>
                    )}
                  </div>
                </div>
                
                {/* Answer Options */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {quizQuestions[currentQuestion]?.options?.map((option, index) => {
                    const isCorrect = option === quizQuestions[currentQuestion]?.correctAnswer;
                    const isSelected = selectedAnswer === option;
                    let buttonClass = '';
                    
                    if (selectedAnswer !== null) {
                      if (isCorrect) {
                        buttonClass = 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg';
                      } else if (isSelected) {
                        buttonClass = 'bg-gradient-to-r from-red-500 to-pink-600 text-white shadow-lg';
                      } else {
                        buttonClass = 'opacity-50';
                      }
                    } else {
                      buttonClass = `hover:scale-105 hover:shadow-lg transition-all duration-200 ${
                        darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'
                      }`;
                    }
                    
                    return (
                      <button
                        key={index}
                        onClick={() => handleQuizAnswer(option)}
                        disabled={selectedAnswer !== null}
                        className={`p-6 rounded-2xl text-left transition-all duration-300 ${buttonClass}`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                              selectedAnswer === null 
                                ? darkMode ? 'bg-gray-600' : 'bg-gray-200' 
                                : isCorrect ? 'bg-green-400' : isSelected ? 'bg-red-400' : ''
                            }`}>
                              <span className="font-bold">{String.fromCharCode(65 + index)}</span>
                            </div>
                            <span className="text-lg font-medium">{option}</span>
                          </div>
                          {selectedAnswer !== null && isCorrect && (
                            <Check className="text-white" size={24} />
                          )}
                          {selectedAnswer !== null && isSelected && !isCorrect && (
                            <XIcon className="text-white" size={24} />
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
                
                {/* Feedback */}
                {selectedAnswer !== null && (
                  <div className={`mt-8 p-6 rounded-2xl ${
                    selectedAnswer === quizQuestions[currentQuestion]?.correctAnswer
                      ? 'bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20'
                      : 'bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20'
                  }`}>
                    <div className="flex items-center space-x-3">
                      {selectedAnswer === quizQuestions[currentQuestion]?.correctAnswer ? (
                        <>
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 flex items-center justify-center">
                            <Check size={24} className="text-white" />
                          </div>
                          <div>
                            <h4 className="font-bold text-lg">Correct! 🎉</h4>
                            <p className="opacity-75">Great job! You got it right!</p>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-red-500 to-pink-600 flex items-center justify-center">
                            <XIcon size={24} className="text-white" />
                          </div>
                          <div>
                            <h4 className="font-bold text-lg">Not quite</h4>
                            <p className="opacity-75">Correct answer: {quizQuestions[currentQuestion]?.correctAnswer}</p>
                          </div>
                        </>
                      )}
                    </div>
                    <button
                      onClick={() => {
                        if (currentQuestion < quizQuestions.length - 1) {
                          setCurrentQuestion(prev => prev + 1);
                          setSelectedAnswer(null);
                        } else {
                          endQuiz();
                        }
                      }}
                      className="mt-4 w-full py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-200"
                    >
                      {currentQuestion < quizQuestions.length - 1 ? 'Next Question →' : 'Finish Quiz'}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Quiz Results */}
        {quizHistory.length > 0 && !quizActive && (
          <div className={`mb-8 rounded-2xl p-6 ${
            darkMode ? 'bg-gradient-to-br from-gray-800 to-gray-900' : 'bg-gradient-to-br from-white to-gray-50'
          } shadow-xl`}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold flex items-center space-x-3">
                <Trophy className="text-yellow-500" size={24} />
                <span>Recent Quiz Results</span>
              </h3>
              <button
                onClick={() => startQuiz('practice')}
                className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-200"
              >
                Try Again
              </button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {userProgress.quizScores?.slice(-4).reverse().map((score, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-xl ${
                    darkMode ? 'bg-gray-700/50' : 'bg-gray-100/50'
                  }`}
                >
                  <div className="text-3xl font-bold text-center mb-2">
                    {score?.score || 0}<span className="text-sm opacity-75">/{score?.total || 1}</span>
                  </div>
                  <div className="text-center">
                    <div className="text-sm opacity-75">{score?.mode || 'practice'}</div>
                    <div className="text-xs opacity-50">
                      {score?.date ? new Date(score.date).toLocaleDateString() : 'Unknown date'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Study Area */}
          <div className="lg:col-span-2 space-y-8">
            {/* Study Card */}
            <div className={`rounded-3xl overflow-hidden shadow-2xl ${
              darkMode ? 'bg-gradient-to-br from-gray-800 to-gray-900' : 'bg-gradient-to-br from-white to-gray-50'
            }`}>
              <div className={`p-6 ${
                darkMode ? 'bg-gradient-to-r from-gray-800 to-gray-900' : 'bg-gradient-to-r from-blue-50 to-indigo-50'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                      <Brain size={24} className="text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold">Study Mode</h2>
                      <p className="opacity-75">Word {currentStudyIndex + 1} of {filteredVocabulary.length}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => speakWord(currentStudyWord?.word || '')}
                      className="p-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:shadow-lg transition-all duration-200"
                      title="Listen"
                    >
                      <Volume2 size={20} />
                    </button>
                    <button
                      onClick={shuffleVocabulary}
                      className="p-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:shadow-lg transition-all duration-200"
                      title="Shuffle"
                    >
                      <Shuffle size={20} />
                    </button>
                  </div>
                </div>
              </div>
              
              {currentStudyWord ? (
                <>
                  {/* Word Display */}
                  <div className="p-8 text-center">
                    <div className="mb-10">
                      <div className="text-7xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600 dark:from-blue-400 dark:via-indigo-300 dark:to-purple-400 bg-clip-text text-transparent">
                        {currentStudyWord.word}
                      </div>
                      
                      <div className="space-y-3">
                        {showFurigana && (
                          <div className="text-2xl text-gray-600 dark:text-gray-300">
                            {currentStudyWord.furigana}
                          </div>
                        )}
                        {showRomaji && (
                          <div className="text-xl text-gray-500 dark:text-gray-400">
                            {currentStudyWord.romaji}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Answer Section */}
                    {showAnswer[currentStudyWord.word] ? (
                      <div className="animate-fadeIn">
                        <div className="text-4xl font-bold mb-6 bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-400 dark:to-emerald-400 bg-clip-text text-transparent">
                          {currentStudyWord.meaning}
                        </div>
                        {currentStudyWord.example && (
                          <div className={`p-6 rounded-2xl ${
                            darkMode ? 'bg-gray-700/50' : 'bg-blue-50/50'
                          }`}>
                            <div className="flex items-center space-x-3 mb-3">
                              <Sparkles size={20} className="text-yellow-500" />
                              <div className="text-sm font-semibold">Example Sentence</div>
                            </div>
                            <div className="text-lg">{currentStudyWord.example}</div>
                          </div>
                        )}
                        {currentStudyWord.mnemonics && (
                          <div className={`mt-6 p-6 rounded-2xl ${
                            darkMode ? 'bg-purple-900/20' : 'bg-purple-50/50'
                          }`}>
                            <div className="flex items-center space-x-3 mb-3">
                              <Brain size={20} className="text-purple-500" />
                              <div className="text-sm font-semibold">Memory Tip</div>
                            </div>
                            <div className="text-lg">{currentStudyWord.mnemonics}</div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <button
                        onClick={() => flipCard(currentStudyWord.word)}
                        className="px-12 py-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold text-lg rounded-2xl hover:shadow-xl hover:scale-105 transition-all duration-200"
                      >
                        <div className="flex items-center justify-center space-x-3">
                          <Eye size={24} />
                          <span>Reveal Meaning</span>
                        </div>
                      </button>
                    )}
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="p-6 border-t border-gray-100 dark:border-gray-700">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <button
                        onClick={goToPrevWord}
                        className="flex items-center justify-center space-x-3 py-4 rounded-xl bg-gradient-to-r from-gray-100 to-gray-50 dark:from-gray-700 dark:to-gray-800 hover:shadow-lg transition-all duration-200"
                        disabled={currentStudyIndex === 0}
                      >
                        <ArrowLeft size={20} />
                        <span className="font-semibold">Previous</span>
                      </button>
                      
                      <button
                        onClick={() => toggleBookmark(currentStudyWord.word)}
                        className={`flex items-center justify-center space-x-3 py-4 rounded-xl transition-all duration-200 ${
                          userProgress.bookmarkedWords?.includes(currentStudyWord.word)
                            ? 'bg-gradient-to-r from-yellow-500 to-amber-500 text-white shadow-lg'
                            : 'bg-gradient-to-r from-gray-100 to-gray-50 dark:from-gray-700 dark:to-gray-800 hover:shadow-lg'
                        }`}
                      >
                        <Star size={20} fill={userProgress.bookmarkedWords?.includes(currentStudyWord.word) ? 'currentColor' : 'none'} />
                        <span className="font-semibold">Bookmark</span>
                      </button>
                      
                      <button
                        onClick={() => toggleLearned(currentStudyWord.word)}
                        className={`flex items-center justify-center space-x-3 py-4 rounded-xl transition-all duration-200 ${
                          userProgress.learnedWords?.includes(currentStudyWord.word)
                            ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg'
                            : 'bg-gradient-to-r from-gray-100 to-gray-50 dark:from-gray-700 dark:to-gray-800 hover:shadow-lg'
                        }`}
                      >
                        {userProgress.learnedWords?.includes(currentStudyWord.word) ? (
                          <CheckCircle size={20} />
                        ) : (
                          <Circle size={20} />
                        )}
                        <span className="font-semibold">Master</span>
                      </button>
                      
                      <button
                        onClick={goToNextWord}
                        className="flex items-center justify-center space-x-3 py-4 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:shadow-lg transition-all duration-200"
                      >
                        <span className="font-semibold">Next</span>
                        <ArrowRight size={20} />
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="p-12 text-center">
                  <Search className="w-20 h-20 mx-auto mb-6 opacity-50" />
                  <h3 className="text-2xl font-bold mb-3">No words found</h3>
                  <p className="opacity-75">Try changing your filters or search terms</p>
                </div>
              )}
            </div>
            
            {/* Vocabulary List */}
            <div className={`rounded-3xl overflow-hidden shadow-2xl ${
              darkMode ? 'bg-gradient-to-br from-gray-800 to-gray-900' : 'bg-gradient-to-br from-white to-gray-50'
            }`}>
              <div className={`p-6 ${
                darkMode ? 'bg-gradient-to-r from-gray-800 to-gray-900' : 'bg-gradient-to-r from-blue-50 to-indigo-50'
              }`}>
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
                      <List size={24} className="text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold">Vocabulary List</h3>
                      <p className="opacity-75">{filteredVocabulary.length} words</p>
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1 sm:w-72">
                      <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                      <input
                        type="text"
                        placeholder="Search words or meanings..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div className="flex gap-2">
                      {[
                        { id: 'all', label: 'All' },
                        { id: 'unlearned', label: 'To Learn' },
                        { id: 'bookmarked', label: 'Bookmarked' },
                        { id: 'learned', label: 'Mastered' }
                      ].map((tab) => (
                        <button
                          key={tab.id}
                          onClick={() => setSelectedTab(tab.id as any)}
                          className={`px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                            selectedTab === tab.id
                              ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg'
                              : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
                          }`}
                        >
                          {tab.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="overflow-hidden">
                <div className="overflow-y-auto max-h-[600px]">
                  {filteredVocabulary.map((item, index) => (
                    <div
                      key={`${item.word}-${index}`}
                      className={`p-6 border-b ${
                        darkMode ? 'border-gray-700 hover:bg-gray-700/30' : 'border-gray-100 hover:bg-gray-50'
                      } transition-all duration-200 group`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-start space-x-6">
                          <div className="flex-shrink-0">
                            <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
                              {item.word}
                            </div>
                            <div className="text-sm opacity-75 mt-2">{item.furigana}</div>
                          </div>
                          
                          <div>
                            <div className="text-xl font-medium mb-2">{item.meaning}</div>
                            <div className="text-sm opacity-75">{item.romaji}</div>
                            {item.example && (
                              <div className={`mt-3 p-3 rounded-lg text-sm ${
                                darkMode ? 'bg-gray-700/50' : 'bg-gray-100/50'
                              }`}>
                                {item.example}
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          <button
                            onClick={() => toggleBookmark(item.word)}
                            className={`p-3 rounded-lg transition-all duration-200 ${
                              userProgress.bookmarkedWords?.includes(item.word)
                                ? 'text-yellow-500 bg-yellow-500/10'
                                : 'text-gray-400 hover:text-yellow-500 hover:bg-yellow-500/10'
                            }`}
                          >
                            <Star size={20} fill={userProgress.bookmarkedWords?.includes(item.word) ? 'currentColor' : 'none'} />
                          </button>
                          
                          <button
                            onClick={() => {
                              const wordIndex = filteredVocabulary.findIndex(w => w.word === item.word);
                              if (wordIndex !== -1) {
                                setCurrentStudyIndex(wordIndex);
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                              }
                            }}
                            className="p-3 rounded-lg text-gray-400 hover:text-blue-500 hover:bg-blue-500/10 dark:hover:text-blue-400 transition-all duration-200"
                          >
                            <Zap size={20} />
                          </button>
                          
                          <button
                            onClick={() => speakWord(item.word)}
                            className="p-3 rounded-lg text-gray-400 hover:text-purple-500 hover:bg-purple-500/10 dark:hover:text-purple-400 transition-all duration-200"
                          >
                            <Volume2 size={20} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          {/* Right Column - Sidebar */}
          <div className="space-y-8">
            {/* Daily Progress */}
            <div className={`rounded-3xl p-6 shadow-2xl ${
              darkMode ? 'bg-gradient-to-br from-gray-800 to-gray-900' : 'bg-gradient-to-br from-white to-gray-50'
            }`}>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <Target className="text-blue-500" size={24} />
                  <div>
                    <h3 className="font-bold text-lg">Daily Goal</h3>
                    <p className="text-sm opacity-75">{stats.todayProgress} of {dailyGoal} words</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold">{stats.dailyGoalPercentage}%</div>
                </div>
              </div>
              
              <div className="mb-6">
                <div className={`w-full rounded-full h-4 ${
                  darkMode ? 'bg-gray-700' : 'bg-gray-200'
                }`}>
                  <div 
                    className="h-4 rounded-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 transition-all duration-500 ease-out"
                    style={{ width: `${stats.dailyGoalPercentage}%` }}
                  ></div>
                </div>
              </div>
              
              <button
                onClick={() => setShowSettings(true)}
                className="w-full py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-200"
              >
                Adjust Goal
              </button>
            </div>
            
            {/* Quiz Cards */}
            <div className={`rounded-3xl p-6 shadow-2xl ${
              darkMode ? 'bg-gradient-to-br from-gray-800 to-gray-900' : 'bg-gradient-to-br from-white to-gray-50'
            }`}>
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                  <Brain size={24} className="text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">Practice Quizzes</h3>
                  <p className="text-sm opacity-75">Test your knowledge</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <button
                  onClick={() => startQuiz('practice')}
                  className="w-full flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 hover:shadow-lg transition-all duration-200 group"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-green-500 to-emerald-600 flex items-center justify-center">
                      <HelpCircle size={20} className="text-white" />
                    </div>
                    <div>
                      <div className="font-semibold">Practice Mode</div>
                      <div className="text-sm opacity-75">Unlimited time, 10 questions</div>
                    </div>
                  </div>
                  <ChevronRight className="opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-200" />
                </button>
                
                <button
                  onClick={() => startQuiz('timed')}
                  className="w-full flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 hover:shadow-lg transition-all duration-200 group"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-orange-500 to-red-600 flex items-center justify-center">
                      <Timer size={20} className="text-white" />
                    </div>
                    <div>
                      <div className="font-semibold">Timed Challenge</div>
                      <div className="text-sm opacity-75">60 seconds, race against time</div>
                    </div>
                  </div>
                  <ChevronRight className="opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-200" />
                </button>
                
                <button
                  onClick={() => startQuiz('survival')}
                  className="w-full flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 hover:shadow-lg transition-all duration-200 group"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-purple-500 to-pink-600 flex items-center justify-center">
                      <Flame size={20} className="text-white" />
                    </div>
                    <div>
                      <div className="font-semibold">Survival Mode</div>
                      <div className="text-sm opacity-75">Keep going until you fail</div>
                    </div>
                  </div>
                  <ChevronRight className="opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-200" />
                </button>
              </div>
            </div>
            
            {/* Quick Settings */}
            <div className={`rounded-3xl p-6 shadow-2xl ${
              darkMode ? 'bg-gradient-to-br from-gray-800 to-gray-900' : 'bg-gradient-to-br from-white to-gray-50'
            }`}>
              <h3 className="font-bold text-lg mb-6">Quick Settings</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Eye size={20} />
                    <span>Show Furigana</span>
                  </div>
                  <button
                    onClick={() => setShowFurigana(!showFurigana)}
                    className={`w-12 h-6 rounded-full relative transition-all duration-200 ${
                      showFurigana 
                        ? 'bg-gradient-to-r from-blue-500 to-indigo-500' 
                        : 'bg-gray-300 dark:bg-gray-600'
                    }`}
                  >
                    <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform ${
                      showFurigana ? 'right-0.5' : 'left-0.5'
                    }`}></div>
                  </button>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Type size={20} />
                    <span>Show Romaji</span>
                  </div>
                  <button
                    onClick={() => setShowRomaji(!showRomaji)}
                    className={`w-12 h-6 rounded-full relative transition-all duration-200 ${
                      showRomaji 
                        ? 'bg-gradient-to-r from-green-500 to-emerald-500' 
                        : 'bg-gray-300 dark:bg-gray-600'
                    }`}
                  >
                    <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform ${
                      showRomaji ? 'right-0.5' : 'left-0.5'
                    }`}></div>
                  </button>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Volume2 size={20} />
                    <span>Speech</span>
                  </div>
                  <button
                    onClick={() => setSpeechEnabled(!speechEnabled)}
                    className={`w-12 h-6 rounded-full relative transition-all duration-200 ${
                      speechEnabled 
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500' 
                        : 'bg-gray-300 dark:bg-gray-600'
                    }`}
                  >
                    <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform ${
                      speechEnabled ? 'right-0.5' : 'left-0.5'
                    }`}></div>
                  </button>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Sparkles size={20} />
                    <span>Animations</span>
                  </div>
                  <button
                    onClick={() => setAnimationEnabled(!animationEnabled)}
                    className={`w-12 h-6 rounded-full relative transition-all duration-200 ${
                      animationEnabled 
                        ? 'bg-gradient-to-r from-yellow-500 to-orange-500' 
                        : 'bg-gray-300 dark:bg-gray-600'
                    }`}
                  >
                    <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform ${
                      animationEnabled ? 'right-0.5' : 'left-0.5'
                    }`}></div>
                  </button>
                </div>
                
                {/* Settings Panel */}
                {showSettings && (
                  <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm mb-2">Daily Goal</label>
                        <div className="flex items-center space-x-3">
                          <button
                            onClick={() => setDailyGoal(Math.max(5, dailyGoal - 5))}
                            className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                          >
                            -
                          </button>
                          <div className="flex-1 text-center font-bold">{dailyGoal} words</div>
                          <button
                            onClick={() => setDailyGoal(Math.min(50, dailyGoal + 5))}
                            className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                          >
                            +
                          </button>
                        </div>
                      </div>
                      
                      <button
                        onClick={exportProgress}
                        className="w-full py-3 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex items-center justify-center space-x-2"
                      >
                        <Download size={18} />
                        <span>Export Progress</span>
                      </button>
                      
                      <button
                        onClick={importProgress}
                        className="w-full py-3 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex items-center justify-center space-x-2"
                      >
                        <Upload size={18} />
                        <span>Import Progress</span>
                      </button>
                      
                      <button
                        onClick={resetProgress}
                        className="w-full py-3 rounded-lg bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-800/30 transition-colors flex items-center justify-center space-x-2"
                      >
                        <RefreshCw size={18} />
                        <span>Reset Progress</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <footer className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <div className="flex items-center space-x-2">
                <Brain className="text-blue-500" size={24} />
                <span className="font-bold text-lg">N5 Vocabulary Master</span>
              </div>
              <p className="text-sm opacity-75 mt-2">Track progress • Learn faster • Achieve mastery</p>
            </div>
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => setShowSettings(true)}
                className="text-sm opacity-75 hover:opacity-100 transition-opacity"
              >
                Settings
              </button>
              <button 
                onClick={exportProgress}
                className="text-sm opacity-75 hover:opacity-100 transition-opacity"
              >
                Export Data
              </button>
              <button className="text-sm opacity-75 hover:opacity-100 transition-opacity">
                Feedback
              </button>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default N5VocabularyPage;