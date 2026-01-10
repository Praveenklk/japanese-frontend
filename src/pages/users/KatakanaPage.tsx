// pages/KatakanaPage.tsx
import { useEffect, useState } from "react";
import { type Katakana, getAllKatakana, markKatakanaAsRead } from "../../service/katakana.service";
import { Speaker, Volume2, Lightbulb, Search, Filter, CheckCircle, Bookmark, Loader2, X, Menu, Grid, BookOpen } from "lucide-react";

const KatakanaPage = () => {
  const [katakanaList, setKatakanaList] = useState<Katakana[]>([]);
  const [filteredList, setFilteredList] = useState<Katakana[]>([]);
  const [selectedChar, setSelectedChar] = useState<Katakana | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<
    "all" | "basic" | "vowels" | "tenten" | "maru" | "combinations"
  >("all");
  const [learnedChars, setLearnedChars] = useState<string[]>([]);
  const [showDetails, setShowDetails] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "chart">("grid");
  const [isLoading, setIsLoading] = useState(true);
  const [updatingChar, setUpdatingChar] = useState<string | null>(null);

  useEffect(() => {
    fetchKatakana();
  }, []);

  useEffect(() => {
    filterKatakana();
  }, [katakanaList, searchTerm, filterType]);

  const fetchKatakana = async () => {
    try {
      setIsLoading(true);
      const response = await getAllKatakana();
      
      // Sort katakana similar to hiragana
      const sortedKatakana = response.data.sort((a, b) => {
        const getCategory = (char: Katakana) => {
          if (char.symbol.length === 1 && 
              !char.symbol.includes("゛") && 
              !char.symbol.includes("゜") && 
              !["ャ", "ュ", "ョ", "ァ", "ィ", "ゥ", "ェ", "ォ"].includes(char.symbol)) {
            return "basic";
          } else if (char.symbol.includes("゛")) {
            return "tenten";
          } else if (char.symbol.includes("゜")) {
            return "maru";
          } else {
            return "combinations";
          }
        };
        
        const categoryOrder = { basic: 1, tenten: 2, maru: 3, combinations: 4 };
        const categoryA = getCategory(a);
        const categoryB = getCategory(b);
        
        if (categoryOrder[categoryA] !== categoryOrder[categoryB]) {
          return categoryOrder[categoryA] - categoryOrder[categoryB];
        }
        return a.symbol.localeCompare(b.symbol);
      });
      
      setKatakanaList(sortedKatakana);
      
      // Load learned characters from API (isRead: true)
      const learned = sortedKatakana.filter(char => char.isRead).map(char => char.id);
      setLearnedChars(learned);
    } catch (error) {
      console.error("Error fetching katakana:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterKatakana = () => {
    let filtered = [...katakanaList];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (char) =>
          char.symbol.includes(searchTerm) ||
          char.romaji.toLowerCase().includes(searchTerm.toLowerCase()) ||
          char.explanation.toLowerCase().includes(searchTerm.toLowerCase()) ||
          char.example?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Category filter
    if (filterType !== "all") {
      filtered = filtered.filter((char) => {
        if (filterType === "vowels") {
          return ["ア", "イ", "ウ", "エ", "オ"].includes(char.symbol);
        } else if (filterType === "basic") {
          return char.symbol.length === 1 && 
                 !char.symbol.includes("゛") && 
                 !char.symbol.includes("゜") && 
                 !["ャ", "ュ", "ョ", "ァ", "ィ", "ゥ", "ェ", "ォ"].includes(char.symbol);
        } else if (filterType === "tenten") {
          return char.symbol.includes("゛") || 
                 ["ガ", "ギ", "グ", "ゲ", "ゴ", "ザ", "ジ", "ズ", "ゼ", "ゾ", "ダ", "ヂ", "ヅ", "デ", "ド", "バ", "ビ", "ブ", "ベ", "ボ"].includes(char.symbol);
        } else if (filterType === "maru") {
          return char.symbol.includes("゜") || 
                 ["パ", "ピ", "プ", "ペ", "ポ"].includes(char.symbol);
        } else if (filterType === "combinations") {
          return char.symbol.length > 1 || 
                 ["ャ", "ュ", "ョ", "ァ", "ィ", "ゥ", "ェ", "ォ"].includes(char.symbol);
        }
        return true;
      });
    }

    setFilteredList(filtered);
  };

  const toggleLearned = async (characterId: string, symbol: string) => {
    try {
      setUpdatingChar(characterId);
      const isCurrentlyLearned = learnedChars.includes(characterId);
      
      // Update in API
      await markKatakanaAsRead(characterId, !isCurrentlyLearned);
      
      // Update local state
      const newLearned = isCurrentlyLearned
        ? learnedChars.filter((id) => id !== characterId)
        : [...learnedChars, characterId];
      
      setLearnedChars(newLearned);
      
      // Update katakanaList with new isRead status
      setKatakanaList(prev => prev.map(char => 
        char.id === characterId ? { ...char, isRead: !isCurrentlyLearned } : char
      ));
      
      // Update selected char if it's the same
      if (selectedChar?.id === characterId) {
        setSelectedChar(prev => prev ? { ...prev, isRead: !isCurrentlyLearned } : null);
      }
      
    } catch (error) {
      console.error("Error updating learned status:", error);
      alert("Failed to update learning status. Please try again.");
    } finally {
      setUpdatingChar(null);
    }
  };

  const playAudio = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "ja-JP";
    utterance.rate = 0.8;
    utterance.pitch = 1.0;
    speechSynthesis.speak(utterance);
  };

  const getProgress = () => {
    if (katakanaList.length === 0) return 0;
    return Math.round((learnedChars.length / katakanaList.length) * 100);
  };

  const groupByCategory = () => {
    const categories = [
      {
        title: "Basic Katakana",
        description: "Standard katakana characters",
        chars: katakanaList.filter(char => 
          char.symbol.length === 1 && 
          !char.symbol.includes("゛") && 
          !char.symbol.includes("゜") && 
          !["ャ", "ュ", "ョ", "ァ", "ィ", "ゥ", "ェ", "ォ"].includes(char.symbol)
        )
      },
      {
        title: "Dakuten (Tenten ゛)",
        description: "Characters with dakuten mark",
        chars: katakanaList.filter(char => 
          char.symbol.includes("゛") || 
          ["ガ", "ギ", "グ", "ゲ", "ゴ", "ザ", "ジ", "ズ", "ゼ", "ゾ", "ダ", "ヂ", "ヅ", "デ", "ド", "バ", "ビ", "ブ", "ベ", "ボ"].includes(char.symbol)
        )
      },
      {
        title: "Handakuten (Maru ゜)",
        description: "Characters with handakuten mark",
        chars: katakanaList.filter(char => 
          char.symbol.includes("゜") || 
          ["パ", "ピ", "プ", "ペ", "ポ"].includes(char.symbol)
        )
      },
      {
        title: "Combinations",
        description: "Contracted sounds (ャ, ュ, ョ)",
        chars: katakanaList.filter(char => 
          char.symbol.length > 1 || 
          ["ャ", "ュ", "ョ", "ァ", "ィ", "ゥ", "ェ", "ォ"].includes(char.symbol)
        )
      }
    ];
    
    return categories.filter(category => category.chars.length > 0);
  };

  const getCategoryIcon = (category: string) => {
    switch(category) {
      case "basic": return "🅰️";
      case "tenten": return "゛";
      case "maru": return "゜";
      case "combinations": return "ャ";
      default: return "🔤";
    }
  };

  const getCategoryColor = (category: string) => {
    switch(category) {
      case "basic": return "bg-blue-100 text-blue-800 border-blue-300";
      case "tenten": return "bg-green-100 text-green-800 border-green-300";
      case "maru": return "bg-purple-100 text-purple-800 border-purple-300";
      case "combinations": return "bg-orange-100 text-orange-800 border-orange-300";
      default: return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const groupByRow = () => {
    const basicRows = [
      { title: "Vowels (ア行)", chars: ["ア", "イ", "ウ", "エ", "オ"], color: "bg-red-50 border-red-200" },
      { title: "K-row (カ行)", chars: ["カ", "キ", "ク", "ケ", "コ"], color: "bg-orange-50 border-orange-200" },
      { title: "S-row (サ行)", chars: ["サ", "シ", "ス", "セ", "ソ"], color: "bg-amber-50 border-amber-200" },
      { title: "T-row (タ行)", chars: ["タ", "チ", "ツ", "テ", "ト"], color: "bg-yellow-50 border-yellow-200" },
      { title: "N-row (ナ行)", chars: ["ナ", "ニ", "ヌ", "ネ", "ノ"], color: "bg-lime-50 border-lime-200" },
      { title: "H-row (ハ行)", chars: ["ハ", "ヒ", "フ", "ヘ", "ホ"], color: "bg-green-50 border-green-200" },
      { title: "M-row (マ行)", chars: ["マ", "ミ", "ム", "メ", "モ"], color: "bg-emerald-50 border-emerald-200" },
      { title: "Y-row (ヤ行)", chars: ["ヤ", "ユ", "ヨ"], color: "bg-teal-50 border-teal-200" },
      { title: "R-row (ラ行)", chars: ["ラ", "リ", "ル", "レ", "ロ"], color: "bg-cyan-50 border-cyan-200" },
      { title: "W-row (ワ行)", chars: ["ワ", "ヲ", "ン"], color: "bg-blue-50 border-blue-200" },
    ];

    const tentenRows = [
      { title: "G-row (ガ行)", chars: ["ガ", "ギ", "グ", "ゲ", "ゴ"], color: "bg-green-50 border-green-200" },
      { title: "Z-row (ザ行)", chars: ["ザ", "ジ", "ズ", "ゼ", "ゾ"], color: "bg-emerald-50 border-emerald-200" },
      { title: "D-row (ダ行)", chars: ["ダ", "ヂ", "ヅ", "デ", "ド"], color: "bg-teal-50 border-teal-200" },
      { title: "B-row (バ行)", chars: ["バ", "ビ", "ブ", "ベ", "ボ"], color: "bg-cyan-50 border-cyan-200" },
    ];

    const maruRows = [
      { title: "P-row (パ行)", chars: ["パ", "ピ", "プ", "ペ", "ポ"], color: "bg-purple-50 border-purple-200" },
    ];

    const combinationRows = [
      { title: "KY-row (キャ行)", chars: ["キャ", "キュ", "キョ"], color: "bg-orange-50 border-orange-200" },
      { title: "SH-row (シャ行)", chars: ["シャ", "シュ", "ショ"], color: "bg-pink-50 border-pink-200" },
      { title: "CH-row (チャ行)", chars: ["チャ", "チュ", "チョ"], color: "bg-rose-50 border-rose-200" },
      { title: "NY-row (ニャ行)", chars: ["ニャ", "ニュ", "ニョ"], color: "bg-yellow-50 border-yellow-200" },
      { title: "HY-row (ヒャ行)", chars: ["ヒャ", "ヒュ", "ヒョ"], color: "bg-green-50 border-green-200" },
      { title: "MY-row (ミャ行)", chars: ["ミャ", "ミュ", "ミョ"], color: "bg-emerald-50 border-emerald-200" },
      { title: "RY-row (リャ行)", chars: ["リャ", "リュ", "リョ"], color: "bg-cyan-50 border-cyan-200" },
      { title: "GY-row (ギャ行)", chars: ["ギャ", "ギュ", "ギョ"], color: "bg-green-50 border-green-200" },
      { title: "J-row (ジャ行)", chars: ["ジャ", "ジュ", "ジョ"], color: "bg-teal-50 border-teal-200" },
      { title: "BY-row (ビャ行)", chars: ["ビャ", "ビュ", "ビョ"], color: "bg-blue-50 border-blue-200" },
      { title: "PY-row (ピャ行)", chars: ["ピャ", "ピュ", "ピョ"], color: "bg-purple-50 border-purple-200" },
    ];

    return { basicRows, tentenRows, maruRows, combinationRows };
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="text-center space-y-6">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-3xl">カ</span>
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Loading Katakana</h2>
            <p className="text-gray-600 mt-2">Fetching Japanese characters...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-blue-600">
                <span className="text-4xl">カタカナ</span> Katakana Master
              </h1>
              <p className="text-gray-600">Complete katakana learning with dakuten, handakuten, and combinations</p>
            </div>
            
            {/* Progress Bar */}
            <div className="w-full md:w-64">
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>Progress</span>
                <span>{getProgress()}%</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-green-500 to-emerald-500 transition-all duration-500"
                  style={{ width: `${getProgress()}%` }}
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {learnedChars.length} of {katakanaList.length} characters learned
              </p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Character Grid */}
          <div className="lg:col-span-2">
            {/* Search and Filters */}
            <div className="mb-8 space-y-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search katakana, romaji, or explanation..."
                    className="w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-300"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {["all", "basic", "vowels", "tenten", "maru", "combinations"].map((type) => (
                    <button
                      key={type}
                      className={`px-4 py-2 rounded-lg whitespace-nowrap transition flex items-center gap-2 ${
                        filterType === type
                          ? "bg-blue-600 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                      onClick={() => setFilterType(type as any)}
                    >
                      <span>{getCategoryIcon(type)}</span>
                      <span>
                        {type === "all" ? "All" : 
                         type === "basic" ? "Basic" :
                         type === "vowels" ? "Vowels" :
                         type === "tenten" ? "Dakuten" :
                         type === "maru" ? "Handakuten" : "Combinations"}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Quick Stats */}
              <div className="flex flex-wrap gap-4">
                <div className="px-4 py-2 bg-blue-50 rounded-lg">
                  <p className="text-sm text-gray-600">Total Characters</p>
                  <p className="text-2xl font-bold text-blue-600">{katakanaList.length}</p>
                </div>
                <div className="px-4 py-2 bg-green-50 rounded-lg">
                  <p className="text-sm text-gray-600">Learned</p>
                  <p className="text-2xl font-bold text-green-600">{learnedChars.length}</p>
                </div>
                <div className="px-4 py-2 bg-purple-50 rounded-lg">
                  <p className="text-sm text-gray-600">Remaining</p>
                  <p className="text-2xl font-bold text-purple-600">{katakanaList.length - learnedChars.length}</p>
                </div>
                <div className="px-4 py-2 bg-orange-50 rounded-lg">
                  <p className="text-sm text-gray-600">Mastery</p>
                  <p className="text-2xl font-bold text-orange-600">{getProgress()}%</p>
                </div>
              </div>

              {/* View Mode Toggle */}
              <div className="flex justify-end">
                <div className="flex bg-gray-100 p-1 rounded-lg">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`px-4 py-2 rounded-md transition flex items-center gap-2 ${
                      viewMode === "grid" ? "bg-white shadow" : "hover:bg-gray-200"
                    }`}
                  >
                    <Grid className="w-5 h-5" />
                    <span className="hidden sm:inline">Grid</span>
                  </button>
                  <button
                    onClick={() => setViewMode("chart")}
                    className={`px-4 py-2 rounded-md transition flex items-center gap-2 ${
                      viewMode === "chart" ? "bg-white shadow" : "hover:bg-gray-200"
                    }`}
                  >
                    <BookOpen className="w-5 h-5" />
                    <span className="hidden sm:inline">Chart</span>
                  </button>
                </div>
              </div>

              {/* Category Navigation */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {groupByCategory().map((category) => (
                  <div 
                    key={category.title}
                    className={`p-3 rounded-xl border-2 cursor-pointer hover:shadow-md transition-all ${
                      filterType === category.title.toLowerCase().includes("dakuten") ? "tenten" :
                      filterType === category.title.toLowerCase().includes("handakuten") ? "maru" :
                      filterType === category.title.toLowerCase().includes("combination") ? "combinations" :
                      filterType === category.title.toLowerCase().includes("basic") ? "basic" : ""
                    } === category.title.toLowerCase().includes("dakuten") ? "tenten" :
                      category.title.toLowerCase().includes("handakuten") ? "maru" :
                      category.title.toLowerCase().includes("combination") ? "combinations" :
                      category.title.toLowerCase().includes("basic") ? "basic" : "" ? 
                      "ring-2 ring-blue-500" : ""} ${getCategoryColor(
                        category.title.toLowerCase().includes("dakuten") ? "tenten" :
                        category.title.toLowerCase().includes("handakuten") ? "maru" :
                        category.title.toLowerCase().includes("combination") ? "combinations" :
                        "basic"
                      )}`}
                    onClick={() => {
                      const filter = 
                        category.title.toLowerCase().includes("dakuten") ? "tenten" :
                        category.title.toLowerCase().includes("handakuten") ? "maru" :
                        category.title.toLowerCase().includes("combination") ? "combinations" : "basic";
                      setFilterType(filter as any);
                    }}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold">{category.title.split(" ")[0]}</h4>
                        <p className="text-xs text-gray-600 mt-1">{category.description}</p>
                      </div>
                      <span className="text-2xl">
                        {category.title.toLowerCase().includes("dakuten") ? "゛" :
                         category.title.toLowerCase().includes("handakuten") ? "゜" :
                         category.title.toLowerCase().includes("combination") ? "ャ" : "カ"}
                      </span>
                    </div>
                    <div className="mt-2 flex justify-between text-sm">
                      <span>{category.chars.length} chars</span>
                      <span className="text-green-600">
                        {Math.round((category.chars.filter(c => learnedChars.includes(c.id)).length / category.chars.length) * 100)}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Content based on view mode */}
            {viewMode === "grid" ? (
              /* Grid View */
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {filteredList.map((char) => (
                  <div
                    key={char.id}
                    className={`relative bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer border-2 ${
                      selectedChar?.id === char.id
                        ? "border-blue-500"
                        : "border-transparent"
                    } ${learnedChars.includes(char.id) ? "ring-2 ring-green-200" : ""}`}
                    onClick={() => {
                      setSelectedChar(char);
                      setShowDetails(true);
                    }}
                  >
                    {/* Learned Badge */}
                    {learnedChars.includes(char.id) && (
                      <div className="absolute -top-2 -right-2 bg-green-500 text-white p-1 rounded-full z-10">
                        <CheckCircle className="w-5 h-5" />
                      </div>
                    )}
                    
                    {/* Category Indicator */}
                    <div className="absolute -top-2 -left-2">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        char.symbol.includes("゛") ? "bg-green-100 text-green-800" :
                        char.symbol.includes("゜") ? "bg-purple-100 text-purple-800" :
                        char.symbol.length > 1 || ["ャ", "ュ", "ョ", "ァ", "ィ", "ゥ", "ェ", "ォ"].includes(char.symbol) ? 
                        "bg-orange-100 text-orange-800" : "bg-blue-100 text-blue-800"
                      }`}>
                        {char.symbol.includes("゛") ? "゛" :
                         char.symbol.includes("゜") ? "゜" :
                         char.symbol.length > 1 ? "ャ" : "カ"}
                      </span>
                    </div>
                    
                    <div className="p-6 text-center">
                      <div className="text-5xl font-bold mb-3">{char.symbol}</div>
                      <div className="text-2xl font-mono text-gray-700 mb-2">{char.romaji}</div>
                      <p className="text-sm text-gray-600 line-clamp-2 h-10">{char.explanation}</p>
                      
                      <div className="mt-4 flex justify-center space-x-2">
                        <button
                          className="p-2 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200 transition disabled:opacity-50"
                          onClick={(e) => {
                            e.stopPropagation();
                            playAudio(char.symbol);
                          }}
                          title="Listen to character"
                          disabled={updatingChar === char.id}
                        >
                          <Speaker className="w-4 h-4" />
                        </button>
                        <button
                          className="p-2 bg-purple-100 text-purple-600 rounded-full hover:bg-purple-200 transition disabled:opacity-50"
                          onClick={(e) => {
                            e.stopPropagation();
                            playAudio(char.example?.split(" ")[0] || char.symbol);
                          }}
                          title="Listen to example"
                          disabled={updatingChar === char.id}
                        >
                          <Volume2 className="w-4 h-4" />
                        </button>
                        <button
                          className={`p-2 rounded-full transition disabled:opacity-50 relative ${
                            learnedChars.includes(char.id)
                              ? "bg-green-100 text-green-600 hover:bg-green-200"
                              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                          }`}
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleLearned(char.id, char.symbol);
                          }}
                          title={learnedChars.includes(char.id) ? "Mark as unlearned" : "Mark as learned"}
                          disabled={updatingChar === char.id}
                        >
                          {updatingChar === char.id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Bookmark className={`w-4 h-4 ${learnedChars.includes(char.id) ? 'fill-green-600' : ''}`} />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              /* Chart View */
              <div className="space-y-8">
                {/* Basic Katakana */}
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-gray-800 border-b pb-2">Basic Katakana</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {groupByRow().basicRows.map((row) => (
                      <div key={row.title} className={`p-4 rounded-xl border ${row.color}`}>
                        <h4 className="font-bold text-gray-800 mb-3">{row.title}</h4>
                        <div className="grid grid-cols-5 gap-2">
                          {row.chars.map((symbol) => {
                            const char = katakanaList.find(c => c.symbol === symbol);
                            if (!char) return null;
                            
                            return (
                              <div
                                key={symbol}
                                className={`bg-white rounded-lg shadow-sm hover:shadow-md transition-all cursor-pointer p-3 relative ${
                                  learnedChars.includes(char.id) ? "ring-2 ring-green-300" : ""
                                }`}
                                onClick={() => {
                                  setSelectedChar(char);
                                  setShowDetails(true);
                                }}
                              >
                                <div className="text-3xl font-bold text-center mb-1">{symbol}</div>
                                <div className="text-center text-sm text-gray-600">{char.romaji}</div>
                                {learnedChars.includes(char.id) && (
                                  <div className="absolute -top-1 -right-1">
                                    <CheckCircle className="w-4 h-4 text-green-500" />
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Dakuten (Tenten) */}
                {groupByRow().tentenRows.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold text-gray-800 border-b pb-2">Dakuten (゛)</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
                      {groupByRow().tentenRows.map((row) => (
                        <div key={row.title} className={`p-4 rounded-xl border ${row.color}`}>
                          <h4 className="font-bold text-gray-800 mb-3">{row.title}</h4>
                          <div className="grid grid-cols-5 gap-2">
                            {row.chars.map((symbol) => {
                              const char = katakanaList.find(c => c.symbol === symbol);
                              if (!char) return null;
                              
                              return (
                                <div
                                  key={symbol}
                                  className={`bg-white rounded-lg shadow-sm hover:shadow-md transition-all cursor-pointer p-3 relative ${
                                    learnedChars.includes(char.id) ? "ring-2 ring-green-300" : ""
                                  }`}
                                  onClick={() => {
                                    setSelectedChar(char);
                                    setShowDetails(true);
                                  }}
                                >
                                  <div className="text-3xl font-bold text-center mb-1">{symbol}</div>
                                  <div className="text-center text-sm text-gray-600">{char.romaji}</div>
                                  {learnedChars.includes(char.id) && (
                                    <div className="absolute -top-1 -right-1">
                                      <CheckCircle className="w-4 h-4 text-green-500" />
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Handakuten (Maru) */}
                {groupByRow().maruRows.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold text-gray-800 border-b pb-2">Handakuten (゜)</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
                      {groupByRow().maruRows.map((row) => (
                        <div key={row.title} className={`p-4 rounded-xl border ${row.color}`}>
                          <h4 className="font-bold text-gray-800 mb-3">{row.title}</h4>
                          <div className="grid grid-cols-5 gap-2">
                            {row.chars.map((symbol) => {
                              const char = katakanaList.find(c => c.symbol === symbol);
                              if (!char) return null;
                              
                              return (
                                <div
                                  key={symbol}
                                  className={`bg-white rounded-lg shadow-sm hover:shadow-md transition-all cursor-pointer p-3 relative ${
                                    learnedChars.includes(char.id) ? "ring-2 ring-green-300" : ""
                                  }`}
                                  onClick={() => {
                                    setSelectedChar(char);
                                    setShowDetails(true);
                                  }}
                                >
                                  <div className="text-3xl font-bold text-center mb-1">{symbol}</div>
                                  <div className="text-center text-sm text-gray-600">{char.romaji}</div>
                                  {learnedChars.includes(char.id) && (
                                    <div className="absolute -top-1 -right-1">
                                      <CheckCircle className="w-4 h-4 text-green-500" />
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Combinations */}
                {groupByRow().combinationRows.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold text-gray-800 border-b pb-2">Combinations (ャ, ュ, ョ)</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {groupByRow().combinationRows.map((row) => (
                        <div key={row.title} className={`p-4 rounded-xl border ${row.color}`}>
                          <h4 className="font-bold text-gray-800 mb-3">{row.title}</h4>
                          <div className="grid grid-cols-3 gap-2">
                            {row.chars.map((symbol) => {
                              const char = katakanaList.find(c => c.symbol === symbol);
                              if (!char) return null;
                              
                              return (
                                <div
                                  key={symbol}
                                  className={`bg-white rounded-lg shadow-sm hover:shadow-md transition-all cursor-pointer p-3 relative ${
                                    learnedChars.includes(char.id) ? "ring-2 ring-green-300" : ""
                                  }`}
                                  onClick={() => {
                                    setSelectedChar(char);
                                    setShowDetails(true);
                                  }}
                                >
                                  <div className="text-3xl font-bold text-center mb-1">{symbol}</div>
                                  <div className="text-center text-sm text-gray-600">{char.romaji}</div>
                                  {learnedChars.includes(char.id) && (
                                    <div className="absolute -top-1 -right-1">
                                      <CheckCircle className="w-4 h-4 text-green-500" />
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Empty State */}
            {filteredList.length === 0 && (
              <div className="text-center py-12">
                <div className="text-5xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No characters found</h3>
                <p className="text-gray-500">Try a different search term or filter</p>
              </div>
            )}
          </div>

          {/* Right Column - Details Panel */}
          <div className="lg:col-span-1">
            <div className={`sticky top-24 ${showDetails ? "" : "lg:hidden"}`}>
              {selectedChar ? (
                <div className="bg-white rounded-2xl shadow-lg border overflow-hidden">
                  {/* Header */}
                  <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-6 text-white">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="text-6xl font-bold mb-2">{selectedChar.symbol}</div>
                        <div className="text-3xl font-mono">{selectedChar.romaji}</div>
                        <div className="flex items-center gap-2 mt-2">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            selectedChar.symbol.includes("゛") ? "bg-green-500/30" :
                            selectedChar.symbol.includes("゜") ? "bg-purple-500/30" :
                            selectedChar.symbol.length > 1 ? "bg-orange-500/30" : "bg-blue-500/30"
                          }`}>
                            {selectedChar.symbol.includes("゛") ? "Dakuten (゛)" :
                             selectedChar.symbol.includes("゜") ? "Handakuten (゜)" :
                             selectedChar.symbol.length > 1 ? "Combination" : "Basic"}
                          </span>
                          {selectedChar.isRead && (
                            <span className="px-2 py-1 bg-green-500/30 rounded-full text-xs">
                              ✓ Learned
                            </span>
                          )}
                        </div>
                      </div>
                      <button
                        className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition"
                        onClick={() => playAudio(selectedChar.symbol)}
                      >
                        <Speaker className="w-6 h-6" />
                      </button>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    {/* Memory Tip */}
                    <div className="mb-6">
                      <div className="flex items-center gap-2 mb-3">
                        <Lightbulb className="w-5 h-5 text-yellow-500" />
                        <h3 className="font-semibold text-gray-800">Memory Tip</h3>
                      </div>
                      <p className="text-gray-700 bg-yellow-50 p-4 rounded-lg">
                        {selectedChar.explanation}
                      </p>
                    </div>

                    {/* Example */}
                    <div className="mb-6">
                      <h3 className="font-semibold text-gray-800 mb-2">Example Word</h3>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-2xl font-bold">
                              {selectedChar.example?.split(" ")[0] || selectedChar.symbol}
                            </div>
                            <div className="text-gray-600">
                              {selectedChar.example?.split("—")[1]?.trim() || "Japanese word example"}
                            </div>
                          </div>
                          <button
                            className="p-2 bg-purple-100 text-purple-600 rounded-full hover:bg-purple-200 transition"
                            onClick={() => playAudio(selectedChar.example?.split(" ")[0] || selectedChar.symbol)}
                          >
                            <Volume2 className="w-5 h-5" />
                          </button>
                        </div>
                        {selectedChar.example && (
                          <div className="mt-2 text-sm text-gray-500">
                            {selectedChar.example}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Practice Button */}
                    <button
                      className={`w-full py-3 rounded-lg font-semibold transition flex items-center justify-center gap-2 ${
                        selectedChar.isRead
                          ? "bg-green-100 text-green-700 hover:bg-green-200"
                          : "bg-blue-100 text-blue-700 hover:bg-blue-200"
                      }`}
                      onClick={() => toggleLearned(selectedChar.id, selectedChar.symbol)}
                      disabled={updatingChar === selectedChar.id}
                    >
                      {updatingChar === selectedChar.id ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Updating...
                        </>
                      ) : selectedChar.isRead ? (
                        <>
                          <CheckCircle className="w-5 h-5" />
                          ✓ Marked as Learned
                        </>
                      ) : (
                        <>
                          <Bookmark className="w-5 h-5" />
                          Mark as Learned
                        </>
                      )}
                    </button>

                    {/* Character Info */}
                    <div className="mt-6 pt-6 border-t">
                      <h3 className="font-semibold text-gray-800 mb-3">Character Info</h3>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <div className="text-xs text-gray-500">Type</div>
                          <div className="font-medium">
                            {selectedChar.symbol.includes("゛") ? "Dakuten" :
                             selectedChar.symbol.includes("゜") ? "Handakuten" :
                             selectedChar.symbol.length > 1 ? "Combination" : "Basic"}
                          </div>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <div className="text-xs text-gray-500">Romaji</div>
                          <div className="font-mono font-medium">{selectedChar.romaji}</div>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <div className="text-xs text-gray-500">Stroke Count</div>
                          <div className="font-medium">Varies</div>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <div className="text-xs text-gray-500">Status</div>
                          <div className={`font-medium ${selectedChar.isRead ? 'text-green-600' : 'text-yellow-600'}`}>
                            {selectedChar.isRead ? 'Learned' : 'To Learn'}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-2xl shadow-lg border p-8 text-center">
                  <div className="text-6xl mb-4">👈</div>
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">Select a Character</h3>
                  <p className="text-gray-500">Click on any katakana character to see details and learning tips</p>
                  <div className="mt-6">
                    <div className="text-4xl font-bold text-blue-500 animate-pulse">カ</div>
                  </div>
                </div>
              )}

              {/* Katakana Categories Reference */}
              {/* <div className="mt-6 bg-white rounded-2xl shadow border p-6">
                <h3 className="font-semibold text-gray-800 mb-4">Katakana Categories</h3>
                <div className="space-y-4">
                  {groupByCategory().map((category) => (
                    <div key={category.title}>
                      <div className="flex justify-between items-center mb-2">
                        <div className="text-sm font-medium text-gray-800">{category.title}</div>
                        <div className="text-xs text-gray-500">{category.chars.length} characters</div>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {category.chars.slice(0, 8).map((char) => (
                          <button
                            key={char.id}
                            className={`w-10 h-10 rounded-lg flex items-center justify-center transition ${
                              learnedChars.includes(char.id)
                                ? "bg-green-100 text-green-700 border border-green-300"
                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            } ${
                              selectedChar?.id === char.id
                                ? "ring-2 ring-blue-300"
                                : ""
                            }`}
                            onClick={() => {
                              setSelectedChar(char);
                              setShowDetails(true);
                            }}
                            title={`${char.symbol} - ${char.romaji}`}
                          >
                            <span className="font-bold">{char.symbol}</span>
                          </button>
                        ))}
                        {category.chars.length > 8 && (
                          <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500 text-sm">
                            +{category.chars.length - 8}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div> */}
            </div>
          </div>
        </div>

        {/* Mobile Details Overlay */}
        {showDetails && selectedChar && (
          <div className="fixed inset-0 z-50 lg:hidden">
            {/* Backdrop */}
            <div 
              className="absolute inset-0 bg-black/50 transition-opacity duration-300"
              onClick={() => setShowDetails(false)}
            />
            
            {/* Slide-up Panel */}
            <div 
              className="absolute inset-x-0 bottom-0 bg-white rounded-t-3xl overflow-hidden transition-transform duration-300 ease-out transform"
              onClick={(e) => e.stopPropagation()}
              style={{ 
                maxHeight: '95vh',
                height: 'auto'
              }}
            >
              {/* Drag handle */}
              <div className="flex justify-center pt-3">
                <div className="w-12 h-1.5 bg-gray-300 rounded-full"></div>
              </div>
              
              {/* Close button */}
              <button
                className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-full z-10"
                onClick={() => setShowDetails(false)}
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
              
              {/* Scrollable content */}
              <div className="overflow-y-auto" style={{ maxHeight: 'calc(95vh - 40px)' }}>
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-6 text-white">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="text-6xl font-bold mb-2">{selectedChar.symbol}</div>
                      <div className="text-3xl font-mono">{selectedChar.romaji}</div>
                      <div className="flex items-center gap-2 mt-2">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          selectedChar.symbol.includes("゛") ? "bg-green-500/30" :
                          selectedChar.symbol.includes("゜") ? "bg-purple-500/30" :
                          selectedChar.symbol.length > 1 ? "bg-orange-500/30" : "bg-blue-500/30"
                        }`}>
                          {selectedChar.symbol.includes("゛") ? "Dakuten (゛)" :
                           selectedChar.symbol.includes("゜") ? "Handakuten (゜)" :
                           selectedChar.symbol.length > 1 ? "Combination" : "Basic"}
                        </span>
                        {selectedChar.isRead && (
                          <span className="px-2 py-1 bg-green-500/30 rounded-full text-xs">
                            ✓ Learned
                          </span>
                        )}
                      </div>
                    </div>
                    <button
                      className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition"
                      onClick={() => playAudio(selectedChar.symbol)}
                    >
                      <Speaker className="w-6 h-6" />
                    </button>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  {/* Memory Tip */}
                  <div className="mb-6">
                    <div className="flex items-center gap-2 mb-3">
                      <Lightbulb className="w-5 h-5 text-yellow-500" />
                      <h3 className="font-semibold text-gray-800">Memory Tip</h3>
                    </div>
                    <p className="text-gray-700 bg-yellow-50 p-4 rounded-lg">
                      {selectedChar.explanation}
                    </p>
                  </div>

                  {/* Example */}
                  <div className="mb-6">
                    <h3 className="font-semibold text-gray-800 mb-2">Example Word</h3>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-2xl font-bold">
                            {selectedChar.example?.split(" ")[0] || selectedChar.symbol}
                          </div>
                          <div className="text-gray-600">
                            {selectedChar.example?.split("—")[1]?.trim() || "Japanese word example"}
                          </div>
                        </div>
                        <button
                          className="p-2 bg-purple-100 text-purple-600 rounded-full hover:bg-purple-200 transition"
                          onClick={() => playAudio(selectedChar.example?.split(" ")[0] || selectedChar.symbol)}
                        >
                          <Volume2 className="w-5 h-5" />
                        </button>
                      </div>
                      {selectedChar.example && (
                        <div className="mt-2 text-sm text-gray-500">
                          {selectedChar.example}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Character Info */}
                  <div className="mb-6">
                    <h3 className="font-semibold text-gray-800 mb-3">Character Info</h3>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <div className="text-xs text-gray-500">Type</div>
                        <div className="font-medium">
                          {selectedChar.symbol.includes("゛") ? "Dakuten" :
                           selectedChar.symbol.includes("゜") ? "Handakuten" :
                           selectedChar.symbol.length > 1 ? "Combination" : "Basic"}
                        </div>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <div className="text-xs text-gray-500">Romaji</div>
                        <div className="font-mono font-medium">{selectedChar.romaji}</div>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <div className="text-xs text-gray-500">Stroke Count</div>
                        <div className="font-medium">Varies</div>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <div className="text-xs text-gray-500">Status</div>
                        <div className={`font-medium ${selectedChar.isRead ? 'text-green-600' : 'text-yellow-600'}`}>
                          {selectedChar.isRead ? 'Learned' : 'To Learn'}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Practice Button */}
                  <button
                    className={`w-full py-3 rounded-lg font-semibold transition flex items-center justify-center gap-2 ${
                      selectedChar.isRead
                        ? "bg-green-100 text-green-700 hover:bg-green-200"
                        : "bg-blue-100 text-blue-700 hover:bg-blue-200"
                    }`}
                    onClick={() => {
                      toggleLearned(selectedChar.id, selectedChar.symbol);
                      setShowDetails(false);
                    }}
                    disabled={updatingChar === selectedChar.id}
                  >
                    {updatingChar === selectedChar.id ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Updating...
                      </>
                    ) : selectedChar.isRead ? (
                      <>
                        <CheckCircle className="w-5 h-5" />
                        ✓ Marked as Learned
                      </>
                    ) : (
                      <>
                        <Bookmark className="w-5 h-5" />
                        Mark as Learned
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default KatakanaPage;