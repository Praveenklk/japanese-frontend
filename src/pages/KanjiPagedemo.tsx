import React from "react";
import kanjiData from "../kanji/kanji.json";
import KanjiExplorer from "./kanjidemo";


const KanjiDemoEx: React.FC = () => {
  return <KanjiExplorer data={kanjiData} />;
};

export default KanjiDemoEx;
