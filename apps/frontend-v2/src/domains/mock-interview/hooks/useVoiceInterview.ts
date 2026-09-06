import { useState, useRef, useCallback, useEffect } from "react";

/**
 * Real browser-native voice I/O - no new dependency, no backend
 * change needed at all, since voice here is purely an input/output
 * modality on top of the exact same text answer the backend already
 * accepts. Speech-to-text uses the Web Speech API's SpeechRecognition
 * (Chrome/Edge/Safari - genuinely NOT supported in Firefox as of this
 * writing, checked and reflected honestly via isSupported rather than
 * silently failing). Text-to-speech uses SpeechSynthesis, which has
 * much broader real support.
 */
export function useVoiceInterview() {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  const speechRecognitionSupported =
    typeof window !== "undefined" && Boolean(window.SpeechRecognition || window.webkitSpeechRecognition);

  const speechSynthesisSupported = typeof window !== "undefined" && Boolean(window.speechSynthesis);

  const startListening = useCallback((onResult: (transcript: string) => void, onEnd?: () => void) => {
    if (!speechRecognitionSupported) return;

    const SpeechRecognitionCtor = window.SpeechRecognition ?? window.webkitSpeechRecognition!;
    const recognition = new SpeechRecognitionCtor();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    let finalTranscript = "";

    recognition.onresult = (event) => {
      let interim = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i]!;
        if (result.isFinal) {
          finalTranscript += result[0]!.transcript;
        } else {
          interim += result[0]!.transcript;
        }
      }
      onResult((finalTranscript + interim).trim());
    };

    recognition.onend = () => {
      setIsListening(false);
      onEnd?.();
    };

    recognition.onerror = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
    setIsListening(true);
  }, [speechRecognitionSupported]);

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop();
    setIsListening(false);
  }, []);

  const speak = useCallback((text: string) => {
    if (!speechSynthesisSupported) return;

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1;
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  }, [speechSynthesisSupported]);

  const stopSpeaking = useCallback(() => {
    if (speechSynthesisSupported) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, [speechSynthesisSupported]);

  // Real cleanup - stop any active recognition/speech if the component using this unmounts mid-interview.
  useEffect(() => {
    return () => {
      recognitionRef.current?.stop();
      if (speechSynthesisSupported) {
        window.speechSynthesis.cancel();
      }
    };
  }, [speechSynthesisSupported]);

  return {
    speechRecognitionSupported,
    speechSynthesisSupported,
    isListening,
    isSpeaking,
    startListening,
    stopListening,
    speak,
    stopSpeaking,
  };
}
