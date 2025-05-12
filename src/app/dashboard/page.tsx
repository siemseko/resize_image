'use client';
import { useState, useEffect, useRef } from 'react';
import { ArrowDownTrayIcon, CloudArrowUpIcon } from '@heroicons/react/24/solid';
import Navbar from '@/components/Navbar';

export default function ImageUploader() {
  const [files, setFiles] = useState<File[]>([]);
  const [progress, setProgress] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [resizeMode, setResizeMode] = useState<'fill' | 'cover'>('fill');
  const pasteRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handlePaste = (event: ClipboardEvent) => {
      const items = event.clipboardData?.items;
      if (items) {
        const images = Array.from(items)
          .filter(item => item.type.startsWith('image/'))
          .map(item => item.getAsFile())
          .filter((f): f is File => f !== null);
        if (images.length > 0) {
          setFiles(prev => [...prev, ...images]);
        }
      }
    };
    document.addEventListener('paste', handlePaste);
    return () => document.removeEventListener('paste', handlePaste);
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files).filter(f => f.type.startsWith('image/'));
      setFiles(prev => [...prev, ...selectedFiles]);
    }
  };

  const handleNewUpload = () => {
    setFiles([]);
    setProgress(0);
  };

  const handleResizeAndDownload = async () => {
    if (files.length === 0) return;
    setLoading(true);
    setProgress(0);

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const resizedBlob = await resizeImageTo1280x720(file, resizeMode);
      const filename = file.name.replace(/\.[^/.]+$/, '') + '.jpg';

      const url = URL.createObjectURL(resizedBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.style.display = 'none';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setProgress(Math.floor(((i + 1) / files.length) * 100));
    }

    setLoading(false);
    setProgress(100);
  };

  const resizeImageTo1280x720 = (file: File, mode: 'fill' | 'cover'): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = 1280;
        canvas.height = 720;
        const ctx = canvas.getContext('2d');
        if (!ctx) return reject('Canvas not supported');

        if (mode === 'fill') {
          ctx.drawImage(img, 0, 0, 1280, 720);
        } else {
          const scale = Math.max(1280 / img.width, 720 / img.height);
          const newWidth = img.width * scale;
          const newHeight = img.height * scale;
          const dx = (1280 - newWidth) / 2;
          const dy = (720 - newHeight) / 2;
          ctx.drawImage(img, dx, dy, newWidth, newHeight);
        }

        canvas.toBlob(blob => blob ? resolve(blob) : reject('Blob creation failed'), 'image/jpeg', 0.9);
      };
      img.onerror = reject;
      img.src = URL.createObjectURL(file);
    });
  };

  return (
    <>
      <Navbar />

      <div className="max-w-xl mx-auto p-6 space-y-6">

        <h1 className="text-2xl font-bold">Upload or Paste Images (1280x720 Resize)</h1>

        {/* Resize mode selector */}
        <div className="flex gap-4 items-center">
          <label className="font-medium">Resize Mode:</label>
          {['fill', 'cover'].map(mode => (
            <button
              key={mode}
              onClick={() => setResizeMode(mode as 'fill' | 'cover')}
              className={`px-3 py-1 ${resizeMode === mode ? 'bg-green-600 text-white' : 'bg-gray-300'
                }`}
            >
              {mode}
            </button>
          ))}
        </div>

        {/* Buttons */}
        <div className="flex gap-2">
          <button
            onClick={handleNewUpload}
            className="bg-green-600 text-white px-4 py-2"
          >
            New Upload
          </button>
          <button
            onClick={handleResizeAndDownload}
            disabled={loading || files.length === 0}
            className="bg-green-600 text-white px-4 py-2 flex items-center gap-2 disabled:opacity-50"
          >
            <ArrowDownTrayIcon className="h-5 w-5" />
            {loading ? `Downloading... (${progress}%)` : 'Resize & Download'}
          </button>
        </div>

        {/* Upload Input */}
        <div className="border-2 border-green-500 border-dashed p-4">
          <label className="flex items-center gap-2 text-green-600 font-medium cursor-pointer">
            <CloudArrowUpIcon className="h-6 w-6" />
            Upload Images
            <input
              type="file"
              multiple
              accept="image/*"
              hidden
              onChange={handleFileChange}
            />
          </label>
          <p className="text-sm mt-2 text-gray-500">Or press <kbd>Ctrl</kbd> + <kbd>V</kbd> to paste an image</p>
        </div>

        {/* Preview */}
        <div
          ref={pasteRef}
          className="grid grid-cols-3 gap-2 max-h-80 overflow-auto border-2 border-green-500 border-dashed p-2"
        >
          {files.map((file, idx) => (
            <img
              key={idx}
              src={URL.createObjectURL(file)}
              alt={`preview-${idx}`}
              className={`w-full h-24 ${resizeMode === 'cover' ? 'object-cover' : 'object-fill'
                }`}
            />
          ))}
        </div>

        {/* Progress bar */}
        {loading && (
          <div className="w-full bg-gray-200 h-2 ">
            <div
              className="bg-green-600 h-2 transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}
      </div>
    </>
  );
}
