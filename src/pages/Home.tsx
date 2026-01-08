// pages/Home.tsx
import { useNavigate } from "react-router-dom";
import { 
  BookOpen, 
  Volume2, 
  Award, 
  ArrowRight, 
  Brain, 
  TrendingUp, 
  Users, 
  CheckCircle, 
  Play, 
  Layers,
  Settings,
  BarChart3,
  Sparkles
} from "lucide-react";

const Home = () => {
  const navigate = useNavigate();

  const learningFeatures = [
    {
      title: "Hiragana Mastery",
      description: "Master all 46 basic hiragana characters with interactive lessons",
      icon: <span className="text-4xl font-bold text-red-600">あ</span>,
      link: "/hiragana",
      color: "bg-red-50 hover:bg-red-100",
      stats: "46 Characters",
      status: "available",
      buttonText: "Start Learning"
    },
    {
      title: "Katakana Training",
      description: "Learn katakana used for foreign words and technical terms",
      icon: <span className="text-4xl font-bold text-blue-600">ア</span>,
      link: "/katakana",
      color: "bg-blue-50 hover:bg-blue-100",
      stats: "46 Characters",
      status: "available",
      buttonText: "Start Learning"
    },
    {
      title: "Smart Flashcards",
      description: "Spaced repetition system with audio and multiple quiz modes",
      icon: <Brain className="w-10 h-10 text-purple-600" />,
      link: "/flashcards",
      color: "bg-purple-50 hover:bg-purple-100",
      stats: "3 Study Modes",
      status: "available",
      buttonText: "Practice Now"
    },
    {
      title: "Progress Tracking",
      description: "Monitor your learning journey with detailed analytics",
      icon: <BarChart3 className="w-10 h-10 text-green-600" />,
      link: "/progress",
      color: "bg-green-50 hover:bg-green-100",
      stats: "Real-time Stats",
      status: "available",
      buttonText: "View Progress"
    }
  ];

  const comingSoonFeatures = [
    {
      title: "Kanji Journey",
      description: "Start with N5 level kanji and build your way up",
      icon: <span className="text-3xl font-bold text-amber-600">漢</span>,
      stats: "Coming Soon"
    },
    {
      title: "Grammar Lessons",
      description: "Learn sentence structure and common patterns",
      icon: <BookOpen className="w-10 h-10 text-cyan-600" />,
      stats: "Coming Soon"
    },
    {
      title: "Speaking Practice",
      description: "Pronunciation training with voice recognition",
      icon: <Volume2 className="w-10 h-10 text-pink-600" />,
      stats: "Coming Soon"
    }
  ];

  const stats = [
    { 
      label: "Active Learners", 
      value: "1,247", 
      icon: Users,
      color: "text-blue-600 bg-blue-50"
    },
    { 
      label: "Characters Mastered", 
      value: "92/92", 
      icon: CheckCircle,
      color: "text-green-600 bg-green-50"
    },
    { 
      label: "Average Success Rate", 
      value: "94%", 
      icon: TrendingUp,
      color: "text-purple-600 bg-purple-50"
    },
    { 
      label: "Study Hours Saved", 
      value: "2,548", 
      icon: Award,
      color: "text-red-600 bg-red-50"
    }
  ];

  const quickActions = [
    {
      title: "Continue Learning",
      description: "Pick up where you left off",
      action: () => {
        // Get last visited page from localStorage
        const lastPage = localStorage.getItem("lastVisitedPage") || "/hiragana";
        navigate(lastPage);
      },
      color: "from-red-500 to-orange-500",
      icon: Play
    },
    {
      title: "Daily Review",
      description: "Review due flashcards",
      action: () => navigate("/flashcards?mode=review"),
      color: "from-blue-500 to-cyan-500",
      icon: Brain
    },
    {
      title: "Settings",
      description: "Customize your experience",
      action: () => navigate("/settings"),
      color: "from-gray-600 to-gray-800",
      icon: Settings
    }
  ];

  // Check user progress from localStorage
  const getLearnedCount = () => {
    const hiragana = JSON.parse(localStorage.getItem("learnedHiragana") || "[]");
    const katakana = JSON.parse(localStorage.getItem("learnedKatakana") || "[]");
    return hiragana.length + katakana.length;
  };

  const learnedCount = getLearnedCount();
  const totalCount = 92; // 46 hiragana + 46 katakana
  const progressPercent = Math.round((learnedCount / totalCount) * 100);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-blue-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-red-500 to-blue-600 text-white">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 pt-20 pb-16">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                <Sparkles className="w-4 h-4" />
                <span className="text-sm">New: Flashcards & Progress Tracking</span>
              </div>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Master Japanese
              <br />
              <span className="text-yellow-300">Together</span>
            </h1>
            <p className="text-xl mb-10 opacity-90 max-w-2xl mx-auto">
              Learn Hiragana, Katakana, and more through interactive lessons, 
              smart flashcards, and personalized progress tracking.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate("/flashcards")}
                className="inline-flex items-center justify-center gap-2 bg-white text-red-600 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-gray-100 transition transform hover:-translate-y-1 shadow-lg hover:shadow-xl"
              >
                <Play className="w-5 h-5" />
                Get Started Now
              </button>
              <button
                onClick={() => navigate("/hiragana")}
                className="inline-flex items-center justify-center gap-2 bg-transparent border-2 border-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-white/10 transition"
              >
                Explore Features <ArrowRight className="w-5 h-5" />
              </button>
            </div>

            {/* Progress Bar for Returning Users */}
            {learnedCount > 0 && (
              <div className="mt-12 max-w-md mx-auto bg-white/20 backdrop-blur-sm rounded-xl p-4">
                <div className="flex justify-between text-sm mb-2">
                  <span>Your Progress</span>
                  <span>{progressPercent}%</span>
                </div>
                <div className="h-2 bg-white/30 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-yellow-300 transition-all duration-500"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
                <p className="text-sm mt-2">
                  {learnedCount} of {totalCount} characters learned
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="max-w-7xl mx-auto px-4 -mt-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {quickActions.map((action, index) => (
            <button
              key={index}
              onClick={action.action}
              className={`bg-gradient-to-r ${action.color} text-white rounded-2xl p-6 text-left hover:shadow-2xl transition-all transform hover:-translate-y-1`}
            >
              <div className="flex items-center justify-between mb-4">
                <action.icon className="w-8 h-8" />
                <ArrowRight className="w-5 h-5 opacity-75" />
              </div>
              <h3 className="text-xl font-bold mb-2">{action.title}</h3>
              <p className="text-white/90 text-sm">{action.description}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Stats Section */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div key={index} className={`p-6 rounded-2xl ${stat.color} shadow-sm`}>
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-lg bg-white/50">
                  <stat.icon className="w-5 h-5" />
                </div>
              </div>
              <div className="text-3xl font-bold">{stat.value}</div>
              <div className="text-sm opacity-80">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Learning Features */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Start Your Journey</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Everything you need to master Japanese characters, built with modern learning science.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {learningFeatures.map((feature, index) => (
            <div
              key={index}
              onClick={() => navigate(feature.link)}
              className={`${feature.color} rounded-2xl shadow-lg p-6 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer border border-transparent hover:border-gray-200`}
            >
              <div className="flex items-center justify-center w-16 h-16 rounded-xl mb-6">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
              <p className="text-gray-600 text-sm mb-4">{feature.description}</p>
              <div className="flex items-center justify-between mt-6">
                <span className="text-xs font-medium text-gray-500 px-3 py-1 bg-white rounded-full">
                  {feature.stats}
                </span>
                <button className="flex items-center text-sm font-semibold hover:gap-2 transition-all">
                  {feature.buttonText} <ArrowRight className="w-4 h-4 ml-1" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Coming Soon Features */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Coming Soon</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Exciting new features to help you become fluent in Japanese.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {comingSoonFeatures.map((feature, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-lg p-8">
                <div className="flex items-center justify-center w-16 h-16 rounded-xl mb-6 bg-gray-50">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 mb-4">{feature.description}</p>
                <div className="mt-6">
                  <span className="text-xs font-medium text-gray-400 px-3 py-1 bg-gray-100 rounded-full">
                    {feature.stats}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          Learn Smart, Not Hard
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <BookOpen className="w-10 h-10 text-red-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Interactive Lessons</h3>
            <p className="text-gray-600">
              Learn with visual memory aids, audio pronunciation, and cultural context
            </p>
          </div>
          <div className="text-center">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Brain className="w-10 h-10 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Smart Practice</h3>
            <p className="text-gray-600">
              Spaced repetition flashcards adapt to your learning pace
            </p>
          </div>
          <div className="text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <TrendingUp className="w-10 h-10 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Track Progress</h3>
            <p className="text-gray-600">
              Detailed analytics show your improvement and keep you motivated
            </p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Ready to Start Your Japanese Journey?
          </h2>
          <p className="text-xl opacity-90 mb-10 max-w-2xl mx-auto">
            Join thousands of learners who are mastering Japanese with our platform.
          </p>
          <button
            onClick={() => navigate("/register")}
            className="inline-flex items-center justify-center gap-2 bg-white text-blue-600 px-10 py-4 rounded-xl text-lg font-semibold hover:bg-gray-100 transition transform hover:scale-105 shadow-2xl"
          >
            <Sparkles className="w-5 h-5" />
            Start Learning Free
          </button>
          <p className="text-sm opacity-75 mt-6">No credit card required</p>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t bg-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <div className="text-2xl font-bold text-red-600">日本語</div>
              <p className="text-gray-500 text-sm">Learn Japanese the Smart Way</p>
            </div>
            <div className="flex gap-6">
              <button onClick={() => navigate("/about")} className="text-gray-600 hover:text-gray-900">
                About
              </button>
              <button onClick={() => navigate("/contact")} className="text-gray-600 hover:text-gray-900">
                Contact
              </button>
              <button onClick={() => navigate("/privacy")} className="text-gray-600 hover:text-gray-900">
                Privacy
              </button>
              <button onClick={() => navigate("/terms")} className="text-gray-600 hover:text-gray-900">
                Terms
              </button>
            </div>
          </div>
          <div className="text-center mt-8 text-gray-500 text-sm">
            <p>© {new Date().getFullYear()} Japanese Learning App • 一緒に学びましょう！ (Let's learn together!)</p>
            <p className="mt-2">🇯🇵 Made with ❤️ for Japanese learners worldwide</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;