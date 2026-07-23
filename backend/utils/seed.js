require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const SiteSettings = require('../models/SiteSettings');
const Service = require('../models/Service');

const seedData = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('MongoDB connected');

  // Create admin
  const existingAdmin = await User.findOne({ email: 'admin@ridgeplumbing.ca' });
  if (!existingAdmin) {
    await User.create({
      name: 'Kyle Crawford',
      email: 'admin@ridgeplumbing.ca',
      password: 'RidgeAdmin2024!',
      role: 'super_admin'
    });
    console.log('Admin created: admin@ridgeplumbing.ca / RidgeAdmin2024!');
  }

  // Create default settings
  const settings = await SiteSettings.findOne();
  if (!settings) {
    await SiteSettings.create({
      businessName: 'Ridge Plumbing',
      tagline: "Fraser Valley's Trusted Plumber",
      phone: '604-374-2457',
      email: 'kylecrawford007@gmail.com',
      address: 'Fraser Valley, BC',
      serviceArea: 'Fraser Valley, BC',
      heroHeadline: "Fraser Valley's Trusted Plumber",
      heroSubheadline: 'Service, installs, hot water tanks — done right, on time.',
      specialOffer: 'Hot water tank installs from $1,799',
      showSpecialOffer: true
    });
    console.log('Default settings created');
  }

  // Seed services
  const serviceCount = await Service.countDocuments();
  if (serviceCount === 0) {
    await Service.insertMany([
      {
        title: 'Service Plumbing',
        slug: 'service-plumbing',
        shortDescription: 'Fast, reliable repairs for leaks, fixtures, drains, and more.',
        description: 'From dripping faucets to full pipe repairs, our licensed plumbers diagnose and fix plumbing issues efficiently. We serve residential and light commercial properties across the Fraser Valley.',
        icon: 'wrench',
        order: 1,
        isActive: true,
        isFeatured: true
      },
      {
        title: 'Plumbing Installs',
        slug: 'plumbing-installs',
        shortDescription: 'Professional installation of fixtures, appliances, and systems.',
        description: 'Whether you are renovating or building new, we handle all plumbing installations including sinks, toilets, showers, dishwashers, and complete rough-in work.',
        icon: 'tool',
        order: 2,
        isActive: true,
        isFeatured: true
      },
      {
        title: 'Hot Water Tank Replacement',
        slug: 'hot-water-tank',
        shortDescription: 'Same-day hot water tank replacement starting from $1,799.',
        description: 'We supply and install leading hot water tank brands with same-day service available. Our team will remove your old tank and have your new one running fast. Ask about our current special offer.',
        icon: 'droplet',
        order: 3,
        isActive: true,
        isFeatured: true
      }
    ]);
    console.log('Default services seeded');
  }

  console.log('Seeding complete');
  process.exit(0);
};

seedData().catch(err => {
  console.error(err);
  process.exit(1);
});
