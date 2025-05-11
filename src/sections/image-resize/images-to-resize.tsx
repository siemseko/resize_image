'use client';

import { Box, Button, Grid, LinearProgress, Paper, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material';
import { saveAs } from 'file-saver';
import JSZip from 'jszip';
import { useState } from 'react';

export default function ImagesResize() {
    const [files, setFiles] = useState<File[]>([]);
    const [progress, setProgress] = useState<number>(0);
    const [loading, setLoading] = useState(false);
    const [resizeMode, setResizeMode] = useState<'fill' | 'cover'>('fill');

    const handleResizeAndDownload = async () => {
        if (files.length === 0) return;
        setLoading(true);
        setProgress(0);

        const zip = new JSZip();

        const resizePromises = files.map(async (file, i) => {
            const resizedBlob = await resizeImageTo1280x720(file, resizeMode);
            const filename = `${file.name.replace(/\.[^/.]+$/, '')}.jpg`;
            zip.file(filename, resizedBlob);
            setProgress(Math.floor(((i + 1) / files.length) * 100));
        });

        await Promise.all(resizePromises);

        const content = await zip.generateAsync({ type: 'blob' });
        saveAs(content, 'resized_images.zip');

        setLoading(false);
        setProgress(100);
    };
    const resizeImageTo1280x720 = (file: File, mode: 'fill' | 'cover'): Promise<Blob> =>
        new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                canvas.width = 1280;
                canvas.height = 720;
                const ctx = canvas.getContext('2d');
                if (!ctx) {
                    reject(new Error('Canvas 2D context not supported'));
                    return; // Early exit if ctx is null
                }

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

                canvas.toBlob((blob) => {
                    if (blob) resolve(blob);
                    else reject(new Error('Blob creation failed'));
                }, 'image/jpeg', 0.9);
            };
            img.onerror = () => reject(new Error('Image load failed'));
            img.src = URL.createObjectURL(file);
        });

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const selectedFiles = Array.from(e.target.files);
            if (selectedFiles.length + files.length > 20) {
                alert('You can only upload up to 20 images.');
            } else {
                setFiles((prevFiles) => [...prevFiles, ...selectedFiles]);
            }
        }
    };

    const handleNewUpload = () => {
        setFiles([]);
        setProgress(0);
    };

    return (
        <Box maxWidth="md" mx="auto" p={3}>
            <Typography variant="h4" gutterBottom>
                Resize Images to 1280x720
            </Typography>

            <Box my={2}>
                <Typography variant="subtitle1">Resize Mode:</Typography>
                <ToggleButtonGroup
                    value={resizeMode}
                    exclusive
                    onChange={(_, newMode) => newMode && setResizeMode(newMode)}
                    aria-label="resize mode"
                    sx={{ mt: 1 }}
                >
                    <ToggleButton value="fill">Fill</ToggleButton>
                    <ToggleButton value="cover">Cover</ToggleButton>
                </ToggleButtonGroup>
            </Box>

            <Box my={2} display="flex" gap={2}>
                <Button variant="outlined" onClick={handleNewUpload}>
                    New Upload
                </Button>
                <Button
                    variant="contained"
                    color="primary"
                    disabled={loading || files.length === 0}
                    onClick={handleResizeAndDownload}
                >
                    {loading ? `Downloading... (${progress}%)` : 'Resize & Download ZIP'}
                </Button>
            </Box>

            <Paper
                variant="outlined"
                sx={{ borderStyle: 'dashed', borderColor: 'primary.main', p: 3, mb: 2 }}
            >
                <label htmlFor="image-upload" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                    <Typography color="primary">Upload Images</Typography>
                    <input
                        id="image-upload"
                        type="file"
                        hidden
                        multiple
                        accept="image/*"
                        onChange={handleFileChange}
                    />
                </label>
            </Paper>

            {files.length > 0 && (
                <Grid container spacing={2}>
                    {files.map((file, index) => (
                        <Grid item xs={4} key={index}>
                            <img
                                src={URL.createObjectURL(file)}
                                alt={file.name}
                                style={{
                                    width: '100%',
                                    height: 96,
                                    objectFit: resizeMode,
                                    borderRadius: 8,
                                }}
                            />
                        </Grid>
                    ))}
                </Grid>
            )}

            {loading && (
                <Box mt={2}>
                    <LinearProgress variant="determinate" value={progress} />
                </Box>
            )}
        </Box>
    );
}
