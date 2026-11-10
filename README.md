# 🌱 Focus Garden

A study timer that grows a small garden while you focus. I built it because I wanted something to use while studying that felt encouraging instead of naggy.

## How it works

Start a session and a sprout grows on screen. Stay focused for 15 minutes and it reaches the Growing stage. At 45 minutes it blooms into a flower. Every day you finish a session adds a plant to your garden shelf, so your history becomes something you can look at, not just a number.

## Features

**Focus**
- Timer based on real timestamps, so it stays accurate even when the browser throttles background tabs
- Two modes: **Strict** pauses if you leave the tab, **Flexible** lets you check notes or a PDF and just counts the switches
- Spacebar starts and pauses; the running time also shows in the browser tab title
- Time is auto-saved if you close or reload the page mid-session

**Progress**
- Daily goal with a live progress bar and a banner when you reach it
- Streak tracking that resets properly when you miss a day, plus your longest streak
- Garden shelf showing your last 14 days as plants that grow with how long you focused
- History panel with per-day minutes and your best day

**Unlockable tools**
- **Notepad** unlocks after one uninterrupted hour of focus. It has color choices, a word count, and autosave
- **Calculator** unlocks after a 10-day streak, with keyboard support
- Tools unlock in sequence and stay unlocked

**Personal touches**
- Asks your name and uses it in messages and your history
- Soft generated sounds (Web Audio API) for starting, pausing, blooming, and unlocking, with no audio files

## Design decisions

- **Why two modes?** Strict-only tools punish normal behavior, like opening a PDF of your notes. Flexible mode trusts you and just keeps count.
- **Why one continuous hour for the Notepad?** Accumulated time can be gamed with tiny sessions. One uninterrupted stretch means something.
- **Why no backend?** Everything lives in `localStorage`, so there's nothing to install, no account, and your data stays on your device.

## Tech

Plain HTML, CSS, and JavaScript with no frameworks or build step. I wanted to understand every piece of it rather than hide it behind a framework.

## Run it

Clone the repo and open `index.html` in a browser.

## Roadmap

- Weather and time-of-day sync so the garden matches the real world
- More unlockable tools as streaks grow
- A backend so your garden can follow you across devices

## What I learned

- Debugging state that lives in more than one place (the screen, memory, and `localStorage`) and keeping them in sync
- Working with dates and streak logic
- Drawing with SVG and animating it with CSS
- Reading my own code carefully enough to find bugs before they find me