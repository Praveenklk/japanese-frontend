// src/pages/jlpt/levels/N5Dashboard.tsx
import {
  CheckCircle,
  Clock,
  Target,
  Award,
  BookOpen,
  Volume2,
  Sparkles,
  BarChart3,
  Calendar,
  Trophy,
  Flame,
  ChevronRight,
  PlayCircle,
  Brain,
  Zap,
  Target as TargetIcon,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

const DashboardN5 = () => {
  const [streak, setStreak] = useState(7);

  const modules = [
    {
      title: "Essential Vocabulary",
      description: "800+ daily-use words",
      icon: <BookOpen className="w-5 h-5" />,
      progress: 75,
      link: "/n5/voc",
      lessons: 40,
      mastered: 30,
      color: "emerald",
      emoji: "📚"
    },
    {
      title: "Basic Grammar",
      description: "70+ grammar points",
      icon: <Target className="w-5 h-5" />,
      progress: 60,
      link: "/gramm",
      lessons: 25,
      mastered: 15,
      color: "blue",
      emoji: "✍️"
    },
    {
      title: "JLPT N5 Kanji",
      description: "100 essential kanji",
      icon: <Award className="w-5 h-5" />,
      progress: 85,
      link: "/kanji/n5",
      lessons: 20,
      mastered: 17,
      color: "amber",
      emoji: "漢"
    },
    {
      title: "Listening Practice",
      description: "Audio drills",
      icon: <Volume2 className="w-5 h-5" />,
      progress: 45,
      link: "/listening",
      lessons: 15,
      mastered: 7,
      color: "purple",
      emoji: "🎧"
    },
  ];

  const stats = [
    { label: "Study Streak", value: `${streak} Days`, icon: <Flame className="w-4 h-4" />, color: "orange" },
    { label: "Total XP", value: "1,250", icon: <Trophy className="w-4 h-4" />, color: "blue" },
    { label: "Study Time", value: "12h 30m", icon: <Clock className="w-4 h-4" />, color: "purple" },
    { label: "Accuracy", value: "82%", icon: <BarChart3 className="w-4 h-4" />, color: "emerald" },
  ];

  const quickActions = [
    { to: "/jlpt/n5/flashcards", label: "Flashcards", icon: "🎴", color: "from-blue-500 to-cyan-500" },
    { to: "/jlpt/n5/mock-tests", label: "Mock Tests", icon: "📊", color: "from-purple-500 to-pink-500" },
    { to: "/jlpt/n5/practice", label: "Practice", icon: "📝", color: "from-emerald-500 to-green-500" },
    { to: "/jlpt/n5/achievements", label: "Achievements", icon: "🏆", color: "from-amber-500 to-orange-500" },
  ];

  const dailyTasks = [
    { task: "Review 20 vocabulary words", completed: true },
    { task: "Complete grammar lesson 5", completed: false },
    { task: "Practice 5 new kanji", completed: true },
    { task: "Listen to 1 conversation", completed: false },
  ];

  // Animate streak counter
  useEffect(() => {
    const interval = setInterval(() => {
      setStreak(prev => prev > 0 ? prev : 7);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-300 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse delay-1000"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 animate-fade-in">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="px-4 py-1.5 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white text-sm font-medium rounded-full shadow-lg">
                JLPT N5
              </div>
              <span className="text-sm text-slate-500">Beginner Level</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900">
              Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-emerald-600">Student</span>
            </h1>
            <p className="text-slate-600">
              Continue your journey to master JLPT N5. You're making great progress!
            </p>
          </div>

          <Link
            to="/jlpt/n5/study-plan"
            className="group relative overflow-hidden bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-2xl p-5 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 animate-fade-in-up"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative z-10 flex items-center gap-3">
              <div className="p-2.5 bg-white/10 rounded-xl backdrop-blur-sm">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <div className="font-bold">Study Plan</div>
                <div className="text-sm text-slate-300">Personalized schedule</div>
              </div>
              <ChevronRight className="w-5 h-5 ml-4 transform group-hover:translate-x-2 transition-transform" />
            </div>
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-fade-in-up delay-100">
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              className="group relative overflow-hidden bg-white/80 backdrop-blur-sm rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-lg hover:border-slate-300 transition-all duration-300 hover:-translate-y-1"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-center justify-between">
                <div className={`p-3 rounded-xl bg-${stat.color}-50 text-${stat.color}-600`}>
                  {stat.icon}
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-slate-900">{stat.value}</div>
                  <div className="text-sm text-slate-500">{stat.label}</div>
                </div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-slate-200 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </div>
          ))}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Modules */}
          <div className="lg:col-span-2 space-y-8">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-slate-900">Learning Modules</h2>
                <div className="text-sm text-slate-500">
                  Overall Progress: <span className="font-bold text-emerald-600">68%</span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="relative h-4 bg-slate-100 rounded-full overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 via-emerald-500 to-emerald-600 rounded-full transform -translate-x-full animate-progress"
                  style={{ width: '68%', animation: 'progressFill 2s ease-out forwards' }}
                />
                <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-white/50 to-transparent transform -translate-y-1/2"></div>
              </div>

              {/* Modules Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {modules.map((module, index) => (
                  <Link
                    key={module.title}
                    to={module.link}
                    className="group relative overflow-hidden bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-xl hover:border-slate-300 transition-all duration-500 hover:-translate-y-2 animate-fade-in-up"
                    style={{ animationDelay: `${index * 150}ms` }}
                  >
                    {/* Animated background effect */}
                    <div className="absolute inset-0 bg-gradient-to-br from-slate-50 to-white opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    
                    {/* Corner accent */}
                    <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-${module.color}-500/10 to-transparent rounded-bl-2xl`}></div>

                    <div className="relative z-10">
                      <div className="flex items-start justify-between mb-5">
                        <div className="flex items-center gap-4">
                          <div className={`text-2xl animate-bounce`} style={{ animationDelay: `${index * 200}ms` }}>
                            {module.emoji}
                          </div>
                          <div>
                            <h3 className="text-lg font-bold text-slate-900 mb-1 group-hover:text-emerald-700 transition-colors">
                              {module.title}
                            </h3>
                            <p className="text-sm text-slate-500">{module.description}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-slate-900">{module.progress}%</div>
                          <div className="text-xs text-slate-400">Progress</div>
                        </div>
                      </div>

                      {/* Progress bar */}
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm text-slate-600">
                          <span>Lessons: {module.mastered}/{module.lessons}</span>
                          <span className="font-semibold">{module.progress}% complete</span>
                        </div>
                        <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full bg-gradient-to-r from-${module.color}-400 to-${module.color}-500 transition-all duration-1000 ease-out`}
                            style={{ width: `${module.progress}%` }}
                          />
                        </div>
                      </div>

                      {/* Animated arrow */}
                      <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transform translate-x-4 group-hover:translate-x-0 transition-all duration-300">
                        <ChevronRight className="w-5 h-5 text-slate-400" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-slate-900">Quick Actions</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {quickActions.map((action, index) => (
                  <Link
                    key={action.label}
                    to={action.to}
                    className={`group relative overflow-hidden bg-gradient-to-r ${action.color} text-white rounded-xl p-5 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 animate-fade-in-up`}
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="relative z-10 text-center">
                      <div className="text-2xl mb-2 transform group-hover:scale-110 transition-transform duration-300">
                        {action.icon}
                      </div>
                      <div className="font-semibold text-sm">{action.label}</div>
                      <div className="text-xs opacity-90 mt-1">Start practicing</div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {/* Daily Tasks */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200 p-6 shadow-sm animate-fade-in-right">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-slate-900">Today's Tasks</h3>
                <div className="text-sm text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                  2/4 completed
                </div>
              </div>
              
              <div className="space-y-3">
                {dailyTasks.map((task, index) => (
                  <div 
                    key={index} 
                    className="flex items-center gap-3 p-3 bg-slate-50 hover:bg-slate-100 rounded-xl transition-all duration-300 group animate-fade-in-up"
                    style={{ animationDelay: `${index * 150}ms` }}
                  >
                    {task.completed ? (
                      <div className="relative">
                        <CheckCircle className="w-5 h-5 text-emerald-500 animate-pulse" />
                        <div className="absolute inset-0 bg-emerald-500/20 rounded-full animate-ping"></div>
                      </div>
                    ) : (
                      <div className="w-5 h-5 rounded-full border-2 border-slate-300 group-hover:border-emerald-400 transition-colors"></div>
                    )}
                    <span className={`text-sm flex-1 ${task.completed ? 'text-slate-500 line-through' : 'text-slate-900'}`}>
                      {task.task}
                    </span>
                    {!task.completed && (
                      <PlayCircle className="w-4 h-4 text-slate-400 group-hover:text-emerald-500 transition-colors" />
                    )}
                  </div>
                ))}
              </div>

              {/* Daily Goal */}
              <div className="mt-6 pt-6 border-t border-slate-100">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-slate-900">Daily Goal</span>
                  <span className="text-sm text-slate-500">3/5 lessons</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full animate-pulse" style={{ width: '60%' }} />
                </div>
              </div>
            </div>

            {/* Study Tip */}
            <div className="relative overflow-hidden bg-gradient-to-br from-emerald-50 to-cyan-50 rounded-2xl border border-emerald-100 p-6 shadow-sm animate-fade-in-right delay-300">
              {/* Animated background */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-400 via-cyan-400 to-emerald-400 animate-slide"></div>
              
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-500 shadow-lg">
                  <Brain className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 mb-2">Study Tip</h4>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Practice vocabulary for 15 minutes daily. Spaced repetition helps long-term retention and builds strong memory patterns.
                  </p>
                </div>
              </div>
            </div>

            {/* Motivation Card */}
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 text-white shadow-xl animate-fade-in-right delay-500">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-lg mb-1">Keep Going!</h4>
                  <p className="text-sm text-slate-300">
                    Consistency beats motivation. Study 15 minutes daily and you'll see amazing progress.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center pt-8 border-t border-slate-200 animate-fade-in">
          <p className="text-slate-600">
            You're on your way to mastering Japanese! 🎌
            <span className="block text-sm text-slate-500 mt-1">
              Daily practice makes perfect
            </span>
          </p>
        </div>
      </div>

      {/* Global Animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes fadeInRight {
          from { opacity: 0; transform: translateX(30px); }
          to { opacity: 1; transform: translateX(0); }
        }
        
        @keyframes progressFill {
          from { transform: translateX(-100%); }
          to { transform: translateX(0); }
        }
        
        @keyframes slide {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        
        .animate-fade-in { animation: fadeIn 0.8s ease-out; }
        .animate-fade-in-up { animation: fadeInUp 0.6s ease-out; }
        .animate-fade-in-right { animation: fadeInRight 0.6s ease-out; }
        .animate-progress { animation: progressFill 2s ease-out forwards; }
        .animate-slide { animation: slide 2s linear infinite; }
      `}</style>
    </div>
  );
};

export default DashboardN5;