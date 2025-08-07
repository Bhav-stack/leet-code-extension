"use client"

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

// Utility functions for LeetCode detection
export const LeetCodeUtils = {
  getProblemSlug: (url: string = window.location?.href || '') => {
    if (url.startsWith('https://leetcode.com/problems/')) {
      const parts = url.split('/');
      return parts[4] || null;
    }
    return null;
  },

  getProblemTitle: () => {
    const titleSelectors = [
      '[data-cy="question-title"]',
      '.text-title-large',
      '.css-v3d350',
      'h1',
      '.question-title'
    ];
    
    for (const selector of titleSelectors) {
      const element = document.querySelector(selector);
      if (element && element.textContent?.trim()) {
        return element.textContent.trim();
      }
    }
    return 'Unknown Problem';
  },

  isOnProblemPage: (url: string = window.location?.href || '') => {
    return url.includes('leetcode.com/problems/') && LeetCodeUtils.getProblemSlug(url) !== null;
  }
};

// Floating UI Component
interface FloatingUIProps {
  problemTitle?: string;
  onGetHint?: () => void;
  onGetSolution?: () => void;
  onClose?: () => void;
  content?: string;
  contentType?: 'info' | 'success' | 'warning' | 'error';
  isLoading?: boolean;
  visible?: boolean;
}

export function FloatingUI({ 
  problemTitle = "Two Sum",
  onGetHint,
  onGetSolution,
  onClose,
  content,
  contentType = 'info',
  isLoading = false,
  visible = true
}: FloatingUIProps) {
  if (!visible) return null;

  const typeColors = {
    info: 'border-l-blue-500 bg-blue-50 text-blue-800',
    success: 'border-l-green-500 bg-green-50 text-green-800',
    warning: 'border-l-orange-500 bg-orange-50 text-orange-800',
    error: 'border-l-red-500 bg-red-50 text-red-800'
  };

  return (
    <div className="fixed top-5 right-5 z-[10000] w-80">
      <Card className="shadow-xl border-0">
        <CardHeader className="bg-indigo-600 text-white rounded-t-lg p-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              🧠 LeetSolveAI
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-white hover:bg-indigo-700 h-6 w-6 p-0 text-lg"
            >
              ×
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="p-4">
          <div className={`p-3 border-l-4 rounded mb-4 ${typeColors[contentType]}`}>
            <div className="text-sm whitespace-pre-wrap">
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                  Loading...
                </div>
              ) : (
                content || `🎯 Problem detected: "${problemTitle}"\n\nClick "Get Hint" for guidance or "Get Solution" for the complete answer.`
              )}
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button
              onClick={onGetHint}
              className="flex-1 bg-orange-500 hover:bg-orange-600 text-white"
              disabled={isLoading}
            >
              Get Hint
            </Button>
            <Button
              onClick={onGetSolution}
              className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white"
              disabled={isLoading}
            >
              Get Solution
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Extension Popup Component
export function ExtensionPopup() {
  const [isEnabled, setIsEnabled] = useState(true);
  const [currentProblem, setCurrentProblem] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate Chrome extension behavior
    setIsLoading(false);
    
    // Check if we're on a LeetCode problem page
    if (typeof window !== 'undefined') {
      const problemSlug = LeetCodeUtils.getProblemSlug();
      setCurrentProblem(problemSlug);
    }
  }, []);

  const handleToggle = (checked: boolean) => {
    setIsEnabled(checked);
  };

  const openLeetCode = () => {
    if (typeof window !== 'undefined') {
      window.open('https://leetcode.com/problemset/', '_blank');
    }
  };

  if (isLoading) {
    return (
      <div className="w-80 p-4">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  return (
    <Card className="w-80 shadow-lg border-0">
      <CardHeader className="bg-indigo-600 text-white rounded-t-lg">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-semibold">🧠 LeetSolveAI</CardTitle>
            <p className="text-indigo-100 text-sm">AI-powered coding assistant</p>
          </div>
          <Badge className={isEnabled ? "bg-orange-500 hover:bg-orange-600" : "bg-gray-500"}>
            {isEnabled ? "Active" : "Disabled"}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="p-6 space-y-6 bg-gray-50">
        {/* Feature Toggle */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-900">
              Enable AI Assistance
            </label>
            <p className="text-xs text-gray-500">
              Get hints and solutions for LeetCode problems
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={isEnabled}
              onChange={(e) => handleToggle(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
          </label>
        </div>

        {/* Status */}
        <div className={`text-center py-2 px-3 rounded text-sm ${
          isEnabled ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {isEnabled ? 'AI assistance is enabled' : 'AI assistance is disabled'}
        </div>

        {/* Current Problem */}
        {currentProblem ? (
          <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-blue-900">
                Problem Detected
              </span>
            </div>
            <p className="text-xs text-blue-700 mt-1">
              {currentProblem.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
            </p>
            <p className="text-xs text-blue-600 mt-1">
              Floating UI should appear on the problem page
            </p>
          </div>
        ) : (
          <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
              <span className="text-sm font-medium text-gray-700">
                No Problem Detected
              </span>
            </div>
            <p className="text-xs text-gray-600 mt-1">
              Navigate to a LeetCode problem to get started
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-2">
          <Button 
            onClick={openLeetCode}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white"
          >
            Open LeetCode
          </Button>
          
          <div className="grid grid-cols-2 gap-2">
            <Button 
              variant="outline" 
              size="sm"
              className="text-xs"
              onClick={() => window.open('https://github.com', '_blank')}
            >
              GitHub
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              className="text-xs"
              onClick={() => window.open('https://leetcode.com/support/', '_blank')}
            >
              Help
            </Button>
          </div>
        </div>

        {/* Instructions */}
        <div className="text-xs text-gray-600 space-y-1">
          <p className="font-medium">How to use:</p>
          <ul className="space-y-1 ml-2">
            <li>• Navigate to any LeetCode problem</li>
            <li>• Floating UI appears automatically</li>
            <li>• Click "Get Hint" for guidance</li>
            <li>• Click "Get Solution" for full answer</li>
            <li>• Toggle feature on/off as needed</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}