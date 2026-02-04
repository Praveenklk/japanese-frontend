// pages/LearningHub.tsx
import { useNavigate } from "react-router-dom";
import { 
  BookOpen, 
  Languages, 
  MessageSquare, 
  BookText, 
  Users,
  Brain,
  GraduationCap,
  Sparkles,
  ArrowRight,
  Star,
  Target,
  WholeWord,
  Layers,
  Upload
} from "lucide-react";

const LearningHub = () => {
  const navigate = useNavigate();

  const learningModules = [
    {
      title: "Kanji Learning",
      japanese: "漢字学習",
      description: "Start with N5 level kanji and build your way up to advanced characters",
      icon: <span className="text-4xl font-bold text-amber-600">漢</span>,
      path: "/kanji",
      color: "bg-amber-50 hover:bg-amber-100 border-amber-200",
      level: "Beginner → Advanced",
      status: "available",
      stats: "2,136 Kanji"
    },
    {
      title: "Grammar Lessons",
      japanese: "文法レッスン",
      description: "Master Japanese sentence structure and common patterns",
      icon: <BookOpen className="w-10 h-10 text-blue-600" />,
      path: "/grammar",
      color: "bg-blue-50 hover:bg-blue-100 border-blue-200",
      level: "All Levels",
      status: "available",
      stats: "50+ Lessons"
    },
    {
      title: "Daily Conversation",
      japanese: "日常会話",
      description: "Practice real-life conversations with audio and transcripts",
      icon: <MessageSquare className="w-10 h-10 text-green-600" />,
      path: "/daily-conversation",
      color: "bg-green-50 hover:bg-green-100 border-green-200",
      level: "Beginner → Intermediate",
      status: "available",
      stats: "100+ Dialogues"
    },
    {
      title: "Vocabulary Builder",
      japanese: "語彙ビルダー",
      description: "Expand your vocabulary with themed word lists and quizzes",
      icon: <Brain className="w-10 h-10 text-purple-600" />,
      path: "/vocabulary",
      color: "bg-purple-50 hover:bg-purple-100 border-purple-200",
      level: "All Levels",
      status: "available",
      stats: "5,000+ Words"
    },
{
  title: "JLPT Vocabulary Trainer",
  japanese: "日本語能力試験 語彙",
  description: "Practice JLPT N5–N1 vocabulary with level-wise words and smart revision",
  icon: <WholeWord className="w-10 h-10 text-amber-600" />,
  path: "/master/vocab",
  color: "bg-amber-50 hover:bg-amber-100 border-amber-200",
  level: "N5 → N1",
  status: "available",
  stats: "8,000+ JLPT Words",
  buttonText: "Start JLPT Prep"
},
{
  title: "Anki Flashcards",
  japanese: "暗記フラッシュカード",
  description: "Learn Japanese using spaced repetition with Anki-style flashcards",
  icon: <Layers className="w-10 h-10 text-blue-600" />,
  path: "/anki/learn",
  color: "bg-blue-50 hover:bg-blue-100 border-blue-200",
  level: "All Levels",
  status: "available",
  stats: "Smart Review System",
  buttonText: "Start Learning"
},
{
  title: "Anki Deck Manager",
  japanese: "暗記デッキ管理",
  description: "Upload, manage, and customize your Anki decks for personalized study",
  icon: <Upload className="w-10 h-10 text-indigo-600" />,
  path: "/anki/master",
  color: "bg-indigo-50 hover:bg-indigo-100 border-indigo-200",
  level: "Advanced",
  status: "available",
  stats: "Import .apkg / CSV",
  buttonText: "Manage Decks"
},

{
  title: "Radical Explorer",
  japanese: "部首エクスプローラー",
  description: "Learn kanji radicals, understand their meanings, and break down kanji easily",
  icon: <Brain className="w-10 h-10 text-purple-600" />,
  path: "/radical",
  color: "bg-purple-50 hover:bg-purple-100 border-purple-200",
  level: "All Levels",
  status: "available",
  stats: "200+ Radicals"
},


    {
      title: "Short Stories",
      japanese: "ショートストーリー",
      description: "Read and listen to Japanese stories with vocabulary support",
      icon: <BookText className="w-10 h-10 text-pink-600" />,
      path: "/stories",
      color: "bg-pink-50 hover:bg-pink-100 border-pink-200",
      level: "Intermediate → Advanced",
      status: "available",
      stats: "25+ Stories"
    },
    {
      title: "Community",
      japanese: "コミュニティ",
      description: "Connect with other learners, share progress, and compete",
      icon: <Users className="w-10 h-10 text-cyan-600" />,
      path: "/community",
      color: "bg-cyan-50 hover:bg-cyan-100 border-cyan-200",
      level: "All Learners",
      status: "available",
      stats: "Live Leaderboard"
    },
{
  title: "N5 Vocabulary",
  japanese: "N5語彙",
  description: "Learn essential JLPT N5 words with meanings, examples, and practice",
  icon: <BookOpen className="w-10 h-10 text-blue-600" />,
  path: "/n5/voc",
  color: "bg-blue-50 hover:bg-blue-100 border-blue-200",
  level: "Beginner",
  status: "new",
  stats: "800+ Words"
}



  ];

  const quickAccess = [
    {
      title: "Kana Flashcards",
      description: "Review hiragana and katakana",
      path: "/flashcards",
      icon: <Brain className="w-5 h-5" />,
      color: "from-purple-500 to-pink-500"
    },
    {
      title: "Kana Quiz",
      description: "Test your character knowledge",
      path: "/kana-quiz",
      icon: <Target className="w-5 h-5" />,
      color: "from-red-500 to-orange-500"
    },
    {
      title: "Progress Tracker",
      description: "View your learning stats",
      path: "/progress",
      icon: <Star className="w-5 h-5" />,
      color: "from-blue-500 to-cyan-500"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              学習センター
              <br />
              <span className="text-yellow-300">Learning Center</span>
            </h1>
            <p className="text-xl opacity-90 max-w-3xl mx-auto">
              Your complete Japanese learning toolkit. Choose a module to start your journey.
            </p>
          </div>
        </div>
      </div>

      {/* Quick Access */}
      <div className="max-w-7xl mx-auto px-4 -mt-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {quickAccess.map((item, index) => (
            <button
              key={index}
              onClick={() => navigate(item.path)}
              className={`bg-gradient-to-r ${item.color} text-white rounded-2xl p-6 text-left hover:shadow-2xl transition-all transform hover:-translate-y-1`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  {item.icon}
                  <span className="text-sm opacity-90">クイックアクセス</span>
                </div>
                <ArrowRight className="w-5 h-5 opacity-75" />
              </div>
              <h3 className="text-xl font-bold mb-2">{item.title}</h3>
              <p className="text-white/90 text-sm">{item.description}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Main Learning Modules */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Learning Modules</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Choose from our comprehensive collection of Japanese learning resources
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {learningModules.map((module, index) => (
            <div
              key={index}
              onClick={() => navigate(module.path)}
              className={`${module.color} rounded-2xl shadow-lg p-6 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer border relative group`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl bg-white flex items-center justify-center group-hover:scale-110 transition-transform">
                    {module.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{module.title}</h3>
                    <p className="text-sm text-gray-600">{module.japanese}</p>
                  </div>
                </div>
              </div>
              
              <p className="text-gray-600 text-sm mb-6">{module.description}</p>
              
              <div className="flex items-center justify-between mt-6">
                <div className="flex flex-col">
                  <span className="text-xs font-medium text-gray-500 px-3 py-1 bg-white rounded-full border mb-1">
                    {module.stats}
                  </span>
                  <span className="text-xs font-medium text-blue-600 px-3 py-1 bg-blue-50 rounded-full">
                    {module.level}
                  </span>
                </div>
                <button className="flex items-center text-sm font-semibold text-blue-600 hover:text-blue-700 hover:gap-2 transition-all">
                  開始する
                  <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Coming Soon Section */}
        <div className="mt-20">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Coming Soon</h2>
            <p className="text-gray-600">More exciting features are on the way</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { title: "Listening Comprehension", level: "Intermediate+" },
              { title: "Writing Practice", level: "All Levels" },
              { title: "JLPT Test Prep", level: "N5 → N1" }
            ].map((item, index) => (
              <div key={index} className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">{item.title}</h4>
                    <p className="text-sm text-gray-500">{item.level}</p>
                  </div>
                  <Sparkles className="w-5 h-5 text-gray-400" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LearningHub;