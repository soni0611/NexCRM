const express = require('express');
const router = express.Router();
const Payment = require('../models/Payment');
const Milestone = require('../models/Milestone');

// CREATE — POST /api/payments
router.post('/', async (req, res) => {
  try {
    const { milestoneId, projectId, amount, initiatedBy } = req.body;
    if (!milestoneId || !projectId || amount === undefined || !initiatedBy) {
      return res.status(400).json({ error: 'All fields are required: milestoneId, projectId, amount, initiatedBy' });
    }
    const payment = new Payment(req.body);
    const saved = await payment.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// READ ALL — GET /api/payments (optional ?projectId= and ?milestoneId= filters)
router.get('/', async (req, res) => {
  try {
    const filter = {};
    if (req.query.projectId) filter.projectId = req.query.projectId;
    if (req.query.milestoneId) filter.milestoneId = req.query.milestoneId;
    const payments = await Payment.find(filter).sort({ createdAt: -1 });
    res.json(payments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// READ ONE — GET /api/payments/:id
router.get('/:id', async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id);
    if (!payment) return res.status(404).json({ error: 'Payment not found' });
    res.json(payment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE — PUT /api/payments/:id
router.put('/:id', async (req, res) => {
  try {
    const payment = await Payment.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!payment) return res.status(404).json({ error: 'Payment not found' });
    res.json(payment);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
