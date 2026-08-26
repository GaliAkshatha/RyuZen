import { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";

/**
 * Real, working audio infrastructure - honestly, the one real gap:
 * this sandbox has no access to an audio file (no general internet
 * access, no audio synthesis tool), so there is no actual music here
 * yet. Drop a real ambient/cinematic loop at
 * public/audio/ambient-theme.mp3 (or .ogg for broader browser
 * support) and this starts working immediately - nothing else needs
 * to change.
 *
 * Starts muted by default deliberately - browsers block autoplay
 * audio with sound unless the visitor has already interacted with
 * the page, so starting muted (permitted) and letting them tap to
 * unmute is the only reliable cross-browser approach; a real
 * genuinely-unmuted autoplay would just silently fail in most
 * browsers and never be noticed as broken.
 */
export function AmbientAudioToggle() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [muted, setMuted] = useState(true);
  const [hasSource, setHasSource] = useState(true);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = 0.35;
    audio.play().catch(() => {
      // Autoplay (even muted) can still be blocked in some browsers -
      // fails silently, the visitor can still tap to unmute/play.
    });
  }, []);

  function toggle() {
    const audio = audioRef.current;
    if (!audio) return;
    const next = !muted;
    audio.muted = next;
    setMuted(next);
    if (!next) {
      audio.play().catch(() => setHasSource(false));
    }
  }

  return (
    <>
      <audio ref={audioRef} loop muted={muted} onError={() => setHasSource(false)}>
        <source src="/audio/ambient-theme.mp3" type="audio/mpeg" />
        <source src="/audio/ambient-theme.ogg" type="audio/ogg" />
      </audio>
      {hasSource && (
        <button
          onClick={toggle}
          aria-label={muted ? "Unmute ambient audio" : "Mute ambient audio"}
          className="fixed bottom-5 left-5 z-[9999] flex h-10 w-10 items-center justify-center rounded-full border shadow-lg backdrop-blur transition-transform hover:-translate-y-0.5"
          style={{ background: "rgba(11,14,20,.92)", borderColor: "#2a3040", color: "#edeff4" }}
        >
          {muted ? <VolumeX className="h-4 w-4" aria-hidden="true" /> : <Volume2 className="h-4 w-4" aria-hidden="true" />}
        </button>
      )}
    </>
  );
}
