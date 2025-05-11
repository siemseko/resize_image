'use client';
import { useState } from 'react';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { ArrowDownTrayIcon, CloudArrowUpIcon } from '@heroicons/react/24/solid';
import Navbar from '@/components/Navbar';

export default function HomePage() {
  const [files, setFiles] = useState<File[]>([]);
  const [progress, setProgress] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [resizeMode, setResizeMode] = useState<'fill' | 'cover'>('fill');

  const handleResizeAndDownload = async () => {
    if (files.length === 0) return;
    setLoading(true);
    setProgress(0);

    const zip = new JSZip();

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const resizedBlob = await resizeImageTo1280x720(file, resizeMode);
      const filename = file.name.replace(/\.[^/.]+$/, '') + '.jpg';
      zip.file(filename, resizedBlob);
      setProgress(Math.floor(((i + 1) / files.length) * 100));
    }

    const content = await zip.generateAsync({ type: 'blob' });
    saveAs(content, 'resized_images.zip');

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
          // Stretch to fill canvas (may distort)
          ctx.drawImage(img, 0, 0, 1280, 720);
        } else {
          // Preserve aspect ratio, crop as needed (like object-cover)
          const scale = Math.max(1280 / img.width, 720 / img.height);
          const newWidth = img.width * scale;
          const newHeight = img.height * scale;
          const dx = (1280 - newWidth) / 2;
          const dy = (720 - newHeight) / 2;
          ctx.drawImage(img, dx, dy, newWidth, newHeight);
        }

        canvas.toBlob((blob) => {
          if (blob) resolve(blob);
          else reject('Blob creation failed');
        }, 'image/jpeg', 0.9);
      };
      img.onerror = reject;
      img.src = URL.createObjectURL(file);
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      if (selectedFiles.length + files.length > 20) {
        alert('You can only upload up to 20 images.');
      } else {
        setFiles([...files, ...selectedFiles]);
      }
    }
  };

  const handleNewUpload = () => {
    setFiles([]);
    setProgress(0);
  };

  return (
    <div className="max-w-xl mx-auto p-6 space-y-6">
      <Navbar/>
      <h1 className="text-2xl font-bold">Resize Images to 1280x720 (Client-Side)</h1>

      {/* Resize mode selector */}
      <div className="flex items-center gap-4">
        <label className="font-medium">Resize Mode:</label>
        <button
          onClick={() => setResizeMode('fill')}
          className={`cursor-pointer px-3 py-1 rounded ${resizeMode === 'fill' ? 'bg-green-600 text-white' : 'bg-gray-200'}`}
        >
          Fill
        </button>
        <button
          onClick={() => setResizeMode('cover')}
          className={`cursor-pointer px-3 py-1 rounded ${resizeMode === 'cover' ? 'bg-green-600 text-white' : 'bg-gray-200'}`}
        >
          Cover
        </button>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2">
        <button
          onClick={handleNewUpload}
          className="bg-green-600 text-white px-4 py-2 rounded-full cursor-pointer"
        >
          New Upload
        </button>

        <button
          disabled={loading || files.length === 0}
          onClick={handleResizeAndDownload}
          className="bg-green-600 text-white px-4 py-2 rounded-full flex items-center gap-2 disabled:opacity-50 cursor-pointer disabled:cursor-no-drop"
        >
          <ArrowDownTrayIcon className="h-5 w-5" />
          {loading ? `Downloading... (${progress}%)` : 'Resize & Download ZIP'}
        </button>
      </div>

      {/* Upload Input */}
      <div className="border-2 border-green-500 border-dashed p-4 rounded-md">
        <label className="flex items-center gap-2 cursor-pointer text-green-600 font-medium">
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
      </div>
      <div className="max-w-xl mx-auto p-6 space-y-6 max-h-screen overflow-auto">
        {/* Image Preview */}
        {files.length > 0 && (
          <div className="grid grid-cols-3 gap-2">
            {files.map((file, index) => (
              <img
                key={index}
                src={URL.createObjectURL(file)}
                alt={file.name}
                className={`w-full h-24 rounded ${resizeMode === 'fill' ? 'object-fill' : 'object-cover'}`}
              />
            ))}
          </div>
        )}
      </div>
      {/* Progress bar */}
      {loading && (
        <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
          <div
            className="bg-green-600 h-2 rounded-full transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
  );
}
