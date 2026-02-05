import React, { useDeferredValue, useEffect, useMemo, useRef, useState } from "react";
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
  BookmarkCheck,
  Sparkles,
  GraduationCap,
  TrendingUp,
  Layers,
  BarChart,
  Trophy,
  Eye,
  Mic,
  VolumeX,
  Layers as LayersIcon,
  Crown,
  Compass,
  Brain,
  Moon,
  Sun,
  Target,
  Zap,
  Users,
  Clock,
  Award,
  ChevronDown,
  ChevronUp,
  HelpCircle,
  Download,
  Share2,
  Settings,
  Bell,
  User,
  LogOut,
  Maximize2,
  Minimize2,
  BookText,
  Hash,
  Music,
  Type,
  FileText,
  Shield,
  Target as TargetIcon,
  Crosshair,
  PenTool,
  Eye as EyeIcon
} from "lucide-react";

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

/* ===================== Utils ===================== */

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

const getJLPTColor = (level: number | null, darkMode: boolean) => {
  if (!level) return { 
    bg: darkMode ? "bg-gray-800/30" : "bg-gray-100", 
    text: darkMode ? "text-gray-400" : "text-gray-600", 
    border: darkMode ? "border-gray-700" : "border-gray-200", 
    accent: darkMode ? "bg-gray-600" : "bg-gray-400",
    gradient: darkMode 
      ? "from-gray-800/20 via-gray-900/10 to-gray-800/20" 
      : "from-gray-50 via-white to-gray-50"
  };
  
  const colors: Record<number, any> = {
    5: { 
      bg: darkMode ? "bg-emerald-900/20" : "bg-emerald-50", 
      text: darkMode ? "text-emerald-300" : "text-emerald-700", 
      border: darkMode ? "border-emerald-700/50" : "border-emerald-200", 
      accent: "bg-emerald-500",
      gradient: darkMode 
        ? "from-emerald-900/10 via-emerald-900/5 to-emerald-900/10" 
        : "from-emerald-50/80 via-white to-emerald-50/80"
    },
    4: { 
      bg: darkMode ? "bg-blue-900/20" : "bg-blue-50", 
      text: darkMode ? "text-blue-300" : "text-blue-700", 
      border: darkMode ? "border-blue-700/50" : "border-blue-200", 
      accent: "bg-blue-500",
      gradient: darkMode 
        ? "from-blue-900/10 via-blue-900/5 to-blue-900/10" 
        : "from-blue-50/80 via-white to-blue-50/80"
    },
    3: { 
      bg: darkMode ? "bg-amber-900/20" : "bg-amber-50", 
      text: darkMode ? "text-amber-300" : "text-amber-700", 
      border: darkMode ? "border-amber-700/50" : "border-amber-200", 
      accent: "bg-amber-500",
      gradient: darkMode 
        ? "from-amber-900/10 via-amber-900/5 to-amber-900/10" 
        : "from-amber-50/80 via-white to-amber-50/80"
    },
    2: { 
      bg: darkMode ? "bg-orange-900/20" : "bg-orange-50", 
      text: darkMode ? "text-orange-300" : "text-orange-700", 
      border: darkMode ? "border-orange-700/50" : "border-orange-200", 
      accent: "bg-orange-500",
      gradient: darkMode 
        ? "from-orange-900/10 via-orange-900/5 to-orange-900/10" 
        : "from-orange-50/80 via-white to-orange-50/80"
    },
    1: { 
      bg: darkMode ? "bg-rose-900/20" : "bg-rose-50", 
      text: darkMode ? "text-rose-300" : "text-rose-700", 
      border: darkMode ? "border-rose-700/50" : "border-rose-200", 
      accent: "bg-rose-500",
      gradient: darkMode 
        ? "from-rose-900/10 via-rose-900/5 to-rose-900/10" 
        : "from-rose-50/80 via-white to-rose-50/80"
    }
  };
  return colors[level] || { 
    bg: darkMode ? "bg-gray-800/30" : "bg-gray-100", 
    text: darkMode ? "text-gray-400" : "text-gray-600", 
    border: darkMode ? "border-gray-700" : "border-gray-200", 
    accent: darkMode ? "bg-gray-600" : "bg-gray-400",
    gradient: darkMode 
      ? "from-gray-800/20 via-gray-900/10 to-gray-800/20" 
      : "from-gray-50 via-white to-gray-50"
  };
};

const getStrokesColor = (strokes: number, darkMode: boolean): string => {
  if (strokes <= 5) return darkMode ? "bg-emerald-900/30 text-emerald-300" : "bg-emerald-100 text-emerald-700";
  if (strokes <= 10) return darkMode ? "bg-blue-900/30 text-blue-300" : "bg-blue-100 text-blue-700";
  if (strokes <= 15) return darkMode ? "bg-amber-900/30 text-amber-300" : "bg-amber-100 text-amber-700";
  return darkMode ? "bg-rose-900/30 text-rose-300" : "bg-rose-100 text-rose-700";
};

const getFrequencyBadge = (freq: number | null, darkMode: boolean): string => {
  if (!freq) return darkMode ? "bg-gray-800/30 text-gray-400" : "bg-gray-100 text-gray-700";
  if (freq <= 100) return darkMode ? "bg-emerald-900/30 text-emerald-300" : "bg-emerald-100 text-emerald-700";
  if (freq <= 500) return darkMode ? "bg-blue-900/30 text-blue-300" : "bg-blue-100 text-blue-700";
  if (freq <= 1000) return darkMode ? "bg-amber-900/30 text-amber-300" : "bg-amber-100 text-amber-700";
  return darkMode ? "bg-rose-900/30 text-rose-300" : "bg-rose-100 text-rose-700";
};

