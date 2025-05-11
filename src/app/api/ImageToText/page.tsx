'use client';
import { useState } from 'react';
import Tesseract from 'tesseract.js';

export default function ImageToText() {
  const [image, setImage] = useState<File | null>(null);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setImage(e.target.files[0]);
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
      const result = await Tesseract.recognize(image, 'eng', {
        logger: (m) => console.log(m),
      });
      setText(result.data.text);
    } catch (err) {
      setError('Failed to extract text. Please try another image.');
    }

    setLoading(false);
  };

  return (
    <div className="max-w-xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">🖼️ Image to Text Converter (OCR)</h1>

      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="block w-full text-sm border border-gray-300 p-2 rounded"
      />

      {image && (
        <div>
          <img
            src={URL.createObjectURL(image)}
            alt="Uploaded"
            className="max-h-64 rounded shadow"
          />
        </div>
      )}

      <button
        onClick={handleConvert}
        disabled={!image || loading}
        className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
      >
        {loading ? 'Converting...' : 'Convert to Text'}
      </button>

      {text && (
        <div className="mt-4 p-4 bg-gray-100 rounded whitespace-pre-wrap border border-gray-300">
          <strong>Extracted Text:</strong>
          <p>{text}</p>
        </div>
      )}

      {error && (
        <div className="text-red-600 font-medium">
          {error}
        </div>
      )}
    </div>
  );
}
