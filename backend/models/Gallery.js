const mongoose = require('mongoose');

const GallerySchema = new mongoose.Schema({
  title: { type: String, trim: true },
  category: {
    type: String,
    enum: ['service', 'install', 'hot-water-tank', 'team', 'other'],
    default: 'other'
  },
  image: {
    url: { type: String, required: true },
    publicId: { type: String }
  },
  isActive: { type: Boolean, default: true },
  order: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Gallery', GallerySchema);
