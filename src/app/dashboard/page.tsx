'use client';
import { useState, useEffect, useRef } from 'react';
import {  CloudArrowUpIcon } from '@heroicons/react/24/solid';
import { ArrowDownToLine, Images, Plus } from 'lucide-react';

export default function ImageUploader() {
  const [files, setFiles] = useState<File[]>([]);
  const [progress, setProgress] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [resizeMode, setResizeMode] = useState<'fill' | 'cover'>('cover');
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


  const toggleResizeMode = () => {
    setResizeMode(prev => (prev === 'fill' ? 'cover' : 'fill'));
  };
  return (
    <>
      {/* <Navbar /> */}

      <div className="max-w-screen-sm  mx-auto p-2 space-y-6">

        {/* <h1 className="text-2xl font-bold">Upload or Paste Images (1280x720 Resize)</h1> */}

        {/* Resize mode selector */}
        <div className="flex items-center gap-4">
          <label className="font-medium">Resize Mode:</label>

          <div className="flex items-center gap-2">


            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={resizeMode === 'cover'}
                onChange={toggleResizeMode}
              />
              <div className="w-11 h-6 bg-[#39383d] peer-focus:outline-none rounded-full peer peer-checked:bg-[#2fd159] transition-all"></div>
              <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform transform peer-checked:translate-x-5"></div>
            </label>
            <span className="text-sm">{resizeMode === 'fill' ? 'Fill' : 'Cover'}</span>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-2">
          <button
            onClick={handleNewUpload}
            className="bg-[#1c1c1c] text-white px-4 py-2 cursor-pointer rounded-[8px] "
          >
            <Plus />
          </button>
          <button
            onClick={handleResizeAndDownload}
            disabled={loading || files.length === 0}
            className="bg-[#2fd159] text-white rounded-[8px] px-4 py-2 flex items-center gap-2 disabled:opacity-50 cursor-pointer"
          >
            {loading ? (<><ArrowDownToLine /> {`(${progress}%)`} </>) : (<ArrowDownToLine />)}

          </button>
        </div>

        {/* Upload Input */}
        <div className="bg-[#1c1c1c] rounded-[8px] p-4">
          <label className="flex items-center gap-2 text-[#ffffff] font-medium cursor-pointer">
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
          className="grid grid-cols-4 gap-2 max-h-90 overflow-auto bg-[#1c1c1c]  rounded-[8px] p-2 black-scrollbar"
        >
          {files.length === 0 ? (
            <div className="col-span-4 flex items-center justify-center ">
              <Images strokeWidth={0.5} size={200} color="#8f8e9357"   />
            </div>

          ) : (
            files.map((file, idx) => (
              <img
                key={idx}
                src={URL.createObjectURL(file)}
                alt={`preview-${idx}`}
                className={`w-full h-24 ${resizeMode === 'cover' ? 'object-cover' : 'object-fill'
                  }`}
              />
            ))
          )}
        </div>


        {/* Progress bar */}
        {loading && (
          <div className="w-full bg-gray-200 h-2 ">
            <div
              className="bg-[#1c1c1c] h-2 transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}
      </div>
    </>
  );
}
