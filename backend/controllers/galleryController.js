const Gallery = require('../models/Gallery');
const { deleteImage } = require('../utils/cloudinary');

exports.getGallery = async (req, res) => {
  try {
    const query = req.query.all ? {} : { isActive: true };
    if (req.query.category) query.category = req.query.category;
    const items = await Gallery.find(query).sort({ order: 1, createdAt: -1 });
    res.json({ success: true, data: items });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.uploadImage = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'No image uploaded' });
    const item = await Gallery.create({
      title: req.body.title || '',
      category: req.body.category || 'other',
      image: { url: req.file.path, publicId: req.file.filename }
    });
    res.status(201).json({ success: true, data: item });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.deleteImage = async (req, res) => {
  try {
    const item = await Gallery.findById(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: 'Not found' });
    if (item.image?.publicId) await deleteImage(item.image.publicId);
    await item.deleteOne();
    res.json({ success: true, message: 'Image deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