/* ===================== Component ===================== */

const PAGE_SIZE = 800;

const KanjiExplorer: React.FC<Props> = ({ data }) => {
  // Dark mode state
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('kanji_darkMode');
      return saved ? JSON.parse(saved) : false;
    }
    return true;
  });

  // Controls and UI state
  const [jlpt, setJlpt] = useState<"all" | number>("all");
  const [search, setSearch] = useState("");
  const deferredSearch = useDeferredValue(search);
  const [shuffleMode, setShuffleMode] = useState(false);
  const [showOnlyFav, setShowOnlyFav] = useState(false);
  const [showOnlyLearned, setShowOnlyLearned] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [expandedCard, setExpandedCard] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<"jlpt" | "strokes" | "freq" | "grade">("jlpt");

  // Progressive load
  const [visibleCount, setVisibleCount] = useState<number>(PAGE_SIZE);

  // Precomputed entries — heavy op only when `data` changes
  const allKanji = useMemo(() => Object.entries(data), [data]);

  // User data
  const [favorites, setFavorites] = useState<string[]>(
    () => loadLS("kanji_fav", [])
  );
  const [learned, setLearned] = useState<string[]>(
    () => loadLS("kanji_learned", [])
  );

  // Voice
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const [voice, setVoice] = useState<SpeechSynthesisVoice | null>(null);
  const [speaking, setSpeaking] = useState<string | null>(null);
  const [muted, setMuted] = useState(false);
  const [audioRate, setAudioRate] = useState<number>(0.8);

  // Study stats
  const [studyTime, setStudyTime] = useState<number>(0);
  const [studySessionStart] = useState<number>(Date.now());

  // Toggle dark mode
  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem('kanji_darkMode', JSON.stringify(newDarkMode));
  };

  // Color schemes based on theme
  const themeColors = {
    background: darkMode 
      ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900" 
      : "bg-gradient-to-br from-gray-50 via-blue-50/20 to-gray-50",
    card: darkMode 
      ? "bg-gradient-to-br from-gray-800/60 via-gray-800/40 to-gray-800/60 backdrop-blur-sm" 
      : "bg-white/90 backdrop-blur-sm",
    cardBorder: darkMode 
      ? "border-gray-700/50" 
      : "border-gray-200/50",
    text: darkMode ? "text-gray-100" : "text-gray-900",
    textSecondary: darkMode ? "text-gray-300" : "text-gray-600",
    textMuted: darkMode ? "text-gray-400" : "text-gray-500",
    input: darkMode 
      ? "bg-gray-800/50 border-gray-700 text-gray-300 placeholder-gray-500" 
      : "bg-gray-50 border-gray-200 text-gray-700 placeholder-gray-400",
    inputFocus: darkMode 
      ? "focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500" 
      : "focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500",
    button: darkMode 
      ? "bg-gray-800/50 hover:bg-gray-700/50 text-gray-300" 
      : "bg-gray-100 hover:bg-gray-200 text-gray-700",
    buttonPrimary: "bg-gradient-to-r from-blue-500 to-purple-500 text-white",
    progressBg: darkMode ? "bg-gray-800/50" : "bg-gray-200/80",
    progress: "bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"
  };

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
      if (synthRef.current?.speaking) synthRef.current.cancel();
    };
  }, []);

  // Track study time
  useEffect(() => {
    const timer = setInterval(() => {
      const elapsed = Math.floor((Date.now() - studySessionStart) / 60000);
      setStudyTime(elapsed);
    }, 60000);

    return () => clearInterval(timer);
  }, [studySessionStart]);

  useEffect(() => saveLS("kanji_fav", favorites), [favorites]);
  useEffect(() => saveLS("kanji_learned", learned), [learned]);

  // Reset visibleCount when filters change
  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
    setExpandedCard(null);
  }, [jlpt, deferredSearch, showOnlyFav, showOnlyLearned, shuffleMode, sortBy]);

  /* ===================== Derived list (filters, sort, shuffle) ===================== */
  const kanjiList = useMemo(() => {
    // copy so we don't mutate `allKanji`
    let list = [...allKanji];

    // JLPT filter
    if (jlpt !== "all") {
      list = list.filter(([, v]) => v.jlpt_new === jlpt || v.jlpt_old === jlpt);
    }

    // Search filter (deferred)
    if (deferredSearch && deferredSearch.trim()) {
      const q = deferredSearch.toLowerCase().trim();
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

    // Sorting (non-mutating copy already)
    list.sort((a, b) => {
      switch (sortBy) {
        case "jlpt": {
          const aJlpt = a[1].jlpt_new ?? a[1].jlpt_old ?? 99;
          const bJlpt = b[1].jlpt_new ?? b[1].jlpt_old ?? 99;
          return aJlpt - bJlpt;
        }
        case "strokes":
          return a[1].strokes - b[1].strokes;
        case "freq": {
          const aFreq = a[1].freq ?? 9999;
          const bFreq = b[1].freq ?? 9999;
          return aFreq - bFreq;
        }
        case "grade": {
          const aGrade = a[1].grade ?? 99;
          const bGrade = b[1].grade ?? 99;
          return aGrade - bGrade;
        }
        default:
          return 0;
      }
    });

    // Shuffle last (shuffleArray returns new array)
    if (shuffleMode) {
      list = shuffleArray(list);
    }

    return list;
  }, [allKanji, jlpt, deferredSearch, showOnlyFav, showOnlyLearned, shuffleMode, favorites, learned, sortBy]);

  // visible slice for progressive load
  const visibleKanjiList = useMemo(() => kanjiList.slice(0, visibleCount), [kanjiList, visibleCount]);

  // Stats (memoized)
  const stats = useMemo(() => {
    const total = Object.keys(data).length;
    const learnedCount = learned.length;
    const favoriteCount = favorites.length;
    const jlptCounts = [5, 4, 3, 2, 1].reduce((acc: Record<number, number>, level) => {
      acc[level] = Object.values(data).filter(v => v.jlpt_new === level || v.jlpt_old === level).length;
      return acc;
    }, {} as Record<number, number>);

    const jlptProgress = [5, 4, 3, 2, 1].reduce((acc: Record<number, number>, level) => {
      const totalForLevel = jlptCounts[level] ?? 0;
      const learnedForLevel = learned.filter(k => {
        const kanjiData = data[k];
        return kanjiData && (kanjiData.jlpt_new === level || kanjiData.jlpt_old === level);
      }).length;
      acc[level] = totalForLevel > 0 ? Math.round((learnedForLevel / totalForLevel) * 100) : 0;
      return acc;
    }, {} as Record<number, number>);

    // Calculate average strokes
    const totalStrokes = Object.values(data).reduce((sum, kd) => sum + kd.strokes, 0);
    const avgStrokes = Math.round((totalStrokes / total) * 10) / 10;

    // Most common grade
    const gradeCounts: Record<number, number> = {};
    Object.values(data).forEach(kd => {
      if (kd.grade) {
        gradeCounts[kd.grade] = (gradeCounts[kd.grade] || 0) + 1;
      }
    });
    const mostCommonGrade = Object.entries(gradeCounts)
      .sort(([, a], [, b]) => b - a)[0]?.[0] || "N/A";

    return { 
      total, 
      learnedCount, 
      favoriteCount, 
      jlptCounts, 
      jlptProgress,
      avgStrokes,
      mostCommonGrade,
      completionRate: Math.round((learnedCount / total) * 100)
    };
  }, [data, learned, favorites]);

  /* ===================== Actions ===================== */

  const speak = (text: string, kanji: string) => {
    if (!synthRef.current || !voice || muted) return;

    // Stop any ongoing speech
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
    utterance.rate = audioRate;
    utterance.pitch = 1.2;

    utterance.onstart = () => setSpeaking(kanji);
    utterance.onend = () => setSpeaking(null);
    utterance.onerror = () => setSpeaking(null);

    synthRef.current.speak(utterance);
  };

  const toggleFav = (kanji: string) => {
    setFavorites(f => (f.includes(kanji) ? f.filter(x => x !== kanji) : [...f, kanji]));
  };

  const toggleLearned = (kanji: string) => {
    setLearned(l => (l.includes(kanji) ? l.filter(x => x !== kanji) : [...l, kanji]));
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

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) return `${hours}h ${mins}m`;
    if (mins === 0) return 'Just started';
    return `${mins}m`;
  };

  /* ===================== Card Component ===================== */

  const KanjiCard: React.FC<{ kanji: string; data: KanjiData }> = ({ kanji, data }) => {
    const isExpanded = expandedCard === kanji;
    const isFav = favorites.includes(kanji);
    const isLearned = learned.includes(kanji);
    const jlptLevel = data.jlpt_new ?? data.jlpt_old;
    const jlptColors = getJLPTColor(jlptLevel, darkMode);

    return (
    <div
    onClick={() =>
      setExpandedCard(prev => (prev === kanji ? null : kanji))
    }
    className={`relative cursor-pointer rounded-xl transition-all duration-300 overflow-hidden border-2 ${
      isExpanded 
        ? `shadow-xl scale-[1.02] z-10 ${darkMode ? 'shadow-blue-900/20' : 'shadow-blue-200/50'}` 
        : 'shadow-sm hover:shadow-md'
    } ${isLearned 
      ? darkMode ? 'border-emerald-500/50' : 'border-emerald-300' 
      : jlptColors.border
    }`}
    style={{ 
      background: `linear-gradient(135deg, ${darkMode ? '#1f2937' : '#ffffff'} 0%, ${jlptColors.bg.replace('bg-', '')} 50%, ${darkMode ? '#1f2937' : '#ffffff'} 100%)`,
      backdropFilter: 'blur(10px)'
    }}
  >
        <div className="p-4 relative">
          {jlptLevel && (
            <div className={`absolute top-0 left-0 px-3 py-1 rounded-br-xl ${jlptColors.bg} ${jlptColors.text} font-bold text-xs flex items-center gap-1`}>
              <Trophy className="h-3 w-3" />
              N{jlptLevel}
            </div>
          )}

          <div className="absolute top-3 right-3 flex gap-1">
            <button
              onClick={(e) => { 
                e.stopPropagation(); 
                e.preventDefault();
                toggleFav(kanji); 
              }}
              className={`p-2 rounded-full transition-all duration-200 ${
                isFav 
                  ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg transform hover:scale-110" 
                  : `${darkMode ? 'bg-gray-800/80 text-gray-400 hover:text-amber-300 hover:bg-amber-900/30' : 'bg-white/80 text-gray-400 hover:text-amber-500 hover:bg-amber-50'} shadow-sm`
              }`}
            >
              <Star className={`h-4 w-4 ${isFav ? "fill-current" : ""}`} />
            </button>

            <button
              onClick={(e) => { 
                e.stopPropagation(); 
                e.preventDefault();
                speak(kanji, kanji); 
              }}
              className={`p-2 rounded-full transition-all duration-200 ${
                speaking === kanji 
                  ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg animate-pulse" 
                  : `${darkMode ? 'bg-gray-800/80 text-gray-400 hover:text-blue-300 hover:bg-blue-900/30' : 'bg-white/80 text-gray-400 hover:text-blue-600 hover:bg-blue-50'} shadow-sm`
              }`}
            >
              {speaking === kanji ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            </button>
          </div>

    <div className="text-center mt-6 mb-4">
  <div className="relative inline-block">
    <div className={`text-6xl font-bold ${jlptColors.text} drop-shadow-lg`}>
      {kanji}
    </div>
    {isLearned && (
      <div className="absolute -top-2 -right-2 animate-bounce">
        <CheckCircle className="h-6 w-6 text-emerald-500 fill-current" />
      </div>
    )}
  </div>

  {/* Kun Reading */}
  {data.readings_kun.length > 0 && (
    <p className={`text-sm mt-1 ${darkMode ? 'text-blue-300' : 'text-blue-600'}`}>
      {data.readings_kun[0]}
    </p>
  )}

  {/* Meaning */}
  <p className={`text-lg font-semibold mt-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
    {data.meanings[0]}
  </p>
</div>


          <div className="flex justify-center gap-2 mb-3">
            <div className={`px-3 py-1.5 rounded-lg text-xs font-medium ${getStrokesColor(data.strokes, darkMode)} flex items-center gap-1.5`}>
              <LayersIcon className="h-3.5 w-3.5" />
              {data.strokes} strokes
            </div>
            {data.freq && (
              <div className={`px-3 py-1.5 rounded-lg text-xs font-medium ${getFrequencyBadge(data.freq, darkMode)} flex items-center gap-1.5`}>
                <TrendingUp className="h-3.5 w-3.5" />
                #{data.freq}
              </div>
            )}
            {data.grade && (
              <div className={`px-3 py-1.5 rounded-lg text-xs font-medium ${
                darkMode ? 'bg-purple-900/30 text-purple-300' : 'bg-purple-100 text-purple-700'
              } flex items-center gap-1.5`}>
                <GraduationCap className="h-3.5 w-3.5" />
                Grade {data.grade}
              </div>
            )}
          </div>

          <div className={`flex justify-center items-center gap-2 text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            <span>{data.meanings.length} meanings</span>
            <span>•</span>
            <span>{data.readings_on.length + data.readings_kun.length} readings</span>
            <span>•</span>
            <span>{data.wk_radicals?.length || 0} radicals</span>
          </div>
        </div>

        {isExpanded && (
          <div className={`border-t p-6 space-y-6 ${
            darkMode 
              ? 'border-gray-700 bg-gray-900/80' 
              : 'border-gray-200 bg-white/90'
          }`}>
            {/* On Readings Section */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className={`text-sm font-semibold flex items-center gap-2 ${
                  darkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  <div className={`p-1.5 rounded-lg ${
                    darkMode 
                      ? 'bg-indigo-900/30 text-indigo-400' 
                      : 'bg-indigo-100 text-indigo-600'
                  }`}>
                    <BookText className="h-4 w-4" />
                  </div>
                  On Readings (音読み)
                </span>
                <button
                  onClick={(e) => { 
                    e.stopPropagation(); 
                    e.preventDefault();
                    const reading = data.readings_on[0]; 
                    if (reading) speak(reading, `${kanji}-on`); 
                  }}
                  className={`p-1.5 rounded-full transition ${
                    darkMode 
                      ? 'text-gray-400 hover:text-indigo-400 hover:bg-indigo-900/30' 
                      : 'text-gray-400 hover:text-indigo-600 hover:bg-indigo-50'
                  }`}
                >
                  <Mic className="h-3.5 w-3.5" />
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {data.readings_on.map((r, i) => (
                  <span 
                    key={i} 
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
                      darkMode 
                        ? 'bg-gradient-to-r from-indigo-900/20 to-purple-900/20 text-indigo-300 border border-indigo-800/30' 
                        : 'bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-700 border border-indigo-200'
                    }`}
                  >
                    {r}
                  </span>
                ))}
                {data.readings_on.length === 0 && (
                  <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    No on readings available
                  </span>
                )}
              </div>
            </div>

            {/* Kun Readings Section */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className={`text-sm font-semibold flex items-center gap-2 ${
                  darkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  <div className={`p-1.5 rounded-lg ${
                    darkMode 
                      ? 'bg-blue-900/30 text-blue-400' 
                      : 'bg-blue-100 text-blue-600'
                  }`}>
                    <Music className="h-4 w-4" />
                  </div>
                  Kun Readings (訓読み)
                </span>
                <button
                  onClick={(e) => { 
                    e.stopPropagation(); 
                    e.preventDefault();
                    const reading = data.readings_kun[0]; 
                    if (reading) speak(reading, `${kanji}-kun`); 
                  }}
                  className={`p-1.5 rounded-full transition ${
                    darkMode 
                      ? 'text-gray-400 hover:text-blue-400 hover:bg-blue-900/30' 
                      : 'text-gray-400 hover:text-blue-600 hover:bg-blue-50'
                  }`}
                >
                  <Mic className="h-3.5 w-3.5" />
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {data.readings_kun.map((r, i) => (
                  <span 
                    key={i} 
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
                      darkMode 
                        ? 'bg-gradient-to-r from-blue-900/20 to-cyan-900/20 text-blue-300 border border-blue-800/30' 
                        : 'bg-gradient-to-r from-blue-50 to-cyan-50 text-blue-700 border border-blue-200'
                    }`}
                  >
                    {r}
                  </span>
                ))}
                {data.readings_kun.length === 0 && (
                  <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    No kun readings available
                  </span>
                )}
              </div>
            </div>

            {/* Meanings Section */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className={`text-sm font-semibold flex items-center gap-2 ${
                  darkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  <div className={`p-1.5 rounded-lg ${
                    darkMode 
                      ? 'bg-emerald-900/30 text-emerald-400' 
                      : 'bg-emerald-100 text-emerald-600'
                  }`}>
                    <Brain className="h-4 w-4" />
                  </div>
                  Meanings
                </span>
                <span className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                  {data.meanings.length} meanings
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {data.meanings.map((m, i) => (
                  <span 
                    key={i} 
                    className={`px-3 py-1.5 rounded-lg text-sm ${
                      darkMode 
                        ? 'bg-gradient-to-r from-emerald-900/20 to-green-900/20 text-emerald-300 border border-emerald-800/30' 
                        : 'bg-gradient-to-r from-emerald-50 to-green-50 text-emerald-800 border border-emerald-200'
                    }`}
                  >
                    {m}
                  </span>
                ))}
              </div>
            </div>

            {/* WaniKani Section */}
            {/* {(data.wk_meanings || data.wk_readings_on || data.wk_readings_kun || data.wk_radicals) && (
              <div className={`space-y-4 p-4 rounded-xl ${
                darkMode 
                  ? 'bg-gradient-to-r from-gray-800/50 to-gray-900/30 border border-gray-800' 
                  : 'bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200'
              }`}>
                {/* <div className="flex items-center gap-2">
                  <div className={`p-1.5 rounded-lg ${
                    darkMode 
                      ? 'bg-amber-900/30 text-amber-400' 
                      : 'bg-amber-100 text-amber-600'
                  }`}>
                    <TargetIcon className="h-4 w-4" />
                  </div>
                  <span className={`text-sm font-semibold ${
                    darkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    WaniKani Details
                  </span>
                </div> */}

                {/* WaniKani Meanings */}
                {/* {data.wk_meanings && data.wk_meanings.length > 0 && (
                  <div className="space-y-2">
                    <div className={`text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      WaniKani Meanings
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {data.wk_meanings.map((m, i) => (
                        <span 
                          key={i} 
                          className={`px-2.5 py-1 rounded-md text-xs ${
                            darkMode 
                              ? 'bg-amber-900/20 text-amber-300' 
                              : 'bg-amber-100 text-amber-700'
                          }`}
                        >
                          {m}
                        </span>
                      ))}
                    </div>
                  </div>
                )} */}

                {/* WaniKani Radicals */}
                {/* {data.wk_radicals && data.wk_radicals.length > 0 && (
                  <div className="space-y-2">
                    <div className={`text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Radical Components
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {data.wk_radicals.map((r, i) => (
                        <span 
                          key={i} 
                          className={`px-3 py-1.5 rounded-lg text-sm ${
                            darkMode 
                              ? 'bg-gradient-to-r from-rose-900/20 to-pink-900/20 text-rose-300 border border-rose-800/30' 
                              : 'bg-gradient-to-r from-rose-50 to-pink-50 text-rose-700 border border-rose-200'
                          }`}
                        >
                          {r}
                        </span>
                      ))}
                    </div>
                  </div>
                )} */}

                {/* WaniKani Level */}
                {/* {data.wk_level && (
                  <div className="flex items-center justify-between pt-3 border-t border-gray-700/30">
                    <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      WaniKani Level
                    </span>
                    <span className={`px-2.5 py-1 rounded-md text-xs font-bold ${
                      darkMode 
                        ? 'bg-amber-900/30 text-amber-300' 
                        : 'bg-amber-100 text-amber-700'
                    }`}>
                      Level {data.wk_level}
                    </span>
                  </div>
                )} */}
              {/* </div>
            )}  */}

            {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-2 pt-3 border-t border-gray-700/30">
  <button
    onClick={(e) => { 
      e.stopPropagation(); 
      e.preventDefault();
      toggleLearned(kanji); 
    }}
    className={`flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg transition text-xs font-medium ${
      isLearned 
        ? darkMode 
          ? "bg-gradient-to-r from-emerald-900/30 to-green-900/30 text-emerald-300 border border-emerald-700/50" 
          : "bg-gradient-to-r from-emerald-100 to-green-100 text-emerald-700 border border-emerald-200"
        : darkMode 
          ? "bg-gradient-to-r from-gray-800/50 to-gray-900/30 text-gray-300 hover:bg-gray-700/50" 
          : "bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 hover:bg-gray-200"
    }`}
  >
    {isLearned ? (
      <>
        <CheckCircle className="h-3.5 w-3.5" /> Learned
      </>
    ) : (
      <>
        <BookOpen className="h-3.5 w-3.5" /> Mark
      </>
    )}
  </button>

  <button
    onClick={(e) => { 
      e.stopPropagation(); 
      e.preventDefault();
      const allReadings = [...data.readings_on, ...data.readings_kun]; 
      if (allReadings.length > 0) speak(allReadings.join(", "), `${kanji}-all`); 
    }}
    className={`flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg transition text-xs font-medium ${
      darkMode 
        ? "bg-gradient-to-r from-blue-900/30 to-purple-900/30 text-blue-300 hover:bg-blue-800/30" 
        : "bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 hover:bg-blue-200"
    }`}
  >
    <Volume2 className="h-3.5 w-3.5" /> Readings
  </button>
</div>

          </div>
        )}
      </div>
    );
  };

  /* ===================== Main Render ===================== */

  return (
    <div className={`min-h-screen transition-all duration-300 ${themeColors.background} ${themeColors.text}`}>
      {/* Header */}
      <div className={`sticky top-0 z-40 ${darkMode ? 'bg-gray-900/95' : 'bg-white/95'} backdrop-blur-sm border-b ${darkMode ? 'border-gray-800' : 'border-gray-200'} shadow-lg`}>
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-xl ${
                darkMode 
                  ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20' 
                  : 'bg-gradient-to-r from-blue-100 to-purple-100'
              }`}>
                <Sparkles className="h-5 w-5 text-blue-500" />
              </div>
        <div>
  <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
    Kanji Explorer
  </h1>

  {/* Desktop / Tablet */}
  <p className={`hidden sm:block text-xs mt-0.5 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
    Master {stats.total} Japanese characters • {stats.learnedCount} learned •{" "}
    <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent font-semibold">
      Choose your level & start learning
    </span>
  </p>

  {/* Mobile */}
  <p className={`block sm:hidden text-xs mt-0.5 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
    <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent font-semibold">
      Choose your level & start learning
    </span>
  </p>
</div>

            </div>

            <div className="flex items-center gap-2">
              {/* Audio settings */}
              <div className={`flex items-center gap-1 px-2 py-1 rounded-lg ${darkMode ? 'bg-gray-800/50' : 'bg-gray-100/80'}`}>
                <button 
                  onClick={() => setAudioRate(r => Math.max(0.5, r - 0.1))}
                  className={`p-1 ${darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-800'}`}
                >
                  -
                </button>
                <span className="text-xs font-mono px-1">{audioRate.toFixed(1)}x</span>
                <button 
                  onClick={() => setAudioRate(r => Math.min(1.5, r + 0.1))}
                  className={`p-1 ${darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-800'}`}
                >
                  +
                </button>
              </div>

              <button 
                onClick={() => setMuted(m => !m)}
                className={`p-2 rounded-xl transition-all ${
                  muted 
                    ? 'bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-lg' 
                    : darkMode 
                      ? 'bg-gray-800/50 text-gray-400 hover:bg-gray-700/50' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                title={muted ? "Unmute audio" : "Mute audio"}
              >
                {muted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
              </button>

              <button
                onClick={toggleDarkMode}
                className={`p-2 rounded-xl transition-all ${
                  darkMode 
                    ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
              >
                {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>

              <div className={`flex items-center gap-1 ${darkMode ? 'bg-gray-800/50' : 'bg-gray-100/80'} px-3 py-1.5 rounded-xl`}>
                <Clock className="h-4 w-4 text-blue-500" />
                <div className="text-xs font-semibold">{formatTime(studyTime)}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Enhanced Stats Cards */}
        <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Total Kanji Card */}
          <div className={`rounded-xl p-5 shadow-lg border ${themeColors.cardBorder} ${themeColors.card}`}>
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="text-sm font-medium opacity-75 mb-1">Total Kanji</div>
                <div className="text-3xl font-bold text-blue-500">{stats.total}</div>
              </div>
              <div className={`p-2 rounded-lg ${
                darkMode 
                  ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20' 
                  : 'bg-gradient-to-r from-blue-100 to-purple-100'
              }`}>
                <Target className="h-5 w-5 text-blue-500" />
              </div>
            </div>
            <div className="text-xs opacity-75">Master all Japanese characters</div>
          </div>

          {/* Learned Progress Card */}
          <div className={`rounded-xl p-5 shadow-lg border ${themeColors.cardBorder} ${themeColors.card}`}>
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="text-sm font-medium opacity-75 mb-1">Learned</div>
                <div className="text-3xl font-bold text-emerald-500">{stats.learnedCount}</div>
                <div className="text-sm font-semibold mt-1">{stats.completionRate}% Complete</div>
              </div>
              <div className={`p-2 rounded-lg ${
                darkMode 
                  ? 'bg-gradient-to-r from-emerald-500/20 to-green-500/20' 
                  : 'bg-gradient-to-r from-emerald-100 to-green-100'
              }`}>
                <CheckCircle className="h-5 w-5 text-emerald-500" />
              </div>
            </div>
            <div className="mt-2">
              <div className={`h-2 rounded-full overflow-hidden ${themeColors.progressBg}`}>
                <div 
                  className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-green-500 transition-all duration-700"
                  style={{ width: `${(stats.learnedCount / stats.total) * 100}%` }}
                />
              </div>
            </div>
          </div>

          {/* Favorites Card */}
          <div className={`rounded-xl p-5 shadow-lg border ${themeColors.cardBorder} ${themeColors.card}`}>
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="text-sm font-medium opacity-75 mb-1">Favorites</div>
                <div className="text-3xl font-bold text-amber-500">{stats.favoriteCount}</div>
              </div>
              <div className={`p-2 rounded-lg ${
                darkMode 
                  ? 'bg-gradient-to-r from-amber-500/20 to-orange-500/20' 
                  : 'bg-gradient-to-r from-amber-100 to-orange-100'
              }`}>
                <Star className="h-5 w-5 text-amber-500" />
              </div>
            </div>
            <div className="text-xs opacity-75">Your starred kanji collection</div>
          </div>

          {/* Study Stats Card */}
          <div className={`rounded-xl p-5 shadow-lg border ${themeColors.cardBorder} ${themeColors.card}`}>
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="text-sm font-medium opacity-75 mb-1">Study Time</div>
                <div className="text-2xl font-bold text-purple-500">{formatTime(studyTime)}</div>
                <div className="text-sm font-semibold mt-1">Avg: {stats.avgStrokes} strokes</div>
              </div>
              <div className={`p-2 rounded-lg ${
                darkMode 
                  ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20' 
                  : 'bg-gradient-to-r from-purple-100 to-pink-100'
              }`}>
                <Zap className="h-5 w-5 text-purple-500" />
              </div>
            </div>
            <div className="text-xs opacity-75">Active learning session</div>
          </div>
        </div>

        {/* Controls */}
        <div className={`mb-6 rounded-xl p-5 shadow-lg border ${themeColors.cardBorder} ${themeColors.card}`}>
          {/* Search */}
          <div className="relative mb-5">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              value={search}
              onChange={(e) => { setSearch(e.target.value); setExpandedCard(null); }}
              placeholder="Search kanji, meaning, or reading..."
              className={`w-full pl-12 pr-12 py-3 rounded-xl border focus:outline-none text-sm ${themeColors.input} ${themeColors.inputFocus}`}
            />
            {search && (
              <button 
                onClick={() => { setSearch(""); setExpandedCard(null); }} 
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <XCircle className="h-5 w-5" />
              </button>
            )}
          </div>

          <div className="flex flex-col lg:flex-row gap-4">
            {/* Left side filters */}
            <div className="flex flex-wrap items-center gap-3 flex-1">
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <select 
                  value={jlpt} 
                  onChange={(e) => setJlpt(e.target.value === "all" ? "all" : Number(e.target.value))} 
                  className={`pl-10 pr-4 py-2.5 rounded-lg border text-sm appearance-none ${themeColors.input}`}
                >
                  <option value="all">All JLPT Levels</option>
                  <option value={5}>JLPT N5 (Beginner)</option>
                  <option value={4}>JLPT N4 (Elementary)</option>
                  <option value={3}>JLPT N3 (Intermediate)</option>
                  <option value={2}>JLPT N2 (Advanced)</option>
                  <option value={1}>JLPT N1 (Expert)</option>
                </select>
              </div>

              <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value as any)} 
                className={`px-4 py-2.5 rounded-lg border text-sm ${themeColors.input}`}
              >
                <option value="jlpt">Sort by JLPT Level</option>
                <option value="strokes">Sort by Strokes</option>
                <option value="freq">Sort by Frequency</option>
                <option value="grade">Sort by Grade</option>
              </select>

              <div className={`flex items-center ${darkMode ? 'bg-gray-800/30' : 'bg-gray-100'} rounded-lg p-1`}>
                <button 
                  onClick={() => setViewMode("grid")} 
                  className={`p-2 rounded ${viewMode === "grid" ? `${darkMode ? 'bg-gray-700 text-blue-400' : 'bg-white text-blue-600'} shadow-sm` : `${darkMode ? 'text-gray-500 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'}`}`}
                >
                  <Grid3x3 className="h-4 w-4" />
                </button>
                <button 
                  onClick={() => setViewMode("list")} 
                  className={`p-2 rounded ${viewMode === "list" ? `${darkMode ? 'bg-gray-700 text-blue-400' : 'bg-white text-blue-600'} shadow-sm` : `${darkMode ? 'text-gray-500 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'}`}`}
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Right side action buttons */}
            <div className="flex flex-wrap items-center gap-3">
              <button 
                onClick={() => setShuffleMode(s => !s)} 
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg transition-all ${
                  shuffleMode 
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg' 
                    : `${darkMode ? 'bg-gray-800/50 text-gray-300 border border-gray-700' : 'bg-gray-50 text-gray-700 border border-gray-200'}`
                }`}
              >
                <Shuffle className="h-4 w-4" /> Shuffle
              </button>

              <button 
                onClick={() => setShowOnlyFav(s => !s)} 
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg transition-all ${
                  showOnlyFav 
                    ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg' 
                    : `${darkMode ? 'bg-gray-800/50 text-gray-300 border border-gray-700' : 'bg-gray-50 text-gray-700 border border-gray-200'}`
                }`}
              >
                <Star className="h-4 w-4" /> Favorites
              </button>

              <button 
                onClick={() => setShowOnlyLearned(s => !s)} 
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg transition-all ${
                  showOnlyLearned 
                    ? 'bg-gradient-to-r from-emerald-500 to-green-500 text-white shadow-lg' 
                    : `${darkMode ? 'bg-gray-800/50 text-gray-300 border border-gray-700' : 'bg-gray-50 text-gray-700 border border-gray-200'}`
                }`}
              >
                <BookmarkCheck className="h-4 w-4" /> Learned
              </button>

              {(jlpt !== "all" || search || showOnlyFav || showOnlyLearned || shuffleMode || sortBy !== "jlpt") && (
                <button 
                  onClick={clearFilters} 
                  className={`flex items-center gap-2 px-4 py-2.5 text-sm rounded-lg transition ${darkMode ? 'text-gray-400 hover:bg-gray-800/50' : 'text-gray-600 hover:bg-gray-100'}`}
                >
                  <RefreshCw className="h-4 w-4" /> Clear All
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Kanji Grid/List */}
        <div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-3">
            <h2 className={`text-lg font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-800'}`}>
              {kanjiList.length} Kanji {jlpt !== "all" && `• JLPT N${jlpt}`}
              {showOnlyFav && " • Favorites"}
              {showOnlyLearned && " • Learned"}
            </h2>
            <div className={`text-sm flex items-center gap-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              <EyeIcon className="h-4 w-4" /> 
              <span>Click card to {expandedCard ? "collapse" : "expand"} details</span>
            </div>
          </div>

          {kanjiList.length === 0 ? (
            <div className={`text-center py-12 rounded-xl border ${darkMode ? 'bg-gray-900/50 border-gray-800' : 'bg-white border-gray-200'}`}>
              <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
                <Search className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className={`text-lg font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>No Kanji Found</h3>
              <p className={`max-w-md mx-auto mb-6 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Try adjusting your filters or search terms.</p>
              <button 
                onClick={clearFilters} 
                className="px-6 py-2.5 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:opacity-90 transition-all"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            <>
              <div className={viewMode === "grid" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4" : "space-y-4"}>
                {visibleKanjiList.map(([kanji, kd]) => (
                  <KanjiCard key={kanji} kanji={kanji} data={kd} />
                ))}
              </div>

              {/* Load more button */}
              {visibleCount < kanjiList.length && (
                <div className="flex justify-center mt-8">
                  <button
                    onClick={() => setVisibleCount(v => Math.min(v + PAGE_SIZE, kanjiList.length))}
                    className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl hover:opacity-90 transition-all font-medium shadow-lg"
                  >
                    Load more ({Math.min(PAGE_SIZE, kanjiList.length - visibleCount)} more)
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className={`mt-8 pt-6 border-t ${darkMode ? 'border-gray-800' : 'border-gray-200'}`}>
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Kanji Explorer • {new Date().getFullYear()} • Master Japanese Characters
              </p>
              <p className={`text-xs mt-1 ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                Click any card to expand details. Use voice button to hear pronunciations.
              </p>
            </div>
            <div className="flex items-center gap-4">
              <button 
                onClick={resetProgress} 
                className={`flex items-center gap-2 px-4 py-2 text-sm rounded-lg transition ${
                  darkMode 
                    ? 'text-gray-400 hover:bg-gray-800/50 hover:text-gray-300' 
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'
                }`}
              >
                <RefreshCw className="h-4 w-4" /> Reset Progress
              </button>
              <div className={`flex items-center gap-2 text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                <Volume2 className="h-3 w-3" /> 
                {muted ? "Audio muted" : "Audio enabled"} • Rate: {audioRate.toFixed(1)}x
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Audio Controls */}
      <div className="fixed bottom-4 right-4 z-30">
        <div className={`flex flex-col gap-2 p-3 rounded-xl shadow-2xl border ${darkMode ? 'bg-gray-900/90 border-gray-800' : 'bg-white/90 border-gray-200'} backdrop-blur-sm`}>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setMuted(m => !m)}
              className={`p-2 rounded-lg transition ${
                muted 
                  ? 'bg-gradient-to-r from-rose-500 to-pink-500 text-white' 
                  : darkMode 
                    ? 'bg-gray-800 text-gray-400 hover:bg-gray-700' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            </button>
            <div className="text-xs">
              <div className="font-semibold">Audio</div>
              <div className="opacity-75">{muted ? "Off" : "On"}</div>
            </div>
          </div>
          <div className="text-xs text-center opacity-75">
            {speaking ? `Speaking: ${speaking}` : "Ready"}
          </div>
        </div>
      </div>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        
        /* Smooth scrolling */
        .scroll-smooth {
          scroll-behavior: smooth;
        }
        
        /* Better focus styles */
        *:focus {
          outline: 2px solid transparent;
          outline-offset: 2px;
        }
        
        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        
        ::-webkit-scrollbar-track {
          background: ${darkMode ? '#1f2937' : '#f3f4f6'};
          border-radius: 4px;
        }
        
        ::-webkit-scrollbar-thumb {
          background: ${darkMode ? '#4f46e5' : '#6366f1'};
          border-radius: 4px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: ${darkMode ? '#6366f1' : '#4f46e5'};
        }
      `}</style>
    </div>
  );
};

export default KanjiExplorer;