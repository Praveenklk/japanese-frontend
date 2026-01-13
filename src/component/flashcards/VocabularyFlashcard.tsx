// components/VocabularyFlashcard.tsx
import React, { useState, useEffect } from 'react';
import {
  Volume2,
  VolumeX,
  Bookmark,
  ChevronLeft,
  ChevronRight,
  Heart,
  Share2,
  Maximize2,
  Minimize2,
  RotateCw,
  Loader2,
  Star,
  Award,
  Clock,
  Zap,
  CheckCircle,
  XCircle,
  Sparkles,
  Eye,
  EyeOff,
  AlertCircle,
  Target,
  Brain,
  ChevronUp,
  ChevronDown,
  Lightbulb,
  Users,
  Book,
  Calendar,
  TrendingUp,
  Target as TargetIcon,
  Flame,
  Brain as BrainIcon,
  Timer,
  CheckSquare,
  XSquare,
  HelpCircle
} from 'lucide-react';
import type { Vocabulary } from '../../pages/types/vocabulary';

interface VocabularyFlashcardProps {
  word: Vocabulary;
  showAnswer: boolean;
  showTranslation: boolean;
  audioPlaying: boolean;
  isReviewing: boolean;
  currentIndex: number;
  totalCards: number;
  onShowAnswer: () => void;
  onToggleTranslation: () => void;
  onPlayAudio: (text: string) => void;
  onStopAudio: () => void;
  onReview: (rating: 'again' | 'good' | 'easy') => void;
  onToggleBookmark: () => void;
  onNextCard: () => void;
  onPrevCard: () => void;
  fullscreen: boolean;
  showHints: boolean;
}

