/**
 * Indian Truck Horns Sound Synthesizer & Experience Engine
 * Uses Web Audio API to procedurally synthesize authentic Indian Highway Multi-Pipe Air Horns
 * No external audio files required - 100% instantaneous, low-latency, and high fidelity!
 */

class IndianHornEngine {
  constructor() {
    this.audioCtx = null;
    this.currentSoundNodes = [];
    this.isPlaying = false;
    this.volume = 0.85;
    this.isTunnelReverb = true;
    this.activeHornKey = 'nagin';
    
    // Truck Quotes for Indian highway vibe
    this.quotes = [
      "HORN OK PLEASE 🚚",
      "BURĪ NAZAR WĀLE TERA MŪNH KĀLĀ 🧿",
      "USE DIPPER AT NIGHT 💡",
      "DEKHO MAGAR PYĀR SE ❤️",
      "MĀA KA AASHĪRWĀD 🙏",
      "SPEED 40 KMPH - SAFE SAFAR 🛣️",
      "JIYO AUR JEENE DO ✨",
      "DUM HAI TO CROSS KAR, WARNA BARDASHT KAR 💥",
      "RĀJA JI DHĪRE CHALO 👑",
      "BHARAT BENZ & TATA EXPRESS 🚩"
    ];

    // Note frequencies in Hz
    this.NOTES = {
      C4: 261.63, Db4: 277.18, D4: 293.66, Eb4: 311.13, E4: 329.63,
      F4: 349.23, Fs4: 369.99, G4: 392.00, Ab4: 415.30, A4: 440.00,
      Bb4: 466.16, B4: 493.88, C5: 523.25, Db5: 554.37, D5: 587.33,
      Eb5: 622.25, E5: 659.25, F5: 698.46, Fs5: 739.99, G5: 783.99,
      Ab5: 830.61, A5: 880.00, Bb5: 932.33, B5: 987.77, C6: 1046.50
    };

    this.horns = {
      nagin: {
        id: 'nagin',
        name: '🐍 Nagin Dance 12-Pipe Melody',
        tag: 'Iconic Indian Highway Favorite',
        desc: 'The timeless snake-charmer tune played on high-pressure multi-pipe musical horns.',
        duration: 3.8,
        color: '#f59e0b',
        sequence: [
          // Iconic Nagin Tune
          { note: 'E5', duration: 0.18, delay: 0.00 },
          { note: 'F5', duration: 0.18, delay: 0.18 },
          { note: 'E5', duration: 0.18, delay: 0.36 },
          { note: 'D5', duration: 0.18, delay: 0.54 },
          { note: 'E5', duration: 0.22, delay: 0.72 },
          { note: 'C5', duration: 0.22, delay: 0.96 },
          { note: 'D5', duration: 0.22, delay: 1.20 },
          { note: 'B4', duration: 0.45, delay: 1.44 },

          // Second riff
          { note: 'E5', duration: 0.18, delay: 2.00 },
          { note: 'F5', duration: 0.18, delay: 2.18 },
          { note: 'G5', duration: 0.22, delay: 2.36 },
          { note: 'F5', duration: 0.18, delay: 2.60 },
          { note: 'E5', duration: 0.18, delay: 2.80 },
          { note: 'D5', duration: 0.22, delay: 3.00 },
          { note: 'E5', duration: 0.60, delay: 3.24 }
        ]
      },

      hornOk: {
        id: 'hornOk',
        name: '📯 Horn OK Please (Classic Blast)',
        tag: 'Standard Highway Overtake',
        desc: 'Sharp, rapid dual-tone rhythm blast: Pa-Paa-Pa-Pa-Paaaa!',
        duration: 2.0,
        color: '#ef4444',
        sequence: [
          { note: 'F4', duration: 0.12, delay: 0.00, chord: ['A4', 'C5'] },
          { note: 'F4', duration: 0.22, delay: 0.18, chord: ['A4', 'C5'] },
          { note: 'F4', duration: 0.12, delay: 0.46, chord: ['A4', 'C5'] },
          { note: 'F4', duration: 0.12, delay: 0.64, chord: ['A4', 'C5'] },
          { note: 'F4', duration: 0.85, delay: 0.82, chord: ['A4', 'C5', 'F5'] }
        ]
      },

      dhoom: {
        id: 'dhoom',
        name: '⚡ Dhoom Machale Fast Air Horn',
        tag: 'Bollywood Express Turbo',
        desc: 'High-speed melodic rhythm blast echoing through flyovers and expressways.',
        duration: 2.8,
        color: '#06b6d4',
        sequence: [
          { note: 'D5', duration: 0.14, delay: 0.00 },
          { note: 'D5', duration: 0.14, delay: 0.16 },
          { note: 'F5', duration: 0.16, delay: 0.32 },
          { note: 'D5', duration: 0.16, delay: 0.50 },
          { note: 'C5', duration: 0.16, delay: 0.68 },
          { note: 'D5', duration: 0.35, delay: 0.86 },

          { note: 'D5', duration: 0.14, delay: 1.30 },
          { note: 'D5', duration: 0.14, delay: 1.46 },
          { note: 'F5', duration: 0.16, delay: 1.62 },
          { note: 'G5', duration: 0.22, delay: 1.80 },
          { note: 'F5', duration: 0.16, delay: 2.04 },
          { note: 'D5', duration: 0.55, delay: 2.22 }
        ]
      },

      yaarKahan: {
        id: 'yaarKahan',
        name: '🎵 Tere Jaisa Yaar Kahan Melody',
        tag: 'Sentimental Trucker Tune',
        desc: 'Soulful highway melody favorite among night intercity sleeper drivers.',
        duration: 3.4,
        color: '#8b5cf6',
        sequence: [
          { note: 'C5', duration: 0.25, delay: 0.00 },
          { note: 'D5', duration: 0.25, delay: 0.28 },
          { note: 'E5', duration: 0.35, delay: 0.56 },
          { note: 'E5', duration: 0.25, delay: 0.95 },
          { note: 'D5', duration: 0.25, delay: 1.25 },
          { note: 'C5', duration: 0.40, delay: 1.55 },
          { note: 'D5', duration: 0.25, delay: 2.00 },
          { note: 'E5', duration: 0.25, delay: 2.30 },
          { note: 'D5', duration: 0.60, delay: 2.60 }
        ]
      },

      bhangra: {
        id: 'bhangra',
        name: '🥁 Punjabi Dhol Bhangra Horn',
        tag: 'GT Road Desi Swag',
        desc: 'Rhythmic, bass-heavy alternating Punjabi truck air blast.',
        duration: 2.5,
        color: '#10b981',
        sequence: [
          { note: 'G4', duration: 0.15, delay: 0.00, chord: ['D5'] },
          { note: 'G4', duration: 0.10, delay: 0.20, chord: ['D5'] },
          { note: 'G4', duration: 0.10, delay: 0.35, chord: ['D5'] },
          { note: 'C5', duration: 0.25, delay: 0.52, chord: ['G5'] },
          { note: 'G4', duration: 0.15, delay: 0.85, chord: ['D5'] },
          { note: 'C5', duration: 0.15, delay: 1.05, chord: ['G5'] },
          { note: 'D5', duration: 0.18, delay: 1.25, chord: ['Bb5'] },
          { note: 'C5', duration: 0.65, delay: 1.50, chord: ['G5', 'C6'] }
        ]
      },

      tataTrumpet: {
        id: 'tataTrumpet',
        name: '🚛 Tata 1613 Heavy Dual Trumpet',
        tag: 'Authentic Gritty Air Blast',
        desc: 'Pure dual-chamber resonant pressure horn echoing across ghats and highways.',
        duration: 1.8,
        color: '#f97316',
        sequence: [
          { note: 'D4', duration: 0.45, delay: 0.00, chord: ['Fs4', 'A4'] },
          { note: 'D4', duration: 0.18, delay: 0.55, chord: ['Fs4', 'A4'] },
          { note: 'D4', duration: 0.90, delay: 0.80, chord: ['Fs4', 'A4', 'D5'] }
        ]
      },

      volvoSymphony: {
        id: 'volvoSymphony',
        name: '🌌 Volvo B11R Luxury Multi-Tone',
        tag: 'Expressway Intercity VIP',
        desc: 'Deep multi-octave harmonic chime designed for sleeper coaches at 120 km/h.',
        duration: 2.6,
        color: '#3b82f6',
        sequence: [
          { note: 'F4', duration: 0.28, delay: 0.00, chord: ['C5', 'A5'] },
          { note: 'G4', duration: 0.28, delay: 0.32, chord: ['D5', 'Bb5'] },
          { note: 'A4', duration: 0.35, delay: 0.66, chord: ['E5', 'C6'] },
          { note: 'Bb4', duration: 0.85, delay: 1.05, chord: ['F5', 'D6'] }
        ]
      },

      reverseBuzzer: {
        id: 'reverseBuzzer',
        name: '🚨 Desi Truck Reverse Melodic Chime',
        tag: 'Gaddi Back Ho Rahi Hai',
        desc: 'Quintessential Indian commercial vehicle backing chime with rhythmic warning.',
        duration: 3.2,
        color: '#ec4899',
        sequence: [
          { note: 'E5', duration: 0.15, delay: 0.00 },
          { note: 'B4', duration: 0.15, delay: 0.20 },
          { note: 'C5', duration: 0.15, delay: 0.40 },
          { note: 'D5', duration: 0.25, delay: 0.60 },
          { note: 'E5', duration: 0.15, delay: 0.95 },
          { note: 'B4', duration: 0.15, delay: 1.15 },
          { note: 'C5', duration: 0.15, delay: 1.35 },
          { note: 'D5', duration: 0.45, delay: 1.55 },
          { note: 'C5', duration: 0.15, delay: 2.10 },
          { note: 'B4', duration: 0.15, delay: 2.30 },
          { note: 'A4', duration: 0.50, delay: 2.50 }
        ]
      }
    };
  }

