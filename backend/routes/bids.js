const express = require('express');
const router = express.Router();
const Bid = require('../models/Bid');
const Project = require('../models/Project');

// CREATE — POST /api/bids
router.post('/', async (req, res) => {
  try {
    const { projectId, freelancerName, amount, timeline, proposal } = req.body;
    if (!projectId || !freelancerName || amount === undefined || !timeline || !proposal) {
      return res.status(400).json({ error: 'All fields are required: projectId, freelancerName, amount, timeline, proposal' });
    }
    const bid = new Bid({ projectId, freelancerName, amount, timeline, proposal });
    const saved = await bid.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// READ ALL — GET /api/bids (optional ?projectId= filter)
router.get('/', async (req, res) => {
  try {
    const filter = {};
    if (req.query.projectId) filter.projectId = req.query.projectId;
    const bids = await Bid.find(filter).sort({ createdAt: -1 });
    res.json(bids);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// READ ONE — GET /api/bids/:id
router.get('/:id', async (req, res) => {
  try {
    const bid = await Bid.findById(req.params.id);
    if (!bid) return res.status(404).json({ error: 'Bid not found' });
    res.json(bid);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ACCEPT — PUT /api/bids/:id/accept
router.put('/:id/accept', async (req, res) => {
  try {
    const bid = await Bid.findById(req.params.id);
    if (!bid) return res.status(404).json({ error: 'Bid not found' });
    bid.status = 'Accepted';
    await bid.save();
    // Reject all other bids for the same project
    await Bid.updateMany(
      { projectId: bid.projectId, _id: { $ne: bid._id } },
      { status: 'Rejected' }
    );
    // Update project status to Assigned
    await Project.findByIdAndUpdate(bid.projectId, { status: 'Assigned' });
    res.json(bid);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// REJECT — PUT /api/bids/:id/reject
router.put('/:id/reject', async (req, res) => {
  try {
    const bid = await Bid.findByIdAndUpdate(req.params.id, { status: 'Rejected' }, { new: true });
    if (!bid) return res.status(404).json({ error: 'Bid not found' });
    res.json(bid);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE — DELETE /api/bids/:id
router.delete('/:id', async (req, res) => {
  try {
    await Bid.findByIdAndDelete(req.params.id);
    res.json({ message: 'Bid deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
