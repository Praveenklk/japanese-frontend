import { Routes, Route } from "react-router-dom";
import N5KanjiPage from "./KanjiPageN5";

import kanjiData from "../N5kanji.json";
import KanjiDetailPage from "./KanjiDetailPage";

function KanjiRouter() {
  return (
    <Routes>
      {/* Kanji list page */}
      <Route
        path="/"
        element={<N5KanjiPage kanjiData={kanjiData} />}
      />

      {/* Single kanji detail page */}
      <Route
        path=":id"
        element={<KanjiDetailPage kanjiData={kanjiData} />}
      />
    </Routes>
  );
}

export default KanjiRouter;
