// pages/VocabularyBuilder.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { 
  BookOpen, 
  Volume2, 
  Star, 
  CheckCircle, 
  XCircle, 
  Zap, 
  TrendingUp, 
  RotateCw,
  Filter,
  Search,
  Layers,
  Plus,
  Bookmark,
  Brain,
  Clock,
  Award,
  ChevronRight,
  Sparkles,
  Loader2,
  RefreshCw,
  AlertCircle,
  VolumeX,
  List,
  Grid,
  Settings,
  Calendar,
  BarChart,
  Target,
  Shield,
  ChevronLeft,
  Heart,
  Share2,
  Download,
  Eye,
  EyeOff,
  Maximize2,
  Minimize2,
  Pause,
  Play,
  Menu,
  X,
  ChevronDown,
  ChevronUp,
  Bell,
  Target as TargetIcon,
  Flame,
  Hash,
  Type,
  Mic,
  MicOff
} from 'lucide-react';
import * as vocabularyAPI from '../service/vocabulary.service';
import type { Vocabulary } from '../pages/types/vocabulary';
import { format, addDays, differenceInDays, isToday } from 'date-fns';
import VocabularyFlashcard from '../component/flashcards/VocabularyFlashcard';

// Types matching your Prisma schema
type Difficulty = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'ALL';
type JLPT = 'N5' | 'N4' | 'N3' | 'N2' | 'N1';
type ReviewRating = 'again' | 'good' | 'easy';
type ViewMode = 'flashcard' | 'list' | 'grid' | 'detailed';

interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  bgColor: string;
}

