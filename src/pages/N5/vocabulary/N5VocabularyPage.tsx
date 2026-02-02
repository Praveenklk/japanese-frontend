// N5VocabularyPage.tsx
import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { 
  Bookmark, 
  CheckCircle, 
  Circle, 
  Shuffle, 
  ArrowLeft, 
  ArrowRight, 
  Search, 
  Star,
  Target,
  Award,
  Volume2,
  Eye,
  Menu,
  Download,
  Upload,
  Moon,
  Sun,
  RotateCw,
  Home,
  Brain,
  Trophy,
  Flame,
  Check,
  X as XIcon,
  Timer,
  Pause,
  Play,
  HelpCircle,
  AlertCircle,
  BookOpen,
  List,
  Sparkles,
  ChevronRight,
  Zap,
  TrendingUp,
  VolumeX,
  Volume1,
  Settings,
  Bell,
  Calendar,
  Clock,
  Heart,
  Share2,
  Copy,
  ExternalLink,
  DownloadCloud,
  UploadCloud,
  RefreshCw,
  ThumbsUp,
  ThumbsDown,
  Maximize2,
  Minimize2
} from 'lucide-react';

interface VocabularyItem {
  word: string;
  meaning: string;
  furigana: string;
  romaji: string;
  level: number;
  example?: string;
}

interface UserProgress {
  learnedWords: string[];
  bookmarkedWords: string[];
  lastStudied: number;
  studySessions: number;
  quizScores: {
    date: string;
    score: number;
    total: number;
    mode: string;
  }[];
  streak: number;
}

interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
  type: 'meaning' | 'word';
  word: string;
}

