import React, { useState, useEffect } from 'react';
import Grid from './components/Grid';
import Keyboard from './components/Keyboard';
import { GameState, LetterState, Dictionary } from './types';
import { checkGuess, validateWord } from './utils/wordUtils';
import { Upload, Moon, Sun, HelpCircle } from 'lucide-react';

const FALLBACK_DICTIONARY = {
  solutions: ['$apple', '$beach', '$cloud', '$dance', '$eagle'],
  valid: []
};

const WORD_LENGTHS = [3, 4, 5, 6, 7, 8, 9];
const DEFAULT_WORD_LENGTH = 5;
const ATTEMPT_RANGES = [3, 4, 5, 6, 7, 8, 9];
const DEFAULT_ATTEMPTS = 6;

function App() {
  const [wordLength, setWordLength] = useState(DEFAULT_WORD_LENGTH);
  const [maxAttempts, setMaxAttempts] = useState(DEFAULT_ATTEMPTS);
  const [darkMode, setDarkMode] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const [dictionary, setDictionary] = useState<Dictionary>({
    solutions: FALLBACK_DICTIONARY.solutions.filter(w => w.length === wordLength + 1),
    valid: FALLBACK_DICTIONARY.valid
  });

  const [gameState, setGameState] = useState<GameState>(() => {
    const targetWord = dictionary.solutions[Math.floor(Math.random() * dictionary.solutions.length)].slice(1);
    return {
      guesses: [],
      currentGuess: '',
      targetWord,
      gameOver: false,
      won: false,
      maxAttempts,
      wordLength
    };
  });

  const [letterStates, setLetterStates] = useState<Record<string, LetterState>>({});
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const handleDictionaryUpload = async (event: React.ChangeEvent<HTMLInputElement>, type: 'solutions' | 'valid') => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const words = text
        .split(/[\n\t]/)
        .map(word => word.trim().toLowerCase())
        .filter(word => word.startsWith('$') && word.length === wordLength + 1);

      if (words.length === 0) {
        setError(`No valid ${wordLength}-letter words found in the dictionary file.`);
        return;
      }

      setDictionary(prev => ({
        ...prev,
        [type]: words
      }));

      if (type === 'solutions') {
        startNewGame(words);
      }
      setError('');
    } catch (err) {
      setError('Error reading dictionary file. Please try again.');
    }
  };

