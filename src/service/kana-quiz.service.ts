// service/kana-quiz.service.ts
import { type KanaCharacter, type QuizQuestion, type QuizSettings } from '../pages/types/kana-quiz.types';
import { getAllHiragana } from './hiragana.service';
import { getAllKatakana } from './katakana.service';

class KanaQuizService {
  private hiraganaRows = [
    { id: 'basic', name: 'Basic (あ〜ん)', chars: ['あ', 'い', 'う', 'え', 'お', 'か', 'き', 'く', 'け', 'こ', 'さ', 'し', 'す', 'せ', 'そ', 'た', 'ち', 'つ', 'て', 'と', 'な', 'に', 'ぬ', 'ね', 'の', 'は', 'ひ', 'ふ', 'へ', 'ほ', 'ま', 'み', 'む', 'め', 'も', 'や', 'ゆ', 'よ', 'ら', 'り', 'る', 'れ', 'ろ', 'わ', 'を', 'ん'] },
    { id: 'a', name: 'あ Row', chars: ['あ', 'い', 'う', 'え', 'お'] },
    { id: 'k', name: 'か Row', chars: ['か', 'き', 'く', 'け', 'こ'] },
    { id: 's', name: 'さ Row', chars: ['さ', 'し', 'す', 'せ', 'そ'] },
    { id: 't', name: 'た Row', chars: ['た', 'ち', 'つ', 'て', 'と'] },
    { id: 'n', name: 'な Row', chars: ['な', 'に', 'ぬ', 'ね', 'の'] },
    { id: 'h', name: 'は Row', chars: ['は', 'ひ', 'ふ', 'へ', 'ほ'] },
    { id: 'm', name: 'ま Row', chars: ['ま', 'み', 'む', 'め', 'も'] },
    { id: 'y', name: 'や Row', chars: ['や', 'ゆ', 'よ'] },
    { id: 'r', name: 'ら Row', chars: ['ら', 'り', 'る', 'れ', 'ろ'] },
    { id: 'w', name: 'わ Row', chars: ['わ', 'を', 'ん'] },
    { id: 'tenten', name: 'Dakuten (が〜ぽ)', chars: ['が', 'ぎ', 'ぐ', 'げ', 'ご', 'ざ', 'じ', 'ず', 'ぜ', 'ぞ', 'だ', 'ぢ', 'づ', 'で', 'ど', 'ば', 'び', 'ぶ', 'べ', 'ぼ', 'ぱ', 'ぴ', 'ぷ', 'ぺ', 'ぽ'] },
    { id: 'combo', name: 'Combinations (きゃ〜ぴょ)', chars: ['きゃ', 'きゅ', 'きょ', 'しゃ', 'しゅ', 'しょ', 'ちゃ', 'ちゅ', 'ちょ', 'にゃ', 'にゅ', 'にょ', 'ひゃ', 'ひゅ', 'ひょ', 'みゃ', 'みゅ', 'みょ', 'りゃ', 'りゅ', 'りょ', 'ぎゃ', 'ぎゅ', 'ぎょ', 'じゃ', 'じゅ', 'じょ', 'びゃ', 'びゅ', 'びょ', 'ぴゃ', 'ぴゅ', 'ぴょ'] }
  ];

  private katakanaRows = [
    { id: 'basic', name: 'Basic (ア〜ン)', chars: ['ア', 'イ', 'ウ', 'エ', 'オ', 'カ', 'キ', 'ク', 'ケ', 'コ', 'サ', 'シ', 'ス', 'セ', 'ソ', 'タ', 'チ', 'ツ', 'テ', 'ト', 'ナ', 'ニ', 'ヌ', 'ネ', 'ノ', 'ハ', 'ヒ', 'フ', 'ヘ', 'ホ', 'マ', 'ミ', 'ム', 'メ', 'モ', 'ヤ', 'ユ', 'ヨ', 'ラ', 'リ', 'ル', 'レ', 'ロ', 'ワ', 'ヲ', 'ン'] },
    { id: 'a', name: 'ア Row', chars: ['ア', 'イ', 'ウ', 'エ', 'オ'] },
    { id: 'k', name: 'カ Row', chars: ['カ', 'キ', 'ク', 'ケ', 'コ'] },
    { id: 's', name: 'サ Row', chars: ['サ', 'シ', 'ス', 'セ', 'ソ'] },
    { id: 't', name: 'タ Row', chars: ['タ', 'チ', 'ツ', 'テ', 'ト'] },
    { id: 'n', name: 'ナ Row', chars: ['ナ', 'ニ', 'ヌ', 'ネ', 'ノ'] },
    { id: 'h', name: 'ハ Row', chars: ['ハ', 'ヒ', 'フ', 'ヘ', 'ホ'] },
    { id: 'm', name: 'マ Row', chars: ['マ', 'ミ', 'ム', 'メ', 'モ'] },
    { id: 'y', name: 'ヤ Row', chars: ['ヤ', 'ユ', 'ヨ'] },
    { id: 'r', name: 'ラ Row', chars: ['ラ', 'リ', 'ル', 'レ', 'ロ'] },
    { id: 'w', name: 'ワ Row', chars: ['ワ', 'ヲ', 'ン'] },
    { id: 'tenten', name: 'Dakuten (ガ〜ポ)', chars: ['ガ', 'ギ', 'グ', 'ゲ', 'ゴ', 'ザ', 'ジ', 'ズ', 'ゼ', 'ゾ', 'ダ', 'ヂ', 'ヅ', 'デ', 'ド', 'バ', 'ビ', 'ブ', 'ベ', 'ボ', 'パ', 'ピ', 'プ', 'ペ', 'ポ'] },
    { id: 'combo', name: 'Combinations (キャ〜ピョ)', chars: ['キャ', 'キュ', 'キョ', 'シャ', 'シュ', 'ショ', 'チャ', 'チュ', 'チョ', 'ニャ', 'ニュ', 'ニョ', 'ヒャ', 'ヒュ', 'ヒョ', 'ミャ', 'ミュ', 'ミョ', 'リャ', 'リュ', 'リョ', 'ギャ', 'ギュ', 'ギョ', 'ジャ', 'ジュ', 'ジョ', 'ビャ', 'ビュ', 'ビョ', 'ピャ', 'ピュ', 'ピョ'] }
  ];

