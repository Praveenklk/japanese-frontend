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
  Sparkles,
  Target,
  Zap,
  Clock,
  Star,
  TrophyIcon,
  GraduationCap,
  Book
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
      title: "Kana Quiz Challenge",
      description: "Test your knowledge like Tofugu's Kana Quiz with customizable options",
      icon: <Target className="w-10 h-10 text-purple-600" />,
      link: "/kana-quiz",
      color: "bg-purple-50 hover:bg-purple-100",
      stats: "3 Quiz Modes",
      status: "new",
      buttonText: "Take Quiz"
    },
    {
      title: "Smart Flashcards",
      description: "Spaced repetition system with audio and multiple quiz modes",
      icon: <Brain className="w-10 h-10 text-green-600" />,
      link: "/flashcards",
      color: "bg-green-50 hover:bg-green-100",
      stats: "3 Study Modes",
      status: "available",
      buttonText: "Practice Now"
    },
    {
      title: "Progress Tracking",
      description: "Monitor your learning journey with detailed analytics",
      icon: <BarChart3 className="w-10 h-10 text-amber-600" />,
      link: "/progress",
      color: "bg-amber-50 hover:bg-amber-100",
      stats: "Real-time Stats",
      status: "available",
      buttonText: "View Progress"
    },
    
{
  title: "Kanji Explorer",
  description: "Explore kanji with meanings, readings, stroke count, and JLPT levels",
  icon: <Book className="w-10 h-10 text-cyan-600" />,
  link: "/kanji/value", // ✅ correct route
  color: "bg-cyan-50 hover:bg-cyan-100",
  stats: "JLPT N5–N1",
   status: "new",
  buttonText: "Explore Kanji"
},

    // In Home.tsx, add to learningFeatures array
{
  title: "Learning Hub",
  japaneseTitle: "学習センター",
  description: "Access all learning modules: Kanji, Grammar, Vocabulary, Stories and more",
  icon: <GraduationCap className="w-10 h-10 text-indigo-600" />,
  link: "/learn",
  color: "bg-indigo-50 hover:bg-indigo-100 border-indigo-200",
  stats: "6 Modules",
  status: "available",
  buttonText: "Explore All",
  progress: null
},
{
  title: "Story Hub",
  japaneseTitle: "読書ハブ",
  description: "Explore Japanese stories and improve your reading comprehension",
  icon: (
    <div className="relative flex items-center justify-center">
      <BookOpen className="w-10 h-10 text-blue-600" />
    </div>
  ),
  link: "/stories/access",
color:
  "bg-gradient-to-br from-violet-50 via-fuchsia-50 to-pink-50 " +
  "hover:from-violet-100 hover:to-pink-100 border-violet-200",

  stats: "Stories Library",
   status: "new",
  buttonText: "Read Stories",
  progress: null
}




  ];

  const quizFeatures = [
    {
      title: "Customizable Quiz",
      description: "Choose specific rows, dakuten, combos, and difficulty",
      icon: <Settings className="w-6 h-6 text-blue-600" />,
      color: "text-blue-600 bg-blue-50"
    },
    {
      title: "Multiple Modes",
      description: "Reading, Writing, and Listening quiz modes",
      icon: <Layers className="w-6 h-6 text-purple-600" />,
      color: "text-purple-600 bg-purple-50"
    },
    {
      title: "Instant Feedback",
      description: "Get immediate results with correct answers shown",
      icon: <CheckCircle className="w-6 h-6 text-green-600" />,
      color: "text-green-600 bg-green-50"
    },
    {
      title: "Time Tracking",
      description: "Race against the clock to improve your speed",
      icon: <Clock className="w-6 h-6 text-red-600" />,
      color: "text-red-600 bg-red-50"
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
      value: "1,847", 
      icon: Users,
      color: "text-blue-600 bg-blue-50"
    },
    { 
      label: "Characters Mastered", 
      value: `${getLearnedCount()}/92`, 
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
      label: "Quizzes Completed", 
      value: getQuizCount(), 
      icon: Target,
      color: "text-red-600 bg-red-50"
    }
  ];

  const quickActions = [
    {
      title: "Vocabulary Builder",
      description: "Test your knowledge with customizable quiz",
      action: () => navigate("/vocabulary"),
      color: "from-purple-500 to-pink-500",
      icon: Target,
      badge: "NEW"
    },
    {
      title: "Continue Learning",
      description: "Pick up where you left off",
      action: () => {
        const lastPage = localStorage.getItem("lastVisitedPage") || "/hiragana";
        navigate(lastPage);
      },
      color: "from-red-500 to-orange-500",
      icon: Play
    },
    {
  title: "Daily Story",
  description: "Read today’s story and improve your comprehension",
      action: () => navigate("/stories/access"),
      color: "from-blue-500 to-cyan-500",
      icon: Brain
    }
  ];

  // Check user progress from localStorage
  function getLearnedCount() {
    let count = 0;
    // Check hiragana
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('hiragana_') && localStorage.getItem(key) === 'true') {
        count++;
      }
    }
    // Check katakana
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('katakana_') && localStorage.getItem(key) === 'true') {
        count++;
      }
    }
    return count;
  }

  function getQuizCount() {
    const results = JSON.parse(localStorage.getItem('kanaQuizResults') || '[]');
    return results.length;
  }

  const learnedCount = getLearnedCount();
  const totalCount = 92; // 46 hiragana + 46 katakana
  const progressPercent = Math.round((learnedCount / totalCount) * 100);

  // Get recent quiz results
  function getRecentQuizResult() {
    const results = JSON.parse(localStorage.getItem('kanaQuizResults') || '[]');
    if (results.length > 0) {
      const latest = results[results.length - 1];
      return {
        score: latest.score,
        total: latest.total,
        accuracy: latest.accuracy,
        date: new Date(latest.date).toLocaleDateString()
      };
    }
    return null;
  }

  const recentQuiz = getRecentQuizResult();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-blue-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-purple-500 to-blue-600 text-white">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 pt-20 pb-16">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                <Sparkles className="w-4 h-4" />
                <span className="text-sm">NEW: Kana Quiz Challenge Launched! 🎯</span>
              </div>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Master Japanese
              <br />
              <span className="text-yellow-300">Like a Pro</span>
            </h1>
            <p className="text-xl mb-10 opacity-90 max-w-2xl mx-auto">
              Learn Hiragana, Katakana, and more through interactive lessons, 
              smart flashcards, and the ultimate Kana Quiz experience.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate("/kana-quiz")}
                className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:shadow-2xl transition transform hover:-translate-y-1 shadow-lg"
              >
                <Target className="w-5 h-5" />
                Try Kana Quiz
              </button>
              <button
                onClick={() => navigate("/kanji/value")}
                className="inline-flex items-center justify-center gap-2 bg-white text-blue-600 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-gray-100 transition transform hover:-translate-y-1 shadow-lg hover:shadow-xl"
              >
                <Play className="w-5 h-5" />
                Kanji Learning
              </button>
            </div>

            {/* Progress Bar for Returning Users */}
            {learnedCount > 0 && (
              <div className="mt-12 max-w-md mx-auto bg-white/20 backdrop-blur-sm rounded-xl p-4">
                <div className="flex justify-between text-sm mb-2">
                  <span className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-yellow-300" />
                    Your Progress
                  </span>
                  <span>{progressPercent}%</span>
                </div>
                <div className="h-2 bg-white/30 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-yellow-300 to-orange-400 transition-all duration-500"
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
              className={`bg-gradient-to-r ${action.color} text-white rounded-2xl p-6 text-left hover:shadow-2xl transition-all transform hover:-translate-y-1 relative`}
            >
              {action.badge && (
                <span className="absolute -top-2 -right-2 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold px-3 py-1 rounded-full animate-pulse">
                  {action.badge}
                </span>
              )}
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

      {/* Recent Quiz Result */}
      {recentQuiz && (
        <div className="max-w-7xl mx-auto px-4 mt-8">
          <div className="bg-gradient-to-r from-green-50 to-emerald-100 rounded-2xl p-6 shadow-lg border border-green-200">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-2 flex items-center gap-2">
                  <TrophyIcon className="w-5 h-5 text-yellow-600" />
                  Your Last Quiz Result
                </h3>
                <p className="text-gray-600">Completed on {recentQuiz.date}</p>
              </div>
              <div className="flex items-center gap-6 mt-4 md:mt-0">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">
                    {recentQuiz.score}/{recentQuiz.total}
                  </div>
                  <div className="text-sm text-gray-600">Score</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">
                    {recentQuiz.accuracy}%
                  </div>
                  <div className="text-sm text-gray-600">Accuracy</div>
                </div>
              </div>
              <button
                onClick={() => navigate("/kana-quiz")}
                className="mt-4 md:mt-0 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:shadow-lg transition flex items-center gap-2"
              >
                <Target className="w-4 h-4" />
                Try Again
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Stats Section */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div key={index} className={`p-6 rounded-2xl ${stat.color} shadow-sm hover:shadow-md transition-all transform hover:-translate-y-1`}>
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
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Your Learning Journey</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Everything you need to master Japanese characters, built with modern learning science.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {learningFeatures.map((feature, index) => (
            <div
              key={index}
              onClick={() => navigate(feature.link)}
              className={`${feature.color} rounded-2xl shadow-lg p-6 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer border border-transparent hover:border-gray-200 relative group`}
            >
              {feature.status === "new" && (
                <span className="absolute -top-2 -right-2 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold px-3 py-1 rounded-full animate-pulse">
                  NEW
                </span>
              )}
              <div className="flex items-center justify-center w-16 h-16 rounded-xl mb-6 group-hover:scale-110 transition-transform">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
              <p className="text-gray-600 text-sm mb-4">{feature.description}</p>
              <div className="flex items-center justify-between mt-6">
                <span className="text-xs font-medium text-gray-500 px-3 py-1 bg-white rounded-full">
                  {feature.stats}
                </span>
                <button className="flex items-center text-sm font-semibold text-blue-600 hover:text-blue-700 hover:gap-2 transition-all">
                  {feature.buttonText} <ArrowRight className="w-4 h-4 ml-1" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Kana Quiz Highlight */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="lg:w-1/2">
              <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm mb-6">
                <Target className="w-5 h-5 text-purple-600" />
                <span className="text-sm font-medium text-purple-600">NEW FEATURE</span>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Ultimate Kana Quiz Challenge
              </h2>
              <p className="text-gray-600 mb-8 text-lg">
                Inspired by Tofugu's Kana Quiz, our advanced quiz system lets you test your 
                knowledge with customizable settings, multiple modes, and detailed analytics.
              </p>
              
              <div className="grid grid-cols-2 gap-4 mb-8">
                {quizFeatures.map((feature, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${feature.color}`}>
                      {feature.icon}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{feature.title}</h4>
                      <p className="text-sm text-gray-600">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => navigate("/kana-quiz")}
                  className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:shadow-xl transition transform hover:-translate-y-1"
                >
                  <Target className="w-5 h-5" />
                  Start Quiz Challenge
                </button>
                <button
                  onClick={() => navigate("/flashcards")}
                  className="inline-flex items-center justify-center gap-2 bg-white border border-purple-200 text-purple-600 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-purple-50 transition"
                >
                  <Brain className="w-5 h-5" />
                  Practice First
                </button>
              </div>
            </div>
            
            <div className="lg:w-1/2">
              <div className="bg-white rounded-2xl shadow-2xl p-8 border border-purple-200">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
                    <Target className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">Quiz Preview</h3>
                    <p className="text-gray-600">Try a sample question</p>
                  </div>
                </div>
                
                <div className="space-y-6">
                  <div className="text-center p-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl">
                    <div className="text-6xl font-bold text-gray-900 mb-4">あ</div>
                    <p className="text-lg font-medium text-gray-700">What is the romaji for this character?</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <button className="p-4 bg-gray-50 hover:bg-gray-100 rounded-lg text-center transition">
                      <span className="font-mono text-lg">a</span>
                    </button>
                    <button className="p-4 bg-gray-50 hover:bg-gray-100 rounded-lg text-center transition">
                      <span className="font-mono text-lg">i</span>
                    </button>
                    <button className="p-4 bg-gray-50 hover:bg-gray-100 rounded-lg text-center transition">
                      <span className="font-mono text-lg">u</span>
                    </button>
                    <button className="p-4 bg-gray-50 hover:bg-gray-100 rounded-lg text-center transition">
                      <span className="font-mono text-lg">e</span>
                    </button>
                  </div>
                  
                  <div className="pt-4 border-t border-gray-200">
                    <p className="text-sm text-gray-500 text-center">
                      Real quiz includes dakuten, combos, and timing
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
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
              <div key={index} className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-all transform hover:-translate-y-2">
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
          <div className="text-center p-6">
            <div className="w-20 h-20 bg-gradient-to-r from-red-500 to-orange-400 rounded-full flex items-center justify-center mx-auto mb-6">
              <BookOpen className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Learn with Flashcards</h3>
            <p className="text-gray-600">
              Master characters with spaced repetition and smart review scheduling
            </p>
          </div>
          <div className="text-center p-6">
            <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full flex items-center justify-center mx-auto mb-6">
              <Target className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Test with Quizzes</h3>
            <p className="text-gray-600">
              Challenge yourself with customizable quizzes and track your progress
            </p>
          </div>
          <div className="text-center p-6">
            <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-400 rounded-full flex items-center justify-center mx-auto mb-6">
              <TrendingUp className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">See Your Growth</h3>
            <p className="text-gray-600">
              Watch your skills improve with detailed analytics and progress tracking
            </p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-purple-500 to-blue-600 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Ready to Master Japanese?
          </h2>
          <p className="text-xl opacity-90 mb-10 max-w-2xl mx-auto">
            Join thousands of learners who are mastering Japanese with our complete platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate("/kana-quiz")}
              className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white px-10 py-4 rounded-xl text-lg font-semibold hover:shadow-2xl transition transform hover:scale-105"
            >
              <Target className="w-5 h-5" />
              Start with Quiz
            </button>
            <button
              onClick={() => navigate("/register")}
              className="inline-flex items-center justify-center gap-2 bg-white text-blue-600 px-10 py-4 rounded-xl text-lg font-semibold hover:bg-gray-100 transition transform hover:scale-105 shadow-2xl"
            >
              <Sparkles className="w-5 h-5" />
              Create Free Account
            </button>
          </div>
          <p className="text-sm opacity-75 mt-6">No credit card required • Start learning in seconds</p>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t bg-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <div className="text-2xl font-bold text-red-600 flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-purple-600" />
                日本語 Master
              </div>
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