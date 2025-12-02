export const speak = (text: string, onEnd?: () => void) => {
  if (!('speechSynthesis' in window)) return;

  // Cancel any ongoing speech
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'tr-TR'; // Turkish
  utterance.rate = 0.9; // Slightly slower for kids
  utterance.pitch = 1.1; // Slightly higher pitch for friendliness
  utterance.volume = 1.0;

  if (onEnd) {
    utterance.onend = onEnd;
  }

  window.speechSynthesis.speak(utterance);
};

export const playSoundEffect = (type: 'success' | 'click' | 'pop') => {
  // Simulating sound effects with simplified oscillators would be complex here.
  // We will rely on visual feedback and TTS for this prototype.
  // In a real app, we would play Audio objects here.
};