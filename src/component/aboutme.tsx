import { 
  User, 
  Mail, 
  MapPin, 
  Calendar, 
  Book, 
  Code, 
  Globe, 
  Target, 
  Rocket, 
  Brain, 
  Heart, 
  Award, 
  Trophy, 
  Star, 
  GraduationCap, 
  Briefcase, 
  Coffee,
  Github,
  Linkedin,
  ExternalLink,
  Sparkles,
  Zap,
  TrendingUp,
  Languages,
  BookOpen,
  Eye,
  Headphones,
  Users,
  Shield,
  Lock,
  Compass,
  Coffee as CoffeeIcon,
  Bookmark,
  PenTool,
  Clock,
  Battery,
  Lightbulb,
  ChevronRight
} from "lucide-react";

const AboutMe = () => {
  const personalInfo = {
    name: "Praveen Kumar",
    title: "Full Stack Developer & Japanese Learner",
    email: "praveenrmd1235@gmail.com",
    location: "India",
    education: "MCA Graduate",
    company: "LuminAnalytics",
    jlptLevel: "N5 Passed | N4 Studying",
    dailyStudy: "Japanese learner since 2023"
  };

  const techStack = [
    { name: "React + TypeScript", level: "Advanced", color: "from-blue-400 to-cyan-400" },
    { name: "Tailwind CSS", level: "Advanced", color: "from-teal-400 to-emerald-400" },
    { name: "NestJS", level: "Intermediate", color: "from-red-400 to-pink-400" },
    { name: "Prisma + PostgreSQL", level: "Intermediate", color: "from-purple-400 to-violet-400" },
    { name: "Node.js", level: "Advanced", color: "from-green-400 to-lime-400" },
    { name: "System Design", level: "Learning", color: "from-amber-400 to-orange-400" }
  ];

  const japaneseJourney = [
    { stage: "Started", date: "2023", description: "Began learning Japanese", icon: <Book className="w-5 h-5" /> },
    { stage: "N5 Passed", date: "2024", description: "Passed JLPT N5 exam", icon: <Trophy className="w-5 h-5" /> },
    { stage: "N4 Studying", date: "Present", description: "Preparing for N4 exam", icon: <Target className="w-5 h-5" /> },
    { stage: "Daily Practice", date: "Ongoing", description: "Consistent study routine", icon: <Calendar className="w-5 h-5" /> }
  ];

  const interests = [
    { name: "Anime & Manga", icon: <Eye className="w-5 h-5" />, color: "bg-pink-100 text-pink-600" },
    { name: "Gym & Fitness", icon: <Zap className="w-5 h-5" />, color: "bg-blue-100 text-blue-600" },
    { name: "Reading Novels", icon: <BookOpen className="w-5 h-5" />, color: "bg-purple-100 text-purple-600" },
    { name: "Music", icon: <Headphones className="w-5 h-5" />, color: "bg-green-100 text-green-600" },
    { name: "Tech Exploration", icon: <Code className="w-5 h-5" />, color: "bg-amber-100 text-amber-600" },
    { name: "Language Learning", icon: <Languages className="w-5 h-5" />, color: "bg-cyan-100 text-cyan-600" }
  ];

  const goals = [
    { title: "Career in Japan", description: "Work in Japan's tech industry", icon: <Globe className="w-5 h-5" /> },
    { title: "Senior Engineer", description: "Become a highly skilled software engineer", icon: <TrendingUp className="w-5 h-5" /> },
    { title: "Complex Systems", description: "Work on complex distributed systems", icon: <Brain className="w-5 h-5" /> },
    { title: "Impactful Products", description: "Contribute to meaningful products", icon: <Rocket className="w-5 h-5" /> }
  ];

  const dailyRoutine = [
    { time: "Morning", activity: "Japanese study & review", icon: <Book className="w-4 h-4" /> },
    { time: "Day", activity: "Full-time development work", icon: <Code className="w-4 h-4" /> },
    { time: "Evening", activity: "Gym & physical activity", icon: <Zap className="w-4 h-4" /> },
    { time: "Night", activity: "Side projects & learning", icon: <Lightbulb className="w-4 h-4" /> }
  ];

  const achievements = [
    { count: "10+", label: "Projects Built", icon: <Code className="w-5 h-5" /> },
    { count: "N5", label: "JLPT Passed", icon: <Award className="w-5 h-5" /> },
    { count: "Daily", label: "Study Consistency", icon: <Calendar className="w-5 h-5" /> },
    { count: "∞", label: "Learning Mindset", icon: <Brain className="w-5 h-5" /> }
  ];

  const coreValues = [
    { value: "Consistency", description: "Small daily improvements compound", icon: <Clock className="w-5 h-5" /> },
    { value: "Discipline", description: "Structured approach to goals", icon: <Shield className="w-5 h-5" /> },
    { value: "Patience", description: "Long-term vision over quick wins", icon: <Compass className="w-5 h-5" /> },
    { value: "Growth", description: "Always learning, always improving", icon: <TrendingUp className="w-5 h-5" /> }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-blue-50/30">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-900 via-purple-900 to-pink-900 text-white">
        <div className="absolute inset-0">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 py-24 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-8 border border-white/20">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-medium">Developer • Japanese Learner • Tech Enthusiast</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Praveen Kumar
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-pink-300 mt-2">
                Full Stack Developer
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl mb-10 opacity-90 max-w-3xl mx-auto leading-relaxed">
              Building scalable web applications by day, studying Japanese by night. 
              Passionate about clean code, user experience, and continuous learning.
            </p>
            
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="https://github.com/Praveenklk"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-6 py-3 rounded-xl hover:bg-white/20 transition-all border border-white/20"
              >
                <Github className="w-5 h-5" />
                GitHub
                <ExternalLink className="w-4 h-4" />
              </a>
              
              <a
                href="https://www.linkedin.com/in/praveen-kumar-5524b523b"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-6 py-3 rounded-xl hover:bg-white/20 transition-all border border-white/20"
              >
                <Linkedin className="w-5 h-5" />
                LinkedIn
                <ExternalLink className="w-4 h-4" />
              </a>
              
              <a
                href="mailto:praveenrmd1235@gmail.com"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-500 to-purple-500 px-6 py-3 rounded-xl hover:opacity-90 transition-opacity"
              >
                <Mail className="w-5 h-5" />
                Contact Me
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Card */}
      <div className="max-w-7xl mx-auto px-4 -mt-16 relative z-10">
        <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-200">
          <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8">
            {/* Profile Picture */}
            <div className="relative">
              <div className="w-48 h-48 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center shadow-xl">
                <User className="w-24 h-24 text-white" />
              </div>
              <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-gradient-to-r from-amber-400 to-orange-400 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-2xl font-bold">日</span>
              </div>
            </div>

            {/* Personal Info */}
            <div className="flex-1">
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900">{personalInfo.name}</h2>
                  <p className="text-lg text-gray-600 mt-2">{personalInfo.title}</p>
                </div>
                <div className="mt-4 md:mt-0 flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-50 to-emerald-50 rounded-full border border-green-200">
                  <Trophy className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-medium text-green-700">{personalInfo.jlptLevel}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                      <Mail className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="font-medium">{personalInfo.email}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Location</p>
                      <p className="font-medium">{personalInfo.location}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center">
                      <GraduationCap className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Education</p>
                      <p className="font-medium">{personalInfo.education}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center">
                      <Briefcase className="w-5 h-5 text-amber-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Current Role</p>
                      <p className="font-medium">Developer @ {personalInfo.company}</p>
                    </div>
                  </div>
                </div>
              </div>

              <p className="text-gray-700 leading-relaxed">
                Hi, I'm Praveen Kumar, a passionate Full Stack Developer with a strong focus on building scalable, 
                user-friendly web applications. I come from a technical background with an MCA degree, and I enjoy 
                working at the intersection of clean UI, solid backend architecture, and continuous learning.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        {/* Tech Stack */}
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-8">
            <Code className="w-8 h-8 text-blue-600" />
            <h2 className="text-3xl font-bold text-gray-900">Tech Stack & Skills</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {techStack.map((tech, index) => (
              <div key={index} className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">{tech.name}</h3>
                  <span className="text-sm font-medium px-3 py-1 bg-gray-100 rounded-full">{tech.level}</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className={`h-full bg-gradient-to-r ${tech.color} rounded-full`}
                    style={{ width: tech.level === 'Advanced' ? '90%' : tech.level === 'Intermediate' ? '70%' : '50%' }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Japanese Journey */}
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-8">
            <Languages className="w-8 h-8 text-purple-600" />
            <h2 className="text-3xl font-bold text-gray-900">My Japanese Journey 🇯🇵</h2>
          </div>
          
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-8 border border-purple-200">
            <p className="text-gray-700 text-lg leading-relaxed mb-8">
              Alongside my tech career, I'm deeply committed to learning Japanese. I study Japanese daily and have 
              successfully passed JLPT N5. Currently, I'm continuing my preparation with the goal of advancing further 
              and eventually working in Japan. Learning Japanese has taught me discipline, consistency, and patience—skills 
              that directly reflect in my professional life.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {japaneseJourney.map((stage, index) => (
                <div key={index} className="bg-white rounded-xl p-6 border border-gray-200">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center">
                      {stage.icon}
                    </div>
                    <div>
                      <div className="text-sm text-purple-600 font-medium">{stage.date}</div>
                      <div className="text-lg font-bold text-gray-900">{stage.stage}</div>
                    </div>
                  </div>
                  <p className="text-gray-600">{stage.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Column */}
          <div>
            {/* Daily Routine */}
            <div className="mb-12">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Clock className="w-6 h-6 text-blue-600" />
                Daily Routine
              </h3>
              <div className="space-y-4">
                {dailyRoutine.map((item, index) => (
                  <div key={index} className="flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-200">
                    <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                      {item.icon}
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900">{item.time}</div>
                      <div className="text-gray-600">{item.activity}</div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </div>
                ))}
              </div>
            </div>

            {/* Core Values */}
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Heart className="w-6 h-6 text-red-600" />
                Core Values
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {coreValues.map((value, index) => (
                  <div key={index} className="bg-white rounded-xl p-5 border border-gray-200 hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                        {value.icon}
                      </div>
                      <div className="text-lg font-bold text-gray-900">{value.value}</div>
                    </div>
                    <p className="text-gray-600 text-sm">{value.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div>
            {/* What Drives Me */}
            <div className="mb-12">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Rocket className="w-6 h-6 text-orange-600" />
                What Drives Me
              </h3>
              <div className="space-y-4">
                {goals.map((goal, index) => (
                  <div key={index} className="p-5 bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-200">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-orange-100 to-amber-100 flex items-center justify-center">
                        {goal.icon}
                      </div>
                      <div>
                        <div className="text-lg font-bold text-gray-900">{goal.title}</div>
                        <div className="text-gray-600">{goal.description}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Achievements */}
            <div className="mb-12">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Trophy className="w-6 h-6 text-amber-600" />
                Achievements
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {achievements.map((achievement, index) => (
                  <div key={index} className="bg-white rounded-xl p-5 border border-gray-200 text-center">
                    <div className="text-3xl font-bold text-gray-900 mb-2">{achievement.count}</div>
                    <div className="flex items-center justify-center gap-2 text-gray-600">
                      {achievement.icon}
                      <span>{achievement.label}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Interests */}
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <CoffeeIcon className="w-6 h-6 text-amber-600" />
                Interests & Hobbies
              </h3>
              <div className="flex flex-wrap gap-3">
                {interests.map((interest, index) => (
                  <div
                    key={index}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full ${interest.color} border border-transparent hover:scale-105 transition-transform`}
                  >
                    {interest.icon}
                    <span className="font-medium">{interest.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Looking Ahead Section */}
        <div className="mt-16 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-8 border border-blue-200">
          <div className="flex items-center gap-3 mb-6">
            <Compass className="w-8 h-8 text-blue-600" />
            <h2 className="text-3xl font-bold text-gray-900">Looking Ahead</h2>
          </div>
          
          <p className="text-gray-700 text-lg leading-relaxed mb-8">
            My long-term goal is to become a highly skilled software engineer capable of working on complex systems 
            and contributing to impactful products—while continuing my journey toward working in Japan's tech industry.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 bg-white rounded-xl p-6 border border-blue-100">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                  <Globe className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <div className="text-lg font-bold text-gray-900">International Career</div>
                  <div className="text-gray-600">Working towards opportunities in Japan</div>
                </div>
              </div>
            </div>
            
            <div className="flex-1 bg-white rounded-xl p-6 border border-purple-100">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <div className="text-lg font-bold text-gray-900">Continuous Growth</div>
                  <div className="text-gray-600">Always learning, always improving</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact CTA */}
        <div className="mt-16 text-center">
          <h3 className="text-3xl font-bold text-gray-900 mb-6">Let's Connect!</h3>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Interested in collaborating, discussing tech, or sharing Japanese learning tips? 
            Feel free to reach out!
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="mailto:praveenrmd1235@gmail.com"
              className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:shadow-xl transition-all"
            >
              <Mail className="w-5 h-5" />
              Email Me
            </a>
            
            <a
              href="https://github.com/Praveenklk"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-white border border-gray-300 text-gray-700 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-gray-50 transition-all"
            >
              <Github className="w-5 h-5" />
              View GitHub
            </a>
            
            <a
              href="https://www.linkedin.com/in/praveen-kumar-5524b523b"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-white border border-gray-300 text-gray-700 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-gray-50 transition-all"
            >
              <Linkedin className="w-5 h-5" />
              Connect on LinkedIn
            </a>
          </div>
          
          <p className="mt-8 text-gray-500 text-sm">
            🇯🇵 一緒に成長しましょう！ (Let's grow together!)
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutMe;