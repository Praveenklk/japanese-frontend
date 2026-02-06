// src/pages/jlpt/JLPTHome.tsx
import { BookOpen, GraduationCap, Target, Award, Users, TrendingUp, Calendar, Clock, FileText, Globe, ChevronRight, Sparkles, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const JLPTHome = () => {
  const jlptLevels = [
    {
      level: "Basic",
      title: "Japanese Basics",
      subtitle: "Start your journey",
      description: "Master Hiragana, Katakana and essential greetings",
      icon: <BookOpen className="w-5 h-5" />,
      color: "from-blue-400 to-cyan-400",
      bgColor: "bg-gradient-to-br from-blue-500/5 to-cyan-500/5",
      borderColor: "border-blue-200",
      textColor: "text-blue-600",
      progress: 100,
      topics: ["Hiragana", "Katakana", "Greetings"],
      link: "/jlpt/basic",
      stats: [
        { label: "Letters", value: "92" },
        { label: "Phrases", value: "100+" }
      ]
    },
    {
      level: "N5",
      title: "Beginner Level",
      subtitle: "First step to JLPT",
      description: "Basic grammar, simple conversations, essential vocabulary",
      icon: <GraduationCap className="w-5 h-5" />,
      color: "from-emerald-400 to-green-400",
      bgColor: "bg-gradient-to-br from-emerald-500/5 to-green-500/5",
      borderColor: "border-emerald-200",
      textColor: "text-emerald-600",
      progress: 85,
      topics: ["Vocabulary", "Grammar", "Listening"],
      link: "/jlpt/n5",
      stats: [
        { label: "Kanji", value: "100" },
        { label: "Vocabulary", value: "800" }
      ]
    },
    {
      level: "N4",
      title: "Elementary Level",
      subtitle: "Everyday conversations",
      description: "Understand daily conversations and read simple texts",
      icon: <Target className="w-5 h-5" />,
      color: "from-amber-400 to-orange-400",
      bgColor: "bg-gradient-to-br from-amber-500/5 to-orange-500/5",
      borderColor: "border-amber-200",
      textColor: "text-amber-600",
      progress: 65,
      topics: ["Kanji", "Reading", "Grammar"],
      link: "/jlpt/n4",
      stats: [
        { label: "Kanji", value: "300" },
        { label: "Vocabulary", value: "1,500" }
      ]
    },
    {
      level: "N3",
      title: "Intermediate Level",
      subtitle: "Bridge to fluency",
      description: "Understand Japanese used in everyday situations",
      icon: <TrendingUp className="w-5 h-5" />,
      color: "from-purple-400 to-pink-400",
      bgColor: "bg-gradient-to-br from-purple-500/5 to-pink-500/5",
      borderColor: "border-purple-200",
      textColor: "text-purple-600",
      progress: 30,
      topics: ["News", "Business", "Complex Grammar"],
      link: "/jlpt/n3",
      stats: [
        { label: "Kanji", value: "600" },
        { label: "Vocabulary", value: "3,700" }
      ]
    },
    {
      level: "N2",
      title: "Pre-Advanced",
      subtitle: "Professional level",
      description: "Understand Japanese in various contexts",
      icon: <Users className="w-5 h-5" />,
      color: "from-rose-400 to-red-400",
      bgColor: "bg-gradient-to-br from-rose-500/5 to-red-500/5",
      borderColor: "border-rose-200",
      textColor: "text-rose-600",
      progress: 15,
      topics: ["Academic", "Formal", "Documents"],
      link: "/jlpt/n2",
      stats: [
        { label: "Kanji", value: "1,000" },
        { label: "Vocabulary", value: "6,000" }
      ]
    },
    {
      level: "N1",
      title: "Advanced Level",
      subtitle: "Native-like proficiency",
      description: "Understand Japanese used in all situations",
      icon: <Award className="w-5 h-5" />,
      color: "from-slate-600 to-gray-600",
      bgColor: "bg-gradient-to-br from-slate-500/5 to-gray-500/5",
      borderColor: "border-slate-300",
      textColor: "text-slate-700",
      progress: 5,
      topics: ["Literature", "Technical", "Professional"],
      link: "/jlpt/n1",
      stats: [
        { label: "Kanji", value: "2,000+" },
        { label: "Vocabulary", value: "10,000+" }
      ]
    }
  ];

  const jlptFeatures = [
    {
      icon: <Globe className="w-4 h-4" />,
      title: "Global Recognition",
      description: "Accepted worldwide"
    },
    {
      icon: <Calendar className="w-4 h-4" />,
      title: "Twice Yearly",
      description: "July & December"
    },
    {
      icon: <Clock className="w-4 h-4" />,
      title: "Timed Exam",
      description: "105-170 minutes"
    },
    {
      icon: <FileText className="w-4 h-4" />,
      title: "Multiple Choice",
      description: "Objective format"
    }
  ];

  const studyPaths = [
    { level: "N5", duration: "3-4 months", hours: "150-300" },
    { level: "N4", duration: "4-6 months", hours: "300-450" },
    { level: "N3", duration: "6-8 months", hours: "450-750" },
    { level: "N2", duration: "8-12 months", hours: "750-1100" },
    { level: "N1", duration: "12-18 months", hours: "1100-1800" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        {/* Decorative pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Ctext x='30' y='35' font-size='24' font-family='serif' fill='white' text-anchor='middle'%3E日%3C/text%3E%3C/svg%3E")`,
            backgroundSize: '60px 60px'
          }} />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full mb-6">
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span className="text-sm font-medium text-white/90">日本語能力試験</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 tracking-tight">
              Master Japanese with
              <span className="block mt-2 text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-300">
                JLPT Learning Path
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto mb-8 leading-relaxed">
              Structured journey from beginner to advanced. Track your progress, master each level, and achieve fluency.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                to="/jlpt/placement-test"
                className="group inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold rounded-xl hover:shadow-2xl hover:shadow-cyan-500/25 transition-all duration-300 transform hover:-translate-y-0.5"
              >
                <span>Start Free Assessment</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              
              <Link
                to="/jlpt/guide"
                className="group inline-flex items-center gap-2 px-8 py-3.5 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-xl hover:bg-white/20 transition-all duration-300 border border-white/20"
              >
                <BookOpen className="w-4 h-4" />
                <span>View Study Guide</span>
              </Link>
            </div>
          </div>
        </div>
        
        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg className="w-full h-12 md:h-16" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" 
              fill="currentColor" 
              className="text-slate-50"
            />
          </svg>
        </div>
      </div>

      {/* Features */}
      <div className="relative -mt-8 md:-mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {jlptFeatures.map((feature, index) => (
              <div
                key={index}
                className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-slate-200/50 hover:shadow-xl hover:border-slate-300 transition-all duration-300"
              >
                <div className="w-10 h-10 bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg flex items-center justify-center mb-3">
                  <div className="text-slate-700">
                    {feature.icon}
                  </div>
                </div>
                <h3 className="font-semibold text-slate-800 text-sm mb-1">{feature.title}</h3>
                <p className="text-slate-600 text-xs">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
            Choose Your Learning Path
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Progress through structured levels with clear objectives and personalized tracking
          </p>
        </div>

        {/* JLPT Levels Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {jlptLevels.map((level) => (
            <Link
              key={level.level}
              to={level.link}
              className={`group relative ${level.bgColor} border ${level.borderColor} rounded-2xl p-6 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 overflow-hidden`}
            >
              {/* Level badge */}
              <div className="absolute top-4 right-4">
                <div className={`px-3 py-1 rounded-full text-sm font-semibold ${level.textColor} bg-white/90 backdrop-blur-sm border ${level.borderColor}`}>
                  {level.level}
                </div>
              </div>

              {/* Icon */}
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${level.color} flex items-center justify-center mb-4`}>
                <div className="text-white">
                  {level.icon}
                </div>
              </div>

              {/* Content */}
              <div className="mb-4">
                <h3 className="text-xl font-bold text-slate-800 mb-1">{level.title}</h3>
                <p className="text-sm text-slate-500 mb-2">{level.subtitle}</p>
                <p className="text-slate-600 text-sm">{level.description}</p>
              </div>

              {/* Stats */}
              <div className="flex gap-3 mb-4">
                {level.stats.map((stat, idx) => (
                  <div key={idx} className="flex-1 text-center p-2 bg-white/60 rounded-lg">
                    <div className="font-bold text-slate-800">{stat.value}</div>
                    <div className="text-xs text-slate-500">{stat.label}</div>
                  </div>
                ))}
              </div>

              {/* Progress */}
              <div className="mb-4">
                <div className="flex justify-between text-xs mb-2">
                  <span className="font-medium text-slate-700">Your Progress</span>
                  <span className={`font-semibold ${level.textColor}`}>{level.progress}%</span>
                </div>
                <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full bg-gradient-to-r ${level.color} transition-all duration-700 ease-out`}
                    style={{ width: `${level.progress}%` }}
                  />
                </div>
              </div>

              {/* Topics */}
              <div className="flex flex-wrap gap-2">
                {level.topics.map((topic, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1.5 text-xs font-medium bg-white text-slate-700 rounded-lg border border-slate-200 group-hover:border-slate-300 transition-colors"
                  >
                    {topic}
                  </span>
                ))}
              </div>

              {/* Arrow indicator */}
              <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <ChevronRight className="w-5 h-5 text-slate-400" />
              </div>
            </Link>
          ))}
        </div>

        {/* Study Timeline */}
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl p-8 md:p-12 text-white mb-16">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl md:text-3xl font-bold mb-4">Estimated Study Timeline</h3>
              <p className="text-slate-300 mb-6">
                Based on average study time of 2 hours daily. Your pace may vary depending on consistency.
              </p>
              
              <div className="space-y-4">
                {studyPaths.map((path, index) => (
                  <div key={index} className="flex items-center gap-4 p-3 bg-white/5 rounded-lg">
                    <div className="w-8 h-8 flex items-center justify-center bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-lg">
                      <span className="text-sm font-bold">{path.level}</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between mb-1">
                        <span className="font-medium">{path.duration}</span>
                        <span className="text-sm text-slate-300">{path.hours} hours</span>
                      </div>
                      <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full"
                          style={{ width: `${(index + 1) * 20}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-2xl mx-auto mb-6">
                <Award className="w-8 h-8" />
              </div>
              <h4 className="text-xl font-bold mb-3">Why Choose JLPT?</h4>
              <ul className="space-y-3 text-sm text-slate-300">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span>Official certification recognized globally</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span>Structured learning path</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span>Clear progression milestones</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span>Employment and academic benefits</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Final CTA */}
        <div className="text-center">
          <div className="inline-block p-1 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-2xl mb-8">
            <div className="bg-white rounded-xl p-8 max-w-2xl">
              <h3 className="text-2xl md:text-3xl font-bold text-slate-800 mb-4">
                Ready to begin your Japanese journey?
              </h3>
              <p className="text-slate-600 mb-6">
                Join thousands of successful learners. Start with a free assessment to find your perfect starting point.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/jlpt/placement-test"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-cyan-500/30 transition-all"
                >
                  <Target className="w-4 h-4" />
                  <span>Take Placement Test</span>
                </Link>
                
                <Link
                  to="/jlpt/demo"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-slate-100 text-slate-700 font-semibold rounded-xl hover:bg-slate-200 transition-colors"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Try Free Lesson</span>
                </Link>
              </div>
              
              <p className="text-xs text-slate-500 mt-6">
                No credit card required • Free trial includes first 3 lessons
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JLPTHome;