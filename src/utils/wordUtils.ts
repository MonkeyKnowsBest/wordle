import { LetterState } from '../types';

export const checkGuess = (guess: string, targetWord: string): LetterState[] => {
  // Ensure both words are the same length for comparison
  const normalizedGuess = guess.padEnd(targetWord.length, ' ');
  const result: LetterState[] = Array(targetWord.length).fill('absent');
  const targetLetters = targetWord.split('');
  
  // First pass: check for correct letters
  normalizedGuess.split('').forEach((letter, i) => {
    if (letter === targetLetters[i]) {
      result[i] = 'correct';
      targetLetters[i] = '';  // Mark as used
    }
  });
  
  // Second pass: check for present letters
  normalizedGuess.split('').forEach((letter, i) => {
    if (result[i] !== 'correct' && letter !== ' ') {
      const targetIndex = targetLetters.findIndex(t => t === letter);
      if (targetIndex !== -1) {
        result[i] = 'present';
        targetLetters[targetIndex] = '';  // Mark as used
      }
    }
  });
  
  return result;
};
