// AstroGrass AI — Dark-Sky Stargazing & Meteor Lookout
// Powered by Local Open-Weight Models via Ollama & Astronomical Offline Engine

(function() {
  'use strict';

  // --- State ---
  const state = {
    target: 'meteor-showers',
    bortle: 'suburban',
    window: 'dusk',
    isRedMode: localStorage.getItem('astro_red_mode') === 'true',
    modelEndpoint: localStorage.getItem('astro_ollama_endpoint') || 'http://localhost:11434/api/generate',
    modelName: localStorage.getItem('astro_model_name') || 'llama3.2:3b',
    activeTab: 'tab-targets',
    adaptCountdownSec: 900, // 15 mins
    timerInterval: null,
    isTimerRunning: false,
    sessionMeteorCount: 0,
    audioCtx: null,
    skyDatabase: {
      'meteor-showers': {
        title: 'The Autumn Orionid Meteor & Taurus Drift',
        summary: 'Lie flat on a blanket facing east-southeast. The radiant point near Orion’s club yields up to 20 swift, ionized dust trails per hour with green-hued persistent trains.',
        etiquette: 'Lay a waterproof ground sheet beneath your wool blanket to block autumn moisture. Relax neck muscles, breathe deeply, and keep your gaze unfocused across the wide zenith.',
        targets: [
          { name: 'Look East-Southeast towards Orion', dir: 'Heading 115°', desc: 'Find the distinctive three-star belt rising after 10 PM. Meteors radiate outwards across the entire dome.', cue: 'Three bright stars in a straight line' },
          { name: 'Scan the Zenith (Overhead Dome)', dir: 'Straight Up', desc: 'The longest meteor trails graze high in the atmosphere directly overhead away from ground haze.', cue: 'Darkest overhead patch of sky' },
          { name: 'Watch the Taurus Horns', dir: 'Right of Orion', desc: 'The Taurid stream adds occasional bright, slow-moving fireballs across the autumn sky.', cue: 'V-shaped Aldebaran star cluster' }
        ],
        svgPoints: [
          { cx: 250, cy: 120, r: 4.5, col: '#fef08a' },
          { cx: 280, cy: 160, r: 3.5, col: '#bae6fd' },
          { cx: 220, cy: 160, r: 3, col: '#bae6fd' },
          { cx: 260, cy: 210, r: 5, col: '#fca5a5' }
        ],
        svgLines: [
          { x1: 250, y1: 120, x2: 280, y2: 160 },
          { x1: 280, y1: 160, x2: 260, y2: 210 },
          { x1: 220, y1: 160, x2: 250, y2: 160 },
          { x1: 250, y1: 160, x2: 280, y2: 160 }
        ],
        radiant: { cx: 310, cy: 140, label: 'Orionid Radiant' }
      },
      'autumn-constellations': {
        title: 'The Great Queen & Winged Horse (Cassiopeia & Pegasus)',
        summary: 'Prominent high-altitude autumn asterisms guiding your gaze across northern skies, rich with mythological lore and open star clusters.',
        etiquette: 'Rest your head against a daypack so your cervical spine stays relaxed while scanning the zenith. Listen to the gentle rustle of dry fallen leaves.',
        targets: [
          { name: 'Cassiopeia "W" in the North', dir: 'High North', desc: 'Five bright stars forming an unmistakable zigzag crown high above Polaris.', cue: 'Striking "W" or "M" pattern' },
          { name: 'The Great Square of Pegasus', dir: 'South-Southwest', desc: 'A giant, stark diamond of four stars representing the body of the winged stallion.', cue: 'Huge empty box of stars' },
          { name: 'Perseus the Hero', dir: 'Northeast', desc: 'Arcs between Cassiopeia and the Pleiades. Look for the famous Double Cluster with binoculars.', cue: 'Curving wishbone of stars' }
        ],
        svgPoints: [
          { cx: 180, cy: 70, r: 4, col: '#fef08a' },
          { cx: 220, cy: 90, r: 3.5, col: '#fef08a' },
          { cx: 250, cy: 65, r: 4, col: '#fef08a' },
          { cx: 290, cy: 95, r: 3.5, col: '#fef08a' },
          { cx: 330, cy: 75, r: 4, col: '#fef08a' },
          // Pegasus Square
          { cx: 380, cy: 160, r: 4, col: '#93c5fd' },
          { cx: 440, cy: 170, r: 3.5, col: '#93c5fd' },
          { cx: 430, cy: 230, r: 3.5, col: '#93c5fd' },
          { cx: 370, cy: 220, r: 4, col: '#93c5fd' }
        ],
        svgLines: [
          { x1: 180, y1: 70, x2: 220, y2: 90 },
          { x1: 220, y1: 90, x2: 250, y2: 65 },
          { x1: 250, y1: 65, x2: 290, y2: 95 },
          { x1: 290, y1: 95, x2: 330, y2: 75 },
          // Pegasus
          { x1: 380, y1: 160, x2: 440, y2: 170 },
          { x1: 440, y1: 170, x2: 430, y2: 230 },
          { x1: 430, y1: 230, x2: 370, y2: 220 },
          { x1: 370, y1: 220, x2: 380, y2: 160 }
        ],
        radiant: { cx: 250, cy: 65, label: 'Cassiopeia Apex' }
      },
      'planets-moon': {
        title: 'Autumn Gas Giants: Golden Saturn & Regal Jupiter',
        summary: 'The two solar system behemoths dominate autumn evenings, shining with non-twinkling steady brilliance against the dim stars.',
        etiquette: 'Planets do not twinkle like stars. Watch how their steady warm glow cuts through suburban light pollution even on moonlit nights.',
        targets: [
          { name: 'Saturn in Aquarius', dir: 'Southern Sky', desc: 'Glowing with a pale golden hue. A small telescope or 10x binoculars reveals its edge-on ring tilt.', cue: 'Steadfast golden beacon' },
          { name: 'Jupiter in Taurus', dir: 'Rising in East', desc: 'The brightest object in the night sky apart from the Moon. Unmistakable brilliant cream beacon.', cue: 'Dazzling cream-white lantern' },
          { name: 'Waxing Autumn Crescent', dir: 'Low Southwest', desc: 'Observe earthshine illuminating the unlit portion of the lunar maria after sunset.', cue: 'Crescent Moon with Earthshine' }
        ],
        svgPoints: [
          { cx: 200, cy: 190, r: 7, col: '#fde047' }, // Saturn
          { cx: 380, cy: 130, r: 9, col: '#fef08a' }  // Jupiter
        ],
        svgLines: [
          { x1: 200, y1: 190, x2: 380, y2: 130 }
        ],
        radiant: { cx: 380, cy: 130, label: 'Jupiter (Brilliant)' }
      },
      'deep-sky': {
        title: 'Deep-Sky Jewels: Pleiades & Andromeda Galaxy (M31)',
        summary: 'Journey 2.5 million light years into deep space with naked eyes or simple binoculars under dark autumn meadow skies.',
        etiquette: 'Use averted vision (looking slightly to the side of the object) to activate the light-sensitive rod cells in your peripheral retina.',
        targets: [
          { name: 'The Pleiades (M45 / Seven Sisters)', dir: 'East-Northeast', desc: 'A sparkling cluster of sapphire-blue young stars resembling a tiny diamond dipper.', cue: 'Small shimmering dipper' },
          { name: 'The Andromeda Galaxy (M31)', dir: 'High Overhead', desc: 'A faint misty oval of starlight containing 1 trillion stars, 2.5 million light years away.', cue: 'Misty celestial smudge' },
          { name: 'Perseus Double Cluster', dir: 'Northeast', desc: 'Twin splash of thousands of glittering stars visible even through modest 8x42 binoculars.', cue: 'Dual glitter patch' }
        ],
        svgPoints: [
          { cx: 160, cy: 110, r: 3, col: '#93c5fd' },
          { cx: 165, cy: 108, r: 2.5, col: '#93c5fd' },
          { cx: 157, cy: 114, r: 2, col: '#93c5fd' },
          { cx: 170, cy: 113, r: 2.5, col: '#93c5fd' },
          { cx: 162, cy: 118, r: 2, col: '#93c5fd' },
          // Andromeda M31
          { cx: 340, cy: 90, r: 6, col: '#e9d5ff' }
        ],
        svgLines: [
          { x1: 160, y1: 110, x2: 340, y2: 90 }
        ],
        radiant: { cx: 340, cy: 90, label: 'Andromeda M31 (2.5M ly)' }
      }
    },
    journalEntries: JSON.parse(localStorage.getItem('astro_journal_entries') || '[]')
  };

  // Pre-seed 1 entry if completely empty for instant demonstration
  if (state.journalEntries.length === 0) {
    state.journalEntries.push({
      id: Date.now() - 86400000,
      date: new Date(Date.now() - 86400000).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      target: 'October Orionid Meteors',
      meteors: 14,
      notes: 'Layed out on a tarp in the backyard grass. Spotted 14 shooting stars between 11 PM and midnight! Kept the phone in red mode.'
    });
    localStorage.setItem('astro_journal_entries', JSON.stringify(state.journalEntries));
  }

  // --- DOM Elements ---
  const targetGrid = document.getElementById('targetGrid');
  const bortlePills = document.getElementById('bortlePills');
  const windowChips = document.getElementById('windowChips');
  const btnSynthesizeSky = document.getElementById('btnSynthesizeSky');
  const genSpinner = document.getElementById('genSpinner');
  const genBtnText = document.getElementById('genBtnText');

  const btnToggleRedMode = document.getElementById('btnToggleRedMode');
  const redModeText = document.getElementById('redModeText');

  const tabButtons = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');

  const targetBadge = document.getElementById('targetBadge');
  const bortleBadge = document.getElementById('bortleBadge');
  const modelBadge = document.getElementById('modelBadge');
  const skyTitle = document.getElementById('skyTitle');
  const skySummary = document.getElementById('skySummary');
  const targetsList = document.getElementById('targetsList');
  const etiquetteBody = document.getElementById('etiquetteBody');
  const constellationGroup = document.getElementById('constellationGroup');

  const adaptCountdown = document.getElementById('adaptCountdown');
  const btnToggleAdapt = document.getElementById('btnToggleAdapt');
  const btnResetAdapt = document.getElementById('btnResetAdapt');

  const sessionMeteorCount = document.getElementById('sessionMeteorCount');
  const btnCountMeteor = document.getElementById('btnCountMeteor');
  const btnResetMeteor = document.getElementById('btnResetMeteor');
  const logNotes = document.getElementById('logNotes');
  const btnSaveObservation = document.getElementById('btnSaveObservation');
  const journalFeed = document.getElementById('journalFeed');
  const journalCount = document.getElementById('journalCount');
  const nightsStreak = document.getElementById('nightsStreak');

  const btnModelSettings = document.getElementById('btnModelSettings');
  const modelModal = document.getElementById('modelModal');
  const btnCloseModal = document.getElementById('btnCloseModal');
  const btnSaveModal = document.getElementById('btnSaveModal');
  const ollamaEndpointInput = document.getElementById('ollamaEndpoint');
  const modelNameSelect = document.getElementById('modelName');
  const btnTestOllama = document.getElementById('btnTestOllama');
  const testResult = document.getElementById('testResult');
  const aiStatusText = document.getElementById('aiStatusText');
  const btnExportLog = document.getElementById('btnExportLog');

  // --- Web Audio Celestial Chime Synthesizer ---
  function playCelestialChime(type) {
    try {
      if (!state.audioCtx) {
        state.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      }
      const ctx = state.audioCtx;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      if (type === 'bell') {
        // Singing bowl harmonic
        osc.type = 'sine';
        osc.frequency.setValueAtTime(528, now); // Solfeggio frequency 528Hz
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.5);
        osc.start(now);
        osc.stop(now + 2.5);
      } else if (type === 'meteor') {
        // High shooting star ping
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(880, now);
        osc.frequency.exponentialRampToValueAtTime(1760, now + 0.2);
        gain.gain.setValueAtTime(0.25, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
        osc.start(now);
        osc.stop(now + 0.35);
      } else if (type === 'complete') {
        // Warm chord
        [440, 554.37, 659.25].forEach((freq, i) => {
          const o = ctx.createOscillator();
          const g = ctx.createGain();
          o.type = 'sine';
          o.frequency.setValueAtTime(freq, now + i * 0.1);
          g.gain.setValueAtTime(0.15, now + i * 0.1);
          g.gain.exponentialRampToValueAtTime(0.0001, now + 3.0);
          o.connect(g);
          g.connect(ctx.destination);
          o.start(now + i * 0.1);
          o.stop(now + 3.0);
        });
      }
    } catch (e) {
      console.warn('Audio chime unsupported or blocked:', e);
    }
  }

  // --- Render Active Stargazing Plan ---
  function renderActivePlan(planData, targetKey, bortleKey) {
    const targetLabels = {
      'meteor-showers': '🌠 Orionid Meteors',
      'autumn-constellations': '⭐ Autumn Constellations',
      'planets-moon': '🪐 Saturn & Jupiter',
      'deep-sky': '🌌 Deep-Sky Objects'
    };
    targetBadge.textContent = targetLabels[targetKey] || '✨ Stargazing Target';

    const bortleLabels = {
      'suburban': '🏡 Suburban (Bortle 5-6)',
      'rural-meadow': '🌾 Rural Meadow (Bortle 3-4)',
      'wilderness': '🌲 Wilderness (Bortle 1-2)'
    };
    bortleBadge.textContent = bortleLabels[bortleKey] || '🌾 Night Sky';
    modelBadge.textContent = state.modelName === 'heuristic' ? '⚡ Native Astronomical Engine' : `🧠 ${state.modelName.toUpperCase()} Synthesized`;

    skyTitle.textContent = planData.title;
    skySummary.textContent = planData.summary;
    etiquetteBody.textContent = planData.etiquette;

    // Render Targets List
    targetsList.innerHTML = '';
    planData.targets.forEach((t, idx) => {
      const card = document.createElement('div');
      card.className = 'target-item';
      card.innerHTML = `
        <div class="target-num">${idx + 1}</div>
        <div class="target-content">
          <h4>${t.name}</h4>
          <p>${t.desc}</p>
          <div class="target-meta">
            <span>🧭 Direction: <strong>${t.dir}</strong></span>
            <span>👁️ Naked-Eye Cue: <strong>${t.cue}</strong></span>
          </div>
        </div>
      `;
      targetsList.appendChild(card);
    });

    // Render SVG Sky Chart
    if (constellationGroup && planData.svgPoints) {
      let svgMarkup = '';

      // Render constellation lines
      if (planData.svgLines) {
        planData.svgLines.forEach(l => {
          svgMarkup += `<line x1="${l.x1}" y1="${l.y1}" x2="${l.x2}" y2="${l.y2}" stroke="rgba(147, 197, 253, 0.4)" stroke-width="1.5" />`;
        });
      }

      // Render stars
      planData.svgPoints.forEach(p => {
        svgMarkup += `<circle cx="${p.cx}" cy="${p.cy}" r="${p.r}" fill="${p.col}" class="star-pulse" />`;
      });

      // Radiant or primary marker
      if (planData.radiant) {
        svgMarkup += `
          <circle cx="${planData.radiant.cx}" cy="${planData.radiant.cy}" r="14" fill="none" stroke="#f43f5e" stroke-width="1.5" stroke-dasharray="3" />
          <text x="${planData.radiant.cx + 20}" y="${planData.radiant.cy + 5}" fill="#f43f5e" font-size="11" font-family="'JetBrains Mono', monospace">${planData.radiant.label}</text>
        `;
      }

      constellationGroup.innerHTML = svgMarkup;
    }
  }

  // --- Synthesis via Ollama / Open-Weight Model ---
  async function synthesizeSkyPlan() {
    genSpinner.classList.remove('hidden');
    genBtnText.textContent = 'Synthesizing with Ollama...';
    btnSynthesizeSky.disabled = true;

    const baseData = state.skyDatabase[state.target];
    let synthesized = { ...baseData };

    if (state.modelName !== 'heuristic') {
      try {
        const prompt = `You are AstroGrass AI, an expert astronomical field guide helping people get off their phones and lie on the grass to observe the autumn night sky.
Parameters:
Target: ${state.target}
Bortle Light Pollution: ${state.bortle}
Viewing Window: ${state.window}

Respond strictly in valid JSON format matching this schema:
{
  "title": "Inspiring Autumn Stargazing Observation Title",
  "summary": "2 sentences describing what to watch for in the sky tonight without needing a phone screen.",
  "etiquette": "1-2 sentences on how to lie comfortably on grass (dew prevention, warm clothes, relaxed breathing).",
  "targets": [
    {"name": "Sky Target 1", "dir": "Cardinal direction", "desc": "Detailed visual description", "cue": "Naked-eye pointer cue"},
    {"name": "Sky Target 2", "dir": "Cardinal direction", "desc": "Detailed visual description", "cue": "Naked-eye pointer cue"},
    {"name": "Sky Target 3", "dir": "Cardinal direction", "desc": "Detailed visual description", "cue": "Naked-eye pointer cue"}
  ]
}`;

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 4000); // 4 sec graceful timeout

        const res = await fetch(state.modelEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model: state.modelName,
            prompt: prompt,
            stream: false,
            format: 'json'
          }),
          signal: controller.signal
        });
        clearTimeout(timeoutId);

        if (res.ok) {
          const json = await res.json();
          const parsed = JSON.parse(json.response);
          if (parsed.title && parsed.targets) {
            synthesized = {
              ...baseData,
              title: parsed.title,
              summary: parsed.summary || baseData.summary,
              etiquette: parsed.etiquette || baseData.etiquette,
              targets: parsed.targets.length ? parsed.targets : baseData.targets
            };
            aiStatusText.textContent = `${state.modelName} Active`;
          }
        }
      } catch (err) {
        console.warn('Ollama unavailable or timed out; using high-fidelity offline astronomical engine:', err.message);
        aiStatusText.textContent = 'Astronomical Engine (Offline)';
      }
    }

    setTimeout(() => {
      renderActivePlan(synthesized, state.target, state.bortle);
      genSpinner.classList.add('hidden');
      genBtnText.textContent = 'Synthesize Night-Sky Plan';
      btnSynthesizeSky.disabled = false;
      playCelestialChime('bell');
    }, 450);
  }

  // --- Dark Adaptation Timer ---
  function formatTime(sec) {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  }

  function toggleAdaptTimer() {
    if (!state.isTimerRunning) {
      state.isTimerRunning = true;
      btnToggleAdapt.textContent = 'Pause Timer';
      btnToggleAdapt.classList.remove('btn-ghost');
      btnToggleAdapt.classList.add('btn-emerald');
      playCelestialChime('bell');

      state.timerInterval = setInterval(() => {
        if (state.adaptCountdownSec > 0) {
          state.adaptCountdownSec--;
          adaptCountdown.textContent = formatTime(state.adaptCountdownSec);

          // Milestone bell at 10m (600s) and 5m (300s) left
          if (state.adaptCountdownSec === 600 || state.adaptCountdownSec === 300) {
            playCelestialChime('bell');
          }
        } else {
          clearInterval(state.timerInterval);
          state.isTimerRunning = false;
          btnToggleAdapt.textContent = 'Adapted! Restart';
          btnToggleAdapt.classList.remove('btn-emerald');
          btnToggleAdapt.classList.add('btn-ghost');
          playCelestialChime('complete');
          alert('🌌 15 Minutes Complete! Your retinas are fully dark-adapted. Enjoy the cosmos!');
        }
      }, 1000);
    } else {
      state.isTimerRunning = false;
      btnToggleAdapt.textContent = 'Resume Timer';
      btnToggleAdapt.classList.remove('btn-emerald');
      btnToggleAdapt.classList.add('btn-ghost');
      clearInterval(state.timerInterval);
    }
  }

  function resetAdaptTimer() {
    clearInterval(state.timerInterval);
    state.isTimerRunning = false;
    state.adaptCountdownSec = 900;
    adaptCountdown.textContent = '15:00';
    btnToggleAdapt.textContent = 'Start Dark Timer';
    btnToggleAdapt.classList.remove('btn-emerald');
    btnToggleAdapt.classList.add('btn-ghost');
  }

  // --- Red Night-Vision Mode Toggle ---
  function applyRedMode(enabled) {
    if (enabled) {
      document.body.classList.add('night-vision');
      btnToggleRedMode.classList.add('active');
      redModeText.textContent = 'Red Mode (Active)';
    } else {
      document.body.classList.remove('night-vision');
      btnToggleRedMode.classList.remove('active');
      redModeText.textContent = 'Astro Red Mode';
    }
    localStorage.setItem('astro_red_mode', enabled);
    state.isRedMode = enabled;
  }

  // --- Observation Journal & Meteor Counter ---
  function countMeteor() {
    state.sessionMeteorCount++;
    sessionMeteorCount.textContent = state.sessionMeteorCount;
    playCelestialChime('meteor');
  }

  function resetMeteor() {
    state.sessionMeteorCount = 0;
    sessionMeteorCount.textContent = '0';
  }

  function renderJournal() {
    journalCount.textContent = state.journalEntries.length;
    nightsStreak.textContent = state.journalEntries.length;

    journalFeed.innerHTML = '';
    if (state.journalEntries.length === 0) {
      journalFeed.innerHTML = '<p style="color:var(--text-dim); text-align:center; padding:20px;">No observations recorded yet. Step outside tonight!</p>';
      return;
    }

    state.journalEntries.forEach(entry => {
      const card = document.createElement('div');
      card.className = 'journal-card';
      card.innerHTML = `
        <div class="journal-top">
          <span>📅 ${entry.date} &bull; 🎯 ${entry.target}</span>
          <span style="color:var(--accent-rose); font-weight:700;">🌠 ${entry.meteors || 0} Meteors</span>
        </div>
        <div class="journal-body">
          ${entry.notes}
        </div>
        <div class="journal-tags">
          <span class="j-tag">🌌 Dark Sky</span>
          <span class="j-tag">📵 Zero Screen Time</span>
          <span class="j-tag">🌿 Touched Grass</span>
        </div>
      `;
      journalFeed.appendChild(card);
    });
  }

  function saveObservation() {
    const notes = logNotes.value.trim();
    if (!notes) {
      alert('Please write a brief note about what you saw in the night sky.');
      return;
    }

    const newEntry = {
      id: Date.now(),
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      target: skyTitle.textContent,
      meteors: state.sessionMeteorCount,
      notes: notes
    };

    state.journalEntries.unshift(newEntry);
    localStorage.setItem('astro_journal_entries', JSON.stringify(state.journalEntries));
    renderJournal();
    logNotes.value = '';
    state.sessionMeteorCount = 0;
    sessionMeteorCount.textContent = '0';
    playCelestialChime('complete');
    switchTab('tab-journal');
  }

  function exportLog() {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(state.journalEntries, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `astrograss-observation-log-${new Date().toISOString().slice(0,10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  }

  // --- Tab Navigation ---
  function switchTab(targetTabId) {
    tabButtons.forEach(btn => {
      if (btn.getAttribute('data-tab') === targetTabId) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    tabContents.forEach(content => {
      if (content.id === targetTabId) {
        content.classList.add('active');
      } else {
        content.classList.remove('active');
      }
    });
  }

  // --- Event Listeners Setup ---
  function setupEvents() {
    // Red Mode Toggle
    btnToggleRedMode.addEventListener('click', () => {
      applyRedMode(!state.isRedMode);
    });

    // Target Selection
    targetGrid.addEventListener('click', (e) => {
      const card = e.target.closest('.choice-card');
      if (!card) return;
      targetGrid.querySelectorAll('.choice-card').forEach(c => c.classList.remove('active'));
      card.classList.add('active');
      state.target = card.getAttribute('data-target');
      synthesizeSkyPlan();
    });

    // Bortle Pills
    bortlePills.addEventListener('click', (e) => {
      const pill = e.target.closest('.pill-btn');
      if (!pill) return;
      bortlePills.querySelectorAll('.pill-btn').forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      state.bortle = pill.getAttribute('data-bortle');
      synthesizeSkyPlan();
    });

    // Window Chips
    windowChips.addEventListener('click', (e) => {
      const chip = e.target.closest('.chip-btn');
      if (!chip) return;
      windowChips.querySelectorAll('.chip-btn').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      state.window = chip.getAttribute('data-window');
      synthesizeSkyPlan();
    });

    // Tab buttons
    tabButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const tabId = btn.getAttribute('data-tab');
        switchTab(tabId);
      });
    });

    // Main Synthesize Button
    btnSynthesizeSky.addEventListener('click', synthesizeSkyPlan);

    // Dark Adaptation Timer
    btnToggleAdapt.addEventListener('click', toggleAdaptTimer);
    btnResetAdapt.addEventListener('click', resetAdaptTimer);

    // Meteor Counter & Log
    btnCountMeteor.addEventListener('click', countMeteor);
    btnResetMeteor.addEventListener('click', resetMeteor);
    btnSaveObservation.addEventListener('click', saveObservation);
    btnExportLog.addEventListener('click', exportLog);

    // Modal controls
    btnModelSettings.addEventListener('click', () => {
      ollamaEndpointInput.value = state.modelEndpoint;
      modelNameSelect.value = state.modelName;
      testResult.textContent = '';
      modelModal.classList.remove('hidden');
    });

    btnCloseModal.addEventListener('click', () => {
      modelModal.classList.add('hidden');
    });

    btnSaveModal.addEventListener('click', () => {
      state.modelEndpoint = ollamaEndpointInput.value.trim();
      state.modelName = modelNameSelect.value;
      localStorage.setItem('astro_ollama_endpoint', state.modelEndpoint);
      localStorage.setItem('astro_model_name', state.modelName);
      aiStatusText.textContent = state.modelName === 'heuristic' ? 'Astronomical Engine' : `${state.modelName} Configured`;
      modelModal.classList.add('hidden');
    });

    // Test connection
    btnTestOllama.addEventListener('click', async () => {
      testResult.textContent = 'Testing connection...';
      testResult.className = 'test-feedback';
      try {
        const res = await fetch(ollamaEndpointInput.value.trim().replace('/api/generate', '/api/tags'), { method: 'GET' });
        if (res.ok) {
          testResult.textContent = '✅ Connected to Ollama!';
          testResult.className = 'test-feedback ok';
        } else {
          testResult.textContent = '⚠️ Ollama replied with status ' + res.status;
          testResult.className = 'test-feedback err';
        }
      } catch (err) {
        testResult.textContent = '❌ Cannot reach endpoint (offline engine active)';
        testResult.className = 'test-feedback err';
      }
    });

    // Close modal on backdrop click
    modelModal.addEventListener('click', (e) => {
      if (e.target === modelModal) {
        modelModal.classList.add('hidden');
      }
    });
  }

  // --- Initial Boot ---
  function init() {
    setupEvents();
    applyRedMode(state.isRedMode);
    renderJournal();
    renderActivePlan(state.skyDatabase[state.target], state.target, state.bortle);
  }

  init();
})();
