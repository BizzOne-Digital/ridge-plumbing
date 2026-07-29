const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
  transporter.verify((err) => {
    if (err) console.error('Email transporter verification failed:', err);
    else console.log('Email transporter ready — lead notifications enabled');
  });
}

exports.sendLeadNotification = async (lead) => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.warn('EMAIL_USER/EMAIL_PASS not set — skipping lead notification email');
    return;
  }

  const to = process.env.NOTIFY_EMAIL || process.env.EMAIL_USER;

  try {
    await transporter.sendMail({
      from: `"Ridge Plumbing Website" <${process.env.EMAIL_USER}>`,
      to,
      subject: `New Lead: ${lead.name} (${lead.service})`,
      html: `
        <h2>New lead received from the website</h2>
        <p><strong>Name:</strong> ${lead.name}</p>
        <p><strong>Email:</strong> ${lead.email}</p>
        <p><strong>Phone:</strong> ${lead.phone}</p>
        <p><strong>Service:</strong> ${lead.service}</p>
        <p><strong>Message:</strong> ${lead.message || '-'}</p>
        <p><strong>Source:</strong> ${lead.source}</p>
      `
    });
    console.log(`Lead notification email sent to ${to} for lead ${lead._id}`);
  } catch (err) {
    console.error(`Failed to send lead notification email for lead ${lead._id}:`, err);
  }
};
