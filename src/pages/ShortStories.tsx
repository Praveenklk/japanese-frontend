// pages/ShortStories.tsx
import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Volume2,
  Play,
  Pause,
  ChevronRight,
  ChevronLeft,
  Bookmark,
  Star,
  Eye,
  BookmarkCheck,
  Sparkles,
  Target,
  Clock,
  TrendingUp,
  Headphones,
  FileText,
  Award,
  Lightbulb,
  Loader2,
  AlertCircle,
  Lock,
  CheckCircle,
  XCircle,
  CheckCircle2,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  Heart,
  Share2,
  Download,
  Filter,
  Search,
  Users,
  BarChart3,
  Zap,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  Settings,
  Grid3x3,
  List,
  X,
  Plus,
  Music,
  VolumeX,
  Maximize2,
  Minimize2,
  Trophy,
  Battery,
  Calendar,
  Globe,
  MessageSquare,
  ThumbsUp,
  Coffee,
  Moon,
  Sun,
  Compass,
  Map,
  Menu,
  Home,
  User,
  Bell,
  LogOut,
  Shield,
  HelpCircle,
  Crown,
  TrendingDown,
  Feather,
  Book,
  Hash,
  Tag,
  Filter as FilterIcon,
  MoreVertical,
  ExternalLink,
  Copy,
  Edit,
  Trash2,
  Save,
  Upload,
  Image as ImageIcon,
  Video,
  Mic,
  MicOff,
  Airplay,
  Cast,
  Wifi,
  WifiOff,
  BatteryCharging,
  Volume1,
  Volume
} from 'lucide-react';
import { 
  getStories, 
  getStoryById, 
  updateStory, 
  type Story as ApiStory,
} from '../service/story.service';
import {
  type Difficulty as ApiDifficulty,
  type JLPT,
  type StoryStatus as ApiStoryStatus
} from "../pages/types/story"

// Local types that extend API types for UI
type Difficulty = 'beginner' | 'intermediate' | 'advanced';
type StoryStatus = 'locked' | 'available' | 'completed';
type ViewMode = 'grid' | 'list' | 'detailed';

interface Story extends Omit<ApiStory, 'difficulty' | 'status'> {
  difficulty: Difficulty;
  status: StoryStatus;
  comprehensionQuiz?: QuizQuestion[];
  imageUrl?: string;
  author?: string;
  rating?: number;
  likes?: number;
  category?: string;
  culturalNotes?: string[];
}

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

interface ReadingStats {
  storiesRead: number;
  wordsLearned: number;
  readingTime: number;
  streak: number;
  currentLevel: string;
  xp: number;
}

interface QuizResult {
  questionId: string;
  isCorrect: boolean;
  userAnswer: string;
  correctAnswer: string;
  explanation: string;
}

// Helper functions
const convertDifficulty = (apiDifficulty: ApiDifficulty): Difficulty => {
  switch (apiDifficulty) {
    case 'BEGINNER': return 'beginner';
    case 'INTERMEDIATE': return 'intermediate';
    case 'ADVANCED': return 'advanced';
    default: return 'beginner';
  }
};

const convertStatus = (apiStatus: ApiStoryStatus): StoryStatus => {
  switch (apiStatus) {
    case 'LOCKED': return 'locked';
    case 'AVAILABLE': return 'available';
    case 'COMPLETED': return 'completed';
    case 'ARCHIVED': return 'locked';
    default: return 'available';
  }
};

const getDifficultyColor = (difficulty: Difficulty): string => {
  switch (difficulty) {
    case 'beginner': return 'bg-gradient-to-r from-emerald-400 to-green-500';
    case 'intermediate': return 'bg-gradient-to-r from-amber-400 to-orange-500';
    case 'advanced': return 'bg-gradient-to-r from-rose-500 to-pink-600';
    default: return 'bg-gradient-to-r from-gray-400 to-slate-500';
  }
};

const getDifficultyBg = (difficulty: Difficulty): string => {
  switch (difficulty) {
    case 'beginner': return 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-300 dark:border-emerald-800';
    case 'intermediate': return 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-300 dark:border-amber-800';
    case 'advanced': return 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-900/20 dark:text-rose-300 dark:border-rose-800';
    default: return 'bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700';
  }
};

const getLevelColor = (level: string): string => {
  switch (level) {
    case 'N5': return 'bg-gradient-to-r from-sky-400 to-blue-500';
    case 'N4': return 'bg-gradient-to-r from-indigo-400 to-purple-500';
    case 'N3': return 'bg-gradient-to-r from-purple-400 to-pink-500';
    case 'N2': return 'bg-gradient-to-r from-orange-400 to-red-500';
    case 'N1': return 'bg-gradient-to-r from-red-500 to-rose-600';
    default: return 'bg-gradient-to-r from-gray-400 to-slate-500';
  }
};

// Mock image URLs for stories
const storyImages = [
  'https://images.unsplash.com/photo-1518709268805-4e9042af2176?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1528164344705-47542687000d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1516542076529-1ea3854896f2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1528164344705-47542687000d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
];

