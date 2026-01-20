// components/flashcards/KatakanaFlashcards.tsx
import React, { useState, useEffect, useRef } from 'react';
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
  CardSim,
  Loader2,
  Sparkles,
  Trophy,
  Clock,
  TrendingUp,
  AlertCircle,
  Filter,
  Layers,
  Settings
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
  const [isAnimating, setIsAnimating] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const [studyMode, setStudyMode] = useState<FlashcardMode>(mode);
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [timeSpent, setTimeSpent] = useState(0);
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);
  const [quizTimer, setQuizTimer] = useState<NodeJS.Timeout | null>(null);
  const [sessionStats, setSessionStats] = useState({
    correct: 0,
    wrong: 0,
    total: 0,
    streak: 0,
    maxStreak: 0
  });
  const [userAnswer, setUserAnswer] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isInitializing, setIsInitializing] = useState(false);
  const [reviewCards, setReviewCards] = useState<any[]>([]);
  const [showStats, setShowStats] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showQuizFeedback, setShowQuizFeedback] = useState(false);
  const [quizStartTime, setQuizStartTime] = useState<number>(0);
  const [includeDakuten, setIncludeDakuten] = useState(false);
  const [includeCombo, setIncludeCombo] = useState(false);
  const [includeYoon, setIncludeYoon] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);


  const normalizeAnswer = (value: string) =>
  value.trim().toLowerCase();

