// pages/GrammarLessons.tsx
import React, { useState } from 'react';
import {
  BookOpen,
  CheckCircle,
  ChevronRight,
  ChevronDown,
  HelpCircle,
  Lightbulb,
  ListChecks,
  Play,
  RotateCw,
  Sparkles,
  Target,
  Trophy,
  Users,
  Clock1,
  Clock
} from 'lucide-react';

type LessonStatus = 'locked' | 'available' | 'completed';

interface GrammarLesson {
  id: string;
  title: string;
  description: string;
  level: 'N5' | 'N4' | 'N3';
  duration: string;
  points: number;
  status: LessonStatus;
  topics: string[];
  example: string;
  explanation: string;
  practiceQuestions: number;
}

const GrammarLessons = () => {
  const [selectedLesson, setSelectedLesson] = useState<string | null>(null);
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);
  const [userPoints, setUserPoints] = useState(150);

  const lessons: GrammarLesson[] = [
    {
      id: '1',
      title: 'は (wa) Particle - Topic Marker',
      description: 'Learn how to mark the topic of a sentence',
      level: 'N5',
      duration: '10 min',
      points: 25,
      status: 'completed',
      topics: ['Particles', 'Basic Grammar'],
      example: '私は学生です。 (Watashi wa gakusei desu.)',
      explanation: 'The は particle marks the topic of the sentence. It\'s pronounced "wa" when used as a particle.',
      practiceQuestions: 5
    },
    {
      id: '2',
      title: 'を (wo) Particle - Object Marker',
      description: 'Mark the direct object of a verb',
      level: 'N5',
      duration: '12 min',
      points: 25,
      status: 'available',
      topics: ['Particles', 'Basic Grammar'],
      example: 'りんごを食べます。 (Ringo wo tabemasu.)',
      explanation: 'The を particle marks the direct object that receives the action of the verb.',
      practiceQuestions: 5
    },
    {
      id: '3',
      title: 'です (desu) - Copula',
      description: 'Master the basic "to be" verb',
      level: 'N5',
      duration: '8 min',
      points: 20,
      status: 'available',
      topics: ['Verbs', 'Basic Grammar'],
      example: 'これは本です。 (Kore wa hon desu.)',
      explanation: 'です is used to indicate that something "is" something else. It\'s polite form.',
      practiceQuestions: 4
    },
    {
      id: '4',
      title: 'が (ga) Particle - Subject Marker',
      description: 'Identify the subject of a sentence',
      level: 'N5',
      duration: '15 min',
      points: 30,
      status: 'locked',
      topics: ['Particles', 'Basic Grammar'],
      example: '猫がいます。 (Neko ga imasu.)',
      explanation: 'The が particle emphasizes the subject and is often used for new information.',
      practiceQuestions: 6
    },
    {
      id: '5',
      title: 'に (ni) Particle - Time/Location',
      description: 'Indicate time and location',
      level: 'N5',
      duration: '15 min',
      points: 30,
      status: 'locked',
      topics: ['Particles', 'Time Expressions'],
      example: '三時に会いましょう。 (Sanji ni aimashou.)',
      explanation: 'The に particle indicates specific points in time or location.',
      practiceQuestions: 6
    },
    {
      id: '6',
      title: 'で (de) Particle - Means/Location',
      description: 'Express means of action or location',
      level: 'N4',
      duration: '18 min',
      points: 35,
      status: 'locked',
      topics: ['Particles', 'Advanced Grammar'],
      example: '電車で行きます。 (Densha de ikimasu.)',
      explanation: 'The で particle indicates the means by which an action is performed or the location where an action occurs.',
      practiceQuestions: 7
    }
  ];

  const progress = {
    n5: { completed: 1, total: 5, percentage: 20 },
    n4: { completed: 0, total: 1, percentage: 0 },
    n3: { completed: 0, total: 0, percentage: 0 }
  };

  const handleStartLesson = (lessonId: string) => {
    if (lessons.find(l => l.id === lessonId)?.status !== 'locked') {
      setSelectedLesson(lessonId);
    }
  };

  const handleCompleteLesson = (lessonId: string) => {
    if (!completedLessons.includes(lessonId)) {
      setCompletedLessons([...completedLessons, lessonId]);
      const lesson = lessons.find(l => l.id === lessonId);
      if (lesson) {
        setUserPoints(prev => prev + lesson.points);
      }
    }
  };

  const selectedLessonData = lessons.find(l => l.id === selectedLesson);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
                <BookOpen className="w-8 h-8 text-blue-600" />
                Grammar Lessons
              </h1>
              <p className="text-gray-600">Master Japanese grammar from N5 to N3 level</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-amber-600">{userPoints}</div>
                <div className="text-sm text-gray-600">Points</div>
              </div>
              <button className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl hover:shadow-lg transition-all flex items-center gap-2">
                <Play className="w-5 h-5" />
                Start Learning Path
              </button>
            </div>
          </div>

          {/* Progress Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {(['N5', 'N4', 'N3'] as const).map((level) => {
              const levelProgress = progress[level.toLowerCase() as keyof typeof progress];
              return (
                <div key={level} className="bg-white p-6 rounded-xl shadow-sm border">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        level === 'N5' ? 'bg-green-100 text-green-700' :
                        level === 'N4' ? 'bg-blue-100 text-blue-700' :
                        'bg-purple-100 text-purple-700'
                      }`}>
                        <span className="font-bold">{level}</span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">JLPT {level}</h3>
                        <p className="text-sm text-gray-600">{levelProgress.completed}/{levelProgress.total} lessons</p>
                      </div>
                    </div>
                    <div className="text-2xl font-bold">{levelProgress.percentage}%</div>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${
                        level === 'N5' ? 'bg-green-500' :
                        level === 'N4' ? 'bg-blue-500' :
                        'bg-purple-500'
                      }`}
                      style={{ width: `${levelProgress.percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Lessons List */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden border">
              {/* Header */}
              <div className="p-6 border-b">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-gray-900">Available Lessons</h2>
                  <span className="text-sm text-gray-600">
                    {lessons.filter(l => l.status !== 'locked').length} of {lessons.length} available
                  </span>
                </div>
              </div>

              {/* Lessons */}
              <div className="divide-y">
                {lessons.map((lesson) => (
                  <div
                    key={lesson.id}
                    className={`p-6 hover:bg-gray-50 transition ${
                      lesson.status === 'locked' ? 'opacity-60' : 'cursor-pointer'
                    }`}
                    onClick={() => handleStartLesson(lesson.id)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                            lesson.level === 'N5' ? 'bg-green-100 text-green-700' :
                            lesson.level === 'N4' ? 'bg-blue-100 text-blue-700' :
                            'bg-purple-100 text-purple-700'
                          }`}>
                            {lesson.status === 'completed' ? (
                              <CheckCircle className="w-5 h-5" />
                            ) : lesson.status === 'available' ? (
                              <Play className="w-4 h-4" />
                            ) : (
                              <Lock className="w-4 h-4" />
                            )}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-bold text-gray-900">{lesson.title}</h3>
                              <span className={`px-2 py-1 rounded text-xs font-medium ${
                                lesson.level === 'N5' ? 'bg-green-100 text-green-700' :
                                lesson.level === 'N4' ? 'bg-blue-100 text-blue-700' :
                                'bg-purple-100 text-purple-700'
                              }`}>
                                {lesson.level}
                              </span>
                            </div>
                            <p className="text-gray-600 text-sm mt-1">{lesson.description}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 mt-4">
                          <div className="flex items-center gap-1 text-sm text-gray-500">
                            <Clock className="w-4 h-4" />
                            {lesson.duration}
                          </div>
                          <div className="flex items-center gap-1 text-sm text-gray-500">
                            <Target className="w-4 h-4" />
                            {lesson.practiceQuestions} questions
                          </div>
                          <div className="flex items-center gap-1 text-sm text-gray-500">
                            <Trophy className="w-4 h-4 text-amber-600" />
                            {lesson.points} points
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2 mt-3">
                          {lesson.topics.map((topic, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"
                            >
                              {topic}
                            </span>
                          ))}
                        </div>
                      </div>

                      <ChevronRight className={`w-5 h-5 text-gray-400 ml-4 ${
                        lesson.status === 'locked' ? 'opacity-30' : ''
                      }`} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Study Tips */}
            <div className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 border border-blue-200">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-blue-600" />
                Grammar Study Tips
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-xl shadow-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <ListChecks className="w-4 h-4 text-green-600" />
                    <h4 className="font-semibold">Practice Daily</h4>
                  </div>
                  <p className="text-sm text-gray-600">
                    Consistency is key. Study grammar points daily for better retention.
                  </p>
                </div>
                <div className="bg-white p-4 rounded-xl shadow-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="w-4 h-4 text-blue-600" />
                    <h4 className="font-semibold">Use in Context</h4>
                  </div>
                  <p className="text-sm text-gray-600">
                    Create example sentences to understand how grammar is used naturally.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Lesson Detail */}
          <div className="lg:col-span-1">
            {selectedLessonData ? (
              <div className="bg-white rounded-2xl shadow-lg p-6 border sticky top-6">
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-gray-900">Lesson Details</h3>
                    <button
                      onClick={() => setSelectedLesson(null)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      ✕
                    </button>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Example Sentence</h4>
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <div className="text-2xl font-medium text-gray-900 mb-2">
                          {selectedLessonData.example}
                        </div>
                        <div className="text-gray-600">
                          {selectedLessonData.explanation}
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Key Points</h4>
                      <ul className="space-y-2">
                        {selectedLessonData.topics.map((topic, index) => (
                          <li key={index} className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-600" />
                            <span>{topic}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <div className="text-sm text-gray-600">Level</div>
                        <div className={`text-lg font-bold ${
                          selectedLessonData.level === 'N5' ? 'text-green-600' :
                          selectedLessonData.level === 'N4' ? 'text-blue-600' :
                          'text-purple-600'
                        }`}>
                          {selectedLessonData.level}
                        </div>
                      </div>
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <div className="text-sm text-gray-600">Duration</div>
                        <div className="text-lg font-bold text-gray-900">
                          {selectedLessonData.duration}
                        </div>
                      </div>
                    </div>

                    {selectedLessonData.status === 'completed' ? (
                      <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <CheckCircle className="w-5 h-5 text-green-600" />
                          <span className="font-semibold text-green-700">Lesson Completed</span>
                        </div>
                        <p className="text-sm text-green-600">
                          You earned {selectedLessonData.points} points for this lesson!
                        </p>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleCompleteLesson(selectedLessonData.id)}
                        className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl hover:shadow-lg transition-all flex items-center justify-center gap-2"
                      >
                        <Play className="w-5 h-5" />
                        Start Lesson ({selectedLessonData.duration})
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-lg p-6 border">
                <div className="text-center py-8">
                  <HelpCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Select a Lesson</h3>
                  <p className="text-gray-600">
                    Choose a lesson from the list to see details and start learning
                  </p>
                </div>

                {/* Quick Stats */}
                <div className="space-y-4 mt-6">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="text-sm text-gray-600 mb-1">Your Progress</div>
                    <div className="flex items-center justify-between">
                      <div className="text-lg font-bold text-gray-900">
                        {completedLessons.length}/{lessons.length}
                      </div>
                      <div className="text-sm text-green-600">
                        {Math.round((completedLessons.length / lessons.length) * 100)}%
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-blue-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles className="w-5 h-5 text-blue-600" />
                      <h4 className="font-semibold">Daily Goal</h4>
                    </div>
                    <p className="text-sm text-gray-600">
                      Complete 2 lessons today to maintain your streak!
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Lock icon component
const Lock = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
  </svg>
);

export default GrammarLessons;