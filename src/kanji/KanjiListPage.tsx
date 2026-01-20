// KanjiListPage.tsx - Updated to match your JSON structure with bookmark functionality
import { Link } from 'react-router-dom';
import { useMemo, useState, useEffect } from 'react';
import kanjiData from './kanji.json';
import { 
  Search, 
  Filter, 
  Volume2, 
  Sparkles, 
  ChevronRight, 
  BookOpen, 
  Target, 
  BarChart,
  Bookmark,
  BookmarkCheck,
  Star,
  Grid3x3
} from 'lucide-react';

// Define the type based on your JSON structure
type KanjiEntry = {
  strokes: number;
  grade?: number;
  freq?: number;
  jlpt_old?: number;
  jlpt_new?: number;
  meanings: string[];
  readings_on: string[];
  readings_kun: string[];
  wk_level?: number;
  wk_meanings?: string[];
  wk_readings_on?: string[];
  wk_readings_kun?: string[];
  wk_radicals?: string[];
};

type KanjiData = Record<string, KanjiEntry>;

const JLPT_LEVELS = ['All', 'N5', 'N4', 'N3', 'N2', 'N1'];

const KanjiListPage = () => {
  const data = kanjiData as KanjiData;
  const [search, setSearch] = useState('');
  const [jlptFilter, setJlptFilter] = useState<string>('All');
  const [hoveredKanji, setHoveredKanji] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [bookmarks, setBookmarks] = useState<string[]>(() => {
    const saved = localStorage.getItem('kanji-bookmarks');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    setMounted(true);
    
    if ('speechSynthesis' in window) {
      const warmUp = new SpeechSynthesisUtterance('');
      speechSynthesis.speak(warmUp);
      speechSynthesis.cancel();
    }
  }, []);

  const toggleBookmark = (kanji: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const newBookmarks = bookmarks.includes(kanji)
      ? bookmarks.filter(k => k !== kanji)
      : [...bookmarks, kanji];
    
    setBookmarks(newBookmarks);
    localStorage.setItem('kanji-bookmarks', JSON.stringify(newBookmarks));
  };

  const kanjiList = useMemo(() => {
    return Object.entries(data)
      .filter(([kanji, entry]) => {
        if (!entry) return false;
        
        if (jlptFilter !== 'All' && entry.jlpt_new) {
          if (`N${entry.jlpt_new}` !== jlptFilter) return false;
        }

        if (search.trim()) {
          const q = search.toLowerCase();
          const hasMeaning = entry.meanings?.some(m => m.toLowerCase().includes(q));
          const hasKunReading = entry.readings_kun?.some(r => r.toLowerCase().includes(q));
          const hasOnReading = entry.readings_on?.some(r => r.toLowerCase().includes(q));
          const hasRadical = entry.wk_radicals?.some(r => r.toLowerCase().includes(q));
          
          return (
            kanji.includes(q) ||
            hasMeaning ||
            hasKunReading ||
            hasOnReading ||
            hasRadical
          );
        }

        return true;
      })
      .slice(0, 200);
  }, [data, search, jlptFilter]);

  const playKanjiAudio = (kanji: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(kanji);
      utterance.lang = 'ja-JP';
      utterance.rate = 0.8;
      
      speechSynthesis.cancel();
      speechSynthesis.speak(utterance);
    }
  };

  const playMeaningAudio = (meaning: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(meaning);
      utterance.lang = 'en-US';
      utterance.rate = 0.9;
      
      speechSynthesis.cancel();
      speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 px-4 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
      {/* Animated Background Elements */}
      {mounted && (
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-gradient-to-r from-blue-300 to-purple-300 rounded-full animate-float"
              style={{
                left: `${Math.random() * 100}vw`,
                top: `${Math.random() * 100}vh`,
                animationDelay: `${i * 0.5}s`,
                animationDuration: `${Math.random() * 20 + 20}s`
              }}
            />
          ))}
        </div>
      )}

      <div className="relative max-w-7xl mx-auto">
        {/* Header */}
        <header className="text-center mb-8 sm:mb-10 lg:mb-12 animate-fadeIn">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-4 sm:mb-6">
            <div className="relative">
              <div className="absolute -inset-3 sm:-inset-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur-xl opacity-20"></div>
              <BookOpen className="relative w-8 h-8 sm:w-10 sm:h-10 text-blue-600" />
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              漢字 Explorer
            </h1>
            <div className="relative">
              <div className="absolute -inset-3 sm:-inset-4 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full blur-xl opacity-20"></div>
              <Target className="relative w-8 h-8 sm:w-10 sm:h-10 text-purple-600" />
            </div>
          </div>
          <p className="text-gray-600 text-base sm:text-lg md:text-xl max-w-2xl sm:max-w-3xl mx-auto mb-3 sm:mb-4 px-4">
            Explore {Object.keys(data).length.toLocaleString()} Japanese kanji with detailed information and pronunciation
          </p>
          
          {/* Stats and Bookmarks Bar */}
          <div className="flex flex-wrap justify-center gap-3 sm:gap-4 mt-6">
            <div className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-white/80 backdrop-blur-sm rounded-xl shadow-sm">
              <BarChart className="w-4 h-4 text-blue-500" />
              <span className="text-sm text-gray-700">
                <span className="font-bold text-blue-600">{Object.keys(data).length.toLocaleString()}</span> Kanji
              </span>
            </div>
            <div className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-white/80 backdrop-blur-sm rounded-xl shadow-sm">
              <Sparkles className="w-4 h-4 text-yellow-500" />
              <span className="text-sm text-gray-700">
                <span className="font-bold text-purple-600">N5-N1</span> Levels
              </span>
            </div>
            {bookmarks.length > 0 && (
              <Link
                to="/bookmarks"
                className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-gradient-to-r from-yellow-50 to-amber-50 rounded-xl shadow-sm hover:shadow-md transition-shadow"
              >
                <BookmarkCheck className="w-4 h-4 text-amber-600" />
                <span className="text-sm font-medium text-amber-700">
                  {bookmarks.length} Bookmarked
                </span>
              </Link>
            )}
          </div>
        </header>

        {/* Controls Section */}
        <div className="mb-8 sm:mb-10 lg:mb-12 animate-slideInUp">
          <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 mb-6 sm:mb-8">
            {/* Search Box */}
            <div className="flex-1">
              <div className="relative group">
                <div className="absolute -inset-0.5 sm:-inset-1 bg-gradient-to-r from-blue-400 to-purple-400 rounded-2xl blur opacity-0 group-hover:opacity-30 transition duration-500"></div>
                <div className="relative">
                  <Search className="absolute left-3 sm:left-5 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5 z-10" />
                  <input
                    type="text"
                    placeholder="Search kanji, meaning, readings..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="w-full pl-10 sm:pl-14 pr-4 sm:pr-6 py-3 sm:py-4 rounded-2xl border-2 border-white/50 bg-white/90 backdrop-blur-xl shadow-lg sm:shadow-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-200/50 outline-none transition-all duration-300 hover:shadow-xl text-base sm:text-lg placeholder-gray-400"
                  />
                </div>
              </div>
            </div>

            {/* JLPT Filter */}
            <div className="w-full lg:w-56 xl:w-64">
              <div className="relative group">
                <div className="absolute -inset-0.5 sm:-inset-1 bg-gradient-to-r from-purple-400 to-pink-400 rounded-2xl blur opacity-0 group-hover:opacity-30 transition duration-500"></div>
                <div className="relative">
                  <Filter className="absolute left-3 sm:left-5 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5 z-10" />
                  <select
                    value={jlptFilter}
                    onChange={e => setJlptFilter(e.target.value)}
                    className="w-full pl-10 sm:pl-14 pr-8 sm:pr-10 py-3 sm:py-4 rounded-2xl border-2 border-white/50 bg-white/90 backdrop-blur-xl shadow-lg sm:shadow-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-200/50 outline-none appearance-none transition-all duration-300 hover:shadow-xl text-base sm:text-lg"
                  >
                    {JLPT_LEVELS.map(level => (
                      <option key={level} value={level}>
                        {level === 'All' ? 'All JLPT Levels' : `JLPT ${level}`}
                      </option>
                    ))}
                  </select>
                  <ChevronRight className="absolute right-3 sm:right-5 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5 rotate-90 z-10" />
                </div>
              </div>
            </div>
          </div>

          {/* Results Counter */}
          <div className="animate-fadeIn">
            <div className="inline-flex flex-wrap items-center gap-2 sm:gap-4 px-4 sm:px-6 py-2 sm:py-3 bg-white/90 backdrop-blur-xl rounded-full shadow-lg border border-white/50">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-gray-700 font-medium">
                  Showing <span className="font-bold text-blue-600 text-base sm:text-lg">{kanjiList.length}</span> kanji
                </span>
              </div>
              {jlptFilter !== 'All' && (
                <span className="px-2 sm:px-3 py-1 sm:py-1.5 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 rounded-full text-xs sm:text-sm font-semibold border border-blue-200 animate-pulse">
                  {jlptFilter}
                </span>
              )}
              {search && (
                <span className="px-2 sm:px-3 py-1 sm:py-1.5 bg-gradient-to-r from-yellow-100 to-orange-100 text-amber-700 rounded-full text-xs sm:text-sm font-semibold border border-amber-200">
                  "{search}"
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Kanji Grid */}
        <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6 mb-8 sm:mb-12">
          {kanjiList.map(([kanji, entry], index) => {
            const meanings = entry?.meanings || [];
            const firstMeaning = meanings[0] || 'No meaning';
            const allMeanings = meanings.slice(0, 3).join(', ');
            const onReadings = entry?.readings_on || [];
            const kunReadings = entry?.readings_kun || [];
            const firstOnReading = onReadings[0] || '';
            const firstKunReading = kunReadings[0] || '';
            const jlptLevel = entry?.jlpt_new ? `N${entry.jlpt_new}` : '?';
            const strokeCount = entry?.strokes || 0;
            const isBookmarked = bookmarks.includes(kanji);

            return (
              <div
                key={kanji}
                style={{ animationDelay: `${index * 0.03}s` }}
                className="animate-slideInUp"
                onMouseEnter={() => setHoveredKanji(kanji)}
                onMouseLeave={() => setHoveredKanji(null)}
              >
                <Link to={`/kanji/${kanji}`} className="block">
                  {/* Card Container */}
                  <div className="relative group">
                    {/* Glow effect */}
                    <div className={`absolute -inset-0.5 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 rounded-2xl blur opacity-0 group-hover:opacity-30 transition duration-500 ${hoveredKanji === kanji ? 'opacity-30' : ''}`}></div>
                    
                    {/* Main Card */}
                    <div className="relative bg-white/95 backdrop-blur-xl rounded-xl sm:rounded-xl shadow-lg sm:shadow-xl border border-white/50 overflow-hidden transition-all duration-300 group-hover:shadow-2xl group-hover:-translate-y-1">
                      
                      {/* Header Section */}
                      <div className="p-4 sm:p-6 border-b border-gray-100">
                        <div className="flex items-start justify-between">
                          {/* Kanji Character */}
                          <div className="relative">
                            <div className="absolute -inset-4 sm:-inset-6 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full blur-xl opacity-50 group-hover:opacity-70 transition duration-300"></div>
                            <span className="relative text-4xl sm:text-5xl md:text-6xl font-bold text-gray-800 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 transition-all duration-300">
                              {kanji}
                            </span>
                          </div>
                          
                          {/* JLPT Badge and Bookmark */}
                          <div className="flex flex-col items-end gap-2">
                            <div className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs font-bold ${
                              jlptLevel === 'N5' ? 'bg-green-100 text-green-700' :
                              jlptLevel === 'N4' ? 'bg-blue-100 text-blue-700' :
                              jlptLevel === 'N3' ? 'bg-yellow-100 text-yellow-700' :
                              jlptLevel === 'N2' ? 'bg-orange-100 text-orange-700' :
                              jlptLevel === 'N1' ? 'bg-red-100 text-red-700' :
                              'bg-gray-100 text-gray-700'
                            }`}>
                              {jlptLevel}
                            </div>
                            
                            <button
                              onClick={(e) => toggleBookmark(kanji, e)}
                              className={`p-1.5 sm:p-2 rounded-lg transition-all duration-300 hover:scale-110 ${
                                isBookmarked 
                                  ? 'bg-yellow-100 text-yellow-600 hover:bg-yellow-200' 
                                  : 'bg-gray-100 text-gray-400 hover:bg-gray-200 hover:text-yellow-500'
                              }`}
                            >
                              {isBookmarked ? (
                                <BookmarkCheck className="w-4 h-4 sm:w-5 sm:h-5" />
                              ) : (
                                <Bookmark className="w-4 h-4 sm:w-5 sm:h-5" />
                              )}
                            </button>
                          </div>
                        </div>
                        
                        {/* Stroke Count */}
                        <div className="mt-3 sm:mt-4 flex items-center gap-2">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          <span className="text-sm text-gray-600">
                            <span className="font-semibold text-gray-800">{strokeCount}</span> strokes
                          </span>
                          {entry.grade && (
                            <span className="ml-2 px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full text-xs">
                              Grade {entry.grade}
                            </span>
                          )}
                        </div>
                      </div>
                      
                      {/* Content Section */}
                      <div className="p-4 sm:p-6">
                        {/* Meanings */}
                        <div className="mb-3 sm:mb-4">
                          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Meanings</h3>
                          <p className="text-gray-800 font-medium line-clamp-2 text-sm sm:text-base" title={allMeanings}>
                            {allMeanings || 'No meanings available'}
                          </p>
                        </div>
                        
                        {/* Readings */}
                        <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
                          <div>
                            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">On</h3>
                            <p className="text-blue-700 font-medium text-sm sm:text-base">
                              {firstOnReading || '-'}
                              {onReadings.length > 1 && (
                                <span className="text-gray-400 text-xs ml-1">+{onReadings.length - 1}</span>
                              )}
                            </p>
                          </div>
                          <div>
                            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Kun</h3>
                            <p className="text-purple-700 font-medium text-sm sm:text-base">
                              {firstKunReading || '-'}
                              {kunReadings.length > 1 && (
                                <span className="text-gray-400 text-xs ml-1">+{kunReadings.length - 1}</span>
                              )}
                            </p>
                          </div>
                        </div>
                        
                        {/* WaniKani Info */}
                        {entry.wk_level && (
                          <div className="mb-4 sm:mb-6 p-2 sm:p-3 bg-gradient-to-r from-orange-50 to-amber-50 rounded-lg">
                            <div className="flex items-center gap-2">
                              <Star className="w-3 h-3 sm:w-4 sm:h-4 text-amber-600" />
                              <span className="text-xs sm:text-sm font-medium text-amber-700">
                                WaniKani Level {entry.wk_level}
                              </span>
                            </div>
                            {entry.wk_radicals && entry.wk_radicals.length > 0 && (
                              <p className="text-xs text-amber-600 mt-1 truncate">
                                {entry.wk_radicals[0]}
                              </p>
                            )}
                          </div>
                        )}
                        
                        {/* Audio Buttons */}
                        <div className="flex gap-2">
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              playKanjiAudio(kanji);
                            }}
                            className="flex-1 flex items-center justify-center gap-2 px-3 sm:px-4 py-2 sm:py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 active:scale-95 group"
                          >
                            <Volume2 className="w-3 h-3 sm:w-4 sm:h-4" />
                            <span className="text-xs sm:text-sm font-medium">Listen</span>
                          </button>
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              playMeaningAudio(firstMeaning);
                            }}
                            className="flex-1 flex items-center justify-center gap-2 px-3 sm:px-4 py-2 sm:py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg hover:from-purple-600 hover:to-purple-700 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 active:scale-95"
                          >
                            <span className="text-xs sm:text-sm font-medium">English</span>
                          </button>
                        </div>
                      </div>
                      
                      {/* Footer */}
                      <div className="px-4 sm:px-6 py-3 sm:py-4 bg-gradient-to-r from-gray-50 to-blue-50/50 border-t border-gray-100">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500">
                            Click for details →
                          </span>
                          <div className="flex items-center gap-2">
                            {entry.freq && (
                              <span className="text-xs text-gray-400">
                                #Freq {entry.freq}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {kanjiList.length === 0 && (
          <div className="text-center py-12 sm:py-16 lg:py-20 animate-fadeIn">
            <div className="relative inline-block mb-6 sm:mb-8">
              <div className="absolute -inset-6 sm:-inset-8 bg-gradient-to-r from-blue-200 to-purple-200 rounded-full blur-2xl sm:blur-3xl opacity-50"></div>
              <div className="relative text-6xl sm:text-7xl lg:text-8xl mb-4 sm:mb-6 animate-bounce">🔍</div>
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-3 sm:mb-4">No kanji found</h3>
            <p className="text-gray-600 text-base sm:text-lg max-w-md mx-auto mb-6 sm:mb-8 px-4">
              Try adjusting your search or filter criteria
            </p>
            <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-8 sm:mb-10">
              <span className="px-3 sm:px-4 py-1.5 sm:py-2 bg-blue-100 text-blue-700 rounded-full text-xs sm:text-sm font-medium">Kanji (日)</span>
              <span className="px-3 sm:px-4 py-1.5 sm:py-2 bg-purple-100 text-purple-700 rounded-full text-xs sm:text-sm font-medium">Meaning (sun)</span>
              <span className="px-3 sm:px-4 py-1.5 sm:py-2 bg-green-100 text-green-700 rounded-full text-xs sm:text-sm font-medium">Reading (にち)</span>
            </div>
            <button
              onClick={() => {
                setSearch('');
                setJlptFilter('All');
              }}
              className="px-6 sm:px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-purple-600 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 text-sm sm:text-base"
            >
              Reset filters
            </button>
          </div>
        )}
        
        {/* Footer */}
        <footer className="text-center py-6 sm:py-8 text-gray-500 text-xs sm:text-sm">
          <p>Showing {kanjiList.length} of {Object.keys(data).length.toLocaleString()} kanji. Use search for specific characters.</p>
        </footer>
      </div>

      {/* Custom Animations */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes float {
          0%, 100% {
            transform: translateY(0) rotate(0deg);
            opacity: 0.2;
          }
          50% {
            transform: translateY(-20px) rotate(180deg);
            opacity: 0.4;
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out;
        }
        .animate-slideInUp {
          animation: slideInUp 0.5s ease-out forwards;
          opacity: 0;
        }
        .animate-float {
          animation: float linear infinite;
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        /* Responsive breakpoints */
        @media (min-width: 475px) {
          .xs\\:grid-cols-2 {
            grid-template-columns: repeat(2, 1fr);
          }
        }
      `}</style>
    </div>
  );
};

export default KanjiListPage;