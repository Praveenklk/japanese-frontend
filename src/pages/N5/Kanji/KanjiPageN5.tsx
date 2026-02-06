import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  Shuffle, 
  Volume2, 
  RotateCw, 
  Grid,
  List as ListIcon,
  X,
  Book, 
  Volume1, 
  PenTool, 
  TrendingUp, 
  CheckCircle, 
  Clock, 
  Bookmark,
  BookmarkCheck,
  Filter,
  ChevronLeft, 
  ChevronRight,
  Search,
  Download,
  Settings,
  AlertCircle,
  Check,
  Circle,
  BarChart3,
  RefreshCw,
  Sparkles,
  Moon,
  Sun,
  Eye,
  EyeOff,
  Hash,
  Layers,
  Star,
  Maximize2,
  Minimize2,
  Award,
  Zap,
  Target,
  HelpCircle,
  Menu,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface KanjiExample {
  word: string;
  reading: string;
  meaning: string;
}

interface Kanji {
  id: number;
  kanji: string;
  meaning: string;
  strokes: number;
  radical: string;
  jlpt: string;
  frequency: number;
  onyomi: string[];
  kunyomi: string[];
  examples: KanjiExample[];
  description: string;
  memoryHint: string;
  mnemonic: string;
  composition: string;
  similarKanji: string[];
  tags: string[];
}

type ViewMode = 'grid' | 'list';
type Difficulty = 'easy' | 'medium' | 'hard';
type StudyStage = 'learning' | 'reviewing' | 'mastered';

interface KanjiProgress {
  kanjiId: number;
  stage: StudyStage;
  lastReviewed: Date;
  nextReview: Date;
  reviewCount: number;
  correctCount: number;
  wrongCount: number;
  masteryScore: number;
  bookmarked: boolean;
  difficulty: Difficulty;
  notes?: string;
}

interface N5KanjiPageProps {
  kanjiData: Kanji[];
}

