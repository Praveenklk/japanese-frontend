// pages/CommunityLeaderboard.tsx
import React, { useState } from 'react';
import {
  Trophy,
  Users,
  TrendingUp,
  Award,
  Star,
  Target,
  Calendar,
  Filter,
  Search,
  ChevronUp,
  UserCircle,
  Flame,
  Clock,
  CheckCircle,
  Globe,
  MessageSquare
} from 'lucide-react';

type TimeRange = 'daily' | 'weekly' | 'all-time';
type Category = 'all' | 'streak' | 'points' | 'accuracy';

interface LeaderboardUser {
  id: string;
  name: string;
  avatar: string;
  level: number;
  points: number;
  streak: number;
  accuracy: number;
  country: string;
  rank: number;
  change: 'up' | 'down' | 'same';
}

const CommunityLeaderboard = () => {
  const [timeRange, setTimeRange] = useState<TimeRange>('weekly');
  const [category, setCategory] = useState<Category>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const leaderboardData: LeaderboardUser[] = [
    {
      id: '1',
      name: 'Tanaka Hiroshi',
      avatar: '👨‍💼',
      level: 42,
      points: 2845,
      streak: 28,
      accuracy: 96,
      country: 'JP',
      rank: 1,
      change: 'up'
    },
    {
      id: '2',
      name: 'Sakura Chan',
      avatar: '👩‍🎓',
      level: 38,
      points: 2650,
      streak: 21,
      accuracy: 94,
      country: 'US',
      rank: 2,
      change: 'up'
    },
    {
      id: '3',
      name: 'Kenji Yamada',
      avatar: '👨‍🔬',
      level: 35,
      points: 2450,
      streak: 35,
      accuracy: 92,
      country: 'JP',
      rank: 3,
      change: 'same'
    },
    {
      id: '4',
      name: 'Maria Garcia',
      avatar: '👩‍🏫',
      level: 32,
      points: 2280,
      streak: 18,
      accuracy: 91,
      country: 'ES',
      rank: 4,
      change: 'down'
    },
    {
      id: '5',
      name: 'David Kim',
      avatar: '👨‍💻',
      level: 30,
      points: 2105,
      streak: 14,
      accuracy: 89,
      country: 'KR',
      rank: 5,
      change: 'up'
    },
    {
      id: '6',
      name: 'Emma Wilson',
      avatar: '👩‍🎨',
      level: 28,
      points: 1980,
      streak: 7,
      accuracy: 87,
      country: 'UK',
      rank: 6,
      change: 'up'
    },
    {
      id: '7',
      name: 'Alex Chen',
      avatar: '👨‍🍳',
      level: 25,
      points: 1850,
      streak: 12,
      accuracy: 85,
      country: 'CN',
      rank: 7,
      change: 'same'
    },
    {
      id: '8',
      name: 'Sophie Martin',
      avatar: '👩‍⚖️',
      level: 22,
      points: 1720,
      streak: 9,
      accuracy: 83,
      country: 'FR',
      rank: 8,
      change: 'down'
    }
  ];

  const currentUser = {
    id: 'current',
    name: 'You',
    avatar: '👤',
    level: 18,
    points: 1420,
    streak: 5,
    accuracy: 82,
    country: 'IN',
    rank: 15,
    change: 'up'
  };

  const filteredUsers = leaderboardData.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.country.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getCategoryIcon = (cat: Category) => {
    switch (cat) {
      case 'streak': return <Flame className="w-4 h-4" />;
      case 'points': return <Trophy className="w-4 h-4" />;
      case 'accuracy': return <Target className="w-4 h-4" />;
      default: return <Users className="w-4 h-4" />;
    }
  };

  const getMedalColor = (rank: number) => {
    switch (rank) {
      case 1: return 'bg-gradient-to-r from-yellow-400 to-amber-500';
      case 2: return 'bg-gradient-to-r from-gray-300 to-gray-400';
      case 3: return 'bg-gradient-to-r from-amber-700 to-orange-600';
      default: return 'bg-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
                <Trophy className="w-8 h-8 text-amber-600" />
                Community Leaderboard
              </h1>
              <p className="text-gray-600">Compete with Japanese learners from around the world</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search learners..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:shadow-lg transition-all">
                Invite Friends
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-2xl shadow-sm border">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
              </div>
              <div className="text-3xl font-bold text-gray-900">1,847</div>
              <div className="text-sm text-gray-600">Active Learners</div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Globe className="w-6 h-6 text-green-600" />
                </div>
              </div>
              <div className="text-3xl font-bold text-gray-900">62</div>
              <div className="text-sm text-gray-600">Countries</div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Award className="w-6 h-6 text-purple-600" />
                </div>
              </div>
              <div className="text-3xl font-bold text-gray-900">284,520</div>
              <div className="text-sm text-gray-600">Total Points</div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-red-100 rounded-lg">
                  <Flame className="w-6 h-6 text-red-600" />
                </div>
              </div>
              <div className="text-3xl font-bold text-gray-900">35</div>
              <div className="text-sm text-gray-600">Longest Streak</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Leaderboard */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden border">
              {/* Header */}
              <div className="p-6 border-b">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Top Learners</h2>
                    <p className="text-sm text-gray-600">Ranked by {category === 'all' ? 'points' : category}</p>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {(['daily', 'weekly', 'all-time'] as TimeRange[]).map((range) => (
                      <button
                        key={range}
                        onClick={() => setTimeRange(range)}
                        className={`px-4 py-2 rounded-lg transition ${
                          timeRange === range
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {range.charAt(0).toUpperCase() + range.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Category Filters */}
                <div className="flex flex-wrap gap-2 mt-4">
                  {(['all', 'streak', 'points', 'accuracy'] as Category[]).map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setCategory(cat)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
                        category === cat
                          ? 'bg-blue-50 text-blue-600 border border-blue-200'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {getCategoryIcon(cat)}
                      <span className="capitalize">{cat === 'all' ? 'Overall' : cat}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Leaderboard Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="py-3 px-6 text-left text-sm font-semibold text-gray-700">Rank</th>
                      <th className="py-3 px-6 text-left text-sm font-semibold text-gray-700">Learner</th>
                      <th className="py-3 px-6 text-left text-sm font-semibold text-gray-700">Level</th>
                      <th className="py-3 px-6 text-left text-sm font-semibold text-gray-700">Points</th>
                      <th className="py-3 px-6 text-left text-sm font-semibold text-gray-700">Streak</th>
                      <th className="py-3 px-6 text-left text-sm font-semibold text-gray-700">Accuracy</th>
                      <th className="py-3 px-6 text-left text-sm font-semibold text-gray-700">Change</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50 transition">
                        <td className="py-4 px-6">
                          <div className="flex items-center">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${getMedalColor(user.rank)}`}>
                              <span className="font-bold text-white">{user.rank}</span>
                            </div>
                            {user.change === 'up' && (
                              <ChevronUp className="w-4 h-4 text-green-500 ml-2" />
                            )}
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <div className="text-2xl">{user.avatar}</div>
                            <div>
                              <div className="font-medium text-gray-900">{user.name}</div>
                              <div className="text-sm text-gray-500 flex items-center gap-1">
                                <span className="text-lg">{getFlagEmoji(user.country)}</span>
                                {user.country}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="font-medium text-gray-900">Level {user.level}</div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="font-medium text-gray-900">{user.points.toLocaleString()}</div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-2">
                            <Flame className="w-4 h-4 text-red-500" />
                            <span className="font-medium">{user.streak} days</span>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className={`font-medium ${
                            user.accuracy >= 90 ? 'text-green-600' :
                            user.accuracy >= 80 ? 'text-blue-600' :
                            'text-yellow-600'
                          }`}>
                            {user.accuracy}%
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className={`px-2 py-1 rounded text-xs font-medium ${
                            user.change === 'up' ? 'bg-green-100 text-green-700' :
                            user.change === 'down' ? 'bg-red-100 text-red-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {user.change === 'up' ? '↑' : user.change === 'down' ? '↓' : '→'}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Current User */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-t p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="text-2xl">{currentUser.avatar}</div>
                    <div>
                      <div className="font-bold text-gray-900">{currentUser.name}</div>
                      <div className="text-sm text-gray-600">Rank #{currentUser.rank}</div>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-6">
                    <div className="text-center">
                      <div className="text-lg font-bold text-gray-900">{currentUser.points}</div>
                      <div className="text-sm text-gray-600">Points</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-gray-900">{currentUser.streak}</div>
                      <div className="text-sm text-gray-600">Streak</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-gray-900">{currentUser.accuracy}%</div>
                      <div className="text-sm text-gray-600">Accuracy</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="mt-8 bg-white rounded-2xl shadow-lg p-6 border">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-blue-600" />
                Recent Community Activity
              </h3>
              <div className="space-y-4">
                {[
                  { user: 'Sakura Chan', action: 'achieved 30-day streak', time: '2 min ago' },
                  { user: 'Kenji Yamada', action: 'completed N5 grammar lessons', time: '15 min ago' },
                  { user: 'David Kim', action: 'scored 100% on katakana quiz', time: '1 hour ago' },
                  { user: 'Maria Garcia', action: 'reached level 40', time: '3 hours ago' },
                ].map((activity, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <UserCircle className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <span className="font-medium">{activity.user}</span>
                      <span className="text-gray-600"> {activity.action}</span>
                    </div>
                    <span className="text-sm text-gray-500">{activity.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Stats & Achievements */}
          <div className="space-y-8">
            {/* Top Achievements */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-600" />
                Top Achievements
              </h3>
              <div className="space-y-4">
                {[
                  { title: 'Hiragana Master', icon: 'あ', users: 842, color: 'bg-red-100 text-red-700' },
                  { title: 'Perfect Score', icon: '💯', users: 312, color: 'bg-green-100 text-green-700' },
                  { title: 'Study Marathon', icon: '⏰', users: 156, color: 'bg-blue-100 text-blue-700' },
                  { title: 'Global Learner', icon: '🌍', users: 89, color: 'bg-purple-100 text-purple-700' },
                ].map((achievement, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${achievement.color}`}>
                      <span className="text-xl">{achievement.icon}</span>
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">{achievement.title}</div>
                      <div className="text-sm text-gray-500">{achievement.users} learners</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Country Leaderboard */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Globe className="w-5 h-5 text-green-600" />
                Top Countries
              </h3>
              <div className="space-y-4">
                {[
                  { country: 'Japan', users: 425, points: 128450, flag: '🇯🇵' },
                  { country: 'United States', users: 312, points: 98420, flag: '🇺🇸' },
                  { country: 'South Korea', users: 198, points: 74560, flag: '🇰🇷' },
                  { country: 'United Kingdom', users: 156, points: 58930, flag: '🇬🇧' },
                  { country: 'Spain', users: 124, points: 45680, flag: '🇪🇸' },
                ].map((country, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{country.flag}</span>
                      <div>
                        <div className="font-medium">{country.country}</div>
                        <div className="text-sm text-gray-500">{country.users} learners</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">{country.points.toLocaleString()}</div>
                      <div className="text-sm text-gray-500">points</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Weekly Challenge */}
            <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl shadow-lg p-6 text-white">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Target className="w-5 h-5" />
                Weekly Challenge
              </h3>
              <div className="mb-6">
                <div className="text-2xl font-bold mb-2">Complete 20 Lessons</div>
                <p className="opacity-90 mb-4">Master new grammar points and earn bonus points!</p>
                <div className="flex items-center justify-between mb-2">
                  <span>Progress</span>
                  <span>8/20</span>
                </div>
                <div className="h-2 bg-white/30 rounded-full overflow-hidden">
                  <div className="h-full bg-white" style={{ width: '40%' }} />
                </div>
              </div>
              <button className="w-full py-3 bg-white text-blue-600 rounded-xl font-semibold hover:bg-gray-100 transition">
                Join Challenge
              </button>
            </div>

            {/* Personal Stats */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Your Stats</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-blue-600" />
                    <span>Days Active</span>
                  </div>
                  <span className="font-bold">28</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>Lessons Completed</span>
                  </div>
                  <span className="font-bold">142</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-purple-600" />
                    <span>Total Study Time</span>
                  </div>
                  <span className="font-bold">42h 15m</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-amber-600" />
                    <span>Accuracy Trend</span>
                  </div>
                  <span className="font-bold text-green-600">+12%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper function to get flag emoji from country code
function getFlagEmoji(countryCode: string) {
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map(char => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
}

export default CommunityLeaderboard;