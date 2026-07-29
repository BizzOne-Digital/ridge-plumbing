const mongoose = require('mongoose');

const LeadSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true, lowercase: true },
  phone: { type: String, required: true, trim: true },
  service: {
    type: String,
    enum: ['service-plumbing', 'installs', 'hot-water-tank', 'emergency', 'other'],
    default: 'other'
  },
  message: { type: String, trim: true },
  status: {
    type: String,
    enum: ['new', 'contacted', 'quoted', 'won', 'lost'],
    default: 'new'
  },
  notes: { type: String, trim: true },
  source: { type: String, default: 'website' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

LeadSchema.pre('save', function () {
  this.updatedAt = Date.now();
});

module.exports = mongoose.model('Lead', LeadSchema);
