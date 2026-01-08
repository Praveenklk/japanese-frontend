import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-red-600 mb-4">
        Admin Dashboard
      </h1>

      <p className="text-gray-600 mb-6">
        管理者パネル (Admin Panel)
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Hiragana */}
        <div
          onClick={() => navigate("/admin/hiragana")}
          className="bg-white shadow rounded p-4 cursor-pointer hover:bg-red-50 transition"
        >
          <h2 className="text-lg font-semibold">📘 Manage Hiragana</h2>
          <p className="text-sm text-gray-500">
            Add, edit, and delete Hiragana
          </p>
        </div>

        {/* Katakana */}
        <div
          onClick={() => navigate("/admin/katakana")}
          className="bg-white shadow rounded p-4 cursor-pointer hover:bg-red-50 transition"
        >
          <h2 className="text-lg font-semibold">📙 Manage Katakana</h2>
          <p className="text-sm text-gray-500">
            Manage Katakana characters
          </p>
        </div>

        {/* Vocabulary */}
        <div
          onClick={() => navigate("/admin/vocabulary")}
          className="bg-white shadow rounded p-4 cursor-pointer hover:bg-red-50 transition"
        >
          <h2 className="text-lg font-semibold">📗 Manage Vocabulary</h2>
          <p className="text-sm text-gray-500">
            Manage JLPT words
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
