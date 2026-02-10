import React, { useMemo, useState, useEffect, useRef } from "react";
import { 
  ChevronDown, 
  ChevronUp, 
  Search, 
  Volume2, 
  Sparkles, 
  BookOpen, 
  Lightbulb,
  Zap,
  Target,
  Star,
  Copy,
  Check,
  Bookmark,
  BookmarkCheck,
  Play,
  Pause,
  Heart,
  TrendingUp,
  Award,
  RotateCcw,
  Share2,
  Download,
  HelpCircle,
  Clock,
  Users,
  Globe,
  Music,
  Mic,
  Shuffle,
  ArrowRight,
  Brain,
  Trophy,
  Languages,
  JapaneseYen,

  Castle,
  Flower
} from "lucide-react";
import grammarData from "../grammerN4.json";

interface Example {
  jp: string;
  romaji: string;
  en: string;
  grammar_audio?: string;
}

interface GrammarItem {
  title: string;
  short_explanation: string;
  long_explanation: string;
  formation: string;
  examples: Example[];
  p_tag: string;
  s_tag: string;
}

// Japanese images for background themes
const JAPANESE_IMAGES = [
  "https://images.unsplash.com/photo-1528164344705-47542687000d?auto=format&fit=crop&w=600", // Tokyo street
  "https://images.unsplash.com/photo-1526481280693-3bfa7568e0f3?auto=format&fit=crop&w=600", // Cherry blossoms
  "https://images.unsplash.com/photo-1545569341-9eb8b30979d9?auto=format&fit=crop&w-600", // Japanese temple
  "https://images.unsplash.com/photo-1513407030348-c983a97b98d8?auto=format&fit=crop&w=600", // Sushi
  "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=600", // Mount Fuji
  "https://images.unsplash.com/photo-1522383225653-ed111181a951?auto=format&fit=crop&w=600", // Japanese garden
];

// Japanese TTS utility with better voice handling
const speakJapanese = (text: string, rate: number = 0.9) => {
  if ('speechSynthesis' in window) {
    speechSynthesis.cancel(); // Stop any current speech
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ja-JP';
    utterance.rate = rate;
    utterance.pitch = 1;
    utterance.volume = 1;
    
    // Get voices and find Japanese voice
    const voices = speechSynthesis.getVoices();
    let japaneseVoice = voices.find(voice => 
      voice.lang.startsWith('ja-JP') || voice.name.includes('Japanese')
    );
    
    // Fallback to any Japanese voice
    if (!japaneseVoice) {
      japaneseVoice = voices.find(voice => voice.lang.startsWith('ja'));
    }
    
    if (japaneseVoice) {
      utterance.voice = japaneseVoice;
    }
    
    speechSynthesis.speak(utterance);
    return utterance;
  }
  return null;
};

