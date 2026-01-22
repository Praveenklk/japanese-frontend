import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  UserCircle,
  Menu,
  X,
  Shield,
  Home,
  BookOpen,
  Target,
  ChevronDown,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

const Header = () => {
  const [open, setOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();

  const closeMenu = () => setOpen(false);

  // Lock body scroll when menu open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "auto";
  }, [open]);

  const navItems = [
    { path: "/", label: "Home", icon: <Home className="w-4 h-4" /> },
    { path: "/hiragana", label: "Hiragana" },
    { path: "/katakana", label: "Katakana" },
    { path: "/kana-quiz", label: "Kana Quiz", icon: <Target className="w-4 h-4" /> },
    { path: "/flashcards", label: "Flashcards", icon: <BookOpen className="w-4 h-4" /> },
  ];

  const isActive = (path: string) =>
    path === "/" ? location.pathname === "/" : location.pathname.startsWith(path);

  return (
    <>
      {/* ================= HEADER ================= */}
      <header className="sticky top-0 z-30 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link to="/" onClick={closeMenu} className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-red-500 to-blue-500 flex items-center justify-center">
                <span className="text-xl font-bold text-white">日</span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-red-600 to-blue-600 bg-clip-text text-transparent">
                NihongoMaster
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition
                    ${
                      isActive(item.path)
                        ? "bg-red-100 text-red-700"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                >
                  {item.label}
                </Link>
              ))}

              {user?.role === "ADMIN" && (
                <Link
                  to="/admin"
                  className="px-4 py-2 rounded-lg text-sm font-medium bg-red-100 text-red-700 flex items-center gap-2"
                >
                  <Shield className="w-4 h-4" />
                  Admin
                </Link>
              )}
            </nav>

            {/* Desktop User */}
            <div className="hidden md:flex items-center gap-4">
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100"
                  >
                    <UserCircle className="w-7 h-7 text-gray-600" />
                    <ChevronDown
                      className={`w-4 h-4 transition ${
                        dropdownOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-52 bg-white border rounded-xl shadow-lg z-50">
                      <Link
                        to="/profile"
                        onClick={() => setDropdownOpen(false)}
                        className="block px-4 py-3 hover:bg-gray-100"
                      >
                        Profile
                      </Link>
                      <Link
                        to="/progress"
                        onClick={() => setDropdownOpen(false)}
                        className="block px-4 py-3 hover:bg-gray-100"
                      >
                        Progress
                      </Link>
                      <button
                        onClick={() => {
                          logout();
                          setDropdownOpen(false);
                        }}
                        className="w-full text-left px-4 py-3 text-red-600 hover:bg-red-50"
                      >
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  to="/register"
                  className="px-4 py-2 rounded-lg text-sm font-medium text-white bg-gradient-to-r from-red-500 to-blue-500"
                >
                  Get Started
                </Link>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setOpen(!open)}
              className="md:hidden w-10 h-10 flex items-center justify-center rounded-lg hover:bg-gray-100"
            >
              {open ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </header>

      {/* ================= MOBILE MENU (OUTSIDE HEADER) ================= */}
      {open && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 z-40 bg-black/60"
            onClick={closeMenu}
          />

          {/* Drawer */}
          <div className="fixed right-0 top-0 z-50 h-full w-72 bg-white shadow-2xl">
            <div className="p-6 space-y-4">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={closeMenu}
                  className={`block px-4 py-3 rounded-xl font-semibold
                    ${
                      isActive(item.path)
                        ? "bg-red-100 text-red-700"
                        : "text-gray-900 hover:bg-gray-100"
                    }`}
                >
                  {item.label}
                </Link>
              ))}

              <div className="border-t pt-4" />

              {user ? (
                <>
                  <Link
                    to="/profile"
                    onClick={closeMenu}
                    className="block px-4 py-3 rounded-xl hover:bg-gray-100"
                  >
                    Profile
                  </Link>
                  <Link
                    to="/progress"
                    onClick={closeMenu}
                    className="block px-4 py-3 rounded-xl hover:bg-gray-100"
                  >
                    Progress
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      closeMenu();
                    }}
                    className="w-full text-left px-4 py-3 rounded-xl text-red-600 hover:bg-red-50"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <Link
                  to="/register"
                  onClick={closeMenu}
                  className="block px-4 py-3 text-center rounded-xl font-semibold text-white bg-gradient-to-r from-red-500 to-blue-500"
                >
                  Get Started
                </Link>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Header;
