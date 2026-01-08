import { useState } from "react";
import { type HiraganaPayload } from "../../service/hiragana.service";

interface Props {
  onSubmit: (data: HiraganaPayload, image: File) => void;
}

export default function HiraganaForm({ onSubmit }: Props) {
  const [form, setForm] = useState<HiraganaPayload>({
    symbol: "",
    romaji: "",
    explanation: "",
    example: "",
    audioUrl: "",
  });

  const [image, setImage] = useState<File | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!image) {
      alert("Please upload an image");
      return;
    }
    onSubmit(form, image);
    // Reset form
    setForm({
      symbol: "",
      romaji: "",
      explanation: "",
      example: "",
      audioUrl: "",
    });
    setImage(null);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl shadow-xl overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-red-600 to-pink-600 text-white px-8 py-6">
          <h2 className="text-3xl font-bold">➕ Add New Hiragana</h2>
          <p className="text-red-100 mt-2 text-lg">
            ひらがなを追加する ・ Add a new Hiragana character
          </p>
        </div>

        {/* Form Body */}
        <div className="p-8 space-y-8">
          {/* Main Fields Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Symbol */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Hiragana Symbol <span className="text-red-500">*</span>
                <span className="text-gray-500 text-xs ml-1">(ひらがな)</span>
              </label>
              <input
                type="text"
                name="symbol"
                placeholder="あ"
                value={form.symbol}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition text-lg font-medium text-center"
              />
            </div>

            {/* Romaji */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Romaji <span className="text-red-500">*</span>
                <span className="text-gray-500 text-xs ml-1">(ローマ字)</span>
              </label>
              <input
                type="text"
                name="romaji"
                placeholder="a"
                value={form.romaji}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition text-lg text-center"
              />
            </div>

            {/* Explanation */}
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Explanation <span className="text-red-500">*</span>
                <span className="text-gray-500 text-xs ml-1">(説明)</span>
              </label>
              <textarea
                name="explanation"
                placeholder="This character represents the vowel sound 'a' as in 'father'..."
                value={form.explanation}
                onChange={handleChange}
                required
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition resize-none"
              />
            </div>

            {/* Example */}
            <div className="md:col-span-1">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Example Word <span className="text-gray-500 text-xs">(例)</span>
              </label>
              <input
                type="text"
                name="example"
                placeholder="あさ (asa - morning)"
                value={form.example}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition"
              />
            </div>

            {/* Audio URL */}
            <div className="md:col-span-1">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Audio URL <span className="text-red-500">*</span>
                <span className="text-gray-500 text-xs ml-1">(音声)</span>
              </label>
              <input
                type="url"
                name="audioUrl"
                placeholder="https://example.com/audio/a.mp3"
                value={form.audioUrl}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition"
              />
            </div>
          </div>

          {/* Image Upload Section */}
          <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center">
            <label className="block text-sm font-semibold text-gray-700 mb-4">
              Character Image <span className="text-red-500">*</span>
              <span className="text-gray-500 text-xs ml-1">(画像)</span>
            </label>

            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              required
              className="hidden"
              id="image-upload"
            />

            <div className="flex flex-col items-center gap-4">
              {!image ? (
                <>
                  <div className="bg-gray-200 border-2 border-dashed rounded-xl w-32 h-32 flex items-center justify-center">
                    <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <label
                    htmlFor="image-upload"
                    className="cursor-pointer bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-6 rounded-lg transition"
                  >
                    Choose Image
                  </label>
                </>
              ) : (
                <>
                  <img
                    src={URL.createObjectURL(image)}
                    alt="Preview"
                    className="w-48 h-48 object-contain rounded-lg shadow-md border"
                  />
                  <div className="flex gap-3">
                    <label
                      htmlFor="image-upload"
                      className="cursor-pointer bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-lg transition text-sm"
                    >
                      Change Image
                    </label>
                    <button
                      type="button"
                      onClick={() => setImage(null)}
                      className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-lg transition text-sm"
                    >
                      Remove
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end pt-6">
            <button
              type="submit"
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-10 rounded-xl text-lg transition transform hover:scale-105 shadow-lg"
            >
              保存する ・ Save Hiragana
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}