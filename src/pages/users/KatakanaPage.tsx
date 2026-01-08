// pages/KatakanaPage.tsx
import { useEffect, useState } from "react";
import { type Katakana, getAllKatakana, markKatakanaAsRead } from "../../service/katakana.service";
import { Speaker, Volume2, Lightbulb, BookOpen, Search, Filter, CheckCircle, ChevronRight, X, Menu, Grid } from "lucide-react";

const KatakanaPage = () => {
  const [katakanaList, setKatakanaList] = useState<Katakana[]>([]);
  const [filteredList, setFilteredList] = useState<Katakana[]>([]);
  const [selectedChar, setSelectedChar] = useState<Katakana | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<"all" | "vowels" | "k-column" | "s-column" | "t-column" | "n-column" | "h-column" | "m-column">("all");
  const [learnedChars, setLearnedChars] = useState<string[]>([]);
  const [showDetails, setShowDetails] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "chart">("grid");
  const [isLoading, setIsLoading] = useState(true);

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
      setKatakanaList(response.data);
      // Load learned characters from localStorage
      const saved = localStorage.getItem("learnedKatakana");
      if (saved) setLearnedChars(JSON.parse(saved));
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

    // Column filter
    if (filterType !== "all") {
      const columnMap: Record<string, string[]> = {
        vowels: ["ア", "イ", "ウ", "エ", "オ"],
        "k-column": ["カ", "キ", "ク", "ケ", "コ"],
        "s-column": ["サ", "シ", "ス", "セ", "ソ"],
        "t-column": ["タ", "チ", "ツ", "テ", "ト"],
        "n-column": ["ナ", "ニ", "ヌ", "ネ", "ノ"],
        "h-column": ["ハ", "ヒ", "フ", "ヘ", "ホ"],
        "m-column": ["マ", "ミ", "ム", "メ", "モ"],
      };
      filtered = filtered.filter((char) => columnMap[filterType]?.includes(char.symbol));
    }

    setFilteredList(filtered);
  };

  const toggleLearned = async (char: Katakana) => {
    try {
      if (!learnedChars.includes(char.symbol)) {
        // Mark as read on server
        if (char.id) {
          await markKatakanaAsRead(char.id);
        }
        
        const newLearned = [...learnedChars, char.symbol];
        setLearnedChars(newLearned);
        localStorage.setItem("learnedKatakana", JSON.stringify(newLearned));
        
        // Update local state
        setKatakanaList(prev => prev.map(c => 
          c.id === char.id ? { ...c, isRead: true } : c
        ));
      } else {
        const newLearned = learnedChars.filter((symbol) => symbol !== char.symbol);
        setLearnedChars(newLearned);
        localStorage.setItem("learnedKatakana", JSON.stringify(newLearned));
      }
    } catch (error) {
      console.error("Error toggling learned status:", error);
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

  const groupByRow = () => {
    const vowels = ["ア", "イ", "ウ", "エ", "オ"];
    const kRow = ["カ", "キ", "ク", "ケ", "コ"];
    const sRow = ["サ", "シ", "ス", "セ", "ソ"];
    const tRow = ["タ", "チ", "ツ", "テ", "ト"];
    const nRow = ["ナ", "ニ", "ヌ", "ネ", "ノ"];
    const hRow = ["ハ", "ヒ", "フ", "ヘ", "ホ"];
    const mRow = ["マ", "ミ", "ム", "メ", "モ"];
    const yRow = ["ヤ", "ユ", "ヨ"];
    const rRow = ["ラ", "リ", "ル", "レ", "ロ"];
    const wRow = ["ワ", "ヲ", "ン"];

    return [
      { title: "Vowels (ア行)", chars: vowels, color: "bg-red-50 border-red-200" },
      { title: "K-row (カ行)", chars: kRow, color: "bg-orange-50 border-orange-200" },
      { title: "S-row (サ行)", chars: sRow, color: "bg-amber-50 border-amber-200" },
      { title: "T-row (タ行)", chars: tRow, color: "bg-yellow-50 border-yellow-200" },
      { title: "N-row (ナ行)", chars: nRow, color: "bg-lime-50 border-lime-200" },
      { title: "H-row (ハ行)", chars: hRow, color: "bg-green-50 border-green-200" },
      { title: "M-row (マ行)", chars: mRow, color: "bg-emerald-50 border-emerald-200" },
      { title: "Y-row (ヤ行)", chars: yRow, color: "bg-teal-50 border-teal-200" },
      { title: "R-row (ラ行)", chars: rRow, color: "bg-cyan-50 border-cyan-200" },
      { title: "W-row (ワ行)", chars: wRow, color: "bg-blue-50 border-blue-200" },
    ];
  };

  const getColumnFilterOptions = () => [
    { value: "all", label: "All" },
    { value: "vowels", label: "Vowels" },
    { value: "k-column", label: "K-column" },
    { value: "s-column", label: "S-column" },
    { value: "t-column", label: "T-column" },
    { value: "n-column", label: "N-column" },
    { value: "h-column", label: "H-column" },
    { value: "m-column", label: "M-column" },
  ];

  const katakanaChartRows = groupByRow();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading Katakana characters...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Mobile Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b lg:hidden">
        <div className="px-4 py-3">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-blue-600">
                <span className="text-3xl">カタカナ</span> Katakana
              </h1>
            </div>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg bg-gray-100"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
          
          {/* Mobile Progress Bar */}
          <div className="mt-3">
            <div className="flex justify-between text-sm text-gray-600 mb-1">
              <span>Progress</span>
              <span>{getProgress()}%</span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-green-500 transition-all duration-500"
                style={{ width: `${getProgress()}%` }}
              />
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="absolute top-full left-0 right-0 bg-white border-b shadow-lg z-50">
            <div className="p-4">
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search katakana..."
                  className="w-full pl-10 pr-4 py-2 border rounded-lg"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="flex gap-2 overflow-x-auto pb-2">
                {getColumnFilterOptions().map((option) => (
                  <button
                    key={option.value}
                    className={`px-3 py-2 rounded-lg whitespace-nowrap text-sm ${
                      filterType === option.value
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-700"
                    }`}
                    onClick={() => {
                      setFilterType(option.value as any);
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Desktop Header */}
      <header className="hidden lg:block sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-blue-600">
                <span className="text-4xl">カタカナ</span> Katakana
              </h1>
              <p className="text-gray-600">Learn Japanese characters for foreign words</p>
            </div>
            
            <div className="flex items-center gap-6">
              {/* View Toggle */}
              <div className="flex bg-gray-100 p-1 rounded-lg">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`px-4 py-2 rounded-md transition ${viewMode === "grid" ? "bg-white shadow" : ""}`}
                >
                  <Grid className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode("chart")}
                  className={`px-4 py-2 rounded-md transition ${viewMode === "chart" ? "bg-white shadow" : ""}`}
                >
                  <BookOpen className="w-5 h-5" />
                </button>
              </div>
              
              {/* Progress */}
              <div className="w-64">
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>Progress</span>
                  <span>{getProgress()}%</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-green-500 transition-all duration-500"
                    style={{ width: `${getProgress()}%` }}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {learnedChars.length} of {katakanaList.length} learned
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6 lg:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Search and Filters - Desktop */}
            <div className="hidden lg:block mb-8 space-y-4">
              <div className="flex gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search katakana, romaji, or meaning..."
                    className="w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-300"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                
                <div className="flex gap-2">
                  {getColumnFilterOptions().map((option) => (
                    <button
                      key={option.value}
                      className={`px-4 py-3 rounded-lg whitespace-nowrap transition ${
                        filterType === option.value
                          ? "bg-blue-600 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                      onClick={() => setFilterType(option.value as any)}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Stats */}
              <div className="flex flex-wrap gap-4">
                <div className="px-4 py-2 bg-blue-50 rounded-lg">
                  <p className="text-sm text-gray-600">Total</p>
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
              </div>
            </div>

            {/* Content based on view mode */}
            {viewMode === "grid" ? (
              /* Grid View */
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 lg:gap-4">
                {filteredList.map((char) => (
                  <div
                    key={char.symbol}
                    className={`relative bg-white rounded-xl lg:rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 cursor-pointer border ${
                      selectedChar?.symbol === char.symbol
                        ? "border-blue-500 border-2"
                        : "border-gray-200"
                    } ${learnedChars.includes(char.symbol) ? "ring-2 ring-green-200" : ""}`}
                    onClick={() => {
                      setSelectedChar(char);
                      setShowDetails(true);
                    }}
                  >
                    {/* Learned Badge */}
                    {learnedChars.includes(char.symbol) && (
                      <div className="absolute -top-2 -right-2 bg-green-500 text-white p-1 rounded-full z-10">
                        <CheckCircle className="w-4 h-4 lg:w-5 lg:h-5" />
                      </div>
                    )}
                    
                    <div className="p-4 lg:p-6 text-center">
                      <div className="text-4xl lg:text-5xl font-bold mb-2 lg:mb-3">{char.symbol}</div>
                      <div className="text-xl lg:text-2xl font-mono text-gray-700 mb-1 lg:mb-2">{char.romaji}</div>
                      <p className="text-xs lg:text-sm text-gray-600 line-clamp-2 h-10 lg:h-12">{char.explanation}</p>
                      
                      <div className="mt-3 lg:mt-4 flex justify-center space-x-2">
                        <button
                          className="p-1.5 lg:p-2 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200 transition"
                          onClick={(e) => {
                            e.stopPropagation();
                            playAudio(char.symbol);
                          }}
                          title="Listen"
                        >
                          <Speaker className="w-3.5 h-3.5 lg:w-4 lg:h-4" />
                        </button>
                        <button
                          className="p-1.5 lg:p-2 bg-purple-100 text-purple-600 rounded-full hover:bg-purple-200 transition"
                          onClick={(e) => {
                            e.stopPropagation();
                            playAudio(char.example?.split(" ")[0] || char.symbol);
                          }}
                          title="Listen to example"
                        >
                          <Volume2 className="w-3.5 h-3.5 lg:w-4 lg:h-4" />
                        </button>
                        <button
                          className={`p-1.5 lg:p-2 rounded-full transition ${
                            learnedChars.includes(char.symbol)
                              ? "bg-green-100 text-green-600"
                              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                          }`}
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleLearned(char);
                          }}
                          title={learnedChars.includes(char.symbol) ? "Mark as unlearned" : "Mark as learned"}
                        >
                          <BookOpen className="w-3.5 h-3.5 lg:w-4 lg:h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              /* Chart View */
              <div className="space-y-6">
                {katakanaChartRows.map((row) => (
                  <div key={row.title} className={`p-4 rounded-xl border ${row.color}`}>
                    <h3 className="font-bold text-gray-800 mb-3 text-lg">{row.title}</h3>
                    <div className="grid grid-cols-5 sm:grid-cols-10 gap-3">
                      {row.chars.map((symbol) => {
                        const char = katakanaList.find(c => c.symbol === symbol);
                        if (!char) return null;
                        
                        return (
                          <div
                            key={symbol}
                            className={`bg-white rounded-lg shadow-sm hover:shadow-md transition-all cursor-pointer p-3 ${
                              learnedChars.includes(symbol) ? "ring-2 ring-green-300" : ""
                            }`}
                            onClick={() => {
                              setSelectedChar(char);
                              setShowDetails(true);
                            }}
                          >
                            <div className="text-3xl font-bold text-center mb-1">{symbol}</div>
                            <div className="text-center text-sm text-gray-600">{char.romaji}</div>
                            {learnedChars.includes(symbol) && (
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
            )}

            {/* Empty State */}
            {filteredList.length === 0 && (
              <div className="text-center py-12">
                <div className="text-5xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No katakana found</h3>
                <p className="text-gray-500">Try a different search term or filter</p>
              </div>
            )}
          </div>

          {/* Sidebar - Desktop */}
          <div className="hidden lg:block lg:col-span-1">
            <div className="sticky top-24">
              {selectedChar ? (
                <div className="bg-white rounded-2xl shadow-lg border overflow-hidden">
                  {/* Header */}
                  <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-6 text-white">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="text-6xl font-bold mb-2">{selectedChar.symbol}</div>
                        <div className="text-3xl font-mono">{selectedChar.romaji}</div>
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
                      <h3 className="font-semibold text-gray-800 mb-2">Example</h3>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-xl font-bold">{selectedChar.example?.split(" ")[0]}</div>
                            <div className="text-gray-600 text-sm">
                              {selectedChar.example?.split("—")[1]?.trim() || selectedChar.example}
                            </div>
                          </div>
                          <button
                            className="p-2 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200 transition"
                            onClick={() => playAudio(selectedChar.example?.split(" ")[0] || "")}
                          >
                            <Volume2 className="w-5 h-5" />
                          </button>
                        </div>
                        <div className="mt-2 text-sm text-gray-500">
                          {selectedChar.example}
                        </div>
                      </div>
                    </div>

                    {/* Practice Button */}
                    <button
                      className={`w-full py-3 rounded-lg font-semibold transition ${
                        learnedChars.includes(selectedChar.symbol)
                          ? "bg-green-100 text-green-700 hover:bg-green-200"
                          : "bg-blue-100 text-blue-700 hover:bg-blue-200"
                      }`}
                      onClick={() => toggleLearned(selectedChar)}
                    >
                      {learnedChars.includes(selectedChar.symbol)
                        ? "✓ Marked as Learned"
                        : "Mark as Learned"}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-2xl shadow-lg border p-8 text-center">
                  <div className="text-6xl mb-4">👈</div>
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">Select a Character</h3>
                  <p className="text-gray-500">Click on any katakana character to see details</p>
                  <div className="mt-6">
                    <div className="text-4xl font-bold text-blue-500 animate-pulse">カ</div>
                  </div>
                </div>
              )}

              {/* Chart Reference */}
              <div className="mt-6 bg-white rounded-2xl shadow border p-6">
                <h3 className="font-semibold text-gray-800 mb-4">Katakana Chart</h3>
                <div className="space-y-4">
                  {katakanaChartRows.slice(0, 5).map((row) => (
                    <div key={row.title}>
                      <div className="text-sm font-medium text-gray-600 mb-2">{row.title}</div>
                      <div className="flex flex-wrap gap-2">
                        {row.chars.map((symbol) => {
                          const char = katakanaList.find(c => c.symbol === symbol);
                          return char ? (
                            <button
                              key={symbol}
                              className={`w-10 h-10 rounded-lg flex items-center justify-center transition ${
                                learnedChars.includes(symbol)
                                  ? "bg-green-100 text-green-700 border border-green-300"
                                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                              } ${
                                selectedChar?.symbol === symbol
                                  ? "ring-2 ring-blue-300"
                                  : ""
                              }`}
                              onClick={() => {
                                setSelectedChar(char);
                                setShowDetails(true);
                              }}
                              title={`${symbol} - ${char?.romaji}`}
                            >
                              <span className="font-bold">{symbol}</span>
                            </button>
                          ) : null;
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Details Modal */}
      {showDetails && selectedChar && (
        <div className="fixed inset-0 bg-black/50 z-50 lg:hidden">
          <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl max-h-[90vh] overflow-y-auto animate-slide-up">
            {/* Close Button */}
            <div className="sticky top-0 bg-white border-b flex justify-end p-4">
              <button
                className="p-2 rounded-full bg-gray-100"
                onClick={() => setShowDetails(false)}
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            {/* Content */}
            <div className="p-6">
              {/* Character Header */}
              <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-6 text-white rounded-2xl -mx-4 mt-4">
                <div className="text-center">
                  <div className="text-6xl font-bold mb-2">{selectedChar.symbol}</div>
                  <div className="text-3xl font-mono">{selectedChar.romaji}</div>
                </div>
              </div>

              {/* Details */}
              <div className="space-y-6 mt-6">
                {/* Memory Tip */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Lightbulb className="w-5 h-5 text-yellow-500" />
                    <h3 className="font-semibold text-gray-800">Memory Tip</h3>
                  </div>
                  <p className="text-gray-700 bg-yellow-50 p-4 rounded-lg">
                    {selectedChar.explanation}
                  </p>
                </div>

                {/* Example */}
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Example</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-xl font-bold">{selectedChar.example?.split(" ")[0]}</div>
                        <div className="text-gray-600 text-sm">
                          {selectedChar.example?.split("—")[1]?.trim() || selectedChar.example}
                        </div>
                      </div>
                      <button
                        className="p-2 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200 transition"
                        onClick={() => playAudio(selectedChar.example?.split(" ")[0] || "")}
                      >
                        <Volume2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Practice Button */}
                <button
                  className={`w-full py-4 rounded-xl font-semibold text-lg transition ${
                    learnedChars.includes(selectedChar.symbol)
                      ? "bg-green-100 text-green-700 border-2 border-green-300"
                      : "bg-blue-100 text-blue-700 border-2 border-blue-300"
                  }`}
                  onClick={() => {
                    toggleLearned(selectedChar);
                    setShowDetails(false);
                  }}
                >
                  {learnedChars.includes(selectedChar.symbol)
                    ? "✓ Character Learned"
                    : "Mark as Learned"}
                </button>

                {/* Similar Characters */}
                <div>
                  <h3 className="font-semibold text-gray-800 mb-3">Similar Characters</h3>
                  <div className="grid grid-cols-4 gap-3">
                    {katakanaList
                      .filter(c => c.romaji[0] === selectedChar.romaji[0] && c.symbol !== selectedChar.symbol)
                      .slice(0, 4)
                      .map(c => (
                        <button
                          key={c.symbol}
                          className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition text-center"
                          onClick={() => setSelectedChar(c)}
                        >
                          <div className="text-2xl font-bold">{c.symbol}</div>
                          <div className="text-sm text-gray-600">{c.romaji}</div>
                        </button>
                      ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add CSS for slide-up animation */}
      <style jsx>{`
        @keyframes slide-up {
          from {
            transform: translateY(100%);
          }
          to {
            transform: translateY(0);
          }
        }
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default KatakanaPage;