  ensureContext() {
    if (!this.audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      this.audioCtx = new AudioContextClass();
    }
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  stopCurrent() {
    if (this.currentSoundNodes && this.currentSoundNodes.length > 0) {
      this.currentSoundNodes.forEach(node => {
        try {
          if (node.stop) node.stop();
          if (node.disconnect) node.disconnect();
        } catch (e) {}
      });
      this.currentSoundNodes = [];
    }
    this.isPlaying = false;
  }

  /**
   * Play a specific truck horn by key
   */
  play(hornKey = this.activeHornKey) {
    const horn = this.horns[hornKey] || this.horns.nagin;
    this.activeHornKey = horn.id;
    this.ensureContext();
    this.stopCurrent();
    this.isPlaying = true;

    const ctx = this.audioCtx;
    const now = ctx.currentTime;
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(this.volume, now);

    // Optional Convolver/Tunnel Filter for highway echo
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(3600, now);
    filter.Q.setValueAtTime(2.5, now);

    // Compressor for punchy air blast acoustics
    const compressor = ctx.createDynamicsCompressor();
    compressor.threshold.setValueAtTime(-12, now);
    compressor.knee.setValueAtTime(8, now);
    compressor.ratio.setValueAtTime(12, now);
    compressor.attack.setValueAtTime(0.003, now);
    compressor.release.setValueAtTime(0.15, now);

    masterGain.connect(filter);
    filter.connect(compressor);
    compressor.connect(ctx.destination);
    this.currentSoundNodes.push(masterGain, filter, compressor);

    // Play all notes and harmonic overtones in the sequence
    horn.sequence.forEach(item => {
      const startTime = now + item.delay;
      const duration = item.duration;
      const primaryFreq = this.NOTES[item.note] || 440;

      const freqs = [primaryFreq];
      if (item.chord && Array.isArray(item.chord)) {
        item.chord.forEach(cn => {
          if (this.NOTES[cn]) freqs.push(this.NOTES[cn]);
        });
      }

      freqs.forEach(freq => {
        // Air horn physical characteristics: Sawtooth + Square + Detuned Harmonic Pipe
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const oscSub = ctx.createOscillator();

        const noteGain = ctx.createGain();

        osc1.type = 'sawtooth';
        osc1.frequency.setValueAtTime(freq, startTime);
        // Slight air pressure pitch drop on blow start
        osc1.frequency.exponentialRampToValueAtTime(freq * 0.99, startTime + duration);

        osc2.type = 'square';
        osc2.frequency.setValueAtTime(freq * 1.003, startTime); // Subtle chorusing detune

        oscSub.type = 'triangle';
        oscSub.frequency.setValueAtTime(freq * 0.5, startTime); // Deep chassis resonance

        // Brass envelope
        noteGain.gain.setValueAtTime(0.0001, startTime);
        noteGain.gain.linearRampToValueAtTime(0.28, startTime + 0.025); // Fast air attack
        noteGain.gain.setValueAtTime(0.25, startTime + duration - 0.03);
        noteGain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration + 0.06); // Air decay

        osc1.connect(noteGain);
        osc2.connect(noteGain);
        oscSub.connect(noteGain);
        noteGain.connect(masterGain);

        osc1.start(startTime);
        osc2.start(startTime);
        oscSub.start(startTime);

        osc1.stop(startTime + duration + 0.08);
        osc2.stop(startTime + duration + 0.08);
        oscSub.stop(startTime + duration + 0.08);

        this.currentSoundNodes.push(osc1, osc2, oscSub, noteGain);
      });
    });

    // Fire UI animation callbacks
    this.triggerVisualEffects(horn);

    setTimeout(() => {
      this.isPlaying = false;
      this.resetVisualEffects();
    }, (horn.duration + 0.2) * 1000);

    return horn;
  }

