# 🌱 Focus Garden

A study timer that grows a little garden the longer you stay focused. Built as a personal project I actually use while studying — not just another Pomodoro clone.

## What it does

Focus Garden turns study sessions into something visual and a little more alive. Start a session, and a small sprout grows on screen. Stay focused long enough, and it blooms into a flower. Stay consistent across days, and you unlock small tools built into the app itself — starting with a notepad, then a calculator.

### Core features

- **Live timer** — tracks your session using real timestamps, so it stays accurate even if the browser tab loses focus in the background
- **Growing plant, powered by SVG** — a hand-drawn-style sprout that grows and eventually blooms into a flower, with a gentle "breathing" glow once it's established
- **Two focus modes**
  - **Strict** — leaving the tab pauses your timer immediately
  - **Flexible** — leaving the tab doesn't punish you (since legitimately checking notes or a PDF shouldn't count against you), but tracks how many times you switched away
- **Continuous-focus unlocks** — the Notepad unlocks only after one genuinely uninterrupted stretch of focus (pausing resets the clock on this specific unlock, so it can't be gamed)
- **Day-streak unlocks** — the Calculator unlocks after a consecutive-day streak of using the app, tracked and calculated from real usage data
- **Persistent progress** — built with `localStorage`, so your garden, unlocks, and stats persist across sessions and days without needing a backend
- **Gentle audio cues** — soft generated tones (via the Web Audio API) mark starting, pausing, blooming, and unlocking — no external sound files

## Why I built it this way

Most focus timers either do nothing interesting visually, or they try to "police" you with aggressive tab-blocking that punishes normal behavior (like checking a PDF of your notes in another tab). I wanted something that felt encouraging rather than naggy — hence the two modes, and the choice to require genuine continuous focus for the big unlock rather than just accumulated time.

## Tech

Plain HTML, CSS, and JavaScript — no frameworks, no build step. Built deliberately this way as a way to actually understand what each piece of the app is doing, rather than relying on a framework to handle it.

- `index.html` — structure
- `style.css` — styling, including the SVG plant/flower and pastel color palette
- `script.js` — timer logic, unlock conditions, `localStorage` persistence, and the Web Audio sound system

## Status

Actively in progress. Currently working on:
- Refining the unlock sequencing and testing tools
- Planning a weather/time-of-day sync so the garden reflects real-world conditions
- More tools to unlock as the streak system grows

## Try it

Clone the repo and open `index.html` in a browser — no build step or dependencies required.
