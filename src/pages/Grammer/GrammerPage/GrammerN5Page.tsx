import React, { useState, useEffect, useRef } from 'react';
import { 
  Volume2, Star, BookOpen, ChevronLeft, ChevronRight,
  Brain, Target, Sparkles, Moon, Sun, Play, Pause,
  Bookmark, Award, Shuffle, Eye, EyeOff,
  Clock, TrendingUp, Download, HelpCircle,
  Filter, Search, Menu, X, Settings, BarChart,
  Heart, Book, Languages, Headphones, Globe,
  Lightbulb, Lock, Unlock, Timer,
  CheckCircle, Award as AwardIcon, Trophy, Medal,
  Loader2, VolumeX, Maximize2, Minimize2,
  Zap, RotateCw, Mic, Cloud, AlertCircle,
  ThumbsUp, Share2, Edit3, Copy, Check,
  Bell, BookmarkPlus, DownloadCloud, UploadCloud,
  RefreshCw, Sparkle, MousePointerClick,
  MessageSquare, BookText, Hash, Grid,
  List, Layout, Settings2, User, LogOut
} from 'lucide-react';
import grammarJson from "../grammerN5.json";

type GrammarExample = {
  jp: string;
  romaji: string;
  en: string;
  grammar_audio: string;
};

type GrammarPoint = {
  title: string;
  short_explanation: string;
  long_explanation: string;
  formation: string;
  examples: GrammarExample[];
  p_tag: string;
  s_tag: string;
};

