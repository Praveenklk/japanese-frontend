import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Volume2,
  Star,
  CheckCircle,
  XCircle,
  Filter,
  Shuffle,
  BookOpen,
  Bookmark,
  RefreshCw,
  Search,
  Grid3x3,
  List,
  ChevronDown,
  ChevronUp,
  BookmarkCheck,
  Sparkles,
  GraduationCap,
  TrendingUp,
  Zap,
  Maximize2,
  Minimize2,
  Award,
  Target,
  BarChart,
  Layers,
  Hash,
  Clock,
  Brain,
  Flame,
  Trophy,
  Crown,
  Scroll,
  Compass,
  Eye,
  Mic,
  VolumeX
} from "lucide-react";

/* =====================
   Types
===================== */

type KanjiData = {
  strokes: number;
  grade: number | null;
  freq: number | null;
  jlpt_old: number | null;
  jlpt_new: number | null;
  meanings: string[];
  readings_on: string[];
  readings_kun: string[];
  wk_level: number | null;
  wk_meanings: string[] | null;
  wk_readings_on: string[] | null;
  wk_readings_kun: string[] | null;
  wk_radicals: string[] | null;
};

type KanjiMap = Record<string, KanjiData>;

interface Props {
  data: KanjiMap;
}

/* =====================
   Utils
===================== */

const shuffleArray = <T,>(arr: T[]): T[] => {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
};

const saveLS = (key: string, value: unknown) =>
  localStorage.setItem(key, JSON.stringify(value));

const loadLS = <T,>(key: string, fallback: T): T => {
  try {
    const v = localStorage.getItem(key);
    return v ? (JSON.parse(v) as T) : fallback;
  } catch {
    return fallback;
  }
};