  async getAllKana(type: 'hiragana' | 'katakana'): Promise<KanaCharacter[]> {
    try {
      let data;
      if (type === 'hiragana') {
        const response = await getAllHiragana();
        data = response.data;
      } else {
        const response = await getAllKatakana();
        data = response.data;
      }
      
      return data.map((char: any) => ({
        symbol: char.symbol,
        romaji: char.romaji.toLowerCase(),
        type: type,
        row: this.getRowForCharacter(char.symbol, type),
        isTenten: char.symbol.includes('゛') || ['が','ぎ','ぐ','げ','ご','ざ','じ','ず','ぜ','ぞ','だ','ぢ','づ','で','ど','ば','び','ぶ','べ','ぼ','ガ','ギ','グ','ゲ','ゴ','ザ','ジ','ズ','ゼ','ゾ','ダ','ヂ','ヅ','デ','ド','バ','ビ','ブ','ベ','ボ'].includes(char.symbol),
        isMaru: char.symbol.includes('゜') || ['ぱ','ぴ','ぷ','ぺ','ぽ','パ','ピ','プ','ペ','ポ'].includes(char.symbol),
        isCombo: char.romaji.includes('y') || char.romaji.length > 2
      }));
    } catch (error) {
      console.error(`Error fetching ${type}:`, error);
      return [];
    }
  }

  getRowForCharacter(symbol: string, type: 'hiragana' | 'katakana'): string {
    const rows = type === 'hiragana' ? this.hiraganaRows : this.katakanaRows;
    
    for (const row of rows) {
      if (row.chars.includes(symbol)) {
        return row.id;
      }
    }
    
    return 'basic';
  }

  getRows(type: 'hiragana' | 'katakana') {
    return type === 'hiragana' ? this.hiraganaRows : this.katakanaRows;
  }

  generateQuizQuestions(settings: QuizSettings, characters: KanaCharacter[]): QuizQuestion[] {
    let filteredChars = [...characters];
    
    // Filter by selected rows
    if (!settings.rows.includes('all')) {
      filteredChars = filteredChars.filter(char => 
        settings.rows.includes(char.row)
      );
    }
    
    // Filter by options
    if (!settings.includeTenten) {
      filteredChars = filteredChars.filter(char => !char.isTenten);
    }
    
    if (!settings.includeMaru) {
      filteredChars = filteredChars.filter(char => !char.isMaru);
    }
    
    if (!settings.includeCombo) {
      filteredChars = filteredChars.filter(char => !char.isCombo);
    }
    
    // Shuffle and limit
    const selectedChars = this.shuffleArray(filteredChars).slice(0, settings.questionCount);
    
    // Generate questions
    return selectedChars.map((char, index) => {
      let question = '';
      let type: 'reading' | 'writing' = settings.mode === 'listening' ? 'reading' : settings.mode;
      
      if (settings.mode === 'reading') {
        question = `What is the romaji for: ${char.symbol}`;
      } else if (settings.mode === 'writing') {
        question = `Write the kana for: ${char.romaji}`;
      } else if (settings.mode === 'listening') {
        question = `Listen and write the kana`;
      }
      
      return {
        id: `q${index}`,
        character: char,
        question: question,
        type: type
      };
    });
  }

  private shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  checkAnswer(question: QuizQuestion, userAnswer: string): boolean {
    const normalizedUserAnswer = userAnswer.toLowerCase().trim();
    const normalizedCorrectAnswer = question.character.romaji.toLowerCase();
    
    if (question.type === 'reading') {
      return normalizedUserAnswer === normalizedCorrectAnswer;
    } else if (question.type === 'writing') {
      return normalizedUserAnswer === question.character.symbol;
    }
    
    return false;
  }

  normalizeKanaInput(input: string): string {
    // Convert romaji variations to standard format
    const conversions: { [key: string]: string } = {
      'si': 'shi',
      'ti': 'chi',
      'tu': 'tsu',
      'hu': 'fu',
      'zi': 'ji',
      'di': 'ji',
      'du': 'zu',
      'wo': 'o',
      'nn': 'n'
    };
    
    let normalized = input.toLowerCase();
    
    // Apply conversions
    Object.keys(conversions).forEach(key => {
      normalized = normalized.replace(new RegExp(`^${key}$`, 'i'), conversions[key]);
    });
    
    return normalized;
  }
}

export const kanaQuizService = new KanaQuizService();