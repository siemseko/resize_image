'use client';

import { useState, useRef, useEffect } from 'react';
import { Dot, Images, LetterText, AudioLines, NotebookPen } from 'lucide-react';
import ResizeImages from '@/components/ResizeImages';
import Navbar from '@/components/Navbar';
import ImageToText from '@/components/ImageToText';
import NotePage from '@/components/Note';
import TextToVoiceHighlight from '@/components/TextToVoice';

export default function CompanyInfoForm() {
  const [activeSection, setActiveSection] = useState('general');
  const [indicatorStyle, setIndicatorStyle] = useState({ top: 0, height: 0 });
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // Update indicator position when active section changes
  useEffect(() => {
    const activeTabIndex = ['general', 'contact', 'verification', 'approval', 'address'].indexOf(activeSection);
    const activeTab = tabRefs.current[activeTabIndex];

    if (activeTab) {
      setIndicatorStyle({
        top: activeTab.offsetTop,
        height: activeTab.offsetHeight
      });
    }
  }, [activeSection]);

  return (
    <main>
      <Navbar />
      <div className="flex">
        {/* Sidebar navigation with animated indicator */}

        {/* Main form content with fade animation */}
        <div className="flex-1 flex flex-col h-screen">
          <div className="flex-1 overflow-y-auto">
            <div className="bg-white transition-opacity duration-300 min-h-full">
              {activeSection === 'general' && (
                <div className="space-y-6 animate-fadeIn">
                  <ResizeImages />
                </div>
              )}
              {activeSection === 'contact' && (
                <div className="space-y-6 animate-fadeIn">
                  <ImageToText />
                </div>
              )}

              {activeSection === 'approval' && (
                <div className="space-y-6 animate-fadeIn">
                  <TextToVoiceHighlight />
                </div>
              )}

              {activeSection === 'address' && (
                <div className="space-y-6 animate-fadeIn">
                  <NotePage />
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="w-15 md:w-64 flex-shrink-0 relative">
          <nav className="space-y-1 relative">
            {/* Animated indicator line */}
            <div
              className="absolute left-0 w-1 bg-green-500   transition-all duration-300 ease-in-out"
              style={{
                top: indicatorStyle.top + 4,
                height: indicatorStyle.height - 8
              }}
            />

            <button
              ref={el => { tabRefs.current[0] = el; }}
              onClick={() => setActiveSection('general')}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-colors duration-200 cursor-pointer ${activeSection === 'general'
                ? 'bg-blue-50 text-green-500 font-medium'
                : 'text-[#00000037] hover:bg-gray-50'
                }`}
            >
              <span className="flex items-center gap-2">
                <Images className="w-4 h-4" />
                <span className="hidden md:inline">resize images</span>
              </span>
              {activeSection === 'general' && <Dot strokeWidth={3} />}
            </button>

            <button
              ref={el => { tabRefs.current[1] = el; }}
              onClick={() => setActiveSection('contact')}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-colors duration-200 cursor-pointer ${activeSection === 'contact'
                ? 'bg-blue-50 text-green-500 font-medium'
                : 'text-[#00000037] hover:bg-gray-50'
                }`}
            >
              <span className="flex items-center gap-2">
                <LetterText className="w-4 h-4" />
                <span className="hidden md:inline">image to text</span>
              </span>
              {activeSection === 'contact' && <Dot strokeWidth={3} />}
            </button>



            <button
              ref={el => { tabRefs.current[3] = el; }}
              onClick={() => setActiveSection('approval')}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-colors duration-200 cursor-pointer ${activeSection === 'approval'
                ? 'bg-blue-50 text-green-500 font-medium'
                : 'text-[#00000037] hover:bg-gray-50'
                }`}
            >
              <span className="flex items-center gap-2">
                <AudioLines className="w-4 h-4" />
                <span className="hidden md:inline">text to voice</span>
              </span>
              {activeSection === 'approval' && <Dot strokeWidth={3} />}
            </button>

            <button
              ref={el => { tabRefs.current[4] = el; }}
              onClick={() => setActiveSection('address')}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-colors duration-200 cursor-pointer ${activeSection === 'address'
                ? 'bg-blue-50 text-green-500 font-medium'
                : 'text-[#00000037] hover:bg-gray-50'
                }`}
            >
              <span className="flex items-center gap-2">
                <NotebookPen className="w-4 h-4" />
                <span className="hidden md:inline">note</span>
              </span>
              {activeSection === 'address' && <Dot strokeWidth={3} />}
            </button>
          </nav>
        </div>

      </div>
      {/* Add CSS for animations */}
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(5px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
      `}</style>
    </main>
  );
}