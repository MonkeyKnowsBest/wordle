export interface GameState {
  guesses: string[];
  currentGuess: string;
  targetWord: string;
  gameOver: boolean;
  won: boolean;
  maxAttempts: number;
  wordLength: number;
}

export type LetterState = 'correct' | 'present' | 'absent' | 'unused';

export interface KeyboardKey {
  letter: string;
  state: LetterState;
}

export interface Dictionary {
  solutions: string[];
  valid: string[];
}