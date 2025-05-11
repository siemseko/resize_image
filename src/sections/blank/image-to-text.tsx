'use client';

import { useState, useEffect } from 'react';
import Tesseract from 'tesseract.js';
import {
    Box,
    Button,
    CircularProgress,
    Paper,
    Stack,
    Typography,
} from '@mui/material';
import { Icon } from '@iconify/react';

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

    useEffect(() => {
        const handlePaste = (e: ClipboardEvent) => {
            const items = e.clipboardData?.items;
            if (items) {
                Array.from(items).forEach((item) => {
                    if (item.type.startsWith('image/')) {
                        const file = item.getAsFile();
                        if (file) {
                            setImage(file);
                            setText('');
                            setError('');
                        }
                    }
                });
            }
        };

        window.addEventListener('paste', handlePaste);
        return () => {
            window.removeEventListener('paste', handlePaste);
        };
    }, []);

    const handleUploadClick = () => {
        const fileInput = document.getElementById('image-upload') as HTMLInputElement;
        fileInput?.click();
    };

    return (
        <Box sx={{ maxWidth: 600, mx: 'auto', p: 3 }}>
            <Typography variant="h4" align="center" gutterBottom>
                🖼️ Image to Text (OCR)
            </Typography>
            <Typography variant="h6" align="center" color="green" gutterBottom>
                Khmer + English
            </Typography>

            <Paper
                variant="outlined"
                sx={{
                    borderStyle: 'dashed',
                    borderColor: 'green',
                    p: 3,
                    textAlign: 'center',
                    mb: 2,
                }}
            >
                {/* Replace the div with a button for better accessibility */}
                <Button
                    onClick={handleUploadClick}
                    sx={{ color: 'green' }}
                    startIcon={<Icon icon="mdi:upload" width={24} height={24} />}
                >
                    <Typography>Upload Image</Typography>
                </Button>
                <input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    style={{ display: 'none' }}
                />
                <Typography variant="caption" display="block" mt={1} color="gray">
                    Or press <kbd>Ctrl</kbd> + <kbd>V</kbd> to paste an image
                </Typography>
            </Paper>

            {image && (
                <Box sx={{ textAlign: 'center', mb: 2 }}>
                    <img
                        src={URL.createObjectURL(image)}
                        alt="Preview"
                        style={{
                            maxHeight: 250,
                            borderRadius: 8,
                            boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
                        }}
                    />
                </Box>
            )}

            <Button
                type="button"
                variant="contained"
                color="primary"
                fullWidth
                disabled={!image || loading}
                onClick={handleConvert}
            >
                {loading ? (
                    <>
                        <CircularProgress size={20} sx={{ mr: 1 }} />
                        កំពុងបម្លែង...
                    </>
                ) : (
                    'បម្លែងជាអក្សរ'
                )}
            </Button>

            {text && (
                <Paper variant="outlined" sx={{ mt: 3, p: 2, whiteSpace: 'pre-wrap' }}>
                    <Typography fontWeight="bold" mb={1}>
                        អត្ថបទបកប្រែ:
                    </Typography>
                    <Typography>{text}</Typography>
                </Paper>
            )}

            {error && (
                <Typography color="error" mt={2} fontWeight="medium">
                    {error}
                </Typography>
            )}
        </Box>
    );
}
