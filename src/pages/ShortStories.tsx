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
  Map
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
    case 'beginner': return 'bg-gradient-to-r from-green-500 to-emerald-500';
    case 'intermediate': return 'bg-gradient-to-r from-yellow-500 to-amber-500';
    case 'advanced': return 'bg-gradient-to-r from-red-500 to-rose-500';
    default: return 'bg-gradient-to-r from-gray-500 to-slate-500';
  }
};

const getDifficultyBg = (difficulty: Difficulty): string => {
  switch (difficulty) {
    case 'beginner': return 'bg-green-50 text-green-700 border-green-200';
    case 'intermediate': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
    case 'advanced': return 'bg-red-50 text-red-700 border-red-200';
    default: return 'bg-gray-50 text-gray-700 border-gray-200';
  }
};

const getLevelColor = (level: string): string => {
  switch (level) {
    case 'N5': return 'bg-gradient-to-r from-blue-500 to-cyan-500';
    case 'N4': return 'bg-gradient-to-r from-indigo-500 to-purple-500';
    case 'N3': return 'bg-gradient-to-r from-purple-500 to-pink-500';
    case 'N2': return 'bg-gradient-to-r from-orange-500 to-red-500';
    case 'N1': return 'bg-gradient-to-r from-red-500 to-rose-500';
    default: return 'bg-gradient-to-r from-gray-500 to-slate-500';
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
  const [speechRate, setSpeechRate] = useState(0.8);
  const [showCulturalNotes, setShowCulturalNotes] = useState(false);
  const [autoPlayAudio, setAutoPlayAudio] = useState(false);
  const [userLiked, setUserLiked] = useState<Record<string, boolean>>({});

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
      <div className={`min-h-screen flex items-center justify-center p-4 ${
        darkMode ? 'bg-gradient-to-br from-gray-900 to-black' : 'bg-gradient-to-br from-blue-50 to-indigo-50'
      }`}>
        <div className="text-center">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-blue-200 rounded-full"></div>
            <div className="w-20 h-20 border-4 border-blue-600 border-t-transparent rounded-full absolute top-0 animate-spin"></div>
          </div>
          <p className="mt-6 text-lg font-medium text-gray-700 dark:text-gray-300">Loading Japanese Stories...</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Preparing your reading adventure</p>
        </div>
      </div>
    );
  }

  if (error && stories.length === 0) {
    return (
      <div className={`min-h-screen flex items-center justify-center p-4 ${
        darkMode ? 'bg-gradient-to-br from-gray-900 to-black' : 'bg-gradient-to-br from-blue-50 to-indigo-50'
      }`}>
        <div className="max-w-md w-full text-center p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-xl">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="h-8 w-8 text-red-600 dark:text-red-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Unable to Load Stories</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">{error}</p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={handleRetry}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl hover:shadow-lg transition-all font-medium"
            >
              Try Again
            </button>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition"
            >
              Reload Page
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      darkMode 
        ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-black text-gray-100' 
        : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 text-gray-900'
    }`}>
      {/* Header */}
      <header className={`sticky top-0 z-50 backdrop-blur-lg border-b transition-colors ${
        darkMode 
          ? 'bg-gray-900/80 border-gray-800' 
          : 'bg-white/80 border-gray-200'
      }`}>
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            {/* Left: Branding */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center">
                    <BookOpen className="h-7 w-7 text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center text-xs font-bold text-white">
                    {stats.storiesRead}
                  </div>
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    Japanese Stories
                  </h1>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Immerse yourself in authentic Japanese reading
                  </p>
                </div>
              </div>
            </div>

            {/* Right: Controls */}
            <div className="flex items-center gap-3">
              {/* View Mode */}
              <div className="hidden md:flex items-center bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded transition ${
                    viewMode === 'grid' 
                      ? 'bg-white dark:bg-gray-700 text-indigo-600 dark:text-indigo-300' 
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
                  title="Grid View"
                >
                  <Grid3x3 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('detailed')}
                  className={`p-2 rounded transition ${
                    viewMode === 'detailed' 
                      ? 'bg-white dark:bg-gray-700 text-indigo-600 dark:text-indigo-300' 
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
                  title="Detailed View"
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
              
              {/* Dark Mode */}
              <button
                onClick={() => {
                  setDarkMode(!darkMode);
                  saveUserPreferences();
                }}
                className={`p-2 rounded-lg ${
                  darkMode
                    ? 'bg-gray-800 text-yellow-300 hover:bg-gray-700'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                title="Toggle dark mode"
              >
                {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </button>
              
              {/* Search */}
              <div className="relative">
                <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 ${
                  darkMode ? 'text-gray-500' : 'text-gray-400'
                }`} />
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search stories..."
                  className={`pl-10 pr-4 py-2 rounded-xl text-sm transition-all w-40 md:w-48 ${
                    darkMode
                      ? 'bg-gray-800 border border-gray-700 text-white placeholder-gray-500'
                      : 'bg-white border border-gray-300 text-gray-900 placeholder-gray-400'
                  } focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                />
              </div>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="mt-4 grid grid-cols-2 md:grid-cols-6 gap-3">
            <div className={`p-3 rounded-xl ${
              darkMode ? 'bg-gray-800/50 border border-gray-700' : 'bg-white border border-gray-200'
            } shadow-sm`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Stories Read</p>
                  <p className="text-xl font-bold text-purple-600">{stats.storiesRead}</p>
                </div>
                <BookOpen className="h-5 w-5 text-purple-500" />
              </div>
            </div>
            
            <div className={`p-3 rounded-xl ${
              darkMode ? 'bg-gray-800/50 border border-gray-700' : 'bg-white border border-gray-200'
            } shadow-sm`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Words Learned</p>
                  <p className="text-xl font-bold text-green-600">{stats.wordsLearned.toLocaleString()}</p>
                </div>
                <TrendingUp className="h-5 w-5 text-green-500" />
              </div>
            </div>
            
            <div className={`p-3 rounded-xl ${
              darkMode ? 'bg-gray-800/50 border border-gray-700' : 'bg-white border border-gray-200'
            } shadow-sm`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Reading Time</p>
                  <p className="text-xl font-bold text-blue-600">{stats.readingTime}m</p>
                </div>
                <Clock className="h-5 w-5 text-blue-500" />
              </div>
            </div>
            
            <div className={`p-3 rounded-xl ${
              darkMode ? 'bg-gray-800/50 border border-gray-700' : 'bg-white border border-gray-200'
            } shadow-sm`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Streak</p>
                  <p className="text-xl font-bold text-amber-600">{stats.streak} days</p>
                </div>
                <Zap className="h-5 w-5 text-amber-500" />
              </div>
            </div>
            
            <div className={`p-3 rounded-xl ${
              darkMode ? 'bg-gray-800/50 border border-gray-700' : 'bg-white border border-gray-200'
            } shadow-sm`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Level</p>
                  <p className="text-xl font-bold text-indigo-600">{stats.currentLevel}</p>
                </div>
                <Trophy className="h-5 w-5 text-indigo-500" />
              </div>
            </div>
            
            <div className={`p-3 rounded-xl ${
              darkMode ? 'bg-gray-800/50 border border-gray-700' : 'bg-white border border-gray-200'
            } shadow-sm`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>XP</p>
                  <p className="text-xl font-bold text-rose-600">{stats.xp}</p>
                </div>
                <Award className="h-5 w-5 text-rose-500" />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Stories Sidebar */}
          <div className="lg:w-1/3">
            {/* Filters */}
            <div className={`mb-6 rounded-2xl p-6 ${
              darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border border-gray-200'
            } shadow-lg`}>
              <div className="flex items-center justify-between mb-6">
                <h3 className={`text-lg font-bold ${
                  darkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  Stories Library
                </h3>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className={`p-2 rounded-lg ${
                      darkMode
                        ? 'text-gray-400 hover:text-white hover:bg-gray-700'
                        : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <Filter className="h-4 w-4" />
                  </button>
                  <span className={`text-sm ${
                    darkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    {filteredStories.length} stories
                  </span>
                </div>
              </div>

              {/* Filters Panel */}
              {showFilters && (
                <div className="mb-6 space-y-4 animate-fade-in">
                  <div>
                    <h4 className={`text-sm font-semibold mb-2 ${
                      darkMode ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      JLPT Level
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {['all', 'N5', 'N4', 'N3', 'N2', 'N1'].map(level => (
                        <button
                          key={level}
                          onClick={() => setSelectedLevel(level)}
                          className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                            selectedLevel === level
                              ? darkMode
                                ? 'bg-indigo-600 text-white'
                                : 'bg-indigo-600 text-white'
                              : darkMode
                                ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {level === 'all' ? 'All' : level}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className={`text-sm font-semibold mb-2 ${
                      darkMode ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      Difficulty
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {['all', 'beginner', 'intermediate', 'advanced'].map(diff => (
                        <button
                          key={diff}
                          onClick={() => setSelectedDifficulty(diff)}
                          className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                            selectedDifficulty === diff
                              ? diff === 'beginner'
                                ? 'bg-green-100 text-green-700'
                                : diff === 'intermediate'
                                ? 'bg-yellow-100 text-yellow-700'
                                : diff === 'advanced'
                                ? 'bg-red-100 text-red-700'
                                : darkMode
                                ? 'bg-gray-700 text-white'
                                : 'bg-gray-900 text-white'
                              : darkMode
                                ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {diff === 'all' ? 'All' : diff.charAt(0).toUpperCase() + diff.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Stories List */}
              <div className={`max-h-[500px] overflow-y-auto ${darkMode ? 'scrollbar-dark' : ''}`}>
                {filteredStories.length === 0 ? (
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      No stories found. Try different filters.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {filteredStories.map((story) => (
                      <div
                        key={story.id}
                        className={`group relative overflow-hidden rounded-xl border transition-all duration-300 ${
                          selectedStory === story.id
                            ? darkMode
                              ? 'border-indigo-500 bg-indigo-900/20'
                              : 'border-indigo-500 bg-indigo-50'
                            : darkMode
                              ? 'border-gray-700 bg-gray-800/50 hover:bg-gray-800'
                              : 'border-gray-200 bg-white hover:bg-gray-50'
                        } ${story.status === 'locked' ? 'opacity-75' : 'cursor-pointer'}`}
                        onClick={() => story.status !== 'locked' && startReading(story.id)}
                      >
                        {/* Story Image */}
                        <div className="relative h-32 overflow-hidden">
                          <img
                            src={story.imageUrl}
                            alt={story.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                          
                          {/* Status Badge */}
                          <div className="absolute top-3 left-3">
                            {story.status === 'locked' ? (
                              <div className="px-2 py-1 bg-gray-900/80 text-white rounded-full text-xs">
                                <Lock className="h-3 w-3 inline mr-1" />
                                Locked
                              </div>
                            ) : story.status === 'completed' ? (
                              <div className="px-2 py-1 bg-green-600 text-white rounded-full text-xs">
                                <CheckCircle className="h-3 w-3 inline mr-1" />
                                Completed
                              </div>
                            ) : (
                              <div className="px-2 py-1 bg-blue-600 text-white rounded-full text-xs">
                                Available
                              </div>
                            )}
                          </div>
                          
                          {/* Difficulty Badge */}
                          <div className="absolute top-3 right-3">
                            <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                              getDifficultyBg(story.difficulty)
                            }`}>
                              {story.difficulty.charAt(0).toUpperCase() + story.difficulty.slice(1)}
                            </div>
                          </div>
                        </div>

                        {/* Story Content */}
                        <div className="p-4">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className={`font-bold text-sm line-clamp-1 ${
                              darkMode ? 'text-white' : 'text-gray-900'
                            }`}>
                              {story.title}
                            </h4>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleBookmark(story.id);
                              }}
                              className={`p-1 ${
                                story.isBookmarked
                                  ? 'text-amber-500'
                                  : darkMode
                                    ? 'text-gray-400 hover:text-amber-400'
                                    : 'text-gray-400 hover:text-amber-500'
                              }`}
                            >
                              {story.isBookmarked ? (
                                <BookmarkCheck className="h-4 w-4 fill-current" />
                              ) : (
                                <Bookmark className="h-4 w-4" />
                              )}
                            </button>
                          </div>

                          <p className={`text-xs mb-3 line-clamp-2 ${
                            darkMode ? 'text-gray-400' : 'text-gray-600'
                          }`}>
                            {story.description}
                          </p>

                          {/* Story Metadata */}
                          <div className="flex flex-wrap items-center gap-2 text-xs">
                            <div className={`px-2 py-1 rounded-full ${
                              darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'
                            }`}>
                              {story.level}
                            </div>
                            <div className={`px-2 py-1 rounded-full ${
                              darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'
                            }`}>
                              <Clock className="h-3 w-3 inline mr-1" />
                              {story.duration}
                            </div>
                            <div className={`px-2 py-1 rounded-full ${
                              darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'
                            }`}>
                              <Eye className="h-3 w-3 inline mr-1" />
                              {story.readCount}
                            </div>
                          </div>

                          {/* Author and Rating */}
                          <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-700">
                            <div className="flex items-center gap-2">
                              <div className={`w-6 h-6 rounded-full ${
                                darkMode ? 'bg-gray-700' : 'bg-gray-200'
                              } flex items-center justify-center`}>
                                <Users className="h-3 w-3" />
                              </div>
                              <span className={`text-xs ${
                                darkMode ? 'text-gray-400' : 'text-gray-600'
                              }`}>
                                {story.author}
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Star className="h-3 w-3 text-amber-500 fill-current" />
                              <span className="text-xs font-medium">{story.rating?.toFixed(1)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Reading Progress */}
            <div className={`rounded-2xl p-6 ${
              darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border border-gray-200'
            } shadow-lg`}>
              <h3 className={`text-lg font-bold mb-4 ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                Your Reading Journey
              </h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                      Beginner Stories
                    </span>
                    <span className="font-medium">8/10</span>
                  </div>
                  <div className={`h-2 rounded-full overflow-hidden ${
                    darkMode ? 'bg-gray-700' : 'bg-gray-200'
                  }`}>
                    <div className="h-full bg-gradient-to-r from-green-500 to-emerald-500" style={{ width: '80%' }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                      Intermediate Stories
                    </span>
                    <span className="font-medium">5/15</span>
                  </div>
                  <div className={`h-2 rounded-full overflow-hidden ${
                    darkMode ? 'bg-gray-700' : 'bg-gray-200'
                  }`}>
                    <div className="h-full bg-gradient-to-r from-yellow-500 to-amber-500" style={{ width: '33%' }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                      Advanced Stories
                    </span>
                    <span className="font-medium">2/8</span>
                  </div>
                  <div className={`h-2 rounded-full overflow-hidden ${
                    darkMode ? 'bg-gray-700' : 'bg-gray-200'
                  }`}>
                    <div className="h-full bg-gradient-to-r from-red-500 to-rose-500" style={{ width: '25%' }} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Reading Interface */}
          <div className="lg:w-2/3">
            {!selectedStoryData ? (
              <div className={`rounded-2xl p-8 text-center ${
                darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border border-gray-200'
              } shadow-lg`}>
                <div className="w-20 h-20 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
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
                    className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all font-medium"
                  >
                    Start Reading
                  </button>
                )}
              </div>
            ) : (
              <div className={`rounded-2xl overflow-hidden ${
                darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border border-gray-200'
              } shadow-lg`}>
                {/* Story Header */}
                <div className="relative">
                  <div className="h-48 overflow-hidden">
                    <img
                      src={selectedStoryData.imageUrl}
                      alt={selectedStoryData.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
                  </div>
                  
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                      <div>
                        <h2 className={`text-2xl md:text-3xl font-bold mb-2 ${
                          darkMode ? 'text-white' : 'text-white'
                        }`}>
                          {selectedStoryData.title}
                        </h2>
                        <p className={`text-lg ${darkMode ? 'text-gray-300' : 'text-gray-200'}`}>
                          {selectedStoryData.japaneseTitle}
                        </p>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <button
                          onClick={shareStory}
                          className={`p-2 rounded-full ${
                            darkMode 
                              ? 'bg-white/10 text-white hover:bg-white/20' 
                              : 'bg-white/20 text-white hover:bg-white/30'
                          }`}
                        >
                          <Share2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => toggleLike(selectedStoryData.id)}
                          className={`p-2 rounded-full ${
                            userLiked[selectedStoryData.id]
                              ? 'bg-rose-500 text-white'
                              : darkMode
                                ? 'bg-white/10 text-white hover:bg-white/20'
                                : 'bg-white/20 text-white hover:bg-white/30'
                          }`}
                        >
                          <Heart className={`h-4 w-4 ${userLiked[selectedStoryData.id] ? 'fill-current' : ''}`} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  {/* Story Info Bar */}
                  <div className={`flex flex-wrap items-center gap-3 mb-6 p-4 rounded-xl ${
                    darkMode ? 'bg-gray-900/50' : 'bg-gray-50'
                  }`}>
                    <div className="flex items-center gap-2">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        getDifficultyColor(selectedStoryData.difficulty)
                      }`}>
                        <Target className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <div className="text-xs text-gray-500">Difficulty</div>
                        <div className="font-medium">{selectedStoryData.difficulty.charAt(0).toUpperCase() + selectedStoryData.difficulty.slice(1)}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
                        <Trophy className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <div className="text-xs text-gray-500">JLPT Level</div>
                        <div className="font-medium">{selectedStoryData.level}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                        <Clock className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <div className="text-xs text-gray-500">Reading Time</div>
                        <div className="font-medium">{selectedStoryData.duration}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full flex items-center justify-center">
                        <Star className="h-4 w-4 text-white fill-current" />
                      </div>
                      <div>
                        <div className="text-xs text-gray-500">Rating</div>
                        <div className="font-medium">{selectedStoryData.rating?.toFixed(1)} ★</div>
                      </div>
                    </div>
                  </div>

                  {quizMode ? (
                    /* Quiz Mode */
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
                  ) : (
                    /* Reading Mode */
                    <>
                      {/* Reading Controls */}
                      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6 p-4 rounded-xl bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={handlePrevPage}
                            disabled={currentPage === 0}
                            className={`p-2 rounded-lg ${
                              currentPage === 0
                                ? 'opacity-50 cursor-not-allowed'
                                : 'hover:bg-white dark:hover:bg-gray-700'
                            } ${darkMode ? 'bg-gray-800' : 'bg-white'}`}
                          >
                            <ChevronLeft className="h-5 w-5" />
                          </button>
                          
                          <div className={`px-4 py-2 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                            <div className="text-sm text-gray-500">Page</div>
                            <div className="font-bold">{currentPage + 1} of {selectedStoryData.content?.japanese?.length || 1}</div>
                          </div>
                          
                          <button
                            onClick={handleNextPage}
                            disabled={currentPage === (selectedStoryData.content?.japanese?.length || 1) - 1}
                            className={`p-2 rounded-lg ${
                              currentPage === (selectedStoryData.content?.japanese?.length || 1) - 1
                                ? 'opacity-50 cursor-not-allowed'
                                : 'hover:bg-white dark:hover:bg-gray-700'
                            } ${darkMode ? 'bg-gray-800' : 'bg-white'}`}
                          >
                            <ChevronRight className="h-5 w-5" />
                          </button>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <button
                            onClick={playAudio}
                            className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl hover:shadow-lg transition-all flex items-center gap-2"
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
                              onChange={(e) => setSpeechRate(parseFloat(e.target.value))}
                              className={`px-2 py-1 rounded text-sm ${
                                darkMode 
                                  ? 'bg-gray-800 text-gray-300 border border-gray-700' 
                                  : 'bg-white text-gray-700 border border-gray-300'
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
                              onClick={() => setShowTranslation(!showTranslation)}
                              className="px-4 py-2 mb-6 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-gray-800 dark:to-gray-700 text-blue-700 dark:text-blue-300 rounded-xl hover:shadow transition-all"
                            >
                              {showTranslation ? 'Hide English Translation' : 'Show English Translation'}
                            </button>
                            
                            {showTranslation && currentTranslation && (
                              <div className={`p-6 rounded-xl border animate-fade-in ${
                                darkMode 
                                  ? 'bg-gray-900/50 border-gray-700 text-gray-300' 
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
                          {selectedStoryData.comprehensionQuiz && (
                            <button
                              onClick={() => setQuizMode(true)}
                              className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl hover:shadow-lg transition-all flex items-center gap-2"
                            >
                              <Award className="h-4 w-4" />
                              Take Comprehension Quiz
                            </button>
                          )}
                          
                          <button
                            onClick={() => setShowVocabulary(!showVocabulary)}
                            className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 ${
                              showVocabulary
                                ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300'
                                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                            }`}
                          >
                            <FileText className="h-4 w-4" />
                            {showVocabulary ? 'Hide Vocabulary' : 'Show Vocabulary'}
                          </button>
                          
                          <button
                            onClick={() => setShowCulturalNotes(!showCulturalNotes)}
                            className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 ${
                              showCulturalNotes
                                ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300'
                                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                            }`}
                          >
                            <Lightbulb className="h-4 w-4" />
                            Cultural Notes
                          </button>
                        </div>

                        {/* Vocabulary Panel */}
                        {showVocabulary && selectedStoryData.content?.vocabulary && (
                          <div className={`mb-8 p-6 rounded-xl border animate-fade-in ${
                            darkMode 
                              ? 'bg-gray-900/50 border-gray-700' 
                              : 'bg-indigo-50 border-indigo-200'
                          }`}>
                            <div className="flex items-center justify-between mb-4">
                              <h4 className={`text-lg font-bold flex items-center gap-2 ${
                                darkMode ? 'text-white' : 'text-gray-900'
                              }`}>
                                <FileText className="h-5 w-5 text-indigo-500" />
                                Story Vocabulary
                              </h4>
                              <span className={`px-2 py-1 rounded text-sm ${
                                darkMode ? 'bg-gray-800 text-gray-300' : 'bg-white text-gray-700'
                              }`}>
                                {selectedStoryData.content.vocabulary.length} words
                              </span>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              {selectedStoryData.content.vocabulary.map((vocab, index) => (
                                <div
                                  key={index}
                                  className={`p-3 rounded-lg ${
                                    darkMode ? 'bg-gray-800' : 'bg-white'
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
                        )}

                        {/* Cultural Notes */}
                        {showCulturalNotes && selectedStoryData.culturalNotes && (
                          <div className={`mb-8 p-6 rounded-xl border animate-fade-in ${
                            darkMode 
                              ? 'bg-gray-900/50 border-gray-700' 
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
                              {selectedStoryData.culturalNotes.map((note, index) => (
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
                        )}

                        {/* Progress Indicator */}
                        {selectedStoryData.content?.japanese && 
                         currentPage === selectedStoryData.content.japanese.length - 1 && (
                          <div className={`p-6 rounded-xl border text-center ${
                            darkMode 
                              ? 'bg-gradient-to-r from-green-900/30 to-emerald-900/30 border-green-700' 
                              : 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200'
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
                            {selectedStoryData.comprehensionQuiz && (
                              <button
                                onClick={() => setQuizMode(true)}
                                className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl hover:shadow-lg transition-all font-medium"
                              >
                                Test Your Understanding with Quiz
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Featured Stories */}
            {!selectedStoryData && stories.length > 0 && (
              <div className="mt-6">
                <h3 className={`text-lg font-bold mb-4 ${
                  darkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  Featured Stories
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {stories.slice(0, 3).map((story) => (
                    <div
                      key={story.id}
                      className={`group overflow-hidden rounded-xl border transition-all duration-300 ${
                        darkMode 
                          ? 'bg-gray-800 border-gray-700 hover:border-indigo-500' 
                          : 'bg-white border-gray-200 hover:border-indigo-300'
                      }`}
                      onClick={() => startReading(story.id)}
                    >
                      <div className="h-40 overflow-hidden">
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
                          <span className={`px-2 py-1 rounded text-xs ${
                            getDifficultyBg(story.difficulty)
                          }`}>
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
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className={`mt-12 py-6 border-t ${
        darkMode ? 'border-gray-800 text-gray-500' : 'border-gray-200 text-gray-600'
      }`}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm">
              <p>Japanese Stories • Immerse yourself in authentic Japanese reading</p>
              <p className="mt-1 text-xs opacity-75">
                Practice reading with carefully crafted stories at your level
              </p>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className={`text-sm ${
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
        
        /* Custom scrollbar for dark mode */
        .scrollbar-dark::-webkit-scrollbar {
          width: 8px;
        }
        
        .scrollbar-dark::-webkit-scrollbar-track {
          background: #374151;
          border-radius: 4px;
        }
        
        .scrollbar-dark::-webkit-scrollbar-thumb {
          background: #6B7280;
          border-radius: 4px;
        }
        
        .scrollbar-dark::-webkit-scrollbar-thumb:hover {
          background: #9CA3AF;
        }
      `}</style>
    </div>
  );
};

// Quiz Interface Component
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
                className={`p-6 rounded-xl border ${
                  darkMode ? 'bg-gray-900/50 border-gray-700' : 'bg-white border-gray-200'
                }`}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
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
                      className={`w-full p-4 text-left rounded-xl border transition-all duration-200 ${
                        userAnswers[question.id] === option
                          ? userAnswers[question.id] === question.correctAnswer
                            ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                            : 'border-red-500 bg-red-50 dark:bg-red-900/20'
                          : darkMode
                            ? 'border-gray-700 bg-gray-800 hover:bg-gray-700'
                            : 'border-gray-200 bg-gray-50 hover:bg-gray-100'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-6 h-6 rounded-full border flex items-center justify-center ${
                          userAnswers[question.id] === option
                            ? userAnswers[question.id] === question.correctAnswer
                              ? 'border-green-500 bg-green-500'
                              : 'border-red-500 bg-red-500'
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
                              ? 'text-green-700 dark:text-green-300'
                              : 'text-red-700 dark:text-red-300'
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
                className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium flex-1"
              >
                Submit Quiz
              </button>
              <button
                onClick={resetQuiz}
                className={`px-6 py-3 rounded-xl font-medium ${
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
              className="mt-4 px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition"
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
          <div className="w-24 h-24 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center">
            <Award className="h-12 w-12 text-white" />
          </div>
          <div className="absolute -top-2 -right-2 w-12 h-12 bg-gradient-to-r from-amber-500 to-yellow-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
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
                  ? 'border-green-700 bg-green-900/20'
                  : 'border-green-200 bg-green-50'
                : darkMode
                  ? 'border-red-700 bg-red-900/20'
                  : 'border-red-200 bg-red-50'
            }`}
          >
            <div 
              className="flex items-center justify-between cursor-pointer"
              onClick={() => toggleQuizDetail(result.questionId)}
            >
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  result.isCorrect 
                    ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
                    : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
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
                    darkMode ? 'bg-green-900/30 text-green-300' : 'bg-green-50 text-green-700'
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
          className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl hover:shadow-lg transition-all font-medium flex items-center justify-center gap-2"
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
          className={`px-6 py-3 rounded-xl font-medium flex items-center justify-center gap-2 ${
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