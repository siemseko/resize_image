// components/LanguageSelector.tsx
'use client';

import { useState } from 'react';

type Language = 'en' | 'km';

const flags: Record<Language, string> = {
  en: '🇺🇸',
  km: '🇰🇭',
};

export default function LanguageSelector() {
  const [language, setLanguage] = useState<Language>('en');
  const [open, setOpen] = useState(false);

  const handleSelect = (lang: Language) => {
    setLanguage(lang);
    setOpen(false);
    // TODO: change app language here, e.g., using i18n
  };

  return (
    <div className="relative inline-block text-left">
      <button
        onClick={() => setOpen(!open)}
        className="inline-flex items-center px-4 py-2"
      >
        <span className="text-xl mr-2">{flags[language]}</span>
        <span className="capitalize">{language}</span>
        <svg
          className="ml-2 h-5 w-5"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.084l3.71-3.854a.75.75 0 111.08 1.04l-4.25 4.417a.75.75 0 01-1.08 0L5.21 8.27a.75.75 0 01.02-1.06z" clipRule="evenodd" />
        </svg>
      </button>

      {open && (
        <div className="absolute z-10 mt-2 w-28 bg-white border border-gray-200 rounded shadow-lg">
          {(['en', 'km'] as Language[]).map((lang) => (
            <button
              key={lang}
              onClick={() => handleSelect(lang)}
              className="flex items-center w-full px-4 py-2 hover:bg-gray-100"
            >
              <span className="text-xl mr-2">{flags[lang]}</span>
              <span className="capitalize">{lang}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
