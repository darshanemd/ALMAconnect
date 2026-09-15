import express from 'express';
import Message from '../models/Message.js';
import Notification from '../models/Notification.js';
import Member from '../models/Member.js';
import Block from '../models/Block.js';

const router = express.Router();

// GET messages between current user and target user
router.get('/:otherUserId', async (req, res) => {
  const { currentUserId } = req.query;
  const { otherUserId } = req.params;

  try {
    const messages = await Message.find({
      $or: [
        { from: currentUserId, to: otherUserId },
        { from: otherUserId, to: currentUserId }
      ]
    }).sort({ timestamp: 1 });
    
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST send a direct message
router.post('/', async (req, res) => {
  const { from, to, text, image } = req.body;

  try {
    // Check if either user blocked the other
    const existingBlock = await Block.findOne({
      $or: [
        { blockerId: from, blockedId: to },
        { blockerId: to, blockedId: from }
      ]
    });

    if (existingBlock) {
      return res.status(403).json({ message: 'Messaging is disabled because a block is active between these users.' });
    }

    const newMsg = new Message({
      id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      from,
      to,
      text: text || (image ? '📷 Photo' : ' '),
      image: image || null,
      timestamp: new Date()
    });

    const saved = await newMsg.save();

    // Create notification for recipient if allowed by their preferences
    try {
      const recipient = await Member.findOne({ id: to });
      const allowDirectMessages = recipient?.notifications?.directMessages !== false;

      if (allowDirectMessages) {
        const sender = await Member.findOne({ id: from });
        const senderName = sender ? `${sender.firstName} ${sender.lastName}`.trim() : 'A user';
        const msgSnippet = image ? '📷 Sent a photo' : (text && text.length > 40 ? text.substring(0, 40) + '...' : text);
        
        const msgNotif = new Notification({
          id: `notif-msg-${Date.now()}`,
          title: '💬 New Direct Message',
          content: `${senderName}: "${msgSnippet}"`,
          message: `${senderName}: "${msgSnippet}"`,
          userId: to,
          link: '/network',
          type: 'message',
          date: new Date(),
          read: false
        });
        await msgNotif.save();
      }
    } catch (notifErr) {
      console.error('Failed to create message notification:', notifErr);
    }

    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

export default router;
