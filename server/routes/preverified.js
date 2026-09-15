import express from 'express';
import PreVerifiedStudent from '../models/PreVerifiedStudent.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';

const router = express.Router();

// GET pre-verified students by collegeId
router.get('/', async (req, res) => {
  const { collegeId } = req.query;
  try {
    const filter = collegeId ? { collegeId } : {};
    const students = await PreVerifiedStudent.find(filter);
    res.json(students);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST manually pre-verify student (Admin only)
router.post('/', authenticateToken, requireRole(['college_admin']), async (req, res) => {
  const { rollNumber, firstName, lastName, email, department, expectedGraduationYear, degree, collegeId } = req.body;
  try {
    const exists = await PreVerifiedStudent.findOne({ rollNumber: rollNumber.trim() });
    if (exists) {
      return res.status(400).json({ message: 'Student roll number already pre-verified' });
    }

    const newStudent = new PreVerifiedStudent({
      rollNumber: rollNumber.trim(),
      firstName,
      lastName,
      email,
      department,
      expectedGraduationYear: Number(expectedGraduationYear),
      degree,
      collegeId: collegeId || req.user.collegeId
    });

    const saved = await newStudent.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// POST bulk upload pre-verify students (Admin only)
router.post('/bulk', authenticateToken, requireRole(['college_admin']), async (req, res) => {
  try {
    const formatted = req.body.map(s => ({
      ...s,
      rollNumber: s.rollNumber.trim(),
      expectedGraduationYear: Number(s.expectedGraduationYear),
      collegeId: s.collegeId || req.user.collegeId
    }));
    // Filter duplicates before insert (or let Mongo fail, but safe to insert)
    const saved = await PreVerifiedStudent.insertMany(formatted, { ordered: false });
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE pre-verification entry (Admin only)
router.delete('/:rollNumber', authenticateToken, requireRole(['college_admin']), async (req, res) => {
  try {
    const deleted = await PreVerifiedStudent.findOneAndDelete({ rollNumber: req.params.rollNumber });
    if (!deleted) return res.status(404).json({ message: 'Pre-verified student record not found' });
    res.json({ message: 'Pre-verification record deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
