import React, { useEffect, useMemo, useRef, useState } from "react";
import { getStoryById } from "../../service/story.service";
import { useParams, useNavigate } from "react-router-dom";
import {
  Volume2,
  Bookmark,
  CheckCircle,
  XCircle,
  Clock,
  BarChart3,
  Hash,
  Trophy,
  BookOpen,
  Languages,
  FileText,
  ClipboardList,
  ChevronRight,
  Play,
  Pause,
  RotateCcw,
  Home,
  ArrowLeft,
  Share2,
  Download,
  Printer,
  Flag,
  MessageSquare,
  ThumbsUp,
  Eye,
  User,
  Calendar,
  Target,
  Award,
  Brain,
  Sparkles,
  Zap,
  Music,
  VolumeX
} from "lucide-react";

// ---------------------
// Types
// ---------------------

type VocabItem = {
  word: string;
  meaning: string;
  reading: string;
  example?: string;
};

type QuizItem = {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  difficulty?: "easy" | "medium" | "hard";
};

type Story = {
  id: string;
  title: string;
  japaneseTitle: string;
  description: string;
  difficulty: string;
  level: string;
  duration: string;
  wordCount: number;
  tags: string[];
  content: {
    english: string[];
    japanese: string[];
    vocabulary: VocabItem[];
  };
  comprehensionQuiz: QuizItem[];
  isBookmarked: boolean;
  readCount: number;
  status: string;
  createdAt: string;
  updatedAt: string;
  author?: string;
  rating?: number;
  likes?: number;
  category?: string;
  culturalNotes?: string[];
  grammarPoints?: string[];
};

type ReadingMode = "parallel" | "separate" | "bilingual";

// ---------------------
// Component
// ---------------------

