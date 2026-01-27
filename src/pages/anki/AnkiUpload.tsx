import { useState } from "react";
import { motion } from "framer-motion";
import { importAnkiDeck } from "../../service/anki.service";

interface Props {
  onSuccess: () => void;
}

export default function AnkiUpload({ onSuccess }: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);

  const validateFile = (file: File) => {
    if (!file.name.endsWith(".apkg")) {
      setError(
        "Only .apkg files are supported. Please export your deck from Anki as .apkg"
      );
      return false;
    }
    return true;
  };

  const handleFile = (file: File) => {
    if (!validateFile(file)) return;
    setError(null);
    setFile(file);
  };

  const handleUpload = async () => {
    if (!file || loading) return;

    setLoading(true);
    setError(null);

    try {
      await importAnkiDeck(file);
      setFile(null);
      onSuccess();
    } catch (err: any) {
      setError(
        err?.response?.data?.message ?? "Failed to import Anki deck"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/10 to-white/5 p-6"
    >
      <h3 className="text-lg font-semibold mb-4">📦 Import Anki Deck</h3>

      {/* Drop Zone */}
      <div
        onDragEnter={() => setDragActive(true)}
        onDragLeave={() => setDragActive(false)}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          setDragActive(false);
          const droppedFile = e.dataTransfer.files?.[0];
          if (droppedFile) handleFile(droppedFile);
        }}
        className={`flex flex-col items-center justify-center h-44 rounded-xl border-2 border-dashed transition ${
          dragActive
            ? "border-indigo-500 bg-indigo-500/10"
            : "border-white/20 hover:border-indigo-500/60"
        }`}
      >
        <input
          type="file"
          accept=".apkg"   // ✅ IMPORTANT
          hidden
          id="anki-upload"
          onChange={(e) => {
            const selected = e.target.files?.[0];
            if (selected) handleFile(selected);
          }}
        />

        <label htmlFor="anki-upload" className="cursor-pointer text-center">
          <div className="text-4xl mb-2">📁</div>
          <p className="text-white/70">
            Drag & drop or <span className="text-indigo-400">browse</span>
          </p>
          <p className="text-xs text-white/40 mt-1">
            Export from Anki as <b>.apkg</b>
          </p>
        </label>
      </div>

      {/* Selected file */}
      {file && (
        <div className="mt-4 flex items-center justify-between rounded-xl bg-white/5 px-4 py-3">
          <span className="text-sm truncate">{file.name}</span>
          <button
            onClick={() => setFile(null)}
            className="text-xs text-red-400 hover:text-red-300"
          >
            Remove
          </button>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="mt-3 text-sm text-red-400">{error}</div>
      )}

      {/* Upload button */}
      <button
        onClick={handleUpload}
        disabled={!file || loading}
        className="mt-5 w-full rounded-xl bg-indigo-600 py-3 hover:bg-indigo-500 transition disabled:opacity-50"
      >
        {loading ? "Importing..." : "Import Deck"}
      </button>
    </motion.div>
  );
}
