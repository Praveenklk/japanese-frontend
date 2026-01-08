import { useEffect, useState } from "react";
import {type Hiragana, getAllHiragana } from "../../service/hiragana.service";

import { Speaker, Volume2, Lightbulb, BookOpen, Search, Filter, ChevronRight, CheckCircle } from "lucide-react";

const HiraganaPage = () => {
  const [hiraganaList, setHiraganaList] = useState<Hiragana[]>([]);
  const [filteredList, setFilteredList] = useState<Hiragana[]>([]);
  const [selectedChar, setSelectedChar] = useState<Hiragana | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<"all" | "vowels" | "k-column" | "s-column" | "t-column">("all");
  const [learnedChars, setLearnedChars] = useState<string[]>([]);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    fetchHiragana();
  }, []);

  useEffect(() => {
    filterHiragana();
  }, [hiraganaList, searchTerm, filterType]);

  const fetchHiragana = async () => {
    try {
      const response = await getAllHiragana();
      setHiraganaList(response.data);
      // Load learned characters from localStorage
      const saved = localStorage.getItem("learnedHiragana");
      if (saved) setLearnedChars(JSON.parse(saved));
    } catch (error) {
      console.error("Error fetching hiragana:", error);
    }
  };

  const filterHiragana = () => {
    let filtered = [...hiraganaList];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (char) =>
          char.symbol.includes(searchTerm) ||
          char.romaji.toLowerCase().includes(searchTerm.toLowerCase()) ||
          char.explanation.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Column filter
    if (filterType !== "all") {
      const columnMap: Record<string, string[]> = {
        vowels: ["あ", "い", "う", "え", "お"],
        "k-column": ["か", "き", "く", "け", "こ"],
        "s-column": ["さ", "し", "す", "せ", "そ"],
        "t-column": ["た", "ち", "つ", "て", "と"],
      };
      filtered = filtered.filter((char) => columnMap[filterType]?.includes(char.symbol));
    }

    setFilteredList(filtered);
  };

  const toggleLearned = (symbol: string) => {
    const newLearned = learnedChars.includes(symbol)
      ? learnedChars.filter((char) => char !== symbol)
      : [...learnedChars, symbol];
    
    setLearnedChars(newLearned);
    localStorage.setItem("learnedHiragana", JSON.stringify(newLearned));
  };

  const playAudio = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "ja-JP";
    utterance.rate = 0.8;
    speechSynthesis.speak(utterance);
  };

  const getProgress = () => {
    if (hiraganaList.length === 0) return 0;
    return Math.round((learnedChars.length / hiraganaList.length) * 100);
  };

  const groupByRow = () => {
    const rows = [];
    const vowels = ["あ", "い", "う", "え", "お"];
    const kRow = ["か", "き", "く", "け", "こ"];
    const sRow = ["さ", "し", "す", "せ", "そ"];
    const tRow = ["た", "ち", "つ", "て", "と"];
    const nRow = ["な", "に", "ぬ", "ね", "の"];
    const hRow = ["は", "ひ", "ふ", "へ", "ほ"];
    const mRow = ["ま", "み", "む", "め", "も"];
    const yRow = ["や", "ゆ", "よ"];
    const rRow = ["ら", "り", "る", "れ", "ろ"];
    const wRow = ["わ", "を", "ん"];

    return [
      { title: "Vowels (あ行)", chars: vowels },
      { title: "K-row (か行)", chars: kRow },
      { title: "S-row (さ行)", chars: sRow },
      { title: "T-row (た行)", chars: tRow },
      { title: "N-row (な行)", chars: nRow },
      { title: "H-row (は行)", chars: hRow },
      { title: "M-row (ま行)", chars: mRow },
      { title: "Y-row (や行)", chars: yRow },
      { title: "R-row (ら行)", chars: rRow },
      { title: "W-row (わ行)", chars: wRow },
    ];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-blue-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-red-600">
                <span className="text-4xl">ひらがな</span> Hiragana
              </h1>
              <p className="text-gray-600">Learn Japanese characters step by step</p>
            </div>
            
            {/* Progress Bar */}
            <div className="w-full md:w-64">
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
                {learnedChars.length} of {hiraganaList.length} characters learned
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
                    placeholder="Search hiragana, romaji, or meaning..."
                    className="w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-red-300"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {["all", "vowels", "k-column", "s-column", "t-column"].map((type) => (
                    <button
                      key={type}
                      className={`px-4 py-2 rounded-lg whitespace-nowrap transition ${
                        filterType === type
                          ? "bg-red-600 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                      onClick={() => setFilterType(type as any)}
                    >
                      {type === "all" ? "All" : 
                       type === "vowels" ? "Vowels" :
                       type === "k-column" ? "K-column" :
                       type === "s-column" ? "S-column" : "T-column"}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Quick Stats */}
              <div className="flex flex-wrap gap-4">
                <div className="px-4 py-2 bg-red-50 rounded-lg">
                  <p className="text-sm text-gray-600">Total Characters</p>
                  <p className="text-2xl font-bold text-red-600">{hiraganaList.length}</p>
                </div>
                <div className="px-4 py-2 bg-green-50 rounded-lg">
                  <p className="text-sm text-gray-600">Learned</p>
                  <p className="text-2xl font-bold text-green-600">{learnedChars.length}</p>
                </div>
                <div className="px-4 py-2 bg-blue-50 rounded-lg">
                  <p className="text-sm text-gray-600">Remaining</p>
                  <p className="text-2xl font-bold text-blue-600">{hiraganaList.length - learnedChars.length}</p>
                </div>
              </div>
            </div>

            {/* Character Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {filteredList.map((char) => (
                <div
                  key={char.symbol}
                  className={`relative bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer border-2 ${
                    selectedChar?.symbol === char.symbol
                      ? "border-red-500"
                      : "border-transparent"
                  } ${learnedChars.includes(char.symbol) ? "ring-2 ring-green-200" : ""}`}
                  onClick={() => {
                    setSelectedChar(char);
                    setShowDetails(true);
                  }}
                >
                  {/* Learned Badge */}
                  {learnedChars.includes(char.symbol) && (
                    <div className="absolute -top-2 -right-2 bg-green-500 text-white p-1 rounded-full">
                      <CheckCircle className="w-5 h-5" />
                    </div>
                  )}
                  
                  <div className="p-6 text-center">
                    <div className="text-5xl font-bold mb-3">{char.symbol}</div>
                    <div className="text-2xl font-mono text-gray-700 mb-2">{char.romaji}</div>
                    <p className="text-sm text-gray-600 line-clamp-2">{char.explanation}</p>
                    
                    <div className="mt-4 flex justify-center space-x-2">
                      <button
                        className="p-2 bg-red-100 text-red-600 rounded-full hover:bg-red-200 transition"
                        onClick={(e) => {
                          e.stopPropagation();
                          playAudio(char.symbol);
                        }}
                        title="Listen"
                      >
                        <Speaker className="w-4 h-4" />
                      </button>
                      <button
                        className="p-2 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200 transition"
                        onClick={(e) => {
                          e.stopPropagation();
                          playAudio(char.example?.split(" ")[0] || char.symbol);
                        }}
                        title="Listen to example"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                      <button
                        className={`p-2 rounded-full transition ${
                          learnedChars.includes(char.symbol)
                            ? "bg-green-100 text-green-600"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        }`}
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleLearned(char.symbol);
                        }}
                        title={learnedChars.includes(char.symbol) ? "Mark as unlearned" : "Mark as learned"}
                      >
                        <BookOpen className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

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
                  <div className="bg-gradient-to-r from-red-500 to-orange-500 p-6 text-white">
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
                      <h3 className="font-semibold text-gray-800 mb-2">Example Word</h3>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-2xl font-bold">{selectedChar.example?.split(" ")[0]}</div>
                            <div className="text-gray-600">{selectedChar.example?.split("—")[1]?.trim()}</div>
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

                    {/* Similar Characters */}
                    <div className="mb-6">
                      <h3 className="font-semibold text-gray-800 mb-3">Similar Characters</h3>
                      <div className="flex gap-2">
                        {hiraganaList
                          .filter(c => c.romaji.startsWith(selectedChar.romaji[0]) && c.symbol !== selectedChar.symbol)
                          .slice(0, 3)
                          .map(c => (
                            <button
                              key={c.symbol}
                              className="flex-1 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition text-center"
                              onClick={() => setSelectedChar(c)}
                            >
                              <div className="text-2xl font-bold">{c.symbol}</div>
                              <div className="text-sm text-gray-600">{c.romaji}</div>
                            </button>
                          ))}
                      </div>
                    </div>

                    {/* Practice Button */}
                    <button
                      className={`w-full py-3 rounded-lg font-semibold transition ${
                        learnedChars.includes(selectedChar.symbol)
                          ? "bg-green-100 text-green-700 hover:bg-green-200"
                          : "bg-red-100 text-red-700 hover:bg-red-200"
                      }`}
                      onClick={() => toggleLearned(selectedChar.symbol)}
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
                  <p className="text-gray-500">Click on any hiragana character to see details and learning tips</p>
                  <div className="mt-6">
                    <div className="text-4xl font-bold text-red-500 animate-pulse">あ</div>
                  </div>
                </div>
              )}

              {/* Hiragana Chart Reference */}
              <div className="mt-6 bg-white rounded-2xl shadow border p-6">
                <h3 className="font-semibold text-gray-800 mb-4">Hiragana Chart</h3>
                <div className="space-y-4">
                  {groupByRow().map((row) => (
                    <div key={row.title}>
                      <div className="text-sm font-medium text-gray-600 mb-2">{row.title}</div>
                      <div className="flex flex-wrap gap-2">
                        {row.chars.map((symbol) => {
                          const char = hiraganaList.find(c => c.symbol === symbol);
                          return char ? (
                            <button
                              key={symbol}
                              className={`w-10 h-10 rounded-lg flex items-center justify-center transition ${
                                learnedChars.includes(symbol)
                                  ? "bg-green-100 text-green-700 border border-green-300"
                                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                              } ${
                                selectedChar?.symbol === symbol
                                  ? "ring-2 ring-red-300"
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

        {/* Mobile Details Overlay */}
        {showDetails && selectedChar && (
          <div className="fixed inset-0 bg-black/50 z-50 lg:hidden">
            <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl max-h-[90vh] overflow-y-auto">
              <div className="p-4">
                <button
                  className="ml-auto block text-gray-500 hover:text-gray-700"
                  onClick={() => setShowDetails(false)}
                >
                  ✕
                </button>
                {/* Same details content as desktop */}
                <div className="bg-gradient-to-r from-red-500 to-orange-500 p-6 text-white -mx-4 -mt-4 mb-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="text-6xl font-bold mb-2">{selectedChar.symbol}</div>
                      <div className="text-3xl font-mono">{selectedChar.romaji}</div>
                    </div>
                  </div>
                </div>
                {/* Rest of details content */}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HiraganaPage;