import express from 'express';
import ConnectionRequest from '../models/ConnectionRequest.js';
import Member from '../models/Member.js';
import Notification from '../models/Notification.js';

const router = express.Router();

// GET connection requests for a user
router.get('/', async (req, res) => {
  const { userId } = req.query;
  try {
    const requests = await ConnectionRequest.find({
      $or: [{ from: userId }, { to: userId }]
    });
    res.json(requests);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST send connection request
router.post('/', async (req, res) => {
  const { fromId, toId } = req.body;
  try {
    const newReq = new ConnectionRequest({
      id: `req-${Date.now()}`,
      from: fromId,
      to: toId,
      status: 'pending',
      date: new Date()
    });
    const saved = await newReq.save();

    // Create notification for receiver
    try {
      const sender = await Member.findOne({ id: fromId });
      const receiver = await Member.findOne({ id: toId });
      if (sender && receiver) {
        const newNotif = new Notification({
          id: `notif-conn-${Date.now()}`,
          title: 'Connection Request Received',
          content: `${sender.firstName} ${sender.lastName} wants to connect with you.`,
          message: `${sender.firstName} ${sender.lastName} wants to connect with you.`,
          userId: toId,
          role: receiver.role,
          date: new Date(),
          read: false
        });
        await newNotif.save();
      }
    } catch (notifErr) {
      console.error('Failed to create request notification:', notifErr);
    }

    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT respond to connection request
router.put('/:id', async (req, res) => {
  const { status } = req.body;
  try {
    const request = await ConnectionRequest.findOne({ id: req.params.id });
    if (!request) return res.status(404).json({ message: 'Request not found' });

    request.status = status;
    await request.save();

    if (status === 'accepted') {
      // Add connections to both members
      await Member.findOneAndUpdate(
        { id: request.from },
        { $addToSet: { connections: request.to } }
      );
      await Member.findOneAndUpdate(
        { id: request.to },
        { $addToSet: { connections: request.from } }
      );

      // Create notification for sender
      try {
        const sender = await Member.findOne({ id: request.from });
        const receiver = await Member.findOne({ id: request.to });
        if (sender && receiver) {
          const newNotif = new Notification({
            id: `notif-accept-${Date.now()}`,
            title: 'Connection Request Accepted',
            content: `${receiver.firstName} ${receiver.lastName} accepted your connection request.`,
            message: `${receiver.firstName} ${receiver.lastName} accepted your connection request.`,
            userId: request.from,
            role: sender.role,
            date: new Date(),
            read: false
          });
          await newNotif.save();
        }
      } catch (notifErr) {
        console.error('Failed to create accept notification:', notifErr);
      }
    }

    res.json(request);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
