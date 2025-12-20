
import React, { useEffect, useRef, useState, useMemo } from 'react';
import { TypingTutor } from './engine';
import { EngineState, ThemeName, TestConfig, IeltsCategory, ChallengeType, TestMode } from './types';

const tutor = new TypingTutor();

const THEMES: Record<ThemeName, React.CSSProperties> = {
  light: {
    '--color-paper': '#ffffff',
    '--color-ink': '#1e293b',
    '--color-primary': '#2563eb',
    '--color-success': '#16a34a',
    '--color-error': '#dc2626',
    '--color-subtle': '#94a3b8',
    '--color-surface': '#f1f5f9',
    '--color-surface-highlight': '#e2e8f0',
  } as any,
  dark: {
    '--color-paper': '#1e293b',
    '--color-ink': '#f8fafc',
    '--color-primary': '#60a5fa',
    '--color-success': '#4ade80',
    '--color-error': '#f87171',
    '--color-subtle': '#94a3b8',
    '--color-surface': '#0f172a',
    '--color-surface-highlight': '#1e293b',
  } as any,
  matrix: {
    '--color-paper': '#000000',
    '--color-ink': '#22c55e',
    '--color-primary': '#22c55e',
    '--color-success': '#4ade80',
    '--color-error': '#dc2626',
    '--color-subtle': '#15803d',
    '--color-surface': '#022c22',
    '--color-surface-highlight': '#052e16',
  } as any,
  sunset: {
    '--color-paper': '#fff1f2',
    '--color-ink': '#881337',
    '--color-primary': '#f43f5e',
    '--color-success': '#059669',
    '--color-error': '#e11d48',
    '--color-subtle': '#fb7185',
    '--color-surface': '#fff7ed',
    '--color-surface-highlight': '#fed7aa',
  } as any,
  ocean: {
    '--color-paper': '#0f172a',
    '--color-ink': '#e2e8f0',
    '--color-primary': '#38bdf8',
    '--color-success': '#2dd4bf',
    '--color-error': '#f43f5e',
    '--color-subtle': '#64748b',
    '--color-surface': '#1e293b',
    '--color-surface-highlight': '#334155',
  } as any,
  cyberpunk: {
    '--color-paper': '#0c0a09',
    '--color-ink': '#fdf2f8',
    '--color-primary': '#d946ef',
    '--color-success': '#22d3ee',
    '--color-error': '#f43f5e',
    '--color-subtle': '#a21caf',
    '--color-surface': '#1c1917',
    '--color-surface-highlight': '#292524',
  } as any,
  coffee: {
    '--color-paper': '#fff8e7',
    '--color-ink': '#4b3621',
    '--color-primary': '#a0522d',
    '--color-success': '#556b2f',
    '--color-error': '#8b0000',
    '--color-subtle': '#d2691e',
    '--color-surface': '#faebd7',
    '--color-surface-highlight': '#f5deb3',
  } as any,
};

const PROGRESS_COLORS = [
  'from-cyan-400 to-blue-500',      // Level 0
  'from-emerald-400 to-green-500',  // Level 1
  'from-lime-400 to-yellow-400',    // Level 2
  'from-yellow-400 to-orange-500',  // Level 3
  'from-orange-500 to-red-500',     // Level 4
  'from-red-500 to-pink-600',       // Level 5
  'from-purple-500 to-indigo-600',  // Level 6+
];

// --- Types for History ---
interface HistoryRecord {
  score: number;
  wpm: number;
  time: number; // Elapsed time in seconds
  date: string;
}

type TtsMode = 'off' | 'word' | 'sentence';

const formatTime = (seconds: number) => {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
};

// --- Components ---

