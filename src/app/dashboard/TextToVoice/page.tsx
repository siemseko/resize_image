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
    <div
      style={{ maxWidth: 500, margin: '2rem auto', textAlign: 'center', fontFamily: 'sans-serif' }}
      className='bg-[#1c1c1c] rounded-[8px]'
    >
      <h2>Text to Voice with Word Highlight</h2>
      <textarea
        rows={5}
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Enter text here"
        style={{ width: '100%', padding: '0.5rem', fontSize: '1rem' }}
        disabled={speaking}
        className='outline-none bg-[#1c1c1c] rounded-[8px] black-scrollbar'
      />
      <button
        onClick={handleSpeak}
        style={{ marginTop: '1rem', padding: '0.5rem 1rem' }}
      >
        {speaking ? 'Stop' : 'Speak'}
      </button>

      <p
        style={{ marginTop: '2rem', fontSize: '1.2rem', lineHeight: '1.5' }}
      >
        {words.map((word, idx) => (
          <span
            key={idx}
            style={{
              backgroundColor: idx === currentWordIndex ? 'yellow' : 'transparent',
              cursor: 'default',
              transition: 'background-color 0.3s ease',
              marginRight: '0.25rem',
              padding: '0 2px',
              borderRadius: '3px',
            }}
            title={idx === currentWordIndex ? 'Speaking...' : ''}
          >
            {word}
          </span>
        ))}
      </p>
    </div>
  );
};

export default TextToVoiceHighlight;
