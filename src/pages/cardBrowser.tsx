import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  Shuffle, 
  Bookmark, 
  BookmarkCheck, 
  CheckCircle, 
  Circle,
  BookOpen,
  Volume2,
  X,
  WholeWord,
  JapaneseYen,
  Filter,
  Search,
  List,
  Grid,
  RotateCw,
  Sparkles,
  Star,
  Trophy,
  TrendingUp,
  ExternalLink,
  Heart,
  Zap,
  Target,
  Award,
  BarChart3,
  Mic,
  Play,
  Pause,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Layers,
  BookmarkPlus,
  Moon,
  Sun,
  Menu,
  Home,
  Download,
  Upload,
  Settings,
  Eye,
  EyeOff,
  Loader,
  Sliders,
  ChevronDown,
  ChevronUp,
  Package,
  Database,
  Layers as LayersIcon,
  Grid as GridIcon,
  List as ListIcon,
  Book,
  Languages,
  Hash,
  Type,
  Clock,
  Calendar
} from 'lucide-react';
import n4Kanji from "./Vocabulary/fullvocabulary.json";

// Type definitions
type WordType = 'word' | 'kanji';
type JLPTLevel = 'N5' | 'N4' | 'N3' | 'N2' | 'N1' | '4' | '5';
type CardType = 'Noun' | 'Verb' | 'Adjective' | 'Adverb' | 'Katakana' | 'Conjunction' | 'Pronoun' | 'Preposition' | 'Other';

interface BaseCard {
  index: number;
  word: string;
  kana?: string;
  romaji?: string;
  meaning: string;
  jlpt: JLPTLevel;
  type?: CardType;
  card: WordType;
  final_index: number;
}

interface WordCard extends BaseCard {
  card: 'word';
  layout?: never;
  keyword?: never;
  elements?: never;
  strokes?: never;
  image?: never;
  'on-yomi'?: never;
  redirect_to?: string;
  'kun-yomi'?: never;
  permalink?: string;
  redirect_from?: string;
  prev?: string;
  next?: string;
}

interface KanjiCard extends BaseCard {
  card: 'kanji';
  layout: string;
  keyword: string;
  elements: string;
  strokes: number;
  image: string;
  'on-yomi': string;
  redirect_to: string;
  'kun-yomi': string;
  permalink: string;
  redirect_from: string;
  prev: string;
  next: string;
  on: string;
  on_en: string;
  kun: string;
  kun_en: string;
}

type CardData = WordCard | KanjiCard;

interface UserProgress {
  bookmarked: boolean;
  learned: boolean;
  lastReviewed: number;
  reviewCount: number;
  mastery: number;
}

interface AppData {
  [key: string]: UserProgress;
}

// Get unique key for each card
const getCardKey = (card: CardData): string => {
  return `${card.card}-${card.index}-${card.word}`;
};

