
import { EngineState, EngineListener, TestConfig, IeltsCategory } from './types';
import { WORD_LIST, IELTS_DATA } from './constants';

export class TypingTutor {
  state: EngineState;
  private listeners: EngineListener[] = [];
  private timer: number | null = null;
  private wordsCompletedInternal: number = 0;
  private readonly CHALLENGE_TIME_LIMIT = 5; // 5 seconds

  constructor(config: TestConfig = { mode: 'time', duration: 60, wordCount: 50 }) {
    this.state = this.getInitialState(config);
  }

  private getInitialState(config: TestConfig): EngineState {
    this.wordsCompletedInternal = 0;
    
    let text = '';
    let ieltsPrompt = undefined;
    let ieltsImage = undefined;
    let duration = config.duration;
    let challengeLives = 0;
    let isWaitingForAudio = false;

    if (config.mode === 'ielts') {
        const category: IeltsCategory = config.ieltsCategory || 'All';
        const filteredTasks = category === 'All' 
            ? IELTS_DATA 
            : IELTS_DATA.filter(t => t.category === category);
        const tasksToUse = filteredTasks.length > 0 ? filteredTasks : IELTS_DATA;
        const task = tasksToUse[Math.floor(Math.random() * tasksToUse.length)];
        text = task.text;
        ieltsPrompt = task.prompt;
        ieltsImage = task.image;
        duration = 0; 
    } else if (config.mode === 'words') {
        text = this.generateText(config.wordCount);
        duration = 0; 
    } else if (config.mode === 'challenge') {
        // Generate just ONE word initially
        text = this.generateText(1);
        duration = 0;
        // 3 blood for typing, 5 lives for listening (was 1)
        challengeLives = config.challengeType === 'typing' ? 3 : 5; 
        isWaitingForAudio = config.challengeType === 'listening';
    } else {
        text = this.generateText(Math.ceil((config.duration / 60) * 200));
    }

    return {
      status: 'idle',
      text: text,
      userInput: '',
      ieltsPrompt: ieltsPrompt,
      ieltsImage: ieltsImage,
      timeLeft: duration,
      elapsedTime: 0,
      challengeLives: challengeLives,
      challengeTimer: this.CHALLENGE_TIME_LIMIT,
      challengeWordCount: 0,
      isWaitingForAudio: isWaitingForAudio,
      isWordRevealed: false,
      config: config,
      stats: {
        wpm: 0,
        accuracy: 100,
        correctChars: 0,
        incorrectChars: 0,
        totalKeystrokes: 0,
        combo: 0,
        wordsCompleted: 0
      }
    };
  }

  private generateText(count: number): string {
    const words = [];
    for (let i = 0; i < count; i++) {
      words.push(WORD_LIST[Math.floor(Math.random() * WORD_LIST.length)]);
    }
    return words.join(' ');
  }

  subscribe(listener: EngineListener) {
    this.listeners.push(listener);
    listener(this.state);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notify() {
    this.listeners.forEach(l => l({ ...this.state }));
  }

  start() {
    if (this.state.status === 'running') return;
    
    this.state.status = 'running';
    this.notify();

    if (this.timer) clearInterval(this.timer);
    
    this.timer = window.setInterval(() => {
      this.tick();
    }, 100); 
  }

  // Method to manually start the timer for a word in listening mode
  startChallengeWord() {
      if (this.state.config.mode === 'challenge' && this.state.config.challengeType === 'listening') {
          this.state.isWaitingForAudio = false;
          // Ensure engine is running if not already (e.g. first word)
          if (this.state.status === 'idle') {
              this.start();
          } else {
              this.notify();
          }
      }
  }

  revealChallengeWord() {
      if (this.state.config.mode === 'challenge' && this.state.config.challengeType === 'listening') {
          if (this.state.isWordRevealed) return;
          
          this.state.challengeLives--; // Deduct life
          
          if (this.state.challengeLives <= 0) {
              this.finish();
              return;
          }

          this.state.isWordRevealed = true;
          this.state.isWaitingForAudio = false; 
          
          if (this.state.status === 'idle') this.start();
          this.notify();
      }
  }

  private tick() {
    if (this.state.status !== 'running') {
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
        return;
    }

    // Handle Time
    const delta = 0.1;

    // In listening challenge, if waiting for user to play audio, pause timer
    if (this.state.config.mode === 'challenge' && this.state.isWaitingForAudio) {
        return;
    }

    // Update Elapsed Time
    this.state.elapsedTime += delta; 
    
    // Time Mode Logic
    if (this.state.config.mode === 'time') {
      this.state.timeLeft -= delta;
      if (this.state.timeLeft <= 0) {
        this.finish();
        return;
      }
    }

    // Challenge Mode Logic
    if (this.state.config.mode === 'challenge') {
        // Only count down for TYPING challenge. Listening challenge is untimed.
        if (this.state.config.challengeType !== 'listening') {
            this.state.challengeTimer -= delta;
            
            if (this.state.challengeTimer <= 0) {
                // Time up for this word
                this.handleChallengeFailure();
            }
        }
    }
    
    this.calculateStats();
    this.notify();
  }

  private handleChallengeFailure() {
      this.state.challengeLives--;
      if (this.state.challengeLives <= 0) {
          this.finish();
      } else {
          // Reset for next word
          this.nextChallengeWord();
      }
  }

  private nextChallengeWord() {
      this.state.text = this.generateText(1);
      this.state.userInput = '';
      this.state.challengeTimer = this.CHALLENGE_TIME_LIMIT;
      this.state.isWordRevealed = false;
      
      // If listening mode, pause again for the new word
      if (this.state.config.challengeType === 'listening') {
          this.state.isWaitingForAudio = true;
      }
      
      this.notify();
  }

  finish() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
    this.state.status = 'finished';
    this.calculateStats();
    this.notify();
  }

