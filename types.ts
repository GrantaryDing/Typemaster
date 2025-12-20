

export type TestMode = 'time' | 'words' | 'ielts' | 'challenge';

export type IeltsCategory = 'All' | 'Opinion' | 'Discussion' | 'Problem Solution' | 'Advantages Disadvantages' | 'Direct Question';

export type ChallengeType = 'listening' | 'typing';

export interface TestConfig {
  mode: TestMode;
  duration: number;   // Used for 'time' mode (seconds)
  wordCount: number;  // Used for 'words' mode (target count)
  ieltsCategory?: IeltsCategory; // Used for 'ielts' mode
  challengeType?: ChallengeType; // Used for 'challenge' mode
}

export interface TestStats {
  wpm: number;
  accuracy: number;
  correctChars: number;
  incorrectChars: number;
  totalKeystrokes: number;
  combo: number; // Number of 5-word milestones reached
  wordsCompleted: number; // Total words correctly typed
}

export interface EngineState {
  status: 'idle' | 'running' | 'finished';
  text: string;
  userInput: string;
  ieltsPrompt?: string; // New field for IELTS context
  ieltsImage?: string;  // New field for IELTS chart/image
  timeLeft: number;     // Countdown for Time mode
  elapsedTime: number;  // Stopwatch for Words/IELTS mode
  
  // Challenge Mode Specifics
  challengeLives: number;
  challengeTimer: number; // 5s countdown
  challengeWordCount: number; // Score
  isWaitingForAudio: boolean; // For listening mode, waits for user trigger
  isWordRevealed: boolean; // If true, the listening challenge word is shown (with penalty)

  config: TestConfig;
  stats: TestStats;
}

export type EngineListener = (state: EngineState) => void;

export type ThemeName = 'light' | 'dark' | 'matrix' | 'sunset' | 'ocean' | 'cyberpunk' | 'coffee';