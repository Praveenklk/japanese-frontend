// pages/AnkiPage.tsx
import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  getAnkiDecks,
  getDeckNotes,
  getAnkiNote,
  type AnkiDeck,
  type AnkiNote,
} from "../../service/anki.service";
import { 
  Sun, 
  Moon, 
  Volume2, 
  ChevronRight, 
  Filter, 
  Search, 
  Grid, 
  List,
  X,
  ChevronLeft,
  Menu,
  BookOpen,
  Star,
  Hash,
  Tag,
  Clock
} from "lucide-react";

export default function AnkiPage() {
  const [decks, setDecks] = useState<AnkiDeck[]>([]);
  const [selectedDeck, setSelectedDeck] = useState<AnkiDeck | null>(null);
  const [notes, setNotes] = useState<AnkiNote[]>([]);
  const [filteredNotes, setFilteredNotes] = useState<AnkiNote[]>([]);
  const [page, setPage] = useState(1);
  const [selectedNote, setSelectedNote] = useState<AnkiNote | null>(null);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  // Toggle theme
  const toggleTheme = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle("dark");
  };

  // Apply theme classes
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  // Filter notes based on search
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredNotes(notes);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = notes.filter(note => {
      const fields = note.fields || [];
      const searchableText = [
        fields[0], fields[1], fields[4], fields[8], fields[11]
      ].filter(Boolean).join(" ").toLowerCase();
      
      return searchableText.includes(query) || 
        note.tags?.some(tagObj => 
          tagObj.tag.name.toLowerCase().includes(query)
        );
    });
    setFilteredNotes(filtered);
  }, [searchQuery, notes]);

  /* -------------------- LOAD DECKS -------------------- */
  useEffect(() => {
    getAnkiDecks().then((res) => setDecks(res.data));
  }, []);

  /* -------------------- LOAD NOTES -------------------- */
  useEffect(() => {
    if (!selectedDeck) return;

    setLoading(true);
    getDeckNotes(selectedDeck.id, page, 20)
      .then((res) => {
        const newNotes = res.data.notes;
        setNotes((prev) => {
          const combined = [...prev, ...newNotes];
          const unique = combined.filter(
            (note, index, self) =>
              self.findIndex((n) => n.id === note.id) === index
          );
          return unique;
        });
        setHasMore(newNotes.length === 20);
      })
      .finally(() => setLoading(false));
  }, [selectedDeck, page]);

  // Close modal on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedNote(null);
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, []);

  // Parse and extract essential fields from note
  const parseNoteFields = (fields: string[]) => {
    const essentialFields: Record<string, any> = {};
    
    // Japanese vocabulary card
    if (fields.length >= 17 && fields[6] === "Verb") {
      essentialFields.type = "vocabulary";
      essentialFields.cardId = fields[0];
      essentialFields.word = fields[1];
      essentialFields.reading = fields[2];
      essentialFields.pronunciation = fields[3];
      essentialFields.meaning = fields[4];
      essentialFields.partOfSpeech = fields[6];
      essentialFields.example = fields[8]?.replace(/<b>|<\/b>/g, '');
      essentialFields.exampleReading = fields[9];
      essentialFields.translation = fields[11];
      essentialFields.deckInfo = fields[14];
      essentialFields.frequency = fields[15];
    } 
    // Sentence card
    else if (fields.length === 2 && fields[0]?.includes("。")) {
      essentialFields.type = "sentence";
      essentialFields.sentence = fields[0];
      essentialFields.translation = fields[1];
    }
    // Other cards - take first two meaningful fields
    else {
      essentialFields.type = "basic";
      essentialFields.field1 = fields[0];
      essentialFields.field2 = fields[1];
    }
    
    return essentialFields;
  };

  // Function to render note content - Simplified version
  const renderNoteContent = (note: AnkiNote) => {
    const fields = note.fields || [];
    const essential = parseNoteFields(fields);
    
    if (essential.type === "vocabulary") {
      return (
        <div className="space-y-6">
          {/* Main word header */}
          <div className="text-center">
            <div className="inline-flex items-center gap-2 mb-2">
              <div className="px-3 py-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full text-sm font-medium">
                #{essential.cardId}
              </div>
              <div className="px-3 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-300 rounded-full text-sm font-medium">
                {essential.partOfSpeech}
              </div>
            </div>
            
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
              {essential.word}
            </h1>
            <div className="text-xl text-blue-600 dark:text-blue-400 mb-1">
              {essential.reading}
            </div>
            <div className="text-gray-600 dark:text-gray-400 text-sm">
              {essential.pronunciation}
            </div>
          </div>

          {/* Meaning */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-900/10 dark:to-green-900/10 border border-emerald-100 dark:border-emerald-900/20">
            <div className="flex items-center gap-2 mb-3">
              <BookOpen className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <span className="font-medium text-emerald-800 dark:text-emerald-300">Meaning</span>
            </div>
            <div className="text-lg text-gray-900 dark:text-white">
              {essential.meaning}
            </div>
          </div>

          {/* Example */}
          {essential.example && (
            <div className="space-y-4">
              <div className="p-5 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/10 dark:to-indigo-900/10 border border-blue-100 dark:border-blue-900/20">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Star className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    <span className="font-medium text-blue-800 dark:text-blue-300">Example</span>
                  </div>
                  <button className="p-2 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                    <Volume2 className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="space-y-3">
                  <div className="text-lg text-gray-900 dark:text-white leading-relaxed">
                    {essential.example}
                  </div>
                  
                  {essential.exampleReading && (
                    <div className="text-sm text-gray-600 dark:text-gray-400 font-mono">
                      {essential.exampleReading}
                    </div>
                  )}
                  
                  {essential.translation && (
                    <div className="pt-3 border-t border-blue-100 dark:border-blue-900/20">
                      <div className="text-emerald-700 dark:text-emerald-400 italic">
                        "{essential.translation}"
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Metadata */}
          <div className="grid grid-cols-2 gap-3">
            {essential.frequency && (
              <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50">
                <Hash className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                <div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Frequency</div>
                  <div className="font-medium text-gray-900 dark:text-white">#{essential.frequency}</div>
                </div>
              </div>
            )}
            
            {essential.deckInfo && (
              <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50">
                <Tag className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                <div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Deck</div>
                  <div className="font-medium text-gray-900 dark:text-white truncate">
                    {essential.deckInfo.split("-")[0]?.trim()}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      );
    }
    
    if (essential.type === "sentence") {
      return (
        <div className="space-y-8">
          {/* Sentence */}
          <div className="text-center">
            <div className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white leading-relaxed mb-6">
              {essential.sentence}
            </div>
            
            <div className="inline-flex items-center gap-3">
              <button className="p-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                <Volume2 className="w-6 h-6" />
              </button>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Click to listen
              </div>
            </div>
          </div>

          {/* Translation */}
          <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-900/10 dark:to-green-900/10 border border-emerald-100 dark:border-emerald-900/20">
            <div className="text-lg font-medium text-emerald-800 dark:text-emerald-300 mb-2">
              Translation
            </div>
            <div className="text-xl text-gray-900 dark:text-white">
              {essential.translation}
            </div>
          </div>
        </div>
      );
    }
    
    // Basic card
    return (
      <div className="space-y-6">
        {essential.field1 && (
          <div className="p-5 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/10 dark:to-indigo-900/10">
            <div className="text-lg font-medium text-gray-900 dark:text-white">
              {essential.field1}
            </div>
          </div>
        )}
        
        {essential.field2 && (
          <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-900/10 dark:to-green-900/10">
            <div className="text-gray-900 dark:text-white">
              {essential.field2}
            </div>
          </div>
        )}
      </div>
    );
  };

  // Function to render note preview - Simplified
  const renderNotePreview = (note: AnkiNote) => {
    const fields = note.fields || [];
    const essential = parseNoteFields(fields);
    
    if (essential.type === "vocabulary") {
      return (
        <>
          <div className="flex items-start gap-3">
            <div className="text-lg font-bold text-gray-900 dark:text-white bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20 px-2 py-1 rounded-lg">
              {essential.cardId}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-gray-900 dark:text-white truncate">
                {essential.word}
              </div>
              <div className="text-sm text-blue-600 dark:text-blue-400 truncate">
                {essential.reading}
              </div>
            </div>
          </div>
          <div className="mt-2 text-emerald-700 dark:text-emerald-400 text-sm truncate">
            {essential.meaning}
          </div>
        </>
      );
    }
    
    if (essential.type === "sentence") {
      return (
        <>
          <div className="text-base font-medium text-gray-900 dark:text-white mb-2 line-clamp-2">
            {essential.sentence}
          </div>
          <div className="text-sm text-emerald-700 dark:text-emerald-400 truncate">
            {essential.translation}
          </div>
        </>
      );
    }
    
    return (
      <>
        <div className="font-medium text-gray-900 dark:text-white truncate">
          {essential.field1 || "Card"}
        </div>
        <div className="text-sm text-gray-600 dark:text-gray-400 mt-1 truncate">
          {essential.field2 || "—"}
        </div>
      </>
    );
  };

  // Render list view item
  const renderListItem = (note: AnkiNote) => {
    const fields = note.fields || [];
    const essential = parseNoteFields(fields);
    
    return (
      <motion.div
        key={note.id}
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        whileHover={{ x: 4 }}
        onClick={async () => {
          const res = await getAnkiNote(note.id);
          setSelectedNote(res.data);
        }}
        className="cursor-pointer rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-4 hover:border-blue-500/50 hover:shadow-md transition-all duration-200 active:scale-[0.98]"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            {essential.type === "vocabulary" && (
              <div className="text-sm font-bold text-white bg-gradient-to-r from-blue-500 to-purple-500 px-2 py-1 rounded-lg">
                {essential.cardId}
              </div>
            )}
            
            <div className="flex-1 min-w-0">
              <div className="font-medium text-gray-900 dark:text-white truncate">
                {essential.word || essential.sentence || essential.field1}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400 truncate mt-0.5">
                {essential.meaning || essential.translation || essential.field2}
              </div>
            </div>
          </div>
          
          <ChevronRight className="w-5 h-5 text-gray-400 shrink-0" />
        </div>
      </motion.div>
    );
  };

  // Render skeleton loading
  const renderSkeleton = () => (
    <div className="space-y-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="animate-pulse rounded-xl bg-gray-100 dark:bg-gray-800 h-20" />
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 text-gray-900 dark:text-white transition-colors duration-200">
      {/* Mobile Header */}
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800 lg:hidden">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowMobileSidebar(true)}
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800"
              >
                <Menu className="w-5 h-5" />
              </button>
              
              {selectedDeck ? (
                <div>
                  <h1 className="font-semibold text-gray-900 dark:text-white truncate max-w-[180px]">
                    {selectedDeck.name}
                  </h1>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {notes.length} cards
                  </p>
                </div>
              ) : (
                <div>
                  <h1 className="font-bold text-gray-900 dark:text-white">Anki Browser</h1>
                </div>
              )}
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800"
              >
                {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
            </div>
          </div>
          
          {/* Mobile Search */}
          <div className="mt-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search cards..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent"
              />
            </div>
          </div>
        </div>
      </header>

      {/* Desktop Header */}
      <header className="hidden lg:block sticky top-0 z-40 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                <span className="text-white font-bold">A</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">Anki Browser</h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {selectedDeck ? `${selectedDeck.name} • ${notes.length} cards` : "Browse your cards"}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              {/* Search */}
              <div className="relative hidden md:block">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search cards..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent w-64"
                />
              </div>
              
              {/* View Toggle */}
              <div className="hidden sm:flex items-center gap-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-xl">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-lg transition-colors ${viewMode === "grid" ? "bg-white dark:bg-gray-700 shadow-sm" : ""}`}
                >
                  <Grid className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-lg transition-colors ${viewMode === "list" ? "bg-white dark:bg-gray-700 shadow-sm" : ""}`}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>
              
              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="p-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:scale-105 transition-transform"
              >
                {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 lg:px-6 py-4 lg:py-6 flex">
        {/* Mobile Sidebar Overlay */}
        <AnimatePresence>
          {showMobileSidebar && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 bg-black/50 lg:hidden"
                onClick={() => setShowMobileSidebar(false)}
              />
              <motion.aside
                initial={{ x: -300 }}
                animate={{ x: 0 }}
                exit={{ x: -300 }}
                className="fixed left-0 top-0 z-50 h-full w-72 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 overflow-y-auto lg:hidden"
              >
                <div className="p-4">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Decks</h2>
                    <button
                      onClick={() => setShowMobileSidebar(false)}
                      className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  
                  <div className="space-y-2">
                    {decks.map((deck) => (
                      <button
                        key={deck.id}
                        onClick={() => {
                          setSelectedDeck(deck);
                          setNotes([]);
                          setPage(1);
                          setHasMore(true);
                          setShowMobileSidebar(false);
                        }}
                        className={`w-full rounded-lg px-3 py-3 text-left transition-all ${
                          selectedDeck?.id === deck.id
                            ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white"
                            : "bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700"
                        }`}
                      >
                        <div className="font-medium truncate text-sm">{deck.name}</div>
                        <div className="text-xs opacity-80 mt-0.5">
                          {deck.noteCount ?? 0} cards
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        {/* Desktop Sidebar */}
        <aside className="hidden lg:block w-64 shrink-0 sticky top-24 h-[calc(100vh-8rem)] overflow-y-auto">
          <div className="rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-5">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-semibold text-gray-900 dark:text-white">Decks</h2>
              <Filter className="w-5 h-5 text-gray-400" />
            </div>
            
            <div className="space-y-2">
              {decks.map((deck) => (
                <button
                  key={deck.id}
                  onClick={() => {
                    setSelectedDeck(deck);
                    setNotes([]);
                    setPage(1);
                    setHasMore(true);
                  }}
                  className={`w-full rounded-lg px-3 py-3 text-left transition-all ${
                    selectedDeck?.id === deck.id
                      ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white"
                      : "bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                >
                  <div className="font-medium truncate">{deck.name}</div>
                  <div className="text-xs opacity-80 mt-0.5">
                    {deck.noteCount ?? 0} cards
                  </div>
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 lg:ml-6">
          {!selectedDeck ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="h-[70vh] flex flex-col items-center justify-center px-4"
            >
              <div className="relative mb-6">
                <div className="w-24 h-24 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 dark:from-blue-500/30 dark:to-purple-500/30" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-4xl">📚</div>
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 text-center">
                Select a Deck
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-center max-w-sm">
                Choose a deck from the sidebar to start browsing your cards
              </p>
            </motion.div>
          ) : (
            <>
              {/* Deck Header */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setSelectedDeck(null)}
                        className="hidden lg:inline-flex p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                      <div>
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                          {selectedDeck.name}
                        </h2>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            {notes.length} loaded • {selectedDeck.noteCount || 0} total
                          </span>
                          {searchQuery && (
                            <span className="text-sm text-blue-600 dark:text-blue-400">
                              {filteredNotes.length} results
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="hidden lg:flex items-center gap-2">
                    <button
                      onClick={() => setViewMode("grid")}
                      className={`p-2 rounded-lg ${viewMode === "grid" ? "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400" : "bg-gray-100 dark:bg-gray-800"}`}
                    >
                      <Grid className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setViewMode("list")}
                      className={`p-2 rounded-lg ${viewMode === "list" ? "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400" : "bg-gray-100 dark:bg-gray-800"}`}
                    >
                      <List className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Cards Display */}
              {filteredNotes.length === 0 && !loading ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-16 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800"
                >
                  <div className="text-3xl mb-3">🔍</div>
                  <p className="text-gray-600 dark:text-gray-400">
                    {searchQuery ? `No cards found for "${searchQuery}"` : "No cards found in this deck"}
                  </p>
                </motion.div>
              ) : viewMode === "grid" ? (
                <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  <AnimatePresence>
                    {filteredNotes.map((note) => (
                      <motion.div
                        key={note.id}
                        layout
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        whileHover={{ y: -4 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={async () => {
                          const res = await getAnkiNote(note.id);
                          setSelectedNote(res.data);
                        }}
                        className="cursor-pointer rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-4 hover:border-blue-500/50 hover:shadow-lg active:scale-[0.98] transition-all duration-200"
                      >
                        {renderNotePreview(note)}
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="space-y-3">
                  <AnimatePresence>
                    {filteredNotes.map((note) => renderListItem(note))}
                  </AnimatePresence>
                </div>
              )}

              {/* Loading Skeletons */}
              {loading && renderSkeleton()}

              {/* Load More Button */}
              {hasMore && !searchQuery && !loading && (
                <div className="flex justify-center mt-8">
                  <button
                    onClick={() => setPage((p) => p + 1)}
                    className="px-6 py-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-medium transition-all duration-300 flex items-center gap-2 shadow-md hover:shadow-lg"
                  >
                    Load More Cards
                  </button>
                </div>
              )}
            </>
          )}
        </main>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {selectedNote && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
              onClick={() => setSelectedNote(null)}
            />
            
            <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-8 overflow-y-auto">
              <motion.div
                ref={modalRef}
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-lg bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-h-[85vh] overflow-y-auto"
              >
                {/* Modal Header */}
                <div className="sticky top-0 z-10 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setSelectedNote(null)}
                        className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"
                      >
                        <X className="w-5 h-5" />
                      </button>
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">Card Details</h3>
                        <div className="flex items-center gap-2 mt-0.5">
                          <Clock className="w-4 h-4 text-gray-400" />
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {new Date(selectedNote.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Modal Content */}
                <div className="p-6">
                  {renderNoteContent(selectedNote)}
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}