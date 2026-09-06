/**
 * The Web Speech API's SpeechRecognition interface is genuinely
 * absent from TypeScript's standard lib.dom.d.ts - it's still a
 * WHATWG/W3C draft, not a finalized standard, and browsers that
 * support it (Chrome, Edge, Safari) expose it under a vendor-prefixed
 * name (webkitSpeechRecognition) in addition to or instead of the
 * unprefixed one. These are minimal declarations covering only what
 * useVoiceInterview.ts actually uses - not a full spec implementation.
 */

interface SpeechRecognitionResult {
  readonly isFinal: boolean;
  readonly length: number;
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionAlternative {
  readonly transcript: string;
  readonly confidence: number;
}

interface SpeechRecognitionResultList {
  readonly length: number;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionEvent extends Event {
  readonly resultIndex: number;
  readonly results: SpeechRecognitionResultList;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  abort(): void;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onend: (() => void) | null;
  onerror: ((event: Event) => void) | null;
}

interface Window {
  SpeechRecognition?: { new (): SpeechRecognition };
  webkitSpeechRecognition?: { new (): SpeechRecognition };
}
