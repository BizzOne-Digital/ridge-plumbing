const mongoose = require('mongoose');

const TestimonialSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  location: { type: String, trim: true },
  rating: { type: Number, min: 1, max: 5, default: 5 },
  review: { type: String, required: true },
  service: { type: String, trim: true },
  avatar: { url: { type: String }, publicId: { type: String } },
  isActive: { type: Boolean, default: true },
  isFeatured: { type: Boolean, default: false },
  order: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Testimonial', TestimonialSchema);
