import mongoose from 'mongoose';

const blogSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  excerpt: { type: String, required: true },
  content: { type: String, required: true },
  author: {
    name: { type: String, required: true },
    role: { type: String, required: true },
    avatarInitials: { type: String, required: true }
  },
  publishedDate: { type: Date, default: Date.now },
  category: { type: String, required: true },
  tags: [{ type: String }],
  likes: { type: Number, default: 0 },
  likedBy: [{ type: String }],
  comments: { type: Number, default: 0 },
  commentsList: [
    {
      id: { type: String, required: true },
      userId: { type: String, required: true },
      userName: { type: String, required: true },
      userRole: { type: String, default: 'student' },
      avatarInitials: { type: String, default: 'U' },
      avatarUrl: { type: String, default: null },
      text: { type: String, required: true },
      createdAt: { type: Date, default: Date.now }
    }
  ],
  image: { type: String, default: null },
  featured: { type: Boolean, default: false }
});

export default mongoose.model('Blog', blogSchema);