  triggerVisualEffects(horn) {
    // 1. Dispatch custom event for 3D Bus or Soundboard visualizers
    window.dispatchEvent(new CustomEvent('indianHornHonked', { detail: { horn } }));

    // 2. Animate floating horn button and active buttons
    document.querySelectorAll('.horn-playing-anim').forEach(el => el.classList.remove('horn-playing-anim'));
    const activeBtns = document.querySelectorAll(`[data-horn-id="${horn.id}"]`);
    activeBtns.forEach(btn => btn.classList.add('horn-playing-anim'));

    const floatBtn = document.getElementById('floatingTruckHornBtn');
    if (floatBtn) {
      floatBtn.classList.add('honking-active');
      const badge = floatBtn.querySelector('.float-horn-quote');
      if (badge) {
        badge.textContent = this.getRandomQuote();
        badge.style.opacity = '1';
      }
    }

    // 3. Show flash toast with desi slogan
    if (typeof showToast === 'function') {
      showToast(`🎺 Honking: ${horn.name}! "${this.getRandomQuote()}"`, 'info');
    }
  }

  resetVisualEffects() {
    document.querySelectorAll('.horn-playing-anim').forEach(el => el.classList.remove('horn-playing-anim'));
    const floatBtn = document.getElementById('floatingTruckHornBtn');
    if (floatBtn) {
      floatBtn.classList.remove('honking-active');
      const badge = floatBtn.querySelector('.float-horn-quote');
      if (badge) {
        badge.style.opacity = '0';
      }
    }
  }

  getRandomQuote() {
    return this.quotes[Math.floor(Math.random() * this.quotes.length)];
  }
}

// Create Global Singleton
window.indianHorns = new IndianHornEngine();

// Keyboard Shortcut: Press 'H' to Honk anywhere on the website!
document.addEventListener('keydown', (e) => {
  // Ignore if user is typing in an input or textarea
  if (['INPUT', 'SELECT', 'TEXTAREA'].includes(e.target.tagName)) return;
  if (e.key === 'h' || e.key === 'H') {
    e.preventDefault();
    if (window.indianHorns) {
      window.indianHorns.play();
    }
  }
});
