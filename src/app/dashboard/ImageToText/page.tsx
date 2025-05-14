'use client';

import Navbar from '@/components/Navbar';
import { useEffect, useState } from 'react';
import Tesseract from 'tesseract.js';
import { CloudArrowUpIcon } from '@heroicons/react/24/solid';
import { ClipboardIcon } from '@heroicons/react/24/outline';

export default function ImageToText() {
  const [image, setImage] = useState<File | null>(null);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [copySuccess, setCopySuccess] = useState(''); // State for success message

  // Retrieve history from localStorage on page load
  useEffect(() => {
    const savedHistory = localStorage.getItem('ocrHistory');
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setText('');
      setError('');
    }
  };

  const handleConvert = async () => {
    if (!image) return;
    setLoading(true);
    setText('');
    setError('');

    try {
      const result = await Tesseract.recognize(image, 'khm+eng', {
        logger: (m) => console.log(m),
      });
      setText(result.data.text);

      // Add the new result to history and keep only the last 5 texts
      setHistory((prevHistory) => {
        const newHistory = [result.data.text, ...prevHistory];
        const updatedHistory = newHistory.slice(0, 5);  // Keep only the last 5
        // Save the updated history to localStorage
        localStorage.setItem('ocrHistory', JSON.stringify(updatedHistory));
        return updatedHistory;
      });
    } catch (err) {
      console.error(err);
      setError('Failed to extract text. Please try another image.');
    }

    setLoading(false);
  };

  // Handle Ctrl+V paste image
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
    return () => {
      window.removeEventListener('paste', handlePaste);
    };
  }, []);

  // Function to copy the extracted text to clipboard
  const handleCopyText = () => {
    if (text) {
      navigator.clipboard.writeText(text).then(() => {
        setCopySuccess('Text copied to clipboard!');
        setTimeout(() => setCopySuccess(''), 3000); // Hide after 3 seconds
      }).catch((err) => {
        console.error('Failed to copy text: ', err);
      });
    }
  };

  return (
    <>
      <Navbar />
      <div className="max-w-screen-sm  mx-auto p-2 space-y-6">
        {/* Upload section */}
        <div className="border-2 border-[#df9c16] border-dashed p-4 text-center">
          <label className="flex justify-center items-center gap-2 cursor-pointer text-[#df9c16] font-medium">
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

        {/* Preview */}
        {image && (
          <div className="text-center">
            <img
              src={URL.createObjectURL(image)}
              alt="Uploaded preview"
              className="max-h-64 shadow mx-auto"
            />
          </div>
        )}

        {/* Convert Button */}
        <button
          onClick={handleConvert}
          disabled={!image || loading}
          className="w-full bg-[#df9c16] text-white px-4 py-2 disabled:opacity-50 font-[Kantumruy_Pro] cursor-pointer"
        >
          {loading ? 'កំពុងបម្លែង...' : 'បម្លែងជាអក្សរ'}
        </button>

        {/* OCR Result */}
        {/* {text && ( */}
        <div className="mt-4 p-1 border-2 border-[#df9c16] border-dashed">
          <strong>អត្ថបទបកប្រែ:</strong>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)} // Allow user to edit text
            className="w-full mt-2 p-2 outline-none "
            rows={6}
          />

          {/* Copy Text Button */}
          <button
            onClick={handleCopyText}
            className="mt-2 w-full bg-[#df9c16] text-white px-4 py-2 font-[Kantumruy_Pro] cursor-pointer flex items-center justify-center gap-2"
          >
            <ClipboardIcon className="h-5 w-5" /> {/* Add the icon here */}
            {copySuccess ? (
              <div className="mt-2 text-green-600 font-medium">{copySuccess}</div>
            ) : (
              <div className="mt-2 text-white font-medium">Copy Text</div>
            )}
          </button>
        </div>
        {/* )} */}

        {/* Error Message */}
        {error && <div className="text-red-600 font-medium">{error}</div>}

        {/* History of last 5 texts */}
        {history.length > 0 && (
          <div className="mt-6">
            <h3 className="text-xl font-semibold">Last 5 OCR Results</h3>
            <ul className="mt-2 space-y-2">
              {history.map((item, index) => (
                <li key={index} className="p-4 bg-gray-200 rounded-lg">
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
