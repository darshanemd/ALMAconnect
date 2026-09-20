import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { v2 as cloudinary } from 'cloudinary';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Configure Cloudinary if credentials are provided in environment
if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  });
}

// Ensure uploads folder exists (for temporary staging or local storage)
const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Multer Storage Configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname).toLowerCase() || '.bin';
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `media-${uniqueSuffix}${ext}`);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 100 * 1024 * 1024 } // Up to 100MB
});

// Single media file upload (image, video, or PDF)
router.post('/', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    let fileUrl = `/uploads/${req.file.filename}`;
    const mimeType = req.file.mimetype || '';
    const isVideo = mimeType.startsWith('video/') || req.file.filename.match(/\.(mp4|webm|mov|ogg)$/i);
    const isPdf = req.file.filename.match(/\.pdf$/i) || mimeType === 'application/pdf';
    const isDocOrZip = req.file.filename.match(/\.(doc|docx|zip)$/i);

    // If Cloudinary is configured, upload to Cloudinary for permanent CDN storage
    if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET) {
      try {
        // Uploading PDFs as 'auto' or 'image' allows Cloudinary to treat them as documents/images,
        // which avoids the strict raw ACL delivery restrictions and enables instant browser viewing
        const resourceType = isVideo ? 'video' : (isDocOrZip ? 'raw' : (isPdf ? 'image' : 'auto'));
        const uploadResult = await cloudinary.uploader.upload(req.file.path, {
          folder: 'almaconnect',
          resource_type: resourceType,
          access_mode: 'public',
          type: 'upload',
          use_filename: true,
          unique_filename: true
        });

        if (uploadResult && uploadResult.secure_url) {
          fileUrl = uploadResult.secure_url;
          // Clean up local temporary file
          fs.unlink(req.file.path, () => {});
        }
      } catch (cloudErr) {
        console.warn('Cloudinary upload warning (falling back to local storage):', cloudErr.message);
      }
    }

    return res.status(201).json({
      success: true,
      url: fileUrl,
      fileName: req.file.filename,
      originalName: req.file.originalname,
      size: req.file.size,
      mediaType: isVideo ? 'video' : 'image'
    });
  } catch (error) {
    console.error('File upload error:', error);
    return res.status(500).json({ error: 'Failed to upload media file' });
  }
});

// GET /api/upload/pdf-proxy?url=...
// Streams PDF documents, automatically signing Cloudinary raw requests if possible, or gracefully redirecting
router.get('/pdf-proxy', async (req, res) => {
  const { url } = req.query;
  if (!url) return res.status(400).send('Missing url parameter');

  try {
    let fetchUrl = url;

    // If it is a Cloudinary raw upload, attempt signed delivery URL using API credentials
    if (url.includes('cloudinary.com') && url.includes('/raw/upload/') && process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET) {
      try {
        const match = url.match(/\/raw\/upload\/(?:v\d+\/)?(.+)$/);
        if (match && match[1]) {
          const publicIdWithExt = match[1];
          fetchUrl = cloudinary.utils.url(publicIdWithExt, {
            resource_type: 'raw',
            sign_url: true,
            secure: true
          });
        }
      } catch (signErr) {
        console.warn('Could not generate signed Cloudinary download URL:', signErr);
      }
    }

    let response = await fetch(fetchUrl);
    
    // If signed URL failed or returned non-200, try direct URL
    if (!response.ok && fetchUrl !== url) {
      response = await fetch(url);
    }

    if (!response.ok) {
      // If Cloudinary or storage still restricts delivery (e.g. ACL 401/404), redirect directly to original URL
      console.warn(`Upstream storage returned ${response.status} for ${url}, redirecting client`);
      return res.redirect(url);
    }

    const contentType = response.headers.get('content-type') || 'application/pdf';
    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Disposition', 'inline');
    const arrayBuffer = await response.arrayBuffer();
    return res.send(Buffer.from(arrayBuffer));
  } catch (err) {
    console.error('PDF proxy streaming error:', err);
    // On unexpected error, redirect to original target rather than breaking with raw JSON
    return res.redirect(url);
  }
});

export default router;
