// components/flashcards/KatakanaFlashcards.tsx
import React, { useState, useEffect } from 'react';
import { 

  RotateCw, 
  Volume2, 
  Check, 
  X, 
  ChevronRight, 
  ChevronLeft, 
  Zap, 
  BarChart, 
  Timer, 
  Target,
  BookOpen,
  HelpCircle,
  Shuffle,
  RefreshCw,
  CardSim
} from 'lucide-react';
import { getAllKatakana } from '../../service/katakana.service';
import { type Katakana } from '../../service/katakana.service';
import { 
  type FlashcardMode, 
  type QuizType, 
  type Difficulty,
  type QuizQuestion 
} from '../../pages/types/flashcard.types';
import { 
  calculateNextReview, 
  calculateScore, 
  generateOptions 
} from '../../pages/utils/flashcard.utils';

interface KatakanaFlashcardProps {
  mode?: FlashcardMode;
  quizType?: QuizType;
  limit?: number;
}

const KatakanaFlashcards: React.FC<KatakanaFlashcardProps> = ({
  mode = 'study',
  quizType = 'multiple-choice',
  limit = 20
}) => {
  const [katakanaList, setKatakanaList] = useState<Katakana[]>([]);
  const [flashcards, setFlashcards] = useState<any[]>([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const [studyMode, setStudyMode] = useState<FlashcardMode>(mode);
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [timeSpent, setTimeSpent] = useState(0);
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);
  const [sessionStats, setSessionStats] = useState({
    correct: 0,
    wrong: 0,
    total: 0,
    streak: 0,
    maxStreak: 0
  });
  const [userAnswer, setUserAnswer] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [reviewCards, setReviewCards] = useState<any[]>([]);
  const [showStats, setShowStats] = useState(false);
  const [includeDakuten, setIncludeDakuten] = useState(false);
  const [includeCombo, setIncludeCombo] = useState(false);

  useEffect(() => {
    fetchKatakana();
    return () => {
      if (timer) clearInterval(timer);
    };
  }, []);

  useEffect(() => {
    if (katakanaList.length > 0) {
      initializeFlashcards();
    }
  }, [katakanaList, studyMode, includeDakuten, includeCombo]);

  useEffect(() => {
    if (studyMode === 'quiz' && timer) {
      const interval = setInterval(() => {
        setTimeSpent(prev => prev + 1);
      }, 1000);
      setTimer(interval);
      return () => clearInterval(interval);
    }
  }, [studyMode]);

  const fetchKatakana = async () => {
    try {
      const response = await getAllKatakana();
      setKatakanaList(response.data);
    } catch (error) {
      console.error('Error fetching katakana:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const initializeFlashcards = () => {
    let filtered = [...katakanaList];
    
    // Filter based on options
    if (!includeDakuten) {
      filtered = filtered.filter(char => 
        !char.symbol.includes('ガ') && 
        !char.symbol.includes('ザ') &&
        !char.symbol.includes('ダ') &&
        !char.symbol.includes('バ') &&
        !char.symbol.includes('パ')
      );
    }
    
    if (!includeCombo) {
      filtered = filtered.filter(char => 
        !char.symbol.includes('キャ') &&
        !char.symbol.includes('シャ') &&
        !char.symbol.includes('チャ') &&
        !char.symbol.includes('ニャ')
      );
    }
    
    const shuffled = filtered
      .sort(() => Math.random() - 0.5)
      .slice(0, limit);
    
    const cards = shuffled.map(char => ({
      ...char,
      isLearned: localStorage.getItem(`katakana_${char.symbol}`) === 'true',
      lastReviewed: null,
      nextReview: null,
      reviewCount: 0,
      correctCount: 0,
      wrongCount: 0,
      difficulty: 'medium' as Difficulty,
      streak: 0
    }));
    
    setFlashcards(cards);
    
    if (studyMode === 'quiz') {
      generateQuizQuestions(cards);
    }
    
    if (studyMode === 'review') {
      const dueForReview = cards.filter(card => {
        const saved = localStorage.getItem(`katakana_review_${card.symbol}`);
        return saved && new Date(saved) <= new Date();
      });
      setReviewCards(dueForReview);
    }
  };

  const generateQuizQuestions = (cards: any[]) => {
    const questions: QuizQuestion[] = cards.map((card, index) => {
      const questionTypes: QuizType[] = ['multiple-choice', 'typing', 'matching'];
      const type = questionTypes[index % 3];
      
      let question: QuizQuestion = {
        id: `q${index}`,
        type,
        question: '',
        correctAnswer: '',
        options: []
      };

      switch (type) {
        case 'multiple-choice':
          const allRomaji = cards.map(c => c.romaji);
          question.question = `What is the romaji for: ${card.symbol}`;
          question.correctAnswer = card.romaji;
          question.options = generateOptions(card.romaji, allRomaji);
          break;
        
        case 'typing':
          question.question = `Type the romaji for: ${card.symbol}`;
          question.correctAnswer = card.romaji;
          break;
        
        case 'matching':
          question.question = `Match the katakana with its romaji`;
          question.correctAnswer = `${card.symbol}=${card.romaji}`;
          const otherCards = cards.filter(c => c.symbol !== card.symbol).slice(0, 3);
          question.options = [
            `${card.symbol}=${card.romaji}`,
            ...otherCards.map(c => `${card.symbol}=${c.romaji}`)
          ].sort(() => Math.random() - 0.5);
          break;
      }

      return question;
    });

    setQuizQuestions(questions);
  };

  const handleCardFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleNextCard = () => {
    setCurrentCardIndex(prev => (prev + 1) % flashcards.length);
    setIsFlipped(false);
    setShowAnswer(false);
  };

  const handlePrevCard = () => {
    setCurrentCardIndex(prev => (prev - 1 + flashcards.length) % flashcards.length);
    setIsFlipped(false);
    setShowAnswer(false);
  };

  const markAsKnown = () => {
    const card = flashcards[currentCardIndex];
    const updated = [...flashcards];
    updated[currentCardIndex] = {
      ...card,
      isLearned: true,
      reviewCount: card.reviewCount + 1,
      correctCount: card.correctCount + 1,
      streak: card.streak + 1,
      nextReview: calculateNextReview(card.streak + 1, card.difficulty)
    };
    
    setFlashcards(updated);
    localStorage.setItem(`katakana_${card.symbol}`, 'true');
    localStorage.setItem(
      `katakana_review_${card.symbol}`,
      calculateNextReview(card.streak + 1, card.difficulty).toISOString()
    );
    
    setSessionStats(prev => ({
      ...prev,
      correct: prev.correct + 1,
      total: prev.total + 1,
      streak: prev.streak + 1,
      maxStreak: Math.max(prev.maxStreak, prev.streak + 1)
    }));
    
    handleNextCard();
  };

  const markAsUnknown = () => {
    const card = flashcards[currentCardIndex];
    const updated = [...flashcards];
    updated[currentCardIndex] = {
      ...card,
      isLearned: false,
      reviewCount: card.reviewCount + 1,
      wrongCount: card.wrongCount + 1,
      streak: 0,
      difficulty: card.difficulty === 'easy' ? 'medium' : 'hard'
    };
    
    setFlashcards(updated);
    localStorage.setItem(`katakana_${card.symbol}`, 'false');
    
    setSessionStats(prev => ({
      ...prev,
      wrong: prev.wrong + 1,
      total: prev.total + 1,
      streak: 0
    }));
    
    handleNextCard();
  };

  const handleQuizAnswer = (answer: string) => {
    const question = quizQuestions[currentQuestion];
    const isCorrect = answer === question.correctAnswer;
    
    const updatedQuestions = [...quizQuestions];
    updatedQuestions[currentQuestion] = {
      ...question,
      userAnswer: answer,
      isCorrect,
      timeSpent
    };
    
    setQuizQuestions(updatedQuestions);
    setScore(prev => prev + (isCorrect ? 1 : 0));
    setSessionStats(prev => ({
      ...prev,
      correct: prev.correct + (isCorrect ? 1 : 0),
      wrong: prev.wrong + (isCorrect ? 0 : 1),
      total: prev.total + 1,
      streak: isCorrect ? prev.streak + 1 : 0,
      maxStreak: Math.max(prev.maxStreak, isCorrect ? prev.streak + 1 : 0)
    }));

    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setUserAnswer('');
    } else {
      // Quiz complete
      if (timer) clearInterval(timer);
      setShowStats(true);
    }
  };

  const playAudio = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ja-JP';
    utterance.rate = 0.8;
    speechSynthesis.speak(utterance);
  };

  const resetSession = () => {
    setCurrentCardIndex(0);
    setCurrentQuestion(0);
    setScore(0);
    setTimeSpent(0);
    setSessionStats({
      correct: 0,
      wrong: 0,
      total: 0,
      streak: 0,
      maxStreak: 0
    });
    setShowStats(false);
    setUserAnswer('');
    initializeFlashcards();
  };

  const changeMode = (mode: FlashcardMode) => {
    setStudyMode(mode);
    setCurrentCardIndex(0);
    setCurrentQuestion(0);
    setShowStats(false);
  };

  const renderQuizQuestion = () => {
    const question = quizQuestions[currentQuestion];
    
    if (!question) return null;

    switch (question.type) {
      case 'multiple-choice':
        return (
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-center mb-6">{question.question}</h3>
            <div className="grid grid-cols-2 gap-3">
              {question.options?.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleQuizAnswer(option)}
                  className="p-4 bg-white border rounded-xl hover:bg-blue-50 hover:border-blue-300 transition"
                >
                  <span className="text-lg font-medium">{option}</span>
                </button>
              ))}
            </div>
          </div>
        );

      case 'typing':
        return (
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-center mb-6">{question.question}</h3>
            <div className="flex justify-center mb-8">
              <div className="text-6xl font-bold">{currentCard.symbol}</div>
            </div>
            <div className="max-w-md mx-auto">
              <input
                type="text"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleQuizAnswer(userAnswer)}
                className="w-full p-4 text-center text-xl border-2 rounded-lg focus:outline-none focus:border-blue-500"
                placeholder="Type romaji here..."
                autoFocus
              />
              <button
                onClick={() => handleQuizAnswer(userAnswer)}
                className="w-full mt-4 p-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Submit Answer
              </button>
            </div>
          </div>
        );

      case 'matching':
        return (
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-center mb-6">{question.question}</h3>
            <div className="grid grid-cols-2 gap-4">
              {question.options?.map((option, index) => {
                const [symbol, romaji] = option.split('=');
                return (
                  <button
                    key={index}
                    onClick={() => handleQuizAnswer(option)}
                    className="p-4 bg-white border rounded-xl hover:bg-green-50 hover:border-green-300 transition"
                  >
                    <div className="text-2xl font-bold">{symbol}</div>
                    <div className="text-lg text-gray-600">{romaji}</div>
                  </button>
                );
              })}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const currentCard = flashcards[currentCardIndex];

  return (
    <div className="max-w-4xl mx-auto p-4">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-blue-600">
              <span className="text-4xl">カタカナ</span> Flashcards
            </h1>
            <p className="text-gray-600">Master Japanese katakana characters</p>
          </div>
          
          <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4">
            {/* Study Options */}
            <div className="flex gap-2">
              <label className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg">
                <input
                  type="checkbox"
                  checked={includeDakuten}
                  onChange={(e) => setIncludeDakuten(e.target.checked)}
                  className="rounded"
                />
                <span className="text-sm">Dakuten</span>
              </label>
              <label className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg">
                <input
                  type="checkbox"
                  checked={includeCombo}
                  onChange={(e) => setIncludeCombo(e.target.checked)}
                  className="rounded"
                />
                <span className="text-sm">Combo</span>
              </label>
            </div>
            
            {/* Mode Selection */}
            <div className="flex gap-2">
              {(['study', 'quiz', 'review'] as FlashcardMode[]).map((mode) => (
                <button
                  key={mode}
                  onClick={() => changeMode(mode)}
                  className={`px-4 py-2 rounded-lg capitalize text-sm ${
                    studyMode === mode
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>
            
            <button
              onClick={resetSession}
              className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200"
              title="Reset session"
            >
              <RefreshCw className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Progress Stats */}
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="px-4 py-2 bg-blue-50 rounded-lg">
            <div className="text-sm text-gray-600">Current Card</div>
            <div className="text-xl font-bold">{currentCardIndex + 1} / {flashcards.length}</div>
          </div>
          <div className="px-4 py-2 bg-green-50 rounded-lg">
            <div className="text-sm text-gray-600">Correct</div>
            <div className="text-xl font-bold text-green-600">{sessionStats.correct}</div>
          </div>
          <div className="px-4 py-2 bg-purple-50 rounded-lg">
            <div className="text-sm text-gray-600">Streak</div>
            <div className="text-xl font-bold text-purple-600">{sessionStats.streak}</div>
          </div>
          {studyMode === 'quiz' && (
            <div className="px-4 py-2 bg-amber-50 rounded-lg">
              <div className="text-sm text-gray-600">Time</div>
              <div className="text-xl font-bold text-amber-600">{timeSpent}s</div>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      {showStats ? (
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-3xl font-bold mb-4">Session Complete!</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="p-4 bg-green-50 rounded-xl">
              <div className="text-2xl font-bold text-green-600">{score}/{quizQuestions.length}</div>
              <div className="text-sm text-gray-600">Score</div>
            </div>
            <div className="p-4 bg-blue-50 rounded-xl">
              <div className="text-2xl font-bold text-blue-600">
                {Math.round((score / quizQuestions.length) * 100)}%
              </div>
              <div className="text-sm text-gray-600">Accuracy</div>
            </div>
            <div className="p-4 bg-purple-50 rounded-xl">
              <div className="text-2xl font-bold text-purple-600">{timeSpent}s</div>
              <div className="text-sm text-gray-600">Time</div>
            </div>
            <div className="p-4 bg-amber-50 rounded-xl">
              <div className="text-2xl font-bold text-amber-600">{sessionStats.maxStreak}</div>
              <div className="text-sm text-gray-600">Max Streak</div>
            </div>
          </div>

          <div className="space-y-3 max-w-md mx-auto">
            <button
              onClick={resetSession}
              className="w-full p-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
            >
              Practice Again
            </button>
            <button
              onClick={() => changeMode('study')}
              className="w-full p-4 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition"
            >
              Switch to Study Mode
            </button>
          </div>
        </div>
      ) : studyMode === 'quiz' ? (
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="mb-6 flex justify-between items-center">
            <div>
              <span className="text-lg font-medium">
                Question {currentQuestion + 1} of {quizQuestions.length}
              </span>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden mt-2">
                <div 
                  className="h-full bg-green-500 transition-all"
                  style={{ width: `${((currentQuestion + 1) / quizQuestions.length) * 100}%` }}
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Timer className="w-5 h-5 text-purple-600" />
              <span className="font-medium">{timeSpent}s</span>
            </div>
          </div>
          
          {renderQuizQuestion()}
        </div>
      ) : (
        /* Flashcard Study Mode */
        <div className="relative">
          {/* Flashcard */}
          <div 
            className={`relative w-full max-w-md mx-auto h-96 cursor-pointer transition-transform duration-500 ${
              isFlipped ? 'transform-gpu' : ''
            }`}
            onClick={handleCardFlip}
          >
            {/* Front of card */}
            <div className={`absolute inset-0 bg-white rounded-2xl shadow-xl p-8 flex flex-col items-center justify-center transition-opacity duration-500 ${
              isFlipped ? 'opacity-0' : 'opacity-100'
            }`}>
              <div className="text-8xl font-bold mb-6">{currentCard?.symbol}</div>
              <div className="flex gap-4">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    playAudio(currentCard?.symbol || '');
                  }}
                  className="p-3 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200 transition"
                >
                  <Volume2 className="w-6 h-6" />
                </button>
                <div className="p-3">
                  <CardSim className="w-6 h-6 text-gray-400" />
                </div>
              </div>
              <p className="text-gray-500 mt-6">Click to flip card</p>
            </div>

            {/* Back of card */}
            <div className={`absolute inset-0 bg-gradient-to-br from-blue-50 to-white rounded-2xl shadow-xl p-8 flex flex-col items-center justify-center transition-opacity duration-500 ${
              isFlipped ? 'opacity-100' : 'opacity-0'
            }`}>
              <div className="text-6xl font-bold mb-4">{currentCard?.symbol}</div>
              <div className="text-4xl font-mono text-blue-600 mb-6">{currentCard?.romaji}</div>
              
              <div className="text-center mb-6">
                <p className="text-gray-700">{currentCard?.explanation}</p>
                {currentCard?.example && (
                  <p className="mt-4 text-gray-600">{currentCard.example}</p>
                )}
              </div>
              
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  playAudio(currentCard?.example?.split(' ')[0] || currentCard?.symbol || '');
                }}
                className="p-3 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200 transition"
              >
                <Volume2 className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Controls */}
          <div className="flex justify-center items-center gap-4 mt-8">
            <button
              onClick={handlePrevCard}
              className="p-3 bg-gray-100 rounded-full hover:bg-gray-200 transition"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            
            <div className="flex gap-4">
              <button
                onClick={markAsUnknown}
                className="px-6 py-3 bg-red-100 text-red-700 rounded-xl hover:bg-red-200 transition flex items-center gap-2"
              >
                <X className="w-5 h-5" />
                Don't Know
              </button>
              
              <button
                onClick={markAsKnown}
                className="px-6 py-3 bg-green-100 text-green-700 rounded-xl hover:bg-green-200 transition flex items-center gap-2"
              >
                <Check className="w-5 h-5" />
                I Know It
              </button>
            </div>
            
            <button
              onClick={handleNextCard}
              className="p-3 bg-gray-100 rounded-full hover:bg-gray-200 transition"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          {/* Card Stats */}
          {currentCard && (
            <div className="mt-8 grid grid-cols-4 gap-4 max-w-md mx-auto">
              <div className="text-center">
                <div className="text-sm text-gray-600">Reviews</div>
                <div className="text-lg font-bold">{currentCard.reviewCount}</div>
              </div>
              <div className="text-center">
                <div className="text-sm text-gray-600">Correct</div>
                <div className="text-lg font-bold text-green-600">{currentCard.correctCount}</div>
              </div>
              <div className="text-center">
                <div className="text-sm text-gray-600">Streak</div>
                <div className="text-lg font-bold text-blue-600">{currentCard.streak}</div>
              </div>
              <div className="text-center">
                <div className="text-sm text-gray-600">Difficulty</div>
                <div className={`text-lg font-bold ${
                  currentCard.difficulty === 'easy' ? 'text-green-600' :
                  currentCard.difficulty === 'medium' ? 'text-yellow-600' : 'text-red-600'
                }`}>
                  {currentCard.difficulty}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Review Mode */}
      {studyMode === 'review' && reviewCards.length > 0 && (
        <div className="mt-8">
          <h3 className="text-xl font-bold mb-4">Cards Due for Review: {reviewCards.length}</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {reviewCards.map((card, index) => (
              <div key={index} className="bg-white p-4 rounded-xl shadow border">
                <div className="text-3xl font-bold text-center">{card.symbol}</div>
                <div className="text-center text-gray-600">{card.romaji}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default KatakanaFlashcards;