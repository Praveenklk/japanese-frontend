import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Volume2 } from "lucide-react";

type Kanji = {
  id: number;
  kanji: string;
  meaning: string;
  onyomi?: string;
  kunyomi?: string;
  strokes?: number;
  examples?: {
    word: string;
    reading: string;
    meaning: string;
  }[];
};

type Props = {
  kanjiData: Kanji[];
};

function KanjiDetailPage({ kanjiData }: Props) {
  const { id } = useParams();
  const navigate = useNavigate();

  const kanji = kanjiData.find(
    (k) => String(k.id) === id
  );

  if (!kanji) {
    return (
      <div className="p-8 text-center">
        <p className="text-xl font-semibold">Kanji not found 😕</p>
        <button
          onClick={() => navigate("/kanji/n5")}
          className="mt-4 text-blue-600 underline"
        >
          Back to Kanji List
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-600 hover:text-black mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </button>

      {/* Kanji Card */}
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg p-8">
        {/* Kanji */}
        <div className="text-center mb-8">
          <div className="text-8xl font-bold mb-4">{kanji.kanji}</div>
          <p className="text-xl text-gray-700">{kanji.meaning}</p>
        </div>

        {/* Readings */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-gray-100 rounded-xl p-4">
            <h3 className="font-semibold mb-2">Onyomi</h3>
            <p className="text-lg">{kanji.onyomi || "—"}</p>
          </div>
          <div className="bg-gray-100 rounded-xl p-4">
            <h3 className="font-semibold mb-2">Kunyomi</h3>
            <p className="text-lg">{kanji.kunyomi || "—"}</p>
          </div>
        </div>

        {/* Extra Info */}
        <div className="flex flex-wrap gap-4 mb-8">
          {kanji.strokes && (
            <div className="px-4 py-2 bg-blue-50 rounded-full">
              🖊 Strokes: {kanji.strokes}
            </div>
          )}
        </div>

        {/* Example Words */}
        {kanji.examples && kanji.examples.length > 0 && (
          <div>
            <h3 className="text-xl font-semibold mb-4">
              Example Words
            </h3>
            <div className="space-y-3">
              {kanji.examples.map((ex, idx) => (
                <div
                  key={idx}
                  className="flex justify-between bg-gray-50 p-4 rounded-xl"
                >
                  <div>
                    <p className="font-bold">{ex.word}</p>
                    <p className="text-gray-600 text-sm">
                      {ex.reading}
                    </p>
                  </div>
                  <p className="text-gray-700">{ex.meaning}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="mt-10 flex gap-4">
          <button
            onClick={() => navigate("/kanji/n5")}
            className="px-6 py-3 bg-gray-200 rounded-xl hover:bg-gray-300"
          >
            All Kanji
          </button>

          <button
            className="px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700"
          >
            Mark as Learned
          </button>
        </div>
      </div>
    </div>
  );
}

export default KanjiDetailPage;
