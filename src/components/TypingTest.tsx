"use client";

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { generateWords } from '@/lib/words';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { soundManager } from '@/lib/sounds';

interface TypingStats {
  wpm: number;
  accuracy: number;
  errors: number;
  charactersTyped: number;
  timeElapsed: number;
}

interface TypingTestProps {
  timeLimit: number;
  onComplete: (stats: TypingStats) => void;
}

export default function TypingTest({ timeLimit, onComplete }: TypingTestProps) {
  const [words, setWords] = useState<string[]>([]);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentCharIndex, setCurrentCharIndex] = useState(0);
  const [input, setInput] = useState('');
  const [isStarted, setIsStarted] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [timeLeft, setTimeLeft] = useState(timeLimit);
  const [errors, setErrors] = useState(0);
  const [charactersTyped, setCharactersTyped] = useState(0);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [typedWords, setTypedWords] = useState<string[]>([]);

  const inputRef = useRef<HTMLInputElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize words
  useEffect(() => {
    const newWords = generateWords(200);
    setWords(newWords);
    setTypedWords(new Array(newWords.length).fill(''));
  }, []);

  const calculateWPM = useCallback(() => {
    if (!startTime) return 0;
    const timeElapsedMinutes = (Date.now() - startTime) / 60000;
    const wordsTyped = typedWords.filter(word => word.length > 0).length;
    return Math.round(wordsTyped / timeElapsedMinutes);
  }, [startTime, typedWords]);

  const calculateAccuracy = useCallback(() => {
    if (charactersTyped === 0) return 100;
    return Math.round(((charactersTyped - errors) / charactersTyped) * 100);
  }, [charactersTyped, errors]);

  const finishTest = useCallback(() => {
    setIsFinished(true);
    soundManager.testComplete();
    const stats: TypingStats = {
      wpm: calculateWPM(),
      accuracy: calculateAccuracy(),
      errors,
      charactersTyped,
      timeElapsed: timeLimit - timeLeft
    };
    onComplete(stats);
  }, [calculateWPM, calculateAccuracy, errors, charactersTyped, timeLimit, timeLeft, onComplete]);

  // Timer
  useEffect(() => {
    if (isStarted && !isFinished && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            finishTest();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isStarted, isFinished, timeLeft, finishTest]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        e.preventDefault();
        if (e.shiftKey) {
          // Tab + Shift for settings (future enhancement)
        } else {
          // Tab to restart
          restart();
        }
      }
      if (e.key === 'Escape') {
        inputRef.current?.blur();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Click anywhere to focus
  useEffect(() => {
    const handleClick = () => {
      if (!isFinished) {
        inputRef.current?.focus();
      }
    };

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [isFinished]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    if (!isStarted) {
      setIsStarted(true);
      setStartTime(Date.now());
    }

    setInput(value);
    setCharactersTyped(prev => prev + 1);

    const currentWord = words[currentWordIndex];

    if (value.endsWith(' ')) {
      // Word completed
      const typedWord = value.trim();
      const newTypedWords = [...typedWords];
      newTypedWords[currentWordIndex] = typedWord;
      setTypedWords(newTypedWords);

      if (typedWord !== currentWord) {
        setErrors(prev => prev + Math.abs(typedWord.length - currentWord.length));
      }

      setInput('');
      setCurrentWordIndex(prev => prev + 1);
      setCurrentCharIndex(0);
    } else {
      // Check current character
      const currentChar = value[value.length - 1];
      const expectedChar = currentWord[value.length - 1];

      if (currentChar !== expectedChar) {
        setErrors(prev => prev + 1);
        soundManager.keyError();
      } else {
        soundManager.keyPress();
      }

      setCurrentCharIndex(value.length);
    }
  };

  const restart = () => {
    setWords(generateWords(200));
    setCurrentWordIndex(0);
    setCurrentCharIndex(0);
    setInput('');
    setIsStarted(false);
    setIsFinished(false);
    setTimeLeft(timeLimit);
    setErrors(0);
    setCharactersTyped(0);
    setStartTime(null);
    setTypedWords(new Array(200).fill(''));
    inputRef.current?.focus();
  };

  const renderWord = (word: string, wordIndex: number) => {
    const isCurrentWord = wordIndex === currentWordIndex;
    const isTyped = typedWords[wordIndex] !== '';
    const typedWord = typedWords[wordIndex];

    if (wordIndex < currentWordIndex) {
      // Already typed word
      const isCorrect = typedWord === word;
      return (
        <span
          key={wordIndex}
          className={`${isCorrect ? 'text-green-500' : 'text-red-500'} mr-2`}
        >
          {word}
        </span>
      );
    } else if (isCurrentWord) {
      // Currently typing word
      return (
        <span key={wordIndex} className="mr-2 bg-yellow-500/20 px-1 rounded">
          {word.split('').map((char, charIndex) => {
            let className = '';
            if (charIndex < currentCharIndex) {
              const typedChar = input[charIndex];
              className = typedChar === char ? 'text-green-500' : 'text-red-500 bg-red-500/20';
            } else if (charIndex === currentCharIndex) {
              className = 'bg-blue-500 text-white animate-pulse';
            }

            return (
              <span key={charIndex} className={className}>
                {char}
              </span>
            );
          })}
        </span>
      );
    } else {
      // Future word
      return (
        <span key={wordIndex} className="text-gray-400 mr-2">
          {word}
        </span>
      );
    }
  };

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  if (isFinished) {
    return null; // Results will be handled by parent component
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-4xl mx-auto space-y-6"
    >
      {/* Stats Display */}
      <div className="flex justify-center gap-8 text-sm">
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-500">{timeLeft}s</div>
          <div className="text-gray-500">Time</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-500">{calculateWPM()}</div>
          <div className="text-gray-500">WPM</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-yellow-500">{calculateAccuracy()}%</div>
          <div className="text-gray-500">Accuracy</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-red-500">{errors}</div>
          <div className="text-gray-500">Errors</div>
        </div>
      </div>

      {/* Typing Area */}
      <Card className="p-8">
        <div className="text-2xl leading-relaxed font-mono mb-6 h-32 overflow-hidden">
          {words.slice(currentWordIndex, currentWordIndex + 15).map((word, index) =>
            renderWord(word, currentWordIndex + index)
          )}
        </div>

        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={handleInputChange}
          disabled={isFinished}
          className="w-full p-4 text-xl border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 bg-transparent"
          placeholder={!isStarted ? "Start typing to begin the test..." : ""}
          autoComplete="off"
          autoCapitalize="off"
          autoCorrect="off"
          spellCheck="false"
        />
      </Card>

      {/* Restart Button */}
      <div className="flex justify-center">
        <Button onClick={restart} variant="outline">
          Restart Test
        </Button>
      </div>
    </motion.div>
  );
}
