const express = require('express');
const router = express.Router();
const Milestone = require('../models/Milestone');

// CREATE — POST /api/milestones
router.post('/', async (req, res) => {
  try {
    const { projectId, assignmentId, title, dueDate, amount } = req.body;
    if (!projectId || !assignmentId || !title || !dueDate || amount === undefined) {
      return res.status(400).json({ error: 'All fields are required: projectId, assignmentId, title, dueDate, amount' });
    }
    const milestone = new Milestone(req.body);
    const saved = await milestone.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// READ ALL — GET /api/milestones (optional ?projectId= and ?assignmentId= filters)
router.get('/', async (req, res) => {
  try {
    const filter = {};
    if (req.query.projectId) filter.projectId = req.query.projectId;
    if (req.query.assignmentId) filter.assignmentId = req.query.assignmentId;
    const milestones = await Milestone.find(filter).sort({ createdAt: -1 });
    res.json(milestones);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// READ ONE — GET /api/milestones/:id
router.get('/:id', async (req, res) => {
  try {
    const milestone = await Milestone.findById(req.params.id);
    if (!milestone) return res.status(404).json({ error: 'Milestone not found' });
    res.json(milestone);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE — PUT /api/milestones/:id
router.put('/:id', async (req, res) => {
  try {
    const milestone = await Milestone.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!milestone) return res.status(404).json({ error: 'Milestone not found' });
    res.json(milestone);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE — DELETE /api/milestones/:id
router.delete('/:id', async (req, res) => {
  try {
    await Milestone.findByIdAndDelete(req.params.id);
    res.json({ message: 'Milestone deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
