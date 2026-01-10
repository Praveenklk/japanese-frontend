// pages/DailyConversation.tsx
import React, { useState, useEffect } from 'react';
import {
  MessageSquare,
  Volume2,
  Play,
  Pause,
  Mic,
  MicOff,
  RotateCw,
  ChevronRight,
  ChevronLeft,
  Target,
  Clock,
  Star,
  TrendingUp,
  Headphones,
  Users,
  CheckCircle,
  XCircle
} from 'lucide-react';

type ConversationCategory = 'greetings' | 'shopping' | 'restaurant' | 'directions' | 'transportation';

interface Conversation {
  id: string;
  title: string;
  description: string;
  category: ConversationCategory;
  difficulty: 'beginner' | 'intermediate';
  duration: string;
  dialog: {
    speaker: 'A' | 'B';
    japanese: string;
    english: string;
    romaji: string;
  }[];
  vocabulary: {
    word: string;
    reading: string;
    meaning: string;
    usage: string;
  }[];
  grammarPoints: string[];
}

const DailyConversation = () => {
  const [selectedConversation, setSelectedConversation] = useState<string>('1');
  const [currentLine, setCurrentLine] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [showTranslation, setShowTranslation] = useState(true);
  const [showRomaji, setShowRomaji] = useState(false);
  const [practiceMode, setPracticeMode] = useState<'listen' | 'repeat' | 'roleplay'>('listen');
  const [userRecordings, setUserRecordings] = useState<Record<string, string>>({});
  const [stats, setStats] = useState({
    conversationsCompleted: 12,
    practiceTime: 45,
    accuracy: 82,
    streak: 7
  });

  const conversations: Conversation[] = [
    {
      id: '1',
      title: 'Greetings & Introductions',
      description: 'Basic greetings and self-introduction',
      category: 'greetings',
      difficulty: 'beginner',
      duration: '3 min',
      dialog: [
        {
          speaker: 'A',
          japanese: 'こんにちは。',
          english: 'Hello.',
          romaji: 'Konnichiwa.'
        },
        {
          speaker: 'B',
          japanese: 'こんにちは。はじめまして。',
          english: 'Hello. Nice to meet you.',
          romaji: 'Konnichiwa. Hajimemashite.'
        },
        {
          speaker: 'A',
          japanese: 'はじめまして。わたしはたなかです。',
          english: 'Nice to meet you. I\'m Tanaka.',
          romaji: 'Hajimemashite. Watashi wa Tanaka desu.'
        },
        {
          speaker: 'B',
          japanese: 'たなかさん、よろしくおねがいします。',
          english: 'Mr. Tanaka, pleased to meet you.',
          romaji: 'Tanaka-san, yoroshiku onegaishimasu.'
        }
      ],
      vocabulary: [
        {
          word: 'こんにちは',
          reading: 'Konnichiwa',
          meaning: 'Hello / Good afternoon',
          usage: 'Used during daytime'
        },
        {
          word: 'はじめまして',
          reading: 'Hajimemashite',
          meaning: 'Nice to meet you (first time)',
          usage: 'When meeting someone for the first time'
        },
        {
          word: 'わたし',
          reading: 'Watashi',
          meaning: 'I / me',
          usage: 'Polite way to refer to oneself'
        },
        {
          word: 'よろしくおねがいします',
          reading: 'Yoroshiku onegaishimasu',
          meaning: 'Pleased to meet you / Thank you in advance',
          usage: 'Common polite phrase'
        }
      ],
      grammarPoints: [
        'です (desu) - Polite copula meaning "is/am/are"',
        'は (wa) - Topic marker particle',
        'さん (san) - Polite name suffix'
      ]
    },
    {
      id: '2',
      title: 'Ordering Food',
      description: 'Ordering food at a restaurant',
      category: 'restaurant',
      difficulty: 'beginner',
      duration: '4 min',
      dialog: [
        {
          speaker: 'A',
          japanese: 'すみません、メニューをおねがいします。',
          english: 'Excuse me, can I have the menu please?',
          romaji: 'Sumimasen, menyuu o onegaishimasu.'
        },
        {
          speaker: 'B',
          japanese: 'はい、どうぞ。',
          english: 'Yes, here you are.',
          romaji: 'Hai, douzo.'
        },
        {
          speaker: 'A',
          japanese: 'ラーメンとぎょうざをおねがいします。',
          english: 'Ramen and gyoza, please.',
          romaji: 'Raamen to gyouza o onegaishimasu.'
        },
        {
          speaker: 'B',
          japanese: 'かしこまりました。おのみものは？',
          english: 'Certainly. What about drinks?',
          romaji: 'Kashikomarimashita. Onomimono wa?'
        },
        {
          speaker: 'A',
          japanese: 'おちゃをおねがいします。',
          english: 'Green tea, please.',
          romaji: 'Ocha o onegaishimasu.'
        }
      ],
      vocabulary: [
        {
          word: 'すみません',
          reading: 'Sumimasen',
          meaning: 'Excuse me / Sorry',
          usage: 'To get attention or apologize'
        },
        {
          word: 'メニュー',
          reading: 'Menyuu',
          meaning: 'Menu',
          usage: 'Restaurant menu'
        },
        {
          word: 'どうぞ',
          reading: 'Douzo',
          meaning: 'Here you are / Please',
          usage: 'When offering something'
        },
        {
          word: 'おのみもの',
          reading: 'Onomimono',
          meaning: 'Drinks',
          usage: 'Beverages'
        },
        {
          word: 'おちゃ',
          reading: 'Ocha',
          meaning: 'Green tea',
          usage: 'Japanese green tea'
        }
      ],
      grammarPoints: [
        'と (to) - "and" (for connecting nouns)',
        'を (o) - Object marker particle',
        'は (wa) - Topic marker for questions'
      ]
    },
    {
      id: '3',
      title: 'Asking for Directions',
      description: 'Asking how to get to places',
      category: 'directions',
      difficulty: 'beginner',
      duration: '5 min',
      dialog: [
        {
          speaker: 'A',
          japanese: 'すみません、駅はどこですか？',
          english: 'Excuse me, where is the station?',
          romaji: 'Sumimasen, eki wa doko desu ka?'
        },
        {
          speaker: 'B',
          japanese: 'まっすぐ行って、右に曲がってください。',
          english: 'Go straight and turn right.',
          romaji: 'Massugu itte, migi ni magatte kudasai.'
        },
        {
          speaker: 'A',
          japanese: '歩いてどのぐらいですか？',
          english: 'How long does it take on foot?',
          romaji: 'Aruite dono gurai desu ka?'
        },
        {
          speaker: 'B',
          japanese: '５分ぐらいです。',
          english: 'About 5 minutes.',
          romaji: 'Go-fun gurai desu.'
        },
        {
          speaker: 'A',
          japanese: 'ありがとうございます。',
          english: 'Thank you very much.',
          romaji: 'Arigatou gozaimasu.'
        }
      ],
      vocabulary: [
        {
          word: '駅',
          reading: 'Eki',
          meaning: 'Station',
          usage: 'Train/subway station'
        },
        {
          word: 'どこ',
          reading: 'Doko',
          meaning: 'Where',
          usage: 'Asking for location'
        },
        {
          word: 'まっすぐ',
          reading: 'Massugu',
          meaning: 'Straight',
          usage: 'Go straight ahead'
        },
        {
          word: '右',
          reading: 'Migi',
          meaning: 'Right',
          usage: 'Right side/direction'
        },
        {
          word: '曲がる',
          reading: 'Magaru',
          meaning: 'To turn',
          usage: 'Make a turn'
        },
        {
          word: '歩く',
          reading: 'Aruku',
          meaning: 'To walk',
          usage: 'Walking'
        }
      ],
      grammarPoints: [
        'ですか (desu ka) - Question marker',
        'に (ni) - Direction particle',
        'ください (kudasai) - Please (do)'
      ]
    }
  ];

  const categories = [
    { id: 'greetings', name: 'Greetings', icon: '👋', count: 1 },
    { id: 'restaurant', name: 'Restaurant', icon: '🍽️', count: 1 },
    { id: 'directions', name: 'Directions', icon: '🧭', count: 1 },
    { id: 'shopping', name: 'Shopping', icon: '🛍️', count: 0 },
    { id: 'transportation', name: 'Transportation', icon: '🚇', count: 0 }
  ];

  const selectedConv = conversations.find(c => c.id === selectedConversation);
  const currentDialog = selectedConv?.dialog[currentLine];

  const playAudio = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ja-JP';
    utterance.rate = 0.7;
    utterance.pitch = 1;
    speechSynthesis.speak(utterance);
    setIsPlaying(true);
    
    utterance.onend = () => setIsPlaying(false);
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      const chunks: Blob[] = [];

      mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(chunks, { type: 'audio/wav' });
        const audioUrl = URL.createObjectURL(audioBlob);
        setUserRecordings(prev => ({
          ...prev,
          [currentLine]: audioUrl
        }));
      };

      mediaRecorder.start();
      setIsRecording(true);
      
      // Auto stop after 5 seconds
      setTimeout(() => {
        mediaRecorder.stop();
        setIsRecording(false);
      }, 5000);
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  };

  const nextLine = () => {
    if (selectedConv && currentLine < selectedConv.dialog.length - 1) {
      setCurrentLine(prev => prev + 1);
    }
  };

  const prevLine = () => {
    if (currentLine > 0) {
      setCurrentLine(prev => prev - 1);
    }
  };

  const startRoleplay = () => {
    setCurrentLine(0);
    setPracticeMode('roleplay');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-green-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
                <MessageSquare className="w-8 h-8 text-green-600" />
                Daily Conversation
              </h1>
              <p className="text-gray-600">Practice real-life Japanese conversations</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{stats.conversationsCompleted}</div>
                <div className="text-sm text-gray-600">Completed</div>
              </div>
              <button className="px-6 py-3 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-xl hover:shadow-lg transition-all flex items-center gap-2">
                <Users className="w-5 h-5" />
                Practice with Partner
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white p-4 rounded-xl shadow-sm border">
              <div className="text-2xl font-bold text-green-600">{stats.conversationsCompleted}</div>
              <div className="text-sm text-gray-600">Conversations</div>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-sm border">
              <div className="text-2xl font-bold text-blue-600">{stats.practiceTime}m</div>
              <div className="text-sm text-gray-600">Practice Time</div>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-sm border">
              <div className="text-2xl font-bold text-purple-600">{stats.accuracy}%</div>
              <div className="text-sm text-gray-600">Accuracy</div>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-sm border">
              <div className="text-2xl font-bold text-amber-600">{stats.streak} days</div>
              <div className="text-sm text-gray-600">Practice Streak</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Categories & List */}
          <div className="lg:col-span-1 space-y-6">
            {/* Categories */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border">
              <h3 className="text-lg font-semibold mb-4">Categories</h3>
              <div className="space-y-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    className="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{category.icon}</span>
                      <span>{category.name}</span>
                    </div>
                    <span className="text-sm bg-gray-100 px-2 py-1 rounded">
                      {category.count}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Practice Modes */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border">
              <h3 className="text-lg font-semibold mb-4">Practice Mode</h3>
              <div className="space-y-3">
                {(['listen', 'repeat', 'roleplay'] as const).map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setPracticeMode(mode)}
                    className={`w-full text-left p-3 rounded-lg transition ${
                      practiceMode === mode
                        ? 'bg-green-50 text-green-700 border border-green-200'
                        : 'hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {mode === 'listen' && <Headphones className="w-5 h-5" />}
                      {mode === 'repeat' && <Volume2 className="w-5 h-5" />}
                      {mode === 'roleplay' && <Users className="w-5 h-5" />}
                      <div>
                        <div className="font-medium capitalize">{mode}</div>
                        <div className="text-sm opacity-75">
                          {mode === 'listen' && 'Listen and understand'}
                          {mode === 'repeat' && 'Repeat after native speaker'}
                          {mode === 'roleplay' && 'Practice both roles'}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Vocabulary */}
            {selectedConv && (
              <div className="bg-white rounded-2xl shadow-lg p-6 border">
                <h3 className="text-lg font-semibold mb-4">Key Vocabulary</h3>
                <div className="space-y-3">
                  {selectedConv.vocabulary.slice(0, 5).map((vocab, index) => (
                    <div key={index} className="p-3 bg-gray-50 rounded-lg">
                      <div className="font-medium">{vocab.word}</div>
                      <div className="text-sm text-gray-600">{vocab.reading}</div>
                      <div className="text-sm text-green-600">{vocab.meaning}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Main Conversation Area */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-6 border">
              {/* Conversation Header */}
              <div className="mb-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">{selectedConv?.title}</h2>
                    <p className="text-gray-600">{selectedConv?.description}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      selectedConv?.difficulty === 'beginner' 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {selectedConv?.difficulty}
                    </span>
                    <span className="text-sm text-gray-600 flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {selectedConv?.duration}
                    </span>
                  </div>
                </div>

                {/* Progress */}
                <div className="mb-6">
                  <div className="flex justify-between text-sm mb-2">
                    <span>Line {currentLine + 1} of {selectedConv?.dialog.length}</span>
                    <span>{Math.round(((currentLine + 1) / (selectedConv?.dialog.length || 1)) * 100)}%</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-green-500 to-blue-500 transition-all"
                      style={{ 
                        width: `${((currentLine + 1) / (selectedConv?.dialog.length || 1)) * 100}%` 
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Conversation Display */}
              <div className="mb-8">
                <div className="flex flex-col items-center">
                  {/* Speaker Label */}
                  <div className="flex items-center gap-3 mb-6">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      currentDialog?.speaker === 'A' 
                        ? 'bg-blue-100 text-blue-600' 
                        : 'bg-green-100 text-green-600'
                    }`}>
                      <span className="text-lg font-bold">{currentDialog?.speaker}</span>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Speaker</div>
                      <div className="font-medium">
                        {currentDialog?.speaker === 'A' ? 'Person A' : 'Person B'}
                      </div>
                    </div>
                  </div>

                  {/* Japanese Text */}
                  <div className="text-center mb-6">
                    <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-relaxed">
                      {currentDialog?.japanese}
                    </div>

                    {showRomaji && (
                      <div className="text-xl text-gray-600 mb-4">
                        {currentDialog?.romaji}
                      </div>
                    )}

                    {showTranslation && (
                      <div className="text-xl text-gray-700 p-4 bg-blue-50 rounded-xl">
                        {currentDialog?.english}
                      </div>
                    )}
                  </div>
                </div>

                {/* Controls */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={prevLine}
                      disabled={currentLine === 0}
                      className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>

                    <button
                      onClick={() => playAudio(currentDialog?.japanese || '')}
                      disabled={isPlaying}
                      className="px-6 py-3 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-xl hover:shadow-lg transition-all flex items-center gap-2"
                    >
                      {isPlaying ? (
                        <Pause className="w-5 h-5" />
                      ) : (
                        <Volume2 className="w-5 h-5" />
                      )}
                      Listen
                    </button>

                    {practiceMode !== 'listen' && (
                      <button
                        onClick={startRecording}
                        disabled={isRecording}
                        className={`px-6 py-3 rounded-xl flex items-center gap-2 transition ${
                          isRecording
                            ? 'bg-red-500 text-white animate-pulse'
                            : 'bg-red-100 text-red-700 hover:bg-red-200'
                        }`}
                      >
                        {isRecording ? (
                          <MicOff className="w-5 h-5" />
                        ) : (
                          <Mic className="w-5 h-5" />
                        )}
                        Record
                      </button>
                    )}

                    <button
                      onClick={nextLine}
                      disabled={currentLine === (selectedConv?.dialog.length || 1) - 1}
                      className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => setShowTranslation(!showTranslation)}
                      className={`px-4 py-2 rounded-lg transition ${
                        showTranslation ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {showTranslation ? 'Hide Eng' : 'Show Eng'}
                    </button>
                    <button
                      onClick={() => setShowRomaji(!showRomaji)}
                      className={`px-4 py-2 rounded-lg transition ${
                        showRomaji ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {showRomaji ? 'Hide Romaji' : 'Show Romaji'}
                    </button>
                  </div>
                </div>

                {/* User Recording Playback */}
                {userRecordings[currentLine] && (
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-semibold text-gray-900">Your Recording</h4>
                      <button
                        onClick={() => {
                          const audio = new Audio(userRecordings[currentLine]);
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
                            className="w-2 bg-gradient-to-t from-green-400 to-blue-400 rounded-t-lg"
                            style={{ height: `${Math.random() * 40 + 10}px` }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Practice Tips */}
              <div className="p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl border border-green-200">
                <div className="flex items-start gap-3">
                  <Target className="w-5 h-5 text-green-600 mt-0.5" />
                  <div>
                    <div className="font-medium text-green-800 mb-1">
                      {practiceMode === 'listen' ? 'Listening Tip' : 
                       practiceMode === 'repeat' ? 'Speaking Tip' : 'Roleplay Tip'}
                    </div>
                    <div className="text-green-700">
                      {practiceMode === 'listen' && 'Focus on understanding the meaning and natural flow.'}
                      {practiceMode === 'repeat' && 'Try to match the pronunciation and intonation exactly.'}
                      {practiceMode === 'roleplay' && 'Practice both sides of the conversation for fluency.'}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Full Conversation & Grammar */}
            <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Full Conversation */}
              <div className="bg-white rounded-2xl shadow-lg p-6 border">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Full Conversation</h3>
                <div className="space-y-4">
                  {selectedConv?.dialog.map((line, index) => (
                    <div 
                      key={index}
                      className={`p-4 rounded-lg transition ${
                        index === currentLine 
                          ? 'bg-blue-50 border border-blue-200' 
                          : 'hover:bg-gray-50'
                      }`}
                      onClick={() => setCurrentLine(index)}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          line.speaker === 'A' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'
                        }`}>
                          {line.speaker}
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-gray-900">{line.japanese}</div>
                          <div className="text-sm text-gray-600 mt-1">{line.english}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Grammar Points */}
              <div className="bg-white rounded-2xl shadow-lg p-6 border">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Grammar Points</h3>
                <div className="space-y-4">
                  {selectedConv?.grammarPoints.map((point, index) => (
                    <div key={index} className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-start gap-2">
                        <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                        <span>{point}</span>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Practice Actions */}
                <div className="mt-6 space-y-3">
                  <button
                    onClick={startRoleplay}
                    className="w-full py-3 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-xl hover:shadow-lg transition-all flex items-center justify-center gap-2"
                  >
                    <Users className="w-5 h-5" />
                    Start Roleplay Practice
                  </button>
                  <button
                    onClick={() => setCurrentLine(0)}
                    className="w-full py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition flex items-center justify-center gap-2"
                  >
                    <RotateCw className="w-5 h-5" />
                    Restart Conversation
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DailyConversation;