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

          <Route path="/hiragana" element={<HiraganaPage />} />
          <Route path="/katakana" element={<KatakanaPage />} />

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
