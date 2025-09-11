"use client";

import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface TypingStats {
  wpm: number;
  accuracy: number;
  errors: number;
  charactersTyped: number;
  timeElapsed: number;
}

interface ResultsProps {
  stats: TypingStats;
  onRestart: () => void;
  timeLimit: number;
}

export default function Results({ stats, onRestart, timeLimit }: ResultsProps) {
  const getWPMRating = (wpm: number) => {
    if (wpm >= 80) return { rating: "Excellent", color: "text-green-500" };
    if (wpm >= 60) return { rating: "Good", color: "text-blue-500" };
    if (wpm >= 40) return { rating: "Average", color: "text-yellow-500" };
    if (wpm >= 20) return { rating: "Below Average", color: "text-orange-500" };
    return { rating: "Needs Practice", color: "text-red-500" };
  };

  const getAccuracyRating = (accuracy: number) => {
    if (accuracy >= 95) return { rating: "Perfect", color: "text-green-500" };
    if (accuracy >= 90) return { rating: "Excellent", color: "text-blue-500" };
    if (accuracy >= 80) return { rating: "Good", color: "text-yellow-500" };
    if (accuracy >= 70) return { rating: "Fair", color: "text-orange-500" };
    return { rating: "Needs Work", color: "text-red-500" };
  };

  const wpmRating = getWPMRating(stats.wpm);
  const accuracyRating = getAccuracyRating(stats.accuracy);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full max-w-2xl mx-auto"
    >
      <Card className="p-8 text-center space-y-6">
        <motion.h2
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          className="text-3xl font-bold mb-6"
        >
          Test Complete!
        </motion.h2>

        {/* Main Stats */}
        <div className="grid grid-cols-2 gap-6 mb-8">
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="space-y-2"
          >
            <div className="text-4xl font-bold text-blue-500">{stats.wpm}</div>
            <div className="text-sm text-gray-500">Words per Minute</div>
            <div className={`text-sm font-medium ${wpmRating.color}`}>
              {wpmRating.rating}
            </div>
          </motion.div>

          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="space-y-2"
          >
            <div className="text-4xl font-bold text-green-500">{stats.accuracy}%</div>
            <div className="text-sm text-gray-500">Accuracy</div>
            <div className={`text-sm font-medium ${accuracyRating.color}`}>
              {accuracyRating.rating}
            </div>
          </motion.div>
        </div>

        {/* Detailed Stats */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-3 gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
        >
          <div className="text-center">
            <div className="text-xl font-semibold text-red-500">{stats.errors}</div>
            <div className="text-xs text-gray-500">Errors</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-semibold text-purple-500">{stats.charactersTyped}</div>
            <div className="text-xs text-gray-500">Characters</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-semibold text-indigo-500">{timeLimit}s</div>
            <div className="text-xs text-gray-500">Duration</div>
          </div>
        </motion.div>

        {/* Performance Chart */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="space-y-4"
        >
          <h3 className="text-lg font-semibold">Performance Breakdown</h3>

          {/* WPM Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Speed (WPM)</span>
              <span>{stats.wpm}/100</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(stats.wpm, 100)}%` }}
                transition={{ delay: 0.5, duration: 1 }}
                className="bg-blue-500 h-2 rounded-full"
              />
            </div>
          </div>

          {/* Accuracy Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Accuracy</span>
              <span>{stats.accuracy}%</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${stats.accuracy}%` }}
                transition={{ delay: 0.6, duration: 1 }}
                className="bg-green-500 h-2 rounded-full"
              />
            </div>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="flex gap-4 justify-center pt-4"
        >
          <Button onClick={onRestart} size="lg" className="px-8">
            Try Again
          </Button>
          <Button
            variant="outline"
            size="lg"
            onClick={() => {
              navigator.clipboard.writeText(
                `I just typed ${stats.wpm} WPM with ${stats.accuracy}% accuracy! 🚀`
              );
            }}
          >
            Share Result
          </Button>
        </motion.div>
      </Card>
    </motion.div>
  );
}
