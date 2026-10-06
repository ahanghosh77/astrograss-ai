# AstroGrass AI 🔭🌌

> **Dark-Sky Stargazing & Meteor Lookout — Powered by Open-Weight Models via Ollama**  
> *Built for Hacktoberfest 2026 Open-Source AI Challenge Week 1: Touch Grass*

[![Hacktoberfest 2026](https://img.shields.io/badge/Hacktoberfest-2026%20Week%201-blue.svg)](https://dev.to/challenges/hacktoberfest-week1-2026-10-05)
[![Inference Engine](https://img.shields.io/badge/Inference-Ollama%20Local-success.svg)](https://ollama.ai)
[![Models](https://img.shields.io/badge/Models-Llama%203.2%20%2F%20Gemma%202-purple.svg)](#)
[![Zero Cloud Fees](https://img.shields.io/badge/API%20Costs-%240.00-brightgreen.svg)](#)

---

## 🍃 Overview

Stargazing and experiencing the autumn cosmos requires literally **touching grass** in open meadows and dark-sky parks away from artificial lights. 

However, modern stargazing apps flood users with intense screen blue-light that instantly destroys retinal rod rhodopsin (night-vision adaptation), forcing users to stare at phone screens rather than the actual stars above.

**AstroGrass AI** is designed with an anti-screen philosophy:
1. **Select your celestial targets** (October Orionid meteors, Cassiopeia/Pegasus asterisms, Saturn/Jupiter, or deep-sky objects like the Pleiades and Andromeda Galaxy M31).
2. **Synthesize an observation plan in 15 seconds** using local open-weight models (`llama3.2:3b`, `gemma2:2b`) running via **Ollama**.
3. **Toggle Astro Red Mode** to eliminate blue-light and preserve retinal night adaptation.
4. **Start the Hands-Free Dark Adaptation Timer**: Lie on the grass with your eyes adjusted. Gentle harmonic Web Audio singing-bowl bells ring at 5-minute milestones so you never need to check your phone.
5. **Rapid Meteor Clicker & Grass-Watch Journal**: Tap a physical pocket volume/button to tally shooting stars and log your outdoor observations completely offline.

---

## 🌟 Key Features

- **Local Inference via Ollama**: Connects to `localhost:11434` running open-weight models (`llama3.2`, `gemma2`, `qwen2.5`) with zero cloud latency and zero server costs.
- **Offline Astronomical Knowledge Engine**: Comprehensive fallback database for Bortle sky darkness scales, constellation coordinates, and October celestial events when in remote wilderness with zero cell coverage.
- **Astro Red Night-Vision Filter**: Deep monochromatic red mode (`#ff4444` on `#070000`) designed according to photopic/scotopic vision science to protect dark adaptation.
- **Hands-Free 15-Minute Dark Adaptation Countdown**: Utilizes Web Audio API sinusoidal synthesis for harmonic bells at intervals.
- **Dynamic SVG Sky Chart**: Visualizes horizon lines, constellation vector paths, radiant points, and stellar magnitudes.
- **Persistent Observation Journal & Streak Counter**: Saves meteor counts, sky condition notes, and outdoor night streak in browser `localStorage` with JSON export.

---

## 🚀 Quick Start

### 1. Run Locally
```bash
git clone https://github.com/ahanghosh77/astrograss-ai.git
cd astrograss-ai
```
Open `index.html` directly in any web browser or serve with:
```bash
npx serve .
```

### 2. (Optional) Run Local AI with Ollama
```bash
ollama run llama3.2:3b
```
Click **Model** in the navbar to configure your local endpoint (defaults to `http://localhost:11434/api/generate`).

---

## 🏆 Hacktoberfest 2026 Submission

- **Challenge**: Hacktoberfest Open-Source AI Challenge Week 1: Touch Grass (October 5–11, 2026)
- **Target Category**: Best Use of Ollama ($200 USD)
- **Developer**: Antigravity Pair-Programming Team
