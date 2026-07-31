// Web Audio API Lo-Fi Music Synthesizer for LabTeaser Earbuds

export interface TrackInfo {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: number; // in seconds
  bpm: number;
  chords: number[][]; // Frequencies for chord progression
  melody: number[];   // Frequencies for melody notes
  coverGradient: string;
  bgGlow: string;
  accentColor: string;
  lyrics: string[];
}

export const TRACKS: TrackInfo[] = [
  {
    id: "streetcar",
    title: "Streetcar",
    artist: "Daniel Caesar",
    album: "Freudian",
    duration: 212,
    bpm: 72,
    coverGradient: "from-amber-600 via-orange-600 to-rose-700",
    bgGlow: "rgba(245, 158, 11, 0.45)",
    accentColor: "#f59e0b",
    lyrics: [
      "Streetcar moving down the street...",
      "Let me tell you what I'm thinking...",
      "I'm just thinking 'bout the time that elapsed...",
      "Gotta keep moving on, gotta stay strong...",
      "In the streetlights, glowing in the night...",
      "Just riding on this streetcar home..."
    ],
    // Ebmaj7 -> Cm7 -> Fm7 -> Bb7 (Soulful R&B progression)
    chords: [
      [311.13, 392.00, 466.16, 587.33], // Ebmaj7
      [261.63, 311.13, 392.00, 466.16], // Cm7
      [174.61, 207.65, 261.63, 311.13], // Fm7
      [233.08, 293.66, 349.23, 415.30]  // Bb7
    ],
    melody: [466.16, 587.33, 523.25, 466.16, 392.00, 349.23, 466.16, 587.33]
  },
  {
    id: "best-part",
    title: "Best Part (feat. H.E.R.)",
    artist: "Daniel Caesar",
    album: "Freudian",
    duration: 209,
    bpm: 75,
    coverGradient: "from-rose-500 via-pink-600 to-amber-500",
    bgGlow: "rgba(244, 63, 94, 0.4)",
    accentColor: "#f43f5e",
    lyrics: [
      "You're the coffee that I need in the morning...",
      "You're my sunshine in the rain when it's pouring...",
      "If life is a movie, then you're the best part...",
      "You're the best part, oh..."
    ],
    chords: [
      [261.63, 329.63, 392.00, 493.88], // Cmaj7
      [220.00, 261.63, 329.63, 392.00], // Am7
      [293.66, 349.23, 440.00, 523.25], // Dm7
      [196.00, 246.94, 293.66, 349.23]  // G7
    ],
    melody: [523.25, 659.25, 587.33, 493.88, 440.00, 392.00, 523.25, 659.25]
  },
  {
    id: "get-you",
    title: "Get You (feat. Kali Uchis)",
    artist: "Daniel Caesar",
    album: "Freudian",
    duration: 278,
    bpm: 68,
    coverGradient: "from-violet-600 via-purple-600 to-indigo-800",
    bgGlow: "rgba(139, 92, 246, 0.4)",
    accentColor: "#8b5cf6",
    lyrics: [
      "Through my eyes, see the light of the sun...",
      "Who would have thought I'd get you...",
      "Everything I need right here...",
      "Ooh, who would have thought..."
    ],
    chords: [
      [207.65, 261.63, 311.13, 392.00], // Abmaj7
      [174.61, 207.65, 261.63, 311.13], // Fm7
      [233.08, 277.18, 349.23, 415.30], // Bbm7
      [155.56, 196.00, 233.08, 277.18]  // Eb7
    ],
    melody: [415.30, 523.25, 466.16, 392.00, 349.23, 311.13, 415.30, 523.25]
  }
];

class LoFiMusicSynth {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private isPlaying: boolean = false;
  private currentTrackIndex: number = 0;
  private volume: number = 0.7;
  private currentTimeSeconds: number = 0;
  private intervalId: number | null = null;
  private chordIntervalId: number | null = null;
  private onTimeUpdateCallback: ((time: number) => void) | null = null;
  private onStateChangeCallback: ((isPlaying: boolean) => void) | null = null;

  private initCtx() {
    if (!this.ctx) {
      const Win = window as unknown as { AudioContext: typeof AudioContext; webkitAudioContext: typeof AudioContext };
      this.ctx = new (Win.AudioContext || Win.webkitAudioContext)();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === "suspended") {
      this.ctx.resume();
    }
  }

