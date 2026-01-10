import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  UserCircle,
  Menu,
  X,
  Shield,
  LogOut,
  Home,
  BookOpen,
  Target,
  GraduationCap,
  ChevronDown,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

const Header = () => {
  const [open, setOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();

  const closeMenu = () => setOpen(false);

  const navItems = [
    { path: "/", label: "Home", icon: <Home className="w-4 h-4" /> },
    { path: "/hiragana", label: "Hiragana", icon: <span className="font-bold">あ</span> },
    { path: "/katakana", label: "Katakana", icon: <span className="font-bold">ア</span> },
    { path: "/kana-quiz", label: "Kana Quiz", icon: <Target className="w-4 h-4" /> },
    { path: "/flashcards", label: "Flashcards", icon: <BookOpen className="w-4 h-4" /> },
  ];

  const isActive = (path: string) =>
    path === "/" ? location.pathname === "/" : location.pathname.startsWith(path);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-gray-100 shadow-sm">
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
                  ${isActive(item.path)
                    ? "bg-red-50 text-red-600"
                    : "text-gray-700 hover:bg-gray-50 hover:text-red-600"
                  }`}
              >
                <span className="flex items-center gap-2">
                  {item.icon}
                  {item.label}
                </span>
              </Link>
            ))}

            {user?.role === "ADMIN" && (
              <Link
                to="/admin"
                className="px-4 py-2 rounded-lg text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 flex items-center gap-2"
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
                  className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50"
                >
                  <UserCircle className="w-7 h-7 text-gray-600" />
                  <ChevronDown
                    className={`w-4 h-4 transition ${dropdownOpen ? "rotate-180" : ""}`}
                  />
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-52 bg-white border rounded-xl shadow-lg z-50">
                    <Link
                      to="/profile"
                      onClick={() => setDropdownOpen(false)}
                      className="block px-4 py-3 text-sm hover:bg-gray-50"
                    >
                      Profile
                    </Link>
                    <Link
                      to="/progress"
                      onClick={() => setDropdownOpen(false)}
                      className="block px-4 py-3 text-sm hover:bg-gray-50"
                    >
                      Progress
                    </Link>
                    <button
                      onClick={() => {
                        logout();
                        setDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/register"
                className="px-4 py-2 rounded-lg text-sm font-medium text-white bg-gradient-to-r from-red-500 to-blue-500 hover:shadow"
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

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden fixed inset-0 z-40">
          <div className="absolute inset-0 bg-black/20" onClick={closeMenu} />
          <div className="absolute right-0 top-0 h-full w-72 bg-white shadow-xl">
            <div className="p-4 space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={closeMenu}
                  className={`block px-4 py-3 rounded-lg
                    ${isActive(item.path)
                      ? "bg-red-50 text-red-600"
                      : "text-gray-700 hover:bg-gray-50"
                    }`}
                >
                  {item.label}
                </Link>
              ))}

              {user ? (
                <>
                  <Link to="/profile" onClick={closeMenu} className="block px-4 py-3">
                    Profile
                  </Link>
                  <Link to="/progress" onClick={closeMenu} className="block px-4 py-3">
                    Progress
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      closeMenu();
                    }}
                    className="w-full text-left px-4 py-3 text-red-600"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <Link
                  to="/register"
                  onClick={closeMenu}
                  className="block px-4 py-3 text-center text-white bg-gradient-to-r from-red-500 to-blue-500 rounded-lg"
                >
                  Get Started
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
