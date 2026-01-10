// pages/KanjiLearning.tsx
import React, { useState, useEffect } from 'react';
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
  ChevronRight,
  ChevronLeft,
  Filter,
  Search,
  Layers,
  Zap
} from 'lucide-react';

type JLPTLevel = 'N5' | 'N4' | 'N3' | 'N2' | 'N1';
type KanjiStatus = 'new' | 'learning' | 'review' | 'mastered';

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
  status: KanjiStatus;
  reviewCount: number;
  lastReviewed?: Date;
  nextReview?: Date;
  isBookmarked: boolean;
}

const KanjiLearning = () => {
  const [kanjiList, setKanjiList] = useState<KanjiCharacter[]>([
    {
      id: '1',
      character: '日',
      meaning: 'Sun, Day',
      onyomi: ['ニチ', 'ジツ'],
      kunyomi: ['ひ', 'か'],
      strokes: 4,
      jlptLevel: 'N5',
      examples: [
        { word: '日本', reading: 'にほん', meaning: 'Japan' },
        { word: '日曜日', reading: 'にちようび', meaning: 'Sunday' },
        { word: '今日', reading: 'きょう', meaning: 'Today' }
      ],
      radicals: ['日'],
      status: 'mastered',
      reviewCount: 8,
      isBookmarked: true
    },
    {
      id: '2',
      character: '月',
      meaning: 'Moon, Month',
      onyomi: ['ゲツ', 'ガツ'],
      kunyomi: ['つき'],
      strokes: 4,
      jlptLevel: 'N5',
      examples: [
        { word: '月曜日', reading: 'げつようび', meaning: 'Monday' },
        { word: '一月', reading: 'いちがつ', meaning: 'January' },
        { word: '月見', reading: 'つきみ', meaning: 'Moon viewing' }
      ],
      radicals: ['月'],
      status: 'mastered',
      reviewCount: 6,
      isBookmarked: false
    },
    {
      id: '3',
      character: '水',
      meaning: 'Water',
      onyomi: ['スイ'],
      kunyomi: ['みず'],
      strokes: 4,
      jlptLevel: 'N5',
      examples: [
        { word: '水曜日', reading: 'すいようび', meaning: 'Wednesday' },
        { word: '水泳', reading: 'すいえい', meaning: 'Swimming' },
        { word: '水道水', reading: 'すいどうすい', meaning: 'Tap water' }
      ],
      radicals: ['水'],
      status: 'learning',
      reviewCount: 3,
      isBookmarked: true
    },
    {
      id: '4',
      character: '火',
      meaning: 'Fire',
      onyomi: ['カ'],
      kunyomi: ['ひ', 'ほ'],
      strokes: 4,
      jlptLevel: 'N5',
      examples: [
        { word: '火曜日', reading: 'かようび', meaning: 'Tuesday' },
        { word: '火山', reading: 'かざん', meaning: 'Volcano' },
        { word: '花火', reading: 'はなび', meaning: 'Fireworks' }
      ],
      radicals: ['火'],
      status: 'learning',
      reviewCount: 2,
      isBookmarked: false
    },
    {
      id: '5',
      character: '木',
      meaning: 'Tree, Wood',
      onyomi: ['モク', 'ボク'],
      kunyomi: ['き', 'こ'],
      strokes: 4,
      jlptLevel: 'N5',
      examples: [
        { word: '木曜日', reading: 'もくようび', meaning: 'Thursday' },
        { word: '木工', reading: 'もっこう', meaning: 'Woodworking' },
        { word: '木の葉', reading: 'このは', meaning: 'Tree leaves' }
      ],
      radicals: ['木'],
      status: 'new',
      reviewCount: 0,
      isBookmarked: false
    },
    {
      id: '6',
      character: '金',
      meaning: 'Gold, Money, Metal',
      onyomi: ['キン', 'コン'],
      kunyomi: ['かね', 'かな'],
      strokes: 8,
      jlptLevel: 'N5',
      examples: [
        { word: '金曜日', reading: 'きんようび', meaning: 'Friday' },
        { word: '金色', reading: 'きんいろ', meaning: 'Gold color' },
        { word: '現金', reading: 'げんきん', meaning: 'Cash' }
      ],
      radicals: ['金'],
      status: 'new',
      reviewCount: 0,
      isBookmarked: false
    },
    {
      id: '7',
      character: '土',
      meaning: 'Earth, Soil',
      onyomi: ['ド', 'ト'],
      kunyomi: ['つち'],
      strokes: 3,
      jlptLevel: 'N5',
      examples: [
        { word: '土曜日', reading: 'どようび', meaning: 'Saturday' },
        { word: '土地', reading: 'とち', meaning: 'Land' },
        { word: '土産', reading: 'みやげ', meaning: 'Souvenir' }
      ],
      radicals: ['土'],
      status: 'review',
      reviewCount: 5,
      isBookmarked: false
    },
    {
      id: '8',
      character: '人',
      meaning: 'Person',
      onyomi: ['ジン', 'ニン'],
      kunyomi: ['ひと'],
      strokes: 2,
      jlptLevel: 'N5',
      examples: [
        { word: '日本人', reading: 'にほんじん', meaning: 'Japanese person' },
        { word: '人間', reading: 'にんげん', meaning: 'Human being' },
        { word: '人口', reading: 'じんこう', meaning: 'Population' }
      ],
      radicals: ['人'],
      status: 'mastered',
      reviewCount: 10,
      isBookmarked: false
    }
  ]);

  const [currentKanjiIndex, setCurrentKanjiIndex] = useState(0);
  const [selectedLevel, setSelectedLevel] = useState<JLPTLevel>('N5');
  const [selectedStatus, setSelectedStatus] = useState<KanjiStatus | 'all'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showDetails, setShowDetails] = useState(false);
  const [practiceMode, setPracticeMode] = useState<'reading' | 'meaning' | 'writing'>('meaning');
  const [userAnswer, setUserAnswer] = useState('');
  const [showAnswer, setShowAnswer] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [stats, setStats] = useState({
    totalKanji: 2136,
    learned: 8,
    inProgress: 4,
    accuracy: 85,
    streak: 12
  });

  const filteredKanji = kanjiList.filter(kanji => {
    const matchesLevel = selectedLevel === 'all' || kanji.jlptLevel === selectedLevel;
    const matchesStatus = selectedStatus === 'all' || kanji.status === selectedStatus;
    const matchesSearch = kanji.character.includes(searchTerm) || 
                         kanji.meaning.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         kanji.onyomi.some(o => o.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         kanji.kunyomi.some(k => k.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesLevel && matchesStatus && matchesSearch;
  });

  const currentKanji = filteredKanji[currentKanjiIndex];

  const jlptLevels: JLPTLevel[] = ['N5', 'N4', 'N3', 'N2', 'N1'];
  const statusOptions: (KanjiStatus | 'all')[] = ['all', 'new', 'learning', 'review', 'mastered'];

  const getStatusColor = (status: KanjiStatus) => {
    switch (status) {
      case 'new': return 'bg-gray-100 text-gray-700';
      case 'learning': return 'bg-blue-100 text-blue-700';
      case 'review': return 'bg-yellow-100 text-yellow-700';
      case 'mastered': return 'bg-green-100 text-green-700';
    }
  };

  const getLevelColor = (level: JLPTLevel) => {
    switch (level) {
      case 'N5': return 'bg-green-100 text-green-700';
      case 'N4': return 'bg-blue-100 text-blue-700';
      case 'N3': return 'bg-purple-100 text-purple-700';
      case 'N2': return 'bg-orange-100 text-orange-700';
      case 'N1': return 'bg-red-100 text-red-700';
    }
  };

  const playAudio = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ja-JP';
    utterance.rate = 0.8;
    speechSynthesis.speak(utterance);
  };

  const checkAnswer = () => {
    if (!currentKanji) return;

    let correct = false;
    const userAnswerLower = userAnswer.toLowerCase().trim();

    if (practiceMode === 'meaning') {
      correct = currentKanji.meaning.toLowerCase().includes(userAnswerLower) ||
                userAnswerLower.includes(currentKanji.meaning.toLowerCase());
    } else if (practiceMode === 'reading') {
      correct = currentKanji.onyomi.some(o => o.toLowerCase() === userAnswerLower) ||
                currentKanji.kunyomi.some(k => k.toLowerCase() === userAnswerLower);
    }

    setIsCorrect(correct);
    setShowAnswer(true);

    // Update kanji status based on answer
    if (correct) {
      setKanjiList(prev => prev.map(k => 
        k.id === currentKanji.id 
          ? { 
              ...k, 
              status: k.status === 'new' ? 'learning' : 
                      k.status === 'learning' ? 'review' : 
                      k.status === 'review' ? 'mastered' : 'mastered',
              reviewCount: k.reviewCount + 1
            }
          : k
      ));
    }

    setTimeout(() => {
      setShowAnswer(false);
      setUserAnswer('');
      setIsCorrect(null);
      nextKanji();
    }, 2000);
  };

  const nextKanji = () => {
    if (currentKanjiIndex < filteredKanji.length - 1) {
      setCurrentKanjiIndex(prev => prev + 1);
    } else {
      setCurrentKanjiIndex(0);
    }
  };

  const prevKanji = () => {
    if (currentKanjiIndex > 0) {
      setCurrentKanjiIndex(prev => prev - 1);
    }
  };

  const toggleBookmark = (kanjiId: string) => {
    setKanjiList(prev => prev.map(k => 
      k.id === kanjiId ? { ...k, isBookmarked: !k.isBookmarked } : k
    ));
  };

  const renderWritingGuide = () => {
    if (!currentKanji) return null;

    const strokeOrder = Array.from({ length: currentKanji.strokes }, (_, i) => i + 1);
    
    return (
      <div className="mt-8">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Stroke Order</h4>
        <div className="grid grid-cols-4 gap-2">
          {strokeOrder.map((stroke) => (
            <div key={stroke} className="relative">
              <div className="absolute top-1 left-1 text-xs text-gray-500">{stroke}</div>
              <div className="w-16 h-16 border-2 border-gray-300 rounded-lg flex items-center justify-center">
                <div className="text-2xl font-bold">{currentKanji.character}</div>
              </div>
            </div>
          ))}
        </div>
        <p className="text-sm text-gray-600 mt-2">
          Total strokes: {currentKanji.strokes}
        </p>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-amber-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
                <PenTool className="w-8 h-8 text-amber-600" />
                Kanji Learning
              </h1>
              <p className="text-gray-600">Master Japanese characters with stroke order and mnemonics</p>
            </div>
            <button className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl hover:shadow-lg transition-all flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              Learning Path
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white p-4 rounded-xl shadow-sm border">
              <div className="text-2xl font-bold text-amber-600">
                {stats.learned}/{filteredKanji.length}
              </div>
              <div className="text-sm text-gray-600">Kanji Learned</div>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-sm border">
              <div className="text-2xl font-bold text-blue-600">{stats.accuracy}%</div>
              <div className="text-sm text-gray-600">Accuracy</div>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-sm border">
              <div className="text-2xl font-bold text-green-600">{stats.streak}</div>
              <div className="text-sm text-gray-600">Day Streak</div>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-sm border">
              <div className="text-2xl font-bold text-purple-600">
                {kanjiList.filter(k => k.status === 'mastered').length}
              </div>
              <div className="text-sm text-gray-600">Mastered</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Filters & List */}
          <div className="lg:col-span-1 space-y-6">
            {/* Search */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border">
              <div className="relative mb-6">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search kanji..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              {/* JLPT Levels */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Layers className="w-5 h-5 text-blue-600" />
                  JLPT Level
                </h3>
                <div className="flex flex-wrap gap-2">
                  {jlptLevels.map((level) => (
                    <button
                      key={level}
                      onClick={() => setSelectedLevel(level)}
                      className={`px-3 py-2 rounded-lg transition ${
                        selectedLevel === level
                          ? getLevelColor(level)
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>

              {/* Status Filter */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Status</h3>
                <div className="space-y-2">
                  {statusOptions.map((status) => (
                    <button
                      key={status}
                      onClick={() => setSelectedStatus(status)}
                      className={`w-full text-left p-3 rounded-lg transition ${
                        selectedStatus === status
                          ? status === 'all' 
                            ? 'bg-amber-50 text-amber-700 border border-amber-200' 
                            : getStatusColor(status as KanjiStatus) + ' border'
                          : 'hover:bg-gray-50 text-gray-700'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span className="capitalize">{status}</span>
                        <span className="text-sm bg-gray-100 px-2 py-1 rounded">
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
            <div className="bg-white rounded-2xl shadow-lg p-6 border">
              <h3 className="text-lg font-semibold mb-4">Practice Mode</h3>
              <div className="space-y-3">
                {(['meaning', 'reading', 'writing'] as const).map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setPracticeMode(mode)}
                    className={`w-full text-left p-3 rounded-lg transition ${
                      practiceMode === mode
                        ? 'bg-blue-50 text-blue-700 border border-blue-200'
                        : 'hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {mode === 'meaning' && <BookOpen className="w-5 h-5" />}
                      {mode === 'reading' && <Volume2 className="w-5 h-5" />}
                      {mode === 'writing' && <PenTool className="w-5 h-5" />}
                      <div>
                        <div className="font-medium capitalize">{mode}</div>
                        <div className="text-sm opacity-75">
                          {mode === 'meaning' && 'Guess the meaning'}
                          {mode === 'reading' && 'Identify the reading'}
                          {mode === 'writing' && 'Practice stroke order'}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Bookmarked Kanji */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Bookmark className="w-5 h-5 text-amber-600" />
                Bookmarked Kanji
              </h3>
              <div className="space-y-3">
                {kanjiList.filter(k => k.isBookmarked).slice(0, 5).map((kanji) => (
                  <div key={kanji.id} className="flex items-center justify-between p-3 bg-amber-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="text-2xl font-bold">{kanji.character}</div>
                      <div>
                        <div className="font-medium">{kanji.meaning}</div>
                        <div className="text-sm text-gray-600">{kanji.onyomi[0]}</div>
                      </div>
                    </div>
                    <button
                      onClick={() => toggleBookmark(kanji.id)}
                      className="text-amber-600 hover:text-amber-700"
                    >
                      <Bookmark className="w-5 h-5 fill-current" />
                    </button>
                  </div>
                ))}
                {kanjiList.filter(k => k.isBookmarked).length === 0 && (
                  <p className="text-gray-500 text-center py-4">No bookmarked kanji yet</p>
                )}
              </div>
            </div>
          </div>

          {/* Main Learning Area */}
          <div className="lg:col-span-2">
            {currentKanji ? (
              <div className="bg-white rounded-2xl shadow-lg p-6 border">
                {/* Progress & Navigation */}
                <div className="flex justify-between items-center mb-8">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={prevKanji}
                      disabled={currentKanjiIndex === 0}
                      className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <div className="text-center">
                      <div className="text-sm text-gray-600">Kanji</div>
                      <div className="text-lg font-bold">
                        {currentKanjiIndex + 1} / {filteredKanji.length}
                      </div>
                    </div>
                    <button
                      onClick={nextKanji}
                      disabled={currentKanjiIndex === filteredKanji.length - 1}
                      className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => toggleBookmark(currentKanji.id)}
                      className={`p-2 rounded-lg transition ${
                        currentKanji.isBookmarked
                          ? 'bg-amber-100 text-amber-600'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      <Bookmark className={`w-5 h-5 ${currentKanji.isBookmarked ? 'fill-current' : ''}`} />
                    </button>
                    <button
                      onClick={() => setShowDetails(!showDetails)}
                      className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition"
                    >
                      {showDetails ? 'Hide Details' : 'Show Details'}
                    </button>
                  </div>
                </div>

                {/* Practice Area */}
                <div className="text-center mb-8">
                  {/* Kanji Display */}
                  <div className="mb-8">
                    <div className="text-8xl md:text-9xl font-bold text-gray-900 mb-6">
                      {currentKanji.character}
                    </div>

                    <div className="flex items-center justify-center gap-6 mb-6">
                      <div className={`px-3 py-1 rounded-full text-sm ${getLevelColor(currentKanji.jlptLevel)}`}>
                        {currentKanji.jlptLevel}
                      </div>
                      <div className={`px-3 py-1 rounded-full text-sm ${getStatusColor(currentKanji.status)}`}>
                        {currentKanji.status}
                      </div>
                      <div className="px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-700">
                        {currentKanji.strokes} strokes
                      </div>
                    </div>
                  </div>

                  {/* Practice Question */}
                  {practiceMode !== 'writing' && (
                    <div className="mb-8">
                      <h3 className="text-xl font-bold text-gray-900 mb-4">
                        {practiceMode === 'meaning' 
                          ? 'What does this kanji mean?' 
                          : 'What is the reading of this kanji?'}
                      </h3>

                      <div className="max-w-md mx-auto">
                        <input
                          type="text"
                          value={userAnswer}
                          onChange={(e) => setUserAnswer(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && checkAnswer()}
                          className="w-full p-4 text-center text-xl border-2 rounded-lg focus:outline-none focus:border-amber-500"
                          placeholder={practiceMode === 'meaning' ? 'Type meaning...' : 'Type reading...'}
                          autoFocus
                        />

                        {showAnswer && (
                          <div className={`mt-4 p-4 rounded-lg animate-fade-in ${
                            isCorrect ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'
                          }`}>
                            <div className="flex items-center justify-center gap-2">
                              {isCorrect ? (
                                <>
                                  <CheckCircle className="w-5 h-5" />
                                  <span className="font-bold">Correct!</span>
                                </>
                              ) : (
                                <>
                                  <XCircle className="w-5 h-5" />
                                  <span className="font-bold">Incorrect</span>
                                </>
                              )}
                            </div>
                            <div className="mt-2">
                              {practiceMode === 'meaning' 
                                ? `Meaning: ${currentKanji.meaning}`
                                : `Readings: On'yomi: ${currentKanji.onyomi.join(', ')} | Kun'yomi: ${currentKanji.kunyomi.join(', ')}`}
                            </div>
                          </div>
                        )}

                        <button
                          onClick={checkAnswer}
                          disabled={!userAnswer.trim() || showAnswer}
                          className={`w-full mt-4 p-4 rounded-xl transition-all ${
                            !userAnswer.trim() || showAnswer
                              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                              : 'bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:shadow-lg'
                          }`}
                        >
                          {showAnswer ? 'Next' : 'Check Answer'}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Writing Practice */}
                  {practiceMode === 'writing' && renderWritingGuide()}
                </div>

                {/* Kanji Details */}
                {showDetails && (
                  <div className="mt-8 pt-8 border-t animate-fade-in">
                    <h3 className="text-xl font-bold text-gray-900 mb-6">Kanji Details</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Readings */}
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                          <Volume2 className="w-4 h-4 text-blue-600" />
                          Readings
                        </h4>
                        <div className="space-y-4">
                          <div>
                            <div className="text-sm text-gray-600 mb-1">On'yomi (Chinese reading)</div>
                            <div className="text-lg font-mono">
                              {currentKanji.onyomi.join(', ')}
                            </div>
                          </div>
                          <div>
                            <div className="text-sm text-gray-600 mb-1">Kun'yomi (Japanese reading)</div>
                            <div className="text-lg font-mono">
                              {currentKanji.kunyomi.join(', ')}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Examples */}
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3">Example Words</h4>
                        <div className="space-y-3">
                          {currentKanji.examples.map((example, index) => (
                            <div key={index} className="p-3 bg-gray-50 rounded-lg">
                              <div className="flex items-center justify-between mb-1">
                                <div className="font-medium">{example.word}</div>
                                <button
                                  onClick={() => playAudio(example.word)}
                                  className="text-gray-500 hover:text-blue-600"
                                >
                                  <Volume2 className="w-4 h-4" />
                                </button>
                              </div>
                              <div className="text-sm text-gray-600">{example.reading}</div>
                              <div className="text-sm text-gray-700">{example.meaning}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Radicals */}
                    <div className="mt-6">
                      <h4 className="font-semibold text-gray-900 mb-3">Radicals</h4>
                      <div className="flex gap-2">
                        {currentKanji.radicals.map((radical, index) => (
                          <div key={index} className="w-12 h-12 border-2 border-gray-300 rounded-lg flex items-center justify-center">
                            <span className="text-xl font-bold">{radical}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Study Stats */}
                <div className="mt-8 pt-6 border-t">
                  <div className="grid grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-sm text-gray-600">Reviews</div>
                      <div className="text-lg font-bold">{currentKanji.reviewCount}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-gray-600">Status</div>
                      <div className={`text-lg font-bold ${
                        currentKanji.status === 'mastered' ? 'text-green-600' :
                        currentKanji.status === 'review' ? 'text-yellow-600' :
                        currentKanji.status === 'learning' ? 'text-blue-600' : 'text-gray-600'
                      }`}>
                        {currentKanji.status}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-gray-600">Strokes</div>
                      <div className="text-lg font-bold">{currentKanji.strokes}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-gray-600">Level</div>
                      <div className={`text-lg font-bold ${getLevelColor(currentKanji.jlptLevel).split(' ')[1]}`}>
                        {currentKanji.jlptLevel}
                      </div>
                    </div>
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
                    setSelectedLevel('N5');
                    setSelectedStatus('all');
                    setSearchTerm('');
                  }}
                  className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl hover:shadow-lg transition-all"
                >
                  Reset Filters
                </button>
              </div>
            )}

            {/* Learning Tips */}
            <div className="mt-8 bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-6 border border-amber-200">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Zap className="w-5 h-5 text-amber-600" />
                Kanji Learning Tips
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-xl shadow-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <Target className="w-4 h-4 text-green-600" />
                    <h4 className="font-semibold">Learn Radicals First</h4>
                  </div>
                  <p className="text-sm text-gray-600">
                    Understanding radicals makes learning complex kanji much easier.
                  </p>
                </div>
                <div className="bg-white p-4 rounded-xl shadow-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="w-4 h-4 text-blue-600" />
                    <h4 className="font-semibold">Practice Regularly</h4>
                  </div>
                  <p className="text-sm text-gray-600">
                    Consistent daily practice is more effective than occasional long sessions.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .animate-fade-in {
          animation: fadeIn 0.3s ease-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default KanjiLearning;