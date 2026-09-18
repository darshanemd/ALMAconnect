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
    const isPdfOrRaw = req.file.filename.match(/\.(pdf|doc|docx|zip)$/i);

    // If Cloudinary is configured, upload to Cloudinary for permanent CDN storage
    if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET) {
      try {
        const resourceType = isVideo ? 'video' : (isPdfOrRaw ? 'raw' : 'auto');
        const uploadResult = await cloudinary.uploader.upload(req.file.path, {
          folder: 'almaconnect',
          resource_type: resourceType,
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

export default router;
