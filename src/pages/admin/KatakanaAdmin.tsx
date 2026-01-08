import { useEffect, useState } from "react";
import {
  getAllKatakana,
  createKatakana,
  updateKatakana,
  deleteKatakana,
  markKatakanaAsRead,
 type Katakana,
} from "../../service/katakana.service";
import KatakanaForm from "../../component/katakana/KatakanaForm";
import KatakanaTable from "../../component/katakana/KatakanaTable";


export default function KatakanaAdmin() {
  const [katakana, setKatakana] = useState<Katakana[]>([]);
  const [editing, setEditing] = useState<Katakana | null>(null);

  const loadKatakana = async () => {
    const res = await getAllKatakana();
    setKatakana(res.data);
  };

  useEffect(() => {
    loadKatakana();
  }, []);

  const handleCreate = async (data: any) => {
    await createKatakana(data);
    loadKatakana();
  };

  const handleUpdate = async (id: string, data: any) => {
    await updateKatakana(id, data);
    setEditing(null);
    loadKatakana();
  };

  const handleDelete = async (id: string) => {
    if (confirm("Delete this Katakana?")) {
      await deleteKatakana(id);
      loadKatakana();
    }
  };

  const handleMarkRead = async (id: string) => {
    await markKatakanaAsRead(id);
    loadKatakana();
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Katakana Admin Panel</h1>

      <KatakanaForm
        onSubmit={editing ? handleUpdate : handleCreate}
        editing={editing}
        onCancel={() => setEditing(null)}
      />

      <KatakanaTable
        data={katakana}
        onEdit={setEditing}
        onDelete={handleDelete}
        onMarkRead={handleMarkRead}
      />
    </div>
  );
}
