import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import fs from 'fs';
import { exec } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';
import helmet from 'helmet';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import { authLimiter, apiLimiter } from './middleware/rateLimiter.js';
import { errorHandler } from './middleware/errorHandler.js';
import { authenticateToken, requireRole } from './middleware/auth.js';
import { startEventReminderScheduler } from './utils/reminderScheduler.js';
import { verifyToken } from './utils/jwt.js';
import { autoGraduateStudents } from './services/graduationService.js';

// Route imports
import authRouter from './routes/auth.js';
import collegesRouter from './routes/colleges.js';
import membersRouter from './routes/members.js';
import preverifiedRouter from './routes/preverified.js';
import eventsRouter from './routes/events.js';
import jobsRouter from './routes/jobs.js';
import surveysRouter from './routes/surveys.js';
import networkingRouter from './routes/networking.js';
import notificationsRouter from './routes/notifications.js';
import blogsRouter from './routes/blogs.js';
import teamsRouter from './routes/teams.js';
import messagesRouter from './routes/messages.js';
import circularsRouter from './routes/circulars.js';
import careerRouter from './routes/career.js';
import complaintsRouter from './routes/complaints.js';
import uploadRouter from './routes/upload.js';
import blocksRouter from './routes/blocks.js';
import emailsRouter from './routes/emails.js';
import mlRouter from './routes/ml.js';

import Member from './models/Member.js';
import College from './models/College.js';
import Job from './models/Job.js';
import Event from './models/Event.js';
import Blog from './models/Blog.js';

dotenv.config();

const app = express();
// Enable trust proxy for Render / reverse proxies to correctly track client IP
app.set('trust proxy', 1);

const httpServer = http.createServer(app);
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/alumniconnect';

// Parse allowed CORS origins from CLIENT_URL and ALLOWED_ORIGIN
const rawAllowedOrigins = [
  ...(process.env.ALLOWED_ORIGIN ? process.env.ALLOWED_ORIGIN.split(',') : []),
  process.env.CLIENT_URL
]
  .filter(Boolean)
  .map(origin => origin.trim().replace(/\/+$/, ''));

const isOriginAllowed = (origin) => {
  if (!origin) return true; // Direct/Server-to-server or same-origin
  if (process.env.NODE_ENV !== 'production') return true;
  if (rawAllowedOrigins.length === 0 || rawAllowedOrigins.includes('*')) return true;
  return rawAllowedOrigins.includes(origin.replace(/\/+$/, ''));
};

// Initialize Socket.io with origin validation
const io = new Server(httpServer, {
  cors: {
    origin: (origin, callback) => {
      if (isOriginAllowed(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`Origin ${origin} not permitted by CORS`));
      }
    },
    credentials: true
  }
});

// Pass io to Express app for route access (e.g. req.app.get('io'))
app.set('io', io);

// Real-time user presence map (userId -> Set of socketIds)
const activeUsers = new Map();

io.on('connection', (socket) => {
  let authenticatedUserId = null;

  // Handle user registration on socket connection
  socket.on('join_user', ({ userId, token }) => {
    if (token) {
      const decoded = verifyToken(token);
      if (decoded && decoded.id === userId) {
        authenticatedUserId = userId;
      }
    } else if (userId) {
      authenticatedUserId = userId;
    }

    if (authenticatedUserId) {
      socket.join(`user:${authenticatedUserId}`);
      
      if (!activeUsers.has(authenticatedUserId)) {
        activeUsers.set(authenticatedUserId, new Set());
      }
      activeUsers.get(authenticatedUserId).add(socket.id);

      // Broadcast user online status
      io.emit('user_presence_change', {
        userId: authenticatedUserId,
        status: 'online',
        onlineUsers: Array.from(activeUsers.keys())
      });
    }
  });

  // Handle real-time direct message dispatch
  socket.on('send_direct_message', (data) => {
    const { from, to, message } = data;
    if (to) {
      // Send to recipient's private user room
      io.to(`user:${to}`).emit('receive_message', {
        ...data,
        timestamp: new Date().toISOString()
      });
    }
  });

  // Handle typing indicator
  socket.on('typing_start', ({ from, to, userName }) => {
    if (to) {
      io.to(`user:${to}`).emit('user_typing', { from, userName, isTyping: true });
    }
  });

  socket.on('typing_stop', ({ from, to }) => {
    if (to) {
      io.to(`user:${to}`).emit('user_typing', { from, isTyping: false });
    }
  });

  // Handle disconnect
  socket.on('disconnect', () => {
    if (authenticatedUserId && activeUsers.has(authenticatedUserId)) {
      const sockets = activeUsers.get(authenticatedUserId);
      sockets.delete(socket.id);
      if (sockets.size === 0) {
        activeUsers.delete(authenticatedUserId);
        io.emit('user_presence_change', {
          userId: authenticatedUserId,
          status: 'offline',
          onlineUsers: Array.from(activeUsers.keys())
        });
      }
    }
  });
});

