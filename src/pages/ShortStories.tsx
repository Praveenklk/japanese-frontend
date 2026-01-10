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
  RotateCw,
  Sparkles,
  Target,
  Clock,
  TrendingUp,
  Headphones,
  FileText,
  Award
} from 'lucide-react';

type Difficulty = 'beginner' | 'intermediate' | 'advanced';
type StoryStatus = 'locked' | 'available' | 'completed';

interface Story {
  id: string;
  title: string;
  japaneseTitle: string;
  description: string;
  difficulty: Difficulty;
  duration: string;
  wordCount: number;
  level: 'N5' | 'N4';
  tags: string[];
  content: {
    japanese: string[];
    english: string[];
    vocabulary: { word: string; reading: string; meaning: string; }[];
  };
  isBookmarked: boolean;
  status: StoryStatus;
  readCount: number;
  comprehensionQuiz?: QuizQuestion[];
}

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

const ShortStories = () => {
  const [stories, setStories] = useState<Story[]>([
    {
      id: '1',
      title: 'My First Day in Tokyo',
      japaneseTitle: '東京での初めての日',
      description: 'A simple story about arriving in Tokyo for the first time',
      difficulty: 'beginner',
      duration: '5 min',
      wordCount: 120,
      level: 'N5',
      tags: ['travel', 'daily life', 'introductions'],
      content: {
        japanese: [
          '今日は東京に着きました。',
          '空港から電車でホテルへ行きました。',
          '電車の中は人がたくさんいました。',
          'ホテルの部屋はきれいでした。',
          '窓から東京タワーが見えました。',
          'とてもうれしかったです。'
        ],
        english: [
          'I arrived in Tokyo today.',
          'I went from the airport to the hotel by train.',
          'There were many people on the train.',
          'The hotel room was clean.',
          'I could see Tokyo Tower from the window.',
          'I was very happy.'
        ],
        vocabulary: [
          { word: '今日', reading: 'きょう', meaning: 'today' },
          { word: '東京', reading: 'とうきょう', meaning: 'Tokyo' },
          { word: '空港', reading: 'くうこう', meaning: 'airport' },
          { word: '電車', reading: 'でんしゃ', meaning: 'train' },
          { word: 'ホテル', reading: 'ほてる', meaning: 'hotel' },
          { word: '人', reading: 'ひと', meaning: 'people' },
          { word: '部屋', reading: 'へや', meaning: 'room' },
          { word: '窓', reading: 'まど', meaning: 'window' },
          { word: '見える', reading: 'みえる', meaning: 'can see' },
          { word: 'うれしい', reading: 'うれしい', meaning: 'happy' }
        ]
      },
      isBookmarked: false,
      status: 'available',
      readCount: 0,
      comprehensionQuiz: [
        {
          id: 'q1',
          question: 'How did the person go to the hotel?',
          options: ['By bus', 'By train', 'By taxi', 'By walk'],
          correctAnswer: 'By train',
          explanation: 'The story says "電車でホテルへ行きました" (I went to the hotel by train).'
        },
        {
          id: 'q2',
          question: 'What could they see from the window?',
          options: ['Mount Fuji', 'Tokyo Tower', 'Sky Tree', 'Shinjuku'],
          correctAnswer: 'Tokyo Tower',
          explanation: 'The story says "窓から東京タワーが見えました" (I could see Tokyo Tower from the window).'
        },
        {
          id: 'q3',
          question: 'How did they feel?',
          options: ['Tired', 'Happy', 'Scared', 'Hungry'],
          correctAnswer: 'Happy',
          explanation: 'The story ends with "とてもうれしかったです" (I was very happy).'
        }
      ]
    },
    {
      id: '2',
      title: 'Meeting New Friends',
      japaneseTitle: '新しい友達',
      description: 'Making friends at a language exchange cafe',
      difficulty: 'beginner',
      duration: '6 min',
      wordCount: 150,
      level: 'N5',
      tags: ['friends', 'conversation', 'food'],
      content: {
        japanese: [
          'カフェで日本の友達を作りました。',
          '名前はたけしさんです。',
          'たけしさんはとても親切です。',
          '一緒にコーヒーを飲みました。',
          '日本語と英語を練習しました。',
          'たけしさんは寿司が好きです。',
          '今度、寿司屋へ行く約束をしました。'
        ],
        english: [
          'I made a Japanese friend at a cafe.',
          'His name is Takeshi.',
          'Takeshi is very kind.',
          'We drank coffee together.',
          'We practiced Japanese and English.',
          'Takeshi likes sushi.',
          'We made a promise to go to a sushi restaurant next time.'
        ],
        vocabulary: [
          { word: 'カフェ', reading: 'かふぇ', meaning: 'cafe' },
          { word: '友達', reading: 'ともだち', meaning: 'friend' },
          { word: '名前', reading: 'なまえ', meaning: 'name' },
          { word: '親切', reading: 'しんせつ', meaning: 'kind' },
          { word: '一緒に', reading: 'いっしょに', meaning: 'together' },
          { word: 'コーヒー', reading: 'こーひー', meaning: 'coffee' },
          { word: '飲む', reading: 'のむ', meaning: 'to drink' },
          { word: '練習', reading: 'れんしゅう', meaning: 'practice' },
          { word: '寿司', reading: 'すし', meaning: 'sushi' },
          { word: '約束', reading: 'やくそく', meaning: 'promise' }
        ]
      },
      isBookmarked: true,
      status: 'available',
      readCount: 2
    },
    {
      id: '3',
      title: 'Shopping in Akihabara',
      japaneseTitle: '秋葉原での買い物',
      description: 'Shopping for electronics in Akihabara',
      difficulty: 'beginner',
      duration: '7 min',
      wordCount: 180,
      level: 'N5',
      tags: ['shopping', 'electronics', 'city'],
      content: {
        japanese: [
          '秋葉原は電気の町です。',
          'たくさんの電気屋があります。',
          '新しいカメラを買いました。',
          '値段は三万円でした。',
          '店員さんは英語が話せます。',
          '保証書をもらいました。',
          'とても良い買い物でした。'
        ],
        english: [
          'Akihabara is an electronics town.',
          'There are many electronics stores.',
          'I bought a new camera.',
          'The price was 30,000 yen.',
          'The store clerk can speak English.',
          'I received a warranty.',
          'It was a very good purchase.'
        ],
        vocabulary: [
          { word: '秋葉原', reading: 'あきはばら', meaning: 'Akihabara' },
          { word: '電気', reading: 'でんき', meaning: 'electronics' },
          { word: '町', reading: 'まち', meaning: 'town' },
          { word: '買う', reading: 'かう', meaning: 'to buy' },
          { word: '値段', reading: 'ねだん', meaning: 'price' },
          { word: '三万円', reading: 'さんまんえん', meaning: '30,000 yen' },
          { word: '店員', reading: 'てんいん', meaning: 'store clerk' },
          { word: '英語', reading: 'えいご', meaning: 'English' },
          { word: '話せる', reading: 'はなせる', meaning: 'can speak' },
          { word: '保証書', reading: 'ほしょうしょ', meaning: 'warranty' }
        ]
      },
      isBookmarked: false,
      status: 'completed',
      readCount: 3
    },
    {
      id: '4',
      title: 'A Rainy Day in Kyoto',
      japaneseTitle: '京都の雨の日',
      description: 'Visiting temples on a rainy day in Kyoto',
      difficulty: 'intermediate',
      duration: '8 min',
      wordCount: 200,
      level: 'N4',
      tags: ['travel', 'weather', 'culture'],
      content: {
        japanese: [
          '今日は京都で雨が降っています。',
          'でも、傘を持ってきました。',
          'まず金閣寺へ行きました。',
          '雨の中の金閣寺はとてもきれいでした。',
          'それから、清水寺も見ました。',
          '雨のおかげで、観光客が少なかったです。',
          '静かな京都を楽しむことができました。'
        ],
        english: [
          'It\'s raining in Kyoto today.',
          'But I brought an umbrella.',
          'First, I went to Kinkaku-ji.',
          'Kinkaku-ji in the rain was very beautiful.',
          'Then, I also saw Kiyomizu-dera.',
          'Thanks to the rain, there were fewer tourists.',
          'I was able to enjoy a quiet Kyoto.'
        ],
        vocabulary: [
          { word: '雨', reading: 'あめ', meaning: 'rain' },
          { word: '降る', reading: 'ふる', meaning: 'to fall (rain)' },
          { word: '傘', reading: 'かさ', meaning: 'umbrella' },
          { word: '持つ', reading: 'もつ', meaning: 'to bring/hold' },
          { word: 'まず', reading: 'まず', meaning: 'first' },
          { word: '金閣寺', reading: 'きんかくじ', meaning: 'Kinkaku-ji' },
          { word: '清水寺', reading: 'きよみずでら', meaning: 'Kiyomizu-dera' },
          { word: 'おかげで', reading: 'おかげで', meaning: 'thanks to' },
          { word: '観光客', reading: 'かんこうきゃく', meaning: 'tourist' },
          { word: '静か', reading: 'しずか', meaning: 'quiet' }
        ]
      },
      isBookmarked: false,
      status: 'locked',
      readCount: 0
    }
  ]);

  const [selectedStory, setSelectedStory] = useState<string>('1');
  const [currentPage, setCurrentPage] = useState(0);
  const [showTranslation, setShowTranslation] = useState(false);
  const [showVocabulary, setShowVocabulary] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [quizMode, setQuizMode] = useState(false);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [quizScore, setQuizScore] = useState<number | null>(null);
  const [stats, setStats] = useState({
    storiesRead: 3,
    wordsLearned: 450,
    readingTime: 25,
    streak: 5
  });

  const selectedStoryData = stories.find(story => story.id === selectedStory);
  const currentSentence = selectedStoryData?.content.japanese[currentPage];
  const currentTranslation = selectedStoryData?.content.english[currentPage];

  useEffect(() => {
    // Update reading stats when story changes
    const savedStats = localStorage.getItem('readingStats');
    if (savedStats) {
      setStats(JSON.parse(savedStats));
    }
  }, []);

  const handleNextPage = () => {
    if (selectedStoryData && currentPage < selectedStoryData.content.japanese.length - 1) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(prev => prev - 1);
    }
  };

  const toggleBookmark = (storyId: string) => {
    setStories(prev => prev.map(story => 
      story.id === storyId 
        ? { ...story, isBookmarked: !story.isBookmarked }
        : story
    ));
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

  const startReading = (storyId: string) => {
    setSelectedStory(storyId);
    setCurrentPage(0);
    setShowTranslation(false);
    setShowVocabulary(false);
    setQuizMode(false);
    
    // Update read count
    setStories(prev => prev.map(story => 
      story.id === storyId 
        ? { ...story, readCount: story.readCount + 1 }
        : story
    ));
    
    // Update stats
    const newStats = {
      ...stats,
      storiesRead: stats.storiesRead + 1,
      readingTime: stats.readingTime + 5
    };
    setStats(newStats);
    localStorage.setItem('readingStats', JSON.stringify(newStats));
  };

  const submitQuiz = () => {
    if (!selectedStoryData?.comprehensionQuiz) return;
    
    let score = 0;
    selectedStoryData.comprehensionQuiz.forEach(question => {
      if (userAnswers[question.id] === question.correctAnswer) {
        score++;
      }
    });
    
    const percentage = Math.round((score / selectedStoryData.comprehensionQuiz.length) * 100);
    setQuizScore(percentage);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
                <BookOpen className="w-8 h-8 text-purple-600" />
                Japanese Short Stories
              </h1>
              <p className="text-gray-600">Read beginner-friendly stories to improve your Japanese</p>
            </div>
            <div className="flex items-center gap-4">
              <button className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:shadow-lg transition-all flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                Daily Reading Challenge
              </button>
            </div>
          </div>

          {/* Reading Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white p-4 rounded-xl shadow-sm border">
              <div className="text-2xl font-bold text-purple-600">{stats.storiesRead}</div>
              <div className="text-sm text-gray-600">Stories Read</div>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-sm border">
              <div className="text-2xl font-bold text-green-600">{stats.wordsLearned}</div>
              <div className="text-sm text-gray-600">Words Learned</div>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-sm border">
              <div className="text-2xl font-bold text-blue-600">{stats.readingTime}m</div>
              <div className="text-sm text-gray-600">Reading Time</div>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-sm border">
              <div className="text-2xl font-bold text-amber-600">{stats.streak} days</div>
              <div className="text-sm text-gray-600">Reading Streak</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Stories List */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden border">
              <div className="p-6 border-b">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-blue-600" />
                  Available Stories
                </h2>
                <p className="text-sm text-gray-600 mt-1">Beginner-friendly content</p>
              </div>

              <div className="divide-y">
                {stories.map((story) => (
                  <div
                    key={story.id}
                    className={`p-4 hover:bg-gray-50 transition cursor-pointer ${
                      selectedStory === story.id ? 'bg-blue-50' : ''
                    }`}
                    onClick={() => startReading(story.id)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-bold text-gray-900">{story.title}</h3>
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            story.difficulty === 'beginner' ? 'bg-green-100 text-green-700' :
                            story.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-red-100 text-red-700'
                          }`}>
                            {story.level}
                          </span>
                        </div>
                        
                        <p className="text-sm text-gray-600 mb-3">{story.description}</p>
                        
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {story.duration}
                          </div>
                          <div className="flex items-center gap-1">
                            <Eye className="w-4 h-4" />
                            {story.readCount} reads
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2 mt-3">
                          {story.tags.slice(0, 2).map((tag, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="flex flex-col items-center gap-2 ml-4">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleBookmark(story.id);
                          }}
                          className="text-amber-500 hover:text-amber-600"
                        >
                          {story.isBookmarked ? (
                            <BookmarkCheck className="w-5 h-5 fill-current" />
                          ) : (
                            <Bookmark className="w-5 h-5" />
                          )}
                        </button>
                        {story.status === 'completed' && (
                          <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Reading Tips */}
            <div className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 border border-blue-200">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-blue-600" />
                Reading Tips
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <Volume2 className="w-4 h-4 text-green-600 mt-0.5" />
                  <span className="text-sm">Read aloud to practice pronunciation</span>
                </li>
                <li className="flex items-start gap-2">
                  <Target className="w-4 h-4 text-blue-600 mt-0.5" />
                  <span className="text-sm">Focus on understanding context, not every word</span>
                </li>
                <li className="flex items-start gap-2">
                  <TrendingUp className="w-4 h-4 text-purple-600 mt-0.5" />
                  <span className="text-sm">Re-read stories to build fluency</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Reading Interface */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-6 border">
              {/* Story Header */}
              <div className="mb-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">{selectedStoryData?.title}</h2>
                    <p className="text-gray-600">{selectedStoryData?.japaneseTitle}</p>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    {selectedStoryData?.comprehensionQuiz && !quizMode && (
                      <button
                        onClick={() => setQuizMode(true)}
                        className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg hover:shadow-lg transition-all flex items-center gap-2"
                      >
                        <Award className="w-4 h-4" />
                        Take Quiz
                      </button>
                    )}
                    
                    <button
                      onClick={() => setShowVocabulary(!showVocabulary)}
                      className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition"
                    >
                      {showVocabulary ? 'Hide Vocab' : 'Show Vocab'}
                    </button>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-6">
                  <div className="flex justify-between text-sm mb-2">
                    <span>Progress</span>
                    <span>
                      {currentPage + 1} / {selectedStoryData?.content.japanese.length || 1}
                    </span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all"
                      style={{ 
                        width: `${((currentPage + 1) / (selectedStoryData?.content.japanese.length || 1)) * 100}%` 
                      }}
                    />
                  </div>
                </div>
              </div>

              {quizMode ? (
                /* Quiz Mode */
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-6">Comprehension Quiz</h3>
                  
                  {quizScore === null ? (
                    <div className="space-y-6">
                      {selectedStoryData?.comprehensionQuiz?.map((question, index) => (
                        <div key={question.id} className="p-4 border rounded-xl">
                          <div className="flex items-center gap-2 mb-4">
                            <div className="w-8 h-8 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center">
                              {index + 1}
                            </div>
                            <h4 className="font-semibold text-gray-900">{question.question}</h4>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-3">
                            {question.options.map((option, optIndex) => (
                              <button
                                key={optIndex}
                                onClick={() => setUserAnswers(prev => ({
                                  ...prev,
                                  [question.id]: option
                                }))}
                                className={`p-3 text-left rounded-lg border transition ${
                                  userAnswers[question.id] === option
                                    ? 'border-blue-500 bg-blue-50'
                                    : 'border-gray-200 hover:bg-gray-50'
                                }`}
                              >
                                {option}
                              </button>
                            ))}
                          </div>
                        </div>
                      ))}
                      
                      <div className="flex gap-4">
                        <button
                          onClick={submitQuiz}
                          className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl hover:shadow-lg transition-all"
                        >
                          Submit Quiz
                        </button>
                        <button
                          onClick={() => setQuizMode(false)}
                          className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition"
                        >
                          Back to Story
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* Quiz Results */
                    <div className="text-center py-8">
                      <div className="text-6xl mb-4">
                        {quizScore >= 80 ? '🎉' : quizScore >= 60 ? '👍' : '📚'}
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">
                        {quizScore >= 80 ? 'Excellent!' : quizScore >= 60 ? 'Good Job!' : 'Keep Practicing!'}
                      </h3>
                      <div className="text-4xl font-bold text-blue-600 mb-4">{quizScore}%</div>
                      <p className="text-gray-600 mb-6">
                        You answered {selectedStoryData?.comprehensionQuiz?.filter(q => 
                          userAnswers[q.id] === q.correctAnswer
                        ).length} out of {selectedStoryData?.comprehensionQuiz?.length} questions correctly
                      </p>
                      <div className="flex gap-4 justify-center">
                        <button
                          onClick={() => {
                            setQuizMode(false);
                            setQuizScore(null);
                            setUserAnswers({});
                          }}
                          className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl hover:shadow-lg transition-all"
                        >
                          Read Again
                        </button>
                        <button
                          onClick={() => {
                            const nextStory = stories.find(s => 
                              s.id !== selectedStory && s.status !== 'locked'
                            );
                            if (nextStory) {
                              startReading(nextStory.id);
                              setQuizMode(false);
                              setQuizScore(null);
                              setUserAnswers({});
                            }
                          }}
                          className="px-6 py-3 bg-green-100 text-green-700 rounded-xl hover:bg-green-200 transition"
                        >
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
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={handlePrevPage}
                        disabled={currentPage === 0}
                        className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                      
                      <button
                        onClick={playAudio}
                        disabled={isPlaying}
                        className="p-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl hover:shadow-lg transition-all flex items-center gap-2"
                      >
                        {isPlaying ? (
                          <Pause className="w-5 h-5" />
                        ) : (
                          <Volume2 className="w-5 h-5" />
                        )}
                        Listen
                      </button>
                      
                      <button
                        onClick={handleNextPage}
                        disabled={currentPage === (selectedStoryData?.content.japanese.length || 1) - 1}
                        className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </div>
                    
                    <button
                      onClick={() => setShowTranslation(!showTranslation)}
                      className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition"
                    >
                      {showTranslation ? 'Hide Translation' : 'Show Translation'}
                    </button>
                  </div>

                  {/* Main Reading Area */}
                  <div className="mb-8">
                    <div className="text-center mb-8">
                      <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 leading-relaxed">
                        {currentSentence}
                      </div>
                      
                      {showTranslation && (
                        <div className="animate-fade-in">
                          <div className="text-xl text-gray-700 mb-4 p-4 bg-blue-50 rounded-xl">
                            {currentTranslation}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Vocabulary Panel */}
                    {showVocabulary && selectedStoryData && (
                      <div className="mb-8 animate-fade-in">
                        <h4 className="text-lg font-semibold text-gray-900 mb-4">Vocabulary in This Story</h4>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                          {selectedStoryData.content.vocabulary.map((vocab, index) => (
                            <div key={index} className="p-3 bg-gray-50 rounded-lg">
                              <div className="font-medium text-gray-900">{vocab.word}</div>
                              <div className="text-sm text-gray-600">{vocab.reading}</div>
                              <div className="text-sm text-blue-600">{vocab.meaning}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Reading Tips */}
                    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
                      <div className="flex items-start gap-3">
                        <Lightbulb className="w-5 h-5 text-yellow-600 mt-0.5" />
                        <div>
                          <div className="font-medium text-yellow-800 mb-1">Reading Tip</div>
                          <div className="text-yellow-700">
                            Try to understand the sentence without translation first. 
                            Look at individual words if needed, then check the translation.
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Story Completion */}
                  {currentPage === (selectedStoryData?.content.japanese.length || 1) - 1 && (
                    <div className="mt-8 p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200 text-center">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">Story Complete! 🎉</h3>
                      <p className="text-gray-600 mb-4">
                        Great job reading through the story! Try the comprehension quiz to test your understanding.
                      </p>
                      {selectedStoryData?.comprehensionQuiz && (
                        <button
                          onClick={() => setQuizMode(true)}
                          className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl hover:shadow-lg transition-all"
                        >
                          Take Comprehension Quiz
                        </button>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Reading Benefits */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded-xl shadow-sm border">
                <div className="flex items-center gap-2 mb-3">
                  <BookOpen className="w-5 h-5 text-blue-600" />
                  <h4 className="font-semibold">Build Vocabulary</h4>
                </div>
                <p className="text-sm text-gray-600">
                  Learn words in context for better retention
                </p>
              </div>
              <div className="bg-white p-4 rounded-xl shadow-sm border">
                <div className="flex items-center gap-2 mb-3">
                  <Headphones className="w-5 h-5 text-green-600" />
                  <h4 className="font-semibold">Improve Listening</h4>
                </div>
                <p className="text-sm text-gray-600">
                  Practice listening to native pronunciation
                </p>
              </div>
              <div className="bg-white p-4 rounded-xl shadow-sm border">
                <div className="flex items-center gap-2 mb-3">
                  <TrendingUp className="w-5 h-5 text-purple-600" />
                  <h4 className="font-semibold">Gain Confidence</h4>
                </div>
                <p className="text-sm text-gray-600">
                  Read real Japanese content at your level
                </p>
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

// Add Lightbulb icon
const Lightbulb = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
  </svg>
);

export default ShortStories;