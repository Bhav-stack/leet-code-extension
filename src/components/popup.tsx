"use client"

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';

declare global {
  interface Window {
    chrome: any;
  }
}

export default function PopupComponent() {
  const [isEnabled, setIsEnabled] = useState(true);
  const [currentProblem, setCurrentProblem] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load initial state
    if (typeof window !== 'undefined' && window.chrome?.storage) {
      window.chrome.storage.local.get('hintFeatureEnabled', (data: any) => {
        setIsEnabled(data.hintFeatureEnabled !== false);
        setIsLoading(false);
      });

      // Get current tab info
      window.chrome.tabs.query({ active: true, currentWindow: true }, (tabs: any[]) => {
        const currentTab = tabs[0];
        if (currentTab?.url?.includes('leetcode.com/problems/')) {
          const urlParts = currentTab.url.split('/');
          const problemSlug = urlParts[urlParts.length - 2] || urlParts[urlParts.length - 1];
          setCurrentProblem(problemSlug);
        }
      });
    } else {
      setIsLoading(false);
    }
  }, []);

  const handleToggle = (checked: boolean) => {
    setIsEnabled(checked);
    if (typeof window !== 'undefined' && window.chrome?.storage) {
      window.chrome.storage.local.set({ hintFeatureEnabled: checked });
      
      // Send message to background script
      window.chrome.runtime.sendMessage({
        action: 'toggleFeatureState',
        enabled: checked
      });
    }
  };

  const openLeetCode = () => {
    if (typeof window !== 'undefined' && window.chrome?.tabs) {
      window.chrome.tabs.create({ url: 'https://leetcode.com/problemset/' });
    }
  };

  const openSettings = () => {
    if (typeof window !== 'undefined' && window.chrome?.runtime) {
      window.chrome.runtime.openOptionsPage();
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
    <div className="w-80 bg-[#F0F2F5]">
      <Card className="border-0 shadow-lg">
        <CardHeader className="bg-[#3F51B5] text-white rounded-t-lg">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg font-semibold">🧠 LeetSolveAI</CardTitle>
              <CardDescription className="text-blue-100 text-sm">
                AI-powered coding assistant
              </CardDescription>
            </div>
            <Badge 
              variant={isEnabled ? "default" : "secondary"}
              className={isEnabled ? "bg-[#FF9800] hover:bg-[#F57C00]" : ""}
            >
              {isEnabled ? "Active" : "Disabled"}
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent className="p-6 space-y-6">
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
            <Switch
              checked={isEnabled}
              onCheckedChange={handleToggle}
              className="data-[state=checked]:bg-[#3F51B5]"
            />
          </div>

          {/* Current Problem Status */}
          {currentProblem && (
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
                Visit the problem page to get AI assistance
              </p>
            </div>
          )}

          {!currentProblem && (
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
              className="w-full bg-[#FF9800] hover:bg-[#F57C00] text-white"
              size="sm"
            >
              Open LeetCode
            </Button>
            
            <div className="grid grid-cols-2 gap-2">
              <Button 
                variant="outline" 
                size="sm"
                className="text-xs"
                onClick={() => {
                  if (typeof window !== 'undefined' && window.chrome?.tabs) {
                    window.chrome.tabs.create({ 
                      url: 'https://github.com/your-repo/leetsolveai' 
                    });
                  }
                }}
              >
                GitHub
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                className="text-xs"
                onClick={() => {
                  if (typeof window !== 'undefined' && window.chrome?.tabs) {
                    window.chrome.tabs.create({ 
                      url: 'https://your-website.com/help' 
                    });
                  }
                }}
              >
                Help
              </Button>
            </div>
          </div>

          {/* Usage Instructions */}
          <div className="text-xs text-gray-600 space-y-1">
            <p className="font-medium">How to use:</p>
            <ul className="space-y-1 ml-2">
              <li>• Navigate to any LeetCode problem</li>
              <li>• Click "Get Hint" for guidance</li>
              <li>• Click "Get Solution" for full answer</li>
              <li>• Toggle feature on/off as needed</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}