function ModeSelector({ 
  onSelect, 
  currentConfig,
  ttsMode,
  onTtsChange
}: { 
  onSelect: (c: Partial<TestConfig>) => void, 
  currentConfig: TestConfig,
  ttsMode: TtsMode,
  onTtsChange: (m: TtsMode) => void
}) {
    const setTimeMode = (duration: number) => onSelect({ mode: 'time', duration, wordCount: 0, challengeType: undefined });
    const setWordsMode = (wordCount: number) => onSelect({ mode: 'words', duration: 0, wordCount, challengeType: undefined });
    const setIELTSMode = (category: IeltsCategory = 'All') => onSelect({ mode: 'ielts', duration: 0, wordCount: 0, ieltsCategory: category, challengeType: undefined });
    const setChallengeMode = (type: ChallengeType) => onSelect({ mode: 'challenge', duration: 0, wordCount: 0, challengeType: type });

    const ieltsCategories: IeltsCategory[] = ['Opinion', 'Discussion', 'Problem Solution', 'Advantages Disadvantages', 'Direct Question'];
    const [showTtsMenu, setShowTtsMenu] = useState(false);
    const [showChallengeMenu, setShowChallengeMenu] = useState(false);

    return (
        <div className="flex flex-col gap-4">
            <div className="flex flex-col md:flex-row gap-2 md:gap-6 items-start md:items-center">
              <div className="flex items-center gap-1 bg-surface rounded-lg p-1 border border-surface-highlight">
                 <span className="px-2 text-xs font-bold text-subtle uppercase">Time</span>
                 <button onClick={() => setTimeMode(30)} className={`px-3 py-1 rounded text-sm font-medium transition ${currentConfig.mode === 'time' && currentConfig.duration === 30 ? 'bg-primary text-paper shadow-sm' : 'text-subtle hover:text-ink hover:bg-surface-highlight'}`}>30s</button>
                 <button onClick={() => setTimeMode(60)} className={`px-3 py-1 rounded text-sm font-medium transition ${currentConfig.mode === 'time' && currentConfig.duration === 60 ? 'bg-primary text-paper shadow-sm' : 'text-subtle hover:text-ink hover:bg-surface-highlight'}`}>1m</button>
                 <button onClick={() => setTimeMode(120)} className={`px-3 py-1 rounded text-sm font-medium transition ${currentConfig.mode === 'time' && currentConfig.duration === 120 ? 'bg-primary text-paper shadow-sm' : 'text-subtle hover:text-ink hover:bg-surface-highlight'}`}>2m</button>
              </div>

              <div className="flex items-center gap-1 bg-surface rounded-lg p-1 border border-surface-highlight">
                 <span className="px-2 text-xs font-bold text-subtle uppercase">Words</span>
                 {[30, 50, 100, 200].map(count => (
                   <button 
                     key={count}
                     onClick={() => setWordsMode(count)}
                     className={`px-3 py-1 rounded text-sm font-medium transition ${currentConfig.mode === 'words' && currentConfig.wordCount === count ? 'bg-primary text-paper shadow-sm' : 'text-subtle hover:text-ink hover:bg-surface-highlight'}`}
                   >
                     {count}
                   </button>
                 ))}
              </div>
              
              <div className="flex items-center gap-2">
                <button 
                   onClick={() => setIELTSMode('All')} 
                   className={`px-3 py-1 rounded-lg border border-surface-highlight text-sm font-bold uppercase transition ${currentConfig.mode === 'ielts' ? 'bg-primary text-paper border-primary shadow-sm' : 'bg-surface text-subtle hover:text-ink hover:border-subtle/50'}`}
                >
                   IELTS
                </button>
                
                {/* Challenge Button */}
                <div className="relative">
                  <button
                    onClick={() => setShowChallengeMenu(!showChallengeMenu)}
                    className={`px-3 py-1 rounded-lg border text-sm font-bold uppercase transition flex items-center gap-2 ${currentConfig.mode === 'challenge' ? 'bg-error text-paper border-error shadow-sm' : 'bg-surface text-subtle hover:text-ink hover:border-error/50'}`}
                  >
                    <span>Challenge</span>
                    {currentConfig.mode === 'challenge' && (
                         <span className="text-[10px] bg-white/20 px-1 rounded">{currentConfig.challengeType === 'listening' ? 'Listen' : 'Speed'}</span>
                    )}
                  </button>

                  {showChallengeMenu && (
                     <div className="absolute top-full left-0 mt-2 bg-paper border border-surface-highlight rounded-lg shadow-xl p-2 z-50 flex flex-col gap-1 min-w-[160px] animate-in slide-in-from-top-2 duration-200">
                        <button 
                          onClick={() => { setChallengeMode('listening'); setShowChallengeMenu(false); }}
                          className={`px-3 py-2 rounded text-left text-xs font-bold uppercase ${currentConfig.challengeType === 'listening' ? 'bg-error text-white' : 'text-subtle hover:bg-surface hover:text-ink'}`}
                        >
                          Speed Listening
                          <div className="text-[9px] normal-case opacity-70">5 Lives, Untimed</div>
                        </button>
                        <button 
                          onClick={() => { setChallengeMode('typing'); setShowChallengeMenu(false); }}
                          className={`px-3 py-2 rounded text-left text-xs font-bold uppercase ${currentConfig.challengeType === 'typing' ? 'bg-error text-white' : 'text-subtle hover:bg-surface hover:text-ink'}`}
                        >
                          Speed Typing
                          <div className="text-[9px] normal-case opacity-70">3 Lives, 5s per word</div>
                        </button>
                     </div>
                  )}
                </div>

                {currentConfig.mode === 'ielts' && (
                  <div className="relative">
                    <button
                      onClick={() => setShowTtsMenu(!showTtsMenu)}
                      className={`px-3 py-1 rounded-lg border text-sm font-bold uppercase transition flex items-center gap-2 ${ttsMode !== 'off' ? 'bg-surface text-primary border-primary' : 'bg-surface text-subtle border-surface-highlight hover:text-ink'}`}
                    >
                      <span>Read Out</span>
                      {ttsMode !== 'off' && <span className="text-[10px] bg-primary text-paper px-1.5 rounded">{ttsMode}</span>}
                    </button>
                    
                    {showTtsMenu && (
                      <div className="absolute top-full left-0 mt-2 bg-paper border border-surface-highlight rounded-lg shadow-xl p-2 z-50 flex flex-col gap-1 min-w-[140px] animate-in slide-in-from-top-2 duration-200">
                        <button 
                          onClick={() => { onTtsChange('off'); setShowTtsMenu(false); }}
                          className={`px-3 py-2 rounded text-left text-xs font-bold uppercase ${ttsMode === 'off' ? 'bg-surface-highlight text-ink' : 'text-subtle hover:bg-surface hover:text-ink'}`}
                        >
                          Off
                        </button>
                        <button 
                          onClick={() => { onTtsChange('word'); setShowTtsMenu(false); }}
                          className={`px-3 py-2 rounded text-left text-xs font-bold uppercase ${ttsMode === 'word' ? 'bg-primary text-paper' : 'text-subtle hover:bg-surface hover:text-ink'}`}
                        >
                          Word by Word
                        </button>
                        <button 
                          onClick={() => { onTtsChange('sentence'); setShowTtsMenu(false); }}
                          className={`px-3 py-2 rounded text-left text-xs font-bold uppercase ${ttsMode === 'sentence' ? 'bg-primary text-paper' : 'text-subtle hover:bg-surface hover:text-ink'}`}
                        >
                          Full Sentences
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
            
            {/* IELTS Category Sub-menu */}
            {currentConfig.mode === 'ielts' && (
                <div className="flex flex-wrap gap-2 items-center animate-in slide-in-from-top-2 duration-300 bg-surface-highlight/30 p-2 rounded-xl">
                    <span className="text-xs font-bold text-subtle mr-2 uppercase tracking-wider">Essay Types:</span>
                    {ieltsCategories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setIELTSMode(cat)}
                            className={`px-3 py-1.5 rounded-md text-sm font-medium transition shadow-sm ${currentConfig.ieltsCategory === cat ? 'bg-primary text-white ring-1 ring-primary' : 'bg-paper text-subtle hover:text-ink hover:bg-white border border-transparent hover:border-surface-highlight'}`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

function ChartIcon({ category }: { category: string }) {
    const strokeColor = "currentColor";
    const commonProps = { width: "48", height: "48", viewBox: "0 0 24 24", fill: "none", stroke: strokeColor, strokeWidth: "1.5", strokeLinecap: "round" as const, strokeLinejoin: "round" as const };

    // Icons suitable for Essay types
    switch (category) {
        case 'Opinion':
            return (
                <svg {...commonProps}>
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
            );
        case 'Discussion':
            return (
                <svg {...commonProps}>
                    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                </svg>
            );
        case 'Problem Solution':
            return (
                <svg {...commonProps}>
                    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
                </svg>
            );
        case 'Advantages Disadvantages':
            return (
                <svg {...commonProps}>
                    <path d="M6 3v18" />
                    <path d="M18 3v18" />
                    <path d="M3 9h6" />
                    <path d="M15 9h6" />
                </svg>
            );
        case 'Direct Question':
            return (
                <svg {...commonProps}>
                    <circle cx="12" cy="12" r="10" />
                    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                    <line x1="12" y1="17" x2="12.01" y2="17" />
                </svg>
            );
        default:
            return (
                <svg {...commonProps}>
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="16" y1="13" x2="8" y2="13" />
                    <line x1="16" y1="17" x2="8" y2="17" />
                    <polyline points="10 9 9 9 8 9" />
                </svg>
            );
    }
}

function ConsentBanner({ onAccept, onDecline }: { onAccept: () => void, onDecline: () => void }) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-paper border-t border-surface-highlight p-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] z-50 animate-in slide-in-from-bottom duration-300">
      <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-sm text-ink">
          <span className="font-bold">Enable History?</span> We use local storage to save your best records on this device.
        </div>
        <div className="flex gap-2">
          <button onClick={onDecline} className="px-4 py-2 text-xs font-bold uppercase text-subtle hover:text-ink transition">
            No Thanks
          </button>
          <button onClick={onAccept} className="px-6 py-2 rounded bg-primary text-white text-xs font-bold uppercase hover:bg-blue-600 transition shadow-sm">
            Allow Storage
          </button>
        </div>
      </div>
    </div>
  );
}

function HistoryCard({ label, record, mode }: { label: string, record?: HistoryRecord, mode: TestMode }) {
  if (!record) return null;
  
  const isTimeMode = mode === 'time';
  const isIELTS = mode === 'ielts';
  const isChallenge = mode === 'challenge';
  
  // For Challenge, Score is the hero.
  let mainValue: string | number;
  let mainLabel: string;
  let subValue: string | number;
  let subLabel: string;

  if (isChallenge) {
      mainValue = record.score;
      mainLabel = 'WORDS';
      subValue = record.wpm;
      subLabel = 'WPM';
  } else if (isTimeMode || isIELTS) {
      mainValue = record.wpm;
      mainLabel = 'WPM';
      subValue = record.score;
      subLabel = 'pts';
  } else {
      mainValue = formatTime(record.time);
      mainLabel = 'TIME';
      subValue = record.wpm;
      subLabel = 'WPM';
  }

  return (
    <div className="bg-surface p-3 rounded-lg border border-surface-highlight flex justify-between items-center group hover:border-primary/30 transition-colors">
      <div>
        <div className="text-[10px] font-bold uppercase text-subtle mb-0.5">{label}</div>
        <div className="font-bold text-ink text-lg leading-none">{mainValue} <span className="text-[10px] text-subtle font-normal">{mainLabel}</span></div>
      </div>
      <div className="text-right">
        <div className="text-[10px] font-bold uppercase text-subtle mb-0.5">{subLabel}</div>
        <div className="font-mono text-primary font-bold">{subValue}</div>
      </div>
    </div>
  );
}


export default function App() {
  const [engineState, setEngineState] = useState<EngineState>(tutor.state);
  const [theme, setTheme] = useState<ThemeName>('light');
  
  const [showCombo, setShowCombo] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const textContainerRef = useRef<HTMLDivElement>(null);
  const prevComboRef = useRef(0);

  // Fullscreen state
  const [isFullScreen, setIsFullScreen] = useState(false);

  // TTS State
  const [ttsMode, setTtsMode] = useState<TtsMode>('off');
  const prevWordsCompletedRef = useRef(0);
  const spokenSentenceIndexRef = useRef(0);

  // Challenge TTS State - we no longer auto-play in effect for listening mode
  // We keep the ref if needed for cleanup but logic moves to button handler.

  // History State
  const [consent, setConsent] = useState<boolean | null>(() => {
    const stored = localStorage.getItem('tp_consent');
    return stored === 'true' ? true : stored === 'false' ? false : null;
  });
  const [history, setHistory] = useState<Record<string, HistoryRecord>>({});

  // --- Subscriptions ---

  useEffect(() => {
    return tutor.subscribe(setEngineState);
  }, []);

  // --- Effects ---

  useEffect(() => {
    const root = document.documentElement;
    // Safety check: if theme is deleted but still in state, fallback to light
    const themeVars = THEMES[theme] || THEMES['light'];
    Object.entries(themeVars).forEach(([key, value]) => {
      root.style.setProperty(key, value as string);
    });
  }, [theme]);

  // Fullscreen listener
  useEffect(() => {
    const handleFullScreenChange = () => {
      setIsFullScreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullScreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullScreenChange);
    };
  }, []);

  // Load History
  useEffect(() => {
    if (consent) {
      try {
        const storedHistory = localStorage.getItem('tp_history');
        if (storedHistory) {
          setHistory(JSON.parse(storedHistory));
        }
      } catch (e) {
        console.error("Failed to load history", e);
      }
    }
  }, [consent]);

  // Save History Logic
  useEffect(() => {
    if (engineState.status === 'finished' && consent) {
      const { config, stats, elapsedTime } = engineState;
      
      let key = '';
      if (config.mode === 'time') {
          key = `time-${config.duration}`;
      } else if (config.mode === 'words') {
          key = `words-${config.wordCount}`;
      } else if (config.mode === 'challenge') {
          key = `challenge-${config.challengeType}`;
      } else {
          key = 'ielts';
      }
      
      const currentScore = config.mode === 'challenge' 
          ? engineState.challengeWordCount // For challenge, score is words typed
          : (stats.combo * 10) - stats.incorrectChars;
          
      const currentWpm = stats.wpm;
      const currentTime = elapsedTime;
      
      setHistory(prev => {
        const existing = prev[key];
        let isNewBest = false;
        
        if (!existing) {
          isNewBest = true;
        } else {
          if (config.mode === 'challenge') {
             // For Challenge, more words (score) is better
             if (currentScore > existing.score) isNewBest = true;
          } else if (config.mode === 'time' || config.mode === 'ielts') {
            if (currentWpm > existing.wpm) isNewBest = true;
          } else {
            if (existing.time === undefined || currentTime < existing.time) isNewBest = true;
          }
        }

        if (isNewBest) {
          const newRecord: HistoryRecord = {
            score: currentScore,
            wpm: currentWpm,
            time: currentTime,
            date: new Date().toISOString()
          };
          const newHistory = { ...prev, [key]: newRecord };
          localStorage.setItem('tp_history', JSON.stringify(newHistory));
          return newHistory;
        }
        return prev;
      });
    }
  }, [engineState.status, consent, engineState.config, engineState.stats, engineState.elapsedTime, engineState.challengeWordCount]);

  // Combo Effect
  useEffect(() => {
    if (engineState.stats.combo > prevComboRef.current) {
      setShowCombo(true);
      const timer = setTimeout(() => setShowCombo(false), 1500);
      prevComboRef.current = engineState.stats.combo;
      return () => clearTimeout(timer);
    } else if (engineState.stats.combo === 0) {
      prevComboRef.current = 0;
    }
  }, [engineState.stats.combo]);

  // Auto-scroll Effect
  useEffect(() => {
    const container = textContainerRef.current;
    if (!container) return;

    const activeSpan = container.querySelector('[data-active="true"]') as HTMLElement;
    if (activeSpan) {
      const containerHeight = container.clientHeight;
      const spanTop = activeSpan.offsetTop;
      const spanHeight = activeSpan.offsetHeight;
      
      const targetScroll = spanTop - (containerHeight / 2) + (spanHeight / 2);
      
      container.scrollTo({
        top: targetScroll,
        behavior: 'smooth'
      });
    }
  }, [engineState.userInput]);

  // --- TTS Logic ---

  const speak = (text: string) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel(); // Stop current
    const utterance = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(utterance);
  };

  const sentencesData = useMemo(() => {
    if (engineState.config.mode !== 'ielts') return [];
    const text = engineState.text;
    const matches = text.matchAll(/[^.!?]+[.!?]+(\s|$)/g);
    const result = [];
    let accLength = 0;
    for (const match of matches) {
        const str = match[0];
        accLength += str.length;
        result.push({ text: str.trim(), endLength: accLength });
    }
    return result;
  }, [engineState.text, engineState.config.mode]);

  // Reset TTS trackers
  useEffect(() => {
    if (engineState.status === 'idle') {
      prevWordsCompletedRef.current = 0;
      spokenSentenceIndexRef.current = 0;
      window.speechSynthesis.cancel();
    }
  }, [engineState.status, engineState.text]);

  // IELTS TTS Trigger
  useEffect(() => {
    if (engineState.config.mode !== 'ielts' || ttsMode === 'off' || engineState.status !== 'running') return;

    if (ttsMode === 'word') {
         const wordsCompleted = engineState.stats.wordsCompleted;
         if (wordsCompleted > prevWordsCompletedRef.current) {
             const allWords = engineState.text.split(' ');
             const wordToRead = allWords[wordsCompleted - 1]; 
             if (wordToRead) speak(wordToRead);
             prevWordsCompletedRef.current = wordsCompleted;
         }
    }
    if (ttsMode === 'sentence') {
        const currentLen = engineState.userInput.length;
        const nextIndex = spokenSentenceIndexRef.current;
        if (nextIndex < sentencesData.length) {
            const target = sentencesData[nextIndex];
            if (currentLen >= target.endLength) {
                 speak(target.text);
                 spokenSentenceIndexRef.current = nextIndex + 1;
            }
        }
    }
  }, [engineState.userInput, engineState.stats.wordsCompleted, ttsMode, sentencesData, engineState.status, engineState.text, engineState.config.mode]);


  const handleAcceptConsent = () => {
    setConsent(true);
    localStorage.setItem('tp_consent', 'true');
  };

  const handleDeclineConsent = () => {
    setConsent(false);
    localStorage.setItem('tp_consent', 'false');
  };

  const toggleFullScreen = () => {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch((e) => console.error(e));
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        }
      }
  };

  const handlePlayChallengeAudio = (e: React.MouseEvent) => {
      e.stopPropagation();
      speak(engineState.text);
      tutor.startChallengeWord();
      // Short timeout to ensure state update propagates before focus
      setTimeout(() => inputRef.current?.focus(), 50);
  };
  
  const handleReplayAudio = (e: React.MouseEvent) => {
      e.stopPropagation();
      speak(engineState.text);
      inputRef.current?.focus();
  };

  const handleRevealWord = (e: React.MouseEvent) => {
      e.stopPropagation();
      tutor.revealChallengeWord();
      inputRef.current?.focus();
  };

  const renderText = () => {
    const { text, userInput, config, isWaitingForAudio, isWordRevealed } = engineState;
    const isListeningChallenge = config.mode === 'challenge' && config.challengeType === 'listening';

    if (isListeningChallenge) {
        if (isWaitingForAudio) {
             return (
                 <button 
                    onClick={handlePlayChallengeAudio}
                    className="flex flex-col items-center gap-4 group/play animate-in zoom-in duration-300 z-20 focus:outline-none"
                    autoFocus
                 >
                    <div className="w-20 h-20 rounded-full bg-primary text-white flex items-center justify-center shadow-lg shadow-primary/30 transition-all group-hover/play:scale-110 group-hover/play:shadow-primary/50">
                        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="currentColor" className="ml-1"><path d="M8 5v14l11-7z"/></svg>
                    </div>
                    <span className="text-sm font-bold uppercase text-subtle tracking-widest group-hover/play:text-primary transition-colors">
                        {engineState.status === 'idle' ? 'Start Test' : 'Play Next Word'}
                    </span>
                 </button>
             );
        }

        // If word is revealed, treat it like standard text rendering so they can copy it
        if (isWordRevealed) {
            // Fallthrough to standard logic below, but first render control buttons above/around it in main UI area
            // Actually, we can just let it fall through and use standard rendering.
        } else {
             // Render masked content for listening mode with Immediate Feedback
             return (
                <div className="flex flex-col items-center justify-center h-full gap-8">
                     <div className="flex gap-4">
                         <button 
                            onClick={handleReplayAudio}
                            className="w-12 h-12 rounded-full bg-surface-highlight hover:bg-primary hover:text-white transition flex items-center justify-center text-subtle"
                            title="Replay Audio"
                         >
                             <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 12" /><path d="M3 3v9h9" /></svg>
                         </button>
                         <button 
                            onClick={handleRevealWord}
                            className="px-4 py-2 rounded-full bg-surface-highlight border border-error/30 text-error hover:bg-error hover:text-white transition text-xs font-bold uppercase flex items-center gap-2"
                            title="Cost: 1 Life"
                         >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
                            Show Word (-1 Life)
                         </button>
                     </div>
                     
                     <div className="text-3xl font-mono tracking-[0.2em] flex flex-wrap justify-center gap-1">
                         {text.split('').map((char, i) => {
                            if (i < userInput.length) {
                                 const isCorrect = userInput[i] === char;
                                 return (
                                     <span key={i} className={`border-b-2 ${isCorrect ? 'text-ink border-primary' : 'text-error border-error'}`}>
                                         {userInput[i]}
                                     </span>
                                 );
                            }
                            return <span key={i} className="text-subtle opacity-30">?</span>;
                         })}
                     </div>
                </div>
            );
        }
    }

    // Standard render (used for revealed words too)
    return text.split('').map((char, index) => {
      let className = "text-subtle transition-colors duration-75"; 
      
      if (index < userInput.length) {
        if (userInput[index] === char) {
          className = "text-ink";
        } else {
          className = "text-error bg-error/10 rounded-sm";
        }
      }
      const isCurrent = index === userInput.length;
      return (
        <span 
            key={index} 
            data-active={isCurrent}
            className={`relative ${className} ${isCurrent ? 'border-l-2 border-primary animate-pulse' : ''}`}
        >
          {char}
        </span>
      );
    });
  };

  const wordsForNextCombo = 5;
  const currentWordProgress = engineState.stats.wordsCompleted % wordsForNextCombo;
  const progressPercentage = (currentWordProgress / wordsForNextCombo) * 100;
  
  const colorIndex = Math.min(engineState.stats.combo, PROGRESS_COLORS.length - 1);
  const currentColorClass = PROGRESS_COLORS[colorIndex];
  
  const getNextComboColor = () => {
     if (colorIndex <= 1) return 'text-primary';
     if (colorIndex <= 3) return 'text-yellow-600';
     return 'text-red-600';
  };

  // --- MAIN RENDER ---

  return (
    <div className="min-h-screen font-sans flex flex-col overflow-hidden relative bg-surface text-ink transition-colors duration-300">
      <style>
        {`
          @keyframes popUp {
            0% { transform: scale(0.5) translateY(20px); opacity: 0; }
            50% { transform: scale(1.1) translateY(-10px); opacity: 1; }
            100% { transform: scale(1) translateY(0); opacity: 1; }
          }
          @keyframes shimmer {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
          }
          .animate-pop { animation: popUp 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; }
          .animate-shimmer { animation: shimmer 2s infinite linear; }
        `}
      </style>

      {/* Header */}
      <header className={`p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 w-full mx-auto z-10 transition-all duration-500 ${isFullScreen ? 'max-w-[95vw]' : 'max-w-7xl'}`}>
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => tutor.reset()}>
          <div className="w-8 h-8 rounded bg-primary flex items-center justify-center text-white font-mono font-bold shadow-lg shadow-primary/20">Tp</div>
          <span className="font-bold text-xl tracking-tight">TpMaster AI+</span>
        </div>
        
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
             {/* Mode Selector */}
             <div>
                 <ModeSelector 
                    currentConfig={engineState.config} 
                    onSelect={tutor.setConfig.bind(tutor)} 
                    ttsMode={ttsMode}
                    onTtsChange={setTtsMode}
                 />
             </div>

             {/* Tools: Fullscreen & Theme */}
             <div className="flex gap-2">
                 {/* Fullscreen Toggle */}
                 <button 
                    onClick={toggleFullScreen}
                    className="p-1.5 rounded-full bg-surface-highlight hover:bg-subtle/20 text-subtle hover:text-ink transition"
                    title="Toggle Fullscreen"
                 >
                     {isFullScreen ? (
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3"/></svg>
                     ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/></svg>
                     )}
                 </button>

                 {/* Theme Switcher */}
                 <div className="flex gap-1 bg-surface-highlight p-1 rounded-full h-fit self-center">
                    {(['light', 'dark', 'matrix', 'sunset', 'ocean', 'cyberpunk', 'coffee'] as ThemeName[]).map(t => (
                        <button 
                            key={t}
                            onClick={() => setTheme(t)}
                            className={`w-4 h-4 rounded-full transition-transform hover:scale-110 ${theme === t ? 'ring-2 ring-primary scale-110' : 'opacity-50 hover:opacity-100'}`}
                            style={{ backgroundColor: THEMES[t]['--color-paper'] as string }}
                            title={t}
                        />
                    ))}
                 </div>
             </div>
        </div>
      </header>
      
      {/* ... Rest of Main Content ... */}
      <main className={`flex-1 flex flex-col items-center justify-center p-4 relative w-full mx-auto transition-all duration-500 ${isFullScreen ? 'max-w-[95vw]' : 'max-w-5xl'}`}>
        
        {engineState.status === 'finished' ? (
          // RESULTS SCREEN
          <div className="w-full max-w-2xl bg-paper p-8 rounded-2xl shadow-card border border-surface-highlight text-center animate-pop">
            <div className="text-subtle font-medium mb-4 uppercase tracking-widest text-sm">Session Complete</div>
            
            {engineState.config.mode === 'challenge' ? (
                // Challenge Results
                <div className="flex justify-center items-end gap-2 mb-8">
                    <span className="text-7xl font-black text-primary leading-none">{engineState.challengeWordCount}</span>
                    <span className="text-2xl font-bold text-subtle mb-2">Points</span>
                </div>
            ) : (
                // Standard Results
                <div className="flex flex-col items-center gap-4 mb-8">
                    <div className="flex justify-center items-end gap-2">
                       <span className="text-7xl font-black text-primary leading-none">{(engineState.stats.combo * 10) - engineState.stats.incorrectChars}</span>
                       <span className="text-2xl font-bold text-subtle mb-2">Score</span>
                    </div>
                    {/* Formula Display */}
                    <div className="text-xs font-mono text-subtle/60 -mt-2 mb-2">
                        (Max Combo × 10) - Error Keystrokes
                    </div>
                    <div className="text-center text-subtle">
                        <span className="font-bold text-ink text-xl">{engineState.stats.wpm}</span> <span className="text-xs font-bold uppercase">WPM</span>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-surface p-4 rounded-xl">
                    <div className="text-3xl font-bold text-ink">{engineState.stats.accuracy}%</div>
                    <div className="text-xs font-bold uppercase text-subtle">Accuracy</div>
                </div>
                 <div className="bg-surface p-4 rounded-xl">
                    <div className="text-3xl font-bold text-ink">{engineState.stats.combo}</div>
                    <div className="text-xs font-bold uppercase text-subtle">Best Combo</div>
                </div>
                <div className="bg-surface p-4 rounded-xl">
                    <div className="text-3xl font-bold text-error">{engineState.stats.incorrectChars}</div>
                    <div className="text-xs font-bold uppercase text-subtle">Error Keystrokes</div>
                </div>
                <div className="bg-surface p-4 rounded-xl">
                   <div className="text-3xl font-bold text-ink">
                     {engineState.config.mode === 'words' ? formatTime(engineState.elapsedTime) : engineState.stats.wordsCompleted}
                   </div>
                   <div className="text-xs font-bold uppercase text-subtle">
                     {engineState.config.mode === 'words' ? 'Time Taken' : 'Words'}
                   </div>
                </div>
            </div>

            <div className="flex gap-4 justify-center">
                <button 
                  onClick={() => tutor.reset()} 
                  className="px-8 py-3 rounded-lg font-bold transition shadow-lg bg-primary text-white hover:bg-blue-600"
                >
                    Try Again
                </button>
            </div>
          </div>
        ) : (
          // TYPING INTERFACE
          <div className={`w-full flex flex-col gap-6 animate-in fade-in duration-500 ${isFullScreen ? 'max-w-[1400px]' : 'max-w-4xl'}`}>
              
              {/* Stats Header */}
              <div className="flex justify-between items-end px-2">
                  <div className={`text-4xl font-bold transition-all ${showCombo ? 'scale-125 text-primary' : 'text-subtle'}`}>
                     {engineState.config.mode === 'time' ? engineState.timeLeft.toFixed(0) : formatTime(engineState.elapsedTime)}
                     <span className="text-sm font-medium text-subtle ml-1">{engineState.config.mode === 'time' ? 's' : 'elapsed'}</span>
                  </div>
                  
                  <div className="flex gap-4 md:gap-8 text-xl font-medium text-subtle">
                      {engineState.config.mode === 'challenge' ? (
                          <>
                              <div className="flex flex-col items-center">
                                  <span className="text-xs font-bold uppercase text-subtle">Score</span>
                                  <span className="text-ink text-2xl">{engineState.challengeWordCount}</span>
                              </div>
                              {/* Show lives for ALL challenge types now */}
                              <div className="flex flex-col items-center">
                                  <span className="text-xs font-bold uppercase text-error">Lives</span>
                                  <div className="flex gap-1 text-error">
                                      {Array.from({length: Math.max(0, engineState.challengeLives)}).map((_, i) => (
                                          <svg key={i} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
                                      ))}
                                  </div>
                              </div>
                          </>
                      ) : (
                          <>
                              <div className="flex flex-col items-center transition-all duration-300">
                                   <span className={`text-xs font-bold uppercase ${engineState.stats.combo > 0 ? getNextComboColor() : 'text-subtle'}`}>Combo</span>
                                   <span className={`transition-colors duration-300 ${engineState.stats.combo > 0 ? currentColorClass.split(' ')[1].replace('to-', 'text-') : 'text-subtle/50'}`}>
                                       {engineState.stats.combo > 0 ? `x${engineState.stats.combo}` : '-'}
                                   </span>
                              </div>
                              <div className="flex flex-col items-center">
                                   <span className="text-xs font-bold uppercase">Accuracy</span>
                                   <span className={engineState.stats.accuracy < 95 ? 'text-error' : 'text-ink'}>{engineState.stats.accuracy}%</span>
                              </div>
                          </>
                      )}
                  </div>
              </div>

              {/* IELTS Prompt Box */}
              {engineState.config.mode === 'ielts' && engineState.ieltsPrompt && (
                  <div className="bg-surface-highlight/30 p-4 rounded-xl border border-surface-highlight">
                      <div className="flex justify-between items-center mb-1">
                          <div className="flex items-center gap-2">
                              <div className="text-primary opacity-80">
                                  <ChartIcon category={engineState.config.ieltsCategory || 'All'} />
                              </div>
                              <div>
                                  <div className="text-xs font-bold uppercase text-subtle tracking-wider">IELTS Writing Task 2</div>
                                  <div className="text-xs font-bold text-primary">{engineState.config.ieltsCategory || 'All'}</div>
                              </div>
                          </div>
                      </div>
                      <div className="text-xl md:text-2xl font-medium text-ink leading-relaxed mt-4 font-serif">{engineState.ieltsPrompt}</div>
                  </div>
              )}

              {/* Main Typing Area */}
              <div 
                className="relative group outline-none" 
                onClick={() => !engineState.isWaitingForAudio && inputRef.current?.focus()}
              >
                   {/* Progress Bars */}
                   {engineState.config.mode === 'challenge' ? (
                       // Countdown Bar for Challenge (Red shrinking)
                       // If waiting for audio, bar is full. If listening mode, hide bar entirely.
                       engineState.config.challengeType !== 'listening' && (
                           <div className="absolute -top-3 left-0 w-full h-1.5 bg-surface-highlight rounded-full overflow-hidden">
                               <div 
                                  className={`h-full bg-error transition-all duration-100 ease-linear`}
                                  style={{ width: `${engineState.isWaitingForAudio ? 100 : (engineState.challengeTimer / 5) * 100}%` }}
                               ></div>
                           </div>
                       )
                   ) : (
                       // Combo Bar
                       <div className="absolute -top-3 left-0 w-full h-1.5 bg-surface-highlight rounded-full overflow-hidden">
                           <div 
                              className={`h-full bg-gradient-to-r ${currentColorClass} transition-all duration-300 relative`}
                              style={{ width: `${progressPercentage}%` }}
                           >
                              <div className="absolute inset-0 bg-white/30 animate-shimmer"></div>
                           </div>
                       </div>
                   )}

                   <div 
                     className={`bg-paper p-8 rounded-xl shadow-card border border-surface-highlight min-h-[160px] overflow-y-auto text-xl md:text-2xl leading-relaxed font-mono break-words cursor-text relative scroll-smooth ${engineState.config.mode === 'challenge' ? 'flex items-center justify-center text-4xl py-12' : 'max-h-[50vh]'}`}
                     ref={textContainerRef}
                   >
                      {renderText()}
                   </div>
                   
                   {/* Hidden Input */}
                   <input 
                      key={engineState.status + engineState.text} // Remount on text change for challenge mode to clear internal cursor state
                      ref={inputRef}
                      type="text" 
                      className="opacity-0 absolute top-0 left-0 w-0 h-0 pointer-events-none" 
                      value={engineState.userInput}
                      onChange={(e) => tutor.handleInput(e.target.value)}
                      autoFocus={!engineState.isWaitingForAudio}
                      disabled={engineState.isWaitingForAudio}
                      autoComplete="off"
                      autoCorrect="off"
                      autoCapitalize="off"
                      spellCheck="false"
                   />
              </div>

              <div className="flex justify-center mt-4">
                  <button 
                     onClick={() => tutor.reset()} 
                     className="text-subtle hover:text-ink transition p-2 rounded-full hover:bg-surface-highlight"
                     title="Restart Test (ESC)"
                  >
                     <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 12" /><path d="M3 3v9h9" /></svg>
                  </button>
              </div>
          </div>
        )}

        {/* History Section (Bottom) */}
        {consent && (
           <div className={`w-full mt-16 pt-8 border-t border-surface-highlight animate-in fade-in slide-in-from-bottom-8 duration-700 ${isFullScreen ? 'max-w-[1400px]' : 'max-w-4xl'}`}>
               <h3 className="text-sm font-bold uppercase text-subtle mb-4 tracking-widest">Personal Best Records</h3>
               <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
                   <HistoryCard label="Time 30s" record={history['time-30']} mode="time" />
                   <HistoryCard label="Time 1m" record={history['time-60']} mode="time" />
                   <HistoryCard label="Challenge Spd" record={history['challenge-typing']} mode="challenge" />
                   <HistoryCard label="Challenge List" record={history['challenge-listening']} mode="challenge" />
                   <HistoryCard label="Words 50" record={history['words-50']} mode="words" />
                   <HistoryCard label="Words 100" record={history['words-100']} mode="words" />
                   <HistoryCard label="IELTS Task 2" record={history['ielts']} mode="ielts" />
               </div>
           </div>
        )}
      </main>

      {/* Cookie/Local Storage Consent Banner */}
      {consent === null && (
        <ConsentBanner onAccept={handleAcceptConsent} onDecline={handleDeclineConsent} />
      )}

      <footer className="p-4 text-center text-xs font-bold text-subtle uppercase tracking-widest opacity-50">
         TpMaster AI+ v2.0
      </footer>
    </div>
  );
}
