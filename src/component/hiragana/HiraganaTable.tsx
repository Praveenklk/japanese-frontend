import { type Hiragana } from "../../service/hiragana.service";

interface Props {
  hiragana: Hiragana[];
  onDelete: (id: string) => void;
}

export default function HiraganaTable({
  hiragana,
  onDelete,
}: Props) {
  return (
    <table className="w-full border">
      <thead className="bg-gray-100">
        <tr>
          <th>Symbol</th>
          <th>Romaji</th>
          <th>Explanation</th>
          <th>Image</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {hiragana.map((h) => (
          <tr key={h.id} className="border-t">
            <td className="text-xl">{h.symbol}</td>
            <td>{h.romaji}</td>
            <td>{h.explanation}</td>
            <td>
              <img
                src={h.imageUrl}
                className="h-12"
              />
            </td>
            <td>
              <button
                onClick={() => onDelete(h.id)}
                className="text-red-600"
              >
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