const N5VocabularyPage: React.FC = () => {
  // State Management
  const [vocabulary, setVocabulary] = useState<VocabularyItem[]>([
    { word: "私", meaning: "I, me", furigana: "わたし", romaji: "watashi", level: 5, example: "私は学生です。" },
    { word: "学校", meaning: "school", furigana: "がっこう", romaji: "gakkou", level: 5, example: "学校に行きます。" },
    { word: "食べる", meaning: "to eat", furigana: "たべる", romaji: "taberu", level: 5, example: "ご飯を食べます。" },
    { word: "大きい", meaning: "big, large", furigana: "おおきい", romaji: "ookii", level: 5, example: "大きい家です。" },
    { word: "小さい", meaning: "small, little", furigana: "ちいさい", romaji: "chiisai", level: 5, example: "小さい犬です。" },
    { word: "本", meaning: "book", furigana: "ほん", romaji: "hon", level: 5, example: "本を読みます。" },
    { word: "水", meaning: "water", furigana: "みず", romaji: "mizu", level: 5, example: "水を飲みます。" },
    { word: "行く", meaning: "to go", furigana: "いく", romaji: "iku", level: 5, example: "学校に行きます。" },
    { word: "来る", meaning: "to come", furigana: "くる", romaji: "kuru", level: 5, example: "日本に来ます。" },
    { word: "見る", meaning: "to see, to watch", furigana: "みる", romaji: "miru", level: 5, example: "テレビを見ます。" },
  ]);
  
  const [filteredVocabulary, setFilteredVocabulary] = useState<VocabularyItem[]>([]);
  const [shuffledVocabulary, setShuffledVocabulary] = useState<VocabularyItem[]>([]);
  const [isShuffled, setIsShuffled] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [userProgress, setUserProgress] = useState<UserProgress>({
    learnedWords: [],
    bookmarkedWords: [],
    lastStudied: 0,
    studySessions: 0,
    quizScores: [],
    streak: 0
  });
  
  const [selectedTab, setSelectedTab] = useState<'all' | 'bookmarked' | 'unlearned' | 'learned'>('all');
  const [showAnswer, setShowAnswer] = useState<{ [key: string]: boolean }>({});
  const [currentStudyIndex, setCurrentStudyIndex] = useState(0);
  const [showRomaji, setShowRomaji] = useState(false);
  const [showFurigana, setShowFurigana] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [speechEnabled, setSpeechEnabled] = useState(true);
  const [autoPlay, setAutoPlay] = useState(false);
  const [dailyGoal, setDailyGoal] = useState(10);
  const [todayProgress, setTodayProgress] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  const [animationKey, setAnimationKey] = useState(0);
  const [isFlipping, setIsFlipping] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [studySpeed, setStudySpeed] = useState(3000);
  
  // Quiz States
  const [quizMode, setQuizMode] = useState<'practice' | 'timed'>('practice');
  const [quizActive, setQuizActive] = useState(false);
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [quizTimeLeft, setQuizTimeLeft] = useState(60);
  const [quizTimerActive, setQuizTimerActive] = useState(false);
  const [showQuizResults, setShowQuizResults] = useState(false);
  const [showStreakNotification, setShowStreakNotification] = useState(false);

  // Refs
  const speechSynthesisRef = useRef<SpeechSynthesis | null>(null);
  const autoPlayTimerRef = useRef<NodeJS.Timeout | null>(null);
  const flipTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize filtered vocabulary
useEffect(() => {
  const loadVocabularyData = async () => {
    try {
      const module = await import("../../Vocabulary/vocabularyN5.json");
      const vocabData = module.default; // ✅ this is the array

      setVocabulary(vocabData);
      setFilteredVocabulary(vocabData);
      setShuffledVocabulary([...vocabData].sort(() => Math.random() - 0.5));
    } catch (error) {
      console.error(error);
    }
  };

  loadVocabularyData();
}, []);


  // Initialize speech synthesis
  useEffect(() => {
    speechSynthesisRef.current = window.speechSynthesis;
    
    // Cleanup speech synthesis on unmount
    return () => {
      if (speechSynthesisRef.current) {
        speechSynthesisRef.current.cancel();
      }
      if (autoPlayTimerRef.current) {
        clearTimeout(autoPlayTimerRef.current);
      }
      if (flipTimerRef.current) {
        clearTimeout(flipTimerRef.current);
      }
    };
  }, []);

  // Load user progress
  useEffect(() => {
    try {
      const savedProgress = localStorage.getItem('n5VocabularyProgress');
      if (savedProgress) {
        const parsed = JSON.parse(savedProgress);
        // Update streak based on last studied date
        const today = new Date().toDateString();
        const lastStudiedDate = new Date(parsed.lastStudied).toDateString();
        const newStreak = today === lastStudiedDate ? parsed.streak : 
                         (new Date().getTime() - parsed.lastStudied < 86400000 * 2) ? parsed.streak : 0;
        
        setUserProgress({
          ...parsed,
          streak: newStreak
        });
        
        // Show streak notification
        if (newStreak > 0 && newStreak % 5 === 0) {
          setShowStreakNotification(true);
          setTimeout(() => setShowStreakNotification(false), 5000);
        }
      }
    } catch (error) {
      console.error("Error loading user progress:", error);
    }
  }, []);

  // Save progress
  useEffect(() => {
    try {
      localStorage.setItem('n5VocabularyProgress', JSON.stringify(userProgress));
    } catch (error) {
      console.error("Error saving progress:", error);
    }
  }, [userProgress]);

  // Filter vocabulary
  useEffect(() => {
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
          userProgress.bookmarkedWords.includes(item.word)
        );
        break;
      case 'learned':
        filtered = filtered.filter(item => 
          userProgress.learnedWords.includes(item.word)
        );
        break;
      case 'unlearned':
        filtered = filtered.filter(item => 
          !userProgress.learnedWords.includes(item.word)
        );
        break;
      default:
        break;
    }

    setFilteredVocabulary(filtered);
    
    // If shuffle is active, shuffle the filtered results
    if (isShuffled) {
      setShuffledVocabulary([...filtered].sort(() => Math.random() - 0.5));
    } else {
      setShuffledVocabulary(filtered);
    }
    
    // Reset current index if out of bounds
    if (currentStudyIndex >= filtered.length) {
      setCurrentStudyIndex(0);
    }
  }, [searchTerm, selectedTab, vocabulary, userProgress, currentStudyIndex, isShuffled]);

  // Auto-play effect
  useEffect(() => {
    if (!autoPlay || !currentStudyWord) return;

    autoPlayTimerRef.current = setTimeout(() => {
      goToNextWord();
    }, studySpeed);

    return () => {
      if (autoPlayTimerRef.current) {
        clearTimeout(autoPlayTimerRef.current);
      }
    };
  }, [autoPlay, currentStudyIndex, filteredVocabulary.length, studySpeed]);

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

  // Calculate statistics
  const stats = useMemo(() => {
    const totalWords = vocabulary.length;
    const learnedWords = userProgress.learnedWords.length;
    const bookmarkedWords = userProgress.bookmarkedWords.length;
    const progressPercentage = totalWords > 0 ? Math.round((learnedWords / totalWords) * 100) : 0;
    const dailyGoalPercentage = Math.min(100, Math.round((todayProgress / dailyGoal) * 100));
    
    const averageScore = userProgress.quizScores.length > 0 
      ? Math.round(userProgress.quizScores.reduce((acc, score) => 
          acc + (score.score / score.total) * 100, 0) / userProgress.quizScores.length)
      : 0;
    
    const bestScore = userProgress.quizScores.length > 0 
      ? Math.max(...userProgress.quizScores.map(s => s.score))
      : 0;

    return { 
      totalWords, 
      learnedWords, 
      bookmarkedWords, 
      progressPercentage, 
      dailyGoalPercentage,
      averageScore,
      todayProgress,
      dailyGoal,
      streak: userProgress.streak,
      bestScore,
      quizCount: userProgress.quizScores.length
    };
  }, [vocabulary, userProgress, todayProgress, dailyGoal]);

  // Get current vocabulary list (shuffled or normal)
  const getCurrentVocabulary = () => {
    return isShuffled ? shuffledVocabulary : filteredVocabulary;
  };

  // Current study word
  const currentStudyWord = getCurrentVocabulary()[currentStudyIndex];

  // Action functions
  const toggleBookmark = useCallback((word: string) => {
    setUserProgress(prev => {
      const isBookmarked = prev.bookmarkedWords.includes(word);
      const newBookmarkedWords = isBookmarked
        ? prev.bookmarkedWords.filter(w => w !== word)
        : [...prev.bookmarkedWords, word];
      
      return {
        ...prev,
        bookmarkedWords: newBookmarkedWords
      };
    });
  }, []);

  const toggleLearned = useCallback((word: string) => {
    setUserProgress(prev => {
      const isLearned = prev.learnedWords.includes(word);
      const newLearnedWords = isLearned
        ? prev.learnedWords.filter(w => w !== word)
        : [...prev.learnedWords, word];
      
      if (!isLearned) {
        setTodayProgress(prev => prev + 1);
        
        // Update streak
        const today = new Date().toDateString();
        const lastStudiedDate = new Date(prev.lastStudied).toDateString();
        const newStreak = today === lastStudiedDate ? prev.streak : prev.streak + 1;
        
        return {
          ...prev,
          learnedWords: newLearnedWords,
          lastStudied: Date.now(),
          studySessions: prev.studySessions + 1,
          streak: newStreak
        };
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
    setIsFlipping(true);
    setShowAnswer(prev => ({
      ...prev,
      [word]: !prev[word]
    }));
    
    if (flipTimerRef.current) {
      clearTimeout(flipTimerRef.current);
    }
    
    flipTimerRef.current = setTimeout(() => {
      setIsFlipping(false);
    }, 300);
  }, []);

  const resetProgress = useCallback(() => {
    if (window.confirm('Are you sure you want to reset all your progress? This action cannot be undone.')) {
      setUserProgress({
        learnedWords: [],
        bookmarkedWords: [],
        lastStudied: 0,
        studySessions: 0,
        quizScores: [],
        streak: 0
      });
      setShowAnswer({});
      setCurrentStudyIndex(0);
      setTodayProgress(0);
      setIsShuffled(false);
      setAnimationKey(prev => prev + 1);
      
      // Show confirmation
      alert('Progress has been reset successfully!');
    }
  }, []);

  const shuffleVocabulary = useCallback(() => {
    const currentVocab = getCurrentVocabulary();
    if (currentVocab.length === 0) return;
    
    if (isShuffled) {
      // Turn off shuffle and restore original order
      setIsShuffled(false);
    } else {
      // Turn on shuffle
      setIsShuffled(true);
      const newShuffled = [...currentVocab].sort(() => Math.random() - 0.5);
      setShuffledVocabulary(newShuffled);
      setCurrentStudyIndex(0);
    }
    
    setAnimationKey(prev => prev + 1);
    setShowAnswer(prev => ({ 
      ...prev, 
      [currentStudyWord?.word]: false 
    }));
  }, [isShuffled, getCurrentVocabulary, currentStudyWord]);

  const goToNextWord = useCallback(() => {
    const currentVocab = getCurrentVocabulary();
    if (currentVocab.length > 0) {
      const newIndex = (currentStudyIndex + 1) % currentVocab.length;
      setCurrentStudyIndex(newIndex);
      setShowAnswer(prev => ({ 
        ...prev, 
        [currentVocab[currentStudyIndex]?.word]: false 
      }));
      setAnimationKey(prev => prev + 1);
    }
  }, [getCurrentVocabulary, currentStudyIndex]);

  const goToPrevWord = useCallback(() => {
    const currentVocab = getCurrentVocabulary();
    if (currentVocab.length > 0) {
      const newIndex = (currentStudyIndex - 1 + currentVocab.length) % currentVocab.length;
      setCurrentStudyIndex(newIndex);
      setShowAnswer(prev => ({ 
        ...prev, 
        [currentVocab[currentStudyIndex]?.word]: false 
      }));
      setAnimationKey(prev => prev + 1);
    }
  }, [getCurrentVocabulary, currentStudyIndex]);

  const speakWord = useCallback((text: string, lang: string = 'ja-JP') => {
    if ('speechSynthesis' in window && speechEnabled && text && speechSynthesisRef.current) {
      speechSynthesisRef.current.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;
      utterance.rate = volume;
      utterance.volume = volume;
      utterance.pitch = 1;
      speechSynthesisRef.current.speak(utterance);
    }
  }, [speechEnabled, volume]);

  const flipCard = useCallback((word: string) => {
    if (!word || isFlipping) return;
    toggleShowAnswer(word);
    if (speechEnabled && !showAnswer[word]) {
      speakWord(word);
    }
  }, [toggleShowAnswer, speakWord, speechEnabled, showAnswer, isFlipping]);

  const exportProgress = useCallback(() => {
    try {
      const dataStr = JSON.stringify(userProgress, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
      const exportFileDefaultName = `n5-vocabulary-progress-${new Date().toISOString().split('T')[0]}.json`;
      
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      document.body.appendChild(linkElement);
      linkElement.click();
      document.body.removeChild(linkElement);
      
      // Show success message
      alert('Progress exported successfully!');
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
          if (progress && typeof progress === 'object') {
            setUserProgress(progress);
            setTodayProgress(0);
            alert('Progress imported successfully! Your data has been loaded.');
          } else {
            alert('Invalid progress file format. Please select a valid export file.');
          }
        } catch (error) {
          console.error('Import error:', error);
          alert('Error importing progress. Please check the file format.');
        }
      };
      
      reader.readAsText(file);
    };
    
    input.click();
  }, []);

  // Generate quiz questions
  const generateQuiz = useCallback((count: number = 10) => {
    if (!vocabulary || vocabulary.length === 0) return [];
    
    const questions: QuizQuestion[] = [];
    const selectedWords = [...vocabulary]
      .sort(() => Math.random() - 0.5)
      .slice(0, Math.min(count, vocabulary.length));
    
    selectedWords.forEach(word => {
      if (!word) return;
      
      const type: 'meaning' | 'word' = Math.random() > 0.5 ? 'meaning' : 'word';
      let question = '';
      let correctAnswer = '';
      let options: string[] = [];
      
      if (type === 'meaning') {
        question = `What is the meaning of "${word.word}"?`;
        correctAnswer = word.meaning;
        // Get 3 random meanings from other words
        const otherMeanings = vocabulary
          .filter(v => v.meaning !== word.meaning)
          .map(v => v.meaning)
          .sort(() => Math.random() - 0.5)
          .slice(0, 3);
        options = [word.meaning, ...otherMeanings].sort(() => Math.random() - 0.5);
      } else {
        question = `Which word means "${word.meaning}"?`;
        correctAnswer = word.word;
        // Get 3 random words
        const otherWords = vocabulary
          .filter(v => v.word !== word.word)
          .map(v => v.word)
          .sort(() => Math.random() - 0.5)
          .slice(0, 3);
        options = [word.word, ...otherWords].sort(() => Math.random() - 0.5);
      }
      
      if (options.length === 4) {
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
  }, [vocabulary]);

  // Start quiz
  const startQuiz = useCallback((mode: 'practice' | 'timed' = 'practice') => {
    const questions = generateQuiz(10);
    if (questions.length > 0) {
      setQuizMode(mode);
      setQuizQuestions(questions);
      setQuizActive(true);
      setCurrentQuestion(0);
      setQuizScore(0);
      setSelectedAnswer(null);
      setQuizTimeLeft(mode === 'timed' ? 60 : 0);
      setQuizTimerActive(mode === 'timed');
      setShowQuizResults(false);
      setMobileMenuOpen(false);
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
      mode: quizMode
    };
    
    setUserProgress(prev => ({
      ...prev,
      quizScores: [...prev.quizScores, scoreData]
    }));
    
    setQuizTimerActive(false);
    setShowQuizResults(true);
  }, [quizScore, quizQuestions, quizMode]);

  // Jump to word in list
  const jumpToWord = useCallback((word: string) => {
    const currentVocab = getCurrentVocabulary();
    const index = currentVocab.findIndex(item => item.word === word);
    if (index !== -1) {
      setCurrentStudyIndex(index);
      setShowAnswer(prev => ({ ...prev, [word]: false }));
      setAnimationKey(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [getCurrentVocabulary]);

  // Copy word to clipboard
  const copyToClipboard = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      // You could add a toast notification here
      alert('Copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  }, []);

  // Quiz Component
  const QuizComponent = () => {
    if (!quizActive) return null;

    const currentQuizQuestion = quizQuestions[currentQuestion];
    if (!currentQuizQuestion) return null;

    const isCorrect = selectedAnswer === currentQuizQuestion.correctAnswer;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
        <div className="max-w-2xl w-full rounded-2xl overflow-hidden bg-gradient-to-br from-white to-gray-50 shadow-2xl border border-gray-200">
          <div className="p-6 bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <Brain size={24} />
                  Quiz Time! 🎯
                </h2>
                <p className="text-blue-100">{quizMode.charAt(0).toUpperCase() + quizMode.slice(1)} Mode • {quizQuestions.length} questions</p>
              </div>
              <div className="flex items-center gap-4">
                {quizTimerActive && (
                  <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm">
                    <Timer size={18} />
                    <span className="font-bold">{quizTimeLeft}s</span>
                  </div>
                )}
                <div className="text-center px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm">
                  <div className="text-xl font-bold">{quizScore}</div>
                  <div className="text-sm text-blue-100">Score</div>
                </div>
                <button
                  onClick={() => {
                    if (window.confirm('Are you sure you want to quit the quiz?')) {
                      setQuizActive(false);
                    }
                  }}
                  className="p-2 hover:bg-white/20 rounded-xl transition-colors"
                >
                  <XIcon size={24} className="text-white" />
                </button>
              </div>
            </div>
            
            {/* Progress bar */}
            <div className="relative pt-1">
              <div className="overflow-hidden h-3 rounded-full bg-white/20">
                <div 
                  className="h-3 rounded-full bg-gradient-to-r from-emerald-400 to-green-400 transition-all duration-500 ease-out"
                  style={{ width: `${((currentQuestion + 1) / quizQuestions.length) * 100}%` }}
                />
              </div>
              <div className="flex justify-between text-sm mt-2">
                <span className="text-blue-100">Question {currentQuestion + 1} of {quizQuestions.length}</span>
                <span className="font-bold">{Math.round(((currentQuestion + 1) / quizQuestions.length) * 100)}%</span>
              </div>
            </div>
          </div>
          
          <div className="p-8">
            {/* Question */}
            <div className="mb-8">
              <div className="text-2xl font-bold mb-6 text-gray-800 bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-gray-100">
                {currentQuizQuestion.question}
              </div>
            </div>
            
            {/* Options */}
            <div className="grid grid-cols-1 gap-3">
              {currentQuizQuestion.options.map((option, index) => {
                const isCorrectOption = option === currentQuizQuestion.correctAnswer;
                const isSelected = selectedAnswer === option;
                let buttonClass = 'hover:scale-[1.02] transition-transform duration-200 ';
                
                if (selectedAnswer !== null) {
                  if (isCorrectOption) {
                    buttonClass += 'bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300 text-green-800 shadow-lg scale-105';
                  } else if (isSelected) {
                    buttonClass += 'bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-300 text-red-800';
                  } else {
                    buttonClass += 'bg-gray-50 text-gray-600 opacity-75';
                  }
                } else {
                  buttonClass += 'bg-white hover:bg-gray-50 border-2 border-gray-200 hover:border-blue-300 text-gray-700 shadow-sm';
                }
                
                return (
                  <button
                    key={index}
                    onClick={() => handleQuizAnswer(option)}
                    disabled={selectedAnswer !== null}
                    className={`p-5 rounded-xl text-left transition-all duration-200 ${buttonClass}`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 ${
                        selectedAnswer === null 
                          ? 'bg-gradient-to-br from-gray-100 to-gray-200 text-gray-600' 
                          : isCorrectOption 
                            ? 'bg-gradient-to-br from-green-500 to-emerald-500 text-white shadow-lg' 
                            : isSelected 
                              ? 'bg-gradient-to-br from-red-500 to-pink-500 text-white' 
                              : 'bg-gray-200 text-gray-500'
                      }`}>
                        <span className="font-bold text-lg">{String.fromCharCode(65 + index)}</span>
                      </div>
                      <span className="font-medium text-lg">{option}</span>
                    </div>
                  </button>
                );
              })}
            </div>
            
            {/* Feedback */}
            {selectedAnswer !== null && (
              <div className={`mt-6 p-5 rounded-xl animate-fadeIn ${
                isCorrect
                  ? 'bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200'
                  : 'bg-gradient-to-r from-red-50 to-pink-50 border border-red-200'
              }`}>
                <div className="flex items-center gap-4">
                  {isCorrect ? (
                    <>
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center shadow-lg">
                        <Check size={28} className="text-white" />
                      </div>
                      <div>
                        <h4 className="font-bold text-xl text-green-800">Correct! 🎉</h4>
                        <p className="text-green-600">Excellent! You're getting better!</p>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-pink-500 flex items-center justify-center shadow-lg">
                        <XIcon size={28} className="text-white" />
                      </div>
                      <div>
                        <h4 className="font-bold text-xl text-red-800">Not quite right</h4>
                        <p className="text-red-600">
                          Correct answer: <span className="font-bold">{currentQuizQuestion.correctAnswer}</span>
                        </p>
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
                  className="mt-5 w-full py-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl font-bold hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02]"
                >
                  <div className="flex items-center justify-center gap-2">
                    {currentQuestion < quizQuestions.length - 1 ? (
                      <>
                        <span>Next Question</span>
                        <ArrowRight size={20} />
                      </>
                    ) : (
                      <>
                        <span>Finish Quiz</span>
                        <Trophy size={20} />
                      </>
                    )}
                  </div>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Quiz Results Component
  const QuizResults = () => {
    if (!showQuizResults) return null;

    const accuracy = quizQuestions.length > 0 ? Math.round((quizScore / quizQuestions.length) * 100) : 0;
    const performance = accuracy >= 90 ? 'Excellent! 🌟' : 
                       accuracy >= 70 ? 'Good Job! 👍' : 
                       accuracy >= 50 ? 'Keep Practicing! 📚' : 'Need More Practice 💪';

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
        <div className="max-w-md w-full rounded-2xl overflow-hidden bg-gradient-to-br from-white to-gray-50 shadow-2xl border border-gray-200">
          <div className="p-8 text-center bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 mb-6 shadow-lg animate-pulse">
              <Trophy size={36} className="text-white" />
            </div>
            
            <h2 className="text-3xl font-bold mb-2">
              Quiz Complete!
            </h2>
            <p className="text-blue-100 mb-6">{performance}</p>
            
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="p-4 rounded-xl bg-white/20 backdrop-blur-sm">
                <div className="text-3xl font-bold">
                  {quizScore}/{quizQuestions.length}
                </div>
                <div className="text-sm text-blue-100">Score</div>
              </div>
              
              <div className="p-4 rounded-xl bg-white/20 backdrop-blur-sm">
                <div className="text-3xl font-bold">
                  {accuracy}%
                </div>
                <div className="text-sm text-blue-100">Accuracy</div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => {
                  setShowQuizResults(false);
                  setQuizActive(false);
                }}
                className="flex-1 py-3 bg-white/20 backdrop-blur-sm text-white rounded-xl font-bold hover:bg-white/30 transition-all duration-200"
              >
                Back to Study
              </button>
              
              <button
                onClick={() => {
                  setShowQuizResults(false);
                  startQuiz(quizMode);
                }}
                className="flex-1 py-3 bg-gradient-to-r from-emerald-500 to-green-500 text-white rounded-xl font-bold hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02]"
              >
                Try Again
              </button>
            </div>
          </div>
          
          <div className="p-6 text-center">
            <div className="text-sm text-gray-600">
              You've completed {userProgress.quizScores.length} quizzes
            </div>
            {userProgress.quizScores.length > 0 && (
              <div className="text-sm text-gray-600 mt-2">
                Best score: {Math.max(...userProgress.quizScores.map(s => s.score))}/{userProgress.quizScores[0]?.total || 10}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Streak Notification
  const StreakNotification = () => {
    if (!showStreakNotification || userProgress.streak < 5) return null;

    return (
      <div className="fixed top-4 right-4 z-50 animate-slideIn">
        <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-4 rounded-xl shadow-xl flex items-center gap-3">
          <Flame className="animate-pulse" />
          <div>
            <div className="font-bold">🔥 {userProgress.streak} Day Streak!</div>
            <div className="text-sm text-orange-100">Keep up the great work!</div>
          </div>
          <button onClick={() => setShowStreakNotification(false)} className="ml-4">
            <XIcon size={18} />
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 text-gray-800">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 hover:bg-gray-100 rounded-xl transition-colors lg:hidden"
              >
                <Menu size={24} className="text-gray-600" />
              </button>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
                    <span className="text-white font-bold text-xl">N5</span>
                  </div>
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-br from-emerald-500 to-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">{vocabulary.length}</span>
                  </div>
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    Japanese N5 Vocabulary
                  </h1>
                  <p className="text-sm text-gray-600 flex items-center gap-1">
                    <Target size={14} />
                    {stats.learnedWords} mastered • {stats.bookmarkedWords} bookmarked
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={() => startQuiz('practice')}
                className="px-5 py-2.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-bold hover:shadow-xl transition-all duration-200 flex items-center gap-2 hover:scale-105"
              >
                <Brain size={18} />
                <span>Start Quiz</span>
              </button>
              
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                title="Toggle theme"
              >
                {darkMode ? <Sun size={20} className="text-gray-600" /> : <Moon size={20} className="text-gray-600" />}
              </button>

              <button
                onClick={() => setShowSettings(!showSettings)}
                className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                title="Settings"
              >
                <Settings size={20} className="text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-30 pt-20 bg-white/95 backdrop-blur-sm lg:hidden animate-fadeIn">
          <div className="p-6 space-y-2">
            {[
              { id: 'all', icon: Home, label: 'All Words', count: vocabulary.length, color: 'blue' },
              { id: 'unlearned', icon: Target, label: 'To Learn', count: vocabulary.length - userProgress.learnedWords.length, color: 'red' },
              { id: 'bookmarked', icon: Star, label: 'Bookmarked', count: userProgress.bookmarkedWords.length, color: 'amber' },
              { id: 'learned', icon: Award, label: 'Mastered', count: userProgress.learnedWords.length, color: 'green' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setSelectedTab(tab.id as any);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center justify-between p-5 rounded-xl transition-all duration-200 ${
                  selectedTab === tab.id
                    ? `bg-gradient-to-r from-${tab.color}-500 to-${tab.color}-600 text-white shadow-lg`
                    : 'hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center gap-4">
                  <tab.icon size={24} />
                  <div className="text-left">
                    <span className="font-bold text-lg">{tab.label}</span>
                    <p className="text-sm opacity-90">{tab.count} words</p>
                  </div>
                </div>
                <ChevronRight className={selectedTab === tab.id ? 'text-white/90' : 'text-gray-400'} />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Settings Panel */}
      {showSettings && (
        <div className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="max-w-md w-full rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-800">Settings</h3>
              <button onClick={() => setShowSettings(false)}>
                <XIcon size={24} className="text-gray-500 hover:text-gray-700" />
              </button>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Daily Goal</label>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min="5"
                    max="50"
                    step="5"
                    value={dailyGoal}
                    onChange={(e) => setDailyGoal(Number(e.target.value))}
                    className="flex-1"
                  />
                  <span className="font-bold text-lg text-blue-600">{dailyGoal} words</span>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Speech Volume</label>
                <div className="flex items-center gap-4">
                  <VolumeX size={20} className="text-gray-500" />
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={volume}
                    onChange={(e) => setVolume(Number(e.target.value))}
                    className="flex-1"
                  />
                  <Volume2 size={20} className="text-gray-500" />
                  <span className="font-bold text-lg text-blue-600">{Math.round(volume * 100)}%</span>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Auto-play Speed</label>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-600">Slow</span>
                  <input
                    type="range"
                    min="1000"
                    max="10000"
                    step="1000"
                    value={studySpeed}
                    onChange={(e) => setStudySpeed(Number(e.target.value))}
                    className="flex-1"
                  />
                  <span className="text-sm text-gray-600">Fast</span>
                  <span className="font-bold text-lg text-blue-600">{studySpeed/1000}s</span>
                </div>
              </div>
              
              <div className="pt-4 border-t border-gray-200">
                <button
                  onClick={() => {
                    setShowSettings(false);
                    resetProgress();
                  }}
                  className="w-full py-3 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-xl font-bold hover:shadow-xl transition-all duration-200"
                >
                  Reset All Progress
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Stats Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="rounded-2xl p-5 bg-gradient-to-br from-white to-gray-50 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
                  <Target size={24} className="text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-700">Progress</h3>
                  <p className="text-sm text-gray-600">N5 Mastery</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-blue-600">{stats.progressPercentage}%</div>
              </div>
            </div>
            <div className="mt-4">
              <div className="overflow-hidden h-3 rounded-full bg-gray-200">
                <div 
                  className="h-3 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-1000 ease-out"
                  style={{ width: `${stats.progressPercentage}%` }}
                />
              </div>
            </div>
          </div>
          
          <div className="rounded-2xl p-5 bg-gradient-to-br from-white to-gray-50 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg">
                <CheckCircle size={24} className="text-white" />
              </div>
              <div>
                <div className="text-sm text-gray-600">Mastered</div>
                <div className="text-3xl font-bold text-green-600">{stats.learnedWords}</div>
                <div className="text-xs text-gray-500">{stats.todayProgress} today</div>
              </div>
            </div>
          </div>
          
          <div className="rounded-2xl p-5 bg-gradient-to-br from-white to-gray-50 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-500 to-amber-600 flex items-center justify-center shadow-lg">
                <Star size={24} className="text-white" />
              </div>
              <div>
                <div className="text-sm text-gray-600">Bookmarks</div>
                <div className="text-3xl font-bold text-amber-600">{stats.bookmarkedWords}</div>
                <div className="text-xs text-gray-500">Favorites</div>
              </div>
            </div>
          </div>
          
          <div className="rounded-2xl p-5 bg-gradient-to-br from-white to-gray-50 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center shadow-lg">
                <Flame size={24} className="text-white" />
              </div>
              <div>
                <div className="text-sm text-gray-600">Streak</div>
                <div className="text-3xl font-bold text-orange-600">{stats.streak} days</div>
                <div className="text-xs text-gray-500 flex items-center gap-1">
                  <Calendar size={12} />
                  Keep going!
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Study Area */}
          <div className="lg:col-span-2 space-y-8">
            {/* Study Card */}
            <div key={animationKey} className="rounded-2xl overflow-hidden bg-gradient-to-br from-white to-gray-50 shadow-xl border border-gray-100 transform transition-all duration-300 hover:shadow-2xl">
              <div className="p-6 bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                      <BookOpen size={28} className="text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold">Study Mode</h2>
                      <p className="text-blue-100">
                        {isShuffled ? '🔀 Shuffled • ' : ''}
                        Word {currentStudyIndex + 1} of {getCurrentVocabulary().length}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => speakWord(currentStudyWord?.word || '')}
                      className="p-2 rounded-xl bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm transition-colors"
                      title="Listen"
                    >
                      <Volume2 size={22} />
                    </button>
                    <button
                      onClick={shuffleVocabulary}
                      className={`p-2 rounded-xl backdrop-blur-sm transition-all duration-300 ${
                        isShuffled 
                          ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg' 
                          : 'bg-white/20 text-white hover:bg-white/30'
                      }`}
                      title={isShuffled ? "Turn off shuffle" : "Shuffle words"}
                    >
                      <Shuffle size={22} />
                    </button>
                  </div>
                </div>
              </div>
              
              {currentStudyWord ? (
                <>
                  {/* Word Display */}
                  <div className="p-8 text-center">
                    <div className="mb-8">
                      <div className={`text-7xl font-bold mb-6 text-gray-800 transition-all duration-300 ${isFlipping ? 'scale-95 opacity-80' : 'scale-100 opacity-100'}`}>
                        {currentStudyWord.word}
                      </div>
                      
                      <div className="space-y-3">
                        {showFurigana && (
                          <div className="text-2xl text-gray-600 font-medium">
                            {currentStudyWord.furigana}
                          </div>
                        )}
                        {showRomaji && (
                          <div className="text-xl text-gray-500 italic">
                            {currentStudyWord.romaji}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Answer Section */}
                    {showAnswer[currentStudyWord.word] ? (
                      <div className={`animate-fadeIn ${isFlipping ? 'opacity-80' : 'opacity-100'}`}>
                        <div className="text-4xl font-bold mb-8 text-green-600 bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-2xl border border-green-200">
                          {currentStudyWord.meaning}
                        </div>
                        {currentStudyWord.example && (
                          <div className="p-5 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100">
                            <div className="text-sm font-semibold text-gray-600 mb-3 flex items-center gap-2">
                              <Sparkles size={16} />
                              Example Sentence
                            </div>
                            <div className="text-xl text-gray-700 mb-3">{currentStudyWord.example}</div>
                            <div className="text-sm text-gray-500">
                              Practice reading this sentence aloud!
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <button
                        onClick={() => flipCard(currentStudyWord.word)}
                        className="px-10 py-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold rounded-xl hover:shadow-2xl transition-all duration-200 transform hover:scale-105 active:scale-95"
                      >
                        <div className="flex items-center justify-center gap-3">
                          <Eye size={24} />
                          <span className="text-lg">Reveal Meaning</span>
                        </div>
                      </button>
                    )}
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="p-6 border-t border-gray-100 bg-gray-50/50">
                    {/* Navigation */}
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <button
                        onClick={goToPrevWord}
                        className="flex items-center justify-center gap-3 py-4 rounded-xl bg-white text-gray-700 hover:bg-gray-50 transition-all duration-200 border border-gray-200 hover:border-blue-300 disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={currentStudyIndex === 0}
                      >
                        <ArrowLeft size={22} />
                        <span className="font-bold">Previous</span>
                      </button>
                      
                      <button
                        onClick={goToNextWord}
                        className="flex items-center justify-center gap-3 py-4 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02]"
                      >
                        <span className="font-bold">Next</span>
                        <ArrowRight size={22} />
                      </button>
                    </div>
                    
                    {/* Word Actions */}
                    <div className="grid grid-cols-2 gap-4">
                      <button
                        onClick={() => toggleBookmark(currentStudyWord.word)}
                        className={`flex items-center justify-center gap-3 py-4 rounded-xl transition-all duration-200 ${
                          userProgress.bookmarkedWords.includes(currentStudyWord.word)
                            ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg'
                            : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 hover:border-amber-300'
                        }`}
                      >
                        <Star size={22} fill={userProgress.bookmarkedWords.includes(currentStudyWord.word) ? 'currentColor' : 'none'} />
                        <span className="font-bold">
                          {userProgress.bookmarkedWords.includes(currentStudyWord.word) ? 'Bookmarked' : 'Bookmark'}
                        </span>
                      </button>
                      
                      <button
                        onClick={() => toggleLearned(currentStudyWord.word)}
                        className={`flex items-center justify-center gap-3 py-4 rounded-xl transition-all duration-200 ${
                          userProgress.learnedWords.includes(currentStudyWord.word)
                            ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg'
                            : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 hover:border-green-300'
                        }`}
                      >
                        {userProgress.learnedWords.includes(currentStudyWord.word) ? (
                          <CheckCircle size={22} />
                        ) : (
                          <Circle size={22} />
                        )}
                        <span className="font-bold">
                          {userProgress.learnedWords.includes(currentStudyWord.word) ? 'Mastered' : 'Mark Learned'}
                        </span>
                      </button>
                    </div>
                    
                    {/* Auto-play Toggle */}
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <button
                        onClick={() => setAutoPlay(!autoPlay)}
                        className={`w-full flex items-center justify-center gap-3 py-3 rounded-xl transition-all duration-200 ${
                          autoPlay
                            ? 'bg-gradient-to-r from-emerald-500 to-green-500 text-white shadow-lg'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {autoPlay ? <Pause size={20} /> : <Play size={20} />}
                        <span className="font-bold">
                          {autoPlay ? 'Auto-play: ON' : 'Auto-play: OFF'}
                        </span>
                        {autoPlay && (
                          <span className="text-sm opacity-90">{studySpeed/1000}s per word</span>
                        )}
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="p-12 text-center">
                  <Search className="w-20 h-20 mx-auto mb-6 text-gray-300" />
                  <h3 className="text-2xl font-bold mb-3 text-gray-700">No words found</h3>
                  <p className="text-gray-500 mb-6">Try changing your filters or search terms</p>
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      setSelectedTab('all');
                    }}
                    className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl font-bold hover:shadow-xl transition-all duration-200"
                  >
                    Show All Words
                  </button>
                </div>
              )}
            </div>
            
            {/* Vocabulary List */}
            <div className="rounded-2xl overflow-hidden bg-gradient-to-br from-white to-gray-50 shadow-lg border border-gray-100">
              <div className="p-6 bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                      <List size={28} className="text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold">Vocabulary List</h3>
                      <p className="text-blue-100">
                        {filteredVocabulary.length} words • {selectedTab}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1 sm:w-72">
                      <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                      <input
                        type="text"
                        placeholder="Search words, meanings, or readings..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 rounded-xl border-0 bg-white/20 backdrop-blur-sm text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-white/50 focus:bg-white/30 transition-all"
                      />
                      {searchTerm && (
                        <button
                          onClick={() => setSearchTerm('')}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-200 hover:text-white"
                        >
                          <XIcon size={18} />
                        </button>
                      )}
                    </div>
                    
                    <div className="flex gap-2">
                      {[
                        { id: 'all', label: 'All', color: 'blue' },
                        { id: 'unlearned', label: 'To Learn', color: 'red' },
                        { id: 'bookmarked', label: 'Bookmarked', color: 'amber' },
                        { id: 'learned', label: 'Mastered', color: 'green' }
                      ].map((tab) => (
                        <button
                          key={tab.id}
                          onClick={() => setSelectedTab(tab.id as any)}
                          className={`px-4 py-2.5 rounded-xl font-bold transition-all duration-200 ${
                            selectedTab === tab.id
                              ? `bg-gradient-to-r from-${tab.color}-500 to-${tab.color}-600 text-white shadow-lg`
                              : 'bg-white/20 text-white hover:bg-white/30'
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
                <div className="overflow-y-auto max-h-[500px]">
                  {filteredVocabulary.length === 0 ? (
                    <div className="p-12 text-center">
                      <Search className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                      <h3 className="text-xl font-bold mb-2 text-gray-700">No words match your filters</h3>
                      <p className="text-gray-500">Try a different search term or category</p>
                    </div>
                  ) : (
                    filteredVocabulary.map((item, index) => (
                      <div
                        key={`${item.word}-${index}`}
                        className="p-5 border-b border-gray-100 hover:bg-gray-50/50 transition-all duration-200 group"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-start gap-5">
                            <div className="flex-shrink-0">
                              <div className="text-3xl font-bold text-gray-800">
                                {item.word}
                              </div>
                              <div className="flex items-center gap-2 mt-2">
                                {showFurigana && (
                                  <span className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">
                                    {item.furigana}
                                  </span>
                                )}
                                {showRomaji && (
                                  <span className="text-sm text-gray-500 italic bg-gray-50 px-2 py-1 rounded">
                                    {item.romaji}
                                  </span>
                                )}
                              </div>
                            </div>
                            
                            <div>
                              <div className="flex items-center gap-3 mb-2">
                                <div className="text-xl font-bold text-gray-700">{item.meaning}</div>
                                {userProgress.learnedWords.includes(item.word) && (
                                  <span className="text-xs font-bold bg-gradient-to-r from-green-500 to-emerald-500 text-white px-2 py-1 rounded-full">
                                    MASTERED
                                  </span>
                                )}
                                {userProgress.bookmarkedWords.includes(item.word) && (
                                  <span className="text-xs font-bold bg-gradient-to-r from-amber-500 to-orange-500 text-white px-2 py-1 rounded-full">
                                    BOOKMARKED
                                  </span>
                                )}
                              </div>
                              {item.example && (
                                <div className="mt-3 p-3 rounded-lg bg-blue-50 border border-blue-100">
                                  <div className="text-sm text-gray-600 mb-1">Example:</div>
                                  <div className="text-gray-700">{item.example}</div>
                                </div>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => speakWord(item.word)}
                              className="p-2 rounded-lg text-gray-400 hover:text-blue-500 hover:bg-blue-50 transition-colors"
                              title="Listen"
                            >
                              <Volume2 size={18} />
                            </button>
                            <button
                              onClick={() => jumpToWord(item.word)}
                              className="p-2 rounded-lg text-gray-400 hover:text-green-500 hover:bg-green-50 transition-colors"
                              title="Study this word"
                            >
                              <Sparkles size={18} />
                            </button>
                            <button
                              onClick={() => toggleBookmark(item.word)}
                              className={`p-2 rounded-lg transition-colors ${
                                userProgress.bookmarkedWords.includes(item.word)
                                  ? 'text-amber-500 bg-amber-50'
                                  : 'text-gray-400 hover:text-amber-500 hover:bg-amber-50'
                              }`}
                              title={userProgress.bookmarkedWords.includes(item.word) ? "Remove bookmark" : "Bookmark"}
                            >
                              <Star size={18} fill={userProgress.bookmarkedWords.includes(item.word) ? 'currentColor' : 'none'} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
          
          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Daily Progress */}
            <div className="rounded-2xl p-6 bg-gradient-to-br from-white to-gray-50 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <Target className="text-blue-500" size={28} />
                  <div>
                    <h3 className="font-bold text-gray-700 text-lg">Daily Progress</h3>
                    <p className="text-sm text-gray-600">{stats.todayProgress} words studied today</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-blue-600">
                    {Math.round((stats.todayProgress / dailyGoal) * 100)}%
                  </div>
                </div>
              </div>
              
              <div className="mb-6">
                <div className="w-full rounded-full h-4 bg-gray-200">
                  <div 
                    className="h-4 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-1000 ease-out"
                    style={{ width: `${Math.min(100, (stats.todayProgress / dailyGoal) * 100)}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-sm text-gray-600 mt-2">
                  <span>Daily Goal: {dailyGoal} words</span>
                  <span className="font-bold">{stats.todayProgress} / {dailyGoal}</span>
                </div>
              </div>
              
              <button
                onClick={() => {
                  const unlearned = vocabulary.filter(w => !userProgress.learnedWords.includes(w.word));
                  if (unlearned.length > 0) {
                    const randomWord = unlearned[Math.floor(Math.random() * unlearned.length)];
                    jumpToWord(randomWord.word);
                  }
                }}
                className="w-full py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl font-bold hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02]"
              >
                Study Random Word
              </button>
            </div>
            
            {/* Practice Modes */}
            <div className="rounded-2xl p-6 bg-gradient-to-br from-white to-gray-50 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg">
                  <Brain size={28} className="text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-700 text-lg">Practice Modes</h3>
                  <p className="text-sm text-gray-600">Test your knowledge</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <button
                  onClick={() => startQuiz('practice')}
                  className="w-full flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-600 hover:shadow-lg transition-all duration-200 group border border-blue-100 hover:border-blue-300"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center">
                      <HelpCircle size={22} className="text-white" />
                    </div>
                    <div className="text-left">
                      <div className="font-bold text-lg">Practice Quiz</div>
                      <div className="text-sm opacity-75">10 questions • No time limit</div>
                    </div>
                  </div>
                  <ChevronRight className="opacity-50 group-hover:opacity-100 group-hover:translate-x-2 transition-all" />
                </button>
                
                <button
                  onClick={() => startQuiz('timed')}
                  className="w-full flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-purple-50 to-pink-50 text-purple-600 hover:shadow-lg transition-all duration-200 group border border-purple-100 hover:border-purple-300"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                      <Timer size={22} className="text-white" />
                    </div>
                    <div className="text-left">
                      <div className="font-bold text-lg">Timed Challenge</div>
                      <div className="text-sm opacity-75">60 seconds • Race against time</div>
                    </div>
                  </div>
                  <ChevronRight className="opacity-50 group-hover:opacity-100 group-hover:translate-x-2 transition-all" />
                </button>
              </div>
            </div>
            
            {/* Quick Settings */}
            <div className="rounded-2xl p-6 bg-gradient-to-br from-white to-gray-50 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center gap-3 mb-6">
                <Settings className="text-gray-600" size={28} />
                <div>
                  <h3 className="font-bold text-gray-700 text-lg">Quick Settings</h3>
                  <p className="text-sm text-gray-600">Customize your study</p>
                </div>
              </div>
              
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center">
                      <Eye size={22} className="text-white" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-700">Furigana</div>
                      <div className="text-sm text-gray-500">Japanese reading</div>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowFurigana(!showFurigana)}
                    className={`w-14 h-7 rounded-full relative transition-all duration-300 ${
                      showFurigana ? 'bg-gradient-to-r from-blue-500 to-indigo-500' : 'bg-gray-300'
                    }`}
                  >
                    <div className={`absolute top-1 w-5 h-5 rounded-full bg-white transition-all duration-300 shadow-lg ${
                      showFurigana ? 'right-1' : 'left-1'
                    }`}></div>
                  </button>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center">
                      <Sparkles size={22} className="text-white" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-700">Romaji</div>
                      <div className="text-sm text-gray-500">Romanized text</div>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowRomaji(!showRomaji)}
                    className={`w-14 h-7 rounded-full relative transition-all duration-300 ${
                      showRomaji ? 'bg-gradient-to-r from-green-500 to-emerald-500' : 'bg-gray-300'
                    }`}
                  >
                    <div className={`absolute top-1 w-5 h-5 rounded-full bg-white transition-all duration-300 shadow-lg ${
                      showRomaji ? 'right-1' : 'left-1'
                    }`}></div>
                  </button>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                      <Volume2 size={22} className="text-white" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-700">Speech</div>
                      <div className="text-sm text-gray-500">Audio pronunciation</div>
                    </div>
                  </div>
                  <button
                    onClick={() => setSpeechEnabled(!speechEnabled)}
                    className={`w-14 h-7 rounded-full relative transition-all duration-300 ${
                      speechEnabled ? 'bg-gradient-to-r from-purple-500 to-pink-500' : 'bg-gray-300'
                    }`}
                  >
                    <div className={`absolute top-1 w-5 h-5 rounded-full bg-white transition-all duration-300 shadow-lg ${
                      speechEnabled ? 'right-1' : 'left-1'
                    }`}></div>
                  </button>
                </div>
              </div>
            </div>
            
            {/* Data Management */}
            <div className="rounded-2xl p-6 bg-gradient-to-br from-white to-gray-50 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center gap-3 mb-6">
                <DownloadCloud className="text-gray-600" size={28} />
                <div>
                  <h3 className="font-bold text-gray-700 text-lg">Data Management</h3>
                  <p className="text-sm text-gray-600">Backup or restore your progress</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <button
                  onClick={exportProgress}
                  className="w-full flex items-center justify-center gap-3 py-3.5 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-600 hover:shadow-lg transition-all duration-200 border border-blue-100 hover:border-blue-300"
                >
                  <Download size={20} />
                  <span className="font-bold">Export Progress</span>
                </button>
                
                <button
                  onClick={importProgress}
                  className="w-full flex items-center justify-center gap-3 py-3.5 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 text-green-600 hover:shadow-lg transition-all duration-200 border border-green-100 hover:border-green-300"
                >
                  <Upload size={20} />
                  <span className="font-bold">Import Progress</span>
                </button>
                
                <button
                  onClick={resetProgress}
                  className="w-full flex items-center justify-center gap-3 py-3.5 rounded-xl bg-gradient-to-r from-red-50 to-pink-50 text-red-600 hover:shadow-lg transition-all duration-200 border border-red-100 hover:border-red-300"
                >
                  <RefreshCw size={20} />
                  <span className="font-bold">Reset Progress</span>
                </button>
              </div>
            </div>
            
            {/* Study Tips */}
            <div className="rounded-2xl p-6 bg-gradient-to-br from-amber-50 to-orange-50 shadow-lg border border-amber-100">
              <div className="flex items-center gap-3 mb-4">
                <Brain className="text-amber-600" size={28} />
                <div>
                  <h3 className="font-bold text-gray-700 text-lg">Study Tip</h3>
                  <p className="text-sm text-amber-600">Improve your learning</p>
                </div>
              </div>
              
              <div className="p-4 rounded-xl bg-white/50 border border-amber-200">
                <p className="text-gray-700 mb-3">
                  <span className="font-bold">Spaced Repetition:</span> Review words at increasing intervals to maximize memory retention.
                </p>
                <div className="text-sm text-amber-600 flex items-center gap-2">
                  <Zap size={14} />
                  <span>Study consistently for better results!</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <footer className="mt-12 pt-8 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                  <Brain className="text-white" size={24} />
                </div>
                <div>
                  <span className="font-bold text-xl text-gray-800">N5 Vocabulary Master</span>
                  <p className="text-sm text-gray-600">Track progress • Learn faster • Achieve mastery</p>
                </div>
              </div>
            </div>
            <div className="text-center md:text-right">
              <div className="text-sm text-gray-500 mb-2">
                Built with ❤️ for Japanese learners
              </div>
              <div className="text-xs text-gray-400">
                Version 1.0 • {new Date().getFullYear()}
              </div>
            </div>
          </div>
        </footer>
      </div>

      {/* Quiz Components */}
      <QuizComponent />
      <QuizResults />
      <StreakNotification />
    </div>
  );
};

export default N5VocabularyPage;