// src/pages/jlpt/JLPTHome.tsx
import { BookOpen, GraduationCap, Target, Award, Users, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';

const JLPTHome = () => {
  const jlptLevels = [
    {
      level: "Basic",
      title: "Japanese Basics",
      description: "Start with Hiragana, Katakana, and essential phrases",
      icon: <BookOpen className="w-8 h-8" />,
      color: "bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200",
      textColor: "text-blue-700",
      accent: "from-blue-400 to-indigo-400",
      progress: 100,
      topics: ["Hiragana", "Katakana", "Basic Greetings"],
      link: "/jlpt/basic"
    },
    {
      level: "N5",
      title: "Beginner Level",
      description: "100 kanji, 800 vocabulary, basic grammar",
      icon: <GraduationCap className="w-8 h-8" />,
      color: "bg-gradient-to-br from-emerald-50 to-green-50 border-emerald-200",
      textColor: "text-emerald-700",
      accent: "from-emerald-400 to-green-400",
      progress: 85,
      topics: ["Vocabulary", "Grammar", "Listening"],
      link: "/jlpt/n5"
    },
    {
      level: "N4",
      title: "Elementary Level",
      description: "300 kanji, 1500 vocabulary, everyday conversations",
      icon: <Target className="w-8 h-8" />,
      color: "bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200",
      textColor: "text-amber-700",
      accent: "from-amber-400 to-orange-400",
      progress: 65,
      topics: ["More Kanji", "Complex Grammar", "Reading"],
      link: "/jlpt/n4"
    },
    {
      level: "N3",
      title: "Intermediate Level",
      description: "600 kanji, 3700 vocabulary, daily life topics",
      icon: <TrendingUp className="w-8 h-8" />,
      color: "bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200",
      textColor: "text-purple-700",
      accent: "from-purple-400 to-pink-400",
      progress: 30,
      topics: ["Business Japanese", "Newspaper Articles"],
      link: "/jlpt/n3"
    },
    {
      level: "N2",
      title: "Pre-Advanced",
      description: "1000 kanji, 6000 vocabulary, complex sentences",
      icon: <Users className="w-8 h-8" />,
      color: "bg-gradient-to-br from-red-50 to-rose-50 border-red-200",
      textColor: "text-red-700",
      accent: "from-red-400 to-rose-400",
      progress: 15,
      topics: ["Academic Texts", "Formal Documents"],
      link: "/jlpt/n2"
    },
    {
      level: "N1",
      title: "Advanced Level",
      description: "2000 kanji, 10000+ vocabulary, professional level",
      icon: <Award className="w-8 h-8" />,
      color: "bg-gradient-to-br from-gray-50 to-slate-50 border-gray-300",
      textColor: "text-gray-700",
      accent: "from-gray-400 to-slate-400",
      progress: 5,
      topics: ["Literature", "Technical Documents"],
      link: "/jlpt/n1"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Japanese-Language Proficiency Test (JLPT)
            </h1>
            <p className="text-xl text-indigo-100 max-w-3xl mx-auto">
              Master Japanese step by step with our structured learning paths
            </p>
          </div>
        </div>
      </div>

      {/* JLPT Levels Grid */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="mb-10">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Choose Your Level</h2>
          <p className="text-gray-600">
            Progress through the official JLPT levels from beginner to advanced
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jlptLevels.map((level) => (
            <Link
              key={level.level}
              to={level.link}
              className={`${level.color} border rounded-2xl p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group cursor-pointer`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 rounded-xl bg-white">
                  <div className={level.textColor}>
                    {level.icon}
                  </div>
                </div>
                <div className={`px-3 py-1 rounded-full text-sm font-semibold ${level.textColor} bg-white/80`}>
                  {level.level}
                </div>
              </div>

              <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-gray-900">
                {level.title}
              </h3>
              <p className="text-gray-600 mb-4">
                {level.description}
              </p>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium text-gray-700">Progress</span>
                  <span className="font-semibold">{level.progress}%</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full bg-gradient-to-r ${level.accent}`}
                    style={{ width: `${level.progress}%` }}
                  />
                </div>
              </div>

              {/* Topics */}
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex flex-wrap gap-2">
                  {level.topics.map((topic, idx) => (
                    <span 
                      key={idx}
                      className="px-3 py-1 bg-white text-gray-700 text-sm rounded-full border"
                    >
                      {topic}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* JLPT Info Section */}
      <div className="bg-white border-t">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="text-4xl font-bold text-indigo-600 mb-2">5</div>
              <h3 className="text-lg font-semibold mb-2">Official Levels</h3>
              <p className="text-gray-600">From N5 (beginner) to N1 (advanced)</p>
            </div>
            <div className="text-center p-6">
              <div className="text-4xl font-bold text-indigo-600 mb-2">4</div>
              <h3 className="text-lg font-semibold mb-2">Test Sections</h3>
              <p className="text-gray-600">Language Knowledge, Reading, Listening</p>
            </div>
            <div className="text-center p-6">
              <div className="text-4xl font-bold text-indigo-600 mb-2">180</div>
              <h3 className="text-lg font-semibold mb-2">Minute Test</h3>
              <p className="text-gray-600">Complete duration for N1 level</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JLPTHome;