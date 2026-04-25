const express = require('express');
const router = express.Router();
const Assignment = require('../models/Assignment');

// CREATE — POST /api/assignments
router.post('/', async (req, res) => {
  try {
    const { projectId, bidId, freelancerName, clientName } = req.body;
    if (!projectId || !bidId || !freelancerName || !clientName) {
      return res.status(400).json({ error: 'All fields are required: projectId, bidId, freelancerName, clientName' });
    }
    const assignment = new Assignment({ projectId, bidId, freelancerName, clientName, ...req.body });
    const saved = await assignment.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// READ ALL — GET /api/assignments (optional ?projectId= filter)
router.get('/', async (req, res) => {
  try {
    const filter = {};
    if (req.query.projectId) filter.projectId = req.query.projectId;
    const assignments = await Assignment.find(filter).sort({ createdAt: -1 });
    res.json(assignments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// READ ONE — GET /api/assignments/:id
router.get('/:id', async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id);
    if (!assignment) return res.status(404).json({ error: 'Assignment not found' });
    res.json(assignment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE — PUT /api/assignments/:id
router.put('/:id', async (req, res) => {
  try {
    const validStages = ['NotStarted', 'InProgress', 'UnderReview', 'Completed'];
    if (req.body.currentStage && !validStages.includes(req.body.currentStage)) {
      return res.status(400).json({ error: 'Invalid stage value' });
    }
    const assignment = await Assignment.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!assignment) return res.status(404).json({ error: 'Assignment not found' });
    res.json(assignment);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