const GrammarN5Page: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [isPlaying, setIsPlaying] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('grammar_darkMode');
      return saved ? JSON.parse(saved) : window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });
  const [studyStreak, setStudyStreak] = useState(7);
  const [autoPlay, setAutoPlay] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState<string>('all');
  const [studyTime, setStudyTime] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [masteryLevel, setMasteryLevel] = useState(0);
  const [activeTab, setActiveTab] = useState<'explanation' | 'examples' | 'practice'>('explanation');
  const [showConfetti, setShowConfetti] = useState(false);
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [studyGoal, setStudyGoal] = useState(10);
  const [todayProgress, setTodayProgress] = useState(0);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [showTour, setShowTour] = useState(false);
  const [activeTourStep, setActiveTourStep] = useState(0);
  const [audioLoading, setAudioLoading] = useState<number | null>(null);
  
  const audioRefs = useRef<(HTMLAudioElement | null)[]>([]);
  const mainContentRef = useRef<HTMLDivElement>(null);
  const examplesRef = useRef<HTMLDivElement>(null);
  const tourSteps = [
    { title: "Welcome!", description: "Start learning N5 grammar with this interactive app" },
    { title: "Grammar List", description: "Browse all grammar points from the sidebar" },
    { title: "Practice Mode", description: "Test your knowledge with interactive exercises" },
    { title: "Examples", description: "Listen to native pronunciation and repeat" }
  ];

  const [grammarData, setGrammarData] = useState<GrammarPoint[]>([]);
  const [filteredGrammar, setFilteredGrammar] = useState<GrammarPoint[]>([]);

  // Toggle dark mode and save preference
  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem('grammar_darkMode', JSON.stringify(newDarkMode));
  };

  useEffect(() => {
    const loadData = () => {
      try {
        const data = Array.isArray(grammarJson)
          ? grammarJson
          : (grammarJson as any).default || grammarJson;
        
        setGrammarData(data as GrammarPoint[]);
        setFilteredGrammar(data as GrammarPoint[]);
        setIsLoading(false);
        
        const hasVisited = localStorage.getItem('grammar_app_visited');
        if (!hasVisited) {
          setShowTour(true);
          localStorage.setItem('grammar_app_visited', 'true');
        }
      } catch (error) {
        console.error('Error loading grammar data:', error);
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    if (grammarData.length > 0 && filteredGrammar.length > 0) {
      setProgress(((currentIndex + 1) / filteredGrammar.length) * 100);
      const mastery = (favorites.size / grammarData.length) * 100;
      setMasteryLevel(mastery > 100 ? 100 : mastery);
      
      const todayKey = new Date().toDateString();
      const storedProgress = localStorage.getItem(`progress_${todayKey}`);
      const todayCount = storedProgress ? parseInt(storedProgress) : 0;
      setTodayProgress(todayCount);
    }

    if (autoPlay && filteredGrammar.length > 0) {
      const timer = setTimeout(() => {
        handleNext();
      }, 5000);
      return () => clearTimeout(timer);
    }

    const timer = setInterval(() => {
      setStudyTime(prev => prev + 1);
    }, 60000);

    return () => clearInterval(timer);
  }, [currentIndex, autoPlay, grammarData, favorites, filteredGrammar]);

  useEffect(() => {
    if (grammarData.length === 0) return;
    
    let filtered = grammarData;
    
    if (searchQuery) {
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.short_explanation.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.long_explanation.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.formation.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    if (difficultyFilter !== 'all') {
      filtered = filtered.filter(item => item.s_tag === difficultyFilter);
    }
    
    setFilteredGrammar(filtered);
    if (filtered.length > 0 && currentIndex >= filtered.length) {
      setCurrentIndex(0);
    }
  }, [searchQuery, difficultyFilter, grammarData, currentIndex]);

  const currentGrammar = filteredGrammar[currentIndex] || grammarData[0];

  const handleNext = () => {
    if (filteredGrammar.length === 0) return;
    setShowAnswer(false);
    setActiveTab('explanation');
    setCurrentIndex((prev) => (prev + 1) % filteredGrammar.length);
    
    const todayKey = new Date().toDateString();
    const storedProgress = localStorage.getItem(`progress_${todayKey}`);
    const todayCount = storedProgress ? parseInt(storedProgress) + 1 : 1;
    localStorage.setItem(`progress_${todayKey}`, todayCount.toString());
    setTodayProgress(todayCount);
    
    if (todayCount === studyGoal) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    }
    
    if (mainContentRef.current) {
      mainContentRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrev = () => {
    if (filteredGrammar.length === 0) return;
    setShowAnswer(false);
    setActiveTab('explanation');
    setCurrentIndex((prev) => (prev - 1 + filteredGrammar.length) % filteredGrammar.length);
    if (mainContentRef.current) {
      mainContentRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const toggleFavorite = (title: string) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(title)) {
      newFavorites.delete(title);
    } else {
      newFavorites.add(title);
      setStudyStreak(prev => prev + 1);
    }
    setFavorites(newFavorites);
  };

  const playAudio = async (audioUrl: string, exampleIndex: number) => {
    if (!audioUrl) {
      console.warn('No audio URL provided');
      return;
    }
    
    setAudioLoading(exampleIndex);
    
    try {
      // Stop all other audio
      audioRefs.current.forEach(audio => {
        if (audio) {
          audio.pause();
          audio.currentTime = 0;
        }
      });
      
      setIsPlaying(`${currentIndex}-${exampleIndex}`);
      
      // Check if audio URL exists and handle relative paths
      let finalAudioUrl = audioUrl;
      if (!audioUrl.startsWith('http') && !audioUrl.startsWith('/')) {
        finalAudioUrl = `/${audioUrl}`;
      }
      
      console.log('Playing audio:', finalAudioUrl);
      
      const audio = new Audio(finalAudioUrl);
      audioRefs.current[exampleIndex] = audio;
      
      // Set up error handling
      audio.onerror = () => {
        console.error('Failed to load audio:', finalAudioUrl);
        setIsPlaying(null);
        setAudioLoading(null);
      };
      
      audio.oncanplaythrough = () => {
        setAudioLoading(null);
      };
      
      await audio.play();
      audio.onended = () => {
        setIsPlaying(null);
        setAudioLoading(null);
      };
    } catch (error) {
      console.error('Error playing audio:', error);
      setIsPlaying(null);
      setAudioLoading(null);
    }
  };

  const stopAudio = (exampleIndex: number) => {
    const audio = audioRefs.current[exampleIndex];
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
    setIsPlaying(null);
    setAudioLoading(null);
  };

  const shuffleGrammar = () => {
    if (filteredGrammar.length > 0) {
      const randomIndex = Math.floor(Math.random() * filteredGrammar.length);
      setCurrentIndex(randomIndex);
      setShowAnswer(false);
      setActiveTab('explanation');
      if (mainContentRef.current) {
        mainContentRef.current.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) return `${hours}h ${mins}m`;
    if (mins === 0) return 'Just started';
    return `${mins}m`;
  };

  const getAchievementBadge = () => {
    if (studyStreak >= 30) return { icon: <Trophy className="w-4 h-4" />, color: 'text-yellow-500', label: 'Grammar Master' };
    if (studyStreak >= 14) return { icon: <Award className="w-4 h-4" />, color: 'text-orange-500', label: 'Advanced' };
    if (studyStreak >= 7) return { icon: <Medal className="w-4 h-4" />, color: 'text-purple-500', label: 'Intermediate' };
    return { icon: <Star className="w-4 h-4" />, color: 'text-blue-500', label: 'Beginner' };
  };

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(type);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const achievementBadge = getAchievementBadge();

  // Color schemes for light mode
  const lightModeColors = {
    background: 'bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50',
    text: 'text-gray-800',
    textSecondary: 'text-gray-600',
    textMuted: 'text-gray-500',
    card: 'bg-white/90',
    cardBorder: 'border-gray-200/50',
    sidebar: 'bg-gradient-to-b from-white via-white/95 to-white/90',
    sidebarBorder: 'border-gray-200/50',
    header: 'bg-gradient-to-r from-white/80 via-blue-50/60 to-white/80',
    headerBorder: 'border-gray-200/50',
    button: 'bg-gray-100 hover:bg-gray-200 text-gray-700',
    buttonPrimary: 'bg-gradient-to-r from-blue-500 to-purple-500 text-white',
    buttonSecondary: 'bg-gray-800 text-white',
    progress: 'bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500',
    progressBg: 'bg-gray-200/80',
    accentBlue: 'text-blue-600',
    accentPurple: 'text-purple-600',
    accentGreen: 'text-green-600',
    accentYellow: 'text-yellow-600',
    accentRed: 'text-red-600',
    badge: 'bg-gray-100 text-gray-700 border-gray-200',
    input: 'bg-white/80 border-gray-300 text-gray-700 placeholder-gray-400',
    inputFocus: 'focus:border-blue-400 focus:ring-2 focus:ring-blue-400/30'
  };

  const darkModeColors = {
    background: 'bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950',
    text: 'text-gray-100',
    textSecondary: 'text-gray-300',
    textMuted: 'text-gray-400',
    card: 'bg-gradient-to-br from-gray-900/50 to-gray-900/30',
    cardBorder: 'border-gray-800/50',
    sidebar: 'bg-gradient-to-b from-gray-900 via-gray-900/95 to-gray-900/90',
    sidebarBorder: 'border-gray-800/50',
    header: 'bg-gradient-to-r from-gray-900/80 via-gray-900/60 to-gray-900/80',
    headerBorder: 'border-gray-800/50',
    button: 'bg-gray-800/50 hover:bg-gray-700/50 text-gray-300',
    buttonPrimary: 'bg-gradient-to-r from-blue-500 to-purple-500 text-white',
    buttonSecondary: 'bg-gray-800 text-white',
    progress: 'bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500',
    progressBg: 'bg-gray-800/50',
    accentBlue: 'text-blue-400',
    accentPurple: 'text-purple-400',
    accentGreen: 'text-green-400',
    accentYellow: 'text-yellow-400',
    accentRed: 'text-red-400',
    badge: 'bg-gray-800 text-gray-300 border-gray-700',
    input: 'bg-gray-800/50 border-gray-700 text-gray-300 placeholder-gray-500',
    inputFocus: 'focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30'
  };

  const colors = darkMode ? darkModeColors : lightModeColors;

  if (isLoading) {
    return (
      <div className={`min-h-screen ${colors.background} flex items-center justify-center`}>
        <div className="text-center">
          <div className={`p-8 ${
            darkMode 
              ? 'bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20' 
              : 'bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100'
          } rounded-3xl inline-block mb-8 animate-pulse`}>
            <Loader2 className="w-20 h-20 text-blue-400 animate-spin" />
          </div>
          <h2 className={`text-3xl font-bold mb-4 bg-gradient-to-r from-blue-400 
            via-purple-400 to-pink-400 bg-clip-text text-transparent ${colors.text}`}>
            Loading Your Grammar Journey
          </h2>
          <p className={colors.textMuted}>Preparing an amazing learning experience...</p>
          <div className="mt-6 w-64 h-2 bg-gray-800 rounded-full overflow-hidden mx-auto">
            <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500 
              animate-[loading_2s_ease-in-out_infinite]" />
          </div>
        </div>
      </div>
    );
  }

  if (grammarData.length === 0) {
    return (
      <div className={`min-h-screen ${colors.background} flex items-center justify-center`}>
        <div className="text-center max-w-md p-8">
          <div className={`p-8 ${
            darkMode 
              ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20' 
              : 'bg-gradient-to-r from-blue-100 to-purple-100'
          } rounded-3xl inline-block mb-8`}>
            <Book className="w-20 h-20 text-blue-400" />
          </div>
          <h2 className={`text-2xl font-bold mb-4 ${colors.text}`}>Ready to Learn?</h2>
          <p className={`mb-8 ${colors.textMuted}`}>Grammar data will load shortly. If it takes too long, 
            please refresh the page.</p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white 
                rounded-xl hover:shadow-xl transition-all hover:scale-105"
            >
              <RefreshCw className="w-5 h-5 inline mr-2" />
              Refresh
            </button>
            <button
              onClick={() => setShowTour(true)}
              className={`px-6 py-3 ${
                darkMode 
                  ? 'bg-gradient-to-r from-gray-800 to-gray-700' 
                  : 'bg-gradient-to-r from-gray-200 to-gray-300'
              } text-white rounded-xl hover:shadow-xl transition-all hover:scale-105`}
            >
              <HelpCircle className="w-5 h-5 inline mr-2" />
              Take Tour
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-all duration-500 overflow-hidden ${colors.background} ${colors.text}`}>
      
      {showConfetti && (
        <div className="fixed inset-0 z-50 pointer-events-none">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 animate-confetti"
              style={{
                left: `${Math.random() * 100}%`,
                backgroundColor: ['#3B82F6', '#8B5CF6', '#EC4899', '#10B981', '#F59E0B'][i % 5],
                animationDelay: `${Math.random() * 2}s`,
              }}
            />
          ))}
        </div>
      )}

      {showTour && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className={`max-w-md w-full mx-4 rounded-2xl p-8 shadow-2xl ${
            darkMode ? 'bg-gray-900' : 'bg-white'
          }`}>
            <div className="text-center mb-6">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r 
                from-blue-500 to-purple-500 flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <h3 className={`text-2xl font-bold mb-2 ${colors.text}`}>
                {tourSteps[activeTourStep].title}
              </h3>
              <p className={colors.textMuted}>{tourSteps[activeTourStep].description}</p>
            </div>
            <div className="flex justify-between items-center mt-8">
              <button
                onClick={() => setShowTour(false)}
                className={`px-4 py-2 rounded-lg hover:opacity-80 transition-opacity ${colors.textMuted}`}
              >
                Skip Tour
              </button>
              <div className="flex gap-2">
                {tourSteps.map((_, i) => (
                  <div
                    key={i}
                    className={`w-2 h-2 rounded-full ${i === activeTourStep 
                      ? 'bg-blue-500' 
                      : darkMode ? 'bg-gray-700' : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
              <button
                onClick={() => {
                  if (activeTourStep === tourSteps.length - 1) {
                    setShowTour(false);
                  } else {
                    setActiveTourStep(prev => prev + 1);
                  }
                }}
                className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white 
                  rounded-lg hover:shadow-lg transition-all"
              >
                {activeTourStep === tourSteps.length - 1 ? 'Get Started' : 'Next'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex h-screen">
        {/* Sidebar */}
        <div className={`
          fixed lg:static inset-y-0 left-0 z-40 w-80 lg:w-96 transform transition-all duration-300
          ${sidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full lg:translate-x-0'}
          lg:block
          ${colors.sidebar}
          border-r ${colors.sidebarBorder}
        `}>
          <div className="h-full flex flex-col p-4 lg:p-6">
            {/* Sidebar Header */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-xl ${
                    darkMode 
                      ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20' 
                      : 'bg-gradient-to-r from-blue-100 to-purple-100'
                  }`}>
                    <BookText className="w-5 h-5 text-blue-500" />
                  </div>
                  <h2 className="text-lg font-bold bg-gradient-to-r from-blue-400 to-purple-400 
                    bg-clip-text text-transparent">
                    Grammar Navigator
                  </h2>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                    className={`p-2 hover:bg-opacity-30 rounded-lg transition-colors ${
                      darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-200'
                    }`}
                    title={`Switch to ${viewMode === 'grid' ? 'list' : 'grid'} view`}
                  >
                    {viewMode === 'grid' ? <List className="w-4 h-4" /> : <Grid className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => setSidebarOpen(false)}
                    className="lg:hidden p-2 hover:bg-opacity-30 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
              
              {/* User Profile & Stats */}
              <div className={`mb-4 p-3 rounded-xl ${
                darkMode 
                  ? 'bg-gradient-to-r from-gray-800/50 to-gray-800/30' 
                  : 'bg-gradient-to-r from-gray-100 to-gray-50'
              }`}>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 
                    to-purple-500 flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-sm">Japanese Learner</div>
                    <div className="text-xs flex items-center gap-1">
                      {achievementBadge.icon}
                      <span className={achievementBadge.color}>{achievementBadge.label}</span>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-1">
                  <div className={`text-center p-2 rounded-lg ${
                    darkMode ? 'bg-gray-900/30' : 'bg-gray-200/50'
                  }`}>
                    <div className="text-xs opacity-75">Today</div>
                    <div className="text-base font-bold text-green-500">{todayProgress}/{studyGoal}</div>
                  </div>
                  <div className={`text-center p-2 rounded-lg ${
                    darkMode ? 'bg-gray-900/30' : 'bg-gray-200/50'
                  }`}>
                    <div className="text-xs opacity-75">Favs</div>
                    <div className="text-base font-bold text-yellow-500">{favorites.size}</div>
                  </div>
                  <div className={`text-center p-2 rounded-lg ${
                    darkMode ? 'bg-gray-900/30' : 'bg-gray-200/50'
                  }`}>
                    <div className="text-xs opacity-75">Time</div>
                    <div className="text-base font-bold text-blue-500">{formatTime(studyTime)}</div>
                  </div>
                </div>
              </div>
              
              {/* Search */}
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  placeholder="Search grammar..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl border transition-all text-sm
                    ${colors.input} ${colors.inputFocus}`}
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 
                      hover:bg-opacity-30 rounded"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>
              
              {/* Difficulty Filter */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xs font-semibold text-gray-500">Filter by Level</h3>
                  <button
                    onClick={() => setDifficultyFilter('all')}
                    className="text-xs hover:text-blue-500 transition-colors"
                  >
                    Clear
                  </button>
                </div>
                <div className="flex flex-wrap gap-1">
                  {['all', '1', '2', '3', '4', '5'].map((level) => (
                    <button
                      key={level}
                      onClick={() => setDifficultyFilter(level)}
                      className={`px-3 py-1.5 rounded-lg text-xs transition-all flex items-center gap-1
                        ${difficultyFilter === level
                          ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                          : darkMode 
                            ? 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-gray-300' 
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-800'
                        }`}
                    >
                      {level === 'all' ? 'All' : `N${level}`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Theme Toggle */}
              <div className="mb-4">
                <button
                  onClick={toggleDarkMode}
                  className={`w-full px-3 py-2 rounded-lg text-xs transition-all flex items-center justify-center gap-2
                    ${darkMode 
                      ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                >
                  {darkMode ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
                  Switch to {darkMode ? 'Light' : 'Dark'} Mode
                </button>
              </div>
            </div>
            
            {/* Grammar List */}
            <div className="flex-1 overflow-y-auto pr-1">
              <div className={`space-y-1 ${viewMode === 'grid' ? 'grid grid-cols-2 gap-1' : ''}`}>
                {filteredGrammar.map((grammar, index) => (
                  <button
                    key={grammar.title}
                    onClick={() => {
                      setCurrentIndex(index);
                      setActiveTab('explanation');
                      if (window.innerWidth < 1024) setSidebarOpen(false);
                      if (mainContentRef.current) {
                        mainContentRef.current.scrollTo({ top: 0, behavior: 'smooth' });
                      }
                    }}
                    className={`group text-left transition-all duration-300 ${viewMode === 'grid' 
                      ? 'p-2 rounded-lg' 
                      : 'p-3 rounded-xl'
                    } flex items-center gap-2
                      ${index === currentIndex 
                        ? darkMode 
                          ? 'bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 border border-blue-500/30 shadow-lg' 
                          : 'bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 border border-blue-200 shadow-md'
                        : darkMode 
                          ? 'bg-gray-800/30 hover:bg-gray-700/50 border border-transparent hover:border-gray-700/50' 
                          : 'bg-white/50 hover:bg-gray-100/80 border border-transparent hover:border-gray-200'
                      }`}
                  >
                    <div className={`relative flex-shrink-0 ${viewMode === 'grid' 
                      ? 'w-6 h-6' 
                      : 'w-8 h-8'
                    }`}>
                      <div className={`absolute inset-0 rounded-lg flex items-center justify-center text-xs
                        ${index === currentIndex 
                          ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white' 
                          : darkMode ? 'bg-gray-800 text-gray-400' : 'bg-gray-100 text-gray-600'
                        }`}>
                        {index + 1}
                      </div>
                    </div>
                    <div className={`flex-1 min-w-0 ${viewMode === 'grid' ? 'hidden' : 'block'}`}>
                      <div className="font-medium truncate text-xs mb-0.5 group-hover:text-blue-400 
                        transition-colors">
                        {grammar.title}
                      </div>
                      <div className="text-xs opacity-75 truncate">{grammar.short_explanation}</div>
                    </div>
                    {viewMode === 'grid' && (
                      <div className="flex-1">
                        <div className="text-xs font-medium truncate">{grammar.title}</div>
                      </div>
                    )}
                    <div className="flex items-center gap-1">
                      {favorites.has(grammar.title) && (
                        <Star className="w-3 h-3 fill-yellow-500 text-yellow-500 flex-shrink-0" />
                      )}
                      <div className={`px-1 py-0.5 rounded text-xs font-bold ${
                        darkMode ? 'bg-gray-800' : 'bg-gray-200'
                      } ${colors.text}`}>
                        {grammar.s_tag}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Mobile Header */}
          <header className={`px-4 py-3 lg:px-6 lg:py-4 ${colors.header} border-b ${colors.headerBorder} backdrop-blur-sm`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className={`p-2 rounded-xl hover:scale-105 transition-all ${
                    darkMode ? 'hover:bg-gray-800/30' : 'hover:bg-gray-200/50'
                  }`}
                >
                  <Menu className="w-5 h-5" />
                </button>
                
                <div>
                  <h1 className="text-base font-bold">JLPT N5 Grammar</h1>
                  <p className="text-xs opacity-75">
                    Point {currentIndex + 1} of {filteredGrammar.length}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {/* Theme Toggle Button */}
                <button
                  onClick={toggleDarkMode}
                  className={`p-2 rounded-xl hover:scale-105 transition-all ${
                    darkMode ? 'hover:bg-gray-800/30' : 'hover:bg-gray-200/50'
                  }`}
                  title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                >
                  {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </button>

                {/* Study Streak */}
                <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl ${
                  darkMode ? 'bg-gray-800/50' : 'bg-gray-100/80'
                }`}>
                  {achievementBadge.icon}
                  <div className="text-xs">
                    <span className="font-bold">{studyStreak}</span>
                    <span className="opacity-75"> days</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mt-3">
              <div className="flex justify-between text-xs mb-1">
                <div className="flex items-center gap-1">
                  <span>Progress:</span>
                  <span className="font-bold text-blue-500">{Math.round(progress)}%</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="opacity-75">Mastery:</span>
                  <span className="font-bold text-purple-500">{Math.round(masteryLevel)}%</span>
                </div>
              </div>
              <div className={`h-1.5 rounded-full overflow-hidden ${colors.progressBg}`}>
                <div 
                  className={`h-full rounded-full transition-all duration-700 ${colors.progress}`}
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </header>

          {/* Main Content Area */}
          {currentGrammar && (
            <div ref={mainContentRef} className="flex-1 overflow-y-auto scroll-smooth px-4 lg:px-6 py-4">
              <div className="max-w-6xl mx-auto">
                {/* Grammar Header */}
                <div className="mb-6">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
                    <div className="flex items-center gap-3">
                      <div className={`p-2.5 rounded-xl ${
                        darkMode 
                          ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20' 
                          : 'bg-gradient-to-r from-blue-100 to-purple-100'
                      }`}>
                        <Languages className="w-5 h-5 text-blue-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h1 className="text-xl lg:text-2xl font-bold bg-gradient-to-r from-blue-400 
                          to-purple-400 bg-clip-text text-transparent break-words">
                          {currentGrammar.title}
                        </h1>
                        <div className="flex items-center flex-wrap gap-2 mt-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-bold flex 
                            items-center gap-1 ${
                              darkMode 
                                ? 'bg-gray-800 text-gray-300' 
                                : 'bg-gray-200 text-gray-700'
                            }`}>
                            <Hash className="w-3 h-3" />
                            {currentGrammar.p_tag}
                          </span>
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => toggleFavorite(currentGrammar.title)}
                              className={`p-1.5 rounded-lg transition-all ${
                                favorites.has(currentGrammar.title) 
                                  ? 'bg-yellow-500/20' 
                                  : darkMode ? 'bg-gray-800/50' : 'bg-gray-100'
                              }`}
                            >
                              <Star className={`w-3.5 h-3.5 ${
                                favorites.has(currentGrammar.title) 
                                  ? 'fill-yellow-500 text-yellow-500' 
                                  : darkMode ? 'text-gray-500' : 'text-gray-400'
                              }`} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <button
                        onClick={handlePrev}
                        className={`px-3 py-2 rounded-lg flex items-center gap-2 transition-all ${
                          darkMode 
                            ? 'bg-gray-800/50 hover:bg-gray-700/50 text-gray-300' 
                            : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                        }`}
                      >
                        <ChevronLeft className="w-3.5 h-3.5" />
                        <span className="text-xs">Prev</span>
                      </button>
                      
                      <button
                        onClick={handleNext}
                        className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 
                          text-white hover:shadow-lg transition-all flex items-center gap-2"
                      >
                        <span className="text-xs">Next</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Tabs */}
                  <div className={`flex border-b ${
                    darkMode ? 'border-gray-800' : 'border-gray-200'
                  } overflow-x-auto`}>
                    {[
                      { key: 'explanation', label: 'Explanation', icon: BookOpen },
                      { key: 'examples', label: 'Examples', icon: Volume2 },
                      { key: 'practice', label: 'Practice', icon: Edit3 }
                    ].map(({ key, label, icon: Icon }) => (
                      <button
                        key={key}
                        onClick={() => {
                          setActiveTab(key as typeof activeTab);
                          if (key === 'examples') {
                            setTimeout(() => {
                              examplesRef.current?.scrollIntoView({ behavior: 'smooth' });
                            }, 100);
                          }
                        }}
                        className={`px-4 py-3 font-medium text-xs transition-all relative flex-shrink-0
                          flex items-center gap-2
                          ${activeTab === key 
                            ? 'text-blue-500' 
                            : darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-900'
                          }`}
                      >
                        <Icon className="w-3.5 h-3.5" />
                        {label}
                        {activeTab === key && (
                          <div className="absolute bottom-0 left-0 right-0 h-0.5 
                            bg-gradient-to-r from-blue-500 to-purple-500 rounded-full" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Tab Content */}
                <div className="space-y-6">
                  {/* Explanation Tab */}
                  {activeTab === 'explanation' && (
                    <div className="space-y-6 animate-fadeIn">
                      {/* Formation Pattern */}
                      <div className={`rounded-xl p-4 lg:p-6 ${colors.card} shadow-lg border ${colors.cardBorder}`}>
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg ${
                              darkMode 
                                ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20' 
                                : 'bg-gradient-to-r from-blue-100 to-purple-100'
                            }`}>
                              <Target className="w-5 h-5 text-blue-500" />
                            </div>
                            <div>
                              <h3 className="text-base font-bold">Formation Pattern</h3>
                              <p className="text-xs opacity-75">Master this pattern</p>
                            </div>
                          </div>
                        </div>
                        
                        <div className={`p-4 rounded-lg mb-4 ${
                          darkMode 
                            ? 'bg-gradient-to-r from-gray-900 to-gray-800' 
                            : 'bg-gradient-to-r from-gray-100 to-gray-50'
                        } border ${darkMode ? 'border-gray-800' : 'border-gray-200'}`}>
                          <code className="text-lg lg:text-xl font-mono font-bold bg-gradient-to-r 
                            from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent break-all">
                            {currentGrammar.formation}
                          </code>
                        </div>
                      </div>

                      {/* Explanations Grid */}
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <div className={`rounded-xl p-4 lg:p-6 ${colors.card} shadow-lg border ${colors.cardBorder}`}>
                          <div className="flex items-center gap-3 mb-4">
                            <div className={`p-2 rounded-lg ${
                              darkMode 
                                ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20' 
                                : 'bg-gradient-to-r from-blue-100 to-purple-100'
                            }`}>
                              <Brain className="w-5 h-5 text-blue-500" />
                            </div>
                            <div>
                              <h3 className="text-base font-bold">Quick Summary</h3>
                              <p className="text-xs opacity-75">Get the gist quickly</p>
                            </div>
                          </div>
                          <p className="text-sm lg:text-base leading-relaxed">{currentGrammar.short_explanation}</p>
                        </div>
                        
                        <div className={`rounded-xl p-4 lg:p-6 ${colors.card} shadow-lg border ${colors.cardBorder}`}>
                          <div className="flex items-center gap-3 mb-4">
                            <div className={`p-2 rounded-lg ${
                              darkMode 
                                ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20' 
                                : 'bg-gradient-to-r from-purple-100 to-pink-100'
                            }`}>
                              <BookOpen className="w-5 h-5 text-purple-500" />
                            </div>
                            <div>
                              <h3 className="text-base font-bold">Detailed Explanation</h3>
                              <p className="text-xs opacity-75">Deep dive into the grammar</p>
                            </div>
                          </div>
                          <p className="text-sm lg:text-base leading-relaxed">{currentGrammar.long_explanation}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Examples Tab */}
                  {activeTab === 'examples' && (
                    <div ref={examplesRef} className="space-y-6 animate-fadeIn">
                      <div className={`rounded-xl p-4 lg:p-6 ${colors.card} shadow-lg border ${colors.cardBorder}`}>
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6">
                          <div className="flex items-center gap-3 mb-4 lg:mb-0">
                            <div className={`p-2 rounded-lg ${
                              darkMode 
                                ? 'bg-gradient-to-r from-green-500/20 to-emerald-500/20' 
                                : 'bg-gradient-to-r from-green-100 to-emerald-100'
                            }`}>
                              <Volume2 className="w-5 h-5 text-green-500" />
                            </div>
                            <div>
                              <h3 className="text-base font-bold">Pronunciation Practice</h3>
                              <p className="text-xs opacity-75">Listen, repeat, and master</p>
                            </div>
                          </div>
                          
                          <div className="flex gap-2">
                            <button
                              onClick={() => setAutoPlay(!autoPlay)}
                              className={`px-3 py-2 rounded-lg flex items-center gap-2 text-xs
                                transition-all
                                ${autoPlay 
                                  ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white' 
                                  : darkMode 
                                    ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' 
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                            >
                              {autoPlay ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                              {autoPlay ? 'Auto' : 'Auto'}
                            </button>
                          </div>
                        </div>
                        
                        <div className="space-y-4">
                          {currentGrammar.examples.map((example, index) => (
                            <div 
                              key={index}
                              className={`p-4 rounded-xl transition-all duration-300 ${
                                darkMode 
                                  ? 'bg-gradient-to-br from-gray-900/50 to-gray-800/30 border border-gray-800/50' 
                                  : 'bg-gradient-to-br from-white/90 to-gray-50/90 border border-gray-200/50'
                              }`}
                            >
                              <div className="flex flex-col gap-4">
                                {/* Japanese Section */}
                                <div className="space-y-3">
                                  <div>
                                    <span className={`px-2 py-1 rounded-full text-xs font-bold 
                                      mb-2 inline-block ${
                                        darkMode 
                                          ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' 
                                          : 'bg-blue-100 text-blue-700 border border-blue-200'
                                      }`}>
                                      Japanese
                                    </span>
                                    <div className="flex items-start justify-between">
                                      <p className="text-lg lg:text-xl font-bold leading-relaxed break-all">
                                        {example.jp}
                                      </p>
                                    </div>
                                  </div>
                                  
                                  <div>
                                    <span className={`px-2 py-1 rounded-full text-xs font-bold 
                                      mb-2 inline-block ${
                                        darkMode 
                                          ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' 
                                          : 'bg-purple-100 text-purple-700 border border-purple-200'
                                      }`}>
                                      Romaji
                                    </span>
                                    <p className={`text-base ${
                                      darkMode ? 'text-gray-400' : 'text-gray-600'
                                    } break-all`}>
                                      {example.romaji}
                                    </p>
                                  </div>
                                </div>
                                
                                {/* Translation & Audio Section */}
                                <div className="space-y-4">
                                  <div className={`p-3 rounded-lg ${
                                    darkMode 
                                      ? 'bg-gradient-to-r from-gray-900 to-gray-800' 
                                      : 'bg-gradient-to-r from-gray-100 to-gray-50'
                                  } border ${darkMode ? 'border-gray-800' : 'border-gray-200'}`}>
                                    <div className="flex items-center gap-2 mb-2">
                                      <Bookmark className="w-4 h-4 text-blue-500" />
                                      <div className="text-xs font-semibold">English Translation</div>
                                    </div>
                                    <p className="text-sm font-medium leading-relaxed">{example.en}</p>
                                  </div>
                                  
                                  <div className="space-y-3">
                                    <button
                                      onClick={() => isPlaying === `${currentIndex}-${index}` 
                                        ? stopAudio(index) 
                                        : playAudio(example.grammar_audio, index)
                                      }
                                      disabled={audioLoading === index}
                                      className={`w-full py-3 px-4 rounded-lg flex items-center 
                                        justify-center gap-3 transition-all duration-300
                                        ${isPlaying === `${currentIndex}-${index}`
                                          ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white'
                                          : 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
                                        } disabled:opacity-50`}
                                    >
                                      {audioLoading === index ? (
                                        <>
                                          <Loader2 className="w-4 h-4 animate-spin" />
                                          <span className="text-sm font-semibold">Loading...</span>
                                        </>
                                      ) : isPlaying === `${currentIndex}-${index}` ? (
                                        <>
                                          <Pause className="w-4 h-4" />
                                          <span className="text-sm font-semibold">Stop Audio</span>
                                        </>
                                      ) : (
                                        <>
                                          <Headphones className="w-4 h-4" />
                                          <span className="text-sm font-semibold">Listen & Repeat</span>
                                        </>
                                      )}
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Practice Tab */}
                  {activeTab === 'practice' && (
                    <div className="space-y-6 animate-fadeIn">
                      <div className={`rounded-xl p-4 lg:p-6 ${colors.card} shadow-lg border ${colors.cardBorder}`}>
                        <div className="flex items-center gap-3 mb-6">
                          <div className={`p-2 rounded-lg ${
                            darkMode 
                              ? 'bg-gradient-to-r from-orange-500/20 to-red-500/20' 
                              : 'bg-gradient-to-r from-orange-100 to-red-100'
                          }`}>
                            <Target className="w-5 h-5 text-orange-500" />
                          </div>
                          <div>
                            <h3 className="text-base font-bold">Practice Challenge</h3>
                            <p className="text-xs opacity-75">Test your understanding</p>
                          </div>
                        </div>
                        
                        <div className="space-y-6">
                          {/* Task Card */}
                          <div className={`p-4 rounded-xl ${
                            darkMode 
                              ? 'bg-gradient-to-r from-gray-900 to-gray-800' 
                              : 'bg-gradient-to-r from-gray-100 to-gray-50'
                          } border ${darkMode ? 'border-gray-800' : 'border-gray-200'}`}>
                            <h4 className="text-base font-bold mb-4 flex items-center gap-2">
                              <Edit3 className="w-4 h-4 text-blue-500" />
                              Your Task
                            </h4>
                            <div className="space-y-4">
                              <p className="text-sm">Create 3 original sentences using:</p>
                              <div className={`p-3 rounded-lg ${
                                darkMode ? 'bg-gray-900' : 'bg-gray-200/80'
                              } mb-4`}>
                                <code className="text-base font-mono font-bold bg-gradient-to-r 
                                  from-orange-600 to-red-600 bg-clip-text text-transparent break-all">
                                  {currentGrammar.formation}
                                </code>
                              </div>
                              
                              <div className="flex gap-2">
                                <button
                                  onClick={() => setShowAnswer(!showAnswer)}
                                  className="px-4 py-2 rounded-lg bg-gradient-to-r from-orange-500 to-red-500 
                                    text-white text-sm flex items-center gap-2"
                                >
                                  {showAnswer ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                  {showAnswer ? 'Hide Tips' : 'Show Tips'}
                                </button>
                              </div>
                              
                              {showAnswer && (
                                <div className="mt-4 p-4 rounded-xl bg-gradient-to-r 
                                  from-blue-500/10 via-purple-500/10 to-pink-500/10 
                                  border border-blue-500/20 animate-fadeIn">
                                  <h5 className="text-sm font-bold mb-3 flex items-center gap-2">
                                    <HelpCircle className="w-4 h-4 text-blue-500" />
                                    Pro Tips
                                  </h5>
                                  <div className="grid grid-cols-1 gap-2">
                                    <div className={`p-3 rounded-lg ${
                                      darkMode ? 'bg-gray-800/50' : 'bg-white/80'
                                    }`}>
                                      <div className="flex items-center gap-2 mb-1">
                                        <CheckCircle className="w-4 h-4 text-green-500" />
                                        <span className="text-xs font-semibold">Use Known Vocabulary</span>
                                      </div>
                                      <p className="text-xs opacity-75">Start with words you know</p>
                                    </div>
                                    <div className={`p-3 rounded-lg ${
                                      darkMode ? 'bg-gray-800/50' : 'bg-white/80'
                                    }`}>
                                      <div className="flex items-center gap-2 mb-1">
                                        <CheckCircle className="w-4 h-4 text-green-500" />
                                        <span className="text-xs font-semibold">Try Both Forms</span>
                                      </div>
                                      <p className="text-xs opacity-75">Practice positive & negative</p>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                          
                          {/* Sentence Builder */}
                          <div>
                            <h4 className="text-base font-bold mb-4 flex items-center gap-2">
                              <Book className="w-4 h-4 text-purple-500" />
                              Your Sentences
                            </h4>
                            <div className="grid grid-cols-1 gap-3">
                              {[1, 2, 3].map((num) => (
                                <div 
                                  key={num}
                                  className={`p-4 rounded-xl border-2 border-dashed 
                                    transition-all duration-300 ${
                                      darkMode 
                                        ? 'border-gray-700 bg-gray-900/30' 
                                        : 'border-gray-300 bg-white/50'
                                    }`}
                                >
                                  <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-2">
                                      <div className="w-6 h-6 rounded-full bg-gradient-to-r 
                                        from-blue-500 to-purple-500 flex items-center justify-center">
                                        <span className="text-xs font-bold text-white">{num}</span>
                                      </div>
                                      <div className="text-sm font-semibold">Sentence {num}</div>
                                    </div>
                                  </div>
                                  <div className={`h-20 rounded-lg ${
                                    darkMode ? 'bg-gray-800/50' : 'bg-gray-100/80'
                                  } flex items-center justify-center`}>
                                    <span className="text-xs opacity-50">Tap to write</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Quick Navigation Footer */}
                <div className="mt-8">
                  <div className={`p-4 rounded-xl ${colors.card} shadow-lg border ${colors.cardBorder}`}>
                    <div className="flex items-center justify-between gap-4">
                      <button
                        onClick={handlePrev}
                        className="flex items-center gap-3 group transition-all"
                      >
                        <div className={`p-2 rounded-lg ${
                          darkMode ? 'bg-gray-800/50' : 'bg-gray-100'
                        }`}>
                          <ChevronLeft className="w-4 h-4" />
                        </div>
                        <div className="text-left">
                          <div className="text-xs opacity-75 mb-0.5">Previous</div>
                          <div className="text-sm font-semibold truncate max-w-[80px]">
                            {currentIndex > 0 ? filteredGrammar[currentIndex - 1]?.title : 'Start'}
                          </div>
                        </div>
                      </button>
                      
                      <button
                        onClick={handleNext}
                        className="flex items-center gap-3 group transition-all"
                      >
                        <div className="text-right">
                          <div className="text-xs opacity-75 mb-0.5">Next</div>
                          <div className="text-sm font-semibold truncate max-w-[80px]">
                            {currentIndex < filteredGrammar.length - 1 
                              ? filteredGrammar[currentIndex + 1]?.title 
                              : 'Complete!'}
                          </div>
                        </div>
                        <div className={`p-2 rounded-lg ${
                          darkMode 
                            ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20' 
                            : 'bg-gradient-to-r from-blue-100 to-purple-100'
                        }`}>
                          <ChevronRight className="w-4 h-4" />
                        </div>
                      </button>
                    </div>
                    
                    {/* Progress Summary */}
                    <div className="mt-4 pt-4 border-t border-gray-800/30">
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-2">
                          <div className={`p-2 rounded-lg ${
                            darkMode ? 'bg-gray-800/50' : 'bg-gray-100'
                          }`}>
                            <TrendingUp className="w-4 h-4 text-green-500" />
                          </div>
                          <div>
                            <div className="text-xs opacity-75">Learning Speed</div>
                            <div className="text-sm font-bold">
                              {Math.round(1000 / (studyTime || 1))} pts/hr
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={shuffleGrammar}
                          className={`px-3 py-2 rounded-lg text-xs flex items-center gap-2 ${
                            darkMode 
                              ? 'bg-gray-800 text-white' 
                              : 'bg-gray-200 text-gray-700'
                          }`}
                        >
                          <Shuffle className="w-3 h-3" />
                          Random
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Footer */}
          <footer className={`px-4 py-3 ${colors.header} border-t ${colors.headerBorder} backdrop-blur-sm`}>
            <div className="flex justify-between items-center gap-4">
              <div className="text-xs opacity-75">
                JLPT N5 Grammar Master
              </div>
              <div className="flex items-center gap-3">
                <button className={`text-xs opacity-75 hover:opacity-100 transition-opacity ${colors.text}`}>
                  <DownloadCloud className="w-3.5 h-3.5" />
                </button>
                <button className={`text-xs opacity-75 hover:opacity-100 transition-opacity ${colors.text}`}>
                  <Share2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </footer>
        </div>
      </div>

      {/* Floating Action Button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="fixed bottom-4 right-4 lg:hidden z-40 p-3 rounded-full 
          bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-xl 
          hover:shadow-2xl transition-all"
      >
        {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* CSS for animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes loading {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
        @keyframes confetti {
          0% { transform: translateY(-100px) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        .animate-confetti {
          animation: confetti 2s linear forwards;
        }
        
        /* Custom scrollbar */
        .scroll-smooth::-webkit-scrollbar {
          width: 6px;
        }
        
        .scroll-smooth::-webkit-scrollbar-track {
          background: ${darkMode ? '#1f2937' : '#f3f4f6'};
          border-radius: 10px;
        }
        
        .scroll-smooth::-webkit-scrollbar-thumb {
          background: ${darkMode ? '#4f46e5' : '#6366f1'};
          border-radius: 10px;
        }
        
        .scroll-smooth::-webkit-scrollbar-thumb:hover {
          background: ${darkMode ? '#6366f1' : '#4f46e5'};
        }
      `}</style>
    </div>
  );
};

export default GrammarN5Page;