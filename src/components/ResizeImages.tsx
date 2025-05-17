'use client';
import { useState, useEffect, useRef } from 'react';
import { CloudArrowUpIcon } from '@heroicons/react/24/solid';
import { ArrowDownToLine,Plus } from 'lucide-react';

export default function ResizeImages() {
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
        <div className="container mx-auto p-4">
            <div className="flex flex-col lg:flex-row gap-6">
                {/* Left Column - Image Grid */}
                <div className="lg:w-3/4">
                    <div className="bg-white rounded-lg shadow p-4">
                        <h2 className="text-lg font-semibold mb-4">Image Preview</h2>
                        <div
                            ref={pasteRef}
                            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 max-h-[70vh] overflow-auto"
                        >
                            {files.length === 0 ? (
                                <div className="col-span-full flex flex-col items-center justify-center h-100 text-gray-400">
                                    <div className="grid grid-cols-4 gap-2 mb-4">
                                        {[...Array(9)].map((_, index) => (
                                            <div key={index} className="w-50 h-16 border-2 border-dashed border-gray-300 rounded"></div>
                                        ))}
                                    </div>
                                    <p>No images uploaded</p>
                                    <p className="text-sm mt-2">Paste or upload images to begin</p>
                                </div>
                            ) : (
                                files.map((file, idx) => (
                                    <div key={idx} className="relative group">
                                        <img
                                            src={URL.createObjectURL(file)}
                                            alt={`preview-${idx}`}
                                            className={`w-full h-32 rounded-md ${resizeMode === 'cover' ? 'object-cover' : 'object-fill'}`}
                                        />
                                        <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-1 text-xs truncate">
                                            {file.name}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Column - Controls */}
                <div className="lg:w-1/4 space-y-4">
                    <div className="bg-white rounded-lg shadow p-4">
                        <h2 className="text-lg font-semibold mb-4">Controls</h2>
                        
                        {/* Upload Section */}
                        <div className="mb-6">
                            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    <CloudArrowUpIcon className="w-8 h-8 text-gray-400 mb-2" />
                                    <p className="text-sm text-gray-500">
                                        <span className="font-semibold">Click to upload</span> or drag and drop
                                    </p>
                                    <p className="text-xs text-gray-500">PNG, JPG, GIF (MAX. 10MB)</p>
                                </div>
                                <input 
                                    type="file" 
                                    multiple 
                                    accept="image/*" 
                                    className="hidden" 
                                    onChange={handleFileChange} 
                                />
                            </label>
                            <p className="text-xs text-gray-500 mt-2 text-center">Or press <kbd>Ctrl</kbd> + <kbd>V</kbd> to paste</p>
                        </div>

                        {/* Progress Bar */}
                        {loading && (
                            <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
                                <div 
                                    className="bg-green-500 h-2.5 rounded-full transition-all" 
                                    style={{ width: `${progress}%` }}
                                ></div>
                            </div>
                        )}

                        {/* Resize Mode Toggle */}
                        <div className="flex items-center justify-between mb-6">
                            <label className="text-sm font-medium text-gray-700">Resize Mode:</label>
                            <div className="flex items-center">
                                <span className={`text-sm mr-2 ${resizeMode === 'fill' ? 'font-bold' : 'text-gray-500'}`}>Fill</span>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="sr-only peer"
                                        checked={resizeMode === 'cover'}
                                        onChange={toggleResizeMode}
                                    />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:bg-green-500 transition-colors"></div>
                                    <div className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform transform peer-checked:translate-x-5"></div>
                                </label>
                                <span className={`text-sm ml-2 ${resizeMode === 'cover' ? 'font-bold' : 'text-gray-500'}`}>Cover</span>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-3">
                            <button
                                onClick={handleNewUpload}
                                disabled={files.length === 0}
                                className="flex items-center justify-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded-lg flex-1 transition-colors disabled:opacity-50"
                            >
                                <Plus size={18} />
                                <span>Clear</span>
                            </button>
                            <button
                                onClick={handleResizeAndDownload}
                                disabled={loading || files.length === 0}
                                className="flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg flex-1 transition-colors disabled:opacity-50"
                            >
                                {loading ? (
                                    <>
                                        <ArrowDownToLine size={18} />
                                        <span>{progress}%</span>
                                    </>
                                ) : (
                                    <>
                                        <ArrowDownToLine size={18} />
                                        <span>Download</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Status Info */}
                    <div className="bg-white rounded-lg shadow p-4">
                        <h3 className="font-medium mb-2">Status</h3>
                        <div className="text-sm space-y-1">
                            <div className="flex justify-between">
                                <span className="text-gray-500">Images:</span>
                                <span>{files.length}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">Resize Mode:</span>
                                <span className="capitalize">{resizeMode}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">Target Size:</span>
                                <span>1280×720px</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}