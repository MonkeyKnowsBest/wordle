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

export const validateWord = (word: string, dictionary: string[]): boolean => {
  // Check if the word exists in the dictionary
  // The dictionary words may start with '$' so we need to check both with and without it
  return dictionary.some(dictWord => {
    const trimmedDictWord = dictWord.startsWith('$') ? dictWord.slice(1) : dictWord;
    return trimmedDictWord.toLowerCase() === word.toLowerCase();
  });
};
