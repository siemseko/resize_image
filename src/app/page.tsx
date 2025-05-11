// 'use client';
// import { useState } from 'react';
// import { ArrowDownTrayIcon, CloudArrowUpIcon } from '@heroicons/react/24/solid';

// export default function HomePage() {
//   const [files, setFiles] = useState<File[]>([]);
//   const [progress, setProgress] = useState<number>(0);
//   const [loading, setLoading] = useState(false);

//   const handleUpload = async () => {
//     if (files.length === 0) return;

//     const formData = new FormData();
//     files.forEach((file) => formData.append('images', file));

//     setLoading(true);
//     setProgress(0);

//     const res = await fetch('/api/upload', {
//       method: 'POST',
//       body: formData,
//     });

//     if (!res.ok) {
//       alert('Upload failed');
//       setLoading(false);
//       return;
//     }

//     const reader = res.body?.getReader();
//     const chunks: Uint8Array[] = [];
//     let receivedLength = 0;

//     const contentLength = +(res.headers.get('Content-Length') || 0);

//     while (true) {
//       const { done, value } = await reader!.read();
//       if (done) break;
//       if (value) {
//         chunks.push(value);
//         receivedLength += value.length;

//         if (contentLength) {
//           setProgress(Math.floor((receivedLength / contentLength) * 100));
//         }
//       }
//     }

//     const blob = new Blob(chunks, { type: 'application/zip' });
//     const url = URL.createObjectURL(blob);
//     const a = document.createElement('a');
//     a.href = url;
//     a.download = 'resized_images.zip';
//     a.click();
//     URL.revokeObjectURL(url);

//     setLoading(false);
//     setProgress(100);
//   };

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files) {
//       const selectedFiles = Array.from(e.target.files);
//       if (selectedFiles.length + files.length > 10) {
//         alert('You can only upload up to 10 images.');
//       } else {
//         setFiles([...files, ...selectedFiles]);
//       }
//     }
//   };

//   return (
//     <div className="max-w-xl mx-auto p-6 space-y-6">
//       <h1 className="text-2xl font-bold">Resize Images to 1280x720</h1>

//       <div className="border-2 border-dashed p-4 rounded-md">
//         <label className="flex items-center gap-2 cursor-pointer text-blue-600 font-medium">
//           <CloudArrowUpIcon className="h-6 w-6" />
//           Upload Images
//           <input
//             type="file"
//             multiple
//             accept="image/*"
//             hidden
//             onChange={handleFileChange}
//           />
//         </label>
//       </div>

//       {files.length > 0 && (
//         <div className="grid grid-cols-3 gap-2">
//           {files.map((file, index) => (
//             <img
//               key={index}
//               src={URL.createObjectURL(file)}
//               alt={file.name}
//               className="w-full h-24 object-cover rounded"
//             />
//           ))}
//         </div>
//       )}

//       <button
//         disabled={loading || files.length === 0}
//         onClick={handleUpload}
//         className="bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2 disabled:opacity-50"
//       >
//         <ArrowDownTrayIcon className="h-5 w-5" />
//         {loading ? `Downloading... (${progress}%)` : 'Resize & Download ZIP'}
//       </button>

//       {loading && (
//         <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
//           <div
//             className="bg-blue-600 h-2 rounded-full transition-all"
//             style={{ width: `${progress}%` }}
//           />
//         </div>
//       )}
//     </div>
//   );
// }
'use client';
import { useState } from 'react';
import { ArrowDownTrayIcon, CloudArrowUpIcon } from '@heroicons/react/24/solid';

export default function HomePage() {
  const [files, setFiles] = useState<File[]>([]);
  const [progress, setProgress] = useState<number>(0);
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (files.length === 0) return;

    const formData = new FormData();
    files.forEach((file) => formData.append('images', file));

    setLoading(true);
    setProgress(0);

    const res = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    if (!res.ok) {
      alert('Upload failed');
      setLoading(false);
      return;
    }

    const reader = res.body?.getReader();
    const chunks: Uint8Array[] = [];
    let receivedLength = 0;

    const contentLength = +(res.headers.get('Content-Length') || 0);

    while (true) {
      const { done, value } = await reader!.read();
      if (done) break;
      if (value) {
        chunks.push(value);
        receivedLength += value.length;

        if (contentLength) {
          setProgress(Math.floor((receivedLength / contentLength) * 100));
        }
      }
    }

    const blob = new Blob(chunks, { type: 'application/zip' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'resized_images.zip';
    a.click();
    URL.revokeObjectURL(url);

    setLoading(false);
    setProgress(100);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      if (selectedFiles.length + files.length > 10) {
        alert('You can only upload up to 10 images.');
      } else {
        setFiles([...files, ...selectedFiles]);
      }
    }
  };

  // Reset the selected files
  const handleNewUpload = () => {
    setFiles([]);
    setProgress(0);
  };

  return (
    <div className="max-w-xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Resize Images to 1280x720</h1>
      <div className="flex items-center gap-2">
        <button
          onClick={handleNewUpload}
          className="bg-green-600 text-white px-4 py-2 rounded-full cursor-pointer"
        >
          New Upload
        </button>

        <button
          disabled={loading || files.length === 0}
          onClick={handleUpload}
          className="bg-green-600 text-white px-4 py-2 rounded-full flex items-center gap-2 disabled:opacity-50 cursor-pointer disabled:cursor-no-drop"
        >
          <ArrowDownTrayIcon className="h-5 w-5" />
          {loading ? `Downloading... (${progress}%)` : 'Resize & Download ZIP'}
        </button>

      </div>
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

      {files.length > 0 && (
        <div className="grid grid-cols-3 gap-2">
          {files.map((file, index) => (
            <img
              key={index}
              src={URL.createObjectURL(file)}
              alt={file.name}
              className="w-full h-24 object-cover rounded"
            />
          ))}
        </div>
      )}
      {loading && (
        <div className="w-full bg-gray-200 rounded-full h-2 mt-2 ">
          <div
            className="bg-green-600 h-2 rounded-full transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
  );
}
