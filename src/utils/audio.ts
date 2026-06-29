let audioCtx: AudioContext | null = null;

/**
 * Synthesizes a fast, high-quality metallic "click" sound
 * resembling an analog dial adjustment or mechanical switch hover.
 */
export function playClickSound(volume = 0.05) {
  if (typeof window === "undefined") return;
  
  // Respect prefers-reduced-motion as a signal to keep interface completely quiet/static
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  try {
    if (!audioCtx) {
      const Win = window as unknown as { AudioContext: typeof AudioContext; webkitAudioContext: typeof AudioContext };
      audioCtx = new (Win.AudioContext || Win.webkitAudioContext)();
    }

    if (audioCtx.state === "suspended") {
      audioCtx.resume();
    }

    const now = audioCtx.currentTime;
    
    // 1. High transient contact tick
    const osc1 = audioCtx.createOscillator();
    const gain1 = audioCtx.createGain();
    
    // 2. Low cabinet housing thud
    const osc2 = audioCtx.createOscillator();
    const gain2 = audioCtx.createGain();

    osc1.type = "sine";
    osc1.frequency.setValueAtTime(1400, now);
    osc1.frequency.exponentialRampToValueAtTime(700, now + 0.012);
    
    gain1.gain.setValueAtTime(volume * 0.9, now);
    gain1.gain.exponentialRampToValueAtTime(0.0001, now + 0.012);
    
    osc2.type = "triangle";
    osc2.frequency.setValueAtTime(110, now);
    osc2.frequency.exponentialRampToValueAtTime(45, now + 0.022);
    
    gain2.gain.setValueAtTime(volume * 0.5, now);
    gain2.gain.exponentialRampToValueAtTime(0.0001, now + 0.022);

    osc1.connect(gain1);
    gain1.connect(audioCtx.destination);
    
    osc2.connect(gain2);
    gain2.connect(audioCtx.destination);
    
    osc1.start(now);
    osc1.stop(now + 0.015);
    
    osc2.start(now);
    osc2.stop(now + 0.025);
  } catch {
    // Autoplay protections or context initialization errors fail silently
  }
}

/**
 * Synthesizes a heavy, low-frequency "clunk" sound
 * resembling an analog toggle lever switch moving between states.
 */
export function playToggleSound(isOn = true) {
  if (typeof window === "undefined") return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  try {
    if (!audioCtx) {
      const Win = window as unknown as { AudioContext: typeof AudioContext; webkitAudioContext: typeof AudioContext };
      audioCtx = new (Win.AudioContext || Win.webkitAudioContext)();
    }

    if (audioCtx.state === "suspended") {
      audioCtx.resume();
    }

    const now = audioCtx.currentTime;
    
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    
    osc.type = "sawtooth";
    // Pitch is slightly higher for toggling "ON" vs "OFF" for organic physical context
    const baseFreq = isOn ? 160 : 120;
    osc.frequency.setValueAtTime(baseFreq, now);
    osc.frequency.exponentialRampToValueAtTime(25, now + 0.07);

    const filter = audioCtx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(300, now);

    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.08);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start(now);
    osc.stop(now + 0.085);

    // Add high-end mechanical snap contact
    const oscClick = audioCtx.createOscillator();
    const clickGain = audioCtx.createGain();
    
    oscClick.type = "sine";
    oscClick.frequency.setValueAtTime(1800, now);
    
    clickGain.gain.setValueAtTime(0.04, now);
    clickGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.008);
    
    oscClick.connect(clickGain);
    clickGain.connect(audioCtx.destination);
    
    oscClick.start(now);
    oscClick.stop(now + 0.01);
  } catch {
    // Autoplay protections or context initialization errors fail silently
  }
}
