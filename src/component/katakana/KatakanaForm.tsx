import { useEffect, useState } from "react";
import { type Katakana } from "../../service/katakana.service";

interface Props {
  onSubmit: (idOrData: any, data?: any) => void;
  editing?: Katakana | null;
  onCancel?: () => void;
}

export default function KatakanaForm({ onSubmit, editing, onCancel }: Props) {
  const [form, setForm] = useState({
    symbol: "",
    romaji: "",
    explanation: "",
    example: "",
    imageUrl: "",
    audioUrl: "",
  });

  useEffect(() => {
    if (editing) {
      setForm(editing);
    }
  }, [editing]);

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();

    if (editing) {
      onSubmit(editing.id, form);
    } else {
      onSubmit(form);
    }

    setForm({
      symbol: "",
      romaji: "",
      explanation: "",
      example: "",
      imageUrl: "",
      audioUrl: "",
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-4 rounded shadow space-y-3"
    >
      <h2 className="font-semibold">
        {editing ? "Edit Katakana" : "Add Katakana"}
      </h2>

      <div className="grid grid-cols-2 gap-3">
        <input name="symbol" placeholder="Symbol" value={form.symbol} onChange={handleChange} className="border p-2 rounded" />
        <input name="romaji" placeholder="Romaji" value={form.romaji} onChange={handleChange} className="border p-2 rounded" />
      </div>

      <input name="explanation" placeholder="Explanation" value={form.explanation} onChange={handleChange} className="border p-2 rounded w-full" />
      <input name="example" placeholder="Example" value={form.example} onChange={handleChange} className="border p-2 rounded w-full" />
      <input name="imageUrl" placeholder="Image URL" value={form.imageUrl} onChange={handleChange} className="border p-2 rounded w-full" />
      <input name="audioUrl" placeholder="Audio URL" value={form.audioUrl} onChange={handleChange} className="border p-2 rounded w-full" />

      <div className="flex gap-2">
        <button className="bg-blue-600 text-white px-4 py-2 rounded">
          {editing ? "Update" : "Create"}
        </button>
        {editing && (
          <button type="button" onClick={onCancel} className="border px-4 py-2 rounded">
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
