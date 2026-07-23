const Service = require('../models/Service');
const { deleteImage } = require('../utils/cloudinary');

exports.getServices = async (req, res) => {
  try {
    const query = req.query.all ? {} : { isActive: true };
    const services = await Service.find(query).sort({ order: 1, createdAt: -1 });
    res.json({ success: true, data: services });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getService = async (req, res) => {
  try {
    const service = await Service.findOne({ slug: req.params.slug });
    if (!service) return res.status(404).json({ success: false, message: 'Service not found' });
    res.json({ success: true, data: service });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.createService = async (req, res) => {
  try {
    const serviceData = { ...req.body };
    if (req.file) {
      serviceData.image = { url: req.file.path, publicId: req.file.filename };
    }
    const service = await Service.create(serviceData);
    res.status(201).json({ success: true, data: service });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) return res.status(404).json({ success: false, message: 'Service not found' });
    if (req.file) {
      if (service.image?.publicId) await deleteImage(service.image.publicId);
      req.body.image = { url: req.file.path, publicId: req.file.filename };
    }
    const updated = await Service.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.deleteService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) return res.status(404).json({ success: false, message: 'Service not found' });
    if (service.image?.publicId) await deleteImage(service.image.publicId);
    await service.deleteOne();
    res.json({ success: true, message: 'Service deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
