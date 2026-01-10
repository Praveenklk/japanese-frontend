// pages/KanaQuiz.tsx
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Play,
  Settings,
  Volume2,
  BookOpen,
  Target,
  Edit,
  CheckCircle,
  XCircle,
  Clock,
  BarChart,
  Home,
  RotateCw,
  ChevronRight,
  ChevronLeft,
  Zap,
  Trophy,
  AlertCircle,
  Sparkles,
  Headphones,
  Type,
  RefreshCw,
  Award,
  TrendingUp,
  HelpCircle,
  Star,
  Check,
  X,
  Loader2,
  Grid3x3,
  Filter,
  Music,
  VolumeX,
  Lock,
  Eye,
  Pen,
  Ear
} from 'lucide-react';
import { kanaQuizService } from '../service/kana-quiz.service';
import type { 
  KanaType, 
  QuizMode, 
  QuizDifficulty, 
  KanaCharacter,
  QuizQuestion,
  QuizSettings,
  QuizResult 
} from './types/kana-quiz.types';

const KanaQuiz: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<'setup' | 'quiz' | 'result'>('setup');
  const [settings, setSettings] = useState<QuizSettings>({
    kanaType: 'hiragana',
    rows: ['basic'],
    includeTenten: false,
    includeMaru: false,
    includeCombo: false,
    difficulty: 'easy',
    questionCount: 10,
    mode: 'reading'
  });
  
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [timeSpent, setTimeSpent] = useState(0);
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [allKana, setAllKana] = useState<KanaCharacter[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [quizResults, setQuizResults] = useState<QuizResult | null>(null);
  const [selectedRows, setSelectedRows] = useState<string[]>(['basic']);
  const [showHint, setShowHint] = useState(false);
  const [streak, setStreak] = useState(0);
  const [totalTime, setTotalTime] = useState(0);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [answerHistory, setAnswerHistory] = useState<{symbol: string, romaji: string, userAnswer: string, isCorrect: boolean}[]>([]);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const answerFeedbackRef = useRef<HTMLDivElement>(null);
  const questionDisplayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchKana();
  }, [settings.kanaType]);

  useEffect(() => {
    if (step === 'quiz' && timer === null) {
      const interval = setInterval(() => {
        setTimeSpent(prev => prev + 1);
        setTotalTime(prev => prev + 1);
      }, 1000);
      setTimer(interval);
    }
    
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [step, timer]);

  useEffect(() => {
    if (showFeedback && answerFeedbackRef.current) {
      answerFeedbackRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [showFeedback]);

  // Focus input automatically when question changes
  useEffect(() => {
    if (step === 'quiz' && questions.length > 0) {
      // Small delay to ensure DOM is ready
      const timer = setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
          inputRef.current.select();
        }
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [currentQuestion, step, questions.length]);

  const fetchKana = async () => {
    setIsLoading(true);
    try {
      const kanaData = await kanaQuizService.getAllKana(settings.kanaType);
      setAllKana(kanaData);
      
      // Reset selected rows when switching kana type
      setSelectedRows(['basic']);
    } catch (error) {
      console.error('Error fetching kana:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const rows = kanaQuizService.getRows(settings.kanaType);

  const handleRowToggle = (rowId: string) => {
    setSelectedRows(prev => {
      const newRows = prev.includes(rowId)
        ? prev.filter(r => r !== rowId)
        : [...prev, rowId];
      
      // Update settings with selected rows
      if (newRows.length > 0) {
        setSettings(prev => ({ ...prev, rows: newRows }));
      }
      
      return newRows;
    });
  };

  const handleStartQuiz = () => {
    if (selectedRows.length === 0) {
      alert('Please select at least one row to start the quiz!');
      return;
    }

    // Filter kana based on selected rows
    const filteredKana = allKana.filter(kana => {
      const rowMatch = rows.some(row => 
        selectedRows.includes(row.id) && row.chars.includes(kana.symbol)
      );
      return rowMatch;
    });

    if (filteredKana.length === 0) {
      alert('No characters available with current selection. Please adjust your settings.');
      return;
    }

    // Update settings with current selected rows
    setSettings(prev => ({ ...prev, rows: selectedRows }));
    
    const generatedQuestions = kanaQuizService.generateQuizQuestions(
      {...settings, rows: selectedRows}, 
      filteredKana
    );
    setQuestions(generatedQuestions);
    setStep('quiz');
    setCurrentQuestion(0);
    setScore(0);
    setTimeSpent(0);
    setStreak(0);
    setUserAnswer('');
    setShowFeedback(false);
    setShowHint(false);
    setAnswerHistory([]);
    
    // Focus input after a short delay
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
        inputRef.current.select();
      }
    }, 300);
  };

  const handleAnswerSubmit = () => {
    if (!userAnswer.trim()) {
      if (inputRef.current) {
        inputRef.current.focus();
      }
      return;
    }
    
    const currentQ = questions[currentQuestion];
    const normalizedAnswer = kanaQuizService.normalizeKanaInput(userAnswer);
    const correct = kanaQuizService.checkAnswer(currentQ, normalizedAnswer);
    
    setIsCorrect(correct);
    setShowFeedback(true);
    setShowHint(false);
    
    // Update streak
    if (correct) {
      setStreak(prev => prev + 1);
    } else {
      setStreak(0);
    }
    
    // Update question with user answer
    const updatedQuestions = [...questions];
    updatedQuestions[currentQuestion] = {
      ...currentQ,
      userAnswer: userAnswer,
      isCorrect: correct,
      timeSpent: timeSpent
    };
    setQuestions(updatedQuestions);
    
    // Add to answer history
    setAnswerHistory(prev => [...prev, {
      symbol: currentQ.character.symbol,
      romaji: currentQ.character.romaji,
      userAnswer: userAnswer,
      isCorrect: correct
    }]);
    
    if (correct) {
      setScore(prev => prev + 1);
    }
    
    // Move to next question after delay - AUTOMATICALLY
    setTimeout(() => {
      setShowFeedback(false);
      setUserAnswer('');
      
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(prev => prev + 1);
        // Focus will be handled by useEffect
      } else {
        // Quiz complete
        if (timer) clearInterval(timer);
        setTimer(null);
        
        const result: QuizResult = {
          score: correct ? score + 1 : score,
          total: questions.length,
          accuracy: Math.round(((correct ? score + 1 : score) / questions.length) * 100),
          timeSpent: totalTime + timeSpent,
          questions: updatedQuestions,
          date: new Date(),
          streak: Math.max(streak, updatedQuestions.filter(q => q.isCorrect).length),
          settings: settings
        };
        
        setQuizResults(result);
        setStep('result');
        
        // Save to localStorage
        const savedResults = JSON.parse(localStorage.getItem('kanaQuizResults') || '[]');
        savedResults.push(result);
        localStorage.setItem('kanaQuizResults', JSON.stringify(savedResults.slice(-50)));
      }
    }, 1000); // Reduced delay for faster progression
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAnswerSubmit();
    } else if (e.key === 'Tab' && !e.shiftKey && step === 'quiz') {
      e.preventDefault();
      setShowHint(!showHint);
    } else if (e.key === ' ' && settings.mode === 'listening') {
      e.preventDefault();
      playAudio(questions[currentQuestion].character.romaji);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setUserAnswer('');
      setShowFeedback(false);
      setShowHint(false);
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
      setUserAnswer(questions[currentQuestion - 1].userAnswer || '');
      setShowFeedback(false);
      setShowHint(false);
    }
  };

  const handleRestartQuiz = () => {
    setStep('setup');
    setQuestions([]);
    setCurrentQuestion(0);
    setScore(0);
    setTimeSpent(0);
    setStreak(0);
    setTotalTime(0);
    setUserAnswer('');
    setShowFeedback(false);
    setShowHint(false);
    setAnswerHistory([]);
    if (timer) clearInterval(timer);
    setTimer(null);
    setQuizResults(null);
  };

  const handleRetrySameSettings = () => {
    handleStartQuiz();
  };

  const playAudio = (text: string) => {
    // Stop any currently playing audio
    speechSynthesis.cancel();
    setIsAudioPlaying(true);
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ja-JP';
    utterance.rate = settings.difficulty === 'easy' ? 0.7 : settings.difficulty === 'medium' ? 0.85 : 1.0;
    utterance.pitch = 1;
    utterance.volume = 1;
    
    // Try to get Japanese voice
    const voices = speechSynthesis.getVoices();
    const japaneseVoice = voices.find(voice => voice.lang === 'ja-JP');
    if (japaneseVoice) {
      utterance.voice = japaneseVoice;
    }
    
    utterance.onend = () => setIsAudioPlaying(false);
    utterance.onerror = () => setIsAudioPlaying(false);
    
    speechSynthesis.speak(utterance);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getDifficultyColor = (difficulty: QuizDifficulty) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getModeIcon = (mode: QuizMode) => {
    switch (mode) {
      case 'reading': return <Eye className="w-5 h-5" />;
      case 'writing': return <Pen className="w-5 h-5" />;
      case 'listening': return <Ear className="w-5 h-5" />;
      default: return <Eye className="w-5 h-5" />;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="text-center space-y-6 max-w-md mx-auto">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
            <Sparkles className="w-10 h-10 text-blue-600 absolute -top-3 -right-3 animate-pulse" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Loading Kana Quiz</h2>
            <p className="text-gray-600 mt-2">Preparing your learning experience...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto p-4 md:p-6">
        {/* Header */}
        <header className="mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl shadow-lg">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl md:text-4xl font-bold text-gray-900">
                  Kana Quiz Master
                </h1>
                <p className="text-gray-600 mt-1 text-sm md:text-base">
                  Master Japanese hiragana and katakana like a pro
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2 w-full md:w-auto">
              <button
                onClick={() => navigate('/')}
                className="flex-1 md:flex-none px-4 py-3 bg-white text-gray-700 rounded-xl hover:bg-gray-50 border shadow-sm transition-all flex items-center justify-center gap-2 group text-sm md:text-base"
              >
                <Home className="w-4 h-4 group-hover:scale-110 transition-transform" />
                <span>Home</span>
              </button>
              
              <button
                onClick={() => navigate('/flashcards')}
                className="flex-1 md:flex-none px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl hover:shadow-lg transition-all flex items-center justify-center gap-2 group text-sm md:text-base hover:scale-105"
              >
                <BookOpen className="w-4 h-4 group-hover:scale-110 transition-transform" />
                <span>Flashcards</span>
              </button>
            </div>
          </div>
        </header>

        <main className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* Progress Steps */}
          <div className="flex items-center justify-center py-4 border-b bg-gray-50 px-4">
            <div className="flex items-center space-x-2 md:space-x-4">
              {['setup', 'quiz', 'result'].map((s, index) => (
                <React.Fragment key={s}>
                  <div className={`flex items-center gap-2 ${step === s ? 'text-blue-600' : 'text-gray-400'}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm md:text-base ${step === s ? 'bg-blue-100 border-2 border-blue-500' : 'bg-gray-100'}`}>
                      {index + 1}
                    </div>
                    <span className="hidden sm:inline text-sm font-medium capitalize">{s}</span>
                  </div>
                  {index < 2 && (
                    <div className={`w-8 md:w-12 h-0.5 ${step === 'quiz' && index === 0 || step === 'result' ? 'bg-blue-500' : 'bg-gray-300'}`} />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          {step === 'setup' && (
            <div className="p-4 md:p-8">
              <div className="flex items-center gap-3 mb-6 md:mb-8">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Settings className="w-5 h-5 md:w-6 md:h-6 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-xl md:text-2xl font-bold text-gray-900">Quiz Setup</h2>
                  <p className="text-gray-600 text-sm md:text-base">Customize your quiz experience</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
                {/* Left Column - Kana Type & Rows */}
                <div className="lg:col-span-2 space-y-6 md:space-y-8">
                  {/* Kana Type Selection */}
                  <div className="bg-gradient-to-br from-blue-50 to-white p-4 md:p-6 rounded-2xl shadow-sm border border-blue-100">
                    <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Type className="w-4 h-4 md:w-5 md:h-5 text-blue-600" />
                      </div>
                      <span>Select Kana Type</span>
                    </h3>
                    <div className="grid grid-cols-2 gap-3 md:gap-4">
                      {(['hiragana', 'katakana'] as KanaType[]).map(type => (
                        <button
                          key={type}
                          onClick={() => {
                            setSettings(prev => ({ ...prev, kanaType: type }));
                            setSelectedRows(['basic']);
                          }}
                          className={`p-4 md:p-6 rounded-xl border-2 transition-all duration-300 transform hover:scale-[1.02] ${
                            settings.kanaType === type
                              ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-white shadow-md'
                              : 'border-gray-200 hover:border-blue-300'
                          }`}
                        >
                          <div className="text-center">
                            <div className="text-2xl md:text-4xl font-bold mb-2 md:mb-3">
                              {type === 'hiragana' ? 'あいうえお' : 'アイウエオ'}
                            </div>
                            <div className="text-sm font-medium capitalize bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                              {type}
                            </div>
                            <div className="text-xs text-gray-500 mt-1 md:mt-2">
                              {type === 'hiragana' ? '46 basic characters + variants' : '46 basic characters + variants'}
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Row Selection - Card Grid Layout */}
                  <div className="bg-gradient-to-br from-blue-50 to-white p-4 md:p-6 rounded-2xl shadow-sm border border-blue-100">
                    <div className="flex items-center justify-between mb-4 md:mb-6">
                      <h3 className="text-base md:text-lg font-semibold text-gray-900 flex items-center gap-2">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <Grid3x3 className="w-4 h-4 md:w-5 md:h-5 text-blue-600" />
                        </div>
                        <span>Select Kana Rows</span>
                      </h3>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            const allRowIds = rows
                              .filter(r => {
                                if (r.id.includes('tenten')) return settings.includeTenten;
                                if (r.id.includes('maru')) return settings.includeMaru;
                                if (r.id.includes('combo')) return settings.includeCombo;
                                return true;
                              })
                              .map(r => r.id);
                            setSelectedRows(allRowIds);
                          }}
                          className="text-xs md:text-sm text-blue-600 hover:text-blue-700 font-medium px-2 md:px-3 py-1 rounded-lg hover:bg-blue-50"
                        >
                          Select All
                        </button>
                        <button
                          onClick={() => setSelectedRows(['basic'])}
                          className="text-xs md:text-sm text-gray-600 hover:text-gray-700 font-medium px-2 md:px-3 py-1 rounded-lg hover:bg-gray-100"
                        >
                          Reset
                        </button>
                      </div>
                    </div>
                    
                    {/* Character Type Toggles */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                      <label className={`flex items-center justify-between p-3 rounded-xl border-2 cursor-pointer transition-all ${
                        settings.includeTenten ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                      }`}>
                        <div className="flex items-center gap-2">
                          <span className="text-xl">゛</span>
                          <span className="text-sm font-medium">Dakuten</span>
                        </div>
                        <input
                          type="checkbox"
                          checked={settings.includeTenten}
                          onChange={(e) => setSettings(prev => ({ ...prev, includeTenten: e.target.checked }))}
                          className="rounded w-4 h-4 text-blue-600"
                        />
                      </label>
                      
                      <label className={`flex items-center justify-between p-3 rounded-xl border-2 cursor-pointer transition-all ${
                        settings.includeMaru ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                      }`}>
                        <div className="flex items-center gap-2">
                          <span className="text-xl">゜</span>
                          <span className="text-sm font-medium">Handakuten</span>
                        </div>
                        <input
                          type="checkbox"
                          checked={settings.includeMaru}
                          onChange={(e) => setSettings(prev => ({ ...prev, includeMaru: e.target.checked }))}
                          className="rounded w-4 h-4 text-blue-600"
                        />
                      </label>
                      
                      <label className={`flex items-center justify-between p-3 rounded-xl border-2 cursor-pointer transition-all ${
                        settings.includeCombo ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                      }`}>
                        <div className="flex items-center gap-2">
                          <span className="text-xl">ゃゅょ</span>
                          <span className="text-sm font-medium">Combinations</span>
                        </div>
                        <input
                          type="checkbox"
                          checked={settings.includeCombo}
                          onChange={(e) => setSettings(prev => ({ ...prev, includeCombo: e.target.checked }))}
                          className="rounded w-4 h-4 text-blue-600"
                        />
                      </label>
                      
                      <div className="p-3 bg-gray-50 rounded-xl border-2 border-gray-200">
                        <div className="flex items-center justify-between">
                          <div className="text-sm font-medium text-gray-900">Selected</div>
                          <div className="text-lg font-bold text-blue-600">{selectedRows.length}</div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Row Grid */}
                    <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 max-h-96 overflow-y-auto p-2">
                      {rows.map(row => {
                        const isAvailable = 
                          (row.id.includes('tenten') && settings.includeTenten) ||
                          (row.id.includes('maru') && settings.includeMaru) ||
                          (row.id.includes('combo') && settings.includeCombo) ||
                          (!row.id.includes('tenten') && !row.id.includes('maru') && !row.id.includes('combo'));
                        
                        return (
                          <button
                            key={row.id}
                            onClick={() => isAvailable && handleRowToggle(row.id)}
                            disabled={!isAvailable}
                            className={`p-4 rounded-xl border-2 transition-all duration-200 flex flex-col items-center justify-center relative ${
                              selectedRows.includes(row.id) && isAvailable
                                ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-white shadow-sm'
                                : !isAvailable
                                ? 'border-gray-100 bg-gray-50 opacity-40 cursor-not-allowed'
                                : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                            }`}
                          >
                            <div className="text-2xl md:text-3xl font-bold mb-2">{row.chars[0]}</div>
                            <div className="text-xs text-gray-600 text-center">{row.name}</div>
                            {selectedRows.includes(row.id) && isAvailable && (
                              <div className="absolute top-2 right-2">
                                <Check className="w-4 h-4 text-blue-500" />
                              </div>
                            )}
                            {!isAvailable && (
                              <div className="absolute top-2 right-2">
                                <Lock className="w-4 h-4 text-gray-400" />
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                    
                    <div className="mt-4 text-sm text-gray-500 text-center">
                      {selectedRows.length} rows selected • {
                        rows.filter(r => selectedRows.includes(r.id)).reduce((acc, row) => acc + row.chars.length, 0)
                      } characters
                    </div>
                  </div>
                </div>

                {/* Right Column - Options & Start */}
                <div className="space-y-6 md:space-y-8">
                  {/* Quiz Options */}
                  <div className="bg-gradient-to-br from-blue-50 to-white p-4 md:p-6 rounded-2xl shadow-sm border border-blue-100">
                    <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-4 md:mb-6 flex items-center gap-2">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Settings className="w-4 h-4 md:w-5 md:h-5 text-blue-600" />
                      </div>
                      <span>Quiz Settings</span>
                    </h3>
                    
                    <div className="space-y-6">
                      {/* Mode Selection */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                          Quiz Mode
                        </label>
                        <div className="grid grid-cols-3 gap-2">
                          {(['reading', 'writing', 'listening'] as QuizMode[]).map(mode => (
                            <button
                              key={mode}
                              onClick={() => setSettings(prev => ({ ...prev, mode }))}
                              className={`p-3 rounded-xl border-2 transition-all flex flex-col items-center justify-center gap-2 ${
                                settings.mode === mode
                                  ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-white shadow-sm'
                                  : 'border-gray-200 hover:border-blue-300'
                              }`}
                            >
                              {getModeIcon(mode)}
                              <span className="text-xs font-medium capitalize">{mode}</span>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Difficulty */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                          Difficulty Level
                        </label>
                        <div className="grid grid-cols-3 gap-2">
                          {(['easy', 'medium', 'hard'] as QuizDifficulty[]).map(difficulty => (
                            <button
                              key={difficulty}
                              onClick={() => setSettings(prev => ({ ...prev, difficulty }))}
                              className={`p-3 rounded-xl border-2 transition-all duration-200 capitalize font-medium ${
                                settings.difficulty === difficulty
                                  ? difficulty === 'easy'
                                    ? 'border-green-500 bg-gradient-to-br from-green-50 to-white text-green-700'
                                    : difficulty === 'medium'
                                    ? 'border-yellow-500 bg-gradient-to-br from-yellow-50 to-white text-yellow-700'
                                    : 'border-red-500 bg-gradient-to-br from-red-50 to-white text-red-700'
                                  : 'border-gray-200 hover:border-gray-300'
                              }`}
                            >
                              {difficulty}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Question Count */}
                      <div className="pt-4 border-t">
                        <div className="flex items-center justify-between mb-4">
                          <label className="text-sm font-medium text-gray-700">
                            Number of Questions
                          </label>
                          <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            {settings.questionCount}
                          </span>
                        </div>
                        <input
                          type="range"
                          min="5"
                          max="50"
                          step="5"
                          value={settings.questionCount}
                          onChange={(e) => setSettings(prev => ({ ...prev, questionCount: parseInt(e.target.value) }))}
                          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                        />
                        <div className="flex justify-between text-xs text-gray-500 mt-2">
                          <span>5</span>
                          <span>15</span>
                          <span>25</span>
                          <span>35</span>
                          <span>50</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Start Button Card */}
                  <div className="bg-gradient-to-br from-blue-50 to-white p-6 rounded-2xl shadow-lg border border-blue-100">
                    <div className="text-center space-y-4">
                      <div className="inline-block p-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full">
                        <Play className="w-8 h-8 text-white" />
                      </div>
                      
                      <div>
                        <h4 className="text-xl font-bold text-gray-900 mb-2">Ready to Start?</h4>
                        <p className="text-gray-600 text-sm">Test your kana knowledge with this quiz</p>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between items-center p-2 bg-white rounded-lg">
                          <span className="text-gray-600">Mode:</span>
                          <span className="font-semibold capitalize flex items-center gap-2">
                            {getModeIcon(settings.mode)}
                            {settings.mode}
                          </span>
                        </div>
                        <div className="flex justify-between items-center p-2 bg-white rounded-lg">
                          <span className="text-gray-600">Kana:</span>
                          <span className="font-semibold capitalize">
                            {settings.kanaType}
                          </span>
                        </div>
                        <div className="flex justify-between items-center p-2 bg-white rounded-lg">
                          <span className="text-gray-600">Questions:</span>
                          <span className="font-bold text-blue-600">{settings.questionCount}</span>
                        </div>
                        <div className="flex justify-between items-center p-2 bg-white rounded-lg">
                          <span className="text-gray-600">Difficulty:</span>
                          <span className={`font-semibold px-2 py-1 rounded text-xs ${getDifficultyColor(settings.difficulty)}`}>
                            {settings.difficulty}
                          </span>
                        </div>
                      </div>
                      
                      <button
                        onClick={handleStartQuiz}
                        disabled={selectedRows.length === 0}
                        className={`w-full py-4 px-6 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed ${
                          selectedRows.length === 0
                            ? 'bg-gray-300'
                            : 'bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:shadow-xl text-white'
                        }`}
                      >
                        <div className="flex items-center justify-center gap-3">
                          Start Quiz
                          <ChevronRight className="w-5 h-5" />
                        </div>
                      </button>
                      
                      {selectedRows.length === 0 && (
                        <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                          <p className="text-red-600 text-sm flex items-center gap-2">
                            <AlertCircle className="w-4 h-4" />
                            Select at least one kana row
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 'quiz' && questions.length > 0 && (
            <div className="p-4 md:p-8">
              {/* Quiz Header Stats */}
              <div className="grid grid-cols-4 gap-3 mb-8">
                <div className="bg-gradient-to-br from-blue-50 to-white p-4 rounded-2xl border border-blue-100 shadow-sm">
                  <div className="text-center">
                    <div className="text-xs text-gray-600 mb-1">Question</div>
                    <div className="text-2xl font-bold text-blue-600">
                      {currentQuestion + 1}<span className="text-gray-400">/{questions.length}</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-green-50 to-white p-4 rounded-2xl border border-green-100 shadow-sm">
                  <div className="text-center">
                    <div className="text-xs text-gray-600 mb-1">Score</div>
                    <div className="text-2xl font-bold text-green-600">{score}</div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-orange-50 to-white p-4 rounded-2xl border border-orange-100 shadow-sm">
                  <div className="text-center">
                    <div className="text-xs text-gray-600 mb-1">Streak</div>
                    <div className="text-2xl font-bold text-orange-600">{streak}</div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-purple-50 to-white p-4 rounded-2xl border border-purple-100 shadow-sm">
                  <div className="text-center">
                    <div className="text-xs text-gray-600 mb-1">Time</div>
                    <div className="text-2xl font-bold text-purple-600">{formatTime(timeSpent)}</div>
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-8">
                <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                  <span>Progress</span>
                  <span>{Math.round(((currentQuestion + 1) / questions.length) * 100)}%</span>
                </div>
                <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transition-all duration-500"
                    style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                  />
                </div>
              </div>

              {/* Answer History Grid - SHOW ALL ANSWERED CHARACTERS */}
              {answerHistory.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Answers</h3>
                  <div className="grid grid-cols-5 md:grid-cols-8 lg:grid-cols-10 gap-3">
                    {answerHistory.map((answer, index) => (
                      <div 
                        key={index}
                        className={`p-3 rounded-xl border-2 text-center transition-all ${
                          answer.isCorrect
                            ? 'border-green-200 bg-gradient-to-br from-green-50 to-white'
                            : 'border-red-200 bg-gradient-to-br from-red-50 to-white'
                        }`}
                      >
                        <div className="text-2xl font-bold mb-1">{answer.symbol}</div>
                        <div className={`text-xs font-mono ${answer.isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                          {answer.userAnswer}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {answer.romaji}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Current Question Card */}
              <div className="mb-10" ref={questionDisplayRef}>
                <div className="bg-gradient-to-br from-blue-50 to-white rounded-3xl border-2 border-blue-100 shadow-xl p-8 md:p-12">
                  <div className="text-center">
                    {/* Question Type Badge */}
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-blue-200 mb-6">
                      {getModeIcon(settings.mode)}
                      <span className="text-sm font-medium capitalize text-blue-700">
                        {settings.mode} mode • {settings.difficulty}
                      </span>
                    </div>
                    
                    {/* Kana Character Display */}
                    <div className="mb-8">
                      <div className="inline-block p-12 bg-white rounded-2xl shadow-lg border border-blue-100">
                        <div className="text-8xl md:text-9xl font-bold text-gray-900 animate-pulse-slow">
                          {settings.mode === 'reading' 
                            ? questions[currentQuestion].character.symbol 
                            : settings.mode === 'writing'
                            ? questions[currentQuestion].character.romaji
                            : '🔊'}
                        </div>
                      </div>
                    </div>
                    
                    {/* Question Text */}
                    <div className="text-xl md:text-2xl text-gray-700 font-medium mb-8">
                      {questions[currentQuestion].question}
                    </div>
                    
                    {/* Listening Mode Controls */}
                    {settings.mode === 'listening' && (
                      <div className="flex flex-col sm:flex-row justify-center gap-4 mb-6">
                        <button
                          onClick={() => playAudio(questions[currentQuestion].character.romaji)}
                          disabled={isAudioPlaying}
                          className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl hover:shadow-lg transition-all flex items-center justify-center gap-3 group disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isAudioPlaying ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                          ) : (
                            <Volume2 className="w-5 h-5 group-hover:scale-110 transition-transform" />
                          )}
                          {isAudioPlaying ? 'Playing...' : 'Play Sound'}
                        </button>
                        <button
                          onClick={() => setShowHint(!showHint)}
                          className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all flex items-center justify-center gap-3"
                        >
                          <HelpCircle className="w-5 h-5" />
                          {showHint ? 'Hide Hint' : 'Show Hint'}
                        </button>
                      </div>
                    )}
                    
                    {/* Hint Display */}
                    {showHint && settings.mode === 'listening' && (
                      <div className="inline-block p-4 bg-yellow-50 rounded-xl border border-yellow-200 animate-fade-in mb-6">
                        <p className="text-yellow-800 font-medium">
                          Hint: Sounds like "<span className="font-bold">{questions[currentQuestion].character.romaji}</span>"
                        </p>
                      </div>
                    )}
                    
                    {/* Answer Input - Card Style */}
                    <div className="max-w-2xl mx-auto mt-8">
                      <div className="relative" ref={answerFeedbackRef}>
                        <div className={`p-1 rounded-2xl border-4 transition-all duration-300 ${
                          showFeedback
                            ? isCorrect
                              ? 'border-green-500 bg-gradient-to-r from-green-50 to-white'
                              : 'border-red-500 bg-gradient-to-r from-red-50 to-white'
                            : 'border-blue-300'
                        }`}>
                          <input
                            ref={inputRef}
                            type="text"
                            value={userAnswer}
                            onChange={(e) => setUserAnswer(e.target.value)}
                            onKeyDown={handleKeyPress}
                            disabled={showFeedback}
                            className="w-full p-6 text-center text-3xl md:text-4xl bg-transparent focus:outline-none placeholder:text-gray-400"
                            placeholder={
                              settings.mode === 'reading' 
                                ? "Type romaji here..." 
                                : settings.mode === 'writing'
                                ? "Type kana here..."
                                : "Type what you hear..."
                            }
                            autoFocus
                          />
                        </div>
                        
                        {showFeedback && (
                          <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 animate-bounce">
                            <div className={`px-6 py-4 rounded-xl shadow-2xl flex items-center gap-4 ${
                              isCorrect 
                                ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white' 
                                : 'bg-gradient-to-r from-red-500 to-pink-500 text-white'
                            }`}>
                              {isCorrect ? (
                                <>
                                  <CheckCircle className="w-8 h-8" />
                                  <div>
                                    <div className="font-bold text-xl">Correct! 🎉</div>
                                    <div className="text-sm opacity-90">Streak: {streak}</div>
                                  </div>
                                </>
                              ) : (
                                <>
                                  <XCircle className="w-8 h-8" />
                                  <div>
                                    <div className="font-bold text-xl">Incorrect</div>
                                    <div className="text-sm opacity-90">Keep trying!</div>
                                  </div>
                                </>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                      
                      {/* Submit Button */}
                      <button
                        onClick={handleAnswerSubmit}
                        disabled={!userAnswer.trim() || showFeedback}
                        className={`w-full mt-8 py-4 rounded-xl font-bold text-xl transition-all duration-300 ${
                          !userAnswer.trim() || showFeedback
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white hover:shadow-xl hover:scale-105'
                        }`}
                      >
                        {showFeedback 
                          ? 'Checking...' 
                          : 'Submit Answer →'
                        }
                      </button>
                      
                      {/* Keyboard Shortcuts */}
                      <div className="mt-6 text-center">
                        <div className="inline-flex items-center gap-4 text-sm text-gray-500 bg-gray-50 px-4 py-2 rounded-xl">
                          <kbd className="px-3 py-1 bg-white rounded-lg border shadow-sm">Enter</kbd>
                          <span>to submit answer</span>
                          {settings.mode === 'listening' && (
                            <>
                              <kbd className="px-3 py-1 bg-white rounded-lg border shadow-sm">Space</kbd>
                              <span>to replay audio</span>
                            </>
                          )}
                          <kbd className="px-3 py-1 bg-white rounded-lg border shadow-sm">Tab</kbd>
                          <span>for hint</span>
                        </div>
                      </div>
                      
                      {/* Incorrect Answer Feedback */}
                      {showFeedback && !isCorrect && (
                        <div className="mt-8 p-6 bg-gradient-to-br from-yellow-50 to-white rounded-2xl border-2 border-yellow-200 animate-fade-in">
                          <div className="text-center">
                            <div className="text-xl font-bold text-yellow-800 mb-4">
                              Correct Answer:
                            </div>
                            <div className="flex items-center justify-center gap-6 mb-4">
                              <div className="text-5xl font-bold">{questions[currentQuestion].character.symbol}</div>
                              <ChevronRight className="w-6 h-6 text-gray-400" />
                              <div className="text-4xl font-mono font-bold text-blue-600">
                                {questions[currentQuestion].character.romaji}
                              </div>
                            </div>
                            {userAnswer && (
                              <div className="text-lg text-gray-600">
                                Your answer: <span className="font-bold text-red-600">{userAnswer}</span>
                              </div>
                            )}
                            {questions[currentQuestion].character.explanation && (
                              <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                                <p className="text-blue-800">
                                  {questions[currentQuestion].character.explanation}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Restart Button */}
              <div className="text-center">
                <button
                  onClick={handleRestartQuiz}
                  className="inline-flex items-center gap-2 px-6 py-3 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  <RotateCw className="w-5 h-5" />
                  Restart Quiz
                </button>
              </div>
            </div>
          )}

          {step === 'result' && quizResults && (
            <div className="p-4 md:p-8">
              <div className="text-center mb-12">
                <div className="inline-block p-8 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full shadow-2xl mb-6">
                  <Trophy className="w-16 h-16 text-white" />
                </div>
                <h2 className="text-4xl font-bold text-gray-900 mb-3">Quiz Complete!</h2>
                <p className="text-gray-600 text-lg">Excellent work! Here's your performance breakdown</p>
              </div>
              
              {/* Results Overview Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                <div className="bg-gradient-to-br from-blue-50 to-white p-8 rounded-3xl border-2 border-blue-100 shadow-lg">
                  <div className="text-center">
                    <div className="text-5xl font-bold text-blue-600 mb-3">
                      {quizResults.score}/{quizResults.total}
                    </div>
                    <div className="text-sm text-gray-600 mb-4">Final Score</div>
                    <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                        style={{ width: `${(quizResults.score / quizResults.total) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-green-50 to-white p-8 rounded-3xl border-2 border-green-100 shadow-lg">
                  <div className="text-center">
                    <div className="text-5xl font-bold text-green-600 mb-3">
                      {quizResults.accuracy}%
                    </div>
                    <div className="text-sm text-gray-600 mb-4">Accuracy</div>
                    <div className="flex justify-between text-sm">
                      <span>✓ {quizResults.score}</span>
                      <span>✗ {quizResults.total - quizResults.score}</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-purple-50 to-white p-8 rounded-3xl border-2 border-purple-100 shadow-lg">
                  <div className="text-center">
                    <div className="text-5xl font-bold text-purple-600 mb-3">
                      {formatTime(quizResults.timeSpent)}
                    </div>
                    <div className="text-sm text-gray-600 mb-4">Total Time</div>
                    <div className="text-sm text-gray-600">
                      Avg: {Math.round(quizResults.timeSpent / quizResults.total)}s per question
                    </div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-amber-50 to-white p-8 rounded-3xl border-2 border-amber-100 shadow-lg">
                  <div className="text-center">
                    <div className="text-5xl font-bold text-amber-600 mb-3">
                      {quizResults.streak || 0}
                    </div>
                    <div className="text-sm text-gray-600 mb-4">Best Streak</div>
                    <div className="flex items-center justify-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`w-5 h-5 ${i < Math.min(5, Math.floor((quizResults.streak || 0) / 2)) ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`} 
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Question Review */}
              <div className="mb-12">
                <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">Detailed Review</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto p-2">
                  {quizResults.questions.map((q, index) => (
                    <div 
                      key={q.id}
                      className={`p-6 rounded-2xl border-2 transition-all duration-300 hover:scale-[1.02] ${
                        q.isCorrect
                          ? 'border-green-200 bg-gradient-to-br from-green-50 to-white'
                          : 'border-red-200 bg-gradient-to-br from-red-50 to-white'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            q.isCorrect
                              ? 'bg-green-100 text-green-600'
                              : 'bg-red-100 text-red-600'
                          }`}>
                            {q.isCorrect ? <Check className="w-6 h-6" /> : <X className="w-6 h-6" />}
                          </div>
                          <div className="font-bold text-gray-900">Question {index + 1}</div>
                        </div>
                        <div className={`px-3 py-1 rounded-full text-sm font-bold ${
                          q.isCorrect
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-700'
                        }`}>
                          {q.isCorrect ? '✓ Correct' : '✗ Incorrect'}
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex items-center justify-center gap-4">
                          <div className="text-4xl font-bold">{q.character.symbol}</div>
                          <ChevronRight className="w-6 h-6 text-gray-400" />
                          <div className="text-3xl font-mono font-bold text-blue-600">
                            {q.character.romaji}
                          </div>
                        </div>
                        
                        {!q.isCorrect && q.userAnswer && (
                          <div className="pt-3 border-t">
                            <div className="text-sm text-gray-600">
                              Your answer: <span className="font-bold text-red-600">{q.userAnswer}</span>
                            </div>
                          </div>
                        )}
                        
                        {q.character.explanation && (
                          <div className="pt-3 border-t">
                            <div className="text-sm text-gray-600 italic">
                              {q.character.explanation}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <button
                  onClick={handleRestartQuiz}
                  className="p-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 flex flex-col items-center justify-center gap-3 group"
                >
                  <RotateCw className="w-8 h-8 group-hover:rotate-180 transition-transform duration-500" />
                  <div>
                    <div className="text-xl font-bold">New Quiz</div>
                    <div className="text-sm opacity-90">Start fresh with new settings</div>
                  </div>
                </button>
                
                <button
                  onClick={handleRetrySameSettings}
                  className="p-6 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-2xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 flex flex-col items-center justify-center gap-3 group"
                >
                  <RefreshCw className="w-8 h-8 group-hover:rotate-180 transition-transform duration-500" />
                  <div>
                    <div className="text-xl font-bold">Retry Same Quiz</div>
                    <div className="text-sm opacity-90">Improve your score</div>
                  </div>
                </button>
                
                <button
                  onClick={() => navigate('/flashcards')}
                  className="p-6 bg-gradient-to-r from-gray-700 to-gray-900 text-white rounded-2xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 flex flex-col items-center justify-center gap-3 group"
                >
                  <BookOpen className="w-8 h-8 group-hover:scale-110 transition-transform" />
                  <div>
                    <div className="text-xl font-bold">Flashcards</div>
                    <div className="text-sm opacity-90">Practice mode</div>
                  </div>
                </button>
              </div>
              
              {/* Quiz Summary Card */}
              <div className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-3xl border-2 border-blue-100">
                <h4 className="text-xl font-bold text-gray-900 mb-6 text-center">
                  Quiz Summary
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="text-center p-4 bg-white rounded-xl shadow-sm">
                    <div className="text-2xl font-bold text-gray-900 mb-2">
                      {settings.kanaType === 'hiragana' ? 'ひ' : 'カ'}
                    </div>
                    <div className="text-sm text-gray-600">Kana Type</div>
                  </div>
                  
                  <div className="text-center p-4 bg-white rounded-xl shadow-sm">
                    <div className="text-2xl font-bold text-gray-900 mb-2 capitalize">
                      {settings.mode}
                    </div>
                    <div className="text-sm text-gray-600">Quiz Mode</div>
                  </div>
                  
                  <div className="text-center p-4 bg-white rounded-xl shadow-sm">
                    <div className="text-2xl font-bold text-gray-900 mb-2 capitalize">
                      {settings.difficulty}
                    </div>
                    <div className="text-sm text-gray-600">Difficulty</div>
                  </div>
                  
                  <div className="text-center p-4 bg-white rounded-xl shadow-sm">
                    <div className="text-2xl font-bold text-gray-900 mb-2">
                      {selectedRows.length}
                    </div>
                    <div className="text-sm text-gray-600">Rows Practiced</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
        
        {/* Footer */}
        <footer className="mt-8 text-center">
          <div className="text-gray-500 text-sm">
            <p>Keep practicing to master all {settings.kanaType === 'hiragana' ? 'ひらがな' : 'カタカナ'} characters! 🎯</p>
          </div>
        </footer>
      </div>
      
      {/* Global Styles */}
      <style jsx global>{`
        @keyframes fadeIn {
          from { 
            opacity: 0; 
            transform: translateY(10px); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0); 
          }
        }
        
        @keyframes pulseSlow {
          0%, 100% { 
            opacity: 1; 
            transform: scale(1);
          }
          50% { 
            opacity: 0.9; 
            transform: scale(1.02);
          }
        }
        
        @keyframes bounce {
          0%, 100% { 
            transform: translate(-50%, 0); 
          }
          50% { 
            transform: translate(-50%, -5px); 
          }
        }
        
        .animate-fade-in {
          animation: fadeIn 0.3s ease-out;
        }
        
        .animate-pulse-slow {
          animation: pulseSlow 2s infinite ease-in-out;
        }
        
        .animate-bounce {
          animation: bounce 0.5s ease-in-out;
        }
        
        /* Range input styling */
        .slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          height: 24px;
          width: 24px;
          border-radius: 50%;
          background: linear-gradient(135deg, #3b82f6, #8b5cf6);
          border: 3px solid white;
          box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3);
          cursor: pointer;
          transition: all 0.2s;
        }
        
        .slider::-webkit-slider-thumb:hover {
          transform: scale(1.1);
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
        }
        
        .slider::-moz-range-thumb {
          height: 24px;
          width: 24px;
          border-radius: 50%;
          background: linear-gradient(135deg, #3b82f6, #8b5cf6);
          border: 3px solid white;
          box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3);
          cursor: pointer;
          transition: all 0.2s;
        }
      `}</style>
    </div>
  );
};

export default KanaQuiz;