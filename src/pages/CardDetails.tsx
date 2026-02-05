import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Bookmark,
  BookmarkCheck,
  Award,
  Target,
  Mic,
  Pause,
  ChevronLeft,
  ChevronRight,
  Volume2,
  Zap,
  Sparkles,
  ExternalLink,
  BarChart3,
  Layers,
  Sun,
  Moon,
  Play,
  Home,
  RotateCw,
  JapaneseYen,
  WholeWord,
  Clock,
  Calendar,
  Share2,
  Copy,
  Heart,
  Flame,
  Droplets,
  Palette,
  Sparkle,
  ChevronsRight,
  TrendingUp,
  Users,
  Star
} from 'lucide-react';
import n4Kanji from "./Vocabulary/fullvocabulary.json";
// Reuse the same types from CardBrowser
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
const getCardKey = (card: CardData): string => {
  return `${card.card}-${card.index}-${card.word}`;
};
const CardDetails: React.FC = () => {
  const { cardType, index, word } = useParams<{ cardType: string; index: string; word: string }>();
  const navigate = useNavigate();
  const [card, setCard] = useState<CardData | null>(null);
  const [userData, setUserData] = useState<AppData>({});
  const [speaking, setSpeaking] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : false;
  });
  const [relatedCards, setRelatedCards] = useState<CardData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);
  useEffect(() => {
    // Load user data and theme
    const savedData = localStorage.getItem("japanese-flashcards-progress");
    if (savedData) setUserData(JSON.parse(savedData));
    // Find the card
    const raw = Array.isArray(n4Kanji) ? n4Kanji : Object.values(n4Kanji);
    const decodedWord = decodeURIComponent(word || '');
    const cardIndex = parseInt(index || '0');
   
    const foundCard = raw.find((item: any) =>
      item.index === cardIndex &&
      item.card === cardType &&
      (item.word === decodedWord || item.kanji === decodedWord)
    );
    if (foundCard) {
      const normalized: CardData = (() => {
        const jlptNormalized = String(foundCard.jlpt).startsWith("N")
          ? String(foundCard.jlpt)
          : `N${foundCard.jlpt}`;
        if (foundCard.card === "kanji") {
          return {
            index: foundCard.index,
            word: foundCard.kanji,
            meaning: foundCard.meaning,
            jlpt: jlptNormalized as JLPTLevel,
            card: "kanji",
            final_index: foundCard.final_index,
            layout: foundCard.layout,
            keyword: foundCard.keyword,
            elements: foundCard.elements,
            strokes: foundCard.strokes,
            image: foundCard.image,
            "on-yomi": foundCard["on-yomi"],
            redirect_to: foundCard.redirect_to,
            "kun-yomi": foundCard["kun-yomi"],
            permalink: foundCard.permalink,
            redirect_from: foundCard.redirect_from,
            prev: foundCard.prev,
            next: foundCard.next,
            on: foundCard.on,
            on_en: foundCard.on_en,
            kun: foundCard.kun,
            kun_en: foundCard.kun_en,
          } as KanjiCard;
        }
        return {
          index: foundCard.index,
          word: foundCard.word,
          kana: foundCard.kana,
          romaji: foundCard.romaji,
          meaning: foundCard.meaning,
          jlpt: jlptNormalized as JLPTLevel,
          type: foundCard.type,
          card: "word",
          final_index: foundCard.final_index,
        } as WordCard;
      })();
      setCard(normalized);
      setIsFavorite(userData[getCardKey(normalized)]?.bookmarked || false);
      // Find related cards (same JLPT level and type)
      const related = raw.filter((item: any) =>
        item.jlpt === foundCard.jlpt &&
        item.index !== foundCard.index &&
        item.card === foundCard.card
      ).slice(0, 6).map((item: any) => {
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
      setRelatedCards(related);
    }
    setIsLoading(false);
  }, [cardType, index, word, userData]);
  const saveUserData = (newData: AppData) => {
    setUserData(newData);
    localStorage.setItem('japanese-flashcards-progress', JSON.stringify(newData));
  };
  const toggleBookmark = useCallback(() => {
    if (!card) return;
    const key = getCardKey(card);
    const newData = {
      ...userData,
      [key]: {
        ...userData[key],
        bookmarked: !userData[key]?.bookmarked,
        lastReviewed: Date.now(),
        reviewCount: (userData[key]?.reviewCount || 0) + 1
      }
    };
    saveUserData(newData);
    setIsFavorite(!isFavorite);
  }, [card, userData, isFavorite]);
  const toggleLearned = useCallback(() => {
    if (!card) return;
    const key = getCardKey(card);
    const newData = {
      ...userData,
      [key]: {
        ...userData[key],
        learned: !userData[key]?.learned,
        lastReviewed: Date.now(),
        reviewCount: (userData[key]?.reviewCount || 0) + 1,
        mastery: !userData[key]?.learned ? 100 : 0
      }
    };
    saveUserData(newData);
  }, [card, userData]);
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
  const copyToClipboard = useCallback((text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, []);
  const getJLPTColor = (jlpt: JLPTLevel) => {
    const colors = {
      '5': {
        bg: darkMode ? 'bg-gradient-to-r from-amber-400/20 via-yellow-400/10 to-amber-400/20' : 'bg-gradient-to-r from-amber-100 via-yellow-50 to-amber-100',
        text: darkMode ? 'text-amber-300' : 'text-amber-700',
        border: darkMode ? 'border-amber-400/30' : 'border-amber-300',
        gradient: 'from-amber-500 to-yellow-500'
      },
      'N5': {
        bg: darkMode ? 'bg-gradient-to-r from-amber-400/20 via-yellow-400/10 to-amber-400/20' : 'bg-gradient-to-r from-amber-100 via-yellow-50 to-amber-100',
        text: darkMode ? 'text-amber-300' : 'text-amber-700',
        border: darkMode ? 'border-amber-400/30' : 'border-amber-300',
        gradient: 'from-amber-500 to-yellow-500'
      },
      '4': {
        bg: darkMode ? 'bg-gradient-to-r from-emerald-400/20 via-green-400/10 to-emerald-400/20' : 'bg-gradient-to-r from-emerald-100 via-green-50 to-emerald-100',
        text: darkMode ? 'text-emerald-300' : 'text-emerald-700',
        border: darkMode ? 'border-emerald-400/30' : 'border-emerald-300',
        gradient: 'from-emerald-500 to-green-500'
      },
      'N4': {
        bg: darkMode ? 'bg-gradient-to-r from-emerald-400/20 via-green-400/10 to-emerald-400/20' : 'bg-gradient-to-r from-emerald-100 via-green-50 to-emerald-100',
        text: darkMode ? 'text-emerald-300' : 'text-emerald-700',
        border: darkMode ? 'border-emerald-400/30' : 'border-emerald-300',
        gradient: 'from-emerald-500 to-green-500'
      },
      'N3': {
        bg: darkMode ? 'bg-gradient-to-r from-cyan-400/20 via-blue-400/10 to-cyan-400/20' : 'bg-gradient-to-r from-cyan-100 via-blue-50 to-cyan-100',
        text: darkMode ? 'text-cyan-300' : 'text-cyan-700',
        border: darkMode ? 'border-cyan-400/30' : 'border-cyan-300',
        gradient: 'from-cyan-500 to-blue-500'
      },
      'N2': {
        bg: darkMode ? 'bg-gradient-to-r from-violet-400/20 via-purple-400/10 to-violet-400/20' : 'bg-gradient-to-r from-violet-100 via-purple-50 to-violet-100',
        text: darkMode ? 'text-violet-300' : 'text-violet-700',
        border: darkMode ? 'border-violet-400/30' : 'border-violet-300',
        gradient: 'from-violet-500 to-purple-500'
      },
      'N1': {
        bg: darkMode ? 'bg-gradient-to-r from-rose-400/20 via-pink-400/10 to-rose-400/20' : 'bg-gradient-to-r from-rose-100 via-pink-50 to-rose-100',
        text: darkMode ? 'text-rose-300' : 'text-rose-700',
        border: darkMode ? 'border-rose-400/30' : 'border-rose-300',
        gradient: 'from-rose-500 to-pink-500'
      },
    };
    return colors[jlpt] || {
      bg: darkMode ? 'bg-gradient-to-r from-gray-400/20 via-slate-400/10 to-gray-400/20' : 'bg-gradient-to-r from-gray-100 via-slate-50 to-gray-100',
      text: darkMode ? 'text-gray-300' : 'text-gray-700',
      border: darkMode ? 'border-gray-400/30' : 'border-gray-300',
      gradient: 'from-gray-500 to-slate-500'
    };
  };
  const getTypeColor = (type?: CardType) => {
    switch (type) {
      case 'Noun':
        return darkMode
          ? 'bg-gradient-to-r from-blue-400/20 to-indigo-400/20 text-blue-300 border border-blue-400/20'
          : 'bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 border border-blue-200';
      case 'Verb':
        return darkMode
          ? 'bg-gradient-to-r from-red-400/20 to-pink-400/20 text-red-300 border border-red-400/20'
          : 'bg-gradient-to-r from-red-50 to-pink-50 text-red-700 border border-red-200';
      case 'Adjective':
        return darkMode
          ? 'bg-gradient-to-r from-emerald-400/20 to-green-400/20 text-emerald-300 border border-emerald-400/20'
          : 'bg-gradient-to-r from-emerald-50 to-green-50 text-emerald-700 border border-emerald-200';
      case 'Adverb':
        return darkMode
          ? 'bg-gradient-to-r from-purple-400/20 to-violet-400/20 text-purple-300 border border-purple-400/20'
          : 'bg-gradient-to-r from-purple-50 to-violet-50 text-purple-700 border border-purple-200';
      default:
        return darkMode
          ? 'bg-gradient-to-r from-gray-400/20 to-slate-400/20 text-gray-300 border border-gray-400/20'
          : 'bg-gradient-to-r from-gray-50 to-slate-50 text-gray-700 border border-gray-200';
    }
  };
  const getKanjiCharacterStyle = (card: CardData) => {
    if (card.card !== 'kanji') return '';
   
    const kanjiCard = card as KanjiCard;
    const strokeCount = kanjiCard.strokes;
   
    if (strokeCount <= 5) {
      return darkMode
        ? 'text-8xl bg-gradient-to-br from-amber-300 via-yellow-300 to-amber-400 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(251,191,36,0.7)]'
        : 'text-8xl bg-gradient-to-br from-amber-500 via-yellow-500 to-amber-600 bg-clip-text text-transparent';
    } else if (strokeCount <= 10) {
      return darkMode
        ? 'text-8xl bg-gradient-to-br from-emerald-300 via-green-300 to-emerald-400 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(52,211,153,0.7)]'
        : 'text-8xl bg-gradient-to-br from-emerald-500 via-green-500 to-emerald-600 bg-clip-text text-transparent';
    } else if (strokeCount <= 15) {
      return darkMode
        ? 'text-8xl bg-gradient-to-br from-cyan-300 via-blue-300 to-cyan-400 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(34,211,238,0.7)]'
        : 'text-8xl bg-gradient-to-br from-cyan-500 via-blue-500 to-cyan-600 bg-clip-text text-transparent';
    } else {
      return darkMode
        ? 'text-8xl bg-gradient-to-br from-violet-300 via-purple-300 to-violet-400 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(167,139,250,0.7)]'
        : 'text-8xl bg-gradient-to-br from-violet-500 via-purple-500 to-violet-600 bg-clip-text text-transparent';
    }
  };
  if (isLoading) {
    return (
      <div className={`min-h-screen flex items-center justify-center transition-colors duration-500 ${
        darkMode ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' : 'bg-gradient-to-br from-gray-50 via-blue-50 to-gray-50'
      }`}>
        <div className="text-center">
          <div className="relative">
            <div className={`w-24 h-24 border-4 rounded-full ${
              darkMode ? 'border-indigo-500/20' : 'border-indigo-300/30'
            }`}></div>
            <div className={`w-24 h-24 border-4 border-transparent rounded-full absolute top-0 left-0 animate-spin ${
              darkMode ? 'border-t-indigo-500' : 'border-t-indigo-600'
            }`}></div>
            <Sparkles className={`w-8 h-8 absolute -top-2 -right-2 animate-pulse ${
              darkMode ? 'text-indigo-400' : 'text-indigo-500'
            }`} />
          </div>
          <p className={`mt-6 font-medium animate-pulse ${
            darkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>Loading card details...</p>
        </div>
      </div>
    );
  }
  if (!card) {
    return (
      <div className={`min-h-screen flex items-center justify-center transition-colors duration-500 ${
        darkMode ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' : 'bg-gradient-to-br from-gray-50 via-blue-50 to-gray-50'
      }`}>
        <div className="text-center max-w-md mx-auto px-6">
          <div className={`w-24 h-24 mx-auto mb-8 rounded-2xl flex items-center justify-center ${
            darkMode
              ? 'bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700'
              : 'bg-gradient-to-br from-white to-gray-50 border-gray-100'
          }`}>
            <JapaneseYen className={`w-12 h-12 ${
              darkMode ? 'text-gray-600' : 'text-gray-400'
            }`} />
          </div>
          <h2 className={`text-3xl font-bold mb-4 ${
            darkMode ? 'text-white' : 'text-gray-800'
          }`}>Card Not Found</h2>
          <p className={`mb-8 text-lg ${
            darkMode ? 'text-gray-400' : 'text-gray-600'
          }`}>The requested Japanese card could not be found.</p>
          <Link
            to="/"
            className={`px-8 py-4 rounded-2xl font-medium inline-flex items-center gap-3 transition-all duration-300 hover:scale-105 ${
              darkMode
                ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:from-cyan-600 hover:to-blue-600 shadow-lg hover:shadow-xl'
                : 'bg-gradient-to-r from-cyan-400 to-blue-400 text-white hover:from-cyan-500 hover:to-blue-500 shadow-lg hover:shadow-xl'
            }`}
          >
            <Home className="w-5 h-5" />
            Back to Card Browser
          </Link>
        </div>
      </div>
    );
  }
  const userProgress = userData[getCardKey(card)];
  const jlptColor = getJLPTColor(card.jlpt);
  const kanjiStyle = getKanjiCharacterStyle(card);
  const kanjiCard = card.card === 'kanji' ? card as KanjiCard : null;
  return (
    <div className={`min-h-screen transition-colors duration-500 ${
      darkMode
        ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900'
        : 'bg-gradient-to-br from-gray-50 via-blue-50/20 to-gray-50'
    }`}>
      {/* Animated Background */}
      {darkMode ? (
        <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-10">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>
      ) : (
        <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-5">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-cyan-300 to-blue-300 rounded-full blur-3xl animate-pulse"></div>
        </div>
      )}
      {/* Enhanced Floating Navigation Bar */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <div className={`px-4 md:px-8 py-4 ${
          darkMode
            ? 'bg-gradient-to-r from-gray-900/90 to-gray-800/90 backdrop-blur-lg border-b border-gray-700/50'
            : 'bg-gradient-to-r from-white/95 to-blue-50/95 backdrop-blur-lg border-b border-gray-200/80 shadow-lg'
        }`}>
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate(-1)}
                className={`group flex items-center gap-3 px-5 py-3 rounded-2xl transition-all duration-300 hover:scale-105 active:scale-95 ${
                  darkMode
                    ? 'bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 text-gray-300 hover:text-white hover:border-cyan-500/50'
                    : 'bg-white border border-gray-200 text-gray-700 hover:text-gray-900 hover:border-cyan-400 shadow-lg hover:shadow-xl'
                }`}
              >
                <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                <span className="font-medium">Back</span>
              </button>
             
              <Link
                to="/"
                className={`p-3 rounded-2xl transition-all duration-300 hover:scale-110 active:scale-95 ${
                  darkMode
                    ? 'bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 text-gray-300 hover:text-white hover:border-cyan-500/50'
                    : 'bg-white border border-gray-200 text-gray-600 hover:text-gray-900 hover:border-cyan-400 shadow-lg hover:shadow-xl'
                }`}
                title="Back to Home"
              >
                <Home className="w-5 h-5" />
              </Link>
            </div>
           
            <div className="flex items-center gap-3">
              <button
                onClick={() => copyToClipboard(window.location.href)}
                className={`p-3 rounded-2xl transition-all duration-300 hover:scale-110 active:scale-95 ${
                  darkMode
                    ? 'bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 text-gray-300 hover:text-white hover:border-emerald-500/50'
                    : 'bg-white border border-gray-200 text-gray-600 hover:text-gray-900 hover:border-emerald-400 shadow-lg hover:shadow-xl'
                }`}
                title="Share Card"
              >
                {copied ? <CheckCircle className="w-5 h-5 text-emerald-500" /> : <Share2 className="w-5 h-5" />}
              </button>
             
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`p-3 rounded-2xl transition-all duration-300 hover:scale-110 active:scale-95 ${
                  darkMode
                    ? 'bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 text-amber-300 hover:text-white hover:border-amber-500/50'
                    : 'bg-white border border-gray-200 text-gray-600 hover:text-gray-900 hover:border-amber-400 shadow-lg hover:shadow-xl'
                }`}
                title={darkMode ? "Light Mode" : "Dark Mode"}
              >
                {darkMode ? (
                  <Sun className="w-5 h-5 hover:rotate-45 transition-transform" />
                ) : (
                  <Moon className="w-5 h-5 hover:rotate-12 transition-transform" />
                )}
              </button>
             
              <div className={`px-5 py-3 rounded-2xl font-medium ${
                darkMode
                  ? 'bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 text-gray-300'
                  : 'bg-white border border-gray-200 text-gray-700 shadow-lg'
              }`}>
                <span className="flex items-center gap-2">
                  <span className="text-sm opacity-80">Card</span>
                  <span className="font-bold text-cyan-500">#{card.index}</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Main Content */}
      <div className="pt-24 pb-12 px-4 md:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Panel - Card Info */}
          <div className="lg:col-span-2 space-y-8">
            {/* Enhanced Card Header */}
            <div className={`relative rounded-3xl border p-8 overflow-hidden backdrop-blur-sm ${
              darkMode
                ? 'bg-gradient-to-br from-gray-800/40 to-gray-900/40 border-gray-700/50'
                : 'bg-white/90 border-gray-200 shadow-2xl'
            }`}>
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-cyan-500/10 to-transparent rounded-bl-3xl"></div>
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-blue-500/10 to-transparent rounded-tr-3xl"></div>
             
              <div className="relative z-10">
                <div className="flex flex-wrap items-center gap-4 mb-8">
                  <span className={`px-4 py-2.5 rounded-full text-sm font-bold border ${jlptColor.bg} ${jlptColor.text} ${jlptColor.border} shadow-lg`}>
                    JLPT N{card.jlpt}
                  </span>
                 
                  {card.card === 'word' ? (
                    <span className={`px-4 py-2.5 rounded-full text-sm font-bold ${
                      darkMode
                        ? 'bg-gradient-to-r from-indigo-500/20 to-purple-500/20 text-indigo-300 border border-indigo-500/30'
                        : 'bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-700 border border-indigo-300'
                    }`}>
                      <WholeWord className="w-4 h-4 inline mr-2" />
                      Vocabulary
                    </span>
                  ) : (
                    <span className={`px-4 py-2.5 rounded-full text-sm font-bold ${
                      darkMode
                        ? 'bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-300 border border-amber-500/30'
                        : 'bg-gradient-to-r from-amber-50 to-orange-50 text-amber-700 border border-amber-300'
                    }`}>
                      <JapaneseYen className="w-4 h-4 inline mr-2" />
                      Kanji
                    </span>
                  )}
                 
                  {card.type && (
                    <span className={`px-4 py-2.5 rounded-full text-sm font-bold ${getTypeColor(card.type)}`}>
                      {card.type}
                    </span>
                  )}
                </div>
               
                <div className="mb-8">
                  <h1 className={`${kanjiStyle} font-bold mb-6 text-center lg:text-left`}>
                    {card.word}
                  </h1>
                 
                  <div className="flex flex-col lg:flex-row items-center lg:items-start gap-6">
                    <div className="flex-1">
                      {card.kana && (
                        <p className={`text-3xl mb-4 text-center lg:text-left ${
                          darkMode ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                          {card.kana}
                          {card.romaji && (
                            <span className={`ml-3 text-xl ${
                              darkMode ? 'text-gray-500' : 'text-gray-500'
                            }`}>
                              ({card.romaji})
                            </span>
                          )}
                        </p>
                      )}
                     
                      <p className={`text-3xl font-medium ${
                        darkMode ? 'text-white' : 'text-gray-800'
                      }`}>
                        {card.meaning}
                      </p>
                    </div>
                   
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => speakText(card.word)}
                        className={`p-4 rounded-2xl transition-all duration-300 hover:scale-110 active:scale-95 ${
                          darkMode
                            ? 'bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 text-gray-300 hover:text-white hover:border-cyan-500/50'
                            : 'bg-white border border-gray-200 text-gray-600 hover:text-gray-900 hover:border-cyan-400 shadow-lg hover:shadow-xl'
                        }`}
                        title="Listen to pronunciation"
                      >
                        {speaking ? (
                          <Pause className="w-6 h-6 text-cyan-500 animate-pulse" />
                        ) : (
                          <Volume2 className="w-6 h-6" />
                        )}
                      </button>
                     
                      <button
                        onClick={toggleBookmark}
                        className={`p-4 rounded-2xl transition-all duration-300 hover:scale-110 active:scale-95 ${
                          isFavorite
                            ? darkMode
                              ? 'bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-300 border border-amber-500/30'
                              : 'bg-gradient-to-r from-amber-50 to-orange-50 text-amber-700 border border-amber-300'
                            : darkMode
                              ? 'bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 text-gray-300 hover:text-white hover:border-amber-500/50'
                              : 'bg-white border border-gray-200 text-gray-600 hover:text-gray-900 hover:border-amber-400 shadow-lg hover:shadow-xl'
                        }`}
                        title={isFavorite ? "Remove from bookmarks" : "Add to bookmarks"}
                      >
                        {isFavorite ? (
                          <BookmarkCheck className="w-6 h-6" />
                        ) : (
                          <Bookmark className="w-6 h-6" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Enhanced Action Buttons */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <button
                onClick={toggleBookmark}
                className={`group relative p-8 rounded-2xl border transition-all duration-300 hover:scale-105 active:scale-95 overflow-hidden ${
                  isFavorite
                    ? darkMode
                      ? 'bg-gradient-to-r from-indigo-900/30 to-purple-900/30 border-indigo-500/30'
                      : 'bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-300'
                    : darkMode
                      ? 'bg-gradient-to-br from-gray-800/40 to-gray-900/40 border-gray-700/50 hover:border-indigo-500/50'
                      : 'bg-white/90 border-gray-200 hover:border-indigo-400 shadow-lg hover:shadow-xl'
                }`}
              >
                {/* Background glow */}
                <div className={`absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>
               
                <div className="relative z-10">
                  <div className="flex flex-col items-center gap-4">
                    {isFavorite ? (
                      <>
                        <div className="relative">
                          <BookmarkCheck className="w-8 h-8 text-indigo-500 group-hover:scale-110 transition-transform" />
                          <Sparkles className="w-4 h-4 absolute -top-1 -right-1 text-indigo-400 animate-pulse" />
                        </div>
                        <span className={`text-lg font-medium ${
                          darkMode ? 'text-white' : 'text-gray-800'
                        }`}>Bookmarked</span>
                      </>
                    ) : (
                      <>
                        <Bookmark className="w-8 h-8 text-gray-500 group-hover:text-indigo-500 transition-colors" />
                        <span className={`text-lg font-medium ${
                          darkMode ? 'text-gray-300 group-hover:text-white' : 'text-gray-600 group-hover:text-gray-800'
                        }`}>Bookmark</span>
                      </>
                    )}
                  </div>
                </div>
              </button>
             
              <button
                onClick={toggleLearned}
                className={`group relative p-8 rounded-2xl border transition-all duration-300 hover:scale-105 active:scale-95 overflow-hidden ${
                  userProgress?.learned
                    ? darkMode
                      ? 'bg-gradient-to-r from-emerald-900/30 to-green-900/30 border-emerald-500/30'
                      : 'bg-gradient-to-r from-emerald-50 to-green-50 border-emerald-300'
                    : darkMode
                      ? 'bg-gradient-to-br from-gray-800/40 to-gray-900/40 border-gray-700/50 hover:border-emerald-500/50'
                      : 'bg-white/90 border-gray-200 hover:border-emerald-400 shadow-lg hover:shadow-xl'
                }`}
              >
                {/* Background glow */}
                <div className={`absolute inset-0 bg-gradient-to-r from-emerald-500 to-green-500 opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>
               
                <div className="relative z-10">
                  <div className="flex flex-col items-center gap-4">
                    {userProgress?.learned ? (
                      <>
                        <div className="relative">
                          <Award className="w-8 h-8 text-emerald-500 group-hover:scale-110 transition-transform" />
                          <Star className="w-4 h-4 absolute -top-1 -right-1 text-emerald-400 animate-pulse" />
                        </div>
                        <span className={`text-lg font-medium ${
                          darkMode ? 'text-white' : 'text-gray-800'
                        }`}>Mastered</span>
                      </>
                    ) : (
                      <>
                        <Target className="w-8 h-8 text-gray-500 group-hover:text-emerald-500 transition-colors" />
                        <span className={`text-lg font-medium ${
                          darkMode ? 'text-gray-300 group-hover:text-white' : 'text-gray-600 group-hover:text-gray-800'
                        }`}>Mark as Learned</span>
                      </>
                    )}
                  </div>
                </div>
              </button>
             
              <button
                onClick={() => {
                  toggleBookmark();
                  toggleLearned();
                }}
                className={`group relative p-8 rounded-2xl border transition-all duration-300 hover:scale-105 active:scale-95 overflow-hidden ${
                  darkMode
                    ? 'bg-gradient-to-br from-gray-800/40 to-gray-900/40 border-gray-700/50 hover:border-amber-500/50'
                    : 'bg-white/90 border-gray-200 hover:border-amber-400 shadow-lg hover:shadow-xl'
                }`}
              >
                {/* Background glow */}
                <div className={`absolute inset-0 bg-gradient-to-r from-amber-500 to-orange-500 opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>
               
                <div className="relative z-10">
                  <div className="flex flex-col items-center gap-4">
                    <Zap className="w-8 h-8 text-gray-500 group-hover:text-amber-500 transition-colors" />
                    <span className={`text-lg font-medium ${
                      darkMode ? 'text-gray-300 group-hover:text-white' : 'text-gray-600 group-hover:text-gray-800'
                    }`}>Quick Master</span>
                  </div>
                </div>
              </button>
            </div>
            {/* Enhanced Kanji Details */}
            {kanjiCard && (
              <div className={`relative rounded-3xl border p-8 overflow-hidden backdrop-blur-sm ${
                darkMode
                  ? 'bg-gradient-to-br from-gray-800/40 to-gray-900/40 border-gray-700/50'
                  : 'bg-white/90 border-gray-200 shadow-2xl'
              }`}>
                {/* Decorative elements */}
                <div className="absolute top-0 left-0 w-24 h-24 bg-gradient-to-br from-amber-500/10 to-transparent rounded-br-3xl"></div>
               
                <h2 className={`text-3xl font-bold mb-8 flex items-center gap-4 ${
                  darkMode ? 'text-white' : 'text-gray-800'
                }`}>
                  <div className={`p-3 rounded-2xl ${
                    darkMode
                      ? 'bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700'
                      : 'bg-white border border-gray-100 shadow-lg'
                  }`}>
                    <Layers className="w-6 h-6 text-amber-500" />
                  </div>
                  <span>Kanji Breakdown</span>
                  <span className="text-sm font-normal opacity-70">({kanjiCard.strokes} strokes)</span>
                </h2>
               
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className={`group relative rounded-xl p-5 border transition-all duration-300 hover:scale-105 ${
                      darkMode ? 'bg-gray-800/30 border-gray-700/50 hover:border-amber-500/30' : 'bg-gray-50/80 border-gray-200 hover:border-amber-300'
                    }`}>
                      <p className={`text-sm mb-2 ${
                        darkMode ? 'text-gray-400' : 'text-gray-600'
                      }`}>Keyword</p>
                      <p className={`text-2xl font-bold ${
                        darkMode ? 'text-white' : 'text-gray-900'
                      }`}>{kanjiCard.keyword}</p>
                    </div>
                   
                    <div className={`group relative rounded-xl p-5 border transition-all duration-300 hover:scale-105 ${
                      darkMode ? 'bg-gray-800/30 border-gray-700/50 hover:border-blue-500/30' : 'bg-gray-50/80 border-gray-200 hover:border-blue-300'
                    }`}>
                      <p className={`text-sm mb-2 ${
                        darkMode ? 'text-gray-400' : 'text-gray-600'
                      }`}>Strokes</p>
                      <p className={`text-3xl font-bold ${
                        darkMode ? 'text-blue-300' : 'text-blue-600'
                      }`}>{kanjiCard.strokes}</p>
                    </div>
                   
                    <div className={`group relative rounded-xl p-5 border transition-all duration-300 hover:scale-105 ${
                      darkMode ? 'bg-gray-800/30 border-gray-700/50 hover:border-emerald-500/30' : 'bg-gray-50/80 border-gray-200 hover:border-emerald-300'
                    }`}>
                      <p className={`text-sm mb-2 ${
                        darkMode ? 'text-gray-400' : 'text-gray-600'
                      }`}>Elements</p>
                      <p className={`text-lg ${
                        darkMode ? 'text-gray-300' : 'text-gray-700'
                      }`}>{kanjiCard.elements}</p>
                    </div>
                  </div>
                 
                  <div className="space-y-4">
                    <div className={`group relative rounded-xl p-5 border transition-all duration-300 hover:scale-105 ${
                      darkMode ? 'bg-gray-800/30 border-gray-700/50 hover:border-blue-500/30' : 'bg-gray-50/80 border-gray-200 hover:border-blue-300'
                    }`}>
                      <p className={`text-sm mb-2 ${
                        darkMode ? 'text-gray-400' : 'text-gray-600'
                      }`}>On-yomi (Chinese Reading)</p>
                      <p className="text-2xl font-bold text-blue-500">{kanjiCard.on}</p>
                      <p className={`text-sm mt-1 ${
                        darkMode ? 'text-gray-500' : 'text-gray-600'
                      }`}>{kanjiCard.on_en}</p>
                    </div>
                   
                    <div className={`group relative rounded-xl p-5 border transition-all duration-300 hover:scale-105 ${
                      darkMode ? 'bg-gray-800/30 border-gray-700/50 hover:border-emerald-500/30' : 'bg-gray-50/80 border-gray-200 hover:border-emerald-300'
                    }`}>
                      <p className={`text-sm mb-2 ${
                        darkMode ? 'text-gray-400' : 'text-gray-600'
                      }`}>Kun-yomi (Japanese Reading)</p>
                      <p className="text-2xl font-bold text-emerald-500">{kanjiCard.kun}</p>
                      <p className={`text-sm mt-1 ${
                        darkMode ? 'text-gray-500' : 'text-gray-600'
                      }`}>{kanjiCard.kun_en}</p>
                    </div>
                   
                    {kanjiCard.image && (
                      <div className={`group relative rounded-xl p-5 border transition-all duration-300 hover:scale-105 ${
                        darkMode ? 'bg-gray-800/30 border-gray-700/50 hover:border-purple-500/30' : 'bg-gray-50/80 border-gray-200 hover:border-purple-300'
                      }`}>
                        <p className={`text-sm mb-2 ${
                          darkMode ? 'text-gray-400' : 'text-gray-600'
                        }`}>Unicode</p>
                        <p className={`text-lg font-mono ${
                          darkMode ? 'text-gray-300' : 'text-gray-700'
                        }`}>{kanjiCard.image}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
          {/* Right Panel - Iframe & Additional Info */}
          <div className="space-y-8">
            {/* Enhanced Iframe Container */}
            {kanjiCard && kanjiCard.redirect_to && (
              <div className={`relative rounded-3xl border overflow-hidden backdrop-blur-sm ${
                darkMode
                  ? 'bg-gradient-to-br from-gray-800/40 to-gray-900/40 border-gray-700/50'
                  : 'bg-white/90 border-gray-200 shadow-2xl'
              }`}>
                <div className={`p-6 border-b ${
                  darkMode ? 'bg-gradient-to-r from-gray-800/80 to-gray-900/80 border-gray-700/50' : 'border-gray-200 bg-white/90'
                }`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-xl ${
                        darkMode
                          ? 'bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700'
                          : 'bg-white border border-gray-100 shadow-lg'
                      }`}>
                        <ExternalLink className="w-5 h-5 text-indigo-500" />
                      </div>
                      <div>
                        <h3 className={`text-lg font-bold ${
                          darkMode ? 'text-white' : 'text-gray-800'
                        }`}>Interactive Kanji View</h3>
                        <p className={`text-xs ${
                          darkMode ? 'text-gray-400' : 'text-gray-600'
                        }`}>Stroke order & details</p>
                      </div>
                    </div>
                    <a
                      href={kanjiCard.redirect_to}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-indigo-500 hover:text-indigo-600 font-medium flex items-center gap-2"
                    >
                      Open Full <ChevronsRight className="w-4 h-4" />
                    </a>
                  </div>
                </div>
                <div className="h-[500px]">
                  <iframe
                    src={kanjiCard.redirect_to}
                    className="w-full h-full"
                    title="Kanji details"
                    sandbox="allow-scripts allow-same-origin"
                    loading="lazy"
                  />
                </div>
              </div>
            )}
            {/* Enhanced Study Stats */}
            <div className={`relative rounded-3xl border p-6 backdrop-blur-sm overflow-hidden ${
              darkMode
                ? 'bg-gradient-to-br from-gray-800/40 to-gray-900/40 border-gray-700/50'
                : 'bg-white/90 border-gray-200 shadow-2xl'
            }`}>
              {/* Background glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-blue-500/5 opacity-0 hover:opacity-100 transition-opacity duration-500"></div>
             
              <div className="relative z-10">
                <h3 className={`text-xl font-bold mb-6 flex items-center gap-3 ${
                  darkMode ? 'text-white' : 'text-gray-800'
                }`}>
                  <div className={`p-2 rounded-xl ${
                    darkMode
                      ? 'bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700'
                      : 'bg-white border border-gray-100 shadow-lg'
                  }`}>
                    <BarChart3 className="w-5 h-5 text-cyan-500" />
                  </div>
                  <span>Study Statistics</span>
                </h3>
               
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Mastery Level</span>
                      <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>{userProgress?.mastery || 0}%</span>
                    </div>
                    <div className={`h-3 rounded-full overflow-hidden ${
                      darkMode ? 'bg-gray-800/50' : 'bg-gray-200/80'
                    }`}>
                      <div
                        className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full transition-all duration-1000 ease-out shadow-lg"
                        style={{ width: `${userProgress?.mastery || 0}%` }}
                      ></div>
                    </div>
                  </div>
                 
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Review Count</span>
                      <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>{userProgress?.reviewCount || 0} times</span>
                    </div>
                    <div className={`h-3 rounded-full overflow-hidden ${
                      darkMode ? 'bg-gray-800/50' : 'bg-gray-200/80'
                    }`}>
                      <div
                        className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-1000 ease-out shadow-lg"
                        style={{ width: `${Math.min((userProgress?.reviewCount || 0) * 10, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                 
                  <div className="pt-4 border-t">
                    <p className={`text-sm mb-1 ${
                      darkMode ? 'text-gray-400' : 'text-gray-600'
                    }`}>Last Reviewed</p>
                    <p className={`font-medium flex items-center gap-2 ${
                      darkMode ? 'text-white' : 'text-gray-800'
                    }`}>
                      <Clock className="w-4 h-4" />
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
            </div>
            {/* Enhanced Quick Actions */}
            <div className={`relative rounded-3xl border p-6 backdrop-blur-sm overflow-hidden ${
              darkMode
                ? 'bg-gradient-to-br from-gray-800/40 to-gray-900/40 border-gray-700/50'
                : 'bg-white/90 border-gray-200 shadow-2xl'
            }`}>
              <h3 className={`text-lg font-bold mb-6 ${
                darkMode ? 'text-white' : 'text-gray-800'
              }`}>Quick Actions</h3>
              <div className="space-y-3">
                <button
                  onClick={() => speakText(card.word)}
                  className={`group w-full flex items-center justify-between p-4 rounded-xl transition-all duration-200 hover:scale-105 active:scale-95 ${
                    darkMode
                      ? 'bg-gray-800/40 hover:bg-gray-800/60 border border-gray-700/50'
                      : 'bg-gray-100/80 hover:bg-gray-200/80 border border-gray-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${
                      darkMode
                        ? 'bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700'
                        : 'bg-white border border-gray-100 shadow-sm'
                    }`}>
                      <Play className="w-4 h-4 text-cyan-500" />
                    </div>
                    <span className={darkMode ? 'text-gray-300 group-hover:text-white' : 'text-gray-700 group-hover:text-gray-900'}>
                      Listen to Pronunciation
                    </span>
                  </div>
                  <Volume2 className="w-5 h-5 text-gray-500 group-hover:text-cyan-500 transition-colors" />
                </button>
               
                <button
                  onClick={() => {
                    if (kanjiCard?.redirect_to) {
                      window.open(kanjiCard.redirect_to, '_blank');
                    }
                  }}
                  className={`group w-full flex items-center justify-between p-4 rounded-xl transition-all duration-200 hover:scale-105 active:scale-95 ${
                    darkMode
                      ? 'bg-gray-800/40 hover:bg-gray-800/60 border border-gray-700/50'
                      : 'bg-gray-100/80 hover:bg-gray-200/80 border border-gray-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${
                      darkMode
                        ? 'bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700'
                        : 'bg-white border border-gray-100 shadow-sm'
                    }`}>
                      <ExternalLink className="w-4 h-4 text-indigo-500" />
                    </div>
                    <span className={darkMode ? 'text-gray-300 group-hover:text-white' : 'text-gray-700 group-hover:text-gray-900'}>
                      Open External Resource
                    </span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-500 group-hover:text-indigo-500 transition-colors" />
                </button>
               
                <button
                  onClick={() => copyToClipboard(`${card.word} - ${card.meaning}`)}
                  className={`group w-full flex items-center justify-between p-4 rounded-xl transition-all duration-200 hover:scale-105 active:scale-95 ${
                    darkMode
                      ? 'bg-gray-800/40 hover:bg-gray-800/60 border border-gray-700/50'
                      : 'bg-gray-100/80 hover:bg-gray-200/80 border border-gray-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${
                      darkMode
                        ? 'bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700'
                        : 'bg-white border border-gray-100 shadow-sm'
                    }`}>
                      <Copy className="w-4 h-4 text-emerald-500" />
                    </div>
                    <span className={darkMode ? 'text-gray-300 group-hover:text-white' : 'text-gray-700 group-hover:text-gray-900'}>
                      Copy Card Info
                    </span>
                  </div>
                  {copied ? (
                    <CheckCircle className="w-5 h-5 text-emerald-500" />
                  ) : (
                    <Copy className="w-5 h-5 text-gray-500 group-hover:text-emerald-500 transition-colors" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
        {/* Enhanced Related Cards Section */}
        {relatedCards.length > 0 && (
          <div className="mt-16">
            <div className="flex items-center justify-between mb-8">
              <h2 className={`text-3xl font-bold ${
                darkMode ? 'text-white' : 'text-gray-800'
              }`}>
                Related Cards
                <span className={`text-sm font-normal ml-3 ${
                  darkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  (Same JLPT N{card.jlpt} • {card.card === 'kanji' ? 'Kanji' : 'Vocabulary'})
                </span>
              </h2>
              <Link
                to="/"
                className={`px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2 ${
                  darkMode
                    ? 'text-gray-400 hover:text-white'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                View All <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
              {relatedCards.map((relatedCard) => {
                const relatedKey = getCardKey(relatedCard);
                const relatedProgress = userData[relatedKey];
                const relatedJlptColor = getJLPTColor(relatedCard.jlpt);
                const relatedKanjiStyle = getKanjiCharacterStyle(relatedCard);
                return (
                  <Link
                    key={relatedKey}
                    to={`/card/${relatedCard.card}/${relatedCard.index}/${encodeURIComponent(relatedCard.word)}`}
                    className={`group block relative rounded-2xl border transition-all duration-300 hover:scale-105 active:scale-95 overflow-hidden backdrop-blur-sm ${
                      darkMode
                        ? 'bg-gradient-to-br from-gray-800/40 to-gray-900/40 border-gray-700/50 hover:border-cyan-500/50'
                        : 'bg-white/90 border-gray-200 hover:border-cyan-400 shadow-lg hover:shadow-xl'
                    }`}
                  >
                    {/* Background gradient */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${
                      relatedCard.card === 'kanji'
                        ? darkMode
                          ? 'from-amber-400/5 to-yellow-400/5'
                          : 'from-amber-50 to-yellow-50'
                        : darkMode
                          ? 'from-indigo-400/5 to-purple-400/5'
                          : 'from-indigo-50 to-purple-50'
                    } opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
                   
                    <div className="relative z-10 p-4">
                      <div className="flex items-start justify-between mb-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${relatedJlptColor.bg} ${relatedJlptColor.text} border ${relatedJlptColor.border}`}>
                          N{relatedCard.jlpt}
                        </span>
                        <div className="flex items-center gap-1">
                          {relatedProgress?.bookmarked && (
                            <Bookmark className="w-3 h-3 text-amber-500" />
                          )}
                          {relatedProgress?.learned && (
                            <Award className="w-3 h-3 text-emerald-500" />
                          )}
                        </div>
                      </div>
                      <h3 className={`${relatedKanjiStyle} font-bold mb-2 text-3xl text-center group-hover:scale-110 transition-transform duration-300`}>
                        {relatedCard.word}
                      </h3>
                      <p className={`text-sm line-clamp-2 text-center ${
                        darkMode ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        {relatedCard.meaning}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default CardDetails;