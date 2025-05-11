'use client';

import Navbar from '@/components/Navbar';
import { useEffect, useState } from 'react';
import Tesseract from 'tesseract.js';
import { CloudArrowUpIcon } from '@heroicons/react/24/solid';

export default function ImageToText() {
  const [image, setImage] = useState<File | null>(null);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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
    } catch (err) {
      console.error(err);
      setError('Failed to extract text. Please try another image.');
    }

    setLoading(false);
  };

  // ✅ Handle Ctrl+V paste image
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

  return (
    <div className="max-w-xl mx-auto p-6 space-y-6">
      <Navbar />

      <h1 className="text-2xl font-bold text-center">
        🖼️ Image to Text (OCR) <br /> <span className="text-green-600">Khmer + English</span>
      </h1>

      {/* Upload section */}
      <div className="border-2 border-green-500 border-dashed p-4 rounded-md text-center">
        <label className="flex justify-center items-center gap-2 cursor-pointer text-green-600 font-medium">
          <CloudArrowUpIcon className="h-6 w-6" />
          Upload Image
          <input
            type="file"
            accept="image/*"
            hidden
            onChange={handleFileChange}
          />
        </label>
        <p className="text-sm text-gray-500 mt-2">Or press <kbd>Ctrl</kbd> + <kbd>V</kbd> to paste an image</p>
      </div>

      {/* Preview */}
      {image && (
        <div className="text-center">
          <img
            src={URL.createObjectURL(image)}
            alt="Uploaded preview"
            className="max-h-64 rounded shadow mx-auto"
          />
        </div>
      )}

      {/* Convert Button */}
      <button
        onClick={handleConvert}
        disabled={!image || loading}
        className="w-full bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50 font-[Kantumruy_Pro]"
      >
        {loading ? 'កំពុងបម្លែង...' : 'បម្លែងជាអក្សរ'}
      </button>

      {/* OCR Result */}
      {text && (
        <div className="mt-4 p-4 bg-gray-100 rounded whitespace-pre-wrap border border-gray-300">
          <strong>អត្ថបទបកប្រែ:</strong>
          <p>{text}</p>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="text-red-600 font-medium">
          {error}
        </div>
      )}

      <button
        onClick={() => {
          localStorage.removeItem('auth');
          location.href = '/';
        }}
        className="mt-4 bg-red-600 text-white px-4 py-2 rounded"
      >
        Logout
      </button>

    </div>
  );
}
