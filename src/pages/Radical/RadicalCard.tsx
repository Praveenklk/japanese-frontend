// components/RadicalDashboard.tsx
'use client';

import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Filter, 
  Zap, 
  X, 
  ChevronRight, 
  Grid, 
  List, 
  Hash, 
  Sparkles, 
  Shuffle, 
  Moon, 
  Sun, 
  Loader2,
  Download,
  RefreshCw,
  TrendingUp,
  BarChart3,
  Layers,
  Eye,
  EyeOff,
  BookOpen,
  SortAsc,
  SortDesc
} from 'lucide-react';

// Type definitions
interface RadicalData {
  [character: string]: string[];
}

interface CharacterStats {
  totalCharacters: number;
  totalRadicals: number;
  uniqueRadicals: number;
  averageRadicalsPerChar: number;
  mostCommonRadicals: [string, number][];
}

// Light theme gradients (more vibrant)
const LIGHT_GRADIENTS = [
  'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
  'linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%)',
  'linear-gradient(135deg, #10b981 0%, #059669 100%)',
  'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
  'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
  'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
  'linear-gradient(135deg, #ec4899 0%, #db2777 100%)',
  'linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)',
  'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
  'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
];

// Dark theme gradients (softer)
const DARK_GRADIENTS = [
  'linear-gradient(135deg, #818cf8 0%, #a78bfa 100%)',
  'linear-gradient(135deg, #38bdf8 0%, #22d3ee 100%)',
  'linear-gradient(135deg, #34d399 0%, #10b981 100%)',
  'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
  'linear-gradient(135deg, #f87171 0%, #ef4444 100%)',
  'linear-gradient(135deg, #a78bfa 0%, #8b5cf6 100%)',
  'linear-gradient(135deg, #f472b6 0%, #ec4899 100%)',
  'linear-gradient(135deg, #2dd4bf 0%, #14b8a6 100%)',
  'linear-gradient(135deg, #fb923c 0%, #f97316 100%)',
  'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)',
];

// Configuration
const PAGE_SIZE = 150;
const INITIAL_LOAD = 200;

