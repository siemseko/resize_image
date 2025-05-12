import { NextRequest, NextResponse } from 'next/server';
import sharp from 'sharp';
import archiver from 'archiver';
import { PassThrough } from 'stream';

export const POST = async (req: NextRequest) => {
  const formData = await req.formData();
  const files = formData.getAll('images') as File[];

  if (!files || files.length === 0) {
    return NextResponse.json({ error: 'No images uploaded' }, { status: 400 });
  }

  const stream = new PassThrough();
  const archive = archiver('zip', { zlib: { level: 9 } });
  archive.pipe(stream);

  for (const file of files) {
    const buffer = Buffer.from(await file.arrayBuffer());

    const resized = await sharp(buffer)
      .resize(1280, 720, { fit: 'fill' })
      .toFormat('jpeg')
      .toBuffer();

    const filename = file.name.replace(/\.[^/.]+$/, '') + '.jpg';
    archive.append(resized, { name: filename });
  }

  await archive.finalize();

  const chunks: Buffer[] = [];
  for await (const chunk of stream) {
    chunks.push(chunk);
  }

  const zipBuffer = Buffer.concat(chunks);

  return new NextResponse(zipBuffer, {
    headers: {
      'Content-Type': 'application/zip',
      'Content-Disposition': 'attachment; filename="resized_images.zip"',
    },
  });
};
