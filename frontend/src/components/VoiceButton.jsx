import { useState } from 'react';
import { Mic, MicOff, Loader2 } from 'lucide-react';

export default function VoiceButton({ onResult }) {
  const [listening, setListening] = useState(false);
  const [supported] = useState('webkitSpeechRecognition' in window || 'SpeechRecognition' in window);

  const startListening = () => {
    if (!supported) {
      alert('Voice input is not supported in this browser');
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'hi-IN';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => setListening(true);
    recognition.onend = () => setListening(false);
    recognition.onerror = () => setListening(false);

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      onResult?.(transcript);
    };

    recognition.start();
  };

  if (!supported) return null;

  return (
    <button
      onClick={startListening}
      disabled={listening}
      className={`p-3 rounded-xl transition-all duration-300 flex items-center gap-2
        ${listening
          ? 'bg-red-500 text-white animate-pulse shadow-lg shadow-red-500/30'
          : 'bg-primary-100 text-primary-800 hover:bg-primary-200 hover:shadow-md'
        }`}
      title="Speak to search"
    >
      {listening ? (
        <><Loader2 className="w-5 h-5 animate-spin" /> Listening...</>
      ) : (
        <><Mic className="w-5 h-5" /> Voice Input</>
      )}
    </button>
  );
}