const RadicalDashboard = () => {
  const [allRadicals, setAllRadicals] = useState<RadicalData>({});
  const [displayedRadicals, setDisplayedRadicals] = useState<RadicalData>({});
  const [isLoading, setIsLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [loadingProgress, setLoadingProgress] = useState(0);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedChar, setSelectedChar] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showDetails, setShowDetails] = useState(false);
  const [sortBy, setSortBy] = useState<'char' | 'radicalCount'>('char');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [filterMinRadicals, setFilterMinRadicals] = useState<number>(1);
  const [filterMaxRadicals, setFilterMaxRadicals] = useState<number>(10);
  const [isShuffled, setIsShuffled] = useState(false);
  const [darkMode, setDarkMode] = useState<boolean | null>(false);
  const [showRadicalStats, setShowRadicalStats] = useState(false);

  const observerTarget = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Initialize theme
  useEffect(() => {
    // Check localStorage for saved theme
    const savedTheme = localStorage.getItem('kanji-radical-theme');
    
    if (savedTheme === 'dark') {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    } else {
      setDarkMode(false);
      document.documentElement.classList.remove('dark');
    }
  }, []);

  // Load initial data
  useEffect(() => {
    const loadInitialData = async () => {
      setIsLoading(true);
      setLoadingProgress(0);
      
      try {
        const progressInterval = setInterval(() => {
          setLoadingProgress(prev => {
            if (prev >= 90) {
              clearInterval(progressInterval);
              return 90;
            }
            return prev + 10;
          });
        }, 30);

        const data = await import("./kanjiradical.json");
        const fullData = data.default as RadicalData;
        setAllRadicals(fullData);
        
        const initialEntries = Object.entries(fullData).slice(0, INITIAL_LOAD);
        const initialData = Object.fromEntries(initialEntries);
        setDisplayedRadicals(initialData);
        setCurrentPage(1);
        setHasMore(Object.keys(fullData).length > INITIAL_LOAD);
        
        setLoadingProgress(100);
        setTimeout(() => setIsLoading(false), 200);
      } catch (error) {
        console.error('Failed to load radicals data:', error);
        setIsLoading(false);
      }
    };

    loadInitialData();
  }, []);

  // Setup intersection observer
  useEffect(() => {
    if (!observerTarget.current || !hasMore || isLoading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMoreData();
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(observerTarget.current);

    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current);
      }
    };
  }, [hasMore, isLoading]);

  // Load more data
  const loadMoreData = useCallback(() => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);
    setLoadingProgress(0);

    const loadTimeout = setTimeout(() => {
      const start = currentPage * PAGE_SIZE;
      const end = start + PAGE_SIZE;
      const allEntries = Object.entries(allRadicals);
      
      const newEntries = allEntries.slice(start, end);
      
      if (newEntries.length > 0) {
        const newData = Object.fromEntries(newEntries);
        setDisplayedRadicals(prev => ({ ...prev, ...newData }));
        setCurrentPage(prev => prev + 1);
        setHasMore(end < allEntries.length);
      } else {
        setHasMore(false);
      }

      setLoadingProgress(100);
      setTimeout(() => setIsLoading(false), 150);
    }, 500);

    const progressInterval = setInterval(() => {
      setLoadingProgress(prev => {
        if (prev >= 80) {
          clearInterval(progressInterval);
          return 80;
        }
        return prev + 20;
      });
    }, 80);

    return () => {
      clearTimeout(loadTimeout);
      clearInterval(progressInterval);
    };
  }, [currentPage, allRadicals, hasMore, isLoading]);

  // Toggle dark mode
  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('kanji-radical-theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('kanji-radical-theme', 'light');
    }
  };

  // Calculate statistics
  const stats: CharacterStats = useMemo(() => {
    const allRads = Object.values(displayedRadicals).flat();
    const totalChars = Object.keys(allRadicals).length;
    
    const radicalCounts: Record<string, number> = {};
    allRads.forEach(radical => {
      radicalCounts[radical] = (radicalCounts[radical] || 0) + 1;
    });
    
    const mostCommonRadicals = Object.entries(radicalCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
    
    return {
      totalCharacters: totalChars,
      totalRadicals: allRads.length,
      uniqueRadicals: new Set(allRads).size,
      averageRadicalsPerChar: allRads.length / Object.keys(displayedRadicals).length,
      mostCommonRadicals,
    };
  }, [displayedRadicals, allRadicals]);

  // Shuffle function
  const shuffleCharacters = () => {
    const entries = Object.entries(displayedRadicals);
    const shuffledEntries = [...entries];
    
    for (let i = shuffledEntries.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledEntries[i], shuffledEntries[j]] = [shuffledEntries[j], shuffledEntries[i]];
    }
    
    setDisplayedRadicals(Object.fromEntries(shuffledEntries));
    setIsShuffled(true);
  };

  // Toggle sort direction
  const toggleSortDirection = () => {
    setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
  };

  // Filter and sort characters
  const filteredCharacters = useMemo(() => {
    const filtered = Object.entries(displayedRadicals)
      .filter(([char, rads]) => {
        const matchesSearch = 
          char.toLowerCase().includes(searchTerm.toLowerCase()) ||
          rads.some(r => r.toLowerCase().includes(searchTerm.toLowerCase()));
        
        const radicalCount = rads.length;
        const matchesCount = radicalCount >= filterMinRadicals && radicalCount <= filterMaxRadicals;
        
        return matchesSearch && matchesCount;
      })
      .sort(([charA, radsA], [charB, radsB]) => {
        if (sortBy === 'radicalCount') {
          const diff = radsB.length - radsA.length;
          return sortDirection === 'desc' ? diff : -diff;
        }
        const compare = charA.localeCompare(charB);
        return sortDirection === 'desc' ? -compare : compare;
      });

    return filtered;
  }, [displayedRadicals, searchTerm, sortBy, sortDirection, filterMinRadicals, filterMaxRadicals]);

  // Get gradient based on character
  const getCharGradient = (character: string) => {
    const charCode = character.charCodeAt(0);
    const gradients = darkMode ? DARK_GRADIENTS : LIGHT_GRADIENTS;
    return gradients[charCode % gradients.length];
  };

  // Get character details
  const selectedCharDetails = selectedChar ? allRadicals[selectedChar] : null;

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm('');
    setFilterMinRadicals(1);
    setFilterMaxRadicals(10);
    setIsShuffled(false);
    setSortBy('char');
    setSortDirection('asc');
    
    const initialEntries = Object.entries(allRadicals).slice(0, Object.keys(displayedRadicals).length);
    setDisplayedRadicals(Object.fromEntries(initialEntries));
  };

  // Reset to initial state
  const resetToInitial = () => {
    const initialEntries = Object.entries(allRadicals).slice(0, INITIAL_LOAD);
    setDisplayedRadicals(Object.fromEntries(initialEntries));
    setCurrentPage(1);
    setHasMore(Object.keys(allRadicals).length > INITIAL_LOAD);
    setIsShuffled(false);
    setSortBy('char');
    setSortDirection('asc');
  };

  // Export data
  const exportData = () => {
    const dataStr = JSON.stringify(displayedRadicals, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `kanji-radicals-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  // Loaded percentage
  const loadedPercentage = Math.round((Object.keys(displayedRadicals).length / Object.keys(allRadicals).length) * 100);

  // Don't render until theme is initialized
  if (darkMode === null) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-gray-900 dark:to-gray-800">
        <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-800 transition-all duration-300">
      {/* Loading Screen */}
      {isLoading && loadingProgress < 100 && (
        <div className="fixed inset-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="text-center max-w-md mx-auto p-8">
            <div className="relative mb-8">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="w-24 h-24 mx-auto rounded-full border-4 border-indigo-200 dark:border-indigo-800 border-t-indigo-600 dark:border-t-indigo-400"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <BookOpen className="w-12 h-12 text-indigo-600 dark:text-indigo-400" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-3">
              Loading Kanji Database
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Initializing character data... {loadingProgress}%
            </p>
            <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"
                initial={{ width: 0 }}
                animate={{ width: `${loadingProgress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/10 dark:to-purple-900/10 rounded-full opacity-30 animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-tr from-cyan-100 to-blue-100 dark:from-cyan-900/10 dark:to-blue-900/10 rounded-full opacity-30 animate-pulse delay-1000" />
      </div>

      {/* Main Container */}
      <div className="relative max-w-7xl mx-auto">
        {/* Header */}
        <motion.header
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <div className="relative">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg">
                    <span className="text-2xl font-bold text-white">字</span>
                  </div>
                  <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center shadow">
                    <Hash className="w-3 h-3 text-white" />
                  </div>
                </div>
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                    Kanji Radical Explorer
                  </h1>
                  <p className="text-gray-600 dark:text-gray-300 text-sm md:text-base">
                    Interactive dashboard for exploring Japanese character components
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={exportData}
                className="px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl font-medium flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <Download size={18} />
                <span className="hidden sm:inline">Export</span>
              </button>
              <button
                onClick={() => setShowRadicalStats(!showRadicalStats)}
                className="px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl font-medium flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                {showRadicalStats ? <EyeOff size={18} /> : <Eye size={18} />}
                <span className="hidden sm:inline">Stats</span>
              </button>
              <button
                onClick={toggleDarkMode}
                className="p-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                {darkMode ? (
                  <Sun size={20} className="text-amber-500" />
                ) : (
                  <Moon size={20} className="text-gray-600" />
                )}
              </button>
            </div>
          </div>

          {/* Search Bar */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="relative mb-6"
          >
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-hover:text-indigo-500 transition-colors" size={22} />
              <input
                type="text"
                placeholder="Search characters or radicals (e.g., '亻' or '人')..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-12 py-4 bg-white dark:bg-gray-800 rounded-2xl border-2 border-gray-200 dark:border-gray-700 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all text-lg shadow-lg"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 p-1.5 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  <X size={18} />
                </button>
              )}
            </div>
          </motion.div>

          {/* Stats Bar */}
          <motion.div
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6"
          >
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-4 border border-gray-200/50 dark:border-gray-700/50">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Characters Loaded</p>
                  <p className="text-2xl font-bold text-gray-800 dark:text-white">
                    {Object.keys(displayedRadicals).length.toLocaleString()}
                  </p>
                </div>
                <div className="p-2 rounded-lg bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-blue-900/30 dark:to-cyan-900/30">
                  <TrendingUp className="text-blue-500 dark:text-blue-400" size={20} />
                </div>
              </div>
            </div>
            
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-4 border border-gray-200/50 dark:border-gray-700/50">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Radical Count</p>
                  <p className="text-2xl font-bold text-gray-800 dark:text-white">
                    {stats.uniqueRadicals.toLocaleString()}
                  </p>
                </div>
                <div className="p-2 rounded-lg bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30">
                  <Layers className="text-indigo-500 dark:text-indigo-400" size={20} />
                </div>
              </div>
            </div>
            
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-4 border border-gray-200/50 dark:border-gray-700/50">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Avg Radicals/Char</p>
                  <p className="text-2xl font-bold text-gray-800 dark:text-white">
                    {stats.averageRadicalsPerChar.toFixed(1)}
                  </p>
                </div>
                <div className="p-2 rounded-lg bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30">
                  <BarChart3 className="text-green-500 dark:text-green-400" size={20} />
                </div>
              </div>
            </div>
            
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-4 border border-gray-200/50 dark:border-gray-700/50">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Progress</p>
                  <p className="text-2xl font-bold text-gray-800 dark:text-white">
                    {loadedPercentage}%
                  </p>
                </div>
                <div className="p-2 rounded-lg bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30">
                  <Loader2 className="text-amber-500 dark:text-amber-400" size={20} />
                </div>
              </div>
            </div>
          </motion.div>
        </motion.header>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Sidebar - Filters */}
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-1 space-y-6"
          >
            {/* Controls Card */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200/50 dark:border-gray-700/50">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
                  <Sparkles className="text-indigo-500" size={20} />
                  Controls
                </h2>
                <div className="flex items-center gap-2">
                  <button
                    onClick={resetToInitial}
                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    title="Reset view"
                  >
                    <RefreshCw size={16} className="text-gray-500 dark:text-gray-400" />
                  </button>
                </div>
              </div>
              
              <div className="space-y-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={shuffleCharacters}
                  className="w-full py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl font-semibold flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all"
                >
                  <Shuffle size={20} />
                  Shuffle Display
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    const chars = Object.keys(allRadicals);
                    const randomChar = chars[Math.floor(Math.random() * chars.length)];
                    setSelectedChar(randomChar);
                    setShowDetails(true);
                  }}
                  className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all"
                >
                  <Zap size={20} />
                  Random Character
                </motion.button>
              </div>
            </div>

            {/* Filters Card */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200/50 dark:border-gray-700/50">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
                  <Filter className="text-indigo-500" size={20} />
                  Filters
                </h2>
                <button
                  onClick={clearFilters}
                  className="text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors"
                >
                  Clear All
                </button>
              </div>

              {/* Radical Count Filter */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Radical Count Range
                  </label>
                  <span className="text-sm font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    {filterMinRadicals} - {filterMaxRadicals}
                  </span>
                </div>
                <div className="space-y-4">
                  <div className="relative pt-1">
                    <input
                      type="range"
                      min="1"
                      max="10"
                      step="1"
                      value={filterMinRadicals}
                      onChange={(e) => setFilterMinRadicals(Math.min(parseInt(e.target.value), filterMaxRadicals))}
                      className="w-full h-2 bg-gradient-to-r from-indigo-300 to-purple-300 dark:from-indigo-700 dark:to-purple-700 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-indigo-500 [&::-webkit-slider-thumb]:shadow-lg"
                    />
                  </div>
                  <div className="relative pt-1">
                    <input
                      type="range"
                      min="1"
                      max="10"
                      step="1"
                      value={filterMaxRadicals}
                      onChange={(e) => setFilterMaxRadicals(Math.max(parseInt(e.target.value), filterMinRadicals))}
                      className="w-full h-2 bg-gradient-to-r from-cyan-300 to-blue-300 dark:from-cyan-700 dark:to-blue-700 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-cyan-500 [&::-webkit-slider-thumb]:shadow-lg"
                    />
                  </div>
                </div>
              </div>

              {/* Sort Options */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Sort Characters By
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setSortBy('char')}
                    className={`py-3 px-4 rounded-xl font-medium transition-all flex items-center justify-center gap-2 ${
                      sortBy === 'char'
                        ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    <span className="text-lg font-bold">A</span>
                    Alphabetical
                  </button>
                  <button
                    onClick={() => setSortBy('radicalCount')}
                    className={`py-3 px-4 rounded-xl font-medium transition-all flex items-center justify-center gap-2 ${
                      sortBy === 'radicalCount'
                        ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    <Hash size={18} />
                    Radical Count
                  </button>
                </div>
                <button
                  onClick={toggleSortDirection}
                  className={`w-full mt-3 py-2.5 px-4 rounded-xl font-medium transition-all flex items-center justify-center gap-2 ${
                    sortDirection === 'asc'
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-md'
                      : 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-md'
                  }`}
                >
                  {sortDirection === 'asc' ? (
                    <>
                      <SortAsc size={18} />
                      Ascending Order
                    </>
                  ) : (
                    <>
                      <SortDesc size={18} />
                      Descending Order
                    </>
                  )}
                </button>
              </div>

              {/* View Mode Toggle */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  View Layout
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`py-3 px-4 rounded-xl font-medium transition-all flex items-center justify-center gap-2 ${
                      viewMode === 'grid'
                        ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    <Grid size={18} />
                    Grid
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`py-3 px-4 rounded-xl font-medium transition-all flex items-center justify-center gap-2 ${
                      viewMode === 'list'
                        ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    <List size={18} />
                    List
                  </button>
                </div>
              </div>
            </div>

            {/* Most Common Radicals */}
            {showRadicalStats && stats.mostCommonRadicals.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-2xl p-6 border border-indigo-100/50 dark:border-indigo-700/30"
              >
                <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                  <TrendingUp className="text-indigo-500" size={20} />
                  Common Radicals
                </h3>
                <div className="space-y-3">
                  {stats.mostCommonRadicals.map(([radical, count], idx) => (
                    <div key={radical} className="flex items-center justify-between p-3 rounded-lg bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
                          <span className="text-white font-bold">{radical}</span>
                        </div>
                        <span className="font-medium text-gray-700 dark:text-gray-300">{radical}</span>
                      </div>
                      <span className="text-sm font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                        {count} times
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </motion.div>

          {/* Main Content Area - Characters */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-3"
            ref={containerRef}
          >
            {/* Results Header */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6 p-5 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 dark:border-gray-700/50">
              <div>
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
                  <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    {filteredCharacters.length.toLocaleString()}
                  </span>
                  Characters Found
                </h2>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  {searchTerm 
                    ? `Results for "${searchTerm}" • Showing ${Math.min(filteredCharacters.length, 100)} items`
                    : `Loaded ${Object.keys(displayedRadicals).length.toLocaleString()} of ${Object.keys(allRadicals).length.toLocaleString()} characters`}
                  {isShuffled && ' • Display shuffled'}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <div className="px-3 py-1.5 rounded-full bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-200/50 dark:border-indigo-700/50">
                  <div className="flex items-center gap-2">
                    <Hash className="text-indigo-500" size={16} />
                    <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Total: {Object.keys(allRadicals).length.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Characters Grid/List */}
            <div 
              className={
                viewMode === 'grid' 
                  ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4' 
                  : 'space-y-4'
              }
            >
              <AnimatePresence mode="popLayout">
                {filteredCharacters.slice(0, 300).map(([character, radicalList], index) => (
                  <motion.div
                    key={character}
                    layout
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: -20 }}
                    transition={{ 
                      duration: 0.2, 
                      delay: Math.min(index * 0.01, 0.3),
                      type: "spring",
                      stiffness: 200,
                      damping: 20
                    }}
                    onClick={() => {
                      setSelectedChar(character);
                      setShowDetails(true);
                    }}
                    className={`group cursor-pointer transition-all duration-200 hover:scale-[1.02] active:scale-95 ${
                      viewMode === 'grid' 
                        ? 'bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg hover:shadow-xl border border-gray-200/50 dark:border-gray-700/50'
                        : 'bg-white dark:bg-gray-800 rounded-xl p-4 shadow hover:shadow-md border border-gray-200/50 dark:border-gray-700/50 flex items-start gap-4'
                    }`}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl font-bold text-white shadow-lg flex-shrink-0"
                            style={{ background: getCharGradient(character) }}
                          >
                            {character}
                          </div>
                          <div className="min-w-0">
                            <h3 className="text-xl font-bold text-gray-800 dark:text-white truncate">
                              {character}
                            </h3>
                            <p className="text-xs text-gray-500 dark:text-gray-400 font-mono mt-1">
                              U+{character.charCodeAt(0).toString(16).toUpperCase().padStart(4, '0')}
                            </p>
                          </div>
                        </div>
                        <ChevronRight className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 mt-2 flex-shrink-0" size={18} />
                      </div>
                      
                      <div className={`flex flex-wrap gap-1.5 mb-3 ${viewMode === 'list' ? 'max-w-2xl' : ''}`}>
                        {radicalList.map((radical, idx) => (
                          <motion.span
                            key={`${character}-${idx}`}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: idx * 0.05 }}
                            className="px-2.5 py-1.5 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 rounded-lg text-gray-700 dark:text-gray-300 font-medium text-sm flex items-center gap-1.5 shadow-sm"
                          >
                            <span className="text-base">{radical}</span>
                            <span className="text-xs opacity-60 bg-gray-200 dark:bg-gray-600 px-1.5 py-0.5 rounded">#{idx + 1}</span>
                          </motion.span>
                        ))}
                      </div>
                      
                      <div className="flex items-center justify-between text-sm">
                        <span className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400 font-medium">
                          <Hash size={14} />
                          {radicalList.length} radical{radicalList.length !== 1 ? 's' : ''}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
                          Click to explore →
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Loading Indicator */}
            {isLoading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-center items-center py-16"
              >
                <div className="text-center">
                  <div className="relative mb-6">
                    <Loader2 className="w-16 h-16 text-indigo-500 animate-spin mx-auto" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 animate-pulse" />
                    </div>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 mb-2">Loading more characters...</p>
                  <p className="text-sm text-gray-500 dark:text-gray-500">
                    {loadingProgress}% • {PAGE_SIZE} characters per load
                  </p>
                  <div className="w-64 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden mt-4 mx-auto">
                    <motion.div
                      className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"
                      initial={{ width: 0 }}
                      animate={{ width: `${loadingProgress}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {/* Observer target for infinite scroll */}
            {hasMore && !isLoading && filteredCharacters.length > 0 && (
              <div 
                ref={observerTarget} 
                className="h-20 flex items-center justify-center"
              >
                <div className="text-center">
                  <p className="text-gray-500 dark:text-gray-400 text-sm mb-2">
                    Scroll down or click to load more
                  </p>
                  <button
                    onClick={loadMoreData}
                    className="px-6 py-2.5 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:shadow-lg transition-all flex items-center gap-2 mx-auto"
                  >
                    <Zap size={16} />
                    Load {PAGE_SIZE} More Characters
                  </button>
                </div>
              </div>
            )}

            {/* End of results */}
            {!hasMore && Object.keys(displayedRadicals).length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-16"
              >
                <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl flex items-center justify-center">
                  <Sparkles className="text-green-500" size={32} />
                </div>
                <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  All characters loaded!
                </h3>
                <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md mx-auto">
                  Successfully loaded all {Object.keys(allRadicals).length.toLocaleString()} characters from the database.
                </p>
                <div className="flex gap-3 justify-center">
                  <button
                    onClick={resetToInitial}
                    className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl font-medium hover:shadow-lg transition-all"
                  >
                    Reset to Initial View
                  </button>
                  <button
                    onClick={shuffleCharacters}
                    className="px-6 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
                  >
                    Shuffle All
                  </button>
                </div>
              </motion.div>
            )}

            {/* Empty State */}
            {filteredCharacters.length === 0 && !isLoading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-20"
              >
                <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 rounded-2xl flex items-center justify-center">
                  <Search className="text-gray-400" size={40} />
                </div>
                <h3 className="text-2xl font-bold text-gray-700 dark:text-gray-300 mb-3">
                  No matching characters found
                </h3>
                <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-md mx-auto">
                  {searchTerm 
                    ? `No results found for "${searchTerm}". Try searching for a different character or radical.`
                    : 'Try adjusting your filters or loading more characters to see results.'}
                </p>
                <div className="flex gap-3 justify-center">
                  <button
                    onClick={clearFilters}
                    className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl font-medium hover:shadow-lg transition-all"
                  >
                    Clear All Filters
                  </button>
                  <button
                    onClick={resetToInitial}
                    className="px-6 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
                  >
                    Reset View
                  </button>
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Character Details Modal */}
      <AnimatePresence>
        {showDetails && selectedChar && selectedCharDetails && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowDetails(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div 
                className="bg-white dark:bg-gray-800 rounded-3xl w-full max-w-2xl max-h-[85vh] overflow-hidden shadow-2xl flex flex-col"
                style={{ background: getCharGradient(selectedChar) }}
              >
                <div className="p-8 text-white relative">
                  <button
                    onClick={() => setShowDetails(false)}
                    className="absolute right-6 top-6 p-2 rounded-xl bg-white/20 hover:bg-white/30 transition-colors backdrop-blur-sm"
                  >
                    <X size={20} />
                  </button>
                  
                  <div className="flex items-center gap-6 mb-6">
                    <div className="w-24 h-24 rounded-2xl bg-white/20 flex items-center justify-center text-5xl font-bold backdrop-blur-sm border-2 border-white/30">
                      {selectedChar}
                    </div>
                    <div className="flex-1">
                      <h2 className="text-4xl font-bold mb-2">{selectedChar}</h2>
                      <div className="flex flex-wrap gap-4">
                        <div className="px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-sm">
                          <span className="font-semibold">Unicode: U+{selectedChar.charCodeAt(0).toString(16).toUpperCase().padStart(4, '0')}</span>
                        </div>
                        <div className="px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-sm">
                          <span className="font-semibold">{selectedCharDetails.length} Radicals</span>
                        </div>
                        <div className="px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-sm">
                          <span className="font-semibold">Strokes: {selectedCharDetails.join('').length}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white dark:bg-gray-800 p-6 overflow-y-auto flex-1">
                  <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-2">
                    <Layers className="text-indigo-500" size={22} />
                    Component Radicals
                  </h3>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mb-8">
                    {selectedCharDetails.map((radical, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, scale: 0.8, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="relative group"
                      >
                        <div className="aspect-square rounded-xl flex flex-col items-center justify-center p-4 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 border border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-500 transition-colors">
                          <span className="text-3xl font-bold mb-2">{radical}</span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">Radical {idx + 1}</span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                  
                  <div className="space-y-4">
                    <div className="p-5 rounded-xl bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
                      <h4 className="font-bold text-gray-800 dark:text-white mb-3 flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white text-sm">
                          i
                        </span>
                        Character Composition
                      </h4>
                      <p className="text-gray-600 dark:text-gray-400">
                        This character "<span className="font-bold text-indigo-600 dark:text-indigo-400">{selectedChar}</span>" is composed of {selectedCharDetails.length} radicals arranged as:{" "}
                        <span className="font-mono text-gray-700 dark:text-gray-300">
                          {selectedCharDetails.map((rad, idx) => (
                            <span key={idx}>
                              {rad}
                              {idx < selectedCharDetails.length - 1 ? " + " : ""}
                            </span>
                          ))}
                        </span>
                      </p>
                    </div>
                    
                    <div className="p-5 rounded-xl bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 border border-indigo-100 dark:border-indigo-800/30">
                      <h4 className="font-bold text-indigo-700 dark:text-indigo-300 mb-3 flex items-center gap-2">
                        <Zap className="text-indigo-500" size={18} />
                        Learning Tip
                      </h4>
                      <p className="text-indigo-600 dark:text-indigo-400">
                        Practice writing each radical separately before combining them. Understanding individual radicals helps memorize complex kanji and recognize patterns across different characters.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Floating Action Buttons */}
      <div className="fixed bottom-6 right-6 flex flex-col gap-3 z-30">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="p-3 bg-white dark:bg-gray-800 rounded-full shadow-xl border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          title="Scroll to top"
        >
          <ChevronRight className="rotate-270" size={20} />
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={loadMoreData}
          className="p-3 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full shadow-xl text-white hover:shadow-2xl transition-shadow"
          title="Load more characters"
        >
          <Download size={20} />
        </motion.button>
      </div>

      {/* Custom CSS */}
      <style jsx global>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.5; }
        }
        
        .animate-pulse {
          animation: pulse 2s infinite;
        }
        
        .delay-1000 {
          animation-delay: 1s;
        }
        
        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 10px;
        }
        
        ::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 5px;
        }
        
        ::-webkit-scrollbar-thumb {
          background: linear-gradient(135deg, #4f46e5, #7c3aed);
          border-radius: 5px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
        }
        
        .dark ::-webkit-scrollbar-track {
          background: #2d3748;
        }
        
        .dark ::-webkit-scrollbar-thumb {
          background: linear-gradient(135deg, #818cf8, #a78bfa);
        }
        
        .dark ::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(135deg, #a5b4fc, #c4b5fd);
        }
        
        /* Selection color */
        ::selection {
          background: rgba(99, 102, 241, 0.3);
        }
        
        .dark ::selection {
          background: rgba(129, 140, 248, 0.3);
        }
        
        /* Rotate utilities */
        .rotate-270 {
          transform: rotate(-90deg);
        }
        
        /* Smooth transitions */
        * {
          transition: background-color 0.2s ease, border-color 0.2s ease;
        }
      `}</style>
    </div>
  );
};

export default RadicalDashboard;