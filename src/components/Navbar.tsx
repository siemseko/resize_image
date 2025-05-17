'use client';

import { useState, useRef, useEffect } from 'react';
import { LogOut, Globe, ChevronDown, User, Slack } from 'lucide-react';

export default function Navbar() {
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const languageRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (languageRef.current && !languageRef.current.contains(event.target as Node)) {
        setShowLanguageDropdown(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setShowProfileDropdown(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Replace with your actual logo
  const Logo = () => (
    <div className="flex items-center gap-3">
      <Slack strokeWidth={1}className='text-green-500' /> 
      <span>
        <div className='text-green-500'>Video editing system</div>
      </span>
    </div>
  );

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'km', name: 'ភាសាខ្មែរ' },
    { code: 'zh', name: '中文' }
  ];
  const [currentLanguage, setCurrentLanguage] = useState(languages[0]);

  return (
    <nav className="px-4 py-3 flex items-center justify-between">
      {/* Left side - Logo */}
      <div className="flex items-center">
        <Logo />
      </div>

      {/* Right side - Navigation items */}
      <div className="flex items-center space-x-4">
        {/* Language Selector */}
        <div className="relative" ref={languageRef}>
          <button
            onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
            className="flex items-center space-x-1 text-gray-600 hover:text-gray-900 transition-colors duration-200"
          >
            <Globe size={18} />
            <span className="text-sm">{currentLanguage.code.toUpperCase()}</span>
            <ChevronDown size={16} className={`transition-transform duration-200 ${showLanguageDropdown ? 'rotate-180' : ''}`} />
          </button>

          {/* Animated Language Dropdown */}
          <div className={`absolute right-0 mt-2 w-40 bg-white  shadow-lg py-1 z-10 transition-all duration-200 ease-out ${showLanguageDropdown ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-1 pointer-events-none'}`}>
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => {
                  setCurrentLanguage(lang);
                  setShowLanguageDropdown(false);
                }}
                className={`block w-full text-left px-4 py-2 text-sm transition-colors duration-100 ${currentLanguage.code === lang.code ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-100'}`}
              >
                {lang.name}
              </button>
            ))}
          </div>
        </div>

        {/* Profile & Logout */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setShowProfileDropdown(!showProfileDropdown)}
            className="flex items-center space-x-1 transition-colors duration-200"
          >
            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center transition-all duration-200 hover:bg-gray-300">
              <User size={16} className="text-gray-600" />
            </div>
          </button>

          {/* Animated Profile Dropdown */}
          <div className={`absolute right-0 mt-2 w-48 bg-white  shadow-lg py-1 z-10 transition-all duration-200 ease-out ${showProfileDropdown ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-1 pointer-events-none'}`}>
            <div className="px-4 py-2 text-sm text-gray-700 border-b transition-colors duration-100">
              <div className="font-medium">User Name</div>
              <div className="text-gray-500 text-xs">user@example.com</div>
            </div>
            <button
              onClick={() => {
                localStorage.removeItem('auth');
                console.log('Logged out');
                setShowProfileDropdown(false);
                window.location.href = '/login';
              }}
              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-100"
            >
              <LogOut size={16} className="mr-2" />
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Animation styles */}
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-5px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeOut {
          from { opacity: 1; transform: translateY(0); }
          to { opacity: 0; transform: translateY(-5px); }
        }
      `}</style>
    </nav>
  );
}