// pages/KanjiLearning.tsx
import React, { useState, useEffect, useRef } from 'react';
import {
  BookOpen,
  PenTool,
  Target,
  CheckCircle,
  XCircle,
  RotateCw,
  Star,
  TrendingUp,
  Clock,
  Award,
  Sparkles,
  Bookmark,
  Volume2,
  VolumeX,
  ChevronRight,
  ChevronLeft,
  Filter,
  Search,
  Layers,
  Zap,
  Eye,
  EyeOff,
  Lightbulb,
  Brain,
  Timer,
  Play,
  Pause,
  Headphones,
  HelpCircle,
  Info,
  RefreshCw,
  Share2,
  Heart,
  ThumbsUp,
  MessageSquare,
  FileText,
  ClipboardCheck,
  BarChart,
  Target as TargetIcon,
  Users,
  Calendar,
  Trophy,
  BrainCircuit,
  ChevronDown,
  ChevronUp,
  Lock,
  Unlock,
  Shuffle,
  Repeat,
  FastForward,
  Rewind,
  CheckSquare,
  Square,
  type LucideIcon,
  CardSim
} from 'lucide-react';

// Import your JSON data
import kanjiData from './N5/N5kanji.json';

type JLPTLevel = 'N5' | 'N4' | 'N3' | 'N2' | 'N1';
type KanjiStatus = 'new' | 'learning' | 'review' | 'mastered';
type StudyMode = 'learn' | 'quiz' | 'flashcards' | 'writing';

interface KanjiCharacter {
  id: string;
  character: string;
  meaning: string;
  onyomi: string[];
  kunyomi: string[];
  strokes: number;
  jlptLevel: JLPTLevel;
  examples: {
    word: string;
    reading: string;
    meaning: string;
  }[];
  radicals: string[];
  description: string;
  memoryHint: string;
  mnemonic: string;
  composition: string;
  similarKanji: string[];
  tags: string[];
  status: KanjiStatus;
  reviewCount: number;
  lastReviewed?: Date;
  nextReview?: Date;
  isBookmarked: boolean;
  frequency: number;
}

interface QuizQuestion {
  id: string;
  question: string;
  type: 'meaning' | 'reading' | 'character';
  options: string[];
  correctAnswer: string;
  kanjiId: string;
  explanation: string;
}

