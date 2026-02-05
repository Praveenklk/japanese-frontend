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
import { useNavigate } from 'react-router-dom';
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

const CardBrowser: React.FC = () => {
  const navigate = useNavigate();
  const [cards, setCards] = useState<CardData[]>([]);
  const [filteredCards, setFilteredCards] = useState<CardData[]>([]);
  const [userData, setUserData] = useState<AppData>({});
  const [viewMode, setViewMode] = useState<'grid' | 'list'>(() => {
    const saved = localStorage.getItem('japanese-flashcards-viewMode');
    return saved ? JSON.parse(saved) as 'grid' | 'list' : 'grid';
  });
  
  const [filter, setFilter] = useState<{
    type: 'all' | 'word' | 'kanji';
    jlpt: JLPTLevel | 'all';
    search: string;
    showBookmarked: boolean;
    showLearned: boolean;
    showNew: boolean;
  }>(() => {
    const saved = localStorage.getItem('japanese-flashcards-filter');
    return saved ? JSON.parse(saved) : {
      type: 'all',
      jlpt: 'all',
      search: '',
      showBookmarked: false,
      showLearned: false,
      showNew: false,
    };
  });
  
  const [shuffled, setShuffled] = useState(() => {
    const saved = localStorage.getItem('japanese-flashcards-shuffled');
    return saved ? JSON.parse(saved) : false;
  });
  
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [activeAnimation, setActiveAnimation] = useState<string | null>(null);
  const [speaking, setSpeaking] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : false;
  });
  const [showDataLoader, setShowDataLoader] = useState(false);
  const [loadedCardsCount, setLoadedCardsCount] = useState(0);
  const [showFilters, setShowFilters] = useState(() => {
    const saved = localStorage.getItem('japanese-flashcards-showFilters');
    return saved ? JSON.parse(saved) : true;
  });

  // Initialize data
  useEffect(() => {
    const loadData = async (count: number = 300) => {
      setIsInitialLoading(true);
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
        
        // Add slight delay for better UX
        setTimeout(() => {
          setCards(limited);
          setFilteredCards(limited);
          setLoadedCardsCount(limited.length);
          setIsInitialLoading(false);
          setIsLoading(false);
        }, 500);
        
        const savedData = localStorage.getItem("japanese-flashcards-progress");
        if (savedData) setUserData(JSON.parse(savedData));
      } catch (err) {
        console.error("Load error:", err);
        setIsInitialLoading(false);
        setIsLoading(false);
      }
    };
    loadData(4000);
  }, []);

  // Save states when they change
  useEffect(() => {
    localStorage.setItem('japanese-flashcards-filter', JSON.stringify(filter));
  }, [filter]);
  
  useEffect(() => {
    localStorage.setItem('japanese-flashcards-viewMode', JSON.stringify(viewMode));
  }, [viewMode]);
  
  useEffect(() => {
    localStorage.setItem('japanese-flashcards-shuffled', JSON.stringify(shuffled));
  }, [shuffled]);
  
  useEffect(() => {
    localStorage.setItem('japanese-flashcards-showFilters', JSON.stringify(showFilters));
  }, [showFilters]);
  
  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  // Save progress
  useEffect(() => {
    localStorage.setItem('japanese-flashcards-progress', JSON.stringify(userData));
  }, [userData]);

  // Filter cards
  useEffect(() => {
    if (isInitialLoading) return;
    
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
  }, [cards, filter, shuffled, userData, isInitialLoading]);

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

  // Navigate to card details
  const openDetailsPage = (card: CardData) => {
    const encodedWord = encodeURIComponent(card.word);
    navigate(`/card/${card.card}/${card.index}/${encodedWord}`);
  };

  // Load more data
  const loadMoreData = (count: number) => {
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
      return darkMode 
        ? 'from-amber-500/10 via-orange-500/10 to-yellow-500/10' 
        : 'from-amber-200/90 via-orange-100/90 to-yellow-200/90';
    }
    
    // Vocabulary card gradients
    const jlpt = card.jlpt;
    if (jlpt === '5' || jlpt === 'N5') return darkMode 
      ? 'from-yellow-500/10 via-amber-500/10 to-yellow-500/10' 
      : 'from-yellow-100/90 via-amber-100/90 to-yellow-100/90';
    if (jlpt === '4' || jlpt === 'N4') return darkMode 
      ? 'from-emerald-500/10 via-green-500/10 to-emerald-500/10' 
      : 'from-emerald-100/90 via-green-100/90 to-emerald-100/90';
    if (jlpt === 'N3') return darkMode 
      ? 'from-blue-500/10 via-cyan-500/10 to-blue-500/10' 
      : 'from-blue-100/90 via-cyan-100/90 to-blue-100/90';
    if (jlpt === 'N2') return darkMode 
      ? 'from-purple-500/10 via-violet-500/10 to-purple-500/10' 
      : 'from-purple-100/90 via-violet-100/90 to-purple-100/90';
    if (jlpt === 'N1') return darkMode 
      ? 'from-rose-500/10 via-red-500/10 to-rose-500/10' 
      : 'from-rose-100/90 via-red-100/90 to-rose-100/90';
    
    return darkMode 
      ? 'from-gray-500/10 via-slate-500/10 to-gray-500/10' 
      : 'from-gray-100/90 via-slate-100/90 to-gray-100/90';
  };

  const getCardBorderColor = (card: CardData) => {
    if (card.card === 'kanji') {
      return darkMode ? 'border-amber-500/30' : 'border-amber-300/50';
    }
    
    const jlpt = card.jlpt;
    if (jlpt === '5' || jlpt === 'N5') return darkMode ? 'border-yellow-500/30' : 'border-yellow-300/50';
    if (jlpt === '4' || jlpt === 'N4') return darkMode ? 'border-emerald-500/30' : 'border-emerald-300/50';
    if (jlpt === 'N3') return darkMode ? 'border-blue-500/30' : 'border-blue-300/50';
    if (jlpt === 'N2') return darkMode ? 'border-purple-500/30' : 'border-purple-300/50';
    if (jlpt === 'N1') return darkMode ? 'border-rose-500/30' : 'border-rose-300/50';
    
    return darkMode ? 'border-gray-500/30' : 'border-gray-300/50';
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

  // Clear filter button handler
  const clearFilters = () => {
    setFilter({
      type: 'all',
      jlpt: 'all',
      search: '',
      showBookmarked: false,
      showLearned: false,
      showNew: false,
    });
  };

if (isInitialLoading) {
  return (
    <div
      className={`min-h-screen flex items-center justify-center transition-colors duration-300 ${
        darkMode
          ? 'bg-gradient-to-br from-gray-900 via-black to-gray-900'
          : 'bg-gradient-to-br from-gray-50 via-white to-blue-50'
      }`}
    >
      <div className="relative text-center px-6">
        {/* Glow */}
        <div
          className={`absolute inset-0 blur-3xl opacity-30 ${
            darkMode
              ? 'bg-gradient-to-r from-purple-500/30 via-blue-500/30 to-cyan-500/30'
              : 'bg-gradient-to-r from-blue-300/40 via-cyan-300/40 to-purple-300/40'
          }`}
        />

        {/* Loader Rings */}
        <div className="relative mx-auto mb-10 w-28 h-28">
          <div
            className={`absolute inset-0 rounded-full border-4 ${
              darkMode ? 'border-indigo-500/20' : 'border-indigo-300/40'
            }`}
          />
          <div
            className={`absolute inset-0 rounded-full border-4 border-transparent animate-spin ${
              darkMode ? 'border-t-cyan-500' : 'border-t-cyan-600'
            }`}
            style={{ animationDuration: '1.2s' }}
          />
          <div
            className={`absolute inset-2 rounded-full border-4 border-transparent animate-spin ${
              darkMode ? 'border-t-purple-500' : 'border-t-purple-600'
            }`}
            style={{ animationDuration: '1.8s' }}
          />

          {/* Floating Sparkle */}
          <Sparkles
            className={`absolute -top-3 -right-3 w-8 h-8 animate-bounce ${
              darkMode ? 'text-indigo-400' : 'text-indigo-500'
            }`}
          />
        </div>

        {/* Title */}
        <h2 className="text-4xl font-extrabold mb-3 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 bg-clip-text text-transparent">
          Japanese Mastery
        </h2>

        {/* Subtitle */}
        <p
          className={`mt-2 text-base sm:text-lg font-medium ${
            darkMode ? 'text-gray-300' : 'text-gray-600'
          }`}
        >
          Preparing your learning experience...
        </p>

        {/* Animated shimmer bar */}
        <div className="mt-6 w-56 h-2 mx-auto rounded-full overflow-hidden bg-gray-300/30">
          <div className="h-full w-1/3 bg-gradient-to-r from-cyan-500 to-purple-500 animate-pulse" />
        </div>

        {/* Hint text */}
        <p
          className={`text-xs mt-4 tracking-wide ${
            darkMode ? 'text-gray-500' : 'text-gray-400'
          }`}
        >
          Loading vocabulary, kanji & progress
        </p>
      </div>
    </div>
  );
}


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

            {/* Filters */}
{/* Filters */}
<div
  className={`w-full max-w-7xl mx-auto rounded-3xl border p-4 sm:p-6 mb-8 transition-all duration-300 ${
    darkMode
      ? 'bg-gradient-to-br from-gray-900 to-black border-gray-800'
      : 'bg-gradient-to-br from-white to-gray-50 border-gray-200 shadow-lg'
  }`}
>
  {/* Header */}
  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
    <div className="flex items-center gap-3">
      <Filter className="w-6 h-6 text-cyan-500" />
      <h2 className={`text-lg sm:text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
        Filters & Search
      </h2>
    </div>

    <div className="flex flex-wrap gap-2">
      <button
        onClick={clearFilters}
        className={`px-4 py-2 rounded-xl flex items-center gap-2 text-sm w-full sm:w-auto ${
          darkMode
            ? 'bg-gray-800/50 text-gray-300 hover:bg-gray-800 hover:text-white'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }`}
      >
        <RotateCw className="w-4 h-4" />
        Clear Filters
      </button>

      <button
        onClick={() => loadMoreData(loadedCardsCount + 1000)}
        className={`px-4 py-2 rounded-xl flex items-center gap-2 text-sm w-full sm:w-auto ${
          darkMode
            ? 'bg-gray-800/50 text-gray-300 hover:bg-gray-800 hover:text-white'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }`}
      >
        <Database className="w-4 h-4" />
        Load More
      </button>
    </div>
  </div>

  {/* Filters Grid */}
  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4">
    {/* Search */}
    <div className="relative w-full xl:col-span-2">
      <Search
        className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${
          darkMode ? 'text-gray-500' : 'text-gray-400'
        }`}
      />
      <input
        type="text"
        value={filter.search}
        onChange={(e) => setFilter(prev => ({ ...prev, search: e.target.value }))}
        className={`w-full pl-12 pr-4 py-3 rounded-xl focus:ring-2 focus:ring-cyan-500/30 focus:border-cyan-500 transition-all ${
          darkMode
            ? 'bg-gray-900/50 border border-gray-800 text-white'
            : 'bg-white/80 border border-gray-300 text-gray-900 shadow-sm'
        }`}
        placeholder="Search cards..."
      />
    </div>

    {/* Type */}
    <select
      value={filter.type}
      onChange={(e) => setFilter(prev => ({ ...prev, type: e.target.value as any }))}
      className={`w-full px-4 py-3 rounded-xl focus:ring-2 focus:ring-cyan-500/30 transition-all ${
        darkMode
          ? 'bg-gray-900/50 border border-gray-800 text-white'
          : 'bg-white/80 border border-gray-300 text-gray-900 shadow-sm'
      }`}
    >
      <option value="all">Voc & Kanji</option>
      <option value="word">Vocabulary</option>
      <option value="kanji">Kanji</option>
    </select>

    {/* JLPT */}
    <select
      value={filter.jlpt}
      onChange={(e) => setFilter(prev => ({ ...prev, jlpt: e.target.value as any }))}
      className={`w-full px-4 py-3 rounded-xl focus:ring-2 focus:ring-cyan-500/30 transition-all ${
        darkMode
          ? 'bg-gray-900/50 border border-gray-800 text-white'
          : 'bg-white/80 border border-gray-300 text-gray-900 shadow-sm'
      }`}
    >
      <option value="all">All JLPT</option>
      <option value="N5">N5</option>
      <option value="N4">N4</option>
      <option value="N3">N3</option>
      <option value="N2">N2</option>
      <option value="N1">N1</option>
    </select>

    {/* Toggles */}
    <div className="flex flex-wrap gap-2 xl:justify-start">
      <button
        onClick={() => setFilter(prev => ({ ...prev, showBookmarked: !prev.showBookmarked }))}
        className={`px-4 py-2 rounded-xl flex items-center gap-2 text-sm w-full sm:w-auto ${
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
        className={`px-4 py-2 rounded-xl flex items-center gap-2 text-sm w-full sm:w-auto ${
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

      <button
        onClick={() => setFilter(prev => ({ ...prev, showNew: !prev.showNew }))}
        className={`px-4 py-2 rounded-xl flex items-center gap-2 text-sm w-full sm:w-auto ${
          filter.showNew
            ? 'bg-gradient-to-r from-purple-500 to-violet-500 text-white'
            : darkMode
            ? 'bg-gray-900/50 text-gray-400 hover:text-white border border-gray-800'
            : 'bg-white/80 text-gray-600 hover:text-gray-900 border border-gray-300 shadow-sm'
        }`}
      >
        <Sparkles className="w-4 h-4" />
        New
      </button>
    </div>
  </div>

  {/* Active Filters */}
  <div className="mt-4 flex flex-wrap gap-2">
    {filter.type !== 'all' && (
      <span className={`px-3 py-1 rounded-full text-xs ${darkMode ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-700'}`}>
        Type: {filter.type === 'word' ? 'Vocabulary' : 'Kanji'}
      </span>
    )}
    {filter.jlpt !== 'all' && (
      <span className={`px-3 py-1 rounded-full text-xs ${darkMode ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-700'}`}>
        JLPT: {filter.jlpt}
      </span>
    )}
  </div>
</div>



          </div>
        </header>

        {/* Cards Grid */}
        <main className="px-4 md:px-8 pb-12">
          <div className="max-w-7xl mx-auto">
            {isLoading && filteredCards.length === 0 ? (
              <div className="flex justify-center py-12">
                <div className="text-center">
                  <div className="relative">
                    <div className={`w-16 h-16 border-4 rounded-full ${
                      darkMode ? 'border-indigo-500/30' : 'border-indigo-300/50'
                    }`}></div>
                    <div className={`w-16 h-16 border-4 border-transparent rounded-full absolute top-0 left-0 animate-spin ${
                      darkMode ? 'border-t-indigo-500' : 'border-t-indigo-600'
                    }`}></div>
                  </div>
                  <p className={`mt-4 font-medium ${
                    darkMode ? 'text-gray-300' : 'text-gray-600'
                  }`}>Filtering cards...</p>
                </div>
              </div>
            ) : filteredCards.length === 0 ? (
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
                <button
                  onClick={clearFilters}
                  className={`mt-4 px-6 py-3 rounded-xl inline-flex items-center gap-2 ${
                    darkMode
                      ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <RotateCw className="w-4 h-4" />
                  Clear Filters
                </button>
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
                      className={`group relative rounded-3xl border transition-all duration-300 overflow-hidden cursor-pointer h-full ${
                        darkMode
                          ? 'bg-gradient-to-br from-gray-900 to-black'
                          : 'bg-gradient-to-br from-white to-gray-50'
                      } ${
                        isHovered
                          ? 'scale-[1.02] shadow-2xl border-cyan-500/50'
                          : `${getCardBorderColor(card)} hover:border-cyan-500/30 shadow-sm hover:shadow-xl`
                      }`}
                      onMouseEnter={() => setHoveredCard(key)}
                      onMouseLeave={() => setHoveredCard(null)}
                      onClick={() => openDetailsPage(card)}
                    >
                      {/* Animated background gradient */}
                      <div className={`absolute inset-0 bg-gradient-to-br ${getCardGradient(card)} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
                     
                      {/* Card content */}
                      <div className="relative z-10 p-6 h-full flex flex-col">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${jlptColor.bg} ${jlptColor.text} border ${jlptColor.border}`}>
                              {card.jlpt}
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
                       
                        <div className="flex-1">
                          <h3 className={`text-3xl font-bold mb-2 group-hover:text-cyan-600 transition-colors ${
                            darkMode ? 'text-white' : 'text-gray-800'
                          }`}>
                            {card.word}
                          </h3>
                          
                          {/* Show readings for Kanji cards */}
                          {card.card === "kanji" && (
                            <div className={`mb-3 text-xs space-y-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                              {card["on-yomi"] && (
                                <div>
                                  <span className="font-semibold text-cyan-500">On:</span>{" "}
                                  <span>{card["on-yomi"]}</span>
                                </div>
                              )}
                              {card["kun-yomi"] && (
                                <div>
                                  <span className="font-semibold text-emerald-500">Kun:</span>{" "}
                                  <span>{card["kun-yomi"]}</span>
                                </div>
                              )}
                            </div>
                          )}
                         
                          {card.kana && (
                            <p className={`text-sm mb-3 ${
                              darkMode ? 'text-gray-400' : 'text-gray-600'
                            }`}>
                              {card.kana}
                              {card.romaji && (
                                <span className={`ml-2 text-xs ${
                                  darkMode ? 'text-gray-500' : 'text-gray-500'
                                }`}>
                                  ({card.romaji})
                                </span>
                              )}
                            </p>
                          )}
                         
                          <p className={`mb-4 line-clamp-3 ${
                            darkMode ? 'text-gray-300' : 'text-gray-700'
                          }`}>
                            {card.meaning}
                          </p>
                        </div>
                       
                        <div className="flex items-center justify-between pt-4 border-t border-gray-200/20">
                          {card.type && (
                            <span className={`px-3 py-1 rounded-lg text-xs font-medium text-white ${getTypeColor(card.type)}`}>
                              {card.type}
                            </span>
                          )}
                         
                          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <span className={`text-xs ${
                              darkMode ? 'text-gray-400' : 'text-gray-500'
                            }`}>View Details</span>
                            <ChevronRight className="w-4 h-4 text-cyan-500" />
                          </div>
                        </div>
                      </div>
                     
                      {/* Hover effect line */}
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 to-blue-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
                     
                      {/* Corner accent */}
                      <div className={`absolute top-0 right-0 w-16 h-16 overflow-hidden`}>
                        <div className={`absolute w-32 h-32 -top-16 -right-16 rotate-45 ${
                          card.card === 'kanji' 
                            ? 'bg-gradient-to-r from-amber-500/20 to-orange-500/20'
                            : 'bg-gradient-to-r from-indigo-500/20 to-purple-500/20'
                        }`}></div>
                      </div>
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
                    onClick={() => loadMoreData(loadedCardsCount + 1000)}
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