const N5KanjiPage: React.FC<N5KanjiPageProps> = ({ kanjiData }) => {
  // State Management
  const [kanjiList, setKanjiList] = useState<Kanji[]>([]);
  const [originalOrder, setOriginalOrder] = useState<Kanji[]>([]);
  const [selectedKanji, setSelectedKanji] = useState<Kanji | null>(null);
  const [expandedCardId, setExpandedCardId] = useState<number | null>(null);
  const [shuffled, setShuffled] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [difficultyFilter, setDifficultyFilter] = useState<Difficulty | 'all'>('all');
  const [studyStageFilter, setStudyStageFilter] = useState<StudyStage | 'all'>('all');
  const [bookmarkedFilter, setBookmarkedFilter] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const [showStats, setShowStats] = useState(true);
  const [autoPlayAudio, setAutoPlayAudio] = useState(false);
  const [showTips, setShowTips] = useState(true);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [showMobileStats, setShowMobileStats] = useState(false);

  // Progress Management
  const [progress, setProgress] = useState<Map<number, KanjiProgress>>(new Map());

  // Initialize data
  useEffect(() => {
    if (kanjiData.length > 0) {
      const sortedData = [...kanjiData].sort((a, b) => a.id - b.id);
      setKanjiList(sortedData);
      setOriginalOrder(sortedData);
      
      // Initialize progress for all kanji
      const initialProgress = new Map<number, KanjiProgress>();
      sortedData.forEach(kanji => {
        initialProgress.set(kanji.id, {
          kanjiId: kanji.id,
          stage: Math.random() > 0.7 ? 'reviewing' : 'learning',
          lastReviewed: new Date(),
          nextReview: new Date(Date.now() + Math.random() * 7 * 24 * 60 * 60 * 1000),
          reviewCount: Math.floor(Math.random() * 10),
          correctCount: Math.floor(Math.random() * 8),
          wrongCount: Math.floor(Math.random() * 3),
          masteryScore: Math.floor(Math.random() * 100),
          bookmarked: false,
          difficulty: Math.random() > 0.7 ? 'hard' : Math.random() > 0.4 ? 'medium' : 'easy',
        });
      });
      setProgress(initialProgress);
    }
  }, [kanjiData]);

  // Filtered kanji list
  const filteredKanjiList = useMemo(() => {
    return kanjiList.filter(kanji => {
      const prog = progress.get(kanji.id);
      if (!prog) return true;
      
      // Apply filters
      if (studyStageFilter !== 'all' && prog.stage !== studyStageFilter) return false;
      if (difficultyFilter !== 'all' && prog.difficulty !== difficultyFilter) return false;
      if (bookmarkedFilter && !prog.bookmarked) return false;
      if (searchQuery && !kanji.kanji.includes(searchQuery) && 
          !kanji.meaning.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !kanji.onyomi.some(r => r.includes(searchQuery)) &&
          !kanji.kunyomi.some(r => r.includes(searchQuery))) return false;
      
      return true;
    });
  }, [kanjiList, progress, studyStageFilter, difficultyFilter, bookmarkedFilter, searchQuery]);

  // Core Functions
  const shuffleKanji = useCallback(() => {
    const shuffledList = [...filteredKanjiList].sort(() => Math.random() - 0.5);
    setKanjiList(shuffledList);
    setShuffled(true);
    setSelectedKanji(null);
    setExpandedCardId(null);
  }, [filteredKanjiList]);

  const resetOrder = useCallback(() => {
    setKanjiList([...originalOrder]);
    setShuffled(false);
    setSelectedKanji(null);
    setExpandedCardId(null);
  }, [originalOrder]);

  const markAsMastered = useCallback((kanjiId: number) => {
    setProgress(prev => {
      const newProgress = new Map(prev);
      const currentProg = newProgress.get(kanjiId)!;
      newProgress.set(kanjiId, {
        ...currentProg,
        stage: 'mastered',
        masteryScore: 100,
        lastReviewed: new Date(),
        nextReview: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      });
      return newProgress;
    });
  }, []);

  const toggleBookmark = useCallback((kanjiId: number, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }
    setProgress(prev => {
      const newProgress = new Map(prev);
      const currentProg = newProgress.get(kanjiId)!;
      newProgress.set(kanjiId, {
        ...currentProg,
        bookmarked: !currentProg.bookmarked
      });
      return newProgress;
    });
  }, []);

  const playAudio = useCallback((text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ja-JP';
      utterance.rate = 0.8;
      utterance.pitch = 1;
      speechSynthesis.speak(utterance);
    }
  }, []);

  const getKanjiColor = useCallback((kanji: Kanji) => {
    const colors = [
      'from-red-400 to-pink-500',
      'from-blue-400 to-cyan-500',
      'from-green-400 to-emerald-500',
      'from-purple-400 to-violet-500',
      'from-orange-400 to-yellow-500',
      'from-indigo-400 to-blue-500',
      'from-pink-400 to-rose-500',
      'from-teal-400 to-green-500',
    ];
    const index = (kanji.id - 1) % colors.length;
    return colors[index];
  }, []);

  const getDifficultyColor = useCallback((difficulty: Difficulty) => {
    const lightColors = {
      easy: 'bg-green-100 text-green-700 border border-green-200',
      medium: 'bg-yellow-100 text-yellow-700 border border-yellow-200',
      hard: 'bg-red-100 text-red-700 border border-red-200'
    };
    const darkColors = {
      easy: 'bg-green-900/30 text-green-300 border border-green-700/30',
      medium: 'bg-yellow-900/30 text-yellow-300 border border-yellow-700/30',
      hard: 'bg-red-900/30 text-red-300 border border-red-700/30'
    };
    return darkMode ? darkColors[difficulty] : lightColors[difficulty];
  }, [darkMode]);

  const getStageColor = useCallback((stage: StudyStage) => {
    const lightColors = {
      learning: 'bg-blue-100 text-blue-700 border border-blue-200',
      reviewing: 'bg-purple-100 text-purple-700 border border-purple-200',
      mastered: 'bg-green-100 text-green-700 border border-green-200'
    };
    const darkColors = {
      learning: 'bg-blue-900/30 text-blue-300 border border-blue-700/30',
      reviewing: 'bg-purple-900/30 text-purple-300 border border-purple-700/30',
      mastered: 'bg-green-900/30 text-green-300 border border-green-700/30'
    };
    return darkMode ? darkColors[stage] : lightColors[stage];
  }, [darkMode]);

  const getStageIcon = useCallback((stage: StudyStage) => {
    switch(stage) {
      case 'learning': return '📚';
      case 'reviewing': return '🔄';
      case 'mastered': return '🎯';
    }
  }, []);

  // Stats Calculation
  const stats = useMemo(() => {
    const total = kanjiList.length;
    const mastered = Array.from(progress.values()).filter(p => p.stage === 'mastered').length;
    const learning = Array.from(progress.values()).filter(p => p.stage === 'learning').length;
    const reviewing = Array.from(progress.values()).filter(p => p.stage === 'reviewing').length;
    const bookmarked = Array.from(progress.values()).filter(p => p.bookmarked).length;
    const averageMastery = Array.from(progress.values()).reduce((acc, p) => acc + p.masteryScore, 0) / total;
    
    const dueForReview = Array.from(progress.values()).filter(p => 
      new Date(p.nextReview) <= new Date()
    ).length;

    return {
      total,
      mastered,
      learning,
      reviewing,
      bookmarked,
      averageMastery,
      dueForReview,
      masteryPercentage: (mastered / total) * 100
    };
  }, [kanjiList.length, progress]);

  // Mobile Toggle Handlers
  const toggleMobileFilters = useCallback(() => {
    setShowMobileFilters(!showMobileFilters);
    if (showMobileStats) setShowMobileStats(false);
  }, [showMobileFilters, showMobileStats]);

  const toggleMobileStats = useCallback(() => {
    setShowMobileStats(!showMobileStats);
    if (showMobileFilters) setShowMobileFilters(false);
  }, [showMobileStats, showMobileFilters]);

  // Kanji Card Component for Grid View
  const KanjiGridCard = ({ kanji }: { kanji: Kanji }) => {
    const prog = progress.get(kanji.id);
    const gradientColor = getKanjiColor(kanji);

    const handleCardClick = () => {
      setExpandedCardId(kanji.id);
      setSelectedKanji(kanji);
      if (autoPlayAudio) {
        playAudio(kanji.kanji);
      }
    };

    return (
      <div 
        onClick={handleCardClick}
        className={`group relative overflow-hidden rounded-xl cursor-pointer transition-all duration-200 hover:scale-[1.02] hover:shadow-lg active:scale-[0.98] ${
          darkMode ? 'bg-gray-800 hover:bg-gray-700 border border-gray-700' : 'bg-white hover:bg-gray-50 border border-gray-200'
        }`}
      >
        {/* Card Header */}
        <div className={`h-20 sm:h-24 bg-gradient-to-r ${gradientColor} relative overflow-hidden`}>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-3xl sm:text-4xl md:text-5xl font-bold text-white drop-shadow-lg">{kanji.kanji}</div>
          </div>
          
          {/* Bookmark Button - Top Right */}
          <button
            onClick={(e) => toggleBookmark(kanji.id, e)}
            className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 p-1 sm:p-1.5 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors"
            title={prog?.bookmarked ? "Remove bookmark" : "Add bookmark"}
          >
            {prog?.bookmarked ? (
              <BookmarkCheck size={16} className="text-yellow-300" />
            ) : (
              <Bookmark size={16} className="text-white/80" />
            )}
          </button>
          
          {/* Strokes Badge */}
          <div className="absolute bottom-1.5 left-1.5 sm:bottom-2 sm:left-2">
            <div className="px-1.5 py-0.5 sm:px-2 sm:py-1 bg-black/20 backdrop-blur-sm rounded-full text-xs text-white font-medium">
              {kanji.strokes} strokes
            </div>
          </div>
        </div>

        {/* Card Body */}
        <div className="p-3 sm:p-4">
          <div className="flex justify-between items-start mb-2">
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-sm sm:text-base md:text-lg mb-1 truncate">{kanji.meaning}</h3>
              <div className={`flex items-center gap-1 text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                <span className="truncate">{kanji.jlpt}</span>
                <span>•</span>
                <span>{kanji.radical}</span>
              </div>
            </div>
            <div className={`px-2 py-1 rounded-full text-xs font-medium ml-2 ${getStageColor(prog?.stage || 'learning')}`}>
              {getStageIcon(prog?.stage || 'learning')}
            </div>
          </div>

          <div className="space-y-1.5 mb-3">
            <div className="flex items-center gap-1 text-xs">
              <span className={`font-medium ${darkMode ? 'text-red-300' : 'text-red-600'}`}>On:</span>
              <span className={`truncate ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                {kanji.onyomi.slice(0, 2).join('、')}
              </span>
            </div>
            <div className="flex items-center gap-1 text-xs">
              <span className={`font-medium ${darkMode ? 'text-blue-300' : 'text-blue-600'}`}>Kun:</span>
              <span className={`truncate ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                {kanji.kunyomi.slice(0, 2).join('、')}
              </span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-3">
            <div className="flex justify-between text-xs mb-1">
              <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Mastery</span>
              <span className={`font-medium ${darkMode ? 'text-gray-300' : 'text-gray-800'}`}>
                {prog?.masteryScore || 0}%
              </span>
            </div>
            <div className={`h-1.5 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded-full overflow-hidden`}>
              <div 
                className={`h-full rounded-full transition-all duration-500 ${
                  (prog?.masteryScore || 0) >= 80 ? 'bg-gradient-to-r from-green-400 to-emerald-400' :
                  (prog?.masteryScore || 0) >= 50 ? 'bg-gradient-to-r from-yellow-400 to-orange-400' :
                  'bg-gradient-to-r from-red-400 to-pink-400'
                }`}
                style={{ width: `${prog?.masteryScore || 0}%` }}
              />
            </div>
          </div>

          <div className="flex justify-between items-center">
            <div className={`px-2 py-0.5 sm:py-1 rounded-full text-xs font-medium ${getDifficultyColor(prog?.difficulty || 'medium')}`}>
              {prog?.difficulty}
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                playAudio(kanji.kanji);
              }}
              className={`p-1 sm:p-1.5 rounded-full transition-colors ${
                darkMode 
                  ? 'hover:bg-gray-700 text-gray-300' 
                  : 'hover:bg-gray-100 text-gray-600'
              }`}
              title="Play pronunciation"
            >
              <Volume2 size={14} />
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Kanji List Row Component
  const KanjiListRow = ({ kanji }: { kanji: Kanji }) => {
    const prog = progress.get(kanji.id);

    const handleRowClick = () => {
      setExpandedCardId(kanji.id);
      setSelectedKanji(kanji);
      if (autoPlayAudio) {
        playAudio(kanji.kanji);
      }
    };

    return (
      <div 
        onClick={handleRowClick}
        className={`flex items-center gap-2 sm:gap-3 p-3 rounded-lg cursor-pointer transition-colors hover:scale-[1.01] active:scale-[0.99] ${
          darkMode 
            ? 'bg-gray-800 hover:bg-gray-700 border border-gray-700' 
            : 'bg-white hover:bg-gray-50 border border-gray-200'
        }`}
      >
        {/* Kanji Character */}
        <div className={`w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-lg bg-gradient-to-r ${getKanjiColor(kanji)} flex items-center justify-center flex-shrink-0`}>
          <div className="text-xl sm:text-2xl md:text-3xl font-bold text-white">{kanji.kanji}</div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <h3 className={`font-bold text-sm sm:text-base truncate ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                {kanji.meaning}
              </h3>
              <div className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStageColor(prog?.stage || 'learning')}`}>
                {prog?.stage === 'mastered' ? '✓' :
                 prog?.stage === 'reviewing' ? '↻' : '📚'}
              </div>
            </div>
            <button
              onClick={(e) => toggleBookmark(kanji.id, e)}
              className={`p-1 hover:opacity-70 transition-opacity ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}
              title={prog?.bookmarked ? "Remove bookmark" : "Add bookmark"}
            >
              {prog?.bookmarked ? (
                <BookmarkCheck size={14} className="text-yellow-500" />
              ) : (
                <Bookmark size={14} />
              )}
            </button>
          </div>
          
          <div className="flex flex-wrap items-center gap-1 sm:gap-2 text-xs">
            <div className="flex items-center gap-0.5">
              <span className={`font-medium ${darkMode ? 'text-red-300' : 'text-red-600'}`}>On:</span>
              <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
                {kanji.onyomi.slice(0, 1).join('、')}
              </span>
            </div>
            <div className="flex items-center gap-0.5">
              <span className={`font-medium ${darkMode ? 'text-blue-300' : 'text-blue-600'}`}>Kun:</span>
              <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
                {kanji.kunyomi.slice(0, 1).join('、')}
              </span>
            </div>
            <div className={`px-1.5 py-0.5 rounded-full text-xs font-medium ${getDifficultyColor(prog?.difficulty || 'medium')}`}>
              {prog?.difficulty.charAt(0).toUpperCase()}
            </div>
            <div className="flex items-center gap-1">
              <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>{kanji.strokes}s</span>
              <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>•</span>
              <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>{kanji.radical}</span>
            </div>
          </div>
        </div>

        {/* Progress Bar - Mobile Hidden */}
        <div className="hidden sm:block w-20 md:w-24">
          <div className="flex justify-between text-xs mb-1">
            <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Mastery</span>
            <span className={`font-medium ${darkMode ? 'text-gray-300' : 'text-gray-800'}`}>
              {prog?.masteryScore || 0}%
            </span>
          </div>
          <div className={`h-1.5 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded-full overflow-hidden`}>
            <div 
              className={`h-full rounded-full transition-all duration-500 ${
                (prog?.masteryScore || 0) >= 80 ? 'bg-green-400' :
                (prog?.masteryScore || 0) >= 50 ? 'bg-yellow-400' : 'bg-red-400'
              }`}
              style={{ width: `${prog?.masteryScore || 0}%` }}
            />
          </div>
        </div>
      </div>
    );
  };

  // Expanded Modal Component
  const KanjiModal = () => {
    if (!selectedKanji) return null;
    
    const prog = progress.get(selectedKanji.id);
    const gradientColor = getKanjiColor(selectedKanji);

    const handleClose = () => {
      setExpandedCardId(null);
      setSelectedKanji(null);
    };

    return (
      <div 
        className={`fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 ${darkMode ? 'bg-black bg-opacity-75' : 'bg-black bg-opacity-50'}`}
        onClick={handleClose}
      >
        <div 
          className={`relative w-full max-w-2xl lg:max-w-3xl max-h-[90vh] sm:max-h-[85vh] overflow-y-auto rounded-xl sm:rounded-2xl shadow-2xl ${
            darkMode ? 'bg-gray-900 border border-gray-700' : 'bg-white border border-gray-200'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className={`p-4 sm:p-6 rounded-t-xl sm:rounded-t-2xl bg-gradient-to-r ${gradientColor} sticky top-0 z-10`}>
            <div className="flex justify-between items-start">
              <div className="flex-1 min-w-0">
                <div className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-2">{selectedKanji.kanji}</div>
                <div className="text-lg sm:text-xl font-semibold text-white/90">{selectedKanji.meaning}</div>
              </div>
              <div className="flex gap-2 ml-4">
                <button
                  onClick={(e) => toggleBookmark(selectedKanji.id, e)}
                  className="p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors"
                  title={prog?.bookmarked ? "Remove bookmark" : "Add bookmark"}
                >
                  {prog?.bookmarked ? (
                    <BookmarkCheck className="text-yellow-300" size={20} />
                  ) : (
                    <Bookmark className="text-white" size={20} />
                  )}
                </button>
                <button
                  onClick={handleClose}
                  className="p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors"
                  title="Close"
                >
                  <X className="text-white" size={20} />
                </button>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-4 sm:p-6 md:p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              {/* Left Column */}
              <div className="space-y-4 sm:space-y-6">
                {/* Stats Grid */}
                <div className="grid grid-cols-3 gap-2 sm:gap-4">
                  <div className={`p-3 sm:p-4 rounded-lg ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-gray-50 border border-gray-200'}`}>
                    <div className={`text-xs sm:text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Strokes</div>
                    <div className={`text-xl sm:text-2xl font-bold ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                      {selectedKanji.strokes}
                    </div>
                  </div>
                  <div className={`p-3 sm:p-4 rounded-lg ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-gray-50 border border-gray-200'}`}>
                    <div className={`text-xs sm:text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Radical</div>
                    <div className={`text-xl sm:text-2xl font-bold ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                      {selectedKanji.radical}
                    </div>
                  </div>
                  <div className={`p-3 sm:p-4 rounded-lg ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-gray-50 border border-gray-200'}`}>
                    <div className={`text-xs sm:text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>JLPT Level</div>
                    <div className={`text-xl sm:text-2xl font-bold ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                      {selectedKanji.jlpt}
                    </div>
                  </div>
                </div>

                {/* Readings */}
                <div>
                  <h3 className="text-base sm:text-lg font-semibold mb-3 flex items-center gap-2">
                    <Volume1 size={16} className={darkMode ? 'text-blue-300' : 'text-blue-600'} />
                    <span className={darkMode ? 'text-gray-100' : 'text-gray-900'}>Readings</span>
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <div className={`text-xs sm:text-sm font-medium ${darkMode ? 'text-red-300' : 'text-red-600'} mb-2`}>
                        On'yomi (音読み)
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {selectedKanji.onyomi.map((reading, idx) => (
                          <button
                            key={idx}
                            onClick={() => playAudio(reading)}
                            className={`px-2 py-1.5 sm:px-3 sm:py-2 rounded-lg font-medium text-xs sm:text-sm transition-transform hover:scale-105 ${
                              darkMode 
                                ? 'bg-red-900/30 text-red-300 hover:bg-red-900/40' 
                                : 'bg-red-100 text-red-700 hover:bg-red-200'
                            }`}
                            title="Click to hear pronunciation"
                          >
                            {reading}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <div className={`text-xs sm:text-sm font-medium ${darkMode ? 'text-blue-300' : 'text-blue-600'} mb-2`}>
                        Kun'yomi (訓読み)
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {selectedKanji.kunyomi.map((reading, idx) => (
                          <button
                            key={idx}
                            onClick={() => playAudio(reading)}
                            className={`px-2 py-1.5 sm:px-3 sm:py-2 rounded-lg font-medium text-xs sm:text-sm transition-transform hover:scale-105 ${
                              darkMode 
                                ? 'bg-blue-900/30 text-blue-300 hover:bg-blue-900/40' 
                                : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                            }`}
                            title="Click to hear pronunciation"
                          >
                            {reading}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <h3 className="text-base sm:text-lg font-semibold mb-3 flex items-center gap-2">
                    <Layers size={16} className={darkMode ? 'text-green-300' : 'text-green-600'} />
                    <span className={darkMode ? 'text-gray-100' : 'text-gray-900'}>Description</span>
                  </h3>
                  <p className={`${darkMode ? 'text-gray-300' : 'text-gray-700'} text-xs sm:text-sm leading-relaxed`}>
                    {selectedKanji.description}
                  </p>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-4 sm:space-y-6">
                {/* Examples */}
                <div>
                  <h3 className="text-base sm:text-lg font-semibold mb-3 flex items-center gap-2">
                    <Book size={16} className={darkMode ? 'text-purple-300' : 'text-purple-600'} />
                    <span className={darkMode ? 'text-gray-100' : 'text-gray-900'}>Examples</span>
                  </h3>
                  <div className="space-y-2 sm:space-y-3">
                    {selectedKanji.examples.slice(0, 3).map((example, idx) => (
                      <div 
                        key={idx}
                        className={`p-3 sm:p-4 rounded-lg transition-transform hover:scale-[1.01] ${
                          darkMode 
                            ? 'bg-gray-800 hover:bg-gray-700 border border-gray-700' 
                            : 'bg-gray-50 hover:bg-gray-100 border border-gray-200'
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1 min-w-0">
                            <div className={`text-base sm:text-lg font-bold mb-1 ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                              {example.word}
                            </div>
                            <div className={`text-xs sm:text-sm mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                              {example.reading}
                            </div>
                            <div className={`text-xs sm:text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                              {example.meaning}
                            </div>
                          </div>
                          <button
                            onClick={() => playAudio(example.word)}
                            className="p-1.5 sm:p-2 hover:opacity-80 transition-opacity ml-2"
                            title="Play pronunciation"
                          >
                            <Volume2 size={14} className={darkMode ? 'text-gray-400' : 'text-gray-600'} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Memory Aid */}
                <div>
                  <h3 className="text-base sm:text-lg font-semibold mb-3 flex items-center gap-2">
                    <Sparkles size={16} className={darkMode ? 'text-yellow-300' : 'text-yellow-600'} />
                    <span className={darkMode ? 'text-gray-100' : 'text-gray-900'}>Memory Aid</span>
                  </h3>
                  <div className="space-y-2">
                    <div>
                      <div className={`text-xs sm:text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Memory Hint
                      </div>
                      <p className={`${darkMode ? 'text-gray-300' : 'text-gray-700'} text-xs sm:text-sm leading-relaxed`}>
                        {selectedKanji.memoryHint}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Progress Controls */}
            <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-gray-200 dark:border-gray-700">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                  <div>
                    <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Mastery</div>
                    <div className={`text-lg sm:text-xl font-bold ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                      {prog?.masteryScore || 0}%
                    </div>
                  </div>
                  <div>
                    <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Reviews</div>
                    <div className={`text-lg sm:text-xl font-bold ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                      {prog?.reviewCount || 0}
                    </div>
                  </div>
                  <div>
                    <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Accuracy</div>
                    <div className={`text-lg sm:text-xl font-bold ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                      {prog?.reviewCount ? 
                        Math.round((prog.correctCount / prog.reviewCount) * 100) : 
                        0}%
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {prog?.stage !== 'mastered' && (
                    <button
                      onClick={() => markAsMastered(selectedKanji.id)}
                      className="px-3 py-2 sm:px-4 sm:py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg font-medium hover:opacity-90 transition-opacity flex items-center gap-2 text-xs sm:text-sm"
                    >
                      <Check size={14} />
                      Mark as Mastered
                    </button>
                  )}
                  <button
                    onClick={() => {
                      setStudyStageFilter(prog?.stage || 'learning');
                      handleClose();
                    }}
                    className={`px-3 py-2 sm:px-4 sm:py-2 rounded-lg font-medium text-xs sm:text-sm ${getStageColor(prog?.stage || 'learning')}`}
                  >
                    {prog?.stage === 'mastered' ? '✓ Mastered' :
                     prog?.stage === 'reviewing' ? 'Reviewing' : 'Learning'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Stats Panel Component
  const StatsPanel = ({ mobile = false }: { mobile?: boolean }) => {
    return (
      <div className={`rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-6 shadow-lg ${
        darkMode 
          ? 'bg-gray-800 border border-gray-700' 
          : 'bg-white border border-gray-200'
      }`}>
        <div className="flex justify-between items-center mb-3 sm:mb-4">
          <h3 className="font-bold flex items-center gap-2 text-sm sm:text-base">
            <BarChart3 size={16} className={darkMode ? 'text-blue-300' : 'text-blue-600'} />
            <span className={darkMode ? 'text-gray-100' : 'text-gray-900'}>Progress</span>
          </h3>
          {!mobile && (
            <button
              onClick={() => setShowStats(!showStats)}
              className={`p-1 hover:opacity-70 transition-opacity ${
                darkMode ? 'text-gray-400' : 'text-gray-600'
              }`}
              title={showStats ? "Hide stats" : "Show stats"}
            >
              {showStats ? <EyeOff size={14} /> : <Eye size={14} />}
            </button>
          )}
        </div>

        {(showStats || mobile) && (
          <div className="space-y-3 sm:space-y-4">
            {/* Mastery Progress */}
            <div>
              <div className="flex justify-between text-xs mb-1 sm:mb-2">
                <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                  Overall Mastery
                </span>
                <span className={`font-bold ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                  {stats.masteryPercentage.toFixed(1)}%
                </span>
              </div>
              <div className={`h-2 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded-full overflow-hidden`}>
                <div 
                  className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"
                  style={{ width: `${stats.masteryPercentage}%` }}
                />
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-2 sm:gap-3">
              <div className={`p-2 sm:p-3 rounded-lg ${darkMode ? 'bg-gray-700 border border-gray-600' : 'bg-blue-50 border border-blue-200'}`}>
                <div className="flex items-center gap-1 sm:gap-2 mb-1">
                  <CheckCircle size={12} className="text-green-500" />
                  <span className={`text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Mastered
                  </span>
                </div>
                <div className={`text-base sm:text-lg font-bold ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                  {stats.mastered}
                </div>
                <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {((stats.mastered / stats.total) * 100).toFixed(0)}%
                </div>
              </div>

              <div className={`p-2 sm:p-3 rounded-lg ${darkMode ? 'bg-gray-700 border border-gray-600' : 'bg-purple-50 border border-purple-200'}`}>
                <div className="flex items-center gap-1 sm:gap-2 mb-1">
                  <Target size={12} className="text-purple-500" />
                  <span className={`text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Reviewing
                  </span>
                </div>
                <div className={`text-base sm:text-lg font-bold ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                  {stats.reviewing}
                </div>
                <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {((stats.reviewing / stats.total) * 100).toFixed(0)}%
                </div>
              </div>

              <div className={`p-2 sm:p-3 rounded-lg ${darkMode ? 'bg-gray-700 border border-gray-600' : 'bg-yellow-50 border border-yellow-200'}`}>
                <div className="flex items-center gap-1 sm:gap-2 mb-1">
                  <Clock size={12} className="text-yellow-500" />
                  <span className={`text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Due Review
                  </span>
                </div>
                <div className={`text-base sm:text-lg font-bold ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                  {stats.dueForReview}
                </div>
                <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Ready
                </div>
              </div>

              <div className={`p-2 sm:p-3 rounded-lg ${darkMode ? 'bg-gray-700 border border-gray-600' : 'bg-pink-50 border border-pink-200'}`}>
                <div className="flex items-center gap-1 sm:gap-2 mb-1">
                  <Bookmark size={12} className="text-pink-500" />
                  <span className={`text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Bookmarked
                  </span>
                </div>
                <div className={`text-base sm:text-lg font-bold ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                  {stats.bookmarked}
                </div>
                <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {((stats.bookmarked / stats.total) * 100).toFixed(0)}%
                </div>
              </div>
            </div>

            {/* Quick Actions - Hidden on mobile */}
            {!mobile && (
              <div className="pt-3 sm:pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className={`text-xs font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Quick Actions
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={shuffleKanji}
                    className="px-2 py-1.5 sm:px-3 sm:py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg text-xs font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-1"
                  >
                    <Shuffle size={10} />
                    Shuffle
                  </button>
                  <button
                    onClick={() => setBookmarkedFilter(!bookmarkedFilter)}
                    className={`px-2 py-1.5 sm:px-3 sm:py-2 rounded-lg text-xs font-medium flex items-center justify-center gap-1 ${
                      bookmarkedFilter 
                        ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300' 
                        : darkMode 
                          ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <Bookmark size={10} />
                    Bookmarks
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  // Filters Panel Component
  const FiltersPanel = ({ mobile = false }: { mobile?: boolean }) => {
    return (
      <div className={`rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-6 shadow-lg ${
        darkMode 
          ? 'bg-gray-800 border border-gray-700' 
          : 'bg-white border border-gray-200'
      }`}>
        <h3 className={`font-bold mb-3 sm:mb-4 flex items-center gap-2 text-sm sm:text-base ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>
          <Filter size={16} className={darkMode ? 'text-blue-300' : 'text-blue-600'} />
          Filters
        </h3>
        
        <div className="space-y-3 sm:space-y-4">
          {/* Search */}
          <div>
            <div className="relative">
              <Search className={`absolute left-2.5 top-1/2 transform -translate-y-1/2 ${
                darkMode ? 'text-gray-400' : 'text-gray-500'
              }`} size={14} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search kanji..."
                className={`w-full pl-8 pr-3 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 text-sm transition-all ${
                  darkMode 
                    ? 'bg-gray-700 text-white placeholder-gray-400 border-gray-600 focus:border-blue-500' 
                    : 'bg-gray-50 text-gray-900 placeholder-gray-500 border-gray-300 focus:border-blue-500'
                }`}
              />
            </div>
          </div>

          {/* Study Stage Filter */}
          <div>
            <div className={`text-xs font-medium mb-1.5 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Study Stage
            </div>
            <div className="flex flex-wrap gap-1.5">
              {['all', 'learning', 'reviewing', 'mastered'].map((stage) => (
                <button
                  key={stage}
                  onClick={() => setStudyStageFilter(stage as any)}
                  className={`px-2.5 py-1 rounded-full text-xs font-medium transition-all ${
                    studyStageFilter === stage
                      ? stage === 'mastered' ? 'bg-green-500 text-white' :
                        stage === 'reviewing' ? 'bg-purple-500 text-white' :
                        stage === 'learning' ? 'bg-blue-500 text-white' :
                        darkMode ? 'bg-gray-700 text-white' : 'bg-gray-800 text-white'
                      : darkMode 
                        ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {stage === 'all' ? 'All' :
                   stage === 'mastered' ? '✓' :
                   stage === 'reviewing' ? '↻' : '📚'}
                </button>
              ))}
            </div>
          </div>

          {/* Difficulty Filter */}
          <div>
            <div className={`text-xs font-medium mb-1.5 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Difficulty
            </div>
            <div className="flex flex-wrap gap-1.5">
              {['all', 'easy', 'medium', 'hard'].map((diff) => (
                <button
                  key={diff}
                  onClick={() => setDifficultyFilter(diff as any)}
                  className={`px-2.5 py-1 rounded-full text-xs font-medium transition-all ${
                    difficultyFilter === diff
                      ? diff === 'easy' ? 'bg-green-500 text-white' :
                        diff === 'medium' ? 'bg-yellow-500 text-white' :
                        diff === 'hard' ? 'bg-red-500 text-white' :
                        darkMode ? 'bg-gray-700 text-white' : 'bg-gray-800 text-white'
                      : darkMode 
                        ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {diff === 'all' ? 'All' :
                   diff === 'easy' ? 'Easy' :
                   diff === 'medium' ? 'Med' : 'Hard'}
                </button>
              ))}
            </div>
          </div>

          {/* View Mode Toggle */}
          <div>
            <div className={`text-xs font-medium mb-1.5 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              View Mode
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  viewMode === 'grid'
                    ? 'bg-blue-500 text-white'
                    : darkMode 
                      ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Grid size={12} />
                Grid
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  viewMode === 'list'
                    ? 'bg-blue-500 text-white'
                    : darkMode 
                      ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <ListIcon size={12} />
                List
              </button>
            </div>
          </div>

          {/* Toggle Switches */}
          <div className="space-y-2.5 pt-3 border-t border-gray-200 dark:border-gray-700">
            <label className="flex items-center justify-between cursor-pointer">
              <div className="flex items-center gap-1.5">
                <Volume2 size={12} className={darkMode ? 'text-gray-300' : 'text-gray-600'} />
                <span className={`text-xs ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Auto-play audio
                </span>
              </div>
              <input
                type="checkbox"
                checked={autoPlayAudio}
                onChange={(e) => setAutoPlayAudio(e.target.checked)}
                className="toggle-switch"
              />
            </label>
            <label className="flex items-center justify-between cursor-pointer">
              <div className="flex items-center gap-1.5">
                {darkMode ? (
                  <Sun size={12} className="text-yellow-300" />
                ) : (
                  <Moon size={12} className="text-gray-600" />
                )}
                <span className={`text-xs ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  {darkMode ? 'Light mode' : 'Dark mode'}
                </span>
              </div>
              <input
                type="checkbox"
                checked={darkMode}
                onChange={(e) => setDarkMode(e.target.checked)}
                className="toggle-switch"
              />
            </label>
          </div>

          {/* Mobile Close Button */}
          {mobile && (
            <button
              onClick={() => setShowMobileFilters(false)}
              className={`w-full mt-4 py-2 px-4 rounded-lg font-medium text-sm ${
                darkMode 
                  ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Close Filters
            </button>
          )}
        </div>
      </div>
    );
  };

  // Mobile Controls
  const MobileControls = () => {
    return (
      <div className={`lg:hidden fixed bottom-4 left-4 right-4 z-30 flex justify-center`}>
        <div className={`flex items-center justify-between gap-2 p-2 rounded-full shadow-xl ${
          darkMode 
            ? 'bg-gray-800 border border-gray-700' 
            : 'bg-white border border-gray-200'
        }`}>
          <button
            onClick={toggleMobileFilters}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-medium transition-all ${
              showMobileFilters
                ? 'bg-blue-500 text-white'
                : darkMode 
                  ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Filter size={12} />
            Filters
          </button>
          <button
            onClick={toggleMobileStats}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-medium transition-all ${
              showMobileStats
                ? 'bg-blue-500 text-white'
                : darkMode 
                  ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <BarChart3 size={12} />
            Stats
          </button>
          <button
            onClick={shuffleKanji}
            className="flex items-center gap-1.5 px-3 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full text-xs font-medium hover:opacity-90 transition-opacity"
          >
            <Shuffle size={12} />
            Shuffle
          </button>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="flex items-center gap-1.5 px-3 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full text-xs font-medium hover:opacity-90 transition-opacity"
          >
            {darkMode ? <Sun size={12} /> : <Moon size={12} />}
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 pb-16 lg:pb-0 ${
      darkMode 
        ? 'bg-gray-900 text-gray-100' 
        : 'bg-gradient-to-b from-gray-50 to-blue-50 text-gray-900'
    }`}>
      {/* Header */}
      <header className={`sticky top-0 z-40 backdrop-blur-sm border-b ${
        darkMode 
          ? 'bg-gray-900/95 border-gray-800' 
          : 'bg-white/95 border-gray-200'
      }`}>
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-2 sm:py-3">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-xl lg:text-2xl font-bold truncate">
                  JLPT N5 Kanji Master
                </h1>
                <span className="bg-gradient-to-r from-red-500 to-orange-500 text-white px-1.5 sm:px-2 py-0.5 sm:py-1 rounded text-xs sm:text-sm font-medium">
                  N5
                </span>
              </div>
              <p className={`mt-0.5 text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {filteredKanjiList.length} kanji {searchQuery && '(filtered)'}
              </p>
            </div>
            
            <div className="hidden lg:flex flex-wrap gap-2">
              <button
                onClick={shuffleKanji}
                className="px-3 py-1.5 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg hover:opacity-90 transition-opacity flex items-center gap-1 text-xs"
                title="Shuffle kanji"
              >
                <Shuffle size={12} />
                Shuffle
              </button>
              {shuffled && (
                <button
                  onClick={resetOrder}
                  className="px-3 py-1.5 bg-gradient-to-r from-gray-500 to-gray-700 text-white rounded-lg hover:opacity-90 transition-opacity flex items-center gap-1 text-xs"
                  title="Reset to original order"
                >
                  <RefreshCw size={12} />
                  Reset
                </button>
              )}
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="px-3 py-1.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:opacity-90 transition-opacity flex items-center gap-1 text-xs"
                title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
              >
                {darkMode ? <Sun size={12} /> : <Moon size={12} />}
                Theme
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-3 sm:py-4 lg:py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
          {/* Left Column - Filters & Stats (Desktop) */}
          <div className="hidden lg:block lg:col-span-1 space-y-4 lg:space-y-6">
            <FiltersPanel />
            <StatsPanel />
            
            {/* Tips */}
            {showTips && (
              <div className={`rounded-xl p-4 shadow-lg ${
                darkMode 
                  ? 'bg-gray-800 border border-gray-700' 
                  : 'bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-200'
              }`}>
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold flex items-center gap-1.5 text-sm">
                    <HelpCircle size={14} className={darkMode ? 'text-blue-300' : 'text-blue-600'} />
                    <span className={darkMode ? 'text-gray-100' : 'text-gray-900'}>How to Use</span>
                  </h3>
                  <button
                    onClick={() => setShowTips(false)}
                    className={`p-0.5 hover:opacity-70 transition-opacity ${
                      darkMode ? 'text-gray-400' : 'text-gray-600'
                    }`}
                    title="Hide tips"
                  >
                    <X size={12} />
                  </button>
                </div>
                <ul className="space-y-1.5 text-xs">
                  <li className="flex items-start gap-1.5">
                    <div className="mt-0.5">•</div>
                    <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
                      Click any card to expand details
                    </span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <div className="mt-0.5">•</div>
                    <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
                      Bookmark important kanji
                    </span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <div className="mt-0.5">•</div>
                    <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
                      Click speaker icons for pronunciation
                    </span>
                  </li>
                </ul>
              </div>
            )}
          </div>

          {/* Mobile Panels Overlay */}
          {(showMobileFilters || showMobileStats) && (
            <div className="lg:hidden fixed inset-0 z-40 bg-black bg-opacity-50" onClick={() => {
              setShowMobileFilters(false);
              setShowMobileStats(false);
            }}>
              <div className="absolute bottom-0 left-0 right-0 max-h-[70vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                <div className={`p-4 rounded-t-2xl ${
                  darkMode ? 'bg-gray-800' : 'bg-white'
                }`}>
                  {showMobileFilters ? <FiltersPanel mobile /> : <StatsPanel mobile />}
                </div>
              </div>
            </div>
          )}

          {/* Right Column - Kanji Content */}
          <div className="lg:col-span-3">
            {/* Content Header */}
            <div className={`mb-3 sm:mb-4 p-3 rounded-lg shadow-lg ${
              darkMode 
                ? 'bg-gray-800 border border-gray-700' 
                : 'bg-white border border-gray-200'
            }`}>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <div className="flex-1 min-w-0">
                  <h2 className={`text-base sm:text-lg font-bold ${
                    darkMode ? 'text-gray-100' : 'text-gray-900'
                  }`}>
                    {viewMode === 'grid' ? 'Kanji Collection' : 'Kanji List'}
                  </h2>
                  <div className="flex items-center gap-2 mt-1">
                    <div className={`text-xs ${
                      darkMode ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      {filteredKanjiList.length} of {kanjiList.length} kanji
                    </div>
                    {bookmarkedFilter && (
                      <span className="px-1.5 py-0.5 bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300 rounded-full text-xs font-medium flex items-center gap-0.5">
                        <Bookmark size={10} />
                        <span className="hidden sm:inline">Bookmarks</span>
                        <span className="sm:hidden">B</span>
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="hidden sm:flex gap-1">
                    {['grid', 'list'].map((mode) => (
                      <button
                        key={mode}
                        onClick={() => setViewMode(mode as ViewMode)}
                        className={`p-1.5 rounded transition-colors ${
                          viewMode === mode
                            ? darkMode 
                              ? 'bg-gray-700 text-gray-100' 
                              : 'bg-gray-200 text-gray-900'
                            : darkMode 
                              ? 'text-gray-400 hover:text-gray-300' 
                              : 'text-gray-600 hover:text-gray-900'
                        }`}
                        title={`Switch to ${mode} view`}
                      >
                        {mode === 'grid' ? <Grid size={16} /> : <ListIcon size={16} />}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Kanji Content */}
            {filteredKanjiList.length === 0 ? (
              <div className={`rounded-lg p-6 text-center shadow-lg ${
                darkMode 
                  ? 'bg-gray-800 border border-gray-700' 
                  : 'bg-white border border-gray-200'
              }`}>
                <div className="text-3xl mb-3">🎌</div>
                <h3 className={`text-base font-bold mb-1 ${
                  darkMode ? 'text-gray-100' : 'text-gray-900'
                }`}>
                  No kanji found
                </h3>
                <p className={`text-xs ${
                  darkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Try adjusting your filters or search terms
                </p>
              </div>
            ) : viewMode === 'grid' ? (
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3 lg:gap-4">
                {filteredKanjiList.map((kanji) => (
                  <KanjiGridCard key={kanji.id} kanji={kanji} />
                ))}
              </div>
            ) : (
              <div className={`rounded-lg overflow-hidden shadow-lg ${
                darkMode 
                  ? 'bg-gray-800 border border-gray-700' 
                  : 'bg-white border border-gray-200'
              }`}>
                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredKanjiList.map((kanji) => (
                    <KanjiListRow key={kanji.id} kanji={kanji} />
                  ))}
                </div>
              </div>
            )}

            {/* Footer Info */}
            <div className={`mt-3 sm:mt-4 p-3 rounded-lg shadow-lg ${
              darkMode 
                ? 'bg-gray-800 border border-gray-700' 
                : 'bg-white border border-gray-200'
            }`}>
              <div className="flex flex-col sm:flex-row justify-between items-center gap-2">
                <div className="text-xs">
                  <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                    {stats.mastered} mastered • {stats.learning} learning • {stats.reviewing} reviewing
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <button
                    onClick={() => {
                      const masteredKanji = filteredKanjiList.filter(k => 
                        progress.get(k.id)?.stage === 'mastered'
                      );
                      alert(`You've mastered ${masteredKanji.length} kanji!`);
                    }}
                    className={`hover:opacity-70 transition-opacity ${
                      darkMode ? 'text-blue-300' : 'text-blue-600'
                    }`}
                  >
                    Mastered
                  </button>
                  <span className={darkMode ? 'text-gray-600' : 'text-gray-400'}>•</span>
                  <button
                    onClick={() => {
                      const dueKanji = filteredKanjiList.filter(k => 
                        new Date(progress.get(k.id)?.nextReview || 0) <= new Date()
                      );
                      alert(`${dueKanji.length} kanji are due for review!`);
                    }}
                    className={`hover:opacity-70 transition-opacity ${
                      darkMode ? 'text-orange-300' : 'text-orange-600'
                    }`}
                  >
                    Due Review
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Mobile Controls */}
      <MobileControls />

      {/* Modal */}
      {expandedCardId && <KanjiModal />}

      {/* Footer */}
      <footer className={`hidden lg:block py-4 border-t ${
        darkMode 
          ? 'bg-gray-900 border-gray-800 text-gray-400' 
          : 'bg-gray-50 border-gray-200 text-gray-600'
      }`}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-3">
            <div className="text-xs">
              JLPT N5 Kanji Learning System • Made for Japanese learners
            </div>
            <div className="flex items-center gap-3">
              <button className="text-xs hover:opacity-70 transition-opacity">
                Keyboard Shortcuts
              </button>
              <button className="text-xs hover:opacity-70 transition-opacity">
                Export Progress
              </button>
              <button className="text-xs hover:opacity-70 transition-opacity">
                Help & Support
              </button>
            </div>
          </div>
        </div>
      </footer>

      {/* Custom Toggle Switch Styles */}
      <style jsx>{`
        .toggle-switch {
          appearance: none;
          width: 36px;
          height: 20px;
          background: ${darkMode ? '#4b5563' : '#d1d5db'};
          border-radius: 10px;
          position: relative;
          cursor: pointer;
          transition: all 0.3s;
          border: 1px solid ${darkMode ? '#6b7280' : '#cbd5e1'};
          flex-shrink: 0;
        }
        .toggle-switch:checked {
          background: linear-gradient(to right, #3b82f6, #8b5cf6);
          border-color: ${darkMode ? '#6366f1' : '#8b5cf6'};
        }
        .toggle-switch:focus {
          outline: 2px solid transparent;
          outline-offset: 2px;
          box-shadow: 0 0 0 2px ${darkMode ? '#374151' : '#f3f4f6'}, 0 0 0 4px #3b82f6;
        }
        .toggle-switch::before {
          content: '';
          position: absolute;
          width: 16px;
          height: 16px;
          background: white;
          border-radius: 50%;
          top: 1px;
          left: 2px;
          transition: all 0.3s;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
        }
        .toggle-switch:checked::before {
          transform: translateX(16px);
        }
      `}</style>
    </div>
  );
};

export default N5KanjiPage;