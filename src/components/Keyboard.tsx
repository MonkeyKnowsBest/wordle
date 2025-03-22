import React from 'react';
import { LetterState } from '../types';

interface KeyboardProps {
  onKeyPress: (key: string) => void;
  letterStates: Record<string, LetterState>;
  darkMode: boolean;
}

const KEYBOARD_ROWS = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  ['Enter', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'Backspace']
];

const Keyboard: React.FC<KeyboardProps> = ({ onKeyPress, letterStates, darkMode }) => {
  return (
    <div className="w-full max-w-2xl mx-auto mt-8">
      {KEYBOARD_ROWS.map((row, i) => (
        <div key={i} className="flex justify-center gap-1 my-1">
          {row.map((key) => {
            const state = letterStates[key.toLowerCase()] || 'unused';
            const isSpecialKey = key === 'Enter' || key === 'Backspace';
            
            const stateClasses = {
              correct: 'bg-green-500 text-white',
              present: 'bg-yellow-500 text-white',
              absent: 'bg-gray-600 text-white',
              unused: darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-800'
            };
            
            return (
              <button
                key={key}
                onClick={() => onKeyPress(key)}
                className={`
                  ${isSpecialKey ? 'px-4' : 'w-10'} 
                  h-14 
                  rounded 
                  font-bold 
                  text-sm 
                  ${stateClasses[state]}
                  transition-colors
                  hover:opacity-90
                `}
              >
                {key === 'Backspace' ? '←' : key}
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default Keyboard;