  public playTrack(trackIndex?: number) {
    if (trackIndex !== undefined && trackIndex !== this.currentTrackIndex) {
      this.stopTrack();
      this.currentTrackIndex = trackIndex;
      this.currentTimeSeconds = 0;
    }

    this.initCtx();
    if (!this.ctx || !this.masterGain) return;

    this.isPlaying = true;
    if (this.onStateChangeCallback) this.onStateChangeCallback(true);

    const track = TRACKS[this.currentTrackIndex];
    const chordDurationMs = (60 / track.bpm) * 4000; // 4 beats per chord
    let chordIdx = 0;

    // Play initial chord and setup loop
    this.playChord(track.chords[chordIdx], track.melody[chordIdx % track.melody.length]);

    this.chordIntervalId = window.setInterval(() => {
      if (!this.isPlaying) return;
      chordIdx = (chordIdx + 1) % track.chords.length;
      const melodyFreq = track.melody[Math.floor(Math.random() * track.melody.length)];
      this.playChord(track.chords[chordIdx], melodyFreq);
    }, chordDurationMs);

    // Timer loop for progress bar
    if (!this.intervalId) {
      this.intervalId = window.setInterval(() => {
        if (!this.isPlaying) return;
        this.currentTimeSeconds += 1;
        if (this.currentTimeSeconds >= track.duration) {
          this.nextTrack();
        } else if (this.onTimeUpdateCallback) {
          this.onTimeUpdateCallback(this.currentTimeSeconds);
        }
      }, 1000);
    }
  }

  private playChord(chordFreqs: number[], melodyFreq: number) {
    if (!this.ctx || !this.masterGain || !this.isPlaying) return;

    const now = this.ctx.currentTime;
    const chordDuration = 3.8; // Seconds

    // Play smooth warm synth pad chords
    chordFreqs.forEach((freq) => {
      if (!this.ctx || !this.masterGain) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      // Soft warm triangle/sine synth wave
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, now);

      // Lowpass filter for cozy warm analog vibe
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(450, now);
      filter.frequency.exponentialRampToValueAtTime(750, now + 1.5);

      // Envelope: Gentle attack and decay
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.08, now + 0.6);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + chordDuration);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + chordDuration + 0.1);
    });

    // Sub Bass Note
    const bassOsc = this.ctx.createOscillator();
    const bassGain = this.ctx.createGain();
    bassOsc.type = "triangle";
    bassOsc.frequency.setValueAtTime(chordFreqs[0] / 2, now); // 1 octave down

    bassGain.gain.setValueAtTime(0.001, now);
    bassGain.gain.linearRampToValueAtTime(0.12, now + 0.4);
    bassGain.gain.exponentialRampToValueAtTime(0.0001, now + chordDuration);

    bassOsc.connect(bassGain);
    bassGain.connect(this.masterGain);
    bassOsc.start(now);
    bassOsc.stop(now + chordDuration + 0.1);

    // Subtle Pluck Melody Note
    const melOsc = this.ctx.createOscillator();
    const melGain = this.ctx.createGain();
    melOsc.type = "triangle";
    melOsc.frequency.setValueAtTime(melodyFreq, now + 0.4);

    melGain.gain.setValueAtTime(0.001, now + 0.4);
    melGain.gain.linearRampToValueAtTime(0.06, now + 0.5);
    melGain.gain.exponentialRampToValueAtTime(0.0001, now + 2.2);

    melOsc.connect(melGain);
    melGain.connect(this.masterGain);
    melOsc.start(now + 0.4);
    melOsc.stop(now + 2.3);
  }

  public pauseTrack() {
    this.isPlaying = false;
    if (this.onStateChangeCallback) this.onStateChangeCallback(false);
    if (this.chordIntervalId) {
      clearInterval(this.chordIntervalId);
      this.chordIntervalId = null;
    }
  }

  public stopTrack() {
    this.pauseTrack();
    this.currentTimeSeconds = 0;
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    if (this.onTimeUpdateCallback) this.onTimeUpdateCallback(0);
  }

  public nextTrack() {
    const nextIdx = (this.currentTrackIndex + 1) % TRACKS.length;
    this.playTrack(nextIdx);
  }

  public prevTrack() {
    const prevIdx = (this.currentTrackIndex - 1 + TRACKS.length) % TRACKS.length;
    this.playTrack(prevIdx);
  }

  public setVolume(vol: number) {
    this.volume = vol;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(vol, this.ctx.currentTime);
    }
  }

  public seek(seconds: number) {
    this.currentTimeSeconds = seconds;
    if (this.onTimeUpdateCallback) this.onTimeUpdateCallback(this.currentTimeSeconds);
  }

  public setTimeUpdateListener(cb: (time: number) => void) {
    this.onTimeUpdateCallback = cb;
  }

  public setStateChangeListener(cb: (isPlaying: boolean) => void) {
    this.onStateChangeCallback = cb;
  }

  public getCurrentTrackIndex() {
    return this.currentTrackIndex;
  }

  public getIsPlaying() {
    return this.isPlaying;
  }

  public getCurrentTime() {
    return this.currentTimeSeconds;
  }

  public getVolume() {
    return this.volume;
  }
}

export const musicSynth = new LoFiMusicSynth();
