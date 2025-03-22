import { LetterState } from '../types';

export const validateWord = (word: string, dictionary: string[]): boolean => {
  return dictionary.includes(`$${word}`);
};

export const checkGuess = (guess: string, target: string): LetterState[] => {
  const result: LetterState[] = Array(guess.length).fill('absent');
  
  // Create a map of target letter frequencies
  const targetLetterCount = new Map<string, number>();
  target.split('').forEach(char => {
    targetLetterCount.set(char, (targetLetterCount.get(char) || 0) + 1);
  });

  // First pass: mark correct letters
  const guessChars = guess.split('');
  guessChars.forEach((char, i) => {
    if (char === target[i]) {
      result[i] = 'correct';
      targetLetterCount.set(char, targetLetterCount.get(char)! - 1);
    }
  });

  // Second pass: mark present letters
  guessChars.forEach((char, i) => {
    if (result[i] !== 'correct' && targetLetterCount.get(char) && targetLetterCount.get(char)! > 0) {
      result[i] = 'present';
      targetLetterCount.set(char, targetLetterCount.get(char)! - 1);
    }
  });

  return result;
};