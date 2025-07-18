const mongoose = require('mongoose');
const querySchema = new mongoose.Schema({
  customerName: { type: String, required: true },
  description: { type: String, required: true },
  createdDate: { type: Date, default: Date.now },
  status: { type: String, enum: ['Open', 'InProgress', 'Closed'], default: 'Open' },
  resolution: { type: String },
  notes: [{ content: String, createdAt: { type: Date, default: Date.now } }],
});
module.exports = mongoose.model('Query', querySchema);
