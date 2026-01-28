// pages/Stories.tsx
import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Volume2,
  ChevronRight,
  ChevronLeft,
  Bookmark,
  Star,
  Clock,
  Award,
  Loader2,
  Search,
  Filter,
  Tag,
  X,
  PlayCircle,
  CheckCircle,
  Lock,
  ArrowRight,
  Headphones,
  Eye,
  BarChart,
  Zap,
  TrendingUp,
  Sparkles,
  Menu,
  X as CloseIcon
} from 'lucide-react';
import { 
  getStories, 
  getStoryById, 
  updateStory, 
  getStoriesByLevel,
  type Story as ApiStory,
} from '../service/story.service';
import {
  type Difficulty as ApiDifficulty,
  type JLPT,
  type StoryStatus as ApiStoryStatus
} from "../pages/types/story"

// Local types
type Difficulty = 'beginner' | 'intermediate' | 'advanced';
type StoryStatus = 'locked' | 'available' | 'completed';

interface Story extends Omit<ApiStory, 'difficulty' | 'status'> {
  difficulty: Difficulty;
  status: StoryStatus;
  comprehensionQuiz?: QuizQuestion[];
}

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
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

const Stories = () => {
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
  const [loading, setLoading] = useState(true);
  const [loadingStory, setLoadingStory] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSidebar, setShowSidebar] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState<JLPT | 'ALL'>('N5');
  const [activeTab, setActiveTab] = useState<'reading' | 'quiz'>('reading');

  const selectedStoryData = stories.find(story => story.id === selectedStory);
  const currentSentence = selectedStoryData?.content?.japanese?.[currentPage];
  const currentTranslation = selectedStoryData?.content?.english?.[currentPage];

  // Filtered stories
  const filteredStories = stories.filter(story => {
    const matchesSearch = searchQuery === '' || 
      story.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      story.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLevel = selectedLevel === 'ALL' || story.level === selectedLevel;
    return matchesSearch && matchesLevel;
  });

  // Load stories
  useEffect(() => {
    fetchStories();
  }, []);

  const fetchStories = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await getStories();
      
      if (response.data && response.data.length > 0) {
        const storiesWithQuiz = response.data.map(story => {
          const uiStory: Story = {
            ...story,
            difficulty: convertDifficulty(story.difficulty),
            status: convertStatus(story.status),
            comprehensionQuiz: story.comprehensionQuiz || 
              (story.content?.comprehensionQuiz || [])
          };
          
          return uiStory;
        });
        
        setStories(storiesWithQuiz);
        
        // Select first available story
        const firstAvailable = storiesWithQuiz.find(s => s.status === 'available');
        if (firstAvailable && !selectedStory) {
          setSelectedStory(firstAvailable.id);
        }
      }
    } catch (err) {
      setError('Failed to load stories');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchStoriesByLevel = async (level: JLPT) => {
    try {
      setLoading(true);
      const response = await getStoriesByLevel(level);
      
      if (response.data) {
        const storiesWithQuiz = response.data.map(story => {
          const uiStory: Story = {
            ...story,
            difficulty: convertDifficulty(story.difficulty),
            status: convertStatus(story.status),
            comprehensionQuiz: story.comprehensionQuiz || 
              (story.content?.comprehensionQuiz || [])
          };
          return uiStory;
        });
        
        setStories(storiesWithQuiz);
      }
    } catch (err) {
      setError(`Failed to load ${level} stories`);
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const startReading = async (storyId: string) => {
    try {
      setLoadingStory(true);
      
      let story = stories.find(s => s.id === storyId);
      if (!story) {
        const response = await getStoryById(storyId);
        if (response.data) {
          story = {
            ...response.data,
            difficulty: convertDifficulty(response.data.difficulty),
            status: convertStatus(response.data.status),
            comprehensionQuiz: response.data.comprehensionQuiz || 
              (response.data.content?.comprehensionQuiz || [])
          };
          setStories(prev => [...prev, story!]);
        }
      }

      if (!story || story.status === 'locked') {
        setError('This story is locked');
        return;
      }

      setSelectedStory(storyId);
      setCurrentPage(0);
      setShowTranslation(false);
      setShowVocabulary(false);
      setQuizMode(false);
      setQuizScore(null);
      setUserAnswers({});
      setQuizResults([]);
      setActiveTab('reading');
      
      // Update read count
      setStories(prev => prev.map(s => 
        s.id === storyId ? { ...s, readCount: s.readCount + 1 } : s
      ));

      // Update on server
      await updateStory(storyId, { readCount: (story?.readCount || 0) + 1 });
      
      // Close sidebar on mobile
      if (window.innerWidth < 768) {
        setShowSidebar(false);
      }
      
    } catch (err) {
      setError('Failed to load story');
      console.error('Error:', err);
    } finally {
      setLoadingStory(false);
    }
  };

  const toggleBookmark = async (storyId: string) => {
    const story = stories.find(s => s.id === storyId);
    if (!story) return;

    const newBookmarkStatus = !story.isBookmarked;
    
    setStories(prev => prev.map(s => 
      s.id === storyId ? { ...s, isBookmarked: newBookmarkStatus } : s
    ));

    try {
      await updateStory(storyId, { isBookmarked: newBookmarkStatus });
    } catch (err) {
      setStories(prev => prev.map(s => 
        s.id === storyId ? { ...s, isBookmarked: !newBookmarkStatus } : s
      ));
      setError('Failed to update bookmark');
    }
  };

  const playAudio = () => {
    if (currentSentence) {
      const utterance = new SpeechSynthesisUtterance(currentSentence);
      utterance.lang = 'ja-JP';
      utterance.rate = 0.8;
      utterance.pitch = 1;
      speechSynthesis.speak(utterance);
      setIsPlaying(true);
      utterance.onend = () => setIsPlaying(false);
    }
  };

  const handleLevelSelect = (level: JLPT | 'ALL') => {
    setSelectedLevel(level);
    if (level !== 'ALL') {
      fetchStoriesByLevel(level);
    } else {
      fetchStories();
    }
  };

  const submitQuiz = () => {
    if (!selectedStoryData?.comprehensionQuiz) return;
    
    let score = 0;
    const results: QuizResult[] = [];
    
    selectedStoryData.comprehensionQuiz.forEach(question => {
      const isCorrect = userAnswers[question.id] === question.correctAnswer;
      if (isCorrect) score++;
      
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
  };

  const resetQuiz = () => {
    setQuizMode(false);
    setQuizScore(null);
    setUserAnswers({});
    setQuizResults([]);
    setActiveTab('reading');
  };

  const difficultyColor = (difficulty: Difficulty) => {
    switch (difficulty) {
      case 'beginner': return 'bg-emerald-100 text-emerald-700';
      case 'intermediate': return 'bg-amber-100 text-amber-700';
      case 'advanced': return 'bg-rose-100 text-rose-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const levelColor = (level: JLPT) => {
    switch (level) {
      case 'N5': return 'bg-blue-100 text-blue-700';
      case 'N4': return 'bg-indigo-100 text-indigo-700';
      case 'N3': return 'bg-purple-100 text-purple-700';
      case 'N2': return 'bg-pink-100 text-pink-700';
      case 'N1': return 'bg-rose-100 text-rose-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  // Stats calculation
  const stats = {
    totalStories: stories.length,
    completedStories: stories.filter(s => s.status === 'completed').length,
    totalWords: stories.reduce((sum, story) => sum + story.wordCount, 0),
    bookmarked: stories.filter(s => s.isBookmarked).length,
  };

  if (loading && stories.length === 0) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading stories...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <button
                onClick={() => setShowSidebar(!showSidebar)}
                className="md:hidden p-2 rounded-lg hover:bg-gray-100 mr-2"
              >
                <Menu className="w-5 h-5 text-gray-700" />
              </button>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-xl font-bold text-gray-900">日本物語</h1>
                <span className="text-xs font-medium bg-gradient-to-r from-blue-600 to-purple-600 text-white px-2 py-1 rounded-full">
                  N5-N1
                </span>
              </div>
            </div>
            
            <div className="hidden md:flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search stories..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 bg-gray-100 rounded-lg border-0 focus:ring-2 focus:ring-blue-500 focus:bg-white w-64"
                />
              </div>
              <button className="p-2 hover:bg-gray-100 rounded-lg">
                <TrendingUp className="w-5 h-5 text-gray-700" />
              </button>
              <button className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:opacity-90 transition">
                <Sparkles className="w-4 h-4 inline mr-2" />
                Start Learning
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex gap-6">
          {/* Sidebar - Stories List */}
          <div className={`
            ${showSidebar ? 'translate-x-0' : '-translate-x-full'}
            md:translate-x-0 fixed md:relative inset-y-0 left-0 z-40
            w-80 md:w-96 bg-white border-r border-gray-200 md:border-none
            transform transition-transform duration-300 ease-in-out
            md:block
          `}>
            <div className="h-full overflow-y-auto p-4 md:p-0">
              {/* Sidebar Header */}
              <div className="md:hidden flex justify-between items-center mb-6">
                <h2 className="text-lg font-bold text-gray-900">Stories</h2>
                <button
                  onClick={() => setShowSidebar(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <CloseIcon className="w-5 h-5" />
                </button>
              </div>

              {/* Level Filter */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">JLPT Level</h3>
                <div className="flex flex-wrap gap-2">
                  {(['ALL', 'N5', 'N4', 'N3', 'N2', 'N1'] as const).map(level => (
                    <button
                      key={level}
                      onClick={() => handleLevelSelect(level)}
                      className={`
                        px-3 py-1.5 rounded-full text-sm font-medium transition
                        ${selectedLevel === level 
                          ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white' 
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }
                      `}
                    >
                      {level === 'ALL' ? 'All Levels' : level}
                    </button>
                  ))}
                </div>
              </div>

              {/* Stats */}
              <div className="mb-6">
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl">
                    <div className="text-2xl font-bold text-blue-700">{stats.totalStories}</div>
                    <div className="text-sm text-blue-600">Stories</div>
                  </div>
                  <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 p-4 rounded-xl">
                    <div className="text-2xl font-bold text-emerald-700">{stats.completedStories}</div>
                    <div className="text-sm text-emerald-600">Completed</div>
                  </div>
                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-xl">
                    <div className="text-2xl font-bold text-purple-700">{stats.totalWords}</div>
                    <div className="text-sm text-purple-600">Words</div>
                  </div>
                  <div className="bg-gradient-to-br from-amber-50 to-amber-100 p-4 rounded-xl">
                    <div className="text-2xl font-bold text-amber-700">{stats.bookmarked}</div>
                    <div className="text-sm text-amber-600">Bookmarked</div>
                  </div>
                </div>
              </div>

              {/* Stories List */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3">
                  Stories ({filteredStories.length})
                </h3>
                <div className="space-y-3">
                  {filteredStories.map((story) => (
                    <div
                      key={story.id}
                      onClick={() => startReading(story.id)}
                      className={`
                        p-4 rounded-xl border cursor-pointer transition-all duration-200
                        ${selectedStory === story.id
                          ? 'border-blue-500 bg-gradient-to-r from-blue-50 to-blue-50 shadow-sm'
                          : 'border-gray-200 bg-white hover:border-blue-300 hover:shadow-sm'
                        }
                        ${story.status === 'locked' ? 'opacity-60' : ''}
                      `}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-bold text-gray-900 text-sm">{story.title}</h4>
                            {story.status === 'completed' && (
                              <CheckCircle className="w-4 h-4 text-emerald-500" />
                            )}
                            {story.status === 'locked' && (
                              <Lock className="w-4 h-4 text-gray-400" />
                            )}
                          </div>
                          <p className="text-xs text-gray-600 mb-3 line-clamp-2">
                            {story.description}
                          </p>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleBookmark(story.id);
                          }}
                          className="ml-2 p-1 hover:bg-gray-100 rounded-lg"
                        >
                          {story.isBookmarked ? (
                            <Bookmark className="w-4 h-4 text-blue-600 fill-current" />
                          ) : (
                            <Bookmark className="w-4 h-4 text-gray-400" />
                          )}
                        </button>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${levelColor(story.level)}`}>
                            {story.level}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${difficultyColor(story.difficulty)}`}>
                            {story.difficulty}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {story.duration}
                          </span>
                          <span className="flex items-center gap-1">
                            <Eye className="w-3 h-3" />
                            {story.readCount}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Overlay for mobile sidebar */}
          {showSidebar && (
            <div 
              className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
              onClick={() => setShowSidebar(false)}
            />
          )}

          {/* Main Reading Area */}
          <div className="flex-1">
            {!selectedStoryData ? (
              <div className="bg-white rounded-2xl p-8 text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <BookOpen className="w-12 h-12 text-blue-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">Welcome to Japanese Stories</h2>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  Select a story from the sidebar to start reading and improving your Japanese skills.
                </p>
                <button
                  onClick={() => startReading(stories[0]?.id)}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:opacity-90 transition font-medium"
                >
                  Start with First Story
                </button>
              </div>
            ) : (
              <div className="bg-white rounded-2xl overflow-hidden">
                {/* Story Header */}
                <div className="p-6 border-b border-gray-200">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${levelColor(selectedStoryData.level)}`}>
                          {selectedStoryData.level}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${difficultyColor(selectedStoryData.difficulty)}`}>
                          {selectedStoryData.difficulty}
                        </span>
                        {selectedStoryData.status === 'completed' && (
                          <span className="px-3 py-1 rounded-full text-sm font-medium bg-emerald-100 text-emerald-700">
                            Completed
                          </span>
                        )}
                      </div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">{selectedStoryData.title}</h2>
                      <p className="text-gray-600">{selectedStoryData.japaneseTitle}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {selectedStoryData.comprehensionQuiz && (
                        <button
                          onClick={() => {
                            setActiveTab('quiz');
                            setQuizMode(true);
                          }}
                          className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg hover:opacity-90 transition flex items-center gap-2"
                        >
                          <Award className="w-4 h-4" />
                          Take Quiz
                        </button>
                      )}
                      <button
                        onClick={() => toggleBookmark(selectedStoryData.id)}
                        className="p-2 hover:bg-gray-100 rounded-lg"
                      >
                        {selectedStoryData.isBookmarked ? (
                          <Bookmark className="w-5 h-5 text-blue-600 fill-current" />
                        ) : (
                          <Bookmark className="w-5 h-5 text-gray-400" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Progress and Stats */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-6">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">{selectedStoryData.duration}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">{selectedStoryData.wordCount} words</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Eye className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">{selectedStoryData.readCount} reads</span>
                      </div>
                    </div>
                    {selectedStoryData.content?.japanese && (
                      <div className="text-sm text-gray-600">
                        {currentPage + 1} / {selectedStoryData.content.japanese.length}
                      </div>
                    )}
                  </div>
                </div>

                {/* Content Area */}
                <div className="p-6">
                  {loadingStory ? (
                    <div className="flex justify-center items-center py-12">
                      <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  ) : activeTab === 'quiz' ? (
                    /* Quiz Mode */
                    <div>
                      {quizScore === null ? (
                        <div className="max-w-2xl mx-auto">
                          <h3 className="text-xl font-bold text-gray-900 mb-6">Comprehension Quiz</h3>
                          <div className="space-y-6">
                            {selectedStoryData.comprehensionQuiz?.map((question, index) => (
                              <div key={question.id} className="bg-gray-50 rounded-xl p-6">
                                <div className="flex items-center gap-3 mb-4">
                                  <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                                    {index + 1}
                                  </div>
                                  <h4 className="font-bold text-gray-900">{question.question}</h4>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                  {question.options.map((option, optIndex) => (
                                    <button
                                      key={optIndex}
                                      onClick={() => setUserAnswers(prev => ({
                                        ...prev,
                                        [question.id]: option
                                      }))}
                                      className={`
                                        p-4 text-left rounded-lg border transition-all duration-200
                                        ${userAnswers[question.id] === option
                                          ? userAnswers[question.id] === question.correctAnswer
                                            ? 'border-emerald-500 bg-emerald-50'
                                            : 'border-rose-500 bg-rose-50'
                                          : 'border-gray-200 bg-white hover:border-blue-400'
                                        }
                                      `}
                                    >
                                      <div className="flex items-center gap-3">
                                        <div className={`
                                          w-5 h-5 rounded-full border flex items-center justify-center
                                          ${userAnswers[question.id] === option
                                            ? userAnswers[question.id] === question.correctAnswer
                                              ? 'border-emerald-500 bg-emerald-500'
                                              : 'border-rose-500 bg-rose-500'
                                            : 'border-gray-300'
                                          }
                                        `}>
                                          {userAnswers[question.id] === option && (
                                            <CheckCircle className="w-3 h-3 text-white" />
                                          )}
                                        </div>
                                        {option}
                                      </div>
                                    </button>
                                  ))}
                                </div>
                              </div>
                            ))}
                            
                            <div className="flex gap-4">
                              <button
                                onClick={submitQuiz}
                                disabled={Object.keys(userAnswers).length < selectedStoryData.comprehensionQuiz!.length}
                                className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:opacity-90 transition disabled:opacity-50"
                              >
                                Submit Quiz
                              </button>
                              <button
                                onClick={() => setActiveTab('reading')}
                                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition"
                              >
                                Back to Reading
                              </button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        /* Quiz Results */
                        <div className="max-w-2xl mx-auto">
                          <div className="text-center mb-8">
                            <div className="w-24 h-24 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-full flex items-center justify-center mx-auto mb-6">
                              <div className="text-3xl font-bold text-emerald-700">{quizScore}%</div>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">
                              {quizScore >= 80 ? 'Excellent!' : quizScore >= 60 ? 'Good Job!' : 'Keep Practicing!'}
                            </h3>
                            <p className="text-gray-600">
                              You got {quizResults.filter(r => r.isCorrect).length} out of {quizResults.length} correct
                            </p>
                          </div>

                          <div className="space-y-4 mb-8">
                            {quizResults.map((result, index) => (
                              <div
                                key={result.questionId}
                                className={`p-4 rounded-xl border ${result.isCorrect ? 'border-emerald-200 bg-emerald-50' : 'border-rose-200 bg-rose-50'}`}
                              >
                                <div className="flex items-center gap-3 mb-2">
                                  <div className={`w-6 h-6 rounded-full flex items-center justify-center ${result.isCorrect ? 'bg-emerald-500' : 'bg-rose-500'}`}>
                                    {result.isCorrect ? (
                                      <CheckCircle className="w-4 h-4 text-white" />
                                    ) : (
                                      <X className="w-4 h-4 text-white" />
                                    )}
                                  </div>
                                  <span className="font-medium">Question {index + 1}</span>
                                </div>
                                {!result.isCorrect && (
                                  <div className="ml-9 text-sm text-gray-700">
                                    <div>Correct answer: <span className="font-medium text-emerald-700">{result.correctAnswer}</span></div>
                                    <div className="text-gray-600 mt-1">{result.explanation}</div>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>

                          <div className="flex gap-4">
                            <button
                              onClick={() => {
                                resetQuiz();
                                setCurrentPage(0);
                              }}
                              className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:opacity-90 transition"
                            >
                              Read Again
                            </button>
                            <button
                              onClick={() => {
                                const nextStory = filteredStories.find(s => 
                                  s.id !== selectedStory && s.status !== 'locked'
                                );
                                if (nextStory) startReading(nextStory.id);
                              }}
                              className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition"
                            >
                              Next Story
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    /* Reading Mode */
                    <div className="max-w-3xl mx-auto">
                      <div className="mb-8">
                        {currentSentence && (
                          <>
                            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8 mb-6">
                              <div className="text-2xl md:text-3xl font-bold text-gray-900 text-center leading-relaxed mb-6 font-japanese">
                                {currentSentence}
                              </div>
                              <div className="flex justify-center gap-4">
                                <button
                                  onClick={playAudio}
                                  disabled={isPlaying}
                                  className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:opacity-90 transition flex items-center gap-2"
                                >
                                  {isPlaying ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                  ) : (
                                    <Volume2 className="w-4 h-4" />
                                  )}
                                  Listen
                                </button>
                                <button
                                  onClick={() => setShowTranslation(!showTranslation)}
                                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                                >
                                  {showTranslation ? 'Hide Translation' : 'Show Translation'}
                                </button>
                              </div>
                            </div>

                            {showTranslation && currentTranslation && (
                              <div className="bg-gray-50 rounded-xl p-6 mb-6 animate-fade-in">
                                <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                  <ArrowRight className="w-4 h-4 text-blue-600" />
                                  Translation
                                </h4>
                                <p className="text-gray-700">{currentTranslation}</p>
                              </div>
                            )}

                            {/* Navigation */}
                            <div className="flex justify-between">
                              <button
                                onClick={handlePrevPage}
                                disabled={currentPage === 0}
                                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                              >
                                <ChevronLeft className="w-4 h-4" />
                                Previous
                              </button>
                              <button
                                onClick={handleNextPage}
                                disabled={currentPage === (selectedStoryData.content?.japanese?.length || 1) - 1}
                                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                              >
                                Next
                                <ChevronRight className="w-4 h-4" />
                              </button>
                            </div>
                          </>
                        )}
                      </div>

                      {/* Vocabulary Panel */}
                      {showVocabulary && selectedStoryData.content?.vocabulary && (
                        <div className="mb-8 animate-fade-in">
                          <div className="flex justify-between items-center mb-4">
                            <h4 className="text-lg font-bold text-gray-900">Vocabulary</h4>
                            <button
                              onClick={() => setShowVocabulary(false)}
                              className="text-sm text-gray-500 hover:text-gray-700"
                            >
                              Hide
                            </button>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {selectedStoryData.content.vocabulary.map((vocab, index) => (
                              <div key={index} className="bg-white border border-gray-200 rounded-xl p-4 hover:border-blue-300 transition">
                                <div className="flex justify-between items-start mb-2">
                                  <div>
                                    <div className="font-bold text-gray-900 text-lg">{vocab.word}</div>
                                    <div className="text-sm text-gray-600">{vocab.reading}</div>
                                  </div>
                                  <span className="text-xs font-medium bg-blue-100 text-blue-700 px-2 py-1 rounded">
                                    {vocab.meaning}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Story Complete */}
                      {selectedStoryData.content?.japanese && 
                       currentPage === selectedStoryData.content.japanese.length - 1 && (
                        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-8 text-center">
                          <div className="w-16 h-16 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <CheckCircle className="w-8 h-8 text-white" />
                          </div>
                          <h3 className="text-xl font-bold text-gray-900 mb-2">Story Complete!</h3>
                          <p className="text-gray-600 mb-6">
                            Great job reading through "{selectedStoryData.title}"
                          </p>
                          <div className="flex gap-4 justify-center">
                            <button
                              onClick={() => setCurrentPage(0)}
                              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition"
                            >
                              Read Again
                            </button>
                            {selectedStoryData.comprehensionQuiz && (
                              <button
                                onClick={() => {
                                  setActiveTab('quiz');
                                  setQuizMode(true);
                                }}
                                className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl hover:opacity-90 transition"
                              >
                                Take Quiz
                              </button>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Search Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search stories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-lg border-0 focus:ring-2 focus:ring-blue-500 focus:bg-white"
          />
        </div>
      </div>

      <style jsx>{`
        .font-japanese {
          font-family: -apple-system, BlinkMacSystemFont, 'Hiragino Kaku Gothic ProN', 'Hiragino Sans', Meiryo, sans-serif;
          letter-spacing: 0.5px;
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
        
        .line-clamp-2 {
          overflow: hidden;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
        }
      `}</style>
    </div>
  );
};

export default Stories;