import { useState, useEffect, useRef, cloneElement } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  UserCircle,
  Menu,
  X,
  Shield,
  Home,
  BookOpen,
  Target,
  ChevronDown,
  LogOut,
  User,
  BarChart3,
  Settings,
  Bookmark,
  Flame,
  Sparkles,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

const Header = () => {
  const [open, setOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Lock body scroll when mobile menu open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "auto";
  }, [open]);

  const navItems = [
    { 
      path: "/", 
      label: "Home", 
      icon: <Home className="w-4 h-4" />,
      highlight: false 
    },
    { 
      path: "/hiragana", 
      label: "Hiragana", 
      icon: <span className="text-lg font-bold">あ</span>,
      highlight: false 
    },
    { 
      path: "/katakana", 
      label: "Katakana", 
      icon: <span className="text-lg font-bold">ア</span>,
      highlight: false 
    },
    { 
      path: "/kana-quiz", 
      label: "Kana Quiz", 
      icon: <Target className="w-4 h-4" />,
      highlight: true 
    },
    { 
      path: "/flashcards", 
      label: "Flashcards", 
      icon: <BookOpen className="w-4 h-4" />,
      highlight: false 
    },
  ];

  const isActive = (path: string) =>
    path === "/" ? location.pathname === "/" : location.pathname.startsWith(path);

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    navigate("/");
  };

  return (
    <>
      {/* ================= HEADER ================= */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="h-16 flex items-center justify-between">
            
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="relative">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 via-purple-500 to-blue-500 flex items-center justify-center group-hover:scale-105 transition-transform duration-300 shadow-lg">
                  <span className="text-2xl font-bold text-white tracking-wider">日</span>
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full animate-pulse">
                  <Sparkles className="w-3 h-3 text-white" />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold bg-gradient-to-r from-red-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
                  NihongoMaster
                </span>
                <span className="text-xs text-gray-500">Learn Japanese Today</span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`relative px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center gap-2 group
                    ${isActive(item.path)
                      ? "text-red-600 bg-gradient-to-r from-red-50 to-pink-50 border border-red-100"
                      : "text-gray-700 hover:text-red-600 hover:bg-gray-50"
                    }`}
                >
                  {item.icon}
                  {item.label}
                  {item.highlight && (
                    <span className="absolute -top-1 -right-1">
                      <Flame className="w-3 h-3 text-orange-500 animate-pulse" />
                    </span>
                  )}
                  {/* Hover underline effect */}
                  <span className={`absolute bottom-0 left-4 right-4 h-0.5 bg-gradient-to-r from-red-500 to-blue-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ${isActive(item.path) ? "scale-x-100" : ""}`} />
                </Link>
              ))}
              
              {/* Admin Link */}
              {user?.role === "ADMIN" && (
                <Link
                  to="/admin"
                  className="px-4 py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-red-50 to-orange-50 text-red-700 border border-red-200 flex items-center gap-2 hover:shadow-md transition-shadow"
                >
                  <Shield className="w-4 h-4" />
                  Admin
                </Link>
              )}
            </nav>

            {/* User Section */}
            <div className="flex items-center gap-3">
              {user ? (
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-gray-50 transition-colors border border-gray-200 group"
                  >
                    <div className="relative">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-red-100 to-blue-100 flex items-center justify-center group-hover:scale-105 transition-transform">
                        <UserCircle className="w-7 h-7 text-gray-700" />
                      </div>
                      {user?.streak && user.streak > 0 && (
                        <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center border border-white">
                          <span className="text-xs font-bold text-white">{user.streak}</span>
                        </div>
                      )}
                    </div>
                    <ChevronDown
                      className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${
                        dropdownOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {/* Dropdown Menu */}
                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-2xl shadow-xl z-50 overflow-hidden backdrop-blur-sm bg-white/95">
                      {/* User Info */}
                      <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-red-200 to-blue-200 flex items-center justify-center">
                            <User className="w-6 h-6 text-gray-700" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-bold text-gray-900 truncate">{user.name}</h3>
                            <p className="text-xs text-gray-500 truncate">{user.email}</p>
                          </div>
                        </div>
                      </div>

                      {/* Menu Items */}
                      <div className="py-2">
                        <Link
                          to="/profile"
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 text-gray-700 transition-colors group"
                        >
                          <User className="w-4 h-4 text-gray-500 group-hover:text-red-500" />
                          <span>Profile</span>
                        </Link>
                        <Link
                          to="/progress"
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 text-gray-700 transition-colors group"
                        >
                          <BarChart3 className="w-4 h-4 text-gray-500 group-hover:text-red-500" />
                          <span>Progress</span>
                        </Link>
                        <Link
                          to="/bookmarks"
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 text-gray-700 transition-colors group"
                        >
                          <Bookmark className="w-4 h-4 text-gray-500 group-hover:text-red-500" />
                          <span>Bookmarks</span>
                        </Link>
                        <Link
                          to="/settings"
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 text-gray-700 transition-colors group"
                        >
                          <Settings className="w-4 h-4 text-gray-500 group-hover:text-red-500" />
                          <span>Settings</span>
                        </Link>
                      </div>

                      {/* Logout */}
                      <div className="border-t border-gray-100 p-2">
                        <button
                          onClick={handleLogout}
                          className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors group"
                        >
                          <LogOut className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="hidden md:flex items-center gap-3">
                  <Link
                    to="/login"
                    className="px-4 py-2.5 rounded-xl text-sm font-semibold text-gray-700 hover:text-red-600 hover:bg-gray-50 transition-colors"
                  >
                    Log In
                  </Link>
                  <Link
                    to="/register"
                    className="px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-red-500 to-blue-500 hover:shadow-lg hover:shadow-red-500/25 transition-all duration-300 transform hover:-translate-y-0.5"
                  >
                    Get Started Free
                  </Link>
                </div>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={() => setOpen(!open)}
                className="lg:hidden w-10 h-10 flex items-center justify-center rounded-xl hover:bg-gray-50 transition-colors border border-gray-200 ml-2"
                aria-label="Toggle menu"
              >
                {open ? (
                  <X className="w-5 h-5 text-gray-700" />
                ) : (
                  <Menu className="w-5 h-5 text-gray-700" />
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ================= MOBILE MENU ================= */}
      {open && (
        <>
          {/* Overlay with blur effect */}
          <div
            className="fixed inset-0 z-30 bg-black/40 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />

          {/* Slide-in Drawer */}
          <div className="fixed right-0 top-0 z-40 h-full w-80 bg-white shadow-2xl transform transition-transform duration-300 ease-out">
            {/* Drawer Header */}
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 via-purple-500 to-blue-500 flex items-center justify-center">
                    <span className="text-2xl font-bold text-white">日</span>
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">Menu</h2>
                    <p className="text-xs text-gray-500">NihongoMaster</p>
                  </div>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  className="w-10 h-10 rounded-xl flex items-center justify-center hover:bg-gray-100 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Navigation Items */}
            <div className="p-4 space-y-1">
              {navItems.map((item) => {
                const IconElement = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3.5 rounded-xl font-semibold transition-all
                      ${
                        isActive(item.path)
                          ? "bg-gradient-to-r from-red-50 to-pink-50 text-red-700 border border-red-100"
                          : "text-gray-900 hover:bg-gray-50"
                      }`}
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      isActive(item.path) 
                        ? "bg-gradient-to-r from-red-500 to-pink-500" 
                        : "bg-gray-100"
                    }`}>
                      {item.icon && cloneElement(IconElement as React.ReactElement, {
                        className: `w-4 h-4 ${isActive(item.path) ? "text-white" : "text-gray-600"}`
                      })}
                    </div>
                    {item.label}
                    {item.highlight && (
                      <Flame className="w-4 h-4 text-orange-500 ml-auto" />
                    )}
                  </Link>
                );
              })}

              {/* Admin Mobile Link */}
              {user?.role === "ADMIN" && (
                <Link
                  to="/admin"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 px-4 py-3.5 rounded-xl font-semibold bg-gradient-to-r from-red-50 to-orange-50 text-red-700 border border-red-200"
                >
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-red-500 to-orange-500 flex items-center justify-center">
                    <Shield className="w-4 h-4 text-white" />
                  </div>
                  Admin Panel
                </Link>
              )}
            </div>

            {/* User Section Mobile */}
            <div className="p-4 border-t border-gray-100">
              {user ? (
                <>
                  <div className="px-4 py-3 mb-3 bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-200">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-red-200 to-blue-200 flex items-center justify-center">
                        <UserCircle className="w-8 h-8 text-gray-700" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-900">{user.name}</h3>
                        <p className="text-xs text-gray-500 truncate">{user.email}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <Link
                      to="/profile"
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-50 text-gray-700"
                    >
                      <User className="w-4 h-4" />
                      Profile
                    </Link>
                    <Link
                      to="/progress"
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-50 text-gray-700"
                    >
                      <BarChart3 className="w-4 h-4" />
                      Progress
                    </Link>
                    <Link
                      to="/settings"
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-50 text-gray-700"
                    >
                      <Settings className="w-4 h-4" />
                      Settings
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-red-600 hover:bg-red-50"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                </>
              ) : (
                <div className="space-y-3">
                  <Link
                    to="/login"
                    onClick={() => setOpen(false)}
                    className="block px-4 py-3 text-center rounded-xl font-semibold text-gray-700 hover:bg-gray-50 border border-gray-200"
                  >
                    Log In
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setOpen(false)}
                    className="block px-4 py-3 text-center rounded-xl font-semibold text-white bg-gradient-to-r from-red-500 to-blue-500 hover:shadow-lg"
                  >
                    Start Learning Free
                  </Link>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-gray-100">
              <p className="text-xs text-gray-500 text-center">
                © {new Date().getFullYear()} NihongoMaster. Master Japanese with joy.
              </p>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Header;