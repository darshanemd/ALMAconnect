import express from 'express';
import Event from '../models/Event.js';
import Comment from '../models/Comment.js';
import Notification from '../models/Notification.js';

const router = express.Router();

// GET events by type (upcoming or past)
router.get('/', async (req, res) => {
  const { type } = req.query;
  try {
    const events = await Event.find({});
    const now = new Date();

    const filtered = events.filter(event => {
      const isPast = new Date(event.date) < now;
      if (type === 'upcoming') return !isPast;
      if (type === 'past') return isPast;
      return true;
    });

    // Sort by date: upcoming ascending, past descending
    filtered.sort((a, b) => {
      if (type === 'upcoming') {
        return new Date(a.date) - new Date(b.date);
      } else {
        return new Date(b.date) - new Date(a.date);
      }
    });

    res.json(filtered);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST create event
router.post('/', async (req, res) => {
  const { 
    title, description, date, time, location, type, organizer, 
    maxAttendees, fee, collegeId, registrationMode, customQuestions, externalUrl, image 
  } = req.body;

  try {
    const newEvent = new Event({
      id: `event-${Date.now()}`,
      title,
      description,
      date: new Date(date),
      time,
      location,
      type,
      organizer,
      maxAttendees: Number(maxAttendees),
      currentAttendees: 0,
      rsvps: [],
      fee: Number(fee),
      image: image || null,
      registrationMode: registrationMode || '1click',
      customQuestions: Array.isArray(customQuestions) ? customQuestions : [],
      externalUrl: externalUrl || null,
      registrations: []
    });
    const saved = await newEvent.save();

    // Create notifications for college members
    try {
      const eventNotif = new Notification({
        id: `notif-event-${Date.now()}`,
        title: '🎉 New Event Announcement',
        content: `"${title}" has been scheduled for ${new Date(date).toLocaleDateString()}.`,
        message: `"${title}" has been scheduled for ${new Date(date).toLocaleDateString()}.`,
        collegeId: collegeId || '',
        link: '/events',
        type: 'event',
        date: new Date(),
        read: false
      });
      await eventNotif.save();
    } catch (notifErr) {
      console.error('Failed to create event notification:', notifErr);
    }

    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// POST Register for Event with Questionnaire Answers
router.post('/:id/register', async (req, res) => {
  const { 
    userId, userName, userEmail, userRole, rollNumber, department,
    category, entryType, roleOrPosition, teamName, teamMembers,
    guestOption, companyOrRole, degreeOrBatch, experienceLevel, workstationOption,
    answers, sport, track
  } = req.body;

  try {
    const event = await Event.findOne({ id: req.params.id });
    if (!event) return res.status(404).json({ message: 'Event not found' });

    if (event.currentAttendees >= event.maxAttendees && !event.rsvps.includes(userId)) {
      return res.status(400).json({ message: 'Event is fully booked' });
    }

    const selectedCategoryName = category || sport || track || answers?.category || answers?.sport || answers?.track || 'General Entry';

    // Check if already registered
    const existingIndex = event.registrations.findIndex(r => r.userId === userId);
    let previousSports = [];
    let previousCategories = [];

    if (existingIndex >= 0) {
      previousSports = event.registrations[existingIndex].registeredSports || [];
      previousCategories = event.registrations[existingIndex].registeredCategories || [];
    }

    const updatedSports = Array.from(new Set([...previousSports, selectedCategoryName].filter(Boolean)));
    const newCategoryEntry = {
      category: selectedCategoryName,
      entryType: entryType || 'Individual Entry',
      roleOrPosition: roleOrPosition || '',
      teamName: teamName || '',
      teamMembers: teamMembers || [],
      registeredAt: new Date()
    };

    // Filter out previous duplicate entry for same category name if updating
    const filteredCategories = previousCategories.filter(c => (typeof c === 'string' ? c : c.category) !== selectedCategoryName);
    const updatedCategories = [...filteredCategories, newCategoryEntry];

    const regRecord = {
      id: existingIndex >= 0 ? event.registrations[existingIndex].id : `reg-${Date.now()}`,
      userId,
      userName: userName || 'Participant',
      userEmail: userEmail || '',
      userRole: userRole || '',
      rollNumber: rollNumber || '',
      department: department || '',
      category: selectedCategoryName,
      entryType: entryType || 'Individual Entry',
      roleOrPosition: roleOrPosition || '',
      teamName: teamName || '',
      teamMembers: Array.isArray(teamMembers) ? teamMembers : [],
      guestOption: guestOption || '',
      companyOrRole: companyOrRole || '',
      degreeOrBatch: degreeOrBatch || '',
      experienceLevel: experienceLevel || '',
      workstationOption: workstationOption || '',
      answers: answers || {},
      registeredSports: updatedSports,
      registeredCategories: updatedCategories,
      registeredAt: new Date()
    };

    if (existingIndex >= 0) {
      event.registrations[existingIndex] = regRecord;
    } else {
      event.registrations.push(regRecord);
    }

    if (!event.rsvps.includes(userId)) {
      event.rsvps.push(userId);
    }

    event.currentAttendees = event.rsvps.length;
    const saved = await event.save();

    // Create confirmation notification
    try {
      const rsvpNotif = new Notification({
        id: `notif-reg-${Date.now()}`,
        title: '🎟️ Event Registration Confirmed',
        content: `Your registration for "${event.title}" (${selectedCategoryName}) has been submitted successfully.`,
        message: `Your registration for "${event.title}" (${selectedCategoryName}) has been submitted successfully.`,
        userId,
        link: '/events',
        type: 'event',
        date: new Date(),
        read: false
      });
      await rsvpNotif.save();
    } catch (notifErr) {
      console.error('Failed to create registration notification:', notifErr);
    }

    res.json(saved);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT RSVP toggle
router.put('/:id/rsvp', async (req, res) => {
  const { userId } = req.body;
  try {
    const event = await Event.findOne({ id: req.params.id });
    if (!event) return res.status(404).json({ message: 'Event not found' });

    const hasRsvp = event.rsvps.includes(userId);
    let updatedRsvps;

    if (hasRsvp) {
      updatedRsvps = event.rsvps.filter(id => id !== userId);
    } else {
      if (event.currentAttendees >= event.maxAttendees) {
        return res.status(400).json({ message: 'Event is fully booked' });
      }
      updatedRsvps = [...event.rsvps, userId];
    }

    event.rsvps = updatedRsvps;
    event.currentAttendees = updatedRsvps.length;
    const saved = await event.save();

    res.json(saved);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET all comments across events
router.get('/comments', async (req, res) => {
  try {
    const comments = await Comment.find().sort({ timestamp: 1, date: 1 });
    res.json(comments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET comments for an event
router.get('/:id/comments', async (req, res) => {
  try {
    const comments = await Comment.find({ eventId: req.params.id }).sort({ timestamp: 1, date: 1 });
    res.json(comments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST comment on an event
router.post('/:id/comments', async (req, res) => {
  const { authorId, authorName, authorAvatar, role, text, userId, userName, userRole } = req.body;
  const effectiveUserId = authorId || userId || 'anonymous';
  const effectiveUserName = authorName || userName || 'Campus Member';
  const effectiveUserRole = role || userRole || 'student';

  try {
    const newComment = new Comment({
      id: `comment-${Date.now()}`,
      eventId: req.params.id,
      userId: effectiveUserId,
      userName: effectiveUserName,
      userRole: effectiveUserRole,
      authorId: effectiveUserId,
      authorName: effectiveUserName,
      authorAvatar: authorAvatar || null,
      role: effectiveUserRole,
      text,
      date: new Date(),
      timestamp: new Date()
    });
    const saved = await newComment.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT upload problem statement (for hackathons)
router.put('/:id/problem-statement', async (req, res) => {
  const { problemStatementName, problemStatementUrl } = req.body;
  try {
    const event = await Event.findOne({ id: req.params.id });
    if (!event) return res.status(404).json({ message: 'Event not found' });

    event.problemStatementName = problemStatementName;
    event.problemStatementUrl = problemStatementUrl;
    const saved = await event.save();

    res.json(saved);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
