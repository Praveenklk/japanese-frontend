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
  Trophy,
  GraduationCap,
  Book,
  Heart,
  Shield,
  Globe,
  Coffee,
  Compass,
  Music,
  BookText,
  Languages,
  Notebook,
  Leaf,
  ChevronRight,
  Rocket,
  Crown,
  Timer,
  Medal,
  Target as TargetIcon,
  Flame,
  Bookmark,
  Search,
  Eye,
  Mic,
  PenTool,
  MousePointerClick,
  Zap as Lightning,
  Globe as Earth,
  Users as Community,
  Award as Badge
} from "lucide-react";

const Home = () => {
  const navigate = useNavigate();

  const learningJourney = [
    {
      stage: 1,
      title: "Start with Kana",
      description: "Master Hiragana & Katakana fundamentals",
      icon: <span className="text-3xl font-bold text-pink-600">あ</span>,
      features: ["46 Hiragana", "46 Katakana", "Audio Pronunciation"],
      color: "from-pink-500 to-rose-500",
      link: "/hiragana",
      gradient: "bg-gradient-to-r from-pink-500 to-rose-500"
    },
    {
      stage: 2,
      title: "Practice & Quiz",
      description: "Reinforce with flashcards and tests",
      icon: <Target className="w-8 h-8 text-blue-600" />,
      features: ["Smart Flashcards", "Kana Quiz", "Progress Tracking"],
      color: "from-blue-500 to-cyan-500",
      link: "/kana-quiz",
      gradient: "bg-gradient-to-r from-blue-500 to-cyan-500"
    },
    {
      stage: 3,
      title: "Expand Knowledge",
      description: "Explore Kanji and vocabulary",
      icon: <span className="text-3xl font-bold text-amber-600">漢</span>,
      features: ["JLPT Kanji", "Vocabulary Builder", "Grammar"],
      color: "from-amber-500 to-orange-500",
      link: "/kanji/value",
      gradient: "bg-gradient-to-r from-amber-500 to-orange-500"
    },
    {
      stage: 4,
      title: "Apply Skills",
      description: "Read stories and build fluency",
      icon: <BookOpen className="w-8 h-8 text-emerald-600" />,
      features: ["Japanese Stories", "Reading Practice", "Comprehension"],
      color: "from-emerald-500 to-green-500",
      link: "/stories/access",
      gradient: "bg-gradient-to-r from-emerald-500 to-green-500"
    }
  ];

  const learningFeatures = [
    {
      title: "Hiragana Mastery",
      description: "Master all 46 basic hiragana characters with interactive lessons",
      icon: <span className="text-4xl font-bold text-red-600">あ</span>,
      link: "/hiragana",
      color: "bg-gradient-to-br from-red-50 to-pink-50 border-red-100",
      stats: "46 Characters",
      status: "available",
      buttonText: "Start Learning",
      accent: "from-red-500 to-pink-500"
    },
    {
      title: "Katakana Training",
      description: "Learn katakana used for foreign words and technical terms",
      icon: <span className="text-4xl font-bold text-blue-600">ア</span>,
      link: "/katakana",
      color: "bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-100",
      stats: "46 Characters",
      status: "available",
      buttonText: "Start Learning",
      accent: "from-blue-500 to-cyan-500"
    },
    {
      title: "Kana Quiz Challenge",
      description: "Test your knowledge with customizable quiz options",
      icon: <Target className="w-10 h-10 text-purple-600" />,
      link: "/kana-quiz",
      color: "bg-gradient-to-br from-purple-50 to-violet-50 border-purple-100",
      stats: "3 Quiz Modes",
      status: "new",
      buttonText: "Take Quiz",
      accent: "from-purple-500 to-violet-500",
      badge: "HOT"
    },
    {
      title: "Smart Flashcards",
      description: "Spaced repetition system with audio and multiple quiz modes",
      icon: <Brain className="w-10 h-10 text-green-600" />,
      link: "/flashcards",
      color: "bg-gradient-to-br from-green-50 to-emerald-50 border-green-100",
      stats: "3 Study Modes",
      status: "available",
      buttonText: "Practice Now",
      accent: "from-green-500 to-emerald-500"
    },
    {
      title: "Kanji Explorer",
      description: "Explore kanji with meanings, readings, stroke count, and JLPT levels",
      icon: <Book className="w-10 h-10 text-amber-600" />,
      link: "/kanji/value",
      color: "bg-gradient-to-br from-amber-50 to-orange-50 border-amber-100",
      stats: "JLPT N5–N1",
      status: "new",
      buttonText: "Explore Kanji",
      accent: "from-amber-500 to-orange-500"
    },
    {
  title: "JLPT Learning Path",
  description: "Structured lessons from N5 to N1 with vocabulary, grammar, and tests",
  icon: <GraduationCap className="w-10 h-10 text-indigo-600" />,
  link: "/jlpt",
  color: "bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-100",
  stats: "N5-N1 Complete",
  status: "available",
  buttonText: "Start Learning",
  accent: "from-indigo-500 to-purple-500"
},
    {
      title: "Story Hub",
      description: "Explore Japanese stories and improve reading comprehension",
      icon: <BookOpen className="w-10 h-10 text-indigo-600" />,
      link: "/stories/access",
      color: "bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-100",
      stats: "Stories Library",
      status: "new",
      buttonText: "Read Stories",
      accent: "from-indigo-500 to-purple-500"
    },
    {
      title: "Learning Hub",
      description: "Access all learning modules: Grammar, Vocabulary, and more",
      icon: <GraduationCap className="w-10 h-10 text-cyan-600" />,
      link: "/learn",
      color: "bg-gradient-to-br from-cyan-50 to-blue-50 border-cyan-100",
      stats: "6 Modules",
      status: "available",
      buttonText: "Explore All",
      accent: "from-cyan-500 to-blue-500"
    },
    {
      title: "Progress Dashboard",
      description: "Monitor your learning journey with detailed analytics",
      icon: <BarChart3 className="w-10 h-10 text-violet-600" />,
      link: "/progress",
      color: "bg-gradient-to-br from-violet-50 to-fuchsia-50 border-violet-100",
      stats: "Real-time Stats",
      status: "available",
      buttonText: "View Progress",
      accent: "from-violet-500 to-fuchsia-500"
    }
  ];

  const quizFeatures = [
    {
      title: "Customizable Quiz",
      description: "Choose specific rows, dakuten, combos, and difficulty",
      icon: <Settings className="w-7 h-7" />,
      color: "bg-gradient-to-r from-blue-100 to-blue-50 border-blue-200"
    },
    {
      title: "Multiple Modes",
      description: "Reading, Writing, and Listening quiz modes",
      icon: <Layers className="w-7 h-7" />,
      color: "bg-gradient-to-r from-purple-100 to-purple-50 border-purple-200"
    },
    {
      title: "Instant Feedback",
      description: "Get immediate results with correct answers shown",
      icon: <CheckCircle className="w-7 h-7" />,
      color: "bg-gradient-to-r from-green-100 to-green-50 border-green-200"
    },
    {
      title: "Time Tracking",
      description: "Race against the clock to improve your speed",
      icon: <Timer className="w-7 h-7" />,
      color: "bg-gradient-to-r from-red-100 to-red-50 border-red-200"
    }
  ];

  // Check user progress from localStorage
  function getLearnedCount() {
    let count = 0;
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && (key.startsWith('hiragana_') || key.startsWith('katakana_')) && localStorage.getItem(key) === 'true') {
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
  const totalCount = 92;
  const progressPercent = Math.round((learnedCount / totalCount) * 100);

  const stats = [
    { 
      label: "Active Learners", 
      value: "2,847", 
      icon: Community,
      color: "from-blue-400 to-cyan-400",
      change: "+18% this month",
      trend: "up"
    },
    { 
      label: "Characters Mastered", 
      value: `${learnedCount}/92`, 
      icon: Medal,
      color: "from-emerald-400 to-green-400",
      change: "Your progress",
      trend: "progress"
    },
    { 
      label: "Average Success Rate", 
      value: "94%", 
      icon: TrendingUp,
      color: "from-purple-400 to-pink-400",
      change: "+4% from last month",
      trend: "up"
    },
    { 
      label: "Quizzes Completed", 
      value: getQuizCount(), 
      icon: TargetIcon,
      color: "from-rose-400 to-red-400",
      change: "Keep it up!",
      trend: "steady"
    }
  ];

  const quickActions = [
    {
      title: "Continue Learning",
      description: "Pick up where you left off",
      action: () => {
        const lastPage = localStorage.getItem("lastVisitedPage") || "/hiragana";
        navigate(lastPage);
      },
      color: "from-orange-500 to-red-500",
      icon: Play,
      gradient: "bg-gradient-to-r from-orange-500 to-red-500"
    },
    {
      title: "Daily Challenge",
      description: "Test your knowledge with today's quiz",
      action: () => navigate("/kana-quiz"),
      color: "from-purple-500 to-pink-500",
      icon: Target,
      gradient: "bg-gradient-to-r from-purple-500 to-pink-500",
      badge: "NEW"
    },
    {
      title: "Read Today's Story",
      description: "Improve your reading comprehension",
      action: () => navigate("/stories/access"),
      color: "from-blue-500 to-cyan-500",
      icon: BookText,
      gradient: "bg-gradient-to-r from-blue-500 to-cyan-500"
    }
  ];

  function getRecentQuizResult() {
    const results = JSON.parse(localStorage.getItem('kanaQuizResults') || '[]');
    if (results.length > 0) {
      const latest = results[results.length - 1];
      return {
        score: latest.score,
        total: latest.total,
        accuracy: latest.accuracy,
        date: new Date(latest.date).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })
      };
    }
    return null;
  }

  const recentQuiz = getRecentQuizResult();

  const learningMethods = [
    {
      title: "Visual Learning",
      description: "Color-coded characters and interactive diagrams",
      icon: <Eye className="w-8 h-8 text-blue-500" />,
      color: "bg-blue-50"
    },
    {
      title: "Audio Learning",
      description: "Native pronunciation audio for all characters",
      icon: <Volume2 className="w-8 h-8 text-purple-500" />,
      color: "bg-purple-50"
    },
    {
      title: "Spaced Repetition",
      description: "Smart review scheduling for better retention",
      icon: <Brain className="w-8 h-8 text-green-500" />,
      color: "bg-green-50"
    },
    {
      title: "Gamified Practice",
      description: "Points, streaks, and achievements to stay motivated",
      icon: <Trophy className="w-8 h-8 text-amber-500" />,
      color: "bg-amber-50"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-blue-50/30">
      {/* Add CSS animations */}
      <style>
        {`
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-20px); }
          }
          @keyframes blob {
            0% { transform: translate(0px, 0px) scale(1); }
            33% { transform: translate(30px, -50px) scale(1.1); }
            66% { transform: translate(-20px, 20px) scale(0.9); }
            100% { transform: translate(0px, 0px) scale(1); }
          }
          @keyframes pulse-glow {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.7; }
          }
          .animate-float {
            animation: float 6s ease-in-out infinite;
          }
          .animate-blob {
            animation: blob 7s infinite;
          }
          .animate-pulse-glow {
            animation: pulse-glow 2s ease-in-out infinite;
          }
          .animation-delay-1000 {
            animation-delay: 1s;
          }
          .animation-delay-2000 {
            animation-delay: 2s;
          }
          .animation-delay-4000 {
            animation-delay: 4s;
          }
        `}
      </style>

      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-purple-900 via-purple-800 to-blue-900 text-white">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 pt-24 pb-20 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-8 border border-white/20 animate-pulse-glow">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-medium">🎉 NEW: Complete Learning Platform Launched!</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Master Japanese
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-pink-300 mt-2">
                The Smart Way
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl mb-10 opacity-90 max-w-3xl mx-auto leading-relaxed">
              From kana basics to fluent reading. Interactive lessons, smart quizzes, 
              and everything you need to learn Japanese effectively.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                onClick={() => navigate("/kana-quiz")}
                className="group relative inline-flex items-center justify-center gap-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white px-10 py-5 rounded-2xl text-lg font-semibold hover:shadow-2xl transition-all transform hover:-translate-y-1 hover:scale-105 shadow-lg hover:shadow-purple-500/30"
              >
                <Target className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                Start Free Quiz
                <ArrowRight className="w-5 h-5 ml-1 group-hover:translate-x-1 transition-transform" />
              </button>
              
              <button
                onClick={() => navigate("/register")}
                className="group relative inline-flex items-center justify-center gap-3 bg-white/10 backdrop-blur-sm text-white px-10 py-5 rounded-2xl text-lg font-semibold hover:bg-white/20 transition-all border border-white/20"
              >
                <Rocket className="w-5 h-5" />
                Start Learning Journey
                <ChevronRight className="w-5 h-5 ml-1 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            {/* Progress Bar */}
            {learnedCount > 0 && (
              <div className="mt-16 max-w-md mx-auto bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white/20 rounded-lg">
                      <Trophy className="w-5 h-5 text-yellow-300" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Your Learning Progress</p>
                      <p className="text-xs opacity-75">{learnedCount} of {totalCount} characters</p>
                    </div>
                  </div>
                  <span className="text-2xl font-bold text-yellow-300">{progressPercent}%</span>
                </div>
                <div className="h-3 bg-white/20 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-yellow-400 to-orange-400 transition-all duration-1000 ease-out"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Floating Japanese Characters */}
        <div className="absolute top-20 right-10 text-6xl opacity-10 animate-float">あ</div>
        <div className="absolute bottom-20 left-10 text-6xl opacity-10 animate-float animation-delay-1000">ア</div>
      </div>

      {/* Learning Journey */}
      <div className="relative max-w-7xl mx-auto px-4 -mt-8 z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {learningJourney.map((step, index) => (
            <div
              key={index}
              className="relative group"
            >
              {/* Connector line for desktop */}
              {index < learningJourney.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 right-0 w-6 h-0.5 bg-gradient-to-r from-gray-200 to-transparent -translate-y-1/2 z-0" />
              )}
              
              <div 
                onClick={() => navigate(step.link)}
                className="relative bg-white rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer border border-gray-200 group-hover:border-transparent z-10"
              >
                {/* Stage indicator */}
                <div className={`absolute -top-3 -left-3 w-8 h-8 rounded-full bg-gradient-to-r ${step.color} flex items-center justify-center text-white font-bold text-sm`}>
                  {step.stage}
                </div>
                
                <div className="flex items-center justify-center w-16 h-16 rounded-xl mb-6 mx-auto bg-gradient-to-br from-gray-50 to-white group-hover:scale-110 transition-transform duration-300">
                  {step.icon}
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">{step.title}</h3>
                <p className="text-gray-600 text-sm mb-4 text-center">{step.description}</p>
                
                <div className="space-y-2">
                  {step.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-sm text-gray-500">
                      <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-gray-300 to-gray-400" />
                      {feature}
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 flex justify-center">
                  <button className="flex items-center gap-2 text-sm font-semibold text-gray-700 group-hover:text-purple-600 transition-colors">
                    Explore <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="max-w-7xl mx-auto px-4 mt-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Quick Actions
          <span className="block text-lg font-normal text-gray-600 mt-2">Jump right into learning</span>
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {quickActions.map((action, index) => (
            <button
              key={index}
              onClick={action.action}
              className={`relative overflow-hidden rounded-2xl p-8 text-left group transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl ${action.gradient} text-white`}
            >
              {/* Animated background */}
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 group-hover:translate-x-full transition-transform duration-1000" />
              
              {action.badge && (
                <span className="absolute top-4 right-4 bg-white text-purple-600 text-xs font-bold px-3 py-1 rounded-full animate-pulse">
                  {action.badge}
                </span>
              )}
              
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-6">
                  <action.icon className="w-10 h-10 text-white/90" />
                  <ArrowRight className="w-5 h-5 opacity-75 group-hover:translate-x-2 transition-transform" />
                </div>
                
                <h3 className="text-2xl font-bold mb-3">{action.title}</h3>
                <p className="text-white/90">{action.description}</p>
                
                <div className="mt-8 flex items-center gap-2 text-sm">
                  <MousePointerClick className="w-4 h-4" />
                  <span>Click to start</span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Recent Quiz Result */}
      {recentQuiz && (
        <div className="max-w-7xl mx-auto px-4 mt-12">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-gray-900 to-gray-800 p-1 shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20" />
            
            <div className="relative bg-gradient-to-br from-white to-gray-50 rounded-2xl p-8">
              <div className="flex flex-col md:flex-row items-center justify-between">
                <div className="mb-6 md:mb-0 md:mr-8">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl">
                      <Trophy className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">Latest Quiz Result</h3>
                      <p className="text-gray-600">Completed on {recentQuiz.date}</p>
                    </div>
                  </div>
                  
                  <p className="text-gray-700 max-w-md">
                    Great work! Your Japanese skills are improving. Ready for another challenge?
                  </p>
                </div>
                
                <div className="flex flex-wrap gap-6">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-gray-900 mb-1">
                      {recentQuiz.score}<span className="text-2xl text-gray-500">/{recentQuiz.total}</span>
                    </div>
                    <div className="text-sm text-gray-600 font-medium">Score</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-4xl font-bold text-emerald-600 mb-1">
                      {recentQuiz.accuracy}%
                    </div>
                    <div className="text-sm text-gray-600 font-medium">Accuracy</div>
                  </div>
                </div>
                
                <button
                  onClick={() => navigate("/kana-quiz")}
                  className="mt-6 md:mt-0 px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:shadow-xl transition-all transform hover:-translate-y-1 flex items-center gap-3 font-semibold group"
                >
                  <Target className="w-5 h-5" />
                  Retake Quiz
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Stats Dashboard */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Community Learning Stats
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Join thousands of learners mastering Japanese together
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div 
              key={index}
              className="relative group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100"
            >
              {/* Glow effect */}
              <div className={`absolute inset-0 bg-gradient-to-r ${stat.color} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity`} />
              
              <div className="relative">
                <div className="flex items-center justify-between mb-6">
                  <div className={`p-3 rounded-xl bg-gradient-to-r ${stat.color} bg-opacity-10`}>
                    <stat.icon className={`w-6 h-6 bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`} />
                  </div>
                  <span className={`text-xs font-medium ${
                    stat.trend === 'up' ? 'text-green-600' : 
                    stat.trend === 'progress' ? 'text-blue-600' : 'text-amber-600'
                  }`}>
                    {stat.change}
                  </span>
                </div>
                
                <div className="text-4xl font-bold text-gray-900 mb-2">{stat.value}</div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Learning Methods */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Smart Learning Methods
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Proven techniques that make learning Japanese effective and enjoyable
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {learningMethods.map((method, index) => (
            <div 
              key={index}
              className={`${method.color} rounded-2xl p-8 border transition-all duration-300 transform hover:-translate-y-2 hover:shadow-lg`}
            >
              <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-white mb-6 mx-auto">
                {method.icon}
              </div>
              
              <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">{method.title}</h3>
              <p className="text-gray-600 text-center">{method.description}</p>
              
              <div className="mt-6 flex justify-center">
                <div className="w-8 h-1 bg-gradient-to-r from-gray-300 to-gray-400 rounded-full"></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Learning Features Grid */}
      <div className="max-w-7xl mx-auto px-4 py-16 bg-gradient-to-b from-white to-gray-50 rounded-3xl">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-50 to-pink-50 px-6 py-3 rounded-full mb-6 border border-purple-100">
            <Sparkles className="w-5 h-5 text-purple-600" />
            <span className="text-purple-700 font-medium">Complete Learning Suite</span>
          </div>
          
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Everything You Need to Master Japanese
          </h2>
          <p className="text-gray-600 text-lg max-w-3xl mx-auto">
            From character basics to fluent reading. Interactive tools designed for effective learning.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {learningFeatures.map((feature, index) => (
            <div
              key={index}
              onClick={() => navigate(feature.link)}
              className={`${feature.color} rounded-2xl shadow-lg p-8 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-3 cursor-pointer border relative overflow-hidden group`}
            >
              {/* Animated accent bar */}
              <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${feature.accent} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500`} />
              
              {feature.status === "new" && (
                <span className="absolute top-4 right-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold px-3 py-1.5 rounded-full animate-pulse">
                  {feature.badge || "NEW"}
                </span>
              )}
              
              <div className="flex items-center justify-center w-20 h-20 rounded-2xl mb-8 mx-auto bg-white shadow-sm group-hover:shadow-lg group-hover:scale-110 transition-all duration-300">
                {feature.icon}
              </div>
              
              <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">{feature.title}</h3>
              <p className="text-gray-600 text-sm mb-6 text-center leading-relaxed">{feature.description}</p>
              
              <div className="flex flex-col items-center gap-4">
                <span className="text-sm font-medium text-gray-500 px-4 py-2 bg-white rounded-full shadow-sm">
                  {feature.stats}
                </span>
                
                <button className="flex items-center gap-2 text-sm font-semibold text-gray-700 group-hover:text-purple-600 transition-colors">
                  {feature.buttonText}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quiz Feature Highlight */}
      <div className="relative overflow-hidden py-24">
        {/* Background pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50" />
        {/* <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"none\" fill-rule=\"evenodd\"%3E%3Cg fill=\"%239C92AC\" fill-opacity=\"0.05\"%3E%3Cpath d=\"M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]" /> */}
        
        <div className="relative max-w-7xl mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="lg:w-1/2">
              <div className="inline-flex items-center gap-3 bg-white px-5 py-3 rounded-full shadow-lg mb-8">
                <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
                  <Target className="w-5 h-5 text-white" />
                </div>
                <span className="text-lg font-semibold text-purple-700">Advanced Quiz System</span>
              </div>
              
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                Challenge Yourself with
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
                  Smart Quizzes
                </span>
              </h2>
              
              <p className="text-gray-600 text-lg mb-10 leading-relaxed">
                Inspired by the best learning platforms. Our quiz system adapts to your level, 
                tracks your progress, and helps you master Japanese characters faster.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
                {quizFeatures.map((feature, index) => (
                  <div 
                    key={index}
                    className={`${feature.color} p-5 rounded-2xl border transition-all duration-300 transform hover:-translate-y-2 hover:shadow-lg`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-white rounded-xl shadow-sm">
                        {feature.icon}
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 mb-1">{feature.title}</h4>
                        <p className="text-sm text-gray-600">{feature.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => navigate("/kana-quiz")}
                  className="group relative inline-flex items-center justify-center gap-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-10 py-5 rounded-2xl text-lg font-semibold hover:shadow-2xl transition-all transform hover:-translate-y-1 hover:shadow-purple-500/30"
                >
                  <Target className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                  Start Quiz Now
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                
                <button
                  onClick={() => navigate("/flashcards")}
                  className="group relative inline-flex items-center justify-center gap-3 bg-white border-2 border-purple-200 text-purple-700 px-10 py-5 rounded-2xl text-lg font-semibold hover:bg-purple-50 transition-all"
                >
                  <Brain className="w-5 h-5" />
                  Practice First
                </button>
              </div>
            </div>
            
            <div className="lg:w-1/2">
              <div className="relative">
                {/* Floating card effect */}
                <div className="absolute -top-6 -right-6 w-72 h-72 bg-gradient-to-r from-purple-300 to-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
                <div className="absolute -bottom-6 -left-6 w-72 h-72 bg-gradient-to-r from-blue-300 to-cyan-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
                
                <div className="relative bg-white rounded-3xl shadow-2xl p-10 border border-gray-200 backdrop-blur-sm">
                  <div className="flex items-center justify-between mb-10">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">Live Quiz Preview</h3>
                      <p className="text-gray-600">Try a sample question</p>
                    </div>
                    <div className="flex items-center gap-2 bg-gradient-to-r from-purple-50 to-pink-50 px-4 py-2 rounded-full">
                      <Timer className="w-4 h-4 text-purple-600" />
                      <span className="text-sm font-medium text-purple-700">Time: 15s</span>
                    </div>
                  </div>
                  
                  <div className="space-y-8">
                    <div className="text-center p-8 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl border border-purple-100">
                      <div className="text-8xl font-bold text-gray-900 mb-6">あ</div>
                      <p className="text-xl font-medium text-gray-700">What is the correct romaji for this character?</p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      {['a', 'i', 'u', 'e'].map((answer, idx) => (
                        <button
                          key={idx}
                          className={`p-5 rounded-xl text-center transition-all duration-300 transform hover:-translate-y-2 ${
                            answer === 'a' 
                              ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 hover:shadow-lg hover:shadow-green-200/50' 
                              : 'bg-gray-50 hover:bg-gray-100 border border-gray-200'
                          }`}
                        >
                          <span className="font-mono text-2xl font-bold">{answer}</span>
                          {answer === 'a' && (
                            <div className="mt-2 flex items-center justify-center gap-1">
                              <CheckCircle className="w-4 h-4 text-green-500" />
                              <span className="text-xs text-green-600 font-medium">Correct</span>
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                    
                    <div className="pt-8 border-t border-gray-200">
                      <div className="flex items-center justify-center gap-3">
                        <div className="flex items-center gap-2">
                          <Volume2 className="w-4 h-4 text-gray-500" />
                          <span className="text-sm text-gray-600">Audio available</span>
                        </div>
                        <div className="w-1 h-1 bg-gray-300 rounded-full" />
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-gray-500" />
                          <span className="text-sm text-gray-600">Timed mode</span>
                        </div>
                        <div className="w-1 h-1 bg-gray-300 rounded-full" />
                        <div className="flex items-center gap-2">
                          <BarChart3 className="w-4 h-4 text-gray-500" />
                          <span className="text-sm text-gray-600">Progress tracking</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Coming Soon Features */}
      <div className="bg-gradient-to-b from-white to-gray-50 py-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-50 to-orange-50 px-6 py-3 rounded-full mb-6 border border-amber-100">
              <Sparkles className="w-5 h-5 text-amber-600" />
              <span className="text-amber-700 font-medium">Exciting Updates Coming</span>
            </div>
            
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Coming Soon Features
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              We're constantly working to bring you more tools and features for your Japanese learning journey.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-3 border border-gray-200">
              <div className="flex items-center justify-center w-20 h-20 rounded-2xl mb-8 mx-auto bg-gradient-to-br from-amber-50 to-orange-50">
                <span className="text-4xl font-bold text-amber-600">漢</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">Kanji Journey</h3>
              <p className="text-gray-600 mb-6 text-center">Start with N5 level kanji and build your way up to advanced characters with interactive stroke order guides.</p>
              <div className="flex justify-center">
                <span className="text-sm font-medium text-gray-400 px-4 py-2 bg-gray-100 rounded-full">
                  Launching Q2 2024
                </span>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-3 border border-gray-200">
              <div className="flex items-center justify-center w-20 h-20 rounded-2xl mb-8 mx-auto bg-gradient-to-br from-cyan-50 to-blue-50">
                <BookOpen className="w-10 h-10 text-cyan-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">Grammar Lessons</h3>
              <p className="text-gray-600 mb-6 text-center">Learn sentence structure and common patterns with interactive exercises and real-life conversation examples.</p>
              <div className="flex justify-center">
                <span className="text-sm font-medium text-gray-400 px-4 py-2 bg-gray-100 rounded-full">
                  Launching Q3 2024
                </span>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-3 border border-gray-200">
              <div className="flex items-center justify-center w-20 h-20 rounded-2xl mb-8 mx-auto bg-gradient-to-br from-pink-50 to-rose-50">
                <Volume2 className="w-10 h-10 text-pink-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">Speaking Practice</h3>
              <p className="text-gray-600 mb-6 text-center">Pronunciation training with voice recognition and feedback from native speaker audio comparisons.</p>
              <div className="flex justify-center">
                <span className="text-sm font-medium text-gray-400 px-4 py-2 bg-gray-100 rounded-full">
                  Launching Q4 2024
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Final CTA */}
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-900 via-purple-900 to-pink-900">
        {/* <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\"100\" height=\"100\" viewBox=\"0 0 100 100\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cpath d=\"M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z\" fill=\"%23ffffff\" fill-opacity=\"0.03\" fill-rule=\"evenodd\"/%3E%3C/svg%3E')]" />
         */}
        <div className="relative max-w-6xl mx-auto px-4 py-24 text-center">
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-8">
            Ready to Begin Your
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-pink-300 mt-4">
              Japanese Journey?
            </span>
          </h2>
          
          <p className="text-xl text-white/90 mb-12 max-w-3xl mx-auto">
            Join thousands of successful learners. Start for free, no credit card required.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <button
              onClick={() => navigate("/register")}
              className="group relative inline-flex items-center justify-center gap-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 px-12 py-6 rounded-2xl text-xl font-bold hover:shadow-2xl transition-all transform hover:-translate-y-2 hover:scale-105 shadow-lg"
            >
              <Rocket className="w-6 h-6 group-hover:rotate-12 transition-transform" />
              Start Learning Free
              <Sparkles className="w-6 h-6 group-hover:scale-110 transition-transform" />
            </button>
            
            <button
              onClick={() => navigate("/kana-quiz")}
              className="group relative inline-flex items-center justify-center gap-3 bg-white/10 backdrop-blur-sm text-white border-2 border-white/30 px-12 py-6 rounded-2xl text-xl font-bold hover:bg-white/20 transition-all"
            >
              <Play className="w-6 h-6" />
              Try Demo First
              <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
            </button>
          </div>
          
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">100%</div>
              <div className="text-white/70">Free to Start</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">10min</div>
              <div className="text-white/70">Daily Practice</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">24/7</div>
              <div className="text-white/70">Access</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">∞</div>
              <div className="text-white/70">Learning Paths</div>
            </div>
          </div>
          
          <p className="mt-12 text-white/70 text-sm">
            No credit card required • Start learning in seconds • Cancel anytime
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;