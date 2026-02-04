// src/pages/jlpt/levels/N5Dashboard.tsx
import { CheckCircle, Clock, Target, Users, TrendingUp, Award, BookOpen, Volume2, Sparkles, BarChart3, Calendar, Trophy } from 'lucide-react';
import { Link } from 'react-router-dom';

const DashboardN5 = () => {
  const modules = [
    {
      title: "Essential Vocabulary",
      description: "800+ essential words for daily conversations",
      icon: <BookOpen className="w-6 h-6 text-emerald-600" />,
      progress: 75,
      color: "emerald",
      link: "/n5/voc",
      lessons: 40,
      mastered: 30
    },
    {
      title: "Basic Grammar",
      description: "Master 70+ fundamental grammar points",
      icon: <Target className="w-6 h-6 text-blue-600" />,
      progress: 60,
      color: "blue",
      link: "/gramm",
      lessons: 25,
      mastered: 15
    },
    {
      title: "JLPT N5 Kanji",
      description: "Learn 100 essential kanji characters",
      icon: <Award className="w-6 h-6 text-amber-600" />,
      progress: 85,
      color: "amber",
      link: "/kanji/n5/",
      lessons: 20,
      mastered: 17
    },
    {
      title: "Listening Practice",
      description: "Improve comprehension with audio exercises",
      icon: <Volume2 className="w-6 h-6 text-purple-600" />,
      progress: 45,
      color: "purple",
      link: "listening",
      lessons: 15,
      mastered: 7
    }
  ];

  const recentActivities = [
    { 
      id: 1, 
      action: "Completed Vocabulary Quiz", 
      time: "2 hours ago", 
      score: "85%",
      icon: <BookOpen className="w-4 h-4" />,
      color: "emerald"
    },
    { 
      id: 2, 
      action: "Learned 10 new kanji", 
      time: "Yesterday", 
      score: "Perfect",
      icon: <Award className="w-4 h-4" />,
      color: "amber"
    },
    { 
      id: 3, 
      action: "Grammar Practice", 
      time: "2 days ago", 
      score: "78%",
      icon: <Target className="w-4 h-4" />,
      color: "blue"
    }
  ];

  const stats = [
    { label: "Study Streak", value: "7 days", icon: <Sparkles className="w-5 h-5 text-amber-500" />, change: "+2" },
    { label: "Total XP", value: "1,250", icon: <Trophy className="w-5 h-5 text-blue-500" />, change: "+150" },
    { label: "Study Time", value: "12h 30m", icon: <Clock className="w-5 h-5 text-purple-500" />, change: "+1h" },
    { label: "Accuracy", value: "82%", icon: <BarChart3 className="w-5 h-5 text-emerald-500" />, change: "+3%" }
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-8">
      {/* Header with Welcome */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-2">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            Welcome back, <span className="text-emerald-600">Student!</span> 👋
          </h1>
          <p className="text-gray-600">
            Continue your journey to master JLPT N5. You're making great progress!
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-sm text-gray-500">Current Level</div>
            <div className="text-xl font-bold text-gray-900">N5 Beginner</div>
          </div>
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center text-white font-bold">
            N5
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Progress & Modules */}
        <div className="lg:col-span-2 space-y-8">
          {/* Progress Overview Card */}
          <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold mb-2">Overall Progress</h3>
                <p className="text-gray-300">Complete all modules to master N5</p>
              </div>
              <div className="text-right">
                <div className="text-4xl font-bold">68%</div>
                <div className="text-gray-300">Complete</div>
              </div>
            </div>
            
            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progress</span>
                <span className="font-semibold">68/100</span>
              </div>
              <div className="h-3 bg-gray-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full transition-all duration-1000"
                  style={{ width: '68%' }}
                />
              </div>
            </div>
            
            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              {stats.map((stat) => (
                <div key={stat.label} className="bg-gray-800/50 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="p-2 rounded-lg bg-gray-700/50">
                      {stat.icon}
                    </div>
                    {stat.change && (
                      <span className="text-xs font-semibold px-2 py-1 bg-emerald-500/20 text-emerald-300 rounded-full">
                        {stat.change}
                      </span>
                    )}
                  </div>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <div className="text-sm text-gray-400">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Learning Modules */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Learning Modules</h3>
              <Link 
                to="/jlpt/n5/study-plan" 
                className="text-emerald-600 hover:text-emerald-700 font-medium text-sm flex items-center gap-2"
              >
                <Calendar className="w-4 h-4" />
                Study Plan
              </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {modules.map((module) => (
                <Link
                  key={module.title}
                  to={module.link}
                  className="group relative overflow-hidden bg-white rounded-xl border border-gray-200 p-6 hover:shadow-xl transition-all duration-300"
                >
                  {/* Corner accent */}
                  <div className={`absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-${module.color}-50 to-transparent rounded-bl-full`} />
                  
                  <div className="relative z-10">
                    <div className="flex items-start justify-between mb-5">
                      <div className={`p-3 rounded-xl bg-${module.color}-50`}>
                        {module.icon}
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-gray-900">{module.progress}%</div>
                        <div className="text-xs text-gray-500">Progress</div>
                      </div>
                    </div>
                    
                    <h4 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-emerald-700 transition-colors">
                      {module.title}
                    </h4>
                    <p className="text-gray-600 text-sm mb-4">
                      {module.description}
                    </p>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm text-gray-700">
                        <span>Lessons: {module.mastered}/{module.lessons}</span>
                        <span className="font-semibold">{module.progress}% complete</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div 
                          className={`h-full bg-gradient-to-r from-${module.color}-400 to-${module.color}-500 rounded-full transition-all duration-700`}
                          style={{ width: `${module.progress}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Activity & Quick Actions */}
        <div className="space-y-8">
          {/* Recent Activity */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-900">Recent Activity</h3>
              <Link 
                to="/jlpt/n5/activity" 
                className="text-sm text-gray-500 hover:text-emerald-600"
              >
                View all
              </Link>
            </div>
            
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div 
                  key={activity.id} 
                  className="flex items-center gap-4 p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors group"
                >
                  <div className={`p-3 rounded-lg bg-${activity.color}-50 text-${activity.color}-600`}>
                    {activity.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-gray-900 truncate">
                      {activity.action}
                    </div>
                    <div className="text-sm text-gray-500 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {activity.time}
                    </div>
                  </div>
                  <div className={`px-3 py-1.5 rounded-full text-sm font-semibold ${
                    activity.score === 'Perfect' 
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                      : 'bg-blue-50 text-blue-700 border border-blue-100'
                  }`}>
                    {activity.score}
                  </div>
                </div>
              ))}
            </div>
            
            {/* Daily Goal */}
            <div className="mt-6 pt-6 border-t border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <div className="font-medium text-gray-900">Daily Goal</div>
                <div className="text-sm text-gray-500">3/5 lessons</div>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full" style={{ width: '60%' }} />
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-gradient-to-br from-emerald-50 to-blue-50 rounded-2xl border border-emerald-100 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Quick Actions</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <Link
                to="/jlpt/n5/practice-test"
                className="bg-white hover:shadow-md border border-gray-200 rounded-xl p-4 text-center group hover:border-emerald-200 transition-all"
              >
                <div className="text-2xl mb-2">📝</div>
                <div className="font-semibold text-gray-900 group-hover:text-emerald-700">Practice Test</div>
              </Link>
              
              <Link
                to="/jlpt/n5/vocabulary"
                className="bg-white hover:shadow-md border border-gray-200 rounded-xl p-4 text-center group hover:border-emerald-200 transition-all"
              >
                <div className="text-2xl mb-2">📚</div>
                <div className="font-semibold text-gray-900 group-hover:text-emerald-700">Vocabulary</div>
              </Link>
              
              <Link
                to="/jlpt/n5/grammar"
                className="bg-white hover:shadow-md border border-gray-200 rounded-xl p-4 text-center group hover:border-emerald-200 transition-all"
              >
                <div className="text-2xl mb-2">✍️</div>
                <div className="font-semibold text-gray-900 group-hover:text-emerald-700">Grammar</div>
              </Link>
              
              <Link
                to="/jlpt/basic/kana-quiz"
                className="bg-white hover:shadow-md border border-gray-200 rounded-xl p-4 text-center group hover:border-emerald-200 transition-all"
              >
                <div className="text-2xl mb-2">あ</div>
                <div className="font-semibold text-gray-900 group-hover:text-emerald-700">Kana Practice</div>
              </Link>
            </div>
            
            {/* Study Tip */}
            <div className="mt-6 pt-6 border-t border-emerald-100">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-emerald-100 text-emerald-600">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-medium text-gray-900 text-sm">Study Tip</div>
                  <p className="text-gray-600 text-xs mt-1">
                    Practice vocabulary for 15 minutes daily. Spaced repetition helps long-term retention.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Upcoming Goals */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Upcoming Goals</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gradient-to-r from-emerald-50 to-transparent rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                  <span className="font-medium text-gray-900">Complete 50 words</span>
                </div>
                <span className="text-sm text-emerald-600 font-semibold">+100 XP</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-transparent rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                  <span className="font-medium text-gray-900">Grammar quiz 80%+</span>
                </div>
                <span className="text-sm text-blue-600 font-semibold">+150 XP</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gradient-to-r from-amber-50 to-transparent rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                  <span className="font-medium text-gray-900">Learn 10 kanji</span>
                </div>
                <span className="text-sm text-amber-600 font-semibold">+75 XP</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section - Additional Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link 
          to="/jlpt/n5/flashcards"
          className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl p-6 hover:shadow-lg transition-shadow"
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl mb-2">🎴</div>
              <h4 className="font-bold text-lg mb-2">Interactive Flashcards</h4>
              <p className="text-blue-100 text-sm">Study with spaced repetition</p>
            </div>
            <div className="text-2xl">→</div>
          </div>
        </Link>
        
        <Link 
          to="/jlpt/n5/mock-tests"
          className="bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl p-6 hover:shadow-lg transition-shadow"
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl mb-2">📊</div>
              <h4 className="font-bold text-lg mb-2">Mock Tests</h4>
              <p className="text-purple-100 text-sm">Simulate real JLPT exams</p>
            </div>
            <div className="text-2xl">→</div>
          </div>
        </Link>
        
        <Link 
          to="/jlpt/n5/achievements"
          className="bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-xl p-6 hover:shadow-lg transition-shadow"
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl mb-2">🏆</div>
              <h4 className="font-bold text-lg mb-2">Achievements</h4>
              <p className="text-amber-100 text-sm">Unlock badges & rewards</p>
            </div>
            <div className="text-2xl">→</div>
          </div>
        </Link>
      </div>

      {/* Footer Note */}
      <div className="text-center text-gray-500 text-sm pt-4 border-t border-gray-100">
        <p>Keep studying consistently! 15 minutes daily is better than 2 hours once a week. 🚀</p>
      </div>
    </div>
  );
};

export default DashboardN5;