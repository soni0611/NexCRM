const mongoose = require('mongoose');

const bidSchema = new mongoose.Schema({
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  freelancerName: { type: String, required: true, trim: true },
  amount: { type: Number, required: true, min: 0 },
  timeline: { type: Number, required: true, min: 1 },
  proposal: { type: String, required: true, trim: true },
  status: {
    type: String,
    enum: ['Pending', 'Accepted', 'Rejected'],
    default: 'Pending'
  }
}, { timestamps: true });

module.exports = mongoose.model('Bid', bidSchema);
