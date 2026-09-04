import { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";

/**
 * Ambient Audio with Built-in Procedural Cinematic Drone:
 * If an external audio file is provided at /audio/ambient-theme.mp3, it attempts
 * to play it. If not found or unsupported, it activates a rich, meditative
 * Web Audio API ambient drone synthesizer (tuned to a soothing D-minor / A pentatonic chord
 * with gentle harmonics and lowpass resonance).
 *
 * Browsers require user interaction before playing audio, so it starts muted
 * and smoothly fades in upon the first tap.
 */
export function AmbientAudioToggle() {
  const [muted, setMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const oscillatorsRef = useRef<OscillatorNode[]>([]);
  const audioElementRef = useRef<HTMLAudioElement>(null);
  const [useFileAudio, setUseFileAudio] = useState(true);

  // Initialize procedural ambient drone on demand
  function startProceduralDrone() {
    if (audioContextRef.current && gainNodeRef.current) {
      if (audioContextRef.current.state === "suspended") {
        audioContextRef.current.resume();
      }
      gainNodeRef.current.gain.cancelScheduledValues(audioContextRef.current.currentTime);
      gainNodeRef.current.gain.setValueAtTime(gainNodeRef.current.gain.value, audioContextRef.current.currentTime);
      gainNodeRef.current.gain.linearRampToValueAtTime(0.12, audioContextRef.current.currentTime + 1.8);
      setIsPlaying(true);
      return;
    }

    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtx();
      audioContextRef.current = ctx;

      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(0.001, ctx.currentTime);
      masterGain.gain.linearRampToValueAtTime(0.12, ctx.currentTime + 2.0);
      gainNodeRef.current = masterGain;

      // Filter: Warm analog-style lowpass
      const filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(260, ctx.currentTime);
      filter.Q.setValueAtTime(1.8, ctx.currentTime);

      // Sub drone & harmonic voices (A1: 55Hz, E2: 82.4Hz, A2: 110Hz, E3: 164.8Hz, B3: 246.9Hz)
      const voiceFrequencies = [55, 82.41, 110, 164.81, 246.94];
      const oscs: OscillatorNode[] = [];

      voiceFrequencies.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        osc.type = idx === 0 ? "sine" : idx % 2 === 0 ? "triangle" : "sine";
        osc.frequency.setValueAtTime(freq, ctx.currentTime);

        const voiceGain = ctx.createGain();
        // Lower frequencies have slightly more weight, higher frequencies are airy whispers
        const voiceVol = idx === 0 ? 0.35 : idx === 1 ? 0.22 : idx === 2 ? 0.18 : 0.08;
        voiceGain.gain.setValueAtTime(voiceVol, ctx.currentTime);

        osc.connect(voiceGain);
        voiceGain.connect(filter);
        osc.start();
        oscs.push(osc);
      });

      oscillatorsRef.current = oscs;
      filter.connect(masterGain);
      masterGain.connect(ctx.destination);
      setIsPlaying(true);
    } catch {
      // AudioContext unavailable or blocked
      setIsPlaying(false);
    }
  }

  function stopProceduralDrone() {
    if (audioContextRef.current && gainNodeRef.current) {
      const ctx = audioContextRef.current;
      gainNodeRef.current.gain.cancelScheduledValues(ctx.currentTime);
      gainNodeRef.current.gain.setValueAtTime(gainNodeRef.current.gain.value, ctx.currentTime);
      gainNodeRef.current.gain.linearRampToValueAtTime(0.0001, ctx.currentTime + 0.8);
      setTimeout(() => {
        setIsPlaying(false);
      }, 850);
    }
  }

  function toggle() {
    const nextMuted = !muted;
    setMuted(nextMuted);

    if (nextMuted) {
      // Mute
      if (audioElementRef.current && !audioElementRef.current.paused) {
        audioElementRef.current.pause();
      }
      stopProceduralDrone();
    } else {
      // Unmute: attempt file audio first, fallback to procedural drone
      if (useFileAudio && audioElementRef.current) {
        audioElementRef.current.muted = false;
        audioElementRef.current.play().then(() => {
          setIsPlaying(true);
        }).catch(() => {
          setUseFileAudio(false);
          startProceduralDrone();
        });
      } else {
        startProceduralDrone();
      }
    }
  }

  useEffect(() => {
    return () => {
      oscillatorsRef.current.forEach((osc) => {
        try {
          osc.stop();
        } catch {
          // ignore
        }
      });
      if (audioContextRef.current) {
        try {
          audioContextRef.current.close();
        } catch {
          // ignore
        }
      }
    };
  }, []);

  return (
    <>
      {useFileAudio && (
        <audio
          ref={audioElementRef}
          loop
          muted={muted}
          onError={() => setUseFileAudio(false)}
        >
          <source src="/audio/ambient-theme.mp3" type="audio/mpeg" />
          <source src="/audio/ambient-theme.ogg" type="audio/ogg" />
        </audio>
      )}
      <button
        onClick={toggle}
        type="button"
        title={muted ? "Unmute cinematic ambient sound" : "Mute ambient sound"}
        aria-label={muted ? "Unmute ambient audio" : "Mute ambient audio"}
        className="fixed bottom-5 left-5 z-[9999] flex items-center gap-2.5 rounded-full border px-3.5 py-2.5 shadow-2xl backdrop-blur-md transition-all duration-300 hover:scale-105"
        style={{
          background: "rgba(11, 14, 20, 0.85)",
          borderColor: muted ? "var(--rz-mist)" : "var(--rz-eye)",
          boxShadow: muted ? "0 4px 20px rgba(0,0,0,0.6)" : "0 0 20px rgba(125,232,255,0.35)",
          color: muted ? "var(--rz-text-dim)" : "var(--rz-eye)",
        }}
      >
        {muted ? (
          <VolumeX className="h-4 w-4 shrink-0 text-[var(--rz-text-mute)]" aria-hidden="true" />
        ) : (
          <Volume2 className="h-4 w-4 shrink-0 text-[var(--rz-eye)]" aria-hidden="true" />
        )}

        <div className="flex items-center gap-1.5">
          {!muted && isPlaying ? (
            <div className="flex h-3.5 items-end gap-0.5" aria-hidden="true">
              <span className="rz-bar-wave-1 w-0.5 rounded-full bg-[var(--rz-eye)]" />
              <span className="rz-bar-wave-2 w-0.5 rounded-full bg-[var(--rz-crystal)]" />
              <span className="rz-bar-wave-3 w-0.5 rounded-full bg-[var(--rz-eye)]" />
            </div>
          ) : null}
          <span className="rz-mono text-[10px] font-medium uppercase tracking-wider text-[var(--rz-text-dim)]">
            {muted ? "Audio: Off" : "Ambient: Live"}
          </span>
        </div>
      </button>
    </>
  );
}