const GrammarN4Page: React.FC<{ darkMode?: boolean }> = ({ darkMode = false }) => {
  const [search, setSearch] = useState("");
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [bookmarkedItems, setBookmarkedItems] = useState<number[]>([]);
  const [playingAudio, setPlayingAudio] = useState<number | null>(null);
  const [activeFilter, setActiveFilter] = useState<'all' | 'bookmarked' | 'recent'>('all');
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [speechRate, setSpeechRate] = useState(0.9);
  const [showPracticeMode, setShowPracticeMode] = useState(false);
  const [currentPracticeIndex, setCurrentPracticeIndex] = useState(0);
  const [userPracticeAnswers, setUserPracticeAnswers] = useState<Record<number, string>>({});
  const [practiceScore, setPracticeScore] = useState({ correct: 0, total: 0 });
  
  const grammarList = grammarData as GrammarItem[];

  // Initialize voices and images
  useEffect(() => {
    if ('speechSynthesis' in window) {
      speechSynthesis.getVoices();
    }
  }, []);

  const filteredGrammar = useMemo(() => {
    let list = grammarList;
    
    if (search) {
      list = list.filter((item) =>
        item.title.toLowerCase().includes(search.toLowerCase()) ||
        item.short_explanation.toLowerCase().includes(search.toLowerCase()) ||
        item.p_tag.toLowerCase().includes(search.toLowerCase()) ||
        item.examples.some(ex => ex.jp.toLowerCase().includes(search.toLowerCase()))
      );
    }
    
    if (activeFilter === 'bookmarked') {
      list = list.filter((_, idx) => bookmarkedItems.includes(idx));
    } else if (activeFilter === 'recent') {
      // Show last 10 items as "recent"
      list = list.slice(-10).reverse();
    }
    
    return list;
  }, [search, grammarList, activeFilter, bookmarkedItems]);

  const handleBookmark = (index: number) => {
    setBookmarkedItems(prev =>
      prev.includes(index)
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  const handlePlayAudio = (text: string, index: number) => {
    if (playingAudio === index) {
      speechSynthesis.cancel();
      setPlayingAudio(null);
    } else {
      speechSynthesis.cancel();
      const utterance = speakJapanese(text, speechRate);
      if (utterance) {
        setPlayingAudio(index);
        utterance.onend = () => setPlayingAudio(null);
        utterance.onerror = () => setPlayingAudio(null);
      }
    }
  };

  const handleCopyText = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(text);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const getGrammarStats = () => {
    return {
      total: grammarList.length,
      bookmarked: bookmarkedItems.length,
      practiced: Object.keys(userPracticeAnswers).length,
      mastery: Math.floor((bookmarkedItems.length / grammarList.length) * 100),
    };
  };

  const stats = getGrammarStats();

  // Practice mode functions
  const startPracticeMode = () => {
    setShowPracticeMode(true);
    setCurrentPracticeIndex(0);
    setPracticeScore({ correct: 0, total: bookmarkedItems.length || 5 });
  };

  const handlePracticeAnswer = (answer: string) => {
    const currentItem = filteredGrammar[bookmarkedItems[currentPracticeIndex] || currentPracticeIndex];
    const isCorrect = answer.toLowerCase().includes(currentItem.title.toLowerCase());
    
    setUserPracticeAnswers(prev => ({
      ...prev,
      [currentPracticeIndex]: answer
    }));
    
    if (isCorrect) {
      setPracticeScore(prev => ({ ...prev, correct: prev.correct + 1 }));
    }
    
    // Move to next or finish
    if (currentPracticeIndex < practiceScore.total - 1) {
      setTimeout(() => {
        setCurrentPracticeIndex(prev => prev + 1);
      }, 1500);
    } else {
      setTimeout(() => {
        setShowPracticeMode(false);
      }, 3000);
    }
  };

  const getRandomImage = () => {
    return JAPANESE_IMAGES[Math.floor(Math.random() * JAPANESE_IMAGES.length)];
  };

  const getGrammarTypeColor = (tag: string) => {
    const types: Record<string, string> = {
      'Particle': 'bg-blue-500',
      'Verb': 'bg-green-500',
      'Adjective': 'bg-purple-500',
      'Noun': 'bg-amber-500',
      'Conjunction': 'bg-pink-500',
      'Expression': 'bg-cyan-500',
    };
    return types[tag] || 'bg-gray-500';
  };

  const getRandomJapaneseEmoji = () => {
    const emojis = ['🎌', '🗾', '🏯', '🌸', '🍣', '🎎', '⛩️', '🎏', '🍙', '🍵', '🎋', '🎍'];
    return emojis[Math.floor(Math.random() * emojis.length)];
  };

  return (
    <main className={`min-h-screen transition-all duration-500 ${
      darkMode
        ? "bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950"
        : "bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50"
    }`}>
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-64 h-64 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/2 w-80 h-80 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-12">
        {/* Hero Section with Japanese Theme */}
        <div className={`rounded-3xl p-8 mb-10 relative overflow-hidden border ${
          darkMode
            ? "bg-gradient-to-br from-gray-900/80 to-gray-800/80 border-gray-800 backdrop-blur-xl"
            : "bg-white/80 backdrop-blur-xl border-white/20 shadow-2xl"
        }`}>
          {/* Japanese-themed background image */}
          <div 
            className="absolute inset-0 opacity-10 bg-cover bg-center"
            style={{ backgroundImage: `url(${getRandomImage()})` }}
          ></div>
          
          <div className="relative z-10">
            <div className="flex flex-col lg:flex-row justify-between items-start gap-8">
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-6">
                  <div className={`p-4 rounded-2xl ${
                    darkMode 
                      ? "bg-gradient-to-br from-blue-600/20 to-purple-600/20 border border-blue-500/30"
                      : "bg-gradient-to-br from-blue-100 to-purple-100 border border-blue-200"
                  }`}>
                    <JapaneseYen className="w-10 h-10 text-blue-500" />
                  </div>
                  <div>
                    <h1 className={`text-4xl md:text-5xl font-bold ${
                      darkMode ? "text-white" : "text-gray-900"
                    }`}>
                      JLPT N4 Grammar Master
                    </h1>
                    <p className={`mt-2 text-lg flex items-center gap-2 ${
                      darkMode ? "text-gray-300" : "text-gray-600"
                    }`}>
                      <Sparkles className="w-5 h-5 text-amber-500" />
                      Interactive learning with voice & practice
                    </p>
                  </div>
                </div>
                
                {/* Quick Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                  <div className={`p-4 rounded-2xl backdrop-blur-sm ${
                    darkMode ? "bg-gray-800/50 border border-gray-700" : "bg-white/60 border border-white/40"
                  }`}>
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${
                        darkMode ? "bg-blue-900/30" : "bg-blue-100"
                      }`}>
                        <Target className="w-5 h-5 text-blue-500" />
                      </div>
                      <div>
                        <div className="text-2xl font-bold">{stats.total}</div>
                        <div className="text-sm opacity-80">Grammar Points</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className={`p-4 rounded-2xl backdrop-blur-sm ${
                    darkMode ? "bg-gray-800/50 border border-gray-700" : "bg-white/60 border border-white/40"
                  }`}>
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${
                        darkMode ? "bg-emerald-900/30" : "bg-emerald-100"
                      }`}>
                        <BookmarkCheck className="w-5 h-5 text-emerald-500" />
                      </div>
                      <div>
                        <div className="text-2xl font-bold">{stats.bookmarked}</div>
                        <div className="text-sm opacity-80">Saved</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className={`p-4 rounded-2xl backdrop-blur-sm ${
                    darkMode ? "bg-gray-800/50 border border-gray-700" : "bg-white/60 border border-white/40"
                  }`}>
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${
                        darkMode ? "bg-amber-900/30" : "bg-amber-100"
                      }`}>
                        <Trophy className="w-5 h-5 text-amber-500" />
                      </div>
                      <div>
                        <div className="text-2xl font-bold">{stats.mastery}%</div>
                        <div className="text-sm opacity-80">Mastery</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className={`p-4 rounded-2xl backdrop-blur-sm ${
                    darkMode ? "bg-gray-800/50 border border-gray-700" : "bg-white/60 border border-white/40"
                  }`}>
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${
                        darkMode ? "bg-purple-900/30" : "bg-purple-100"
                      }`}>
                        <Brain className="w-5 h-5 text-purple-500" />
                      </div>
                      <div>
                        <div className="text-2xl font-bold">{stats.practiced}</div>
                        <div className="text-sm opacity-80">Practiced</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Quick Actions */}
              <div className="flex flex-col gap-4 min-w-[280px]">
                <button
                  onClick={startPracticeMode}
                  disabled={bookmarkedItems.length === 0}
                  className={`p-4 rounded-2xl font-bold flex items-center justify-center gap-3 ${
                    bookmarkedItems.length === 0
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:scale-105 transition-transform"
                  } ${
                    darkMode
                      ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-xl"
                      : "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-xl"
                  }`}
                >
                  <Play className="w-6 h-6" />
                  Practice Mode ({bookmarkedItems.length})
                </button>
                
                <button
                  onClick={() => setActiveFilter(activeFilter === 'bookmarked' ? 'all' : 'bookmarked')}
                  className={`p-4 rounded-2xl font-medium flex items-center justify-center gap-3 ${
                    activeFilter === 'bookmarked'
                      ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                      : darkMode
                        ? "bg-gray-800/50 hover:bg-gray-700/50"
                        : "bg-white/60 hover:bg-white/80"
                  }`}
                >
                  {activeFilter === 'bookmarked' ? <BookmarkCheck className="w-5 h-5" /> : <Bookmark className="w-5 h-5" />}
                  {activeFilter === 'bookmarked' ? 'Show All' : 'Show Saved'}
                </button>
                
                <button
                  onClick={() => {
                    const randomIndex = Math.floor(Math.random() * grammarList.length);
                    setOpenIndex(randomIndex);
                  }}
                  className={`p-4 rounded-2xl font-medium flex items-center justify-center gap-3 ${
                    darkMode
                      ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-xl"
                      : "bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:shadow-xl"
                  }`}
                >
                  <Shuffle className="w-5 h-5" />
                  Random Grammar
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Controls */}
        <div className={`sticky top-4 z-30 mb-8 rounded-2xl p-5 backdrop-blur-xl ${
          darkMode
            ? "bg-gray-900/80 border border-gray-800 shadow-2xl"
            : "bg-white/80 border border-white/40 shadow-2xl"
        }`}>
          <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
            <div className="flex-1 w-full">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-blue-400" />
                <input
                  type="text"
                  placeholder="Search grammar, examples, or tags..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className={`w-full pl-12 pr-4 py-4 rounded-xl text-lg border ${
                    darkMode
                      ? "bg-gray-800/50 border-gray-700 placeholder-gray-500 text-white"
                      : "bg-white/60 border-white/40 placeholder-gray-400 text-gray-900"
                  }`}
                />
                {search && (
                  <button
                    onClick={() => setSearch('')}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2"
                  >
                    <span className="text-gray-400 hover:text-gray-300">✕</span>
                  </button>
                )}
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className={`px-4 py-2 rounded-xl ${
                darkMode ? "bg-gray-800" : "bg-white/60"
              }`}>
                <div className="flex items-center gap-2">
                  <Mic className="w-4 h-4 text-blue-500" />
                  <span className="text-sm">Speed:</span>
                  <select
                    value={speechRate}
                    onChange={(e) => setSpeechRate(parseFloat(e.target.value))}
                    className={`bg-transparent text-sm outline-none ${
                      darkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    <option value="0.7">Slow</option>
                    <option value="0.9">Normal</option>
                    <option value="1.1">Fast</option>
                  </select>
                </div>
              </div>
              
              <div className={`px-4 py-2 rounded-xl ${
                darkMode ? "bg-gray-800" : "bg-white/60"
              }`}>
                <span className="text-sm">
                  <span className="font-bold text-blue-500">{filteredGrammar.length}</span> results
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Practice Mode Overlay */}
        {showPracticeMode && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div 
              className="absolute inset-0 bg-black/70 backdrop-blur-sm"
              onClick={() => setShowPracticeMode(false)}
            ></div>
            
            <div className={`relative z-10 w-full max-w-2xl rounded-3xl p-8 ${
              darkMode ? "bg-gray-900" : "bg-white"
            }`}>
              <div className="text-center mb-8">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                  <Brain className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-3xl font-bold mb-2">Practice Mode 🎯</h2>
                <p className="text-gray-600">Test your knowledge of saved grammar</p>
              </div>
              
              <div className="mb-8">
                <div className="flex justify-between mb-2">
                  <span>Progress</span>
                  <span>{currentPracticeIndex + 1} / {practiceScore.total}</span>
                </div>
                <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500"
                    style={{ width: `${((currentPracticeIndex + 1) / practiceScore.total) * 100}%` }}
                  ></div>
                </div>
              </div>
              
              {/* Practice Question */}
              <div className="mb-8">
                <div className={`p-6 rounded-2xl mb-6 ${
                  darkMode ? "bg-gray-800" : "bg-gray-50"
                }`}>
                  <h3 className="text-xl font-bold mb-4">What grammar pattern is this?</h3>
                  <p className="text-lg">
                    {filteredGrammar[bookmarkedItems[currentPracticeIndex] || currentPracticeIndex]?.short_explanation}
                  </p>
                </div>
                
                <input
                  type="text"
                  placeholder="Type your answer here..."
                  className={`w-full px-4 py-3 rounded-xl text-lg border ${
                    darkMode 
                      ? "bg-gray-800 border-gray-700 text-white" 
                      : "bg-white border-gray-300 text-gray-900"
                  }`}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handlePracticeAnswer(e.currentTarget.value);
                      e.currentTarget.value = '';
                    }
                  }}
                />
              </div>
              
              <div className="flex justify-between">
                <button
                  onClick={() => setShowPracticeMode(false)}
                  className={`px-6 py-3 rounded-xl font-medium ${
                    darkMode ? "bg-gray-800 hover:bg-gray-700" : "bg-gray-100 hover:bg-gray-200"
                  }`}
                >
                  Exit Practice
                </button>
                <div className="text-lg font-bold">
                  Score: {practiceScore.correct} / {practiceScore.total}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Grammar Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {filteredGrammar.map((item, idx) => {
            const isOpen = openIndex === idx;
            const isBookmarked = bookmarkedItems.includes(idx);
            const randomEmoji = getRandomJapaneseEmoji();

            return (
              <div
                key={idx}
                className={`group relative rounded-3xl overflow-hidden transition-all duration-700 hover:scale-[1.02] ${
                  isOpen ? 'lg:col-span-2' : ''
                } ${
                  darkMode
                    ? "bg-gradient-to-br from-gray-900/80 to-gray-800/80 border border-gray-800/50 backdrop-blur-xl"
                    : "bg-white/80 backdrop-blur-xl border border-white/40 shadow-xl"
                }`}
              >
                {/* Japanese Pattern Background */}
                <div className="absolute inset-0 opacity-5">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(120,119,198,0.3),transparent_50%)]"></div>
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(255,119,198,0.2),transparent_50%)]"></div>
                </div>

                {/* Card Header */}
                <div className="relative z-10 p-8">
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-6">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-4">
                        <div className={`px-4 py-2 rounded-full font-bold flex items-center gap-2 ${
                          darkMode 
                            ? "bg-gray-800 text-blue-300"
                            : "bg-blue-100 text-blue-600"
                        }`}>
                          <span className="text-lg">{randomEmoji}</span>
                          <span>N4 Grammar</span>
                        </div>
                        <div className={`px-4 py-2 rounded-full font-bold ${
                          darkMode 
                            ? "bg-gray-800 text-purple-300"
                            : getGrammarTypeColor(item.p_tag) + " text-white"
                        }`}>
                          {item.p_tag}
                        </div>
                      </div>
                      
                      <h2 className={`text-3xl font-bold mb-3 bg-gradient-to-r ${
                        darkMode 
                          ? "from-blue-300 to-purple-300" 
                          : "from-blue-600 to-purple-600"
                      } bg-clip-text text-transparent`}>
                        {item.title}
                      </h2>
                      
                      <p className={`text-lg leading-relaxed ${
                        darkMode ? "text-gray-300" : "text-gray-700"
                      }`}>
                        {item.short_explanation}
                      </p>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleBookmark(idx)}
                        className={`p-4 rounded-2xl transition-all duration-300 hover:scale-110 ${
                          isBookmarked
                            ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg"
                            : darkMode
                              ? "bg-gray-800/50 hover:bg-gray-700/50 text-gray-400 hover:text-white"
                              : "bg-white/60 hover:bg-white/80 text-gray-600 hover:text-gray-900 shadow-lg"
                        }`}
                      >
                        {isBookmarked ? (
                          <BookmarkCheck className="w-6 h-6" />
                        ) : (
                          <Bookmark className="w-6 h-6" />
                        )}
                      </button>
                      
                      <button
                        onClick={() => handlePlayAudio(item.title, idx)}
                        className={`p-4 rounded-2xl transition-all duration-300 hover:scale-110 ${
                          playingAudio === idx
                            ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg"
                            : darkMode
                              ? "bg-gray-800/50 hover:bg-gray-700/50 text-gray-400 hover:text-white"
                              : "bg-white/60 hover:bg-white/80 text-gray-600 hover:text-gray-900 shadow-lg"
                        }`}
                      >
                        {playingAudio === idx ? (
                          <Pause className="w-6 h-6" />
                        ) : (
                          <Volume2 className="w-6 h-6" />
                        )}
                      </button>
                      
                      <button
                        onClick={() => setOpenIndex(isOpen ? null : idx)}
                        className={`p-4 rounded-2xl transition-all duration-300 hover:scale-110 ${
                          isOpen
                            ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg"
                            : darkMode
                              ? "bg-gray-800/50 hover:bg-gray-700/50 text-gray-400 hover:text-white"
                              : "bg-white/60 hover:bg-white/80 text-gray-600 hover:text-gray-900 shadow-lg"
                        }`}
                      >
                        {isOpen ? (
                          <ChevronUp className="w-6 h-6" />
                        ) : (
                          <ChevronDown className="w-6 h-6" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Expanded Content */}
                {isOpen && (
                  <div className="relative z-10 px-8 pb-8 space-y-8 animate-fadeIn">
                    {/* Formation Pattern */}
                    <div className={`p-8 rounded-3xl ${
                      darkMode
                        ? "bg-gradient-to-br from-blue-900/20 to-purple-900/20 border border-blue-800/30"
                        : "bg-gradient-to-br from-blue-50/80 to-purple-50/80 border border-blue-200/60"
                    }`}>
                      <div className="flex items-center gap-4 mb-6">
                        <div className={`p-3 rounded-xl ${
                          darkMode ? "bg-blue-900/30" : "bg-blue-100"
                        }`}>
                          <Lightbulb className="w-8 h-8 text-blue-500" />
                        </div>
                        <div>
                          <h3 className={`text-2xl font-bold ${
                            darkMode ? "text-white" : "text-gray-900"
                          }`}>
                            Formation Pattern
                          </h3>
                          <p className={`text-sm ${
                            darkMode ? "text-gray-400" : "text-gray-600"
                          }`}>
                            How to construct this grammar
                          </p>
                        </div>
                      </div>
                      
                      <div className={`p-6 rounded-2xl text-lg font-mono ${
                        darkMode
                          ? "bg-gray-900/50 text-cyan-300 border border-gray-700"
                          : "bg-white text-blue-700 border border-blue-200"
                      }`}>
                        {item.formation}
                      </div>
                    </div>

                    {/* Detailed Explanation */}
                    <div>
                      <h3 className={`text-2xl font-bold mb-6 flex items-center gap-3 ${
                        darkMode ? "text-white" : "text-gray-900"
                      }`}>
                        <BookOpen className="w-8 h-8 text-blue-500" />
                        Detailed Explanation
                      </h3>
                      <div className={`p-8 rounded-3xl ${
                        darkMode
                          ? "bg-gray-900/50 border border-gray-700"
                          : "bg-white border border-gray-200 shadow-lg"
                      }`}>
                        <p className={`text-lg leading-relaxed ${
                          darkMode ? "text-gray-300" : "text-gray-700"
                        }`}>
                          {item.long_explanation}
                        </p>
                      </div>
                    </div>

                    {/* Examples */}
                    <div>
                      <div className="flex items-center justify-between mb-8">
                        <h3 className={`text-2xl font-bold flex items-center gap-3 ${
                          darkMode ? "text-white" : "text-gray-900"
                        }`}>
                          <Star className="w-8 h-8 text-amber-500" />
                          Example Sentences
                          <span className={`text-sm px-4 py-2 rounded-full ${
                            darkMode ? "bg-gray-800 text-gray-400" : "bg-amber-100 text-amber-700"
                          }`}>
                            {item.examples.length} examples
                          </span>
                        </h3>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {item.examples.map((ex, i) => (
                          <div
                            key={i}
                            className={`p-8 rounded-3xl border transition-all duration-500 hover:scale-[1.02] ${
                              darkMode
                                ? "bg-gradient-to-br from-gray-900/50 to-gray-800/50 border-gray-700 hover:border-blue-500/30"
                                : "bg-gradient-to-br from-white to-gray-50 border-gray-200 hover:border-blue-300 shadow-lg"
                            }`}
                          >
                            <div className="space-y-6">
                              {/* Japanese Sentence */}
                              <div>
                                <div className="flex items-center justify-between mb-4">
                                  <span className={`text-sm font-bold uppercase tracking-wider ${
                                    darkMode ? "text-blue-400" : "text-blue-600"
                                  }`}>
                                    Japanese
                                  </span>
                                  <div className="flex items-center gap-3">
                                    <button
                                      onClick={() => handleCopyText(ex.jp)}
                                      className={`p-3 rounded-xl ${
                                        darkMode ? "hover:bg-gray-800" : "hover:bg-gray-100"
                                      }`}
                                      title="Copy to clipboard"
                                    >
                                      {copiedText === ex.jp ? (
                                        <Check className="w-5 h-5 text-green-500" />
                                      ) : (
                                        <Copy className="w-5 h-5" />
                                      )}
                                    </button>
                                    <button
                                      onClick={() => handlePlayAudio(ex.jp, idx * 100 + i)}
                                      className={`p-3 rounded-xl ${
                                        darkMode ? "hover:bg-gray-800" : "hover:bg-gray-100"
                                      } ${playingAudio === idx * 100 + i ? 'bg-blue-500/20' : ''}`}
                                    >
                                      {playingAudio === idx * 100 + i ? (
                                        <Pause className="w-5 h-5 text-blue-500" />
                                      ) : (
                                        <Volume2 className="w-5 h-5 text-blue-500" />
                                      )}
                                    </button>
                                  </div>
                                </div>
                                <p className={`text-2xl font-medium leading-relaxed ${
                                  darkMode ? "text-white" : "text-gray-900"
                                }`}>
                                  {ex.jp}
                                </p>
                              </div>

                              {/* Romaji */}
                              <div className={`p-4 rounded-2xl ${
                                darkMode ? "bg-gray-900/30" : "bg-gray-50"
                              }`}>
                                <span className={`text-xs font-bold uppercase tracking-wider block mb-2 ${
                                  darkMode ? "text-gray-400" : "text-gray-500"
                                }`}>
                                  Romaji
                                </span>
                                <p className={`text-lg italic ${
                                  darkMode ? "text-gray-400" : "text-gray-600"
                                }`}>
                                  {ex.romaji}
                                </p>
                              </div>

                              {/* English Translation */}
                              <div>
                                <span className={`text-xs font-bold uppercase tracking-wider block mb-2 ${
                                  darkMode ? "text-emerald-400" : "text-emerald-600"
                                }`}>
                                  English Translation
                                </span>
                                <p className={`text-lg leading-relaxed ${
                                  darkMode ? "text-gray-300" : "text-gray-700"
                                }`}>
                                  {ex.en}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Practice Challenge */}
                    <div className={`p-8 rounded-3xl ${
                      darkMode
                        ? "bg-gradient-to-br from-emerald-900/20 to-teal-900/20 border border-emerald-800/30"
                        : "bg-gradient-to-br from-emerald-50/80 to-teal-50/80 border border-emerald-200/60"
                    }`}>
                      <div className="flex items-center gap-4 mb-6">
                        <div className={`p-3 rounded-xl ${
                          darkMode ? "bg-emerald-900/30" : "bg-emerald-100"
                        }`}>
                          <Zap className="w-8 h-8 text-emerald-500" />
                        </div>
                        <div>
                          <h3 className={`text-2xl font-bold ${
                            darkMode ? "text-white" : "text-gray-900"
                          }`}>
                            Practice Challenge
                          </h3>
                          <p className={`text-sm ${
                            darkMode ? "text-gray-400" : "text-gray-600"
                          }`}>
                            Test your understanding
                          </p>
                        </div>
                      </div>
                      
                      <div className={`p-6 rounded-2xl ${
                        darkMode ? "bg-gray-900/30" : "bg-white"
                      }`}>
                        <p className={`text-lg mb-4 ${
                          darkMode ? "text-gray-300" : "text-gray-700"
                        }`}>
                          Try creating your own sentence using <span className="font-bold text-blue-500">{item.title}</span>:
                        </p>
                        <textarea
                          className={`w-full px-4 py-3 rounded-xl text-lg border resize-none ${
                            darkMode 
                              ? "bg-gray-800 border-gray-700 text-white" 
                              : "bg-gray-50 border-gray-300 text-gray-900"
                          }`}
                          placeholder="Type your Japanese sentence here..."
                          rows={3}
                        ></textarea>
                        <div className="flex justify-end mt-4">
                          <button className={`px-6 py-3 rounded-xl font-medium ${
                            darkMode 
                              ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white" 
                              : "bg-gradient-to-r from-emerald-500 to-teal-500 text-white"
                          }`}>
                            Submit Practice
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Animated Border */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-1000 origin-left"></div>
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredGrammar.length === 0 && (
          <div className={`text-center py-20 rounded-3xl backdrop-blur-xl ${
            darkMode
              ? "bg-gray-900/50 border border-gray-800"
              : "bg-white/80 border border-white/40 shadow-2xl"
          }`}>
            <div className="w-32 h-32 mx-auto mb-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center animate-bounce">
              <Flower className="w-16 h-16 text-white" />
            </div>
            <h3 className={`text-4xl font-bold mb-4 ${
              darkMode ? "text-white" : "text-gray-900"
            }`}>
              No grammar found 🎌
            </h3>
            <p className={`text-xl mb-8 max-w-2xl mx-auto ${
              darkMode ? "text-gray-400" : "text-gray-600"
            }`}>
              Try a different search term or explore all grammar points
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => setSearch('')}
                className={`px-8 py-4 rounded-xl text-lg font-medium ${
                  darkMode
                    ? "bg-gray-800 hover:bg-gray-700"
                    : "bg-white hover:bg-gray-50 shadow-lg"
                }`}
              >
                Clear Search
              </button>
              <button
                onClick={() => setActiveFilter('all')}
                className="px-8 py-4 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 text-white text-lg font-medium hover:from-blue-600 hover:to-purple-600 shadow-lg"
              >
                Show All Grammar Points
              </button>
            </div>
          </div>
        )}

        {/* Footer Stats */}
        <div className={`mt-16 pt-8 border-t ${
          darkMode ? "border-gray-800" : "border-gray-200"
        }`}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className={`text-3xl font-bold mb-2 ${
                darkMode ? "text-blue-400" : "text-blue-600"
              }`}>
                {grammarList.length}
              </div>
              <div className={`text-sm ${
                darkMode ? "text-gray-400" : "text-gray-600"
              }`}>
                Total Grammar Points
              </div>
            </div>
            <div className="text-center">
              <div className={`text-3xl font-bold mb-2 ${
                darkMode ? "text-emerald-400" : "text-emerald-600"
              }`}>
                {bookmarkedItems.length}
              </div>
              <div className={`text-sm ${
                darkMode ? "text-gray-400" : "text-gray-600"
              }`}>
                Saved for Review
              </div>
            </div>
            <div className="text-center">
              <div className={`text-3xl font-bold mb-2 ${
                darkMode ? "text-amber-400" : "text-amber-600"
              }`}>
                {stats.mastery}%
              </div>
              <div className={`text-sm ${
                darkMode ? "text-gray-400" : "text-gray-600"
              }`}>
                Learning Progress
              </div>
            </div>
            <div className="text-center">
              <div className={`text-3xl font-bold mb-2 ${
                darkMode ? "text-purple-400" : "text-purple-600"
              }`}>
                {stats.practiced}
              </div>
              <div className={`text-sm ${
                darkMode ? "text-gray-400" : "text-gray-600"
              }`}>
                Practice Sessions
              </div>
            </div>
          </div>
          
          <div className="mt-8 text-center">
            <p className={`text-sm ${
              darkMode ? "text-gray-500" : "text-gray-600"
            }`}>
              🇯🇵 Keep practicing! Each day brings you closer to Japanese fluency. 
              <span className="mx-2">•</span>
              Click <Bookmark className="w-3 h-3 inline ml-1" /> to save grammar
              <span className="mx-2">•</span>
              Click <Volume2 className="w-3 h-3 inline ml-1" /> to hear pronunciation
            </p>
          </div>
        </div>
      </div>

      {/* Floating Action Button */}
      <button
        onClick={() => setOpenIndex(Math.floor(Math.random() * grammarList.length))}
        className={`fixed bottom-8 right-8 p-5 rounded-full shadow-2xl z-40 hover:scale-110 transition-all duration-300 ${
          darkMode
            ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white"
            : "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
        }`}
      >
        <Sparkles className="w-6 h-6" />
      </button>

      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        
        .animate-blob {
          animation: blob 7s infinite;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
        
        @keyframes fadeIn {
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
    </main>
  );
};

export default GrammarN4Page;