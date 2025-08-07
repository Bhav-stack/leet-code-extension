"use client"

import React, { useState } from 'react';
import { FloatingUI, ExtensionPopup } from './LeetCodeExtension';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function ExtensionDemo() {
  const [showFloatingUI, setShowFloatingUI] = useState(true);
  const [content, setContent] = useState('');
  const [contentType, setContentType] = useState<'info' | 'success' | 'warning' | 'error'>('info');
  const [isLoading, setIsLoading] = useState(false);

  const handleGetHint = () => {
    setIsLoading(true);
    setContent('');
    
    setTimeout(() => {
      setContent(`💡 Hint for "Two Sum":

Consider using a hash map to store complements as you iterate through the array.

The key insight is that for each number, you need to check if its complement (target - current number) exists in the hash map.

Try to implement this approach step by step!`);
      setContentType('success');
      setIsLoading(false);
    }, 2000);
  };

  const handleGetSolution = () => {
    setIsLoading(true);
    setContent('');
    
    setTimeout(() => {
      setContent(`🔧 Solution for "Two Sum":

**Step 1: Understand the problem**
- Find two numbers that add up to target
- Return their indices

**Step 2: Hash Map Approach**
\`\`\`python
def twoSum(nums, target):
    hashmap = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in hashmap:
            return [hashmap[complement], i]
        hashmap[num] = i
    return []
\`\`\`

**Time Complexity:** O(n)
**Space Complexity:** O(n)

**Key Insight:** Use hash map for O(1) lookups!`);
      setContentType('success');
      setIsLoading(false);
    }, 2000);
  };

  const handleClose = () => {
    setShowFloatingUI(false);
  };

  const resetDemo = () => {
    setShowFloatingUI(true);
    setContent('');
    setContentType('info');
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-center">
              🧠 LeetSolveAI Extension Demo
            </CardTitle>
            <p className="text-center text-gray-600 text-lg">
              AI-powered Chrome extension for LeetCode problem assistance
            </p>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center gap-4 mb-8">
              <Button onClick={resetDemo} variant="outline">
                Reset Demo
              </Button>
              <Button 
                onClick={() => setShowFloatingUI(!showFloatingUI)}
                variant="outline"
              >
                {showFloatingUI ? 'Hide' : 'Show'} Floating UI
              </Button>
            </div>
            
            {/* Debug Info */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-sm">
              <h4 className="font-semibold text-yellow-800 mb-2">🔧 Debug Information:</h4>
              <ul className="text-yellow-700 space-y-1">
                <li>• If the extension isn't working, open Chrome DevTools (F12) on LeetCode</li>
                <li>• Look for "[LeetSolveAI]" messages in the console</li>
                <li>• Try typing <code className="bg-yellow-200 px-1 rounded">leetSolveAITest()</code> in console</li>
                <li>• Make sure you're on a problem page like: leetcode.com/problems/two-sum/</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Extension Popup Preview */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Extension Popup</h3>
            <p className="text-gray-600 text-sm">
              This is what users see when they click the extension icon in Chrome toolbar
            </p>
            <div className="flex justify-center">
              <ExtensionPopup />
            </div>
          </div>

          {/* Floating UI Preview */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Floating UI on LeetCode</h3>
            <p className="text-gray-600 text-sm">
              This appears automatically when users visit a LeetCode problem page
            </p>
            <div className="relative min-h-96 bg-white rounded-lg border-2 border-dashed border-gray-300 p-4 overflow-hidden">
              <div className="text-center text-gray-500 text-sm mb-4">
                Simulated LeetCode Problem Page
              </div>
              
              <FloatingUI
                problemTitle="Two Sum"
                onGetHint={handleGetHint}
                onGetSolution={handleGetSolution}
                onClose={handleClose}
                content={content}
                contentType={contentType}
                isLoading={isLoading}
                visible={showFloatingUI}
              />
            </div>
          </div>
        </div>

        {/* Troubleshooting Guide */}
        <Card>
          <CardHeader>
            <CardTitle>🚨 Troubleshooting Guide</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-red-900 mb-2">❌ Extension Not Working?</h4>
                <ul className="text-sm text-red-700 space-y-1">
                  <li>1. Check Chrome Extensions page for errors</li>
                  <li>2. Ensure you're on a LeetCode problem page</li>
                  <li>3. Refresh the page and wait 2-3 seconds</li>
                  <li>4. Check browser console for error messages</li>
                  <li>5. Try reloading the extension</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-green-900 mb-2">✅ Should Work If:</h4>
                <ul className="text-sm text-green-700 space-y-1">
                  <li>• Extension loaded without errors</li>
                  <li>• On URL: leetcode.com/problems/[problem-name]/</li>
                  <li>• Console shows "[LeetSolveAI]" messages</li>
                  <li>• Dev server running on port 9002</li>
                  <li>• Floating UI appears in top-right corner</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Features List */}
        <Card>
          <CardHeader>
            <CardTitle>✨ Key Features</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-semibold text-blue-900">🎯 Auto Detection</h4>
                <p className="text-sm text-blue-700">Automatically detects LeetCode problems</p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <h4 className="font-semibold text-green-900">💡 Smart Hints</h4>
                <p className="text-sm text-green-700">AI-powered contextual guidance</p>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg">
                <h4 className="font-semibold text-purple-900">🔧 Complete Solutions</h4>
                <p className="text-sm text-purple-700">Full explanations with code</p>
              </div>
              <div className="p-4 bg-orange-50 rounded-lg">
                <h4 className="font-semibold text-orange-900">🎛️ Easy Toggle</h4>
                <p className="text-sm text-orange-700">Simple on/off control</p>
              </div>
              <div className="p-4 bg-indigo-50 rounded-lg">
                <h4 className="font-semibold text-indigo-900">🎨 Modern UI</h4>
                <p className="text-sm text-indigo-700">Clean, professional interface</p>
              </div>
              <div className="p-4 bg-red-50 rounded-lg">
                <h4 className="font-semibold text-red-900">⚡ Real-time</h4>
                <p className="text-sm text-red-700">Works with SPA navigation</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}