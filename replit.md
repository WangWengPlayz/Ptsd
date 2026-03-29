# Mart John F. Labaco — Personal Portfolio

## Overview
A personal portfolio website for Mart John F. Labaco (JM / Mart), a developer from the Philippines. Built with plain HTML, CSS, and JavaScript, served by a lightweight Node.js HTTP server.

## Stack
- **Runtime**: Node.js (built-in `http` module, no npm dependencies)
- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Start command**: `npm start`
- **Port**: `process.env.PORT` (defaults to 5000)

## Project Structure
```
├── server.js           Node.js static file server + /uptime & /health endpoints
├── package.json
├── render.yaml         Render deployment config
├── vercel.json         Vercel deployment config
├── api/
│   └── uptime.js       Vercel serverless function for /uptime & /health
└── public/
    ├── index.html      Single-page portfolio
    ├── style.css       All styles — theme system (default/time/saranggola)
    ├── script.js       Particles, lyrics engine, multi-song player, themes
    ├── profile.jpg     Profile photo
    ├── sb19.jpg        SB19 artist logo (credit bar)
    ├── benben.jpg      Ben&Ben artist logo (credit bar)
    ├── music.mp3       "Time" by SB19
    └── saranggola.mp3  "Saranggola" by Ben&Ben
```

## Features
- Floating particle canvas background with mouse interaction
- Glitch/glow effect on hero name
- Typewriter animation cycling through phrases
- Scroll-reveal animations on every section
- Animated skill progress bars
- Glassmorphism cards
- Fully responsive (mobile + desktop)
- Smooth scroll navbar
- Sections: Hero, About, Skills, Hobbies, Experience, Contact

## Music Player
- Two background tracks: "Time" by SB19 and "Saranggola" by Ben&Ben
- **Single tap** the music button to play/pause
- **Hold** the music button (500ms) to open the song picker popup
- Synced lyrics overlay with animated word-by-word display
- Auto-advances to the next song when the current one ends
- Dynamic credit bar updates with slide-in/out animation when changing songs

## Theme System
- **Default** (no music): Deep navy/blue — original design
- **theme-time** (SB19 "Time"): Warm vibrant sunset — orange/pink/gold palette
- **theme-saranggola** (Ben&Ben): Soft golden-hour — amber/gold/tropical-green palette
- All CSS custom properties transition smoothly (0.9s) on theme change
- Theme resets to default when music is paused

## Uptime Monitoring
- `GET /uptime` — returns `{"status":"ok","uptime":...,"timestamp":"..."}` with HTTP 200
- `GET /health` — alias for `/uptime`
- Both endpoints support HEAD requests (no body returned)
- `Cache-Control: no-store` prevents cached stale responses
- Compatible with Better Stack (betterstack.com) and UptimeRobot (uptimerobot.com)

## Deployment
- **Render**: Configured via `render.yaml`. Health check path: `/uptime`
- **Vercel**: Configured via `vercel.json`. Static files from `public/`, `/uptime` and `/health` served via `api/uptime.js` serverless function

## Personal Info
- Name: Mart John F. Labaco
- Email: martjohnlabaco985@gmail.com
- Facebook: https://www.facebook.com/MartJohnFloresLabaco
