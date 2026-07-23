const Testimonial = require('../models/Testimonial');
const { deleteImage } = require('../utils/cloudinary');

exports.getTestimonials = async (req, res) => {
  try {
    const query = req.query.all ? {} : { isActive: true };
    const testimonials = await Testimonial.find(query).sort({ order: 1, createdAt: -1 });
    res.json({ success: true, data: testimonials });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.submitTestimonial = async (req, res) => {
  try {
    const { name, location, rating, review, service } = req.body;
    if (!name || !review) return res.status(400).json({ success: false, message: 'Name and review are required.' });
    const testimonial = await Testimonial.create({
      name, location, service,
      rating: rating || 5,
      review,
      isActive: false,
      isFeatured: false
    });
    res.status(201).json({ success: true, data: testimonial, message: 'Thank you! Your review has been submitted and is awaiting approval.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.createTestimonial = async (req, res) => {
  try {
    const data = { ...req.body };
    if (req.file) data.avatar = { url: req.file.path, publicId: req.file.filename };
    const testimonial = await Testimonial.create(data);
    res.status(201).json({ success: true, data: testimonial });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateTestimonial = async (req, res) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);
    if (!testimonial) return res.status(404).json({ success: false, message: 'Not found' });
    if (req.file) {
      if (testimonial.avatar?.publicId) await deleteImage(testimonial.avatar.publicId);
      req.body.avatar = { url: req.file.path, publicId: req.file.filename };
    }
    const updated = await Testimonial.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.deleteTestimonial = async (req, res) => {
  try {
    const t = await Testimonial.findById(req.params.id);
    if (!t) return res.status(404).json({ success: false, message: 'Not found' });
    if (t.avatar?.publicId) await deleteImage(t.avatar.publicId);
    await t.deleteOne();
    res.json({ success: true, message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
