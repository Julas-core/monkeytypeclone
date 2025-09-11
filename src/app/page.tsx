"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import TypingTest from '@/components/TypingTest';
import Results from '@/components/Results';
import Settings from '@/components/Settings';
import { useTheme } from '@/components/ThemeProvider';
import { Button } from '@/components/ui/button';

interface TypingStats {
  wpm: number;
  accuracy: number;
  errors: number;
  charactersTyped: number;
  timeElapsed: number;
}

export default function Home() {
  const [showResults, setShowResults] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [results, setResults] = useState<TypingStats | null>(null);
  const [timeLimit, setTimeLimit] = useState(60);
  const [testKey, setTestKey] = useState(0);

  const { theme, toggleTheme } = useTheme();

  const handleTestComplete = (stats: TypingStats) => {
    setResults(stats);
    setShowResults(true);
  };

  const handleRestart = () => {
    setShowResults(false);
    setResults(null);
    setTestKey(prev => prev + 1); // Force component remount
  };

  const handleTimeLimitChange = (newTimeLimit: number) => {
    setTimeLimit(newTimeLimit);
    setTestKey(prev => prev + 1); // Restart test with new time
  };

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors">
      {/* Header */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="container mx-auto px-4 py-6 flex items-center justify-between"
      >
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="flex items-center space-x-2"
        >
          <h1 className="text-3xl font-bold text-blue-500">TypeSpeed</h1>
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
        </motion.div>

        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleTheme}
            className="text-lg"
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowSettings(true)}
          >
            ⚙️ Settings
          </Button>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          {showResults && results ? (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Results
                stats={results}
                onRestart={handleRestart}
                timeLimit={timeLimit}
              />
            </motion.div>
          ) : (
            <motion.div
              key={`typing-test-${testKey}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <TypingTest
                timeLimit={timeLimit}
                onComplete={handleTestComplete}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Instructions */}
        {!showResults && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-12 text-center space-y-4"
          >
            <p className="text-gray-500 text-sm">
              Click on the input field and start typing to begin the test
            </p>
            <div className="flex justify-center gap-8 text-xs text-gray-400">
              <span>⏱️ {timeLimit} seconds</span>
              <span>📊 Live WPM tracking</span>
              <span>🎯 Accuracy monitoring</span>
              <span>⌨️ Error detection</span>
            </div>
          </motion.div>
        )}
      </main>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="mt-16 pb-8 text-center text-sm text-gray-400"
      >
        <p>Built with Next.js, TailwindCSS, and Framer Motion</p>
        <p className="mt-2">Press Tab + Enter to restart • Click anywhere to focus</p>
      </motion.footer>

      {/* Settings Modal */}
      <AnimatePresence>
        {showSettings && (
          <Settings
            timeLimit={timeLimit}
            onTimeLimitChange={handleTimeLimitChange}
            isDarkMode={theme === 'dark'}
            onThemeToggle={toggleTheme}
            onClose={() => setShowSettings(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
