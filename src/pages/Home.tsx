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
  Sparkles,
  Target,
  Zap,
  Clock,
  Star,
  Trophy,
  GraduationCap,
  Heart,
  Shield,
  Globe,
  Coffee,
  Compass,
  Music,
  BookText,
  ChevronRight,
  Rocket,
  Crown,
  Timer,
  Medal,
  Flame,
  Bookmark,
  Search,
  Eye,
  Mic,
  PenTool,
  MousePointerClick,
  Mountain,
  Waves,
  Moon,
  Sun,
  Cloud,
  Wind,
  Map,
  Blinds,
  GalleryThumbnails,
  Flower,
  GalleryThumbnailsIcon,
  Panda,
  TreeDeciduous,
  LucideAntenna,
  Footprints,

} from "lucide-react";

const Home = () => {
  const navigate = useNavigate();

  // Japanese-themed background images (you can replace with actual image URLs)
  const images = {
    sakura: "https://images.unsplash.com/photo-1528164344705-47542687000d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    torii: "https://images.unsplash.com/photo-1526481280693-3bfa7568e0f3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    temple: "https://images.unsplash.com/photo-1545569341-9eb8b30979d9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    street: "https://images.unsplash.com/photo-1545569341-9eb8b30979d9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    garden: "https://images.unsplash.com/photo-1545569341-9eb8b30979d9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
  };

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
      bgColor: "bg-gradient-to-br from-red-50/50 to-pink-50/50",
      image: images.sakura
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
      bgColor: "bg-gradient-to-br from-blue-50/50 to-cyan-50/50",
      image: images.temple
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
      bgColor: "bg-gradient-to-br from-amber-50/50 to-orange-50/50",
      image: images.street
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
      bgColor: "bg-gradient-to-br from-emerald-50/50 to-green-50/50",
      image: images.garden
    }
  ];

  const learningFeatures = [
    {
      title: "Hiragana Mastery",
      description: "Master all 46 basic hiragana characters with interactive lessons",
      icon: <span className="text-4xl font-bold text-red-500">あ</span>,
      link: "/hiragana",
      color: "bg-white/90 backdrop-blur-sm border-red-100",
      stats: "46 Characters",
      status: "available",
      buttonText: "Start Learning",
      accent: "from-red-400 to-pink-400",
      badgeColor: "bg-red-100 text-red-700",
      japaneseText: "ひらがな"
    },
    {
      title: "Katakana Training",
      description: "Learn katakana used for foreign words and technical terms",
      icon: <span className="text-4xl font-bold text-blue-500">ア</span>,
      link: "/katakana",
      color: "bg-white/90 backdrop-blur-sm border-blue-100",
      stats: "46 Characters",
      status: "available",
      buttonText: "Start Learning",
      accent: "from-blue-400 to-cyan-400",
      badgeColor: "bg-blue-100 text-blue-700",
      japaneseText: "カタカナ"
    },
    {
      title: "Kana Quiz Challenge",
      description: "Test your knowledge with customizable quiz options",
      icon: <Target className="w-10 h-10 text-purple-500" />,
      link: "/kana-quiz",
      color: "bg-white/90 backdrop-blur-sm border-purple-100",
      stats: "3 Quiz Modes",
      status: "new",
      buttonText: "Take Quiz",
      accent: "from-purple-400 to-violet-400",
      badgeColor: "bg-purple-100 text-purple-700",
      badge: "人気",
      japaneseText: "クイズ"
    },
    {
      title: "Smart Flashcards",
      description: "Spaced repetition system with audio and multiple quiz modes",
      icon: <Brain className="w-10 h-10 text-emerald-500" />,
      link: "/flashcards",
      color: "bg-white/90 backdrop-blur-sm border-emerald-100",
      stats: "3 Study Modes",
      status: "available",
      buttonText: "Practice Now",
      accent: "from-emerald-400 to-green-400",
      badgeColor: "bg-emerald-100 text-emerald-700",
      japaneseText: "フラッシュカード"
    },
    {
      title: "Kanji Explorer",
      description: "Explore kanji with meanings, readings, stroke order, and JLPT levels",
      icon: <span className="text-4xl font-bold text-amber-600">字</span>,
      link: "/kanji/value",
      color: "bg-white/90 backdrop-blur-sm border-amber-100",
      stats: "JLPT N5–N1",
      status: "new",
      buttonText: "Explore Kanji",
      accent: "from-amber-400 to-orange-400",
      badgeColor: "bg-amber-100 text-amber-700",
      japaneseText: "漢字"
    },
    {
      title: "JLPT Learning Path",
      description: "Structured lessons from N5 to N1 with vocabulary, grammar, and tests",
      icon: <GraduationCap className="w-10 h-10 text-indigo-500" />,
      link: "/jlpt",
      color: "bg-white/90 backdrop-blur-sm border-indigo-100",
      stats: "N5-N1 Complete",
      status: "available",
      buttonText: "Start Learning",
      accent: "from-indigo-400 to-purple-400",
      badgeColor: "bg-indigo-100 text-indigo-700",
      japaneseText: "日本語能力試験"
    },
    {
      title: "Story Hub",
      description: "Explore Japanese stories and improve reading comprehension",
      icon: <BookOpen className="w-10 h-10 text-violet-500" />,
      link: "/stories/access",
      color: "bg-white/90 backdrop-blur-sm border-violet-100",
      stats: "Stories Library",
      status: "new",
      buttonText: "Read Stories",
      accent: "from-violet-400 to-fuchsia-400",
      badgeColor: "bg-violet-100 text-violet-700",
      japaneseText: "物語"
    },
    {
      title: "Learning Hub",
      description: "Access all learning modules: Grammar, Vocabulary, and more",
      icon: <Compass className="w-10 h-10 text-cyan-500" />,
      link: "/learn",
      color: "bg-white/90 backdrop-blur-sm border-cyan-100",
      stats: "6 Modules",
      status: "available",
      buttonText: "Explore All",
      accent: "from-cyan-400 to-blue-400",
      badgeColor: "bg-cyan-100 text-cyan-700",
      japaneseText: "学習センター"
    }
  ];

  // Check user progress
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
      japaneseText: "学習者",
      change: "+18% this month"
    },
    { 
      label: "Characters Mastered", 
      value: `${learnedCount}/92`, 
      icon: Award,
      color: "from-emerald-400 to-green-400",
      japaneseText: "文字",
      change: "Your progress"
    },
    { 
      label: "Success Rate", 
      value: "94%", 
      icon: TrendingUp,
      color: "from-violet-400 to-purple-400",
      japaneseText: "成功率",
      change: "+4% from last month"
    },
    { 
      label: "Quizzes Completed", 
      value: getQuizCount(), 
      icon: Target,
      color: "from-rose-400 to-pink-400",
      japaneseText: "クイズ完了",
      change: "Keep it up!"
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
      iconColor: "text-red-500",
      japaneseText: "続ける"
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
      badge: "NEW",
      japaneseText: "日替わりチャレンジ"
    },
    {
      title: "Read Today's Story",
      description: "Improve your reading comprehension",
      action: () => navigate("/stories/access"),
      icon: BookText,
      gradient: "bg-gradient-to-br from-emerald-400/20 to-green-400/20",
      borderColor: "border-emerald-200",
      textColor: "text-emerald-700",
      iconColor: "text-emerald-500",
      japaneseText: "今日の物語"
    }
  ];

  const culturalElements = [
    {
      icon: <Flower className="w-6 h-6 text-pink-500" />,
      title: "桜",
      description: "Cherry Blossoms",
      color: "from-pink-100 to-rose-100"
    },
    {
      icon: <GalleryThumbnailsIcon className="w-6 h-6 text-red-500" />,
      title: "鳥居",
      description: "Torii Gates",
      color: "from-red-100 to-orange-100"
    },
    {
      icon: <Panda className="w-6 h-6 text-amber-500" />,
      title: "塔",
      description: "Pagodas",
      color: "from-amber-100 to-yellow-100"
    },
    {
      icon: <TreeDeciduous className="w-6 h-6 text-emerald-500" />,
      title: "竹",
      description: "Bamboo Forests",
      color: "from-emerald-100 to-green-100"
    },
    {
      icon: <LucideAntenna className="w-6 h-6 text-orange-500" />,
      title: "提灯",
      description: "Lanterns",
      color: "from-orange-100 to-amber-100"
    },
    {
      icon: <Footprints className="w-6 h-6 text-rose-500" />,
      title: "寿司",
      description: "Sushi",
      color: "from-rose-100 to-pink-100"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section with Japanese Theme */}
      <div className="relative overflow-hidden bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 text-white">
        {/* Background with Japanese pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23ffffff' fill-opacity='0.1' fill-rule='evenodd'/%3E%3C/svg%3E")`,
            backgroundSize: '300px 300px'
          }} />
        </div>

        {/* Cherry blossom overlay */}
        <div className="absolute top-10 left-10 text-6xl opacity-10 animate-float">🌸</div>
        <div className="absolute bottom-20 right-10 text-6xl opacity-10 animate-float animation-delay-1000">🗻</div>
        <div className="absolute top-1/3 right-1/4 text-5xl opacity-5 animate-float animation-delay-2000">🎌</div>

        <div className="relative max-w-7xl mx-auto px-4 pt-20 pb-16 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            {/* Welcome Badge */}
            <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full mb-8 border border-white/20">
              <Sparkles className="w-4 h-4 text-yellow-300" />
              <span className="text-sm font-medium">ようこそ！ Welcome to Nihongo Master</span>
              <div className="w-2 h-2 bg-gradient-to-r from-pink-400 to-rose-400 rounded-full animate-pulse" />
            </div>
            
            {/* Main Title with Japanese calligraphy effect */}
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
        
        {/* Japanese wave divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg className="w-full h-20 text-white" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" fill="currentColor"></path>
          </svg>
        </div>
      </div>

      {/* Cultural Elements Showcase */}
      <div className="py-12 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            {culturalElements.map((item, index) => (
              <div 
                key={index}
                className={`bg-gradient-to-br ${item.color} rounded-2xl p-4 text-center transition-all duration-300 hover:-translate-y-2 hover:shadow-lg border border-gray-200/50`}
              >
                <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-white mb-3 mx-auto shadow-sm">
                  {item.icon}
                </div>
                <div className="font-bold text-lg text-gray-900 mb-1">{item.title}</div>
                <div className="text-xs text-gray-600">{item.description}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            クイックスタート
          </span>
          <span className="block text-2xl text-gray-600 font-normal mt-2">Quick Start</span>
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {quickActions.map((action, index) => (
            <button
              key={index}
              onClick={action.action}
              className={`relative overflow-hidden rounded-2xl p-6 text-left group transition-all duration-300 transform hover:-translate-y-2 hover:shadow-xl border ${action.borderColor} ${action.gradient}`}
            >
              <div className="relative z-10">
                <div className="flex items-start justify-between">
                  <div>
                    <div className={`p-3 rounded-xl ${action.gradient} w-fit mb-4`}>
                      <action.icon className={`w-6 h-6 ${action.iconColor}`} />
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className={`text-xl font-bold ${action.textColor}`}>{action.title}</h3>
                      <span className="text-sm text-gray-500">| {action.japaneseText}</span>
                    </div>
                    <p className="text-gray-600 text-sm">{action.description}</p>
                  </div>
                  <ArrowRight className={`w-5 h-5 ${action.textColor} opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all`} />
                </div>
                
                {action.badge && (
                  <span className="absolute top-4 right-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                    {action.badge}
                  </span>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Learning Journey */}
      <div className="py-16 bg-gradient-to-b from-white to-gray-50/50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              学習の道
              <span className="block text-2xl text-gray-600 font-normal mt-2">Your Learning Journey</span>
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Follow this structured path from beginner basics to advanced fluency
            </p>
          </div>
          
          <div className="relative">
            {/* Japanese scroll effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-red-50/20 to-transparent rounded-3xl" />
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {learningJourney.map((step, index) => (
                <div
                  key={index}
                  onClick={() => navigate(step.link)}
                  className={`relative group overflow-hidden rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 cursor-pointer ${step.bgColor} border border-gray-200`}
                >
                  {/* Background pattern */}
                  <div className="absolute inset-0 opacity-5">
                    <div className="absolute inset-0" style={{
                      backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(0,0,0,0.1) 1px, transparent 1px)',
                      backgroundSize: '20px 20px'
                    }} />
                  </div>
                  
                  <div className="relative z-10">
                    <div className="flex items-start gap-6">
                      <div className={`flex-shrink-0 w-20 h-20 rounded-2xl ${step.bgColor} flex items-center justify-center border-2 border-white shadow-lg`}>
                        {step.icon}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <span className={`text-sm font-semibold px-4 py-1.5 rounded-full bg-gradient-to-r ${step.color} text-white shadow-sm`}>
                            Step {step.stage}
                          </span>
                          <span className="text-xs text-gray-500 bg-white/50 px-2 py-1 rounded">
                            {step.features.length} modules
                          </span>
                        </div>
                        
                        <h3 className="text-2xl font-bold text-gray-900 mb-3">{step.title}</h3>
                        <p className="text-gray-600 mb-6">{step.description}</p>
                        
                        <div className="flex flex-wrap gap-2 mb-6">
                          {step.features.map((feature, idx) => (
                            <span
                              key={idx}
                              className="text-sm px-4 py-2 bg-white/70 backdrop-blur-sm rounded-lg text-gray-700 border border-gray-300/30 shadow-sm"
                            >
                              {feature}
                            </span>
                          ))}
                        </div>
                        
                        <button className={`group inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r ${step.color} text-white font-semibold hover:shadow-lg transition-all transform hover:scale-105`}>
                          Start Learning
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  {/* Hover effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Stats Dashboard */}
      <div className="py-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              学習統計
              <span className="block text-2xl text-gray-600 font-normal mt-2">Learning Statistics</span>
            </h2>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div 
                key={index}
                className="relative overflow-hidden bg-white rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100"
              >
                {/* Glow effect */}
                <div className={`absolute -inset-1 bg-gradient-to-r ${stat.color} opacity-10 blur-lg`} />
                
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-xl bg-gradient-to-r ${stat.color} bg-opacity-10`}>
                      <stat.icon className={`w-6 h-6 bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`} />
                    </div>
                    <span className="text-xs font-medium text-gray-500">{stat.japaneseText}</span>
                  </div>
                  
                  <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                  
                  <div className="mt-4 text-xs font-medium text-emerald-600 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    {stat.change}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="py-16 bg-gradient-to-b from-white to-gray-50/50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              学習機能
              <span className="block text-2xl text-gray-600 font-normal mt-2">Learning Features</span>
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Comprehensive tools designed for effective Japanese learning
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {learningFeatures.map((feature, index) => (
              <div
                key={index}
                onClick={() => navigate(feature.link)}
                className={`${feature.color} rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-3 cursor-pointer border relative overflow-hidden group`}
              >
                {/* Feature number */}
                <div className="absolute -top-3 -left-3 w-12 h-12 bg-gradient-to-r from-gray-100 to-white rounded-full flex items-center justify-center text-2xl font-bold text-gray-400 border border-gray-200">
                  {index + 1}
                </div>
                
                {/* Japanese text badge */}
                <div className="absolute top-4 right-4 bg-white/80 backdrop-blur-sm px-3 py-1 rounded-full border border-gray-200">
                  <span className="text-sm font-bold text-gray-700">{feature.japaneseText}</span>
                </div>
                
                {/* Status badge */}
                {feature.status === "new" && (
                  <span className={`absolute top-4 left-4 ${feature.badgeColor} text-xs font-bold px-3 py-1.5 rounded-full shadow-sm`}>
                    {feature.badge || "NEW"}
                  </span>
                )}
                
                <div className="relative p-6">
                  <div className="flex items-center justify-center w-20 h-20 rounded-2xl mb-6 mx-auto bg-gradient-to-br from-white to-gray-50 shadow-inner border border-gray-200">
                    {feature.icon}
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">{feature.title}</h3>
                  <p className="text-gray-600 text-sm mb-6 text-center leading-relaxed">{feature.description}</p>
                  
                  <div className="flex flex-col items-center gap-4">
                    <span className="text-sm font-medium text-gray-500 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full shadow-sm border border-gray-100">
                      {feature.stats}
                    </span>
                    
                    <button className={`flex items-center gap-2 text-sm font-semibold px-6 py-3 rounded-xl bg-gradient-to-r ${feature.accent} text-white hover:shadow-lg transition-all transform group-hover:scale-105 shadow-md`}>
                      {feature.buttonText}
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
                
                {/* Hover effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quiz Preview Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-purple-900 via-violet-900 to-indigo-900 py-20">
        {/* Japanese pattern overlay */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '30px 30px'
          }} />
        </div>

        <div className="relative max-w-7xl mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="lg:w-1/2">
              <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full mb-8 border border-white/20">
                <div className="p-2 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-lg">
                  <Target className="w-5 h-5 text-white" />
                </div>
                <span className="text-lg font-semibold text-white">挑戦してみよう！</span>
              </div>
              
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
                Test Your Knowledge with
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-orange-300 to-pink-300 mt-4">
                  Interactive Quizzes
                </span>
              </h2>
              
              <p className="text-white/90 mb-10 leading-relaxed text-lg">
                Our smart quiz system adapts to your level, provides instant feedback, and helps you track your progress over time.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => navigate("/kana-quiz")}
                  className="group relative inline-flex items-center justify-center gap-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:shadow-2xl transition-all transform hover:-translate-y-1 hover:scale-105"
                >
                  <Target className="w-5 h-5" />
                  Start Quiz Now
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
            
            <div className="lg:w-1/2">
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 blur-3xl rounded-3xl" />
                <div className="relative bg-white/10 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-white/20">
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <h3 className="text-2xl font-bold text-white">クイッククイズ</h3>
                      <p className="text-white/70">Identify this character</p>
                    </div>
                    <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full">
                      <Timer className="w-4 h-4 text-yellow-300" />
                      <span className="text-sm font-medium text-yellow-300">15秒</span>
                    </div>
                  </div>
                  
                  <div className="text-center p-8 bg-white/5 rounded-2xl border border-white/10 mb-8">
                    <div className="text-8xl font-bold text-white mb-4 animate-pulse">か</div>
                    <p className="text-lg font-medium text-white">What is the correct pronunciation?</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    {['ka', 'ki', 'ku', 'ke'].map((answer, idx) => (
                      <button
                        key={idx}
                        className={`p-4 rounded-xl text-center transition-all duration-300 ${
                          answer === 'ka' 
                            ? 'bg-gradient-to-r from-emerald-500/20 to-green-500/20 border-2 border-emerald-400/30 shadow-lg' 
                            : 'bg-white/5 hover:bg-white/10 border border-white/10'
                        }`}
                      >
                        <span className={`font-mono text-xl font-bold ${
                          answer === 'ka' ? 'text-emerald-300' : 'text-white'
                        }`}>
                          {answer}
                        </span>
                        {answer === 'ka' && (
                          <div className="mt-2 flex items-center justify-center gap-1">
                            <CheckCircle className="w-4 h-4 text-emerald-300" />
                            <span className="text-xs text-emerald-300 font-medium">正解</span>
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
      </div>

      {/* Final CTA */}
      <div className="relative overflow-hidden">
        {/* Background image with overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${images.torii})`,
            filter: 'brightness(0.3)'
          }}
        />
        
        <div className="relative max-w-4xl mx-auto px-4 py-20 text-center">
          <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full mb-8 border border-white/20">
            <Sparkles className="w-5 h-5 text-yellow-300" />
            <span className="text-sm font-medium text-white">始めましょう！</span>
          </div>
          
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-8">
            Begin Your Japanese Journey
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-orange-300 to-red-300 mt-6">
              今日から始めましょう
            </span>
          </h2>
          
          <p className="text-xl text-white/90 mb-12 max-w-2xl mx-auto">
            Join thousands of learners who have discovered the joy of Japanese language and culture through our immersive platform.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <button
              onClick={() => navigate("/hiragana")}
              className="group relative inline-flex items-center justify-center gap-3 bg-gradient-to-r from-red-500 to-orange-500 text-white px-12 py-5 rounded-xl text-lg font-bold hover:shadow-2xl transition-all transform hover:-translate-y-1 hover:scale-105 shadow-lg"
            >
              <Rocket className="w-6 h-6 group-hover:rotate-12 transition-transform" />
              Start Learning Free
              <Sparkles className="w-6 h-6 group-hover:scale-110 transition-transform" />
            </button>
            
            <button
              onClick={() => navigate("/register")}
              className="group relative inline-flex items-center justify-center gap-3 bg-white/10 backdrop-blur-sm text-white border-2 border-white/30 px-12 py-5 rounded-xl text-lg font-bold hover:bg-white/20 transition-all hover:border-white/50"
            >
              <Play className="w-6 h-6" />
              Try First Lesson
              <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
            </button>
          </div>
          
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">100%</div>
              <div className="text-white/70 text-sm">無料スタート</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">10分</div>
              <div className="text-white/70 text-sm">毎日練習</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">24/7</div>
              <div className="text-white/70 text-sm">アクセス</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">🎯</div>
              <div className="text-white/70 text-sm">構造化パス</div>
            </div>
          </div>
          
          <p className="mt-12 text-white/70 text-sm">
            クレジットカード不要 • すぐに始められます • いつでもキャンセル可能
          </p>
        </div>
      </div>

      {/* Footer with Japanese pattern */}
      <div className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="text-2xl">🌸</span>
            <span className="text-lg font-medium">日本語マスター</span>
            <span className="text-2xl">🗻</span>
          </div>
          <p className="text-gray-400 text-sm">
            日本の美しさを学びましょう • Learn the Beauty of Japan
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;