const ShortStories = () => {
  const [stories, setStories] = useState<Story[]>([]);
  const [selectedStory, setSelectedStory] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(0);
  const [showTranslation, setShowTranslation] = useState(false);
  const [showVocabulary, setShowVocabulary] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [quizMode, setQuizMode] = useState(false);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [quizScore, setQuizScore] = useState<number | null>(null);
  const [quizResults, setQuizResults] = useState<QuizResult[]>([]);
  const [showQuizDetails, setShowQuizDetails] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [darkMode, setDarkMode] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [speechRate, setSpeechRate] = useState(1.0);
  const [showCulturalNotes, setShowCulturalNotes] = useState(false);
  const [autoPlayAudio, setAutoPlayAudio] = useState(false);
  const [userLiked, setUserLiked] = useState<Record<string, boolean>>({});
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [stats, setStats] = useState<ReadingStats>({
    storiesRead: 15,
    wordsLearned: 2450,
    readingTime: 325,
    streak: 7,
    currentLevel: "Intermediate",
    xp: 2450
  });

  const selectedStoryData = stories.find(story => story.id === selectedStory);
  const currentSentence = selectedStoryData?.content?.japanese?.[currentPage];
  const currentTranslation = selectedStoryData?.content?.english?.[currentPage];

  // Load stories from API on mount
  useEffect(() => {
    fetchStories();
    loadStatsFromStorage();
    loadUserPreferences();
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const fetchStories = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await getStories();
      
      if (response.data && response.data.length > 0) {
        const storiesWithEnhancedData = response.data.map((story, index) => {
          const uiStory: Story = {
            ...story,
            difficulty: convertDifficulty(story.difficulty),
            status: convertStatus(story.status),
            comprehensionQuiz: story.comprehensionQuiz || 
              (story.content?.comprehensionQuiz || []),
            imageUrl: storyImages[index % storyImages.length],
            author: ["Yuki Tanaka", "Haruto Sato", "Sakura Yamamoto", "Kenji Ito", "Aiko Nakamura"][index % 5],
            rating: 4.5 + (Math.random() * 0.5),
            likes: Math.floor(Math.random() * 500) + 100,
            category: ["Japanese Culture", "Daily Life", "History", "Fantasy", "Mystery"][index % 5],
            culturalNotes: [
              "This story reflects traditional Japanese values",
              "Common expressions used in daily conversation",
              "Cultural references explained in vocabulary"
            ]
          };
          
          return uiStory;
        });
        
        setStories(storiesWithEnhancedData);
        
        // Select first available story by default
        const firstAvailable = storiesWithEnhancedData.find(s => s.status === 'available');
        if (firstAvailable && !selectedStory) {
          setSelectedStory(firstAvailable.id);
        }
      }
    } catch (err) {
      setError('Failed to load stories. Please try again later.');
      console.error('Error fetching stories:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadStatsFromStorage = () => {
    try {
      const savedStats = localStorage.getItem('readingStats');
      if (savedStats) {
        setStats(JSON.parse(savedStats));
      }
    } catch (err) {
      console.error('Error loading stats:', err);
    }
  };

  const loadUserPreferences = () => {
    try {
      const prefs = localStorage.getItem('storyPreferences');
      if (prefs) {
        const { darkMode: savedDarkMode } = JSON.parse(prefs);
        setDarkMode(savedDarkMode);
      }
    } catch (err) {
      console.error('Error loading preferences:', err);
    }
  };

  const saveUserPreferences = () => {
    try {
      localStorage.setItem('storyPreferences', JSON.stringify({ darkMode }));
    } catch (err) {
      console.error('Error saving preferences:', err);
    }
  };

  const handleNextPage = () => {
    if (selectedStoryData && selectedStoryData.content?.japanese && 
        currentPage < selectedStoryData.content.japanese.length - 1) {
      setCurrentPage(prev => prev + 1);
      if (autoPlayAudio) {
        setTimeout(playAudio, 500);
      }
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(prev => prev - 1);
      if (autoPlayAudio) {
        setTimeout(playAudio, 500);
      }
    }
  };

  const toggleBookmark = async (storyId: string) => {
    const story = stories.find(s => s.id === storyId);
    if (!story) return;

    const newBookmarkStatus = !story.isBookmarked;
    
    // Optimistic update
    setStories(prev => prev.map(story => 
      story.id === storyId 
        ? { ...story, isBookmarked: newBookmarkStatus }
        : story
    ));

    try {
      await updateStory(storyId, { isBookmarked: newBookmarkStatus });
    } catch (err) {
      // Revert on error
      setStories(prev => prev.map(story => 
        story.id === storyId 
          ? { ...story, isBookmarked: !newBookmarkStatus }
          : story
      ));
      setError('Failed to update bookmark.');
    }
  };

  const toggleLike = (storyId: string) => {
    setUserLiked(prev => ({
      ...prev,
      [storyId]: !prev[storyId]
    }));
    
    setStories(prev => prev.map(story => 
      story.id === storyId 
        ? { ...story, likes: (story.likes || 0) + (userLiked[storyId] ? -1 : 1) }
        : story
    ));
  };

  const playAudio = () => {
    if (currentSentence) {
      const utterance = new SpeechSynthesisUtterance(currentSentence);
      utterance.lang = 'ja-JP';
      utterance.rate = speechRate;
      utterance.pitch = 1;
      speechSynthesis.speak(utterance);
      setIsPlaying(true);
      
      utterance.onend = () => setIsPlaying(false);
      utterance.onerror = () => setIsPlaying(false);
    }
  };

  const startReading = async (storyId: string) => {
    try {
      let story = stories.find(s => s.id === storyId);
      if (!story) {
        const response = await getStoryById(storyId);
        if (response.data) {
          story = {
            ...response.data,
            difficulty: convertDifficulty(response.data.difficulty),
            status: convertStatus(response.data.status),
            comprehensionQuiz: response.data.comprehensionQuiz || 
              (response.data.content?.comprehensionQuiz || []),
            imageUrl: storyImages[Math.floor(Math.random() * storyImages.length)],
            author: "Unknown Author",
            rating: 4.5,
            likes: 150
          };
          setStories(prev => [...prev, story!]);
        }
      }

      setSelectedStory(storyId);
      setCurrentPage(0);
      setShowTranslation(false);
      setShowVocabulary(false);
      setQuizMode(false);
      setQuizScore(null);
      setUserAnswers({});
      setQuizResults([]);
      setShowQuizDetails({});
      setShowCulturalNotes(false);
      
      // Update read count locally
      setStories(prev => prev.map(story => 
        story.id === storyId 
          ? { ...story, readCount: story.readCount + 1 }
          : story
      ));
      
      // Update stats
      const newStats = {
        ...stats,
        storiesRead: stats.storiesRead + 1,
        readingTime: stats.readingTime + 5,
        wordsLearned: stats.wordsLearned + (story?.wordCount || 0),
        xp: stats.xp + 100
      };
      setStats(newStats);
      
      try {
        localStorage.setItem('readingStats', JSON.stringify(newStats));
      } catch (err) {
        console.error('Failed to save stats:', err);
      }

      await updateStory(storyId, { readCount: (story?.readCount || 0) + 1 });
      
    } catch (err) {
      setError('Failed to load story details.');
      console.error('Error starting reading:', err);
    }
  };

  const submitQuiz = () => {
    if (!selectedStoryData?.comprehensionQuiz) return;
    
    let score = 0;
    const results: QuizResult[] = [];
    
    selectedStoryData.comprehensionQuiz.forEach(question => {
      const isCorrect = userAnswers[question.id] === question.correctAnswer;
      if (isCorrect) {
        score++;
      }
      
      results.push({
        questionId: question.id,
        isCorrect,
        userAnswer: userAnswers[question.id] || 'Not answered',
        correctAnswer: question.correctAnswer,
        explanation: question.explanation
      });
    });
    
    const percentage = Math.round((score / selectedStoryData.comprehensionQuiz.length) * 100);
    setQuizScore(percentage);
    setQuizResults(results);
    
    // Update XP based on score
    if (percentage >= 80) {
      setStats(prev => ({ ...prev, xp: prev.xp + 200 }));
    } else if (percentage >= 60) {
      setStats(prev => ({ ...prev, xp: prev.xp + 100 }));
    } else {
      setStats(prev => ({ ...prev, xp: prev.xp + 50 }));
    }
  };

  const resetQuiz = () => {
    setQuizMode(false);
    setQuizScore(null);
    setUserAnswers({});
    setQuizResults([]);
    setShowQuizDetails({});
  };

  const handleRetry = () => {
    setError(null);
    fetchStories();
  };

  const toggleQuizDetail = (questionId: string) => {
    setShowQuizDetails(prev => ({
      ...prev,
      [questionId]: !prev[questionId]
    }));
  };

  const filteredStories = stories.filter(story => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      if (!story.title.toLowerCase().includes(query) &&
          !story.description.toLowerCase().includes(query) &&
          !story.tags?.some(tag => tag.toLowerCase().includes(query))) {
        return false;
      }
    }
    
    if (selectedLevel !== 'all' && story.level !== selectedLevel) {
      return false;
    }
    
    if (selectedDifficulty !== 'all') {
      const difficultyMap = {
        'beginner': 'beginner',
        'intermediate': 'intermediate',
        'advanced': 'advanced'
      };
      if (story.difficulty !== difficultyMap[selectedDifficulty as keyof typeof difficultyMap]) {
        return false;
      }
    }
    
    return true;
  });

  const shareStory = () => {
    if (navigator.share && selectedStoryData) {
      navigator.share({
        title: selectedStoryData.title,
        text: `Check out this Japanese story: ${selectedStoryData.description}`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  if (loading && stories.length === 0) {
    return (
      <div className={`min-h-screen flex items-center justify-center p-4 transition-colors duration-300 ${
        darkMode ? 'bg-gradient-to-br from-gray-900 to-gray-950' : 'bg-gradient-to-br from-gray-50 to-blue-50'
      }`}>
        <div className="text-center space-y-4">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-gray-200 dark:border-gray-700 rounded-full"></div>
            <div className="w-20 h-20 border-4 border-blue-500 border-t-transparent rounded-full absolute top-0 animate-spin"></div>
          </div>
          <div className="space-y-2">
            <p className="text-lg font-medium text-gray-700 dark:text-gray-300">Loading Japanese Stories</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Preparing your reading adventure</p>
          </div>
        </div>
      </div>
    );
  }

  if (error && stories.length === 0) {
    return (
      <div className={`min-h-screen flex items-center justify-center p-4 transition-colors duration-300 ${
        darkMode ? 'bg-gradient-to-br from-gray-900 to-gray-950' : 'bg-gradient-to-br from-gray-50 to-blue-50'
      }`}>
        <div className="max-w-md w-full">
          <div className="p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="w-16 h-16 bg-gradient-to-r from-red-100 to-rose-100 dark:from-red-900/30 dark:to-rose-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="h-8 w-8 text-red-600 dark:text-red-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-2">Unable to Load Stories</h2>
            <p className="text-gray-600 dark:text-gray-400 text-center mb-6">{error}</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={handleRetry}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl hover:shadow-lg transition-all duration-300 font-medium hover:scale-[1.02] active:scale-[0.98]"
              >
                Try Again
              </button>
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-300"
              >
                Reload Page
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      darkMode 
        ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-100' 
        : 'bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 text-gray-900'
    }`}>
      {/* Header */}
      <header className={`sticky top-0 z-50 backdrop-blur-md border-b transition-all duration-300 ${
        darkMode 
          ? 'bg-gray-900/95 border-gray-800/50 shadow-xl' 
          : 'bg-white/95 border-gray-200/50 shadow-lg'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left: Branding & Mobile Menu */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <Menu className="h-5 w-5" />
              </button>
              
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg">
                    <BookOpen className="h-6 w-6 text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center text-xs font-bold text-white shadow">
                    {stats.storiesRead}
                  </div>
                </div>
                <div className="hidden sm:block">
                  <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    Japanese Stories
                  </h1>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Immerse in authentic reading
                  </p>
                </div>
              </div>
            </div>

            {/* Center: Search */}
            <div className="hidden md:block flex-1 max-w-lg mx-4">
              <div className="relative">
                <Search className={`absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 ${
                  darkMode ? 'text-gray-500' : 'text-gray-400'
                }`} />
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search stories, topics, or authors..."
                  className={`w-full pl-12 pr-4 py-2.5 rounded-xl text-sm transition-all ${
                    darkMode
                      ? 'bg-gray-800/50 border border-gray-700/50 text-white placeholder-gray-500 focus:border-indigo-500'
                      : 'bg-white/80 border border-gray-300/80 text-gray-900 placeholder-gray-400 focus:border-indigo-400'
                  } focus:outline-none focus:ring-2 focus:ring-indigo-500/20`}
                />
              </div>
            </div>

            {/* Right: User Controls */}
            <div className="flex items-center gap-2">
              {/* Mobile Search */}
              <button className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
                <Search className="h-5 w-5" />
              </button>
              
              {/* Dark Mode */}
              <button
                onClick={() => {
                  setDarkMode(!darkMode);
                  saveUserPreferences();
                }}
                className={`p-2 rounded-lg transition-all duration-300 hover:scale-105 ${
                  darkMode
                    ? 'bg-gray-800 text-yellow-300 hover:bg-gray-700'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                title="Toggle dark mode"
              >
                {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>
              
              {/* Notifications */}
              <button className={`relative p-2 rounded-lg ${
                darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
              }`}>
                <Bell className="h-5 w-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              
              {/* User Profile */}
              <div className="relative">
                <button className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-medium text-sm">
                    YT
                  </div>
                  <span className="hidden lg:inline text-sm font-medium">Yuki</span>
                  <ChevronDown className="hidden lg:block h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Search */}
          <div className="md:hidden pb-4">
            <div className="relative">
              <Search className={`absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 ${
                darkMode ? 'text-gray-500' : 'text-gray-400'
              }`} />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search stories..."
                className={`w-full pl-12 pr-4 py-2.5 rounded-xl text-sm ${
                  darkMode
                    ? 'bg-gray-800 border border-gray-700 text-white placeholder-gray-500'
                    : 'bg-white border border-gray-300 text-gray-900 placeholder-gray-400'
                } focus:outline-none focus:ring-2 focus:ring-indigo-500`}
              />
            </div>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 md:grid-cols-6 gap-2 pb-4">
            <StatCard
              label="Stories Read"
              value={stats.storiesRead}
              icon={<BookOpen className="h-4 w-4" />}
              color="text-purple-600"
              iconColor="text-purple-500"
              darkMode={darkMode}
            />
            <StatCard
              label="Words Learned"
              value={stats.wordsLearned.toLocaleString()}
              icon={<TrendingUp className="h-4 w-4" />}
              color="text-emerald-600"
              iconColor="text-emerald-500"
              darkMode={darkMode}
            />
            <StatCard
              label="Reading Time"
              value={`${stats.readingTime}m`}
              icon={<Clock className="h-4 w-4" />}
              color="text-blue-600"
              iconColor="text-blue-500"
              darkMode={darkMode}
            />
            <StatCard
              label="Streak"
              value={`${stats.streak} days`}
              icon={<Zap className="h-4 w-4" />}
              color="text-amber-600"
              iconColor="text-amber-500"
              darkMode={darkMode}
            />
            <StatCard
              label="Level"
              value={stats.currentLevel}
              icon={<Trophy className="h-4 w-4" />}
              color="text-indigo-600"
              iconColor="text-indigo-500"
              darkMode={darkMode}
            />
            <StatCard
              label="XP"
              value={stats.xp}
              icon={<Award className="h-4 w-4" />}
              color="text-rose-600"
              iconColor="text-rose-500"
              darkMode={darkMode}
            />
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div className="fixed inset-0 bg-black/50" onClick={() => setMobileMenuOpen(false)} />
          <div className={`fixed left-0 top-0 h-full w-64 max-w-sm shadow-2xl transform transition-transform duration-300 ${
            darkMode ? 'bg-gray-900' : 'bg-white'
          }`}>
            <div className="p-6">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center">
                    <BookOpen className="h-6 w-6 text-white" />
                  </div>
                  <span className="font-bold">Menu</span>
                </div>
                <button onClick={() => setMobileMenuOpen(false)}>
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              <nav className="space-y-2">
                <MenuItem icon={<Home className="h-5 w-5" />} label="Dashboard" active />
                <MenuItem icon={<Book className="h-5 w-5" />} label="Stories Library" />
                <MenuItem icon={<Compass className="h-5 w-5" />} label="Discover" />
                <MenuItem icon={<TrendingUp className="h-5 w-5" />} label="Progress" />
                <MenuItem icon={<User className="h-5 w-5" />} label="Profile" />
                <MenuItem icon={<Settings className="h-5 w-5" />} label="Settings" />
                <MenuItem icon={<HelpCircle className="h-5 w-5" />} label="Help & Support" />
              </nav>
              
              <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
                <button className="w-full flex items-center justify-between p-3 rounded-xl bg-gray-100 dark:bg-gray-800">
                  <span className="font-medium">Dark Mode</span>
                  <div className={`w-12 h-6 rounded-full relative transition-colors ${
                    darkMode ? 'bg-indigo-600' : 'bg-gray-300'
                  }`}>
                    <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform ${
                      darkMode ? 'transform translate-x-7' : 'transform translate-x-0.5'
                    }`} />
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Sidebar - Stories & Filters */}
          <div className="lg:w-1/3 space-y-6">
            {/* Stories Library Card */}
            <div className={`rounded-2xl border transition-all duration-300 ${
              darkMode 
                ? 'bg-gray-800/50 border-gray-700/50 backdrop-blur-sm' 
                : 'bg-white border-gray-200/80 backdrop-blur-sm'
            } shadow-lg`}>
              {/* Header */}
              <div className="p-6 border-b border-gray-200 dark:border-gray-700/50">
                <div className="flex items-center justify-between">
                  <h3 className={`text-lg font-bold ${
                    darkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    Stories Library
                  </h3>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setShowFilters(!showFilters)}
                      className={`p-2 rounded-lg transition-all ${
                        showFilters
                          ? darkMode
                            ? 'bg-indigo-600 text-white'
                            : 'bg-indigo-600 text-white'
                          : darkMode
                            ? 'text-gray-400 hover:text-white hover:bg-gray-700'
                            : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      <FilterIcon className="h-4 w-4" />
                    </button>
                    <div className="flex items-center gap-1">
                      <span className={`text-sm ${
                        darkMode ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        {filteredStories.length} stories
                      </span>
                    </div>
                  </div>
                </div>

                {/* Quick Filters */}
                <div className="mt-4 flex flex-wrap gap-2">
                  {['beginner', 'intermediate', 'advanced'].map((diff) => (
                    <button
                      key={diff}
                      onClick={() => setSelectedDifficulty(diff === selectedDifficulty ? 'all' : diff)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                        selectedDifficulty === diff
                          ? diff === 'beginner'
                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300'
                            : diff === 'intermediate'
                            ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300'
                            : 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300'
                          : darkMode
                            ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {diff.charAt(0).toUpperCase() + diff.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Filters Panel */}
              {showFilters && (
                <div className="p-6 border-b border-gray-200 dark:border-gray-700/50 space-y-4 animate-fade-in">
                  <div>
                    <h4 className={`text-sm font-semibold mb-3 ${
                      darkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      JLPT Level
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {['all', 'N5', 'N4', 'N3', 'N2', 'N1'].map(level => (
                        <button
                          key={level}
                          onClick={() => setSelectedLevel(level)}
                          className={`px-3 py-1.5 rounded-lg text-sm transition-all hover:scale-[1.02] ${
                            selectedLevel === level
                              ? level === 'all'
                                ? darkMode
                                  ? 'bg-gray-700 text-white'
                                  : 'bg-gray-900 text-white'
                                : `px-3 py-1.5 rounded-lg text-white ${getLevelColor(level)}`
                              : darkMode
                                ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {level === 'all' ? 'All Levels' : level}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Stories List */}
              <div className="p-4">
                {filteredStories.length === 0 ? (
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 text-gray-400 dark:text-gray-600 mx-auto mb-3" />
                    <p className={`text-sm ${
                      darkMode ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      No stories found. Try different filters.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                    {filteredStories.map((story) => (
                      <StoryCard
                        key={story.id}
                        story={story}
                        isSelected={selectedStory === story.id}
                        onSelect={() => story.status !== 'locked' && startReading(story.id)}
                        onToggleBookmark={() => toggleBookmark(story.id)}
                        darkMode={darkMode}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Progress Card */}
            <div className={`rounded-2xl border transition-all duration-300 ${
              darkMode 
                ? 'bg-gray-800/50 border-gray-700/50 backdrop-blur-sm' 
                : 'bg-white border-gray-200/80 backdrop-blur-sm'
            } shadow-lg p-6`}>
              <h3 className={`text-lg font-bold mb-6 ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                Your Reading Journey
              </h3>
              <div className="space-y-5">
                <ProgressBar
                  label="Beginner Stories"
                  value={8}
                  total={10}
                  color="from-emerald-400 to-green-500"
                  darkMode={darkMode}
                />
                <ProgressBar
                  label="Intermediate Stories"
                  value={5}
                  total={15}
                  color="from-amber-400 to-orange-500"
                  darkMode={darkMode}
                />
                <ProgressBar
                  label="Advanced Stories"
                  value={2}
                  total={8}
                  color="from-rose-500 to-pink-600"
                  darkMode={darkMode}
                />
              </div>
            </div>
          </div>

          {/* Main Reading Area */}
          <div className="lg:w-2/3">
            {!selectedStoryData ? (
              <EmptyState
                darkMode={darkMode}
                filteredStories={filteredStories}
                startReading={startReading}
              />
            ) : (
              <ReadingInterface
                story={selectedStoryData}
                darkMode={darkMode}
                currentPage={currentPage}
                totalPages={selectedStoryData.content?.japanese?.length || 0}
                onPrevPage={handlePrevPage}
                onNextPage={handleNextPage}
                showTranslation={showTranslation}
                onToggleTranslation={() => setShowTranslation(!showTranslation)}
                showVocabulary={showVocabulary}
                onToggleVocabulary={() => setShowVocabulary(!showVocabulary)}
                showCulturalNotes={showCulturalNotes}
                onToggleCulturalNotes={() => setShowCulturalNotes(!showCulturalNotes)}
                isPlaying={isPlaying}
                onPlayAudio={playAudio}
                speechRate={speechRate}
                onSpeechRateChange={setSpeechRate}
                userLiked={userLiked[selectedStoryData.id] || false}
                onToggleLike={() => toggleLike(selectedStoryData.id)}
                onShare={shareStory}
                onQuizStart={() => setQuizMode(true)}
                quizMode={quizMode}
                quizInterface={
                  quizMode ? (
                    <QuizInterface 
                      story={selectedStoryData}
                      userAnswers={userAnswers}
                      setUserAnswers={setUserAnswers}
                      quizScore={quizScore}
                      setQuizScore={setQuizScore}
                      quizResults={quizResults}
                      setQuizResults={setQuizResults}
                      showQuizDetails={showQuizDetails}
                      toggleQuizDetail={toggleQuizDetail}
                      resetQuiz={resetQuiz}
                      submitQuiz={submitQuiz}
                      darkMode={darkMode}
                      stories={stories}
                      selectedStory={selectedStory}
                      startReading={startReading}
                    />
                  ) : null
                }
              />
            )}

            {/* Featured Stories */}
            {!selectedStoryData && stories.length > 0 && (
              <FeaturedStories
                stories={stories.slice(0, 3)}
                startReading={startReading}
                darkMode={darkMode}
              />
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className={`mt-12 py-6 border-t transition-colors duration-300 ${
        darkMode 
          ? 'border-gray-800/50 bg-gray-900/50 text-gray-400' 
          : 'border-gray-200/50 bg-white/50 text-gray-600'
      } backdrop-blur-sm`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm text-center md:text-left">
              <p className="font-medium">Japanese Stories • Immerse yourself in authentic Japanese reading</p>
              <p className="mt-1 text-xs opacity-75">
                Practice reading with carefully crafted stories at your level
              </p>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className={`text-sm transition-colors ${
                  darkMode 
                    ? 'text-gray-400 hover:text-white' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Back to Top
              </button>
            </div>
          </div>
        </div>
      </footer>

      {/* Custom Styles */}
      <style jsx>{`
        .line-clamp-1 {
          overflow: hidden;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 1;
        }
        
        .line-clamp-2 {
          overflow: hidden;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
        }
        
        .animate-fade-in {
          animation: fadeIn 0.3s ease-out;
        }
        
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: ${darkMode ? '#4B5563' : '#D1D5DB'};
          border-radius: 4px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: ${darkMode ? '#6B7280' : '#9CA3AF'};
        }
        
        @keyframes fadeIn {
          from { 
            opacity: 0; 
            transform: translateY(10px); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0); 
          }
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        
        .animate-pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
    </div>
  );
};

// Reusable Components
const StatCard: React.FC<{
  label: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  iconColor: string;
  darkMode: boolean;
}> = ({ label, value, icon, color, iconColor, darkMode }) => (
  <div className={`p-3 rounded-xl transition-all duration-300 hover:scale-[1.02] ${
    darkMode 
      ? 'bg-gray-800/30 border border-gray-700/50 hover:bg-gray-800/50' 
      : 'bg-white/50 border border-gray-200/50 hover:bg-white/80'
  } shadow-sm`}>
    <div className="flex items-center justify-between">
      <div>
        <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{label}</p>
        <p className={`text-lg font-bold ${color}`}>{value}</p>
      </div>
      <div className={`p-2 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
        <div className={iconColor}>{icon}</div>
      </div>
    </div>
  </div>
);

const MenuItem: React.FC<{
  icon: React.ReactNode;
  label: string;
  active?: boolean;
}> = ({ icon, label, active }) => (
  <button className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${
    active 
      ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-300' 
      : 'hover:bg-gray-100 dark:hover:bg-gray-800'
  }`}>
    {icon}
    <span className="font-medium">{label}</span>
  </button>
);

const StoryCard: React.FC<{
  story: Story;
  isSelected: boolean;
  onSelect: () => void;
  onToggleBookmark: () => void;
  darkMode: boolean;
}> = ({ story, isSelected, onSelect, onToggleBookmark, darkMode }) => (
  <div
    onClick={onSelect}
    className={`group relative overflow-hidden rounded-xl border transition-all duration-300 cursor-pointer hover:shadow-lg ${
      isSelected
        ? darkMode
          ? 'border-indigo-500 bg-indigo-900/20 ring-2 ring-indigo-500/20'
          : 'border-indigo-400 bg-indigo-50 ring-2 ring-indigo-400/20'
        : darkMode
          ? 'border-gray-700/50 bg-gray-800/30 hover:bg-gray-800/50 hover:border-gray-600'
          : 'border-gray-200/80 bg-white/50 hover:bg-white hover:border-gray-300'
    }`}
  >
    {/* Story Image */}
    <div className="relative h-40 overflow-hidden rounded-t-xl">
      <img
        src={story.imageUrl}
        alt={story.title}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
      
      {/* Status Badge */}
      <div className="absolute top-3 left-3">
        {story.status === 'locked' ? (
          <div className="px-3 py-1.5 bg-gray-900/80 text-white rounded-full text-xs backdrop-blur-sm flex items-center gap-1">
            <Lock className="h-3 w-3" />
            Locked
          </div>
        ) : story.status === 'completed' ? (
          <div className="px-3 py-1.5 bg-emerald-500/90 text-white rounded-full text-xs backdrop-blur-sm flex items-center gap-1">
            <CheckCircle className="h-3 w-3" />
            Completed
          </div>
        ) : (
          <div className="px-3 py-1.5 bg-blue-500/90 text-white rounded-full text-xs backdrop-blur-sm">
            Available
          </div>
        )}
      </div>
      
      {/* Difficulty Badge */}
      <div className="absolute top-3 right-3">
        <div className={`px-3 py-1.5 rounded-full text-xs font-medium backdrop-blur-sm ${getDifficultyBg(story.difficulty)}`}>
          {story.difficulty.charAt(0).toUpperCase() + story.difficulty.slice(1)}
        </div>
      </div>
    </div>

    {/* Story Content */}
    <div className="p-4">
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <h4 className={`font-bold text-base line-clamp-1 ${
            darkMode ? 'text-white' : 'text-gray-900'
          }`}>
            {story.title}
          </h4>
          <p className={`text-xs mt-1 line-clamp-2 ${
            darkMode ? 'text-gray-400' : 'text-gray-600'
          }`}>
            {story.description}
          </p>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleBookmark();
          }}
          className={`p-1.5 ml-2 rounded-lg transition-all ${
            story.isBookmarked
              ? 'text-amber-500 hover:text-amber-600'
              : darkMode
                ? 'text-gray-400 hover:text-white hover:bg-gray-700'
                : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
          }`}
        >
          {story.isBookmarked ? (
            <BookmarkCheck className="h-4 w-4 fill-current" />
          ) : (
            <Bookmark className="h-4 w-4" />
          )}
        </button>
      </div>

      {/* Story Metadata */}
      <div className="flex flex-wrap items-center gap-2 text-xs">
        <div className={`px-2.5 py-1 rounded-full ${
          darkMode ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-700'
        }`}>
          {story.level}
        </div>
        <div className={`px-2.5 py-1 rounded-full flex items-center gap-1 ${
          darkMode ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-700'
        }`}>
          <Clock className="h-3 w-3" />
          {story.duration}
        </div>
        <div className={`px-2.5 py-1 rounded-full flex items-center gap-1 ${
          darkMode ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-700'
        }`}>
          <Eye className="h-3 w-3" />
          {story.readCount}
        </div>
      </div>
    </div>
  </div>
);

const ProgressBar: React.FC<{
  label: string;
  value: number;
  total: number;
  color: string;
  darkMode: boolean;
}> = ({ label, value, total, color, darkMode }) => {
  const percentage = (value / total) * 100;
  
  return (
    <div>
      <div className="flex justify-between text-sm mb-1.5">
        <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>{label}</span>
        <span className="font-medium">{value}/{total}</span>
      </div>
      <div className={`h-2 rounded-full overflow-hidden ${
        darkMode ? 'bg-gray-700/50' : 'bg-gray-200/50'
      }`}>
        <div 
          className={`h-full rounded-full bg-gradient-to-r ${color} transition-all duration-500`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

const EmptyState: React.FC<{
  darkMode: boolean;
  filteredStories: Story[];
  startReading: (id: string) => void;
}> = ({ darkMode, filteredStories, startReading }) => (
  <div className={`rounded-2xl border transition-all duration-300 ${
    darkMode 
      ? 'bg-gray-800/50 border-gray-700/50' 
      : 'bg-white border-gray-200/80'
  } shadow-lg p-8 text-center`}>
    <div className="w-20 h-20 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
      <Compass className="h-10 w-10 text-white" />
    </div>
    <h2 className={`text-xl font-bold mb-2 ${
      darkMode ? 'text-white' : 'text-gray-900'
    }`}>
      Start Your Reading Journey
    </h2>
    <p className={`mb-6 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
      Select a story from the library to begin reading
    </p>
    {filteredStories.length > 0 && (
      <button
        onClick={() => startReading(filteredStories[0].id)}
        className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl hover:shadow-lg transition-all duration-300 font-medium hover:scale-[1.02] active:scale-[0.98]"
      >
        Start Reading
      </button>
    )}
  </div>
);

const FeaturedStories: React.FC<{
  stories: Story[];
  startReading: (id: string) => void;
  darkMode: boolean;
}> = ({ stories, startReading, darkMode }) => (
  <div className="mt-6">
    <h3 className={`text-lg font-bold mb-4 ${
      darkMode ? 'text-white' : 'text-gray-900'
    }`}>
      Featured Stories
    </h3>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {stories.map((story) => (
        <div
          key={story.id}
          className={`group overflow-hidden rounded-xl border transition-all duration-300 cursor-pointer ${
            darkMode 
              ? 'bg-gray-800/30 border-gray-700/50 hover:border-indigo-500/50' 
              : 'bg-white border-gray-200/80 hover:border-indigo-400'
          } hover:shadow-lg`}
          onClick={() => startReading(story.id)}
        >
          <div className="h-48 overflow-hidden">
            <img
              src={story.imageUrl}
              alt={story.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>
          <div className="p-4">
            <h4 className={`font-bold mb-2 ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}>
              {story.title}
            </h4>
            <div className="flex items-center justify-between">
              <span className={`px-2.5 py-1 rounded text-xs ${getDifficultyBg(story.difficulty)}`}>
                {story.level}
              </span>
              <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {story.duration}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const ReadingInterface: React.FC<{
  story: Story;
  darkMode: boolean;
  currentPage: number;
  totalPages: number;
  onPrevPage: () => void;
  onNextPage: () => void;
  showTranslation: boolean;
  onToggleTranslation: () => void;
  showVocabulary: boolean;
  onToggleVocabulary: () => void;
  showCulturalNotes: boolean;
  onToggleCulturalNotes: () => void;
  isPlaying: boolean;
  onPlayAudio: () => void;
  speechRate: number;
  onSpeechRateChange: (rate: number) => void;
  userLiked: boolean;
  onToggleLike: () => void;
  onShare: () => void;
  onQuizStart: () => void;
  quizMode: boolean;
  quizInterface: React.ReactNode;
}> = ({
  story,
  darkMode,
  currentPage,
  totalPages,
  onPrevPage,
  onNextPage,
  showTranslation,
  onToggleTranslation,
  showVocabulary,
  onToggleVocabulary,
  showCulturalNotes,
  onToggleCulturalNotes,
  isPlaying,
  onPlayAudio,
  speechRate,
  onSpeechRateChange,
  userLiked,
  onToggleLike,
  onShare,
  onQuizStart,
  quizMode,
  quizInterface
}) => (
  <div className={`rounded-2xl border overflow-hidden transition-all duration-300 ${
    darkMode 
      ? 'bg-gray-800/50 border-gray-700/50' 
      : 'bg-white border-gray-200/80'
  } shadow-lg`}>
    {/* Story Header */}
    <div className="relative">
      <div className="h-56 md:h-64 overflow-hidden">
        <img
          src={story.imageUrl}
          alt={story.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
      </div>
      
      <div className="absolute bottom-0 left-0 right-0 p-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="flex-1">
            <h2 className={`text-2xl md:text-3xl font-bold mb-2 text-white`}>
              {story.title}
            </h2>
            <p className={`text-lg text-gray-200`}>
              {story.japaneseTitle}
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={onShare}
              className={`p-2.5 rounded-full backdrop-blur-sm ${
                darkMode 
                  ? 'bg-white/10 text-white hover:bg-white/20' 
                  : 'bg-white/20 text-white hover:bg-white/30'
              } transition-all hover:scale-105`}
            >
              <Share2 className="h-4 w-4" />
            </button>
            <button
              onClick={onToggleLike}
              className={`p-2.5 rounded-full backdrop-blur-sm transition-all hover:scale-105 ${
                userLiked
                  ? 'bg-rose-500 text-white hover:bg-rose-600'
                  : darkMode
                    ? 'bg-white/10 text-white hover:bg-white/20'
                    : 'bg-white/20 text-white hover:bg-white/30'
              }`}
            >
              <Heart className={`h-4 w-4 ${userLiked ? 'fill-current' : ''}`} />
            </button>
          </div>
        </div>
      </div>
    </div>

    <div className="p-6">
      {/* Story Info Bar */}
      <div className={`flex flex-wrap gap-4 mb-8 p-4 rounded-xl ${
        darkMode ? 'bg-gray-900/30' : 'bg-gray-50/50'
      }`}>
        <InfoItem 
          icon={<Target className="h-4 w-4" />}
          label="Difficulty"
          value={story.difficulty.charAt(0).toUpperCase() + story.difficulty.slice(1)}
          color={getDifficultyColor(story.difficulty)}
          darkMode={darkMode}
        />
        <InfoItem 
          icon={<Trophy className="h-4 w-4" />}
          label="JLPT Level"
          value={story.level}
          color="from-blue-500 to-cyan-500"
          darkMode={darkMode}
        />
        <InfoItem 
          icon={<Clock className="h-4 w-4" />}
          label="Reading Time"
          value={story.duration}
          color="from-purple-500 to-pink-500"
          darkMode={darkMode}
        />
        <InfoItem 
          icon={<Star className="h-4 w-4" />}
          label="Rating"
          value={`${story.rating?.toFixed(1)} ★`}
          color="from-amber-500 to-orange-500"
          darkMode={darkMode}
        />
      </div>

      {/* Quiz Mode or Reading Mode */}
      {quizMode ? (
        quizInterface
      ) : (
        <ReadingMode
          story={story}
          darkMode={darkMode}
          currentPage={currentPage}
          totalPages={totalPages}
          onPrevPage={onPrevPage}
          onNextPage={onNextPage}
          showTranslation={showTranslation}
          onToggleTranslation={onToggleTranslation}
          showVocabulary={showVocabulary}
          onToggleVocabulary={onToggleVocabulary}
          showCulturalNotes={showCulturalNotes}
          onToggleCulturalNotes={onToggleCulturalNotes}
          isPlaying={isPlaying}
          onPlayAudio={onPlayAudio}
          speechRate={speechRate}
          onSpeechRateChange={onSpeechRateChange}
          onQuizStart={onQuizStart}
        />
      )}
    </div>
  </div>
);

const InfoItem: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: string;
  color: string;
  darkMode: boolean;
}> = ({ icon, label, value, color, darkMode }) => (
  <div className="flex items-center gap-3">
    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color} shadow`}>
      <div className="text-white">{icon}</div>
    </div>
    <div>
      <div className="text-xs text-gray-500 dark:text-gray-400">{label}</div>
      <div className="font-semibold">{value}</div>
    </div>
  </div>
);

const ReadingMode: React.FC<{
  story: Story;
  darkMode: boolean;
  currentPage: number;
  totalPages: number;
  onPrevPage: () => void;
  onNextPage: () => void;
  showTranslation: boolean;
  onToggleTranslation: () => void;
  showVocabulary: boolean;
  onToggleVocabulary: () => void;
  showCulturalNotes: boolean;
  onToggleCulturalNotes: () => void;
  isPlaying: boolean;
  onPlayAudio: () => void;
  speechRate: number;
  onSpeechRateChange: (rate: number) => void;
  onQuizStart: () => void;
}> = ({
  story,
  darkMode,
  currentPage,
  totalPages,
  onPrevPage,
  onNextPage,
  showTranslation,
  onToggleTranslation,
  showVocabulary,
  onToggleVocabulary,
  showCulturalNotes,
  onToggleCulturalNotes,
  isPlaying,
  onPlayAudio,
  speechRate,
  onSpeechRateChange,
  onQuizStart
}) => {
  const currentSentence = story.content?.japanese?.[currentPage];
  const currentTranslation = story.content?.english?.[currentPage];
  
  return (
    <>
      {/* Reading Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6 p-4 rounded-xl bg-gradient-to-r from-blue-50/50 to-purple-50/50 dark:from-gray-900/30 dark:to-gray-800/30 border border-blue-100/50 dark:border-gray-700/50">
        <div className="flex items-center gap-3">
          <button
            onClick={onPrevPage}
            disabled={currentPage === 0}
            className={`p-2.5 rounded-xl transition-all ${
              currentPage === 0
                ? 'opacity-50 cursor-not-allowed'
                : darkMode
                  ? 'bg-gray-800 hover:bg-gray-700 hover:scale-105'
                  : 'bg-white hover:bg-gray-50 hover:scale-105'
            }`}
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          
          <div className={`px-4 py-2 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
            <div className="text-xs text-gray-500 dark:text-gray-400">Page</div>
            <div className="font-bold text-lg">{currentPage + 1} of {totalPages}</div>
          </div>
          
          <button
            onClick={onNextPage}
            disabled={currentPage === totalPages - 1}
            className={`p-2.5 rounded-xl transition-all ${
              currentPage === totalPages - 1
                ? 'opacity-50 cursor-not-allowed'
                : darkMode
                  ? 'bg-gray-800 hover:bg-gray-700 hover:scale-105'
                  : 'bg-white hover:bg-gray-50 hover:scale-105'
            }`}
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={onPlayAudio}
            className="px-4 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl hover:shadow-lg transition-all duration-300 flex items-center gap-2 hover:scale-[1.02] active:scale-[0.98]"
          >
            {isPlaying ? (
              <Pause className="h-4 w-4" />
            ) : (
              <Volume2 className="h-4 w-4" />
            )}
            Listen
          </button>
          
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600 dark:text-gray-400">Speed:</label>
            <select
              value={speechRate}
              onChange={(e) => onSpeechRateChange(parseFloat(e.target.value))}
              className={`px-2 py-1 rounded-lg text-sm transition-all ${
                darkMode 
                  ? 'bg-gray-800 text-gray-300 border border-gray-700 hover:bg-gray-700' 
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              <option value="0.5">0.5x</option>
              <option value="0.8">0.8x</option>
              <option value="1">1x</option>
              <option value="1.2">1.2x</option>
              <option value="1.5">1.5x</option>
            </select>
          </div>
        </div>
      </div>

      {/* Reading Content */}
      <div className="mb-8">
        {currentSentence ? (
          <div className="text-center mb-8">
            <div className={`text-2xl md:text-3xl font-bold mb-6 leading-relaxed ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}>
              {currentSentence}
            </div>
            
            <button
              onClick={onToggleTranslation}
              className="px-4 py-2 mb-6 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-gray-800 dark:to-gray-700 text-blue-700 dark:text-blue-300 rounded-xl hover:shadow transition-all hover:scale-[1.02]"
            >
              {showTranslation ? 'Hide English Translation' : 'Show English Translation'}
            </button>
            
            {showTranslation && currentTranslation && (
              <div className={`p-6 rounded-xl border animate-fade-in ${
                darkMode 
                  ? 'bg-gray-900/30 border-gray-700 text-gray-300' 
                  : 'bg-blue-50 border-blue-200 text-gray-700'
              }`}>
                <div className="flex items-center gap-2 mb-3">
                  <Globe className="h-5 w-5 text-blue-500" />
                  <h4 className="font-bold">English Translation</h4>
                </div>
                <p className="text-lg leading-relaxed">{currentTranslation}</p>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
              No content available for this story.
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3 mb-8">
          {story.comprehensionQuiz && (
            <button
              onClick={onQuizStart}
              className="px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-green-500 text-white rounded-xl hover:shadow-lg transition-all duration-300 flex items-center gap-2 hover:scale-[1.02]"
            >
              <Award className="h-4 w-4" />
              Take Comprehension Quiz
            </button>
          )}
          
          <button
            onClick={onToggleVocabulary}
            className={`px-4 py-2.5 rounded-xl transition-all duration-300 flex items-center gap-2 hover:scale-[1.02] ${
              showVocabulary
                ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300'
                : darkMode
                  ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <FileText className="h-4 w-4" />
            {showVocabulary ? 'Hide Vocabulary' : 'Show Vocabulary'}
          </button>
          
          <button
            onClick={onToggleCulturalNotes}
            className={`px-4 py-2.5 rounded-xl transition-all duration-300 flex items-center gap-2 hover:scale-[1.02] ${
              showCulturalNotes
                ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300'
                : darkMode
                  ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Lightbulb className="h-4 w-4" />
            Cultural Notes
          </button>
        </div>

        {/* Vocabulary Panel */}
        {showVocabulary && story.content?.vocabulary && (
          <VocabularyPanel vocabulary={story.content.vocabulary} darkMode={darkMode} />
        )}

        {/* Cultural Notes */}
        {showCulturalNotes && story.culturalNotes && (
          <CulturalNotes notes={story.culturalNotes} darkMode={darkMode} />
        )}

        {/* Story Complete */}
        {currentPage === totalPages - 1 && (
          <StoryComplete onQuizStart={onQuizStart} darkMode={darkMode} />
        )}
      </div>
    </>
  );
};

const VocabularyPanel: React.FC<{
  vocabulary: Array<{ word: string; reading: string; meaning: string }>;
  darkMode: boolean;
}> = ({ vocabulary, darkMode }) => (
  <div className={`mb-8 p-6 rounded-xl border animate-fade-in ${
    darkMode 
      ? 'bg-gray-900/30 border-gray-700' 
      : 'bg-indigo-50 border-indigo-200'
  }`}>
    <div className="flex items-center justify-between mb-4">
      <h4 className={`text-lg font-bold flex items-center gap-2 ${
        darkMode ? 'text-white' : 'text-gray-900'
      }`}>
        <FileText className="h-5 w-5 text-indigo-500" />
        Story Vocabulary
      </h4>
      <span className={`px-2.5 py-1 rounded text-sm ${
        darkMode ? 'bg-gray-800 text-gray-300' : 'bg-white text-gray-700'
      }`}>
        {vocabulary.length} words
      </span>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      {vocabulary.map((vocab, index) => (
        <div
          key={index}
          className={`p-3 rounded-lg ${
            darkMode ? 'bg-gray-800/50' : 'bg-white'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="font-bold text-lg">{vocab.word}</div>
            <div className={`px-2 py-1 rounded text-xs ${
              darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'
            }`}>
              {vocab.reading}
            </div>
          </div>
          <div className="text-sm text-blue-600 dark:text-blue-400">
            {vocab.meaning}
          </div>
        </div>
      ))}
    </div>
  </div>
);

const CulturalNotes: React.FC<{
  notes: string[];
  darkMode: boolean;
}> = ({ notes, darkMode }) => (
  <div className={`mb-8 p-6 rounded-xl border animate-fade-in ${
    darkMode 
      ? 'bg-gray-900/30 border-gray-700' 
      : 'bg-amber-50 border-amber-200'
  }`}>
    <div className="flex items-center gap-2 mb-4">
      <Lightbulb className="h-5 w-5 text-amber-500" />
      <h4 className={`text-lg font-bold ${
        darkMode ? 'text-white' : 'text-gray-900'
      }`}>
        Cultural Insights
      </h4>
    </div>
    <ul className="space-y-3">
      {notes.map((note, index) => (
        <li key={index} className="flex items-start gap-3">
          <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
            darkMode ? 'bg-amber-500' : 'bg-amber-400'
          }`} />
          <p className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
            {note}
          </p>
        </li>
      ))}
    </ul>
  </div>
);

const StoryComplete: React.FC<{
  onQuizStart: () => void;
  darkMode: boolean;
}> = ({ onQuizStart, darkMode }) => (
  <div className={`p-6 rounded-xl border text-center ${
    darkMode 
      ? 'bg-gradient-to-r from-emerald-900/20 to-green-900/20 border-emerald-700' 
      : 'bg-gradient-to-r from-emerald-50 to-green-50 border-emerald-200'
  }`}>
    <div className="text-4xl mb-3">🎉</div>
    <h3 className={`text-xl font-bold mb-2 ${
      darkMode ? 'text-white' : 'text-gray-900'
    }`}>
      Story Complete!
    </h3>
    <p className={`mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
      Great job reading through the entire story!
    </p>
    <button
      onClick={onQuizStart}
      className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-green-500 text-white rounded-xl hover:shadow-lg transition-all duration-300 font-medium hover:scale-[1.02]"
    >
      Test Your Understanding with Quiz
    </button>
  </div>
);

// Quiz Interface Component (same as before, but with updated styling)
const QuizInterface: React.FC<{
  story: Story;
  userAnswers: Record<string, string>;
  setUserAnswers: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  quizScore: number | null;
  setQuizScore: React.Dispatch<React.SetStateAction<number | null>>;
  quizResults: QuizResult[];
  setQuizResults: React.Dispatch<React.SetStateAction<QuizResult[]>>;
  showQuizDetails: Record<string, boolean>;
  toggleQuizDetail: (questionId: string) => void;
  resetQuiz: () => void;
  submitQuiz: () => void;
  darkMode: boolean;
  stories: Story[];
  selectedStory: string;
  startReading: (storyId: string) => void;
}> = ({
  story,
  userAnswers,
  setUserAnswers,
  quizScore,
  setQuizScore,
  quizResults,
  setQuizResults,
  showQuizDetails,
  toggleQuizDetail,
  resetQuiz,
  submitQuiz,
  darkMode,
  stories,
  selectedStory,
  startReading
}) => {
  if (quizScore === null) {
    return (
      <div>
        <div className="flex items-center justify-between mb-6">
          <h3 className={`text-xl font-bold ${
            darkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Comprehension Quiz
          </h3>
          <div className="flex items-center gap-2">
            <span className={`text-sm ${
              darkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>
              {Object.keys(userAnswers).length}/{story.comprehensionQuiz?.length || 0} answered
            </span>
          </div>
        </div>
        
        {story.comprehensionQuiz && story.comprehensionQuiz.length > 0 ? (
          <div className="space-y-6">
            {story.comprehensionQuiz.map((question, index) => (
              <div 
                key={question.id} 
                className={`p-6 rounded-xl border transition-all duration-300 ${
                  darkMode ? 'bg-gray-900/30 border-gray-700/50' : 'bg-white border-gray-200/80'
                } hover:shadow-lg`}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold shadow">
                    {index + 1}
                  </div>
                  <h4 className={`font-semibold text-lg ${
                    darkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    {question.question}
                  </h4>
                </div>
                
                <div className="space-y-3">
                  {question.options.map((option, optIndex) => (
                    <button
                      key={optIndex}
                      onClick={() => setUserAnswers(prev => ({
                        ...prev,
                        [question.id]: option
                      }))}
                      className={`w-full p-4 text-left rounded-xl border transition-all duration-200 hover:scale-[1.01] ${
                        userAnswers[question.id] === option
                          ? userAnswers[question.id] === question.correctAnswer
                            ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20'
                            : 'border-rose-500 bg-rose-50 dark:bg-rose-900/20'
                          : darkMode
                            ? 'border-gray-700 bg-gray-800/50 hover:bg-gray-700/50'
                            : 'border-gray-200 bg-gray-50/50 hover:bg-gray-100'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-6 h-6 rounded-full border flex items-center justify-center transition-all ${
                          userAnswers[question.id] === option
                            ? userAnswers[question.id] === question.correctAnswer
                              ? 'border-emerald-500 bg-emerald-500'
                              : 'border-rose-500 bg-rose-500'
                            : darkMode
                              ? 'border-gray-600 bg-gray-700'
                              : 'border-gray-300 bg-white'
                        }`}>
                          {userAnswers[question.id] === option && (
                            <CheckCircle2 className="h-4 w-4 text-white" />
                          )}
                        </div>
                        <span className={`font-medium ${
                          userAnswers[question.id] === option
                            ? userAnswers[question.id] === question.correctAnswer
                              ? 'text-emerald-700 dark:text-emerald-300'
                              : 'text-rose-700 dark:text-rose-300'
                            : darkMode ? 'text-gray-300' : 'text-gray-700'
                        }`}>
                          {option}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ))}
            
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <button
                onClick={submitQuiz}
                disabled={Object.keys(userAnswers).length < (story.comprehensionQuiz?.length || 0)}
                className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-green-500 text-white rounded-xl hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed font-medium flex-1 hover:scale-[1.02]"
              >
                Submit Quiz
              </button>
              <button
                onClick={resetQuiz}
                className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 hover:scale-[1.02] ${
                  darkMode
                    ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Back to Story
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
              No quiz available for this story.
            </p>
            <button
              onClick={resetQuiz}
              className="mt-4 px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-all"
            >
              Back to Story
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Results Header */}
      <div className={`text-center p-8 rounded-xl border ${
        darkMode 
          ? 'bg-gradient-to-r from-gray-900 to-black border-gray-700' 
          : 'bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200'
      }`}>
        <div className="relative inline-flex mb-4">
          <div className="w-24 h-24 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center shadow-lg">
            <Award className="h-12 w-12 text-white" />
          </div>
          <div className="absolute -top-2 -right-2 w-12 h-12 bg-gradient-to-r from-amber-500 to-yellow-500 rounded-full flex items-center justify-center text-white font-bold text-lg shadow">
            {quizScore}%
          </div>
        </div>
        
        <h3 className={`text-2xl font-bold mb-2 ${
          darkMode ? 'text-white' : 'text-gray-900'
        }`}>
          {quizScore! >= 90 ? 'Perfect Score! 🏆' :
           quizScore! >= 75 ? 'Excellent Work! 🎉' :
           quizScore! >= 60 ? 'Great Job! 👍' :
           'Keep Practicing! 📚'}
        </h3>
        <p className={`text-lg mb-6 ${
          darkMode ? 'text-emerald-400' : 'text-emerald-600'
        }`}>
          {quizResults.filter(r => r.isCorrect).length} of {quizResults.length} correct
        </p>
      </div>

      {/* Detailed Results */}
      <div className="space-y-4">
        <h4 className={`font-semibold text-lg ${
          darkMode ? 'text-white' : 'text-gray-900'
        }`}>
          Review Your Answers
        </h4>
        
        {quizResults.map((result, index) => (
          <div 
            key={result.questionId}
            className={`p-4 rounded-xl border transition-all duration-300 ${
              result.isCorrect 
                ? darkMode
                  ? 'border-emerald-700 bg-emerald-900/20'
                  : 'border-emerald-200 bg-emerald-50'
                : darkMode
                  ? 'border-rose-700 bg-rose-900/20'
                  : 'border-rose-200 bg-rose-50'
            }`}
          >
            <div 
              className="flex items-center justify-between cursor-pointer"
              onClick={() => toggleQuizDetail(result.questionId)}
            >
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  result.isCorrect 
                    ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300'
                    : 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300'
                }`}>
                  {result.isCorrect ? (
                    <CheckCircle2 className="h-5 w-5" />
                  ) : (
                    <XCircle className="h-5 w-5" />
                  )}
                </div>
                <div>
                  <div className={`font-medium ${
                    darkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    Question {index + 1}
                  </div>
                  <div className={`text-sm ${
                    darkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    {result.isCorrect ? 'Correct' : 'Incorrect'}
                  </div>
                </div>
              </div>
              {showQuizDetails[result.questionId] ? (
                <ChevronUp className="h-5 w-5 text-gray-500" />
              ) : (
                <ChevronDown className="h-5 w-5 text-gray-500" />
              )}
            </div>
            
            {showQuizDetails[result.questionId] && (
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 space-y-3 animate-fade-in">
                {!result.isCorrect && (
                  <div>
                    <div className={`text-sm font-medium mb-1 ${
                      darkMode ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      Your Answer
                    </div>
                    <div className={`p-2 rounded ${
                      darkMode ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-700'
                    }`}>
                      {result.userAnswer}
                    </div>
                  </div>
                )}
                
                <div>
                  <div className={`text-sm font-medium mb-1 ${
                    darkMode ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                    Correct Answer
                  </div>
                  <div className={`p-2 rounded ${
                    darkMode ? 'bg-emerald-900/30 text-emerald-300' : 'bg-emerald-50 text-emerald-700'
                  }`}>
                    {result.correctAnswer}
                  </div>
                </div>
                
                <div>
                  <div className={`text-sm font-medium mb-1 ${
                    darkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    Explanation
                  </div>
                  <p className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
                    {result.explanation}
                  </p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <button
          onClick={() => {
            resetQuiz();
            startReading(selectedStory);
          }}
          className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl hover:shadow-lg transition-all duration-300 font-medium flex items-center justify-center gap-2 hover:scale-[1.02]"
        >
          <RotateCcw className="h-5 w-5" />
          Read Story Again
        </button>
        
        <button
          onClick={() => {
            const nextStory = stories.find(s => 
              s.id !== selectedStory && s.status !== 'locked'
            );
            if (nextStory) {
              startReading(nextStory.id);
              resetQuiz();
            }
          }}
          className={`px-6 py-3 rounded-xl font-medium flex items-center justify-center gap-2 transition-all duration-300 hover:scale-[1.02] ${
            darkMode
              ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <ArrowRight className="h-5 w-5" />
          Next Story
        </button>
      </div>
    </div>
  );
};

export default ShortStories;