const StoryPage: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const [story, setStory] = useState<Story | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // UI State
  const [activeTab, setActiveTab] = useState<"read" | "vocab" | "quiz" | "notes">("read");
  const [readingMode, setReadingMode] = useState<ReadingMode>("parallel");
  const [fontSize, setFontSize] = useState<"sm" | "base" | "lg" | "xl">("base");
  const [showFurigana, setShowFurigana] = useState(true);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [userLiked, setUserLiked] = useState(false);

  // Quiz State
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);

  // Voice Synthesis
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [voice, setVoice] = useState<SpeechSynthesisVoice | null>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Toast
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // =====================
  // Initialize Speech Synthesis
  // =====================

  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis;

      const loadVoices = () => {
        const voices = synthRef.current?.getVoices() || [];
        const japaneseVoice = voices.find(v => 
          v.lang?.startsWith('ja') || 
          v.name?.toLowerCase().includes('japanese') ||
          v.name?.toLowerCase().includes('jp')
        );
        setVoice(japaneseVoice || voices.find(v => v.lang?.includes('JP')) || voices[0] || null);
      };

      loadVoices();
      synthRef.current.onvoiceschanged = loadVoices;
    }

    return () => {
      if (synthRef.current?.speaking) synthRef.current.cancel();
    };
  }, []);

  // =====================
  // Fetch Story
  // =====================

  useEffect(() => {
    if (!id) return;

    const fetchStory = async () => {
      try {
        setLoading(true);
        const res = await getStoryById(id);
        const storyData = res.data;
        
        // Enhance story data
        const enhancedStory = {
          ...storyData,
          author: storyData.author || "Unknown Author",
          rating: storyData.rating || 4.5,
          likes: storyData.likes || Math.floor(Math.random() * 500) + 100,
          category: storyData.category || "Japanese Culture",
          culturalNotes: storyData.culturalNotes || [
            "This story reflects traditional Japanese values",
            "Contains common expressions used in daily conversation"
          ],
          grammarPoints: storyData.grammarPoints || [
            "～たい form (desire)",
            "～ている (progressive form)",
            "Casual speech patterns"
          ]
        };
        
        setStory(enhancedStory);
        setIsBookmarked(!!enhancedStory.isBookmarked);
      } catch (e) {
        setError("Failed to load story. Please try again later.");
        console.error("Error fetching story:", e);
      } finally {
        setLoading(false);
      }
    };

    fetchStory();
  }, [id]);

  // =====================
  // Voice Functions
  // =====================

  const createUtterance = (text: string, lang = 'ja-JP') => {
    if (!synthRef.current) return null;
    const u = new SpeechSynthesisUtterance(text);
    u.voice = voice || undefined;
    u.rate = playbackRate;
    u.lang = lang;
    u.onstart = () => {
      setIsPlaying(true);
      setIsPaused(false);
    };
    u.onend = () => {
      setIsPlaying(false);
      setIsPaused(false);
    };
    u.onpause = () => setIsPaused(true);
    u.onresume = () => setIsPaused(false);
    u.onerror = () => {
      setIsPlaying(false);
      setIsPaused(false);
    };
    return u;
  };

  const speakText = (text: string, lang = 'ja-JP') => {
    if (!synthRef.current) {
      setToast('Speech synthesis not supported in your browser');
      return;
    }

    if (synthRef.current.speaking || synthRef.current.paused) {
      synthRef.current.cancel();
    }

    setTimeout(() => {
      const utterance = createUtterance(text, lang);
      if (!utterance) {
        setToast('Unable to prepare speech');
        return;
      }
      utteranceRef.current = utterance;
      synthRef.current?.speak(utterance);
    }, 100);
  };

  const togglePlayPause = () => {
    if (!synthRef.current) return;

    if (isPlaying) {
      synthRef.current.pause();
      setIsPaused(true);
    } else if (isPaused) {
      synthRef.current.resume();
      setIsPaused(false);
    } else {
      const fullText = story?.content.japanese.join('\n') || '';
      speakText(fullText);
    }
  };

  const stopSpeech = () => {
    if (synthRef.current?.speaking || synthRef.current?.paused) {
      synthRef.current.cancel();
      setIsPlaying(false);
      setIsPaused(false);
    }
  };

  const playParagraph = (text: string) => {
    speakText(text);
  };

  const playVocabulary = (word: string) => {
    speakText(word);
  };

  // =====================
  // Quiz Functions
  // =====================

  const handleSelect = (qid: string, option: string) => {
    if (submitted) return;
    setAnswers(prev => ({ ...prev, [qid]: option }));
  };

  const submitQuiz = () => {
    setSubmitted(true);
    setToast('Quiz submitted! Check your results.');
  };

  const resetQuiz = () => {
    setAnswers({});
    setSubmitted(false);
    setQuizStarted(false);
  };

  const startQuiz = () => {
    setQuizStarted(true);
    setActiveTab("quiz");
  };

  const score = useMemo(() => {
    if (!story) return 0;
    return story.comprehensionQuiz.filter(q => answers[q.id] === q.correctAnswer).length;
  }, [submitted, answers, story]);

  const totalQuestions = story?.comprehensionQuiz.length || 0;
  const scorePercentage = totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0;

  // =====================
  // UI Functions
  // =====================

  const toggleBookmark = async () => {
    const newBookmarkState = !isBookmarked;
    setIsBookmarked(newBookmarkState);
    setToast(newBookmarkState ? 'Added to bookmarks' : 'Removed from bookmarks');
    // API call would go here
  };

  const toggleLike = () => {
    setUserLiked(!userLiked);
    // API call would go here
  };

  const shareStory = () => {
    if (navigator.share && story) {
      navigator.share({
        title: story.title,
        text: story.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      setToast('Link copied to clipboard!');
    }
  };

  const getDifficultyColor = (diff: string) => {
    switch (diff.toLowerCase()) {
      case 'beginner': return 'bg-green-100 text-green-800 border-green-200';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'advanced': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'N5': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'N4': return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case 'N3': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'N2': return 'bg-pink-100 text-pink-800 border-pink-200';
      case 'N1': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // =====================
  // Loading and Error States
  // =====================

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center p-4">
        <div className="text-center">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-indigo-200 rounded-full"></div>
            <div className="w-20 h-20 border-4 border-indigo-600 border-t-transparent rounded-full absolute top-0 animate-spin"></div>
          </div>
          <p className="mt-6 text-lg font-medium text-gray-700">Loading your story...</p>
          <p className="text-sm text-gray-500 mt-2">Preparing an immersive reading experience</p>
        </div>
      </div>
    );
  }

  if (error || !story) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center p-6">
        <div className="max-w-md w-full text-center p-8 bg-white rounded-2xl shadow-xl">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <XCircle className="h-8 w-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Story Not Found</h2>
          <p className="text-gray-600 mb-6">{error || "The story you're looking for doesn't exist."}</p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => navigate(-1)}
              className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Go Back
            </button>
            <button
              onClick={() => navigate('/stories')}
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Browse Stories
            </button>
          </div>
        </div>
      </div>
    );
  }

  // =====================
  // Render
  // =====================

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Navigation Bar */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft size={20} />
              <span className="hidden sm:inline">Back to Stories</span>
            </button>
            
            <div className="flex items-center gap-3">
              <button
                onClick={shareStory}
                className="p-2 hover:bg-gray-100 rounded-lg"
                title="Share"
              >
                <Share2 size={20} />
              </button>
              <button
                onClick={() => window.print()}
                className="p-2 hover:bg-gray-100 rounded-lg hidden md:block"
                title="Print"
              >
                <Printer size={20} />
              </button>
              <button
                onClick={toggleBookmark}
                className={`p-2 rounded-lg ${isBookmarked ? 'bg-yellow-50 text-yellow-600' : 'hover:bg-gray-100'}`}
                title={isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
              >
                <Bookmark className={isBookmarked ? 'fill-current' : ''} size={20} />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 rounded-full text-sm mb-4">
                <Sparkles size={14} />
                <span>Japanese Reading Practice</span>
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3 leading-tight">
                {story.title}
              </h1>
              <p className="text-xl md:text-2xl text-indigo-100 mb-4 font-japanese">
                {story.japaneseTitle}
              </p>
              <p className="text-lg text-white/90 max-w-3xl mb-6">
                {story.description}
              </p>
              
              <div className="flex flex-wrap gap-3 items-center">
                <div className="flex items-center gap-2">
                  <User size={18} />
                  <span className="text-sm">{story.author}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar size={18} />
                  <span className="text-sm">{new Date(story.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Eye size={18} />
                  <span className="text-sm">{story.readCount.toLocaleString()} reads</span>
                </div>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="w-full md:w-auto">
              <div className="grid grid-cols-2 md:grid-cols-1 lg:grid-cols-2 gap-3">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white/20 rounded-lg">
                      <Trophy size={20} />
                    </div>
                    <div>
                      <p className="text-sm opacity-90">Difficulty</p>
                      <p className="font-bold">{story.difficulty}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white/20 rounded-lg">
                      <Target size={20} />
                    </div>
                    <div>
                      <p className="text-sm opacity-90">JLPT Level</p>
                      <p className="font-bold">{story.level}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg className="w-full h-12 text-gray-50" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" fill="currentColor" opacity="1"></path>
          </svg>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Reading Controls */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div className="flex-1">
              <h2 className="text-lg font-semibold text-gray-800 mb-3">Reading Settings</h2>
              <div className="flex flex-wrap gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">View:</span>
                  <select
                    value={readingMode}
                    onChange={(e) => setReadingMode(e.target.value as ReadingMode)}
                    className="px-3 py-2 border rounded-lg text-sm"
                  >
                    <option value="parallel">Parallel Text</option>
                    <option value="separate">Separate</option>
                    <option value="bilingual">Bilingual View</option>
                  </select>
                </div>
                
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">Font:</span>
                  <select
                    value={fontSize}
                    onChange={(e) => setFontSize(e.target.value as any)}
                    className="px-3 py-2 border rounded-lg text-sm"
                  >
                    <option value="sm">Small</option>
                    <option value="base">Medium</option>
                    <option value="lg">Large</option>
                    <option value="xl">Extra Large</option>
                  </select>
                </div>
                
                <button
                  onClick={() => setShowFurigana(!showFurigana)}
                  className={`px-3 py-2 rounded-lg text-sm ${showFurigana ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-700'}`}
                >
                  {showFurigana ? 'Hide Furigana' : 'Show Furigana'}
                </button>
              </div>
            </div>

            {/* Voice Controls */}
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <button
                  onClick={togglePlayPause}
                  className={`p-3 rounded-full ${isPlaying ? 'bg-red-600 text-white' : 'bg-indigo-600 text-white'}`}
                >
                  {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                </button>
                
                <button
                  onClick={stopSpeech}
                  className="p-3 hover:bg-gray-200 rounded-full"
                >
                  <RotateCcw size={20} />
                </button>
                
                <div className="flex items-center gap-2">
                  <VolumeX size={16} className="text-gray-500" />
                  <input
                    type="range"
                    min="0.5"
                    max="2"
                    step="0.1"
                    value={playbackRate}
                    onChange={(e) => setPlaybackRate(parseFloat(e.target.value))}
                    className="w-24 accent-indigo-600"
                  />
                  <Music size={16} className="text-gray-500" />
                  <span className="text-sm text-gray-600 w-12">{playbackRate}x</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content Tabs */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:w-2/3">
            {/* Tab Navigation */}
            <div className="flex border-b mb-6 overflow-x-auto">
              {[
                { id: "read", label: "Read", icon: <BookOpen size={18} /> },
                { id: "vocab", label: "Vocabulary", icon: <FileText size={18} /> },
                { id: "quiz", label: "Quiz", icon: <ClipboardList size={18} /> },
                { id: "notes", label: "Notes", icon: <Flag size={18} /> },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-6 py-3 font-medium whitespace-nowrap border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-indigo-600 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              {/* Read Tab */}
              {activeTab === "read" && (
                <div className="p-6 md:p-8">
                  <div className="mb-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-2">Story Content</h3>
                    <p className="text-gray-600">Read the story in Japanese with English translation</p>
                  </div>
                  
                  <div className="space-y-6">
                    {story.content.japanese.map((japaneseLine, index) => (
                      <div key={index} className="group">
                        <div className="flex flex-col md:flex-row gap-4 p-4 hover:bg-gray-50 rounded-xl transition-all duration-200">
                          {/* Japanese Text */}
                          <div className="flex-1">
                            <div className="flex items-start gap-3 mb-2">
                              <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-red-100 text-red-600 rounded-full font-bold">
                                {index + 1}
                              </span>
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <p className={`font-japanese text-gray-800 ${fontSize === 'sm' ? 'text-base' : fontSize === 'lg' ? 'text-xl' : fontSize === 'xl' ? 'text-2xl' : 'text-lg'}`}>
                                    {japaneseLine}
                                  </p>
                                  <button
                                    onClick={() => playParagraph(japaneseLine)}
                                    className="p-2 text-gray-400 hover:text-red-600 rounded-full transition-colors"
                                  >
                                    <Volume2 size={16} />
                                  </button>
                                </div>
                                {showFurigana && (
                                  <p className="text-sm text-gray-500 mt-1">Furigana placeholder</p>
                                )}
                              </div>
                            </div>
                          </div>
                          
                          {/* English Translation */}
                          <div className="md:w-1/2 lg:w-2/5">
                            <div className="bg-blue-50 rounded-lg p-4">
                              <div className="flex items-center gap-2 mb-2">
                                <Languages size={16} className="text-blue-600" />
                                <span className="text-sm font-medium text-blue-700">English Translation</span>
                              </div>
                              <p className="text-gray-700 text-sm leading-relaxed">
                                {story.content.english[index] || "Translation not available"}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Vocabulary Tab */}
              {activeTab === "vocab" && (
                <div className="p-6 md:p-8">
                  <div className="mb-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-2">Vocabulary List</h3>
                    <p className="text-gray-600">Essential words and phrases from this story</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {story.content.vocabulary.map((item, index) => (
                      <div key={index} className="bg-gray-50 rounded-xl p-4 hover:bg-white hover:shadow-md transition-all duration-200">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="text-lg font-bold text-gray-800">{item.word}</h4>
                              <button
                                onClick={() => playVocabulary(item.word)}
                                className="p-1 text-gray-400 hover:text-green-600"
                              >
                                <Volume2 size={14} />
                              </button>
                            </div>
                            <p className="text-sm text-gray-600 mt-1">{item.reading}</p>
                          </div>
                          <span className="px-2 py-1 bg-indigo-100 text-indigo-700 text-xs rounded-lg font-medium">
                            #{index + 1}
                          </span>
                        </div>
                        
                        <div className="mb-3">
                          <div className="flex items-center gap-2 text-gray-700">
                            <ChevronRight size={14} className="text-green-500" />
                            <span className="text-sm font-medium">{item.meaning}</span>
                          </div>
                        </div>
                        
                        {item.example && (
                          <div className="bg-white rounded-lg p-3 border border-gray-200">
                            <p className="text-xs text-gray-600 mb-1">Example:</p>
                            <p className="text-sm text-gray-700 italic">{item.example}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Quiz Tab */}
              {activeTab === "quiz" && (
                <div className="p-6 md:p-8">
                  <div className="mb-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-2">Comprehension Quiz</h3>
                    <p className="text-gray-600">Test your understanding of the story</p>
                  </div>
                  
                  {!quizStarted ? (
                    <div className="text-center py-12">
                      <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Brain size={32} className="text-indigo-600" />
                      </div>
                      <h4 className="text-xl font-bold text-gray-800 mb-2">Ready for the Challenge?</h4>
                      <p className="text-gray-600 mb-6 max-w-md mx-auto">
                        This quiz contains {totalQuestions} questions based on the story you just read.
                      </p>
                      <div className="flex gap-3 justify-center">
                        <button
                          onClick={startQuiz}
                          className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all"
                        >
                          Start Quiz
                        </button>
                        <button
                          onClick={() => setActiveTab("read")}
                          className="px-8 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
                        >
                          Review Story
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {story.comprehensionQuiz.map((question, index) => {
                        const isAnswered = !!answers[question.id];
                        const isCorrect = submitted && answers[question.id] === question.correctAnswer;
                        const isIncorrect = submitted && answers[question.id] && answers[question.id] !== question.correctAnswer;
                        const isRightAnswer = submitted && question.correctAnswer;

                        return (
                          <div
                            key={question.id}
                            className={`border rounded-xl p-5 transition-all duration-300 ${
                              isCorrect
                                ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200'
                                : isIncorrect
                                ? 'bg-gradient-to-r from-red-50 to-pink-50 border-red-200'
                                : 'border-gray-200 hover:border-indigo-300'
                            }`}
                          >
                            <div className="flex items-start gap-4 mb-4">
                              <div className={`flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-lg ${
                                isCorrect
                                  ? 'bg-green-100 text-green-600'
                                  : isIncorrect
                                  ? 'bg-red-100 text-red-600'
                                  : 'bg-indigo-100 text-indigo-600'
                              }`}>
                                <span className="font-bold">{index + 1}</span>
                              </div>
                              <div className="flex-1">
                                <h4 className="font-semibold text-gray-800 mb-3">{question.question}</h4>
                                
                                <div className="grid md:grid-cols-2 gap-3">
                                  {question.options.map((option, optIndex) => {
                                    const isSelected = answers[question.id] === option;
                                    const isActuallyCorrect = option === question.correctAnswer;
                                    const isDisabled = submitted;

                                    return (
                                      <button
                                        key={optIndex}
                                        onClick={() => handleSelect(question.id, option)}
                                        disabled={isDisabled}
                                        className={`p-4 text-left rounded-lg border transition-all duration-200 ${
                                          isSelected
                                            ? isActuallyCorrect
                                              ? 'border-green-500 bg-green-50 text-green-700'
                                              : 'border-red-500 bg-red-50 text-red-700'
                                            : submitted && isActuallyCorrect
                                            ? 'border-green-300 bg-green-25 text-green-600'
                                            : 'border-gray-200 hover:border-indigo-300 hover:bg-indigo-50'
                                        } ${isDisabled ? 'cursor-default' : 'cursor-pointer'}`}
                                      >
                                        <div className="flex items-center gap-3">
                                          <div className={`w-6 h-6 flex items-center justify-center rounded-full border ${
                                            isSelected
                                              ? isActuallyCorrect
                                                ? 'border-green-500 bg-green-500'
                                                : 'border-red-500 bg-red-500'
                                              : submitted && isActuallyCorrect
                                              ? 'border-green-500 bg-green-500'
                                              : 'border-gray-300'
                                          }`}>
                                            {isSelected || (submitted && isActuallyCorrect) ? (
                                              <CheckCircle className="h-4 w-4 text-white" />
                                            ) : (
                                              <div className="w-2 h-2 bg-gray-400 rounded-full" />
                                            )}
                                          </div>
                                          <span className="font-medium flex-1">{option}</span>
                                          {submitted && isActuallyCorrect && (
                                            <Award size={16} className="text-green-500" />
                                          )}
                                        </div>
                                      </button>
                                    );
                                  })}
                                </div>

                                {submitted && (
                                  <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-100">
                                    <div className="flex items-start gap-2">
                                      <Zap size={18} className="text-blue-600 mt-0.5" />
                                      <div>
                                        <p className="font-medium text-blue-700 mb-1">Explanation</p>
                                        <p className="text-gray-700 text-sm">{question.explanation}</p>
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}

                      {/* Quiz Actions */}
                      <div className="sticky bottom-0 bg-white border-t p-6 rounded-xl shadow-lg">
                        {!submitted ? (
                          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                            <div className="flex-1">
                              <div className="mb-2">
                                <div className="flex justify-between text-sm text-gray-600 mb-1">
                                  <span>Progress</span>
                                  <span>{Object.keys(answers).length}/{totalQuestions}</span>
                                </div>
                                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                                  <div
                                    className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500"
                                    style={{ width: `${(Object.keys(answers).length / Math.max(totalQuestions, 1)) * 100}%` }}
                                  />
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex gap-3">
                              <button
                                onClick={submitQuiz}
                                disabled={Object.keys(answers).length !== totalQuestions}
                                className={`px-8 py-3 rounded-lg font-medium transition-all ${
                                  Object.keys(answers).length === totalQuestions
                                    ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:shadow-lg'
                                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                }`}
                              >
                                Submit Quiz
                              </button>
                              <button
                                onClick={resetQuiz}
                                className="px-8 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
                              >
                                Reset
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="text-center">
                            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full mb-4 relative">
                              <div className="text-white text-center">
                                <div className="text-3xl font-bold">{score}</div>
                                <div className="text-sm opacity-90">/{totalQuestions}</div>
                              </div>
                              <div className="absolute inset-0 border-4 border-green-300 rounded-full animate-ping opacity-50"></div>
                            </div>
                            
                            <h4 className="text-2xl font-bold text-gray-800 mb-2">
                              {scorePercentage >= 90 ? 'Masterful! 🏆' : 
                               scorePercentage >= 75 ? 'Excellent! 🎉' : 
                               scorePercentage >= 60 ? 'Good Job! 👍' : 
                               'Keep Practicing! 📚'}
                            </h4>
                            <p className="text-gray-600 mb-6">
                              You scored {score} out of {totalQuestions} ({scorePercentage}%)
                            </p>
                            
                            <div className="flex flex-col sm:flex-row gap-3 justify-center">
                              <button
                                onClick={resetQuiz}
                                className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:shadow-lg"
                              >
                                Try Again
                              </button>
                              <button
                                onClick={() => setActiveTab("read")}
                                className="px-8 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
                              >
                                Review Story
                              </button>
                              <button
                                onClick={() => navigate('/stories')}
                                className="px-8 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
                              >
                                More Stories
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Notes Tab */}
              {activeTab === "notes" && (
                <div className="p-6 md:p-8">
                  <div className="mb-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-2">Study Notes</h3>
                    <p className="text-gray-600">Additional insights and learning points</p>
                  </div>
                  
                  <div className="space-y-6">
                    {/* Cultural Notes */}
                    <div className="bg-yellow-50 rounded-xl p-5 border border-yellow-200">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-yellow-100 rounded-lg">
                          <Flag size={20} className="text-yellow-600" />
                        </div>
                        <h4 className="text-lg font-semibold text-gray-800">Cultural Notes</h4>
                      </div>
                      <ul className="space-y-3">
                        {story.culturalNotes?.map((note, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></div>
                            <p className="text-gray-700">{note}</p>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    {/* Grammar Points */}
                    <div className="bg-blue-50 rounded-xl p-5 border border-blue-200">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <FileText size={20} className="text-blue-600" />
                        </div>
                        <h4 className="text-lg font-semibold text-gray-800">Grammar Points</h4>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {story.grammarPoints?.map((point, index) => (
                          <div key={index} className="bg-white rounded-lg p-3 border">
                            <p className="text-sm font-medium text-gray-800">{point}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {/* Study Tips */}
                    <div className="bg-green-50 rounded-xl p-5 border border-green-200">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-green-100 rounded-lg">
                          <Sparkles size={20} className="text-green-600" />
                        </div>
                        <h4 className="text-lg font-semibold text-gray-800">Study Tips</h4>
                      </div>
                      <ul className="space-y-3">
                        <li className="flex items-start gap-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                          <p className="text-gray-700">Read aloud to practice pronunciation</p>
                        </li>
                        <li className="flex items-start gap-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                          <p className="text-gray-700">Review vocabulary before reading</p>
                        </li>
                        <li className="flex items-start gap-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                          <p className="text-gray-700">Try to understand context before looking at translation</p>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="lg:w-1/3">
            <div className="space-y-6">
              {/* Stats Card */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Story Statistics</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Word Count</span>
                    <span className="font-bold">{story.wordCount}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Reading Time</span>
                    <span className="font-bold">{story.duration}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Difficulty</span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(story.difficulty)}`}>
                      {story.difficulty}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">JLPT Level</span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getLevelColor(story.level)}`}>
                      {story.level}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Popularity</span>
                    <div className="flex items-center gap-1">
                      <Eye size={14} className="text-gray-500" />
                      <span className="font-bold">{story.readCount}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tags Card */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {story.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition-colors cursor-pointer"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Actions Card */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <button
                    onClick={toggleBookmark}
                    className="w-full flex items-center justify-between p-3 rounded-lg border hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Bookmark className={isBookmarked ? 'fill-yellow-400 text-yellow-400' : 'text-gray-400'} size={20} />
                      <span className="font-medium">{isBookmarked ? 'Remove Bookmark' : 'Add Bookmark'}</span>
                    </div>
                    <ChevronRight size={16} className="text-gray-400" />
                  </button>
                  
                  <button
                    onClick={toggleLike}
                    className="w-full flex items-center justify-between p-3 rounded-lg border hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <ThumbsUp className={userLiked ? 'fill-blue-500 text-blue-500' : 'text-gray-400'} size={20} />
                      <span className="font-medium">Like Story</span>
                    </div>
                    <span className="text-sm text-gray-600">{story.likes}</span>
                  </button>
                  
                  <button
                    onClick={shareStory}
                    className="w-full flex items-center justify-between p-3 rounded-lg border hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Share2 size={20} className="text-gray-400" />
                      <span className="font-medium">Share</span>
                    </div>
                    <ChevronRight size={16} className="text-gray-400" />
                  </button>
                  
                  <button
                    onClick={() => window.print()}
                    className="w-full flex items-center justify-between p-3 rounded-lg border hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Printer size={20} className="text-gray-400" />
                      <span className="font-medium">Print</span>
                    </div>
                    <ChevronRight size={16} className="text-gray-400" />
                  </button>
                </div>
              </div>

              {/* Related Stories Card */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">You Might Also Like</h3>
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="p-3 rounded-lg border hover:bg-gray-50 cursor-pointer transition-colors">
                      <h4 className="font-medium text-gray-800 mb-1">Similar Story {i}</h4>
                      <p className="text-sm text-gray-600 truncate">Short description of related story...</p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-xs px-2 py-1 bg-gray-100 rounded">N{Math.floor(Math.random() * 5) + 1}</span>
                        <span className="text-xs text-gray-500">•</span>
                        <span className="text-xs text-gray-500">5 min read</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Toast Notification */}
      {toast && (
        <div className="fixed left-1/2 bottom-8 -translate-x-1/2 z-50">
          <div className="bg-gray-900 text-white px-6 py-3 rounded-full shadow-lg animate-bounce-in">
            <div className="flex items-center gap-2">
              <CheckCircle size={18} className="text-green-400" />
              <span>{toast}</span>
            </div>
          </div>
        </div>
      )}

      {/* Custom Styles */}
      <style>{`
        .font-japanese {
          font-family: 'Hiragino Kaku Gothic Pro', 'Meiryo', 'MS PGothic', sans-serif;
        }
        
        .animate-bounce-in {
          animation: bounceIn 0.5s ease-out;
        }
        
        @keyframes bounceIn {
          0% {
            opacity: 0;
            transform: translate(-50%, 100px) scale(0.3);
          }
          50% {
            opacity: 1;
            transform: translate(-50%, -20px) scale(1.1);
          }
          70% {
            transform: translate(-50%, 10px) scale(0.9);
          }
          100% {
            transform: translate(-50%, 0) scale(1);
          }
        }
        
        .bg-green-25 {
          background-color: rgba(16, 185, 129, 0.1);
        }
        
        ::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        
        ::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 4px;
        }
        
        ::-webkit-scrollbar-thumb {
          background: #888;
          border-radius: 4px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: #555;
        }
      `}</style>
    </div>
  );
};

export default StoryPage;