const VocabularyFlashcard: React.FC<VocabularyFlashcardProps> = ({
  word,
  showAnswer,
  showTranslation,
  audioPlaying,
  isReviewing,
  currentIndex,
  totalCards,
  onShowAnswer,
  onToggleTranslation,
  onPlayAudio,
  onStopAudio,
  onReview,
  onToggleBookmark,
  onNextCard,
  onPrevCard,
  fullscreen,
  showHints
}) => {
  const [isFlipping, setIsFlipping] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showHint, setShowHint] = useState(false);

  useEffect(() => {
    if (showAnswer && word.correctCount > 0) {
      setShowConfetti(true);
      const timer = setTimeout(() => setShowConfetti(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [showAnswer, word.correctCount]);

  const handleShowAnswer = () => {
    setIsFlipping(true);
    setTimeout(() => {
      onShowAnswer();
      setIsFlipping(false);
    }, 300);
  };

  const handleReview = (rating: 'again' | 'good' | 'easy') => {
    onReview(rating);
    setShowHint(false);
  };

  const getDueStatus = (nextReviewDate?: Date) => {
    if (!nextReviewDate) return 'New';
    const now = new Date();
    const reviewDate = new Date(nextReviewDate);
    
    if (reviewDate <= now) return 'Overdue';
    if (reviewDate <= new Date(now.getTime() + 24 * 60 * 60 * 1000)) return 'Due Soon';
    return 'Scheduled';
  };

  const getDueStatusColor = (status: string) => {
    switch(status) {
      case 'Overdue': return 'bg-gradient-to-r from-rose-500 to-pink-500';
      case 'Due Soon': return 'bg-gradient-to-r from-amber-500 to-orange-500';
      default: return 'bg-gradient-to-r from-emerald-500 to-teal-500';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch(difficulty) {
      case 'BEGINNER': return 'from-emerald-400 to-green-500';
      case 'INTERMEDIATE': return 'from-amber-400 to-orange-500';
      case 'ADVANCED': return 'from-rose-400 to-red-500';
      default: return 'from-blue-400 to-cyan-500';
    }
  };

  if (!word) return null;

  return (
    <div className={`${fullscreen ? 'h-screen' : 'min-h-screen'} relative overflow-hidden`}>
      {/* Confetti Effect */}
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none z-50">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 animate-confetti"
              style={{
                left: `${Math.random() * 100}%`,
                top: '-10%',
                animationDelay: `${Math.random() * 2}s`,
                backgroundColor: ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57'][i % 5]
              }}
            />
          ))}
        </div>
      )}

      {/* Main Container */}
      <div className={`${fullscreen ? 'p-0' : 'p-4 lg:p-6'} max-w-6xl mx-auto h-full`}>
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="mb-6">
            {/* Progress Bar */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold">
                    {currentIndex + 1}
                  </div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-white border-2 border-blue-500 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-600"></div>
                  </div>
                </div>
                <div className="text-sm text-gray-600">
                  <span className="font-bold text-gray-900">{currentIndex + 1}</span>
                  <span className="mx-1">of</span>
                  <span className="font-bold text-gray-900">{totalCards}</span>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <button
                  onClick={onToggleBookmark}
                  className={`p-2 rounded-lg transition-all duration-300 transform hover:scale-110 ${
                    word.isBookmarked 
                      ? 'text-amber-500 bg-gradient-to-br from-amber-50 to-yellow-50 shadow-lg' 
                      : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Bookmark className={`w-5 h-5 ${word.isBookmarked ? 'fill-current' : ''}`} />
                </button>
                
                <div className="flex gap-2">
                  <span className={`px-3 py-1.5 rounded-full text-xs font-semibold text-white ${getDueStatusColor(getDueStatus(word.nextReviewAt))}`}>
                    {getDueStatus(word.nextReviewAt)}
                  </span>
                  <span className={`px-3 py-1.5 rounded-full text-xs font-semibold ${
                    word.isLearned 
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white' 
                      : 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white'
                  }`}>
                    {word.isLearned ? '🎓 Mastered' : '📚 Learning'}
                  </span>
                </div>
              </div>
            </div>

            {/* Progress Indicator */}
            <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transition-all duration-700 ease-out"
                style={{ width: `${((currentIndex + 1) / totalCards) * 100}%` }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
              </div>
            </div>
          </div>

          {/* Main Flashcard Area */}
          <div className="flex-1 flex flex-col">
            {/* Flashcard Container */}
            <div className={`relative flex-1 ${fullscreen ? '' : 'mb-6'}`}>
              {/* Card Background Glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-purple-50/30 to-pink-50/50 rounded-3xl blur-xl"></div>
              
              {/* The Flashcard */}
              <div 
                className={`relative h-full bg-white rounded-3xl shadow-2xl border border-gray-200/50 overflow-hidden transition-all duration-500 ${
                  isFlipping ? 'scale-95 opacity-90' : 'scale-100 opacity-100'
                }`}
              >
                {/* Card Header */}
                <div className="p-6 border-b border-gray-100">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className={`px-4 py-2 rounded-xl text-sm font-bold text-white bg-gradient-to-r ${getDifficultyColor(word.difficulty)} shadow-lg`}>
                      {word.difficulty}
                    </span>
                    <span className="px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl text-sm font-bold shadow-lg">
                      {word.jlptLevel}
                    </span>
                    <span className="px-4 py-2 bg-gradient-to-r from-gray-600 to-gray-800 text-white rounded-xl text-sm font-bold shadow-lg">
                      {word.category}
                    </span>
                    
                    {/* Stats */}
                    <div className="ml-auto flex items-center gap-6">
                      <div className="text-center">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <BrainIcon className="w-4 h-4" />
                          <span className="font-bold text-gray-900">{word.reviews}</span>
                        </div>
                        <div className="text-xs text-gray-400">Reviews</div>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center gap-2 text-sm">
                          <TargetIcon className="w-4 h-4 text-emerald-500" />
                          <span className="font-bold text-emerald-600">{Math.round((word.correctCount / Math.max(word.reviews, 1)) * 100)}%</span>
                        </div>
                        <div className="text-xs text-gray-400">Accuracy</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-8 lg:p-12 h-[calc(100%-88px)]">
                  {!showAnswer ? (
                    /* Front Side - Question */
                    <div className="h-full flex flex-col items-center justify-center animate-fade-in">
                      {/* Japanese Characters */}
                      <div className="mb-8 text-center">
                        <div className="text-6xl lg:text-7xl font-bold text-gray-900 font-japanese leading-tight mb-6">
                          {word.japanese}
                        </div>
                        <div className="text-2xl lg:text-3xl text-gray-600 font-mono tracking-wider">
                          {word.reading}
                        </div>
                      </div>

                      {/* Hint Button */}
                      {showHint && (
                        <div className="mb-8 animate-slide-up">
                          <div className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl border border-blue-200 max-w-md">
                            <div className="flex items-start gap-3">
                              <Lightbulb className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0" />
                              <div className="text-sm text-gray-700">
                                <span className="font-semibold text-gray-900">Hint:</span> This word is often used in {word.category.toLowerCase()} contexts.
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Show Answer Button */}
                      <div className="mt-8">
                        <button
                          onClick={handleShowAnswer}
                          disabled={isReviewing}
                          className="group relative px-12 py-5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                          <div className="relative flex items-center gap-3">
                            <Lightbulb className="w-6 h-6" />
                            <span className="font-bold text-lg">Show Answer</span>
                          </div>
                        </button>
                        
                        {/* Hint Toggle */}
                        <button
                          onClick={() => setShowHint(!showHint)}
                          className="mt-4 mx-auto flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition-colors"
                        >
                          {showHint ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          <span>{showHint ? 'Hide Hint' : 'Show Hint'}</span>
                        </button>
                      </div>

                      {/* Keyboard Shortcut Hint */}
                      <div className="mt-6 text-xs text-gray-400">
                        Press <kbd className="px-2 py-1 bg-gray-100 rounded-md">Space</kbd> to reveal answer
                      </div>
                    </div>
                  ) : (
                    /* Back Side - Answer */
                    <div className="h-full flex flex-col animate-fade-in">
                      {/* English Meaning */}
                      <div className="text-center mb-8">
                        <div className="inline-block mb-2">
                          <div className="px-4 py-1.5 bg-gradient-to-r from-emerald-500 to-green-500 text-white text-sm font-bold rounded-full">
                            ANSWER
                          </div>
                        </div>
                        <div className="text-4xl lg:text-5xl font-bold text-gray-900 mb-3">
                          {word.english}
                        </div>
                        {word.pronunciation && (
                          <div className="text-lg text-gray-500 font-mono">
                            /{word.pronunciation}/
                          </div>
                        )}
                      </div>

                      {/* Details Section */}
                      <div className="grid lg:grid-cols-2 gap-6 mb-8">
                        {/* Example Sentence */}
                        {word.example && (
                          <div className="bg-gradient-to-br from-blue-50/80 to-white p-6 rounded-2xl border border-blue-200/50 shadow-sm">
                            <div className="flex items-center gap-3 mb-4">
                              <div className="p-2 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg">
                                <Book className="w-5 h-5 text-white" />
                              </div>
                              <h4 className="font-bold text-gray-900">Example Usage</h4>
                            </div>
                            <div className="space-y-4">
                              <div className="text-xl font-medium text-gray-900 font-japanese leading-relaxed">
                                {word.example}
                              </div>
                              <div className="text-gray-600 font-mono text-sm">
                                {word.exampleReading}
                              </div>
                              <div className="text-gray-700 border-t border-gray-100 pt-3">
                                "{word.exampleEnglish}"
                              </div>
                            </div>
                            <button
                              onClick={() => onPlayAudio(word.example || '')}
                              className="mt-4 flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm font-medium"
                            >
                              <Volume2 className="w-4 h-4" />
                              <span>Listen to pronunciation</span>
                            </button>
                          </div>
                        )}

                        {/* Additional Info */}
                        <div className="bg-gradient-to-br from-gray-50 to-white p-6 rounded-2xl border border-gray-200/50 shadow-sm">
                          <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-gradient-to-br from-gray-600 to-gray-800 rounded-lg">
                              <Brain className="w-5 h-5 text-white" />
                            </div>
                            <h4 className="font-bold text-gray-900">Memory Stats</h4>
                          </div>
                          <div className="space-y-4">
                            <div className="flex justify-between items-center">
                              <span className="text-gray-600">Interval</span>
                              <span className="font-bold text-gray-900 flex items-center gap-2">
                                <Timer className="w-4 h-4" />
                                {word.intervalDays} days
                              </span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-gray-600">Ease Factor</span>
                              <span className="font-bold text-emerald-600">250%</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-gray-600">Next Review</span>
                              <span className="font-bold text-blue-600">
                                {word.nextReviewAt ? new Date(word.nextReviewAt).toLocaleDateString() : 'Now'}
                              </span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-gray-600">Mastery Level</span>
                              <div className="flex items-center gap-1">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`w-4 h-4 ${i < Math.min(5, Math.floor(word.correctCount / 3)) ? 'text-amber-500 fill-current' : 'text-gray-300'}`}
                                  />
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Review Buttons */}
                      <div className="mt-auto pt-6">
                        <div className="text-center mb-6">
                          <h4 className="font-bold text-gray-900 text-lg mb-2">Rate your recall</h4>
                          <p className="text-gray-500 text-sm">Select how well you remembered this card</p>
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                          {[
                            { rating: 'again', label: 'Again', color: 'rose', icon: XCircle, days: 1 },
                            { rating: 'good', label: 'Good', color: 'amber', icon: CheckCircle, days: word.intervalDays * 2 },
                            { rating: 'easy', label: 'Easy', color: 'emerald', icon: Award, days: word.intervalDays * 3 }
                          ].map(({ rating, label, color, icon: Icon, days }) => (
                            <button
                              key={rating}
                              onClick={() => handleReview(rating as any)}
                              disabled={isReviewing}
                              className={`group p-5 bg-gradient-to-b from-white to-gray-50 border-2 border-${color}-200 hover:border-${color}-300 rounded-2xl hover:shadow-xl transition-all duration-300 hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed`}
                            >
                              <div className="flex flex-col items-center gap-4">
                                <div className={`p-3 bg-gradient-to-br from-${color}-100 to-${color}-50 rounded-xl group-hover:scale-110 transition-transform duration-300`}>
                                  <Icon className={`w-7 h-7 text-${color}-600`} />
                                </div>
                                <div>
                                  <div className={`font-bold text-${color}-700 text-lg`}>{label}</div>
                                  <div className="text-xs text-gray-500 mt-1">in {days} day{days !== 1 ? 's' : ''}</div>
                                </div>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Card Corner Decoration */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-blue-500/10 to-purple-500/10 rounded-bl-full"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-pink-500/10 to-rose-500/10 rounded-tr-full"></div>
              </div>
            </div>

            {/* Bottom Controls */}
            <div className="mt-6">
              <div className="flex items-center justify-between">
                {/* Left Controls */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={onPrevCard}
                    disabled={isReviewing || currentIndex === 0}
                    className="p-3 bg-white text-gray-700 rounded-xl hover:bg-gray-50 border border-gray-300 hover:border-gray-400 transition-all duration-200 disabled:opacity-30 flex items-center gap-2"
                  >
                    <ChevronLeft className="w-5 h-5" />
                    <span className="hidden sm:inline">Previous</span>
                  </button>
                  
                  <button
                    onClick={() => onPlayAudio(word.japanese)}
                    disabled={audioPlaying}
                    className="p-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5 disabled:opacity-50"
                  >
                    {audioPlaying ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <Volume2 className="w-5 h-5" />
                    )}
                  </button>
                </div>

                {/* Center Stats */}
                <div className="hidden md:flex items-center gap-6">
                  <div className="text-center">
                    <div className="text-xs text-gray-500">Streak</div>
                    <div className="flex items-center gap-1 text-amber-600 font-bold">
                      <Flame className="w-4 h-4" />
                      {word.streak || 0}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-gray-500">Avg Time</div>
                    <div className="text-gray-900 font-bold flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {word.averageTime || 0}s
                    </div>
                  </div>
                </div>

                {/* Right Controls */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={onNextCard}
                    disabled={isReviewing || currentIndex === totalCards - 1}
                    className="p-3 bg-white text-gray-700 rounded-xl hover:bg-gray-50 border border-gray-300 hover:border-gray-400 transition-all duration-200 disabled:opacity-30 flex items-center gap-2"
                  >
                    <span className="hidden sm:inline">Next</span>
                    <ChevronRight className="w-5 h-5" />
                  </button>
                  
                  <button
                    onClick={() => setShowHint(!showHint)}
                    className={`p-3 rounded-xl transition-all duration-200 ${
                      showHint 
                        ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white' 
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    <HelpCircle className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Global Styles */}
      <style jsx>{`
        @keyframes confetti {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        .animate-confetti {
          animation: confetti 2s ease-out forwards;
        }
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
        .animate-slide-up {
          animation: slideUp 0.3s ease-out;
        }
        .animate-fade-in {
          animation: fadeIn 0.5s ease-out;
        }
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        .font-japanese {
          font-family: 'Noto Sans JP', 'Hiragino Kaku Gothic Pro', 'Yu Gothic', sans-serif;
        }
      `}</style>
    </div>
  );
};

export default VocabularyFlashcard;