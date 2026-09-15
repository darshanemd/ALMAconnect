import express from 'express';
import Block from '../models/Block.js';

const router = express.Router();

// GET blocks for a user (both who they blocked and who blocked them)
router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const blockedByMe = await Block.find({ blockerId: userId });
    const blockedMe = await Block.find({ blockedId: userId });

    res.json({
      blockedUserIds: blockedByMe.map(b => b.blockedId),
      blockedByUserIds: blockedMe.map(b => b.blockerId)
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST block a user
router.post('/', async (req, res) => {
  const { blockerId, blockedId } = req.body;
  if (!blockerId || !blockedId) {
    return res.status(400).json({ message: 'blockerId and blockedId are required.' });
  }

  try {
    const existing = await Block.findOne({ blockerId, blockedId });
    if (existing) {
      return res.json(existing);
    }

    const newBlock = new Block({
      id: `block-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      blockerId,
      blockedId
    });

    const saved = await newBlock.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE unblock a user
router.delete('/', async (req, res) => {
  const { blockerId, blockedId } = req.body;
  if (!blockerId || !blockedId) {
    return res.status(400).json({ message: 'blockerId and blockedId are required.' });
  }

  try {
    await Block.deleteOne({ blockerId, blockedId });
    res.json({ success: true, message: 'User unblocked' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
