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
  Award as Badge,

  Mountain,

  Waves,
  Moon,
  Sun,
  Cloud,
  Wind,
  Map,
  Blinds,
  GalleryThumbnails,
  Flower
} from "lucide-react";

const Home = () => {
  const navigate = useNavigate();

  const learningJourney = [
    {
      stage: 1,
      title: "Start with Kana",
      description: "Master Hiragana & Katakana fundamentals",
      icon: <span className="text-3xl font-bold text-red-400">あ</span>,
      features: ["46 Hiragana", "46 Katakana", "Audio Pronunciation"],
      color: "from-red-400 to-pink-400",
      link: "/hiragana",
      gradient: "bg-gradient-to-br from-red-400/90 to-pink-400/90",
      bgColor: "bg-gradient-to-br from-red-50/50 to-pink-50/50"
    },
    {
      stage: 2,
      title: "Practice & Quiz",
      description: "Reinforce with flashcards and tests",
      icon: <Target className="w-8 h-8 text-blue-400" />,
      features: ["Smart Flashcards", "Kana Quiz", "Progress Tracking"],
      color: "from-blue-400 to-cyan-400",
      link: "/kana-quiz",
      gradient: "bg-gradient-to-br from-blue-400/90 to-cyan-400/90",
      bgColor: "bg-gradient-to-br from-blue-50/50 to-cyan-50/50"
    },
    {
      stage: 3,
      title: "Expand Knowledge",
      description: "Explore Kanji and vocabulary",
      icon: <span className="text-3xl font-bold text-amber-500">漢</span>,
      features: ["JLPT Kanji", "Vocabulary Builder", "Grammar"],
      color: "from-amber-400 to-orange-400",
      link: "/kanji/value",
      gradient: "bg-gradient-to-br from-amber-400/90 to-orange-400/90",
      bgColor: "bg-gradient-to-br from-amber-50/50 to-orange-50/50"
    },
    {
      stage: 4,
      title: "Apply Skills",
      description: "Read stories and build fluency",
      icon: <BookOpen className="w-8 h-8 text-emerald-400" />,
      features: ["Japanese Stories", "Reading Practice", "Comprehension"],
      color: "from-emerald-400 to-green-400",
      link: "/stories/access",
      gradient: "bg-gradient-to-br from-emerald-400/90 to-green-400/90",
      bgColor: "bg-gradient-to-br from-emerald-50/50 to-green-50/50"
    }
  ];

  const learningFeatures = [
    {
      title: "Hiragana Mastery",
      description: "Master all 46 basic hiragana characters with interactive lessons",
      icon: <span className="text-4xl font-bold text-red-500">あ</span>,
      link: "/hiragana",
      color: "bg-white/80 backdrop-blur-sm border-red-100",
      stats: "46 Characters",
      status: "available",
      buttonText: "Start Learning",
      accent: "from-red-400 to-pink-400",
      badgeColor: "bg-red-100 text-red-700"
    },
    {
      title: "Katakana Training",
      description: "Learn katakana used for foreign words and technical terms",
      icon: <span className="text-4xl font-bold text-blue-500">ア</span>,
      link: "/katakana",
      color: "bg-white/80 backdrop-blur-sm border-blue-100",
      stats: "46 Characters",
      status: "available",
      buttonText: "Start Learning",
      accent: "from-blue-400 to-cyan-400",
      badgeColor: "bg-blue-100 text-blue-700"
    },
    {
      title: "Kana Quiz Challenge",
      description: "Test your knowledge with customizable quiz options",
      icon: <Target className="w-10 h-10 text-purple-500" />,
      link: "/kana-quiz",
      color: "bg-white/80 backdrop-blur-sm border-purple-100",
      stats: "3 Quiz Modes",
      status: "new",
      buttonText: "Take Quiz",
      accent: "from-purple-400 to-violet-400",
      badgeColor: "bg-purple-100 text-purple-700",
      badge: "HOT"
    },
    {
      title: "Smart Flashcards",
      description: "Spaced repetition system with audio and multiple quiz modes",
      icon: <Brain className="w-10 h-10 text-emerald-500" />,
      link: "/flashcards",
      color: "bg-white/80 backdrop-blur-sm border-emerald-100",
      stats: "3 Study Modes",
      status: "available",
      buttonText: "Practice Now",
      accent: "from-emerald-400 to-green-400",
      badgeColor: "bg-emerald-100 text-emerald-700"
    },
    {
      title: "Kanji Explorer",
      description: "Explore kanji with meanings, readings, stroke order, and JLPT levels",
      icon: <span className="text-4xl font-bold text-amber-600">字</span>,
      link: "/kanji/value",
      color: "bg-white/80 backdrop-blur-sm border-amber-100",
      stats: "JLPT N5–N1",
      status: "new",
      buttonText: "Explore Kanji",
      accent: "from-amber-400 to-orange-400",
      badgeColor: "bg-amber-100 text-amber-700"
    },
    {
      title: "JLPT Learning Path",
      description: "Structured lessons from N5 to N1 with vocabulary, grammar, and tests",
      icon: <GraduationCap className="w-10 h-10 text-indigo-500" />,
      link: "/jlpt",
      color: "bg-white/80 backdrop-blur-sm border-indigo-100",
      stats: "N5-N1 Complete",
      status: "available",
      buttonText: "Start Learning",
      accent: "from-indigo-400 to-purple-400",
      badgeColor: "bg-indigo-100 text-indigo-700"
    },
    {
      title: "Story Hub",
      description: "Explore Japanese stories and improve reading comprehension",
      icon: <BookOpen className="w-10 h-10 text-violet-500" />,
      link: "/stories/access",
      color: "bg-white/80 backdrop-blur-sm border-violet-100",
      stats: "Stories Library",
      status: "new",
      buttonText: "Read Stories",
      accent: "from-violet-400 to-fuchsia-400",
      badgeColor: "bg-violet-100 text-violet-700"
    },
    {
      title: "Learning Hub",
      description: "Access all learning modules: Grammar, Vocabulary, and more",
      icon: <Compass className="w-10 h-10 text-cyan-500" />,
      link: "/learn",
      color: "bg-white/80 backdrop-blur-sm border-cyan-100",
      stats: "6 Modules",
      status: "available",
      buttonText: "Explore All",
      accent: "from-cyan-400 to-blue-400",
      badgeColor: "bg-cyan-100 text-cyan-700"
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
      icon: Users,
      color: "from-blue-400 to-cyan-400",
      change: "+18% this month",
      trend: "up"
    },
    { 
      label: "Characters Mastered", 
      value: `${learnedCount}/92`, 
      icon: Award,
      color: "from-emerald-400 to-green-400",
      change: "Your progress",
      trend: "progress"
    },
    { 
      label: "Success Rate", 
      value: "94%", 
      icon: TrendingUp,
      color: "from-violet-400 to-purple-400",
      change: "+4% from last month",
      trend: "up"
    },
    { 
      label: "Quizzes Completed", 
      value: getQuizCount(), 
      icon: Target,
      color: "from-rose-400 to-pink-400",
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
      icon: Play,
      gradient: "bg-gradient-to-br from-red-400/20 to-pink-400/20",
      borderColor: "border-red-200",
      textColor: "text-red-700",
      iconColor: "text-red-500"
    },
    {
      title: "Daily Challenge",
      description: "Test your knowledge with today's quiz",
      action: () => navigate("/kana-quiz"),
      icon: Target,
      gradient: "bg-gradient-to-br from-blue-400/20 to-cyan-400/20",
      borderColor: "border-blue-200",
      textColor: "text-blue-700",
      iconColor: "text-blue-500",
      badge: "NEW"
    },
    {
      title: "Read Today's Story",
      description: "Improve your reading comprehension",
      action: () => navigate("/stories/access"),
      icon: BookText,
      gradient: "bg-gradient-to-br from-emerald-400/20 to-green-400/20",
      borderColor: "border-emerald-200",
      textColor: "text-emerald-700",
      iconColor: "text-emerald-500"
    }
  ];

  const learningMethods = [
    {
      title: "Visual Learning",
      description: "Color-coded characters and interactive diagrams",
      icon: <Eye className="w-8 h-8 text-blue-500" />,
      gradient: "from-blue-400/10 to-cyan-400/10",
      borderColor: "border-blue-200"
    },
    {
      title: "Audio Learning",
      description: "Native pronunciation audio for all characters",
      icon: <Volume2 className="w-8 h-8 text-purple-500" />,
      gradient: "from-purple-400/10 to-violet-400/10",
      borderColor: "border-purple-200"
    },
    {
      title: "Spaced Repetition",
      description: "Smart review scheduling for better retention",
      icon: <Brain className="w-8 h-8 text-emerald-500" />,
      gradient: "from-emerald-400/10 to-green-400/10",
      borderColor: "border-emerald-200"
    },
    {
      title: "Gamified Practice",
      description: "Points, streaks, and achievements to stay motivated",
      icon: <Trophy className="w-8 h-8 text-amber-500" />,
      gradient: "from-amber-400/10 to-orange-400/10",
      borderColor: "border-amber-200"
    }
  ];

  const cultureHighlights = [
    {
      title: "Cherry Blossoms",
      description: "Learn seasonal vocabulary",
      icon: <Flower className="w-6 h-6 text-pink-500" />,
      color: "bg-gradient-to-br from-pink-50 to-rose-50"
    },
    {
      title: "Mount Fuji",
      description: "Discover geographical terms",
      icon: <Mountain className="w-6 h-6 text-blue-500" />,
      color: "bg-gradient-to-br from-blue-50 to-cyan-50"
    },
    {
      title: "Traditional Temples",
      description: "Explore cultural vocabulary",
      icon: <GalleryThumbnails className="w-6 h-6 text-red-500" />,
      color: "bg-gradient-to-br from-red-50 to-orange-50"
    },
    {
      title: "Zen Gardens",
      description: "Learn mindfulness terms",
      icon: <Leaf className="w-6 h-6 text-emerald-500" />,
      color: "bg-gradient-to-br from-emerald-50 to-green-50"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-blue-50/20">
      {/* Add CSS animations */}
      <style>
        {`
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
          }
          @keyframes gentle-pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.8; }
          }
          @keyframes shimmer {
            0% { background-position: -200% center; }
            100% { background-position: 200% center; }
          }
          .animate-float {
            animation: float 6s ease-in-out infinite;
          }
          .animate-gentle-pulse {
            animation: gentle-pulse 3s ease-in-out infinite;
          }
          .animate-shimmer {
            background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
            background-size: 200% 100%;
            animation: shimmer 3s infinite;
          }
          .animation-delay-1000 {
            animation-delay: 1s;
          }
          .animation-delay-2000 {
            animation-delay: 2s;
          }
        `}
      </style>

      {/* Hero Section with Japanese Theme */}
      <div className="relative overflow-hidden bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 text-white">
        {/* Japanese Pattern Overlay */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23ffffff' fill-opacity='0.1' fill-rule='evenodd'/%3E%3C/svg%3E")`,
            backgroundSize: '300px 300px'
          }} />
        </div>

        {/* Floating Elements */}
        <div className="absolute top-10 left-10 text-6xl opacity-10 animate-float">桜</div>
        <div className="absolute bottom-20 right-10 text-6xl opacity-10 animate-float animation-delay-1000">富士</div>
        <div className="absolute top-1/3 right-1/4 text-5xl opacity-5 animate-float animation-delay-2000">和</div>

        <div className="relative max-w-7xl mx-auto px-4 pt-20 pb-16 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            {/* Welcome Badge */}
            <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full mb-8 border border-white/20">
              <div className="w-2 h-2 bg-gradient-to-r from-pink-400 to-rose-400 rounded-full animate-pulse" />
              <span className="text-sm font-medium">ようこそ! Welcome to Japanese Learning</span>
              <Sparkles className="w-4 h-4 text-yellow-300" />
            </div>
            
            {/* Main Title */}
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Discover the Beauty of
              <span className="block mt-4">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-300 via-red-300 to-orange-300">
                  日本語
                </span>
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl mb-10 opacity-90 max-w-3xl mx-auto leading-relaxed font-light">
              Master Japanese through immersive lessons, cultural insights, and smart practice tools designed for effective learning.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                onClick={() => navigate("/kana-quiz")}
                className="group relative inline-flex items-center justify-center gap-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white px-10 py-4 rounded-xl text-lg font-semibold hover:shadow-2xl transition-all transform hover:-translate-y-1 hover:scale-105 shadow-lg hover:shadow-purple-500/30 backdrop-blur-sm"
              >
                <Target className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                Start Free Quiz
                <ArrowRight className="w-5 h-5 ml-1 group-hover:translate-x-1 transition-transform" />
              </button>
              
              <button
                onClick={() => navigate("/hiragana")}
                className="group relative inline-flex items-center justify-center gap-3 bg-white/10 backdrop-blur-sm text-white px-10 py-4 rounded-xl text-lg font-semibold hover:bg-white/20 transition-all border border-white/20"
              >
                <BookOpen className="w-5 h-5" />
                Start Learning
                <ChevronRight className="w-5 h-5 ml-1 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            {/* Progress Bar */}
            {learnedCount > 0 && (
              <div className="mt-12 max-w-md mx-auto bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/20">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white/20 rounded-lg">
                      <Trophy className="w-5 h-5 text-yellow-300" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Your Learning Progress</p>
                      <p className="text-xs opacity-75">{learnedCount} of {totalCount} characters</p>
                    </div>
                  </div>
                  <span className="text-xl font-bold text-yellow-300">{progressPercent}%</span>
                </div>
                <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-yellow-400 to-orange-400 transition-all duration-1000 ease-out"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg className="w-full h-16 text-white" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" opacity=".25" fill="currentColor"></path>
            <path d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" opacity=".5" fill="currentColor"></path>
            <path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z" fill="currentColor"></path>
          </svg>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="max-w-7xl mx-auto px-4 -mt-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {quickActions.map((action, index) => (
            <button
              key={index}
              onClick={action.action}
              className={`relative overflow-hidden rounded-2xl p-6 text-left group transition-all duration-300 transform hover:-translate-y-2 hover:shadow-xl border ${action.borderColor} ${action.gradient}`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className={`p-3 rounded-xl ${action.gradient} w-fit mb-4`}>
                    <action.icon className={`w-6 h-6 ${action.iconColor}`} />
                  </div>
                  <h3 className={`text-xl font-bold ${action.textColor} mb-2`}>{action.title}</h3>
                  <p className="text-gray-600 text-sm">{action.description}</p>
                </div>
                <ArrowRight className={`w-5 h-5 ${action.textColor} opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all`} />
              </div>
              
              {action.badge && (
                <span className="absolute top-4 right-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                  {action.badge}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Learning Journey */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-red-50 to-pink-50 px-6 py-3 rounded-full mb-6 border border-red-100">
            <Map className="w-5 h-5 text-red-500" />
            <span className="text-red-700 font-medium">Your Learning Journey</span>
          </div>
          
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Master Japanese Step by Step
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Follow this structured path from beginner basics to advanced fluency
          </p>
        </div>
        
        <div className="relative">
          {/* Timeline line */}
          <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-red-200 via-purple-200 to-emerald-200 -translate-x-1/2" />
          
          <div className="space-y-8 lg:space-y-0">
            {learningJourney.map((step, index) => (
              <div
                key={index}
                className={`relative flex flex-col lg:flex-row items-center ${
                  index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'
                } gap-8`}
              >
                {/* Timeline dot */}
                <div className="relative z-10 flex-shrink-0">
                  <div className={`w-4 h-4 rounded-full bg-gradient-to-r ${step.color}`} />
                  <div className={`absolute inset-0 w-4 h-4 rounded-full bg-gradient-to-r ${step.color} animate-ping opacity-20`} />
                </div>
                
                {/* Content card */}
                <div 
                  onClick={() => navigate(step.link)}
                  className={`flex-1 ${step.bgColor} rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer border border-gray-100`}
                >
                  <div className="flex items-start gap-6">
                    <div className={`flex-shrink-0 w-16 h-16 rounded-xl ${step.bgColor} flex items-center justify-center border border-gray-200`}>
                      {step.icon}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className={`text-sm font-semibold px-3 py-1 rounded-full bg-gradient-to-r ${step.color} bg-opacity-10 text-gray-700`}>
                          Step {step.stage}
                        </span>
                      </div>
                      
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{step.title}</h3>
                      <p className="text-gray-600 mb-4">{step.description}</p>
                      
                      <div className="flex flex-wrap gap-2">
                        {step.features.map((feature, idx) => (
                          <span
                            key={idx}
                            className="text-xs px-3 py-1 bg-white/50 rounded-full text-gray-600 border border-gray-200"
                          >
                            {feature}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <button className={`flex-shrink-0 px-4 py-2 rounded-lg bg-gradient-to-r ${step.color} text-white text-sm font-medium hover:shadow-md transition-shadow`}>
                      Start
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Dashboard */}
      <div className="bg-gradient-to-b from-white to-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Learning Statistics
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Track your progress and join our community of learners
            </p>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat, index) => (
              <div 
                key={index}
                className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100"
              >
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-r ${stat.color} bg-opacity-10`}>
                    <stat.icon className={`w-6 h-6 bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`} />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                    <div className="text-sm text-gray-600">{stat.label}</div>
                  </div>
                </div>
                <div className={`mt-4 text-xs font-medium ${
                  stat.trend === 'up' ? 'text-emerald-600' : 
                  stat.trend === 'progress' ? 'text-blue-600' : 'text-amber-600'
                }`}>
                  {stat.change}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-50 to-pink-50 px-6 py-3 rounded-full mb-6 border border-purple-100">
              <Sparkles className="w-5 h-5 text-purple-500" />
              <span className="text-purple-700 font-medium">Learning Features</span>
            </div>
            
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Everything You Need to Succeed
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Comprehensive tools designed for effective Japanese learning
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {learningFeatures.map((feature, index) => (
              <div
                key={index}
                onClick={() => navigate(feature.link)}
                className={`${feature.color} rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer border relative overflow-hidden group`}
              >
                {/* Hover effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/0 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                
                {/* Status badge */}
                {feature.status === "new" && (
                  <span className={`absolute top-4 right-4 ${feature.badgeColor} text-xs font-bold px-3 py-1 rounded-full`}>
                    {feature.badge || "NEW"}
                  </span>
                )}
                
                <div className="relative p-6">
                  <div className="flex items-center justify-center w-16 h-16 rounded-2xl mb-6 mx-auto bg-white shadow-sm">
                    {feature.icon}
                  </div>
                  
                  <h3 className="text-lg font-bold text-gray-900 mb-3 text-center">{feature.title}</h3>
                  <p className="text-gray-600 text-sm mb-6 text-center leading-relaxed">{feature.description}</p>
                  
                  <div className="flex flex-col items-center gap-4">
                    <span className="text-sm font-medium text-gray-500 px-4 py-2 bg-white rounded-full shadow-sm border border-gray-100">
                      {feature.stats}
                    </span>
                    
                    <button className={`flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-lg bg-gradient-to-r ${feature.accent} bg-opacity-10 text-gray-700 hover:bg-opacity-20 transition-all group-hover:scale-105`}>
                      {feature.buttonText}
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Learning Methods */}
      <div className="bg-gradient-to-b from-gray-50 to-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-50 to-cyan-50 px-6 py-3 rounded-full mb-6 border border-blue-100">
              <Brain className="w-5 h-5 text-blue-500" />
              <span className="text-blue-700 font-medium">Learning Methods</span>
            </div>
            
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Smart Learning Techniques
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Proven methods that make Japanese learning effective and enjoyable
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {learningMethods.map((method, index) => (
              <div 
                key={index}
                className={`bg-gradient-to-b ${method.gradient} rounded-2xl p-6 border ${method.borderColor} transition-all duration-300 transform hover:-translate-y-2 hover:shadow-lg`}
              >
                <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-white mb-6 mx-auto shadow-sm">
                  {method.icon}
                </div>
                
                <h3 className="text-lg font-bold text-gray-900 mb-3 text-center">{method.title}</h3>
                <p className="text-gray-600 text-sm text-center">{method.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Cultural Highlights */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-50 to-rose-50 px-6 py-3 rounded-full mb-6 border border-pink-100">
              <Blinds className="w-5 h-5 text-pink-500" />
              <span className="text-pink-700 font-medium">Cultural Insights</span>
            </div>
            
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Discover Japanese Culture
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Learn language through cultural context and real-world applications
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {cultureHighlights.map((item, index) => (
              <div 
                key={index}
                className={`${item.color} rounded-2xl p-5 text-center transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg border border-gray-100`}
              >
                <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-white mb-4 mx-auto shadow-sm">
                  {item.icon}
                </div>
                <h4 className="font-bold text-gray-900 mb-1">{item.title}</h4>
                <p className="text-sm text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quiz Preview Section */}
      <div className="relative bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 py-16 overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-purple-200/20 to-pink-200/20 rounded-full -translate-y-32 translate-x-32" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-br from-blue-200/20 to-cyan-200/20 rounded-full translate-y-32 -translate-x-32" />
        
        <div className="relative max-w-7xl mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="lg:w-1/2">
              <div className="inline-flex items-center gap-3 bg-white/80 backdrop-blur-sm px-5 py-3 rounded-full shadow-sm mb-8 border border-purple-100">
                <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
                  <Target className="w-5 h-5 text-white" />
                </div>
                <span className="text-lg font-semibold text-purple-700">Try a Sample Quiz</span>
              </div>
              
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight">
                Test Your Knowledge with
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 mt-2">
                  Interactive Quizzes
                </span>
              </h2>
              
              <p className="text-gray-600 mb-10 leading-relaxed">
                Our smart quiz system adapts to your level, provides instant feedback, and helps you track your progress over time.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => navigate("/kana-quiz")}
                  className="group relative inline-flex items-center justify-center gap-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:shadow-xl transition-all transform hover:-translate-y-1"
                >
                  <Target className="w-5 h-5" />
                  Start Quiz Now
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
            
            <div className="lg:w-1/2">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-gray-200">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">Quick Quiz</h3>
                    <p className="text-gray-600">Identify this character</p>
                  </div>
                  <div className="flex items-center gap-2 bg-purple-50 px-4 py-2 rounded-full">
                    <Timer className="w-4 h-4 text-purple-600" />
                    <span className="text-sm font-medium text-purple-700">15s remaining</span>
                  </div>
                </div>
                
                <div className="text-center p-8 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl border border-purple-100 mb-8">
                  <div className="text-8xl font-bold text-gray-900 mb-4">か</div>
                  <p className="text-lg font-medium text-gray-700">What is the correct pronunciation?</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  {['ka', 'ki', 'ku', 'ke'].map((answer, idx) => (
                    <button
                      key={idx}
                      className={`p-4 rounded-xl text-center transition-all duration-300 ${
                        answer === 'ka' 
                          ? 'bg-gradient-to-r from-emerald-50 to-green-50 border-2 border-emerald-200 shadow-sm' 
                          : 'bg-gray-50 hover:bg-gray-100 border border-gray-200'
                      }`}
                    >
                      <span className="font-mono text-xl font-bold text-gray-800">{answer}</span>
                      {answer === 'ka' && (
                        <div className="mt-2 flex items-center justify-center gap-1">
                          <CheckCircle className="w-4 h-4 text-emerald-500" />
                          <span className="text-xs text-emerald-600 font-medium">Correct</span>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Final CTA */}
      <div className="relative bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 overflow-hidden">
        {/* Sakura pattern overlay */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 text-8xl">🌸</div>
          <div className="absolute bottom-20 right-20 text-6xl">🌸</div>
          <div className="absolute top-1/3 right-1/4 text-5xl">🌸</div>
        </div>
        
        <div className="relative max-w-4xl mx-auto px-4 py-20 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">
            Begin Your Japanese Journey
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-pink-300 to-orange-300 mt-4">
              今日から始めましょう
            </span>
          </h2>
          
          <p className="text-xl text-white/90 mb-12 max-w-2xl mx-auto">
            Join thousands of learners who have discovered the joy of Japanese language and culture.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={() => navigate("/register")}
              className="group relative inline-flex items-center justify-center gap-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white px-12 py-5 rounded-xl text-lg font-bold hover:shadow-2xl transition-all transform hover:-translate-y-1 hover:scale-105 shadow-lg"
            >
              <Rocket className="w-6 h-6 group-hover:rotate-12 transition-transform" />
              Start Learning Free
              <Sparkles className="w-6 h-6 group-hover:scale-110 transition-transform" />
            </button>
            
            <button
              onClick={() => navigate("/hiragana")}
              className="group relative inline-flex items-center justify-center gap-3 bg-white/10 backdrop-blur-sm text-white border-2 border-white/30 px-12 py-5 rounded-xl text-lg font-bold hover:bg-white/20 transition-all"
            >
              <Play className="w-6 h-6" />
              Try First Lesson
              <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
            </button>
          </div>
          
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto">
            <div className="text-center">
              <div className="text-2xl font-bold text-white mb-2">100%</div>
              <div className="text-white/70 text-sm">Free to Start</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white mb-2">10min</div>
              <div className="text-white/70 text-sm">Daily Practice</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white mb-2">24/7</div>
              <div className="text-white/70 text-sm">Access</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white mb-2">🎯</div>
              <div className="text-white/70 text-sm">Structured Path</div>
            </div>
          </div>
          
          <p className="mt-12 text-white/70 text-sm">
            No credit card required • Start learning immediately • Cancel anytime
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;