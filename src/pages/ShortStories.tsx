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
  ChevronUp
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

interface ReadingStats {
  storiesRead: number;
  wordsLearned: number;
  readingTime: number;
  streak: number;
}

interface QuizResult {
  questionId: string;
  isCorrect: boolean;
  userAnswer: string;
  correctAnswer: string;
  explanation: string;
}

// Helper to convert API difficulty to UI difficulty
const convertDifficulty = (apiDifficulty: ApiDifficulty): Difficulty => {
  switch (apiDifficulty) {
    case 'BEGINNER': return 'beginner';
    case 'INTERMEDIATE': return 'intermediate';
    case 'ADVANCED': return 'advanced';
    default: return 'beginner';
  }
};

// Helper to convert API status to UI status
const convertStatus = (apiStatus: ApiStoryStatus): StoryStatus => {
  switch (apiStatus) {
    case 'LOCKED': return 'locked';
    case 'AVAILABLE': return 'available';
    case 'COMPLETED': return 'completed';
    case 'ARCHIVED': return 'locked';
    default: return 'available';
  }
};

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
  const [stats, setStats] = useState<ReadingStats>({
    storiesRead: 0,
    wordsLearned: 0,
    readingTime: 0,
    streak: 0
  });

  const selectedStoryData = stories.find(story => story.id === selectedStory);
  const currentSentence = selectedStoryData?.content?.japanese?.[currentPage];
  const currentTranslation = selectedStoryData?.content?.english?.[currentPage];

  // Load stories from API on mount
  useEffect(() => {
    fetchStories();
    loadStatsFromStorage();
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
        
        // Select first available story by default
        const firstAvailable = storiesWithQuiz.find(s => s.status === 'available');
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
console.error(
  'Error loading stats. The stats section is currently under maintenance and we are actively working on it.',
  err
);

    }
  };

  const handleNextPage = () => {
    if (selectedStoryData && selectedStoryData.content?.japanese && 
        currentPage < selectedStoryData.content.japanese.length - 1) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(prev => prev - 1);
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
      // Update on server
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

  const startReading = async (storyId: string) => {
    try {
      // If story is not loaded, fetch it
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

      setSelectedStory(storyId);
      setCurrentPage(0);
      setShowTranslation(false);
      setShowVocabulary(false);
      setQuizMode(false);
      setQuizScore(null);
      setUserAnswers({});
      setQuizResults([]);
      setShowQuizDetails({});
      
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
        wordsLearned: stats.wordsLearned + (story?.wordCount || 0)
      };
      setStats(newStats);
      
      // Save to localStorage
      try {
        localStorage.setItem('readingStats', JSON.stringify(newStats));
      } catch (err) {
        console.error('Failed to save stats:', err);
      }

      // Update read count on server
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

  if (loading && stories.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-blue-50 flex items-center justify-center p-4">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 text-sm">Loading stories...</p>
        </div>
      </div>
    );
  }

  if (error && stories.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-blue-50 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-lg font-bold text-gray-900 mb-2">Error Loading Stories</h2>
          <p className="text-gray-600 text-sm mb-6">{error}</p>
          <button
            onClick={handleRetry}
            className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl hover:shadow-lg transition-all text-sm"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-3 sm:py-6">
        {/* Header */}
        <div className="mb-4 sm:mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start gap-3 mb-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1 flex items-center gap-2">
                <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
                Japanese Stories
              </h1>
              <p className="text-xs sm:text-sm text-gray-600">Read beginner-friendly stories to improve your Japanese</p>
            </div>
            <div className="flex items-center gap-2">
              <button className="px-3 py-1.5 sm:px-4 sm:py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:shadow-lg transition-all flex items-center gap-1.5 text-xs sm:text-sm">
                <Sparkles className="w-3 h-3 sm:w-4 sm:h-4" />
                Daily Challenge
              </button>
            </div>
          </div>

          {error && (
            <div className="mb-3 p-2.5 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
              <p className="text-red-600 text-xs">{error}</p>
            </div>
          )}

          {/* Reading Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 mb-4">
            <div className="bg-white p-2.5 sm:p-3 rounded-xl shadow-sm border">
              <div className="text-lg sm:text-xl font-bold text-purple-600">{stats.storiesRead}</div>
              <div className="text-xs text-gray-600">Stories Read</div>
            </div>
            <div className="bg-white p-2.5 sm:p-3 rounded-xl shadow-sm border">
              <div className="text-lg sm:text-xl font-bold text-green-600">{stats.wordsLearned}</div>
              <div className="text-xs text-gray-600">Words Learned</div>
            </div>
            <div className="bg-white p-2.5 sm:p-3 rounded-xl shadow-sm border">
              <div className="text-lg sm:text-xl font-bold text-blue-600">{stats.readingTime}m</div>
              <div className="text-xs text-gray-600">Reading Time</div>
            </div>
            <div className="bg-white p-2.5 sm:p-3 rounded-xl shadow-sm border">
              <div className="text-lg sm:text-xl font-bold text-amber-600">{stats.streak} days</div>
              <div className="text-xs text-gray-600">Reading Streak</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Stories List */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg overflow-hidden border">
              <div className="p-3 sm:p-4 border-b">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-base sm:text-lg font-bold text-gray-900 flex items-center gap-1.5">
                      <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                      Available Stories
                    </h2>
                    <p className="text-xs text-gray-600 mt-0.5">{stories.length} stories available</p>
                  </div>
                  {loading && (
                    <Loader2 className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600 animate-spin" />
                  )}
                </div>
              </div>

              {stories.length === 0 ? (
                <div className="p-6 text-center">
                  <FileText className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600 text-sm">No stories available yet.</p>
                </div>
              ) : (
                <div className="divide-y max-h-[500px] sm:max-h-[600px] overflow-y-auto">
                  {stories.map((story) => (
                    <div
                      key={story.id}
                      className={`p-3 hover:bg-gray-50 transition ${
                        selectedStory === story.id ? 'bg-blue-50' : ''
                      } ${story.status === 'locked' ? 'opacity-75' : 'cursor-pointer'}`}
                      onClick={() => story.status !== 'locked' && startReading(story.id)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5 mb-1.5 flex-wrap">
                            <h3 className="font-bold text-gray-900 text-sm truncate">
                              {story.title}
                              {story.status === 'locked' && (
                                <Lock className="w-2.5 h-2.5 ml-1.5 inline text-gray-500" />
                              )}
                              {story.status === 'completed' && (
                                <CheckCircle className="w-2.5 h-2.5 ml-1.5 inline text-green-500" />
                              )}
                            </h3>
                            <span className={`px-1.5 py-0.5 rounded text-[10px] sm:text-xs font-medium ${
                              story.difficulty === 'beginner' 
                                ? 'bg-green-100 text-green-700' :
                                story.difficulty === 'intermediate' 
                                ? 'bg-yellow-100 text-yellow-700' :
                                'bg-red-100 text-red-700'
                            }`}>
                              {story.level}
                            </span>
                          </div>
                          
                          <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                            {story.description}
                          </p>
                          
                          <div className="flex items-center gap-2 sm:gap-3 text-xs text-gray-500">
                            <div className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {story.duration}
                            </div>
                            <div className="flex items-center gap-1">
                              <Eye className="w-3 h-3" />
                              {story.readCount}
                            </div>
                          </div>

                          {story.tags && story.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {story.tags.slice(0, 2).map((tag, index) => (
                                <span
                                  key={index}
                                  className="px-1.5 py-0.5 bg-gray-100 text-gray-700 rounded text-[10px]"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>

                        <div className="flex flex-col items-center gap-1.5 ml-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleBookmark(story.id);
                            }}
                            className="text-amber-500 hover:text-amber-600"
                          >
                            {story.isBookmarked ? (
                              <BookmarkCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current" />
                            ) : (
                              <Bookmark className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                            )}
                          </button>
                          {story.status === 'completed' && (
                            <Star className="w-3 h-3 text-yellow-500 fill-current" />
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Reading Tips */}
            <div className="mt-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-3 sm:p-4 border border-blue-200">
              <h3 className="text-sm sm:text-base font-bold text-gray-900 mb-2 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-600" />
                Reading Tips
              </h3>
              <ul className="space-y-1.5">
                <li className="flex items-start gap-1.5">
                  <Volume2 className="w-3 h-3 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-xs">Read aloud for pronunciation</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <Target className="w-3 h-3 text-blue-600 mt-0.5 flex-shrink-0" />
                  <span className="text-xs">Focus on context first</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <TrendingUp className="w-3 h-3 text-purple-600 mt-0.5 flex-shrink-0" />
                  <span className="text-xs">Re-read to build fluency</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Reading Interface */}
          <div className="lg:col-span-2">
            {!selectedStoryData ? (
              <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-6 text-center">
                <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <h2 className="text-lg font-bold text-gray-900 mb-2">No Story Selected</h2>
                <p className="text-gray-600 text-sm mb-4">Select a story from the list to start reading</p>
                {stories.length > 0 && (
                  <button
                    onClick={() => startReading(stories[0].id)}
                    className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl hover:shadow-lg transition-all text-sm"
                  >
                    Start Reading
                  </button>
                )}
              </div>
            ) : (
              <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-3 sm:p-4 border">
                {/* Story Header */}
                <div className="mb-4 sm:mb-6">
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-2 mb-3">
                    <div className="flex-1 min-w-0">
                      <h2 className="text-lg sm:text-xl font-bold text-gray-900 truncate">
                        {selectedStoryData.title}
                      </h2>
                      <p className="text-sm text-gray-600 truncate">
                        {selectedStoryData.japaneseTitle}
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                      {selectedStoryData.comprehensionQuiz && !quizMode && (
                        <button
                          onClick={() => setQuizMode(true)}
                          className="px-2.5 py-1 sm:px-3 sm:py-1.5 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg hover:shadow-lg transition-all flex items-center gap-1 text-xs sm:text-sm"
                        >
                          <Award className="w-3 h-3" />
                          Quiz
                        </button>
                      )}
                      
                      {selectedStoryData.content?.vocabulary && (
                        <button
                          onClick={() => setShowVocabulary(!showVocabulary)}
                          className="px-2.5 py-1 sm:px-3 sm:py-1.5 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition text-xs sm:text-sm"
                        >
                          {showVocabulary ? 'Hide Vocab' : 'Vocab'}
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Progress Bar */}
                  {selectedStoryData.content?.japanese && (
                    <div className="mb-3 sm:mb-4">
                      <div className="flex justify-between text-xs mb-1">
                        <span>Progress</span>
                        <span>
                          {currentPage + 1} / {selectedStoryData.content.japanese.length || 1}
                        </span>
                      </div>
                      <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300"
                          style={{ 
                            width: `${((currentPage + 1) / (selectedStoryData.content.japanese.length || 1)) * 100}%` 
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {quizMode ? (
                  /* Quiz Mode */
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-3 sm:mb-4">Comprehension Quiz</h3>
                    
                    {quizScore === null ? (
                      selectedStoryData.comprehensionQuiz && selectedStoryData.comprehensionQuiz.length > 0 ? (
                        <div className="space-y-3 sm:space-y-4">
                          {selectedStoryData.comprehensionQuiz.map((question, index) => (
                            <div key={question.id} className="p-3 border rounded-xl animate-fade-in">
                              <div className="flex items-center gap-2 mb-2.5">
                                <div className="w-6 h-6 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-sm">
                                  {index + 1}
                                </div>
                                <h4 className="font-semibold text-gray-900 text-sm">
                                  {question.question}
                                </h4>
                              </div>
                              
                              <div className="space-y-2">
                                {question.options.map((option, optIndex) => (
                                  <button
                                    key={optIndex}
                                    onClick={() => setUserAnswers(prev => ({
                                      ...prev,
                                      [question.id]: option
                                    }))}
                                    className={`w-full p-2.5 text-left rounded-lg border transition-all duration-200 text-sm ${
                                      userAnswers[question.id] === option
                                        ? userAnswers[question.id] === question.correctAnswer
                                          ? 'border-green-500 bg-green-50'
                                          : 'border-red-500 bg-red-50'
                                        : 'border-gray-200 hover:bg-gray-50'
                                    }`}
                                  >
                                    <div className="flex items-center gap-2">
                                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                                        userAnswers[question.id] === option
                                          ? userAnswers[question.id] === question.correctAnswer
                                            ? 'border-green-500 bg-green-500'
                                            : 'border-red-500 bg-red-500'
                                          : 'border-gray-300'
                                      }`}>
                                        {userAnswers[question.id] === option && (
                                          <CheckCircle2 className="w-3 h-3 text-white" />
                                        )}
                                      </div>
                                      {option}
                                    </div>
                                  </button>
                                ))}
                              </div>
                            </div>
                          ))}
                          
                          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-2">
                            <button
                              onClick={submitQuiz}
                              disabled={Object.keys(userAnswers).length < selectedStoryData.comprehensionQuiz!.length}
                              className="px-4 py-2.5 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                            >
                              Submit Quiz
                            </button>
                            <button
                              onClick={resetQuiz}
                              className="px-4 py-2.5 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition text-sm"
                            >
                              Back to Story
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-6">
                          <p className="text-gray-600 text-sm">No quiz available for this story.</p>
                          <button
                            onClick={resetQuiz}
                            className="mt-3 px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition text-sm"
                          >
                            Back to Story
                          </button>
                        </div>
                      )
                    ) : (
                      /* Quiz Results */
                      <div className="space-y-4">
                        {/* Results Header */}
                        <div className="text-center py-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200">
                          <div className="text-3xl sm:text-4xl mb-2 animate-bounce">
                            {quizScore! >= 80 ? '🎉' : quizScore! >= 60 ? '👍' : '📚'}
                          </div>
                          <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-1">
                            {quizScore! >= 80 ? 'Excellent!' : quizScore! >= 60 ? 'Good Job!' : 'Keep Practicing!'}
                          </h3>
                          <div className="text-2xl sm:text-3xl font-bold text-blue-600 mb-2">
                            {quizScore}%
                          </div>
                          <p className="text-gray-600 text-sm">
                            {quizResults.filter(r => r.isCorrect).length} of {quizResults.length} correct
                          </p>
                        </div>

                        {/* Detailed Results */}
                        <div className="space-y-3">
                          <h4 className="font-semibold text-gray-900 text-sm">Review Answers:</h4>
                          {quizResults.map((result, index) => (
                            <div 
                              key={result.questionId}
                              className={`p-3 rounded-xl border transition-all duration-300 ${
                                result.isCorrect 
                                  ? 'border-green-200 bg-green-50' 
                                  : 'border-red-200 bg-red-50'
                              }`}
                            >
                              <div 
                                className="flex items-center justify-between cursor-pointer"
                                onClick={() => toggleQuizDetail(result.questionId)}
                              >
                                <div className="flex items-center gap-2">
                                  <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                                    result.isCorrect ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                  }`}>
                                    {result.isCorrect ? (
                                      <CheckCircle2 className="w-4 h-4" />
                                    ) : (
                                      <XCircle className="w-4 h-4" />
                                    )}
                                  </div>
                                  <span className="font-medium text-sm">
                                    Question {index + 1}
                                  </span>
                                </div>
                                {showQuizDetails[result.questionId] ? (
                                  <ChevronUp className="w-4 h-4 text-gray-500" />
                                ) : (
                                  <ChevronDown className="w-4 h-4 text-gray-500" />
                                )}
                              </div>
                              
                              {showQuizDetails[result.questionId] && (
                                <div className="mt-3 pt-3 border-t border-gray-200 space-y-2 animate-slide-down">
                                  <div className="text-sm">
                                    <div className="font-medium text-gray-700">Your answer:</div>
                                    <div className={`ml-2 ${result.isCorrect ? 'text-green-700' : 'text-red-700'}`}>
                                      {result.userAnswer}
                                    </div>
                                  </div>
                                  {!result.isCorrect && (
                                    <div className="text-sm">
                                      <div className="font-medium text-gray-700">Correct answer:</div>
                                      <div className="ml-2 text-green-700">{result.correctAnswer}</div>
                                    </div>
                                  )}
                                  <div className="text-sm">
                                    <div className="font-medium text-gray-700">Explanation:</div>
                                    <div className="ml-2 text-gray-600">{result.explanation}</div>
                                  </div>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-2">
                          <button
                            onClick={() => {
                              resetQuiz();
                              setCurrentPage(0);
                            }}
                            className="px-4 py-2.5 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl hover:shadow-lg transition-all text-sm flex items-center justify-center gap-2"
                          >
                            <RefreshCw className="w-4 h-4" />
                            Read Again
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
                            className="px-4 py-2.5 bg-green-100 text-green-700 rounded-xl hover:bg-green-200 transition text-sm flex items-center justify-center gap-2"
                          >
                            <ChevronRight className="w-4 h-4" />
                            Next Story
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  /* Reading Mode */
                  <>
                    {/* Reading Controls */}
                    {selectedStoryData.content?.japanese && (
                      <div className="flex flex-col sm:flex-row items-center justify-between gap-2 mb-4 sm:mb-6">
                        <div className="flex items-center gap-1.5 sm:gap-2 w-full sm:w-auto justify-between sm:justify-start">
                          <button
                            onClick={handlePrevPage}
                            disabled={currentPage === 0}
                            className="p-1.5 sm:p-2 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition flex-shrink-0"
                          >
                            <ChevronLeft className="w-4 h-4" />
                          </button>
                          
                          <button
                            onClick={playAudio}
                            disabled={isPlaying}
                            className="px-3 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl hover:shadow-lg transition-all flex items-center gap-1.5 text-sm flex-1 sm:flex-none"
                          >
                            {isPlaying ? (
                              <Pause className="w-4 h-4" />
                            ) : (
                              <Volume2 className="w-4 h-4" />
                            )}
                            Listen
                          </button>
                          
                          <button
                            onClick={handleNextPage}
                            disabled={currentPage === (selectedStoryData.content.japanese.length || 1) - 1}
                            className="p-1.5 sm:p-2 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition flex-shrink-0"
                          >
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        </div>
                        
                        <button
                          onClick={() => setShowTranslation(!showTranslation)}
                          className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition text-sm w-full sm:w-auto mt-2 sm:mt-0"
                        >
                          {showTranslation ? 'Hide Translation' : 'Show Translation'}
                        </button>
                      </div>
                    )}

                    {/* Main Reading Area */}
                    <div className="mb-4 sm:mb-6">
                      {currentSentence ? (
                        <div className="text-center mb-4 sm:mb-6">
                          <div className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-3 sm:mb-4 leading-relaxed break-words px-2">
                            {currentSentence}
                          </div>
                          
                          {showTranslation && currentTranslation && (
                            <div className="animate-fade-in">
                              <div className="text-base sm:text-lg text-gray-700 mb-3 p-3 bg-blue-50 rounded-xl">
                                {currentTranslation}
                              </div>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="text-center py-6">
                          <p className="text-gray-600 text-sm">No content available for this story.</p>
                        </div>
                      )}

                      {/* Vocabulary Panel */}
                      {showVocabulary && selectedStoryData.content?.vocabulary && (
                        <div className="mb-4 sm:mb-6 animate-fade-in">
                          <h4 className="text-sm sm:text-base font-semibold text-gray-900 mb-2 sm:mb-3">
                            Vocabulary in This Story
                          </h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                            {selectedStoryData.content.vocabulary.map((vocab, index) => (
                              <div key={index} className="p-2 bg-gray-50 rounded-lg">
                                <div className="font-medium text-gray-900 text-sm">
                                  {vocab.word}
                                </div>
                                <div className="text-xs text-gray-600">
                                  {vocab.reading}
                                </div>
                                <div className="text-xs text-blue-600">
                                  {vocab.meaning}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Reading Tips */}
                      <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-xl">
                        <div className="flex items-start gap-2">
                          <Lightbulb className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                          <div>
                            <div className="font-medium text-yellow-800 mb-1 text-sm">
                              Reading Tip
                            </div>
                            <div className="text-yellow-700 text-xs">
                              Try to understand the sentence without translation first. 
                              Look at individual words if needed, then check the translation.
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Story Completion */}
                    {selectedStoryData.content?.japanese && 
                     currentPage === selectedStoryData.content.japanese.length - 1 && (
                      <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200 text-center">
                        <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-1.5">
                          Story Complete! 🎉
                        </h3>
                        <p className="text-gray-600 text-sm mb-3">
                          Great job reading through the story! Try the comprehension quiz to test your understanding.
                        </p>
                        {selectedStoryData.comprehensionQuiz && (
                          <button
                            onClick={() => setQuizMode(true)}
                            className="px-3 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl hover:shadow-lg transition-all text-sm"
                          >
                            Take Comprehension Quiz
                          </button>
                        )}
                      </div>
                    )}
                  </>
                )}
              </div>
            )}

            {/* Reading Benefits */}
            <div className="mt-4 sm:mt-6 grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3">
              <div className="bg-white p-2.5 sm:p-3 rounded-xl shadow-sm border">
                <div className="flex items-center gap-1.5 mb-1.5">
                  <BookOpen className="w-4 h-4 text-blue-600" />
                  <h4 className="font-semibold text-xs sm:text-sm">Build Vocabulary</h4>
                </div>
                <p className="text-xs text-gray-600">
                  Learn words in context
                </p>
              </div>
              <div className="bg-white p-2.5 sm:p-3 rounded-xl shadow-sm border">
                <div className="flex items-center gap-1.5 mb-1.5">
                  <Headphones className="w-4 h-4 text-green-600" />
                  <h4 className="font-semibold text-xs sm:text-sm">Improve Listening</h4>
                </div>
                <p className="text-xs text-gray-600">
                  Practice pronunciation
                </p>
              </div>
              <div className="bg-white p-2.5 sm:p-3 rounded-xl shadow-sm border">
                <div className="flex items-center gap-1.5 mb-1.5">
                  <TrendingUp className="w-4 h-4 text-purple-600" />
                  <h4 className="font-semibold text-xs sm:text-sm">Gain Confidence</h4>
                </div>
                <p className="text-xs text-gray-600">
                  Read real content
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .line-clamp-2 {
          overflow: hidden;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
        }
        
        .animate-fade-in {
          animation: fadeIn 0.3s ease-out;
        }
        
        .animate-slide-down {
          animation: slideDown 0.3s ease-out;
        }
        
        .animate-bounce {
          animation: bounce 1s infinite;
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
        
        @keyframes slideDown {
          from { 
            opacity: 0; 
            max-height: 0;
            transform: translateY(-10px);
          }
          to { 
            opacity: 1; 
            max-height: 500px;
            transform: translateY(0);
          }
        }
        
        @keyframes bounce {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        
        /* Mobile optimizations */
        @media (max-width: 640px) {
          .text-3xl {
            font-size: 1.75rem;
            line-height: 2.25rem;
          }
          
          .text-2xl {
            font-size: 1.5rem;
            line-height: 2rem;
          }
          
          .text-xl {
            font-size: 1.25rem;
            line-height: 1.75rem;
          }
          
          .break-words {
            word-wrap: break-word;
            overflow-wrap: break-word;
          }
        }
      `}</style>
    </div>
  );
};

export default ShortStories;