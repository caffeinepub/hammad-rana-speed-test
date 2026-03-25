# Hammad Rana Speed Test

## Current State
New project with empty backend and default frontend scaffolding.

## Requested Changes (Diff)

### Add
- Urdu typing speed test single-page app
- Title: "حماد رانا رائٹنگ اسپیڈ ٹیسٹنگ"
- Difficulty selector: ایزی / نورمل / ہارڈ (pill toggles)
- Passage display panel (RTL Urdu text)
- Typing textarea (disabled until Start is pressed)
- Live timer (counts up in seconds)
- Live WPM counter (updated every second)
- Start and Reset buttons
- Sample texts per difficulty level
- RTL layout throughout

### Modify
- Replace default App.tsx with the typing test UI

### Remove
- Default placeholder content

## Implementation Plan
1. Replace App.tsx with full typing speed test component
2. Add Urdu font (Noto Nastaliq Urdu or similar) via Google Fonts
3. Implement state: difficulty, isRunning, elapsed, inputText, startTime
4. Timer with setInterval on start, cleared on reset
5. WPM = (words typed / elapsed seconds) * 60
6. Disable textarea before start and after reset
7. Difficulty pills highlight selected, change passage text
8. RTL direction on all Urdu text elements
9. White card layout with blue accent buttons
