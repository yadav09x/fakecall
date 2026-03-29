import { useCallback, useRef } from "react";

export function useRingtone() {
  const contextRef = useRef<AudioContext | null>(null);
  const gainRef = useRef<GainNode | null>(null);
  const intervRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const start = useCallback(() => {
    if (contextRef.current) return;
    const ctx = new AudioContext();
    contextRef.current = ctx;
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.connect(ctx.destination);
    gainRef.current = gain;

    let phase = 0;
    const playRing = () => {
      const now = ctx.currentTime;
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const g = ctx.createGain();
      osc1.frequency.setValueAtTime(480, now);
      osc2.frequency.setValueAtTime(620, now);
      osc1.connect(g);
      osc2.connect(g);
      g.connect(ctx.destination);
      g.gain.setValueAtTime(0, now);
      g.gain.linearRampToValueAtTime(0.3, now + 0.05);
      g.gain.setValueAtTime(0.3, now + 0.35);
      g.gain.linearRampToValueAtTime(0, now + 0.4);
      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 0.45);
      osc2.stop(now + 0.45);
      phase++;
    };

    playRing();
    playRing();
    intervRef.current = setInterval(() => {
      if (phase % 4 < 2) {
        playRing();
      }
      phase++;
    }, 400);
  }, []);

  const stop = useCallback(() => {
    if (intervRef.current) {
      clearInterval(intervRef.current);
      intervRef.current = null;
    }
    if (contextRef.current) {
      contextRef.current.close();
      contextRef.current = null;
    }
  }, []);

  return { start, stop };
}
