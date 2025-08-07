# **App Name**: LeetSolveAI

## Core Features:

- Problem Detection: DOM parsing: Automatically detect the LeetCode problem currently being solved based on page URL and display the problem name.
- Hint Generation: AI-Powered Hints: Upon user request, provide a hint about the problem's topic using an AI API to LLM reasoning tool for deciding whether topic or broader context would be most useful. Display the hint in the extension popup.
- Solution Generation: AI-Powered Solution: Upon user request, provide the full solution to the problem using an AI API. Display the solution in a well formatted manner.
- Feature Toggle: Toggle Button: Allow users to easily toggle the hint feature on or off within the extension popup.
- User Tracking: Track user's problem-solving history and progress using Spring Boot at the backend.

## Style Guidelines:

- Primary color: Deep indigo (#3F51B5) to evoke focus and intellect.
- Background color: Light grey (#F0F2F5), almost white, creating a clean coding interface.
- Accent color: A vibrant, contrasting orange (#FF9800) to draw attention to hints, solutions, and the toggle button.
- Body and headline font: 'Inter' (sans-serif) to ensure excellent readability of problem descriptions and solutions.
- Code font: 'Source Code Pro' to provide monospaced presentation of any code snippets.
- Use minimalist icons within the extension for hints, solutions, and settings, maintaining a clutter-free interface.
- Subtle animations for showing hints or solutions; keep animations brief and non-distracting.