const VocabularyBuilder = () => {
  // State Management
  const [words, setWords] = useState<Vocabulary[]>([]);
  const [filteredWords, setFilteredWords] = useState<Vocabulary[]>([]);
  const [dueCards, setDueCards] = useState<Vocabulary[]>([]);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [showTranslation, setShowTranslation] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>('ALL');
  const [selectedJlpt, setSelectedJlpt] = useState<JLPT | 'ALL'>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isReviewing, setIsReviewing] = useState(false);
  const [showDueOnly, setShowDueOnly] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('flashcard');
  const [audioPlaying, setAudioPlaying] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [autoPlay, setAutoPlay] = useState(false);
  const [showHints, setShowHints] = useState(true);
  const [studyMode, setStudyMode] = useState<'review' | 'learn' | 'master'>('review');
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [expandedFilters, setExpandedFilters] = useState(false);
  const [micActive, setMicActive] = useState(false);
  const [stats, setStats] = useState({
    totalWords: 0,
    learnedWords: 0,
    dueToday: 0,
    totalReviews: 0,
    accuracy: 0,
    streak: 0,
    mastery: 0,
    dailyGoal: 20
  });

  // Categories matching your data structure
  const categories: Category[] = [
    { id: 'all', name: 'All', icon: '📚', color: 'text-purple-600', bgColor: 'bg-purple-100' },
    { id: 'greetings', name: 'Greetings', icon: '👋', color: 'text-blue-600', bgColor: 'bg-blue-100' },
    { id: 'pronouns', name: 'Pronouns', icon: '👤', color: 'text-green-600', bgColor: 'bg-green-100' },
    { id: 'occupations', name: 'Occupations', icon: '💼', color: 'text-yellow-600', bgColor: 'bg-yellow-100' },
    { id: 'grammar', name: 'Grammar', icon: '📖', color: 'text-red-600', bgColor: 'bg-red-100' },
    { id: 'food_drink', name: 'Food & Drink', icon: '🍣', color: 'text-orange-600', bgColor: 'bg-orange-100' },
    { id: 'places', name: 'Places', icon: '🗺️', color: 'text-teal-600', bgColor: 'bg-teal-100' },
    { id: 'adjectives', name: 'Adjectives', icon: '🎯', color: 'text-cyan-600', bgColor: 'bg-cyan-100' },
  ];

  const difficulties = [
    { id: 'ALL' as Difficulty, name: 'All Levels', color: 'text-gray-600', bgColor: 'bg-gray-100', icon: '🌐' },
    { id: 'BEGINNER' as Difficulty, name: 'Beginner', color: 'text-emerald-600', bgColor: 'bg-emerald-100', icon: '🌱' },
    { id: 'INTERMEDIATE' as Difficulty, name: 'Intermediate', color: 'text-amber-600', bgColor: 'bg-amber-100', icon: '🌿' },
    { id: 'ADVANCED' as Difficulty, name: 'Advanced', color: 'text-rose-600', bgColor: 'bg-rose-100', icon: '🎯' },
  ];

  const jlptLevels = [
    { id: 'ALL' as JLPT | 'ALL', name: 'All JLPT', color: 'text-gray-600', bgColor: 'bg-gray-100', icon: '🎓' },
    { id: 'N5' as JLPT, name: 'N5', color: 'text-blue-600', bgColor: 'bg-blue-100', icon: '5' },
    { id: 'N4' as JLPT, name: 'N4', color: 'text-green-600', bgColor: 'bg-green-100', icon: '4' },
    { id: 'N3' as JLPT, name: 'N3', color: 'text-yellow-600', bgColor: 'bg-yellow-100', icon: '3' },
    { id: 'N2' as JLPT, name: 'N2', color: 'text-orange-600', bgColor: 'bg-orange-100', icon: '2' },
    { id: 'N1' as JLPT, name: 'N1', color: 'text-red-600', bgColor: 'bg-red-100', icon: '1' },
  ];

  // Initialize data
  useEffect(() => {
    loadVocabulary();
    loadDueCards();
  }, []);

  // Filter words when criteria change
  useEffect(() => {
    filterWords();
  }, [words, selectedCategory, selectedDifficulty, selectedJlpt, searchTerm, showDueOnly]);

  const loadVocabulary = async () => {
    try {
      setIsLoading(true);
      const response = await vocabularyAPI.getAllVocabulary();
      setWords(response.data);
      calculateStats(response.data);
    } catch (error) {
      console.error('Failed to load vocabulary:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadDueCards = async () => {
    try {
      const response = await vocabularyAPI.getDueVocabulary();
      setDueCards(response.data);
    } catch (error) {
      console.error('Failed to load due cards:', error);
    }
  };

  const filterWords = useCallback(() => {
    let filtered = [...words];

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(word => word.category === selectedCategory);
    }

    // Filter by difficulty
    if (selectedDifficulty !== 'ALL') {
      filtered = filtered.filter(word => word.difficulty === selectedDifficulty);
    }

    // Filter by JLPT level
    if (selectedJlpt !== 'ALL') {
      filtered = filtered.filter(word => word.jlptLevel === selectedJlpt);
    }

    // Filter by due cards only
    if (showDueOnly) {
      const now = new Date();
      filtered = filtered.filter(word => 
        word.nextReviewAt && new Date(word.nextReviewAt) <= now
      );
    }

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(word => 
        word.japanese.toLowerCase().includes(term) ||
        word.reading.toLowerCase().includes(term) ||
        word.english.toLowerCase().includes(term) ||
        word.example?.toLowerCase().includes(term) ||
        word.tags?.some(tag => tag.toLowerCase().includes(term))
      );
    }

    // Sort by due date first
    filtered.sort((a, b) => {
      if (!a.nextReviewAt && !b.nextReviewAt) return 0;
      if (!a.nextReviewAt) return 1;
      if (!b.nextReviewAt) return -1;
      return new Date(a.nextReviewAt).getTime() - new Date(b.nextReviewAt).getTime();
    });

    setFilteredWords(filtered);
    
    // Reset to first word if current index is out of bounds
    if (currentWordIndex >= filtered.length) {
      setCurrentWordIndex(0);
    }
  }, [words, selectedCategory, selectedDifficulty, selectedJlpt, searchTerm, showDueOnly, currentWordIndex]);

  const calculateStats = (wordList: Vocabulary[]) => {
    const totalWords = wordList.length;
    const learnedWords = wordList.filter(w => w.isLearned).length;
    const dueToday = wordList.filter(w => {
      if (!w.nextReviewAt) return false;
      const reviewDate = new Date(w.nextReviewAt);
      return reviewDate <= new Date() || isToday(reviewDate);
    }).length;
    const totalReviews = wordList.reduce((sum, w) => sum + w.reviews, 0);
    const correctCount = wordList.reduce((sum, w) => sum + w.correctCount, 0);
    const totalAttempts = wordList.reduce((sum, w) => sum + w.reviews, 0);
    const accuracy = totalAttempts > 0 ? Math.round((correctCount / totalAttempts) * 100) : 0;
    const mastery = totalWords > 0 ? Math.round((learnedWords / totalWords) * 100) : 0;

    setStats({
      totalWords,
      learnedWords,
      dueToday,
      totalReviews,
      accuracy,
      streak: Math.max(...wordList.map(w => w.streak), 0),
      mastery,
      dailyGoal: 20
    });
  };

  const currentWord = filteredWords[currentWordIndex];

  // Text-to-Speech function for Japanese
  const playJapaneseAudio = async (text: string) => {
    try {
      setAudioPlaying(true);
      
      // Use Web Speech API
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ja-JP';
      utterance.rate = 0.8;
      utterance.pitch = 1;
      utterance.volume = 1;
      
      // Add event listeners
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

  // Anki-style review system
  const reviewWord = async (rating: ReviewRating) => {
    if (!currentWord) return;
    
    setIsReviewing(true);
    try {
      await vocabularyAPI.reviewVocabulary(currentWord.id, { rating });
      
      // Update local state
      const updatedWords = words.map(word => {
        if (word.id === currentWord.id) {
          const newInterval = rating === 'again' ? 1 : 
                            rating === 'good' ? word.intervalDays * 2 : 
                            word.intervalDays * 3;
          
          return {
            ...word,
            isLearned: rating !== 'again',
            reviews: word.reviews + 1,
            correctCount: rating !== 'again' ? word.correctCount + 1 : word.correctCount,
            incorrectCount: rating === 'again' ? word.incorrectCount + 1 : word.incorrectCount,
            streak: rating !== 'again' ? word.streak + 1 : 0,
            intervalDays: newInterval,
            lastReviewedAt: new Date(),
            nextReviewAt: addDays(new Date(), newInterval)
          };
        }
        return word;
      });
      
      setWords(updatedWords);
      calculateStats(updatedWords);
      
      // Move to next word
      if (currentWordIndex < filteredWords.length - 1) {
        setCurrentWordIndex(prev => prev + 1);
      } else {
        setCurrentWordIndex(0);
      }
      
      setShowAnswer(false);
      setShowTranslation(false);
    } catch (error) {
      console.error('Review failed:', error);
    } finally {
      setIsReviewing(false);
    }
  };

  const toggleBookmark = async (wordId: string) => {
    try {
      const word = words.find(w => w.id === wordId);
      if (!word) return;
      
      await vocabularyAPI.updateVocabulary(wordId, {
        isBookmarked: !word.isBookmarked
      });
      
      const updatedWords = words.map(w => 
        w.id === wordId ? { ...w, isBookmarked: !w.isBookmarked } : w
      );
      setWords(updatedWords);
    } catch (error) {
      console.error('Failed to toggle bookmark:', error);
    }
  };

  const resetFilters = () => {
    setSelectedCategory('all');
    setSelectedDifficulty('ALL');
    setSelectedJlpt('ALL');
    setSearchTerm('');
    setShowDueOnly(false);
    setStudyMode('review');
    setExpandedFilters(false);
  };

  const getDueStatus = (nextReviewDate?: Date) => {
    if (!nextReviewDate) return 'no-date';
    const now = new Date();
    const reviewDate = new Date(nextReviewDate);
    
    if (reviewDate <= now) return 'overdue';
    if (reviewDate <= addDays(now, 1)) return 'due-soon';
    return 'future';
  };

  const getDueStatusColor = (status: string) => {
    switch(status) {
      case 'overdue': return 'bg-rose-500 text-white';
      case 'due-soon': return 'bg-amber-500 text-white';
      default: return 'bg-emerald-500 text-white';
    }
  };

  const nextCard = () => {
    setCurrentWordIndex(prev => prev < filteredWords.length - 1 ? prev + 1 : 0);
    setShowAnswer(false);
    setShowTranslation(false);
  };

  const prevCard = () => {
    setCurrentWordIndex(prev => prev > 0 ? prev - 1 : filteredWords.length - 1);
    setShowAnswer(false);
    setShowTranslation(false);
  };

  const handleKeyPress = useCallback((event: KeyboardEvent) => {
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
        reviewWord('good');
        break;
      case '3':
        reviewWord('easy');
        break;
      case 'a':
        if (currentWord) playJapaneseAudio(currentWord.japanese);
        break;
      case 'b':
        if (currentWord) toggleBookmark(currentWord.id);
        break;
    }
  }, [viewMode, showAnswer, currentWord, filteredWords.length, currentWordIndex]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white to-gray-50 flex items-center justify-center p-4">
        <div className="text-center space-y-4">
          <div className="relative inline-block">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
            <div className="absolute -inset-2 border-4 border-blue-200 rounded-2xl animate-ping"></div>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Loading Vocabulary</h3>
            <p className="text-sm text-gray-500 mt-1">Preparing your learning materials...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br from-white to-gray-50 ${fullscreen ? 'fixed inset-0 z-50 bg-white' : ''}`}>
      <div className={`${fullscreen ? 'h-screen overflow-hidden' : 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6'}`}>
        {/* Mobile Header */}
        <div className={`${fullscreen ? 'hidden' : 'lg:hidden'}`}>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="p-2 rounded-lg bg-white border border-gray-200 shadow-sm"
              >
                <Menu className="w-5 h-5 text-gray-700" />
              </button>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Vocabulary</h1>
                <p className="text-sm text-gray-500">{stats.totalWords} words</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={loadVocabulary}
                className="p-2 rounded-lg bg-white border border-gray-200 shadow-sm"
              >
                <RefreshCw className="w-5 h-5 text-gray-700" />
              </button>
              <button 
                onClick={() => setFullscreen(!fullscreen)}
                className="p-2 rounded-lg bg-white border border-gray-200 shadow-sm"
              >
                <Maximize2 className="w-5 h-5 text-gray-700" />
              </button>
            </div>
          </div>

          {/* Mobile Stats */}
          <div className="grid grid-cols-4 gap-2 mb-6">
            <div className="bg-white p-3 rounded-xl shadow-sm border border-gray-100">
              <div className="text-xs text-gray-500 mb-1">Total</div>
              <div className="text-lg font-bold text-gray-900">{stats.totalWords}</div>
            </div>
            <div className="bg-white p-3 rounded-xl shadow-sm border border-gray-100">
              <div className="text-xs text-gray-500 mb-1">Mastered</div>
              <div className="text-lg font-bold text-emerald-600">{stats.learnedWords}</div>
            </div>
            <div className="bg-white p-3 rounded-xl shadow-sm border border-gray-100">
              <div className="text-xs text-gray-500 mb-1">Due</div>
              <div className="text-lg font-bold text-amber-600">{stats.dueToday}</div>
            </div>
            <div className="bg-white p-3 rounded-xl shadow-sm border border-gray-100">
              <div className="text-xs text-gray-500 mb-1">Streak</div>
              <div className="text-lg font-bold text-rose-600 flex items-center gap-1">
                <Flame className="w-4 h-4" />{stats.streak}
              </div>
            </div>
          </div>

          {/* Mobile Search & Filters */}
          <div className="mb-6 space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search vocabulary..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>

            <div className="flex gap-2 overflow-x-auto pb-2">
              <button
                onClick={() => setExpandedFilters(!expandedFilters)}
                className={`px-3 py-2 rounded-lg flex items-center gap-2 whitespace-nowrap ${
                  expandedFilters ? 'bg-blue-50 text-blue-600 border border-blue-200' : 'bg-white text-gray-700 border border-gray-200'
                }`}
              >
                <Filter className="w-4 h-4" />
                Filters
                {expandedFilters ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
              
              <button
                onClick={() => setShowDueOnly(!showDueOnly)}
                className={`px-3 py-2 rounded-lg flex items-center gap-2 whitespace-nowrap ${
                  showDueOnly ? 'bg-amber-50 text-amber-600 border border-amber-200' : 'bg-white text-gray-700 border border-gray-200'
                }`}
              >
                <Bell className="w-4 h-4" />
                Due Only
                {dueCards.length > 0 && (
                  <span className="px-1.5 py-0.5 text-xs bg-rose-500 text-white rounded-full min-w-5">
                    {dueCards.length}
                  </span>
                )}
              </button>
            </div>

            {/* Expanded Mobile Filters */}
            {expandedFilters && (
              <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-4 animate-fadeIn">
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-2">Category</h4>
                  <div className="flex flex-wrap gap-2">
                    {categories.map((category) => (
                      <button
                        key={category.id}
                        onClick={() => setSelectedCategory(category.id)}
                        className={`px-3 py-2 rounded-lg flex items-center gap-2 ${
                          selectedCategory === category.id
                            ? `${category.bgColor} ${category.color} border`
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        <span>{category.icon}</span>
                        <span className="text-sm">{category.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-2">Level</h4>
                  <div className="flex flex-wrap gap-2">
                    {difficulties.map((level) => (
                      <button
                        key={level.id}
                        onClick={() => setSelectedDifficulty(level.id)}
                        className={`px-3 py-2 rounded-lg ${
                          selectedDifficulty === level.id
                            ? `${level.bgColor} ${level.color} border`
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {level.name}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-2">JLPT</h4>
                  <div className="flex flex-wrap gap-2">
                    {jlptLevels.map((level) => (
                      <button
                        key={level.id}
                        onClick={() => setSelectedJlpt(level.id)}
                        className={`px-3 py-2 rounded-lg ${
                          selectedJlpt === level.id
                            ? `${level.bgColor} ${level.color} border`
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {level.name}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={resetFilters}
                  className="w-full py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Reset Filters
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Desktop Header */}
        {!fullscreen && (
          <div className="hidden lg:block">
            <div className="flex justify-between items-start mb-8">
              <div>
                <div className="flex items-center gap-4 mb-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center shadow-lg">
                    <BookOpen className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900">Vocabulary Builder</h1>
                    <p className="text-gray-600 mt-1">Spaced repetition system for Japanese learning</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 mt-6">
                  <div className="flex items-center gap-2">
                    <div className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg">
                      <span className="text-lg font-bold text-gray-900">{stats.totalWords}</span>
                      <span className="text-gray-500 ml-1">words</span>
                    </div>
                    <div className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg">
                      <span className="text-lg font-bold text-emerald-600">{stats.mastery}%</span>
                      <span className="text-gray-500 ml-1">mastered</span>
                    </div>
                    <div className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg">
                      <span className="text-lg font-bold text-rose-600 flex items-center gap-1">
                        <Flame className="w-4 h-4" />{stats.streak}
                      </span>
                      <span className="text-gray-500 ml-1">day streak</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <div className="flex gap-3">
                  <button 
                    onClick={loadVocabulary}
                    className="px-4 py-2 bg-white text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-200 flex items-center gap-2 border border-gray-200"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Refresh
                  </button>
                  <button className="px-5 py-2.5 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl hover:shadow-lg transition-all duration-200 flex items-center gap-2 shadow-md">
                    <Plus className="w-5 h-5" />
                    Add Word
                  </button>
                  <button 
                    onClick={() => setFullscreen(!fullscreen)}
                    className="px-4 py-2 bg-white text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-200 flex items-center gap-2 border border-gray-200"
                  >
                    {fullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                  </button>
                </div>
                
                {/* Desktop Quick Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowDueOnly(!showDueOnly)}
                    className={`px-3 py-1.5 rounded-lg text-sm ${
                      showDueOnly
                        ? 'bg-amber-50 text-amber-600 border border-amber-200'
                        : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    Due Cards {dueCards.length > 0 && `(${dueCards.length})`}
                  </button>
                  <div className="flex gap-1">
                    <button
                      onClick={() => setViewMode('flashcard')}
                      className={`px-3 py-1.5 rounded-l-lg text-sm ${
                        viewMode === 'flashcard'
                          ? 'bg-blue-50 text-blue-600 border border-blue-200'
                          : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      Cards
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`px-3 py-1.5 rounded-r-lg text-sm ${
                        viewMode === 'list'
                          ? 'bg-blue-50 text-blue-600 border border-blue-200'
                          : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      List
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Desktop Main Filters */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Filter Vocabulary</h3>
                <button
                  onClick={resetFilters}
                  className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1"
                >
                  <RotateCw className="w-4 h-4" />
                  Reset
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Search */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Japanese, English, or reading..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full py-3 px-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.icon} {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Difficulty & JLPT */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Level</label>
                    <select
                      value={selectedDifficulty}
                      onChange={(e) => setSelectedDifficulty(e.target.value as Difficulty)}
                      className="w-full py-3 px-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {difficulties.map((level) => (
                        <option key={level.id} value={level.id}>
                          {level.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">JLPT</label>
                    <select
                      value={selectedJlpt}
                      onChange={(e) => setSelectedJlpt(e.target.value as JLPT | 'ALL')}
                      className="w-full py-3 px-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {jlptLevels.map((level) => (
                        <option key={level.id} value={level.id}>
                          {level.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className={`${fullscreen ? 'h-full' : ''}`}>
          {viewMode === 'flashcard' ? (
            // Flashcard View
            filteredWords.length > 0 ? (
              <div className={`${fullscreen ? 'h-full' : ''}`}>
                <VocabularyFlashcard
                  word={currentWord}
                  showAnswer={showAnswer}
                  showTranslation={showTranslation}
                  audioPlaying={audioPlaying}
                  isReviewing={isReviewing}
                  currentIndex={currentWordIndex}
                  totalCards={filteredWords.length}
                  onShowAnswer={() => setShowAnswer(true)}
                  onToggleTranslation={() => setShowTranslation(!showTranslation)}
                  onPlayAudio={(text) => playJapaneseAudio(text)}
                  onStopAudio={stopAudio}
                  onReview={reviewWord}
                  onToggleBookmark={() => currentWord && toggleBookmark(currentWord.id)}
                  onNextCard={nextCard}
                  onPrevCard={prevCard}
                  fullscreen={fullscreen}
                  showHints={showHints}
                />
              </div>
            ) : (
              // No words found
              <div className="bg-white rounded-2xl border border-gray-200 p-8 md:p-12 text-center">
                <div className="max-w-md mx-auto">
                  <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-r from-blue-100 to-purple-100 flex items-center justify-center">
                    <BookOpen className="w-10 h-10 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {showDueOnly ? "All Caught Up! 🎉" : "No Words Found"}
                  </h3>
                  <p className="text-gray-600 mb-6">
                    {showDueOnly 
                      ? "No cards are due for review. Great work! You can review mastered cards or add new words." 
                      : "Try adjusting your filters or search term to find vocabulary."}
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <button
                      onClick={resetFilters}
                      className="px-5 py-2.5 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl hover:shadow-lg transition-all duration-200"
                    >
                      Reset All Filters
                    </button>
                    {showDueOnly && (
                      <button
                        onClick={() => setShowDueOnly(false)}
                        className="px-5 py-2.5 bg-white text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-200 border border-gray-200"
                      >
                        Show All Cards
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )
          ) : (
            // List View
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700 border-b border-gray-200">Japanese</th>
                      <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700 border-b border-gray-200">Reading</th>
                      <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700 border-b border-gray-200">English</th>
                      <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700 border-b border-gray-200">Category</th>
                      <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700 border-b border-gray-200">Status</th>
                      <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700 border-b border-gray-200">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredWords.map((word) => (
                      <tr key={word.id} className="hover:bg-gray-50/50 transition-colors duration-150">
                        <td className="py-4 px-6">
                          <div className="font-japanese text-lg font-semibold text-gray-900">{word.japanese}</div>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-sm text-gray-500">{word.difficulty}</span>
                            <span className="text-xs text-gray-400">•</span>
                            <span className="text-sm text-gray-500">{word.jlptLevel}</span>
                          </div>
                        </td>
                        <td className="py-4 px-6 font-mono text-gray-700">{word.reading}</td>
                        <td className="py-4 px-6 text-gray-700">{word.english}</td>
                        <td className="py-4 px-6">
                          <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                            {word.category}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2">
                              <div className={`w-2 h-2 rounded-full ${
                                word.isLearned ? 'bg-emerald-500' : 'bg-blue-500'
                              }`}></div>
                              <span className="text-sm text-gray-700">
                                {word.isLearned ? 'Mastered' : 'Learning'}
                              </span>
                            </div>
                            {word.nextReviewAt && (
                              <span className={`text-xs px-2 py-1 rounded-full ${getDueStatusColor(getDueStatus(word.nextReviewAt))}`}>
                                {getDueStatus(word.nextReviewAt)}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex gap-2">
                            <button
                              onClick={() => {
                                const index = filteredWords.findIndex(w => w.id === word.id);
                                setCurrentWordIndex(index);
                                setViewMode('flashcard');
                              }}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                              title="Review"
                            >
                              <BookOpen className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => toggleBookmark(word.id)}
                              className={`p-2 rounded-lg transition-colors duration-200 ${
                                word.isBookmarked 
                                  ? 'text-amber-600 hover:bg-amber-50' 
                                  : 'text-gray-600 hover:bg-gray-100'
                              }`}
                              title="Bookmark"
                            >
                              <Bookmark className={`w-4 h-4 ${word.isBookmarked ? 'fill-current' : ''}`} />
                            </button>
                            <button
                              onClick={() => playJapaneseAudio(word.japanese)}
                              className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors duration-200"
                              title="Play Audio"
                            >
                              <Volume2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Mobile Bottom Navigation */}
        {!fullscreen && viewMode === 'flashcard' && filteredWords.length > 0 && (
          <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg">
            <div className="flex items-center justify-between">
              <button
                onClick={prevCard}
                disabled={isReviewing}
                className="p-3 text-gray-600 hover:text-gray-900 disabled:opacity-50"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              
              <div className="flex items-center gap-3">
                <button
                  onClick={() => currentWord && playJapaneseAudio(currentWord.japanese)}
                  disabled={audioPlaying}
                  className="p-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full shadow-lg"
                >
                  {audioPlaying ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Volume2 className="w-5 h-5" />
                  )}
                </button>
                
                {/* <div className="text-center">
                  <div className="text-sm font-medium text-gray-900">
                    {currentIndex + 1} / {filteredWords.length}
                  </div>
                  <div className="text-xs text-gray-500">Cards</div>
                </div>
                 */}
                <button
                  onClick={() => currentWord && toggleBookmark(currentWord.id)}
                  className="p-3 text-gray-600 hover:text-amber-600"
                >
                  <Bookmark className={`w-5 h-5 ${currentWord?.isBookmarked ? 'fill-current text-amber-600' : ''}`} />
                </button>
              </div>
              
              <button
                onClick={nextCard}
                disabled={isReviewing}
                className="p-3 text-gray-600 hover:text-gray-900 disabled:opacity-50"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
          </div>
        )}

        {/* Progress Summary */}
        {!fullscreen && !showMobileMenu && (
          <div className="mt-8 lg:mt-12">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Category Progress</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {categories.slice(1, 7).map((category) => {
                const categoryWords = words.filter(w => w.category === category.id);
                const learnedWords = categoryWords.filter(w => w.isLearned).length;
                const progress = categoryWords.length > 0 ? Math.round((learnedWords / categoryWords.length) * 100) : 0;
                
                return (
                  <div key={category.id} className="bg-white p-4 rounded-xl border border-gray-200 hover:border-gray-300 transition-colors">
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`p-2 rounded-lg ${category.bgColor}`}>
                        <span className="text-xl">{category.icon}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-900 truncate">{category.name}</h4>
                        <p className="text-sm text-gray-500">
                          {learnedWords}/{categoryWords.length}
                        </p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Progress</span>
                        <span className="font-semibold text-gray-900">{progress}%</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Mobile Menu Overlay */}
      {showMobileMenu && (
        <div className="fixed inset-0 bg-white z-50 p-6 overflow-y-auto">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Menu</h2>
            <button
              onClick={() => setShowMobileMenu(false)}
              className="p-2 rounded-lg bg-gray-100"
            >
              <X className="w-6 h-6 text-gray-700" />
            </button>
          </div>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Study Mode</h3>
              <div className="space-y-3">
                {['review', 'learn', 'master'].map((mode) => (
                  <button
                    key={mode}
                    onClick={() => {
                      setStudyMode(mode as 'review' | 'learn' | 'master');
                      setShowMobileMenu(false);
                    }}
                    className={`w-full text-left p-4 rounded-xl ${
                      studyMode === mode
                        ? 'bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200'
                        : 'bg-gray-50 hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-xl ${
                        mode === 'review' ? 'bg-blue-100 text-blue-600' :
                        mode === 'learn' ? 'bg-emerald-100 text-emerald-600' :
                        'bg-purple-100 text-purple-600'
                      }`}>
                        {mode === 'review' && <RotateCw className="w-5 h-5" />}
                        {mode === 'learn' && <BookOpen className="w-5 h-5" />}
                        {mode === 'master' && <Award className="w-5 h-5" />}
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold capitalize text-gray-900">{mode}</div>
                        <div className="text-sm text-gray-500">
                          {mode === 'review' ? 'Spaced repetition' :
                           mode === 'learn' ? 'Learn new words' :
                           'Master difficult words'}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Settings</h3>
              <div className="space-y-3">
                <button
                  onClick={() => {
                    setShowHints(!showHints);
                    setShowMobileMenu(false);
                  }}
                  className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-xl"
                >
                  <span className="text-gray-900">Show Hints</span>
                  <div className={`w-12 h-6 rounded-full transition-colors ${
                    showHints ? 'bg-blue-500' : 'bg-gray-300'
                  }`}>
                    <div className={`w-6 h-6 bg-white rounded-full transform transition-transform ${
                      showHints ? 'translate-x-6' : ''
                    }`}></div>
                  </div>
                </button>
                
                <button className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-xl">
                  <span className="text-gray-900">Auto-play Audio</span>
                  <div className={`w-12 h-6 rounded-full transition-colors ${
                    autoPlay ? 'bg-green-500' : 'bg-gray-300'
                  }`}>
                    <div className={`w-6 h-6 bg-white rounded-full transform transition-transform ${
                      autoPlay ? 'translate-x-6' : ''
                    }`}></div>
                  </div>
                </button>
              </div>
            </div>
            
            <button className="w-full py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-semibold">
              Export Progress
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default VocabularyBuilder;