  reset() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
    this.wordsCompletedInternal = 0; 
    this.state = this.getInitialState(this.state.config);
    this.notify();
  }

  setConfig(partialConfig: Partial<TestConfig>) {
    if (this.timer) {
        clearInterval(this.timer);
        this.timer = null;
    }
    const newConfig = { ...this.state.config, ...partialConfig };
    this.state = this.getInitialState(newConfig);
    this.notify();
  }

  handleInput(input: string) {
    if (this.state.status === 'finished') return;
    
    // If waiting for audio, block input
    if (this.state.isWaitingForAudio) return;

    if (this.state.status === 'idle') {
      if (input.length === 0) return;
      this.start();
    }

    const isChallenge = this.state.config.mode === 'challenge';
    const prevLength = this.state.userInput.length;
    const newLength = input.length;

    if (!isChallenge && newLength < prevLength) {
        this.notify();
        return;
    }

    if (input.length > this.state.text.length) {
      return;
    }

    if (newLength > prevLength) {
        this.state.stats.totalKeystrokes++;
        
        // Standard Mode Word Counting
        if (!isChallenge) {
            const indexTyped = newLength - 1;
            const targetChar = this.state.text[indexTyped];
            const isLastChar = indexTyped === this.state.text.length - 1;

            if (targetChar === ' ' || isLastChar) {
                this.wordsCompletedInternal++;
                this.state.stats.wordsCompleted = this.wordsCompletedInternal;
                
                if (this.wordsCompletedInternal > 0 && this.wordsCompletedInternal % 5 === 0) {
                    this.state.stats.combo++;
                }
            }
        }
    }

    this.state.userInput = input;
    
    // Check finish condition
    if (this.state.config.mode === 'challenge') {
        // In challenge mode, check if word matches EXACTLY
        if (this.state.userInput === this.state.text) {
            this.state.stats.wordsCompleted++;
            
            // Only award point if NOT revealed
            if (!this.state.isWordRevealed) {
                this.state.challengeWordCount++; // Score
            }
            // Note: If revealed, they just proceed without gaining a point (and they already lost 1 when revealing)
            
            this.state.stats.combo++; 
            
            // Success! Next word.
            this.nextChallengeWord();
            return;
        }
    } else if (this.state.config.mode === 'words' || this.state.config.mode === 'ielts') {
        if (this.state.userInput.length === this.state.text.length) {
            this.finish();
            return;
        }
    } else {
        // Time mode auto-finish
        if (this.state.userInput.length === this.state.text.length) {
            this.finish();
            return;
        }
    }

    this.calculateStats();
    this.notify();
  }

  private calculateStats() {
    const timeUsed = this.state.elapsedTime; // This is now in seconds (float)
    const durationMin = timeUsed === 0 ? 0.001 : timeUsed / 60;

    let correct = 0;
    let incorrect = 0;

    const input = this.state.userInput;
    const target = this.state.text;

    for (let i = 0; i < input.length; i++) {
      if (input[i] === target[i]) {
        correct++;
      } else {
        incorrect++;
      }
    }

    this.state.stats.correctChars = correct;
    this.state.stats.incorrectChars = incorrect;

    // WPM Calculation
    const netWPM = ((correct) / 5) / durationMin;
    this.state.stats.wpm = Math.max(0, Math.round(netWPM));
    
    this.state.stats.accuracy = input.length > 0 
      ? Math.round((correct / input.length) * 100) 
      : 100;
  }
}