const getJLPTColor = (level: number | null): { bg: string; text: string; border: string; accent: string } => {
  if (!level) return { bg: "bg-gray-100", text: "text-gray-600", border: "border-gray-200", accent: "bg-gray-400" };
  const colors: Record<number, { bg: string; text: string; border: string; accent: string }> = {
    5: { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200", accent: "bg-emerald-500" },
    4: { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200", accent: "bg-blue-500" },
    3: { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200", accent: "bg-amber-500" },
    2: { bg: "bg-orange-50", text: "text-orange-700", border: "border-orange-200", accent: "bg-orange-500" },
    1: { bg: "bg-rose-50", text: "text-rose-700", border: "border-rose-200", accent: "bg-rose-500" }
  };
  return colors[level] || { bg: "bg-gray-100", text: "text-gray-600", border: "border-gray-200", accent: "bg-gray-400" };
};

const getStrokesColor = (strokes: number): string => {
  if (strokes <= 5) return "bg-emerald-100 text-emerald-700";
  if (strokes <= 10) return "bg-blue-100 text-blue-700";
  if (strokes <= 15) return "bg-amber-100 text-amber-700";
  return "bg-rose-100 text-rose-700";
};

const getFrequencyBadge = (freq: number | null): string => {
  if (!freq) return "bg-gray-100 text-gray-700";
  if (freq <= 100) return "bg-emerald-100 text-emerald-700";
  if (freq <= 500) return "bg-blue-100 text-blue-700";
  if (freq <= 1000) return "bg-amber-100 text-amber-700";
  return "bg-rose-100 text-rose-700";
};

/* =====================
   Component
===================== */

const KanjiExplorer: React.FC<Props> = ({ data }) => {
  // State
  const [jlpt, setJlpt] = useState<"all" | number>("all");
  const [search, setSearch] = useState("");
  const [shuffleMode, setShuffleMode] = useState(false);
  const [showOnlyFav, setShowOnlyFav] = useState(false);
  const [showOnlyLearned, setShowOnlyLearned] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [expandedCard, setExpandedCard] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<"jlpt" | "strokes" | "freq" | "grade">("jlpt");
  
  // User data
  const [favorites, setFavorites] = useState<string[]>(
    () => loadLS("kanji_fav", [])
  );
  const [learned, setLearned] = useState<string[]>(
    () => loadLS("kanji_learned", [])
  );
  
  // Voice synthesis
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const [voice, setVoice] = useState<SpeechSynthesisVoice | null>(null);
  const [speaking, setSpeaking] = useState<string | null>(null);
  const [muted, setMuted] = useState(false);

  /* =====================
     Effects
  ===================== */

  useEffect(() => {
    if (!("speechSynthesis" in window)) return;
    
    synthRef.current = window.speechSynthesis;
    
    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      const ja = voices.find(v => v.lang.startsWith("ja"));
      setVoice(ja ?? voices[0] ?? null);
    };
    
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
    
    return () => {
      if (synthRef.current?.speaking) {
        synthRef.current.cancel();
      }
    };
  }, []);

  useEffect(() => saveLS("kanji_fav", favorites), [favorites]);
  useEffect(() => saveLS("kanji_learned", learned), [learned]);

  /* =====================
     Derived data
  ===================== */

  const kanjiList = useMemo(() => {
    let list = Object.entries(data);

    // JLPT filter
    if (jlpt !== "all") {
      list = list.filter(
        ([, v]) => v.jlpt_new === jlpt || v.jlpt_old === jlpt
      );
    }

    // Search filter
    if (search.trim()) {
      const q = search.toLowerCase().trim();
      list = list.filter(([k, v]) =>
        k.includes(q) ||
        v.meanings.some(m => m.toLowerCase().includes(q)) ||
        v.readings_on.some(r => r.toLowerCase().includes(q)) ||
        v.readings_kun.some(r => r.toLowerCase().includes(q))
      );
    }

    // Favorites filter
    if (showOnlyFav) {
      list = list.filter(([k]) => favorites.includes(k));
    }

    // Learned filter
    if (showOnlyLearned) {
      list = list.filter(([k]) => learned.includes(k));
    }

    // Sorting
    list.sort((a, b) => {
      switch (sortBy) {
        case "jlpt":
          const aJlpt = a[1].jlpt_new ?? a[1].jlpt_old ?? 99;
          const bJlpt = b[1].jlpt_new ?? b[1].jlpt_old ?? 99;
          return aJlpt - bJlpt;
        case "strokes":
          return a[1].strokes - b[1].strokes;
        case "freq":
          const aFreq = a[1].freq ?? 9999;
          const bFreq = b[1].freq ?? 9999;
          return aFreq - bFreq;
        case "grade":
          const aGrade = a[1].grade ?? 99;
          const bGrade = b[1].grade ?? 99;
          return aGrade - bGrade;
        default:
          return 0;
      }
    });

    // Shuffle
    if (shuffleMode) {
      list = shuffleArray(list);
    }

    return list;
  }, [data, jlpt, search, shuffleMode, favorites, showOnlyFav, showOnlyLearned, learned, sortBy]);

  // Stats
  const stats = useMemo(() => {
    const total = Object.keys(data).length;
    const learnedCount = learned.length;
    const favoriteCount = favorites.length;
    const jlptCounts = [5, 4, 3, 2, 1].reduce((acc, level) => {
      acc[level] = Object.values(data).filter(
        v => v.jlpt_new === level || v.jlpt_old === level
      ).length;
      return acc;
    }, {} as Record<number, number>);
    
    // Calculate JLPT progress
    const jlptProgress = [5, 4, 3, 2, 1].reduce((acc, level) => {
      const totalForLevel = jlptCounts[level];
      const learnedForLevel = learned.filter(k => {
        const kanjiData = data[k];
        return kanjiData && (kanjiData.jlpt_new === level || kanjiData.jlpt_old === level);
      }).length;
      acc[level] = totalForLevel > 0 ? Math.round((learnedForLevel / totalForLevel) * 100) : 0;
      return acc;
    }, {} as Record<number, number>);
    
    return { total, learnedCount, favoriteCount, jlptCounts, jlptProgress };
  }, [data, learned, favorites]);

  /* =====================
     Actions
  ===================== */

  const speak = (text: string, kanji: string) => {
    if (!synthRef.current || !voice || muted) return;
    
    if (synthRef.current.speaking) {
      synthRef.current.cancel();
      if (speaking === kanji) {
        setSpeaking(null);
        return;
      }
    }
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.voice = voice;
    utterance.lang = "ja-JP";
    utterance.rate = 0.8;
    utterance.pitch = 1.2;
    
    utterance.onstart = () => setSpeaking(kanji);
    utterance.onend = () => setSpeaking(null);
    utterance.onerror = () => setSpeaking(null);
    
    synthRef.current.speak(utterance);
  };

  const toggleFav = (kanji: string) => {
    setFavorites(f => 
      f.includes(kanji) 
        ? f.filter(x => x !== kanji)
        : [...f, kanji]
    );
  };

  const toggleLearned = (kanji: string) => {
    setLearned(l =>
      l.includes(kanji)
        ? l.filter(x => x !== kanji)
        : [...l, kanji]
    );
  };

  const clearFilters = () => {
    setJlpt("all");
    setSearch("");
    setShowOnlyFav(false);
    setShowOnlyLearned(false);
    setShuffleMode(false);
    setExpandedCard(null);
    setSortBy("jlpt");
  };

  const resetProgress = () => {
    if (window.confirm("Reset all progress and favorites?")) {
      setFavorites([]);
      setLearned([]);
      setExpandedCard(null);
    }
  };

  /* =====================
     Render
  ===================== */

  const KanjiCard: React.FC<{ kanji: string; data: KanjiData }> = ({ kanji, data }) => {
    const isExpanded = expandedCard === kanji;
    const isFav = favorites.includes(kanji);
    const isLearned = learned.includes(kanji);
    const jlptLevel = data.jlpt_new ?? data.jlpt_old;
    const jlptColors = getJLPTColor(jlptLevel);

    const handleCardClick = () => {
      setExpandedCard(isExpanded ? null : kanji);
    };

    return (
      <div 
        className={`relative rounded-xl transition-all duration-300 overflow-hidden border-2 ${
          isExpanded 
            ? "shadow-xl scale-[1.02] z-10" 
            : "shadow-sm hover:shadow-md"
        } ${isLearned ? "border-emerald-300" : jlptColors.border}`}
        onClick={handleCardClick}
        style={{
          background: `linear-gradient(135deg, ${jlptColors.bg} 0%, white 50%, ${jlptColors.bg} 100%)`
        }}
      >
        {/* Card Header */}
        <div className="p-4 relative">
          {/* JLPT Level Badge */}
          {jlptLevel && (
            <div className={`absolute top-0 left-0 px-3 py-1 rounded-br-xl ${jlptColors.bg} ${jlptColors.text} font-bold text-xs flex items-center gap-1`}>
              <Trophy className="h-3 w-3" />
              N{jlptLevel}
            </div>
          )}

          {/* Action Buttons */}
          <div className="absolute top-3 right-3 flex gap-1">
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleFav(kanji);
              }}
              className={`p-2 rounded-full transition ${
                isFav 
                  ? "bg-amber-500 text-white shadow-md" 
                  : "bg-white/80 text-gray-400 hover:text-amber-500 hover:bg-amber-50 shadow-sm"
              }`}
            >
              <Star className={`h-4 w-4 ${isFav ? "fill-current" : ""}`} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                speak(kanji, kanji);
              }}
              className={`p-2 rounded-full transition ${
                speaking === kanji
                  ? "bg-indigo-500 text-white shadow-md"
                  : "bg-white/80 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 shadow-sm"
              }`}
            >
              {speaking === kanji ? (
                <VolumeX className="h-4 w-4" />
              ) : (
                <Volume2 className="h-4 w-4" />
              )}
            </button>
          </div>

          {/* Kanji Character */}
          <div className="text-center mt-6 mb-4">
            <div className="relative inline-block">
              <div className={`text-6xl font-bold ${jlptColors.text}`}>
                {kanji}
              </div>
              {isLearned && (
                <div className="absolute -top-2 -right-2">
                  <CheckCircle className="h-6 w-6 text-emerald-500 fill-current" />
                </div>
              )}
            </div>
            <p className="text-lg font-semibold text-gray-700 mt-2">
              {data.meanings[0]}
            </p>
          </div>

          {/* Quick Stats */}
          <div className="flex justify-center gap-2 mb-3">
            <div className={`px-3 py-1.5 rounded-lg text-xs font-medium ${getStrokesColor(data.strokes)} flex items-center gap-1.5`}>
              <Layers className="h-3.5 w-3.5" />
              {data.strokes} strokes
            </div>
            {data.freq && (
              <div className={`px-3 py-1.5 rounded-lg text-xs font-medium ${getFrequencyBadge(data.freq)} flex items-center gap-1.5`}>
                <TrendingUp className="h-3.5 w-3.5" />
                #{data.freq}
              </div>
            )}
            {data.grade && (
              <div className="px-3 py-1.5 bg-purple-100 text-purple-700 rounded-lg text-xs font-medium flex items-center gap-1.5">
                <GraduationCap className="h-3.5 w-3.5" />
                Grade {data.grade}
              </div>
            )}
          </div>

          {/* Expand Indicator */}
          <div className="flex justify-center items-center gap-2 text-xs text-gray-500">
            <span>{data.meanings.length} meanings</span>
            <span>•</span>
            <span>{data.readings_on.length + data.readings_kun.length} readings</span>
            <span>•</span>
            <span>{data.wk_radicals?.length || 0} radicals</span>
          </div>
        </div>

        {/* Expanded Content */}
        {isExpanded && (
          <div className="border-t border-gray-200 p-4 space-y-4 animate-in fade-in slide-in-from-top-2 duration-300 bg-white/90">
            {/* Readings Section */}
            <div className="space-y-3">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-indigo-600" />
                    On Readings
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      const reading = data.readings_on[0];
                      if (reading) speak(reading, `${kanji}-on`);
                    }}
                    className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition"
                  >
                    <Mic className="h-3.5 w-3.5" />
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {data.readings_on.map((r, i) => (
                    <span
                      key={i}
                      className="px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-lg text-sm font-medium shadow-sm"
                    >
                      {r}
                    </span>
                  ))}
                </div>
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <Scroll className="h-4 w-4 text-purple-600" />
                    Kun Readings
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      const reading = data.readings_kun[0];
                      if (reading) speak(reading, `${kanji}-kun`);
                    }}
                    className="p-1.5 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-full transition"
                  >
                    <Mic className="h-3.5 w-3.5" />
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {data.readings_kun.map((r, i) => (
                    <span
                      key={i}
                      className="px-3 py-1.5 bg-purple-50 text-purple-700 rounded-lg text-sm font-medium shadow-sm"
                    >
                      {r}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Meanings */}
            <div>
              <span className="text-sm font-semibold text-gray-700 flex items-center gap-2 mb-2">
                <Brain className="h-4 w-4 text-emerald-600" />
                Meanings
              </span>
              <div className="flex flex-wrap gap-2">
                {data.meanings.map((m, i) => (
                  <span
                    key={i}
                    className="px-3 py-1.5 bg-emerald-50 text-emerald-800 rounded-lg text-sm shadow-sm"
                  >
                    {m}
                  </span>
                ))}
              </div>
            </div>

            {/* Additional Info */}
            {(data.wk_level || data.wk_radicals?.length) && (
              <div className="grid grid-cols-2 gap-3 text-sm pt-3 border-t border-gray-100">
                {data.wk_level && (
                  <div className="space-y-1">
                    <span className="text-xs text-gray-500 flex items-center gap-1">
                      <Crown className="h-3.5 w-3.5" />
                      WaniKani Level
                    </span>
                    <div className="font-semibold text-gray-800">Level {data.wk_level}</div>
                  </div>
                )}
                {data.wk_radicals && data.wk_radicals.length > 0 && (
                  <div className="space-y-1">
                    <span className="text-xs text-gray-500 flex items-center gap-1">
                      <Compass className="h-3.5 w-3.5" />
                      Radicals
                    </span>
                    <div className="font-semibold text-gray-800 text-sm">
                      {data.wk_radicals.slice(0, 3).join(", ")}
                      {data.wk_radicals.length > 3 && "..."}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-2 pt-3 border-t border-gray-100">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleLearned(kanji);
                }}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl transition font-medium ${
                  isLearned
                    ? "bg-emerald-100 text-emerald-700 border border-emerald-200"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {isLearned ? (
                  <>
                    <CheckCircle className="h-4 w-4" />
                    Learned
                  </>
                ) : (
                  <>
                    <BookOpen className="h-4 w-4" />
                    Mark Learned
                  </>
                )}
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  const allReadings = [...data.readings_on, ...data.readings_kun];
                  if (allReadings.length > 0) {
                    speak(allReadings.join(", "), `${kanji}-all`);
                  }
                }}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-indigo-100 text-indigo-700 rounded-xl hover:bg-indigo-200 transition font-medium"
              >
                <Volume2 className="h-4 w-4" />
                All Readings
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  /* =====================
     Main Render
  ===================== */

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-indigo-500" />
                Kanji Explorer
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                Master Japanese characters • {stats.learnedCount} learned • {stats.favoriteCount} favorites
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={() => setMuted(!muted)}
                className={`p-2 rounded-lg ${muted ? 'bg-rose-50 text-rose-600' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                {muted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
              </button>
              <div className="flex items-center bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded transition ${
                    viewMode === "grid" 
                      ? "bg-white shadow-sm text-indigo-600" 
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <Grid3x3 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded transition ${
                    viewMode === "list" 
                      ? "bg-white shadow-sm text-indigo-600" 
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Stats Dashboard */}
        <div className="mb-6 grid grid-cols-2 lg:grid-cols-5 gap-3">
          <div className="bg-white rounded-xl border p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Total Kanji</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <BookOpen className="h-8 w-8 text-indigo-500" />
            </div>
          </div>
          
          <div className="bg-white rounded-xl border p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Learned</p>
                <p className="text-2xl font-bold text-gray-900">{stats.learnedCount}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-emerald-500" />
            </div>
            <div className="mt-2 h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-emerald-500 transition-all duration-500"
                style={{ width: `${(stats.learnedCount / stats.total) * 100}%` }}
              />
            </div>
          </div>
          
          <div className="bg-white rounded-xl border p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Favorites</p>
                <p className="text-2xl font-bold text-gray-900">{stats.favoriteCount}</p>
              </div>
              <Star className="h-8 w-8 text-amber-500 fill-current" />
            </div>
          </div>
          
          <div className="bg-white rounded-xl border p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Filtered</p>
                <p className="text-2xl font-bold text-gray-900">{kanjiList.length}</p>
              </div>
              <Filter className="h-8 w-8 text-rose-500" />
            </div>
          </div>
          
          <div className="bg-white rounded-xl border p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">JLPT Level</p>
                <p className="text-2xl font-bold text-gray-900">
                  {jlpt === "all" ? "All" : `N${jlpt}`}
                </p>
              </div>
              <Trophy className="h-8 w-8 text-blue-500" />
            </div>
          </div>
        </div>

        {/* JLPT Progress */}
        <div className="mb-6 bg-white rounded-xl border p-4 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <BarChart className="h-4 w-4" />
            JLPT Progress
          </h3>
          <div className="grid grid-cols-5 gap-2">
            {[5, 4, 3, 2, 1].map(level => {
              const colors = getJLPTColor(level);
              return (
                <div key={level} className="text-center">
                  <div className="text-xs text-gray-500 mb-1">N{level}</div>
                  <div className="relative h-2 bg-gray-100 rounded-full overflow-hidden mb-1">
                    <div 
                      className={`h-full ${colors.accent} transition-all duration-500`}
                      style={{ width: `${stats.jlptProgress[level]}%` }}
                    />
                  </div>
                  <div className="text-xs font-medium" style={{ color: colors.text }}>
                    {stats.jlptCounts[level]} kanji
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Search and Controls */}
        <div className="mb-6 bg-white rounded-xl border p-4 shadow-sm">
          {/* Search Bar */}
          <div className="relative mb-4">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setExpandedCard(null);
              }}
              placeholder="Search kanji, meaning, or reading..."
              className="w-full pl-12 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
            />
            {search && (
              <button
                onClick={() => {
                  setSearch("");
                  setExpandedCard(null);
                }}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <XCircle className="h-5 w-5" />
              </button>
            )}
          </div>

          {/* Controls Row */}
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Left Controls */}
            <div className="flex flex-wrap items-center gap-3 flex-1">
              {/* JLPT Filter */}
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <select
                  value={jlpt}
                  onChange={(e) => {
                    setJlpt(e.target.value === "all" ? "all" : Number(e.target.value));
                    setExpandedCard(null);
                  }}
                  className="pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm appearance-none"
                >
                  <option value="all">All JLPT Levels</option>
                  <option value={5}>JLPT N5 (Beginner)</option>
                  <option value={4}>JLPT N4 (Elementary)</option>
                  <option value={3}>JLPT N3 (Intermediate)</option>
                  <option value={2}>JLPT N2 (Advanced)</option>
                  <option value={1}>JLPT N1 (Expert)</option>
                </select>
              </div>

              {/* Sort By */}
              <select
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value as any);
                  setExpandedCard(null);
                }}
                className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
              >
                <option value="jlpt">Sort by JLPT Level</option>
                <option value="strokes">Sort by Strokes</option>
                <option value="freq">Sort by Frequency</option>
                <option value="grade">Sort by Grade</option>
              </select>
            </div>

            {/* Right Controls */}
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => {
                  setShuffleMode(!shuffleMode);
                  setExpandedCard(null);
                }}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg transition text-sm font-medium ${
                  shuffleMode
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100"
                }`}
              >
                <Shuffle className="h-4 w-4" />
                Shuffle
              </button>
              
              <button
                onClick={() => {
                  setShowOnlyFav(!showOnlyFav);
                  setExpandedCard(null);
                }}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg transition text-sm font-medium ${
                  showOnlyFav
                    ? "bg-amber-600 text-white"
                    : "bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100"
                }`}
              >
                <Star className={`h-4 w-4 ${showOnlyFav ? "fill-current" : ""}`} />
                Favorites
              </button>
              
              <button
                onClick={() => {
                  setShowOnlyLearned(!showOnlyLearned);
                  setExpandedCard(null);
                }}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg transition text-sm font-medium ${
                  showOnlyLearned
                    ? "bg-emerald-600 text-white"
                    : "bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100"
                }`}
              >
                <BookmarkCheck className="h-4 w-4" />
                Learned
              </button>
              
              {(jlpt !== "all" || search || showOnlyFav || showOnlyLearned || shuffleMode || sortBy !== "jlpt") && (
                <button
                  onClick={clearFilters}
                  className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition font-medium"
                >
                  <RefreshCw className="h-4 w-4" />
                  Clear All
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Kanji Grid */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">
              {kanjiList.length} Kanji {jlpt !== "all" && `• JLPT N${jlpt}`}
            </h2>
            <div className="text-sm text-gray-500 flex items-center gap-2">
              <Eye className="h-4 w-4" />
              Click card to {expandedCard ? "collapse" : "expand"} details
            </div>
          </div>
          
          {kanjiList.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl border">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                <Search className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">No Kanji Found</h3>
              <p className="text-gray-500 max-w-md mx-auto mb-6">
                Try adjusting your filters or search terms.
              </p>
              <button
                onClick={clearFilters}
                className="px-6 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            <div className={
              viewMode === "grid" 
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
                : "space-y-4"
            }>
              {kanjiList.map(([kanji, data]) => (
                <KanjiCard key={kanji} kanji={kanji} data={data} />
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t text-center text-sm text-gray-500">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <p className="text-sm text-gray-600">
                Kanji Explorer • {new Date().getFullYear()} • Master Japanese Characters
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Click any card to expand details. Use the voice button to hear pronunciations.
              </p>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={resetProgress}
                className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition"
              >
                <RefreshCw className="h-4 w-4" />
                Reset Progress
              </button>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Volume2 className="h-3 w-3" />
                {muted ? "Audio muted" : "Audio enabled"}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KanjiExplorer;