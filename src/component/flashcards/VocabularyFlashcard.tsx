// components/VocabularyFlashcard.tsx
import React, { useState, useEffect } from 'react';
import {
  Volume2, VolumeX, Bookmark, ChevronLeft, ChevronRight,
  Heart, Share2, Maximize2, Minimize2, RotateCw, Loader2,
  Star, Award, Clock, Zap, CheckCircle, XCircle, Sparkles,
  Eye, EyeOff, AlertCircle, Target, Brain, ChevronUp,
  ChevronDown, Lightbulb, Users, Book, Calendar, TrendingUp,
  Target as TargetIcon, Flame, Brain as BrainIcon,
  Timer, CheckSquare, XSquare, HelpCircle
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
    }, 220);
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
    switch (status) {
      case 'Overdue': return 'from-rose-500 to-pink-500';
      case 'Due Soon': return 'from-amber-500 to-orange-500';
      default: return 'from-emerald-500 to-teal-500';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'BEGINNER': return 'from-emerald-400 to-green-500';
      case 'INTERMEDIATE': return 'from-amber-400 to-orange-500';
      case 'ADVANCED': return 'from-rose-400 to-red-500';
      default: return 'from-blue-400 to-cyan-500';
    }
  };

  if (!word) return null;

  return (
    <div className={`relative ${fullscreen ? 'h-screen' : 'min-h-screen'} overflow-hidden bg-gray-50/40 pb-28 sm:pb-0`}>
      {/* Confetti */}
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none z-50">
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2.5 h-2.5 animate-confetti rounded-sm"
              style={{
                left: `${Math.random() * 100}%`,
                top: '-5%',
                animationDelay: `${Math.random() * 1.6}s`,
                backgroundColor: ['#ff6b6b','#4ecdc4','#45b7d1','#96ceb4','#feca57'][i % 5]
              }}
            />
          ))}
        </div>
      )}

      <div className={`${fullscreen ? 'p-3 sm:p-5' : 'p-4 sm:p-6'} max-w-5xl mx-auto h-full`}>
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="mb-4 sm:mb-6">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-3 sm:mb-4">
              <div className="flex items-center gap-2.5 sm:gap-4">
                <div className="relative">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold text-base sm:text-lg">
                    {currentIndex + 1}
                  </div>
                </div>
                <div className="text-sm sm:text-base text-gray-700">
                  <span className="font-bold">{currentIndex + 1}</span>
                  <span className="mx-1.5">/</span>
                  <span className="font-bold">{totalCards}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 sm:gap-3">
                <button
                  onClick={onToggleBookmark}
                  className={`p-2 rounded-lg transition-all ${word.isBookmarked ? 'text-amber-500 bg-amber-50/80' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'}`}
                  aria-pressed={word.isBookmarked}
                >
                  <Bookmark className={`w-5 h-5 sm:w-6 sm:h-6 ${word.isBookmarked ? 'fill-current' : ''}`} />
                </button>

                <div className="flex gap-1.5 sm:gap-2 flex-wrap">
                  <span className={`px-2.5 py-1 text-xs sm:text-sm font-semibold text-white rounded-full bg-gradient-to-r ${getDueStatusColor(getDueStatus(word.nextReviewAt))}`}>
                    {getDueStatus(word.nextReviewAt)}
                  </span>
                  <span className={`px-2.5 py-1 text-xs sm:text-sm font-semibold text-white rounded-full ${word.isLearned ? 'bg-gradient-to-r from-emerald-500 to-teal-500' : 'bg-gradient-to-r from-blue-500 to-cyan-500'}`}>
                    {word.isLearned ? 'Mastered' : 'Learning'}
                  </span>
                </div>
              </div>
            </div>

            {/* Progress bar */}
            <div className="h-2.5 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transition-all duration-700"
                style={{ width: `${((currentIndex + 1) / totalCards) * 100}%` }}
              />
            </div>
          </div>

          {/* Main flashcard */}
          <div className="flex-1 flex flex-col min-h-0">
            <div className="relative flex-1 mb-4 sm:mb-6">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50/40 via-purple-50/20 to-pink-50/30 rounded-2xl sm:rounded-3xl blur-lg" />

              <div className={`relative h-full bg-white rounded-2xl sm:rounded-3xl shadow-xl sm:shadow-2xl border border-gray-200/60 transition-all duration-400 ${isFlipping ? 'scale-[0.98] opacity-95' : 'scale-100 opacity-100'}`}>
                {/* Card Header */}
                <div className="p-4 sm:p-6 border-b border-gray-100">
                  <div className="flex flex-wrap gap-2 sm:gap-3 items-center">
                    <span className={`px-3 py-1 text-xs sm:text-sm font-bold text-white rounded-lg sm:rounded-xl bg-gradient-to-r ${getDifficultyColor(word.difficulty)}`}>
                      {word.difficulty}
                    </span>
                    <span className="px-3 py-1 text-xs sm:text-sm font-bold text-white rounded-lg sm:rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600">
                      {word.jlptLevel}
                    </span>
                    <span className="px-3 py-1 text-xs sm:text-sm font-bold text-white rounded-lg sm:rounded-xl bg-gradient-to-r from-gray-600 to-gray-800">
                      {word.category}
                    </span>

                    {/* Stats */}
                    <div className="ml-auto flex gap-4 sm:gap-8 text-sm">
                      <div className="text-center hidden xs:block">
                        <div className="text-xs text-gray-500">Reviews</div>
                        <div className="font-bold">{word.reviews}</div>
                      </div>
                      <div className="text-center">
                        <div className="text-xs text-gray-500">Accuracy</div>
                        <div className="font-bold text-emerald-600">
                          {Math.round((word.correctCount / Math.max(word.reviews, 1)) * 100)}%
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Main Content - make back/front content scrollable so bottom controls stay visible */}
                <div className="p-5 sm:p-8 lg:p-10 h-[calc(100%-76px)] sm:h-[calc(100%-88px)] overflow-y-auto">
                  {!showAnswer ? (
                    // Front
                    <div className="h-full flex flex-col items-center justify-center">
                      <div className="text-center mb-6 sm:mb-10">
                        <div className="text-4xl sm:text-6xl lg:text-7xl font-bold text-gray-900 font-japanese mb-2 leading-tight">
                          {word.japanese}
                        </div>
                        <div className="text-lg sm:text-2xl text-gray-600 font-mono tracking-wide">
                          {word.reading}
                        </div>
                      </div>

                      {showHint && (
                        <div className="mb-6 sm:mb-10 max-w-md w-full px-3">
                          <div className="p-3 sm:p-4 bg-blue-50/70 rounded-xl border border-blue-200 text-sm">
                            <div className="flex items-start gap-2.5">
                              <Lightbulb className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0" />
                              <div>
                                <span className="font-semibold">Hint: </span>
                                Often used in {word.category.toLowerCase()} context.
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="flex flex-col items-center gap-3">
                        <button
                          onClick={handleShowAnswer}
                          disabled={isReviewing}
                          className="px-10 sm:px-14 py-3 sm:py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl sm:rounded-2xl font-bold text-base sm:text-lg shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5 disabled:opacity-60"
                        >
                          Show Answer
                        </button>

                        <button
                          onClick={() => setShowHint(!showHint)}
                          className="mt-3 text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1.5"
                        >
                          {showHint ? <EyeOff size={16} /> : <Eye size={16} />}
                          {showHint ? 'Hide hint' : 'Show hint'}
                        </button>
                      </div>
                    </div>
                  ) : (
                    // Back
                    <div className="h-full flex flex-col">
                      <div className="text-center mb-4 sm:mb-8">
                        <div className="inline-block px-4 py-1.5 mb-3 bg-gradient-to-r from-emerald-500 to-green-600 text-white text-sm font-bold rounded-full">
                          ANSWER
                        </div>
                        <div className="text-2xl sm:text-4xl font-bold text-gray-900 mb-1">
                          {word.english}
                        </div>
                        {showTranslation && (
                          <div className="text-sm text-gray-600 mt-1">{word.translation}</div>
                        )}
                      </div>

                      <div className="grid sm:grid-cols-2 gap-5 sm:gap-6 mb-6 sm:mb-8 flex-1 overflow-y-auto">
                        {/* Example */}
                        {word.example && (
                          <div className="bg-blue-50/60 p-4 sm:p-6 rounded-xl border border-blue-100">
                            <h4 className="font-bold mb-2 flex items-center gap-2 text-gray-800">
                              <Book size={18} className="text-blue-600" />
                              Example
                            </h4>
                            <div className="text-lg sm:text-xl font-medium font-japanese mb-2">
                              {word.example}
                            </div>
                            <div className="text-sm text-gray-600 font-mono mb-3">
                              {word.exampleReading}
                            </div>
                            <div className="text-gray-700 text-sm">
                              "{word.exampleEnglish}"
                            </div>
                          </div>
                        )}

                        {/* Stats */}
                        <div className="bg-gray-50 p-4 sm:p-6 rounded-xl border border-gray-200">
                          <h4 className="font-bold mb-3 flex items-center gap-2 text-gray-800">
                            <Brain size={18} className="text-gray-700" />
                            Memory Stats
                          </h4>
                          <div className="space-y-2.5 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-600">Interval</span>
                              <span className="font-medium">{word.intervalDays}d</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Next review</span>
                              <span className="font-medium text-blue-600">
                                {word.nextReviewAt ? new Date(word.nextReviewAt).toLocaleDateString() : 'Now'}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Accuracy</span>
                              <span className="font-medium text-emerald-600">
                                {Math.round((word.correctCount / Math.max(word.reviews, 1)) * 100)}%
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Review buttons - Desktop: grid, Mobile: sticky bottom bar */}
                      <div className="mt-auto pt-4 sm:pt-6">
                        {/* Desktop / Tablet */}
                        <div className="hidden sm:grid grid-cols-3 gap-3 sm:gap-5">
                          {[
                            { rating: 'again', label: 'Again', color: 'rose', icon: XCircle },
                            { rating: 'good', label: 'Good', color: 'amber', icon: CheckCircle },
                            { rating: 'easy', label: 'Easy', color: 'emerald', icon: Award }
                          ].map(({ rating, label, color, icon: Icon }) => (
                            <button
                              key={rating}
                              onClick={() => handleReview(rating as any)}
                              disabled={isReviewing}
                              className={`
                                p-4 sm:p-5 rounded-xl border-2 transition-all duration-200
                                border-${color}-200 hover:border-${color}-300
                                bg-gradient-to-b from-white to-gray-50
                                hover:shadow-lg hover:-translate-y-1
                                disabled:opacity-60 disabled:cursor-not-allowed
                                flex flex-col items-center gap-2 sm:gap-3
                              `}
                            >
                              <Icon className={`w-7 h-7 sm:w-8 sm:h-8 text-${color}-600`} />
                              <div className={`font-bold text-${color}-700 text-sm sm:text-base`}>
                                {label}
                              </div>
                            </button>
                          ))}
                        </div>

                        {/* Mobile sticky bottom bar */}
                        <div className="sm:hidden fixed left-3 right-3 bottom-4 z-40">
                          <div className="bg-white/95 backdrop-blur-md border border-gray-200 rounded-xl p-2 shadow-lg flex gap-2">
                            <button
                              onClick={() => handleReview('again')}
                              disabled={isReviewing}
                              className="flex-1 py-2 px-3 rounded-md bg-white border border-rose-200 hover:bg-rose-50 disabled:opacity-60 flex items-center justify-center gap-2"
                              aria-label="Again"
                            >
                              <XCircle className="w-5 h-5 text-rose-500" />
                              <span className="text-sm font-semibold text-rose-600">Again</span>
                            </button>
                            <button
                              onClick={() => handleReview('good')}
                              disabled={isReviewing}
                              className="flex-1 py-2 px-3 rounded-md bg-white border border-amber-200 hover:bg-amber-50 disabled:opacity-60 flex items-center justify-center gap-2"
                              aria-label="Good"
                            >
                              <CheckCircle className="w-5 h-5 text-amber-500" />
                              <span className="text-sm font-semibold text-amber-600">Good</span>
                            </button>
                            <button
                              onClick={() => handleReview('easy')}
                              disabled={isReviewing}
                              className="flex-1 py-2 px-3 rounded-md bg-white border border-emerald-200 hover:bg-emerald-50 disabled:opacity-60 flex items-center justify-center gap-2"
                              aria-label="Easy"
                            >
                              <Award className="w-5 h-5 text-emerald-500" />
                              <span className="text-sm font-semibold text-emerald-600">Easy</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Bottom controls (prev, play, next) - keep above mobile sticky bar */}
            <div className="flex items-center justify-between gap-3 py-2">
              <button
                onClick={onPrevCard}
                disabled={isReviewing || currentIndex === 0}
                className="p-3 bg-white border rounded-xl hover:bg-gray-50 disabled:opacity-40"
                aria-label="Previous card"
              >
                <ChevronLeft size={20} />
              </button>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => onPlayAudio(word.japanese)}
                  disabled={audioPlaying}
                  className="p-3 sm:p-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-full shadow-md hover:shadow-lg transition-all disabled:opacity-60"
                  aria-label="Play audio"
                >
                  {audioPlaying ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Volume2 className="w-5 h-5" />
                  )}
                </button>

                <button
                  onClick={onToggleTranslation}
                  className="p-2.5 bg-white border rounded-lg hover:bg-gray-50 hidden sm:inline-flex items-center gap-2"
                  aria-pressed={showTranslation}
                >
                  <HelpCircle className="w-5 h-5 text-gray-600" />
                </button>
              </div>

              <button
                onClick={onNextCard}
                disabled={isReviewing || currentIndex === totalCards - 1}
                className="p-3 bg-white border rounded-xl hover:bg-gray-50 disabled:opacity-40"
                aria-label="Next card"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes confetti {
          0% { transform: translateY(-10vh) rotate(0deg); opacity: 1; }
          100% { transform: translateY(110vh) rotate(720deg); opacity: 0; }
        }
        .animate-confetti {
          animation: confetti 2.2s ease-out forwards;
        }
        .font-japanese {
          font-family: 'Noto Sans JP', 'Hiragino Kaku Gothic Pro', 'Yu Gothic', sans-serif;
        }
        /* Ensure mobile content has room for the sticky bar */
        @media (max-width: 640px) {
          /* Outer container already has pb-28; this avoids content being hidden */
        }
      `}</style>
    </div>
  );
};

export default VocabularyFlashcard;
