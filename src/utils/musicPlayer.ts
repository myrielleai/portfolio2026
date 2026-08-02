// Web Audio API & HTML5 Audio Player for LabTeaser Earbuds

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
  coverImage?: string;
  audioUrl?: string;
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
    coverImage: "/streetcar-cover.jpg",
    audioUrl: "/streetcar.m4a",
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
    coverImage: "/streetcar-cover.jpg",
    audioUrl: "/best-part.m4a",
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
    coverImage: "/streetcar-cover.jpg",
    audioUrl: "/get-you.m4a",
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
  private audioElement: HTMLAudioElement | null = null;
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
    const isNewTrack = trackIndex !== undefined && trackIndex !== this.currentTrackIndex;
    if (isNewTrack) {
      this.stopTrack();
      this.currentTrackIndex = trackIndex;
      this.currentTimeSeconds = 0;
    }

    const track = TRACKS[this.currentTrackIndex];

    // Check if track has audio file URL
    if (track.audioUrl) {
      if (this.chordIntervalId) {
        clearInterval(this.chordIntervalId);
        this.chordIntervalId = null;
      }

      if (!this.audioElement || isNewTrack) {
        if (this.audioElement) {
          this.audioElement.pause();
          this.audioElement.src = "";
        }
        this.audioElement = new Audio(track.audioUrl);
        this.audioElement.volume = this.volume;
        this.audioElement.currentTime = this.currentTimeSeconds;

        this.audioElement.ontimeupdate = () => {
          if (this.audioElement) {
            this.currentTimeSeconds = this.audioElement.currentTime;
            if (this.onTimeUpdateCallback) {
              this.onTimeUpdateCallback(this.currentTimeSeconds);
            }
          }
        };

        this.audioElement.onended = () => {
          this.nextTrack();
        };
      }

      this.isPlaying = true;
      if (this.onStateChangeCallback) this.onStateChangeCallback(true);
      
      this.audioElement.play().catch((err) => {
        console.warn("Audio autoplay prevented, falling back to synth:", err);
        this.startSynthPlayback(track);
      });
      return;
    }

    // Fallback Web Audio Synth
    this.startSynthPlayback(track);
  }

  private startSynthPlayback(track: TrackInfo) {
    this.initCtx();
    if (!this.ctx || !this.masterGain) return;

    this.isPlaying = true;
    if (this.onStateChangeCallback) this.onStateChangeCallback(true);

    const chordDurationMs = (60 / track.bpm) * 4000; // 4 beats per chord
    let chordIdx = 0;

    this.playChord(track.chords[chordIdx], track.melody[chordIdx % track.melody.length]);

    this.chordIntervalId = window.setInterval(() => {
      if (!this.isPlaying) return;
      chordIdx = (chordIdx + 1) % track.chords.length;
      const melodyFreq = track.melody[Math.floor(Math.random() * track.melody.length)];
      this.playChord(track.chords[chordIdx], melodyFreq);
    }, chordDurationMs);

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

    chordFreqs.forEach((freq) => {
      if (!this.ctx || !this.masterGain) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, now);

      filter.type = "lowpass";
      filter.frequency.setValueAtTime(450, now);
      filter.frequency.exponentialRampToValueAtTime(750, now + 1.5);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.08, now + 0.6);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + chordDuration);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + chordDuration + 0.1);
    });

    const bassOsc = this.ctx.createOscillator();
    const bassGain = this.ctx.createGain();
    bassOsc.type = "triangle";
    bassOsc.frequency.setValueAtTime(chordFreqs[0] / 2, now);

    bassGain.gain.setValueAtTime(0.001, now);
    bassGain.gain.linearRampToValueAtTime(0.12, now + 0.4);
    bassGain.gain.exponentialRampToValueAtTime(0.0001, now + chordDuration);

    bassOsc.connect(bassGain);
    bassGain.connect(this.masterGain);
    bassOsc.start(now);
    bassOsc.stop(now + chordDuration + 0.1);

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
    if (this.audioElement) {
      this.audioElement.pause();
    }
    if (this.onStateChangeCallback) this.onStateChangeCallback(false);
    if (this.chordIntervalId) {
      clearInterval(this.chordIntervalId);
      this.chordIntervalId = null;
    }
  }

  public stopTrack() {
    this.pauseTrack();
    if (this.audioElement) {
      this.audioElement.pause();
      this.audioElement.currentTime = 0;
    }
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
    if (this.audioElement) {
      this.audioElement.volume = vol;
    }
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(vol, this.ctx.currentTime);
    }
  }

  public seek(seconds: number) {
    this.currentTimeSeconds = seconds;
    if (this.audioElement) {
      this.audioElement.currentTime = seconds;
    }
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
