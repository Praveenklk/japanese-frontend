import React, { useEffect, useState } from "react";
import KanjiExplorer from "./kanjidemo";

const KanjiDemoEx: React.FC = () => {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    import("../kanji/kanji.json").then((mod) => {
      setData(mod.default);
    });
  }, []);

if (!data) {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3">
      <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      
      <p className="text-gray-700 font-medium animate-pulse">
        漢字を読み込み中…
      </p>

      <p className="text-xs text-gray-400">
        Loading kanji data
      </p>
    </div>
  );
}


  return <KanjiExplorer data={data} />;
};

export default KanjiDemoEx;
