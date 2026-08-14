const { Resend } = require('resend');

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

exports.sendLeadNotification = async (lead) => {
  if (!resend) {
    console.warn('RESEND_API_KEY not set — skipping lead notification email');
    return;
  }

  const to = process.env.NOTIFY_EMAIL;
  if (!to) {
    console.warn('NOTIFY_EMAIL not set — skipping lead notification email');
    return;
  }

  try {
    const { data, error } = await resend.emails.send({
      from: process.env.RESEND_FROM || 'onboarding@resend.dev',
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

    if (error) {
      console.error(`Failed to send lead notification email for lead ${lead._id}:`, error);
      return;
    }

    console.log(`✅ EMAIL SENT SUCCESSFULLY to ${to} for lead ${lead._id} (${lead.name}) — id ${data.id}`);
  } catch (err) {
    console.error(`Failed to send lead notification email for lead ${lead._id}:`, err);
  }
};