// Middleware
app.use(helmet({
  contentSecurityPolicy: false
}));
app.use(compression());
app.use(cookieParser());
app.use(cors({
  origin: (origin, callback) => {
    if (isOriginAllowed(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`Origin ${origin} not permitted by CORS`));
    }
  },
  credentials: true
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Apply rate limiters
app.use('/api', apiLimiter);
app.use('/api/auth', authLimiter);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', authRouter);
app.use('/api/colleges', collegesRouter);
app.use('/api/members', membersRouter);
app.use('/api/preverified', preverifiedRouter);
app.use('/api/events', eventsRouter);
app.use('/api/jobs', jobsRouter);
app.use('/api/surveys', surveysRouter);
app.use('/api/networking', networkingRouter);
app.use('/api/notifications', notificationsRouter);
app.use('/api/blogs', blogsRouter);
app.use('/api/upload', uploadRouter);
app.use('/api/teams', teamsRouter);
app.use('/api/messages', messagesRouter);
app.use('/api/circulars', circularsRouter);
app.use('/api/career', careerRouter);
app.use('/api/complaints', complaintsRouter);
app.use('/api/blocks', blocksRouter);
app.use('/api/emails', emailsRouter);
app.use('/api/ml', mlRouter);

// Public Stats & Real-Time Activity Endpoint for Landing Page (After CORS & security middleware)
app.get('/api/public-stats', async (req, res) => {
  try {
    const [
      alumniCount,
      studentCount,
      collegeCount,
      jobCount,
      eventCount,
      verifiedAlumniCount,
      mentorCount,
      recentJobs,
      recentEvents,
      recentAlumni,
      recentBlogs
    ] = await Promise.all([
      Member.countDocuments({ role: 'alumni' }),
      Member.countDocuments({ role: 'student' }),
      College.countDocuments({}),
      Job.countDocuments({}),
      Event.countDocuments({}),
      Member.countDocuments({ role: 'alumni', isVerified: true }),
      Member.countDocuments({ role: 'alumni', isMentor: true }),
      Job.find().sort({ postedDate: -1 }).limit(3).select('title company type location postedDate'),
      Event.find().sort({ date: 1 }).limit(3).select('title date location organizer type'),
      Member.find({ role: 'alumni' }).sort({ joinedDate: -1 }).limit(3).select('firstName lastName currentRole currentCompany avatarUrl'),
      Blog.find().sort({ publishedDate: -1 }).limit(3).select('title author role category publishedDate')
    ]);

    // Build real live activities from database
    const activities = [];
    
    recentJobs.forEach(job => {
      activities.push({
        icon: '💼',
        text: `New ${job.title} role posted at ${job.company}`,
        time: 'Live Job',
        type: 'job'
      });
    });

    recentEvents.forEach(evt => {
      activities.push({
        icon: '📅',
        text: `Upcoming: "${evt.title}" organized by ${evt.organizer || 'Campus'}`,
        time: 'Active Event',
        type: 'event'
      });
    });

    recentAlumni.forEach(alum => {
      activities.push({
        icon: '🎓',
        text: `${alum.firstName} ${alum.lastName} (${alum.currentRole || 'Alumni'} at ${alum.currentCompany || 'Network'}) connected`,
        time: 'Verified Alumni',
        type: 'alumni'
      });
    });

    recentBlogs.forEach(blog => {
      const authorName = typeof blog.author === 'object' && blog.author?.name ? blog.author.name : (blog.author || 'Alumni Contributor');
      activities.push({
        icon: '📄',
        text: `"${blog.title}" published by ${authorName}`,
        time: 'Success Story',
        type: 'blog'
      });
    });

    res.json({
      alumni: alumniCount || 0,
      students: studentCount || 0,
      colleges: collegeCount || 0,
      jobs: jobCount || 0,
      events: eventCount || 0,
      verifiedAlumni: verifiedAlumniCount || alumniCount || 0,
      mentors: mentorCount || Math.max(1, Math.round((alumniCount || 1) * 0.4)),
      recentAlumniPreview: recentAlumni.map(a => ({
        name: `${a.firstName} ${a.lastName}`,
        initials: `${a.firstName?.[0] || ''}${a.lastName?.[0] || ''}`,
        role: a.currentRole,
        company: a.currentCompany,
        avatarUrl: a.avatarUrl
      })),
      activities: activities.length > 0 ? activities : [
        { icon: '🎓', text: 'Live institutional database connected and verified', time: 'Active' }
      ]
    });
  } catch (err) {
    console.error('Failed to fetch public stats:', err);
    res.status(500).json({ message: err.message });
  }
});

// Database reset endpoint (Guarded with Admin Authentication)
app.post('/api/dev/reset', authenticateToken, requireRole(['college_admin']), (req, res) => {
  const seedScriptPath = path.join(__dirname, 'seed.js');
  exec(`node "${seedScriptPath}"`, (error, stdout, _stderr) => {
    if (error) {
      console.error(`Error executing seed script: ${error}`);
      return res.status(500).json({ message: `Database reset failed: ${error.message}` });
    }
    console.log(`Seed script output: ${stdout}`);
    res.json({ message: 'Database reset successfully completed!' });
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected',
    realtime: 'Active'
  });
});

// Explicit 404 for unmatched API routes (prevents returning SPA index.html for missing API endpoints)
app.all('/api/*', (req, res) => {
  res.status(404).json({ message: `API endpoint ${req.method} ${req.originalUrl} not found.` });
});

// Serving static assets in production (SPA fallback)
if (process.env.NODE_ENV === 'production') {
  const distPath = path.join(__dirname, '../dist');
  if (fs.existsSync(distPath)) {
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }
}

// Error handling middleware
app.use(errorHandler);

// Environment validation
if (!process.env.MONGODB_URI && process.env.NODE_ENV === 'production') {
  console.error('CRITICAL ERROR: MONGODB_URI is required in production environment!');
  process.exit(1);
}

// Graceful shutdown handling
let isShuttingDown = false;
const gracefulShutdown = async (signal) => {
  if (isShuttingDown) return;
  isShuttingDown = true;
  console.log(`\nReceived ${signal}. Initiating graceful shutdown...`);

  httpServer.close(async () => {
    console.log('HTTP and WebSocket server closed.');
    try {
      if (mongoose.connection.readyState === 1) {
        await mongoose.connection.close();
        console.log('MongoDB connection closed successfully.');
      }
    } catch (err) {
      console.error('Error closing MongoDB connection:', err);
    }
    process.exit(0);
  });

  setTimeout(() => {
    console.error('Forced shutdown due to timeout.');
    process.exit(1);
  }, 10000).unref();
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Start Server
if (process.env.NODE_ENV !== 'test') {
  mongoose.connect(MONGODB_URI, {
    serverSelectionTimeoutMS: 5000
  })
    .then(async () => {
      console.log('Successfully connected to MongoDB.');
      startEventReminderScheduler();
      
      // Auto-graduate eligible students on startup
      await autoGraduateStudents().catch(err => console.error('Error in initial auto-graduation:', err));
      
      // Periodic auto-graduation check (every 1 hour)
      setInterval(() => {
        autoGraduateStudents().catch(err => console.error('Error in periodic auto-graduation:', err));
      }, 60 * 60 * 1000);

      httpServer.listen(PORT, '0.0.0.0', () => {
        console.log(`Server and WebSockets are running on port ${PORT}`);
      });
    })
    .catch((err) => {
      console.error('Failed to connect to MongoDB:', err);
      process.exit(1);
    });
}

export { app, httpServer, io };
