import { 
  Book, 
  Music, 
  Clock, 
  Target, 
  Sparkles, 
  TrendingUp, 
  Volume2, 
  Users, 
  Award,
  Star,
  Zap,
  ChevronRight,
  PlayCircle,
  Brain,
  BookOpen,
  GraduationCap,
  Trophy,
  Calendar,
  BarChart3,
  ShieldCheck,
  Heart,
  Lightbulb,
  Target as TargetIcon,
  Flame,
  MousePointerClick
} from "lucide-react";
import { Link, Outlet } from "react-router-dom";

const colorMap: Record<string, string> = {
  blue: "from-blue-400 to-cyan-500",
  purple: "from-purple-400 to-pink-500", 
  emerald: "from-emerald-400 to-green-500",
  amber: "from-amber-400 to-orange-500",
  rose: "from-rose-400 to-red-500",
  violet: "from-violet-400 to-purple-500"
};

const BasicJapanese = () => {
  const modules = [
    {
      title: "Hiragana Mastery",
      description: "Learn all 46 basic hiragana characters with interactive lessons and audio pronunciation",
      icon: <span className="text-4xl font-bold">あ</span>,
      progress: 100,
      link: "hiragana",
      lessons: 12,
      color: "blue",
      status: "mastered",
      stats: "46 Characters",
      difficulty: "Beginner",
      time: "2-3 hours"
    },
    {
      title: "Katakana Training", 
      description: "Master katakana for foreign words, names, and technical terms",
      icon: <span className="text-4xl font-bold">ア</span>,
      progress: 85,
      link: "katakana",
      lessons: 10,
      color: "purple",
      status: "in-progress",
      stats: "46 Characters",
      difficulty: "Beginner",
      time: "2-3 hours"
    },
    {
      title: "Kana Quiz Challenge",
      description: "Test your hiragana and katakana knowledge with interactive quizzes",
      icon: <Target className="w-10 h-10" />,
      progress: 75,
      link: "kana-quiz",
      lessons: "Unlimited",
      color: "emerald",
      status: "popular",
      stats: "3 Quiz Modes",
      difficulty: "All Levels",
      time: "5-15 min"
    },
    {
      title: "Basic Greetings",
      description: "Essential Japanese phrases and conversations for daily use",
      icon: <Volume2 className="w-10 h-10" />,
      progress: 90,
      link: "greetings",
      lessons: 8,
      color: "amber",
      status: "completed",
      stats: "50+ Phrases",
      difficulty: "Beginner", 
      time: "1-2 hours"
    },
    {
      title: "Smart Flashcards",
      description: "Spaced repetition system to reinforce learning effectively",
      icon: <Brain className="w-10 h-10" />,
      progress: 60,
      link: "flashcards",
      lessons: "Adaptive",
      color: "rose",
      status: "new",
      stats: "Spaced Learning",
      difficulty: "Beginner",
      time: "Daily Practice"
    },
    {
      title: "Grammar Basics",
      description: "Foundational Japanese grammar patterns and sentence structures",
      icon: <BookOpen className="w-10 h-10" />,
      progress: 40,
      link: "grammar-basics",
      lessons: 15,
      color: "violet",
      status: "upcoming",
      stats: "Core Patterns",
      difficulty: "Beginner+",
      time: "4-5 hours"
    }
  ];

  const studyTips = [
    {
      title: "Daily Consistency",
      description: "Practice 15-20 minutes daily instead of long sessions weekly",
      icon: <Calendar className="w-6 h-6" />,
      color: "bg-blue-50 text-blue-700",
      accent: "border-blue-200"
    },
    {
      title: "Active Recall",
      description: "Test yourself regularly to strengthen memory retention",
      icon: <Brain className="w-6 h-6" />,
      color: "bg-emerald-50 text-emerald-700",
      accent: "border-emerald-200"
    },
    {
      title: "Spaced Repetition",
      description: "Review material at increasing intervals for optimal learning",
      icon: <TrendingUp className="w-6 h-6" />,
      color: "bg-purple-50 text-purple-700",
      accent: "border-purple-200"
    },
    {
      title: "Audio Immersion",
      description: "Listen to native pronunciation for better speaking skills",
      icon: <Volume2 className="w-6 h-6" />,
      color: "bg-amber-50 text-amber-700",
      accent: "border-amber-200"
    }
  ];

  const quickStats = [
    { label: "Active Learners", value: "2,847", icon: Users, color: "text-blue-600" },
    { label: "Success Rate", value: "94%", icon: Award, color: "text-emerald-600" },
    { label: "Avg Completion", value: "78%", icon: TrendingUp, color: "text-purple-600" },
    { label: "Satisfaction", value: "4.9/5", icon: Star, color: "text-amber-600" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-purple-50/30">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 text-white">
        <div className="absolute inset-0">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 py-20">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-8 border border-white/20">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-medium">Perfect for Beginners • Start Your Journey Today</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Japanese Basics
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-pink-300 mt-2">
                Start Strong, Learn Smart
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl mb-10 opacity-90 max-w-3xl mx-auto leading-relaxed">
              Master the fundamentals of Japanese through interactive lessons, smart quizzes, 
              and proven learning methods designed for beginners.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button className="group relative inline-flex items-center justify-center gap-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white px-10 py-5 rounded-2xl text-lg font-semibold hover:shadow-2xl transition-all transform hover:-translate-y-1 hover:scale-105 shadow-lg hover:shadow-purple-500/30">
                <PlayCircle className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                Start Learning Now
                <ChevronRight className="w-5 h-5 ml-1 group-hover:translate-x-1 transition-transform" />
              </button>
              
              <button className="group relative inline-flex items-center justify-center gap-3 bg-white/10 backdrop-blur-sm text-white px-10 py-5 rounded-2xl text-lg font-semibold hover:bg-white/20 transition-all border border-white/20">
                <TargetIcon className="w-5 h-5" />
                Take Quick Assessment
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="max-w-7xl mx-auto px-4 -mt-8 z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickStats.map((stat, index) => (
            <div 
              key={index}
              className="bg-white rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-200"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className={`p-3 rounded-xl ${stat.color.replace('text', 'bg')}/10`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <div className="text-3xl font-bold text-gray-900">{stat.value}</div>
              </div>
              <div className="text-gray-600 font-medium">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        {/* Modules Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Your Learning Journey
          </h2>
          <p className="text-gray-600 text-lg max-w-3xl mx-auto">
            Follow these modules in order to build a strong foundation in Japanese
          </p>
        </div>

        {/* Modules Grid - Bigger Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {modules.map((module) => (
            <Link
              key={module.title}
              to={module.link}
              className="group relative bg-white rounded-3xl border border-gray-200 p-8 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-3 cursor-pointer"
            >
              {/* Status Badge */}
              <div className="absolute top-4 right-4">
                {module.status === "mastered" && (
                  <span className="inline-flex items-center gap-1 bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 text-xs font-bold px-3 py-1.5 rounded-full border border-green-200">
                    <Trophy className="w-3 h-3" />
                    Mastered
                  </span>
                )}
                {module.status === "in-progress" && (
                  <span className="inline-flex items-center gap-1 bg-gradient-to-r from-blue-50 to-cyan-50 text-blue-700 text-xs font-bold px-3 py-1.5 rounded-full border border-blue-200 animate-pulse">
                    <Zap className="w-3 h-3" />
                    In Progress
                  </span>
                )}
                {module.status === "popular" && (
                  <span className="inline-flex items-center gap-1 bg-gradient-to-r from-rose-50 to-pink-50 text-rose-700 text-xs font-bold px-3 py-1.5 rounded-full border border-rose-200">
                    <Flame className="w-3 h-3" />
                    Popular
                  </span>
                )}
                {module.status === "new" && (
                  <span className="inline-flex items-center gap-1 bg-gradient-to-r from-purple-50 to-violet-50 text-purple-700 text-xs font-bold px-3 py-1.5 rounded-full border border-purple-200 animate-pulse">
                    <Sparkles className="w-3 h-3" />
                    NEW
                  </span>
                )}
                {module.status === "completed" && (
                  <span className="inline-flex items-center gap-1 bg-gradient-to-r from-amber-50 to-orange-50 text-amber-700 text-xs font-bold px-3 py-1.5 rounded-full border border-amber-200">
                    <Star className="w-3 h-3" />
                    Completed
                  </span>
                )}
                {module.status === "upcoming" && (
                  <span className="inline-flex items-center gap-1 bg-gradient-to-r from-gray-50 to-gray-100 text-gray-700 text-xs font-bold px-3 py-1.5 rounded-full border border-gray-200">
                    <Clock className="w-3 h-3" />
                    Upcoming
                  </span>
                )}
              </div>

              {/* Module Icon */}
              <div className={`flex items-center justify-center w-20 h-20 rounded-2xl mb-8 mx-auto bg-gradient-to-br ${colorMap[module.color]} bg-opacity-10 group-hover:scale-110 transition-transform duration-300`}>
                <div className={`text-3xl bg-gradient-to-r ${colorMap[module.color]} bg-clip-text text-transparent font-bold`}>
                  {module.icon}
                </div>
              </div>

              {/* Module Info */}
              <h3 className="text-2xl font-bold text-gray-900 mb-3 text-center group-hover:text-gray-950">
                {module.title}
              </h3>
              <p className="text-gray-600 mb-6 text-center leading-relaxed">
                {module.description}
              </p>

              {/* Stats & Progress */}
              <div className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-gray-700">{module.stats}</span>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-700">{module.progress}%</span>
                    <div className="h-2 w-24 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full bg-gradient-to-r ${colorMap[module.color]}`}
                        style={{ width: `${module.progress}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center gap-2">
                    <GraduationCap className="w-4 h-4" />
                    <span>{typeof module.lessons === "number" ? `${module.lessons} Lessons` : module.lessons}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>{module.time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4" />
                    <span>{module.difficulty}</span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="mt-8 flex justify-center">
                <div className="flex items-center gap-2 text-sm font-semibold text-gray-700 group-hover:text-purple-600 transition-colors">
                  <MousePointerClick className="w-4 h-4" />
                  Start Learning
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Study Tips Section */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-3xl p-10 border border-blue-200">
          <div className="flex items-center gap-3 mb-10">
            <Lightbulb className="w-8 h-8 text-amber-600" />
            <h2 className="text-3xl font-bold text-gray-900">
              Proven Study Tips for Success
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {studyTips.map((tip, index) => (
              <div 
                key={index}
                className={`${tip.color} ${tip.accent} rounded-2xl p-6 border hover:shadow-lg transition-shadow`}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 rounded-xl bg-white">
                    {tip.icon}
                  </div>
                  <h3 className="font-bold text-lg">{tip.title}</h3>
                </div>
                <p className="text-sm leading-relaxed">{tip.description}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 p-6 bg-white rounded-2xl border border-gray-200">
            <div className="flex items-center gap-3 mb-4">
              <Heart className="w-6 h-6 text-rose-500" />
              <h3 className="text-xl font-bold text-gray-900">Expert Advice</h3>
            </div>
            <p className="text-gray-700 leading-relaxed">
              "Consistency beats intensity when learning Japanese. Focus on daily practice, 
              celebrate small wins, and don't be afraid to make mistakes. Every learner's 
              journey is unique—find what works best for you and enjoy the process!"
            </p>
            <div className="mt-4 flex items-center gap-2 text-sm text-gray-500">
              <Users className="w-4 h-4" />
              <span>Advice from experienced Japanese teachers and learners</span>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="mt-16 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Ready to Begin?
          </h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Start with Hiragana Mastery and build your way up. Each module is designed 
            to work together for comprehensive learning.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="hiragana"
              className="inline-flex items-center justify-center gap-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-10 py-5 rounded-2xl text-lg font-semibold hover:shadow-xl transition-all transform hover:-translate-y-1"
            >
              <PlayCircle className="w-5 h-5" />
              Start with Hiragana
            </Link>
            
            <button className="inline-flex items-center justify-center gap-3 bg-white border-2 border-blue-200 text-blue-600 px-10 py-5 rounded-2xl text-lg font-semibold hover:bg-blue-50 transition-all">
              <BarChart3 className="w-5 h-5" />
              View Learning Path
            </button>
          </div>
        </div>
      </div>

      {/* Outlet for Child Routes */}
      <div className="max-w-7xl mx-auto px-4 pb-20">
        <Outlet />
      </div>
    </div>
  );
};

export default BasicJapanese;