const KanjiLearning = () => {
  // Transform JSON data to match our interface
  const initialKanjiList: KanjiCharacter[] = kanjiData.map((kanji: any, index: number) => ({
    id: kanji.id.toString(),
    character: kanji.kanji,
    meaning: kanji.meaning,
    onyomi: kanji.onyomi || [],
    kunyomi: kanji.kunyomi || [],
    strokes: kanji.strokes,
    jlptLevel: kanji.jlpt as JLPTLevel,
    examples: kanji.examples || [],
    radicals: kanji.radical ? [kanji.radical] : [],
    description: kanji.description || '',
    memoryHint: kanji.memoryHint || '',
    mnemonic: kanji.mnemonic || '',
    composition: kanji.composition || '',
    similarKanji: kanji.similarKanji || [],
    tags: kanji.tags || [],
    status: (['new', 'learning', 'review', 'mastered'] as KanjiStatus[])[Math.floor(Math.random() * 4)],
    reviewCount: Math.floor(Math.random() * 15),
    isBookmarked: Math.random() > 0.5,
    frequency: kanji.frequency || 100 - index
  }));

  const [kanjiList, setKanjiList] = useState<KanjiCharacter[]>(initialKanjiList);
  const [currentKanjiIndex, setCurrentKanjiIndex] = useState(0);
  const [selectedLevel, setSelectedLevel] = useState<JLPTLevel | 'all'>('N5');
  const [selectedStatus, setSelectedStatus] = useState<KanjiStatus | 'all'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showDetails, setShowDetails] = useState(false);
  const [studyMode, setStudyMode] = useState<StudyMode>('learn');
  const [practiceMode, setPracticeMode] = useState<'meaning' | 'reading' | 'writing' | 'memory' | 'audio'>('meaning');
  const [userAnswer, setUserAnswer] = useState('');
  const [showAnswer, setShowAnswer] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [showMnemonic, setShowMnemonic] = useState(false);
  const [audioPlaying, setAudioPlaying] = useState(false);
  const [currentAudio, setCurrentAudio] = useState<'kanji' | 'meaning' | 'reading' | null>(null);
  const [isFlipping, setIsFlipping] = useState(false);
  const [pulseAnimation, setPulseAnimation] = useState(false);
  const [kanjiScale, setKanjiScale] = useState(1);
  const [showConfetti, setShowConfetti] = useState(false);
  const [isQuizActive, setIsQuizActive] = useState(false);
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [selectedQuizOption, setSelectedQuizOption] = useState<string | null>(null);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [isFlashcardFlipped, setIsFlashcardFlipped] = useState(false);
  const [flashcardIndex, setFlashcardIndex] = useState(0);
  const [flashcardRevealed, setFlashcardRevealed] = useState(false);

  const kanjiRef = useRef<HTMLDivElement>(null);

  const [stats, setStats] = useState({
    totalKanji: initialKanjiList.length,
    learned: initialKanjiList.filter(k => k.status === 'mastered').length,
    inProgress: initialKanjiList.filter(k => k.status === 'learning' || k.status === 'review').length,
    accuracy: 85,
    streak: 12,
    n5Kanji: initialKanjiList.filter(k => k.jlptLevel === 'N5').length,
    bookmarked: initialKanjiList.filter(k => k.isBookmarked).length,
    todayReviewed: 0,
    totalReviews: initialKanjiList.reduce((sum, k) => sum + k.reviewCount, 0),
    quizAttempts: 24,
    flashcardsReviewed: 156
  });

  const filteredKanji = kanjiList.filter(kanji => {
    const matchesLevel = selectedLevel === 'all' || kanji.jlptLevel === selectedLevel;
    const matchesStatus = selectedStatus === 'all' || kanji.status === selectedStatus;
    const matchesSearch = searchTerm === '' || 
                         kanji.character.includes(searchTerm) || 
                         kanji.meaning.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         kanji.onyomi.some(o => o.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         kanji.kunyomi.some(k => k.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         kanji.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesLevel && matchesStatus && matchesSearch;
  });

  const currentKanji = filteredKanji[currentKanjiIndex];

  const jlptLevels: (JLPTLevel | 'all')[] = ['all', 'N5', 'N4', 'N3', 'N2', 'N1'];
  const statusOptions: (KanjiStatus | 'all')[] = ['all', 'new', 'learning', 'review', 'mastered'];

  const getStatusColor = (status: KanjiStatus) => {
    switch (status) {
      case 'new': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'learning': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'review': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'mastered': return 'bg-purple-50 text-purple-700 border-purple-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getLevelColor = (level: JLPTLevel | 'all') => {
    switch (level) {
      case 'N5': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'N4': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'N3': return 'bg-violet-50 text-violet-700 border-violet-200';
      case 'N2': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'N1': return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'all': return 'bg-slate-50 text-slate-700 border-slate-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getStatusColorClasses = (status: KanjiStatus) => {
    switch (status) {
      case 'new': return 'from-blue-50 to-indigo-50 text-blue-700 border-blue-200';
      case 'learning': return 'from-emerald-50 to-teal-50 text-emerald-700 border-emerald-200';
      case 'review': return 'from-amber-50 to-orange-50 text-amber-700 border-amber-200';
      case 'mastered': return 'from-purple-50 to-violet-50 text-purple-700 border-purple-200';
      default: return 'from-gray-50 to-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getLevelColorClasses = (level: JLPTLevel | 'all') => {
    switch (level) {
      case 'N5': return 'from-emerald-50 to-teal-50 text-emerald-700 border-emerald-200';
      case 'N4': return 'from-blue-50 to-cyan-50 text-blue-700 border-blue-200';
      case 'N3': return 'from-violet-50 to-purple-50 text-violet-700 border-violet-200';
      case 'N2': return 'from-amber-50 to-orange-50 text-amber-700 border-amber-200';
      case 'N1': return 'from-rose-50 to-pink-50 text-rose-700 border-rose-200';
      case 'all': return 'from-slate-50 to-gray-50 text-slate-700 border-slate-200';
      default: return 'from-gray-50 to-gray-100 text-gray-700 border-gray-200';
    }
  };

  const generateQuizQuestions = (count: number = 10): QuizQuestion[] => {
    const selectedKanji = [...filteredKanji]
      .sort(() => Math.random() - 0.5)
      .slice(0, Math.min(count, filteredKanji.length));
    
    const questions: QuizQuestion[] = [];
    
    selectedKanji.forEach((kanji) => {
      // Meaning question
      if (kanji.meaning) {
        const otherMeanings = kanjiList
          .filter(k => k.id !== kanji.id && k.meaning)
          .sort(() => Math.random() - 0.5)
          .slice(0, 3)
          .map(k => k.meaning);
        
        const meaningOptions = [
          kanji.meaning,
          ...otherMeanings
        ].sort(() => Math.random() - 0.5);
        
        questions.push({
          id: `meaning-${kanji.id}-${Date.now()}`,
          question: `What does "${kanji.character}" mean?`,
          type: 'meaning',
          options: meaningOptions,
          correctAnswer: kanji.meaning,
          kanjiId: kanji.id,
          explanation: `"${kanji.character}" means "${kanji.meaning}"`
        });
      }
      
      // Reading question
      const primaryReading = kanji.onyomi[0] || kanji.kunyomi[0];
      if (primaryReading) {
        const otherReadings = kanjiList
          .filter(k => k.id !== kanji.id)
          .flatMap(k => [...(k.onyomi || []), ...(k.kunyomi || [])])
          .filter(Boolean)
          .sort(() => Math.random() - 0.5)
          .slice(0, 3);
        
        const readingOptions = [
          primaryReading,
          ...otherReadings
        ].sort(() => Math.random() - 0.5);
        
        questions.push({
          id: `reading-${kanji.id}-${Date.now()}`,
          question: `What is a reading for "${kanji.character}"?`,
          type: 'reading',
          options: readingOptions,
          correctAnswer: primaryReading,
          kanjiId: kanji.id,
          explanation: `"${kanji.character}" can be read as "${kanji.onyomi?.join(', ') || 'N/A'}" (on'yomi) or "${kanji.kunyomi?.join(', ') || 'N/A'}" (kun'yomi)`
        });
      }
      
      // Character question
      const otherCharacters = kanjiList
        .filter(k => k.id !== kanji.id)
        .sort(() => Math.random() - 0.5)
        .slice(0, 3)
        .map(k => k.character);
      
      const characterOptions = [
        kanji.character,
        ...otherCharacters
      ].sort(() => Math.random() - 0.5);
      
      questions.push({
        id: `character-${kanji.id}-${Date.now()}`,
        question: `Which kanji means "${kanji.meaning}"?`,
        type: 'character',
        options: characterOptions,
        correctAnswer: kanji.character,
        kanjiId: kanji.id,
        explanation: `The kanji for "${kanji.meaning}" is "${kanji.character}"`
      });
    });
    
    return questions.sort(() => Math.random() - 0.5).slice(0, count);
  };

  const startQuiz = () => {
    const questions = generateQuizQuestions(10);
    setQuizQuestions(questions);
    setCurrentQuizIndex(0);
    setQuizScore(0);
    setQuizCompleted(false);
    setIsQuizActive(true);
    setSelectedQuizOption(null);
    setStudyMode('quiz');
  };

  const handleQuizAnswer = (option: string) => {
    if (selectedQuizOption || quizCompleted) return;
    
    const currentQuestion = quizQuestions[currentQuizIndex];
    if (!currentQuestion) return;
    
    const isCorrect = option === currentQuestion.correctAnswer;
    setSelectedQuizOption(option);
    
    if (isCorrect) {
      setQuizScore(prev => prev + 1);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 2000);
    }

    setTimeout(() => {
      if (currentQuizIndex < quizQuestions.length - 1) {
        setCurrentQuizIndex(prev => prev + 1);
        setSelectedQuizOption(null);
      } else {
        setQuizCompleted(true);
      }
    }, 2000);
  };

  const resetQuiz = () => {
    setIsQuizActive(false);
    setQuizQuestions([]);
    setCurrentQuizIndex(0);
    setQuizScore(0);
    setQuizCompleted(false);
    setSelectedQuizOption(null);
    setStudyMode('learn');
  };

  const startFlashcards = () => {
    if (filteredKanji.length === 0) return;
    
    setFlashcardIndex(0);
    setIsFlashcardFlipped(false);
    setFlashcardRevealed(false);
    setStudyMode('flashcards');
  };

  const nextFlashcard = () => {
    if (filteredKanji.length === 0) return;
    
    if (flashcardIndex < filteredKanji.length - 1) {
      setFlashcardIndex(prev => prev + 1);
      setIsFlashcardFlipped(false);
      setFlashcardRevealed(false);
    } else {
      setFlashcardIndex(0);
      setIsFlashcardFlipped(false);
      setFlashcardRevealed(false);
    }
  };

  const prevFlashcard = () => {
    if (filteredKanji.length === 0) return;
    
    if (flashcardIndex > 0) {
      setFlashcardIndex(prev => prev - 1);
      setIsFlashcardFlipped(false);
      setFlashcardRevealed(false);
    }
  };

  const toggleFlashcard = () => {
    setIsFlashcardFlipped(!isFlashcardFlipped);
    setFlashcardRevealed(true);
  };

  const toggleBookmark = (kanjiId: string) => {
    setKanjiList(prev => prev.map(k => 
      k.id === kanjiId ? { ...k, isBookmarked: !k.isBookmarked } : k
    ));
    setKanjiScale(1.1);
    setTimeout(() => setKanjiScale(1), 200);
  };

  const playKanjiAudio = (kanji: string) => {
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
      setCurrentAudio('kanji');
      setAudioPlaying(true);
      
      const utterance = new SpeechSynthesisUtterance(kanji);
      utterance.lang = 'ja-JP';
      utterance.rate = 0.8;
      utterance.volume = 1;
      
      utterance.onend = () => {
        setAudioPlaying(false);
        setCurrentAudio(null);
      };
      
      utterance.onerror = () => {
        setAudioPlaying(false);
        setCurrentAudio(null);
      };
      
      speechSynthesis.speak(utterance);
    }
  };

  const playMeaningAudio = (meaning: string) => {
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
      setCurrentAudio('meaning');
      setAudioPlaying(true);
      
      const utterance = new SpeechSynthesisUtterance(meaning);
      utterance.lang = 'en-US';
      utterance.rate = 0.9;
      utterance.volume = 1;
      
      utterance.onend = () => {
        setAudioPlaying(false);
        setCurrentAudio(null);
      };
      
      utterance.onerror = () => {
        setAudioPlaying(false);
        setCurrentAudio(null);
      };
      
      speechSynthesis.speak(utterance);
    }
  };

  const playReadingAudio = (reading: string) => {
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
      setCurrentAudio('reading');
      setAudioPlaying(true);
      
      const utterance = new SpeechSynthesisUtterance(reading);
      utterance.lang = 'ja-JP';
      utterance.rate = 0.8;
      utterance.volume = 1;
      
      utterance.onend = () => {
        setAudioPlaying(false);
        setCurrentAudio(null);
      };
      
      utterance.onerror = () => {
        setAudioPlaying(false);
        setCurrentAudio(null);
      };
      
      speechSynthesis.speak(utterance);
    }
  };

  const stopAudio = () => {
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
    }
    setAudioPlaying(false);
    setCurrentAudio(null);
  };

  const checkAnswer = () => {
    if (!currentKanji) return;

    let correct = false;
    const userAnswerLower = userAnswer.toLowerCase().trim();

    if (practiceMode === 'meaning') {
      correct = currentKanji.meaning.toLowerCase().includes(userAnswerLower) ||
                userAnswerLower.includes(currentKanji.meaning.toLowerCase());
    } else if (practiceMode === 'reading') {
      correct = currentKanji.onyomi?.some(o => o.toLowerCase() === userAnswerLower) ||
                currentKanji.kunyomi?.some(k => k.toLowerCase() === userAnswerLower) ||
                false;
    } else if (practiceMode === 'memory' || practiceMode === 'audio') {
      correct = true;
    }

    setIsCorrect(correct);
    setShowAnswer(true);
    setPulseAnimation(true);

    if (correct) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 2000);
      
      setKanjiList(prev => prev.map(k => 
        k.id === currentKanji.id 
          ? { 
              ...k, 
              status: k.status === 'new' ? 'learning' : 
                      k.status === 'learning' ? 'review' : 
                      k.status === 'review' ? 'mastered' : 'mastered',
              reviewCount: (k.reviewCount || 0) + 1,
              lastReviewed: new Date()
            }
          : k
      ));
    }

    setTimeout(() => {
      setShowAnswer(false);
      setUserAnswer('');
      setIsCorrect(null);
      setShowHint(false);
      setShowMnemonic(false);
      setPulseAnimation(false);
      nextKanji();
    }, 2000);
  };

  const nextKanji = () => {
    if (filteredKanji.length === 0) return;
    
    if (currentKanjiIndex < filteredKanji.length - 1) {
      setCurrentKanjiIndex(prev => prev + 1);
      triggerFlipAnimation();
    } else {
      setCurrentKanjiIndex(0);
      triggerFlipAnimation();
    }
  };

  const prevKanji = () => {
    if (filteredKanji.length === 0) return;
    
    if (currentKanjiIndex > 0) {
      setCurrentKanjiIndex(prev => prev - 1);
      triggerFlipAnimation();
    }
  };

  const triggerFlipAnimation = () => {
    setIsFlipping(true);
    setTimeout(() => setIsFlipping(false), 600);
  };

  const renderWritingGuide = () => {
    if (!currentKanji) return null;

    const strokeOrder = Array.from({ length: currentKanji.strokes || 1 }, (_, i) => i + 1);
    
    return (
      <div className="mt-8">
        <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <PenTool className="w-5 h-5 text-amber-600" />
          Stroke Order Practice
        </h4>
        <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
          {strokeOrder.map((stroke) => (
            <div key={stroke} className="relative group">
              <div className="absolute top-1 left-1 text-xs font-bold text-amber-600 z-10">
                {stroke}
              </div>
              <div className="w-16 h-16 border-2 border-amber-300 rounded-xl flex items-center justify-center bg-amber-50 group-hover:scale-105 transition-transform duration-200">
                <div className="text-2xl font-bold text-gray-900">{currentKanji.character}</div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-br from-amber-200/20 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
            </div>
          ))}
        </div>
        <div className="mt-4 p-4 bg-blue-50 rounded-xl border border-blue-200">
          <p className="text-sm text-blue-700">
            <span className="font-bold">Tip:</span> Practice writing each stroke in order. 
            Start from the top left and move to bottom right. Traditional writing follows specific stroke order rules.
          </p>
        </div>
      </div>
    );
  };

  const renderMemoryMode = () => {
    if (!currentKanji) return null;

    return (
      <div className="mt-8 space-y-6">
        <div className="p-4 bg-purple-50 rounded-xl border border-purple-200">
          <div className="flex items-center gap-2 mb-2">
            <Brain className="w-5 h-5 text-purple-600" />
            <h4 className="font-bold text-purple-700">Memory Techniques</h4>
          </div>
          
          <div className="mb-4">
            <button
              onClick={() => setShowHint(!showHint)}
              className="flex items-center gap-2 text-sm text-purple-600 hover:text-purple-700 transition-colors"
            >
              {showHint ? <EyeOff size={16} /> : <Eye size={16} />}
              {showHint ? 'Hide Memory Hint' : 'Show Memory Hint'}
            </button>
            {showHint && currentKanji.memoryHint && (
              <div className="mt-2 p-3 bg-white rounded-lg border border-purple-100">
                <p className="text-purple-700">{currentKanji.memoryHint}</p>
              </div>
            )}
          </div>

          <div>
            <button
              onClick={() => setShowMnemonic(!showMnemonic)}
              className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 transition-colors"
            >
              {showMnemonic ? <EyeOff size={16} /> : <Eye size={16} />}
              {showMnemonic ? 'Hide Mnemonic Story' : 'Show Mnemonic Story'}
            </button>
            {showMnemonic && currentKanji.mnemonic && (
              <div className="mt-2 p-3 bg-white rounded-lg border border-blue-100">
                <p className="text-blue-700">{currentKanji.mnemonic}</p>
              </div>
            )}
          </div>
        </div>

        {currentKanji.composition && (
          <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200">
            <h4 className="font-bold text-emerald-700 mb-2">Character Composition</h4>
            <p className="text-emerald-700">{currentKanji.composition}</p>
          </div>
        )}

        {currentKanji.similarKanji && currentKanji.similarKanji.length > 0 && (
          <div className="p-4 bg-amber-50 rounded-xl border border-amber-200">
            <h4 className="font-bold text-amber-700 mb-2">Similar Kanji (Watch out!)</h4>
            <div className="flex gap-2">
              {currentKanji.similarKanji.map((kanji, index) => (
                <div 
                  key={index} 
                  className="text-2xl font-bold text-amber-600 hover:scale-110 transition-transform duration-200 cursor-help"
                  title={`Kanji that looks similar to ${currentKanji.character}`}
                >
                  {kanji}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderAudioMode = () => {
    if (!currentKanji) return null;

    return (
      <div className="mt-8">
        <div className="p-6 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl border border-indigo-200">
          <div className="flex items-center gap-3 mb-6">
            <Headphones className="w-6 h-6 text-indigo-600" />
            <h4 className="text-xl font-bold text-indigo-700">Audio Practice</h4>
          </div>

          <div className="space-y-4">
            <div className="p-4 bg-white rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-gray-700">Kanji Pronunciation</span>
                <button
                  onClick={() => playKanjiAudio(currentKanji.character)}
                  disabled={audioPlaying && currentAudio === 'kanji'}
                  className="flex items-center gap-2 px-3 py-1 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 disabled:opacity-50 transition-colors"
                >
                  {audioPlaying && currentAudio === 'kanji' ? (
                    <Pause size={14} />
                  ) : (
                    <Play size={14} />
                  )}
                  Play
                </button>
              </div>
              <div className="text-3xl font-bold text-center mt-2">{currentKanji.character}</div>
            </div>

            <div className="p-4 bg-white rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-gray-700">Meaning</span>
                <button
                  onClick={() => playMeaningAudio(currentKanji.meaning)}
                  disabled={audioPlaying && currentAudio === 'meaning'}
                  className="flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 disabled:opacity-50 transition-colors"
                >
                  {audioPlaying && currentAudio === 'meaning' ? (
                    <Pause size={14} />
                  ) : (
                    <Play size={14} />
                  )}
                  Play
                </button>
              </div>
              <div className="text-lg text-center mt-2 text-gray-800">{currentKanji.meaning}</div>
            </div>

            <div className="p-4 bg-white rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-gray-700">Readings</span>
                <div className="flex gap-2">
                  {currentKanji.onyomi?.[0] && (
                    <button
                      onClick={() => playReadingAudio(currentKanji.onyomi[0])}
                      disabled={audioPlaying && currentAudio === 'reading'}
                      className="flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 disabled:opacity-50 transition-colors text-sm"
                    >
                      {audioPlaying && currentAudio === 'reading' ? (
                        <Pause size={12} />
                      ) : (
                        <Play size={12} />
                      )}
                      音読み
                    </button>
                  )}
                  {currentKanji.kunyomi?.[0] && (
                    <button
                      onClick={() => playReadingAudio(currentKanji.kunyomi[0])}
                      disabled={audioPlaying && currentAudio === 'reading'}
                      className="flex items-center gap-1 px-3 py-1 bg-emerald-100 text-emerald-700 rounded-lg hover:bg-emerald-200 disabled:opacity-50 transition-colors text-sm"
                    >
                      {audioPlaying && currentAudio === 'reading' ? (
                        <Pause size={12} />
                      ) : (
                        <Play size={12} />
                      )}
                      訓読み
                    </button>
                  )}
                </div>
              </div>
              <div className="text-center mt-2 space-y-1">
                {currentKanji.onyomi && currentKanji.onyomi.length > 0 && (
                  <div className="text-gray-800">
                    <span className="font-medium">On'yomi:</span> {currentKanji.onyomi.join(', ')}
                  </div>
                )}
                {currentKanji.kunyomi && currentKanji.kunyomi.length > 0 && (
                  <div className="text-gray-800">
                    <span className="font-medium">Kun'yomi:</span> {currentKanji.kunyomi.join(', ')}
                  </div>
                )}
              </div>
            </div>

            {currentKanji.examples && currentKanji.examples[0] && (
              <div className="p-4 bg-white rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-gray-700">Example Word</span>
                  <button
                    onClick={() => playReadingAudio(currentKanji.examples[0].word)}
                    disabled={audioPlaying && currentAudio === 'reading'}
                    className="flex items-center gap-2 px-3 py-1 bg-amber-100 text-amber-700 rounded-lg hover:bg-amber-200 disabled:opacity-50 transition-colors"
                  >
                    {audioPlaying && currentAudio === 'reading' ? (
                      <Pause size={14} />
                    ) : (
                      <Play size={14} />
                    )}
                    Play Example
                  </button>
                </div>
                <div className="text-center space-y-1">
                  <div className="text-xl font-semibold text-gray-900">{currentKanji.examples[0].word}</div>
                  <div className="text-gray-600">{currentKanji.examples[0].reading}</div>
                  <div className="text-gray-700 italic">"{currentKanji.examples[0].meaning}"</div>
                </div>
              </div>
            )}

            <div className="flex items-center justify-center gap-4 pt-4 border-t border-indigo-200">
              <button
                onClick={stopAudio}
                disabled={!audioPlaying}
                className="p-2 bg-red-100 text-red-700 rounded-full hover:bg-red-200 disabled:opacity-30 transition-colors"
              >
                <Pause size={20} />
              </button>
              <div className="text-sm text-gray-600">
                {audioPlaying ? 'Playing...' : 'Tap buttons to hear pronunciation'}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderQuiz = () => {
    if (!isQuizActive) return null;

    if (quizCompleted) {
      return (
        <div className="max-w-2xl mx-auto">
          <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-8 border border-emerald-200">
            <div className="text-center mb-8">
              <Trophy className="w-20 h-20 text-amber-500 mx-auto mb-4" />
              <h3 className="text-3xl font-bold text-gray-900 mb-2">Quiz Complete!</h3>
              <p className="text-gray-600 mb-6">Great job completing the kanji quiz!</p>
              
              <div className="bg-white rounded-xl p-6 shadow-lg mb-8">
                <div className="text-5xl font-bold text-emerald-600 mb-2">
                  {quizScore}/{quizQuestions.length}
                </div>
                <div className="text-gray-700 font-medium mb-4">
                  {quizQuestions.length > 0 ? Math.round((quizScore / quizQuestions.length) * 100) : 0}% Correct
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-emerald-500 to-teal-500 h-2 rounded-full transition-all duration-1000"
                    style={{ width: `${quizQuestions.length > 0 ? (quizScore / quizQuestions.length) * 100 : 0}%` }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-white p-4 rounded-xl shadow-sm">
                  <div className="text-2xl font-bold text-blue-600">{quizScore}</div>
                  <div className="text-sm text-gray-600">Correct Answers</div>
                </div>
                <div className="bg-white p-4 rounded-xl shadow-sm">
                  <div className="text-2xl font-bold text-rose-600">{quizQuestions.length - quizScore}</div>
                  <div className="text-sm text-gray-600">Incorrect Answers</div>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={resetQuiz}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl hover:shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  New Quiz
                </button>
                <button
                  onClick={() => {
                    setStudyMode('learn');
                    setIsQuizActive(false);
                  }}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl hover:shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  Back to Learning
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    const currentQuestion = quizQuestions[currentQuizIndex];
    if (!currentQuestion) {
      return (
        <div className="max-w-2xl mx-auto text-center py-12">
          <div className="text-gray-600">No quiz questions available. Please try again.</div>
          <button
            onClick={resetQuiz}
            className="mt-4 px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl hover:shadow-lg transition-all"
          >
            Back to Learning
          </button>
        </div>
      );
    }

    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200">
          {/* Quiz Progress */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-blue-700">
                Question {currentQuizIndex + 1} of {quizQuestions.length}
              </span>
              <span className="text-sm font-bold text-emerald-700">
                Score: {quizScore}/{quizQuestions.length}
              </span>
            </div>
            <div className="w-full bg-blue-100 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${quizQuestions.length > 0 ? ((currentQuizIndex + 1) / quizQuestions.length) * 100 : 0}%` }}
              />
            </div>
          </div>

          {/* Question */}
          <div className="bg-white rounded-xl p-6 shadow-lg mb-6">
            <div className="flex items-center gap-3 mb-4">
              <div className={`p-2 rounded-lg ${
                currentQuestion.type === 'meaning' ? 'bg-blue-100 text-blue-700' :
                currentQuestion.type === 'reading' ? 'bg-emerald-100 text-emerald-700' :
                'bg-purple-100 text-purple-700'
              }`}>
                {currentQuestion.type === 'meaning' ? 'Meaning' : 
                 currentQuestion.type === 'reading' ? 'Reading' : 'Character'}
              </div>
              <h3 className="text-xl font-bold text-gray-900">{currentQuestion.question}</h3>
            </div>

            {/* Kanji Display for Character Quiz */}
            {currentQuestion.type === 'character' && (
              <div className="text-6xl font-bold text-center my-6">
                {currentQuestion.correctAnswer}
              </div>
            )}
          </div>

          {/* Options */}
          <div className="space-y-3 mb-8">
            {currentQuestion.options.map((option, index) => {
              const isSelected = selectedQuizOption === option;
              const isCorrect = option === currentQuestion.correctAnswer;
              const showResult = selectedQuizOption !== null;

              let buttonClass = "w-full p-4 text-left rounded-xl transition-all ";
              
              if (showResult) {
                if (isCorrect) {
                  buttonClass += "bg-emerald-50 text-emerald-700 border-2 border-emerald-300 ";
                } else if (isSelected && !isCorrect) {
                  buttonClass += "bg-rose-50 text-rose-700 border-2 border-rose-300 ";
                } else {
                  buttonClass += "bg-white text-gray-700 border border-gray-200 ";
                }
              } else {
                buttonClass += "bg-white text-gray-700 border border-gray-200 hover:border-blue-300 hover:shadow-md ";
              }

              return (
                <button
                  key={index}
                  onClick={() => handleQuizAnswer(option)}
                  disabled={showResult}
                  className={buttonClass}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-6 h-6 flex items-center justify-center rounded-full ${
                        showResult
                          ? isCorrect
                            ? 'bg-emerald-500 text-white'
                            : isSelected
                            ? 'bg-rose-500 text-white'
                            : 'bg-gray-200 text-gray-500'
                          : 'bg-gray-100 text-gray-500'
                      }`}>
                        {String.fromCharCode(65 + index)}
                      </div>
                      <span className="font-medium">{option}</span>
                    </div>
                    {showResult && isCorrect && (
                      <CheckCircle className="w-5 h-5 text-emerald-600" />
                    )}
                    {showResult && isSelected && !isCorrect && (
                      <XCircle className="w-5 h-5 text-rose-600" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Explanation */}
          {selectedQuizOption && (
            <div className="bg-white rounded-xl p-4 border border-blue-200">
              <div className="flex items-center gap-2 mb-2">
                <Info className="w-5 h-5 text-blue-600" />
                <h4 className="font-bold text-blue-700">Explanation</h4>
              </div>
              <p className="text-gray-700">{currentQuestion.explanation}</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderFlashcards = () => {
    if (filteredKanji.length === 0) {
      return (
        <div className="max-w-2xl mx-auto text-center py-12">
          <div className="text-gray-600">No kanji available for flashcards. Try changing your filters.</div>
          <button
            onClick={() => setStudyMode('learn')}
            className="mt-4 px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl hover:shadow-lg transition-all"
          >
            Back to Learning
          </button>
        </div>
      );
    }

    const currentFlashcard = filteredKanji[flashcardIndex];
    if (!currentFlashcard) {
      return (
        <div className="max-w-2xl mx-auto text-center py-12">
          <div className="text-gray-600">No flashcard available.</div>
          <button
            onClick={() => setStudyMode('learn')}
            className="mt-4 px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl hover:shadow-lg transition-all"
          >
            Back to Learning
          </button>
        </div>
      );
    }

    return (
      <div className="max-w-2xl mx-auto">
        <div className="relative">
          {/* Flashcard Counter */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-50 rounded-full">
              <CardSim className="w-4 h-4 text-purple-600" />
              <span className="text-sm font-medium text-purple-700">
                Flashcard {flashcardIndex + 1} of {filteredKanji.length}
              </span>
            </div>
          </div>

          {/* Flashcard */}
          <div
            className={`relative w-full h-96 cursor-pointer transform transition-transform duration-500 ${
              isFlashcardFlipped ? 'rotate-y-180' : ''
            }`}
            onClick={toggleFlashcard}
            style={{
              transformStyle: 'preserve-3d',
              perspective: '1000px'
            }}
          >
            {/* Front of Card */}
            <div className={`absolute inset-0 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl border-2 border-blue-200 shadow-xl p-8 flex flex-col items-center justify-center ${
              isFlashcardFlipped ? 'opacity-0' : 'opacity-100'
            }`} style={{
              backfaceVisibility: 'hidden',
              transform: 'rotateY(0deg)'
            }}>
              <div className="text-7xl font-bold text-gray-900 mb-6">
                {currentFlashcard.character}
              </div>
              <div className="text-lg text-gray-600 text-center">
                Click to reveal meaning and readings
              </div>
              {!flashcardRevealed && (
                <div className="mt-4 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                  Tap to flip
                </div>
              )}
            </div>

            {/* Back of Card */}
            <div className={`absolute inset-0 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl border-2 border-emerald-200 shadow-xl p-8 flex flex-col justify-center ${
              isFlashcardFlipped ? 'opacity-100' : 'opacity-0'
            }`} style={{
              backfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)'
            }}>
              <div className="text-center mb-6">
                <div className="text-5xl font-bold text-gray-900 mb-4">
                  {currentFlashcard.character}
                </div>
                <div className="text-2xl font-bold text-emerald-700 mb-2">
                  {currentFlashcard.meaning}
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-white/80 rounded-xl p-4">
                  <div className="text-sm font-medium text-gray-600 mb-1">Readings</div>
                  <div className="flex flex-wrap gap-3">
                    {currentFlashcard.onyomi && currentFlashcard.onyomi.length > 0 && (
                      <div>
                        <span className="text-xs text-blue-600 font-medium">On'yomi:</span>
                        <span className="ml-2 font-mono font-bold text-gray-800">
                          {currentFlashcard.onyomi.join(', ')}
                        </span>
                      </div>
                    )}
                    {currentFlashcard.kunyomi && currentFlashcard.kunyomi.length > 0 && (
                      <div>
                        <span className="text-xs text-emerald-600 font-medium">Kun'yomi:</span>
                        <span className="ml-2 font-mono font-bold text-gray-800">
                          {currentFlashcard.kunyomi.join(', ')}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {currentFlashcard.examples && currentFlashcard.examples[0] && (
                  <div className="bg-white/80 rounded-xl p-4">
                    <div className="text-sm font-medium text-gray-600 mb-1">Example</div>
                    <div className="font-medium text-gray-800">{currentFlashcard.examples[0].word}</div>
                    <div className="text-sm text-gray-600">{currentFlashcard.examples[0].reading}</div>
                    <div className="text-sm text-gray-700 italic">"{currentFlashcard.examples[0].meaning}"</div>
                  </div>
                )}

                <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                  <span>Click to flip back</span>
                  <RefreshCw className="w-4 h-4" />
                </div>
              </div>
            </div>
          </div>

          {/* Flashcard Controls */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <button
              onClick={prevFlashcard}
              disabled={flashcardIndex === 0}
              className="p-3 bg-gray-100 rounded-xl hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-105 active:scale-95"
            >
              <ChevronLeft className="w-5 h-5 text-gray-700" />
            </button>
            
            <button
              onClick={() => setFlashcardIndex(Math.floor(Math.random() * filteredKanji.length))}
              className="px-6 py-3 bg-purple-100 text-purple-700 rounded-xl hover:shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center gap-2"
            >
              <Shuffle className="w-4 h-4" />
              Shuffle
            </button>

            <button
              onClick={() => toggleBookmark(currentFlashcard.id)}
              className={`p-3 rounded-xl transition-all hover:scale-110 active:scale-95 ${
                currentFlashcard.isBookmarked
                  ? 'bg-amber-100 text-amber-600'
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              <Bookmark className={`w-5 h-5 ${currentFlashcard.isBookmarked ? 'fill-amber-600' : ''}`} />
            </button>

            <button
              onClick={nextFlashcard}
              disabled={flashcardIndex === filteredKanji.length - 1}
              className="p-3 bg-gray-100 rounded-xl hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-105 active:scale-95"
            >
              <ChevronRight className="w-5 h-5 text-gray-700" />
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Update stats whenever kanjiList changes
  useEffect(() => {
    setStats(prev => ({
      ...prev,
      totalKanji: kanjiList.length,
      learned: kanjiList.filter(k => k.status === 'mastered').length,
      inProgress: kanjiList.filter(k => k.status === 'learning' || k.status === 'review').length,
      n5Kanji: kanjiList.filter(k => k.jlptLevel === 'N5').length,
      bookmarked: kanjiList.filter(k => k.isBookmarked).length,
      totalReviews: kanjiList.reduce((sum, k) => sum + (k.reviewCount || 0), 0)
    }));
  }, [kanjiList]);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Confetti Animation */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2"
              style={{
                left: `${Math.random() * 100}%`,
                top: '-5%',
                animation: `confetti 2.2s ease-out forwards`,
                animationDelay: `${Math.random() * 1.8}s`,
                backgroundColor: ['#ff6b6b','#4ecdc4','#45b7d1','#96ceb4','#feca57','#ff9ff3','#f368e0'][i % 7],
                transform: `rotate(${Math.random() * 360}deg)`
              }}
            />
          ))}
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
                <PenTool className="w-8 h-8 text-amber-600" />
                Kanji Learning
                <span className="text-lg px-3 py-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-full">
                  {kanjiList.length} Kanji
                </span>
              </h1>
              <p className="text-gray-600">Master Japanese kanji with interactive learning tools</p>
            </div>
            <div className="flex items-center gap-3">
              <button className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl hover:shadow-lg transition-all flex items-center gap-2 hover:scale-[1.02] active:scale-[0.98]">
                <Sparkles className="w-5 h-5" />
                Learning Path
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-8 gap-4 mb-8">
            {[
              { label: 'Kanji Learned', value: `${stats.learned}/${stats.totalKanji}`, color: 'amber', icon: TargetIcon },
              { label: 'Accuracy', value: `${stats.accuracy}%`, color: 'emerald', icon: TrendingUp },
              { label: 'Day Streak', value: stats.streak, color: 'blue', icon: Zap },
              { label: 'Mastered', value: kanjiList.filter(k => k.status === 'mastered').length, color: 'purple', icon: Trophy },
              { label: 'N5 Kanji', value: stats.n5Kanji, color: 'orange', icon: Layers },
              { label: 'Bookmarked', value: stats.bookmarked, color: 'rose', icon: Bookmark },
              { label: 'Quiz Attempts', value: stats.quizAttempts, color: 'cyan', icon: ClipboardCheck },
              { label: 'Flashcards', value: stats.flashcardsReviewed, color: 'violet', icon: CardSim }
            ].map((stat, index) => (
              <div 
                key={stat.label} 
                className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 hover:scale-105 transition-all cursor-pointer"
              >
                <div className="flex items-center gap-2 mb-2">
                  <stat.icon className={`w-4 h-4 text-${stat.color}-600`} />
                  <div className={`text-2xl font-bold text-${stat.color}-600`}>
                    {stat.value}
                  </div>
                </div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Study Mode Selector */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-3">
            {[
              { mode: 'learn', label: 'Learn Mode', icon: BookOpen, color: 'blue', description: 'Interactive learning' },
              { mode: 'quiz', label: 'Quiz', icon: FileText, color: 'emerald', description: 'Test your knowledge' },
              { mode: 'flashcards', label: 'Flashcards', icon: CardSim, color: 'purple', description: 'Quick review' },
              { mode: 'writing', label: 'Writing Practice', icon: PenTool, color: 'amber', description: 'Stroke order' }
            ].map(({ mode, label, icon: Icon, color, description }) => (
              <button
                key={mode}
                onClick={() => {
                  setStudyMode(mode);
                  if (mode === 'quiz') startQuiz();
                  if (mode === 'flashcards') startFlashcards();
                }}
                className={`flex-1 min-w-[200px] p-4 rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98] ${
                  studyMode === mode
                    ? `bg-gradient-to-r from-${color}-500 to-${color}-600 text-white shadow-lg`
                    : `bg-white text-gray-700 border border-gray-200 hover:border-${color}-300 hover:shadow-md`
                }`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <Icon className={`w-6 h-6 ${studyMode === mode ? 'text-white' : `text-${color}-600`}`} />
                  <div>
                    <div className="font-bold text-lg">{label}</div>
                    <div className={`text-sm ${studyMode === mode ? 'text-white/80' : 'text-gray-500'}`}>
                      {description}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Filters & List (Only in Learn Mode) */}
          {studyMode === 'learn' && (
            <div className="lg:col-span-1 space-y-6">
              {/* Search */}
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
                <div className="relative mb-6">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search kanji by character, meaning, reading..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
                </div>

                {/* JLPT Levels */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-900">
                    <Layers className="w-5 h-5 text-blue-600" />
                    JLPT Level
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {jlptLevels.map((level) => (
                      <button
                        key={level}
                        onClick={() => {
                          setSelectedLevel(level);
                          setCurrentKanjiIndex(0);
                        }}
                        className={`px-4 py-2 rounded-lg transition-all hover:scale-105 active:scale-95 ${
                          selectedLevel === level
                            ? `${getLevelColor(level)} font-bold shadow-md`
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {level === 'all' ? 'All Levels' : level}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Status Filter */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-900">
                    <Target className="w-5 h-5 text-emerald-600" />
                    Progress Status
                  </h3>
                  <div className="space-y-2">
                    {statusOptions.map((status) => (
                      <button
                        key={status}
                        onClick={() => {
                          setSelectedStatus(status);
                          setCurrentKanjiIndex(0);
                        }}
                        className={`w-full text-left p-3 rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98] ${
                          selectedStatus === status
                            ? status === 'all' 
                              ? 'bg-amber-50 text-amber-700 border-2 border-amber-300' 
                              : `${getStatusColor(status as KanjiStatus)} border-2 border-current`
                            : 'hover:bg-gray-50 text-gray-700 border border-gray-200'
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <span className="capitalize font-medium">{status}</span>
                          <span className="text-sm bg-white/50 px-3 py-1 rounded-full font-bold">
                            {status === 'all' 
                              ? kanjiList.length 
                              : kanjiList.filter(k => k.status === status).length}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Practice Modes */}
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-900">
                  <BookOpen className="w-5 h-5 text-purple-600" />
                  Practice Mode
                </h3>
                <div className="space-y-3">
                  {[
                    { mode: 'meaning', icon: BookOpen, label: 'Meaning', desc: 'Guess the meaning', color: 'blue' },
                    { mode: 'reading', icon: Volume2, label: 'Reading', desc: 'Identify readings', color: 'emerald' },
                    { mode: 'writing', icon: PenTool, label: 'Writing', desc: 'Practice stroke order', color: 'amber' },
                    { mode: 'memory', icon: Brain, label: 'Memory', desc: 'Learn mnemonics', color: 'purple' },
                    { mode: 'audio', icon: Headphones, label: 'Audio', desc: 'Pronunciation practice', color: 'indigo' }
                  ].map(({ mode, icon: Icon, label, desc, color }) => (
                    <button
                      key={mode}
                      onClick={() => {
                        setPracticeMode(mode);
                        setShowHint(false);
                        setShowMnemonic(false);
                        stopAudio();
                      }}
                      className={`w-full text-left p-4 rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98] ${
                        practiceMode === mode
                          ? `bg-${color}-50 text-${color}-700 border-2 border-${color}-300`
                          : 'hover:bg-gray-50 text-gray-700 border border-gray-200'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="w-6 h-6" />
                        <div>
                          <div className="font-bold">{label}</div>
                          <div className="text-sm opacity-75">{desc}</div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Quick Stats */}
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-900">
                  <TrendingUp className="w-5 h-5 text-emerald-600" />
                  Today's Progress
                </h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-gray-600">Active Practice</span>
                      <span className="text-sm font-bold">{filteredKanji.length} kanji</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-amber-500 to-orange-500"
                        style={{ width: `${kanjiList.length > 0 ? (filteredKanji.length / kanjiList.length) * 100 : 0}%` }}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <div className="text-lg font-bold text-blue-600">{filteredKanji.length}</div>
                      <div className="text-xs text-gray-600">Selected</div>
                    </div>
                    <div className="text-center p-3 bg-emerald-50 rounded-lg">
                      <div className="text-lg font-bold text-emerald-600">
                        {filteredKanji.filter(k => k.status === 'mastered').length}
                      </div>
                      <div className="text-xs text-gray-600">Mastered</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Main Learning Area */}
          <div className={`${studyMode === 'learn' ? 'lg:col-span-2' : 'lg:col-span-3'}`}>
            {studyMode === 'quiz' ? renderQuiz() :
             studyMode === 'flashcards' ? renderFlashcards() :
             studyMode === 'writing' ? (
               <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
                 <div className="text-center mb-8">
                   <PenTool className="w-12 h-12 text-amber-600 mx-auto mb-4" />
                   <h2 className="text-2xl font-bold text-gray-900 mb-2">Writing Practice</h2>
                   <p className="text-gray-600">Practice writing kanji with correct stroke order</p>
                 </div>
                 {currentKanji ? renderWritingGuide() : (
                   <div className="text-center py-12">
                     <div className="text-gray-400">No kanji available for writing practice</div>
                   </div>
                 )}
               </div>
             ) : studyMode === 'learn' ? (
              currentKanji ? (
                <div className={`bg-white rounded-2xl shadow-lg p-6 border border-gray-200 transition-all duration-500 ${isFlipping ? 'rotate-y-90' : ''}`}>
                  {/* Progress & Navigation */}
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                    <div className="flex items-center gap-4">
                      <button
                        onClick={prevKanji}
                        disabled={currentKanjiIndex === 0}
                        className="p-3 bg-gray-100 rounded-xl hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-105 active:scale-95"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                      <div className="text-center">
                        <div className="text-sm text-gray-600">Kanji</div>
                        <div className="text-xl font-bold text-gray-900">
                          {currentKanjiIndex + 1} / {filteredKanji.length}
                        </div>
                      </div>
                      <button
                        onClick={nextKanji}
                        disabled={currentKanjiIndex === filteredKanji.length - 1}
                        className="p-3 bg-gray-100 rounded-xl hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-105 active:scale-95"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => toggleBookmark(currentKanji.id)}
                        className={`p-3 rounded-xl transition-all hover:scale-110 active:scale-95 ${
                          currentKanji.isBookmarked
                            ? 'bg-amber-100 text-amber-600'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                        style={{ transform: `scale(${kanjiScale})` }}
                      >
                        <Bookmark className={`w-5 h-5 ${currentKanji.isBookmarked ? 'fill-amber-600' : ''}`} />
                      </button>
                      <button
                        onClick={() => setShowDetails(!showDetails)}
                        className="px-5 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl hover:shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98]"
                      >
                        {showDetails ? 'Hide Details' : 'Show Details'}
                      </button>
                    </div>
                  </div>

                  {/* Practice Area */}
                  <div className="text-center mb-8">
                    {/* Kanji Display */}
                    <div className="mb-8" ref={kanjiRef}>
                      <div 
                        className={`text-7xl md:text-8xl font-bold text-gray-900 mb-6 transition-all duration-300 ${pulseAnimation ? 'animate-pulse' : ''}`}
                        style={{ transform: `scale(${kanjiScale})` }}
                      >
                        {currentKanji.character}
                      </div>

                      <div className="flex flex-wrap items-center justify-center gap-4 mb-6">
                        <div className={`px-4 py-2 rounded-full text-sm font-bold ${getLevelColor(currentKanji.jlptLevel)}`}>
                          {currentKanji.jlptLevel}
                        </div>
                        <div className={`px-4 py-2 rounded-full text-sm font-bold ${getStatusColor(currentKanji.status)}`}>
                          {currentKanji.status.toUpperCase()}
                        </div>
                        <div className="px-4 py-2 rounded-full text-sm bg-gray-100 text-gray-700 font-bold">
                          {currentKanji.strokes} strokes
                        </div>
                        <div className="px-4 py-2 rounded-full text-sm bg-purple-100 text-purple-700 font-bold">
                          #{currentKanji.frequency}
                        </div>
                      </div>
                    </div>

                    {/* Practice Question */}
                    {practiceMode === 'meaning' && (
                      <div className="mb-8">
                        <h3 className="text-xl font-bold text-gray-900 mb-4">
                          What does this kanji mean?
                        </h3>

                        <div className="max-w-md mx-auto">
                          <input
                            type="text"
                            value={userAnswer}
                            onChange={(e) => setUserAnswer(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && checkAnswer()}
                            className="w-full p-4 text-center text-xl border-2 border-gray-300 rounded-xl focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200"
                            placeholder="Type meaning..."
                            autoFocus
                          />

                          {showAnswer && (
                            <div className={`mt-4 p-4 rounded-xl ${
                              isCorrect 
                                ? 'bg-emerald-50 text-emerald-700 border-2 border-emerald-300' 
                                : 'bg-rose-50 text-rose-700 border-2 border-rose-300'
                            }`}>
                              <div className="flex items-center justify-center gap-3">
                                {isCorrect ? (
                                  <>
                                    <CheckCircle className="w-6 h-6" />
                                    <span className="font-bold text-lg">Correct!</span>
                                  </>
                                ) : (
                                  <>
                                    <XCircle className="w-6 h-6" />
                                    <span className="font-bold text-lg">Incorrect</span>
                                  </>
                                )}
                              </div>
                              <div className="mt-2 font-medium">
                                Meaning: {currentKanji.meaning}
                              </div>
                            </div>
                          )}

                          <button
                            onClick={checkAnswer}
                            disabled={!userAnswer.trim() || showAnswer}
                            className={`w-full mt-4 p-4 rounded-xl transition-all font-bold ${
                              !userAnswer.trim() || showAnswer
                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                : 'bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]'
                            }`}
                          >
                            {showAnswer ? 'Next →' : 'Check Answer'}
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Reading Practice */}
                    {practiceMode === 'reading' && (
                      <div className="mb-8">
                        <h3 className="text-xl font-bold text-gray-900 mb-4">
                          What is the reading of this kanji?
                        </h3>

                        <div className="max-w-md mx-auto">
                          <input
                            type="text"
                            value={userAnswer}
                            onChange={(e) => setUserAnswer(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && checkAnswer()}
                            className="w-full p-4 text-center text-xl border-2 border-gray-300 rounded-xl focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200"
                            placeholder="Type reading..."
                            autoFocus
                          />

                          {showAnswer && (
                            <div className={`mt-4 p-4 rounded-xl ${
                              isCorrect 
                                ? 'bg-emerald-50 text-emerald-700 border-2 border-emerald-300' 
                                : 'bg-rose-50 text-rose-700 border-2 border-rose-300'
                            }`}>
                              <div className="flex items-center justify-center gap-3">
                                {isCorrect ? (
                                  <>
                                    <CheckCircle className="w-6 h-6" />
                                    <span className="font-bold text-lg">Correct!</span>
                                  </>
                                ) : (
                                  <>
                                    <XCircle className="w-6 h-6" />
                                    <span className="font-bold text-lg">Incorrect</span>
                                  </>
                                )}
                              </div>
                              <div className="mt-2 font-medium">
                                Readings: On'yomi: {currentKanji.onyomi?.join(', ') || 'N/A'} | Kun'yomi: {currentKanji.kunyomi?.join(', ') || 'N/A'}
                              </div>
                            </div>
                          )}

                          <button
                            onClick={checkAnswer}
                            disabled={!userAnswer.trim() || showAnswer}
                            className={`w-full mt-4 p-4 rounded-xl transition-all font-bold ${
                              !userAnswer.trim() || showAnswer
                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                : 'bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]'
                            }`}
                          >
                            {showAnswer ? 'Next →' : 'Check Answer'}
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Writing Practice */}
                    {practiceMode === 'writing' && renderWritingGuide()}

                    {/* Memory Practice */}
                    {practiceMode === 'memory' && renderMemoryMode()}

                    {/* Audio Practice */}
                    {practiceMode === 'audio' && renderAudioMode()}
                  </div>

                  {/* Kanji Details */}
                  {showDetails && (
                    <div className="mt-8 pt-8 border-t border-gray-200">
                      <h3 className="text-xl font-bold text-gray-900 mb-6">Kanji Details</h3>
                      
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Left Column */}
                        <div className="space-y-6">
                          {/* Readings */}
                          <div>
                            <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                              <Volume2 className="w-5 h-5 text-blue-600" />
                              Readings
                            </h4>
                            <div className="space-y-4">
                              <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                                <div className="text-sm text-blue-600 font-bold mb-1">On'yomi (Chinese reading)</div>
                                <div className="text-lg font-mono font-bold text-gray-900">
                                  {currentKanji.onyomi?.join(', ') || 'N/A'}
                                </div>
                                {currentKanji.onyomi?.[0] && (
                                  <button
                                    onClick={() => playReadingAudio(currentKanji.onyomi[0])}
                                    className="mt-2 text-sm text-blue-600 hover:underline flex items-center gap-1"
                                  >
                                    <Play size={12} />
                                    Play pronunciation
                                  </button>
                                )}
                              </div>
                              <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200">
                                <div className="text-sm text-emerald-600 font-bold mb-1">Kun'yomi (Japanese reading)</div>
                                <div className="text-lg font-mono font-bold text-gray-900">
                                  {currentKanji.kunyomi?.join(', ') || 'N/A'}
                                </div>
                                {currentKanji.kunyomi?.[0] && (
                                  <button
                                    onClick={() => playReadingAudio(currentKanji.kunyomi[0])}
                                    className="mt-2 text-sm text-emerald-600 hover:underline flex items-center gap-1"
                                  >
                                    <Play size={12} />
                                    Play pronunciation
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Description */}
                          {currentKanji.description && (
                            <div>
                              <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                                <Info className="w-5 h-5 text-gray-600" />
                                Description
                              </h4>
                              <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                                <p className="text-gray-700">{currentKanji.description}</p>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Right Column */}
                        <div className="space-y-6">
                          {/* Examples */}
                          <div>
                            <h4 className="font-bold text-gray-900 mb-3">Example Words</h4>
                            <div className="space-y-3">
                              {currentKanji.examples && currentKanji.examples.length > 0 ? (
                                currentKanji.examples.slice(0, 3).map((example, index) => (
                                  <div key={index} className="p-4 bg-amber-50 rounded-xl border border-amber-200">
                                    <div className="flex items-center justify-between mb-2">
                                      <div className="font-bold text-lg text-gray-900">{example.word}</div>
                                      <button
                                        onClick={() => playReadingAudio(example.word)}
                                        disabled={audioPlaying && currentAudio === 'reading'}
                                        className="text-gray-500 hover:text-blue-600 disabled:opacity-50 transition-colors"
                                      >
                                        <Volume2 className="w-5 h-5" />
                                      </button>
                                    </div>
                                    <div className="text-sm text-amber-600 font-mono mb-1">{example.reading}</div>
                                    <div className="text-gray-700">{example.meaning}</div>
                                  </div>
                                ))
                              ) : (
                                <p className="text-gray-500">No examples available</p>
                              )}
                            </div>
                          </div>

                          {/* Tags */}
                          {currentKanji.tags && currentKanji.tags.length > 0 && (
                            <div>
                              <h4 className="font-bold text-gray-900 mb-3">Categories</h4>
                              <div className="flex flex-wrap gap-2">
                                {currentKanji.tags.map((tag, index) => (
                                  <span key={index} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:scale-105 transition-transform">
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Study Stats */}
                  <div className="mt-8 pt-6 border-t border-gray-200">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {[
                        { label: 'Reviews', value: currentKanji.reviewCount || 0, color: 'gray' },
                        { label: 'Status', value: currentKanji.status, color: currentKanji.status === 'mastered' ? 'emerald' : currentKanji.status === 'review' ? 'amber' : currentKanji.status === 'learning' ? 'blue' : 'gray' },
                        { label: 'Strokes', value: currentKanji.strokes, color: 'gray' },
                        { label: 'Frequency', value: `#${currentKanji.frequency}`, color: 'purple' }
                      ].map((stat, index) => (
                        <div 
                          key={stat.label} 
                          className="text-center p-3 bg-gray-50 rounded-xl hover:scale-105 transition-transform cursor-help"
                          title={stat.label}
                        >
                          <div className="text-sm text-gray-600 font-medium">{stat.label}</div>
                          <div className={`text-xl font-bold text-${stat.color}-600`}>
                            {stat.value}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
                  <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-gray-900 mb-2">No kanji found</h3>
                  <p className="text-gray-600 mb-6">Try changing your filters or search term</p>
                  <button
                    onClick={() => {
                      setSelectedLevel('all');
                      setSelectedStatus('all');
                      setSearchTerm('');
                    }}
                    className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl hover:shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98]"
                  >
                    Reset Filters
                  </button>
                </div>
              )
            ) : null}
          </div>
        </div>

        {/* Learning Tips */}
        {studyMode === 'learn' && (
          <div className="mt-8 bg-amber-50 rounded-2xl p-6 border border-amber-200">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-600" />
              Kanji Learning Tips
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-xl shadow-sm hover:scale-105 transition-transform">
                <div className="flex items-center gap-2 mb-2">
                  <Target className="w-4 h-4 text-emerald-600" />
                  <h4 className="font-semibold">Learn Radicals First</h4>
                </div>
                <p className="text-sm text-gray-600">
                  Understanding radicals makes learning complex kanji much easier. Each radical has meaning!
                </p>
              </div>
              <div className="bg-white p-4 rounded-xl shadow-sm hover:scale-105 transition-transform">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-4 h-4 text-blue-600" />
                  <h4 className="font-semibold">Practice Daily</h4>
                </div>
                <p className="text-sm text-gray-600">
                  Consistent daily practice is more effective than occasional long study sessions.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes confetti {
          0% { transform: translateY(-10vh) rotate(0deg) scale(0.5); opacity: 1; }
          100% { transform: translateY(110vh) rotate(720deg) scale(1); opacity: 0; }
        }
        
        .rotate-y-90 {
          transform: rotateY(90deg);
        }
        
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
      `}</style>
    </div>
  );
};

export default KanjiLearning;