// Data Loader Component
const DataLoader: React.FC<{
  onLoadData: (count: number) => void;
  totalCards: number;
  isLoading: boolean;
}> = ({ onLoadData, totalCards, isLoading }) => {
  const [selectedCount, setSelectedCount] = useState(300);
  const [isExpanded, setIsExpanded] = useState(false);

  const loadOptions = [50, 100, 200, 300, 500, 1000, 2000, 'All'];

  return (
    <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-black rounded-3xl border border-gray-200 dark:border-gray-800 p-6 mb-8">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Database className="w-6 h-6 text-indigo-500 dark:text-indigo-400" />
          <h3 className="text-lg font-bold text-gray-800 dark:text-white">Data Loader</h3>
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors"
        >
          {isExpanded ? (
            <ChevronUp className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          )}
        </button>
      </div>

      <div className={`transition-all duration-300 ${isExpanded ? 'opacity-100 max-h-96' : 'opacity-0 max-h-0 overflow-hidden'}`}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Select number of cards to load
            </label>
            <div className="grid grid-cols-4 gap-2 mb-4">
              {loadOptions.map((option) => (
                <button
                  key={option}
                  onClick={() => setSelectedCount(option === 'All' ? totalCards : Number(option))}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    selectedCount === (option === 'All' ? totalCards : Number(option))
                      ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                  {option === 'All' ? `All (${totalCards})` : option}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-4 rounded-xl border border-blue-200 dark:border-blue-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-700 dark:text-blue-300 font-medium">
                  Selected: {selectedCount} cards
                </p>
                <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                  {selectedCount === totalCards ? 'Loading all available cards' : `Loading first ${selectedCount} cards`}
                </p>
              </div>
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center">
                <Package className="w-4 h-4 text-white" />
              </div>
            </div>
          </div>

          <button
            onClick={() => onLoadData(selectedCount)}
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white font-medium py-3 px-4 rounded-xl transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader className="w-5 h-5 animate-spin" />
                Loading Data...
              </>
            ) : (
              <>
                <Download className="w-5 h-5" />
                Load {selectedCount} Cards
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

// Main Component
const CardBrowser: React.FC = () => {
  const [cards, setCards] = useState<CardData[]>([]);
  const [filteredCards, setFilteredCards] = useState<CardData[]>([]);
  const [userData, setUserData] = useState<AppData>({});
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filter, setFilter] = useState<{
    type: 'all' | 'word' | 'kanji';
    jlpt: JLPTLevel | 'all';
    search: string;
    showBookmarked: boolean;
    showLearned: boolean;
    showNew: boolean;
  }>({
    type: 'all',
    jlpt: 'all',
    search: '',
    showBookmarked: false,
    showLearned: false,
    showNew: false,
  });
  const [shuffled, setShuffled] = useState(false);
  const [selectedCard, setSelectedCard] = useState<CardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [activeAnimation, setActiveAnimation] = useState<string | null>(null);
  const [speaking, setSpeaking] = useState(false);
  const [showDetailsPage, setShowDetailsPage] = useState(false);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
const [darkMode, setDarkMode] = useState(false);
  const [showDataLoader, setShowDataLoader] = useState(true);
  const [loadedCardsCount, setLoadedCardsCount] = useState(0);
  const [showFilters, setShowFilters] = useState(false);

  // Initialize data
useEffect(() => {
  const loadData = async (count: number = 300) => {
    setIsLoading(true);

    try {
      const raw = Array.isArray(n4Kanji) ? n4Kanji : Object.values(n4Kanji);

    const normalized: CardData[] = raw.map((item: any) => {
  const jlptNormalized = String(item.jlpt).startsWith("N")
    ? String(item.jlpt)
    : `N${item.jlpt}`;

  if (item.card === "kanji") {
    return {
      index: item.index,
      word: item.kanji,
      meaning: item.meaning,
      jlpt: jlptNormalized as JLPTLevel,
      card: "kanji",
      final_index: item.final_index,
      layout: item.layout,
      keyword: item.keyword,
      elements: item.elements,
      strokes: item.strokes,
      image: item.image,
      "on-yomi": item["on-yomi"],
      redirect_to: item.redirect_to,
      "kun-yomi": item["kun-yomi"],
      permalink: item.permalink,
      redirect_from: item.redirect_from,
      prev: item.prev,
      next: item.next,
      on: item.on,
      on_en: item.on_en,
      kun: item.kun,
      kun_en: item.kun_en,
    } as KanjiCard;
  }

  return {
    index: item.index,
    word: item.word,
    kana: item.kana,
    romaji: item.romaji,
    meaning: item.meaning,
    jlpt: jlptNormalized as JLPTLevel,
    type: item.type,
    card: "word",
    final_index: item.final_index,
  } as WordCard;
});


      const unique = Array.from(
        new Map(normalized.map(c => [getCardKey(c), c])).values()
      );

      const sorted = unique.sort((a, b) => a.index - b.index);
      const limited = count === sorted.length ? sorted : sorted.slice(0, count);

      setCards(limited);
      setFilteredCards(limited);
      setLoadedCardsCount(limited.length);

      const savedData = localStorage.getItem("japanese-flashcards-progress");
      if (savedData) setUserData(JSON.parse(savedData));

      setTimeout(() => setShowDataLoader(false), 500);
    } catch (err) {
      console.error("Load error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  loadData(4000);
}, []);

  // Save progress
  useEffect(() => {
    localStorage.setItem('japanese-flashcards-progress', JSON.stringify(userData));
  }, [userData]);

  // Filter cards
  useEffect(() => {
    let result = [...cards];

    if (filter.type !== 'all') {
      result = result.filter(card => card.card === filter.type);
    }

if (filter.jlpt !== 'all') {
  result = result.filter(card => card.jlpt === filter.jlpt);
}


    if (filter.search) {
      const searchLower = filter.search.toLowerCase();
      result = result.filter(card =>
        card.word.toLowerCase().includes(searchLower) ||
        card.meaning.toLowerCase().includes(searchLower) ||
        (card.kana && card.kana.toLowerCase().includes(searchLower)) ||
        (card.type && card.type.toLowerCase().includes(searchLower))
      );
    }

    if (filter.showBookmarked) {
      result = result.filter(card => {
        const key = getCardKey(card);
        return userData[key]?.bookmarked;
      });
    }

    if (filter.showLearned) {
      result = result.filter(card => {
        const key = getCardKey(card);
        return userData[key]?.learned;
      });
    }

    if (filter.showNew) {
      result = result.filter(card => {
        const key = getCardKey(card);
        return !userData[key] || (!userData[key].bookmarked && !userData[key].learned);
      });
    }

    if (shuffled) {
      result = [...result].sort(() => Math.random() - 0.5);
    } else {
      result = result.sort((a, b) => a.index - b.index);
    }

    setFilteredCards(result);
  }, [cards, filter, shuffled, userData]);

  // Card actions
  const toggleBookmark = useCallback((card: CardData) => {
    const key = getCardKey(card);
    setUserData(prev => ({
      ...prev,
      [key]: {
        ...prev[key],
        bookmarked: !prev[key]?.bookmarked,
        lastReviewed: Date.now(),
        reviewCount: (prev[key]?.reviewCount || 0) + 1
      }
    }));
    setActiveAnimation(`bookmark-${key}`);
    setTimeout(() => setActiveAnimation(null), 1000);
  }, []);

  const toggleLearned = useCallback((card: CardData) => {
    const key = getCardKey(card);
    setUserData(prev => ({
      ...prev,
      [key]: {
        ...prev[key],
        learned: !prev[key]?.learned,
        lastReviewed: Date.now(),
        reviewCount: (prev[key]?.reviewCount || 0) + 1,
        mastery: !prev[key]?.learned ? 100 : 0
      }
    }));
    setActiveAnimation(`learned-${key}`);
    setTimeout(() => setActiveAnimation(null), 1000);
  }, []);

  const speakText = useCallback((text: string) => {
    if ('speechSynthesis' in window) {
      setSpeaking(true);
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ja-JP';
      utterance.rate = 0.8;
      utterance.pitch = 1;
      utterance.onend = () => setSpeaking(false);
      speechSynthesis.speak(utterance);
    }
  }, []);

  // Navigation
  const openDetailsPage = (card: CardData) => {
    const index = filteredCards.findIndex(c => getCardKey(c) === getCardKey(card));
    setCurrentCardIndex(index);
    setSelectedCard(card);
    setShowDetailsPage(true);
  };

  const navigateCard = (direction: 'prev' | 'next') => {
    let newIndex = currentCardIndex;
    if (direction === 'prev') {
      newIndex = currentCardIndex > 0 ? currentCardIndex - 1 : filteredCards.length - 1;
    } else {
      newIndex = currentCardIndex < filteredCards.length - 1 ? currentCardIndex + 1 : 0;
    }
    setCurrentCardIndex(newIndex);
    setSelectedCard(filteredCards[newIndex]);
  };

  // Load more data
  const loadData = (count: number) => {
    setIsLoading(true);
    const cardsArray = Array.isArray(n4Kanji) ? n4Kanji : Object.values(n4Kanji);
    
    const uniqueCards = cardsArray.reduce((acc: CardData[], card) => {
      const existingIndex = acc.findIndex(c => getCardKey(c) === getCardKey(card));
      if (existingIndex === -1) {
        acc.push(card);
      }
      return acc;
    }, []);
    
    const sortedCards = uniqueCards.sort((a, b) => a.index - b.index);
    const limitedCards = count === sortedCards.length ? sortedCards : sortedCards.slice(0, count);
    
    setTimeout(() => {
      setCards(limitedCards);
      setFilteredCards(limitedCards);
      setLoadedCardsCount(limitedCards.length);
      setIsLoading(false);
      setShowDataLoader(false);
    }, 500);
  };

  // Color helpers for dark/light mode
  const getJLPTColor = (jlpt: JLPTLevel) => {
    const colors = {
      '5': { 
        bg: darkMode ? 'bg-gradient-to-r from-yellow-500 to-amber-500' : 'bg-gradient-to-r from-yellow-400 to-amber-400',
        text: darkMode ? 'text-yellow-100' : 'text-yellow-900',
        border: darkMode ? 'border-yellow-400' : 'border-yellow-300'
      },
      'N5': { 
        bg: darkMode ? 'bg-gradient-to-r from-yellow-500 to-amber-500' : 'bg-gradient-to-r from-yellow-400 to-amber-400',
        text: darkMode ? 'text-yellow-100' : 'text-yellow-900',
        border: darkMode ? 'border-yellow-400' : 'border-yellow-300'
      },
      '4': { 
        bg: darkMode ? 'bg-gradient-to-r from-emerald-500 to-green-500' : 'bg-gradient-to-r from-emerald-400 to-green-400',
        text: darkMode ? 'text-emerald-100' : 'text-emerald-900',
        border: darkMode ? 'border-emerald-400' : 'border-emerald-300'
      },
      'N4': { 
        bg: darkMode ? 'bg-gradient-to-r from-emerald-500 to-green-500' : 'bg-gradient-to-r from-emerald-400 to-green-400',
        text: darkMode ? 'text-emerald-100' : 'text-emerald-900',
        border: darkMode ? 'border-emerald-400' : 'border-emerald-300'
      },
      'N3': { 
        bg: darkMode ? 'bg-gradient-to-r from-blue-500 to-cyan-500' : 'bg-gradient-to-r from-blue-400 to-cyan-400',
        text: darkMode ? 'text-blue-100' : 'text-blue-900',
        border: darkMode ? 'border-blue-400' : 'border-blue-300'
      },
      'N2': { 
        bg: darkMode ? 'bg-gradient-to-r from-purple-500 to-violet-500' : 'bg-gradient-to-r from-purple-400 to-violet-400',
        text: darkMode ? 'text-purple-100' : 'text-purple-900',
        border: darkMode ? 'border-purple-400' : 'border-purple-300'
      },
      'N1': { 
        bg: darkMode ? 'bg-gradient-to-r from-rose-500 to-red-500' : 'bg-gradient-to-r from-rose-400 to-red-400',
        text: darkMode ? 'text-rose-100' : 'text-rose-900',
        border: darkMode ? 'border-rose-400' : 'border-rose-300'
      },
    };
    return colors[jlpt] || { 
      bg: darkMode ? 'bg-gradient-to-r from-gray-500 to-slate-500' : 'bg-gradient-to-r from-gray-400 to-slate-400',
      text: darkMode ? 'text-gray-100' : 'text-gray-900',
      border: darkMode ? 'border-gray-400' : 'border-gray-300'
    };
  };

  const getTypeColor = (type?: CardType) => {
    switch (type) {
      case 'Noun': return darkMode ? 'bg-gradient-to-r from-blue-500 to-indigo-500' : 'bg-gradient-to-r from-blue-400 to-indigo-400';
      case 'Verb': return darkMode ? 'bg-gradient-to-r from-red-500 to-pink-500' : 'bg-gradient-to-r from-red-400 to-pink-400';
      case 'Adjective': return darkMode ? 'bg-gradient-to-r from-emerald-500 to-green-500' : 'bg-gradient-to-r from-emerald-400 to-green-400';
      case 'Adverb': return darkMode ? 'bg-gradient-to-r from-purple-500 to-violet-500' : 'bg-gradient-to-r from-purple-400 to-violet-400';
      default: return darkMode ? 'bg-gradient-to-r from-gray-500 to-slate-500' : 'bg-gradient-to-r from-gray-400 to-slate-400';
    }
  };

  const getCardGradient = (card: CardData) => {
    if (card.card === 'kanji') {
      return darkMode ? 'from-amber-500/10 via-orange-500/5 to-yellow-500/10' : 'from-amber-200 via-orange-100 to-yellow-200';
    }
    const jlpt = card.jlpt;
    if (jlpt === '5' || jlpt === 'N5') return darkMode ? 'from-yellow-500/10 via-amber-500/5 to-yellow-500/10' : 'from-yellow-100 via-amber-50 to-yellow-100';
    if (jlpt === '4' || jlpt === 'N4') return darkMode ? 'from-emerald-500/10 via-green-500/5 to-emerald-500/10' : 'from-emerald-100 via-green-50 to-emerald-100';
    if (jlpt === 'N3') return darkMode ? 'from-blue-500/10 via-cyan-500/5 to-blue-500/10' : 'from-blue-100 via-cyan-50 to-blue-100';
    if (jlpt === 'N2') return darkMode ? 'from-purple-500/10 via-violet-500/5 to-purple-500/10' : 'from-purple-100 via-violet-50 to-purple-100';
    if (jlpt === 'N1') return darkMode ? 'from-rose-500/10 via-red-500/5 to-rose-500/10' : 'from-rose-100 via-red-50 to-rose-100';
    return darkMode ? 'from-gray-500/10 via-slate-500/5 to-gray-500/10' : 'from-gray-100 via-slate-50 to-gray-100';
  };

  // Stats
  const stats = useMemo(() => {
    const total = cards.length;
    const bookmarked = Object.values(userData).filter(d => d.bookmarked).length;
    const learned = Object.values(userData).filter(d => d.learned).length;
    const reviewCount = Object.values(userData).reduce((sum, d) => sum + (d.reviewCount || 0), 0);
    const mastery = total > 0 ? Math.round((learned / total) * 100) : 0;
    
    const newCards = cards.filter(card => {
      const key = getCardKey(card);
      return !userData[key] || (!userData[key].bookmarked && !userData[key].learned);
    }).length;

    return { total, bookmarked, learned, reviewCount, mastery, newCards };
  }, [cards.length, userData]);

  if (isLoading && cards.length === 0) {
    return (
      <div className={`min-h-screen flex items-center justify-center transition-colors duration-300 ${
        darkMode ? 'bg-gradient-to-br from-gray-900 via-black to-gray-900' : 'bg-gradient-to-br from-gray-50 via-white to-blue-50'
      }`}>
        <div className="text-center">
          <div className="relative">
            <div className={`w-20 h-20 border-4 rounded-full ${
              darkMode ? 'border-indigo-500/30' : 'border-indigo-300/50'
            }`}></div>
            <div className={`w-20 h-20 border-4 border-transparent rounded-full absolute top-0 left-0 animate-spin ${
              darkMode ? 'border-t-indigo-500' : 'border-t-indigo-600'
            }`}></div>
            <Sparkles className={`w-6 h-6 absolute -top-1 -right-1 animate-pulse ${
              darkMode ? 'text-indigo-400' : 'text-indigo-500'
            }`} />
          </div>
          <p className={`mt-4 font-medium animate-pulse ${
            darkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>Loading Japanese Mastery...</p>
        </div>
      </div>
    );
  }

  // Details Page Component
  if (showDetailsPage && selectedCard) {
    const key = getCardKey(selectedCard);
    const userProgress = userData[key];
    const jlptColor = getJLPTColor(selectedCard.jlpt);

    return (
      <div className={`min-h-screen transition-colors duration-300 ${
        darkMode ? 'bg-gradient-to-br from-gray-900 via-black to-gray-900' : 'bg-gradient-to-br from-gray-50 via-white to-blue-50'
      }`}>
        {/* Floating Navigation Bar */}
        <div className="fixed top-0 left-0 right-0 z-50">
          <div className={`px-4 md:px-8 py-3 ${
            darkMode 
              ? 'bg-gradient-to-r from-gray-900/90 to-black/90 backdrop-blur-lg border-b border-gray-800' 
              : 'bg-gradient-to-r from-white/90 to-blue-50/90 backdrop-blur-lg border-b border-gray-200'
          }`}>
            <div className="max-w-7xl mx-auto flex items-center justify-between">
              <button
                onClick={() => setShowDetailsPage(false)}
                className={`group flex items-center gap-3 px-4 py-2 rounded-xl transition-all duration-300 hover:scale-105 ${
                  darkMode 
                    ? 'bg-gray-800/80 hover:bg-gray-800 text-gray-300 hover:text-white' 
                    : 'bg-white/80 hover:bg-white text-gray-700 hover:text-gray-900 shadow-sm'
                }`}
              >
                <ChevronLeft className="w-5 h-5" />
                <span className="font-medium">Back to Cards</span>
              </button>
              
              <div className="flex items-center gap-3">
                <div className={`px-4 py-2 rounded-xl ${
                  darkMode ? 'bg-gray-800/80 text-gray-300' : 'bg-white/80 text-gray-700 shadow-sm'
                }`}>
                  <span className="font-medium">
                    {currentCardIndex + 1} / {filteredCards.length}
                  </span>
                </div>
                
                <div className="flex gap-1">
                  <button
                    onClick={() => navigateCard('prev')}
                    className={`p-2 rounded-xl transition-all duration-300 hover:scale-105 ${
                      darkMode 
                        ? 'bg-gray-800/80 hover:bg-gray-800 text-gray-400 hover:text-white' 
                        : 'bg-white/80 hover:bg-white text-gray-600 hover:text-gray-900 shadow-sm'
                    }`}
                    title="Previous card"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  
                  <button
                    onClick={() => navigateCard('next')}
                    className={`p-2 rounded-xl transition-all duration-300 hover:scale-105 ${
                      darkMode 
                        ? 'bg-gray-800/80 hover:bg-gray-800 text-gray-400 hover:text-white' 
                        : 'bg-white/80 hover:bg-white text-gray-600 hover:text-gray-900 shadow-sm'
                    }`}
                    title="Next card"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="pt-20 pb-12 px-4 md:px-8 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Panel - Card Info */}
            <div className="lg:col-span-2 space-y-8">
              {/* Card Header */}
              <div className={`rounded-3xl border p-8 ${
                darkMode 
                  ? 'bg-gradient-to-br from-gray-900 to-black border-gray-800' 
                  : 'bg-gradient-to-br from-white to-gray-50 border-gray-200 shadow-lg'
              }`}>
                <div className="flex flex-wrap items-center gap-4 mb-6">
                  <span className={`px-4 py-2 rounded-full text-sm font-bold border ${jlptColor.bg} ${jlptColor.text} ${jlptColor.border}`}>
                    JLPT N{selectedCard.jlpt}
                  </span>
                  
                  {selectedCard.card === 'word' ? (
                    <span className={`px-4 py-2 rounded-full text-sm font-bold ${
                      darkMode 
                        ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white' 
                        : 'bg-gradient-to-r from-indigo-400 to-purple-400 text-white'
                    }`}>
                      Vocabulary
                    </span>
                  ) : (
                    <span className={`px-4 py-2 rounded-full text-sm font-bold ${
                      darkMode 
                        ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white' 
                        : 'bg-gradient-to-r from-amber-400 to-orange-400 text-white'
                    }`}>
                      <JapaneseYen className="w-4 h-4 inline mr-2" />
                      Kanji
                    </span>
                  )}
                  
                  {selectedCard.type && (
                    <span className={`px-4 py-2 rounded-full text-sm font-bold text-white ${getTypeColor(selectedCard.type)}`}>
                      {selectedCard.type}
                    </span>
                  )}
                </div>
                
                <h1 className={`text-6xl md:text-7xl font-bold mb-6 ${
                  darkMode 
                    ? 'bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent' 
                    : 'bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent'
                }`}>
                  {selectedCard.word}
                </h1>
                
                {selectedCard.kana && (
                  <p className={`text-2xl mb-4 ${
                    darkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>{selectedCard.kana}</p>
                )}
                
                <p className={`text-3xl font-medium ${
                  darkMode ? 'text-white' : 'text-gray-800'
                }`}>{selectedCard.meaning}</p>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button
                  onClick={() => toggleBookmark(selectedCard)}
                  className={`group p-6 rounded-2xl border transition-all duration-300 hover:scale-105 ${
                    userProgress?.bookmarked
                      ? darkMode
                        ? 'bg-gradient-to-r from-indigo-900/30 to-purple-900/30 border-indigo-700'
                        : 'bg-gradient-to-r from-indigo-100 to-purple-100 border-indigo-400'
                      : darkMode
                        ? 'bg-gradient-to-r from-gray-900 to-black border-gray-800 hover:border-indigo-600'
                        : 'bg-gradient-to-r from-white to-gray-50 border-gray-300 hover:border-indigo-400'
                  }`}
                >
                  <div className="flex items-center justify-center gap-3">
                    {userProgress?.bookmarked ? (
                      <>
                        <BookmarkCheck className="w-6 h-6 text-indigo-500 group-hover:scale-110 transition-transform" />
                        <span className={`text-lg font-medium ${
                          darkMode ? 'text-white' : 'text-gray-800'
                        }`}>Bookmarked</span>
                      </>
                    ) : (
                      <>
                        <BookmarkPlus className="w-6 h-6 text-gray-500 group-hover:text-indigo-500" />
                        <span className={`text-lg font-medium ${
                          darkMode ? 'text-gray-300 group-hover:text-white' : 'text-gray-600 group-hover:text-gray-800'
                        }`}>Bookmark</span>
                      </>
                    )}
                  </div>
                </button>
                
                <button
                  onClick={() => toggleLearned(selectedCard)}
                  className={`group p-6 rounded-2xl border transition-all duration-300 hover:scale-105 ${
                    userProgress?.learned
                      ? darkMode
                        ? 'bg-gradient-to-r from-emerald-900/30 to-green-900/30 border-emerald-700'
                        : 'bg-gradient-to-r from-emerald-100 to-green-100 border-emerald-400'
                      : darkMode
                        ? 'bg-gradient-to-r from-gray-900 to-black border-gray-800 hover:border-emerald-600'
                        : 'bg-gradient-to-r from-white to-gray-50 border-gray-300 hover:border-emerald-400'
                  }`}
                >
                  <div className="flex items-center justify-center gap-3">
                    {userProgress?.learned ? (
                      <>
                        <Award className="w-6 h-6 text-emerald-500 group-hover:scale-110 transition-transform" />
                        <span className={`text-lg font-medium ${
                          darkMode ? 'text-white' : 'text-gray-800'
                        }`}>Mastered</span>
                      </>
                    ) : (
                      <>
                        <Target className="w-6 h-6 text-gray-500 group-hover:text-emerald-500" />
                        <span className={`text-lg font-medium ${
                          darkMode ? 'text-gray-300 group-hover:text-white' : 'text-gray-600 group-hover:text-gray-800'
                        }`}>Mark as Learned</span>
                      </>
                    )}
                  </div>
                </button>
                
                <button
                  onClick={() => speakText(selectedCard.word)}
                  className={`group p-6 rounded-2xl border transition-all duration-300 hover:scale-105 ${
                    darkMode
                      ? 'bg-gradient-to-r from-gray-900 to-black border-gray-800 hover:border-cyan-600'
                      : 'bg-gradient-to-r from-white to-gray-50 border-gray-300 hover:border-cyan-400'
                  }`}
                  disabled={speaking}
                >
                  <div className="flex items-center justify-center gap-3">
                    {speaking ? (
                      <Pause className="w-6 h-6 text-cyan-500 animate-pulse" />
                    ) : (
                      <Mic className="w-6 h-6 text-gray-500 group-hover:text-cyan-500" />
                    )}
                    <span className={`text-lg font-medium ${
                      darkMode ? 'text-gray-300 group-hover:text-white' : 'text-gray-600 group-hover:text-gray-800'
                    }`}>
                      {speaking ? 'Speaking...' : 'Listen'}
                    </span>
                  </div>
                </button>
              </div>

              {/* Kanji Details */}
              {selectedCard.card === 'kanji' && (
                <div className={`rounded-3xl border p-8 ${
                  darkMode 
                    ? 'bg-gradient-to-br from-gray-900 to-black border-gray-800' 
                    : 'bg-gradient-to-br from-white to-gray-50 border-gray-200 shadow-lg'
                }`}>
                  <h2 className={`text-2xl font-bold mb-6 flex items-center gap-3 ${
                    darkMode ? 'text-white' : 'text-gray-800'
                  }`}>
                    <Layers className="w-6 h-6 text-amber-500" />
                    Kanji Breakdown
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className={`rounded-xl p-4 border ${
                        darkMode ? 'bg-gray-900/50 border-gray-800' : 'bg-gray-50 border-gray-200'
                      }`}>
                        <p className={`text-sm mb-1 ${
                          darkMode ? 'text-gray-400' : 'text-gray-600'
                        }`}>Keyword</p>
                        <p className={`text-xl font-bold ${
                          darkMode ? 'text-white' : 'text-gray-900'
                        }`}>{selectedCard.keyword}</p>
                      </div>
                      
                      <div className={`rounded-xl p-4 border ${
                        darkMode ? 'bg-gray-900/50 border-gray-800' : 'bg-gray-50 border-gray-200'
                      }`}>
                        <p className={`text-sm mb-1 ${
                          darkMode ? 'text-gray-400' : 'text-gray-600'
                        }`}>Strokes</p>
                        <p className={`text-2xl font-bold ${
                          darkMode ? 'text-white' : 'text-gray-900'
                        }`}>{selectedCard.strokes}</p>
                      </div>
                      
                      <div className={`rounded-xl p-4 border ${
                        darkMode ? 'bg-gray-900/50 border-gray-800' : 'bg-gray-50 border-gray-200'
                      }`}>
                        <p className={`text-sm mb-1 ${
                          darkMode ? 'text-gray-400' : 'text-gray-600'
                        }`}>Elements</p>
                        <p className={`text-lg ${
                          darkMode ? 'text-gray-300' : 'text-gray-700'
                        }`}>{selectedCard.elements}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div className={`rounded-xl p-4 border ${
                        darkMode ? 'bg-gray-900/50 border-gray-800' : 'bg-gray-50 border-gray-200'
                      }`}>
                        <p className={`text-sm mb-1 ${
                          darkMode ? 'text-gray-400' : 'text-gray-600'
                        }`}>On-yomi (Chinese Reading)</p>
                        <p className="text-2xl font-bold text-blue-500">{selectedCard.on}</p>
                      </div>
                      
                      <div className={`rounded-xl p-4 border ${
                        darkMode ? 'bg-gray-900/50 border-gray-800' : 'bg-gray-50 border-gray-200'
                      }`}>
                        <p className={`text-sm mb-1 ${
                          darkMode ? 'text-gray-400' : 'text-gray-600'
                        }`}>Kun-yomi (Japanese Reading)</p>
                        <p className="text-2xl font-bold text-emerald-500">{selectedCard.kun}</p>
                      </div>
                      
                      {selectedCard.image && (
                        <div className={`rounded-xl p-4 border ${
                          darkMode ? 'bg-gray-900/50 border-gray-800' : 'bg-gray-50 border-gray-200'
                        }`}>
                          <p className={`text-sm mb-1 ${
                            darkMode ? 'text-gray-400' : 'text-gray-600'
                          }`}>Unicode</p>
                          <p className={`text-lg font-mono ${
                            darkMode ? 'text-gray-300' : 'text-gray-700'
                          }`}>{selectedCard.image}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Right Panel - Iframe & Additional Info */}
            <div className="space-y-8">
              {/* Iframe Container */}
              {selectedCard.redirect_to && (
                <div className={`rounded-3xl border overflow-hidden ${
                  darkMode 
                    ? 'bg-gradient-to-br from-gray-900 to-black border-gray-800' 
                    : 'bg-gradient-to-br from-white to-gray-50 border-gray-200 shadow-lg'
                }`}>
                  <div className={`p-6 border-b ${
                    darkMode ? 'bg-gradient-to-r from-gray-900 to-black border-gray-800' : 'border-gray-200 bg-white'
                  }`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <ExternalLink className="w-5 h-5 text-indigo-500" />
                        <h3 className={`text-lg font-bold ${
                          darkMode ? 'text-white' : 'text-gray-800'
                        }`}>Interactive Kanji View</h3>
                      </div>
                      <a
                        href={selectedCard.redirect_to}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-indigo-500 hover:text-indigo-600 font-medium flex items-center gap-2"
                      >
                        Open Full <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                  <div className="h-[500px]">
                    <iframe
                      src={selectedCard.redirect_to}
                      className="w-full h-full"
                      title="Kanji details"
                      sandbox="allow-scripts allow-same-origin"
                      loading="lazy"
                    />
                  </div>
                </div>
              )}

              {/* Study Stats */}
              <div className={`rounded-3xl border p-6 ${
                darkMode 
                  ? 'bg-gradient-to-br from-gray-900 to-black border-gray-800' 
                  : 'bg-gradient-to-br from-white to-gray-50 border-gray-200 shadow-lg'
              }`}>
                <h3 className={`text-lg font-bold mb-4 flex items-center gap-3 ${
                  darkMode ? 'text-white' : 'text-gray-800'
                }`}>
                  <BarChart3 className="w-5 h-5 text-cyan-500" />
                  Study Statistics
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Mastery</span>
                      <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>{userProgress?.mastery || 0}%</span>
                    </div>
                    <div className={`h-2 rounded-full overflow-hidden ${
                      darkMode ? 'bg-gray-800' : 'bg-gray-200'
                    }`}>
                      <div 
                        className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full transition-all duration-1000"
                        style={{ width: `${userProgress?.mastery || 0}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Review Count</span>
                      <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>{userProgress?.reviewCount || 0}</span>
                    </div>
                    <div className={`h-2 rounded-full overflow-hidden ${
                      darkMode ? 'bg-gray-800' : 'bg-gray-200'
                    }`}>
                      <div 
                        className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-1000"
                        style={{ width: `${Math.min((userProgress?.reviewCount || 0) * 10, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t">
                    <p className={`text-sm ${
                      darkMode ? 'text-gray-400' : 'text-gray-600'
                    }`}>Last Reviewed</p>
                    <p className={`font-medium ${
                      darkMode ? 'text-white' : 'text-gray-800'
                    }`}>
                      {userProgress?.lastReviewed 
                        ? new Date(userProgress.lastReviewed).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })
                        : 'Never reviewed'
                      }
                    </p>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className={`rounded-3xl border p-6 ${
                darkMode 
                  ? 'bg-gradient-to-br from-gray-900 to-black border-gray-800' 
                  : 'bg-gradient-to-br from-white to-gray-50 border-gray-200 shadow-lg'
              }`}>
                <h3 className={`text-lg font-bold mb-4 ${
                  darkMode ? 'text-white' : 'text-gray-800'
                }`}>Quick Actions</h3>
                <div className="space-y-3">
                  <button
                    onClick={() => speakText(selectedCard.word)}
                    className={`w-full flex items-center justify-between p-3 rounded-xl transition-all duration-200 group ${
                      darkMode 
                        ? 'bg-gray-800/50 hover:bg-gray-800' 
                        : 'bg-gray-100 hover:bg-gray-200'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Play className="w-5 h-5 text-cyan-500" />
                      <span className={darkMode ? 'text-gray-300 group-hover:text-white' : 'text-gray-700 group-hover:text-gray-900'}>
                        Listen to Pronunciation
                      </span>
                    </div>
                    <Volume2 className="w-5 h-5 text-gray-500" />
                  </button>
                  
                  <button
                    onClick={() => {
                      toggleBookmark(selectedCard);
                      toggleLearned(selectedCard);
                    }}
                    className={`w-full flex items-center justify-between p-3 rounded-xl transition-all duration-200 group ${
                      darkMode 
                        ? 'bg-gray-800/50 hover:bg-gray-800' 
                        : 'bg-gray-100 hover:bg-gray-200'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Zap className="w-5 h-5 text-amber-500" />
                      <span className={darkMode ? 'text-gray-300 group-hover:text-white' : 'text-gray-700 group-hover:text-gray-900'}>
                        Quick Master
                      </span>
                    </div>
                    <Sparkles className="w-5 h-5 text-gray-500" />
                  </button>
                  
                  <button
                    onClick={() => window.open(selectedCard.redirect_to, '_blank')}
                    className={`w-full flex items-center justify-between p-3 rounded-xl transition-all duration-200 group ${
                      darkMode 
                        ? 'bg-gray-800/50 hover:bg-gray-800' 
                        : 'bg-gray-100 hover:bg-gray-200'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <ExternalLink className="w-5 h-5 text-indigo-500" />
                      <span className={darkMode ? 'text-gray-300 group-hover:text-white' : 'text-gray-700 group-hover:text-gray-900'}>
                        Open External Resource
                      </span>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-500" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Main Browser View
  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      darkMode ? 'bg-gradient-to-br from-gray-900 via-black to-gray-900' : 'bg-gradient-to-br from-gray-50 via-white to-blue-50'
    }`}>
      {/* Animated Background */}
      {darkMode && (
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -inset-[10px] opacity-50">
            <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
            <div className="absolute top-3/4 left-3/4 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="relative z-10">
        {/* Header */}
        <header className="px-4 md:px-8 pt-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold mb-3">
                  <span className={`bg-gradient-to-r bg-clip-text text-transparent ${
                    darkMode ? 'from-white via-gray-300 to-white' : 'from-gray-800 via-gray-700 to-gray-800'
                  }`}>
                    Japanese
                  </span>
                  <span className="bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 bg-clip-text text-transparent">
                    Mastery
                  </span>
                </h1>
                <p className={`text-lg ${
                  darkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>Unlock the beauty of Japanese language</p>
              </div>
              
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setDarkMode(!darkMode)}
                  className={`p-3 rounded-2xl transition-all duration-300 hover:scale-105 ${
                    darkMode 
                      ? 'bg-gray-800/50 backdrop-blur-lg border border-gray-800 text-gray-300 hover:text-white hover:border-amber-500' 
                      : 'bg-white/80 backdrop-blur-lg border border-gray-300 text-gray-700 hover:text-gray-900 hover:border-amber-400 shadow-sm'
                  }`}
                  title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
                >
                  {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </button>
                
                <button
                  onClick={() => setShuffled(!shuffled)}
                  className={`px-5 py-3 rounded-2xl font-medium transition-all duration-300 flex items-center gap-2 hover:scale-105 ${
                    shuffled 
                      ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-lg shadow-purple-500/30' 
                      : darkMode
                        ? 'bg-gray-800/50 backdrop-blur-lg border border-gray-800 text-gray-300 hover:border-purple-500 hover:text-white'
                        : 'bg-white/80 backdrop-blur-lg border border-gray-300 text-gray-700 hover:border-purple-400 hover:text-gray-900 shadow-sm'
                  }`}
                >
                  <Shuffle className="w-5 h-5" />
                  {shuffled ? 'Shuffled' : 'Shuffle'}
                </button>
                
             <div
  className={`flex backdrop-blur-lg rounded-2xl overflow-hidden max-w-full ${
    darkMode 
      ? 'bg-gray-800/50 border border-gray-800' 
      : 'bg-white/80 border border-gray-300 shadow-sm'
  }`}
>
  <button
    onClick={() => setViewMode('grid')}
    className={`px-3 sm:px-5 py-2 sm:py-3 flex items-center gap-2 transition-all text-sm sm:text-base ${
      viewMode === 'grid' 
        ? darkMode
          ? 'bg-gradient-to-r from-gray-800 to-gray-900 text-white'
          : 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-900'
        : darkMode
          ? 'text-gray-400 hover:text-white hover:bg-gray-800/50'
          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/50'
    }`}
  >
    <Grid className="w-4 h-4 sm:w-5 sm:h-5" />
    <span className="hidden sm:inline">Grid</span>
  </button>

  <button
    onClick={() => setViewMode('list')}
    className={`px-3 sm:px-5 py-2 sm:py-3 flex items-center gap-2 transition-all text-sm sm:text-base ${
      viewMode === 'list' 
        ? darkMode
          ? 'bg-gradient-to-r from-gray-800 to-gray-900 text-white'
          : 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-900'
        : darkMode
          ? 'text-gray-400 hover:text-white hover:bg-gray-800/50'
          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/50'
    }`}
  >
    <List className="w-4 h-4 sm:w-5 sm:h-5" />
    <span className="hidden sm:inline">List</span>
  </button>
</div>

              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {[
                { 
                  label: 'Total Cards', 
                  value: stats.total, 
                  icon: BookOpen, 
                  color: 'from-cyan-500 to-blue-500',
                  border: 'cyan'
                },
                { 
                  label: 'Bookmarked', 
                  value: stats.bookmarked, 
                  icon: Bookmark, 
                  color: 'from-amber-500 to-orange-500',
                  border: 'amber'
                },
                { 
                  label: 'Mastered', 
                  value: stats.learned, 
                  icon: Award, 
                  color: 'from-emerald-500 to-green-500',
                  border: 'emerald'
                },
                { 
                  label: 'New Cards', 
                  value: stats.newCards, 
                  icon: Sparkles, 
                  color: 'from-purple-500 to-violet-500',
                  border: 'purple'
                },
              ].map((stat, index) => (
                <div
                  key={index}
                  className={`rounded-2xl p-5 border transition-all duration-300 hover:scale-105 cursor-pointer ${
                    darkMode 
                      ? `bg-gradient-to-br from-gray-900 to-black border-gray-800 hover:border-${stat.border}-500` 
                      : `bg-gradient-to-br from-white to-gray-50 border-gray-200 hover:border-${stat.border}-400 shadow-sm hover:shadow-lg`
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className={`text-sm mb-1 ${
                        darkMode ? 'text-gray-400' : 'text-gray-600'
                      }`}>{stat.label}</p>
                      <p className={`text-2xl font-bold ${
                        darkMode ? 'text-white' : 'text-gray-800'
                      }`}>{stat.value}</p>
                    </div>
                    <div className={`w-10 h-10 rounded-full bg-gradient-to-r ${stat.color} flex items-center justify-center`}>
                      <stat.icon className="w-5 h-5 text-white" />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Data Loader */}
            {showDataLoader && (
              <DataLoader 
                onLoadData={loadData} 
                totalCards={Array.isArray(n4Kanji) ? n4Kanji.length : Object.values(n4Kanji).length}
                isLoading={isLoading}
              />
            )}

            {/* Filters */}
            <div className={`rounded-3xl border p-6 mb-8 ${
              darkMode 
                ? 'bg-gradient-to-br from-gray-900 to-black border-gray-800' 
                : 'bg-gradient-to-br from-white to-gray-50 border-gray-200 shadow-lg'
            }`}>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <Filter className="w-6 h-6 text-cyan-500" />
                  <h2 className={`text-xl font-bold ${
                    darkMode ? 'text-white' : 'text-gray-800'
                  }`}>Filters & Search</h2>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className={`p-2 rounded-xl transition-colors ${
                      darkMode 
                        ? 'hover:bg-gray-800' 
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    <Sliders className={`w-5 h-5 ${
                      darkMode ? 'text-gray-400' : 'text-gray-600'
                    }`} />
                  </button>
                  <button
                    onClick={() => setShowDataLoader(true)}
                    className={`px-4 py-2 rounded-xl flex items-center gap-2 ${
                      darkMode 
                        ? 'bg-gray-800/50 text-gray-300 hover:bg-gray-800' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <Database className="w-4 h-4" />
                    Load More
                  </button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <div className="relative">
                    <Search className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
                      darkMode ? 'text-gray-500' : 'text-gray-400'
                    }`} />
                    <input
                      type="text"
                      value={filter.search}
                      onChange={(e) => setFilter(prev => ({ ...prev, search: e.target.value }))}
                      className={`w-full pl-12 pr-4 py-3 rounded-xl focus:ring-2 focus:ring-cyan-500/30 focus:border-cyan-500 transition-all placeholder-gray-500 ${
                        darkMode 
                          ? 'bg-gray-900/50 border border-gray-800 text-white' 
                          : 'bg-white/80 border border-gray-300 text-gray-900 shadow-sm'
                      }`}
                      placeholder="Search cards..."
                    />
                  </div>
                </div>

                <select
                  value={filter.type}
                  onChange={(e) => setFilter(prev => ({ ...prev, type: e.target.value as any }))}
                  className={`px-4 py-3 rounded-xl focus:ring-2 focus:ring-cyan-500/30 focus:border-cyan-500 transition-all ${
                    darkMode 
                      ? 'bg-gray-900/50 border border-gray-800 text-white' 
                      : 'bg-white/80 border border-gray-300 text-gray-900 shadow-sm'
                  }`}
                >
                  <option value="all">All Types</option>
                  <option value="word">Vocabulary</option>
                  <option value="kanji">Kanji</option>
                </select>

<select
  value={filter.jlpt}
  onChange={(e) => setFilter(prev => ({ ...prev, jlpt: e.target.value as any }))}
  className="..."
>
  <option value="all">All JLPT</option>
  <option value="N5">N5</option>
  <option value="N4">N4</option>
  <option value="N3">N3</option>
  <option value="N2">N2</option>
  <option value="N1">N1</option>
</select>


                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setFilter(prev => ({ ...prev, showBookmarked: !prev.showBookmarked }))}
                    className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 ${
                      filter.showBookmarked 
                        ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white' 
                        : darkMode
                          ? 'bg-gray-900/50 text-gray-400 hover:text-white border border-gray-800'
                          : 'bg-white/80 text-gray-600 hover:text-gray-900 border border-gray-300 shadow-sm'
                    }`}
                  >
                    <Bookmark className="w-4 h-4" />
                    Bookmarked
                  </button>
                  <button
                    onClick={() => setFilter(prev => ({ ...prev, showLearned: !prev.showLearned }))}
                    className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 ${
                      filter.showLearned 
                        ? 'bg-gradient-to-r from-emerald-500 to-green-500 text-white' 
                        : darkMode
                          ? 'bg-gray-900/50 text-gray-400 hover:text-white border border-gray-800'
                          : 'bg-white/80 text-gray-600 hover:text-gray-900 border border-gray-300 shadow-sm'
                    }`}
                  >
                    <CheckCircle className="w-4 h-4" />
                    Mastered
                  </button>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Cards Grid */}
        <main className="px-4 md:px-8 pb-12">
          <div className="max-w-7xl mx-auto">
            {filteredCards.length === 0 ? (
              <div className={`text-center py-16 rounded-3xl border ${
                darkMode 
                  ? 'bg-gradient-to-br from-gray-900 to-black border-gray-800' 
                  : 'bg-gradient-to-br from-white to-gray-50 border-gray-200 shadow-lg'
              }`}>
                <div className={`w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center border ${
                  darkMode 
                    ? 'bg-gradient-to-r from-gray-800 to-black border-gray-800' 
                    : 'bg-gradient-to-r from-gray-100 to-white border-gray-300'
                }`}>
                  <Search className={`w-10 h-10 ${
                    darkMode ? 'text-gray-600' : 'text-gray-400'
                  }`} />
                </div>
                <p className={`text-lg ${
                  darkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>No cards found. Try adjusting your filters.</p>
              </div>
            ) : (
              <div className={viewMode === 'grid' 
                ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' 
                : 'space-y-4'
              }>
                {filteredCards.map((card) => {
                  const key = getCardKey(card);
                  const userProgress = userData[key];
                  const jlptColor = getJLPTColor(card.jlpt);
                  const isHovered = hoveredCard === key;

                  return (
                    <div
                      key={key}
                      className={`group relative rounded-3xl border transition-all duration-500 overflow-hidden cursor-pointer ${
                        darkMode 
                          ? 'bg-gradient-to-br from-gray-900 to-black' 
                          : 'bg-gradient-to-br from-white to-gray-50'
                      } ${
                        isHovered 
                          ? 'scale-105 shadow-2xl border-cyan-500/50' 
                          : darkMode
                            ? 'border-gray-800 hover:border-cyan-500/30'
                            : 'border-gray-200 hover:border-cyan-400/50 shadow-sm hover:shadow-lg'
                      }`}
                      onMouseEnter={() => setHoveredCard(key)}
                      onMouseLeave={() => setHoveredCard(null)}
                      onClick={() => openDetailsPage(card)}
                    >
                      {/* Animated background */}
                      <div className={`absolute inset-0 bg-gradient-to-br ${getCardGradient(card)} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
                      
                      {/* Card content */}
                      <div className="relative z-10 p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-2">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${jlptColor.bg} ${jlptColor.text} border ${jlptColor.border}`}>
                              N{card.jlpt}
                            </span>
                            
                            {card.card === 'word' ? (
                              <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                darkMode 
                                  ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white' 
                                  : 'bg-gradient-to-r from-indigo-400 to-purple-400 text-white'
                              }`}>
                                VOCAB
                              </span>
                            ) : (
                              <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                darkMode 
                                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white' 
                                  : 'bg-gradient-to-r from-amber-400 to-orange-400 text-white'
                              }`}>
                                KANJI
                              </span>
                            )}
                          </div>
                          
                          <div className="flex items-center gap-1">
                            {userProgress?.bookmarked && (
                              <BookmarkCheck className="w-4 h-4 text-amber-500" />
                            )}
                            {userProgress?.learned && (
                              <Award className="w-4 h-4 text-emerald-500" />
                            )}
                          </div>
                        </div>
                        
                        <h3 className={`text-3xl font-bold mb-3 group-hover:text-cyan-600 transition-colors ${
                          darkMode ? 'text-white' : 'text-gray-800'
                        }`}>
                          {card.word}
                        </h3>
                        
                        {card.kana && (
                          <p className={`text-sm mb-2 ${
                            darkMode ? 'text-gray-400' : 'text-gray-600'
                          }`}>{card.kana}</p>
                        )}
                        
                        <p className={`mb-4 line-clamp-2 ${
                          darkMode ? 'text-gray-300' : 'text-gray-700'
                        }`}>{card.meaning}</p>
                        
                        <div className="flex items-center justify-between">
                          {card.type && (
                            <span className={`px-3 py-1 rounded-lg text-xs font-medium text-white ${getTypeColor(card.type)}`}>
                              {card.type}
                            </span>
                          )}
                          
                          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <span className={`text-xs ${
                              darkMode ? 'text-gray-400' : 'text-gray-500'
                            }`}>View Details</span>
                            <ChevronRight className="w-4 h-4 text-cyan-500" />
                          </div>
                        </div>
                      </div>
                      
                      {/* Hover effect */}
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 to-blue-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Footer */}
            <div className="mt-8 text-center">
              <div className={`inline-flex items-center gap-4 px-6 py-3 rounded-2xl ${
                darkMode 
                  ? 'bg-gray-900/50 border border-gray-800' 
                  : 'bg-white/80 border border-gray-200 shadow-sm'
              }`}>
                <p className={`text-sm ${
                  darkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Showing <span className="font-bold text-cyan-500">{filteredCards.length}</span> of{' '}
                  <span className="font-bold">{loadedCardsCount}</span> loaded cards
                  {shuffled && (
                    <span className="ml-2">
                      <Shuffle className="w-3 h-3 inline mr-1 text-purple-500" />
                      Shuffled
                    </span>
                  )}
                </p>
                
                {loadedCardsCount < (Array.isArray(n4Kanji) ? n4Kanji.length : Object.values(n4Kanji).length) && (
                  <button
                    onClick={() => setShowDataLoader(true)}
                    className={`px-3 py-1 rounded-lg text-sm font-medium flex items-center gap-1 ${
                      darkMode 
                        ? 'bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white' 
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-700 hover:text-gray-900'
                    }`}
                  >
                    <Database className="w-3 h-3" />
                    Load More
                  </button>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default CardBrowser;