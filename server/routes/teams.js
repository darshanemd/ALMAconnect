import express from 'express';
import Team from '../models/Team.js';
import Notification from '../models/Notification.js';

const router = express.Router();

// GET all teams for an event
router.get('/', async (req, res) => {
  const { eventId } = req.query;
  try {
    const filter = eventId ? { eventId } : {};
    const teams = await Team.find(filter);
    res.json(teams);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST create a new team
router.post('/', async (req, res) => {
  const { eventId, name, description, creatorId, creatorName, creatorRole, openRoles } = req.body;
  try {
    const exists = await Team.findOne({ eventId, name: name.trim() });
    if (exists) {
      return res.status(400).json({ message: 'A team with this name already exists for this event' });
    }

    const newTeam = new Team({
      id: `team-${Date.now()}`,
      eventId,
      name: name.trim(),
      description,
      creatorId,
      creatorName,
      members: [{ userId: creatorId, userName: creatorName, userRole: creatorRole }],
      openRoles: openRoles || []
    });

    const saved = await newTeam.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT join a team
router.put('/:id/join', async (req, res) => {
  const { userId, userName, userRole } = req.body;
  try {
    const team = await Team.findOne({ id: req.params.id });
    if (!team) return res.status(404).json({ message: 'Team not found' });

    // Check if user is already in the team
    const isMember = team.members.some(m => m.userId === userId);
    if (isMember) {
      return res.status(400).json({ message: 'You are already a member of this team' });
    }

    // Check if user is in any other team for this event (participants only, advisors can advise multiple)
    if (userRole !== 'Alumni Advisor' && userRole !== 'Advisor') {
      const otherTeam = await Team.findOne({ eventId: team.eventId, 'members.userId': userId });
      if (otherTeam) {
        return res.status(400).json({ message: `You are already registered in team '${otherTeam.name}' for this event` });
      }
    }

    team.members.push({ userId, userName, userRole });
    const saved = await team.save();

    // Create notification for team creator
    try {
      if (team.creatorId && team.creatorId !== userId) {
        const teamNotif = new Notification({
          id: `notif-team-${Date.now()}`,
          title: '👥 New Team Member',
          content: `${userName} (${userRole}) has joined your team "${team.name}".`,
          message: `${userName} (${userRole}) has joined your team "${team.name}".`,
          userId: team.creatorId,
          link: '/events',
          type: 'team',
          date: new Date(),
          read: false
        });
        await teamNotif.save();
      }
    } catch (notifErr) {
      console.error('Failed to create team join notification:', notifErr);
    }

    res.json(saved);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT leave a team
router.put('/:id/leave', async (req, res) => {
  const { userId } = req.body;
  try {
    const team = await Team.findOne({ id: req.params.id });
    if (!team) return res.status(404).json({ message: 'Team not found' });

    team.members = team.members.filter(m => m.userId !== userId);

    if (team.members.length === 0) {
      // If team becomes empty, delete it
      await Team.findOneAndDelete({ id: req.params.id });
      return res.json({ message: 'Team dissolved since all members left', dissolved: true });
    }

    // If creator leaves, assign the next member as creator
    if (team.creatorId === userId && team.members.length > 0) {
      team.creatorId = team.members[0].userId;
      team.creatorName = team.members[0].userName;
    }

    const saved = await team.save();
    res.json(saved);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE delete a team
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Team.findOneAndDelete({ id: req.params.id });
    if (!deleted) return res.status(404).json({ message: 'Team not found' });
    res.json({ message: 'Team deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
