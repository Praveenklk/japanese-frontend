import { type Katakana } from "../../service/katakana.service";

interface Props {
  data: Katakana[];
  onEdit: (k: Katakana) => void;
  onDelete: (id: string) => void;
  onMarkRead: (id: string) => void;
}

export default function KatakanaTable({
  data,
  onEdit,
  onDelete,
  onMarkRead,
}: Props) {
  return (
    <table className="w-full border rounded">
      <thead className="bg-gray-100">
        <tr>
          <th className="p-2">Symbol</th>
          <th>Romaji</th>
          <th>Explanation</th>
          <th>Read</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {data.map((k) => (
          <tr key={k.id} className="border-t text-center">
            <td className="text-xl">{k.symbol}</td>
            <td>{k.romaji}</td>
            <td>{k.explanation}</td>
            <td>{k.isRead ? "✅" : "❌"}</td>
            <td className="space-x-2">
              <button onClick={() => onEdit(k)} className="text-blue-600">
                Edit
              </button>
              <button onClick={() => onMarkRead(k.id)} className="text-green-600">
                Read
              </button>
              <button onClick={() => onDelete(k.id)} className="text-red-600">
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
