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

      const updatedHistory = [extracted, ...history].slice(0, 5);
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
        setCopySuccess('Text copied to clipboard!');
        setTimeout(() => setCopySuccess(''), 3000);
      }).catch((err) => {
        console.error('Failed to copy text: ', err);
      });
    }
  };

  return (
    <>
      {/* <Navbar /> */}
      <div className="max-w-screen-sm mx-auto p-2 space-y-6">
        {/* Upload section */}
        <div className="bg-[#1c1c1c] rounded-[8px] p-4 text-center">
          <label className="flex justify-center items-center gap-2 cursor-pointer text-[#ffffff] font-medium">
            <CloudArrowUpIcon className="h-6 w-6" />
            Upload Image
            <input
              type="file"
              accept="image/*"
              hidden
              onChange={handleFileChange}
            />
          </label>
          <p className="text-sm text-gray-500 mt-2">
            Or press <kbd>Ctrl</kbd> + <kbd>V</kbd> to paste an image
          </p>
        </div>

        {/* Image preview */}
        {image && (
          <div className="text-center">
            <img
              src={URL.createObjectURL(image)}
              alt="Uploaded preview"
              className="max-h-64 shadow mx-auto"
            />
          </div>
        )}

        {/* OCR result */}
        <div className="mt-4 p-1">
          <div className="flex justify-between items-center">
            <strong>Translated Text:</strong>
            <button
              onClick={handleCopyText}
              className="bg-[#1c1c1c] text-white cursor-pointer"
            >
              {copySuccess ? (
                <Copy className="h-5 w-5" color="#908f94" />
              ) : (
                <Copy className="h-5 w-5" color="#ffffff" />
              )}
            </button>
          </div>
          <textarea
            value={loading ? 'Converting...' : text}
            onChange={(e) => setText(e.target.value)}
            className="w-full mt-2 p-2 outline-none bg-[#1c1c1c] rounded-[8px] black-scrollbar text-white"
            rows={6}
            readOnly={loading}
          />
        </div>

        {/* Error */}
        {error && <div className="text-red-600 font-medium">{error}</div>}

        {/* History */}
        {history.length > 0 && (
          <div className="mt-6">
            <h3 className="text-xl font-semibold">Last 5 OCR Results</h3>
            <ul className="mt-2 space-y-2">
              {history.map((item, index) => (
                <li key={index} className="p-4 bg-[#3a3a3c] rounded-lg">
                  <pre className="whitespace-pre-wrap">{item}</pre>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </>
  );
}
