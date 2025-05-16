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
        <div className="max-w-screen-sm mx-auto p-2 space-y-6">
            <div style={{ padding: 20 }} className='bg-[#1c1c1e] rounded-[8px]'>
                <h1>My Note</h1>
                <textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    rows={10}
                    cols={50}
                    placeholder="Write your note here..."
                    style={{ padding: 10, fontSize: 16 }}
                    className="w-full mt-2 p-2 outline-none bg-[#1c1c1c] rounded-[8px] black-scrollbar"
                />
            </div>
        </div>
    );
}
