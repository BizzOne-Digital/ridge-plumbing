const Lead = require('../models/Lead');
const { sendLeadNotification } = require('../utils/mailer');

exports.createLead = async (req, res) => {
  try {
    const lead = await Lead.create(req.body);
    res.status(201).json({ success: true, message: 'Your request has been received. We will contact you shortly!', data: lead });
    sendLeadNotification(lead);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getLeads = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const query = status ? { status } : {};
    const total = await Lead.countDocuments(query);
    const leads = await Lead.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));
    res.json({ success: true, total, page: Number(page), pages: Math.ceil(total / limit), data: leads });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getLead = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) return res.status(404).json({ success: false, message: 'Lead not found' });
    res.json({ success: true, data: lead });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateLead = async (req, res) => {
  try {
    const lead = await Lead.findByIdAndUpdate(req.params.id, { ...req.body, updatedAt: Date.now() }, { new: true, runValidators: true });
    if (!lead) return res.status(404).json({ success: false, message: 'Lead not found' });
    res.json({ success: true, data: lead });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.deleteLead = async (req, res) => {
  try {
    const lead = await Lead.findByIdAndDelete(req.params.id);
    if (!lead) return res.status(404).json({ success: false, message: 'Lead not found' });
    res.json({ success: true, message: 'Lead deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getStats = async (req, res) => {
  try {
    const total = await Lead.countDocuments();
    const newLeads = await Lead.countDocuments({ status: 'new' });
    const contacted = await Lead.countDocuments({ status: 'contacted' });
    const won = await Lead.countDocuments({ status: 'won' });
    const lost = await Lead.countDocuments({ status: 'lost' });
    const thisMonth = await Lead.countDocuments({
      createdAt: { $gte: new Date(new Date().setDate(1)) }
    });
    res.json({ success: true, data: { total, new: newLeads, contacted, won, lost, thisMonth } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
