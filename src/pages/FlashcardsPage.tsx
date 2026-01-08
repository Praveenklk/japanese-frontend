// pages/FlashcardsPage.tsx
import React, { useState } from 'react';
import { BookOpen, Layers, Shuffle, Target, Zap, Clock } from 'lucide-react';
import HiraganaFlashcards from '../component/flashcards/HiraganaFlashcards';
import KatakanaFlashcards from '../component/flashcards/KatakanaFlashcards';

const FlashcardsPage = () => {
  const [activeTab, setActiveTab] = useState<'hiragana' | 'katakana'>('hiragana');
  const [studyMode, setStudyMode] = useState<'study' | 'quiz' | 'review'>('study');
  const [cardCount, setCardCount] = useState(20);
  const [showSettings, setShowSettings] = useState(false);

  const studyModes = [
    { id: 'study', label: 'Study', icon: BookOpen, color: 'bg-blue-500' },
    { id: 'quiz', label: 'Quiz', icon: Target, color: 'bg-green-500' },
    { id: 'review', label: 'Review', icon: Clock, color: 'bg-purple-500' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Japanese Flashcards</h1>
              <p className="text-gray-600">Master Hiragana and Katakana with spaced repetition</p>
            </div>
            
            <div className="flex items-center gap-4">
              {/* Tab Selection */}
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setActiveTab('hiragana')}
                  className={`px-4 py-2 rounded-md transition ${activeTab === 'hiragana' ? 'bg-white shadow' : ''}`}
                >
                  <span className="text-xl">ひらがな</span>
                </button>
                <button
                  onClick={() => setActiveTab('katakana')}
                  className={`px-4 py-2 rounded-md transition ${activeTab === 'katakana' ? 'bg-white shadow' : ''}`}
                >
                  <span className="text-xl">カタカナ</span>
                </button>
              </div>
              
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                <Layers className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className="bg-white border-b shadow-sm">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Study Mode Selection */}
              <div>
                <h3 className="font-medium text-gray-700 mb-3">Study Mode</h3>
                <div className="flex gap-2">
                  {studyModes.map((mode) => (
                    <button
                      key={mode.id}
                      onClick={() => setStudyMode(mode.id as any)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg transition ${
                        studyMode === mode.id
                          ? `${mode.color} text-white`
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      <mode.icon className="w-4 h-4" />
                      <span>{mode.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Card Count */}
              <div>
                <h3 className="font-medium text-gray-700 mb-3">Number of Cards</h3>
                <div className="flex gap-2">
                  {[10, 20, 30, 46].map((count) => (
                    <button
                      key={count}
                      onClick={() => setCardCount(count)}
                      className={`px-4 py-2 rounded-lg transition ${
                        cardCount === count
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {count}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tips */}
              <div>
                <h3 className="font-medium text-gray-700 mb-3">Tips</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Use spaced repetition for better retention</li>
                  <li>• Mark cards as known/unknown honestly</li>
                  <li>• Review cards regularly</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {activeTab === 'hiragana' ? (
          <HiraganaFlashcards
            mode={studyMode}
            limit={cardCount}
          />
        ) : (
          <KatakanaFlashcards
            mode={studyMode}
            limit={cardCount}
          />
        )}
      </div>

      {/* Stats Footer */}
      <div className="mt-12 border-t bg-white">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">10</div>
              <div className="text-sm text-gray-600">Cards/Minute</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">85%</div>
              <div className="text-sm text-gray-600">Average Accuracy</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">24</div>
              <div className="text-sm text-gray-600">Day Streak</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-amber-600">1,247</div>
              <div className="text-sm text-gray-600">Total Reviews</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlashcardsPage;