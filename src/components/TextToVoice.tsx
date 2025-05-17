'use client';
import React, { useState, useRef } from 'react';

const TextToVoiceHighlight: React.FC = () => {
  const [text, setText] = useState('');
  const [speaking, setSpeaking] = useState(false);
  const [currentWordIndex, setCurrentWordIndex] = useState(-1);
  const words = text.trim().split(/\s+/);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const handleSpeak = () => {
    if (!text) return;

    if ('speechSynthesis' in window) {
      if (speechSynthesis.speaking) {
        speechSynthesis.cancel();
        setSpeaking(false);
        setCurrentWordIndex(-1);
        if (timerRef.current) clearTimeout(timerRef.current);
        return;
      }

      setSpeaking(true);
      setCurrentWordIndex(0);

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 1;

      const approxDuration = 1000 * (text.length / 10);
      const wordDuration = approxDuration / words.length;

      let i = 0;
      const highlightNextWord = () => {
        if (i < words.length) {
          setCurrentWordIndex(i);
          i++;
          timerRef.current = setTimeout(highlightNextWord, wordDuration);
        } else {
          setCurrentWordIndex(-1);
          setSpeaking(false);
        }
      };
      highlightNextWord();

      utterance.onend = () => {
        setCurrentWordIndex(-1);
        setSpeaking(false);
        if (timerRef.current) clearTimeout(timerRef.current);
      };

      speechSynthesis.speak(utterance);
    } else {
      alert('Your browser does not support Text-to-Speech.');
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold text-gray-800 mb-4 text-center">Text to Voice with Word Highlight</h2>
      
      <textarea
        rows={5}
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Enter text here"
        className="w-full p-3 border border-gray-300 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-colors"
        disabled={speaking}
      />
      
      <div className="flex justify-center mt-4">
        <button
          onClick={handleSpeak}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            speaking 
              ? 'bg-red-500 hover:bg-red-600 text-white' 
              : 'bg-green-500 hover:bg-green-600 text-white'
          }`}
        >
          {speaking ? 'Stop' : 'Speak'}
        </button>
      </div>

      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <p className="text-gray-700 leading-relaxed">
          {words.map((word, idx) => (
            <span
              key={idx}
              className={`inline-block mr-1 px-1 rounded transition-colors ${
                idx === currentWordIndex 
                  ? 'bg-yellow-200 text-gray-900' 
                  : 'text-gray-700'
              }`}
              title={idx === currentWordIndex ? 'Speaking...' : ''}
            >
              {word}
            </span>
          ))}
        </p>
      </div>
    </div>
  );
};

export default TextToVoiceHighlight;