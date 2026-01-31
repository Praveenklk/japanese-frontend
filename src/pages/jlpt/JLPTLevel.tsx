// src/pages/jlpt/JLPTLevel.tsx
import { Outlet, useParams, NavLink, useNavigate } from 'react-router-dom';
import { 
  BookOpen, Headphones, FileText, PenTool, 
  Award, TrendingUp, ArrowLeft, CheckCircle 
} from 'lucide-react';

const JLPTLevel = ({ level = "N5" }) => {
  const navigate = useNavigate();
  const { level: paramLevel } = useParams();
  const currentLevel = paramLevel || level;
  
  const levelInfo = {
    N5: {
      title: "JLPT N5 - Beginner Level",
      description: "Master basic Japanese for daily conversations",
      kanji: 100,
      vocabulary: 800,
      grammar: 70,
      color: "emerald",
      studyTime: "150-300 hours"
    },
    N4: {
      title: "JLPT N4 - Elementary Level", 
      description: "Understand basic Japanese in everyday situations",
      kanji: 300,
      vocabulary: 1500,
      grammar: 150,
      color: "amber",
      studyTime: "300-600 hours"
    },
    N3: {
      title: "JLPT N3 - Intermediate Level",
      description: "Comprehend Japanese used in everyday life",
      kanji: 600,
      vocabulary: 3700,
      grammar: 300,
      color: "purple",
      studyTime: "600-900 hours"
    }
  };

  const info = levelInfo[currentLevel as keyof typeof levelInfo] || levelInfo.N5;
  const colorClass = `text-${info.color}-600 bg-${info.color}-50 border-${info.color}-200`;

  const navItems = [
    {
      name: "Overview",
      path: "",
      icon: <Award className="w-5 h-5" />
    },
    {
      name: "Vocabulary",
      path: "vocabulary",
      icon: <BookOpen className="w-5 h-5" />
    },
    {
      name: "Grammar",
      path: "grammar",
      icon: <PenTool className="w-5 h-5" />
    },
    {
      name: "Kanji",
      path: "kanji",
      icon: <FileText className="w-5 h-5" />
    },
    {
      name: "Listening",
      path: "listening",
      icon: <Headphones className="w-5 h-5" />
    },
    {
      name: "Reading",
      path: "reading",
      icon: <FileText className="w-5 h-5" />
    },
    {
      name: "Practice Test",
      path: "practice-test",
      icon: <TrendingUp className="w-5 h-5" />
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className={`bg-gradient-to-r from-${info.color}-500 to-${info.color}-600 text-white`}>
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={() => navigate('/jlpt')}
              className="p-2 rounded-lg bg-white/20 hover:bg-white/30 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-3xl font-bold">{info.title}</h1>
              <p className="text-${info.color}-100">{info.description}</p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white/20 p-4 rounded-lg backdrop-blur-sm">
              <div className="text-2xl font-bold">{info.kanji}</div>
              <div className="text-sm opacity-90">Kanji</div>
            </div>
            <div className="bg-white/20 p-4 rounded-lg backdrop-blur-sm">
              <div className="text-2xl font-bold">{info.vocabulary}</div>
              <div className="text-sm opacity-90">Vocabulary</div>
            </div>
            <div className="bg-white/20 p-4 rounded-lg backdrop-blur-sm">
              <div className="text-2xl font-bold">{info.grammar}</div>
              <div className="text-sm opacity-90">Grammar Points</div>
            </div>
            <div className="bg-white/20 p-4 rounded-lg backdrop-blur-sm">
              <div className="text-2xl font-bold">{info.studyTime}</div>
              <div className="text-sm opacity-90">Study Time</div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="sticky top-0 z-10 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4">
          <nav className="flex space-x-1 overflow-x-auto py-2">
            {navItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                end={item.path === ""}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-4 py-3 rounded-lg transition-colors whitespace-nowrap ${
                    isActive
                      ? `bg-${info.color}-50 text-${info.color}-700 font-semibold`
                      : 'text-gray-600 hover:bg-gray-100'
                  }`
                }
              >
                {item.icon}
                <span>{item.name}</span>
              </NavLink>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Outlet />
      </div>
    </div>
  );
};

export default JLPTLevel;