const handleKeyPress = (key: string) => {
  if (gameState.gameOver) return;

  if (key === 'Enter') {
    if (gameState.currentGuess.length !== wordLength) return;
    
    const isValidWord = validateWord(gameState.currentGuess, [...dictionary.solutions, ...dictionary.valid]);
    if (!isValidWord) {
      setError('Word not in dictionary');
      setTimeout(() => setError(''), 2000);
      return;
    }

    const newGuesses = [...gameState.guesses, gameState.currentGuess];
    const won = gameState.currentGuess === gameState.targetWord;
    const gameOver = won || newGuesses.length >= maxAttempts;

    const guessResult = checkGuess(gameState.currentGuess, gameState.targetWord);
    const newLetterStates = { ...letterStates };
    gameState.currentGuess.split('').forEach((letter, i) => {
      const currentState = newLetterStates[letter];
      const newState = guessResult[i];
      if (!currentState || (newState === 'correct' && currentState !== 'correct')) {
        newLetterStates[letter] = newState;
      }
    });

    setLetterStates(newLetterStates);
    setGameState({
      ...gameState,
      guesses: newGuesses,
      currentGuess: '',
      gameOver,
      won
    });
  } else if (key === 'Backspace') {
    setGameState({
      ...gameState,
      currentGuess: gameState.currentGuess.slice(0, -1)
    });
  } else if (/^[A-Z]$/.test(key) && gameState.currentGuess.length < wordLength) {
    setGameState({
      ...gameState,
      currentGuess: gameState.currentGuess + key.toLowerCase()
    });
  }
};
  
      setLetterStates(newLetterStates);
      setGameState({
        ...gameState,
        guesses: newGuesses,
        currentGuess: '',
        gameOver,
        won
      });
    } else if (key === 'Backspace') {
      setGameState({
        ...gameState,
        currentGuess: gameState.currentGuess.slice(0, -1)
      });
    } else if (/^[A-Z]$/.test(key) && gameState.currentGuess.length < wordLength) {
      setGameState({
        ...gameState,
        currentGuess: gameState.currentGuess + key.toLowerCase()
      });
    }
  };

  const startNewGame = (solutionWords = dictionary.solutions) => {
    if (solutionWords.length === 0) {
      setError('No words available in the solution dictionary.');
      return;
    }
    const newTargetWord = solutionWords[Math.floor(Math.random() * solutionWords.length)].slice(1);
    setGameState({
      guesses: [],
      currentGuess: '',
      targetWord: newTargetWord,
      gameOver: false,
      won: false,
      maxAttempts,
      wordLength
    });
    setLetterStates({});
    setError('');
  };

  const handleWordLengthChange = (length: number) => {
    setWordLength(length);
    setDictionary({
      solutions: FALLBACK_DICTIONARY.solutions.filter(w => w.length === length + 1),
      valid: FALLBACK_DICTIONARY.valid.filter(w => w.length === length + 1)
    });
    setGameState(prev => ({
      ...prev,
      guesses: [],
      currentGuess: '',
      targetWord: '',
      gameOver: false,
      won: false,
      wordLength: length
    }));
    setLetterStates({});
  };

  const solveGame = () => {
    setGameState(prev => ({
      ...prev,
      guesses: [...prev.guesses, prev.targetWord],
      currentGuess: '',
      gameOver: true,
      won: false
    }));
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        handleKeyPress('Enter');
      } else if (e.key === 'Backspace') {
        handleKeyPress('Backspace');
      } else if (/^[a-zA-Z]$/.test(e.key)) {
        handleKeyPress(e.key.toUpperCase());
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState]);

  return (
    <div className={`min-h-screen py-8 px-4 transition-colors ${darkMode ? 'dark bg-gray-900' : 'bg-gray-100'}`}>
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className={`text-4xl font-bold text-center ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Wordle Dictionary Test Lab
          </h1>
          <div className="flex gap-4">
            <button
              onClick={() => setShowInstructions(!showInstructions)}
              className={`p-2 rounded-full ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}
            >
              <HelpCircle className={darkMode ? 'text-white' : 'text-gray-900'} />
            </button>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`p-2 rounded-full ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}
            >
              {darkMode ? (
                <Sun className="text-white" />
              ) : (
                <Moon className="text-gray-900" />
              )}
            </button>
          </div>
        </div>
        
        {showInstructions && (
          <div className={`mb-6 p-4 rounded-lg ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}>
            <h2 className="text-xl font-bold mb-2">Instructions</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>Select the word length and number of attempts before uploading dictionaries.</li>
              <li>Dictionary files must be formatted as follows:
                <ul className="list-disc pl-5 mt-2">
                  <li>Words must be on a single line, separated by tabs</li>
                  <li>Each word must be prefixed with $</li>
                  <li>All words must have the same length</li>
                  <li>Words in Ta.txt should not appear in La.txt and vice versa</li>
                </ul>
              </li>
              <li>Upload La.txt for solution words and Ta.txt for additional valid guesses.</li>
              <li>Start a new game after changing dictionaries or settings.</li>
            </ul>
          </div>
        )}
        
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow-lg`}>
          <div className="mb-6 space-y-4">
            <div className="flex justify-between items-center gap-4">
              <label className="flex items-center gap-2 cursor-pointer bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors">
                <Upload size={20} />
                Upload La.txt
                <input
                  type="file"
                  accept=".txt"
                  onChange={(e) => handleDictionaryUpload(e, 'solutions')}
                  className="hidden"
                />
              </label>
              <label className="flex items-center gap-2 cursor-pointer bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 transition-colors">
                <Upload size={20} />
                Upload Ta.txt
                <input
                  type="file"
                  accept=".txt"
                  onChange={(e) => handleDictionaryUpload(e, 'valid')}
                  className="hidden"
                />
              </label>
            </div>
            
            <div className="flex justify-between items-center gap-4">
              <div className="flex gap-4">
                <select
                  value={wordLength}
                  onChange={(e) => handleWordLengthChange(Number(e.target.value))}
                  className={`border rounded px-3 py-2 ${
                    darkMode 
                      ? 'bg-gray-700 text-white border-gray-600' 
                      : 'bg-gray-100 text-gray-900 border-gray-300'
                  }`}
                >
                  {WORD_LENGTHS.map(length => (
                    <option key={length} value={length}>
                      {length} Letters
                    </option>
                  ))}
                </select>
                
                <select
                  value={maxAttempts}
                  onChange={(e) => setMaxAttempts(Number(e.target.value))}
                  className={`border rounded px-3 py-2 ${
                    darkMode 
                      ? 'bg-gray-700 text-white border-gray-600' 
                      : 'bg-gray-100 text-gray-900 border-gray-300'
                  }`}
                >
                  {ATTEMPT_RANGES.map(attempts => (
                    <option key={attempts} value={attempts}>
                      {attempts} Guesses
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="flex gap-2">
                <button
                  onClick={() => startNewGame()}
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors"
                >
                  New Game
                </button>
                <button
                  onClick={solveGame}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
                >
                  Solve
                </button>
              </div>
            </div>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4">
              {error}
            </div>
          )}
          
          <Grid
            guesses={gameState.guesses}
            currentGuess={gameState.currentGuess}
            targetWord={gameState.targetWord}
            maxAttempts={maxAttempts}
            wordLength={wordLength}
            darkMode={darkMode}
          />
          
          {gameState.gameOver && (
            <div className="text-center my-4">
              {gameState.won ? (
                <p className="text-green-600 font-bold text-xl">
                  Congratulations! You won!
                </p>
              ) : (
                <p className={`font-bold text-xl ${darkMode ? 'text-red-400' : 'text-red-600'}`}>
                  Game Over! The word was: {gameState.targetWord}
                </p>
              )}
            </div>
          )}

          <Keyboard
            onKeyPress={handleKeyPress}
            letterStates={letterStates}
            darkMode={darkMode}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
