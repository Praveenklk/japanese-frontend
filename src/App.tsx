// App.tsx
import { Routes, Route, Navigate } from "react-router-dom";
import Header from "./component/Header";
import Footer from "./component/Footer";

// Public pages
import Home from "./pages/Home";
import Login from "./pages/login";
import Register from "./pages/Register";

// Learning pages
import HiraganaPage from "./pages/users/mainhiragana";
import KatakanaPage from "./pages/users/KatakanaPage";

// Flashcards
import FlashcardsPage from "./pages/FlashcardsPage";
import HiraganaFlashcards from "./component/flashcards/HiraganaFlashcards";
import KatakanaFlashcards from "./component/flashcards/KatakanaFlashcards";

// User pages
import ProgressPage from "./pages/ProgressPage";
import SettingsPage from "./pages/SettingsPage";

// Admin
import HiraganaAdmin from "./pages/admin/HiraganaAdmin";
import KatakanaAdmin from "./pages/admin/KatakanaAdmin";
import AdminDashboard from "./component/Router/AdminDashboard";
import ProtectedRoute from "./component/Router/ProtectedRoute";
import KanaQuiz from "./pages/KanaQuiz";

// New Learning Pages
import LearningHub from "./pages/LearningHub"; // Add this
import KanjiLearning from "./pages/KanjiLearning";
import GrammarLessons from "./pages/GrammarLessons";
import DailyConversation from "./pages/DailyConversation";
import VocabularyBuilder from "./pages/VocabularyBuilder";
import ShortStories from "./pages/ShortStories";
import CommunityLeaderboard from "./pages/CommunityLeaderboard";
import KanjiView from "./kanji/KanjiView";
import KanjiListPage from "./kanji/KanjiListPage";
import KanjiDetailPage from "./kanji/KanjiDetailPage";
import VocabularyMaster from "./pages/Vocabulary/VocabularyMaster";
import AnkiPage from "./pages/anki/AnkiPage";
import AnkiUpload from "./pages/anki/AnkiUpload";
import Stories from "./pages/story";
import StoriesPage from "./pages/stories/StoriesPagenew";
import StoryPagefull from "./pages/stories/storyone";
import KanjiDemoEx from "./pages/KanjiPagedemo";

function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <Routes>
          {/* ---------------- PUBLIC ---------------- */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* ---------------- KANA LEARNING ---------------- */}
          <Route path="/hiragana" element={<HiraganaPage />} />
          <Route path="/katakana" element={<KatakanaPage />} />
          <Route path="/kana-quiz" element={<KanaQuiz />} />
 <Route path="/stories/new" element={<Stories />} />
          {/* ---------------- LEARNING HUB ---------------- */}
          <Route path="/learn" element={<LearningHub />} />
             <Route path="/master/vocab" element={<VocabularyMaster />} />
             <Route path="/anki/learn" element={<AnkiPage />} />

<Route path="/anki/master" element={<AnkiUpload />} />
   <Route path="/stories/access" element={<StoriesPage />} />
    <Route path="/kanji/value" element={<KanjiDemoEx />} />


        <Route path="/stories/:id" element={<StoryPagefull/>} />
          {/* ---------------- COMPREHENSIVE LEARNING ---------------- */}
          <Route path="/kanji" element={<KanjiLearning />} />
                <Route path="/kanji/view" element={<KanjiView />} />
                       <Route path="/kanji/new" element={<KanjiListPage />} />
        <Route path="/kanji/:char" element={<KanjiDetailPage />} />
          <Route path="/grammar" element={<GrammarLessons />} />
          <Route path="/daily-conversation" element={<DailyConversation />} />
          <Route path="/vocabulary" element={<VocabularyBuilder />} />
          <Route path="/stories" element={<ShortStories />} />
          
          <Route path="/community" element={<CommunityLeaderboard />} />

          {/* ---------------- FLASHCARDS ---------------- */}
          <Route path="/flashcards" element={<FlashcardsPage />}>
            <Route index element={<Navigate to="hiragana" replace />} />
            <Route path="hiragana" element={<HiraganaFlashcards />} />
            <Route path="katakana" element={<KatakanaFlashcards />} />
          </Route>

          {/* ---------------- USER (PROTECTED) ---------------- */}
          <Route
            path="/progress"
            element={
              <ProtectedRoute roles={["USER", "ADMIN"]}>
                <ProgressPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/settings"
            element={
              <ProtectedRoute roles={["USER", "ADMIN"]}>
                <SettingsPage />
              </ProtectedRoute>
            }
          />

          {/* ---------------- ADMIN ---------------- */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute roles={["ADMIN"]}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/hiragana"
            element={
              <ProtectedRoute roles={["ADMIN"]}>
                <HiraganaAdmin />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/katakana"
            element={
              <ProtectedRoute roles={["ADMIN"]}>
                <KatakanaAdmin />
              </ProtectedRoute>
            }
          />

          {/* ---------------- 404 ---------------- */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;