"use client";

import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { useState } from 'react';
import { soundManager } from '@/lib/sounds';

interface SettingsProps {
  timeLimit: number;
  onTimeLimitChange: (time: number) => void;
  isDarkMode: boolean;
  onThemeToggle: () => void;
  onClose: () => void;
}

export default function Settings({
  timeLimit,
  onTimeLimitChange,
  isDarkMode,
  onThemeToggle,
  onClose
}: SettingsProps) {
  const [customTime, setCustomTime] = useState(timeLimit);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const timeOptions = [15, 30, 60, 120];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md mx-4"
      >
        <Card className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Settings</h2>
            <Button variant="ghost" onClick={onClose} className="text-xl">
              ×
            </Button>
          </div>

          {/* Time Mode Selection */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Test Duration</h3>
            <div className="grid grid-cols-2 gap-2">
              {timeOptions.map((time) => (
                <Button
                  key={time}
                  variant={timeLimit === time ? "default" : "outline"}
                  onClick={() => onTimeLimitChange(time)}
                  className="h-12"
                >
                  {time}s
                </Button>
              ))}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Custom Duration (seconds)</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  min="10"
                  max="600"
                  value={customTime}
                  onChange={(e) => setCustomTime(Number(e.target.value))}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-background"
                />
                <Button
                  onClick={() => onTimeLimitChange(customTime)}
                  variant="outline"
                  disabled={customTime < 10 || customTime > 600}
                >
                  Set
                </Button>
              </div>
            </div>
          </div>

          {/* Theme Toggle */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Appearance</h3>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="font-medium">Dark Mode</div>
                <div className="text-sm text-gray-500">
                  Toggle between light and dark theme
                </div>
              </div>
              <Switch
                checked={isDarkMode}
                onCheckedChange={onThemeToggle}
              />
            </div>
          </div>

          {/* Sound Settings */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Audio</h3>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="font-medium">Sound Effects</div>
                <div className="text-sm text-gray-500">
                  Play sounds for keystrokes and feedback
                </div>
              </div>
              <Switch
                checked={soundEnabled}
                onCheckedChange={(checked) => {
                  setSoundEnabled(checked);
                  if (checked) {
                    soundManager.enable();
                    soundManager.keyPress(); // Test sound
                  } else {
                    soundManager.disable();
                  }
                }}
              />
            </div>
          </div>

          {/* Close Button */}
          <Button onClick={onClose} className="w-full">
            Close Settings
          </Button>
        </Card>
      </motion.div>
    </motion.div>
  );
}
