import { useEffect, useState } from "react";
import {
  createHiragana,
  getAllHiragana,
  deleteHiragana,
  type Hiragana,
  type HiraganaPayload,
} from "../../service/hiragana.service";
import HiraganaForm from "../../component/hiragana/HiraganaForm";
import HiraganaTable from "../../component/hiragana/HiraganaTable";


export default function HiraganaAdmin() {
  const [hiragana, setHiragana] = useState<Hiragana[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchHiragana = async () => {
    setLoading(true);
    const res = await getAllHiragana();
    setHiragana(res.data);
    setLoading(false);
  };

  useEffect(() => {
    fetchHiragana();
  }, []);

  const handleCreate = async (
    data: HiraganaPayload,
    image: File,
  ) => {
    await createHiragana(data, image);
    fetchHiragana();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this Hiragana?")) return;
    await deleteHiragana(id);
    fetchHiragana();
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Hiragana Admin Panel</h1>

      <HiraganaForm onSubmit={handleCreate} />

      {loading ? (
        <p>Loading...</p>
      ) : (
        <HiraganaTable
          hiragana={hiragana}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}
