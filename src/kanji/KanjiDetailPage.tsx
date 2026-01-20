// KanjiDetailPage.tsx - Updated to match your JSON structure with bookmark functionality
import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import kanjiData from './kanji.json';
import { 
  ArrowLeft, 
  Volume2, 
  BookOpen, 
  Target, 
  BarChart, 
  Copy, 
  Check, 
  ExternalLink,
  Bookmark,
  BookmarkCheck,
  Star,
  Grid3x3,
  Headphones,
  Mic,
  Share2
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

const KanjiDetailPage = () => {
  const { char } = useParams<{ char: string }>();
  const data = kanjiData as KanjiData;
  const [copied, setCopied] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  
  const entry = char ? data[char] : null;
  
  useEffect(() => {
    if (char) {
      const bookmarks = JSON.parse(localStorage.getItem('kanji-bookmarks') || '[]');
      setIsBookmarked(bookmarks.includes(char));
    }
  }, [char]);
  
  const toggleBookmark = () => {
    const bookmarks = JSON.parse(localStorage.getItem('kanji-bookmarks') || '[]');
    let newBookmarks;
    
    if (isBookmarked) {
      newBookmarks = bookmarks.filter((k: string) => k !== char);
    } else {
      newBookmarks = [...bookmarks, char];
    }
    
    localStorage.setItem('kanji-bookmarks', JSON.stringify(newBookmarks));
    setIsBookmarked(!isBookmarked);
  };

  if (!char || !entry) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 px-4 py-6 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">❌</div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">Kanji Not Found</h1>
          <p className="text-gray-600 mb-6">The kanji "{char}" could not be found in the database.</p>
          <Link
            to="/kanji"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-purple-600 transition-all duration-300 hover:shadow-xl"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Kanji List
          </Link>
        </div>
      </div>
    );
  }

  const meanings = entry?.meanings || [];
  const onReadings = entry?.readings_on || [];
  const kunReadings = entry?.readings_kun || [];
  const jlptLevel = entry?.jlpt_new ? `N${entry.jlpt_new}` : 'Unknown';
  const strokeCount = entry?.strokes || 0;
  const wkMeanings = entry?.wk_meanings || [];
  const wkRadicals = entry?.wk_radicals || [];
  const wkLevel = entry?.wk_level;
  
  const playAudio = (text: string, lang: string = 'ja-JP') => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;
      utterance.rate = 0.8;
      speechSynthesis.cancel();
      speechSynthesis.speak(utterance);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareKanji = () => {
    if (navigator.share) {
      navigator.share({
        title: `Kanji: ${char}`,
        text: `Check out this kanji: ${char} - ${meanings[0]}`,
        url: window.location.href,
      });
    } else {
      copyToClipboard(window.location.href);
    }
  };

  const getJlptColor = (level: string) => {
    switch(level) {
      case 'N5': return 'bg-green-100 text-green-700 border-green-200';
      case 'N4': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'N3': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'N2': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'N1': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getJlptTextColor = (level: string) => {
    switch(level) {
      case 'N5': return 'text-green-600';
      case 'N4': return 'text-blue-600';
      case 'N3': return 'text-yellow-600';
      case 'N2': return 'text-orange-600';
      case 'N1': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 px-3 sm:px-4 lg:px-6 py-4 sm:py-6 animate-fadeIn">
      {/* Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-10 sm:right-20 w-48 h-48 sm:w-64 sm:h-64 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full blur-2xl sm:blur-3xl opacity-30"></div>
        <div className="absolute bottom-20 left-10 sm:left-20 w-64 h-64 sm:w-96 sm:h-96 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full blur-2xl sm:blur-3xl opacity-20"></div>
      </div>

      <div className="relative max-w-6xl mx-auto">
        {/* Back Button and Controls */}
        <div className="mb-6 sm:mb-8 animate-slideInLeft">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <Link
              to="/kanji"
              className="inline-flex items-center gap-3 group w-fit"
            >
              <div className="p-2 bg-white/80 backdrop-blur-sm rounded-xl shadow-sm group-hover:shadow-lg transition-all duration-300 group-hover:-translate-x-1">
                <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Back to</p>
                <p className="font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">Kanji Explorer</p>
              </div>
            </Link>
            
            <div className="flex items-center gap-2">
              <button
                onClick={toggleBookmark}
                className={`p-3 rounded-xl transition-all duration-300 hover:scale-105 ${
                  isBookmarked 
                    ? 'bg-yellow-100 text-yellow-600 hover:bg-yellow-200' 
                    : 'bg-white/80 backdrop-blur-sm text-gray-600 hover:text-yellow-500 hover:bg-yellow-50'
                }`}
              >
                {isBookmarked ? (
                  <BookmarkCheck className="w-5 h-5 sm:w-6 sm:h-6" />
                ) : (
                  <Bookmark className="w-5 h-5 sm:w-6 sm:h-6" />
                )}
              </button>
              <button
                onClick={shareKanji}
                className="p-3 bg-white/80 backdrop-blur-sm rounded-xl text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-all duration-300 hover:scale-105"
              >
                <Share2 className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="animate-slideInUp">
          {/* Header Section */}
          <div className="mb-8 sm:mb-10 lg:mb-12">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 sm:gap-6 mb-6 sm:mb-8">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
                <div className="relative">
                  <div className="absolute -inset-6 sm:-inset-8 bg-gradient-to-r from-blue-200 to-purple-200 rounded-full blur-2xl opacity-50"></div>
                  <span className="relative text-7xl sm:text-8xl lg:text-9xl font-bold text-gray-800 block">
                    {char}
                  </span>
                </div>
                
                <div className="space-y-3 sm:space-y-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={() => playAudio(char)}
                      className="p-2 sm:p-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 flex items-center gap-2"
                    >
                      <Headphones className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span className="text-sm font-medium">Listen</span>
                    </button>
                    <button
                      onClick={() => copyToClipboard(char)}
                      className="p-2 sm:p-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl hover:from-purple-600 hover:to-purple-700 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 flex items-center gap-2"
                    >
                      {copied ? <Check className="w-4 h-4 sm:w-5 sm:h-5" /> : <Copy className="w-4 h-4 sm:w-5 sm:h-5" />}
                      <span className="text-sm font-medium">{copied ? 'Copied' : 'Copy'}</span>
                    </button>
                    <button
                      onClick={() => playAudio(meanings[0] || '', 'en-US')}
                      className="p-2 sm:p-3 bg-gradient-to-r from-pink-500 to-pink-600 text-white rounded-xl hover:from-pink-600 hover:to-pink-700 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 flex items-center gap-2"
                    >
                      <Mic className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span className="text-sm font-medium">English</span>
                    </button>
                  </div>
                  <div className="text-sm text-gray-500">
                    Unicode: U+{char.charCodeAt(0).toString(16).toUpperCase()}
                  </div>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2 sm:gap-3">
                <div className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border text-base sm:text-lg font-bold ${getJlptColor(jlptLevel)}`}>
                  JLPT {jlptLevel}
                </div>
                <div className="px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-gray-100 to-blue-50 rounded-full border border-gray-200">
                  <div className="flex items-center gap-1 sm:gap-2">
                    <BarChart className="w-4 h-4 text-gray-600" />
                    <span className="font-semibold text-gray-800">{strokeCount}</span>
                    <span className="text-gray-600 text-sm">strokes</span>
                  </div>
                </div>
                {entry.grade && (
                  <div className="px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-blue-100 to-cyan-50 rounded-full border border-blue-200">
                    <div className="flex items-center gap-1 sm:gap-2">
                      <Grid3x3 className="w-4 h-4 text-blue-600" />
                      <span className="font-semibold text-blue-700">Grade {entry.grade}</span>
                    </div>
                  </div>
                )}
                {entry.freq && (
                  <div className="px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-green-100 to-emerald-50 rounded-full border border-green-200">
                    <span className="font-semibold text-green-700">Freq #{entry.freq}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Main Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-6 lg:gap-8 mb-8 sm:mb-10 lg:mb-12">
            {/* Meanings Card */}
            <div className="lg:col-span-2">
              <div className="bg-white/90 backdrop-blur-xl rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl border border-white/50 p-5 sm:p-6 lg:p-8">
                <div className="flex items-center gap-3 mb-4 sm:mb-6">
                  <div className="p-2 bg-gradient-to-r from-blue-100 to-purple-100 rounded-lg">
                    <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Meanings & Readings</h2>
                </div>
                
                <div className="space-y-5 sm:space-y-6">
                  <div>
                    <h3 className="text-xs sm:text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2 sm:mb-3">English Meanings</h3>
                    <div className="flex flex-wrap gap-2">
                      {meanings.map((meaning, index) => (
                        <div
                          key={index}
                          className="px-3 sm:px-4 py-2 sm:py-3 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg sm:rounded-xl border border-blue-200"
                        >
                          <div className="flex items-center gap-2 sm:gap-3">
                            <span className="text-gray-800 font-medium text-sm sm:text-base">{meaning}</span>
                            <button
                              onClick={() => playAudio(meaning, 'en-US')}
                              className="p-1 sm:p-1.5 bg-blue-100 hover:bg-blue-200 rounded-lg transition-colors"
                            >
                              <Volume2 className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    <div>
                      <h3 className="text-xs sm:text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2 sm:mb-3">On'yomi Readings</h3>
                      <div className="space-y-2">
                        {onReadings.length > 0 ? onReadings.map((reading, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-gradient-to-r from-gray-50 to-blue-50/50 rounded-lg sm:rounded-xl">
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-lg sm:text-xl text-blue-700">{reading}</span>
                              {entry.wk_readings_on?.includes(reading) && (
                                <Star className="w-4 h-4 text-amber-500" />
                              )}
                            </div>
                            <button
                              onClick={() => playAudio(reading)}
                              className="p-1.5 sm:p-2 bg-blue-100 hover:bg-blue-200 rounded-lg transition-colors"
                            >
                              <Volume2 className="w-4 h-4 text-blue-600" />
                            </button>
                          </div>
                        )) : (
                          <div className="text-gray-500 italic p-3">No on'yomi readings available</div>
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-xs sm:text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2 sm:mb-3">Kun'yomi Readings</h3>
                      <div className="space-y-2">
                        {kunReadings.length > 0 ? kunReadings.map((reading, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-gradient-to-r from-gray-50 to-purple-50/50 rounded-lg sm:rounded-xl">
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-lg sm:text-xl text-purple-700">{reading}</span>
                              {entry.wk_readings_kun?.includes(reading) && (
                                <Star className="w-4 h-4 text-amber-500" />
                              )}
                            </div>
                            <button
                              onClick={() => playAudio(reading)}
                              className="p-1.5 sm:p-2 bg-purple-100 hover:bg-purple-200 rounded-lg transition-colors"
                            >
                              <Volume2 className="w-4 h-4 text-purple-600" />
                            </button>
                          </div>
                        )) : (
                          <div className="text-gray-500 italic p-3">No kun'yomi readings available</div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* WaniKani Info */}
                  {wkLevel && (
                    <div>
                      <h3 className="text-xs sm:text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2 sm:mb-3">WaniKani Information</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                        <div className="p-3 sm:p-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-lg sm:rounded-xl border border-amber-200">
                          <div className="flex items-center gap-2 mb-2">
                            <Star className="w-4 h-4 text-amber-600" />
                            <span className="font-medium text-amber-700">Level {wkLevel}</span>
                          </div>
                          {wkMeanings.length > 0 && (
                            <p className="text-sm text-amber-600">{wkMeanings.join(', ')}</p>
                          )}
                        </div>
                        {wkRadicals.length > 0 && (
                          <div className="p-3 sm:p-4 bg-gradient-to-r from-amber-50 to-yellow-50 rounded-lg sm:rounded-xl border border-yellow-200">
                            <h4 className="text-xs font-semibold text-amber-700 mb-2">Radicals</h4>
                            <div className="flex flex-wrap gap-1">
                              {wkRadicals.map((radical, index) => (
                                <span
                                  key={index}
                                  className="px-2 py-1 bg-amber-100 text-amber-700 rounded text-xs font-medium"
                                >
                                  {radical}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Stats & Info Card */}
            <div>
              <div className="bg-white/90 backdrop-blur-xl rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl border border-white/50 p-5 sm:p-6 lg:p-8 h-full">
                <div className="flex items-center gap-3 mb-4 sm:mb-6 lg:mb-8">
                  <div className="p-2 bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg">
                    <Target className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Kanji Details</h2>
                </div>
                
                <div className="space-y-4 sm:space-y-6">
                  <div className="p-3 sm:p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg sm:rounded-xl">
                    <div className="text-xs sm:text-sm text-gray-500 mb-1">Character</div>
                    <div className="font-mono text-2xl sm:text-3xl font-bold text-gray-800">{char}</div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3 sm:gap-4">
                    <div className="p-3 sm:p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg sm:rounded-xl">
                      <div className="text-xs sm:text-sm text-gray-500 mb-1">Strokes</div>
                      <div className="text-2xl sm:text-3xl font-bold text-gray-800">{strokeCount}</div>
                    </div>
                    
                    <div className="p-3 sm:p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg sm:rounded-xl">
                      <div className="text-xs sm:text-sm text-gray-500 mb-1">JLPT Level</div>
                      <div className={`text-2xl sm:text-3xl font-bold ${getJlptTextColor(jlptLevel)}`}>
                        {jlptLevel}
                      </div>
                    </div>
                  </div>
                  
                  {entry.grade && (
                    <div className="p-3 sm:p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg sm:rounded-xl">
                      <div className="text-xs sm:text-sm text-gray-500 mb-1">School Grade</div>
                      <div className="text-2xl sm:text-3xl font-bold text-emerald-700">Grade {entry.grade}</div>
                    </div>
                  )}
                  
                  {entry.freq && (
                    <div className="p-3 sm:p-4 bg-gradient-to-r from-yellow-50 to-amber-50 rounded-lg sm:rounded-xl">
                      <div className="text-xs sm:text-sm text-gray-500 mb-1">Frequency Rank</div>
                      <div className="text-2xl sm:text-3xl font-bold text-amber-700">#{entry.freq}</div>
                    </div>
                  )}
                  
                  {/* External Resources */}
                  <div className="pt-4 sm:pt-6 border-t border-gray-200">
                    <h3 className="text-xs sm:text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3 sm:mb-4">External Resources</h3>
                    <div className="space-y-2">
                      <a
                        href={`https://jisho.org/search/${char}%20%23kanji`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 rounded-lg sm:rounded-xl transition-all duration-300 group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold">J</span>
                          </div>
                          <div>
                            <div className="font-medium text-gray-800">Jisho.org</div>
                            <div className="text-xs text-gray-500">Detailed kanji info</div>
                          </div>
                        </div>
                        <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-blue-600" />
                      </a>
                      
                      <a
                        href={`https://www.wanikani.com/kanji/${char}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between p-3 bg-gradient-to-r from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-200 rounded-lg sm:rounded-xl transition-all duration-300 group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold">W</span>
                          </div>
                          <div>
                            <div className="font-medium text-gray-800">WaniKani</div>
                            <div className="text-xs text-gray-500">Kanji learning</div>
                          </div>
                        </div>
                        <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-purple-600" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
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
        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out;
        }
        .animate-slideInUp {
          animation: slideInUp 0.5s ease-out forwards;
          opacity: 0;
        }
        .animate-slideInLeft {
          animation: slideInLeft 0.5s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  );
};

export default KanjiDetailPage;