const isCorrectAnswer = (a: string | null, b: string) =>
  normalizeAnswer(a ?? '') === normalizeAnswer(b);

  useEffect(() => {
    fetchKatakana();
    return () => {
      if (timer) clearInterval(timer);
      if (quizTimer) clearInterval(quizTimer);
    };
  }, []);

  useEffect(() => {
    if (katakanaList.length > 0) {
      initializeFlashcards();
    }
  }, [katakanaList, studyMode, includeDakuten, includeCombo, includeYoon]);

  useEffect(() => {
    if (studyMode === 'quiz' && quizQuestions.length > 0 && !showStats) {
      setQuizStartTime(Date.now());
      const interval = setInterval(() => {
        setTimeSpent(prev => prev + 1);
      }, 1000);
      setQuizTimer(interval);
      return () => clearInterval(interval);
    }
  }, [studyMode, quizQuestions, showStats]);

  const fetchKatakana = async () => {
    try {
      setIsLoading(true);
      // Simulate loading for better UX
      await new Promise(resolve => setTimeout(resolve, 800));
      const response = await getAllKatakana();
      setKatakanaList(response.data);
    } catch (error) {
      console.error('Error fetching katakana:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const initializeFlashcards = () => {
    setIsInitializing(true);
    setTimeout(() => {
      let filtered = [...katakanaList];
      
      // Filter based on options
      if (!includeDakuten) {
        filtered = filtered.filter(char => 
          !char.symbol.includes('ガ') && 
          !char.symbol.includes('ザ') &&
          !char.symbol.includes('ダ') &&
          !char.symbol.includes('バ') &&
          !char.symbol.includes('パ') &&
          !char.symbol.includes('゛')
        );
      }
      
      if (!includeCombo) {
        filtered = filtered.filter(char => 
          !char.symbol.includes('キャ') &&
          !char.symbol.includes('シャ') &&
          !char.symbol.includes('チャ') &&
          !char.symbol.includes('ニャ') &&
          !char.symbol.includes('リュ') &&
          !char.symbol.includes('ピョ')
        );
      }

      if (!includeYoon) {
        filtered = filtered.filter(char => 
          !char.symbol.includes('ャ') &&
          !char.symbol.includes('ュ') &&
          !char.symbol.includes('ョ') &&
          !char.romaji?.includes('y')
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
        reviewCount: parseInt(localStorage.getItem(`katakana_review_count_${char.symbol}`) || '0'),
        correctCount: parseInt(localStorage.getItem(`katakana_correct_${char.symbol}`) || '0'),
        wrongCount: parseInt(localStorage.getItem(`katakana_wrong_${char.symbol}`) || '0'),
        difficulty: localStorage.getItem(`katakana_difficulty_${char.symbol}`) as Difficulty || 'medium',
        streak: parseInt(localStorage.getItem(`katakana_streak_${char.symbol}`) || '0')
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
      setIsInitializing(false);
    }, 300);
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
        options: [],
        userAnswer: null,
        isCorrect: null,
        timeSpent: 0
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
    if (isAnimating) return;
    
    setIsAnimating(true);
    setIsFlipped(!isFlipped);
    
    if (cardRef.current) {
      cardRef.current.style.transform = isFlipped 
        ? 'rotateY(0deg)' 
        : 'rotateY(180deg)';
    }
    
    setTimeout(() => setIsAnimating(false), 500);
  };

  const handleNextCard = () => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    if (cardRef.current) {
      cardRef.current.style.opacity = '0';
      cardRef.current.style.transform = 'translateX(100px)';
    }
    
    setTimeout(() => {
      setCurrentCardIndex(prev => (prev + 1) % flashcards.length);
      setIsFlipped(false);
      setShowAnswer(false);
      
      if (cardRef.current) {
        cardRef.current.style.opacity = '1';
        cardRef.current.style.transform = 'translateX(0) rotateY(0deg)';
      }
      setIsAnimating(false);
    }, 300);
  };

  const handlePrevCard = () => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    if (cardRef.current) {
      cardRef.current.style.opacity = '0';
      cardRef.current.style.transform = 'translateX(-100px)';
    }
    
    setTimeout(() => {
      setCurrentCardIndex(prev => (prev - 1 + flashcards.length) % flashcards.length);
      setIsFlipped(false);
      setShowAnswer(false);
      
      if (cardRef.current) {
        cardRef.current.style.opacity = '1';
        cardRef.current.style.transform = 'translateX(0) rotateY(0deg)';
      }
      setIsAnimating(false);
    }, 300);
  };

  const markAsKnown = () => {
    const card = flashcards[currentCardIndex];
    const updated = [...flashcards];
    const newStreak = card.streak + 1;
    const newDifficulty = card.difficulty === 'hard' ? 'medium' : card.difficulty === 'medium' ? 'easy' : 'easy';
    
    updated[currentCardIndex] = {
      ...card,
      isLearned: true,
      reviewCount: card.reviewCount + 1,
      correctCount: card.correctCount + 1,
      streak: newStreak,
      difficulty: newDifficulty,
      nextReview: calculateNextReview(newStreak, newDifficulty)
    };
    
    setFlashcards(updated);
    
    // Save to localStorage with memory persistence
    localStorage.setItem(`katakana_${card.symbol}`, 'true');
    localStorage.setItem(`katakana_review_count_${card.symbol}`, (card.reviewCount + 1).toString());
    localStorage.setItem(`katakana_correct_${card.symbol}`, (card.correctCount + 1).toString());
    localStorage.setItem(`katakana_streak_${card.symbol}`, newStreak.toString());
    localStorage.setItem(`katakana_difficulty_${card.symbol}`, newDifficulty);
    localStorage.setItem(
      `katakana_review_${card.symbol}`,
      calculateNextReview(newStreak, newDifficulty).toISOString()
    );
    
    setSessionStats(prev => ({
      ...prev,
      correct: prev.correct + 1,
      total: prev.total + 1,
      streak: prev.streak + 1,
      maxStreak: Math.max(prev.maxStreak, prev.streak + 1)
    }));
    
    // Celebration animation
    const confetti = document.createElement('div');
    confetti.className = 'confetti';
    confetti.textContent = '🎉';
    confetti.style.position = 'fixed';
    confetti.style.zIndex = '9999';
    confetti.style.fontSize = '24px';
    confetti.style.left = `${Math.random() * window.innerWidth}px`;
    confetti.style.top = '0';
    document.body.appendChild(confetti);
    
    setTimeout(() => {
      confetti.style.transition = 'all 1s ease-out';
      confetti.style.transform = `translateY(${window.innerHeight}px) rotate(${Math.random() * 360}deg)`;
      confetti.style.opacity = '0';
      setTimeout(() => confetti.remove(), 1000);
    }, 10);
    
    handleNextCard();
  };

  const markAsUnknown = () => {
    const card = flashcards[currentCardIndex];
    const updated = [...flashcards];
    const newDifficulty = card.difficulty === 'easy' ? 'medium' : 'hard';
    
    updated[currentCardIndex] = {
      ...card,
      isLearned: false,
      reviewCount: card.reviewCount + 1,
      wrongCount: card.wrongCount + 1,
      streak: 0,
      difficulty: newDifficulty
    };
    
    setFlashcards(updated);
    
    // Save to localStorage with memory persistence
    localStorage.setItem(`katakana_${card.symbol}`, 'false');
    localStorage.setItem(`katakana_review_count_${card.symbol}`, (card.reviewCount + 1).toString());
    localStorage.setItem(`katakana_wrong_${card.symbol}`, (card.wrongCount + 1).toString());
    localStorage.setItem(`katakana_streak_${card.symbol}`, '0');
    localStorage.setItem(`katakana_difficulty_${card.symbol}`, newDifficulty);
    
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
   const isCorrect = isCorrectAnswer(answer, question.correctAnswer);
    const currentCard = flashcards[currentQuestion] || flashcards[0];
    
    setSelectedAnswer(answer);
    setShowQuizFeedback(true);
    
    const updatedQuestions = [...quizQuestions];
    updatedQuestions[currentQuestion] = {
      ...question,
      userAnswer: answer,
      isCorrect,
      timeSpent: Math.floor((Date.now() - quizStartTime) / 1000)
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

    // Update card stats based on answer
    if (currentCard) {
      const card = currentCard;
      const updatedCards = [...flashcards];
      const cardIndex = flashcards.findIndex(c => c.symbol === card.symbol);
      
      if (cardIndex !== -1) {
        if (isCorrect) {
          const newStreak = card.streak + 1;
          const newDifficulty = card.difficulty === 'hard' ? 'medium' : card.difficulty === 'medium' ? 'easy' : 'easy';
          
          updatedCards[cardIndex] = {
            ...card,
            reviewCount: card.reviewCount + 1,
            correctCount: card.correctCount + 1,
            streak: newStreak,
            difficulty: newDifficulty
          };
          
          // Save correct answer to localStorage
          localStorage.setItem(`katakana_review_count_${card.symbol}`, (card.reviewCount + 1).toString());
          localStorage.setItem(`katakana_correct_${card.symbol}`, (card.correctCount + 1).toString());
          localStorage.setItem(`katakana_streak_${card.symbol}`, newStreak.toString());
          localStorage.setItem(`katakana_difficulty_${card.symbol}`, newDifficulty);
        } else {
          const newDifficulty = card.difficulty === 'easy' ? 'medium' : 'hard';
          
          updatedCards[cardIndex] = {
            ...card,
            reviewCount: card.reviewCount + 1,
            wrongCount: card.wrongCount + 1,
            streak: 0,
            difficulty: newDifficulty
          };
          
          // Save wrong answer to localStorage
          localStorage.setItem(`katakana_review_count_${card.symbol}`, (card.reviewCount + 1).toString());
          localStorage.setItem(`katakana_wrong_${card.symbol}`, (card.wrongCount + 1).toString());
          localStorage.setItem(`katakana_streak_${card.symbol}`, '0');
          localStorage.setItem(`katakana_difficulty_${card.symbol}`, newDifficulty);
        }
        
        setFlashcards(updatedCards);
      }
    }

    // Show feedback for 1.5 seconds before moving to next question
    setTimeout(() => {
      setShowQuizFeedback(false);
      setSelectedAnswer(null);
      
      if (currentQuestion < quizQuestions.length - 1) {
        setCurrentQuestion(prev => prev + 1);
        setUserAnswer('');
        setQuizStartTime(Date.now());
      } else {
        // Quiz complete
        if (quizTimer) clearInterval(quizTimer);
        setShowStats(true);
      }
    }, 1500);
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
    setShowQuizFeedback(false);
    setSelectedAnswer(null);
    setUserAnswer('');
    initializeFlashcards();
  };

  const changeMode = (mode: FlashcardMode) => {
    setStudyMode(mode);
    setCurrentCardIndex(0);
    setCurrentQuestion(0);
    setShowStats(false);
    setShowQuizFeedback(false);
    setSelectedAnswer(null);
  };

  const clearProgress = () => {
    if (window.confirm('Are you sure you want to clear all katakana progress? This cannot be undone.')) {
      // Clear all katakana-related localStorage items
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith('katakana_')) {
          localStorage.removeItem(key);
        }
      });
      resetSession();
      alert('Progress cleared successfully!');
    }
  };

  const renderQuizQuestion = () => {
    const question = quizQuestions[currentQuestion];
    const currentCard = flashcards[currentQuestion] || flashcards[0];
    
    if (!question) return null;

    const renderOptions = () => {
      if (!question.options) return null;
      
      return question.options.map((option, index) => {
        let buttonClass = "p-4 border rounded-xl transition-all duration-300 ";
       let isCorrect = isCorrectAnswer(option, question.correctAnswer);

        let isSelected = option === selectedAnswer;
        
        if (showQuizFeedback) {
          if (isCorrect) {
            buttonClass += "bg-green-100 border-green-300 text-green-700 shadow-md scale-105";
          } else if (isSelected) {
            buttonClass += "bg-red-100 border-red-300 text-red-700";
          } else {
            buttonClass += "bg-gray-50 border-gray-200 text-gray-600";
          }
        } else {
          buttonClass += "bg-white hover:bg-blue-50 hover:border-blue-300 hover:shadow-sm";
        }

        return (
          <button
            key={index}
            onClick={() => !showQuizFeedback && handleQuizAnswer(option)}
            disabled={showQuizFeedback}
            className={buttonClass}
          >
            <div className="flex items-center justify-between">
              <span className="text-lg font-medium">{option}</span>
              {showQuizFeedback && isCorrect && (
                <Check className="w-5 h-5 text-green-600" />
              )}
              {showQuizFeedback && isSelected && !isCorrect && (
                <X className="w-5 h-5 text-red-600" />
              )}
            </div>
          </button>
        );
      });
    };

    switch (question.type) {
      case 'multiple-choice':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="text-6xl font-bold mb-6 animate-pulse-slow">{currentCard?.symbol}</div>
              <h3 className="text-2xl font-bold text-gray-700 mb-8">{question.question}</h3>
            </div>
            
            {showQuizFeedback && (
              <div className={`text-center p-4 rounded-lg animate-fade-in ${
                isCorrectAnswer(selectedAnswer, question.correctAnswer)

                  ? 'bg-green-50 text-green-700 border border-green-200'
                  : 'bg-red-50 text-red-700 border border-red-200'
              }`}>
                <div className="flex items-center justify-center gap-2">
                {isCorrectAnswer(selectedAnswer, question.correctAnswer) ? (
  <>
    <Check className="w-5 h-5" />
    <span className="font-bold">Correct!</span>
  </>
) : (

                    <>
                      <AlertCircle className="w-5 h-5" />
                      <span className="font-bold">Incorrect</span>
                    </>
                  )}
                </div>
                <div className="mt-2">
                  The correct answer is: <span className="font-bold">{question.correctAnswer}</span>
                </div>
              </div>
            )}
            
            <div className="grid grid-cols-2 gap-4">
              {renderOptions()}
            </div>
          </div>
        );

      case 'typing':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="text-6xl font-bold mb-6 animate-bounce-slow">{currentCard?.symbol}</div>
              <h3 className="text-2xl font-bold text-gray-700 mb-8">{question.question}</h3>
            </div>
            
            <div className="max-w-md mx-auto space-y-4">
              <input
                type="text"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && !showQuizFeedback && handleQuizAnswer(userAnswer)}
                className="w-full p-4 text-center text-xl border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Type romaji here..."
                autoFocus
                disabled={showQuizFeedback}
              />
              
              {showQuizFeedback && (
                <div className={`text-center p-4 rounded-lg animate-fade-in ${
isCorrectAnswer(userAnswer, question.correctAnswer)
                    ? 'bg-green-50 text-green-700 border border-green-200'
                    : 'bg-red-50 text-red-700 border border-red-200'
                }`}>
                  <div className="flex items-center justify-center gap-2">
                 {isCorrectAnswer(userAnswer, question.correctAnswer) ? (

                      <>
                        <Check className="w-5 h-5" />
                        <span className="font-bold">Correct!</span>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="w-5 h-5" />
                        <span className="font-bold">Incorrect</span>
                    </>
                    )}
                  </div>
                  <div className="mt-2">
                    The correct answer is: <span className="font-bold">{question.correctAnswer}</span>
                  </div>
                </div>
              )}
              
              <button
                onClick={() => !showQuizFeedback && handleQuizAnswer(userAnswer)}
                disabled={showQuizFeedback || !userAnswer.trim()}
                className={`w-full p-4 text-white rounded-lg transition-all ${
showQuizFeedback
  ? isCorrectAnswer(userAnswer, question.correctAnswer)

                      ? 'bg-green-600'
                      : 'bg-red-600'
                    : userAnswer.trim()
                    ? 'bg-blue-600 hover:bg-blue-700 hover:shadow-lg'
                    : 'bg-gray-400 cursor-not-allowed'
                }`}
              >
                {showQuizFeedback ? 'Next Question' : 'Submit Answer'}
              </button>
            </div>
          </div>
        );

      case 'matching':
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-center text-gray-700 mb-8">{question.question}</h3>
            
            {showQuizFeedback && (
              <div className={`text-center p-4 rounded-lg animate-fade-in ${
                selectedAnswer === question.correctAnswer 
                  ? 'bg-green-50 text-green-700 border border-green-200'
                  : 'bg-red-50 text-red-700 border border-red-200'
              }`}>
                <div className="flex items-center justify-center gap-2">
                {isCorrectAnswer(selectedAnswer, question.correctAnswer) ? (

                    <>
                      <Check className="w-5 h-5" />
                      <span className="font-bold">Correct!</span>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="w-5 h-5" />
                      <span className="font-bold">Incorrect</span>
                    </>
                  )}
                </div>
              </div>
            )}
            
            <div className="grid grid-cols-2 gap-4">
              {question.options?.map((option, index) => {
                const [symbol, romaji] = option.split('=');
              let isCorrect = isCorrectAnswer(option, question.correctAnswer);

                let isSelected = option === selectedAnswer;
                
                let buttonClass = "p-4 border rounded-xl transition-all duration-300 ";
                
                if (showQuizFeedback) {
                  if (isCorrect) {
                    buttonClass += "bg-green-100 border-green-300 text-green-700 shadow-md";
                  } else if (isSelected) {
                    buttonClass += "bg-red-100 border-red-300 text-red-700";
                  } else {
                    buttonClass += "bg-gray-50 border-gray-200 text-gray-600";
                  }
                } else {
                  buttonClass += "bg-white hover:bg-blue-50 hover:border-blue-300 hover:shadow-sm";
                }

                return (
                  <button
                    key={index}
                    onClick={() => !showQuizFeedback && handleQuizAnswer(option)}
                    disabled={showQuizFeedback}
                    className={buttonClass}
                  >
                    <div className="text-center">
                      <div className="text-3xl font-bold mb-2">{symbol}</div>
                      <div className="text-lg text-gray-600">{romaji}</div>
                    </div>
                    {showQuizFeedback && isCorrect && (
                      <div className="absolute top-2 right-2">
                        <Check className="w-5 h-5 text-green-600" />
                      </div>
                    )}
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
      <div className="flex flex-col items-center justify-center min-h-[500px] space-y-6">
        <div className="relative">
          <Loader2 className="w-16 h-16 text-blue-600 animate-spin" />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 blur-xl opacity-20 animate-pulse"></div>
        </div>
        <div className="text-center space-y-2">
          <p className="text-xl font-semibold text-gray-700">Loading Katakana Flashcards</p>
          <p className="text-gray-500">Preparing your learning experience...</p>
        </div>
      </div>
    );
  }

  if (isInitializing) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto" />
          <p className="text-gray-600">Initializing flashcards...</p>
        </div>
      </div>
    );
  }

  const currentCard = flashcards[currentCardIndex];

  return (
    <div className="max-w-9xl mx-auto p-4 md:p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8">
          <div className="space-y-2">
            <h1 className="text-3xl md:text-4xl font-bold text-blue-600 flex items-center gap-3">
              <span className="text-4xl md:text-5xl">カタカナ</span> 
              <Sparkles className="w-8 h-8 text-yellow-500" />
              <span>Flashcards</span>
            </h1>
            <p className="text-gray-600 flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              Master Japanese katakana characters through spaced repetition
            </p>
          </div>
          
          <div className="flex flex-wrap items-center gap-4">
            {/* Filter Options */}
            {/* <div className="flex flex-wrap gap-2 bg-gray-100 p-2 rounded-lg">
              <label className="flex items-center gap-2 px-3 py-2 bg-white rounded-md shadow-sm hover:shadow transition-all">
                <input
                  type="checkbox"
                  checked={includeDakuten}
                  onChange={(e) => setIncludeDakuten(e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm font-medium flex items-center gap-1">
                  <Filter className="w-3 h-3" />
                  Dakuten
                </span>
              </label>
              <label className="flex items-center gap-2 px-3 py-2 bg-white rounded-md shadow-sm hover:shadow transition-all">
                <input
                  type="checkbox"
                  checked={includeCombo}
                  onChange={(e) => setIncludeCombo(e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm font-medium flex items-center gap-1">
                  <Layers className="w-3 h-3" />
                  Combo
                </span>
              </label>
              <label className="flex items-center gap-2 px-3 py-2 bg-white rounded-md shadow-sm hover:shadow transition-all">
                <input
                  type="checkbox"
                  checked={includeYoon}
                  onChange={(e) => setIncludeYoon(e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm font-medium flex items-center gap-1">
                  <Settings className="w-3 h-3" />
                  Yoon
                </span>
              </label>
            </div> */}

            <div className="flex items-center gap-3">
              <div className="flex bg-gray-100 p-1 rounded-lg">
                {(['study', 'quiz', 'review'] as FlashcardMode[]).map((mode) => (
                  <button
                    key={mode}
                    onClick={() => changeMode(mode)}
                    className={`px-4 py-2 rounded-md capitalize transition-all flex items-center gap-2 ${
                      studyMode === mode
                        ? 'bg-white text-blue-600 shadow-sm'
                        : 'text-gray-700 hover:text-blue-600'
                    }`}
                  >
                    {mode === 'study' && <BookOpen className="w-4 h-4" />}
                    {mode === 'quiz' && <Target className="w-4 h-4" />}
                    {mode === 'review' && <RefreshCw className="w-4 h-4" />}
                    {mode}
                  </button>
                ))}
              </div>
              
              <button
                onClick={resetSession}
                className="p-2.5 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5"
                title="Reset session"
              >
                <RefreshCw className="w-5 h-5" />
              </button>

              <button
                onClick={clearProgress}
                className="p-2.5 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-lg hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5"
                title="Clear all progress"
              >
                <RotateCw className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Progress Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-gradient-to-br from-blue-50 to-white p-4 rounded-xl shadow-sm border border-blue-100">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <CardSim className="w-4 h-4" />
              Current Card
            </div>
            <div className="text-2xl font-bold text-blue-600 mt-1">
              {currentCardIndex + 1} <span className="text-gray-400">/</span> {flashcards.length}
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-green-50 to-white p-4 rounded-xl shadow-sm border border-green-100">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Check className="w-4 h-4" />
              Correct
            </div>
            <div className="text-2xl font-bold text-green-600 mt-1">{sessionStats.correct}</div>
          </div>
          
          <div className="bg-gradient-to-br from-purple-50 to-white p-4 rounded-xl shadow-sm border border-purple-100">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <TrendingUp className="w-4 h-4" />
              Streak
            </div>
            <div className="text-2xl font-bold text-purple-600 mt-1">{sessionStats.streak}</div>
          </div>
          
          <div className="bg-gradient-to-br from-amber-50 to-white p-4 rounded-xl shadow-sm border border-amber-100">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Zap className="w-4 h-4" />
              Max Streak
            </div>
            <div className="text-2xl font-bold text-amber-600 mt-1">{sessionStats.maxStreak}</div>
          </div>
          
          {studyMode === 'quiz' && !showStats && (
            <div className="bg-gradient-to-br from-indigo-50 to-white p-4 rounded-xl shadow-sm border border-indigo-100">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Timer className="w-4 h-4" />
                Time
              </div>
              <div className="text-2xl font-bold text-indigo-600 mt-1">
                {Math.floor(timeSpent / 60)}:{String(timeSpent % 60).padStart(2, '0')}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      {showStats ? (
        <div className="bg-gradient-to-br from-white to-blue-50 rounded-2xl shadow-xl p-8 text-center animate-fade-in">
          <div className="text-6xl mb-4 animate-bounce">🎉</div>
          <h2 className="text-3xl font-bold mb-2">Session Complete!</h2>
          <p className="text-gray-600 mb-8">Great job on completing the quiz!</p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
            <div className="p-6 bg-white rounded-xl shadow-sm border">
              <div className="text-3xl font-bold text-green-600 mb-2">{score}/{quizQuestions.length}</div>
              <div className="text-sm text-gray-600 flex items-center justify-center gap-2">
                <Trophy className="w-4 h-4" />
                Score
              </div>
            </div>
            <div className="p-6 bg-white rounded-xl shadow-sm border">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {Math.round((score / quizQuestions.length) * 100)}%
              </div>
              <div className="text-sm text-gray-600 flex items-center justify-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Accuracy
              </div>
            </div>
            <div className="p-6 bg-white rounded-xl shadow-sm border">
              <div className="text-3xl font-bold text-indigo-600 mb-2">
                {Math.floor(timeSpent / 60)}:{String(timeSpent % 60).padStart(2, '0')}
              </div>
              <div className="text-sm text-gray-600 flex items-center justify-center gap-2">
                <Clock className="w-4 h-4" />
                Time
              </div>
            </div>
            <div className="p-6 bg-white rounded-xl shadow-sm border">
              <div className="text-3xl font-bold text-amber-600 mb-2">{sessionStats.maxStreak}</div>
              <div className="text-sm text-gray-600 flex items-center justify-center gap-2">
                <Zap className="w-4 h-4" />
                Max Streak
              </div>
            </div>
          </div>

          <div className="space-y-4 max-w-md mx-auto">
            <button
              onClick={resetSession}
              className="w-full p-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex items-center justify-center gap-3"
            >
              <RefreshCw className="w-5 h-5" />
              Practice Again
            </button>
            <button
              onClick={() => changeMode('study')}
              className="w-full p-4 bg-white text-gray-700 border rounded-xl hover:bg-gray-50 hover:shadow-md transition-all"
            >
              Switch to Study Mode
            </button>
          </div>
        </div>
      ) : studyMode === 'quiz' ? (
        <div className="bg-gradient-to-br from-white to-indigo-50 rounded-2xl shadow-xl p-6 md:p-8 animate-slide-up">
          <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="space-y-2">
              <span className="text-lg font-medium text-blue-700">
                Question {currentQuestion + 1} of {quizQuestions.length}
              </span>
              <div className="h-2 bg-blue-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500 ease-out"
                  style={{ width: `${((currentQuestion + 1) / quizQuestions.length) * 100}%` }}
                />
              </div>
            </div>
            <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-lg shadow-sm">
              <Timer className="w-5 h-5 text-purple-600" />
              <span className="font-bold text-gray-800">
                {Math.floor(timeSpent / 60)}:{String(timeSpent % 60).padStart(2, '0')}
              </span>
            </div>
          </div>
          
          {renderQuizQuestion()}
        </div>
      ) : (
        /* Flashcard Study Mode */
        <div className="relative">
          {/* Flashcard Container */}
          <div className="perspective-1000">
            <div
              ref={cardRef}
              className={`relative w-full max-w-lg mx-auto h-[420px] cursor-pointer transition-all duration-500 ease-out ${
                isFlipped ? 'rotate-y-180' : ''
              }`}
              style={{
                transformStyle: 'preserve-3d',
                transition: 'all 0.5s ease-out'
              }}
              onClick={handleCardFlip}
            >
              {/* Front of card */}
              <div className="absolute inset-0 bg-gradient-to-br from-white to-blue-50 rounded-3xl shadow-2xl p-8 flex flex-col items-center justify-center backface-hidden border-4 border-white">
                <div className="absolute top-6 right-6 bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm font-medium">
                  Study Mode
                </div>
                
                <div className="text-9xl font-bold mb-8 animate-pulse-slow text-blue-600">
                  {currentCard?.symbol}
                </div>
                
                <div className="flex gap-4 mb-6">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      playAudio(currentCard?.symbol || '');
                    }}
                    className="p-3.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full hover:shadow-lg transition-all duration-300 transform hover:scale-110"
                  >
                    <Volume2 className="w-7 h-7" />
                  </button>
                  <div className="p-3.5">
                    <CardSim className="w-7 h-7 text-gray-400" />
                  </div>
                </div>
                
                <p className="text-gray-500 mt-4 flex items-center gap-2">
                  <RotateCw className="w-4 h-4" />
                  Click to flip card
                </p>
              </div>

              {/* Back of card */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl shadow-2xl p-8 flex flex-col items-center justify-center backface-hidden border-4 border-white transform rotate-y-180">
                <div className="absolute top-6 left-6 bg-indigo-100 text-indigo-600 px-3 py-1 rounded-full text-sm font-medium">
                  {currentCard?.romaji}
                </div>
                
                <div className="text-8xl font-bold mb-6 text-gray-800">
                  {currentCard?.symbol}
                </div>
                
                <div className="text-5xl font-mono text-blue-600 mb-6 animate-bounce-slow">
                  {currentCard?.romaji}
                </div>
                
                <div className="text-center mb-8 max-w-md">
                  <p className="text-gray-700 text-lg mb-4">{currentCard?.explanation}</p>
                  {currentCard?.example && (
                    <p className="text-gray-600 italic text-lg">{currentCard.example}</p>
                  )}
                </div>
                
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    playAudio(currentCard?.example?.split(' ')[0] || currentCard?.symbol || '');
                  }}
                  className="p-3.5 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-full hover:shadow-lg transition-all duration-300 transform hover:scale-110"
                >
                  <Volume2 className="w-7 h-7" />
                </button>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex justify-center items-center gap-6 mt-10">
            <button
              onClick={handlePrevCard}
              disabled={isAnimating}
              className="p-4 bg-gradient-to-r from-gray-100 to-white rounded-full hover:shadow-lg transition-all duration-300 transform hover:-translate-x-1 disabled:opacity-50"
            >
              <ChevronLeft className="w-7 h-7" />
            </button>
            
            <div className="flex gap-6">
              <button
                onClick={markAsUnknown}
                disabled={isAnimating}
                className="px-8 py-4 bg-gradient-to-r from-red-100 to-red-50 text-red-700 rounded-xl hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex items-center gap-3 border border-red-200 disabled:opacity-50"
              >
                <X className="w-6 h-6" />
                <span className="font-semibold">Don't Know</span>
              </button>
              
              <button
                onClick={markAsKnown}
                disabled={isAnimating}
                className="px-8 py-4 bg-gradient-to-r from-green-100 to-green-50 text-green-700 rounded-xl hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex items-center gap-3 border border-green-200 disabled:opacity-50"
              >
                <Check className="w-6 h-6" />
                <span className="font-semibold">I Know It</span>
              </button>
            </div>
            
            <button
              onClick={handleNextCard}
              disabled={isAnimating}
              className="p-4 bg-gradient-to-r from-gray-100 to-white rounded-full hover:shadow-lg transition-all duration-300 transform hover:translate-x-1 disabled:opacity-50"
            >
              <ChevronRight className="w-7 h-7" />
            </button>
          </div>

          {/* Card Stats */}
          {currentCard && (
            <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl mx-auto">
              <div className="text-center p-4 bg-white rounded-xl shadow-sm border">
                <div className="text-sm text-gray-600 mb-2">Reviews</div>
                <div className="text-2xl font-bold text-gray-800">{currentCard.reviewCount}</div>
              </div>
              <div className="text-center p-4 bg-white rounded-xl shadow-sm border">
                <div className="text-sm text-gray-600 mb-2">Correct</div>
                <div className="text-2xl font-bold text-green-600">{currentCard.correctCount}</div>
              </div>
              <div className="text-center p-4 bg-white rounded-xl shadow-sm border">
                <div className="text-sm text-gray-600 mb-2">Streak</div>
                <div className="text-2xl font-bold text-blue-600">{currentCard.streak}</div>
              </div>
              <div className="text-center p-4 bg-white rounded-xl shadow-sm border">
                <div className="text-sm text-gray-600 mb-2">Difficulty</div>
                <div className={`text-2xl font-bold ${
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
        <div className="mt-10 animate-fade-in">
          <div className="flex items-center gap-3 mb-6">
            <Target className="w-6 h-6 text-blue-600" />
            <h3 className="text-xl font-bold text-gray-800">Cards Due for Review</h3>
            <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm font-medium">
              {reviewCards.length} cards
            </span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {reviewCards.map((card, index) => (
              <div 
                key={index} 
                className="bg-gradient-to-br from-white to-blue-50 p-5 rounded-xl shadow-sm border border-blue-100 hover:shadow-md transition-all duration-300 hover:-translate-y-1"
              >
                <div className="text-4xl font-bold text-center mb-3">{card.symbol}</div>
                <div className="text-center text-gray-600 font-medium">{card.romaji}</div>
                {card.streak > 0 && (
                  <div className="text-center mt-2">
                    <span className="inline-block bg-purple-100 text-purple-600 text-xs px-2 py-1 rounded">
                      Streak: {card.streak}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Memory Progress */}
      <div className="mt-10 bg-gradient-to-br from-gray-50 to-white rounded-xl p-6 shadow-sm border">
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          <BookOpen className="w-5 h-5" />
          Memory Progress
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <div className="text-sm text-gray-600 mb-2">Mastered Characters</div>
            <div className="text-2xl font-bold text-green-600">
              {flashcards.filter(c => c.isLearned).length} / {flashcards.length}
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden mt-2">
              <div 
                className="h-full bg-green-500 transition-all"
                style={{ width: `${(flashcards.filter(c => c.isLearned).length / flashcards.length) * 100}%` }}
              />
            </div>
          </div>
          
          <div>
            <div className="text-sm text-gray-600 mb-2">Total Reviews</div>
            <div className="text-2xl font-bold text-blue-600">
              {flashcards.reduce((sum, card) => sum + card.reviewCount, 0)}
            </div>
            <div className="text-sm text-gray-500 mt-1">Lifetime reviews</div>
          </div>
          
          <div>
            <div className="text-sm text-gray-600 mb-2">Accuracy Rate</div>
            <div className="text-2xl font-bold text-purple-600">
              {flashcards.reduce((sum, card) => sum + card.correctCount, 0) + flashcards.reduce((sum, card) => sum + card.wrongCount, 0) > 0 
                ? Math.round((flashcards.reduce((sum, card) => sum + card.correctCount, 0) / 
                  (flashcards.reduce((sum, card) => sum + card.correctCount, 0) + 
                   flashcards.reduce((sum, card) => sum + card.wrongCount, 0))) * 100)
                : 0}%
            </div>
            <div className="text-sm text-gray-500 mt-1">Overall accuracy</div>
          </div>
        </div>
      </div>

      {/* Add CSS animations */}
      <style jsx>{`
        .perspective-1000 {
          perspective: 1000px;
        }
        .backface-hidden {
          backface-visibility: hidden;
        }
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
        .animate-pulse-slow {
          animation: pulse 3s infinite;
        }
        .animate-bounce-slow {
          animation: bounce 2s infinite;
        }
        .animate-fade-in {
          animation: fadeIn 0.5s ease-out;
        }
        .animate-slide-up {
          animation: slideUp 0.5s ease-out;
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.9; }
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { 
            opacity: 0;
            transform: translateY(20px);
          }
          to { 
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default KatakanaFlashcards;