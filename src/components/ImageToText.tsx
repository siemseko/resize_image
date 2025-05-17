'use client';

import { useEffect, useState } from 'react';
import Tesseract from 'tesseract.js';
import { CloudArrowUpIcon } from '@heroicons/react/24/solid';
import { Copy } from 'lucide-react';

export default function ImageToText() {
  const [image, setImage] = useState<File | null>(null);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [copySuccess, setCopySuccess] = useState('');

  // Load saved history on mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('ocrHistory');
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }
  }, []);

  // Auto-convert when image changes
  useEffect(() => {
    if (image) {
      handleConvert();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [image]);

  const handleConvert = async () => {
    if (!image) return;
    setLoading(true);
    setText('');
    setError('');

    try {
      const result = await Tesseract.recognize(image, 'khm+eng', {
        logger: (m) => console.log(m),
      });
      const extracted = result.data.text.trim();
      setText(extracted);

      const updatedHistory = [extracted, ...history].slice(0, 10);
      setHistory(updatedHistory);
      localStorage.setItem('ocrHistory', JSON.stringify(updatedHistory));
    } catch (err) {
      console.error(err);
      setError('Failed to extract text. Please try another image.');
    }

    setLoading(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setText('');
      setError('');
    }
  };

  // Ctrl+V paste support
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (items) {
        for (const item of items) {
          if (item.type.startsWith('image/')) {
            const file = item.getAsFile();
            if (file) {
              setImage(file);
              setText('');
              setError('');
            }
          }
        }
      }
    };

    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, []);

  const handleCopyText = () => {
    if (text) {
      navigator.clipboard.writeText(text).then(() => {
        setCopySuccess('Copied!');
        setTimeout(() => setCopySuccess(''), 2000);
      }).catch((err) => {
        console.error('Failed to copy text: ', err);
      });
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left Column - Image Preview */}
        <div className="lg:w-1/2">
          <div className="bg-white rounded-lg shadow p-4">
            {/* Upload section */}
            <div className="mb-4">
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <CloudArrowUpIcon className="w-8 h-8 text-gray-500 mb-2" />
                  <p className="text-sm text-gray-600">
                    <span className="font-semibold">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Or paste (Ctrl+V) an image</p>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={handleFileChange}
                />
              </label>
            </div>

            {/* Image preview */}
            {image && (
              <div className="mt-4">
                <img
                  src={URL.createObjectURL(image)}
                  alt="Uploaded preview"
                  className="max-h-96 w-full object-contain mx-auto rounded-lg border border-gray-200"
                />
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Text Results */}
        <div className="lg:w-1/2">
          <div className="bg-white rounded-lg shadow p-4">
            {/* OCR result */}
            <div className="flex-1">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-lg font-semibold text-gray-800">Extracted Text</h2>
                <button
                  onClick={handleCopyText}
                  disabled={!text || loading}
                  className={`flex items-center gap-1 px-3 py-2 rounded-[8px] text-white ${text && !loading ? 'bg-green-500 hover:bg-green-400' : 'bg-gray-400 cursor-not-allowed'} transition-colors`}
                >
                  <Copy className="h-4 w-4" />
                  <span>{copySuccess || 'Copy'}</span>
                </button>
              </div>
              
              <textarea
                value={loading ? 'Extracting text...' : text}
                onChange={(e) => setText(e.target.value)}
                className="w-full h-64 p-3 outline-none bg-gray-50 rounded-lg text-gray-800 border border-gray-300 resize-none"
                readOnly={loading}
              />
              
              {error && <div className="text-red-500 mt-2 text-sm">{error}</div>}
            </div>

            {/* History */}
            {history.length > 0 && (
              <div className="mt-4">
                <h3 className="font-medium mb-2 text-gray-800">Recent Extractions</h3>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {history.map((item, index) => (
                    <div 
                      key={index} 
                      className="p-2 bg-gray-50 rounded cursor-pointer hover:bg-gray-100 transition-colors border border-gray-200"
                      onClick={() => setText(item)}
                    >
                      <p className="text-sm line-clamp-2 text-gray-700">{item}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}