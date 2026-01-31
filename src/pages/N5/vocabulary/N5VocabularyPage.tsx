// N5VocabularyPage.tsx
import React, { useState, useEffect, useMemo, useCallback } from 'react';
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
  ChevronRight
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

  // Initialize filtered vocabulary
  useEffect(() => {
    const loadVocabularyData = async () => {
      try {
        // setIsLoading(true);
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
        // setIsLoading(false);
      }
    };
    loadVocabularyData();
  }, []);

  // Load user progress
  useEffect(() => {
    try {
      const savedProgress = localStorage.getItem('n5VocabularyProgress');
      if (savedProgress) {
        setUserProgress(JSON.parse(savedProgress));
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
    if (currentStudyIndex >= filtered.length) {
      setCurrentStudyIndex(0);
    }
  }, [searchTerm, selectedTab, vocabulary, userProgress, currentStudyIndex]);

  // Auto-play effect
  useEffect(() => {
    if (!autoPlay || !currentStudyWord) return;

    const timer = setTimeout(() => {
      goToNextWord();
    }, 3000);

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

  // Action functions
  const toggleBookmark = useCallback((word: string) => {
    setUserProgress(prev => {
      const isBookmarked = prev.bookmarkedWords.includes(word);
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
      const isLearned = prev.learnedWords.includes(word);
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
    if (window.confirm('Are you sure you want to reset all your progress?')) {
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
      const exportFileDefaultName = `n5-vocabulary-progress.json`;
      
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
          if (progress && typeof progress === 'object') {
            setUserProgress(progress);
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
    }, 1000);
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

  // Current study word
  const currentStudyWord = filteredVocabulary?.[currentStudyIndex];

  // Quiz Component
  const QuizComponent = () => {
    if (!quizActive) return null;

    const currentQuizQuestion = quizQuestions[currentQuestion];
    if (!currentQuizQuestion) return null;

    const isCorrect = selectedAnswer === currentQuizQuestion.correctAnswer;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
        <div className="max-w-2xl w-full rounded-2xl overflow-hidden bg-white shadow-2xl">
          <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">Quiz Time! 🎯</h2>
                <p className="text-gray-600">{quizMode.charAt(0).toUpperCase() + quizMode.slice(1)} Mode</p>
              </div>
              <div className="flex items-center gap-4">
                {quizTimerActive && (
                  <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white">
                    <Timer size={18} />
                    <span className="font-bold">{quizTimeLeft}s</span>
                  </div>
                )}
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-800">{quizScore}</div>
                  <div className="text-sm text-gray-600">Score</div>
                </div>
                <button
                  onClick={() => setQuizActive(false)}
                  className="p-2 hover:bg-gray-100 rounded-xl"
                >
                  <XIcon size={24} className="text-gray-600" />
                </button>
              </div>
            </div>
            
            <div className="relative pt-1">
              <div className="overflow-hidden h-2 rounded-full bg-gray-200">
                <div 
                  className="h-2 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 transition-all duration-300"
                  style={{ width: `${((currentQuestion + 1) / quizQuestions.length) * 100}%` }}
                />
              </div>
              <div className="flex justify-between text-sm mt-2 text-gray-600">
                <span>Question {currentQuestion + 1} of {quizQuestions.length}</span>
                <span>{Math.round(((currentQuestion + 1) / quizQuestions.length) * 100)}%</span>
              </div>
            </div>
          </div>
          
          <div className="p-8">
            <div className="mb-8">
              <div className="text-2xl font-bold mb-6 text-blue-600">
                {currentQuizQuestion.question}
              </div>
            </div>
            
            <div className="grid grid-cols-1 gap-3">
              {currentQuizQuestion.options.map((option, index) => {
                const isCorrectOption = option === currentQuizQuestion.correctAnswer;
                const isSelected = selectedAnswer === option;
                let buttonClass = '';
                
                if (selectedAnswer !== null) {
                  if (isCorrectOption) {
                    buttonClass = 'bg-green-100 border-green-300 text-green-800';
                  } else if (isSelected) {
                    buttonClass = 'bg-red-100 border-red-300 text-red-800';
                  } else {
                    buttonClass = 'bg-gray-50 text-gray-600 opacity-75';
                  }
                } else {
                  buttonClass = 'hover:bg-gray-50 hover:border-blue-300 text-gray-700';
                }
                
                return (
                  <button
                    key={index}
                    onClick={() => handleQuizAnswer(option)}
                    disabled={selectedAnswer !== null}
                    className={`p-4 rounded-xl border-2 border-gray-200 text-left transition-all duration-200 ${buttonClass}`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        selectedAnswer === null 
                          ? 'bg-gray-100 text-gray-600' 
                          : isCorrectOption ? 'bg-green-500 text-white' : isSelected ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-500'
                      }`}>
                        <span className="font-bold">{String.fromCharCode(65 + index)}</span>
                      </div>
                      <span className="font-medium">{option}</span>
                    </div>
                  </button>
                );
              })}
            </div>
            
            {selectedAnswer !== null && (
              <div className={`mt-6 p-4 rounded-xl ${
                isCorrect
                  ? 'bg-green-50 border border-green-200'
                  : 'bg-red-50 border border-red-200'
              }`}>
                <div className="flex items-center gap-3">
                  {isCorrect ? (
                    <>
                      <div className="w-10 h-10 rounded-lg bg-green-500 flex items-center justify-center">
                        <Check size={24} className="text-white" />
                      </div>
                      <div>
                        <h4 className="font-bold text-lg text-green-800">Correct! 🎉</h4>
                        <p className="text-green-600">Great job! You got it right!</p>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="w-10 h-10 rounded-lg bg-red-500 flex items-center justify-center">
                        <XIcon size={24} className="text-white" />
                      </div>
                      <div>
                        <h4 className="font-bold text-lg text-red-800">Not quite</h4>
                        <p className="text-red-600">Correct answer: {currentQuizQuestion.correctAnswer}</p>
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
                  className="mt-4 w-full py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-200"
                >
                  {currentQuestion < quizQuestions.length - 1 ? 'Next Question →' : 'Finish Quiz'}
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

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
        <div className="max-w-md w-full rounded-2xl overflow-hidden bg-white shadow-2xl">
          <div className="p-8 text-center bg-gradient-to-r from-blue-50 to-indigo-50">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-yellow-400 to-orange-400 mb-6">
              <Trophy size={32} className="text-white" />
            </div>
            
            <h2 className="text-2xl font-bold mb-4 text-gray-800">
              Quiz Complete!
            </h2>
            
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="p-4 rounded-xl bg-white/50">
                <div className="text-2xl font-bold text-blue-600">
                  {quizScore}
                </div>
                <div className="text-sm text-gray-600">Score</div>
              </div>
              
              <div className="p-4 rounded-xl bg-white/50">
                <div className="text-2xl font-bold text-green-600">
                  {accuracy}%
                </div>
                <div className="text-sm text-gray-600">Accuracy</div>
              </div>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowQuizResults(false);
                  setQuizActive(false);
                }}
                className="flex-1 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-all duration-200"
              >
                Back to Study
              </button>
              
              <button
                onClick={() => {
                  setShowQuizResults(false);
                  startQuiz(quizMode);
                }}
                className="flex-1 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-200"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 text-gray-800">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-sm border-b border-gray-100 shadow-sm">
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
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                    <span className="text-white font-bold">N5</span>
                  </div>
                </div>
                <div>
                  <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    Japanese N5 Vocabulary
                  </h1>
                  <p className="text-sm text-gray-600">{vocabulary.length} Essential Words</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={() => startQuiz('practice')}
                className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-200 flex items-center gap-2"
              >
                <Brain size={18} />
                <span>Quiz</span>
              </button>
              
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                title="Toggle theme"
              >
                {darkMode ? <Sun size={20} className="text-gray-600" /> : <Moon size={20} className="text-gray-600" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-30 pt-20 bg-white/95 backdrop-blur-sm lg:hidden">
          <div className="p-6 space-y-2">
            {[
              { id: 'all', icon: Home, label: 'All Words', count: vocabulary.length },
              { id: 'unlearned', icon: Target, label: 'To Learn', count: vocabulary.length - userProgress.learnedWords.length },
              { id: 'bookmarked', icon: Star, label: 'Bookmarked', count: userProgress.bookmarkedWords.length },
              { id: 'learned', icon: Award, label: 'Mastered', count: userProgress.learnedWords.length },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setSelectedTab(tab.id as any);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center justify-between p-4 rounded-xl transition-all duration-200 ${
                  selectedTab === tab.id
                    ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white'
                    : 'hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center gap-4">
                  <tab.icon size={22} />
                  <span className="font-medium">{tab.label}</span>
                </div>
                <span className={`font-bold ${
                  selectedTab === tab.id ? 'text-white/90' : 'text-gray-600'
                }`}>{tab.count}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Stats Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="rounded-xl p-4 bg-white shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                  <Target size={20} className="text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-700">Progress</h3>
                  <p className="text-sm text-gray-600">N5 Mastery</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-blue-600">{stats.progressPercentage}%</div>
              </div>
            </div>
            <div className="mt-4">
              <div className="overflow-hidden h-2 rounded-full bg-gray-200">
                <div 
                  className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-500"
                  style={{ width: `${stats.progressPercentage}%` }}
                />
              </div>
            </div>
          </div>
          
          <div className="rounded-xl p-4 bg-white shadow-sm border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                <CheckCircle size={20} className="text-white" />
              </div>
              <div>
                <div className="text-sm text-gray-600">Mastered</div>
                <div className="text-2xl font-bold text-green-600">{stats.learnedWords}</div>
              </div>
            </div>
          </div>
          
          <div className="rounded-xl p-4 bg-white shadow-sm border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-yellow-500 to-amber-600 flex items-center justify-center">
                <Star size={20} className="text-white" />
              </div>
              <div>
                <div className="text-sm text-gray-600">Bookmarks</div>
                <div className="text-2xl font-bold text-amber-600">{stats.bookmarkedWords}</div>
              </div>
            </div>
          </div>
          
          <div className="rounded-xl p-4 bg-white shadow-sm border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center">
                <Flame size={20} className="text-white" />
              </div>
              <div>
                <div className="text-sm text-gray-600">Streak</div>
                <div className="text-2xl font-bold text-orange-600">{stats.streak} days</div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Study Area */}
          <div className="lg:col-span-2 space-y-8">
            {/* Study Card */}
            <div className="rounded-2xl overflow-hidden bg-white shadow-sm border border-gray-100">
              <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                      <BookOpen size={24} className="text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-800">Study Mode</h2>
                      <p className="text-gray-600">Word {currentStudyIndex + 1} of {filteredVocabulary.length}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => speakWord(currentStudyWord?.word || '')}
                      className="p-2 rounded-lg bg-white text-gray-600 hover:bg-gray-50 border border-gray-200 transition-colors"
                      title="Listen"
                    >
                      <Volume2 size={20} />
                    </button>
                    <button
                      onClick={shuffleVocabulary}
                      className="p-2 rounded-lg bg-white text-gray-600 hover:bg-gray-50 border border-gray-200 transition-colors"
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
                    <div className="mb-8">
                      <div className="text-6xl font-bold mb-4 text-gray-800">
                        {currentStudyWord.word}
                      </div>
                      
                      <div className="space-y-2">
                        {showFurigana && (
                          <div className="text-xl text-gray-600">
                            {currentStudyWord.furigana}
                          </div>
                        )}
                        {showRomaji && (
                          <div className="text-lg text-gray-500">
                            {currentStudyWord.romaji}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Answer Section */}
                    {showAnswer[currentStudyWord.word] ? (
                      <div className="animate-fadeIn">
                        <div className="text-3xl font-bold mb-6 text-green-600">
                          {currentStudyWord.meaning}
                        </div>
                        {currentStudyWord.example && (
                          <div className="p-4 rounded-lg bg-gray-50">
                            <div className="text-sm font-semibold text-gray-600 mb-2">Example Sentence</div>
                            <div className="text-lg">{currentStudyWord.example}</div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <button
                        onClick={() => toggleShowAnswer(currentStudyWord.word)}
                        className="px-8 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold rounded-lg hover:shadow-lg transition-all duration-200"
                      >
                        <div className="flex items-center justify-center gap-2">
                          <Eye size={20} />
                          <span>Reveal Meaning</span>
                        </div>
                      </button>
                    )}
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="p-6 border-t border-gray-100">
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={goToPrevWord}
                        className="flex items-center justify-center gap-2 py-3 rounded-lg bg-gray-50 text-gray-700 hover:bg-gray-100 transition-colors"
                        disabled={currentStudyIndex === 0}
                      >
                        <ArrowLeft size={20} />
                        <span className="font-medium">Previous</span>
                      </button>
                      
                      <button
                        onClick={goToNextWord}
                        className="flex items-center justify-center gap-2 py-3 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:shadow-lg transition-all duration-200"
                      >
                        <span className="font-medium">Next</span>
                        <ArrowRight size={20} />
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3 mt-3">
                      <button
                        onClick={() => toggleBookmark(currentStudyWord.word)}
                        className={`flex items-center justify-center gap-2 py-3 rounded-lg transition-colors ${
                          userProgress.bookmarkedWords.includes(currentStudyWord.word)
                            ? 'bg-amber-50 text-amber-600 border border-amber-200'
                            : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                        }`}
                      >
                        <Star size={20} fill={userProgress.bookmarkedWords.includes(currentStudyWord.word) ? 'currentColor' : 'none'} />
                        <span className="font-medium">
                          {userProgress.bookmarkedWords.includes(currentStudyWord.word) ? 'Bookmarked' : 'Bookmark'}
                        </span>
                      </button>
                      
                      <button
                        onClick={() => toggleLearned(currentStudyWord.word)}
                        className={`flex items-center justify-center gap-2 py-3 rounded-lg transition-colors ${
                          userProgress.learnedWords.includes(currentStudyWord.word)
                            ? 'bg-green-50 text-green-600 border border-green-200'
                            : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                        }`}
                      >
                        {userProgress.learnedWords.includes(currentStudyWord.word) ? (
                          <CheckCircle size={20} />
                        ) : (
                          <Circle size={20} />
                        )}
                        <span className="font-medium">
                          {userProgress.learnedWords.includes(currentStudyWord.word) ? 'Mastered' : 'Mark as Learned'}
                        </span>
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="p-12 text-center">
                  <Search className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <h3 className="text-xl font-bold mb-2 text-gray-700">No words found</h3>
                  <p className="text-gray-500">Try changing your filters or search terms</p>
                </div>
              )}
            </div>
            
            {/* Vocabulary List */}
            <div className="rounded-2xl overflow-hidden bg-white shadow-sm border border-gray-100">
              <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                      <List size={24} className="text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">Vocabulary List</h3>
                      <p className="text-gray-600">{filteredVocabulary.length} words</p>
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1 sm:w-64">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                      <input
                        type="text"
                        placeholder="Search words or meanings..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700"
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
                          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                            selectedTab === tab.id
                              ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white'
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
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
                  {filteredVocabulary.map((item, index) => (
                    <div
                      key={`${item.word}-${index}`}
                      className="p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors group"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-start gap-4">
                          <div className="flex-shrink-0">
                            <div className="text-2xl font-bold text-gray-800">
                              {item.word}
                            </div>
                            <div className="text-sm text-gray-500 mt-1">{item.furigana}</div>
                          </div>
                          
                          <div>
                            <div className="text-lg font-medium text-gray-700 mb-1">{item.meaning}</div>
                            <div className="text-sm text-gray-500">{item.romaji}</div>
                            {item.example && (
                              <div className="mt-2 p-2 rounded bg-gray-100 text-sm text-gray-600">
                                {item.example}
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => toggleBookmark(item.word)}
                            className={`p-2 rounded-lg transition-colors ${
                              userProgress.bookmarkedWords.includes(item.word)
                                ? 'text-amber-500 bg-amber-50'
                                : 'text-gray-400 hover:text-amber-500 hover:bg-amber-50'
                            }`}
                          >
                            <Star size={18} fill={userProgress.bookmarkedWords.includes(item.word) ? 'currentColor' : 'none'} />
                          </button>
                          
                          <button
                            onClick={() => {
                              const wordIndex = filteredVocabulary.findIndex(w => w.word === item.word);
                              if (wordIndex !== -1) {
                                setCurrentStudyIndex(wordIndex);
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                              }
                            }}
                            className="p-2 rounded-lg text-gray-400 hover:text-blue-500 hover:bg-blue-50 transition-colors"
                          >
                            <Sparkles size={18} />
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
          <div className="space-y-6">
            {/* Progress */}
            <div className="rounded-2xl p-6 bg-white shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <Target className="text-blue-500" size={24} />
                  <div>
                    <h3 className="font-bold text-gray-700">Daily Progress</h3>
                    <p className="text-sm text-gray-600">{stats.todayProgress} words today</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-blue-600">
                    {Math.round((stats.todayProgress / dailyGoal) * 100)}%
                  </div>
                </div>
              </div>
              
              <div className="mb-6">
                <div className="w-full rounded-full h-2 bg-gray-200">
                  <div 
                    className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-500"
                    style={{ width: `${Math.min(100, (stats.todayProgress / dailyGoal) * 100)}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-sm text-gray-500 mt-2">
                  <span>Goal: {dailyGoal} words</span>
                  <span>{stats.todayProgress} / {dailyGoal}</span>
                </div>
              </div>
            </div>
            
            {/* Practice Modes */}
            <div className="rounded-2xl p-6 bg-white shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                  <Brain size={24} className="text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-700">Practice Modes</h3>
                  <p className="text-sm text-gray-600">Test your knowledge</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <button
                  onClick={() => startQuiz('practice')}
                  className="w-full flex items-center justify-between p-3 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <HelpCircle size={20} />
                    <div className="text-left">
                      <div className="font-medium">Practice Quiz</div>
                      <div className="text-sm opacity-75">10 questions, no time limit</div>
                    </div>
                  </div>
                  <ChevronRight className="opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                </button>
                
                <button
                  onClick={() => startQuiz('timed')}
                  className="w-full flex items-center justify-between p-3 rounded-lg bg-purple-50 text-purple-600 hover:bg-purple-100 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <Timer size={20} />
                    <div className="text-left">
                      <div className="font-medium">Timed Challenge</div>
                      <div className="text-sm opacity-75">60 seconds, race against time</div>
                    </div>
                  </div>
                  <ChevronRight className="opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                </button>
              </div>
            </div>
            
            {/* Settings */}
            <div className="rounded-2xl p-6 bg-white shadow-sm border border-gray-100">
              <h3 className="font-bold text-gray-700 mb-6">Settings</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Eye size={20} className="text-gray-600" />
                    <span className="text-gray-700">Show Furigana</span>
                  </div>
                  <button
                    onClick={() => setShowFurigana(!showFurigana)}
                    className={`w-12 h-6 rounded-full relative transition-all duration-200 ${
                      showFurigana ? 'bg-blue-500' : 'bg-gray-300'
                    }`}
                  >
                    <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                      showFurigana ? 'right-1' : 'left-1'
                    }`}></div>
                  </button>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Sparkles size={20} className="text-gray-600" />
                    <span className="text-gray-700">Show Romaji</span>
                  </div>
                  <button
                    onClick={() => setShowRomaji(!showRomaji)}
                    className={`w-12 h-6 rounded-full relative transition-all duration-200 ${
                      showRomaji ? 'bg-green-500' : 'bg-gray-300'
                    }`}
                  >
                    <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                      showRomaji ? 'right-1' : 'left-1'
                    }`}></div>
                  </button>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Volume2 size={20} className="text-gray-600" />
                    <span className="text-gray-700">Speech</span>
                  </div>
                  <button
                    onClick={() => setSpeechEnabled(!speechEnabled)}
                    className={`w-12 h-6 rounded-full relative transition-all duration-200 ${
                      speechEnabled ? 'bg-purple-500' : 'bg-gray-300'
                    }`}
                  >
                    <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                      speechEnabled ? 'right-1' : 'left-1'
                    }`}></div>
                  </button>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Play size={20} className="text-gray-600" />
                    <span className="text-gray-700">Auto-play</span>
                  </div>
                  <button
                    onClick={() => setAutoPlay(!autoPlay)}
                    className={`w-12 h-6 rounded-full relative transition-all duration-200 ${
                      autoPlay ? 'bg-amber-500' : 'bg-gray-300'
                    }`}
                  >
                    <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                      autoPlay ? 'right-1' : 'left-1'
                    }`}></div>
                  </button>
                </div>
              </div>
            </div>
            
            {/* Data Management */}
            <div className="rounded-2xl p-6 bg-white shadow-sm border border-gray-100">
              <h3 className="font-bold text-gray-700 mb-6">Data Management</h3>
              
              <div className="space-y-3">
                <button
                  onClick={exportProgress}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
                >
                  <Download size={18} />
                  <span>Export Progress</span>
                </button>
                
                <button
                  onClick={importProgress}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
                >
                  <Upload size={18} />
                  <span>Import Progress</span>
                </button>
                
                <button
                  onClick={resetProgress}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                >
                  <RotateCw size={18} />
                  <span>Reset Progress</span>
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <footer className="mt-12 pt-8 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <div className="flex items-center gap-2">
                <Brain className="text-blue-500" size={24} />
                <span className="font-bold text-gray-800">N5 Vocabulary Master</span>
              </div>
              <p className="text-sm text-gray-600 mt-2">Track progress • Learn faster • Achieve mastery</p>
            </div>
            <div className="text-sm text-gray-500">
              Built with ❤️ for Japanese learners
            </div>
          </div>
        </footer>
      </div>

      {/* Quiz Components */}
      <QuizComponent />
      <QuizResults />
    </div>
  );
};

export default N5VocabularyPage;