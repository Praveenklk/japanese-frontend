import { useEffect, useState } from 'react';
import kanjiData from './kanji.json';
import type { KanjiData } from '../pages/types/kanji';
import { motion } from 'framer-motion';
import { Play, Volume2, BookOpen, Edit3, BarChart3 } from 'lucide-react';

const KanjiView = ({ kanji }: { kanji?: string }) => {
  const data = kanjiData as KanjiData;
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const [activeReading, setActiveReading] = useState<'kun' | 'on' | null>(null);

  const entry = kanji ? data[kanji] : null;

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setAudio(new Audio());
    }
  }, []);

  const playJapaneseAudio = (text: string) => {
    if (!audio) return;
    
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ja-JP';
      utterance.rate = 0.8;
      utterance.pitch = 1;
      
      speechSynthesis.cancel();
      speechSynthesis.speak(utterance);
    }
  };

  const playEnglishAudio = (text: string) => {
    if (!audio) return;
    
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 0.9;
      
      speechSynthesis.cancel();
      speechSynthesis.speak(utterance);
    }
  };

  if (!kanji || !entry) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🔍</div>
        <h2 className="text-2xl font-bold text-gray-700">Kanji Not Found</h2>
        <p className="text-gray-500">Please select a valid kanji character</p>
      </div>
    );
  }

  // Safe access to properties
  const meanings = entry?.meanings || [];
  const kunReadings = entry?.kun_readings || [];
  const onReadings = entry?.on_readings || [];
  const strokeCount = entry?.stroke_count || 0;
  const grade = entry?.grade || 0;
  const jlptNew = entry?.jlpt_new || 0;
  const heisigEn = entry?.heisig_en || '';

  return (
    <div className="space-y-8">
      {/* Main Kanji Card */}
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 100 }}
        className="bg-gradient-to-br from-white to-blue-50 rounded-3xl shadow-2xl p-8 border border-blue-100"
      >
        <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8">
          {/* Kanji Character */}
          <motion.div 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex flex-col items-center"
          >
            <div className="relative group">
              <div className="absolute -inset-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur opacity-20 group-hover:opacity-30 transition duration-1000"></div>
              <div className="relative bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                <div className="text-9xl font-bold text-gray-800 font-[serif]">
                  {kanji}
                </div>
              </div>
              <button
                onClick={() => playJapaneseAudio(kanji)}
                className="absolute -bottom-3 -right-3 bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
              >
                <Play className="w-6 h-6" fill="white" />
              </button>
            </div>
            
            <div className="mt-4 text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                <BarChart3 className="w-4 h-4" />
                JLPT N{jlptNew || '?'}
              </div>
            </div>
          </motion.div>

          {/* Kanji Info */}
          <div className="flex-1 space-y-6">
            {/* Meanings */}
            {meanings.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <BookOpen className="w-5 h-5 text-blue-500" />
                  <h3 className="text-lg font-bold text-gray-800">Meanings</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {meanings.map((meaning, index) => (
                    <motion.button
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => playEnglishAudio(meaning)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="group relative"
                    >
                      <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-100 to-purple-100 rounded-lg blur opacity-0 group-hover:opacity-100 transition duration-500"></div>
                      <div className="relative px-4 py-2 bg-white rounded-lg shadow-sm border border-gray-200 group-hover:shadow-md transition-all duration-300">
                        <span className="text-gray-700 font-medium">{meaning}</span>
                        <Volume2 className="w-3 h-3 ml-2 inline opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>
            )}

            {/* Readings */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Kun Readings */}
              {kunReadings.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Edit3 className="w-5 h-5 text-purple-500" />
                      <h3 className="text-lg font-bold text-gray-800">Kun Readings</h3>
                    </div>
                    <button
                      onClick={() => {
                        setActiveReading('kun');
                        if (kunReadings[0]) {
                          playJapaneseAudio(kunReadings[0]);
                        }
                      }}
                      className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${activeReading === 'kun' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-600 hover:bg-purple-50'}`}
                    >
                      Hear All
                    </button>
                  </div>
                  <div className="space-y-2">
                    {kunReadings.slice(0, 5).map((reading, index) => (
                      <motion.div
                        key={index}
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.1 + index * 0.05 }}
                        whileHover={{ x: 5 }}
                        className="flex items-center justify-between p-3 bg-white rounded-xl border border-gray-100 hover:border-purple-200 hover:shadow-sm transition-all"
                      >
                        <span className="font-mono text-purple-700">{reading}</span>
                        <button
                          onClick={() => playJapaneseAudio(reading)}
                          className="p-1.5 hover:bg-purple-50 rounded-full transition-colors"
                        >
                          <Play className="w-4 h-4 text-purple-500" />
                        </button>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* On Readings */}
              {onReadings.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Edit3 className="w-5 h-5 text-green-500" />
                      <h3 className="text-lg font-bold text-gray-800">On Readings</h3>
                    </div>
                    <button
                      onClick={() => {
                        setActiveReading('on');
                        if (onReadings[0]) {
                          playJapaneseAudio(onReadings[0]);
                        }
                      }}
                      className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${activeReading === 'on' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600 hover:bg-green-50'}`}
                    >
                      Hear All
                    </button>
                  </div>
                  <div className="space-y-2">
                    {onReadings.slice(0, 5).map((reading, index) => (
                      <motion.div
                        key={index}
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.1 + index * 0.05 }}
                        whileHover={{ x: 5 }}
                        className="flex items-center justify-between p-3 bg-white rounded-xl border border-gray-100 hover:border-green-200 hover:shadow-sm transition-all"
                      >
                        <span className="font-mono text-green-700">{reading}</span>
                        <button
                          onClick={() => playJapaneseAudio(reading)}
                          className="p-1.5 hover:bg-green-50 rounded-full transition-colors"
                        >
                          <Play className="w-4 h-4 text-green-500" />
                        </button>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 text-center border border-blue-200"
              >
                <div className="text-2xl font-bold text-blue-700">{strokeCount}</div>
                <div className="text-sm text-blue-600 font-medium">Strokes</div>
              </motion.div>
              
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 text-center border border-purple-200"
              >
                <div className="text-2xl font-bold text-purple-700">{grade}</div>
                <div className="text-sm text-purple-600 font-medium">Grade</div>
              </motion.div>
              
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 text-center border border-green-200"
              >
                <div className="text-2xl font-bold text-green-700">
                  {kunReadings.length}
                </div>
                <div className="text-sm text-green-600 font-medium">Kun Reads</div>
              </motion.div>
              
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-4 text-center border border-orange-200"
              >
                <div className="text-2xl font-bold text-orange-700">
                  {onReadings.length}
                </div>
                <div className="text-sm text-orange-600 font-medium">On Reads</div>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Heisig Keyword */}
      {heisigEn && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl shadow-xl p-6 text-white"
        >
          <div className="flex items-center gap-3 mb-2">
            <BookOpen className="w-6 h-6" />
            <h3 className="text-xl font-bold">Heisig Keyword</h3>
          </div>
          <p className="text-lg opacity-90">{heisigEn}</p>
        </motion.div>
      )}
    </div>
  );
};

export default KanjiView;