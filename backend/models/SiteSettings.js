const mongoose = require('mongoose');

const SiteSettingsSchema = new mongoose.Schema({
  businessName: { type: String, default: 'Ridge Plumbing' },
  tagline: { type: String, default: "Fraser Valley's Trusted Plumber" },
  phone: { type: String, default: '604-374-2457' },
  email: { type: String, default: 'kylecrawford007@gmail.com' },
  address: { type: String, default: 'Fraser Valley, BC' },
  serviceArea: { type: String, default: 'Fraser Valley, BC' },
  heroHeadline: { type: String, default: "Fraser Valley's Trusted Plumber" },
  heroSubheadline: { type: String, default: 'Service, installs, hot water tanks — done right, on time.' },
  specialOffer: { type: String, default: 'Hot water tank installs from $1,799' },
  showSpecialOffer: { type: Boolean, default: true },
  logo: { url: { type: String }, publicId: { type: String } },
  metaTitle: { type: String, default: 'Ridge Plumbing | Fraser Valley Plumber' },
  metaDescription: { type: String, default: 'Local plumbing company serving the Fraser Valley. Service plumbing, installs, hot water tanks.' },
  socialFacebook: { type: String, default: '' },
  socialInstagram: { type: String, default: '' },
  updatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('SiteSettings', SiteSettingsSchema);
