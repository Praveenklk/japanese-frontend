// pages/VocabularyBuilder.tsx
import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Volume2, 
  Star, 
  CheckCircle, 
  XCircle, 
  Zap, 
  TrendingUp, 
  RotateCw,
  Filter,
  Search,
  Layers,
  Plus,
  Bookmark,
  Brain,
  Clock,
  Award,
  ChevronRight,
  Sparkles
} from 'lucide-react';

type Difficulty = 'beginner' | 'intermediate' | 'advanced';
type Category = 'greetings' | 'food' | 'travel' | 'business' | 'daily' | 'numbers' | 'time';

interface VocabularyWord {
  id: string;
  japanese: string;
  reading: string;
  english: string;
  category: Category;
  difficulty: Difficulty;
  example: string;
  exampleReading: string;
  exampleEnglish: string;
  isLearned: boolean;
  isBookmarked: boolean;
  reviews: number;
  lastReviewed?: Date;
  nextReview?: Date;
  streak: number;
}

const VocabularyBuilder = () => {
  const [words, setWords] = useState<VocabularyWord[]>([]);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category>('greetings');
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>('beginner');
  const [searchTerm, setSearchTerm] = useState('');
  const [stats, setStats] = useState({
    totalLearned: 0,
    totalWords: 0,
    streak: 0,
    accuracy: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  // Sample vocabulary data
  const vocabularyData: VocabularyWord[] = [
    {
      id: '1',
      japanese: 'こんにちは',
      reading: 'Konnichiwa',
      english: 'Hello / Good afternoon',
      category: 'greetings',
      difficulty: 'beginner',
      example: 'こんにちは、お元気ですか？',
      exampleReading: 'Konnichiwa, ogenki desu ka?',
      exampleEnglish: 'Hello, how are you?',
      isLearned: false,
      isBookmarked: false,
      reviews: 0,
      streak: 0
    },
    {
      id: '2',
      japanese: 'ありがとう',
      reading: 'Arigatou',
      english: 'Thank you',
      category: 'greetings',
      difficulty: 'beginner',
      example: 'ありがとうございます。',
      exampleReading: 'Arigatou gozaimasu.',
      exampleEnglish: 'Thank you very much.',
      isLearned: false,
      isBookmarked: false,
      reviews: 0,
      streak: 0
    },
    {
      id: '3',
      japanese: 'すみません',
      reading: 'Sumimasen',
      english: 'Excuse me / Sorry',
      category: 'greetings',
      difficulty: 'beginner',
      example: 'すみません、駅はどこですか？',
      exampleReading: 'Sumimasen, eki wa doko desu ka?',
      exampleEnglish: 'Excuse me, where is the station?',
      isLearned: false,
      isBookmarked: false,
      reviews: 0,
      streak: 0
    },
    {
      id: '4',
      japanese: '寿司',
      reading: 'Sushi',
      english: 'Sushi',
      category: 'food',
      difficulty: 'beginner',
      example: '寿司を食べたいです。',
      exampleReading: 'Sushi o tabetai desu.',
      exampleEnglish: 'I want to eat sushi.',
      isLearned: false,
      isBookmarked: false,
      reviews: 0,
      streak: 0
    },
    {
      id: '5',
      japanese: 'おいしい',
      reading: 'Oishii',
      english: 'Delicious',
      category: 'food',
      difficulty: 'beginner',
      example: 'このラーメンはおいしいです。',
      exampleReading: 'Kono raamen wa oishii desu.',
      exampleEnglish: 'This ramen is delicious.',
      isLearned: false,
      isBookmarked: false,
      reviews: 0,
      streak: 0
    },
    {
      id: '6',
      japanese: '水',
      reading: 'Mizu',
      english: 'Water',
      category: 'food',
      difficulty: 'beginner',
      example: '水をください。',
      exampleReading: 'Mizu o kudasai.',
      exampleEnglish: 'Water, please.',
      isLearned: false,
      isBookmarked: false,
      reviews: 0,
      streak: 0
    },
    {
      id: '7',
      japanese: '駅',
      reading: 'Eki',
      english: 'Station',
      category: 'travel',
      difficulty: 'beginner',
      example: '駅まで行きましょう。',
      exampleReading: 'Eki made ikimashou.',
      exampleEnglish: "Let's go to the station.",
      isLearned: false,
      isBookmarked: false,
      reviews: 0,
      streak: 0
    },
    {
      id: '8',
      japanese: 'ホテル',
      reading: 'Hoteru',
      english: 'Hotel',
      category: 'travel',
      difficulty: 'beginner',
      example: 'ホテルを予約しました。',
      exampleReading: 'Hoteru o yoyaku shimashita.',
      exampleEnglish: 'I booked a hotel.',
      isLearned: false,
      isBookmarked: false,
      reviews: 0,
      streak: 0
    },
    {
      id: '9',
      japanese: '観光',
      reading: 'Kankou',
      english: 'Sightseeing',
      category: 'travel',
      difficulty: 'intermediate',
      example: '京都で観光を楽しみました。',
      exampleReading: 'Kyouto de kankou o tanoshimimashita.',
      exampleEnglish: 'I enjoyed sightseeing in Kyoto.',
      isLearned: false,
      isBookmarked: false,
      reviews: 0,
      streak: 0
    }
  ];

  const categories = [
    { id: 'greetings' as Category, name: 'Greetings', icon: '👋', count: 3 },
    { id: 'food' as Category, name: 'Food & Dining', icon: '🍣', count: 3 },
    { id: 'travel' as Category, name: 'Travel', icon: '✈️', count: 3 },
    { id: 'business' as Category, name: 'Business', icon: '💼', count: 0 },
    { id: 'daily' as Category, name: 'Daily Life', icon: '🏠', count: 0 },
    { id: 'numbers' as Category, name: 'Numbers', icon: '🔢', count: 0 },
    { id: 'time' as Category, name: 'Time', icon: '⏰', count: 0 }
  ];

  const difficulties = [
    { id: 'beginner' as Difficulty, name: 'Beginner', color: 'bg-green-100 text-green-700' },
    { id: 'intermediate' as Difficulty, name: 'Intermediate', color: 'bg-yellow-100 text-yellow-700' },
    { id: 'advanced' as Difficulty, name: 'Advanced', color: 'bg-red-100 text-red-700' }
  ];

  useEffect(() => {
    loadVocabulary();
  }, []);

  const loadVocabulary = () => {
    setIsLoading(true);
    setTimeout(() => {
      setWords(vocabularyData);
      updateStats();
      setIsLoading(false);
    }, 500);
  };

  const updateStats = () => {
    const learned = vocabularyData.filter(w => w.isLearned).length;
    const total = vocabularyData.length;
    setStats({
      totalLearned: learned,
      totalWords: total,
      streak: Math.floor(Math.random() * 10),
      accuracy: total > 0 ? Math.round((learned / total) * 100) : 0
    });
  };

  const filteredWords = words.filter(word => {
    const matchesCategory = selectedCategory === 'all' || word.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === 'all' || word.difficulty === selectedDifficulty;
    const matchesSearch = word.japanese.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         word.reading.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         word.english.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesDifficulty && matchesSearch;
  });

  const currentWord = filteredWords[currentWordIndex];

  const playAudio = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ja-JP';
    utterance.rate = 0.8;
    speechSynthesis.speak(utterance);
  };

  const markAsKnown = () => {
    if (!currentWord) return;
    
    const updatedWords = [...words];
    const wordIndex = words.findIndex(w => w.id === currentWord.id);
    
    updatedWords[wordIndex] = {
      ...currentWord,
      isLearned: true,
      reviews: currentWord.reviews + 1,
      streak: currentWord.streak + 1,
      lastReviewed: new Date(),
      nextReview: new Date(Date.now() + 24 * 60 * 60 * 1000) // 1 day later
    };
    
    setWords(updatedWords);
    updateStats();
    
    // Move to next word
    if (currentWordIndex < filteredWords.length - 1) {
      setCurrentWordIndex(prev => prev + 1);
    } else {
      setCurrentWordIndex(0);
    }
    setShowAnswer(false);
  };

  const markAsUnknown = () => {
    if (!currentWord) return;
    
    const updatedWords = [...words];
    const wordIndex = words.findIndex(w => w.id === currentWord.id);
    
    updatedWords[wordIndex] = {
      ...currentWord,
      isLearned: false,
      reviews: currentWord.reviews + 1,
      streak: 0,
      lastReviewed: new Date(),
      nextReview: new Date(Date.now() + 1 * 60 * 60 * 1000) // 1 hour later
    };
    
    setWords(updatedWords);
    updateStats();
    
    if (currentWordIndex < filteredWords.length - 1) {
      setCurrentWordIndex(prev => prev + 1);
    } else {
      setCurrentWordIndex(0);
    }
    setShowAnswer(false);
  };

  const toggleBookmark = (wordId: string) => {
    const updatedWords = words.map(word => 
      word.id === wordId 
        ? { ...word, isBookmarked: !word.isBookmarked }
        : word
    );
    setWords(updatedWords);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading vocabulary...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
                <BookOpen className="w-8 h-8 text-red-600" />
                Vocabulary Builder
              </h1>
              <p className="text-gray-600">Learn essential Japanese words with context and examples</p>
            </div>
            <button className="px-6 py-3 bg-gradient-to-r from-red-500 to-blue-500 text-white rounded-xl hover:shadow-lg transition-all flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Add Custom Word
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white p-4 rounded-xl shadow-sm border">
              <div className="text-2xl font-bold text-green-600">{stats.totalLearned}</div>
              <div className="text-sm text-gray-600">Words Learned</div>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-sm border">
              <div className="text-2xl font-bold text-blue-600">{stats.totalWords}</div>
              <div className="text-sm text-gray-600">Total Words</div>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-sm border">
              <div className="text-2xl font-bold text-purple-600">{stats.streak}</div>
              <div className="text-sm text-gray-600">Day Streak</div>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-sm border">
              <div className="text-2xl font-bold text-amber-600">{stats.accuracy}%</div>
              <div className="text-sm text-gray-600">Accuracy</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Filters */}
          <div className="lg:col-span-1 space-y-6">
            {/* Search */}
            <div className="bg-white rounded-xl shadow-sm p-4 border">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search vocabulary..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
            </div>

            {/* Categories */}
            <div className="bg-white rounded-xl shadow-sm p-4 border">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Layers className="w-5 h-5 text-blue-600" />
                Categories
              </h3>
              <div className="space-y-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`w-full flex items-center justify-between p-3 rounded-lg transition-all ${
                      selectedCategory === category.id
                        ? 'bg-blue-50 text-blue-600 border border-blue-200'
                        : 'hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{category.icon}</span>
                      <span>{category.name}</span>
                    </div>
                    <span className="text-sm bg-gray-100 px-2 py-1 rounded">{category.count}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Difficulty */}
            <div className="bg-white rounded-xl shadow-sm p-4 border">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Filter className="w-5 h-5 text-red-600" />
                Difficulty
              </h3>
              <div className="space-y-2">
                {difficulties.map((difficulty) => (
                  <button
                    key={difficulty.id}
                    onClick={() => setSelectedDifficulty(difficulty.id)}
                    className={`w-full text-left p-3 rounded-lg transition-all ${
                      selectedDifficulty === difficulty.id
                        ? 'border font-medium'
                        : 'hover:bg-gray-50'
                    } ${difficulty.color}`}
                  >
                    {difficulty.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Bookmarked Words */}
            <div className="bg-white rounded-xl shadow-sm p-4 border">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Bookmark className="w-5 h-5 text-amber-600" />
                Bookmarked Words
              </h3>
              <div className="space-y-2">
                {words.filter(w => w.isBookmarked).slice(0, 5).map((word) => (
                  <div key={word.id} className="flex items-center justify-between p-3 bg-amber-50 rounded-lg">
                    <div>
                      <div className="font-medium">{word.japanese}</div>
                      <div className="text-sm text-gray-600">{word.english}</div>
                    </div>
                    <button
                      onClick={() => toggleBookmark(word.id)}
                      className="text-amber-600 hover:text-amber-700"
                    >
                      <Bookmark className="w-5 h-5 fill-current" />
                    </button>
                  </div>
                ))}
                {words.filter(w => w.isBookmarked).length === 0 && (
                  <p className="text-gray-500 text-center py-4">No bookmarked words yet</p>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Learning Interface */}
          <div className="lg:col-span-2">
            {filteredWords.length > 0 ? (
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden border">
                {/* Progress Bar */}
                <div className="px-6 pt-6">
                  <div className="flex justify-between text-sm mb-2">
                    <span>Progress</span>
                    <span>{currentWordIndex + 1} / {filteredWords.length}</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-red-500 to-blue-500 transition-all"
                      style={{ width: `${((currentWordIndex + 1) / filteredWords.length) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Word Display */}
                <div className="p-6 md:p-8">
                  <div className="text-center mb-8">
                    {/* Word */}
                    <div className="text-5xl md:text-6xl font-bold mb-6 text-gray-900">
                      {currentWord?.japanese}
                    </div>

                    {/* Reading (Romaji) */}
                    {!showAnswer && (
                      <div className="text-2xl text-gray-600 mb-6">
                        {currentWord?.reading}
                      </div>
                    )}

                    {/* English Meaning */}
                    {showAnswer ? (
                      <div className="animate-fade-in">
                        <div className="text-2xl font-bold text-green-600 mb-4">
                          {currentWord?.english}
                        </div>
                        
                        {/* Example Sentence */}
                        <div className="mt-8 p-6 bg-gray-50 rounded-xl">
                          <div className="text-xl font-medium text-gray-900 mb-2">
                            {currentWord?.example}
                          </div>
                          <div className="text-gray-600 mb-2">
                            {currentWord?.exampleReading}
                          </div>
                          <div className="text-gray-700">
                            {currentWord?.exampleEnglish}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => setShowAnswer(true)}
                        className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl hover:shadow-lg transition-all flex items-center gap-2 mx-auto"
                      >
                        <Sparkles className="w-5 h-5" />
                        Show Answer
                      </button>
                    )}
                  </div>

                  {/* Controls */}
                  <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
                    <button
                      onClick={() => playAudio(currentWord?.japanese || '')}
                      className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all flex items-center gap-2"
                    >
                      <Volume2 className="w-5 h-5" />
                      Listen
                    </button>

                    <div className="flex gap-4">
                      <button
                        onClick={markAsUnknown}
                        className="px-6 py-3 bg-red-100 text-red-700 rounded-xl hover:bg-red-200 transition-all flex items-center gap-2"
                      >
                        <XCircle className="w-5 h-5" />
                        Don't Know
                      </button>
                      
                      <button
                        onClick={markAsKnown}
                        className="px-6 py-3 bg-green-100 text-green-700 rounded-xl hover:bg-green-200 transition-all flex items-center gap-2"
                      >
                        <CheckCircle className="w-5 h-5" />
                        I Know It
                      </button>
                    </div>

                    <button
                      onClick={() => toggleBookmark(currentWord?.id || '')}
                      className={`px-6 py-3 rounded-xl transition-all flex items-center gap-2 ${
                        currentWord?.isBookmarked
                          ? 'bg-amber-100 text-amber-700 hover:bg-amber-200'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      <Bookmark className={`w-5 h-5 ${currentWord?.isBookmarked ? 'fill-current' : ''}`} />
                      {currentWord?.isBookmarked ? 'Bookmarked' : 'Bookmark'}
                    </button>
                  </div>

                  {/* Word Stats */}
                  {currentWord && (
                    <div className="mt-8 pt-6 border-t grid grid-cols-4 gap-4">
                      <div className="text-center">
                        <div className="text-sm text-gray-600">Reviews</div>
                        <div className="text-lg font-bold">{currentWord.reviews}</div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm text-gray-600">Streak</div>
                        <div className="text-lg font-bold text-blue-600">{currentWord.streak}</div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm text-gray-600">Status</div>
                        <div className={`text-lg font-bold ${
                          currentWord.isLearned ? 'text-green-600' : 'text-yellow-600'
                        }`}>
                          {currentWord.isLearned ? 'Learned' : 'Learning'}
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm text-gray-600">Difficulty</div>
                        <div className={`text-lg font-bold ${
                          currentWord.difficulty === 'beginner' ? 'text-green-600' :
                          currentWord.difficulty === 'intermediate' ? 'text-yellow-600' : 'text-red-600'
                        }`}>
                          {currentWord.difficulty}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
                <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">No words found</h3>
                <p className="text-gray-600 mb-6">Try changing your filters or search term</p>
                <button
                  onClick={() => {
                    setSelectedCategory('greetings');
                    setSelectedDifficulty('beginner');
                    setSearchTerm('');
                  }}
                  className="px-6 py-3 bg-gradient-to-r from-red-500 to-blue-500 text-white rounded-xl hover:shadow-lg transition-all"
                >
                  Reset Filters
                </button>
              </div>
            )}

            {/* Learning Tips */}
            <div className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 border border-blue-100">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Brain className="w-5 h-5 text-blue-600" />
                Learning Tips
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <Volume2 className="w-4 h-4 text-green-600" />
                    <h4 className="font-semibold">Practice Pronunciation</h4>
                  </div>
                  <p className="text-sm text-gray-600">Always listen to the audio and repeat the words out loud.</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-4 h-4 text-purple-600" />
                    <h4 className="font-semibold">Review Regularly</h4>
                  </div>
                  <p className="text-sm text-gray-600">Use spaced repetition for better long-term retention.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Category Progress */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Category Progress</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map((category) => {
              const categoryWords = words.filter(w => w.category === category.id);
              const learnedWords = categoryWords.filter(w => w.isLearned).length;
              const progress = categoryWords.length > 0 ? Math.round((learnedWords / categoryWords.length) * 100) : 0;
              
              return (
                <div key={category.id} className="bg-white p-4 rounded-xl shadow-sm border">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-2xl">{category.icon}</span>
                    <div>
                      <h4 className="font-semibold">{category.name}</h4>
                      <p className="text-sm text-gray-500">{learnedWords}/{categoryWords.length} words</p>
                    </div>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <div className="text-right mt-1">
                    <span className="text-sm font-medium">{progress}%</span>
                  </div>
                </div>
              );
            })}
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

export default VocabularyBuilder;