import React from 'react';
import { LetterState } from '../types';
import { checkGuess } from '../utils/wordUtils';

interface GridProps {
  guesses: string[];
  currentGuess: string;
  targetWord: string;
  maxAttempts: number;
  wordLength: number;
  darkMode: boolean;
}

const Grid: React.FC<GridProps> = ({ guesses, currentGuess, targetWord, maxAttempts, wordLength, darkMode }) => {
  const empties = maxAttempts - guesses.length - 1;
  return (
    <div className={`grid gap-2 ${wordLength > 6 ? 'max-w-5xl' : 'max-w-3xl'} mx-auto`}>
      {guesses.map((guess, i) => (
        <Row 
          key={i} 
          word={guess} 
          targetWord={targetWord}
          wordLength={wordLength}
          darkMode={darkMode}
        />
      ))}
      {guesses.length < maxAttempts && (
        <Row 
          word={currentGuess} 
          targetWord={targetWord} 
          isActive={true}
          wordLength={wordLength}
          darkMode={darkMode}
        />
      )}
      {[...Array(empties)].map((_, i) => (
        <Row 
          key={`empty-${i}`} 
          word="" 
          targetWord={targetWord}
          wordLength={wordLength}
          darkMode={darkMode}
        />
      ))}
    </div>
  );
};

interface RowProps {
  word: string;
  targetWord: string;
  isActive?: boolean;
  wordLength: number;
  darkMode: boolean;
}

const Row: React.FC<RowProps> = ({ word, targetWord, isActive = false, wordLength, darkMode }) => {
  const letters = word.split('').concat(Array(wordLength - word.length).fill(''));
  const states = word ? checkGuess(word, targetWord) : Array(wordLength).fill('unused');
  return (
    <div className="flex gap-2 justify-center">
      {letters.map((letter, i) => (
        <Cell 
          key={i} 
          letter={letter} 
          state={isActive ? 'unused' : states[i]}
          darkMode={darkMode}
          wordLength={wordLength}  // Pass wordLength to Cell
        />
      ))}
    </div>
  );
};

interface CellProps {
  letter: string;
  state: LetterState;
  darkMode: boolean;
  wordLength: number;  // Add wordLength to props interface
}

const Cell: React.FC<CellProps> = ({ letter, state, darkMode, wordLength }) => {
  const baseClasses = `
    ${wordLength > 6 ? 'w-10 h-10 text-xl' : 'w-14 h-14 text-2xl'}
    border-2 
    flex 
    items-center 
    justify-center 
    font-bold 
    uppercase
    transition-colors
  `;
  const stateClasses = {
    correct: 'bg-green-500 text-white border-green-500',
    present: 'bg-yellow-500 text-white border-yellow-500',
    absent: 'bg-gray-600 text-white border-gray-600',
    unused: darkMode ? 'bg-gray-800 border-gray-700 text-gray-300' : 'border-gray-300'
  };
  return (
    <div className={`${baseClasses} ${stateClasses[state]}`}>
      {letter}
    </div>
  );
};

export default Grid;
