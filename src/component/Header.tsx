import { useState } from "react";
import { Link } from "react-router-dom";
import { UserCircle, Menu, X, Shield } from "lucide-react";
import { useAuth } from "../context/AuthContext";


const Header = () => {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();

  const closeMenu = () => setOpen(false);

  return (
    <header className="bg-white shadow sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="text-xl font-bold text-red-600">
          日本語<span className="text-gray-700">Learn</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6">
          <Link to="/" className="text-gray-700 hover:text-red-600">
            Home
          </Link>
          <Link to="/hiragana" className="text-gray-700 hover:text-red-600">
            Hiragana
          </Link>
          <Link to="/katakana" className="text-gray-700 hover:text-red-600">
            Katakana
          </Link>
          <Link to="/vocabulary" className="text-gray-700 hover:text-red-600">
            Vocabulary
          </Link>

          {/* ✅ Admin only */}
          {user?.role === "ADMIN" && (
            <Link
              to="/admin"
              className="flex items-center gap-1 text-red-600 font-semibold"
            >
              <Shield className="w-4 h-4" />
              Admin
            </Link>
          )}

          {/* Auth */}
          {!user ? (
            <Link to="/login">
              <UserCircle className="w-7 h-7 text-gray-700 hover:text-red-600" />
            </Link>
          ) : (
            <button
              onClick={logout}
              className="text-sm text-gray-600 hover:text-red-600"
            >
              Logout
            </button>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <button className="md:hidden" onClick={() => setOpen(!open)}>
          {open ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
        </button>
      </div>

      {/* Mobile Nav */}
      {open && (
        <div className="md:hidden bg-white border-t">
          <nav className="flex flex-col p-4 gap-4">
            <Link onClick={closeMenu} to="/">Home</Link>
            <Link onClick={closeMenu} to="/hiragana">Hiragana</Link>
            <Link onClick={closeMenu} to="/katakana">Katakana</Link>
            <Link onClick={closeMenu} to="/vocabulary">Vocabulary</Link>

            {/* ✅ Admin only (mobile) */}
            {user?.role === "ADMIN" && (
              <Link
                onClick={closeMenu}
                to="/admin"
                className="flex items-center gap-2 text-red-600 font-semibold"
              >
                <Shield className="w-5 h-5" />
                Admin Panel
              </Link>
            )}

            {/* Auth */}
            {!user ? (
              <Link
                onClick={closeMenu}
                to="/login"
                className="flex items-center gap-2"
              >
                <UserCircle className="w-6 h-6" />
                Login
              </Link>
            ) : (
              <button
                onClick={() => {
                  logout();
                  closeMenu();
                }}
                className="text-left text-gray-600 hover:text-red-600"
              >
                Logout
              </button>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
