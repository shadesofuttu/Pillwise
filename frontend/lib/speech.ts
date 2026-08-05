/**
 * Web Speech API wrapper for clear, high-accessibility text-to-speech.
 */

export function stopSpeech(): void {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}

export function speakText(
  text: string,
  language: string = 'English',
  onEnd?: () => void,
  onError?: (err: unknown) => void
): boolean {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    console.warn('Speech synthesis is not supported on this browser.');
    return false;
  }

  // Cancel any ongoing speech
  stopSpeech();

  if (!text.trim()) return false;

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 0.88; // Moderate, clear pace for accessibility
  utterance.pitch = 1.0;
  utterance.volume = 1.0;

    // Language code mapping
  const languageCodes: Record<string, string> = {
    'English': 'en',
    'Hindi': 'hi',
    'Spanish': 'es',
    'French': 'fr',
    'German': 'de',
    'Arabic': 'ar',
    'Chinese': 'zh',
    'Japanese': 'ja',
    'Portuguese': 'pt',
    'Russian': 'ru'
  };

  const langCode = languageCodes[language] || 'en';
  utterance.lang = langCode;

  // Try to pick a voice for the selected language
  const voices = window.speechSynthesis.getVoices();
  if (voices.length > 0) {
    const preferredVoice = voices.find((v) => v.lang.startsWith(langCode)) || voices[0];
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }
  }

  if (onEnd) {
    utterance.onend = onEnd;
  }
  if (onError) {
    utterance.onerror = (e) => onError(e);
  }

  window.speechSynthesis.speak(utterance);
  return true;
}
