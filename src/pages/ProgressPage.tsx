import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Calendar, 
  Target, 
  Award, 
  Clock, 
  CheckCircle, 
  XCircle,
  Activity,
  TrendingDown,
  Star
} from 'lucide-react';

const ProgressPage = () => {
  const [hiraganaProgress, setHiraganaProgress] = useState(0);
  const [katakanaProgress, setKatakanaProgress] = useState(0);
  const [streak, setStreak] = useState(0);
  const [totalStudyTime, setTotalStudyTime] = useState(0);
  const [accuracy, setAccuracy] = useState(0);
  const [dailyStats, setDailyStats] = useState<any[]>([]);

  useEffect(() => {
    // Load progress from localStorage
    const savedHiragana = JSON.parse(localStorage.getItem('learnedHiragana') || '[]');
    const savedKatakana = JSON.parse(localStorage.getItem('learnedKatakana') || '[]');
    
    setHiraganaProgress(Math.round((savedHiragana.length / 46) * 100));
    setKatakanaProgress(Math.round((savedKatakana.length / 46) * 100));
    
    // Load other stats
    const stats = JSON.parse(localStorage.getItem('studyStats') || '{}');
    setStreak(stats.streak || 0);
    setTotalStudyTime(stats.totalStudyTime || 0);
    setAccuracy(stats.accuracy || 0);
    setDailyStats(stats.dailyStats || []);
  }, []);

  const statsCards = [
    {
      title: 'Current Streak',
      value: streak,
      icon: <TrendingUp className="w-6 h-6 text-green-600" />,
      color: 'bg-green-50',
      textColor: 'text-green-700'
    },
    {
      title: 'Total Study Time',
      value: `${Math.floor(totalStudyTime / 60)}h ${totalStudyTime % 60}m`,
      icon: <Clock className="w-6 h-6 text-blue-600" />,
      color: 'bg-blue-50',
      textColor: 'text-blue-700'
    },
    {
      title: 'Accuracy Rate',
      value: `${accuracy}%`,
      icon: <Target className="w-6 h-6 text-purple-600" />,
      color: 'bg-purple-50',
      textColor: 'text-purple-700'
    },
    {
      title: 'Mastery Level',
      value: `${Math.round((hiraganaProgress + katakanaProgress) / 2)}%`,
      icon: <Award className="w-6 h-6 text-amber-600" />,
      color: 'bg-amber-50',
      textColor: 'text-amber-700'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Progress</h1>
        <p className="text-gray-600">Track your Japanese learning journey</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statsCards.map((stat, index) => (
          <div key={index} className={`${stat.color} rounded-2xl p-6 shadow-sm`}>
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className={`text-3xl font-bold ${stat.textColor} mt-2`}>{stat.value}</p>
              </div>
              {stat.icon}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Progress Bars */}
        <div className="bg-white rounded-2xl shadow p-6">
          <div className="flex items-center gap-2 mb-6">
            <BarChart3 className="w-6 h-6 text-gray-700" />
            <h2 className="text-xl font-bold text-gray-900">Character Mastery</h2>
          </div>
          
          <div className="space-y-6">
            {/* Hiragana Progress */}
            <div>
              <div className="flex justify-between mb-2">
                <span className="font-medium text-gray-700">Hiragana</span>
                <span className="font-bold text-red-600">{hiraganaProgress}%</span>
              </div>
              <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-red-500 transition-all duration-500"
                  style={{ width: `${hiraganaProgress}%` }}
                />
              </div>
            </div>

            {/* Katakana Progress */}
            <div>
              <div className="flex justify-between mb-2">
                <span className="font-medium text-gray-700">Katakana</span>
                <span className="font-bold text-blue-600">{katakanaProgress}%</span>
              </div>
              <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-500 transition-all duration-500"
                  style={{ width: `${katakanaProgress}%` }}
                />
              </div>
            </div>

            {/* Combined Progress */}
            <div>
              <div className="flex justify-between mb-2">
                <span className="font-medium text-gray-700">Overall Progress</span>
                <span className="font-bold text-green-600">
                  {Math.round((hiraganaProgress + katakanaProgress) / 2)}%
                </span>
              </div>
              <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-green-500 transition-all duration-500"
                  style={{ width: `${Math.round((hiraganaProgress + katakanaProgress) / 2)}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-2xl shadow p-6">
          <div className="flex items-center gap-2 mb-6">
            <Activity className="w-6 h-6 text-gray-700" />
            <h2 className="text-xl font-bold text-gray-900">Recent Activity</h2>
          </div>
          
          <div className="space-y-4">
            {dailyStats.length > 0 ? (
              dailyStats.slice(0, 5).map((stat: any, index: number) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    {stat.correct > stat.wrong ? (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-500" />
                    )}
                    <div>
                      <p className="font-medium">{stat.type}</p>
                      <p className="text-sm text-gray-500">{stat.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">{stat.correct}/{stat.total}</p>
                    <p className="text-sm text-gray-500">{Math.round((stat.correct/stat.total)*100)}%</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No activity recorded yet</p>
                <p className="text-sm text-gray-400 mt-2">Start learning to see your progress!</p>
              </div>
            )}
          </div>

          {/* Achievement Badges */}
          <div className="mt-8 pt-6 border-t">
            <h3 className="font-bold text-gray-700 mb-4">Achievements</h3>
            <div className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mb-2">
                  <Star className="w-8 h-8 text-amber-600" />
                </div>
                <span className="text-sm font-medium">Beginner</span>
              </div>
              <div className="flex flex-col items-center">
                <div className={`w-16 h-16 ${hiraganaProgress >= 50 ? 'bg-green-100' : 'bg-gray-100'} rounded-full flex items-center justify-center mb-2`}>
                  <Award className={`w-8 h-8 ${hiraganaProgress >= 50 ? 'text-green-600' : 'text-gray-400'}`} />
                </div>
                <span className="text-sm font-medium">Hiragana 50%</span>
              </div>
              <div className="flex flex-col items-center">
                <div className={`w-16 h-16 ${streak >= 7 ? 'bg-purple-100' : 'bg-gray-100'} rounded-full flex items-center justify-center mb-2`}>
                  <TrendingUp className={`w-8 h-8 ${streak >= 7 ? 'text-purple-600' : 'text-gray-400'}`} />
                </div>
                <span className="text-sm font-medium">7-Day Streak</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Study Goals */}
      <div className="mt-8 bg-white rounded-2xl shadow p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Study Goals</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-4 bg-red-50 rounded-xl">
            <div className="flex items-center gap-2 mb-3">
              <Target className="w-5 h-5 text-red-600" />
              <h3 className="font-bold text-red-700">Daily Goal</h3>
            </div>
            <p className="text-gray-600">Learn 5 new characters today</p>
            <div className="mt-4 h-2 bg-red-200 rounded-full overflow-hidden">
              <div className="h-full bg-red-500" style={{ width: '60%' }} />
            </div>
            <p className="text-sm text-red-600 mt-2">3/5 completed</p>
          </div>
          
          <div className="p-4 bg-blue-50 rounded-xl">
            <div className="flex items-center gap-2 mb-3">
              <Calendar className="w-5 h-5 text-blue-600" />
              <h3 className="font-bold text-blue-700">Weekly Target</h3>
            </div>
            <p className="text-gray-600">Complete all flashcard reviews</p>
            <div className="mt-4 h-2 bg-blue-200 rounded-full overflow-hidden">
              <div className="h-full bg-blue-500" style={{ width: '40%' }} />
            </div>
            <p className="text-sm text-blue-600 mt-2">12/30 cards reviewed</p>
          </div>
          
          <div className="p-4 bg-green-50 rounded-xl">
            <div className="flex items-center gap-2 mb-3">
              <Award className="w-5 h-5 text-green-600" />
              <h3 className="font-bold text-green-700">Monthly Milestone</h3>
            </div>
            <p className="text-gray-600">Master all basic characters</p>
            <div className="mt-4 h-2 bg-green-200 rounded-full overflow-hidden">
              <div className="h-full bg-green-500" style={{ width: '75%' }} />
            </div>
            <p className="text-sm text-green-600 mt-2">69/92 characters</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressPage;