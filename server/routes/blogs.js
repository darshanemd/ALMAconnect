import express from 'express';
import Blog from '../models/Blog.js';
import Notification from '../models/Notification.js';

const router = express.Router();

// Default discussion comments for starter seed blogs
const defaultSeedComments = {
  'blog-1': [
    {
      id: 'comm-1-1',
      userId: 'stud-1',
      userName: 'Rahul Kumar',
      userRole: 'student',
      avatarInitials: 'RK',
      text: 'This is super inspiring Priya! What specific roadmap or resources would you recommend for mastering Dynamic Programming?',
      createdAt: new Date('2026-05-13T11:20:00.000Z')
    },
    {
      id: 'comm-1-2',
      userId: 'alum-2',
      userName: 'Rohan Verma',
      userRole: 'alumni',
      avatarInitials: 'RV',
      text: "Couldn't agree more on building real-world projects. At Microsoft, seeing production-ready portfolio code always stands out during technical interviews.",
      createdAt: new Date('2026-05-13T14:45:00.000Z')
    },
    {
      id: 'comm-1-3',
      userId: 'stud-2',
      userName: 'Sneha Patil',
      userRole: 'student',
      avatarInitials: 'SP',
      text: 'Thank you for the mentorship offer! Just sent you a connection request on AlumniConnect.',
      createdAt: new Date('2026-05-14T09:10:00.000Z')
    },
    {
      id: 'comm-1-4',
      userId: 'alum-3',
      userName: 'Anjali Rao',
      userRole: 'alumni',
      avatarInitials: 'AR',
      text: "Mastering the fundamentals before rushing into frameworks is golden advice. Proud of how far you've come Priya!",
      createdAt: new Date('2026-05-14T16:30:00.000Z')
    }
  ]
};

// GET all blogs
router.get('/', async (req, res) => {
  try {
    const blogs = await Blog.find({});
    // Populate default seed comments if empty
    const normalized = blogs.map(b => {
      const bObj = b.toObject ? b.toObject() : b;
      if ((!bObj.commentsList || bObj.commentsList.length === 0) && defaultSeedComments[bObj.id]) {
        bObj.commentsList = defaultSeedComments[bObj.id];
        bObj.comments = Math.max(bObj.comments || 0, defaultSeedComments[bObj.id].length);
      }
      return bObj;
    });

    // Sort so featured is first, then newest first
    normalized.sort((a, b) => {
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return new Date(b.publishedDate) - new Date(a.publishedDate);
    });
    res.json(normalized);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET single blog
router.get('/:id', async (req, res) => {
  try {
    const blog = await Blog.findOne({ id: req.params.id });
    if (!blog) return res.status(404).json({ message: 'Blog not found' });
    const bObj = blog.toObject ? blog.toObject() : blog;
    if ((!bObj.commentsList || bObj.commentsList.length === 0) && defaultSeedComments[bObj.id]) {
      bObj.commentsList = defaultSeedComments[bObj.id];
      bObj.comments = Math.max(bObj.comments || 0, defaultSeedComments[bObj.id].length);
    }
    res.json(bObj);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST create blog
router.post('/', async (req, res) => {
  try {
    const newBlog = new Blog({
      id: `blog-${Date.now()}`,
      likes: 0,
      comments: 0,
      publishedDate: new Date(),
      featured: false,
      ...req.body
    });
    const saved = await newBlog.save();

    // Create blog notification
    try {
      const blogNotif = new Notification({
        id: `notif-blog-${Date.now()}`,
        title: '📝 New Story Published',
        content: `"${saved.title}" by ${saved.authorName || 'Alumni'}.`,
        message: `"${saved.title}" by ${saved.authorName || 'Alumni'}.`,
        collegeId: saved.collegeId || '',
        link: '/blogs',
        type: 'blog',
        date: new Date(),
        read: false
      });
      await blogNotif.save();
    } catch (notifErr) {
      console.error('Failed to create blog notification:', notifErr);
    }

    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT like / unlike blog (1 like per student/user toggle)
router.put('/:id/like', async (req, res) => {
  try {
    const blog = await Blog.findOne({ id: req.params.id });
    if (!blog) return res.status(404).json({ message: 'Blog not found' });

    const userId = req.body?.userId || req.user?.id || req.body?.userEmail;
    if (!userId) {
      return res.status(400).json({ message: 'User identifier is required to like this story' });
    }

    if (!Array.isArray(blog.likedBy)) {
      blog.likedBy = [];
    }

    const userIdStr = String(userId).trim();
    const existingIndex = blog.likedBy.findIndex(id => String(id).trim() === userIdStr);

    if (existingIndex > -1) {
      // Already liked -> Toggle off (unlike)
      blog.likedBy.splice(existingIndex, 1);
      blog.likes = Math.max(0, (blog.likes || 1) - 1);
    } else {
      // Not yet liked -> Toggle on (like)
      blog.likedBy.push(userIdStr);
      blog.likes = (blog.likes || 0) + 1;
    }

    const saved = await blog.save();
    res.json(saved);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});



// POST comment to blog
router.post('/:id/comments', async (req, res) => {
  try {
    const blog = await Blog.findOne({ id: req.params.id });
    if (!blog) return res.status(404).json({ message: 'Blog not found' });

    const { userId, userName, userRole, avatarInitials, text } = req.body;
    if (!text || !text.trim()) {
      return res.status(400).json({ message: 'Comment text cannot be empty' });
    }

    if (!Array.isArray(blog.commentsList) || blog.commentsList.length === 0) {
      blog.commentsList = defaultSeedComments[blog.id] ? [...defaultSeedComments[blog.id]] : [];
    }

    const newComment = {
      id: `comm-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      userId: userId || 'anonymous',
      userName: userName || 'Community Member',
      userRole: userRole || 'student',
      avatarInitials: avatarInitials || (userName ? userName[0].toUpperCase() : 'U'),
      text: text.trim(),
      createdAt: new Date()
    };

    blog.commentsList.push(newComment);
    blog.comments = blog.commentsList.length;

    const saved = await blog.save();
    res.status(201).json({ comment: newComment, blog: saved });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE comment from blog
router.delete('/:id/comments/:commentId', async (req, res) => {
  try {
    const blog = await Blog.findOne({ id: req.params.id });
    if (!blog) return res.status(404).json({ message: 'Blog not found' });

    if (Array.isArray(blog.commentsList)) {
      blog.commentsList = blog.commentsList.filter(c => c.id !== req.params.commentId);
      blog.comments = blog.commentsList.length;
      const saved = await blog.save();
      return res.json({ message: 'Comment deleted successfully', blog: saved });
    }

    res.json({ message: 'Comment not found', blog });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE blog
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Blog.findOneAndDelete({ id: req.params.id });
    if (!deleted) return res.status(404).json({ message: 'Blog not found' });
    res.json({ message: 'Blog deleted successfully', id: req.params.id });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
