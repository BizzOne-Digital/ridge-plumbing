const SiteSettings = require('../models/SiteSettings');
const { deleteImage } = require('../utils/cloudinary');

exports.getSettings = async (req, res) => {
  try {
    let settings = await SiteSettings.findOne();
    if (!settings) settings = await SiteSettings.create({});
    res.json({ success: true, data: settings });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateSettings = async (req, res) => {
  try {
    let settings = await SiteSettings.findOne();
    if (!settings) settings = new SiteSettings();
    if (req.file) {
      if (settings.logo?.publicId) await deleteImage(settings.logo.publicId);
      req.body.logo = { url: req.file.path, publicId: req.file.filename };
    }
    Object.assign(settings, req.body);
    await settings.save();
    res.json({ success: true, data: settings });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
