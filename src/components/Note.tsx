'use client';
import { useEffect, useState } from 'react';

export default function NotePage() {
    const [note, setNote] = useState('');

    // Load from localStorage on mount
    useEffect(() => {
        const savedNote = localStorage.getItem('note');
        if (savedNote) {
            setNote(savedNote);
        }
    }, []);

    // Save to localStorage whenever note changes
    useEffect(() => {
        localStorage.setItem('note', note);
    }, [note]);

    return (
        <div className="min-h-screen bg-white">
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-3xl mx-auto">
                    {/* Main Note Card */}
                    <div className="bg-white rounded-lg shadow p-4">
                        <h1 className="text-2xl font-bold text-gray-800 mb-4">My Note</h1>
                        <textarea
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            placeholder="Write your note here..."
                            className="w-full h-64 p-4 text-gray-700 bg-gray-50 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none resize-none transition-all"
                        />
                        <div className="flex justify-between items-center mt-4 text-sm text-gray-500">
                            <span>Auto-saved to your browser</span>
                            <span>{note.length} characters</span>
                        </div>
                    </div>

                    {/* Additional Sections */}
                    <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Tips Section */}
                        <div className="bg-white rounded-lg shadow p-4">
                            <h2 className="text-xl font-semibold text-gray-800 mb-3">Tips</h2>
                            <ul className="space-y-2 text-gray-600">
                                <li className="flex items-start">
                                    <span className="mr-2">•</span>
                                    <span>Your notes are saved automatically</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="mr-2">•</span>
                                    <span>Access from any device with this browser</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="mr-2">•</span>
                                    <span>No account needed</span>
                                </li>
                            </ul>
                        </div>

                        {/* Quick Actions */}
                        <div className="bg-white rounded-lg shadow p-4">
                            <h2 className="text-xl font-semibold text-gray-800 mb-3">Quick Actions</h2>
                            <div className="flex flex-wrap gap-3">
                                <button 
                                    onClick={() => setNote('')}
                                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors border border-gray-300"
                                >
                                    Clear Note
                                </button>
                                <button 
                                    onClick={() => navigator.clipboard.writeText(note)}
                                    disabled={!note}
                                    className={`px-4 py-2 rounded-lg transition-colors border ${note ? 'bg-green-500 hover:bg-green-400 text-white border-green-500' : 'bg-gray-100 text-gray-400 border-gray-300 cursor-not-allowed'}`}
                                >
                                    Copy to Clipboard
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}