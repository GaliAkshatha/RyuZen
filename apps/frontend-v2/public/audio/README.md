# Ambient landing page audio

The audio toggle on the landing page (bottom-left button) is fully wired
and functional, but no audio file exists yet — this sandbox has no
general internet access to source music and no audio synthesis tool.

To activate it, drop a real ambient/cinematic loop here as:

- `ambient-theme.mp3` (required, broadest browser support)
- `ambient-theme.ogg` (optional, extra fallback)

Nothing else needs to change — `AmbientAudioToggle.tsx` already points
at these exact paths and will start working immediately once the files
exist. A short (60–120s), seamlessly loopable, low-key cinematic/fantasy
ambient track fits the existing visual tone best — think low string pads,
distant chimes, subtle wind — nothing with a strong beat or vocals that
would compete with the page's own pacing.
