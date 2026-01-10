// pages/PronunciationPractice.tsx
import React, { useState, useEffect, useRef } from 'react';
import {
  Volume2,
  Mic,
  MicOff,
  Play,
  Pause,
  RotateCw,
  CheckCircle,
  XCircle,
  VolumeX,
  Volume1,
  Headphones,
  Target,
  TrendingUp,
  Award,
  Sparkles,
  ChevronRight,
  AlertCircle
} from 'lucide-react';

type PracticeMode = 'listen' | 'repeat' | 'compare';
type Difficulty = 'easy' | 'medium' | 'hard';

interface PronunciationExercise {
  id: string;
  japanese: string;
  romaji: string;
  english: string;
  difficulty: Difficulty;
  audioUrl?: string;
  pitchPattern: number[];
  tips: string;
}

const PronunciationPractice = () => {
  const [mode, setMode] = useState<PracticeMode>('listen');
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const [currentExercise, setCurrentExercise] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(80);
  const [userRecording, setUserRecording] = useState<string | null>(null);
  const [score, setScore] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [stats, setStats] = useState({
    accuracy: 0,
    streak: 0,
    exercisesCompleted: 0,
    totalPracticeTime: 0
  });

  const audioRef = useRef<HTMLAudioElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const exercises: PronunciationExercise[] = [
    {
      id: '1',
      japanese: 'こんにちは',
      romaji: 'Konnichiwa',
      english: 'Hello',
      difficulty: 'easy',
      pitchPattern: [2, 0, 1, 1, 1],
      tips: 'Stress is on the "ni" syllable. Keep it flat and even.'
    },
    {
      id: '2',
      japanese: 'ありがとう',
      romaji: 'Arigatou',
      english: 'Thank you',
      difficulty: 'easy',
      pitchPattern: [0, 1, 1, 1, 1],
      tips: 'The "ga" should be slightly higher pitch than other syllables.'
    },
    {
      id: '3',
      japanese: 'すみません',
      romaji: 'Sumimasen',
      english: 'Excuse me',
      difficulty: 'medium',
      pitchPattern: [0, 1, 1, 1, 1, 1],
      tips: 'Quick "su" followed by longer "mi-ma-sen".'
    },
    {
      id: '4',
      japanese: 'おはようございます',
      romaji: 'Ohayou gozaimasu',
      english: 'Good morning',
      difficulty: 'hard',
      pitchPattern: [0, 1, 1, 1, 1, 0, 1, 1, 1, 1],
      tips: 'Break into parts: "Ohayou" (flat) then "gozaimasu" (slight rise on "zai").'
    },
    {
      id: '5',
      japanese: 'さようなら',
      romaji: 'Sayounara',
      english: 'Goodbye',
      difficulty: 'medium',
      pitchPattern: [1, 0, 1, 1, 1, 1],
      tips: 'Smooth flow from "sa" to "you". Don\'t separate syllables.'
    }
  ];

  const filteredExercises = exercises.filter(ex => ex.difficulty === difficulty);

  useEffect(() => {
    // Initialize audio
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, [volume]);

  const playAudio = () => {
    if (audioRef.current) {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const pauseAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(chunksRef.current, { type: 'audio/wav' });
        const audioUrl = URL.createObjectURL(audioBlob);
        setUserRecording(audioUrl);
        analyzeRecording(audioUrl);
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error accessing microphone:', error);
      alert('Could not access microphone. Please check permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const analyzeRecording = (audioUrl: string) => {
    // Simulate pronunciation analysis
    setTimeout(() => {
      const randomScore = Math.floor(Math.random() * 30) + 70; // 70-100%
      setScore(randomScore);
      setShowFeedback(true);
      
      // Update stats
      setStats(prev => ({
        ...prev,
        accuracy: Math.round((prev.accuracy * prev.exercisesCompleted + randomScore) / (prev.exercisesCompleted + 1)),
        streak: prev.streak + 1,
        exercisesCompleted: prev.exercisesCompleted + 1
      }));
    }, 1500);
  };

  const handleNextExercise = () => {
    if (currentExercise < filteredExercises.length - 1) {
      setCurrentExercise(prev => prev + 1);
    } else {
      setCurrentExercise(0);
    }
    setScore(null);
    setShowFeedback(false);
    setUserRecording(null);
    setIsPlaying(false);
  };

  const renderPitchPattern = (pattern: number[]) => {
    const maxHeight = Math.max(...pattern);
    return (
      <div className="flex items-end gap-1 h-16">
        {pattern.map((height, index) => (
          <div
            key={index}
            className="w-8 bg-gradient-to-t from-blue-500 to-purple-500 rounded-t-lg transition-all hover:opacity-80"
            style={{ height: `${(height / maxHeight) * 50}px` }}
          />
        ))}
      </div>
    );
  };

  const exercise = filteredExercises[currentExercise];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
            <Headphones className="w-8 h-8 text-purple-600" />
            Pronunciation Practice
          </h1>
          <p className="text-gray-600">Perfect your Japanese pronunciation with voice feedback</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-4 rounded-xl shadow-sm border">
            <div className="text-2xl font-bold text-green-600">{stats.accuracy}%</div>
            <div className="text-sm text-gray-600">Pronunciation Accuracy</div>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border">
            <div className="text-2xl font-bold text-blue-600">{stats.streak}</div>
            <div className="text-sm text-gray-600">Practice Streak</div>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border">
            <div className="text-2xl font-bold text-purple-600">{stats.exercisesCompleted}</div>
            <div className="text-sm text-gray-600">Exercises Completed</div>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border">
            <div className="text-2xl font-bold text-amber-600">{stats.totalPracticeTime}m</div>
            <div className="text-sm text-gray-600">Practice Time</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Controls */}
          <div className="lg:col-span-1 space-y-6">
            {/* Practice Mode */}
            <div className="bg-white rounded-xl shadow-lg p-6 border">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Target className="w-5 h-5 text-blue-600" />
                Practice Mode
              </h3>
              <div className="space-y-3">
                {(['listen', 'repeat', 'compare'] as PracticeMode[]).map((modeOption) => (
                  <button
                    key={modeOption}
                    onClick={() => setMode(modeOption)}
                    className={`w-full text-left p-3 rounded-lg transition-all ${
                      mode === modeOption
                        ? 'bg-blue-50 text-blue-600 border border-blue-200'
                        : 'hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {modeOption === 'listen' && <Volume2 className="w-5 h-5" />}
                      {modeOption === 'repeat' && <Mic className="w-5 h-5" />}
                      {modeOption === 'compare' && <Headphones className="w-5 h-5" />}
                      <div>
                        <div className="font-medium capitalize">{modeOption}</div>
                        <div className="text-sm opacity-75">
                          {modeOption === 'listen' && 'Listen and learn pronunciation'}
                          {modeOption === 'repeat' && 'Repeat after native speaker'}
                          {modeOption === 'compare' && 'Compare your pronunciation'}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Difficulty */}
            <div className="bg-white rounded-xl shadow-lg p-6 border">
              <h3 className="text-lg font-semibold mb-4">Difficulty Level</h3>
              <div className="space-y-2">
                {(['easy', 'medium', 'hard'] as Difficulty[]).map((diff) => (
                  <button
                    key={diff}
                    onClick={() => setDifficulty(diff)}
                    className={`w-full text-left p-3 rounded-lg transition-all ${
                      difficulty === diff
                        ? diff === 'easy' ? 'bg-green-50 text-green-700 border border-green-200' :
                          diff === 'medium' ? 'bg-yellow-50 text-yellow-700 border border-yellow-200' :
                          'bg-red-50 text-red-700 border border-red-200'
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="capitalize">{diff}</span>
                      <span className="text-sm">
                        {exercises.filter(e => e.difficulty === diff).length} exercises
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Pronunciation Tips */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-200">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-blue-600" />
                Tips for Success
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <Volume2 className="w-4 h-4 text-green-600 mt-0.5" />
                  <span className="text-sm">Listen carefully to the pitch accent</span>
                </li>
                <li className="flex items-start gap-2">
                  <Mic className="w-4 h-4 text-blue-600 mt-0.5" />
                  <span className="text-sm">Speak clearly and at a natural pace</span>
                </li>
                <li className="flex items-start gap-2">
                  <RotateCw className="w-4 h-4 text-purple-600 mt-0.5" />
                  <span className="text-sm">Repeat multiple times for muscle memory</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Right Column - Main Practice Area */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 border">
              {/* Progress */}
              <div className="mb-8">
                <div className="flex justify-between text-sm mb-2">
                  <span>Exercise {currentExercise + 1} of {filteredExercises.length}</span>
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
                    {exercise?.difficulty}
                  </span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all"
                    style={{ width: `${((currentExercise + 1) / filteredExercises.length) * 100}%` }}
                  />
                </div>
              </div>

              {/* Current Exercise */}
              <div className="text-center mb-8">
                <div className="text-5xl md:text-6xl font-bold text-gray-900 mb-4">
                  {exercise?.japanese}
                </div>
                
                <div className="space-y-4 mb-8">
                  <div className="text-2xl text-gray-700">{exercise?.romaji}</div>
                  <div className="text-xl text-gray-600">{exercise?.english}</div>
                </div>

                {/* Pitch Pattern */}
                <div className="mb-8">
                  <div className="text-sm text-gray-600 mb-3">Pitch Accent Pattern</div>
                  {renderPitchPattern(exercise?.pitchPattern || [])}
                </div>

                {/* Pronunciation Tips */}
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-8">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                    <div className="text-left">
                      <div className="font-medium text-yellow-800 mb-1">Pronunciation Tip</div>
                      <div className="text-yellow-700">{exercise?.tips}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Audio Controls */}
              <div className="mb-8">
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  {/* Volume Control */}
                  <div className="flex items-center gap-3">
                    <VolumeX className="w-5 h-5 text-gray-500" />
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={volume}
                      onChange={(e) => setVolume(parseInt(e.target.value))}
                      className="w-32"
                    />
                    <Volume2 className="w-5 h-5 text-gray-500" />
                  </div>

                  {/* Play/Pause */}
                  <button
                    onClick={isPlaying ? pauseAudio : playAudio}
                    className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full hover:shadow-lg transition-all flex items-center justify-center"
                  >
                    {isPlaying ? (
                      <Pause className="w-6 h-6" />
                    ) : (
                      <Play className="w-6 h-6" />
                    )}
                  </button>

                  {/* Record Button */}
                  {mode !== 'listen' && (
                    <button
                      onClick={isRecording ? stopRecording : startRecording}
                      className={`w-16 h-16 rounded-full transition-all flex items-center justify-center ${
                        isRecording
                          ? 'bg-red-500 text-white animate-pulse'
                          : 'bg-gradient-to-r from-red-500 to-pink-500 text-white hover:shadow-lg'
                      }`}
                    >
                      {isRecording ? (
                        <MicOff className="w-6 h-6" />
                      ) : (
                        <Mic className="w-6 h-6" />
                      )}
                    </button>
                  )}
                </div>
              </div>

              {/* Feedback Area */}
              {showFeedback && score && (
                <div className="mb-8 animate-fade-in">
                  <div className={`p-6 rounded-xl ${
                    score >= 90 ? 'bg-green-50 border border-green-200' :
                    score >= 80 ? 'bg-blue-50 border border-blue-200' :
                    'bg-yellow-50 border border-yellow-200'
                  }`}>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        {score >= 90 ? (
                          <Award className="w-8 h-8 text-green-600" />
                        ) : score >= 80 ? (
                          <TrendingUp className="w-8 h-8 text-blue-600" />
                        ) : (
                          <RotateCw className="w-8 h-8 text-yellow-600" />
                        )}
                        <div>
                          <h4 className="font-bold text-lg">
                            {score >= 90 ? 'Excellent!' : score >= 80 ? 'Good Job!' : 'Keep Practicing!'}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {score >= 90 ? 'Perfect pronunciation!' : 
                             score >= 80 ? 'Almost perfect!' : 
                             'Try again for better results'}
                          </p>
                        </div>
                      </div>
                      <div className="text-3xl font-bold">{score}%</div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Accuracy</span>
                        <span>{score}%</span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${
                            score >= 90 ? 'bg-green-500' :
                            score >= 80 ? 'bg-blue-500' :
                            'bg-yellow-500'
                          }`}
                          style={{ width: `${score}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* User Recording Playback */}
              {userRecording && (
                <div className="mb-8">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-semibold text-gray-900">Your Recording</h4>
                    <button
                      onClick={() => {
                        const audio = new Audio(userRecording);
                        audio.play();
                      }}
                      className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition flex items-center gap-2"
                    >
                      <Play className="w-4 h-4" />
                      Play Back
                    </button>
                  </div>
                  <div className="h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                    <div className="flex items-end gap-1">
                      {Array.from({ length: 20 }).map((_, i) => (
                        <div
                          key={i}
                          className="w-2 bg-gradient-to-t from-blue-400 to-purple-400 rounded-t-lg"
                          style={{ height: `${Math.random() * 40 + 10}px` }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={handleNextExercise}
                  className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl hover:shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  {currentExercise === filteredExercises.length - 1 ? 'Start Over' : 'Next Exercise'}
                  <ChevronRight className="w-5 h-5" />
                </button>
                
                <button
                  onClick={() => {
                    setScore(null);
                    setShowFeedback(false);
                    setUserRecording(null);
                  }}
                  className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all"
                >
                  Retry This Exercise
                </button>
              </div>

              {/* Audio Element */}
              <audio
                ref={audioRef}
                src={`https://assets.mixkit.co/sfx/preview/mixkit-correct-answer-tone-2870.mp3`}
                onEnded={() => setIsPlaying(false)}
                className="hidden"
              />
            </div>

            {/* Practice Modes Explanation */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded-xl shadow-sm border">
                <div className="flex items-center gap-2 mb-3">
                  <Volume2 className="w-5 h-5 text-green-600" />
                  <h4 className="font-semibold">Listen Mode</h4>
                </div>
                <p className="text-sm text-gray-600">
                  Focus on listening comprehension and understanding pronunciation patterns
                </p>
              </div>
              <div className="bg-white p-4 rounded-xl shadow-sm border">
                <div className="flex items-center gap-2 mb-3">
                  <Mic className="w-5 h-5 text-blue-600" />
                  <h4 className="font-semibold">Repeat Mode</h4>
                </div>
                <p className="text-sm text-gray-600">
                  Practice speaking after hearing native pronunciation
                </p>
              </div>
              <div className="bg-white p-4 rounded-xl shadow-sm border">
                <div className="flex items-center gap-2 mb-3">
                  <Headphones className="w-5 h-5 text-purple-600" />
                  <h4 className="font-semibold">Compare Mode</h4>
                </div>
                <p className="text-sm text-gray-600">
                  Record your voice and compare with native speaker
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .animate-fade-in {
          animation: fadeIn 0.3s ease-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
        .animate-pulse {
          animation: pulse 1s infinite;
        }
      `}</style>
    </div>
  );
};

export default PronunciationPractice;