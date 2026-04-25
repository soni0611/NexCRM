const express = require('express');
const router = express.Router();
const StageProgress = require('../models/StageProgress');
const Assignment = require('../models/Assignment');

// CREATE — POST /api/stage-progress
router.post('/', async (req, res) => {
  try {
    const { assignmentId, stage, comment, updatedBy } = req.body;
    if (!assignmentId || !stage || !comment || !updatedBy) {
      return res.status(400).json({ error: 'All fields are required: assignmentId, stage, comment, updatedBy' });
    }
    const entry = new StageProgress({ assignmentId, stage, comment, updatedBy });
    const saved = await entry.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// READ ALL — GET /api/stage-progress (optional ?assignmentId= filter)
router.get('/', async (req, res) => {
  try {
    const filter = {};
    if (req.query.assignmentId) filter.assignmentId = req.query.assignmentId;
    const entries = await StageProgress.find(filter).sort({ createdAt: -1 });
    res.json(entries);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// READ ONE — GET /api/stage-progress/:id
router.get('/:id', async (req, res) => {
  try {
    const entry = await StageProgress.findById(req.params.id);
    if (!entry) return res.status(404).json({ error: 'Stage progress entry not found' });
    res.json(entry);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
