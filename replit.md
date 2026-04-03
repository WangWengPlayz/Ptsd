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
    ├── style.css       All styles — v2.0 professional redesign + theme system
    ├── script.js       Particles, lyrics engine, multi-song player, themes
    ├── profile.jpg     Profile photo
    ├── sb19.jpg        SB19 artist logo (credit bar)
    ├── benben.jpg      Ben&Ben artist logo (credit bar)
    ├── laymedown.jpg   Sam Smith artist logo (credit bar)
    ├── music.mp3       "Time" by SB19
    ├── saranggola.mp3  "Saranggola" by Ben&Ben
    └── laymedown.mp3   "Lay Me Down" by Sam Smith
```

## Features
- Cinematic intro screen (v2.0): radial gradient bg, dot-grid overlay, blur→reveal letter animation, shimmer progress bar
- Floating particle canvas background with mouse interaction
- Glitch/glow effect on hero name
- Typewriter animation cycling through phrases
- Multi-ring animated profile photo (3 conic-gradient rings + pulsing glow)
- Scroll-reveal animations on every section (cinematic easing)
- Animated skill progress bars
- Glassmorphism cards with shimmer-sweep hover effect on all card types
- Button shimmer sweep on hover
- Fully responsive (mobile + desktop)
- `prefers-reduced-motion` support — all animations disabled for accessibility
- Smooth scroll navbar

## Music Player (v2.0)
- Three background tracks: "Time" by SB19, "Saranggola" by Ben&Ben, "Lay Me Down" by Sam Smith
- **Single tap** the music button to play/pause
- **Hold** the music button (500ms) to open the song picker popup with staggered item reveal
- Music toggle shows pulsing radiating ring when playing
- Synced lyrics overlay with animated word-by-word display
- Auto-advances to the next song when the current one ends
- Dynamic credit bar updates with slide-in/out animation when changing songs
- Version badge: **v2.0**

## Theme System
- **Default** (no music): Deep navy/blue — original design
- **theme-time** (SB19 "Time"): Warm vibrant sunset — orange/pink/gold palette; "time" word lights up with fire burst animation (skew + orange/red glow)
- **theme-saranggola** (Ben&Ben): Soft golden-hour — amber/gold palette; "Saranggola" word drifts like a kite (float + rotate + golden shimmer)
- **theme-laymedown** (Sam Smith): Dark charcoal/silver — moody low-key palette; "lay" word does a mournful silver breath (italic + slow fade)
- All CSS custom properties transition smoothly (0.9s) on theme change
- Per-theme lyric current-line glow (orange for Time, gold for Saranggola, silver for Lay Me Down)
- Per-theme lyrics backdrop tint (warm dark for Time/Saranggola, deep charcoal for Lay Me Down)
- Theme resets to default when music is paused

## Lyric Word Animations (v2.0 Enhanced)
- `ly-time`: Fire burst — skewX kinetic shake, multi-layer orange/red glow, scale 1.13×, weight 900
- `ly-saranggola`: Kite drift — translateY float + rotate, brightness/saturation filter, warm golden multi-layer glow
- `ly-laymedown`: Mournful breath — italic, opacity fade to 0.78, slight scale-down, silvery blue-grey glow

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
